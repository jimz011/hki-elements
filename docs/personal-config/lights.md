# Lights

Lighting control overview. Shared as-is from my own Home Assistant dashboard for reference/inspiration — entity IDs, sensors, and automations are specific to my setup and won't work unmodified in yours.

```yaml
  - type: sections
    max_columns: 4
    title: Lights
    path: lights
    icon: hue:bulb-group-filament-sultan
    subview: true
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
                icon: mdi:home-floor-g
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
          - type: heading
            heading_style: subtitle
            heading: Living Room
            icon: mdi:sofa
            badges:
              - type: custom:hki-button-card
                entity: light.lights_woonkamer
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
          - type: grid
            cards:
              - type: custom:hki-button-card
                entity: light.woonkamer_voor
                icon: hue:bulb-spot-hung
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.woonkamer_achter
                icon: hue:bulb-spot-hung
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.tv_meubel_leds
                name: TV LEDs
                icon: hue:lightstrip
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.rgbcw_light_strip
                icon: hue:lightstrip
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.gordijnen_leds
                icon: hue:lightstrip
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.dressoir_leds
                icon: hue:lightstrip
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.bar_leds
                icon: hue:lightstrip
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.led_standing_lamp
                icon: phu:nanoleaf-floorlamp
                name: Standing LEDs
                hold_action:
                  action: none
                tap_action:
                  action: hki-more-info
                show_brightness: false
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                custom_popup:
                  enabled: true
                  card:
                    type: vertical-stack
                    cards:
                      - type: grid
                        columns: 4
                        cards:
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_on
                            icon: mdi:power-on
                            name: 'ON'
                            tap_action:
                              action: call-service
                              service: light.turn_on
                              service_data:
                                entity_id: light.led_standing_lamp
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_off
                            icon: mdi:power-off
                            name: 'OFF'
                            tap_action:
                              action: call-service
                              service: light.turn_off
                              service_data:
                                entity_id: light.led_standing_lamp
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                                - background-color: transparent
                                - border-style: none
                            card_type: blank-card
                            aspect_ratio: 1/1
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_auto
                            icon: mdi:lightbulb-auto
                            name: AUTO
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_auto
                      - type: grid
                        columns: 5
                        cards:
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                                - background-color: transparent
                                - border-style: none
                            card_type: blank-card
                            aspect_ratio: 5/1
                      - type: grid
                        columns: 4
                        cards:
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                                - background-color: transparent
                                - border-style: none
                            card_type: blank-card
                            aspect_ratio: 1/1
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_brightness_up
                            icon: mdi:weather-sunny
                            name: Brightness
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_brightness_up
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_speed_up
                            icon: mdi:rabbit
                            name: Speed
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_speed_up
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_preset_up
                            icon: mdi:menu-up
                            name: Preset
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_preset_up
                      - type: grid
                        columns: 4
                        cards:
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                                - background-color: transparent
                                - border-style: none
                            card_type: blank-card
                            aspect_ratio: 1/1
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_brightness_down
                            icon: mdi:weather-night
                            name: Brightness
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_brightness_down
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_speed_down
                            icon: mdi:tortoise
                            name: Speed
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_speed_down
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_preset_down
                            icon: mdi:menu-down
                            name: Preset
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_preset_down
                      - type: grid
                        columns: 5
                        cards:
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                                - background-color: transparent
                                - border-style: none
                            card_type: blank-card
                            aspect_ratio: 5/1
                      - type: grid
                        columns: 4
                        cards:
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_red
                            icon: mdi:alpha-r-box
                            name: RED
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_red
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_green
                            icon: mdi:alpha-g-box
                            name: GREEN
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_green
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_blue
                            icon: mdi:alpha-b-box
                            name: BLUE
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_blue
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_white
                            icon: mdi:alpha-w-box
                            name: WHITE
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_white
                      - type: grid
                        columns: 5
                        cards:
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                                - background-color: transparent
                                - border-style: none
                            card_type: blank-card
                            aspect_ratio: 5/1
                      - type: grid
                        columns: 4
                        cards:
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                                - background-color: transparent
                                - border-style: none
                            card_type: blank-card
                            aspect_ratio: 1/1
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_music_1
                            icon: mdi:music-note
                            name: Music 1
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_music_1
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_music_2
                            icon: mdi:music-circle
                            name: Music 2
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_music_2
                          - type: custom:button-card
                            styles:
                              card:
                                - box-shadow: none
                            aspect_ratio: 1/1
                            entity: scene.led_lamp_music_3
                            icon: mdi:music-box
                            name: Music 3
                            tap_action:
                              action: call-service
                              service: scene.turn_on
                              service_data:
                                entity_id: scene.led_lamp_music_3
          - type: heading
            icon: mdi:silverware-fork-knife
            heading_style: subtitle
            heading: Dining Room
            badges:
              - type: custom:hki-button-card
                icon_double_tap_action:
                  action: none
                entity: light.lights_eetkamer
                card_layout: badge
                show_icon: true
                show_name: false
                state_label: >-
                  {{ expand('light.lights_eetkamer') |
                  selectattr('state','eq','on') | list

                  | count }}
                tap_action:
                  action: hki-more-info
                icon_color_off: var(--primary-color)
          - type: grid
            cards:
              - type: custom:hki-button-card
                entity: light.eetkamer_spots
                use_entity_picture: false
                name: Spots
                icon: hue:bulb-spot-hung
                icon_circle_border_style: solid
                icon_circle_border_color: black
                icon_circle_border_width: '1'
                icon_color_off: var(--primary-color)
                tap_action:
                  action: toggle
                double_tap_action:
                  action: hki-more-info
                icon_double_tap_action:
                  action: none
                card_opacity_off: 0.7
              - type: custom:hki-button-card
                entity: light.eetkamer_filaments
                icon: hue:bulb-filament
                name: Filaments
                icon_circle_bg_on: ''
                icon_color_off: var(--primary-color)
                icon_double_tap_action:
                  action: none
                card_opacity_off: 0.7
                double_tap_action:
                  action: hki-more-info
                icon_circle_border_style: solid
                icon_circle_border_color: black
                icon_circle_border_width: '1'
              - type: custom:hki-button-card
                entity: light.eetkamer_leds
                name: LEDs
                icon: hue:gradient-lightstrip
                icon_circle_border_style: solid
                icon_circle_border_color: black
                icon_circle_border_width: '1'
                icon_color_off: var(--primary-color)
                icon_double_tap_action:
                  action: none
                card_opacity_off: 0.7
                double_tap_action:
                  action: hki-more-info
          - type: heading
            icon: mdi:fridge
            heading: Kitchen
            heading_style: subtitle
            badges:
              - type: custom:hki-button-card
                icon_double_tap_action:
                  action: none
                entity: light.lights_keuken
                card_layout: badge
                show_icon: true
                show_name: false
                state_label: >-
                  {{ expand('light.lights_keuken') |
                  selectattr('state','eq','on') | list

                  | count }}
                tap_action:
                  action: hki-more-info
                icon_color_off: var(--primary-color)
          - type: grid
            cards:
              - type: custom:hki-button-card
                entity: light.keuken_spots
                use_entity_picture: false
                name: Spots
                icon: hue:bulb-spot-hung
                icon_circle_border_style: solid
                icon_circle_border_color: black
                icon_circle_border_width: '1'
                icon_color_off: var(--primary-color)
                tap_action:
                  action: toggle
                double_tap_action:
                  action: hki-more-info
                icon_double_tap_action:
                  action: none
                card_opacity_off: 0.7
              - type: custom:hki-button-card
                entity: light.kookeiland_leds
                name: LEDs
                icon: hue:gradient-lightstrip
                icon_circle_border_style: solid
                icon_circle_border_color: black
                icon_circle_border_width: '1'
                icon_color_off: var(--primary-color)
                icon_double_tap_action:
                  action: none
                card_opacity_off: 0.7
                double_tap_action:
                  action: hki-more-info
              - type: custom:hki-button-card
                entity: light.voorraadkast
                icon: hue:bulb-sultan-hung
                name: Voorraadkast
                icon_circle_bg_on: ''
                icon_color_off: var(--primary-color)
                icon_double_tap_action:
                  action: none
                card_opacity_off: 0.7
                double_tap_action:
                  action: hki-more-info
                icon_circle_border_style: solid
                icon_circle_border_color: black
                icon_circle_border_width: '1'
          - type: heading
            icon: mdi:paper-roll
            heading_style: subtitle
            heading: Toilet
            badges:
              - type: custom:hki-button-card
                icon_double_tap_action:
                  action: none
                entity: light.toilet
                card_layout: badge
                show_icon: true
                show_name: false
                state_label: >-
                  {{ expand('light.toilet') | selectattr('state','eq','on') |
                  list

                  | count }}
                tap_action:
                  action: hki-more-info
                icon_color_off: var(--primary-color)
          - type: grid
            cards:
              - type: custom:hki-button-card
                entity: light.toilet
                name: Plafond
                icon: hue:bulb-sultan-hung
                icon_circle_border_style: solid
                icon_circle_border_color: black
                icon_circle_border_width: '1'
                icon_color_off: var(--primary-color)
                icon_double_tap_action:
                  action: none
                double_tap_action:
                  action: hki-more-info
                card_opacity_off: 0.7
          - type: heading
            icon: hue:room-hallway
            heading_style: subtitle
            heading: Hallway Downstairs
            badges:
              - type: custom:hki-button-card
                icon_double_tap_action:
                  action: none
                entity: light.gang_beneden
                card_layout: badge
                show_icon: true
                show_name: false
                state_label: >-
                  {{ expand('light.gang_beneden') |
                  selectattr('state','eq','on') | list

                  | count }}
                tap_action:
                  action: hki-more-info
                icon_color_off: var(--primary-color)
          - type: grid
            cards:
              - type: custom:hki-button-card
                entity: light.gang_beneden
                name: Plafond
                icon: hue:bulb-filament
                icon_circle_border_style: solid
                icon_circle_border_color: black
                icon_circle_border_width: '1'
                icon_color_off: var(--primary-color)
                icon_double_tap_action:
                  action: none
                double_tap_action:
                  action: hki-more-info
                card_opacity_off: 0.7
      - type: grid
        cards:
          - type: heading
            icon: mdi:home-floor-1
            heading_style: title
            heading: First Floor
            badges:
              - type: custom:hki-button-card
                entity: light.upstairs
                icon: mdi:home-floor-1
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
          - type: heading
            icon: mdi:bed-king
            heading_style: subtitle
            heading: Bedroom
            badges:
              - type: custom:hki-button-card
                icon_double_tap_action:
                  action: none
                entity: light.lights_bedroom
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
          - type: grid
            cards:
              - type: custom:hki-button-card
                entity: light.slaapkamer_plafond
                name: Plafond
                icon: hue:bulb-filament
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.nachtkastje_stephanie
                name: Stephanie
                icon: hue:bulb-filament
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.nachtkastje_jimmy
                name: Jimmy
                icon: hue:bulb-filament
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.bed_led
                icon: hue:lightstrip
                name: LEDs
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
          - type: heading
            icon: mdi:desk
            heading_style: subtitle
            heading: Office
            badges:
              - type: custom:hki-button-card
                icon_double_tap_action:
                  action: none
                entity: light.lights_office
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
          - type: grid
            cards:
              - type: custom:hki-button-card
                entity: light.office_plafond
                name: Plafond
                icon: hue:ceiling-aurelle
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.bureau_stephanie_led
                name: Stephanie
                icon: hue:lightstrip
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.bureau_jimmy_led
                name: Jimmy
                icon: hue:lightstrip
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
          - type: heading
            icon: mdi:shower
            heading: Bathroom
            heading_style: subtitle
            badges:
              - type: custom:hki-button-card
                icon_double_tap_action:
                  action: none
                entity: light.lights_badkamer
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
          - type: grid
            cards:
              - type: custom:hki-button-card
                entity: light.badkamer_spots
                name: Plafond
                icon: hue:ceiling-fugato-three
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.badkamer_spiegel
                icon: hue:adore-mirror
                name: Spiegel
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                show_brightness: false
                offsets:
                  name:
                    'y': 14
                  state:
                    'y': 8
          - type: heading
            icon: mdi:wardrobe
            heading_style: subtitle
            heading: Walk-in-Closet
            badges:
              - type: custom:hki-button-card
                icon_double_tap_action:
                  action: none
                entity: light.walk_in_closet
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
          - type: grid
            cards:
              - type: custom:hki-button-card
                entity: light.walk_in_closet
                name: Plafond
                icon: hue:ceiling-fugato-three
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                  default_section: last
          - type: heading
            icon: mdi:image-frame
            heading_style: subtitle
            heading: Hallway Upstairs
            badges:
              - type: custom:hki-button-card
                entity: light.gang_boven
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
          - type: grid
            cards:
              - type: custom:button-card
                entity: light.gang_boven
                name: Plafond
                icon: hue:bulb-sultan
                color: auto-no-temperature
                size: 25%
                hold_action:
                  action: more-info
                double_tap_action:
                  action: more-info
                show_state: true
                show_label: true
                label: >-
                  [[[ if (typeof(entity) === 'undefined') return; if
                  ('brightness' in entity.attributes) { if (entity.attributes &&
                  (entity.attributes.brightness <= 255)) { var bri =
                  Math.round(entity.attributes.brightness / 2.55); return (bri ?
                  bri : '0') + '%'; } } ]]]
                aspect_ratio: 1/1
                styles:
                  card:
                    - border-radius: 12px
                    - opacity: 0.7
                  label:
                    - font-weight: normal
                    - font-size: 12px
                    - font-family: Roboto
                    - padding: 0px 10px
                    - justify-self: start
                    - font-weight: bold
                  state:
                    - font-size: 12px
                    - font-family: Roboto
                    - padding: 0px 10px
                    - justify-self: start
                    - text-transform: capitalize
                    - font-weight: bold
                  img_cell:
                    - align-self: start
                    - text-align: start
                    - align-items: flex-start
                    - justify-content: flex-start
                  name:
                    - justify-self: start
                    - padding: 0px 10px
                    - font-weight: bold
                    - font-family: Roboto
                    - font-size: 12px
                    - color: var(--name-color)
                  icon:
                    - top: 7%
                    - left: 7%
                  entity_picture:
                    - border-radius: 25%
                    - left: 8%
                    - top: 10%
                  grid:
                    - grid-template-areas: '"i i" "area area" "n n" "s l"'
                    - grid-template-rows: 1fr 1fr min-content min-content
                state:
                  - value: 'on'
                    styles:
                      card:
                        - background: white
                        - opacity: 1
                      icon:
                        - color: var(--button-card-light-color)
                      name:
                        - color: black
                      state:
                        - color: black
                      label:
                        - color: black
                      lock:
                        - color: darkred
      - type: grid
        cards:
          - type: heading
            heading_style: title
            heading: Second Floor
            icon: mdi:home-floor-2
            badges:
              - type: custom:hki-button-card
                entity: light.attic
                icon: mdi:home-floor-2
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
          - type: heading
            icon: mdi:home-floor-a
            heading_style: subtitle
            heading: Attic Front
            badges:
              - type: custom:hki-button-card
                entity: light.zolder_voor
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
          - type: grid
            cards:
              - type: custom:hki-button-card
                entity: light.zolder_voor_plafond
                name: Plafond
                icon: hue:ceiling-fugato-three
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                  default_section: last
              - type: custom:hki-button-card
                entity: light.zolder_voor_leds
                icon: hue:lightstrip
                name: LEDs
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
          - type: heading
            icon: mdi:home-floor-a
            heading_style: subtitle
            heading: Attic Back
            badges:
              - type: custom:hki-button-card
                entity: light.zolder_achter
                card_layout: badge
                show_icon: true
                show_name: false
                state_label: >-
                  {{ expand(config.entity) | selectattr('state','eq','on') |
                  list

                  | count }}
                tap_action:
                  action: hki-more-info
          - type: grid
            cards:
              - type: custom:hki-button-card
                entity: light.zolder_achter_plafond
                name: Plafond
                icon: hue:ceiling-fugato-three
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.zolder_achter_nachtkastje
                icon: hue:bulb-candle
                name: Nachtkastje
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
          - type: heading
            icon: mdi:washing-machine
            heading_style: subtitle
            heading: Laundry Room
            badges:
              - type: custom:hki-button-card
                entity: light.lights_overloop
                card_layout: badge
                show_icon: true
                show_name: false
                state_label: >-
                  {{ expand(config.entity) | selectattr('state','eq','on') |
                  list

                  | count }}
                tap_action:
                  action: hki-more-info
          - type: grid
            cards:
              - type: custom:hki-button-card
                entity: light.overloop_plafond
                name: Plafond
                icon: hue:ceiling-fugato-three
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
              - type: custom:hki-button-card
                entity: light.overloop_led
                icon: hue:lightstrip
                name: LEDs
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
      - type: grid
        cards:
          - type: heading
            heading_style: title
            heading: Outside
            icon: mdi:home-floor-0
            badges:
              - type: custom:hki-button-card
                entity: light.outside
                icon: mdi:home-floor-0
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
          - type: heading
            icon: mdi:door
            heading_style: subtitle
            heading: Front Yard
            badges:
              - type: custom:hki-button-card
                entity: light.wandlamp_voordeur
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
          - type: grid
            cards:
              - type: custom:hki-button-card
                entity: light.wandlamp_voordeur
                name: Wandlamp
                icon: hue:wall-lantern
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
          - type: heading
            icon: hue:room-outdoors
            heading_style: subtitle
            heading: Back Yard
            badges:
              - type: custom:hki-button-card
                entity: light.lights_tuin_achter
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
          - type: grid
            cards:
              - type: custom:hki-button-card
                entity: light.overkapping_en_poort
                name: Overkapping Voor
                icon: mdi:wall-sconce-flat
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                hki_popup:
                  default_section: last
              - type: custom:hki-button-card
                entity: light.path_lights
                name: Schutting
                icon: mdi:string-lights
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                hki_popup:
                  default_section: last
              - type: custom:hki-button-card
                entity: light.string_light
                name: Overkapping Achter
                icon: mdi:string-lights
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                hki_popup:
                  default_section: last
              - type: custom:hki-button-card
                entity: light.dartboard
                name: Dartbord
                icon: phu:dartboard
                show_brightness: false
                show_label: true
                show_state: true
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                hki_popup:
                  default_section: last
                offsets:
                  name:
                    'y': 14
                  state:
                    'y': 8
          - type: heading
            icon: mdi:garage-variant
            heading_style: subtitle
            heading: Garage
            badges:
              - type: custom:hki-button-card
                entity: light.lights_garage
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
          - type: grid
            cards:
              - type: custom:hki-button-card
                entity: light.garage_2
                name: Plafond
                icon: hue:play-bar-two
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                hki_popup:
                  default_section: last
                show_brightness: false
                offsets:
                  name:
                    'y': 14
                  state:
                    'y': 8
              - type: custom:hki-button-card
                entity: light.garage_door_light
                name: Deur Motor
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                hki_popup:
                  default_section: last
                show_brightness: false
                offsets:
                  name:
                    'y': 14
                  state:
                    'y': 8
              - type: custom:hki-button-card
                entity: light.wandlamp_garagedeur
                name: Wandlamp
                icon: hue:wall-impress-narrow
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                hki_popup:
                  default_section: last
              - type: custom:hki-button-card
                entity: light.garage_leds_garage_leds
                name: LEDs
                icon: hue:lightstrip
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                hki_popup:
                  default_section: last
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
                - id: e1b058dd-45fb-4395-b48a-75dbfb98c0e8
                  icon: mdi:floor-plan
                  tooltip: ''
                  label: Rooms
                  entity: ''
                  button_type: ''
                  background: ''
                  background_opacity: ''
                  icon_color: ''
                  label_style: {}
                  pill_width: ''
                  conditions_mode: all
                  conditions: []
                  tap_action:
                    action: navigate
                    navigation_path: /lovelace/rooms
                  hold_action:
                    action: none
                  double_tap_action:
                    action: none
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
            reserve_space: true
    header:
      card:
        type: custom:hki-header-card
        title: Lights & Devices
        subtitle: Control Panel
        background: >-
          https://external-preview.redd.it/xhDZnSTjeG_atGCWfVrtqC8XUOAw_1zghygNbD0rx3M.jpg?auto=webp&s=263e884cdf1866cda979ca0eaad618405339197a
        min_height: 215
        max_height: 270
        title_offset_y: 65
        subtitle_offset_y: 70
        badges_fixed: true
        top_bar_offset_y: 15
        top_bar_padding_x: 0
        top_bar_left: custom
        top_bar_right: weather
        top_bar_left_card:
          type: custom:hki-notification-card
          use_header_styling: true
          show_background: false
          show_empty: true
          display_mode: ticker
          animation: bounce
          direction: right
          time_format: '24'
          entity: sensor.hki_notify_main
        info_pill: true
        top_bar_left_offset_x: 0
        top_bar_right_weather_icon_color_mode: state
        top_bar_right_animate_icon: float
        top_bar_right_tap_action:
          action: more-info
          entity: weather.buienradar
        top_bar_right_weather_entity: weather.openweathermap
        top_bar_right_show_humidity: false
        top_bar_right_show_wind: false
        top_bar_right_show_pressure: false
      layout: center
      badges_position: bottom
      badges_wrap: wrap
    cards: []
    badges: []
```
