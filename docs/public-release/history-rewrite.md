# Public 전환 전 Git 이력 정화 절차

이 문서는 이력을 실제로 변경하는 운영 절차입니다. 저장소 코드 변경만으로 자격증명이 안전해지지 않으므로 **AWS, SMTP, JWT/OIDC, DB, 관리자 계정을 먼저 폐기·재발급**하고 회전 기록을 보안 채널에 남깁니다.

## 1. 비파괴 사전검사

```bash
pnpm public-release:precheck
PUBLIC_RELEASE_ROTATION_CONFIRMED=true node scripts/public-release-readiness.mjs rewrite-precheck
```

두 번째 명령은 회전 완료를 확인하고 clean worktree, `git-filter-repo`, 제거 경로 파일을 검사할 뿐 이력을 수정하지 않습니다. `docs/public-release/filter-repo-paths.txt`에는 확인된 과거 실제 환경 파일과 debug keystore만 둡니다. 추가 개인정보와 고정 관리자 값은 저장소 밖의 비공개 `replace-text.txt`에 `literal:OLD_VALUE==>REMOVED` 형식으로 작성하고 저장소에 커밋하지 않습니다.

## 2. Mirror 백업과 격리된 rewrite

보호 브랜치와 tag를 포함한 모든 ref를 유지하기 위해 현재 작업 폴더가 아닌 임시 운영 경로에서 실행합니다.

```bash
git clone --mirror https://github.com/kimjoongwon/prj-core.git prj-core-before-public.git
cp -R prj-core-before-public.git prj-core-rewrite.git
cd prj-core-rewrite.git
git filter-repo --force --invert-paths --paths-from-file /absolute/path/to/filter-repo-paths.txt
git filter-repo --force --replace-text /absolute/private/path/to/replace-text.txt
git fsck --full
git for-each-ref --format='%(refname)' refs/heads refs/tags
```

백업 mirror는 접근 제한·암호화된 위치에 보관하고 공개 remote에 push하지 않습니다. rewrite 전후 branch/tag 목록을 비교하고 제거하려는 ref가 있으면 진행을 중단합니다.

## 3. Fresh clone 검사

정화 mirror를 먼저 별도 검증 remote에 push한 다음 hardlink를 쓰지 않는 새 clone에서 검사합니다.

```bash
git clone --no-local https://verification.example/prj-core.git /absolute/path/to/prj-core-fresh
pnpm public-release:scan-clone -- /absolute/path/to/prj-core-fresh
```

검사 명령은 내부적으로 다음과 동등한 redacted 전체 이력 검사를 수행하며 발견된 비밀값 자체는 출력하지 않습니다.

```bash
gitleaks git --redact --log-opts="--all" --report-format=json /absolute/path/to/prj-core-fresh
```

GitHub secret scanning과 push protection도 활성화하고, 제거 대상 경로·문자열이 branch, tag, unreachable blob 어디에도 남지 않았는지 별도 보안 검토합니다.

## 4. 승인된 force-push와 재동기화

fresh-clone 검사와 보안 승인이 모두 통과한 뒤에만 보호 브랜치를 일시 해제하고 rewrite mirror에서 모든 branch와 tag를 force-push합니다. 승인된 관리자 2인이 대상 remote와 ref 목록을 대조한 후 실행하며, 완료 직후 보호 설정과 push protection을 복구합니다.

기존 clone에는 오염된 object가 남으므로 재사용하거나 merge하지 않습니다. 모든 참여자는 기존 clone과 worktree를 폐기하고 새로 clone합니다. 배포·CI credential cache도 제거한 뒤 clean clone의 install/build/test 및 secret scan을 다시 통과해야 저장소 visibility를 Public으로 변경할 수 있습니다.
