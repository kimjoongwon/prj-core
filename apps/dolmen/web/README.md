# MOMO 이력서 면접 Q&A

면접관이 경력·프로젝트·기술·협업·AI 활용에 대해 질문하면 MOMO가 서버에 등록된 이력서를 근거로 지원자를 3인칭으로 소개한다. 답변은 AI가 생성하며, 이력서에 없는 내용은 추측하지 않는다. 답변에 붙은 이력서 쪽 출처와 발췌문을 함께 확인할 수 있다.

실제 PDF는 서버의 Git 제외 비공개 파일로 등록한다. 방문자의 이력서 업로드 기능은 없으며, 원문·연락처·경력 세부를 웹 소스나 테스트 데이터에 복사하지 않는다. 원본 PDF를 웹 정적 파일로 제공하지 않는다.

저장소 루트에서 의존성과 공용 패키지를 준비한 뒤 실행한다. API가 기본 포트 3012에서 실행 중이면 웹의 `/dolmen/api/*` 요청이 연결된다.

```sh
pnpm install --frozen-lockfile
pnpm exec turbo build --filter=dolmen-web^...
pnpm start:dolmen-web
```

웹 주소는 `http://localhost:3013/dolmen`이다. API 실행·모델 설정은 기존 `docs/env-reference.md`의 Dolmen 항목을 따른다.

상단 상태는 이력서 확인 중·등록 안 됨·준비 실패·상태 확인 실패를 구분한다. 준비가 확인된 경우에만 이력서의 지원자 이름과 근거 개수를 표시한다. 이력서가 없거나 준비되지 않으면 질문 오류 안내를 보여주며, 임의의 경력 정보로 대신 답하지 않는다.

MOMO는 데스크톱 오른쪽, 모바일 하단의 답변 진행 영역에 표시된다. 첫 준비 시 `hello`, 면접 질문 입력 focus 시 `listen`, 이력서 근거 확인과 첫 답변 조각 전에는 `think`, 답변 수신 중에는 `speak`, 정상 완료 후에는 `happy`, 나머지는 `idle`을 재생한다. `listen`과 `speak`는 텍스트 입력·답변 상태이며 음성 기능은 없다. 입력·새 요청은 일회성 모션을 중단한다.

동작을 줄이는 시스템 설정에서는 정지 이미지를 보여준다. 모델 로드나 WebGL이 실패해도 채팅은 계속 사용할 수 있다. 탭이 숨겨지거나 캐릭터가 화면 밖에 있으면 연속 렌더를 멈춘다.

```sh
pnpm --filter dolmen-web test --run
pnpm --filter dolmen-web type-check
pnpm --filter dolmen-web lint
pnpm build:dolmen-web
```

단위 테스트는 실제 WebGL·기기 성능을 대신하지 않는다. GLB 5MiB 이하와 준비 후 30fps 이상을 초기 목표로 두며, FPS는 대상 브라우저·기기에서 따로 측정한다. [자산 재생성·검증 절차](./assets/momo/README.md)는 자산 문서를 따른다. 자산을 다시 만들면 `src/components/momoAvatar.ts`의 전체 모션 bounds도 확인한다.

Blender·Python·cwebp가 준비된 환경에서는 저장소 루트에서 웹 자산을 재생성하고 검사한다.

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --disable-autoexec --python apps/dolmen/web/assets/momo/build_momo.py
python3 apps/dolmen/web/assets/momo/verify_momo.py
node apps/dolmen/web/assets/momo/verify_runtime.mjs
```
