#!/bin/bash

# apps/agent와 apps/coin의 button 요소에 type="button" 추가

find apps/agent apps/coin -name "*.tsx" -type f | while read -r file; do
  # <button으로 시작하고 type=이 없는 경우 찾아서 수정
  sed -i '' 's/<button\([^>]*\)>/<button type="button"\1>/g' "$file"

  # 이미 type이 있는 경우는 원복 (중복 방지)
  sed -i '' 's/<button type="button" type="[^"]*"/<button type="button"/g' "$file"
  sed -i '' 's/type="button" \([^>]*\)type="button"/type="button" \1/g' "$file"
done

echo "Button type attributes fixed!"
