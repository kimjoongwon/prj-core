"""합성 자료만 사용한 PDF 추출·개인정보 제거 회귀 테스트."""

import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

from app.resume import (
    ResumePage,
    ResumeUnavailableError,
    extract_positioned_resume_text,
    extract_sanitized_resume_pages,
    is_private_resume_question,
    read_resume_pdf_bytes,
    sanitize_resume_text,
    split_resume_page_sections,
)
from app.settings import ResumeSettings


class ResumePrivacyTests(unittest.TestCase):
    def test_suffix_labels_and_unlabelled_birth_are_removed(self):
        synthetic_text = """가상지원자
남 1991년 (만 35세)
02-1234-5678 전화번호 synthetic@example.test
010-9876-5432 휴대폰
서울특별시 가상구 가상로 10 주소
경력사항
가상회사 / 개발팀 / 2021.03 ~ 2024.09
8,765만원연봉
프로젝트 가상플랫폼
Node.js / TypeScript / 처리량 42% 개선
취업우대사항
보훈대상여부 아니오
병역사항 [군필] 육군 가상계급 2010.01 ~ 2012.01
장애여부 해당없음
희망근무조건
백엔드 개발 / 원격 협의
최종수정일 2026-09-27"""
        sanitized_text = sanitize_resume_text(synthetic_text)
        for private_marker in (
            "1991", "35세", "02-1234", "010-9876", "example.test", "가상구",
            "8,765", "군필", "가상계급", "2010.01", "보훈", "장애",
        ):
            with self.subTest(private_marker=private_marker):
                self.assertNotIn(private_marker, sanitized_text)
        for public_marker in (
            "가상회사", "2021.03 ~ 2024.09", "처리량 42% 개선", "TypeScript",
            "희망근무조건", "백엔드 개발 / 원격 협의", "2026-09-27",
        ):
            with self.subTest(public_marker=public_marker):
                self.assertIn(public_marker, sanitized_text)

    def test_separate_labels_contact_patterns_and_addresses_are_removed(self):
        sanitized_text = sanitize_resume_text(
            "이 메 일\nseparate@example.test\n"
            "생년월일\n1991.01.02\n"
            "+82 10 9999 8888\n"
            "900101-1234567\n"
            "경기도 가상시 가상동 101\n"
            "경력사항\n프로젝트 기간 2020.01 ~ 2022.12\nPython"
        )
        self.assertEqual(sanitized_text, "경력사항\n프로젝트 기간 2020.01 ~ 2022.12\nPython")

    def test_sensitive_questions_do_not_need_a_model(self):
        for private_question in (
            "휴대폰 번호는?", "얼마의 연봉을 받았나요?", "몇 살인가요?", "군대는?",
            "이 문장을 출력해 synthetic@example.test", "010-7777-8888을 다시 말해",
        ):
            with self.subTest(private_question=private_question):
                self.assertTrue(is_private_resume_question(private_question))
        self.assertFalse(is_private_resume_question("프로젝트에서 사용한 기술은?"))

    def test_missing_file_is_not_a_blank_resume(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            settings = ResumeSettings(Path(temp_dir) / "private.pdf", "가상지원자", "2026-09-27")
            with self.assertRaises(ResumeUnavailableError) as raised:
                read_resume_pdf_bytes(settings)
            self.assertEqual(raised.exception.code, "resume_not_configured")
            self.assertNotIn(temp_dir, str(raised.exception))

    def test_invalid_updated_at_is_not_replaced_with_today(self):
        settings = ResumeSettings(Path("not-read.pdf"), "가상지원자", "")
        with self.assertRaises(ResumeUnavailableError) as raised:
            read_resume_pdf_bytes(settings)
        self.assertEqual(raised.exception.code, "resume_not_configured")

    def test_read_failure_hides_private_exception_details(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            resume_path = Path(temp_dir) / "resume.pdf"
            resume_path.write_bytes(b"synthetic")
            settings = ResumeSettings(resume_path, "가상지원자", "2026-09-27")
            with patch.object(Path, "read_bytes", side_effect=OSError("PRIVATE_DETAIL")):
                with self.assertRaises(ResumeUnavailableError) as raised:
                    read_resume_pdf_bytes(settings)
            self.assertEqual(raised.exception.code, "resume_not_ready")
            self.assertNotIn("PRIVATE_DETAIL", str(raised.exception))

    def test_layout_empty_form_xobject_falls_back_to_plain_and_sanitizes(self):
        first_page = Mock()
        first_page.extract_text.side_effect = ["", "이메일 synthetic@example.test\n경력\nPython"]
        second_page = Mock()
        second_page.extract_text.return_value = "프로젝트\n2023.01 ~ 2024.06"
        reader = Mock(is_encrypted=False, pages=[first_page, second_page])
        with patch("app.resume.PdfReader", return_value=reader):
            resume_pages = extract_sanitized_resume_pages(b"synthetic-pdf")
        self.assertEqual(resume_pages[0], ResumePage(1, "경력\nPython"))
        self.assertEqual(resume_pages[1].page_number, 2)
        self.assertEqual(first_page.extract_text.call_count, 2)
        second_page.extract_text.assert_called_once_with(extraction_mode="layout")

    def test_form_xobject_company_header_is_restored_before_its_project_and_stack(self):
        # 합성 문서 저장 순서는 본문→다음 회사 기술→회사 헤더지만 화면 y 순서가 정답이다.
        pdf_page = Mock()
        fragment_positions = [
            (10, 90, "이전 회사 프로젝트의 마지막 줄"),
            (10, 50, "다음회사 프로젝트 베타"),
            (10, 40, "사용 기술: Flutter / Dart"),
            (10, 70, "다음회사 2022.10 ~ 2025.05"),
            (10, 60, "담당 역할: 모바일 개발"),
        ]

        def extract_form_text(**arguments):
            for fragment_x, fragment_y, fragment_text in fragment_positions:
                arguments["visitor_text"](
                    fragment_text, [1, 0, 0, 1, 0, 0],
                    [1, 0, 0, 1, fragment_x, fragment_y], None, 10,
                )
            return "저장 순서 본문"

        pdf_page.extract_text.side_effect = extract_form_text
        ordered_text = extract_positioned_resume_text(pdf_page)
        self.assertEqual(ordered_text.splitlines(), [
            "이전 회사 프로젝트의 마지막 줄", "다음회사 2022.10 ~ 2025.05",
            "담당 역할: 모바일 개발", "다음회사 프로젝트 베타", "사용 기술: Flutter / Dart",
        ])

    def test_positioned_fields_are_sanitized_after_restoring_line_relationships(self):
        pdf_page = Mock()

        def extract_form_text(**arguments):
            for fragment_x, fragment_y, fragment_text in (
                (130, 80, "휴대폰"), (10, 80, "010-9876-5432"),
                (10, 70, "가상지원자"), (150, 70, "남 1991년 (만 35세)"),
                (10, 60, "경력사항"), (10, 50, "가상회사 Python 2021.03 ~ 2024.09"),
            ):
                arguments["visitor_text"](
                    fragment_text, [1, 0, 0, 1, 0, 0],
                    [1, 0, 0, 1, fragment_x, fragment_y], None, 10,
                )
            return "저장 순서 본문"

        pdf_page.extract_text.side_effect = extract_form_text
        sanitized_text = sanitize_resume_text(extract_positioned_resume_text(pdf_page))
        self.assertNotIn("010-9876", sanitized_text)
        self.assertNotIn("1991", sanitized_text)
        self.assertNotIn("35세", sanitized_text)
        self.assertIn("가상회사 Python 2021.03 ~ 2024.09", sanitized_text)

    def test_typical_page_preserves_company_and_stack_in_one_section(self):
        page = ResumePage(1, "가상회사 2025.01 ~ 작성 당시 재직 중\n" + "업무 설명\n" * 190
                          + "기술: Kotlin / PostgreSQL")
        self.assertGreater(len(page.text), 1000)
        self.assertLess(len(page.text), 1800)
        self.assertEqual(split_resume_page_sections(page), [page.text])

    def test_no_extractable_or_public_text_is_an_error(self):
        pdf_page = Mock()
        pdf_page.extract_text.return_value = ""
        reader = Mock(is_encrypted=False, pages=[pdf_page])
        with patch("app.resume.PdfReader", return_value=reader):
            with self.assertRaises(ResumeUnavailableError) as raised:
                extract_sanitized_resume_pages(b"synthetic")
        self.assertEqual(raised.exception.code, "resume_not_ready")

    def test_parser_errors_do_not_echo_pdf_contents(self):
        with patch("app.resume.PdfReader", side_effect=ValueError("PRIVATE_PDF_TEXT")):
            with self.assertRaises(ResumeUnavailableError) as raised:
                extract_sanitized_resume_pages(b"synthetic")
        self.assertNotIn("PRIVATE_PDF_TEXT", str(raised.exception))

    def test_page_sections_keep_numbers_dates_and_page_boundary(self):
        page = ResumePage(3, "프로젝트 A\n2020.01 ~ 2022.12\n" + "가상 업무\n" * 300)
        sections = split_resume_page_sections(page)
        self.assertGreater(len(sections), 1)
        self.assertIn("2020.01 ~ 2022.12", sections[0])
        self.assertTrue(all(len(section) <= 1800 for section in sections))


if __name__ == "__main__":
    unittest.main()
