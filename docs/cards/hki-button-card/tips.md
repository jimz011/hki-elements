# Tips & Tricks

### State-Based Dynamic Styling

Use templates in style properties:

```yaml
styles:
  card:
    color: >-
      {% if is_state('light.living_room', 'on') %}
        rgba(255, 152, 0, 0.3)
      {% else %}
        rgba(100, 100, 100, 0.1)
      {% endif %}
```

### Icon Animations

Configure icon animations for different states:

```yaml
icon: >-
  {% if is_state('light.living_room', 'on') %}
    mdi:lightbulb-on pulse
  {% else %}
    mdi:lightbulb-off
  {% endif %}
```

**Available animations:** pulse, beat, spin, flip, swing, wobble, jello, bounce, fade

### Layout-Specific Defaults

Each layout has optimized default offsets:
- **Square:** Standard offsets for balanced layout
- **Badge:** All offsets set to 0 for centered appearance
- **Google Default:** Google Home-style spacing
- **HKI Tile:** Tile-optimized positioning with slider space

### Separate Icon Actions

Configure different actions for icon vs card:

```yaml
tap_action:
  action: toggle
icon_tap_action:
  action: hki-more-info
```

### Brightness Slider in Tile Layout

The HKI Tile layout includes an integrated brightness slider:

```yaml
card_layout: hki_tile
styles:
  tile:
    show_slider: true
    slider_fill_color: "#ff9800"
```

### Favorites and Presets

In the popup, save favorite colors and scenes:
- Click "Edit" to manage favorites
- Long-press a preset to save current state
- Favorites persist per-entity in browser storage

### Climate Temperature Control

For climate entities, the popup shows:
- Current temperature
- Target temperature with circular slider
- Humidity display (if configured)
- Pressure display (if configured)
- Gradient visualization (if enabled)
- +/- buttons (if enabled)

### Lock Security

Lock entities show:
- Current lock state
- Lock/unlock button
- Contact sensor status (if configured)
- Last changed timestamp

### Popup Width Presets

- `auto` - Fits content
- `full` - Full screen width
- `custom` - Use `width_custom` value

### Performance Tips

- Use templates only when needed (dynamic content)
- Avoid complex templates that run frequently
- Disable unused popup features (favorites, effects, etc.)
- Use static values when possible
