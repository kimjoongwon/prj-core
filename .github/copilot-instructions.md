<!-- 리펙토링 규칙

1. onPress아 prefix로 붙어 있으면 useHanlders.ts 파일을 동일 경로에 만들고 그 안에 넣어서 사용한다.

2. react-query hook 응답 데이터 변수명은 예를들면 const { data: 쿼리명Response } = use쿼리명()
   이 되어야한다.(get과 같은 동사도 포함 use를 뺀 전부)


Dto 생성 규칙
1. implements interface인 entity로 끝나는 class에 필드를 type까지 정확히 선언한다.

1. field.decorators.ts와 dtos 폴더에 있는 것들을 참고하여 데코레이터를 만든다

2. 필드명에 Id가 붙어 있다면 UUIDField로 시작하는 데코레이션을 만들어줘요.

3. 필드가 null을 가질수 있다면 데코레이터 옵션에 {required: false nullable: true}를 주세요.

4. interface에 존재하지 않는 필드는 제거해주세요. -->