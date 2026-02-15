# HKI Header Card
A fully customizable header card for Home Assistant with support for backgrounds, person tracking, weather displays, datetime information, and flexible top bar layouts.

***NOTE: HKI Cards were created for use with the visual editor in Home Assistant, it is possible that the documentation is not complete for all features when using YAML instead. If you think this documentation is missing something or needs editing, please open an issue or create a PR with the changes.***

## Features

### 🎨 Visual Customization
- **Background Images** - Full control over images, gradients, and solid colors with positioning and sizing options
- **Gradient Blending** - Seamless bottom gradient that blends into your theme
- **Custom Colors** - Complete color control for all text and UI elements
- **Typography** - Multiple font families, weights, sizes, and styles
- **Borders & Shadows** - Customizable card borders, radius, and box shadows

### 📊 Information Display
- **Weather Integration** - Current conditions with animated colored icons, temperature, humidity, wind, and pressure
- **Date & Time** - Flexible formatting with custom locales, timezones, and display options
- **Person Tracking** - Avatar display with home/away status, grayscale effects, and custom borders
- **Jinja2 Templates** - Dynamic content using Home Assistant's powerful template engine

### 🎯 Layout Options
- **Top Bar Slots** - Three independently configurable positions (left, center, right)
- **Slot Types** - Weather, datetime, buttons, notifications, custom cards or spacers
- **Per-Slot Styling** - Override global styling for individual slots
- **Responsive Design** - Mobile-friendly with customizable breakpoints and offsets
- **Fixed or Scrolling** - Keep header pinned to top or let it scroll naturally

### 🎬 Interactivity
- **Action Support** - Tap, hold, and double-tap actions on all slots and person avatars
- **Browser Mod Integration** - Fire DOM events for popups and browser-wide actions
- **Service Calls** - Call any Home Assistant service with custom data
- **Navigation** - Quick navigation to views, URLs, or trigger more-info dialogs
- **Per-Person Actions** - Individual tap/hold/double-tap actions for each person entity





