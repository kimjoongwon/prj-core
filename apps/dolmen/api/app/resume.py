"""비공개 PDF의 쪽별 추출과 저장·검색 전 개인정보 제거.

원문·개인정보·파일 경로는 오류 메시지나 로그에 포함하지 않는다.
제거 정책을 바꾸면 기존 색인도 다시 생성하도록 SANITIZER_VERSION을 변경한다.
"""

import re
import unicodedata
from dataclasses import dataclass
from datetime import date
from io import BytesIO

from pypdf import PdfReader, mult

from app.settings import ResumeSettings

SANITIZER_VERSION = "resume-privacy-positioned-v2"
MAX_RESUME_FILE_BYTES = 20 * 1024 * 1024
MAX_RESUME_PAGES = 80

# PDF 추출은 라벨이 값 앞/뒤 또는 다음 줄에 올 수 있어 줄 전체를 제외한다.
SENSITIVE_LABEL_PATTERN = re.compile(
    r"전\s*화|휴\s*대\s*(?:폰|전\s*화)|핸\s*드\s*폰|연\s*락\s*처|"
    r"이\s*메\s*일|메\s*일\s*주\s*소|e-?mail|주\s*소|거\s*주\s*지|"
    r"생\s*년(?:\s*월\s*일)?|생\s*일|성\s*별|나\s*이|연\s*봉|급\s*여|"
    r"병\s*역|군\s*필|미\s*필|군\s*복\s*무|취\s*업\s*우\s*대|"
    r"보\s*훈|장\s*애\s*여\s*부|주\s*민\s*등\s*록",
    re.IGNORECASE,
)
SENSITIVE_SECTION_PATTERN = re.compile(
    r"^(?:개\s*인\s*(?:정\s*보|신\s*상)|인\s*적\s*사\s*항|"
    r"취\s*업\s*우\s*대\s*사\s*항|병\s*역\s*사\s*항)\s*[:：]?\s*$"
)
SAFE_SECTION_PATTERN = re.compile(
    r"^(?:희\s*망\s*근\s*무\s*조\s*건|경\s*력|프\s*로\s*젝\s*트|"
    r"학\s*력|보\s*유\s*기\s*술|기\s*술\s*스\s*택|자\s*격|"
    r"교\s*육|자\s*기\s*소\s*개|업\s*무|포\s*트\s*폴\s*리\s*오)"
)
EMAIL_PATTERN = re.compile(r"[\w.+-]+\s*@\s*[\w.-]+\.[A-Za-z]{2,}")
PHONE_PATTERN = re.compile(
    r"(?<!\d)(?:\+?82[\s.-]?)?(?:0?1[016789]|0[2-6]\d?|070)"
    r"[\s).-]*\d{3,4}[\s.-]*\d{4}(?!\d)"
)
RESIDENT_ID_PATTERN = re.compile(r"(?<!\d)\d{6}[ -]?[1-4]\d{6}(?!\d)")
GENDER_BIRTH_PATTERN = re.compile(
    r"(?:(?:남|여)(?:성|자)?\s*[/|,]?\s*)?"
    r"(?:19|20)\d{2}\s*(?:년|[./-])[^\n]*(?:만\s*)?\d{1,3}\s*세"
)
STANDALONE_PERSONAL_PATTERN = re.compile(
    r"^(?:(?:남|여)(?:성|자)?|군필|미필|면제|해당\s*없음|"
    r"[\d,]+\s*만?\s*원)\s*$"
)
ADDRESS_PATTERN = re.compile(
    r"(?:서울(?:특별시|시)?|부산(?:광역시|시)?|대구(?:광역시|시)?|"
    r"인천(?:광역시|시)?|광주(?:광역시|시)?|대전(?:광역시|시)?|"
    r"울산(?:광역시|시)?|세종(?:특별자치시|시)?|경기(?:도)?|강원(?:특별자치도|도)?|"
    r"충청[남북]도|전라[남북]도|전북특별자치도|경상[남북]도|제주(?:특별자치도|도)?)"
    r"\s+[가-힣\d -]+(?:구|동|읍|면|리|로|길|번지)(?:\s|\d|$)"
)


