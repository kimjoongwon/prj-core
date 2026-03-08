#!/usr/bin/env bash
set -euo pipefail

APP_NAME=""
IMAGE_TAG=""
DEPLOY_ENV="prod"
REPO_URL="https://github.com/kimjoongwon/prj-devops.git"
WORKDIR=""
TARGET_BRANCH="main"
GIT_USER_NAME="jenkins-bot"
GIT_USER_EMAIL="jenkins-bot@cocdev.co.kr"
PUSH_RETRIES=3

fail() {
  echo "[update-gitops-image-tag] ERROR: $*" >&2
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --app)
      APP_NAME="${2:-}"
      shift 2
      ;;
    --tag)
      IMAGE_TAG="${2:-}"
      shift 2
      ;;
    --env)
      DEPLOY_ENV="${2:-}"
      shift 2
      ;;
    --repo-url)
      REPO_URL="${2:-}"
      shift 2
      ;;
    --workdir)
      WORKDIR="${2:-}"
      shift 2
      ;;
    --branch)
      TARGET_BRANCH="${2:-}"
      shift 2
      ;;
    --git-user-name)
      GIT_USER_NAME="${2:-}"
      shift 2
      ;;
    --git-user-email)
      GIT_USER_EMAIL="${2:-}"
      shift 2
      ;;
    --push-retries)
      PUSH_RETRIES="${2:-}"
      shift 2
      ;;
    *)
      fail "Unknown argument: $1"
      ;;
  esac
done

[[ -n "${APP_NAME}" ]] || fail "--app is required"
[[ -n "${IMAGE_TAG}" ]] || fail "--tag is required"
[[ "${PUSH_RETRIES}" =~ ^[0-9]+$ ]] || fail "--push-retries must be a non-negative integer"

case "${DEPLOY_ENV,,}" in
  prod|production)
    DEPLOY_ENV="prod"
    ;;
  *)
    fail "Unsupported --env '${DEPLOY_ENV}'. Currently only prod/production is supported."
    ;;
esac

case "${APP_NAME}" in
  idp-api|idp-web|core-api|admin-web|spring-api)
    VALUES_REL_PATH="helm/applications/${APP_NAME}/values-prod.yaml"
    APP_YAML_KEY="${APP_NAME}"
    ;;
  *)
    fail "Unsupported app '${APP_NAME}'. Allowed: idp-api, idp-web, core-api, admin-web, spring-api"
    ;;
esac

TMP_DIR=""
cleanup() {
  if [[ -n "${TMP_DIR}" && -d "${TMP_DIR}" ]]; then
    rm -rf "${TMP_DIR}"
  fi
}
trap cleanup EXIT

if [[ -n "${WORKDIR}" ]]; then
  REPO_DIR="${WORKDIR}"
  [[ -d "${REPO_DIR}/.git" ]] || fail "WORKDIR does not look like a git checkout: ${REPO_DIR}"
else
  TMP_DIR="$(mktemp -d)"
  REPO_DIR="${TMP_DIR}/prj-devops"
  git clone --depth 1 --branch "${TARGET_BRANCH}" "${REPO_URL}" "${REPO_DIR}" >/dev/null
fi

VALUES_FILE="${REPO_DIR}/${VALUES_REL_PATH}"
[[ -f "${VALUES_FILE}" ]] || fail "Values file not found: ${VALUES_FILE}"

git -C "${REPO_DIR}" config user.name "${GIT_USER_NAME}"
git -C "${REPO_DIR}" config user.email "${GIT_USER_EMAIL}"

TMP_FILE="$(mktemp)"
if ! awk -v app_key="${APP_YAML_KEY}" -v new_tag="${IMAGE_TAG}" '
  BEGIN { in_app = 0; replaced = 0 }
  {
    line = $0

    if (line ~ "^" app_key ":[[:space:]]*$") {
      in_app = 1
      print line
      next
    }

    if (in_app && line ~ "^[^[:space:]#].*:[[:space:]]*$") {
      in_app = 0
    }

    if (in_app && replaced == 0 && line ~ "^[[:space:]]+tag:[[:space:]]*\"?[^\"[:space:]]+\"?") {
      sub(/tag:[[:space:]]*\"?[^\"[:space:]]+\"?/, "tag: \"" new_tag "\"", line)
      replaced = 1
    }

    print line
  }
  END {
    if (replaced == 0) {
      exit 2
    }
  }
' "${VALUES_FILE}" > "${TMP_FILE}"; then
  rm -f "${TMP_FILE}"
  fail "Failed to update image tag for app '${APP_NAME}' in ${VALUES_FILE}"
fi

mv "${TMP_FILE}" "${VALUES_FILE}"

git -C "${REPO_DIR}" add "${VALUES_REL_PATH}"
if git -C "${REPO_DIR}" diff --cached --quiet; then
  echo "[update-gitops-image-tag] No changes detected. Skipping commit/push."
  exit 0
fi

git -C "${REPO_DIR}" commit -m "chore(gitops): bump ${APP_NAME} image tag to ${IMAGE_TAG}" >/dev/null

for attempt in $(seq 0 "${PUSH_RETRIES}"); do
  if git -C "${REPO_DIR}" push origin "${TARGET_BRANCH}" >/dev/null 2>&1; then
    echo "[update-gitops-image-tag] Pushed ${APP_NAME}:${IMAGE_TAG} to ${TARGET_BRANCH}"
    exit 0
  fi

  if [[ "${attempt}" -lt "${PUSH_RETRIES}" ]]; then
    sleep_seconds=$((attempt + 1))
    echo "[update-gitops-image-tag] Push failed. Retrying in ${sleep_seconds}s..." >&2
    sleep "${sleep_seconds}"
  fi
done

fail "Push failed after ${PUSH_RETRIES} retries"
