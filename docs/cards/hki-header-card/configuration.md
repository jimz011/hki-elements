# Configuration

### Basic Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | "Header" | Main title text - supports Jinja2 templates |
| `subtitle` | string | "" | Subtitle text - supports Jinja2 templates |
| `text_align` | string | `left` | Text alignment: `left`, `center`, `right` |

**Jinja2 Template Examples:**
```yaml
title: |-
  {% set time = states('sensor.time') %}
  {% if '06:00' < time < '12:00' %}
    Good Morning
  {% elif '12:00' < time < '18:00' %}
    Good Afternoon
  {% else %}
    Good Evening
  {% endif %}

subtitle: "{{ user }}"
```

---

### Background Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `background` | string | (demo image) | Background image URL, gradient CSS, or `none` |
| `background_color` | string | "" | Solid background color |
| `background_position` | string | `center` | CSS background-position value |
| `background_size` | string | `cover` | `cover`, `contain`, or `auto` |
| `background_repeat` | string | `no-repeat` | CSS background-repeat value |
| `background_blend_mode` | string | `normal` | CSS blend mode |
| `height_vh` | number | 35 | Header height in viewport height (vh) units |
| `min_height` | number | 215 | Minimum height in pixels |
| `max_height` | number | 240 | Maximum height in pixels |
| `blend_enabled` | boolean | true | Enable bottom gradient blend |
| `blend_color` | string | `var(--primary-background-color)` | Color for bottom gradient |
| `blend_stop` | number | 95 | Gradient stop position (0-100%) |

**Examples:**
```yaml
# Image background
background: /local/images/sunset.jpg
background_size: cover
background_position: center bottom

# Gradient background
background: radial-gradient(circle, rgba(207,0,96,1) 0%, rgba(0,0,0,1) 80%);

# Solid color
background: none
background_color: var(--primary-color)
```

---

### Title & Subtitle

#### Positioning

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title_offset_x` | number | 5 | Horizontal position (% from left) |
| `title_offset_y` | number | 65 | Vertical position (% from top) |
| `subtitle_offset_x` | number | 5 | Horizontal position (% from left) |
| `subtitle_offset_y` | number | 70 | Vertical position (% from top) |

#### Styling

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title_color` | string | "" | Title text color |
| `subtitle_color` | string | "" | Subtitle text color |
| `title_size_px` | number | 36 | Title font size in pixels |
| `subtitle_size_px` | number | 15 | Subtitle font size in pixels |
| `title_weight` | string | `bold` | Font weight |
| `subtitle_weight` | string | `medium` | Font weight for subtitle |

---

### Typography

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `font_family` | string | `inherit` | Font family preset |
| `font_family_custom` | string | "" | Custom font family CSS |
| `font_style` | string | `normal` | `normal` or `italic` |
| `mobile_breakpoint` | number | 768 | Mobile breakpoint width in pixels |

#### Font Family Presets

- `inherit` - Uses Home Assistant's default font
- `system` - System UI fonts
- `roboto` - Roboto font
- `inter` - Inter font
- `arial` - Arial/Helvetica
- `georgia` - Georgia serif
- `mono` - Monospace fonts

#### Font Weights

- `light` (300), `regular` (400), `medium` (500), `semibold` (600), `bold` (700), `black` (900)

**Example:**
```yaml
font_family: roboto
font_style: normal
title_weight: bold
title_size_px: 42
subtitle_weight: regular
subtitle_size_px: 16
```

---

### Top Bar

The top bar is a horizontal container at the top of the header with three slots (left, center, right).

