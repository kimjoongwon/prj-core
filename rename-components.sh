#!/bin/bash

# Find all ComponentName/ComponentName.tsx files and rename them to ComponentName/index.tsx
# Also update import/export statements in other files

echo "Starting component file renaming process..."

# Find all ComponentName/ComponentName.tsx files
FILES=$(find /Users/wallykim/dev/prj-core -type f -name "*.tsx" -path "*/packages/shared-frontend/src/components/*" | grep -E "([^/]+)/\1\.tsx$")

COMPONENTS=()

# Process each file
for file in $FILES; do
    # Extract the directory and component name
    dir=$(dirname "$file")
    component_name=$(basename "$dir")
    
    echo "Processing: $component_name"
    
    # Rename the file to index.tsx
    new_file="$dir/index.tsx"
    
    if [ -f "$new_file" ]; then
        echo "  Warning: $new_file already exists, skipping..."
        continue
    fi
    
    mv "$file" "$new_file"
    echo "  Renamed: $file -> $new_file"
    
    # Store component name for later export updates
    COMPONENTS+=("$component_name")
done

echo "File renaming completed!"
echo ""
echo "Now updating export statements in index.ts files..."

# Update export statements in index.ts files
# Look for exports like: export * from './ComponentName/ComponentName';
# And change them to: export * from './ComponentName';

INDEX_FILES=$(find /Users/wallykim/dev/prj-core -type f -name "index.ts" -o -name "index.tsx")

for component in "${COMPONENTS[@]}"; do
    echo "Updating exports for component: $component"
    
    for index_file in $INDEX_FILES; do
        if grep -q "from '\.\/$component\/$component'" "$index_file" 2>/dev/null; then
            echo "  Updating: $index_file"
            sed -i '' "s/from '\.\/$component\/$component'/from '\.\/$component'/g" "$index_file"
        fi
        
        # Also handle relative paths with more depth
        if grep -q "from '\([^']*\)\/$component\/$component'" "$index_file" 2>/dev/null; then
            echo "  Updating relative path in: $index_file"
            sed -i '' "s/from '\([^']*\)\/$component\/$component'/from '\1\/$component'/g" "$index_file"
        fi
    done
done

echo "Export statement updates completed!"
echo ""

echo "Now updating import statements in all files..."

# Update import statements in all TypeScript files
ALL_FILES=$(find /Users/wallykim/dev/prj-core -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/.next/*")

for component in "${COMPONENTS[@]}"; do
    echo "Updating imports for component: $component"
    
    for file in $ALL_FILES; do
        # Check for imports that reference ComponentName/ComponentName
        if grep -q "from.*$component\/$component" "$file" 2>/dev/null; then
            echo "  Updating imports in: $file"
            
            # Handle various import patterns
            sed -i '' "s/from '\([^']*\)\/$component\/$component'/from '\1\/$component'/g" "$file"
            sed -i '' "s/from \"\([^\"]*\)\/$component\/$component\"/from \"\1\/$component\"/g" "$file"
        fi
    done
done

echo "Import statement updates completed!"
echo ""
echo "Process finished successfully!"

echo ""
echo "Summary of renamed components:"
for component in "${COMPONENTS[@]}"; do
    echo "  - $component"
done
