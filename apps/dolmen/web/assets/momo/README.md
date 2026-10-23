# MOMO 웹 자산

MOMO v3의 원본 비율·목·팔과 Empty 부모 계층을 유지한 Dolmen용 실시간 3D 자산이다. 브라우저는 `public/momo/momo.glb`와 로딩·WebGL 실패 시 표시할 `public/momo/poster.webp`만 읽는다. 이 폴더의 Blender 원본과 재생성 도구는 공개 정적 파일에 포함하지 않는다.

## 원본과 재생성

입력은 `source/MOMO-hamster-v3.blend` 사본이다. 원본 SHA-256은 `7d31bcc8f74816def1bcf52694192695a0855b3b67e3ea05d1555403e7839640`이다. 원래 제작 경로는 `/Users/wallykim/dev/hamster-assistant/MOMO-hamster-v3.blend`이며 생성 도구는 이 사본만 연다. GUI에서 열려 있는 장면과 원본 파일을 저장하지 않는다.

Blender **5.2.2 LTS**, Python 3, `cwebp`가 필요하다. 저장소 루트에서 실행한다.

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --disable-autoexec --python apps/dolmen/web/assets/momo/build_momo.py
python3 apps/dolmen/web/assets/momo/verify_momo.py
node apps/dolmen/web/assets/momo/verify_runtime.mjs
```

`build_momo.py`는 GLB, WebP, `export-report.json`을 생성한다. `verify_momo.py`는 Blender와 독립적인 표준 Python 검사기로 GLB 바이너리와 WebP를 직접 읽고 `validation-report.json`을 생성한다. 중간 PNG는 Git에서 제외한 `.build/`에만 남긴다. 동일 Blender·원본·스크립트의 재생성 결과는 GLB SHA와 보고서의 수치를 비교한다.

웹 의존성을 설치한 뒤 `verify_runtime.mjs`로 실제 Three.js GLTFLoader 로딩·6개 clip 재생·crossfade도 확인할 수 있다. Node에서 실행하는 검사이므로 브라우저 렌더링이나 FPS를 측정하지 않는다.

## 모델 변환 계약

- Studio 받침·바닥·조명·카메라를 GLB에서 제외한다. 캐릭터 원점과 스케일은 유지하며 glTF의 Y-up으로 변환한다. 얼굴 앞쪽은 +Z다.
- native `CURVES` 19개, 136,500가닥에서 각 객체의 기존 가닥 인덱스 `0, 20, 40…`만 선택한다. 난수 재추첨 없이 정확히 **6,825가닥**을 사용한다.
- 가닥은 원래 길이·반지름을 유지하고 길이 기준 root/mid/tip 3점으로 재표본화한다. 삼각 단면 2개와 단일 tip, root cap을 포함해 **가닥당 7정점·10삼각형**, 총 **68,250삼각형**이다. 기존 털 파트당 하나의 메시로 합치고 원래 Empty 부모·로컬 변환을 유지한다.
- 털은 biscuit/vanilla/peach의 공유 불투명 PBR 재질 3개를 쓴다. alpha 카드·Hair 셰이더·텍스처는 사용하지 않는다. 브라우저의 털 메시에는 실시간 그림자를 추가하지 않는다.
- 본체의 기존 modifier와 수염·입 곡선을 먼저 메시로 평가한다. 작은 요소와 눈은 유지하고 큰 메시를 Collapse Decimate하여 **본체 70,000삼각형 이하**를 맞춘다. 원본 mesh/curve 형상은 다시 모델링하지 않는다.
- 합격 기준은 **전체 150,000삼각형 이하**, **GLB 5 MiB 이하**다. 생성기의 개수와 내보낸 GLB의 개수를 별도로 대조한다.

털 밀도와 재질은 Cycles 원본의 고밀도 털을 웹에 맞춘 근사 표현이다. 원본의 가닥 수와 셰이더가 그대로 재현되는 것은 아니다.

## 애니메이션 계약

모든 clip은 24fps, 정확히 **0–4초**, 10개 Empty의 translation/rotation/scale **30채널**을 가진다. 원본 타임라인의 96개 샘플을 0–95/24초에 베이크하고 4초 종단 키를 추가한다. 회전은 quaternion이다. 각 Empty에 이름이 같은 NLA track을 만들고 `NLA_TRACKS` 모드에서 하나의 glTF animation으로 합친다. 상수 채널도 유지하여 상태 전환 때 이전 포즈가 남지 않게 한다. 상수 채널의 STEP 최적화만 허용하며 변하는 채널은 LINEAR다.

| clip 이름 | 원본 프레임(양 끝 포함) | 재생 | 4초 종단 키 |
|---|---|---|---|
| `idle` | 1–96 | 반복 | 첫 포즈 복제 |
| `hello` | 97–192 | 1회 | 마지막 포즈 복제 |
| `listen` | 193–288 | 반복 | 첫 포즈 복제 |
| `think` | 289–384 | 반복 | 첫 포즈 복제 |
| `happy` | 385–480 | 1회 | 마지막 포즈 복제 |
| `speak` | 481–576 | 반복 | 첫 포즈 복제 |

웹은 GLB의 이름 있는 clip을 직접 사용한다. 런타임 프레임 구간 분할은 필요 없다. `hello`·`happy`는 완료 후 `idle`로 돌아가며, 다른 상태 전환에는 약 0.2초 crossfade를 사용할 수 있다. `speak`는 몸짓 루프이며 음성·입 모양 동기화는 포함하지 않는다. 반복 clip의 첫/끝 TRS 일치 여부는 검사기가 검증한다.

## 좌표와 카메라

전체 6개 애니메이션을 프레임별로 평가한 glTF 좌표 bounds는 `export-report.json`에 기록한다. 현재 범위는 대략 min `[-1.2144, -0.0028, -0.9006]`, max `[1.2256, 2.9183, 0.9511]`이고, 중심은 `[0.0056, 1.4578, 0.0253]`이다. 크기는 `[2.4400, 2.9211, 1.8518]`이다.

정사각형 280 CSS px 위젯의 고정 원근 카메라 권장값은 position `[0, 1.46, 6.0]`, target `[0, 1.46, 0]`, 수직 FOV `32°`, near `0.1`, far `30`이다. happy의 점프와 hello의 손짓까지 화면 안에 두도록 여백을 확보했다. 포스터도 같은 카메라로 560×560, 투명 배경에서 웹 변환 메시를 렌더링한다.

## 검증 범위

`validation-report.json`에는 실제 GLB byte 수·SHA·내보낸 삼각형·유한 좌표/법선·인덱스 범위·불투명 재질·내장 버퍼·6개 clip 이름/길이/채널·반복 경계·WebP 크기 검사 결과가 있다. `.blend` 파일 크기와 GLB 크기는 별도 값이다.

브라우저 **30FPS 이상**의 판정은 M4 Max·고정 카메라·280px 위젯에서 별도로 수행한다. 이 파일 검사나 Blender의 Cycles 렌더 시간은 브라우저 FPS를 증명하지 않는다. 다른 기기의 성능은 해당 기기에서 측정하기 전까지 미검증이다.
