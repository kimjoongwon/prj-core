export type DesignLinkPrice = "free" | "freemium" | "paid";

export interface DesignLink {
	name: string;
	url: string;
	description: string;
	/** null은 가격 정보를 검증하지 않은 항목 — 가격 필터에서 제외된다. */
	price: DesignLinkPrice | null;
	/** 첫 수집 날짜(YYYY-MM-DD). 큐레이션 회차별 원천은 designCurationRounds. */
	addedAt: string;
}

export interface DesignLinkCategory {
	id: string;
	title: string;
	summary: string;
	links: DesignLink[];
}

export interface RetiredDesignLink {
	name: string;
	url: string | null;
	reason: string;
	checkedAt: string;
}

export interface DesignCurationRound {
	date: string;
	label: string;
}

export const designCurationRounds: DesignCurationRound[] = [
	{ date: "2026-10-14", label: "1차 — 갤러리·원리·도구 직접 접속 검증" },
	{ date: "2026-10-15", label: "1차 보강 — 갤러리·디자인 시스템 문서" },
	{ date: "2026-10-16", label: "2차 — 랜딩·데이터 시각화·인터랙션 보강" },
	{ date: "2026-10-21", label: "3차 — SaaS 실제 화면·국내 자료·차트 가이드" },
	{ date: "2026-10-22", label: "4차 — 감각 훈련 게임·컴포넌트 패턴" },
];

