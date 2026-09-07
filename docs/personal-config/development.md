# Development

Scratch view used for testing new card configs. Shared as-is from my own Home Assistant dashboard for reference/inspiration — entity IDs, sensors, and automations are specific to my setup and won't work unmodified in yours.

```yaml
  - type: sections
    max_columns: 8
    title: Development
    path: view-123
    sections:
      - type: grid
        cards:
          - type: custom:hki-header-card
            subtitle: test
            background: >-
              radial-gradient(circle,rgba(207, 0, 96, 1) 0%, rgba(0, 0, 0, 1)
              80%);
            height_vh: 35
            min_height: 180
            max_height: 220
            grid_options:
              rows: auto
              columns: full
            blend_stop: 77
            title_offset_y: 45
            subtitle_offset_y: 45
            badges_fixed: true
            top_bar:
              enabled: true
              offset_y: 10
              padding_x: 5
            info:
              pill: false
              pill_padding_x: 10
              pill_padding_y: 6
            top_bar_left:
              type: notifications
              offset_x: -15
              overflow: true
              custom:
                card:
                  type: custom:hki-notification-card
                  use_header_styling: true
                  show_background: false
                  show_empty: true
                  display_mode: marquee
                  animation: slide
                  direction: right
                  alignment: left
                  entity: sensor.hki_notify_main
                  full_width: false
                  auto_scroll: true
                  marquee_speed: '2'
                  marquee_gap: '6'
                  show_list_timestamp: true
                  time_format: auto
                  tap_action_popup_only: true
                  popup_width: auto
                  popup_height: auto
                  confirm_tap_action: true
                  popup_open_animation: scale
                  popup_close_animation: scale
            top_bar_center:
              type: spacer
              hki_popup:
                width: auto
                height: auto
                open_animation: scale
                close_animation: scale
                time_format: auto
                bottom_bar_align: spread
            top_bar_right:
              type: datetime
              offset_x: -6
              offset_y: 40
              overflow: true
              actions:
                tap_action:
                  action: call-service
                  service: light.toggle
                  service_data: |
                    entity_id: light.eetkamer_spots
              hki_popup:
                width: auto
                height: auto
                open_animation: scale
                close_animation: scale
                time_format: auto
                bottom_bar_align: spread
            persons:
              enabled: false
        column_span: 8
      - type: grid
        cards:
          - type: heading
            heading_style: title
            heading: Notify Test
          - type: markdown
            content: |
              ## Kitchen Messages
              {% for msg in state_attr('sensor.hki_notify_main', 'messages') %}
              - **{{ msg.id }}**: {{ msg.message }}
              {% endfor %}
          - type: custom:button-card
            icon: mdi:notification-clear-all
            aspect_ratio: 3/1
            name: create notification
            tap_action:
              action: call-service
              service: hki_notify.create
              service_data:
                entity_id: sensor.hki_notify_main
                id: frontdoor
                icon: mdi:lock
                message: The frontdoor is locked
                icon_spin: true
                tap_action:
                  action: call-service
                  service: light.toggle
                  target:
                    entity_id: light.eetkamer_spots
          - type: custom:button-card
            icon: mdi:notification-clear-all
            aspect_ratio: 3/1
            name: create notification 2
            tap_action:
              action: call-service
              service: hki_notify.create
              service_data:
                entity_id: sensor.hki_notify_main
                id: backdoor
                icon: mdi:lock
                message: The backdoor is locked
          - type: custom:button-card
            icon: mdi:notification-clear-all
            aspect_ratio: 3/1
            name: create notification 3
            tap_action:
              action: call-service
              service: hki_notify.create
              service_data:
                entity_id: sensor.hki_notify_main
                id: beer
                icon: mdi:beer
                message: Beer Time
          - type: custom:button-card
            icon: mdi:notification-clear-all
            aspect_ratio: 3/1
            name: create notification 4
            tap_action:
              action: call-service
              service: hki_notify.create
              service_data:
                entity_id: sensor.hki_notify_main
                id: dog
                icon: mdi:dog-side
                message: The dogs are hungry
          - type: custom:button-card
            icon: mdi:notification-clear-all
            aspect_ratio: 3/1
            name: create notification 4
            tap_action:
              action: call-service
              service: hki_notify.create
              service_data:
                entity_id: sensor.hki_notify_main
                id: car
                icon: mdi:car
                message: The car is charged
      - type: grid
        cards:
          - type: heading
            heading: Notification Button
            heading_style: title
          - type: custom:hki-notification-card
            entity: sensor.hki_notify_main
            display_mode: button
            show_icon: true
            interval: 3
            auto_cycle: true
            animation: slide
            direction: right
            alignment: left
            font_weight: Semi Bold
            font_family: system-ui, sans-serif
            confirm_tap_action: true
          - type: heading
            heading: Notification Button (with label)
            heading_style: title
          - type: custom:hki-notification-card
            entity: sensor.hki_notify_main
            attribute: messages
            display_mode: button
            interval: 3
            animation: slide
            direction: right
            show_icon: true
            alignment: left
            font_weight: Semi Bold
            font_family: system-ui, sans-serif
            list_max_items: '7'
            auto_scroll: true
            marquee_gap: '6'
            marquee_speed: '0.5'
            show_empty: true
            border_radius: '0'
            border_width: '5'
            full_width: false
            button_label: Notifications
            button_label_position: inside
            button_pill_border_style: solid
            button_pill_badge_position: outside
            button_pill_full_width: false
            confirm_tap_action: true
      - type: grid
        cards:
          - type: heading
            heading_style: title
            heading: Notifications List
            badges:
              - type: custom:mushroom-template-badge
                content: Clear
                tap_action:
                  action: perform-action
                  perform_action: hki_notify.dismiss_all
                  target: {}
          - type: custom:hki-notification-card
            entity: sensor.hki_notify_main
            attribute: messages
            display_mode: list
            interval: 3
            animation: slide
            direction: right
            show_icon: true
            alignment: right
            font_weight: Semi Bold
            font_family: system-ui, sans-serif
            list_max_items: '7'
            auto_scroll: true
            marquee_gap: '6'
            marquee_speed: '1'
            show_empty: true
            border_radius: '0'
            border_width: '5'
            full_width: true
            tap_action_popup_only: true
            show_popup_timestamp: true
            show_list_timestamp: true
            time_format: '24'
            popup_width: auto
            popup_height: auto
            popup_open_animation: scale
            popup_close_animation: scale
            use_header_styling: true
          - type: heading
            heading_style: title
            heading: Notifications Styling Customization
            badges:
              - type: custom:mushroom-template-badge
                content: Clear
                tap_action:
                  action: perform-action
                  perform_action: hki_notify.dismiss_all
                  target: {}
          - type: custom:hki-notification-card
            entity: sensor.hki_notify_main
            attribute: messages
            display_mode: list
            interval: 3
            animation: slide
            direction: right
            show_icon: true
            alignment: left
            font_weight: Semi Bold
            font_family: system-ui, sans-serif
            list_max_items: '7'
            auto_scroll: true
            marquee_gap: '6'
            marquee_speed: '1'
            show_empty: true
            border_radius: '100'
            border_width: '1'
            full_width: true
            color_border: gray
            confirm_tap_action: true
            show_list_timestamp: true
            show_popup_timestamp: true
          - type: custom:hki-notification-card
            entity: sensor.hki_notify_main
            display_mode: marquee
            show_icon: true
            interval: 3
            auto_cycle: true
            animation: slide
            direction: right
            alignment: left
            font_weight: Semi Bold
            font_family: system-ui, sans-serif
            full_width: false
            auto_scroll: false
      - type: grid
        cards:
          - type: heading
            heading: Marquee
            heading_style: title
          - type: heading
            heading: Marquee No Autoscroll
            heading_style: title
          - type: custom:hki-notification-card
            entity: sensor.hki_notify_main
            attribute: messages
            display_mode: marquee
            interval: 3
            animation: slide
            direction: right
            show_icon: true
            alignment: left
            font_weight: Semi Bold
            font_family: system-ui, sans-serif
            list_max_items: '7'
            auto_scroll: false
            marquee_gap: '6'
            marquee_speed: '0.5'
            show_empty: true
            border_radius: '0'
            border_width: '5'
            full_width: false
          - type: heading
            heading: Effects
            heading_style: title
          - type: custom:hki-notification-card
            entity: sensor.hki_notify_main
            attribute: messages
            display_mode: ticker
            interval: 3
            animation: slide
            direction: top
            show_icon: true
            alignment: left
            font_weight: Semi Bold
            font_family: system-ui, sans-serif
            list_max_items: '7'
            auto_scroll: true
            marquee_gap: '6'
            marquee_speed: '1'
            show_empty: true
            border_radius: '0'
            border_width: '5'
            full_width: true
            animation_duration: '2.5'
          - type: custom:hki-notification-card
            entity: sensor.hki_notify_main
            attribute: messages
            display_mode: ticker
            interval: 3
            animation: scale
            direction: right
            show_icon: true
            alignment: left
            font_weight: Semi Bold
            font_family: system-ui, sans-serif
            list_max_items: '7'
            auto_scroll: true
            marquee_gap: '6'
            marquee_speed: '1'
            show_empty: true
            border_radius: '0'
            border_width: '5'
            full_width: true
            animation_duration: '2.5'
          - type: custom:hki-notification-card
            entity: sensor.hki_notify_main
            attribute: messages
            display_mode: ticker
            interval: 3
            animation: fade
            direction: left
            show_icon: true
            alignment: left
            font_weight: Semi Bold
            font_family: system-ui, sans-serif
            list_max_items: '7'
            auto_scroll: true
            marquee_gap: '6'
            marquee_speed: '1'
            show_empty: true
            border_radius: '0'
            border_width: '5'
            full_width: true
            animation_duration: '2.5'
          - type: custom:hki-notification-card
            entity: sensor.hki_notify_main
            attribute: messages
            display_mode: ticker
            interval: 3
            animation: rotate
            direction: left
            show_icon: true
            alignment: left
            font_weight: Semi Bold
            font_family: system-ui, sans-serif
            list_max_items: '7'
            auto_scroll: true
            marquee_gap: '6'
            marquee_speed: '1'
            show_empty: true
            border_radius: '0'
            border_width: '5'
            full_width: true
            animation_duration: '2.5'
          - type: heading
            heading: Marquee No Autoscroll
            heading_style: title
          - type: custom:hki-notification-card
            entity: sensor.hki_notify_main
            attribute: messages
            display_mode: marquee
            interval: 3
            animation: slide
            direction: right
            show_icon: true
            alignment: left
            font_weight: Semi Bold
            font_family: system-ui, sans-serif
            list_max_items: '7'
            auto_scroll: true
            marquee_gap: '6'
            marquee_speed: '0.5'
            show_empty: true
            border_radius: '0'
            border_width: '5'
            full_width: false
      - type: grid
        cards: []
      - type: grid
        cards:
          - type: heading
            heading: New section
    header:
      layout: start
      badges_position: top
      badges_wrap: wrap
    badges: []
    footer:
      card:
        type: custom:hki-navigation-card
        base:
          button:
            id: 4e8c1d57-1c4c-48cb-83a0-447264197745
            icon: mdi:home
            tooltip: Home
            entity: input_boolean.kiosk_mode
            button_type: icon
            tap_action:
              action: hki-more-info
              entity: number.espresense_badkamer_absorption
            hold_action:
              action: none
            double_tap_action:
              action: toggle
            custom_popup_enabled: false
        horizontal:
          enabled: true
          columns: 6
          buttons:
            - id: e1b058dd-45fb-4395-b48a-75dbfb98c0e8
              icon: mdi:floor-plan
              label: Rooms
              conditions_mode: all
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
              button_type: icon
              background: DarkOrange
              conditions_mode: all
              tap_action:
                action: back
              hold_action:
                action: none
              double_tap_action:
                action: none
        vertical:
          enabled: true
          rows: 6
          buttons:
            - id: eacbc99f-8865-46e1-ac0b-005d8a9279ca
              icon: mdi:floor-plan
              conditions_mode: all
              tap_action:
                action: navigate
                navigation_path: /
              hold_action:
                action: none
              double_tap_action:
                action: none
              custom_popup_enabled: false
            - id: f8b78fe6-2f64-4b0b-abb4-1c2f425428e3
              icon: mdi:floor-plan
              conditions_mode: all
              tap_action:
                action: navigate
                navigation_path: /
              hold_action:
                action: none
              double_tap_action:
                action: none
              custom_popup_enabled: false
            - id: 47e93ae1-31f5-43a8-9329-4a508a6bc997
              icon: mdi:floor-plan
              conditions_mode: all
              tap_action:
                action: navigate
                navigation_path: /
              hold_action:
                action: none
              double_tap_action:
                action: none
              custom_popup_enabled: false
            - id: 8e221872-11e4-4488-8cec-23d47979ac1f
              icon: mdi:floor-plan
              conditions_mode: all
              tap_action:
                action: navigate
                navigation_path: /
              hold_action:
                action: none
              double_tap_action:
                action: none
              custom_popup_enabled: false
        bottom_bar_full_width: true
        reserve_space: true
        bottom_bar_settings:
          enabled: false
          full_width: false
          height: 85
          bottom_offset: 0
          margin_left: 0
          margin_right: 0
          style:
            background: rgb(var(--rgb-card-background-color, 0,0,0))
            opacity: 0.85
            border_radius: 0
            border_width: 0
            border_style: solid
        button_defaults:
          style:
            opacity: 1
            box_shadow: 0 8px 24px rgba(0, 0, 0, 0.35)
            box_shadow_hover: 0 10px 30px rgba(0, 0, 0, 0.42)
          label:
            font_size: 12
            font_weight: 600
            letter_spacing: 0
            text_transform: none
            background_opacity: 0.72
            padding_x: 10
            padding_y: 6
            border_radius: 999
            backdrop_blur: 8
            max_width: 220
    cards: []
```
