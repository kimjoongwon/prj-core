# Validation Fields 시스템 가이드

## 개요

ButtonBuilder에서 사용할 수 있는 새로운 validation 시스템입니다. 기존의 `path`와 `validation` 방식을 완전히 대체하여, 각 필드별로 개별적인 validation 규칙을 설정할 수 있습니다.

## 기본 사용법

### 1. 단일 필드 검증

```typescript
{
  name: 'ButtonBuilder',
  props: {
    mutation: {
      name: 'createUser',
      validationFields: {
        'form.input.name': {
          required: { value: true, message: '이름은 필수입니다' },
          minLength: { value: 2, message: '최소 2자 이상 입력해주세요' }
        }
      }
    },
    children: '사용자 생성'
  }
}
```

### 2. 다중 필드 검증

```typescript
{
  name: 'ButtonBuilder',
  props: {
    mutation: {
      name: 'createUser',
      validationFields: {
        'form.input.name': {
          required: { value: true, message: '이름은 필수입니다' },
          minLength: { value: 2, message: '최소 2자 이상' },
          maxLength: { value: 50, message: '최대 50자까지' }
        },
        'form.input.email': {
          required: { value: true, message: '이메일은 필수입니다' },
          patterns: [{
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: '올바른 이메일 형식이 아닙니다'
          }]
        },
        'form.input.age': {
          required: { value: true, message: '나이는 필수입니다' },
          min: { value: 18, message: '18세 이상이어야 합니다' },
          max: { value: 120, message: '120세 이하여야 합니다' }
        }
      }
    },
    children: '사용자 생성'
  }
}
```

### 3. 실제 사용 예시

#### Ground 생성 페이지
```typescript
mutation: {
  name: 'createGround',
  queryKey: '/api/v1/grounds',
  validationFields: {
    'form.input.name': {
      required: { value: true, message: '그라운드 이름은 필수입니다' }
    },
    'form.input.label': {
      required: { value: true, message: '라벨은 필수입니다' }
    },
    'form.input.email': {
      patterns: [{
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '올바른 이메일 형식이 아닙니다'
      }]
    }
  }
}
```

#### 로그인 페이지
```typescript
mutation: {
  name: 'getToken',
  validationFields: {
    'form.input.email': {
      required: { value: true, message: '이메일은 필수입니다' },
      patterns: [{
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '올바른 이메일 형식이 아닙니다'
      }]
    },
    'form.input.password': {
      required: { value: true, message: '비밀번호는 필수입니다' },
      minLength: { value: 6, message: '비밀번호는 최소 6자 이상이어야 합니다' }
    }
  }
}
```

## 검증 규칙 종류

### required
필수 입력 검증
```typescript
required: { value: true, message: '필수 입력 항목입니다' }
```

### minLength / maxLength
문자열 길이 검증
```typescript
minLength: { value: 3, message: '최소 3자 이상 입력해주세요' }
maxLength: { value: 100, message: '최대 100자까지 입력 가능합니다' }
```

### min / max
숫자 범위 검증
```typescript
min: { value: 0, message: '0 이상의 값을 입력해주세요' }
max: { value: 999, message: '999 이하의 값을 입력해주세요' }
```

### patterns
정규표현식 패턴 검증 (여러 개 가능)
```typescript
patterns: [
  { 
    value: /^[a-zA-Z]+$/, 
    message: '영문자만 입력 가능합니다' 
  },
  { 
    value: '^[A-Z]', 
    message: '첫 글자는 대문자여야 합니다' 
  }
]
```

## Migration from Legacy System

기존의 deprecated된 방식에서 새로운 방식으로 완전히 마이그레이션되었습니다:

### Before (구 방식 - 완전히 제거됨)
```typescript
{
  mutation: {
    name: 'createUser',
    path: 'form.input'  // ❌ 제거됨
  },
  validation: {  // ❌ 제거됨
    required: { value: true, message: '이름은 필수입니다' }
  }
}
```

### After (새로운 방식 - 필수)
```typescript
{
  mutation: {
    name: 'createUser',
    validationFields: {  // ✅ 새로운 방식
      'form.input.name': {
        required: { value: true, message: '이름은 필수입니다' }
      },
      'form.input.email': {
        required: { value: true, message: '이메일은 필수입니다' },
        patterns: [{
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: '올바른 이메일 형식이 아닙니다'
        }]
      }
    }
  }
}
```

## 데이터 흐름

1. **Form Inputs 자동 수집**: `form.inputs` 객체의 모든 데이터가 자동으로 requestBody에 포함됩니다
2. **개별 필드 검증**: `validationFields`에 설정된 각 필드가 개별적으로 검증됩니다
3. **검증 실패 시**: 첫 번째 실패한 필드의 에러 메시지가 토스트로 표시됩니다

## 검증 프로세스

1. ButtonBuilder가 `mutation.validationFields`가 있는지 확인
2. 있으면 각 필드별로 `validateSingleField` 함수로 검증
3. 모든 필드가 통과하면 `useMutation`으로 API 호출
4. 실패하면 에러 메시지와 함께 버튼 비활성화

## 장점

1. **필드별 개별 검증**: 각 필드마다 다른 검증 규칙 적용 가능
2. **명확한 에러 메시지**: 각 검증 규칙별로 구체적인 에러 메시지 설정
3. **타입 안전성**: TypeScript로 완전한 타입 지원
4. **코드 간소화**: 복잡한 기존 로직이 단순하고 명확한 구조로 변경
5. **확장성**: 새로운 validation 규칙 쉽게 추가 가능
