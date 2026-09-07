# Rooms

The hub view that links out to each individual room's subview. Shared as-is from my own Home Assistant dashboard for reference/inspiration — entity IDs, sensors, and automations are specific to my setup and won't work unmodified in yours.

```yaml
  - type: sections
    max_columns: 4
    title: Rooms
    path: rooms
    icon: mdi:floor-plan
    sections:
      - type: grid
        cards:
          - type: heading
            heading_style: title
            heading: Ground Floor
            icon: mdi:home-floor-g
            badges:
              - type: custom:hki-button-card
                entity: light.downstairs
                card_layout: badge
                show_icon: true
                show_name: false
                state_label: >-
                  {{ expand(config.entity) | selectattr('state','eq','on') |
                  list

                  | count }}
                tap_action:
                  action: hki-more-info
                icon_color_off: var(--primary-color)
          - type: custom:button-card
            name: Living Room
            label: |
              [[[
                return `${states['sensor.woonkamer_keuken_temperature'].state}°C / ${states['sensor.woonkamer_keuken_humidity'].state}%`;
              ]]]
            state_display: No Media Playing
            show_label: true
            show_state: true
            tap_action:
              action: navigate
              navigation_path: living-room
              haptics: light
            styles:
              card:
                - background: >-
                    radial-gradient(transparent, black 99%),
                    url('/local/images/rooms/livingroom.jpg')
                - background-position: center
                - background-repeat: no-repeat
                - background-size: cover
                - border-style: none
                - height: 150px
                - border-radius: 12px
                - box-shadow: none
              name:
                - position: absolute
                - top: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 18px
                - color: white
                - height: 35px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              state:
                - position: absolute
                - bottom: 40px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - height: 0px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              label:
                - position: absolute
                - bottom: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - padding-left: 10px
                - overflow: visible
                - height: 15px
                - text-transform: capitalize
              custom_fields:
                dynamic_icons:
                  - position: absolute
                  - top: 12px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_2:
                  - position: absolute
                  - top: 35px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_3:
                  - position: absolute
                  - right: 0px
                  - bottom: 10px
                  - justify-self: end
                  - align-self: end
                  - font-size: 12px
                  - color: white
                  - font-weight: bold
            custom_fields:
              dynamic_icons: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_woonkamer_lights'].state,
                      icon: 'mdi:lightbulb',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_woonkamer_devices'].state,
                      icon: 'mdi:power-plug',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_2: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_woonkamer_doors'].state,
                      icon: 'mdi:door',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_woonkamer_windows'].state,
                      icon: 'mdi:window-closed',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_3: |
                [[[  
                  const motionState = parseInt(states['sensor.counter_woonkamer_motion'].state, 10) || 0;
                  const presenceState = parseInt(states['sensor.counter_woonkamer_presence'].state, 10) || 0;

                  const sensors = [];

                  if (presenceState > 0) {
                    sensors.push({
                      state: presenceState,
                      icon: 'mdi:circle-double',
                      color: 'purple',
                    });
                  } else if (motionState > 0) {
                    sensors.push({
                      state: motionState,
                      icon: 'mdi:motion-sensor',
                      color: 'red',
                    });
                  }

                  return sensors
                    .map(
                      (sensor) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
          - type: custom:button-card
            name: Dining Room
            label: |
              [[[
                return `${states['sensor.woonkamer_keuken_temperature'].state}°C / ${states['sensor.woonkamer_keuken_humidity'].state}%`;
              ]]]
            state_display: No Media Playing
            show_label: true
            show_state: true
            tap_action:
              action: navigate
              navigation_path: dining-room
              haptics: light
            styles:
              card:
                - background: >-
                    radial-gradient(transparent, black 99%),
                    url('/local/images/rooms/diningroom.jpg')
                - background-position: center
                - background-repeat: no-repeat
                - background-size: cover
                - border-style: none
                - height: 150px
                - border-radius: 12px
                - box-shadow: none
              name:
                - position: absolute
                - top: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 18px
                - color: white
                - height: 35px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              state:
                - position: absolute
                - bottom: 40px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - height: 0px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              label:
                - position: absolute
                - bottom: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - padding-left: 10px
                - overflow: visible
                - height: 15px
                - text-transform: capitalize
              custom_fields:
                dynamic_icons:
                  - position: absolute
                  - top: 12px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_2:
                  - position: absolute
                  - top: 35px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_3:
                  - position: absolute
                  - right: 0px
                  - bottom: 10px
                  - justify-self: end
                  - align-self: end
                  - font-size: 12px
                  - color: white
                  - font-weight: bold
            custom_fields:
              dynamic_icons: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_eetkamer_lights'].state,
                      icon: 'mdi:lightbulb',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_eetkamer_devices'].state,
                      icon: 'mdi:power-plug',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_2: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_eetkamer_doors'].state,
                      icon: 'mdi:door',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_eetkamer_windows'].state,
                      icon: 'mdi:window-closed',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_3: |
                [[[  
                  const motionState = parseInt(states['sensor.counter_eetkamer_motion'].state, 10) || 0;
                  const presenceState = parseInt(states['sensor.counter_eetkamer_presence'].state, 10) || 0;

                  const sensors = [];

                  if (presenceState > 0) {
                    sensors.push({
                      state: presenceState,
                      icon: 'mdi:circle-double',
                      color: 'purple',
                    });
                  } else if (motionState > 0) {
                    sensors.push({
                      state: motionState,
                      icon: 'mdi:motion-sensor',
                      color: 'red',
                    });
                  }

                  return sensors
                    .map(
                      (sensor) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
          - type: custom:button-card
            name: Kitchen
            label: |
              [[[
                return `${states['sensor.woonkamer_keuken_temperature'].state}°C / ${states['sensor.woonkamer_keuken_humidity'].state}%`;
              ]]]
            state_display: No Media Playing
            show_label: true
            show_state: true
            tap_action:
              action: navigate
              navigation_path: kitchen
              haptics: light
            styles:
              card:
                - background: >-
                    radial-gradient(transparent, black 99%),
                    url('/local/images/rooms/kitchen.png')
                - background-position: center
                - background-repeat: no-repeat
                - background-size: cover
                - border-style: none
                - height: 150px
                - border-radius: 12px
                - box-shadow: none
              name:
                - position: absolute
                - top: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 18px
                - color: white
                - height: 35px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              state:
                - position: absolute
                - bottom: 40px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - height: 0px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              label:
                - position: absolute
                - bottom: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - padding-left: 10px
                - overflow: visible
                - height: 15px
                - text-transform: capitalize
              custom_fields:
                dynamic_icons:
                  - position: absolute
                  - top: 12px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_2:
                  - position: absolute
                  - top: 35px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_3:
                  - position: absolute
                  - right: 0px
                  - bottom: 10px
                  - justify-self: end
                  - align-self: end
                  - font-size: 12px
                  - color: white
                  - font-weight: bold
            custom_fields:
              dynamic_icons: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_keuken_lights'].state,
                      icon: 'mdi:lightbulb',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_keuken_devices'].state,
                      icon: 'mdi:power-plug',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_2: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_keuken_doors'].state,
                      icon: 'mdi:door',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_keuken_windows'].state,
                      icon: 'mdi:window-closed',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_3: |
                [[[  
                  const motionState = parseInt(states['sensor.counter_keuken_motion'].state, 10) || 0;
                  const presenceState = parseInt(states['sensor.counter_keuken_presence'].state, 10) || 0;

                  const sensors = [];

                  if (presenceState > 0) {
                    sensors.push({
                      state: presenceState,
                      icon: 'mdi:circle-double',
                      color: 'purple',
                    });
                  } else if (motionState > 0) {
                    sensors.push({
                      state: motionState,
                      icon: 'mdi:motion-sensor',
                      color: 'red',
                    });
                  }

                  return sensors
                    .map(
                      (sensor) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
          - type: custom:button-card
            name: Toilet
            label: |
              [[[
                return `${states['sensor.motion_toilet_temperature'].state}°C`;
              ]]]
            state_display: No Media Playing
            show_label: true
            show_state: true
            tap_action:
              action: navigate
              navigation_path: toilet
              haptics: light
            styles:
              card:
                - background: >-
                    radial-gradient(transparent, black 99%),
                    url('/local/images/rooms/toilet.png')
                - background-position: center
                - background-repeat: no-repeat
                - background-size: cover
                - border-style: none
                - height: 150px
                - border-radius: 12px
                - box-shadow: none
              name:
                - position: absolute
                - top: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 18px
                - color: white
                - height: 35px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              state:
                - position: absolute
                - bottom: 40px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - height: 0px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              label:
                - position: absolute
                - bottom: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - padding-left: 10px
                - overflow: visible
                - height: 15px
                - text-transform: capitalize
              custom_fields:
                dynamic_icons:
                  - position: absolute
                  - top: 12px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_2:
                  - position: absolute
                  - top: 35px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_3:
                  - position: absolute
                  - right: 0px
                  - bottom: 10px
                  - justify-self: end
                  - align-self: end
                  - font-size: 12px
                  - color: white
                  - font-weight: bold
            custom_fields:
              dynamic_icons: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_toilet_lights'].state,
                      icon: 'mdi:lightbulb',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_toilet_devices'].state,
                      icon: 'mdi:power-plug',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_2: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_toilet_doors'].state,
                      icon: 'mdi:door',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_toilet_windows'].state,
                      icon: 'mdi:window-closed',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_3: |
                [[[  
                  const motionState = parseInt(states['sensor.counter_toilet_motion'].state, 10) || 0;
                  const presenceState = parseInt(states['input_boolean.empty'].state, 10) || 0;

                  const sensors = [];

                  if (presenceState > 0) {
                    sensors.push({
                      state: presenceState,
                      icon: 'mdi:circle-double',
                      color: 'purple',
                    });
                  } else if (motionState > 0) {
                    sensors.push({
                      state: motionState,
                      icon: 'mdi:motion-sensor',
                      color: 'red',
                    });
                  }

                  return sensors
                    .map(
                      (sensor) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
          - type: custom:button-card
            name: Hallway Downstairs
            label: |
              [[[
                return `${states['sensor.motion_gang_beneden_temperature'].state}°C`;
              ]]]
            state_display: No Media Playing
            show_label: true
            show_state: true
            tap_action:
              action: navigate
              navigation_path: hallway-downstairs
              haptics: light
            styles:
              card:
                - background: >-
                    radial-gradient(transparent, black 99%),
                    url('/local/images/rooms/hallways.jpg')
                - background-position: center
                - background-repeat: no-repeat
                - background-size: cover
                - border-style: none
                - height: 150px
                - border-radius: 12px
                - box-shadow: none
              name:
                - position: absolute
                - top: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 18px
                - color: white
                - height: 35px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              state:
                - position: absolute
                - bottom: 40px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - height: 0px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              label:
                - position: absolute
                - bottom: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - padding-left: 10px
                - overflow: visible
                - height: 15px
                - text-transform: capitalize
              custom_fields:
                dynamic_icons:
                  - position: absolute
                  - top: 12px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_2:
                  - position: absolute
                  - top: 35px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_3:
                  - position: absolute
                  - right: 0px
                  - bottom: 10px
                  - justify-self: end
                  - align-self: end
                  - font-size: 12px
                  - color: white
                  - font-weight: bold
            custom_fields:
              dynamic_icons: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_gang_beneden_lights'].state,
                      icon: 'mdi:lightbulb',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_gang_beneden_devices'].state,
                      icon: 'mdi:power-plug',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_2: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_gang_beneden_doors'].state,
                      icon: 'mdi:door',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_gang_beneden_windows'].state,
                      icon: 'mdi:window-closed',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_3: |
                [[[  
                  const motionState = parseInt(states['sensor.counter_gang_beneden_motion'].state, 10) || 0;
                  const presenceState = parseInt(states['input_boolean.empty'].state, 10) || 0;

                  const sensors = [];

                  if (presenceState > 0) {
                    sensors.push({
                      state: presenceState,
                      icon: 'mdi:circle-double',
                      color: 'purple',
                    });
                  } else if (motionState > 0) {
                    sensors.push({
                      state: motionState,
                      icon: 'mdi:motion-sensor',
                      color: 'red',
                    });
                  }

                  return sensors
                    .map(
                      (sensor) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
        column_span: 1
      - type: grid
        cards:
          - type: heading
            heading: First Floor
            heading_style: title
            icon: mdi:home-floor-1
            badges:
              - type: custom:hki-button-card
                entity: light.upstairs
                card_layout: badge
                show_icon: true
                show_name: false
                state_label: >-
                  {{ expand(config.entity) | selectattr('state','eq','on') |
                  list

                  | count }}
                tap_action:
                  action: hki-more-info
                icon_color_off: var(--primary-color)
          - type: custom:button-card
            name: Bedroom
            label: |
              [[[
                return `${states['sensor.slaapkamer_temperature'].state}°C / ${states['sensor.slaapkamer_humidity'].state}%`;
              ]]]
            state_display: No Media Playing
            show_label: true
            show_state: true
            tap_action:
              action: navigate
              navigation_path: bedroom
              haptics: light
            styles:
              card:
                - background: >-
                    radial-gradient(transparent, black 99%),
                    url('/local/images/rooms/bedroom.jpg')
                - background-position: center
                - background-repeat: no-repeat
                - background-size: cover
                - border-style: none
                - height: 150px
                - border-radius: 12px
                - box-shadow: none
              name:
                - position: absolute
                - top: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 18px
                - color: white
                - height: 35px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              state:
                - position: absolute
                - bottom: 40px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - height: 0px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              label:
                - position: absolute
                - bottom: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - padding-left: 10px
                - overflow: visible
                - height: 15px
                - text-transform: capitalize
              custom_fields:
                dynamic_icons:
                  - position: absolute
                  - top: 12px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_2:
                  - position: absolute
                  - top: 35px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_3:
                  - position: absolute
                  - right: 0px
                  - bottom: 10px
                  - justify-self: end
                  - align-self: end
                  - font-size: 12px
                  - color: white
                  - font-weight: bold
            custom_fields:
              dynamic_icons: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_slaapkamer_lights'].state,
                      icon: 'mdi:lightbulb',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_slaapkamer_devices'].state,
                      icon: 'mdi:power-plug',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_2: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_slaapkamer_doors'].state,
                      icon: 'mdi:door',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_slaapkamer_windows'].state,
                      icon: 'mdi:window-closed',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_3: |
                [[[  
                  const motionState = parseInt(states['sensor.counter_slaapkamer_motion'].state, 10) || 0;
                  const presenceState = parseInt(states['sensor.counter_slaapkamer_presence'].state, 10) || 0;

                  const sensors = [];

                  if (presenceState > 0) {
                    sensors.push({
                      state: presenceState,
                      icon: 'mdi:circle-double',
                      color: 'purple',
                    });
                  } else if (motionState > 0) {
                    sensors.push({
                      state: motionState,
                      icon: 'mdi:motion-sensor',
                      color: 'red',
                    });
                  }

                  return sensors
                    .map(
                      (sensor) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
          - type: custom:button-card
            name: Office
            label: |
              [[[
                return `${states['sensor.office_temperature'].state}°C / ${states['sensor.office_humidity'].state}%`;
              ]]]
            state_display: No Media Playing
            show_label: true
            show_state: true
            tap_action:
              action: navigate
              navigation_path: office
              haptics: light
            styles:
              card:
                - background: >-
                    radial-gradient(transparent, black 99%),
                    url('/local/images/rooms/office.jpg')
                - background-position: center
                - background-repeat: no-repeat
                - background-size: cover
                - border-style: none
                - height: 150px
                - border-radius: 12px
                - box-shadow: none
              name:
                - position: absolute
                - top: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 18px
                - color: white
                - height: 35px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              state:
                - position: absolute
                - bottom: 40px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - height: 0px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              label:
                - position: absolute
                - bottom: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - padding-left: 10px
                - overflow: visible
                - height: 15px
                - text-transform: capitalize
              custom_fields:
                dynamic_icons:
                  - position: absolute
                  - top: 12px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_2:
                  - position: absolute
                  - top: 35px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_3:
                  - position: absolute
                  - right: 0px
                  - bottom: 10px
                  - justify-self: end
                  - align-self: end
                  - font-size: 12px
                  - color: white
                  - font-weight: bold
            custom_fields:
              dynamic_icons: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_office_lights'].state,
                      icon: 'mdi:lightbulb',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_office_devices'].state,
                      icon: 'mdi:power-plug',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_2: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_office_doors'].state,
                      icon: 'mdi:door',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_office_windows'].state,
                      icon: 'mdi:window-closed',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_3: |
                [[[  
                  const motionState = parseInt(states['sensor.counter_office_motion'].state, 10) || 0;
                  const presenceState = parseInt(states['sensor.counter_office_presence'].state, 10) || 0;

                  const sensors = [];

                  if (presenceState > 0) {
                    sensors.push({
                      state: presenceState,
                      icon: 'mdi:circle-double',
                      color: 'purple',
                    });
                  } else if (motionState > 0) {
                    sensors.push({
                      state: motionState,
                      icon: 'mdi:motion-sensor',
                      color: 'red',
                    });
                  }

                  return sensors
                    .map(
                      (sensor) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
          - type: custom:button-card
            name: Bathroom
            label: |
              [[[
                return `${states['sensor.badkamer_temperature'].state}°C / ${states['sensor.badkamer_humidity'].state}%`;
              ]]]
            state_display: No Media Playing
            show_label: true
            show_state: true
            tap_action:
              action: navigate
              navigation_path: bathroom
              haptics: light
            styles:
              card:
                - background: >-
                    radial-gradient(transparent, black 99%),
                    url('/local/images/rooms/bathroom.jpg')
                - background-position: center
                - background-repeat: no-repeat
                - background-size: cover
                - border-style: none
                - height: 150px
                - border-radius: 12px
                - box-shadow: none
              name:
                - position: absolute
                - top: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 18px
                - color: white
                - height: 35px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              state:
                - position: absolute
                - bottom: 40px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - height: 0px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              label:
                - position: absolute
                - bottom: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - padding-left: 10px
                - overflow: visible
                - height: 15px
                - text-transform: capitalize
              custom_fields:
                dynamic_icons:
                  - position: absolute
                  - top: 12px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_2:
                  - position: absolute
                  - top: 35px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_3:
                  - position: absolute
                  - right: 0px
                  - bottom: 10px
                  - justify-self: end
                  - align-self: end
                  - font-size: 12px
                  - color: white
                  - font-weight: bold
            custom_fields:
              dynamic_icons: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_badkamer_lights'].state,
                      icon: 'mdi:lightbulb',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_badkamer_devices'].state,
                      icon: 'mdi:power-plug',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_2: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_badkamer_doors'].state,
                      icon: 'mdi:door',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_badkamer_windows'].state,
                      icon: 'mdi:window-closed',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_3: |
                [[[  
                  const motionState = parseInt(states['sensor.counter_badkamer_motion'].state, 10) || 0;
                  const presenceState = parseInt(states['sensor.counter_badkamer_presence'].state, 10) || 0;

                  const sensors = [];

                  if (presenceState > 0) {
                    sensors.push({
                      state: presenceState,
                      icon: 'mdi:circle-double',
                      color: 'purple',
                    });
                  } else if (motionState > 0) {
                    sensors.push({
                      state: motionState,
                      icon: 'mdi:motion-sensor',
                      color: 'red',
                    });
                  }

                  return sensors
                    .map(
                      (sensor) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
          - type: custom:button-card
            name: Walk-in-Closet
            label: |
              [[[
                return `${states['sensor.walk_in_closet_temperature'].state}°C / ${states['sensor.walk_in_closet_humidity'].state}%`;
              ]]]
            state_display: No Media Playing
            show_label: true
            show_state: true
            tap_action:
              action: navigate
              navigation_path: walk-in-closet
              haptics: light
            styles:
              card:
                - background: >-
                    radial-gradient(transparent, black 99%),
                    url('/local/images/rooms/wic.png')
                - background-position: center
                - background-repeat: no-repeat
                - background-size: cover
                - border-style: none
                - height: 150px
                - border-radius: 12px
                - box-shadow: none
              name:
                - position: absolute
                - top: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 18px
                - color: white
                - height: 35px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              state:
                - position: absolute
                - bottom: 40px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - height: 0px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              label:
                - position: absolute
                - bottom: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - padding-left: 10px
                - overflow: visible
                - height: 15px
                - text-transform: capitalize
              custom_fields:
                dynamic_icons:
                  - position: absolute
                  - top: 12px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_2:
                  - position: absolute
                  - top: 35px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_3:
                  - position: absolute
                  - right: 0px
                  - bottom: 10px
                  - justify-self: end
                  - align-self: end
                  - font-size: 12px
                  - color: white
                  - font-weight: bold
            custom_fields:
              dynamic_icons: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_walk_in_closet_lights'].state,
                      icon: 'mdi:lightbulb',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_walk_in_closet_devices'].state,
                      icon: 'mdi:power-plug',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_2: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_walk_in_closet_doors'].state,
                      icon: 'mdi:door',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_walk_in_closet_windows'].state,
                      icon: 'mdi:window-closed',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_3: |
                [[[  
                  const motionState = parseInt(states['sensor.counter_walk_in_closet_motion'].state, 10) || 0;
                  const presenceState = parseInt(states['sensor.counter_walk_in_closet_presence'].state, 10) || 0;

                  const sensors = [];

                  if (presenceState > 0) {
                    sensors.push({
                      state: presenceState,
                      icon: 'mdi:circle-double',
                      color: 'purple',
                    });
                  } else if (motionState > 0) {
                    sensors.push({
                      state: motionState,
                      icon: 'mdi:motion-sensor',
                      color: 'red',
                    });
                  }

                  return sensors
                    .map(
                      (sensor) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
          - type: custom:button-card
            name: Hallway Upstairs
            label: |
              [[[
                return `${states['sensor.motion_gang_boven_temperature'].state}°C`;
              ]]]
            state_display: No Media Playing
            show_label: true
            show_state: true
            tap_action:
              action: navigate
              navigation_path: hallway-upstairs
              haptics: light
            styles:
              card:
                - background: >-
                    radial-gradient(transparent, black 99%),
                    url('/local/images/rooms/hallways_upstairs.jpg')
                - background-position: center
                - background-repeat: no-repeat
                - background-size: cover
                - border-style: none
                - height: 150px
                - border-radius: 12px
                - box-shadow: none
              name:
                - position: absolute
                - top: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 18px
                - color: white
                - height: 35px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              state:
                - position: absolute
                - bottom: 40px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - height: 0px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              label:
                - position: absolute
                - bottom: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - padding-left: 10px
                - overflow: visible
                - height: 15px
                - text-transform: capitalize
              custom_fields:
                dynamic_icons:
                  - position: absolute
                  - top: 12px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_2:
                  - position: absolute
                  - top: 35px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_3:
                  - position: absolute
                  - right: 0px
                  - bottom: 10px
                  - justify-self: end
                  - align-self: end
                  - font-size: 12px
                  - color: white
                  - font-weight: bold
            custom_fields:
              dynamic_icons: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_gang_boven_lights'].state,
                      icon: 'mdi:lightbulb',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_gang_boven_devices'].state,
                      icon: 'mdi:power-plug',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_2: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_gang_boven_doors'].state,
                      icon: 'mdi:door',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_gang_boven_windows'].state,
                      icon: 'mdi:window-closed',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_3: |
                [[[  
                  const motionState = parseInt(states['sensor.counter_gang_boven_motion'].state, 10) || 0;
                  const presenceState = parseInt(states['input_boolean.empty'].state, 10) || 0;

                  const sensors = [];

                  if (presenceState > 0) {
                    sensors.push({
                      state: presenceState,
                      icon: 'mdi:circle-double',
                      color: 'purple',
                    });
                  } else if (motionState > 0) {
                    sensors.push({
                      state: motionState,
                      icon: 'mdi:motion-sensor',
                      color: 'red',
                    });
                  }

                  return sensors
                    .map(
                      (sensor) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
      - type: grid
        cards:
          - type: heading
            heading_style: title
            heading: Second Floor
            icon: mdi:home-floor-2
            badges:
              - type: custom:hki-button-card
                entity: light.attic
                card_layout: badge
                show_icon: true
                show_name: false
                state_label: >-
                  {{ expand(config.entity) | selectattr('state','eq','on') |
                  list

                  | count }}
                tap_action:
                  action: hki-more-info
                icon_color_off: var(--primary-color)
          - type: custom:button-card
            name: Attic Front
            label: |
              [[[
                return `${states['sensor.zolder_voor_temperature'].state}°C / ${states['sensor.zolder_voor_humidity'].state}%`;
              ]]]
            state_display: No Media Playing
            show_label: true
            show_state: true
            tap_action:
              action: navigate
              navigation_path: attic-front
              haptics: light
            styles:
              card:
                - background: >-
                    radial-gradient(transparent, black 99%),
                    url('/local/images/rooms/attic_front.png')
                - background-position: center
                - background-repeat: no-repeat
                - background-size: cover
                - border-style: none
                - height: 150px
                - border-radius: 12px
                - box-shadow: none
              name:
                - position: absolute
                - top: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 18px
                - color: white
                - height: 35px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              state:
                - position: absolute
                - bottom: 40px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - height: 0px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              label:
                - position: absolute
                - bottom: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - padding-left: 10px
                - overflow: visible
                - height: 15px
                - text-transform: capitalize
              custom_fields:
                dynamic_icons:
                  - position: absolute
                  - top: 12px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_2:
                  - position: absolute
                  - top: 35px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_3:
                  - position: absolute
                  - right: 0px
                  - bottom: 10px
                  - justify-self: end
                  - align-self: end
                  - font-size: 12px
                  - color: white
                  - font-weight: bold
            custom_fields:
              dynamic_icons: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_zolder_voor_lights'].state,
                      icon: 'mdi:lightbulb',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_zolder_voor_devices'].state,
                      icon: 'mdi:power-plug',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_2: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_zolder_voor_doors'].state,
                      icon: 'mdi:door',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_zolder_voor_windows'].state,
                      icon: 'mdi:window-closed',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_3: |
                [[[  
                  const motionState = parseInt(states['sensor.counter_zolder_voor_motion'].state, 10) || 0;
                  const presenceState = parseInt(states['sensor.counter_zolder_voor_presence'].state, 10) || 0;

                  const sensors = [];

                  if (presenceState > 0) {
                    sensors.push({
                      state: presenceState,
                      icon: 'mdi:circle-double',
                      color: 'purple',
                    });
                  } else if (motionState > 0) {
                    sensors.push({
                      state: motionState,
                      icon: 'mdi:motion-sensor',
                      color: 'red',
                    });
                  }

                  return sensors
                    .map(
                      (sensor) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
          - type: custom:button-card
            name: Attic Back
            label: |
              [[[
                return `${states['sensor.zolder_achter_temperature'].state}°C / ${states['sensor.zolder_achter_humidity'].state}%`;
              ]]]
            state_display: No Media Playing
            show_label: true
            show_state: true
            tap_action:
              action: navigate
              navigation_path: attic-back
              haptics: light
            styles:
              card:
                - background: >-
                    radial-gradient(transparent, black 99%),
                    url('/local/images/rooms/attic_back.png')
                - background-position: center
                - background-repeat: no-repeat
                - background-size: cover
                - border-style: none
                - height: 150px
                - border-radius: 12px
                - box-shadow: none
              name:
                - position: absolute
                - top: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 18px
                - color: white
                - height: 35px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              state:
                - position: absolute
                - bottom: 40px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - height: 0px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              label:
                - position: absolute
                - bottom: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - padding-left: 10px
                - overflow: visible
                - height: 15px
                - text-transform: capitalize
              custom_fields:
                dynamic_icons:
                  - position: absolute
                  - top: 12px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_2:
                  - position: absolute
                  - top: 35px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_3:
                  - position: absolute
                  - right: 0px
                  - bottom: 10px
                  - justify-self: end
                  - align-self: end
                  - font-size: 12px
                  - color: white
                  - font-weight: bold
            custom_fields:
              dynamic_icons: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_zolder_achter_lights'].state,
                      icon: 'mdi:lightbulb',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_zolder_achter_devices'].state,
                      icon: 'mdi:power-plug',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_2: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_zolder_achter_doors'].state,
                      icon: 'mdi:door',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_zolder_achter_windows'].state,
                      icon: 'mdi:window-closed',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_3: |
                [[[  
                  const motionState = parseInt(states['sensor.counter_zolder_achter_motion'].state, 10) || 0;
                  const presenceState = parseInt(states['sensor.counter_zolder_achter_presence'].state, 10) || 0;

                  const sensors = [];

                  if (presenceState > 0) {
                    sensors.push({
                      state: presenceState,
                      icon: 'mdi:circle-double',
                      color: 'purple',
                    });
                  } else if (motionState > 0) {
                    sensors.push({
                      state: motionState,
                      icon: 'mdi:motion-sensor',
                      color: 'red',
                    });
                  }

                  return sensors
                    .map(
                      (sensor) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
          - type: custom:button-card
            name: Laundry Room
            label: |
              [[[
                return `${states['sensor.aqara_th_overloop_temperature'].state}°C / ${states['sensor.aqara_th_overloop_humidity'].state}%`;
              ]]]
            state_display: No Media Playing
            show_label: true
            show_state: true
            tap_action:
              action: navigate
              navigation_path: laundry-room
              haptics: light
            styles:
              card:
                - background: >-
                    radial-gradient(transparent, black 99%),
                    url('/local/images/rooms/laundryroom.jpg')
                - background-position: center
                - background-repeat: no-repeat
                - background-size: cover
                - border-style: none
                - height: 150px
                - border-radius: 12px
                - box-shadow: none
              name:
                - position: absolute
                - top: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 18px
                - color: white
                - height: 35px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              state:
                - position: absolute
                - bottom: 40px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - height: 0px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              label:
                - position: absolute
                - bottom: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - padding-left: 10px
                - overflow: visible
                - height: 15px
                - text-transform: capitalize
              custom_fields:
                dynamic_icons:
                  - position: absolute
                  - top: 12px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_2:
                  - position: absolute
                  - top: 35px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_3:
                  - position: absolute
                  - right: 0px
                  - bottom: 10px
                  - justify-self: end
                  - align-self: end
                  - font-size: 12px
                  - color: white
                  - font-weight: bold
            custom_fields:
              dynamic_icons: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_overloop_lights'].state,
                      icon: 'mdi:lightbulb',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_overloop_devices'].state,
                      icon: 'mdi:power-plug',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_2: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_overloop_doors'].state,
                      icon: 'mdi:door',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_overloop_windows'].state,
                      icon: 'mdi:window-closed',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_3: |
                [[[  
                  const motionState = parseInt(states['sensor.counter_overloop_motion'].state, 10) || 0;
                  const presenceState = parseInt(states['sensor.counter_overloop_presence'].state, 10) || 0;

                  const sensors = [];

                  if (presenceState > 0) {
                    sensors.push({
                      state: presenceState,
                      icon: 'mdi:circle-double',
                      color: 'purple',
                    });
                  } else if (motionState > 0) {
                    sensors.push({
                      state: motionState,
                      icon: 'mdi:motion-sensor',
                      color: 'red',
                    });
                  }

                  return sensors
                    .map(
                      (sensor) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
      - type: grid
        cards:
          - type: heading
            heading: Outside
            heading_style: title
            icon: mdi:home-floor-0
            badges:
              - type: custom:hki-button-card
                entity: light.outside
                card_layout: badge
                show_icon: true
                show_name: false
                state_label: >-
                  {{ expand(config.entity) | selectattr('state','eq','on') |
                  list

                  | count }}
                tap_action:
                  action: hki-more-info
                icon_color_off: var(--primary-color)
          - type: custom:button-card
            name: Front Yard
            label: |
              [[[
                return `${states['sensor.aqara_th_buiten_temperature'].state}°C / ${states['sensor.aqara_th_buiten_humidity'].state}%`;
              ]]]
            state_display: No Media Playing
            show_label: true
            show_state: true
            tap_action:
              action: navigate
              navigation_path: front-yard
              haptics: light
            styles:
              card:
                - background: >-
                    radial-gradient(transparent, black 99%),
                    url('/local/images/rooms/frontyard.png')
                - background-position: center
                - background-repeat: no-repeat
                - background-size: cover
                - border-style: none
                - height: 150px
                - border-radius: 12px
                - box-shadow: none
              name:
                - position: absolute
                - top: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 18px
                - color: white
                - height: 35px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              state:
                - position: absolute
                - bottom: 40px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - height: 0px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              label:
                - position: absolute
                - bottom: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - padding-left: 10px
                - overflow: visible
                - height: 15px
                - text-transform: capitalize
              custom_fields:
                dynamic_icons:
                  - position: absolute
                  - top: 12px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_2:
                  - position: absolute
                  - top: 35px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_3:
                  - position: absolute
                  - right: 0px
                  - bottom: 10px
                  - justify-self: end
                  - align-self: end
                  - font-size: 12px
                  - color: white
                  - font-weight: bold
            custom_fields:
              dynamic_icons: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_tuin_voor_lights'].state,
                      icon: 'mdi:lightbulb',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_tuin_voor_devices'].state,
                      icon: 'mdi:power-plug',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_2: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_tuin_voor_doors'].state,
                      icon: 'mdi:door',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_tuin_voor_windows'].state,
                      icon: 'mdi:window-closed',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_3: |
                [[[  
                  const motionState = parseInt(states['sensor.counter_tuin_voor_motion'].state, 10) || 0;
                  const presenceState = parseInt(states['input_boolean.empty'].state, 10) || 0;

                  const sensors = [];

                  if (presenceState > 0) {
                    sensors.push({
                      state: presenceState,
                      icon: 'mdi:circle-double',
                      color: 'purple',
                    });
                  } else if (motionState > 0) {
                    sensors.push({
                      state: motionState,
                      icon: 'mdi:motion-sensor',
                      color: 'red',
                    });
                  }

                  return sensors
                    .map(
                      (sensor) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
          - type: custom:button-card
            name: Back Yard
            label: |
              [[[
                return `${states['sensor.aqara_th_buiten_temperature'].state}°C / ${states['sensor.aqara_th_buiten_humidity'].state}%`;
              ]]]
            state_display: No Media Playing
            show_label: true
            show_state: true
            tap_action:
              action: navigate
              navigation_path: back-yard
              haptics: light
            styles:
              card:
                - background: >-
                    radial-gradient(transparent, black 99%),
                    url('/local/images/rooms/backyard.png')
                - background-position: center
                - background-repeat: no-repeat
                - background-size: cover
                - border-style: none
                - height: 150px
                - border-radius: 12px
                - box-shadow: none
              name:
                - position: absolute
                - top: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 18px
                - color: white
                - height: 35px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              state:
                - position: absolute
                - bottom: 40px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - height: 0px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              label:
                - position: absolute
                - bottom: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - padding-left: 10px
                - overflow: visible
                - height: 15px
                - text-transform: capitalize
              custom_fields:
                dynamic_icons:
                  - position: absolute
                  - top: 12px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_2:
                  - position: absolute
                  - top: 35px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_3:
                  - position: absolute
                  - right: 0px
                  - bottom: 10px
                  - justify-self: end
                  - align-self: end
                  - font-size: 12px
                  - color: white
                  - font-weight: bold
            custom_fields:
              dynamic_icons: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_tuin_achter_lights'].state,
                      icon: 'mdi:lightbulb',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_tuin_achter_devices'].state,
                      icon: 'mdi:power-plug',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_2: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_tuin_achter_doors'].state,
                      icon: 'mdi:door',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_tuin_achter_windows'].state,
                      icon: 'mdi:window-closed',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_3: |
                [[[  
                  const motionState = parseInt(states['sensor.counter_tuin_achter_motion'].state, 10) || 0;
                  const presenceState = parseInt(states['sensor.counter_tuin_achter_garage_presence'].state, 10) || 0;

                  const sensors = [];

                  if (presenceState > 0) {
                    sensors.push({
                      state: presenceState,
                      icon: 'mdi:circle-double',
                      color: 'purple',
                    });
                  } else if (motionState > 0) {
                    sensors.push({
                      state: motionState,
                      icon: 'mdi:motion-sensor',
                      color: 'red',
                    });
                  }

                  return sensors
                    .map(
                      (sensor) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
          - type: custom:button-card
            name: Garage
            label: |
              [[[
                return `${states['sensor.aqara_th_garage_temperature'].state}°C / ${states['sensor.aqara_th_garage_humidity'].state}%`;
              ]]]
            state_display: No Media Playing
            show_label: true
            show_state: true
            tap_action:
              action: navigate
              navigation_path: garage
              haptics: light
            styles:
              card:
                - background: >-
                    radial-gradient(transparent, black 99%),
                    url('/local/images/rooms/backyard.jpg')
                - background-position: center
                - background-repeat: no-repeat
                - background-size: cover
                - border-style: none
                - height: 150px
                - border-radius: 12px
                - box-shadow: none
              name:
                - position: absolute
                - top: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 18px
                - color: white
                - height: 35px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              state:
                - position: absolute
                - bottom: 40px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - height: 0px
                - padding-left: 10px
                - overflow: visible
                - text-transform: capitalize
              label:
                - position: absolute
                - bottom: 10px
                - justify-self: start
                - font-weight: 900
                - font-size: 11px
                - color: white
                - padding-left: 10px
                - overflow: visible
                - height: 15px
                - text-transform: capitalize
              custom_fields:
                dynamic_icons:
                  - position: absolute
                  - top: 12px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_2:
                  - position: absolute
                  - top: 35px
                  - right: 0px
                  - display: flex
                  - flex-direction: row-reverse
                  - justify-content: flex-end
                  - align-items: center
                dynamic_icons_row_3:
                  - position: absolute
                  - right: 0px
                  - bottom: 10px
                  - justify-self: end
                  - align-self: end
                  - font-size: 12px
                  - color: white
                  - font-weight: bold
            custom_fields:
              dynamic_icons: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_garage_lights'].state,
                      icon: 'mdi:lightbulb',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_garage_devices'].state,
                      icon: 'mdi:power-plug',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_2: |
                [[[
                  const sensors = [
                    {
                      state: states['sensor.counter_garage_doors'].state,
                      icon: 'mdi:door',
                      color: 'white',
                    },
                    {
                      state: states['sensor.counter_garage_windows'].state,
                      icon: 'mdi:window-closed',
                      color: 'white',
                    }
                  ];
                  
                  // Filter out sensors with no state or state = 0
                  const filteredSensors = sensors.filter((sensor) => sensor.state > 0);

                  // Build HTML dynamically
                  return filteredSensors
                    .map(
                      (sensor, index) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
              dynamic_icons_row_3: |
                [[[  
                  const motionState = parseInt(states['sensor.counter_garage_motion'].state, 10) || 0;
                  const presenceState = parseInt(states['sensor.counter_tuin_achter_garage_presence'].state, 10) || 0;

                  const sensors = [];

                  if (presenceState > 0) {
                    sensors.push({
                      state: presenceState,
                      icon: 'mdi:circle-double',
                      color: 'purple',
                    });
                  } else if (motionState > 0) {
                    sensors.push({
                      state: motionState,
                      icon: 'mdi:motion-sensor',
                      color: 'red',
                    });
                  }

                  return sensors
                    .map(
                      (sensor) => `
                      <div style="
                        display: inline-flex;
                        align-items: center;
                        margin-right: 10px;
                        color: ${sensor.color};
                        font-size: 12px;
                        font-weight: bold;
                      ">
                        ${sensor.state} <ha-icon icon="${sensor.icon}" style="width: 16px; height: 16px; margin-left: 4px;"></ha-icon>
                      </div>`
                    )
                    .join('');
                ]]]
      - type: grid
        cards:
          - type: custom:hki-navigation-card
            position: bottom-right
            offset_x: 12
            offset_y: 20
            button_size: 50
            gap: 12
            vertical_gap: 12
            z_index: 5
            base:
              button:
                id: 4e8c1d57-1c4c-48cb-83a0-447264197745
                icon: mdi:home
                tooltip: Home
                label: ''
                entity: input_boolean.kiosk_mode
                button_type: icon
                background: ''
                background_opacity: ''
                icon_color: ''
                label_style: {}
                pill_width: ''
                tap_action:
                  action: navigate
                  navigation_path: /lovelace/home
                hold_action:
                  action: none
                double_tap_action:
                  action: toggle
            horizontal:
              enabled: true
              columns: 6
              buttons:
                - id: b6cbacab-fcf7-41be-a009-6d9961181441
                  icon: mdi:chevron-left
                  tooltip: Overview
                  label: ''
                  entity: ''
                  button_type: icon
                  background: DarkOrange
                  background_opacity: ''
                  icon_color: ''
                  label_style: {}
                  pill_width: ''
                  conditions_mode: all
                  conditions: []
                  tap_action:
                    action: back
                    navigation_path: /lovelace/rooms
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
            vertical:
              enabled: false
              rows: 6
              buttons:
                - id: e1fd568d-f004-44c3-9207-cf3458f8d84f
                  icon: mdi:cog
                  tooltip: Settings
                  label: Settings
                  entity: ''
                  button_type: pill
                  background: ''
                  background_opacity: ''
                  icon_color: ''
                  label_style: {}
                  pill_width: ''
                  conditions_mode: all
                  conditions: []
                  tap_action:
                    action: navigate
                    navigation_path: /config
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
            default_background: ''
            default_button_opacity: 1
            default_icon_color: ''
            button_box_shadow: 0 8px 24px rgba(0, 0, 0, 0.35)
            button_box_shadow_hover: 0 10px 30px rgba(0, 0, 0, 0.42)
            default_button_type: icon
            label_style:
              font_size: 12
              font_weight: 600
              letter_spacing: 0
              text_transform: none
              color: ''
              background: ''
              background_opacity: 0.72
              padding_x: 10
              padding_y: 6
              border_radius: 999
              backdrop_blur: 8
              max_width: 220
            pill_width: 0
            center_spread: false
            offset_x_mobile: null
            offset_x_tablet: null
            offset_x_desktop: null
            bottom_bar_enabled: false
            bottom_bar_height: 85
            bottom_bar_color: rgb(var(--rgb-card-background-color, 0,0,0))
            bottom_bar_opacity: 0.85
            bottom_bar_full_width: false
            bottom_bar_border_radius: 0
            bottom_bar_box_shadow: ''
            bottom_bar_bottom_offset: 0
            bottom_bar_margin_left: 0
            bottom_bar_margin_right: 0
            bottom_bar_border_width: 0
            bottom_bar_border_style: solid
            bottom_bar_border_color: ''
      - type: grid
        cards: []
    header:
      layout: center
      badges_position: bottom
      badges_wrap: wrap
      card:
        type: custom:hki-header-card
        title: Rooms
        subtitle: >-
          Average: {{ states('sensor.average_temperature') }}°C / {{
          states('sensor.average_humidity') }}%
        background: >-
          https://dsuj2mkiosyd2.cloudfront.net/unified-gallery/211122/2777/5782fd2a/celtic-sample.jpg?t=1637580943
        height_vh: 35
        min_height: 215
        max_height: 270
        badges_gap: 30
        badges_fixed: true
        top_bar:
          enabled: true
        top_bar_left:
          type: notifications
          offset_x: 0
          custom:
            card:
              type: custom:hki-notification-card
              use_header_styling: true
              show_background: false
              show_empty: true
              display_mode: ticker
              animation: bounce
              direction: right
              time_format: '24'
              entity: sensor.hki_notify_main
              popup_width: auto
              popup_height: auto
              popup_open_animation: scale
              popup_close_animation: scale
        top_bar_center:
          type: button
          actions:
            tap_action:
              action: hki-more-info
              entity: number.garage_door_client_id
        top_bar_right:
          type: weather
          weather:
            entity: weather.openweathermap
            show_humidity: false
            show_wind: false
            show_pressure: false
            icon_color_mode: state
            animate_icon: float
          actions:
            tap_action:
              action: more-info
              entity: weather.buienradar
        bottom_bar_left:
          type: none
        bottom_bar_center:
          type: none
        bottom_bar_right:
          type: none
        persons:
          enabled: false
    layout: {}
    cards: []
    dense_section_placement: false
    badges:
      - type: entity
        show_name: true
        show_state: true
        show_icon: true
        entity: person.stephanie
        show_entity_picture: true
        name: Stephanie
      - type: entity
        show_name: true
        show_state: true
        show_icon: true
        entity: person.jimmy
        show_entity_picture: true
        name: Stephanie
```
