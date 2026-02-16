# Tips & Tricks

### Swipe to Dismiss

In **list** mode, users can swipe notifications left or right to dismiss them. This calls the `hki_notify.dismiss` service automatically.

### Tap Actions

Notifications can have tap actions configured via the integration's `action_type` parameter. When tapping a notification:
- **Without confirmation:** Action executes immediately
- **With confirmation:** Dialog appears asking for confirmation
- **popup_only mode:** Opens popup instead of executing action

### Auto-Hide When Empty

```yaml
show_empty: false
```

This hides the entire card when there are no notifications - useful for conditional displays.

### Badge Slot Compatibility

The card automatically detects when placed in a badge slot and adjusts its styling accordingly.

### Header Card Styling

When using `use_header_styling: true`, the card inherits:
- Font size from header card
- Font weight from header card  
- Text color from header card
- Pill styling from header card

### Animation Directions

Different animations support different directions:
- **slide:** left, right, up, down
- **bounce:** left, right, up, down
- **rotate:** N/A (rotates in place)
- **zoom:** N/A (zooms in/out)
- **fade:** N/A (fades in/out)
- **flip:** left, right

### Time Format Options

- `auto` - Uses system locale
- `12` - 12-hour format with AM/PM
- `24` - 24-hour format

### Custom Fonts

Use any web font:

```yaml
font_family: Custom
custom_font_family: "'Roboto Mono', monospace"
```

### Popup Width Presets

- `auto` - Fits content
- `full` - Full screen width
- `custom` - Use `popup_width_custom` value

### Performance Tips

- Use `show_empty: false` when notifications aren't always present
- Limit `list_max_items` to reduce DOM elements
- Disable `popup_enabled` if you don't need it
- Use simpler animations (fade, slide) for better performance

### Multiple Cards

Use multiple cards for different notification categories:

```yaml
# Security notifications
- type: custom:hki-notification-card
  entity: sensor.hki_notify_security
  display_mode: ticker

# Weather notifications  
- type: custom:hki-notification-card
  entity: sensor.hki_notify_weather
  display_mode: list
```

### Confirmation for Critical Actions

Set `confirm_tap_action: true` globally or use per-notification `confirm` parameter for critical actions:

```yaml
confirm_tap_action: true  # Confirm all tap actions
```
