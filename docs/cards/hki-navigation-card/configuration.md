# Configuration

The card uses a **nested configuration structure** organized into logical groups:

```yaml
type: custom:hki-navigation-card

# Card positioning
position: bottom-right
offset_x: 12
offset_y: 20
button_size: 50
gap: 12
vertical_gap: 12
z_index: 5

# Global button styling defaults
button_defaults:
  button_type: icon
  pill_width: 0
  style:
    background: ""
    opacity: 1
    icon_color: ""
    border_radius: 999
    border_width: 0
    border_style: solid
    border_color: ""
    box_shadow: 0 8px 24px rgba(0,0,0,0.35)
    box_shadow_hover: 0 10px 30px rgba(0,0,0,0.42)
  label:
    font_size: 12
    font_weight: 600
    color: ""
    background: ""

# Base button (always visible)
base:
  button:
    icon: mdi:menu
    tap_action:
      action: toggle-group
      target: horizontal

# Horizontal button group
horizontal:
  enabled: true
  columns: 6
  buttons:
    - icon: mdi:home
      tap_action:
        action: navigate
        navigation_path: /lovelace/home

# Vertical button group
vertical:
  enabled: false
  rows: 6
  buttons: []

# Bottom bar settings
bottom_bar_settings:
  enabled: false
  full_width: false
  height: 85
  bottom_offset: 0
  margin_left: 0
  margin_right: 0
  style:
    background: rgb(var(--rgb-card-background-color))
    opacity: 0.85
    border_radius: 0
    box_shadow: ""
    border_width: 0
    border_style: solid
    border_color: ""
```

---

## Configuration Reference

### Card Positioning

Position the card on the screen and control spacing.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `position` | string | `bottom-right` | Position preset (see below) |
| `offset_x` | number | 12 | Horizontal offset in pixels |
| `offset_y` | number | 20 | Vertical offset in pixels |
| `offset_x_mobile` | number | null | Mobile horizontal offset (overrides offset_x) |
| `offset_x_tablet` | number | null | Tablet horizontal offset (overrides offset_x) |
| `offset_x_desktop` | number | null | Desktop horizontal offset (overrides offset_x) |
| `button_size` | number | 50 | Button size in pixels |
| `gap` | number | 12 | Gap between horizontal buttons (px) |
| `vertical_gap` | number | 12 | Gap between vertical buttons (px) |
| `z_index` | number | 5 | CSS z-index value |
| `reserve_space` | boolean | false | Reserve space to prevent content overlap |
| `center_spread` | boolean | false | Spread horizontal buttons evenly when centered |

#### Position Presets

- `bottom-left` - Bottom left corner
- `bottom-center` - Bottom center
- `bottom-right` - Bottom right corner (default)
- `top-left` - Top left corner
- `top-center` - Top center
- `top-right` - Top right corner
- `middle-left` - Middle of left edge
- `middle-right` - Middle of right edge
- `center` - Center of screen

**Example:**
```yaml
position: bottom-center
offset_x: 0
offset_y: 20
offset_x_mobile: 0
offset_x_tablet: 10
button_size: 55
gap: 16
vertical_gap: 16
z_index: 10
```

---

### Button Defaults

Global defaults that apply to all buttons unless overridden.

```yaml
button_defaults:
  button_type: icon                  # Default button type
  pill_width: 0                      # Default pill width (0 = auto)
  style:
    background: ""                   # Default background color
    opacity: 1                       # Default opacity (0-1)
    icon_color: ""                   # Default icon color
    border_radius: 999               # Default border radius (px)
    border_width: 0                  # Default border width (px)
    border_style: solid              # Default border style
    border_color: ""                 # Default border color
    box_shadow: ""                   # Default box shadow
    box_shadow_hover: ""             # Default hover box shadow
  label:
    font_size: 12                    # Label font size (px)
    font_weight: 600                 # Label font weight
    letter_spacing: 0                # Label letter spacing (px)
    text_transform: none             # Text transform (none, uppercase, lowercase, capitalize)
    color: ""                        # Label text color
    background: ""                   # Label background color
    background_opacity: 0.72         # Label background opacity
    padding_x: 10                    # Label horizontal padding (px)
    padding_y: 6                     # Label vertical padding (px)
    border_radius: 999               # Label border radius (px)
    backdrop_blur: 8                 # Label backdrop blur (px)
    max_width: 220                   # Label max width (px)
```

