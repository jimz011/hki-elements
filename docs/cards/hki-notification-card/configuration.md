# Configuration

## Core Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `entity` | string | *required* | HKI Notify sensor entity ID |
| `attribute` | string | `messages` | Attribute containing notification data |
| `display_mode` | string | `ticker` | Display mode: `ticker`, `marquee`, `list`, `button` |
| `show_empty` | boolean | true | Show card when no notifications |
| `empty_message` | string | `No Notifications` | Message to display when empty |

**Example:**
```yaml
entity: sensor.hki_notify_main
display_mode: ticker
show_empty: false
```

---

### Display Mode Settings

#### Ticker Mode

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `auto_cycle` | boolean | true | Automatically cycle through notifications |
| `interval` | number | 3 | Seconds between notification changes |
| `animation` | string | `slide` | Animation: `slide`, `fade`, `bounce`, `flip`, `zoom`, `rotate` |
| `animation_duration` | number | 0.5 | Animation duration in seconds |
| `direction` | string | `right` | Animation direction: `left`, `right`, `up`, `down` |

**Example:**
```yaml
display_mode: ticker
auto_cycle: true
interval: 4
animation: slide
direction: left
animation_duration: 0.6
```

#### Marquee Mode

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `auto_scroll` | boolean | true | Auto-scroll text |
| `marquee_speed` | number | 1 | Scroll speed multiplier |
| `marquee_gap` | number | 16 | Gap between repeated text (px) |

**Example:**
```yaml
display_mode: marquee
auto_scroll: true
marquee_speed: 0.8
marquee_gap: 32
```

#### List Mode

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `list_max_items` | number | 3 | Maximum notifications to show |
| `show_list_timestamp` | boolean | false | Show timestamp in list mode |

**Example:**
```yaml
display_mode: list
list_max_items: 5
show_list_timestamp: true
```

---

### Appearance

#### Basic Styling

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `show_icon` | boolean | true | Show notification icon |
| `icon_after` | boolean | false | Show icon after text instead of before |
| `alignment` | string | `left` | Text alignment: `left`, `center`, `right` |
| `full_width` | boolean | false | Expand card to full width |

#### Colors

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text_color` | string | `var(--primary-text-color)` | Default text color |
| `icon_color` | string | `var(--primary-text-color)` | Default icon color |
| `bg_color` | string | (card bg) | Background color |
| `bg_opacity` | number | 1 | Background opacity (0-1) |
| `show_background` | boolean | true | Show background |
| `border_color` | string | (rgba) | Border color |

#### Typography

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `font_size` | number | 13 | Font size in pixels |
| `font_weight` | string | `Semi Bold` | Font weight |
| `font_family` | string | `system-ui, sans-serif` | Font family |
| `custom_font_family` | string | "" | Custom font family CSS |

**Font Weight Options:**
- `Light`, `Regular`, `Medium`, `Semi Bold`, `Bold`, `Extra Bold`

**Font Family Options:**
- `system-ui, sans-serif` (default)
- `Roboto, sans-serif`
- `Segoe UI, sans-serif`
- `Open Sans, sans-serif`
- `Montserrat, sans-serif`
- Many more predefined options
- `Custom` (use `custom_font_family`)

#### Border & Shadow

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `border_width` | number | 1 | Border width in pixels |
| `border_radius` | number | 99 | Border radius in pixels |
| `box_shadow` | string | (shadow) | CSS box-shadow value |

**Example:**
```yaml
show_icon: true
alignment: center
text_color: "#ffffff"
icon_color: "#4CAF50"
bg_color: "rgba(0,0,0,0.8)"
font_size: 14
font_weight: Bold
border_radius: 12
box_shadow: 0 4px 20px rgba(0,0,0,0.3)
```

---

### Button Mode

When `display_mode: button`, these settings control the button appearance:

#### Button Appearance

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `button_icon` | string | `mdi:bell` | Button icon |
| `button_icon_color` | string | (text color) | Icon color |
| `button_bg_color` | string | (card bg) | Background color |
| `button_size` | number | 48 | Button size in pixels |
| `button_label` | string | "" | Button label text |
| `button_label_position` | string | `below` | Label position: `below`, `inside` |

#### Badge Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `button_show_badge` | boolean | true | Show notification count badge |
| `button_badge_color` | string | `#ff4444` | Badge background color |
| `button_badge_text_color` | string | `#ffffff` | Badge text color |
| `button_badge_size` | number | 0 | Badge size (0 = auto) |

