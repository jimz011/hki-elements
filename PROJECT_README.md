# HKI Elements - Development Repository

This repository contains the source code and build tools for the HKI Elements bundle.

## 📁 Project Structure

```
hki-elements/
├── src/                          # 📝 Edit these files!
│   ├── _bundle-header.js         # Bundle header with version
│   ├── hki-header-card.js        # Individual card sources
│   ├── hki-button-card.js
│   ├── hki-navigation-card.js
│   ├── hki-notification-card.js
│   └── hki-postnl-card.js
│
├── dist/                         # 🤖 Auto-generated
│   ├── hki-elements.js           # Optimized bundle
│   └── hki-elements-verbose.js   # Verbose bundle
│
├── scripts/                      # 🔧 Build tools
│   ├── build.sh                  # Bundle builder
│   └── update-version.sh         # Version updater
│
├── hki-elements.js               # 📦 Main bundle (for HACS)
├── README.md                     # User documentation
├── DEVELOPMENT.md                # Developer guide
└── hacs.json                     # HACS configuration
```

## 🚀 Quick Start for Developers

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/hki-elements.git
cd hki-elements
```

### 2. Make Your Changes

Edit the individual card files in `src/`:

```bash
# Edit a single card
vim src/hki-button-card.js
```

### 3. Build the Bundle

```bash
./scripts/build.sh
```

This creates:
- `dist/hki-elements.js` - Optimized bundle
- `dist/hki-elements-verbose.js` - Verbose bundle  
- `hki-elements.js` - Copy in root for HACS

### 4. Test Locally

```bash
# Copy to your Home Assistant
cp hki-elements.js /path/to/homeassistant/config/www/

# Or use scp for remote
scp hki-elements.js user@homeassistant:/config/www/
```

Then clear cache (Ctrl+Shift+R) and test!

## 📖 Documentation

- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Complete development guide
- **[README.md](README.md)** - User-facing documentation
- **[MIGRATION.md](MIGRATION.md)** - Migration from individual cards
- **[WHY_BUNDLE.md](WHY_BUNDLE.md)** - Benefits of bundling
- **[QUICKSTART.md](QUICKSTART.md)** - Quick reference

## 🔨 Common Tasks

### Update a Single Card

```bash
# Edit the card
vim src/hki-button-card.js

# Rebuild
./scripts/build.sh

# Commit
git add src/hki-button-card.js dist/ hki-elements.js
git commit -m "Fix: Button card popup issue"
git push
```

### Release a New Version

```bash
# Update version everywhere
./scripts/update-version.sh 1.1.0

# Edit CHANGELOG.md to document changes
vim CHANGELOG.md

# Rebuild
./scripts/build.sh

# Commit and tag
git commit -am "Release v1.1.0"
git tag v1.1.0
git push && git push --tags
```

### Add a New Card

```bash
# Add the card file
cp /path/to/new-card.js src/

# Update build script
vim scripts/build.sh
# Add "new-card.js" to the CARDS array

# Rebuild and test
./scripts/build.sh

# Commit
git add src/new-card.js scripts/build.sh dist/ hki-elements.js
git commit -m "Add: New Card"
```

## ⚙️ Build Scripts

### build.sh

Combines all cards from `src/` into a single bundle:

```bash
./scripts/build.sh
```

Output:
- `dist/hki-elements.js` - Optimized (minimal console output)
- `dist/hki-elements-verbose.js` - Verbose (all console logs)
- `hki-elements.js` - Root copy for HACS

### update-version.sh

Updates version numbers across all files:

```bash
./scripts/update-version.sh 1.2.0
```

Updates:
- `src/_bundle-header.js`
- `README.md`
- `CHANGELOG.md`

## 🧪 Testing

### Local Testing

1. Build the bundle: `./scripts/build.sh`
2. Copy to HA: `cp hki-elements.js ~/homeassistant/www/`
3. Clear browser cache (Ctrl+Shift+R)
4. Test the cards

### Verify Build

The build script shows verification info:

```
Custom elements: 10      (5 cards + 5 editors)
Card registrations: 5    (window.customCards)
Console banners: 1       (just the main bundle banner)
```

## 📦 What Gets Distributed

Users install `hki-elements.js` which contains:

1. **Bundle Header** (20 lines)
   - Version banner
   - Lit import (once)
   - Global setup

2. **Five Cards** (~23,000 lines total)
   - HKI Header Card
   - HKI Button Card
   - HKI Navigation Card
   - HKI Notification Card
   - HKI PostNL Card

All with individual Lit imports removed (shared from header).

## 🔄 Workflow

```
Edit Source          Build Bundle         Test Locally         Commit & Release
────────────────────────────────────────────────────────────────────────────────
src/*.js      →      ./scripts/build.sh   →   Copy to HA    →   git commit
                                                                  git tag
                                                                  git push
```

## ✅ Best Practices

1. **Never edit `dist/` or root `hki-elements.js`** - They're auto-generated
2. **Always rebuild before committing** - `./scripts/build.sh`
3. **Test locally first** - Don't push broken code
4. **Update CHANGELOG.md** - Document all changes
5. **Use semantic versioning** - Major.Minor.Patch

## 🐛 Troubleshooting

### Build script fails

```bash
# Check file exists
ls -la src/

# Make script executable
chmod +x scripts/build.sh

# Run with debug output
bash -x scripts/build.sh
```

### Bundle doesn't work in HA

1. Check browser console for errors
2. Verify all custom elements registered
3. Clear browser cache completely
4. Check file was copied correctly

### Card not updating

1. Hard refresh (Ctrl+Shift+R)
2. Check resource URL in HA
3. Verify bundle was rebuilt
4. Check file timestamps

## 📚 Resources

- [Home Assistant Custom Cards](https://developers.home-assistant.io/docs/frontend/custom-ui/lovelace-custom-card/)
- [LitElement Documentation](https://lit.dev/)
- [HACS Documentation](https://hacs.xyz/)

## 🤝 Contributing

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed development guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

**Maintainer:** [Jimmy](https://github.com/jimz011)  
**Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/hki-elements/issues)
