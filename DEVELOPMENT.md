# Development Guide

This guide explains how to develop and maintain HKI Elements cards.

## Project Structure

```
hki-elements/
├── src/                          # Source files (edit these!)
│   ├── _bundle-header.js         # Bundle header with version
│   ├── hki-header-card.js        # Individual card files
│   ├── hki-button-card.js
│   ├── hki-navigation-card.js
│   ├── hki-notification-card.js
│   └── hki-postnl-card.js
│
├── dist/                         # Built bundles (auto-generated)
│   ├── hki-elements.js           # Main bundle (optimized)
│   └── hki-elements-verbose.js   # Verbose bundle (all logs)
│
├── scripts/                      # Build scripts
│   ├── build.sh                  # Bundle builder
│   └── update-version.sh         # Version updater
│
├── docs/                         # Documentation (optional)
│
├── README.md                     # Main documentation
├── CHANGELOG.md                  # Version history
├── hacs.json                     # HACS configuration
└── LICENSE                       # MIT License
```

## Development Workflow

### 1. Make Changes to Individual Cards

Edit the card files directly in the `src/` directory:

```bash
# Edit a single card
vim src/hki-button-card.js

# Or use your favorite editor
code src/hki-header-card.js
```

**Important:** Never edit files in `dist/` - they are auto-generated!

### 2. Build the Bundle

After making changes, rebuild the bundle:

```bash
./scripts/build.sh
```

This will:
- Combine all cards from `src/` into a single bundle
- Remove duplicate Lit imports
- Create both optimized and verbose versions
- Show statistics

### 3. Test Locally

Copy the bundle to your Home Assistant for testing:

```bash
# Copy to Home Assistant www folder
cp dist/hki-elements.js /path/to/homeassistant/config/www/

# Or if using Docker/Remote Assistant
scp dist/hki-elements.js user@homeassistant:/config/www/
```

Then in Home Assistant:
1. Clear browser cache (Ctrl+Shift+R)
2. Reload the dashboard
3. Test all affected cards

### 4. Commit Changes

```bash
# Stage your changes (only src/ files!)
git add src/hki-button-card.js

# Rebuild bundle
./scripts/build.sh

# Stage the built bundles
git add dist/

# Commit
git commit -m "Fix: Button card popup styling issue"

# Push
git push
```

## Updating Versions

### For Bug Fixes (1.0.0 → 1.0.1)

```bash
# Update version everywhere
./scripts/update-version.sh 1.0.1

# Edit CHANGELOG.md to document the fix
vim CHANGELOG.md

# Rebuild
./scripts/build.sh

# Commit and tag
git commit -am "Release v1.0.1"
git tag v1.0.1
git push && git push --tags
```

### For New Features (1.0.0 → 1.1.0)

```bash
# Update version
./scripts/update-version.sh 1.1.0

# Edit CHANGELOG.md
vim CHANGELOG.md

# Rebuild
./scripts/build.sh

# Commit and tag
git commit -am "Release v1.1.0"
git tag v1.1.0
git push && git push --tags
```

### For Breaking Changes (1.0.0 → 2.0.0)

```bash
# Update version
./scripts/update-version.sh 2.0.0

# Edit CHANGELOG.md with migration notes
vim CHANGELOG.md

# Rebuild
./scripts/build.sh

# Commit and tag
git commit -am "Release v2.0.0"
git tag v2.0.0
git push && git push --tags
```

## Adding a New Card

To add a new card to the bundle:

### 1. Add the Card File

```bash
# Add your new card to src/
cp /path/to/hki-newcard.js src/
```

### 2. Update Build Script

Edit `scripts/build.sh` and add your card to the `CARDS` array:

```bash
CARDS=(
    "hki-header-card.js"
    "hki-button-card.js"
    "hki-navigation-card.js"
    "hki-notification-card.js"
    "hki-postnl-card.js"
    "hki-newcard.js"        # Add this line
)
```

### 3. Update Documentation

Update README.md to list the new card:

```markdown
6. **HKI New Card** - Description of what it does
```

### 4. Build and Test

```bash
./scripts/build.sh
# Test the bundle
```

### 5. Update Version

```bash
./scripts/update-version.sh 1.1.0
./scripts/build.sh
git commit -am "Add HKI New Card"
git tag v1.1.0
git push && git push --tags
```

## Build Script Details

The `build.sh` script does the following:

