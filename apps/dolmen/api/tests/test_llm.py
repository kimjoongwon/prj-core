"""명시적 OpenAI 호환 설정과 SDK 재시도 금지 계약 검증."""

import json
import unittest
from unittest.mock import patch

import httpx
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI

from app.llm import DolmenConfigError, LLMConfig, create_chat_model, read_llm_config


class LLMConfigTests(unittest.TestCase):
    def test_only_llm_environment_names_are_explicitly_mapped(self):
        with patch.dict(
            "os.environ",
            {
                "LLM_API_KEY": "synthetic-key",
                "LLM_MODEL_ID": "synthetic-model",
                "LLM_BASE_URL": "https://synthetic.invalid/v1",
                "OPENAI_API_KEY": "ignored-key",
                "OPENAI_BASE_URL": "https://ignored.invalid/v1",
                "OPENAI_MODEL": "ignored-model",
                "LLM_TEMPERATURE": "1.8",
            },
            clear=True,
        ):
            config = read_llm_config()
            self.assertEqual(
                config,
                LLMConfig("synthetic-key", "synthetic-model", "https://synthetic.invalid/v1"),
            )
            with patch("app.llm.ChatOpenAI") as factory:
                create_chat_model(config)
        factory.assert_called_once_with(
            api_key="synthetic-key",
            model="synthetic-model",
            base_url="https://synthetic.invalid/v1",
            timeout=60.0,
            temperature=0.7,
            max_retries=0,
            stream_usage=True,
            use_responses_api=False,
        )
        self.assertNotIn("synthetic-key", repr(config))
        self.assertNotIn("synthetic.invalid", repr(config))

    def test_request_timeout_preserves_sixty_second_default_and_explicit_override(self):
        environment = {
            "LLM_API_KEY": "synthetic-key",
            "LLM_MODEL_ID": "synthetic-model",
            "LLM_BASE_URL": "https://synthetic.invalid/v1",
        }
        with patch.dict("os.environ", environment, clear=True):
            self.assertEqual(read_llm_config().request_timeout, 60.0)
            with patch.dict("os.environ", {"LLM_TIMEOUT": "20.5"}):
                config = read_llm_config()
                self.assertEqual(config.request_timeout, 20.5)
                with patch("app.llm.ChatOpenAI") as factory:
                    create_chat_model(config)
                self.assertEqual(factory.call_args.kwargs["timeout"], 20.5)

    def test_request_timeout_rejects_nonfinite_nonpositive_or_invalid_values_safely(self):
        for timeout in ("0", "-1", "NaN", "Inf", "-Inf", "PRIVATE_INVALID_TIMEOUT"):
            with self.subTest(timeout=timeout):
                environment = {
                    "LLM_API_KEY": "synthetic-key",
                    "LLM_MODEL_ID": "synthetic-model",
                    "LLM_BASE_URL": "https://synthetic.invalid/v1",
                    "LLM_TIMEOUT": timeout,
                }
                with patch.dict("os.environ", environment, clear=True):
                    with self.assertRaisesRegex(ValueError, "LLM_TIMEOUT은 유한한 양수") as raised:
                        read_llm_config()
                self.assertNotIn("PRIVATE", str(raised.exception))

    def test_google_host_still_uses_native_openai_chat_completions(self):
        config = LLMConfig(
            "synthetic-key",
            "gemini-synthetic",
            "https://generativelanguage.googleapis.com/v1beta/openai/",
        )
        model = create_chat_model(config)
        self.assertIsInstance(model, ChatOpenAI)
        self.assertEqual(config.provider, "openai")
        self.assertEqual(model.max_retries, 0)
        self.assertTrue(model.stream_usage)
        self.assertFalse(model.use_responses_api)
        payload = model._get_request_payload([HumanMessage(content="합성 질문")], max_tokens=128)
        self.assertEqual(payload["messages"], [{"role": "user", "content": "합성 질문"}])
        self.assertEqual(payload["temperature"], 0.7)
        self.assertNotIn("input", payload)
        self.assertNotIn("tools", payload)

    def test_native_openai_sdk_stream_uses_chat_endpoint_and_reports_finish_and_usage(self):
        observed_requests = []
        stream_events = [
            {
                "id": "synthetic",
                "object": "chat.completion.chunk",
                "created": 0,
                "model": "synthetic-model",
                "choices": [
                    {
                        "index": 0,
                        "delta": {"role": "assistant", "content": "합성 답변"},
                        "finish_reason": None,
                    }
                ],
            },
            {
                "id": "synthetic",
                "object": "chat.completion.chunk",
                "created": 0,
                "model": "synthetic-model",
                "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}],
            },
            {
                "id": "synthetic",
                "object": "chat.completion.chunk",
                "created": 0,
                "model": "synthetic-model",
                "choices": [],
                "usage": {"prompt_tokens": 11, "completion_tokens": 3, "total_tokens": 14},
            },
        ]
        sse_payload = (
            "".join(f"data: {json.dumps(event)}\n\n" for event in stream_events)
            + "data: [DONE]\n\n"
        )

        def synthetic_transport(client, request, **kwargs):
            observed_requests.append(request)
            return httpx.Response(
                200,
                headers={"content-type": "text/event-stream"},
                content=sse_payload,
                request=request,
            )

        config = LLMConfig("synthetic-key", "synthetic-model", "https://synthetic.invalid/v1")
        model = create_chat_model(config)
        try:
            with patch.object(httpx.Client, "send", autospec=True, side_effect=synthetic_transport):
                chunks = list(model.stream([HumanMessage(content="합성 질문")], max_tokens=128))
        finally:
            model.root_client.close()
        self.assertEqual(len(observed_requests), 1)
        request = observed_requests[0]
        self.assertEqual(request.url.path, "/v1/chat/completions")
        request_payload = json.loads(request.content)
        self.assertEqual(request_payload["stream_options"], {"include_usage": True})
        self.assertEqual(request_payload["max_completion_tokens"], 128)
        self.assertEqual(request_payload["temperature"], 0.7)
        self.assertNotIn("tools", request_payload)
        self.assertEqual("".join(chunk.text for chunk in chunks), "합성 답변")
        self.assertEqual(
            [
                chunk.response_metadata["finish_reason"]
                for chunk in chunks
                if "finish_reason" in chunk.response_metadata
            ],
            ["stop"],
        )
        self.assertEqual(
            [chunk.usage_metadata for chunk in chunks if chunk.usage_metadata],
            [
                {
                    "input_tokens": 11,
                    "output_tokens": 3,
                    "total_tokens": 14,
                    "input_token_details": {},
                    "output_token_details": {},
                }
            ],
        )

    def test_missing_required_settings_return_only_environment_names(self):
        with patch.dict("os.environ", {"LLM_API_KEY": "synthetic-key"}, clear=True):
            with self.assertRaises(DolmenConfigError) as raised:
                read_llm_config()
        self.assertIn("LLM_MODEL_ID", str(raised.exception))
        self.assertIn("LLM_BASE_URL", str(raised.exception))
        self.assertNotIn("synthetic-key", str(raised.exception))


if __name__ == "__main__":
    unittest.main()
