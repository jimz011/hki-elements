#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if version argument is provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage: ./scripts/update-version.sh <version>${NC}"
    echo -e "${YELLOW}Example: ./scripts/update-version.sh 1.1.0${NC}"
    exit 1
fi

NEW_VERSION=$1

echo -e "${BLUE}Updating to version $NEW_VERSION...${NC}"
echo ""

# Update bundle header
if [ -f "src/_bundle-header.js" ]; then
    sed -i "s/Version: .*/Version: $NEW_VERSION/" src/_bundle-header.js
    sed -i "s/%c v[0-9.]* %c/%c v$NEW_VERSION %c/" src/_bundle-header.js
    echo -e "${GREEN}✓${NC} Updated src/_bundle-header.js"
else
    echo -e "${YELLOW}! Warning: src/_bundle-header.js not found${NC}"
fi

# Update README
if [ -f "README.md" ]; then
    sed -i "s/Current version: \*\*.*\*\*/Current version: **$NEW_VERSION**/" README.md
    echo -e "${GREEN}✓${NC} Updated README.md"
else
    echo -e "${YELLOW}! Warning: README.md not found${NC}"
fi

# Update CHANGELOG
if [ -f "CHANGELOG.md" ]; then
    # Get current date
    DATE=$(date +%Y-%m-%d)
    
    # Replace [Unreleased] with new version
    sed -i "s/## \[Unreleased\]/## [Unreleased]\n\n### Added\n- Nothing yet\n\n### Changed\n- Nothing yet\n\n### Fixed\n- Nothing yet\n\n## [$NEW_VERSION] - $DATE/" CHANGELOG.md
    
    # Update comparison links at bottom
    sed -i "s|\[Unreleased\]:.*|[Unreleased]: https://github.com/YOUR_USERNAME/hki-elements/compare/v$NEW_VERSION...HEAD\n[$NEW_VERSION]: https://github.com/YOUR_USERNAME/hki-elements/releases/tag/v$NEW_VERSION|" CHANGELOG.md
    
    echo -e "${GREEN}✓${NC} Updated CHANGELOG.md"
    echo -e "${YELLOW}! Don't forget to edit CHANGELOG.md with actual changes${NC}"
else
    echo -e "${YELLOW}! Warning: CHANGELOG.md not found${NC}"
fi

echo ""
echo -e "${GREEN}Version updated to $NEW_VERSION${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Edit CHANGELOG.md to document changes"
echo -e "  2. Run ${BLUE}./scripts/build.sh${NC} to rebuild bundle"
echo -e "  3. Test the bundle locally"
echo -e "  4. Commit changes: ${BLUE}git commit -am 'Release v$NEW_VERSION'${NC}"
echo -e "  5. Create tag: ${BLUE}git tag v$NEW_VERSION${NC}"
echo -e "  6. Push: ${BLUE}git push && git push --tags${NC}"
echo ""