1. **Reads bundle header** from `src/_bundle-header.js`
2. **Processes each card**:
   - Removes `import` statements (Lit is already imported in header)
   - Adds section separator comments
   - Preserves all other code
3. **Creates two bundles**:
   - `dist/hki-elements.js` - Optimized (comments out individual console.info)
   - `dist/hki-elements-verbose.js` - Verbose (keeps all console.info)
4. **Verifies** the bundle (counts elements, registrations, etc.)

## Testing Tips

### Test Individual Card Changes

```bash
# Build bundle
./scripts/build.sh

# Copy to HA
cp dist/hki-elements.js ~/homeassistant/www/

# In Home Assistant:
# - Clear cache (Ctrl+Shift+R)
# - Check browser console for errors
# - Test the specific card you changed
```

### Test All Cards

Create a test dashboard with all five cards:

```yaml
views:
  - title: HKI Elements Test
    cards:
      - type: hki-header-card
        entity: person.your_name
        
      - type: hki-button-card
        entity: light.test
        
      - type: hki-navigation-card
        items:
          - entity: light.test
            
      - type: hki-notification-card
        entity: sensor.test
        
      - type: hki-postnl-card
        entities:
          - sensor.test
```

### Debug Build Issues

```bash
# Verbose output
bash -x ./scripts/build.sh

# Check for syntax errors
node --check dist/hki-elements.js

# Check for specific content
grep "customElements.define" dist/hki-elements.js
```

## Common Tasks

### Update Just One Card

```bash
# Edit the card
vim src/hki-button-card.js

# Rebuild
./scripts/build.sh

# Test
cp dist/hki-elements.js ~/homeassistant/www/
```

### Update Multiple Cards

```bash
# Edit multiple cards
vim src/hki-button-card.js
vim src/hki-header-card.js

# Rebuild once
./scripts/build.sh

# Test
cp dist/hki-elements.js ~/homeassistant/www/
```

### Fix a Bug Quickly

```bash
# Fix the bug in source
vim src/hki-notification-card.js

# Build
./scripts/build.sh

# Test locally first!
cp dist/hki-elements.js ~/homeassistant/www/
# Verify fix works

# Commit
git add src/hki-notification-card.js dist/
git commit -m "Fix: Notification marquee speed calculation"

# Create patch release
./scripts/update-version.sh 1.0.1
./scripts/build.sh
git add .
git commit -m "Release v1.0.1"
git tag v1.0.1
git push && git push --tags
```

## Best Practices

### 1. Always Edit Source Files

❌ Never edit `dist/hki-elements.js`  
✅ Always edit files in `src/`

### 2. Build Before Committing

```bash
# Always rebuild before committing
./scripts/build.sh
git add src/ dist/
git commit -m "Your changes"
```

### 3. Test Locally First

- Copy bundle to HA
- Clear browser cache
- Test affected cards
- Check browser console
- Test on mobile if needed

### 4. Version Appropriately

- **Patch** (1.0.0 → 1.0.1): Bug fixes
- **Minor** (1.0.0 → 1.1.0): New features, backward compatible
- **Major** (1.0.0 → 2.0.0): Breaking changes

### 5. Document Changes

Always update CHANGELOG.md with:
- What changed
- Why it changed
- Migration notes (if breaking)

## CI/CD (Optional)

You can automate building with GitHub Actions:

Create `.github/workflows/build.yml`:

```yaml
name: Build Bundle

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Make scripts executable
      run: chmod +x scripts/*.sh
    
    - name: Build bundle
      run: ./scripts/build.sh
    
    - name: Upload bundle
      uses: actions/upload-artifact@v3
      with:
        name: hki-elements-bundle
        path: dist/hki-elements.js
```

## Troubleshooting

### Bundle is missing a card

Check that:
1. Card file exists in `src/`
2. Card is listed in `CARDS` array in `build.sh`
3. Build script completed without errors

### Card not working after build

Check:
1. Lit import was removed correctly
2. No syntax errors in console
3. Custom element is registered (check console)
4. Card appears in `window.customCards`

### Build script fails

Common issues:
- Source file missing: Add to `src/`
- Permissions: `chmod +x scripts/build.sh`
- Line endings: Check for Windows CRLF vs Unix LF

## Need Help?

- Check build output for errors
- Look at browser console
- Verify source files are correct
- Test individual cards separately
- Open an issue on GitHub

---

Happy coding! 🚀