export const designLinkCategories: DesignLinkCategory[] = [
	{
		id: "gallery",
		title: "레퍼런스 갤러리",
		summary: "매일 눈 높이기 — 하루 10분, Awwwards → Mobbin 순서로",
		links: [
			{
				name: "Awwwards",
				url: "https://www.awwwards.com/websites/ui-design/",
				description:
					"전 세계 웹디자인 시상 플랫폼. 수상 작품을 폰트·색상·기술별 필터로 볼 수 있음. 수준 높은 웹이 어떤 모습인가의 기준점",
				price: "free",
				addedAt: "2026-10-14",
			},
			{
				name: "Mobbin",
				url: "https://mobbin.com",
				description:
					"실제 출시된 앱·웹앱 화면 약 62만 장. 로그인·결제·설정 화면을 '실제 제품은 어떻게 그렸나' 기준으로 검색",
				price: "freemium",
				addedAt: "2026-10-14",
			},
			{
				name: "recent.design",
				url: "https://recent.design",
				description:
					"웹·UI·브랜딩·모션 인스피레이션 갤러리(옛 Godly). 가볍게 하루 몇 개씩 훑기 좋은 규모",
				price: "free",
				addedAt: "2026-10-14",
			},
			{
				name: "Toools.design",
				url: "https://www.toools.design",
				description:
					"2,200개 이상 디자인 도구·자료 디렉터리. 아이콘·UI 킷·강좌까지 주간 업데이트. 뭘 봐야 할지 모를 때의 출발점",
				price: "free",
				addedAt: "2026-10-14",
			},
			{
				name: "Dribbble",
				url: "https://dribbble.com",
				description: "짧은 컨셉 스케치 중심의 작품 갤러리",
				price: "free",
				addedAt: "2026-10-15",
			},
			{
				name: "Behance",
				url: "https://www.behance.net",
				description: "처음부터 끝까지 담은 실제 작업 과정(케이스 스터디) 중심",
				price: "free",
				addedAt: "2026-10-15",
			},
			{
				name: "Dark.design",
				url: "https://dark.design",
				description:
					"다크 테마 웹사이트만 엄선한 갤러리(Linear·Vercel·Framer 예시). 어드민·개발자 도구 스타일의 좋은 다크 UI 기준",
				price: "free",
				addedAt: "2026-10-16",
			},
			{
				name: "Site of Sites",
				url: "https://www.siteofsites.co",
				description:
					"604개 웹사이트를 산업·스타일·제작 플랫폼(Webflow·Framer)별 필터",
				price: "free",
				addedAt: "2026-10-16",
			},
			{
				name: "Curated.design",
				url: "https://curated.design",
				description:
					"실제 운영 중인 사이트를 업종별(AI·금융·커머스)로 모은 갤러리. 무료만으로도 열람 충분",
				price: "freemium",
				addedAt: "2026-10-16",
			},
			{
				name: "Hoverstat.es",
				url: "https://hoverstat.es",
				description:
					"얼터너티브 웹디자인 실험적 사이트 갤러리(호버·스크롤 연출, 실험적 타이포)",
				price: "free",
				addedAt: "2026-10-16",
			},
			{
				name: "Siteinspire",
				url: "https://www.siteinspire.com",
				description:
					"스타일 중심 웹 갤러리. Typographic 2,105·Grid Layout 672·Unusual Layout 671 등 분류가 특히 좋음",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "Land-book",
				url: "https://land-book.com",
				description: "랜딩페이지 + 섹션·모션·OG 이미지 단위 갤러리",
				price: "freemium",
				addedAt: "2026-10-21",
			},
			{
				name: "CSS Design Awards",
				url: "https://www.cssdesignawards.com",
				description:
					"2009년부터 운영하는 웹사이트 시상 플랫폼. Website of the Day 수상 아카이브",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "Minimal Gallery",
				url: "https://minimal.gallery",
				description:
					"미니멀 스타일 웹사이트 2,600+ 장. 제작 플랫폼(Framer·Webflow)별 필터 가능",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "Httpster",
				url: "https://httpster.net",
				description:
					"스타일별(미니멀·브루탈리즘 등)로 분류된 사이트 3,116건 갤러리",
				price: "free",
				addedAt: "2026-10-22",
			},
		],
	},
	{
		id: "saas-screens",
		title: "SaaS·관리자 화면",
		summary: "DataGrid·폼 작업에 직결 — 실제 제품의 관리 화면·흐름",
		links: [
			{
				name: "SaaSFrame",
				url: "https://www.saasframe.io",
				description:
					"실제 SaaS 제품 화면 5,000+ 장을 페이지 종류별로 정리(대시보드, 계정 설정 571, 온보딩 349, 모달 519, 사이드바 내비게이션 379 등)",
				price: "freemium",
				addedAt: "2026-10-21",
			},
			{
				name: "Refero",
				url: "https://refero.design",
				description:
					"웹·iOS 실제 제품 화면 수만 장. 페이지 유형 → 흐름 → UX 패턴 → UI 요소(테이블·스켈레톤·차트) 순으로 좁혀가는 구조라 관리자 화면 검색에 특히 좋음",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "SaaSUI",
				url: "https://www.saasui.design",
				description:
					"Notion·Intercom·Linear 등 실제 제품 100개에서 뽑은 UI 패턴 3,500+ 장. 대시보드·테이블·폼·빈 상태·모달 유형별 갤러리와 디자인 용어집",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "Good UX",
				url: "https://goodux.appcues.com",
				description:
					"유명 제품의 온보딩·툴팁·빈 상태·NPS 설문 사례 갤러리. 다른 제품은 이 화면을 어떻게 그렸나를 빠르게 훑기 좋음",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "Page Flows",
				url: "https://pageflows.com",
				description:
					"실제 제품의 회원가입·결제 흐름을 단계 주석 붙은 녹화로 보여줌(Screenlane 흡수). 3일 체험 $2.95",
				price: "paid",
				addedAt: "2026-10-21",
			},
		],
	},
	{
		id: "landing",
		title: "랜딩페이지",
		summary: "proposal 사이트 작업에 직결",
		links: [
			{
				name: "Lapa Ninja",
				url: "https://www.lapa.ninja",
				description:
					"랜딩페이지 7,300+ 풀 스크린샷, 색·플랫폼·연도 필터. 무료 일러스트·아이콘 자료도 있음",
				price: "free",
				addedAt: "2026-10-16",
			},
			{
				name: "Landingfolio",
				url: "https://www.landingfolio.com",
				description:
					"랜딩페이지 961개 + Hero·Footer·CTA 같은 섹션 단위 예 4,652개(Tailwind·Webflow·Figma 형식)",
				price: null,
				addedAt: "2026-10-16",
			},
			{
				name: "One Page Love",
				url: "https://onepagelove.com",
				description: "원페이지 사이트 9,170개·섹션 예 9,334개. 2008년부터 운영",
				price: null,
				addedAt: "2026-10-16",
			},
		],
	},
	{
		id: "components",
		title: "컴포넌트·패턴",
		summary: "공용 UI 패키지(fe-ui) 작업에 직결",
		links: [
			{
				name: "Component Gallery",
				url: "https://component.gallery",
				description:
					"전 세계 디자인 시스템 95곳에서 모은 컴포넌트별 예 2,671건(트리뷰·캐러셀·페이지네이션 등 60종). 다른 시스템은 어떻게 만들었나 조사할 때 1순위",
				price: "free",
				addedAt: "2026-10-22",
			},
			{
				name: "GoodUI",
				url: "https://goodui.org",
				description:
					"A/B 테스트로 검증된 전환율 개선 UI 패턴 모음. 패턴 아이디어 목록은 무료, 상세 테스트 결과는 유료",
				price: "freemium",
				addedAt: "2026-10-22",
			},
		],
	},
	{
		id: "principles",
		title: "원리·가이드",
		summary: "왜 좋아 보이는지 — 일주일에 하나씩 읽기",
		links: [
			{
				name: "Laws of UX",
				url: "https://lawsofux.com",
				description:
					"힉의 법칙, 피츠의 법칙 등 심리학 원리 약 30개를 그림과 함께 정리. 이 화면이 왜 불편하지를 원리 이름으로 설명할 수 있게 해줌",
				price: "free",
				addedAt: "2026-10-14",
			},
			{
				name: "Refactoring UI",
				url: "https://refactoringui.com",
				description:
					"Tailwind CSS 제작자들이 쓴 개발자용 디자인 책($99~, 샘플 2챕터 무료). 테두리 대신 배경색·그림자·여백으로 구역 나누기 같은 즉시 적용 가능한 팁",
				price: "paid",
				addedAt: "2026-10-14",
			},
			{
				name: "Practical Typography",
				url: "https://practicaltypography.com",
				description:
					"타이포그래피 기본기 무료 온라인 책. 10분 타이포그래피 챕터만 읽어도 줄 간격·글자 크기 선택이 달라짐",
				price: "free",
				addedAt: "2026-10-14",
			},
			{
				name: "Figma — UI 디자인 원칙",
				url: "https://www.figma.com/resource-library/ui-design-principles",
				description: "시각적 위계, 간격, 정렬 같은 기본 원칙 짧은 정리",
				price: "free",
				addedAt: "2026-10-15",
			},
			{
				name: "Apple 인간 인터페이스 지침서(HIG)",
				url: "https://developer.apple.com/design/human-interface-guidelines/",
				description:
					"양대 플랫폼 공식 표준서. 터치 영역 크기, 색 대비 기준 등 애매한 결정의 근거",
				price: "free",
				addedAt: "2026-10-15",
			},
			{
				name: "Material Design 3",
				url: "https://m3.material.io",
				description:
					"구글 공식 디자인 시스템 가이드. HIG와 짝으로 보는 양대 표준",
				price: "free",
				addedAt: "2026-10-15",
			},
			{
				name: "Figma 웹디자인 트렌드 2026",
				url: "https://www.figma.com/resource-library/web-design-trends",
				description:
					"올해 트렌드 요약. 유행과 오래 남는 패턴을 구분하는 보조 자료",
				price: "free",
				addedAt: "2026-10-15",
			},
			{
				name: "NN/g Articles",
				url: "https://www.nngroup.com/articles/",
				description:
					"닐슨 노만 그룹의 사용성 연구 기반 무료 글·영상 모음. 좋다/나쁘다가 아니라 연구 근거로 UX를 판단하는 훈련",
				price: "free",
				addedAt: "2026-10-16",
			},
			{
				name: "Every Layout",
				url: "https://every-layout.dev",
				description:
					"Stack·Cluster·Sidebar·Switcher 같은 CSS 레이아웃 12가지를 패턴으로 정리($69, 일부 무료). HStack·VStack·Section 같은 컴포넌트를 직접 만드는 작업과 바로 닿음",
				price: "freemium",
				addedAt: "2026-10-21",
			},
			{
				name: "Learn UI Design 블로그",
				url: "https://learnui.design/blog/",
				description:
					"Refactoring UI 저자 Erik Kennedy의 글. 7 Rules for Creating Gorgeous UI, Font Sizes in UI Design 등 즉시 적용 가능",
				price: "free",
				addedAt: "2026-10-22",
			},
			{
				name: "UX Collective",
				url: "https://uxdesign.cc",
				description:
					"Medium 최대 디자인 매거진(독자 50만+). 주간 큐레이션 운영 중",
				price: "free",
				addedAt: "2026-10-22",
			},
			{
				name: "Deceptive Patterns",
				url: "https://www.deceptive.design",
				description:
					"다크 패턴(기만적 UI) 유형별 정리와 기업 사례·단속 이력. 나쁜 디자인이 어떻게 생겼는지 아는 반면교사 자료",
				price: "free",
				addedAt: "2026-10-22",
			},
		],
	},
	{
		id: "design-systems",
		title: "디자인 시스템 문서",
		summary: "실제 운영되는 시스템의 공식 문서 — 관리자 화면 참조",
		links: [
			{
				name: "Shopify Polaris",
				url: "https://polaris.shopify.com",
				description:
					"Shopify 관리 화면 디자인 시스템. 어드민 UI 작업과 가장 유사한 참조",
				price: "free",
				addedAt: "2026-10-15",
			},
			{
				name: "IBM Carbon",
				url: "https://carbondesignsystem.com",
				description:
					"IBM 디자인 시스템. 데이터 밀집 화면·대시보드 패턴의 공식 문서",
				price: "free",
				addedAt: "2026-10-15",
			},
		],
	},
	{
		id: "type-color",
		title: "글자와 색",
		summary: "서체 선택·팔레트·색 접근성 도구",
		links: [
			{
				name: "Typewolf",
				url: "https://www.typewolf.com",
				description:
					"매일 실제 웹사이트 하나를 뽑아 어떤 폰트를 썼는지 분해. 유명 폰트의 저렴한 대안 목록도 실용적",
				price: "free",
				addedAt: "2026-10-14",
			},
			{
				name: "Fonts In Use",
				url: "https://fontsinuse.com",
				description:
					"실제 작품 34,000건 이상에 쓰인 서체를 주제별(브랜딩·책·포스터) 검색하는 아카이브",
				price: "free",
				addedAt: "2026-10-14",
			},
			{
				name: "Coolors",
				url: "https://coolors.co",
				description: "색 팔레트(색 조합) 생성·추천 도구",
				price: "freemium",
				addedAt: "2026-10-14",
			},
			{
				name: "Typescale",
				url: "https://typescale.com",
				description:
					"타입 스케일 계산기. 기준 크기·비율(황금비 등)·서체를 바꿔가며 미리보고 CSS로 내보내기",
				price: "free",
				addedAt: "2026-10-16",
			},
			{
				name: "Who Can Use",
				url: "https://whocanuse.com",
				description:
					"글자·배경색 조합의 WCAG 대비 등급과 색약·백내장·저시력 시점 시뮬레이션. 색 고를 때 함께 켜두면 좋음",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "Color Hunt",
				url: "https://colorhunt.co",
				description:
					"매일 갱신되는 4색 팔레트 갤러리. 분위기(Pastel·Neon)·주제별 태그 필터",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "Realtime Colors",
				url: "https://www.realtimecolors.com",
				description:
					"색 팔레트와 폰트를 실제 페이지에 실시간으로 입혀보는 도구. 대비 검사·타입 스케일·Tailwind/CSS 내보내기 지원. Color Hunt에서 고른 팔레트를 여기서 확인",
				price: "free",
				addedAt: "2026-10-22",
			},
		],
	},
	{
		id: "data-viz",
		title: "데이터 시각화",
		summary: "관리 화면 대시보드 작업에 직결",
		links: [
			{
				name: "FlowingData",
				url: "https://flowingdata.com",
				description:
					"Nathan Yau의 차트 분석·비평 블로그. 이 차트가 왜 읽기 어려운가를 훈련시키는 글들",
				price: "free",
				addedAt: "2026-10-16",
			},
			{
				name: "Information is Beautiful",
				url: "https://informationisbeautiful.net",
				description:
					"데이터를 인포그래픽으로 시각화한 갤러리. 대시보드 표현 아이디어 원천",
				price: "free",
				addedAt: "2026-10-16",
			},
			{
				name: "The Pudding",
				url: "https://pudding.cool",
				description:
					"데이터로 이야기를 만드는 비주얼 에세이 225편. 스크롤 기반 데이터 스토리텔링의 정석",
				price: "free",
				addedAt: "2026-10-16",
			},
			{
				name: "From Data to Viz",
				url: "https://data-to-viz.com",
				description:
					"데이터 모양에서 시작해 적합한 차트 종류로 안내하는 의사결정 트리. 차트별 흔한 실수 정리도 붙어 있음",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "Datawrapper 블로그",
				url: "https://www.datawrapper.de/blog/",
				description:
					"차트 만들기 Do's & Don'ts 연재와 Fix my chart(실제 차트 고치기) 시리즈. 대시보드의 색·축·라벨 결정 근거",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "Storytelling with Data",
				url: "https://www.storytellingwithdata.com",
				description:
					"블로그·팟캐스트·차트 가이드는 무료(교육 과정은 유료). Datawrapper 블로그와 짝으로 보면 좋음",
				price: "freemium",
				addedAt: "2026-10-22",
			},
		],
	},
	{
		id: "craft",
		title: "디테일과 구현",
		summary: "개발자 시점 — 코드로 예쁘게 만드는 법",
		links: [
			{
				name: "Little Big Details",
				url: "https://littlebigdetails.com",
				description:
					"유명 서비스의 작지만 빛나는 UX 디테일 모음. 이 관점이 생기면 관리 화면의 빈 상태·로딩·오류 표현이 달라짐",
				price: "free",
				addedAt: "2026-10-14",
			},
			{
				name: "Josh Comeau 블로그",
				url: "https://www.joshwcomeau.com",
				description:
					"CSS·애니메이션 인터랙티브 튜토리얼. 그림자 만드는 법, 애니메이션 타이밍 같은 코드로 예쁘게 만드는 법",
				price: "free",
				addedAt: "2026-10-14",
			},
			{
				name: "Codrops",
				url: "https://tympanus.net/codrops/",
				description:
					"GSAP·Three.js 등 인터랙티브 웹 튜토리얼과 실행 데모. Josh Comeau와 함께 보면 좋은 쌍",
				price: "free",
				addedAt: "2026-10-16",
			},
			{
				name: "Rauno Freiberg — craft",
				url: "https://rauno.me/craft",
				description:
					"Vercel 디자인 엔지니어의 인터페이스 디테일 프로토타입·에세이 모음(2021–2026)",
				price: "free",
				addedAt: "2026-10-16",
			},
			{
				name: "easings.net",
				url: "https://easings.net",
				description:
					"애니메이션 이징 커브 30종 치트시트. 곡선 모양 보고 CSS 코드 바로 가져오기",
				price: "free",
				addedAt: "2026-10-16",
			},
			{
				name: "Utopia",
				url: "https://utopia.fyi",
				description:
					"화면 크기가 변해도 부드럽게 커지는 글자·간격 스케일을 계산해 CSS로 내보내는 도구. 간격 체계 설계에 직접 활용",
				price: "free",
				addedAt: "2026-10-21",
			},
		],
	},
	{
		id: "games",
		title: "감각 훈련 게임",
		summary: "자투리 5분 — 눈으로 직접 익히기",
		links: [
			{
				name: "Kern Type",
				url: "https://type.method.ac",
				description:
					"글자 사이 간격(커닝)을 맞추고 점수를 받는 타이포그래피 게임. 같은 제작처(method.ac)에 Color·Bézier 게임도 있음",
				price: "free",
				addedAt: "2026-10-22",
			},
			{
				name: "Grid Garden",
				url: "https://cssgridgarden.com",
				description: "CSS Grid를 28레벨 게임으로 익히기(당근 키우기 컨셉)",
				price: "free",
				addedAt: "2026-10-22",
			},
			{
				name: "Flexbox Froggy",
				url: "https://flexboxfroggy.com",
				description:
					"Flexbox를 개구리 배치 게임으로 익히기. Grid Garden과 같은 제작처(Codepip)",
				price: "free",
				addedAt: "2026-10-22",
			},
		],
	},
	{
		id: "graphic",
		title: "그래픽 디자인",
		summary: "웹 UI 밖의 시야 넓히기",
		links: [
			{
				name: "Trend List",
				url: "https://trendlist.org",
				description:
					"2011년부터 쌓인 그래픽 디자인 유행 사례 12,041장을 트렌드(Letterspace, Stretched, Neon Colors 등)·색·국가별로 분류",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "It's Nice That",
				url: "https://www.itsnicethat.com",
				description:
					"런던 발 창작 잡지. 그래픽 디자인·일러스트·타이포그래피 작가 인터뷰로 왜 이렇게 만들었나의 맥락을 알려줌",
				price: "free",
				addedAt: "2026-10-21",
			},
		],
	},
	{
		id: "korean",
		title: "국내 자료",
		summary: "한국 서비스·한글 폰트",
		links: [
			{
				name: "UI Bowl",
				url: "https://uibowl.io",
				description:
					"국내 앱 중심 UI 레퍼런스 갤러리. MAU(월간 활성 사용자) 기준 필터로 실제로 많이 쓰이는 앱부터 볼 수 있음. 열람은 멤버십 중심",
				price: "paid",
				addedAt: "2026-10-21",
			},
			{
				name: "눈누",
				url: "https://noonnu.cc",
				description:
					"상업적 이용 가능한 한글 무료 폰트 약 2,000종. 한글 서체 고를 때 첫 출발점(유료 폰트 마켓도 함께 운영)",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "노트폴리오",
				url: "https://notefolio.net",
				description:
					"국내 최대 디자인 포트폴리오 플랫폼. 국내 디자이너의 실제 작업 과정을 볼 수 있는 한국판 Behance",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "DBCut 디비컷",
				url: "https://www.dbcut.com",
				description:
					"국내 웹디자인 갤러리. 신한 SOLgit 등 국내 서비스 최신 사례 갱신 중",
				price: "free",
				addedAt: "2026-10-22",
			},
		],
	},
	{
		id: "news-habits",
		title: "소식·습관",
		summary: "매일 조금씩 들어오게 만드는 장치",
		links: [
			{
				name: "Sidebar",
				url: "https://sidebar.io",
				description:
					"평일마다 디자인 링크 5개를 골라 주는 뉴스레터. 매일 조금씩 루틴에 맞음",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "UserOnboard",
				url: "https://useronboard.com",
				description:
					"유명 앱의 온보딩 흐름을 한 컷 한 컷 짚는 해부(teardown) 만화 연재",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "Muzli",
				url: "https://muz.li",
				description:
					"브라우저 새 탭을 디자인 피드로 바꾸는 확장 프로그램. 따로 찾지 않아도 자연스럽게 눈에 들어오게 만드는 장치",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "Are.na",
				url: "https://www.are.na",
				description:
					"광고·알고리즘 없는 레퍼런스 수집 플랫폼. 채널에 이미지·웹페이지를 쌓고 다른 사람 채널을 검색",
				price: "freemium",
				addedAt: "2026-10-16",
			},
			{
				name: "Cosmos",
				url: "https://www.cosmos.so",
				description:
					"디자이너용 이미지 수집 플랫폼. AI 생성 이미지 표시/숨김 설정이 있음",
				price: "free",
				addedAt: "2026-10-21",
			},
			{
				name: "Growth.Design",
				url: "https://growth.design",
				description:
					"제품 심리학 케이스 스터디를 5분 만화로 정리(가입 무료). 구독자 13만 명",
				price: "free",
				addedAt: "2026-10-22",
			},
		],
	},
];

