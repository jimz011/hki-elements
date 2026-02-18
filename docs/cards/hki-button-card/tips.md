# Tips & Tricks

### Jinja2 Template Tip

Whenever you use jinja2 templates and you selected an entity for the card then you can use the `config.entity` variable to use in your templates. Using this variable will make copying this template to other cards easier since you will not have to enter an entity for each template over and over again. Note that `config.entity` should NOT be quoted. See the example below:

```yaml
color: >-
  {% if is_state(config.entity, 'on') %}
    rgba(255, 152, 0, 0.3)
  {% else %}
    rgba(100, 100, 100, 0.1)
  {% endif %}

# DO NOT DO IT LIKE THIS
color: >-
  {% if is_state('config.entity', 'on') %} # As you can see, it is quoted here, and this will NOT work, so when using this variable always make sure it is unquoted
```

### Dummy Card/Invisible Spacer

You can use this card to create an invisible block, this is particularly useful if you want to have gaps in your grid config (e.g. you have 2 buttons, but want to show a 3 column grid, where the first button is placed in the first column and the second button in the third column). This would be the equivalent for a custom:button-card blank_card.
To use this all you need to do is add this card and ONLY change the background color to `transparent` or `none`:

```yaml
type: custom:hki-button-card
styles:
  card:
    color: none
# or
type: custom:hki-button-card
styles:
  card:
    color: transparent
```

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
