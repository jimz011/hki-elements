# Tips & Tricks

### Dynamic Time-Based Greetings

```yaml
title: |-
  {% set hour = now().hour %}
  {% if hour < 12 %}Good Morning
  {% elif hour < 18 %}Good Afternoon
  {% else %}Good Evening
  {% endif %}, {{ user }}!
```

### Overlapping Person Avatars

Use negative spacing to create overlapping avatars:

```yaml
persons:
  size: 50
  spacing: -15
  stack_order: ascending
```

### Kiosk Mode

Badge gap automatically adjusts +48px in kiosk mode for better spacing.

### Browser Mod Popup Sizes

```yaml
actions:
  tap_action:
    action: fire-dom-event
    browser_mod:
      service: browser_mod.popup
      data:
        size: normal      # or 'wide', 'fullscreen'
        title: My Popup
        content:
          type: entities
```

### Performance Tips

- Use specific entity references in templates rather than complex filters
- Limit the number of person entities shown
- Use `overflow: hidden` on slots if content is static
- Disable unused top bar slots with `type: none`
