리펙토링 규칙

1. onPress아 prefix로 붙어 있으면 useHanlders.ts 파일을 동일 경로에 만들고 그 안에 넣어서 사용한다.

2. react-query hook 응답 데이터 변수명은 예를들면 const { data: 쿼리명Response } = use쿼리명()
   이 되어야한다.(get과 같은 동사도 포함 use를 뺀 전부)

3.
