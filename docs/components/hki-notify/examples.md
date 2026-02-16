# Examples

### Example 1: Simple Notification

```yaml
service: hki_notify.create
target:
  entity_id: sensor.hki_notify_main
data:
  id: "test-1"
  message: "Hello from HKI Notify!"
  icon: mdi:information
```

### Example 2: Door Open Alert

```yaml
service: hki_notify.create
target:
  entity_id: sensor.hki_notify_main
data:
  id: "door-alert"
  message: "Front door has been open for 5 minutes"
  icon: mdi:door-open
  icon_color: [255, 152, 0]
  action_type: navigate
  navigation_path: /lovelace/security
```

### Example 3: Light Control

```yaml
service: hki_notify.create
target:
  entity_id: sensor.hki_notify_kitchen
data:
  id: "lights-on"
  message: "Kitchen lights left on"
  icon: mdi:lightbulb
  icon_color: [255, 193, 7]
  action_type: call-service
  service_action:
    - action: light.turn_off
      target:
        entity_id: light.kitchen
```

### Example 4: Weather Warning

```yaml
service: hki_notify.create
target:
  entity_id: sensor.hki_notify_main
data:
  id: "weather-warning"
  message: "⚠️ Severe thunderstorm warning in your area"
  icon: mdi:weather-lightning
  text_color: [255, 255, 255]
  bg_color: [255, 87, 34]
  icon_color: [255, 255, 255]
  font_weight: Bold
  action_type: url
  navigation_path: https://weather.com
```

### Example 5: Update Notification

```yaml
service: hki_notify.create
target:
  entity_id: sensor.hki_notify_main
data:
  id: "update-notification"
  message: "Update an existing notification with new text"
  icon: mdi:refresh
  icon_spin: true
```

---

## Automation Examples

### Motion Detection Alert

```yaml
automation:
  - alias: "Motion Detected Notification"
    trigger:
      - platform: state
        entity_id: binary_sensor.front_door_motion
        to: "on"
    action:
      - service: hki_notify.create
        target:
          entity_id: sensor.hki_notify_main
        data:
          id: "motion-{{ now().timestamp() | int }}"
          message: "Motion detected at front door"
          icon: mdi:motion-sensor
          icon_color: [255, 152, 0]
          action_type: navigate
          navigation_path: /lovelace/cameras
```

### Door Left Open Reminder

```yaml
automation:
  - alias: "Door Open Reminder"
    trigger:
      - platform: state
        entity_id: binary_sensor.front_door
        to: "on"
        for:
          minutes: 5
    action:
      - service: hki_notify.create
        target:
          entity_id: sensor.hki_notify_main
        data:
          id: "door-open-reminder"
          message: "Front door open for 5 minutes"
          icon: mdi:door-open
          icon_color: [244, 67, 54]
          action_type: call-service
          service_action:
            - action: notify.mobile_app
              data:
                message: "Front door is still open!"
          
  - alias: "Door Closed - Dismiss Notification"
    trigger:
      - platform: state
        entity_id: binary_sensor.front_door
        to: "off"
    action:
      - service: hki_notify.dismiss
        target:
          entity_id: sensor.hki_notify_main
        data:
          id: "door-open-reminder"
```

### Battery Low Warnings

```yaml
automation:
  - alias: "Low Battery Notifications"
    trigger:
      - platform: numeric_state
        entity_id: sensor.sensor_battery
        below: 20
    action:
      - service: hki_notify.create
        target:
          entity_id: sensor.hki_notify_main
        data:
          id: "battery-{{ trigger.entity_id }}"
          message: "{{ state_attr(trigger.entity_id, 'friendly_name') }} battery low ({{ trigger.to_state.state }}%)"
          icon: mdi:battery-alert
          icon_color: [244, 67, 54]
```

### Washing Machine Complete

```yaml
automation:
  - alias: "Washing Machine Done"
    trigger:
      - platform: state
        entity_id: binary_sensor.washing_machine
        from: "on"
        to: "off"
    action:
      - service: hki_notify.create
        target:
          entity_id: sensor.hki_notify_kitchen
        data:
          id: "washing-done"
          message: "Washing machine cycle complete!"
          icon: mdi:washing-machine
          icon_color: [76, 175, 80]
          bg_color: [200, 230, 201]
```

### Daily Reminder with Dismiss Action

```yaml
automation:
  - alias: "Morning Reminder"
    trigger:
      - platform: time
        at: "08:00:00"
    action:
      - service: hki_notify.create
        target:
          entity_id: sensor.hki_notify_main
        data:
          id: "morning-reminder"
          message: "Don't forget to water the plants!"
          icon: mdi:flower
          icon_color: [76, 175, 80]

  - alias: "Clear Morning Reminder at Night"
    trigger:
      - platform: time
        at: "22:00:00"
    action:
      - service: hki_notify.dismiss
        target:
          entity_id: sensor.hki_notify_main
        data:
          id: "morning-reminder"
```
