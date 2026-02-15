#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  HKI Elements Bundle Builder${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Directories
SRC_DIR="src"
DIST_DIR="dist"
SCRIPTS_DIR="scripts"

# Output files
BUNDLE_FILE="$DIST_DIR/hki-elements.js"
VERBOSE_FILE="$DIST_DIR/hki-elements-verbose.js"

# Card files in order
CARDS=(
    "hki-header-card.js"
    "hki-button-card.js"
    "hki-navigation-card.js"
    "hki-notification-card.js"
    "hki-postnl-card.js"
)

# Create dist directory if it doesn't exist
mkdir -p "$DIST_DIR"

# Function to process a card file (remove Lit imports)
process_card() {
    local file=$1
    local cardname=$(basename "$file" .js)

    echo ""
    echo "// ============================================================"
    echo "// $cardname"
    echo "// ============================================================"
    echo ""
    echo "(() => {"

    sed -E '
        /^import.*from.*lit.*module/d
    ' "$file"

    echo ""
    echo "})();"
}


# Function to create verbose bundle (with all console.info)
create_verbose_bundle() {
    echo -e "${YELLOW}Creating verbose bundle...${NC}"
    
    # Start with bundle header
    cat "$SRC_DIR/_bundle-header.js" > "$VERBOSE_FILE"
    
    # Append each card
    for card in "${CARDS[@]}"; do
        if [ -f "$SRC_DIR/$card" ]; then
            echo -e "  ${GREEN}✓${NC} Adding $card"
            process_card "$SRC_DIR/$card" >> "$VERBOSE_FILE"
        else
            echo -e "  ${RED}✗${NC} Warning: $card not found in $SRC_DIR"
        fi
    done
    
    echo -e "${GREEN}✓ Verbose bundle created: $VERBOSE_FILE${NC}"
}

# Function to create optimized bundle (minimal console output)
create_optimized_bundle() {
    echo -e "${YELLOW}Creating optimized bundle...${NC}"
    
    # First create verbose bundle
    create_verbose_bundle
    
    # Then optimize it
    cp "$VERBOSE_FILE" "$BUNDLE_FILE"
    
    # Comment out individual card banners but keep main bundle banner and important messages
    sed -i '
        # Skip lines 1-20 (bundle header area)
        1,20 b
        # Skip the navigation card migration message
        /Auto-migrated config/b
        # Comment out other console.info calls
        s/^console\.info(/\/\/ console.info(/
        s/^  console\.info(/  \/\/ console.info(/
        s/^    console\.info(/    \/\/ console.info(/
    ' "$BUNDLE_FILE"
    
    echo -e "${GREEN}✓ Optimized bundle created: $BUNDLE_FILE${NC}"
    
    # Copy main bundle to root for HACS
    cp "$BUNDLE_FILE" "hki-elements.js"
    echo -e "${GREEN}✓ Copied to root: hki-elements.js${NC}"
}

# Main build process
echo -e "${YELLOW}Source directory: $SRC_DIR${NC}"
echo -e "${YELLOW}Output directory: $DIST_DIR${NC}"
echo ""

# Check for source files
echo -e "${YELLOW}Checking source files...${NC}"
for card in "${CARDS[@]}"; do
    if [ -f "$SRC_DIR/$card" ]; then
        echo -e "  ${GREEN}✓${NC} $card found"
    else
        echo -e "  ${RED}✗${NC} $card missing"
        exit 1
    fi
done
echo ""

# Create bundles
create_optimized_bundle

# Show results
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Build Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}Bundle Statistics:${NC}"
echo -e "  Optimized: $(wc -l < "$BUNDLE_FILE") lines, $(du -h "$BUNDLE_FILE" | cut -f1)"
echo -e "  Verbose:   $(wc -l < "$VERBOSE_FILE") lines, $(du -h "$VERBOSE_FILE" | cut -f1)"
echo ""
echo -e "${YELLOW}Verification:${NC}"
echo -e "  Custom elements: $(grep -c "customElements.define" "$BUNDLE_FILE")"
echo -e "  Card registrations: $(grep -c "window.customCards.push" "$BUNDLE_FILE")"
echo -e "  Console banners: $(grep "^console.info" "$BUNDLE_FILE" | wc -l)"
echo ""
echo -e "${GREEN}✓ Ready for distribution!${NC}"
echo -e "  Main bundle: ${BLUE}$BUNDLE_FILE${NC}"
echo -e "  Verbose bundle: ${BLUE}$VERBOSE_FILE${NC}"
echo ""
