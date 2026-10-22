# Dolmen 웹 실행과 MOMO

저장소 루트에서 의존성과 공용 패키지를 준비한 뒤 실행한다. API가 기본 포트 3012에서 실행 중이면 웹의 `/dolmen/api/*` 요청이 연결된다.

```sh
pnpm install --frozen-lockfile
pnpm exec turbo build --filter=dolmen-web^...
pnpm start:dolmen-web
```

웹 주소는 `http://localhost:3013/dolmen`이다. API 실행·모델 설정은 기존 `docs/env-reference.md`의 Dolmen 항목을 따른다.

MOMO는 데스크톱 오른쪽, 모바일 하단의 에이전트 활동 영역에 표시된다. 첫 준비 시 `hello`, 질문 입력 focus 시 `listen`, 첫 답변 조각 전에는 `think`, 답변 수신 중에는 `speak`, 정상 완료 후에는 `happy`, 나머지는 `idle`을 재생한다. `listen`과 `speak`는 텍스트 입력·답변 상태이며 음성 기능은 없다. 입력·새 요청은 일회성 모션을 중단한다.

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
