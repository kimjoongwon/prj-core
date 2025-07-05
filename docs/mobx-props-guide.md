# MobxProps 가이드

## 개요

MobxProps는 프론트엔드 컴포넌트에서 MobX 상태 관리를 위한 표준 인터페이스입니다. 이 패턴을 사용하여 모든 컴포넌트가 일관된 방식으로 MobX 상태와 연동됩니다.

## MobxProps 인터페이스

```typescript
export interface MobxProps<T = any> {
  path: Paths<T, 4>; // 상태 객체 내에서 데이터의 경로
  state: T; // MobX 상태 객체
}
```

### 타입 파라미터

- `T`: 상태 객체의 타입 (제네릭)
- `Paths<T, 4>`: 상태 객체 내에서 최대 4단계 깊이까지 안전한 타입 경로 제공

## 기본 사용법

### 1. 컴포넌트 Props 정의

```typescript
import { MobxProps } from '@shared/types';

export interface MyComponentProps<T = any> extends MobxProps<T> {
  // 추가 props들
  label?: string;
  placeholder?: string;
  maxLength?: number;
}
```

### 2. 컴포넌트 구현

```typescript
import { observer } from 'mobx-react-lite';
import { useMobxHookForm } from '@shared/frontend';
import { get } from 'lodash-es';

export const MyComponent = observer(
  <T extends object>(props: MyComponentProps<T>) => {
    const { state, path, label, ...rest } = props;

    // 초기값 가져오기
    const initialValue = get(state, path) || '';

    // MobX Hook Form 사용
    const { localState } = useMobxHookForm(initialValue, state, path);

    return (
      <input
        value={localState.value}
        onChange={e => (localState.value = e.target.value)}
        {...rest}
      />
    );
  },
);
```

## useMobxHookForm 훅

### 목적

- 로컬 상태와 글로벌 MobX 상태 간의 양방향 동기화
- React의 useState를 대체하여 MobX 기반 상태 관리

### 사용법

```typescript
const { localState } = useMobxHookForm(initialValue, state, path);
```

### 파라미터

- `initialValue`: 초기값
- `state`: MobX 상태 객체
- `path`: 상태 객체 내 경로 (점 표기법 문자열)

### 반환값

- `localState.value`: 반응형 로컬 상태 값

## 실제 컴포넌트 예시

### Input 컴포넌트

```typescript
export interface InputProps<T> extends MobxProps<T>, NextUIInputProps {
  validation?: Validation;
}

export const Input = observer(<T extends object>(props: InputProps<T>) => {
  const { path = '', state = {}, onChange, ...rest } = props;

  const initialValue = get(state, path) || '';
  const { localState } = useMobxHookForm(initialValue, state, path);

  const handleChange = action((e: React.ChangeEvent<HTMLInputElement>) => {
    localState.value = e.target.value;
  });

  return (
    <NextUIInput {...rest} value={localState.value} onChange={handleChange} />
  );
});
```

### FileUploader 컴포넌트

```typescript
export interface FileUploaderProps<T = any> extends MobxProps<T> {
  label?: string;
  type: 'image' | 'video' | 'all';
  onFilesChange?: (type: string, fileDtos: Partial<FileDto>[]) => void;
  onFileRemove?: (fileDto: Partial<FileDto>) => void;
}

export const FileUploader = observer(
  <T extends object>(props: FileUploaderProps<T>) => {
    const { state, path, type, ...rest } = props;
    
    const initialValue = get(state, path) || null;
    const { localState } = useMobxHookForm(initialValue, state, path);
    
    const handleFileUpload = action((e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const fileDto: Partial<FileDto> = {
          id: v4(),
          name: file.name,
          url: URL.createObjectURL(file),
          mimeType: file.type,
        };

        localState.value = fileDto;
        onFilesChange?.(type, [fileDto]);
      }
    });

    return (
      // 단일 파일 업로드 UI
    );
  }
);
```

## 베스트 프랙티스

### 1. Props 타입 정의

- 항상 `@shared/types`에 Props 인터페이스 정의
- MobxProps를 상속하여 일관성 유지

### 2. 컴포넌트 구현

- `observer`로 감싸서 MobX 반응성 확보
- `useMobxHookForm` 훅 사용으로 상태 동기화
- `action`으로 상태 변경 로직 래핑

### 3. 초기값 처리

- `get(state, path)`로 안전하게 초기값 가져오기
- 기본값 제공으로 undefined 방지

### 4. 타입 안전성

- 제네릭 타입 파라미터 활용
- `Paths<T, 4>`로 경로 타입 안전성 확보

## 주의사항

### 1. useState 사용 금지

- React의 useState 대신 useMobxHookForm 사용
- MobX 상태 관리 패턴 일관성 유지

### 2. observer 필수

- 모든 MobX 상태를 사용하는 컴포넌트는 observer로 래핑
- 반응성 누락 방지

### 3. action 사용

- 상태 변경 시 mobx의 action 사용 권장
- 성능 최적화 및 디버깅 향상

## Store 클래스 패턴

### Store 정의

```typescript
export class FileUploaderStore {
  file: Partial<FileDto> | null = null;

  constructor(initialFile: Partial<FileDto> | null = null) {
    this.file = initialFile;
    makeAutoObservable(this);
  }

  setFile(file: Partial<FileDto> | null) {
    this.file = file;
  }

  clearFile() {
    this.file = null;
  }

  get hasFile() {
    return this.file !== null;
  }
}
```

### Store 사용

```typescript
export const MyComponent = observer(
  <T extends object>(props: MyComponentProps<T>) => {
    const { state, path } = props;
    const initialValue = get(state, path) || [];
    const { localState } = useMobxHookForm(initialValue, state, path);

    // Store 인스턴스는 필요시에만 사용
    // 대부분의 경우 useMobxHookForm으로 충분함

    return (
      // 컴포넌트 JSX
    );
  }
);
```

## 에러 해결

### 1. "Property does not exist" 에러

- Props 인터페이스가 올바르게 정의되었는지 확인
- MobxProps 상속 여부 확인

### 2. 반응성 동작 안함

- observer로 컴포넌트가 래핑되었는지 확인
- useMobxHookForm 사용 여부 확인

### 3. 타입 에러

- 제네릭 타입 파라미터 올바른 전달 확인
- Paths 타입 경로 문법 확인

## 마이그레이션 가이드

### useState에서 useMobxHookForm으로

**이전:**

```typescript
const [value, setValue] = useState(initialValue);
```

**이후:**

```typescript
const { localState } = useMobxHookForm(initialValue, state, path);
// localState.value로 접근
```

### Props 정의 이전

**이전:**

```typescript
interface MyProps {
  value: string;
  onChange: (value: string) => void;
}
```

**이후:**

```typescript
interface MyProps<T> extends MobxProps<T> {
  // 추가 props만 정의
  placeholder?: string;
}
```

이 가이드를 참조하여 모든 컴포넌트에서 일관된 MobxProps 패턴을 적용하세요.
