# Visual Workflow Diagram

## Your Development Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT CYCLE                         │
└─────────────────────────────────────────────────────────────┘

    1. EDIT SOURCE                2. BUILD BUNDLE
    ───────────────              ────────────────

    📝 src/                      🔧 ./scripts/build.sh
    │                                    │
    ├── hki-header-card.js              │
    ├── hki-button-card.js      ────────┴────────
    ├── hki-navigation-card.js   Combines all    
    ├── hki-notification-card.js  into bundle    
    └── hki-postnl-card.js       Removes imports 
         │                       Adds sections   
         │                                │
         │                                │
         └────── Edit one or ─────────────┘
                  multiple                
                                          
                                          
    3. OUTPUT GENERATED          4. TEST LOCALLY
    ────────────────            ─────────────────

    📦 dist/                     💻 Home Assistant
    │                                    │
    ├── hki-elements.js                 │
    │   (optimized)             Copy bundle file
    │                                    │
    ├── hki-elements-verbose.js         │
    │   (with all logs)          ~/homeassistant/
    │                             config/www/
    └── ../hki-elements.js               │
        (root copy for HACS)             │
                                  Clear cache (Ctrl+Shift+R)
                                         │
                                  Test your changes
                                         │
                                         │
    5. COMMIT & RELEASE          6. USERS GET UPDATE
    ────────────────            ──────────────────

    🔖 Git                       📥 HACS
    │                                    │
    ├── git add src/file.js             │
    ├── git add dist/                   │
    ├── git add hki-elements.js  Auto-detects new
    ├── git commit -m "..."       release tag    
    └── git tag v1.1.0                  │
         │                               │
         └──── git push ─────────> GitHub releases
                                         │
                                         │
                                  Users click update
                                         │
                                  All 5 cards updated!


═══════════════════════════════════════════════════════════════

## Comparison: Before vs After

### BEFORE (Single Giant File)

┌─────────────────────────────────────────┐
│  hki-elements.js (23,813 lines)         │
│                                         │
│  // Header Card - lines 1-4600         │
│  // Button Card - lines 4601-17100     │
│  // Navigation Card - lines 17101-...  │
│  // Notification Card - lines ...      │
│  // PostNL Card - lines ...            │
│                                         │
│  To edit button card:                  │
│  - Find line 4601                      │
│  - Scroll through 12,500 lines         │
│  - Make changes                        │
│  - Hope you didn't break anything      │
└─────────────────────────────────────────┘


### AFTER (Organized Source Files)

┌──────────────────────────────────────────┐
│  src/                                    │
│  ├── hki-header-card.js (4,600 lines)   │
│  ├── hki-button-card.js (12,500 lines)  │  ← Just open this!
│  ├── hki-navigation-card.js             │
│  ├── hki-notification-card.js           │
│  └── hki-postnl-card.js                 │
│                                          │
│  To edit button card:                   │
│  - Open hki-button-card.js              │
│  - Edit                                 │
│  - Run ./scripts/build.sh               │
│  - Done!                                │
└──────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════

## Directory Tree

hki-elements/
│
├── 📝 SOURCE FILES (edit these)
│   └── src/
│       ├── _bundle-header.js          Bundle header with version
│       ├── hki-header-card.js         4,600 lines - easy to edit!
│       ├── hki-button-card.js         12,500 lines - easy to edit!
│       ├── hki-navigation-card.js     2,800 lines - easy to edit!
│       ├── hki-notification-card.js   2,700 lines - easy to edit!
│       └── hki-postnl-card.js         1,100 lines - easy to edit!
│
├── 🤖 GENERATED FILES (don't edit)
│   ├── dist/
│   │   ├── hki-elements.js            Optimized bundle
│   │   └── hki-elements-verbose.js    Verbose bundle
│   └── hki-elements.js                Root copy (for HACS)
│
├── 🔧 BUILD TOOLS
│   └── scripts/
│       ├── build.sh                   Combines src/ → dist/
│       └── update-version.sh          Updates version numbers
│
├── 📚 DOCUMENTATION
│   ├── README.md                      For users
│   ├── DEVELOPMENT.md                 For you!
│   ├── PROJECT_README.md              Repository overview
│   ├── COMPLETE_SUMMARY.md            This summary
│   ├── MIGRATION.md                   Migration guide
│   ├── QUICKSTART.md                  Quick reference
│   └── WHY_BUNDLE.md                  Benefits explanation
│
└── ⚙️ CONFIGURATION
    ├── hacs.json                      HACS config
    ├── LICENSE                        MIT license
    ├── CHANGELOG.md                   Version history
    ├── info.md                        HACS sidebar
    └── .gitignore                     Git ignore rules


═══════════════════════════════════════════════════════════════

## Time Comparison

┌──────────────────────────────────────────────────────────────┐
│                      TASK TIME ANALYSIS                       │
└──────────────────────────────────────────────────────────────┘

Task: Fix a bug in button card

OLD WAY:
  1. Open hki-elements.js                    → 5 seconds
  2. Search for button card section          → 30 seconds
  3. Scroll to find the right part           → 1 minute
  4. Make changes (careful not to break!)    → 5 minutes
  5. Save and test                           → 30 seconds
  ────────────────────────────────────────────────────────
  TOTAL: ~7 minutes


NEW WAY:
  1. Open src/hki-button-card.js             → 2 seconds
  2. Find the bug (smaller file)             → 20 seconds
  3. Make changes (isolated)                 → 2 minutes
  4. Run ./scripts/build.sh                  → 2 seconds
  5. Test                                    → 30 seconds
  ────────────────────────────────────────────────────────
  TOTAL: ~3 minutes

SAVINGS: 4 minutes per edit × many edits = LOTS of time saved!


═══════════════════════════════════════════════════════════════

## Build Process Visualization

INPUT                   PROCESS                    OUTPUT
─────                   ───────                    ──────

src/_bundle-header.js ──┐
                        │
src/hki-header-card.js ─┤
                        │
src/hki-button-card.js ─┤    ┌──────────────┐
                        ├───→│  build.sh    │───→ dist/hki-elements.js
src/hki-navigation-... ─┤    │              │        (optimized)
                        │    │ • Combine    │
src/hki-notification.. ─┤    │ • Remove     │───→ dist/hki-elements-verbose.js
                        │    │   imports    │        (with logs)
src/hki-postnl-card.js ─┘    │ • Optimize   │
                             │              │───→ hki-elements.js
                             └──────────────┘        (root copy)

                                  ↓

                            23,813 lines
                             1.1 MB
                          All 5 cards ready!


═══════════════════════════════════════════════════════════════

## Git Workflow

FEATURE BRANCH                 MAIN BRANCH                 GITHUB
──────────────                ────────────                ───────

Edit src/file.js ─────┐
                      │
Run build.sh ─────────┤
                      │
Test locally ─────────┤
                      │
git add src/ dist/ ───┤
                      │       git checkout main
git commit ───────────┼──────→ git merge feature ────→ git push
                      │        
                      │        git tag v1.1.0 ───────→ git push --tags
                      │                                     │
                      └────────────────────────────────────┤
                                                           │
                                                    GitHub Release
                                                           │
                                                      HACS notifies
                                                       users!


═══════════════════════════════════════════════════════════════

This structure gives you:
✅ Easy editing (individual files)
✅ Fast building (2 seconds)
✅ Clean git history (small diffs)
✅ Simple distribution (single bundle)
✅ Happy users (easy updates)
✅ Happy developer (that's you!)