class ResumeUnavailableError(RuntimeError):
    """클라이언트에 공개해도 되는 정해진 오류 코드·안내만 보관한다."""

    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code
        self.message = message


@dataclass(frozen=True)
class ResumePage:
    page_number: int
    text: str


def validate_resume_settings(resume_settings: ResumeSettings) -> None:
    try:
        date.fromisoformat(resume_settings.updated_at)
        if (
            not resume_settings.candidate_name
            or len(resume_settings.candidate_name) > 100
            or "\n" in resume_settings.candidate_name
        ):
            raise ValueError
    except ValueError:
        raise ResumeUnavailableError(
            "resume_not_configured", "이력서의 지원자 이름과 작성 기준일을 서버에 설정해 주세요."
        ) from None


def read_resume_pdf_bytes(resume_settings: ResumeSettings) -> bytes:
    validate_resume_settings(resume_settings)
    try:
        if not resume_settings.path.is_file():
            raise ResumeUnavailableError(
                "resume_not_configured",
                "등록된 이력서가 없습니다. 서버에 이력서 PDF를 등록해 주세요.",
            )
        if resume_settings.path.stat().st_size > MAX_RESUME_FILE_BYTES:
            raise ResumeUnavailableError(
                "resume_not_ready", "등록 이력서의 파일 크기를 확인해 주세요."
            )
        return resume_settings.path.read_bytes()
    except OSError:
        raise ResumeUnavailableError(
            "resume_not_ready", "등록 이력서를 읽을 수 없습니다. 서버 파일을 확인해 주세요."
        ) from None


def sanitize_resume_text(resume_text: str) -> str:
    """연락처·인적사항·연봉·병역/우대 항목을 저장과 모델 입력 전에 제거한다."""
    normalized_text = unicodedata.normalize("NFKC", resume_text)
    sanitized_lines: list[str] = []
    is_sensitive_section = False
    should_skip_next_value = False
    for original_line in normalized_text.splitlines():
        resume_line = original_line.strip()
        if not resume_line:
            sanitized_lines.append("")
            continue
        if SAFE_SECTION_PATTERN.match(resume_line):
            is_sensitive_section = False
            should_skip_next_value = False
        if SENSITIVE_SECTION_PATTERN.match(resume_line):
            is_sensitive_section = True
            continue
        if is_sensitive_section:
            continue
        sensitive_label = SENSITIVE_LABEL_PATTERN.search(resume_line)
        if sensitive_label:
            label_remainder = SENSITIVE_LABEL_PATTERN.sub("", resume_line)
            should_skip_next_value = not label_remainder.strip(" :：|/()[]사항여부")
            continue
        if should_skip_next_value:
            should_skip_next_value = False
            continue
        if (
            EMAIL_PATTERN.search(resume_line)
            or PHONE_PATTERN.search(resume_line)
            or RESIDENT_ID_PATTERN.search(resume_line)
            or GENDER_BIRTH_PATTERN.search(resume_line)
            or STANDALONE_PERSONAL_PATTERN.fullmatch(resume_line)
            or ADDRESS_PATTERN.search(resume_line)
        ):
            continue
        sanitized_lines.append(re.sub(r"[ \t]+", " ", resume_line))
    return re.sub(r"\n{3,}", "\n\n", "\n".join(sanitized_lines)).strip()


