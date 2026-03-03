# Examples

## Unified rounded theme

```yaml
type: custom:hki-settings-card
button:
  border_radius: 16
  border_style: solid
header:
  card_border_radius: "20px"
navigation:
  default_border_radius: 18
popup:
  popup_border_radius: 20
  popup_open_animation: fade
```

## Strong typography defaults

```yaml
type: custom:hki-settings-card
button:
  font_family: inter
  font_style: normal
header:
  title_weight: semibold
  subtitle_weight: medium
navigation:
  label_font_weight: 600
  label_text_transform: uppercase
```

## Popup-focused defaults

```yaml
type: custom:hki-settings-card
popup:
  popup_blur_enabled: true
  popup_blur_amount: 10
  popup_card_blur_enabled: true
  popup_card_blur_amount: 40
  popup_card_opacity: 0.45
  popup_show_close_button: true
  popup_close_on_action: false
```