#### Button Defaults Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `button_defaults.button_type` | string | `icon` | Default button type for all buttons |
| `button_defaults.pill_width` | number | 0 | Default pill width (0 = auto) |
| `button_defaults.style.background` | string | "" | Default background color |
| `button_defaults.style.opacity` | number | 1 | Default opacity (0-1) |
| `button_defaults.style.icon_color` | string | "" | Default icon color |
| `button_defaults.style.border_radius` | number | 999 | Default border radius (px) |
| `button_defaults.style.border_width` | number | 0 | Default border width (px) |
| `button_defaults.style.border_style` | string | `solid` | Default border style |
| `button_defaults.style.border_color` | string | "" | Default border color |
| `button_defaults.style.box_shadow` | string | (shadow) | Default box shadow CSS |
| `button_defaults.style.box_shadow_hover` | string | (shadow) | Default hover box shadow CSS |

#### Label Defaults

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `button_defaults.label.font_size` | number | 12 | Font size in pixels |
| `button_defaults.label.font_weight` | number | 600 | Font weight (300-800) |
| `button_defaults.label.letter_spacing` | number | 0 | Letter spacing in pixels |
| `button_defaults.label.text_transform` | string | `none` | Text transform |
| `button_defaults.label.color` | string | "" | Text color |
| `button_defaults.label.background` | string | "" | Background color |
| `button_defaults.label.background_opacity` | number | 0.72 | Background opacity |
| `button_defaults.label.padding_x` | number | 10 | Horizontal padding (px) |
| `button_defaults.label.padding_y` | number | 6 | Vertical padding (px) |
| `button_defaults.label.border_radius` | number | 999 | Border radius (px) |
| `button_defaults.label.backdrop_blur` | number | 8 | Backdrop blur (px) |
| `button_defaults.label.max_width` | number | 220 | Maximum width (px) |

---

### Base Button

The base button is always visible and typically used to toggle the visibility of horizontal or vertical button groups.

```yaml
base:
  button:
    icon: mdi:menu
    tooltip: "Navigation Menu"
    label: ""
    entity: ""
    button_type: icon
    background: ""
    background_opacity: ""
    border_radius: ""
    icon_color: ""
    pill_width: ""
    tap_action:
      action: toggle-group
      target: horizontal
      mode: toggle
    hold_action:
      action: none
    double_tap_action:
      action: none
```

#### Base Button Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `base.button.icon` | string | `mdi:floor-plan` | MDI icon name or Jinja2 template |
| `base.button.tooltip` | string | "" | Tooltip text on hover |
| `base.button.label` | string | "" | Button label text |
| `base.button.entity` | string | "" | Entity ID for state-based styling |
| `base.button.button_type` | string | (uses global) | Button type override |
| `base.button.background` | string | (uses global) | Background color override |
| `base.button.background_opacity` | string | (uses global) | Opacity override |
| `base.button.border_radius` | string | (uses global) | Border radius override |
| `base.button.icon_color` | string | (uses global) | Icon color override |
| `base.button.pill_width` | string | (uses global) | Pill width override |
| `base.button.label_style` | object | (uses global) | Label styling override |
| `base.button.tap_action` | object | *required* | Tap action configuration |
| `base.button.hold_action` | object | {action: none} | Hold action configuration |
| `base.button.double_tap_action` | object | {action: none} | Double-tap action configuration |

---

### Horizontal Layout

Horizontal button group displayed in a row.

```yaml
horizontal:
  enabled: true
  columns: 6
  buttons:
    - icon: mdi:home
      tap_action:
        action: navigate
        navigation_path: /lovelace/home
    - icon: mdi:lightbulb
      label: Lights
      button_type: icon_label_below
      tap_action:
        action: navigate
        navigation_path: /lovelace/lights
```

#### Horizontal Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `horizontal.enabled` | boolean | true | Enable horizontal button group |
| `horizontal.columns` | number | 6 | Maximum columns before wrapping |
| `horizontal.buttons` | array | [] | Array of button configurations |