def extract_positioned_resume_text(pdf_page) -> str:
    """Form XObject의 저장 순서와 화면 읽기 순서가 다른 경우 좌표로 줄을 복원한다."""
    positioned_fragments: list[tuple[float, float, str]] = []

    def collect_fragment(fragment, user_matrix, text_matrix, font_dictionary, font_size):
        if not fragment.strip():
            return
        transform = mult(text_matrix, user_matrix)
        for line_number, fragment_line in enumerate(fragment.strip().splitlines()):
            if fragment_line.strip():
                positioned_fragments.append((
                    transform[5] - line_number * font_size * 1.2,
                    transform[4],
                    fragment_line.strip(),
                ))

    extracted_text = pdf_page.extract_text(visitor_text=collect_fragment) or ""
    if not positioned_fragments:
        return extracted_text
    ordered_lines: list[list[tuple[float, str]]] = []
    previous_y: float | None = None
    for fragment_y, fragment_x, fragment_text in sorted(
        positioned_fragments, key=lambda fragment: (-fragment[0], fragment[1])
    ):
        # 같은 기준선의 좌/우 필드를 이어 라벨과 값의 관계도 함께 유지한다.
        if previous_y is None or abs(fragment_y - previous_y) > 2:
            ordered_lines.append([])
            previous_y = fragment_y
        ordered_lines[-1].append((fragment_x, fragment_text))
    return "\n".join(
        " ".join(fragment_text for _, fragment_text in sorted(line_fragments))
        for line_fragments in ordered_lines
    )


def extract_sanitized_resume_pages(pdf_bytes: bytes) -> list[ResumePage]:
    """pypdf 페이지별 추출 결과를 즉시 정제하며 원문을 저장하지 않는다."""
    try:
        reader = PdfReader(BytesIO(pdf_bytes))
        if reader.is_encrypted or not 0 < len(reader.pages) <= MAX_RESUME_PAGES:
            raise ValueError
        resume_pages = []
        for page_number, pdf_page in enumerate(reader.pages, start=1):
            extracted_text = pdf_page.extract_text(extraction_mode="layout") or ""
            # Form 텍스트는 layout에서 비어도 기본 visitor로 좌표를 읽을 수 있다.
            if not extracted_text.strip():
                extracted_text = extract_positioned_resume_text(pdf_page)
            page_text = sanitize_resume_text(extracted_text)
            if page_text:
                resume_pages.append(ResumePage(page_number, page_text))
        if not resume_pages:
            raise ValueError
        return resume_pages
    except Exception:
        # 추출 라이브러리 예외에는 PDF 내용이 섞일 수 있으므로 원인을 노출하지 않는다.
        raise ResumeUnavailableError(
            "resume_not_ready",
            "이력서에서 공개 가능한 텍스트를 추출하지 못했습니다. PDF를 확인해 주세요.",
        ) from None


def split_resume_page_sections(resume_page: ResumePage, max_characters: int = 1800) -> list[str]:
    """쪽 경계를 유지하고 문단·줄 경계에서 검색용 절을 나눈다."""
    section_texts: list[str] = []
    current_lines: list[str] = []
    current_length = 0
    for resume_line in resume_page.text.splitlines():
        line_parts = [
            resume_line[i : i + max_characters]
            for i in range(0, len(resume_line), max_characters)
        ] or [""]
        for line_part in line_parts:
            if current_lines and current_length + len(line_part) + 1 > max_characters:
                section_texts.append("\n".join(current_lines).strip())
                current_lines = []
                current_length = 0
            current_lines.append(line_part)
            current_length += len(line_part) + 1
    if current_lines and "\n".join(current_lines).strip():
        section_texts.append("\n".join(current_lines).strip())
    return section_texts


def is_private_resume_question(question: str) -> bool:
    normalized_question = unicodedata.normalize("NFKC", question)
    return bool(
        SENSITIVE_LABEL_PATTERN.search(normalized_question)
        or EMAIL_PATTERN.search(normalized_question)
        or PHONE_PATTERN.search(normalized_question)
        or RESIDENT_ID_PATTERN.search(normalized_question)
        or ADDRESS_PATTERN.search(normalized_question)
        or re.search(r"몇\s*살|남자|여자|군대|집\s*어디", normalized_question)
    )
