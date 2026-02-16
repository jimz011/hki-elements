# Basic Usage

### Placement Options

#### Option 1: Header Section (Recommended!)
Place the card in the header slot of your view to enable badge positioning features.

1. Click on "Add Title" in the header section of your dashboard.
2. Do not change anything yet but click on "Show Code Editor"
3. Remove everything
4. Type the following: `type: custom:hki-header-card`
5. Click on "Show Visual Editor" to edit the card as normal
6. Done! The card is now in the header section

![Badge Setup Recommended](https://github.com/user-attachments/assets/b1685685-0b4b-4ff5-9271-b919e072cd62)


#### Option 2: Header Section copied from default section
Place the card in the header slot of your view to enable badge positioning features.

1. Click on any section and add the HKI-Header-Card
2. Edit the card and click "Show Code Editor"
3. Copy the code
4. Click "Add title" (the yellow pencil icon in the header area)
5. Click "Show Code Editor", select all, and paste the copied code
6. Done! The card is now in the header section

![Badge Setup](https://github.com/user-attachments/assets/49195061-ecd7-44d5-9a8e-78d7355037d5)

#### Option 3: Regular Section (NOT recommended!)
Create a new full-width section at the top of your dashboard. Badge positioning features will not be available.

> **⚠️ Important:** Badge positioning features ONLY work when the card is placed in the header section!

### Minimal Example

```yaml
type: custom:hki-header-card
title: Welcome Home
subtitle: Have a great day!
```

### With Background

```yaml
type: custom:hki-header-card
title: Living Room
subtitle: Relax and enjoy
background: /local/images/living-room.jpg
height_vh: 35
blend_enabled: true
```

### With Top Bar Weather

```yaml
type: custom:hki-header-card
title: Home Dashboard
subtitle: "{{ now().strftime('%A, %B %d') }}"

top_bar:
  enabled: true

top_bar_right:
  type: weather
  weather:
    entity: weather.home
    show_icon: true
    show_temperature: true
    show_condition: true
```

---

# Configuration Structure

The card uses a **nested configuration structure** organized into logical groups:

```yaml
type: custom:hki-header-card

# Text content
title: "My Title"
subtitle: "Subtitle text"
text_align: left

# Background
background: /local/image.jpg
background_color: ""
background_size: cover
height_vh: 35
blend_enabled: true

# Typography
font_family: inherit
title_size_px: 36
subtitle_size_px: 15

# Top bar settings
top_bar:
  enabled: true
  offset_y: 15
  padding_x: 0

# Global info styling (applies to all slots)
info:
  size_px: 12
  weight: medium
  pill: true
  pill_background: rgba(0,0,0,0.25)

# Slot configuration
top_bar_left:
  type: weather
  weather:
    entity: weather.home
  actions:
    tap_action:
      action: more-info

top_bar_center:
  type: datetime
  datetime:
    show_time: true

top_bar_right:
  type: button
  button:
    icon: mdi:lightbulb
    label: Lights
  actions:
    tap_action:
      action: toggle

# Person entities
persons:
  enabled: true
  entities:
    - entity: person.john
    - entity: person.jane
```