---

### Vertical Layout

Vertical button group displayed in a column.

```yaml
vertical:
  enabled: true
  rows: 6
  buttons:
    - icon: mdi:lightbulb
      entity: light.living_room
      tap_action:
        action: toggle
        entity: light.living_room
    - icon: mdi:fan
      entity: fan.bedroom
      tap_action:
        action: toggle
        entity: fan.bedroom
```

#### Vertical Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `vertical.enabled` | boolean | false | Enable vertical button group |
| `vertical.rows` | number | 6 | Maximum rows before wrapping |
| `vertical.buttons` | array | [] | Array of button configurations |

---

### Bottom Bar

Optional floating bottom navigation bar that contains the buttons.

```yaml
bottom_bar_settings:
  enabled: true
  full_width: false
  height: 85
  bottom_offset: 0
  margin_left: 0
  margin_right: 0
  style:
    background: rgb(var(--rgb-card-background-color))
    opacity: 0.85
    border_radius: 0
    box_shadow: 0 -2px 10px rgba(0,0,0,0.2)
    border_width: 1
    border_style: solid
    border_color: rgba(255,255,255,0.1)
```

#### Bottom Bar Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `bottom_bar_settings.enabled` | boolean | false | Enable bottom bar |
| `bottom_bar_settings.full_width` | boolean | false | Extend bar to full screen width |
| `bottom_bar_settings.height` | number | 85 | Bar height in pixels |
| `bottom_bar_settings.bottom_offset` | number | 0 | Offset from bottom in pixels |
| `bottom_bar_settings.margin_left` | number | 0 | Left margin in pixels |
| `bottom_bar_settings.margin_right` | number | 0 | Right margin in pixels |
| `bottom_bar_settings.style.background` | string | (card bg) | Background color |
| `bottom_bar_settings.style.opacity` | number | 0.85 | Opacity (0-1) |
| `bottom_bar_settings.style.border_radius` | number | 0 | Border radius (px) |
| `bottom_bar_settings.style.box_shadow` | string | "" | Box shadow CSS |
| `bottom_bar_settings.style.border_width` | number | 0 | Border width (px) |
| `bottom_bar_settings.style.border_style` | string | `solid` | Border style |
| `bottom_bar_settings.style.border_color` | string | "" | Border color |

---

### Button Configuration

Each button in the horizontal or vertical arrays has the same configuration structure.

```yaml
buttons:
  - id: unique_id                      # Auto-generated if not provided
    icon: mdi:lightbulb                # MDI icon or template
    tooltip: "Living Room Lights"      # Tooltip text
    label: "Living Room"               # Button label
    entity: light.living_room          # Entity for state-based styling
    button_type: pill                  # Button type override
    
    # Style overrides
    background: rgba(255,152,0,0.2)
    background_opacity: ""
    border_radius: 12
    border_width: 0
    border_style: solid
    border_color: ""
    icon_color: "#ff9800"
    pill_width: 120
    
    # Label style override
    label_style:
      font_size: 11
      color: "#ffffff"
      background: rgba(0,0,0,0.6)
    
    # Conditions
    conditions_mode: all               # all or any
    conditions:
      - type: entity
        entity: input_boolean.show_lights
        state: "on"
    
    # Actions
    tap_action:
      action: toggle
      entity: light.living_room
    hold_action:
      action: more-info
      entity: light.living_room
    double_tap_action:
      action: navigate
      navigation_path: /lovelace/lights
```

#### Button Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `icon` | string | `mdi:floor-plan` | MDI icon name - supports Jinja2 templates |
| `tooltip` | string | "" | Tooltip on hover - supports Jinja2 templates |
| `label` | string | "" | Button label - supports Jinja2 templates |
| `entity` | string | "" | Entity ID for state-based styling |
| `button_type` | string | (uses global) | Button type (see Button Types) |
| `background` | string | (uses global) | Background color override |
| `background_opacity` | string | (uses global) | Opacity override |
| `border_radius` | string | (uses global) | Border radius override |
| `border_width` | string | (uses global) | Border width override |
| `border_style` | string | (uses global) | Border style override |
| `border_color` | string | (uses global) | Border color override |
| `icon_color` | string | (uses global) | Icon color override |
| `pill_width` | string | (uses global) | Pill width override (px) |
| `label_style` | object | (uses global) | Label styling override |
| `conditions_mode` | string | `all` | Condition logic: `all` or `any` |
| `conditions` | array | [] | Array of condition objects |
| `tap_action` | object | *required* | Tap action configuration |
| `hold_action` | object | {action: none} | Hold action configuration |
| `double_tap_action` | object | {action: none} | Double-tap action configuration |

