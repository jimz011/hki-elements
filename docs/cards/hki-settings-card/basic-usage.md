# Basic Usage

## Add the card

Use this in YAML:

```yaml
type: custom:hki-settings-card
title: HKI Global Defaults
```

## Important behavior

- The card is intended for edit mode and card editor usage.
- In normal dashboard view it renders as an unobtrusive placeholder.
- Open the card editor to configure global defaults.

## Recommended setup flow

1. Add one `hki-settings-card` to an admin/configuration dashboard.
2. Configure defaults in the editor for each scope you use.
3. Save and verify existing HKI cards inherit defaults where fields are unset.
4. Keep card-level overrides only where needed.
