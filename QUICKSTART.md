# Quick Reference

## Installation

### HACS
```
HACS → Frontend → + → Search "HKI Elements" → Download → Restart HA
```

### Manual
1. Download `hki-elements.js`
2. Place in `/config/www/`
3. Add resource: `/local/hki-elements.js` (module)
4. Restart

## Card Types

| Card Type | Description |
|-----------|-------------|
| `hki-header-card` | Full-width header with weather, time, user info |
| `hki-button-card` | Customizable buttons with popups |
| `hki-navigation-card` | Navigation bar with FAB support |
| `hki-notification-card` | Animated notification ticker |
| `hki-postnl-card` | PostNL package tracker |

## Basic Examples

### Header Card
```yaml
type: hki-header-card
entity: person.jimmy
weather: weather.home
title: Welcome Home
```

### Button Card
```yaml
type: hki-button-card
entity: light.living_room
name: Living Room
show_state: true
```

### Navigation Card
```yaml
type: hki-navigation-card
items:
  - entity: light.living_room
    icon: mdi:sofa
    name: Living Room
  - entity: light.bedroom
    icon: mdi:bed
    name: Bedroom
```

### Notification Card
```yaml
type: hki-notification-card
entity: sensor.notifications
marquee_speed: 50
```

### PostNL Card
```yaml
type: hki-postnl-card
entities:
  - sensor.postnl_delivery
  - sensor.postnl_distribution
```

## Migration from Individual Cards

1. ✅ Install HKI Elements
2. ✅ Verify dashboards work
3. ✅ Remove old individual cards from HACS
4. ✅ Remove old resources
5. ✅ Done! No config changes needed

## Resources

- [Full Documentation](README.md)
- [Migration Guide](MIGRATION.md)
- [Setup Guide](SETUP.md)
- [Report Issues](https://github.com/YOUR_USERNAME/hki-elements/issues)

## File Structure

```
hki-elements/
├── hki-elements.js       # Main bundle (use this)
├── README.md            # Full documentation
├── MIGRATION.md         # Migration guide
├── SETUP.md            # Repository setup
├── info.md             # HACS info
├── hacs.json           # HACS config
└── LICENSE             # MIT License
```

## Support

- GitHub Issues: Bug reports & features
- Discussions: Questions & help
- HACS: Easy updates

---

**Version:** 1.0.0  
**Author:** [Jimmy](https://github.com/jimz011)  
**License:** MIT
