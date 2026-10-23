"""합성 자료로 실제 입력 구성·예산·선택 이유·진단 실패 격리 검증."""

import copy
import json
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

from fastapi.testclient import TestClient
from hello_agents import SimpleAgent
from hello_agents.core.message import Message

from app.agent import DolmenAgentService
from app.context import build_context, estimate_input_tokens
from app.debug import safe_context_payload
from app.main import create_app
from app.rag import ResumeReplyContext, RetrievedGround
from app.resume import ResumePage
from app.settings import ContextSettings, ResumeSettings, read_context_settings


def ground(text, page=1, chunk_id="synthetic"):
    return RetrievedGround(chunk_id, f"등록 이력서 · {page}쪽", "version", 0.9, text[:220], text)


def events(response):
    return [
        json.loads(line[6:]) for line in response.text.splitlines() if line.startswith("data: ")
    ]


class ContextBuilderTests(unittest.TestCase):
    def setUp(self):
        self.resume_settings = ResumeSettings(Path("private.pdf"), "가상지원자", "2026-09-27")

    def build(self, pages, question="경력 질문", history=(), limit=32768, grounds=None):
        return build_context(
            "합성 시스템 정책",
            question,
            grounds or [ground(pages[0].text)],
            pages,
            self.resume_settings,
            history,
            7,
            ContextSettings(limit, 128),
        )

    def test_small_resume_retains_ordered_companies_and_deduplicates_retrieved_bodies(self):
        pages = [
            ResumePage(1, "가상알파 2025.01\n역할: 서버\n기술: Kotlin"),
            ResumePage(2, "가상베타 2022.01\n역할: 모바일\n기술: Dart"),
        ]
        result = self.build(pages, grounds=[ground(pages[1].text, 2), ground(pages[0].text)])
        payload = json.loads(result.user_prompt)
        self.assertEqual(result.status, "ready")
        self.assertEqual(
            [page["content"] for page in payload["untrusted_resume_pages"]],
            [page.text for page in pages],
        )
        self.assertTrue(all("content" not in hit for hit in payload["untrusted_resume_evidence"]))
        self.assertEqual(len(payload["untrusted_resume_evidence"]), 2)
        self.assertEqual(result.diagnostic["policy"], "full_sanitized_resume")
        self.assertEqual(
            result.diagnostic["stages"][-1]["input_count"]
            - result.diagnostic["stages"][-1]["output_count"],
            2,
        )

    def test_actual_native_message_estimate_is_budgeted_and_output_reserve_is_separate(self):
        pages = [ResumePage(1, "합성 경력")]
        history = [Message("이전 질문", "user"), Message("이전 답변", "assistant")]
        result = self.build(pages, history=history)
        messages = [
            {"role": "system", "content": result.system_prompt},
            *result.history_messages,
            {"role": "user", "content": result.user_prompt},
        ]
        self.assertEqual(
            result.diagnostic["budget"]["estimated_input_tokens"], estimate_input_tokens(messages)
        )
        self.assertLessEqual(estimate_input_tokens(messages), 32768)
        self.assertEqual(result.output_token_reserve, 128)
        self.assertEqual(result.diagnostic["estimator"], "utf8_bytes_upper_bound_v1")

    def test_long_question_is_preserved_and_required_messages_cannot_be_truncated(self):
        question = "긴질문🙂" * 2000
        result = self.build([ResumePage(1, "합성 경력")], question=question, limit=800)
        self.assertEqual(result.status, "budget_exceeded")
        self.assertEqual(json.loads(result.user_prompt)["untrusted_interviewer_question"], question)
        self.assertGreater(result.diagnostic["budget"]["estimated_input_tokens"], 800)
        self.assertEqual(result.diagnostic["budget"]["remaining_input_tokens"], 0)
        self.assertTrue(all(packet["selected"] for packet in result.diagnostic["packets"][:2]))

    def test_ambiguous_large_resume_is_atomic_and_never_prefix_cut(self):
        pages = [
            ResumePage(1, "가상알파\n" + "경력 설명\n" * 500),
            ResumePage(2, "가상베타\n기술 Dart"),
        ]
        result = self.build(pages, limit=1000)
        self.assertEqual(result.status, "budget_exceeded")
        self.assertEqual(result.resume_pages, [])
        self.assertLessEqual(result.diagnostic["budget"]["estimated_input_tokens"], 1000)

    def test_explicit_company_groups_keep_headers_and_exclude_other_group_on_same_page(self):
        alpha = "회사: 가상알파\n기술: Kotlin\n" + "큰 경력 설명\n" * 300
        beta = "회사: 가상베타\n기간: 2020.01 ~ 2021.02\n기술: Dart"
        result = self.build(
            [ResumePage(1, alpha + "\n" + beta)],
            question="가상베타 기술",
            limit=1200,
            grounds=[ground(alpha, chunk_id="alpha"), ground(beta, chunk_id="beta")],
        )
        self.assertEqual(result.status, "ready")
        self.assertEqual(result.resume_pages[0].text, beta)
        self.assertEqual([hit.chunk_id for hit in result.grounds], ["beta"])
        payload = json.loads(result.user_prompt)
        self.assertEqual(
            [hit["chunk_id"] for hit in payload["untrusted_resume_evidence"]], ["beta"]
        )
        self.assertNotIn("Kotlin", result.user_prompt)

    def test_history_whole_turn_limit_deduplication_and_old_resume_removal(self):
        history = []
        for question in ["old", "recent", "recent", "latest"]:
            history.extend(
                [
                    Message(
                        json.dumps(
                            {
                                "untrusted_interviewer_question": question,
                                "untrusted_resume_pages": ["OLD_FULL_RESUME"],
                            }
                        ),
                        "user",
                    ),
                    Message("후속 답변", "assistant"),
                ]
            )
        result = self.build([ResumePage(1, "현재 경력")], history=history)
        questions = [
            json.loads(message["content"])["untrusted_interviewer_question"]
            for message in result.history_messages
            if message["role"] == "user"
        ]
        self.assertEqual(questions, ["recent", "latest"])
        self.assertEqual(
            result.diagnostic["history"],
            {
                "available_turns": 4,
                "selected_turns": 2,
                "dropped_turns": 2,
                "deduplicated_turns": 1,
            },
        )
        self.assertNotIn("OLD_FULL_RESUME", json.dumps(result.history_messages))
        self.assertNotIn("untrusted_interviewer_question", json.dumps(result.diagnostic))

    def test_history_is_dropped_before_full_resume_and_only_as_complete_turns(self):
        pages = [ResumePage(1, "업무 경력")]
        base = self.build(pages)
        history = [Message("오래된 질문" * 300, "user"), Message("오래된 답변" * 300, "assistant")]
        result = self.build(
            pages, history=history, limit=base.diagnostic["budget"]["estimated_input_tokens"] + 10
        )
        self.assertEqual(result.status, "ready")
        self.assertEqual(result.resume_pages, pages)
        self.assertEqual(result.history_messages, [])
        self.assertEqual(result.diagnostic["history"]["dropped_turns"], 1)
        packet = next(
            packet for packet in result.diagnostic["packets"] if packet["kind"] == "history"
        )
        self.assertEqual(packet["reason"], "history_budget")

    def test_diagnostic_allowlist_omits_prompts_and_only_sanitized_resume_snippets(self):
        result = self.build(
            [ResumePage(1, "합성 업무\nemail@example.invalid\n전화번호 010-1234-5678")],
            question="PRIVATE_QUERY_MARKER",
        )
        dirty = copy.deepcopy(result.diagnostic)
        dirty["raw_prompt"] = "PRIVATE_SYSTEM_MARKER"
        dirty["packets"][0]["snippet"] = "PRIVATE_SYSTEM_MARKER"
        safe = safe_context_payload(dirty)
        serialized = json.dumps(safe, ensure_ascii=False)
        for private in (
            "PRIVATE_QUERY_MARKER",
            "PRIVATE_SYSTEM_MARKER",
            "email@example.invalid",
            "010-1234-5678",
        ):
            self.assertNotIn(private, serialized)
        self.assertTrue(all(len(packet.get("snippet", "")) <= 220 for packet in safe["packets"]))
        dirty["packets"][0]["source"] = "/private/path"
        with self.assertRaises(ValueError):
            safe_context_payload(dirty)

    def test_budget_environment_validation(self):
        with patch.dict(
            "os.environ",
            {
                "DOLMEN_CONTEXT_INPUT_TOKEN_LIMIT": "1024",
                "DOLMEN_CONTEXT_OUTPUT_TOKEN_RESERVE": "128",
            },
        ):
            self.assertEqual(read_context_settings(), ContextSettings(1024, 128))
        for bad in ("0", "-1", "not-number"):
            with patch.dict("os.environ", {"DOLMEN_CONTEXT_INPUT_TOKEN_LIMIT": bad}):
                with self.assertRaises(ValueError):
                    read_context_settings()


class ContextIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.env = patch.dict(
            "os.environ",
            {
                "DOLMEN_DEBUG_ENABLED": "true",
                "DOLMEN_CONTEXT_INPUT_TOKEN_LIMIT": "32768",
                "DOLMEN_CONTEXT_OUTPUT_TOKEN_RESERVE": "128",
            },
        )
        self.env.start()
        self.addCleanup(self.env.stop)
        self.settings = ResumeSettings(Path("private.pdf"), "가상지원자", "2026-09-27")
        self.context = ResumeReplyContext(
            [ground("합성회사 Python")], 5, self.settings, [ResumePage(1, "합성회사 Python")]
        )
        self.service = DolmenAgentService(Mock())
        self.client = TestClient(create_app())

    def stream(self):
        return self.service.stream_assistant_reply_events(
            "session",
            "합성회사 기술은?",
            self.context.grounds,
            self.settings,
            5,
            self.context.resume_pages,
        )

    def post(self, message="합성회사 기술은?"):
        with patch("app.routes.chat.dolmen_rag_service") as rag:
            rag.return_value.retrieve_reply_context.return_value = self.context
            with patch("app.routes.chat.dolmen_agent_service", return_value=self.service):
                return self.client.post(
                    "/api/chat", json={"message": message, "session_id": "session"}
                )

    def test_snapshot_precedes_provider_and_cancel_before_provider_releases_session(self):
        with patch("app.agent.SimpleAgent") as factory:
            stream = self.stream()
            snapshot = next(stream)
            self.assertEqual(snapshot.status, "ready")
            factory.return_value.stream_run.assert_not_called()
            stream.close()
            self.assertEqual(self.service._active_sessions, set())
            factory.return_value.stream_run.assert_not_called()

    def test_actual_sdk_messages_match_estimate_and_output_max_tokens(self):
        actual_messages, kwargs_list = [], []

        def reply(agent, prompt, **kwargs):
            actual_messages.append(agent._build_messages(prompt))
            kwargs_list.append(kwargs)
            yield "가상지원자님은 Python을 사용했습니다. (1쪽)"

        with patch.object(SimpleAgent, "stream_run", reply):
            stream = self.stream()
            snapshot = next(stream)
            list(stream)
        self.assertEqual(
            estimate_input_tokens(actual_messages[0]),
            snapshot.diagnostic["budget"]["estimated_input_tokens"],
        )
        self.assertEqual(kwargs_list, [{"max_tokens": 128}])

    def test_budget_failure_blocks_model_and_has_one_error_terminal(self):
        with patch.dict("os.environ", {"DOLMEN_CONTEXT_INPUT_TOKEN_LIMIT": "1024"}):
            with patch("app.agent.SimpleAgent") as factory:
                response = self.post()
        data = events(response)
        snapshot = next(event for event in data if event.get("event") == "context_built")
        self.assertEqual(snapshot["context"]["status"], "budget_exceeded")
        failed = next(event for event in data if event.get("event") == "reply_failed")
        self.assertEqual(failed["details"]["stage"], "context")
        self.assertEqual(failed["details"]["reason"], "context_budget_exceeded")
        self.assertEqual(
            [event["type"] for event in data if event["type"] in {"error", "done"}], ["error"]
        )
        factory.assert_not_called()

    def test_model_context_and_evaluation_are_before_terminal_and_share_uuid(self):
        with patch("app.agent.SimpleAgent") as factory:
            factory.return_value.stream_run.return_value = ["가상지원자님은 Python 사용. (1쪽)"]
            response = self.post()
        data = events(response)
        names = [event.get("event", event["type"]) for event in data]
        self.assertLess(names.index("context_built"), names.index("first_chunk"))
        self.assertLess(names.index("answer_evaluated"), names.index("done"))
        self.assertEqual(names.count("done"), 1)
        self.assertEqual(
            len({event["request_id"] for event in data if event["type"] == "debug"}), 1
        )
        evaluated = next(event for event in data if event.get("event") == "answer_evaluated")
        self.assertEqual(evaluated["details"], {})
        self.assertTrue(
            all(check["status"] == "passed" for check in evaluated["evaluation"]["checks"])
        )

    def test_diagnostic_builder_emit_or_evaluator_failure_never_changes_answer(self):
        for failure in ("context", "evaluation"):
            with self.subTest(failure=failure):
                self.service = DolmenAgentService(Mock())
                target = (
                    "app.debug.safe_context_payload"
                    if failure == "context"
                    else "app.routes.chat.evaluate_answer"
                )
                with patch(target, side_effect=RuntimeError("PRIVATE_DIAGNOSTIC")):
                    with patch("app.agent.SimpleAgent") as factory:
                        factory.return_value.stream_run.return_value = ["가상지원자님 (1쪽)"]
                        response = self.post()
                data = events(response)
                self.assertEqual(data[-1], {"type": "done"})
                self.assertEqual(len([event for event in data if event["type"] == "chunk"]), 1)
                self.assertNotIn("PRIVATE_DIAGNOSTIC", response.text)

    def test_local_guards_skip_context_and_evaluation_and_never_call_model(self):
        with patch("app.agent.SimpleAgent") as factory:
            response = self.post("전화번호는?")
        data = events(response)
        self.assertNotIn("context_built", [event.get("event") for event in data])
        evaluated = next(event for event in data if event.get("event") == "answer_evaluated")
        self.assertEqual(evaluated["evaluation"]["status"], "skipped")
        factory.assert_not_called()

    def test_diagnostics_are_absent_when_debug_disabled(self):
        with patch.dict("os.environ", {"DOLMEN_DEBUG_ENABLED": "false"}):
            with patch("app.agent.SimpleAgent") as factory:
                factory.return_value.stream_run.return_value = ["가상지원자님 (1쪽)"]
                response = self.post()
        self.assertNotIn("debug", [event["type"] for event in events(response)])

    def test_invalid_evaluation_payload_cannot_expose_arbitrary_text(self):
        with patch("app.routes.chat.evaluate_answer", return_value={"raw": "PRIVATE_PROMPT"}):
            with patch("app.agent.SimpleAgent") as factory:
                factory.return_value.stream_run.return_value = ["가상지원자님 (1쪽)"]
                response = self.post()
        self.assertNotIn("PRIVATE_PROMPT", response.text)
        self.assertEqual(events(response)[-1], {"type": "done"})


if __name__ == "__main__":
    unittest.main()
