## Setup & Configuration

### Adding a Sensor

1. Go to **Settings** → **Devices & Services**
2. Click **"+ Add Integration"**
3. Search for **"HKI Notify"**
4. Enter a name (e.g., "Main", "Kitchen", "Living Room")
   - Name "Main" creates sensor: `sensor.hki_notify_main`
   - Name "Kitchen" creates sensor: `sensor.hki_notify_kitchen`
5. Click **Submit**

### Multiple Sensors

Create multiple sensors for different purposes:

```
sensor.hki_notify_main        # General notifications
sensor.hki_notify_kitchen     # Kitchen-specific
sensor.hki_notify_security    # Security alerts
sensor.hki_notify_weather     # Weather updates
```

---

## Services

The integration provides three services to manage notifications:

### Create Notification

**Service:** `hki_notify.create`

Creates a new notification or updates an existing one (based on ID).

**Required Fields:**
- `id` - Unique identifier for the notification
- `message` - Notification text content

**Example:**
```yaml
service: hki_notify.create
target:
  entity_id: sensor.hki_notify_main
data:
  id: "door-open"
  message: "Front door is open"
  icon: mdi:door-open
```

---

### Dismiss Notification

**Service:** `hki_notify.dismiss`

Removes a specific notification by ID.

**Required Fields:**
- `id` - ID of notification to dismiss

**Example:**
```yaml
service: hki_notify.dismiss
target:
  entity_id: sensor.hki_notify_main
data:
  id: "door-open"
```

---

### Dismiss All Notifications

**Service:** `hki_notify.dismiss_all`

Removes all notifications from the sensor.

**Example:**
```yaml
service: hki_notify.dismiss_all
target:
  entity_id: sensor.hki_notify_main
```

---

## Service Parameters

### Core Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | string | ✓ | - | Unique notification identifier |
| `message` | string | ✓ | - | Notification text (multiline supported) |
| `icon` | string | | `mdi:bell` | MDI icon name |
| `icon_spin` | boolean | | false | Rotate icon continuously |
| `timestamp` | datetime | | (current time) | ISO timestamp for the notification |

**Example:**
```yaml
service: hki_notify.create
data:
  id: "update-1"
  message: "System update available"
  icon: mdi:update
  icon_spin: true
  timestamp: "2024-01-15T10:30:00"
```

---

### Action Parameters

Configure what happens when the notification is tapped.

| Parameter | Type | Description |
|-----------|------|-------------|
| `action_type` | string | Action type: `call-service`, `navigate`, `url`, `none` |
| `service_action` | action | Service to call (use action selector) |
| `navigation_path` | string | Path for navigation or URL |

#### Action Type: Call Service

```yaml
service: hki_notify.create
data:
  id: "lights-off"
  message: "Tap to turn off all lights"
  icon: mdi:lightbulb-off
  action_type: call-service
  service_action:
    - action: light.turn_off
      target:
        area_id: living_room
```

#### Action Type: Navigate

```yaml
service: hki_notify.create
data:
  id: "camera-motion"
  message: "Motion detected at front door"
  icon: mdi:cctv
  action_type: navigate
  navigation_path: /lovelace/cameras
```

#### Action Type: URL

```yaml
service: hki_notify.create
data:
  id: "weather-alert"
  message: "Severe weather warning"
  icon: mdi:weather-lightning
  action_type: url
  navigation_path: https://weather.com
```

---

### Confirmation Parameters

Add confirmation dialogs before actions execute.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `confirm` | boolean | false | Require confirmation before action |
| `confirm_message` | string | (action type) | Custom confirmation dialog message |

**Example:**
```yaml
service: hki_notify.create
data:
  id: "garage-door"
  message: "Close garage door"
  icon: mdi:garage
  action_type: call-service
  service_action:
    - action: cover.close_cover
      target:
        entity_id: cover.garage_door
  confirm: true
  confirm_message: "Are you sure you want to close the garage door?"
```

---

### Styling Parameters

#### Colors

| Parameter | Type | Description |
|-----------|------|-------------|
| `text_color` | color_rgb | Notification text color |
| `icon_color` | color_rgb | Icon color |
| `bg_color` | color_rgb | Background color |
| `border_color` | color_rgb | Border color |

**Example:**
```yaml
service: hki_notify.create
data:
  id: "alert-1"
  message: "Critical system alert"
  icon: mdi:alert
  text_color: [255, 255, 255]
  icon_color: [255, 0, 0]
  bg_color: [139, 0, 0]
  border_color: [255, 0, 0]
```

#### Typography

| Parameter | Type | Options | Description |
|-----------|------|---------|-------------|
| `font_size` | number | 8-100 | Font size in pixels |
| `font_weight` | string | Light, Regular, Medium, Semi Bold, Bold, Extra Bold | Font weight |
| `alignment` | string | left, center, right | Text alignment |

**Example:**
```yaml
service: hki_notify.create
data:
  id: "announcement"
  message: "Important announcement"
  font_size: 16
  font_weight: Bold
  alignment: center
```

#### Border & Shadow

| Parameter | Type | Description |
|-----------|------|-------------|
| `border_radius` | number | Border radius in pixels (0-50) |
| `box_shadow` | string | CSS box-shadow value |

**Example:**
```yaml
service: hki_notify.create
data:
  id: "styled"
  message: "Custom styled notification"
  border_radius: 12
  box_shadow: "0 4px 20px rgba(255,0,0,0.5)"
```
