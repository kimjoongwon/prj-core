import type { LanguageCode } from "../../generated/client/enums";

/**
 * i18n 기준 데이터입니다.
 *
 * 번역 key는 영문 경로나 구현 위치가 아니라 개발자가 화면/로그에서 바로 읽을 수
 * 있는 한국어 의미를 기준으로 둡니다. 같은 용어는 하나의 key를 공유하고,
 * 문맥에 따라 뜻이 달라지는 경우에만 `용어@문맥` 형태로 분리합니다.
 */
export interface TranslationSeedData {
	languageCode: LanguageCode;
	key: string;
	text: string;
	category: string;
	isTranslated: boolean;
}

interface TranslationDefinition {
	key: string;
	category: string;
	texts: Record<LanguageCode, string>;
}

const LANGUAGE_CODES = [
	"ko_KR",
	"en_US",
	"zh_CN",
	"ja_JP",
] as const satisfies readonly LanguageCode[];

const translationDefinitions = [
	// 공통 용어
	defineTranslation("성공", "공통", {
		ko_KR: "성공",
		en_US: "Success",
		zh_CN: "成功",
		ja_JP: "成功",
	}),
	defineTranslation("생성 완료", "공통", {
		ko_KR: "생성 완료",
		en_US: "Created successfully",
		zh_CN: "创建成功",
		ja_JP: "作成完了",
	}),
	defineTranslation("수정 완료", "공통", {
		ko_KR: "수정 완료",
		en_US: "Updated successfully",
		zh_CN: "更新成功",
		ja_JP: "更新完了",
	}),
	defineTranslation("삭제 완료", "공통", {
		ko_KR: "삭제 완료",
		en_US: "Deleted successfully",
		zh_CN: "删除成功",
		ja_JP: "削除完了",
	}),
	defineTranslation("요청한 데이터를 찾을 수 없습니다", "공통", {
		ko_KR: "요청한 데이터를 찾을 수 없습니다",
		en_US: "Requested data not found",
		zh_CN: "未找到请求的数据",
		ja_JP: "リクエストされたデータが見つかりません",
	}),

	// API 응답 메시지
	defineTranslation("목록 조회 성공", "API 응답", {
		ko_KR: "목록 조회 성공",
		en_US: "List retrieved successfully",
		zh_CN: "列表查询成功",
		ja_JP: "リスト取得成功",
	}),
	defineTranslation("조회 성공", "API 응답", {
		ko_KR: "조회 성공",
		en_US: "Retrieved successfully",
		zh_CN: "查询成功",
		ja_JP: "取得成功",
	}),
	defineTranslation("생성 성공", "API 응답", {
		ko_KR: "생성 성공",
		en_US: "Created successfully",
		zh_CN: "创建成功",
		ja_JP: "作成成功",
	}),
	defineTranslation("수정 성공", "API 응답", {
		ko_KR: "수정 성공",
		en_US: "Updated successfully",
		zh_CN: "更新成功",
		ja_JP: "更新成功",
	}),
	defineTranslation("삭제 성공", "API 응답", {
		ko_KR: "삭제 성공",
		en_US: "Deleted successfully",
		zh_CN: "删除成功",
		ja_JP: "削除成功",
	}),
	defineTranslation("로그인 성공", "API 응답", {
		ko_KR: "로그인 성공",
		en_US: "Login successful",
		zh_CN: "登录成功",
		ja_JP: "ログイン成功",
	}),
	defineTranslation("로그아웃 성공", "API 응답", {
		ko_KR: "로그아웃 성공",
		en_US: "Logout successful",
		zh_CN: "登出成功",
		ja_JP: "ログアウト成功",
	}),
	defineTranslation("회원가입 성공", "API 응답", {
		ko_KR: "회원가입 성공",
		en_US: "Registration successful",
		zh_CN: "注册成功",
		ja_JP: "登録成功",
	}),
	defineTranslation("토큰 재발급 성공", "API 응답", {
		ko_KR: "토큰 재발급 성공",
		en_US: "Token refreshed successfully",
		zh_CN: "令牌刷新成功",
		ja_JP: "トークン再発行成功",
	}),
	defineTranslation("토큰 갱신 성공", "API 응답", {
		ko_KR: "토큰 갱신 성공",
		en_US: "Token renewed successfully",
		zh_CN: "令牌更新成功",
		ja_JP: "トークン更新成功",
	}),
	defineTranslation("토큰 유효성 검증 완료", "API 응답", {
		ko_KR: "토큰 유효성 검증 완료",
		en_US: "Token validated successfully",
		zh_CN: "令牌验证成功",
		ja_JP: "トークン検証成功",
	}),
	defineTranslation("회원 목록 조회 성공", "API 응답", {
		ko_KR: "회원 목록 조회 성공",
		en_US: "User list retrieved successfully",
		zh_CN: "会员列表查询成功",
		ja_JP: "会員リスト取得成功",
	}),
	defineTranslation("회원 상세 조회 성공", "API 응답", {
		ko_KR: "회원 상세 조회 성공",
		en_US: "User details retrieved successfully",
		zh_CN: "会员详情查询成功",
		ja_JP: "会員詳細取得成功",
	}),
	defineTranslation("회원 등록 성공", "API 응답", {
		ko_KR: "회원 등록 성공",
		en_US: "User registered successfully",
		zh_CN: "会员注册成功",
		ja_JP: "会員登録成功",
	}),
	defineTranslation("회원 수정 성공", "API 응답", {
		ko_KR: "회원 수정 성공",
		en_US: "User updated successfully",
		zh_CN: "会员更新成功",
		ja_JP: "会員更新成功",
	}),
	defineTranslation("회원 삭제 성공", "API 응답", {
		ko_KR: "회원 삭제 성공",
		en_US: "User deleted successfully",
		zh_CN: "会员删除成功",
		ja_JP: "会員削除成功",
	}),
	defineTranslation("역할 목록 조회 성공", "API 응답", {
		ko_KR: "역할 목록 조회 성공",
		en_US: "Role list retrieved successfully",
		zh_CN: "角色列表查询成功",
		ja_JP: "ロールリスト取得成功",
	}),
	defineTranslation("역할 조회 성공", "API 응답", {
		ko_KR: "역할 조회 성공",
		en_US: "Role retrieved successfully",
		zh_CN: "角色查询成功",
		ja_JP: "ロール取得成功",
	}),
	defineTranslation("역할 생성 성공", "API 응답", {
		ko_KR: "역할 생성 성공",
		en_US: "Role created successfully",
		zh_CN: "角色创建成功",
		ja_JP: "ロール作成成功",
	}),
	defineTranslation("역할 수정 성공", "API 응답", {
		ko_KR: "역할 수정 성공",
		en_US: "Role updated successfully",
		zh_CN: "角色更新成功",
		ja_JP: "ロール更新成功",
	}),
	defineTranslation("역할 삭제 성공", "API 응답", {
		ko_KR: "역할 삭제 성공",
		en_US: "Role deleted successfully",
		zh_CN: "角色删除成功",
		ja_JP: "ロール削除成功",
	}),
	defineTranslation("권한 목록 조회 성공", "API 응답", {
		ko_KR: "권한 목록 조회 성공",
		en_US: "Permission list retrieved successfully",
		zh_CN: "权限列表查询成功",
		ja_JP: "権限リスト取得成功",
	}),
	defineTranslation("내 권한 조회 성공", "API 응답", {
		ko_KR: "내 권한 조회 성공",
		en_US: "My permissions retrieved successfully",
		zh_CN: "我的权限查询成功",
		ja_JP: "自分の権限取得成功",
	}),
	defineTranslation("역할별 권한 조회 성공", "API 응답", {
		ko_KR: "역할별 권한 조회 성공",
		en_US: "Permissions by role retrieved successfully",
		zh_CN: "角色权限查询成功",
		ja_JP: "ロール別権限取得成功",
	}),
	defineTranslation("사용자별 예외 권한 조회 성공", "API 응답", {
		ko_KR: "사용자별 예외 권한 조회 성공",
		en_US: "Exception permissions by user retrieved successfully",
		zh_CN: "用户异常权限查询成功",
		ja_JP: "ユーザー別例外権限取得成功",
	}),
	defineTranslation("권한 조회 성공", "API 응답", {
		ko_KR: "권한 조회 성공",
		en_US: "Permission retrieved successfully",
		zh_CN: "权限查询成功",
		ja_JP: "権限取得成功",
	}),
	defineTranslation("권한 정의 생성 성공", "API 응답", {
		ko_KR: "권한 정의 생성 성공",
		en_US: "Permission definition created successfully",
		zh_CN: "权限定义创建成功",
		ja_JP: "権限定義作成成功",
	}),
	defineTranslation("권한 정의 수정 성공", "API 응답", {
		ko_KR: "권한 정의 수정 성공",
		en_US: "Permission definition updated successfully",
		zh_CN: "权限定义更新成功",
		ja_JP: "権限定義更新成功",
	}),
	defineTranslation("권한 삭제 성공", "API 응답", {
		ko_KR: "권한 삭제 성공",
		en_US: "Permission deleted successfully",
		zh_CN: "权限删除成功",
		ja_JP: "権限削除成功",
	}),
	defineTranslation("액션 목록 조회 성공", "API 응답", {
		ko_KR: "액션 목록 조회 성공",
		en_US: "Action list retrieved successfully",
		zh_CN: "动作列表查询成功",
		ja_JP: "アクションリスト取得成功",
	}),
	defineTranslation("액션 조회 성공", "API 응답", {
		ko_KR: "액션 조회 성공",
		en_US: "Action retrieved successfully",
		zh_CN: "动作查询成功",
		ja_JP: "アクション取得成功",
	}),
	defineTranslation("액션 생성 성공", "API 응답", {
		ko_KR: "액션 생성 성공",
		en_US: "Action created successfully",
		zh_CN: "动作创建成功",
		ja_JP: "アクション作成成功",
	}),
	defineTranslation("액션 수정 성공", "API 응답", {
		ko_KR: "액션 수정 성공",
		en_US: "Action updated successfully",
		zh_CN: "动作更新成功",
		ja_JP: "アクション更新成功",
	}),
	defineTranslation("액션 삭제 성공", "API 응답", {
		ko_KR: "액션 삭제 성공",
		en_US: "Action deleted successfully",
		zh_CN: "动作删除成功",
		ja_JP: "アクション削除成功",
	}),
	defineTranslation("대상 목록 조회 성공", "API 응답", {
		ko_KR: "대상 목록 조회 성공",
		en_US: "Subject list retrieved successfully",
		zh_CN: "对象列表查询成功",
		ja_JP: "対象リスト取得成功",
	}),
	defineTranslation("대상 필드 목록 조회 성공", "API 응답", {
		ko_KR: "대상 필드 목록 조회 성공",
		en_US: "Subject fields retrieved successfully",
		zh_CN: "对象字段列表查询成功",
		ja_JP: "対象フィールドリスト取得成功",
	}),
	defineTranslation("대상 조회 성공", "API 응답", {
		ko_KR: "대상 조회 성공",
		en_US: "Subject retrieved successfully",
		zh_CN: "对象查询成功",
		ja_JP: "対象取得成功",
	}),
	defineTranslation("시설 목록 조회 성공", "API 응답", {
		ko_KR: "시설 목록 조회 성공",
		en_US: "Facility list retrieved successfully",
		zh_CN: "设施列表查询成功",
		ja_JP: "施設リスト取得成功",
	}),
	defineTranslation("내 공간 시설 목록 조회 성공", "API 응답", {
		ko_KR: "내 공간 시설 목록 조회 성공",
		en_US: "My space facility list retrieved successfully",
		zh_CN: "我的空间设施列表查询成功",
		ja_JP: "自分のスペースの施設リスト取得成功",
	}),
	defineTranslation("정책 목록 조회 성공", "API 응답", {
		ko_KR: "정책 목록 조회 성공",
		en_US: "Policy list retrieved successfully",
		zh_CN: "策略列表查询成功",
		ja_JP: "ポリシーリスト取得成功",
	}),
	defineTranslation("정책 조회 성공", "API 응답", {
		ko_KR: "정책 조회 성공",
		en_US: "Policy retrieved successfully",
		zh_CN: "策略查询成功",
		ja_JP: "ポリシー取得成功",
	}),
	defineTranslation("정책 생성 성공", "API 응답", {
		ko_KR: "정책 생성 성공",
		en_US: "Policy created successfully",
		zh_CN: "策略创建成功",
		ja_JP: "ポリシー作成成功",
	}),
	defineTranslation("정책 수정 성공", "API 응답", {
		ko_KR: "정책 수정 성공",
		en_US: "Policy updated successfully",
		zh_CN: "策略更新成功",
		ja_JP: "ポリシー更新成功",
	}),
	defineTranslation("정책 삭제 성공", "API 응답", {
		ko_KR: "정책 삭제 성공",
		en_US: "Policy deleted successfully",
		zh_CN: "策略删除成功",
		ja_JP: "ポリシー削除成功",
	}),
	defineTranslation("정책 권한 동기화 성공", "API 응답", {
		ko_KR: "정책 권한 동기화 성공",
		en_US: "Policy permissions synchronized successfully",
		zh_CN: "策略权限同步成功",
		ja_JP: "ポリシー権限同期成功",
	}),
	defineTranslation("역할 정책 할당 목록 조회 성공", "API 응답", {
		ko_KR: "역할 정책 할당 목록 조회 성공",
		en_US: "Role policy assignments retrieved successfully",
		zh_CN: "角色策略分配列表查询成功",
		ja_JP: "ロールポリシー割り当てリスト取得成功",
	}),
	defineTranslation("역할 정책 할당 동기화 성공", "API 응답", {
		ko_KR: "역할 정책 할당 동기화 성공",
		en_US: "Role policy assignments synchronized successfully",
		zh_CN: "角色策略分配同步成功",
		ja_JP: "ロールポリシー割り当て同期成功",
	}),
	defineTranslation("사용자 정책 할당 목록 조회 성공", "API 응답", {
		ko_KR: "사용자 정책 할당 목록 조회 성공",
		en_US: "User policy assignments retrieved successfully",
		zh_CN: "用户策略分配列表查询成功",
		ja_JP: "ユーザーポリシー割り当てリスト取得成功",
	}),
	defineTranslation("사용자 정책 할당 동기화 성공", "API 응답", {
		ko_KR: "사용자 정책 할당 동기화 성공",
		en_US: "User policy assignments synchronized successfully",
		zh_CN: "用户策略分配同步成功",
		ja_JP: "ユーザーポリシー割り当て同期成功",
	}),
	defineTranslation("타임라인 목록 조회 성공", "API 응답", {
		ko_KR: "타임라인 목록 조회 성공",
		en_US: "Timeline list retrieved successfully",
		zh_CN: "时间线列表查询成功",
		ja_JP: "タイムラインリスト取得成功",
	}),
	defineTranslation("타임라인 조회 성공", "API 응답", {
		ko_KR: "타임라인 조회 성공",
		en_US: "Timeline retrieved successfully",
		zh_CN: "时间线查询成功",
		ja_JP: "タイムライン取得成功",
	}),
	defineTranslation("타임라인 생성 성공", "API 응답", {
		ko_KR: "타임라인 생성 성공",
		en_US: "Timeline created successfully",
		zh_CN: "时间线创建成功",
		ja_JP: "タイムライン作成成功",
	}),
	defineTranslation("타임라인 수정 성공", "API 응답", {
		ko_KR: "타임라인 수정 성공",
		en_US: "Timeline updated successfully",
		zh_CN: "时间线更新成功",
		ja_JP: "タイムライン更新成功",
	}),
	defineTranslation("타임라인 삭제 성공", "API 응답", {
		ko_KR: "타임라인 삭제 성공",
		en_US: "Timeline deleted successfully",
		zh_CN: "时间线删除成功",
		ja_JP: "タイムライン削除成功",
	}),
	defineTranslation("세션 목록 조회 성공", "API 응답", {
		ko_KR: "세션 목록 조회 성공",
		en_US: "Session list retrieved successfully",
		zh_CN: "会话列表查询成功",
		ja_JP: "セッションリスト取得成功",
	}),
	defineTranslation("세션 조회 성공", "API 응답", {
		ko_KR: "세션 조회 성공",
		en_US: "Session retrieved successfully",
		zh_CN: "会话查询成功",
		ja_JP: "セッション取得成功",
	}),
	defineTranslation("세션 생성 성공", "API 응답", {
		ko_KR: "세션 생성 성공",
		en_US: "Session created successfully",
		zh_CN: "会话创建成功",
		ja_JP: "セッション作成成功",
	}),
	defineTranslation("세션 수정 성공", "API 응답", {
		ko_KR: "세션 수정 성공",
		en_US: "Session updated successfully",
		zh_CN: "会话更新成功",
		ja_JP: "セッション更新成功",
	}),
	defineTranslation("세션 삭제 성공", "API 응답", {
		ko_KR: "세션 삭제 성공",
		en_US: "Session deleted successfully",
		zh_CN: "会话删除成功",
		ja_JP: "セッション削除成功",
	}),
	defineTranslation("프로그램 목록 조회 성공", "API 응답", {
		ko_KR: "프로그램 목록 조회 성공",
		en_US: "Program list retrieved successfully",
		zh_CN: "项目列表查询成功",
		ja_JP: "プログラムリスト取得成功",
	}),
	defineTranslation("프로그램 조회 성공", "API 응답", {
		ko_KR: "프로그램 조회 성공",
		en_US: "Program retrieved successfully",
		zh_CN: "项目查询成功",
		ja_JP: "プログラム取得成功",
	}),
	defineTranslation("프로그램 생성 성공", "API 응답", {
		ko_KR: "프로그램 생성 성공",
		en_US: "Program created successfully",
		zh_CN: "项目创建成功",
		ja_JP: "プログラム作成成功",
	}),
	defineTranslation("프로그램 수정 성공", "API 응답", {
		ko_KR: "프로그램 수정 성공",
		en_US: "Program updated successfully",
		zh_CN: "项目更新成功",
		ja_JP: "プログラム更新成功",
	}),
	defineTranslation("프로그램 삭제 성공", "API 응답", {
		ko_KR: "프로그램 삭제 성공",
		en_US: "Program deleted successfully",
		zh_CN: "项目删除成功",
		ja_JP: "プログラム削除成功",
	}),
	defineTranslation("템플릿 목록 조회 성공", "API 응답", {
		ko_KR: "템플릿 목록 조회 성공",
		en_US: "Template list retrieved successfully",
		zh_CN: "模板列表查询成功",
		ja_JP: "テンプレートリスト取得成功",
	}),
	defineTranslation("템플릿 조회 성공", "API 응답", {
		ko_KR: "템플릿 조회 성공",
		en_US: "Template retrieved successfully",
		zh_CN: "模板查询成功",
		ja_JP: "テンプレート取得成功",
	}),
	defineTranslation("템플릿 생성 성공", "API 응답", {
		ko_KR: "템플릿 생성 성공",
		en_US: "Template created successfully",
		zh_CN: "模板创建成功",
		ja_JP: "テンプレート作成成功",
	}),
	defineTranslation("템플릿 수정 성공", "API 응답", {
		ko_KR: "템플릿 수정 성공",
		en_US: "Template updated successfully",
		zh_CN: "模板更新成功",
		ja_JP: "テンプレート更新成功",
	}),
	defineTranslation("템플릿 삭제 성공", "API 응답", {
		ko_KR: "템플릿 삭제 성공",
		en_US: "Template deleted successfully",
		zh_CN: "模板删除成功",
		ja_JP: "テンプレート削除成功",
	}),
	defineTranslation("템플릿 상태 변경 성공", "API 응답", {
		ko_KR: "템플릿 상태 변경 성공",
		en_US: "Template status changed successfully",
		zh_CN: "模板状态变更成功",
		ja_JP: "テンプレート状態変更成功",
	}),
	defineTranslation("템플릿 미리보기 성공", "API 응답", {
		ko_KR: "템플릿 미리보기 성공",
		en_US: "Template preview rendered successfully",
		zh_CN: "模板预览成功",
		ja_JP: "テンプレートプレビュー成功",
	}),
	defineTranslation("테스트 발송 성공", "API 응답", {
		ko_KR: "테스트 발송 성공",
		en_US: "Test message sent successfully",
		zh_CN: "测试发送成功",
		ja_JP: "テスト送信成功",
	}),
	defineTranslation("번역 목록 조회 성공", "API 응답", {
		ko_KR: "번역 목록 조회 성공",
		en_US: "Translation list retrieved successfully",
		zh_CN: "翻译列表查询成功",
		ja_JP: "翻訳リスト取得成功",
	}),
	defineTranslation("번역 등록 성공", "API 응답", {
		ko_KR: "번역 등록 성공",
		en_US: "Translation created successfully",
		zh_CN: "翻译创建成功",
		ja_JP: "翻訳登録成功",
	}),
	defineTranslation("번역 조회 성공", "API 응답", {
		ko_KR: "번역 조회 성공",
		en_US: "Translation retrieved successfully",
		zh_CN: "翻译查询成功",
		ja_JP: "翻訳取得成功",
	}),
	defineTranslation("번역 수정 성공", "API 응답", {
		ko_KR: "번역 수정 성공",
		en_US: "Translation updated successfully",
		zh_CN: "翻译更新成功",
		ja_JP: "翻訳更新成功",
	}),
	defineTranslation("전체 번역 캐시 갱신 성공", "API 응답", {
		ko_KR: "전체 번역 캐시 갱신 성공",
		en_US: "All translation cache refreshed successfully",
		zh_CN: "全部翻译缓存刷新成功",
		ja_JP: "全翻訳キャッシュ更新成功",
	}),
	defineTranslation("언어별 번역 캐시 갱신 성공", "API 응답", {
		ko_KR: "언어별 번역 캐시 갱신 성공",
		en_US: "Language translation cache refreshed successfully",
		zh_CN: "语言翻译缓存刷新成功",
		ja_JP: "言語別翻訳キャッシュ更新成功",
	}),
	defineTranslation("번역 삭제 성공", "API 응답", {
		ko_KR: "번역 삭제 성공",
		en_US: "Translation deleted successfully",
		zh_CN: "翻译删除成功",
		ja_JP: "翻訳削除成功",
	}),

	// 에러 메시지
	defineTranslation("중복된 데이터가 존재합니다", "에러", {
		ko_KR: "중복된 데이터가 존재합니다",
		en_US: "Duplicate data exists",
		zh_CN: "存在重复数据",
		ja_JP: "重複するデータが存在します",
	}),
	defineTranslation("연관된 데이터가 존재하지 않습니다", "에러", {
		ko_KR: "연관된 데이터가 존재하지 않습니다",
		en_US: "Related data does not exist",
		zh_CN: "关联数据不存在",
		ja_JP: "関連データが存在しません",
	}),
	defineTranslation("데이터베이스 스키마 불일치 오류", "에러", {
		ko_KR: "데이터베이스 스키마 불일치 오류",
		en_US: "Database schema mismatch error",
		zh_CN: "数据库架构不匹配错误",
		ja_JP: "データベーススキーマ不一致エラー",
	}),
	defineTranslation("인증이 필요합니다", "에러", {
		ko_KR: "인증이 필요합니다",
		en_US: "Authentication required",
		zh_CN: "需要身份验证",
		ja_JP: "認証が必要です",
	}),
	defineTranslation("접근 권한이 없습니다", "에러", {
		ko_KR: "접근 권한이 없습니다",
		en_US: "Access denied",
		zh_CN: "访问被拒绝",
		ja_JP: "アクセス権限がありません",
	}),
	defineTranslation("유효하지 않은 토큰입니다", "에러", {
		ko_KR: "유효하지 않은 토큰입니다",
		en_US: "Invalid token",
		zh_CN: "无效的令牌",
		ja_JP: "無効なトークンです",
	}),

	// 검증 메시지
	defineTranslation("필수 입력 항목입니다", "검증", {
		ko_KR: "필수 입력 항목입니다",
		en_US: "This field is required",
		zh_CN: "这是必填项",
		ja_JP: "この項目は必須です",
	}),
	defineTranslation("문자열 형식이 아닙니다", "검증", {
		ko_KR: "문자열 형식이 아닙니다",
		en_US: "Must be a string",
		zh_CN: "必须是字符串",
		ja_JP: "文字列である必要があります",
	}),
	defineTranslation("숫자 형식이 아닙니다", "검증", {
		ko_KR: "숫자 형식이 아닙니다",
		en_US: "Must be a number",
		zh_CN: "必须是数字",
		ja_JP: "数値である必要があります",
	}),
	defineTranslation("논리값 형식이 아닙니다", "검증", {
		ko_KR: "논리값 형식이 아닙니다",
		en_US: "Must be a boolean",
		zh_CN: "必须是布尔值",
		ja_JP: "真偽値である必要があります",
	}),
	defineTranslation("배열 형식이 아닙니다", "검증", {
		ko_KR: "배열 형식이 아닙니다",
		en_US: "Must be an array",
		zh_CN: "必须是数组",
		ja_JP: "配列である必要があります",
	}),
	defineTranslation("유효한 이메일 주소를 입력해주세요", "검증", {
		ko_KR: "유효한 이메일 주소를 입력해주세요",
		en_US: "Please enter a valid email address",
		zh_CN: "请输入有效的电子邮件地址",
		ja_JP: "有効なメールアドレスを入力してください",
	}),
	defineTranslation("최소 {{min}}자 이상 입력해주세요", "검증", {
		ko_KR: "최소 {{min}}자 이상 입력해주세요",
		en_US: "Must be at least {{min}} characters",
		zh_CN: "最少需要{{min}}个字符",
		ja_JP: "最低{{min}}文字以上入力してください",
	}),
	defineTranslation("최대 {{max}}자까지 입력 가능합니다", "검증", {
		ko_KR: "최대 {{max}}자까지 입력 가능합니다",
		en_US: "Must be at most {{max}} characters",
		zh_CN: "最多允许{{max}}个字符",
		ja_JP: "最大{{max}}文字まで入力可能です",
	}),
	defineTranslation("올바른 형식이 아닙니다", "검증", {
		ko_KR: "올바른 형식이 아닙니다",
		en_US: "Invalid format",
		zh_CN: "格式不正确",
		ja_JP: "正しい形式ではありません",
	}),
	defineTranslation("허용된 값이 아닙니다", "검증", {
		ko_KR: "허용된 값이 아닙니다",
		en_US: "Invalid value",
		zh_CN: "无效的值",
		ja_JP: "許可されていない値です",
	}),
] satisfies TranslationDefinition[];

