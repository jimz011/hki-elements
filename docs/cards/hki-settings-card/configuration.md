# Configuration

## Minimal configuration

```yaml
type: custom:hki-settings-card
```

## Optional top-level fields

| Property | Type | Description |
|----------|------|-------------|
| `type` | string | Must be `custom:hki-settings-card` |
| `title` | string | Optional title shown in the editor |

## Global scopes managed by this card

The editor writes global defaults into these scopes:

- `button`
- `button_hki_default`
- `button_google_default`
- `button_hki_tile`
- `button_badge`
- `header`
- `navigation`
- `popup`

These defaults are applied by HKI cards when corresponding card-level values are unset.

## Scope examples

```yaml
type: custom:hki-settings-card

button:
  border_radius: 16
  font_family: inter

header:
  title_size_px: 34
  title_weight: semibold

navigation:
  default_border_radius: 20
  label_font_size: 12

popup:
  popup_border_radius: 20
  popup_open_animation: scale
  popup_animation_duration: 280
```

## Notes

- This card is primarily edited through the visual editor, not raw YAML.
- Values are persisted through HKI global settings storage in the browser.
- Clearing a scope from the editor removes its global defaults.