---

### Actions

Each button supports three action types: `tap_action`, `hold_action`, and `double_tap_action`.

#### Action Types

##### `navigate`
Navigate to a Home Assistant view.

```yaml
tap_action:
  action: navigate
  navigation_path: /lovelace/lights
```

##### `url`
Open a URL.

```yaml
tap_action:
  action: url
  url_path: https://www.home-assistant.io
  new_tab: true                    # Optional: open in new tab
```

##### `toggle`
Toggle an entity.

```yaml
tap_action:
  action: toggle
  entity: light.living_room
```

##### `more-info`
Show entity more-info dialog.

```yaml
tap_action:
  action: more-info
  entity: light.living_room
```

##### `perform-action`
Call a Home Assistant service.

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

##### `back`
Browser back navigation.

```yaml
tap_action:
  action: back
```

##### `toggle-group`
Show/hide button groups.

```yaml
tap_action:
  action: toggle-group
  target: horizontal              # horizontal, vertical, or both
  mode: toggle                    # toggle, show, or hide
```

| Property | Type | Description |
|----------|------|-------------|
| `target` | string | Group to toggle: `horizontal`, `vertical`, `both` |
| `mode` | string | Mode: `toggle`, `show`, `hide` |

##### `fire-dom-event`
Fire a DOM event (for browser_mod, etc.).

```yaml
tap_action:
  action: fire-dom-event
  browser_mod:
    service: browser_mod.popup
    data:
      title: Light Control
      content:
        type: light
```

##### `none`
No action.

```yaml
tap_action:
  action: none
```

---

### Conditions

Control button visibility based on conditions. Multiple conditions can be combined with `conditions_mode`.

```yaml
conditions_mode: all              # all = AND logic, any = OR logic
conditions:
  - type: entity
    entity: input_boolean.show_lights
    state: "on"
  - type: user
    user:
      - user_id_1
      - user_id_2
```

#### Condition Types

##### Entity State Condition

```yaml
- type: entity
  entity: light.living_room
  operator: equals                # equals, not_equals, above, below, includes, not_includes, exists, not_exists
  state: "on"                     # State value (not needed for exists/not_exists)
```

**Operators:**
- `equals` - State equals value
- `not_equals` - State does not equal value
- `above` - Numeric state above value
- `below` - Numeric state below value
- `includes` - State includes substring
- `not_includes` - State does not include substring
- `exists` - Entity exists
- `not_exists` - Entity does not exist

##### User Condition

Show button only to specific users.

```yaml
- type: user
  user:
    - user_id_1
    - user_id_2
```

##### View Condition

Show button only on specific views.

```yaml
- type: view
  view:
    - /lovelace/home
    - /lovelace/lights
```

##### Screen Size Condition

Show button based on screen width.

```yaml
- type: screen
  operator: above               # above or below
  value: 768                    # Width in pixels
```

---

## Button Types

The card supports multiple button layouts:

### `icon`
Icon only button (default).

```yaml
button_type: icon
icon: mdi:lightbulb
```

### `icon_label_below`
Icon with label below.

```yaml
button_type: icon_label_below
icon: mdi:lightbulb
label: Lights
```

### `icon_label_left`
Icon with label on the left.

```yaml
button_type: icon_label_left
icon: mdi:lightbulb
label: Lights
```

### `icon_label_right`
Icon with label on the right.

```yaml
button_type: icon_label_right
icon: mdi:lightbulb
label: Lights
```

### `pill`
Pill button with icon and label inside.

```yaml
button_type: pill
icon: mdi:lightbulb
label: Lights
pill_width: 120                  # Optional: fixed width
```

### `pill_label`
Pill button with label only (no icon).

```yaml
button_type: pill_label
label: Lights
pill_width: 100
```
