# Attic Back

One of my per-room subviews, opened from the [Rooms](../rooms-overview.md) hub. Shared as-is from my own Home Assistant dashboard for reference/inspiration — entity IDs, sensors, and automations are specific to my setup and won't work unmodified in yours.

```yaml
  - type: sections
    max_columns: 4
    title: Attic Back
    path: attic-back
    icon: mdi:home-floor-a
    subview: true
    sections:
      - type: grid
        cards:
          - type: heading
            heading: Light Settings
            heading_style: subtitle
            icon: mdi:cogs
          - square: false
            type: grid
            cards:
              - type: custom:hki-button-card
                entity: input_boolean.auto_lighting
                card_layout: hki_tile
                icon: mdi:auto-fix
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                offsets:
                  icon:
                    'y': 12
              - type: custom:hki-button-card
                entity: group.adaptive_lighting
                card_layout: hki_tile
                name: Adaptive Lighting
                icon: mdi:google-circles-communities
                show_icon_badge: false
                styles:
                  icon:
                    circle:
                      border_style: solid
                      border_color: black
                      border_width: '1'
                offsets:
                  icon:
                    'y': 12
            columns: 2
      - type: grid
        cards:
          - type: heading
            heading: Lights
            heading_style: subtitle
            icon: mdi:lightbulb
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
    header:
      card:
        type: custom:hki-header-card
        title: Attick Back
        subtitle: |
          {% if is_state('media_player.zolder_achter_speaker', 'playing') %}
            Music: {{ state_attr('media_player.zolder_achter_speaker', 'media_artist') }} - {{ state_attr('media_player.zolder_achter_speaker', 'media_title') }}
          {% else %}
            No Media is Playing
          {% endif %}
        background: /local/images/rooms/attic_back.png
        min_height: 215
        max_height: 270
        title_offset_y: 65
        subtitle_offset_y: 70
        badges_gap: 30
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
      layout: start
      badges_position: bottom
      badges_wrap: wrap
    badges:
      - type: custom:hki-button-card
        entity: climate.zolder_achter
        card_layout: badge
        show_name: false
        state_label: '{{ state_attr(config.entity, ''current_temperature'') }}°C'
        show_icon_circle: true
        tap_action:
          action: hki-more-info
        styles:
          icon:
            size: 18
          typography:
            name:
              weight: bold
          temp_badge:
            border_style: none
        climate:
          show_plus_minus: true
          use_circular_slider: true
        hki_popup:
          blur_enabled: true
          blur_amount: 10
      - type: custom:hki-button-card
        entity: cover.roller_shutter_attic_roller_shutter_attic
        card_layout: badge
        show_name: false
        show_state: false
        tap_action:
          action: hki-more-info
        name: Rolluik Zolder
        hki_popup:
          blur_enabled: true
```
