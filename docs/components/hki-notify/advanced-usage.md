# Advanced Usage

### Targeting Multiple Sensors

Send the same notification to multiple sensors:

```yaml
service: hki_notify.create
target:
  entity_id:
    - sensor.hki_notify_main
    - sensor.hki_notify_kitchen
    - sensor.hki_notify_bedroom
data:
  id: "emergency-alert"
  message: "Emergency: Smoke detected!"
  icon: mdi:fire
```

### Updating Existing Notifications

Use the same ID to update a notification:

```yaml
# Initial notification
service: hki_notify.create
data:
  id: "download-progress"
  message: "Downloading update... 0%"
  icon: mdi:download

# Update progress
service: hki_notify.create
data:
  id: "download-progress"
  message: "Downloading update... 50%"
  icon: mdi:download

# Final update
service: hki_notify.create
data:
  id: "download-progress"
  message: "Download complete!"
  icon: mdi:check-circle
  icon_color: [76, 175, 80]
```

### Dynamic Notification IDs

Create unique IDs based on triggers:

```yaml
service: hki_notify.create
data:
  id: "motion-{{ trigger.entity_id | replace('.', '-') }}"
  message: "{{ state_attr(trigger.entity_id, 'friendly_name') }}"
```

### Sensor State Tracking

The sensor state shows the current number of notifications:

```yaml
# Template
{{ states('sensor.hki_notify_main') }}
# Returns: "3" (if 3 notifications present)

# Check if notifications exist
{{ states('sensor.hki_notify_main') | int > 0 }}
```

### Accessing Notification Data

```yaml
# All messages
{{ state_attr('sensor.hki_notify_main', 'messages') }}

# First message
{{ state_attr('sensor.hki_notify_main', 'messages')[0].message }}
```