```yaml
top_bar:
  enabled: true        # Show/hide entire top bar
  offset_y: 15         # Vertical position (% from top)
  padding_x: 0         # Horizontal padding (px)
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `top_bar.enabled` | boolean | true | Show/hide entire top bar |
| `top_bar.offset_y` | number | 15 | Vertical position (% from top) |
| `top_bar.padding_x` | number | 0 | Horizontal padding in pixels |

---

### Bottom Bar

The bottom bar is a horizontal container at the bottom of the header with three slots (left, center, right).
*It is recommended to remove badges from the default HA badges slot entirely and use the header slots for your badges instead. To give slightly more control over the content below the header you could use `fixed badges` settings to change the distance between the header and the content below it.*

```yaml
bottom_bar:
  enabled: true        # Show/hide entire bottom bar (disabled by default)
  offset_y: 10         # Vertical position (% from top)
  padding_x: 0         # Horizontal padding (px)
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `bottom_bar.enabled` | boolean | false | Show/hide entire bottom bar |
| `bottom_bar.offset_y` | number | 10 | Vertical position (% from top) |
| `bottom_bar.padding_x` | number | 0 | Horizontal padding in pixels |

---

### Info Styling

Global styling that applies to all **top bar** weather and datetime slots by default. Individual slots can override these with their own `styling` property. The bottom bar has its own independent set of defaults — see [Bottom Bar Info Styling](#bottom-bar-info-styling) below.

```yaml
info:
  size_px: 12
  weight: medium
  color: ""
  text_shadow: ""
  icon_shadow: ""
  pill: true
  pill_background: rgba(0,0,0,0.25)
  pill_padding_x: 12
  pill_padding_y: 8
  pill_radius: 999
  pill_blur: 0
  pill_border_style: none
  pill_border_width: 0
  pill_border_color: rgba(255,255,255,0.1)
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `info.size_px` | number | 12 | Font size in pixels |
| `info.weight` | string | `medium` | Font weight |
| `info.color` | string | "" | Text color (empty = white) |
| `info.text_shadow` | string | "" | CSS text-shadow value |
| `info.icon_shadow` | string | "" | Icon shadow/filter (CSS `drop-shadow(...)` or a plain shadow value) |
| `info.pill` | boolean | true | Enable pill background |
| `info.pill_background` | string | `rgba(0,0,0,0.25)` | Pill background color |
| `info.pill_padding_x` | number | 12 | Horizontal padding (px) |
| `info.pill_padding_y` | number | 8 | Vertical padding (px) |
| `info.pill_radius` | number | 999 | Border radius (px) |
| `info.pill_blur` | number | 0 | Backdrop blur (px) |
| `info.pill_border_style` | string | `none` | Border style |
| `info.pill_border_width` | number | 0 | Border width (px) |
| `info.pill_border_color` | string | `rgba(255,255,255,0.1)` | Border color |

---

### Bottom Bar Info Styling

The bottom bar does **not** inherit its styling from `info` — it has its own global default block, `bottom_info`, with the same properties:

```yaml
bottom_info:
  size_px: 12
  weight: medium
  color: ""
  text_shadow: ""
  icon_shadow: ""
  pill: true
  pill_background: rgba(0,0,0,0.25)
  pill_padding_x: 12
  pill_padding_y: 8
  pill_radius: 999
  pill_blur: 0
  pill_border_style: none
  pill_border_width: 0
  pill_border_color: rgba(255,255,255,0.1)
```

All `bottom_info.*` properties mirror `info.*` above and share the same defaults. Individual bottom bar slots can still override these with their own `styling` property, same as top bar slots.

---

### Slot Configuration

Each slot (`top_bar_left`, `top_bar_center`, `top_bar_right`) has the same structure:

```yaml
top_bar_left:
  type: weather|datetime|button|notifications|card|spacer|none
  offset_x: 0                    # Horizontal offset (px)
  offset_y: 0                    # Vertical offset (px)  
  offset_x_mobile: 0             # Mobile horizontal offset (px)
  offset_y_mobile: 0             # Mobile vertical offset (px)
  overflow: visible              # CSS overflow property
  
  # Optional: Override global info styling for this slot
  styling:
    size_px: 14
    weight: bold
    color: "#ffffff"
    pill: true
    pill_background: rgba(0,0,0,0.4)
    # ... all info properties available
  
  # Type-specific config (based on type)
  weather: { ... }
  datetime: { ... }
  button: { ... }
  custom: { ... }
  
  # Actions
  actions:
    tap_action: { ... }
    hold_action: { ... }
    double_tap_action: { ... }
```

#### Common Slot Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | string | `none` | Slot type: `weather`, `datetime`, `button`, `notifications`, `card`, `spacer`, `none`. Note: `button` is labeled **"Badge"** in the visual editor's Content Type picker — see [Button Slot](#button-slot) |
| `offset_x` | number | 0 | Horizontal offset in pixels |
| `offset_y` | number | 0 | Vertical offset in pixels |
| `offset_x_mobile` | number | 0 | Mobile horizontal offset in pixels |
| `offset_y_mobile` | number | 0 | Mobile vertical offset in pixels |
| `overflow` | string | `visible` | CSS overflow property |
| `styling` | object | (uses global) | Override global `info` styling for this slot |
| `align` | string | `center` | Options: `start`, `center`, `end`, `stretch` |

---

## Slot Types

### Weather Slot

Display weather information from a weather entity.

```yaml
top_bar_right:
  type: weather
  weather:
    entity: weather.home
    show_icon: true
    show_condition: true
    show_temperature: true
    show_humidity: false
    show_wind: false
    show_pressure: false
    colored_icons: true
    icon_color_mode: state     # 'state' or 'accent'
    icon_color: ""             # Override icon color
    animate_icon: none         # 'none', 'pulse', 'flip', 'beat', 'spin'
    icon_pack_path: ""         # Custom icon pack URL
  actions:
    tap_action:
      action: more-info
    hold_action:
      action: url
      url_path: https://weather.com
```

#### Weather Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `weather.entity` | string | *required* | Weather entity ID |
| `weather.show_icon` | boolean | true | Show weather icon |
| `weather.show_condition` | boolean | true | Show condition text |
| `weather.show_temperature` | boolean | true | Show temperature |
| `weather.show_humidity` | boolean | false | Show humidity percentage |
| `weather.show_wind` | boolean | false | Show wind speed |
| `weather.show_pressure` | boolean | false | Show pressure |
| `weather.colored_icons` | boolean | true | Use colored icons based on condition |
| `weather.icon_color_mode` | string | `state` | `state` for condition colors or `accent` for theme color |
| `weather.icon_color` | string | "" | Override icon color (CSS color) |
| `weather.animate_icon` | string | `none` | Animation: `none`, `pulse`, `flip`, `beat`, `spin` |
| `weather.icon_pack_path` | string | "" | Path to custom weather icon pack |

---

### DateTime Slot

Display current date and time with flexible formatting.

```yaml
top_bar_left:
  type: datetime
  datetime:
    show_day: true
    show_date: true
    show_time: true
    time_format: HH:mm
    date_format: D MMM
    separator: " • "
    icon: ""
    animate_icon: none
  actions:
    tap_action:
      action: none
```

#### DateTime Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `datetime.show_day` | boolean | true | Show day of week |
| `datetime.show_date` | boolean | true | Show date |
| `datetime.show_time` | boolean | true | Show time |
| `datetime.time_format` | string | `HH:mm` | Time format pattern |
| `datetime.date_format` | string | `D MMM` | Date format pattern |
| `datetime.separator` | string | `" • "` | Separator between elements |
| `datetime.icon` | string | "" | Optional icon to show |
| `datetime.animate_icon` | string | `none` | Icon animation |

#### Format Patterns

**Time:**
- `HH:mm` - 24-hour (14:30)
- `h:mm A` - 12-hour with AM/PM (2:30 PM)
- `HH:mm:ss` - With seconds

**Date:**
- `MMM DD` - Short month (Jan 15)
- `MMMM DD` - Full month (January 15)
- `DD/MM/YYYY` - Day/Month/Year
- `MM/DD/YYYY` - Month/Day/Year

---

### Button Slot

> **Called "Badge" in the visual editor.** The Content Type picker for a slot lists this option as **Badge**, not "Button" — it's the native, built-in way to put a badge-like widget directly in the header without embedding a separate card. (This is different from embedding the standalone HKI Button Card's own "badge" layout via the [Custom Card Slot](#custom-card-slot) — see the note there.) The YAML config key remains `type: button` / `button:` regardless of the editor label.

An interactive icon/name/state button. It can bind directly to an entity, show a small badge, and be conditionally hidden. A slot can hold either a single button (simple form) or multiple buttons side by side (`buttons` array).

#### Simple form (single button)

```yaml
bottom_bar_center:
  type: button
  button:
    icon: mdi:lightbulb
    name: Lights
    entity: light.living_room
    icon_color: "#ffcc66"
    show_badge: true
    badge_source: entity
    badge_entity: sensor.living_room_lights_on_count
```

> **Note:** In the simple form, tapping the button is **not** independently configurable — it automatically `toggle`s the entity for toggleable domains (`light`, `switch`, `climate`, `input_boolean`, `automation`) or opens a more-info dialog otherwise. To assign custom `tap_action` / `hold_action` / `double_tap_action` (e.g. `navigate`, `fire-dom-event`, `hki-more-info`), use the `buttons` array form below — the top-level slot `actions` block is not used by button-type slots.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `button.icon` | string | `mdi:gesture-tap` | MDI icon name (falls back to the bound entity's default icon, then to `mdi:gesture-tap`) |
| `button.name` | string | "" | Primary text label — supports Jinja2 (falls back to the entity's friendly name) |
| `button.state` | string | "" | Secondary text line — supports Jinja2 (falls back to the entity's state) |
| `button.entity` | string | "" | Entity to bind for icon/name/state/color and default tap behavior |
| `button.show_icon` / `show_name` / `show_state` | boolean | true | Toggle visibility of each element |
| `button.card_color` | string | "" | Background color of the button pill |
| `button.icon_color` | string | "" | Icon color override (falls back to an automatic entity-state color) |
| `button.name_color` / `state_color` | string | "" | Text color overrides |
| `button.text_shadow` / `icon_shadow` | string | "" | CSS text-shadow / icon drop-shadow |
| `button.name_offset_x` / `name_offset_y` / `state_offset_x` / `state_offset_y` | number | 0 | Fine-position the name/state text (px) |
| `button.show_badge` | boolean | false | Show a small badge on the button |
| `button.badge_source` | string | `entity` | `entity` or `template` |
| `button.badge_entity` | string | "" | Entity whose state is shown in the badge (when `badge_source: entity`) |
| `button.badge_template` | string | "" | Jinja2 template for the badge text (when `badge_source: template`) |
| `button.badge_color` / `badge_text_color` | string | "" | Badge background/text color |
| `button.visibility_mode` | string | `none` | `none`, `state`, or `attribute` — conditionally hide the button |
| `button.visibility_entity` | string | "" | Entity checked by `visibility_mode` (falls back to `button.entity`) |
| `button.visibility_state` | string | "" | Required state when `visibility_mode: state` |
| `button.visibility_attribute` / `visibility_attribute_value` | string | "" | Required attribute (dot-path supported) and value when `visibility_mode: attribute` |

#### Multiple buttons / custom actions: `buttons` array

To place more than one button in a slot, or to set custom actions, badge border/shadow styling, or button container borders, use `button.buttons` — an array where each item accepts every property above (without the `button.` prefix) plus:

```yaml
top_bar_right:
  type: button
  button:
    buttons:
      - icon: mdi:lightbulb
        name: Lights
        entity: light.living_room
        button_border_radius: 12
        button_border_style: solid
        button_border_width: 1
        button_border_color: rgba(255,255,255,0.2)
        button_box_shadow: 0 2px 8px rgba(0,0,0,0.3)
        text_color: "#ffffff"
        tap_action:
          action: toggle
        hold_action:
          action: navigate
          navigation_path: /lovelace/lights
        double_tap_action:
          action: none
      - icon: mdi:thermostat
        name: Climate
        entity: climate.living_room
        tap_action:
          action: hki-more-info
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `tap_action` / `hold_action` / `double_tap_action` | map | `{ action: none }` | Per-button actions (see [Actions](#actions)) — when left as `none`, the same automatic toggle/more-info behavior as the simple form applies |
| `text_color` | string | "" | Fallback text color for both name and state when their own color isn't set |
| `button_border_radius` / `button_border_width` | number | "" | Button pill border radius/width (px) |
| `button_border_style` | string | "" | Button pill border style |
| `button_border_color` | string | "" | Button pill border color |
| `button_box_shadow` | string | "" | CSS box-shadow for the button pill |
| `badge_border_radius` / `badge_border_width` | number | "" | Badge border radius/width (px) |
| `badge_border_style` / `badge_border_color` | string | "" | Badge border style/color |
| `badge_box_shadow` | string | "" | CSS box-shadow for the badge |
| `badge_font_size` | number | "" | Badge font size (px) |
| `badge_font_weight` | string | "" | Badge font weight |
| `badge_font_family` | string | "" | Badge font family preset, or `custom` |
| `badge_font_custom` | string | "" | Custom badge font family CSS (when `badge_font_family: custom`) |

---

### Notifications Slot

This slot can be used to embed the HKI Notifications Card, it will automatically select the HKI Notifications Card for you and the card will inherit settings from the Header Card

```yaml
top_bar_left:
  type: notifications
  custom:
    card:
      type: custom:hki-notification-card
      use_header_styling: true
      show_background: false
      entity: sensor.notifications
```
The HKI Notifications Card will automatically receive `use_header_styling: true` and `show_background: false` unless specified otherwise.

### Custom Card Slot

This slot can be used to embed ANY Home Assistant or Custom Card into the header. You can do cool stuff with this, but it can be buggy as testing every single card would be impossible. Use this at your own risk!

```yaml
bottom_bar_center:
  type: card
  custom:
    card:
      type: vertical-stack
      cards:
        - type: custom:mini-graph-card
          entities:
            - sensor.office_temperature
```
You can also use this feature in conjunction with Home Assistant's native badges or the standalone HKI Button Card (with its own "Badge" layout style selected) to replace the default HA Badges row entirely. You have much more control over the badge placements using this feature! For simpler cases, the built-in [Button Slot](#button-slot) (labeled "Badge" in the editor) may be enough on its own, without needing to embed a separate card here.

For custom cards you can set `align: stretch` to make the card stretch the full width of the top or bottom bar. You could integrate a graph into the header for example with this.

---

### Person Entities

Display person avatars with home/away status.

```yaml
persons:
  enabled: true
  align: right
  offset_x: 5
  offset_y: 63
  size: 35
  spacing: 0
  stack_order: ascending          # or 'descending'
  dynamic_order: true             # Sort by home status
  hide_away: false
  use_entity_picture: true
  border_width: 1
  border_style: solid
  border_radius: 50
  border_color: rgba(255,255,255,0.3)
  border_color_away: rgba(255,0,0,0.5)
  box_shadow: 0 2px 8px rgba(0,0,0,0.4)
  grayscale_away: true
  entities:
    - entity: person.john
      tap_action:
        action: more-info
      hold_action:
        action: toggle
      double_tap_action:
        action: none
    - entity: person.jane
      tap_action:
        action: more-info
```

#### Person Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `persons.enabled` | boolean | false | Enable person display |
| `persons.align` | string | `right` | Alignment: `left`, `center`, `right` |
| `persons.offset_x` | number | 5 | Horizontal position (%) |
| `persons.offset_y` | number | 63 | Vertical position (%) |
| `persons.size` | number | 35 | Avatar size in pixels |
| `persons.spacing` | number | 0 | Spacing between avatars (negative = overlap) |
| `persons.stack_order` | string | `descending` | Stacking order: `ascending`, `descending` |
| `persons.dynamic_order` | boolean | true | Sort by home status (home first) |
| `persons.hide_away` | boolean | false | Hide away persons |
| `persons.use_entity_picture` | boolean | true | Use entity pictures |
| `persons.border_width` | number | 1 | Border width in pixels |
| `persons.border_style` | string | `solid` | Border style |
| `persons.border_radius` | number | 50 | Border radius (%) |
| `persons.border_color` | string | `rgba(255,255,255,0.3)` | Border color when home |
| `persons.border_color_away` | string | `rgba(255,0,0,0.5)` | Border color when away |
| `persons.box_shadow` | string | (shadow) | Avatar shadow CSS |
| `persons.grayscale_away` | boolean | true | Grayscale filter when away |
| `persons.entities` | array | [] | Array of person configurations |

#### Person Entity Configuration

```yaml
persons:
  entities:
    - entity: person.john
      tap_action:
        action: more-info
      hold_action:
        action: toggle
      double_tap_action:
        action: none
```

Each person can have individual `tap_action`, `hold_action`, and `double_tap_action` configurations.

---

### Badge Positioning

Control Home Assistant's native badge positioning.

```yaml
badges_fixed: true
badges_offset_pinned: 48
badges_offset_unpinned: 100
badges_gap: 30
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `badges_fixed` | boolean | false | Pin badges (content scrolls beneath) |
| `badges_offset_pinned` | number | 48 | Vertical offset when pinned (px) |
| `badges_offset_unpinned` | number | 100 | Vertical offset when unpinned (px) |
| `badges_gap` | number | 0 | Gap under badges (px) |

> **Note:** Badge positioning only works when this card is in the **header slot** of your view/section. The card doesn't display badges itself.

---

### Fixed Header

Control whether the header stays fixed or scrolls.

```yaml
fixed: true
fixed_top: 0

# When fixed is false:
inset_top: 0
inset_bottom: 0
inset_left: 0
inset_right: 0
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fixed` | boolean | true | Keep header fixed to viewport top |
| `fixed_top` | number | 0 | Top offset when fixed (px) |
| `inset_top` | number | 0 | Top spacing when not fixed (px) |
| `inset_bottom` | number | 0 | Bottom spacing when not fixed (px) |
| `inset_left` | number | 0 | Left bleed (positive = wider) |
| `inset_right` | number | 0 | Right bleed (positive = wider) |

---

### Card Styling

Customize the card's visual appearance.

```yaml
card_border_radius: 16px
card_border_radius_top: 16px
card_border_radius_bottom: 0px
card_box_shadow: 0 4px 12px rgba(0,0,0,0.3)
card_border_style: solid
card_border_width: 1
card_border_color: rgba(255,255,255,0.1)
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `card_border_radius` | string | "" | Border radius (all corners) |
| `card_border_radius_top` | string | "" | Top corners only |
| `card_border_radius_bottom` | string | "" | Bottom corners only |
| `card_box_shadow` | string | "" | CSS box-shadow value |
| `card_border_style` | string | `none` | Border style |
| `card_border_width` | number | 0 | Border width (px) |
| `card_border_color` | string | "" | Border color |

---

## Actions

Actions can be configured for slot interactions and person avatars. Each element supports three action types:

- `tap_action` - Single tap/click
- `hold_action` - Long press (500ms)
- `double_tap_action` - Double tap/click

### Action Types

#### `none`
Do nothing.

```yaml
tap_action:
  action: none
```

#### `navigate`
Navigate to a view.

```yaml
tap_action:
  action: navigate
  navigation_path: /lovelace/lights
```

#### `back`
Browser back button.

```yaml
tap_action:
  action: back
```

#### `menu`
Toggle sidebar menu.

```yaml
tap_action:
  action: menu
```

#### `url`
Open a URL.

```yaml
tap_action:
  action: url
  url_path: https://www.home-assistant.io
```

#### `more-info`
Show more-info dialog.

```yaml
tap_action:
  action: more-info
  entity: light.living_room
```

#### `toggle`
Toggle an entity.

```yaml
tap_action:
  action: toggle
  entity: light.living_room
```

#### `perform-action`
Call any Home Assistant service.

```yaml
tap_action:
  action: perform-action
  perform_action: light.turn_on
  target:
    entity_id: light.living_room
  data:
    brightness: 255
    color_name: blue
```

#### `fire-dom-event`
Fire a DOM event for browser_mod popups or other integrations.

```yaml
tap_action:
  action: fire-dom-event
  browser_mod:
    service: browser_mod.popup
    data:
      title: Light Control
      size: normal              # 'normal', 'wide', 'fullscreen'
      content:
        type: entities
        entities:
          - light.living_room
          - light.bedroom
```