#### Pill Button (when label_position: "inside")

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `button_pill_size` | number | 14 | Pill text size |
| `button_pill_full_width` | boolean | false | Stretch pill to full width |
| `button_pill_bg_color` | string | (card bg) | Pill background color |
| `button_pill_border_style` | string | `solid` | Border style |
| `button_pill_border_width` | number | 1 | Border width |
| `button_pill_border_color` | string | (rgba) | Border color |
| `button_pill_border_radius` | number | 99 | Border radius |
| `button_pill_badge_position` | string | `inside` | Badge position: `inside`, `outside` |

**Icon Button Example:**
```yaml
display_mode: button
button_icon: mdi:bell
button_size: 50
button_bg_color: "#2196f3"
button_icon_color: "#ffffff"
button_show_badge: true
button_badge_color: "#f44336"
```

**Pill Button Example:**
```yaml
display_mode: button
button_icon: mdi:bell
button_label: Notifications
button_label_position: inside
button_pill_size: 13
button_pill_full_width: false
button_pill_border_radius: 20
```

---

### Popup Settings

Control the popup that shows all notifications:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `popup_enabled` | boolean | true | Enable popup functionality |
| `popup_title` | string | `Notifications` | Popup title text |
| `tap_action_popup_only` | boolean | false | Only open popup on tap (don't execute notification actions) |
| `confirm_tap_action` | boolean | false | Require confirmation before executing tap actions |
| `show_popup_timestamp` | boolean | true | Show timestamps in popup |
| `time_format` | string | `auto` | Time format: `auto`, `12`, `24` |

#### Popup Appearance

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `popup_blur_enabled` | boolean | true | Blur backdrop |
| `popup_blur_amount` | number | 10 | Backdrop blur amount (px) |
| `popup_card_blur_enabled` | boolean | true | Blur popup card |
| `popup_card_blur_amount` | number | 40 | Card blur amount (px) |
| `popup_card_opacity` | number | 0.4 | Card background opacity |
| `popup_border_radius` | number | 16 | Popup border radius (px) |
| `popup_width` | string | `auto` | Width: `auto`, `full`, `custom` |
| `popup_width_custom` | number | 400 | Custom width in pixels |
| `popup_height` | string | `auto` | Height: `auto`, `full`, `custom` |
| `popup_height_custom` | number | 600 | Custom height in pixels |

**Example:**
```yaml
popup_enabled: true
popup_title: My Notifications
show_popup_timestamp: true
time_format: 12
popup_blur_enabled: true
popup_blur_amount: 15
popup_card_blur_enabled: true
popup_card_blur_amount: 30
popup_border_radius: 20
popup_width: custom
popup_width_custom: 500
```

---

### Header Card Integration

When using with HKI Header Card:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `use_header_styling` | boolean | false | Use header card styling |
| `show_background` | boolean | true | Show card background |

**Example in Header Card:**
```yaml
type: custom:hki-header-card
# ... header config ...
top_bar_left:
  type: custom
  custom:
    card:
      type: custom:hki-notification-card
      entity: sensor.hki_notify_main
      display_mode: marquee
      use_header_styling: true
      show_background: false
```

## Display Modes

### Ticker Mode
Auto-cycles through notifications one at a time with animations.

```yaml
type: custom:hki-notification-card
entity: sensor.hki_notify_main
display_mode: ticker
interval: 3
animation: slide
auto_cycle: true
```

**Best for:** Single notification display, clean look, limited space

---

### Marquee Mode
Continuous horizontal scrolling of notification text.

```yaml
type: custom:hki-notification-card
entity: sensor.hki_notify_main
display_mode: marquee
auto_scroll: true
marquee_speed: 1
marquee_gap: 16
```

**Best for:** Header cards, long messages, ticker-tape style

---

### List Mode
Shows multiple notifications stacked vertically.

```yaml
type: custom:hki-notification-card
entity: sensor.hki_notify_main
display_mode: list
list_max_items: 3
show_list_timestamp: true
```

**Best for:** Viewing multiple notifications, notification center

---

### Button Mode
Icon or pill button that opens a popup with all notifications.

```yaml
type: custom:hki-notification-card
entity: sensor.hki_notify_main
display_mode: button
button_icon: mdi:bell
button_show_badge: true
```

**Best for:** Compact notification access, navigation bars, dashboards
