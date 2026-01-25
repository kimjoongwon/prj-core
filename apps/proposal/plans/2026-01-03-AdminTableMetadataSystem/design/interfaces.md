# 메타데이터 인터페이스 설계

## 1. AdminTableConfig (메인 인터페이스)

```typescript
interface AdminTableConfig<T> {
  /** 테이블 고유 식별자 (컬럼 설정 저장용) */
  tableId: string;

  /** 엔티티명 (컬럼 가시성 시스템 연동) */
  entity: string;

  /** 데이터 배열 */
  data: T[];

  /** 로딩 상태 */
  isLoading?: boolean;

  /** 컬럼 정의 (정적) - 동적 가시성은 useColumnVisibility로 처리 */
  columns: ColumnConfig<T>[];

  /** 테이블 상단 좌측 영역 (검색, 필터 등) */
  leftInputs?: InputConfig[];

  /** 테이블 상단 우측 영역 (버튼, 액션 등) */
  rightInputs?: InputConfig[];

  /** 테이블 하단 좌측 영역 (선택 정보 등) */
  bottomLeft?: InputConfig[];

  /** 테이블 하단 우측 영역 (페이지네이션 등) */
  bottomRight?: InputConfig[];

  /** 선택 설정 */
  selection?: SelectionConfig;

  /** 페이지네이션 설정 */
  pagination?: PaginationConfig;

  /** 정렬 설정 */
  sorting?: SortingConfig;

  /** 모바일 대응 설정 */
  responsive?: ResponsiveConfig;

  /** 빈 상태 설정 */
  emptyState?: EmptyStateConfig;
}
```

---

## 2. ColumnConfig (컬럼 정의)

```typescript
interface ColumnConfig<T> {
  /** 필드명 (데이터 키) */
  field: keyof T | string;

  /** 표시 라벨 */
  label: string;

  /** 필수 여부 (필수 컬럼은 항상 표시) */
  isRequired?: boolean;

  /** 너비 */
  width?: string | number;

  /** 최소 너비 */
  minWidth?: string | number;

  /** 정렬 가능 여부 */
  sortable?: boolean;

  /** 정렬 방향 */
  align?: 'left' | 'center' | 'right';

  /** 커스텀 셀 렌더러 */
  render?: (value: any, row: T, index: number) => React.ReactNode;

  /** 커스텀 헤더 렌더러 */
  headerRender?: () => React.ReactNode;

  /** 디바이스별 기본 가시성 (DB 설정 오버라이드용) */
  visibility?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  };
}
```

---

## 3. InputConfig (입력 컴포넌트 정의)

```typescript
type InputType =
  | 'search'        // 검색 입력
  | 'select'        // 셀렉트 박스
  | 'multi-select'  // 다중 선택
  | 'date-range'    // 날짜 범위
  | 'button'        // 버튼
  | 'button-group'  // 버튼 그룹
  | 'dropdown'      // 드롭다운 메뉴
  | 'checkbox'      // 체크박스
  | 'chip-group'    // 필터 칩 그룹
  | 'custom'        // 커스텀 컴포넌트
  ;

interface InputConfig {
  /** 입력 타입 */
  type: InputType;

  /** 고유 식별자 */
  id: string;

  /** 표시 라벨 (선택적) */
  label?: string;

  /** placeholder */
  placeholder?: string;

  /** 비활성화 여부 */
  disabled?: boolean;

  /** 숨김 여부 */
  hidden?: boolean;

  /** 권한 체크 (CASL Subject) */
  permission?: {
    action: string;
    subject: string;
  };

  /** 디바이스별 표시 여부 */
  showOn?: ('desktop' | 'tablet' | 'mobile')[];

  /** 타입별 추가 설정 */
  props?: InputTypeProps;

  /** 이벤트 핸들러 */
  handlers?: InputHandlers;
}
```

---

## 4. InputTypeProps (타입별 Props)

```typescript
interface InputTypeProps {
  // Search
  debounceMs?: number;

  // Select / MultiSelect
  options?: SelectOption[];
  defaultValue?: string | string[];

  // DateRange
  minDate?: Date;
  maxDate?: Date;

  // Button
  variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'ghost';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;

  // ButtonGroup
  buttons?: ButtonConfig[];

  // Dropdown
  items?: DropdownItem[];

  // Custom
  component?: React.ComponentType<any>;
  componentProps?: Record<string, any>;
}
```

---

## 5. InputHandlers (이벤트 핸들러)

```typescript
interface InputHandlers {
  onClick?: () => void;
  onChange?: (value: any) => void;
  onSearch?: (keyword: string) => void;
  onSelect?: (value: string | string[]) => void;
  onDateChange?: (range: { start: Date; end: Date }) => void;
}
```

---

## 6. SelectionConfig (선택 설정)

```typescript
interface SelectionConfig {
  /** 선택 모드 */
  mode: 'none' | 'single' | 'multiple';

  /** 선택된 키 목록 */
  selectedKeys?: Set<string> | 'all';

  /** 선택 변경 핸들러 */
  onSelectionChange?: (keys: Set<string>) => void;

  /** 선택 시 하단 액션바 표시 */
  showActionBar?: boolean;

  /** 액션바 설정 */
  actionBar?: {
    /** 선택된 항목 수 표시 */
    showCount?: boolean;
    /** 액션 버튼들 */
    actions?: InputConfig[];
  };
}
```

---

## 7. PaginationConfig (페이지네이션 설정)

```typescript
interface PaginationConfig {
  /** 현재 페이지 (1-based) */
  page: number;

  /** 페이지당 항목 수 */
  pageSize: number;

  /** 전체 항목 수 */
  total: number;

  /** 페이지 변경 핸들러 */
  onPageChange?: (page: number) => void;

  /** 페이지 크기 변경 핸들러 */
  onPageSizeChange?: (pageSize: number) => void;

  /** 페이지 크기 옵션 */
  pageSizeOptions?: number[];

  /** 페이지 크기 선택 표시 여부 */
  showPageSizeSelector?: boolean;

  /** 전체 항목 수 표시 여부 */
  showTotal?: boolean;
}
```

---

## 8. ResponsiveConfig (반응형 설정)

```typescript
interface ResponsiveConfig {
  /** 모바일에서 카드 뷰로 전환 여부 */
  mobileCardView?: boolean;

  /** 카드 뷰 렌더러 (모바일용) */
  cardRender?: (row: T, index: number) => React.ReactNode;

  /** 브레이크포인트 오버라이드 */
  breakpoints?: {
    mobile?: number;   // 기본: 768
    tablet?: number;   // 기본: 1280
  };
}
```