export const retiredDesignLinks: RetiredDesignLink[] = [
	{
		name: "UI Garage",
		url: null,
		reason: "8년 만에 폐업 공지",
		checkedAt: "2026-10-16",
	},
	{
		name: "smartinterface.io",
		url: null,
		reason: "도메인 소멸",
		checkedAt: "2026-10-16",
	},
	{
		name: "shadows.brumm.af",
		url: "https://shadows.brumm.af",
		reason: "리더기로 내용 확인 불가",
		checkedAt: "2026-10-16",
	},
	{
		name: "Layout 뉴스레터(layoutemail.com)",
		url: null,
		reason: "양쪽 경로 모두 접속 오류",
		checkedAt: "2026-10-16",
	},
	{
		name: "GDWEB(한국 디자인 어워드)",
		url: "https://www.gdweb.co.kr",
		reason: "두 차례 시도 모두 문자 깨짐으로 내용 확인 불가",
		checkedAt: "2026-10-21",
	},
	{
		name: "Brutalist Websites",
		url: "https://brutalistwebsites.com",
		reason: "2019년 이후 갱신 없음(갤러리 자체는 열람 가능)",
		checkedAt: "2026-10-21",
	},
	{
		name: "Screenlane",
		url: "https://screenlane.com",
		reason: "Page Flows로 합병되어 개별 사이트는 리다이렉트됨",
		checkedAt: "2026-10-21",
	},
	{
		name: "saasframes.com(복수형)",
		url: "https://saasframes.com",
		reason: "호스팅사 파킹 도메인. 정상 주소는 saasframe.io(단수형)",
		checkedAt: "2026-10-22",
	},
	{
		name: "Godly(godly.website)",
		url: "https://godly.website",
		reason: "recent.design으로 301 리다이렉트 — 기존 recent.design 항목과 동일",
		checkedAt: "2026-10-22",
	},
];

export const designLinksLastUpdatedAt = "2026-10-22";
