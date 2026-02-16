# HKI Notification Card
A versatile Home Assistant card that displays notifications from the HKI Notify integration with multiple display modes, animations, and rich styling options.

***NOTE: HKI Cards were created for use with the visual editor in Home Assistant, it is possible that the documentation is not complete for all features when using YAML instead. If you think this documentation is missing something or needs editing, please open an issue or create a PR with the changes.***

## Requirements

This card requires the **HKI Notify Integration** to be installed:

- **[HKI Notify Integration](https://github.com/jimz011/hki-notify)** - Creates notification sensors

See the **HKI Notify Integration Documentation** for setup instructions.

## Features

### 📺 Multiple Display Modes
- **Ticker** - Auto-cycling through notifications with animations
- **Marquee** - Continuous scrolling text with auto-scroll
- **List** - Vertical stack of multiple notifications
- **Button** - Icon/pill button that opens popup on tap

### 🎬 Rich Animations
- Slide, fade, bounce, flip, zoom, rotate animations
- Customizable animation duration and direction
- Smooth transitions between notifications

### 🎨 Extensive Styling
- Per-notification colors, fonts, and borders
- Global styling with per-notification overrides
- Badge support with customizable colors
- Backdrop blur and glassmorphism effects

### ⚡ Interactive Features
- Swipe-to-dismiss notifications
- Tap actions (navigate, call service, open URL)
- Popup modal showing all notifications
- Optional confirmation dialogs

### 🔧 Integration Features
- Works with HKI Header Card
- Badge slot compatible
- Timestamp display (12h/24h/auto)
- Auto-hide when empty
- Header card styling inheritance