export const obsoleteTranslationSeedKeys = [
	"common.success",
	"common.created",
	"common.updated",
	"common.deleted",
	"common.notFound",
	"common.list.success",
	"common.read.success",
	"common.create.success",
	"common.update.success",
	"common.delete.success",
	"common.auth.login.success",
	"common.auth.logout.success",
	"common.auth.register.success",
	"common.auth.refresh.success",
	"common.auth.renew.success",
	"common.auth.validate.success",
	"common.user.list.success",
	"common.user.read.success",
	"common.user.create.success",
	"common.user.update.success",
	"common.user.delete.success",
	"common.role.list.success",
	"common.role.read.success",
	"common.role.create.success",
	"common.role.update.success",
	"common.role.delete.success",
	"common.ability.my.success",
	"common.ability.byRole.success",
	"common.ability.byUser.success",
	"common.ability.read.success",
	"common.ability.create.success",
	"common.ability.update.success",
	"common.ability.delete.success",
	"common.action.list.success",
	"common.action.read.success",
	"common.action.create.success",
	"common.action.update.success",
	"common.action.delete.success",
	"common.subject.list.success",
	"common.subject.fields.success",
	"common.subject.read.success",
	"common.ground.list.success",
	"common.ground.mySpace.success",
	"error.prisma.P2002",
	"error.prisma.P2025",
	"error.prisma.P2003",
	"error.prisma.P2016",
	"error.auth.unauthorized",
	"error.auth.forbidden",
	"error.auth.invalidToken",
	"validation.required",
	"validation.emailFormat",
	"validation.minLength",
	"validation.maxLength",
] as const;

export const translationSeedData: TranslationSeedData[] =
	translationDefinitions.flatMap((definition) =>
		LANGUAGE_CODES.map((languageCode) => ({
			languageCode,
			key: definition.key,
			text: definition.texts[languageCode],
			category: definition.category,
			isTranslated: true,
		})),
	);

function defineTranslation(
	key: string,
	category: string,
	texts: Record<LanguageCode, string>,
): TranslationDefinition {
	return { key, category, texts };
}
