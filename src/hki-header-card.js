// HKI Header Card
const { LitElement, html, css } = window.HKI.getLit();
const CARD_NAME = "hki-header-card";

const clamp = (n, min, max) => (Number.isFinite(n) ? Math.min(Math.max(n, min), max) : min);
const toNum = (v, fallback) => { const n = +v; return Number.isFinite(n) ? n : fallback; };

const WEIGHT_MAP = Object.freeze({
  light: 300, regular: 400, medium: 500, semibold: 600, bold: 700, black: 900,
});

const BG_SIZE_PRESETS = Object.freeze(["cover", "contain", "auto"]);

const FONT_FAMILY_MAP = Object.freeze({
  inherit: "inherit",
  system: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  roboto: "Roboto, system-ui, sans-serif",
  inter: "Inter, system-ui, sans-serif",
  arial: "Arial, Helvetica, sans-serif",
  georgia: "Georgia, 'Times New Roman', serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
});

const WEATHER_ICON_MAP = Object.freeze({
  "clear-night": "mdi:weather-night",
  cloudy: "mdi:weather-cloudy",
  fog: "mdi:weather-fog",
  hail: "mdi:weather-hail",
  lightning: "mdi:weather-lightning",
  "lightning-rainy": "mdi:weather-lightning-rainy",
  partlycloudy: "mdi:weather-partly-cloudy",
  pouring: "mdi:weather-pouring",
  rainy: "mdi:weather-rainy",
  snowy: "mdi:weather-snowy",
  "snowy-rainy": "mdi:weather-snowy-rainy",
  sunny: "mdi:weather-sunny",
  windy: "mdi:weather-windy",
  "windy-variant": "mdi:weather-windy-variant",
  exceptional: "mdi:alert-circle-outline",
});

const WEATHER_COLOR_MAP = Object.freeze({
  sunny: "var(--hki-weather-color-sunny, #fdd835)",
  "clear-night": "var(--hki-weather-color-clear-night, #90caf9)",
  partlycloudy: "var(--hki-weather-color-partlycloudy, #ffe082)",
  cloudy: "var(--hki-weather-color-cloudy, #b0bec5)",
  fog: "var(--hki-weather-color-fog, #cfd8dc)",
  rainy: "var(--hki-weather-color-rainy, #4fc3f7)",
  pouring: "var(--hki-weather-color-pouring, #0288d1)",
  lightning: "var(--hki-weather-color-lightning, #ffca28)",
  "lightning-rainy": "var(--hki-weather-color-lightning-rainy, #ffb300)",
  snowy: "var(--hki-weather-color-snowy, #e1f5fe)",
  "snowy-rainy": "var(--hki-weather-color-snowy-rainy, #81d4fa)",
  windy: "var(--hki-weather-color-windy, #a5d6a7)",
  "windy-variant": "var(--hki-weather-color-windy-variant, #81c784)",
  hail: "var(--hki-weather-color-hail, #80deea)",
  exceptional: "var(--hki-weather-color-exceptional, #ef9a9a)",
});

const HKI_POPUP_CONFIG_KEYS = window.HKI?.POPUP_CONFIG_KEYS || [];
const copyDefinedKeys = window.HKI?.copyDefinedKeys || (({ src, dst, keys }) => {
  if (!src || !dst || !Array.isArray(keys)) return dst;
  keys.forEach((k) => {
    if (src[k] !== undefined) dst[k] = src[k];
  });
  return dst;
});
const HKI_POPUP_EDITOR_OPTIONS = window.HKI?.POPUP_EDITOR_OPTIONS || {
  animations: [
    { value: "none", label: "None" },
    { value: "fade", label: "Fade" },
    { value: "scale", label: "Scale" },
    { value: "zoom", label: "Zoom" },
    { value: "slide-up", label: "Slide Up" },
    { value: "slide-down", label: "Slide Down" },
    { value: "slide-left", label: "Slide Left" },
    { value: "slide-right", label: "Slide Right" },
    { value: "flip", label: "Flip" },
    { value: "bounce", label: "Bounce" },
    { value: "rotate", label: "Rotate" },
    { value: "drop", label: "Drop" },
    { value: "swing", label: "Swing" },
  ],
  width: [
    { value: "auto", label: "Auto (Responsive)" },
    { value: "default", label: "Default (400px)" },
    { value: "custom", label: "Custom" },
  ],
  height: [
    { value: "auto", label: "Auto (Responsive)" },
    { value: "default", label: "Default (600px)" },
    { value: "custom", label: "Custom" },
  ],
  timeFormats: [
    { value: "auto", label: "Auto" },
    { value: "12", label: "12-Hour Clock" },
    { value: "24", label: "24-Hour Clock" },
  ],
};
const HKI_EDITOR_OPTIONS = window.HKI?.EDITOR_OPTIONS || {
  borderStyles: [
    { value: "solid", label: "solid" },
    { value: "dashed", label: "dashed" },
    { value: "dotted", label: "dotted" },
    { value: "double", label: "double" },
    { value: "none", label: "none" },
  ],
  buttonActionOptions: [
    { value: "toggle", label: "Toggle" },
    { value: "hki-more-info", label: "More Info (HKI)" },
    { value: "more-info", label: "More Info (Native)" },
    { value: "navigate", label: "Navigate" },
    { value: "perform-action", label: "Perform Action" },
    { value: "url", label: "URL" },
    { value: "fire-dom-event", label: "Fire DOM Event" },
    { value: "none", label: "None" },
  ],
  headerActionOptions: [
    { value: "none", label: "None" },
    { value: "navigate", label: "Navigate" },
    { value: "back", label: "Back" },
    { value: "menu", label: "Toggle Menu" },
    { value: "url", label: "Open URL" },
    { value: "more-info", label: "More Info" },
    { value: "hki-more-info", label: "HKI More Info" },
    { value: "toggle", label: "Toggle Entity" },
    { value: "perform-action", label: "Perform Action" },
  ],
  popupBottomBarActionOptions: [
    { value: "toggle", label: "Toggle" },
    { value: "more-info", label: "More Info" },
    { value: "hki-more-info", label: "HKI More Info" },
    { value: "navigate", label: "Navigate" },
    { value: "perform-action", label: "Perform Action" },
    { value: "url", label: "URL" },
    { value: "none", label: "None" },
  ],
  popupDefaultViewOptions: [
    { value: "main", label: "Main (Group Controls)" },
    { value: "individual", label: "Individual Entities" },
  ],
  popupDefaultSectionOptions: [
    { value: "last", label: "Last Used" },
    { value: "brightness", label: "Always Brightness" },
    { value: "color", label: "Always Color" },
    { value: "temperature", label: "Always Temperature" },
  ],
  popupDefaultSectionOptionsTagged: [
    { value: "last", label: "Last Used (Default)" },
    { value: "brightness", label: "Always Brightness" },
    { value: "color", label: "Always Color" },
    { value: "temperature", label: "Always Temperature" },
  ],
  popupBottomBarAlignOptions: [
    { value: "spread", label: "Spread" },
    { value: "start", label: "Start" },
    { value: "center", label: "Center" },
    { value: "end", label: "End" },
  ],
  popupBottomBarAlignOptionsDetailed: [
    { value: "spread", label: "Spread (space around)" },
    { value: "start", label: "Start (left aligned)" },
    { value: "center", label: "Center" },
    { value: "end", label: "End (right aligned)" },
  ],
};

// Shared defaults - single source of truth
const DEFAULTS = Object.freeze({
  title: "Header",
  subtitle: "",
  text_align: "left",
  title_color: "",
  subtitle_color: "",
  background: "https://github.com/jimz011/hki-header-card/blob/main/wallpapers/livingroom.jpg?raw=true",
  background_color: "", // Background blend color for blending
  background_position: "center",
  background_repeat: "no-repeat",
  background_size: "cover",
  background_blend_mode: "normal",
  height_vh: 35,
  min_height: 215,
  max_height: 240,
  blend_color: "var(--primary-background-color)",
  blend_stop: 95,
  blend_enabled: true,
  // Header styling
  // Border radius (back-compat): card_border_radius applies to both top and bottom
  // if the split options below are not provided.
  card_border_radius: "",
  card_border_radius_top: "",
  card_border_radius_bottom: "",
  card_box_shadow: "",
  card_border_style: "none",
  card_border_width: 0,
  card_border_color: "",
  fixed: true,
  fixed_top: 0,
  // When fixed is false, allow resizing/bleeding the card within the view
  // Positive left/right values make the card wider (bleed outwards)
  // Positive top/bottom add spacing around the card
  inset_top: 0,
  inset_left: 0,
  inset_right: 0,
  inset_bottom: 0,
  title_offset_x: 5,
  title_offset_y: 65,
  subtitle_offset_x: 5,
  subtitle_offset_y: 70,
  badges_offset_pinned: 48,
  badges_offset_unpinned: 100,
  badges_gap: 0,
  badges_fixed: false,
  
  // Person Entities Display
  persons_enabled: false,
  persons_entities: [],
  persons_align: "right",
  persons_offset_x: 5,
  persons_offset_y: 63,
  persons_size: 35,
  persons_spacing: 0,
  persons_stack_order: "descending",
  persons_dynamic_order: true,
  persons_hide_away: false,
  persons_use_entity_picture: true,
  persons_border_width: 1,
  persons_border_style: "solid",
  persons_border_radius: 50,
  persons_border_color: "rgba(255,255,255,0.3)",
  persons_border_color_away: "rgba(255,0,0,0.5)",
  persons_box_shadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
  persons_grayscale_away: true,
  
  font_family: "inherit",
  font_family_custom: "",
  font_style: "normal",
  title_size_px: 36,
  subtitle_size_px: 15,
  title_weight: "bold",
  subtitle_weight: "medium",
  mobile_breakpoint: 768,

  // Top Bar Layout
  top_bar_enabled: true,
  top_bar_offset_y: 15,
  top_bar_padding_x: 0,
  
  // Slot types: "none", "spacer", "weather", "datetime", "notifications", "card", "button"
  top_bar_left: "none",
  top_bar_center: "none",
  top_bar_right: "none",
  top_bar_left_align: "start",
  top_bar_center_align: "center",
  top_bar_right_align: "end",
  
  // Default custom cards for slots (no default for "card" type - shows picker)
  top_bar_left_card: null,
  top_bar_center_card: null,
  top_bar_right_card: null,

  // Bottom Bar Layout
  bottom_bar_enabled: false,
  bottom_bar_offset_y: 10,
  bottom_bar_padding_x: 0,
  bottom_bar_left: "none",
  bottom_bar_center: "none",
  bottom_bar_right: "none",
  bottom_bar_left_align: "start",
  bottom_bar_center_align: "center",
  bottom_bar_right_align: "end",
  bottom_bar_left_card: null,
  bottom_bar_center_card: null,
  bottom_bar_right_card: null,

  // Global Info Styling (defaults for all slots)
  info_size_px: 12,
  info_weight: "medium",
  info_color: "",
  info_pill: true,
  info_pill_background: "rgba(0,0,0,0.25)",
  info_pill_padding_x: 12,
  info_pill_padding_y: 8,
  info_pill_radius: 999,
  info_pill_blur: 0,
  info_pill_border_style: "none",
  info_pill_border_width: 0,
  info_pill_border_color: "rgba(255,255,255,0.1)",

  // Bottom Bar Global Info Styling (independent defaults for bottom bar slots)
  bottom_info_size_px: 12,
  bottom_info_weight: "medium",
  bottom_info_color: "",
  bottom_info_pill: true,
  bottom_info_pill_background: "rgba(0,0,0,0.25)",
  bottom_info_pill_padding_x: 12,
  bottom_info_pill_padding_y: 8,
  bottom_info_pill_radius: 999,
  bottom_info_pill_blur: 0,
  bottom_info_pill_border_style: "none",
  bottom_info_pill_border_width: 0,
  bottom_info_pill_border_color: "rgba(255,255,255,0.1)",

  // Defaults fallback if per-slot is missing
  weather_entity: "",
  weather_show_icon: true,
  weather_show_condition: true,
  weather_show_temperature: true,
  weather_show_humidity: false,
  weather_show_wind: false,
  weather_show_pressure: false,
  weather_colored_icons: true,
  weather_icon_color_mode: "state",
  weather_animate_icon: "none",
  weather_icon_pack_path: "",
  datetime_show_time: true,
  datetime_show_date: true,
  datetime_show_day: true,
  datetime_time_format: "HH:mm",
  datetime_date_format: "D MMM",
  datetime_separator: " • ",
});

function normalizeWeightKey(input, fallbackKey) {
  if (typeof input === "string" && WEIGHT_MAP[input]) return input;
  if (typeof input === "number" && Number.isFinite(input)) {
    let best = fallbackKey, bestDist = Infinity;
    for (const [k, v] of Object.entries(WEIGHT_MAP)) {
      const d = Math.abs(v - input);
      if (d < bestDist) { best = k; bestDist = d; }
    }
    return best;
  }
  return fallbackKey;
}

// Migration helper: Detect if config is in old flat format
function isOldFormat(config) {
  // Check for old flat keys
  const oldKeys = [
    'top_bar_left_weather_entity', 'top_bar_right_weather_entity', 'top_bar_center_weather_entity',
    'top_bar_left_show_icon', 'persons_enabled', 'persons_entities'
  ];
  return oldKeys.some(key => key in config);
}

// Migrate old flat format to new nested format
function migrateToNestedFormat(oldConfig) {
  const newConfig = { type: oldConfig.type || "custom:hki-header-card" };
  
  // Copy simple top-level properties
  const simpleProps = [
    'title', 'subtitle', 'text_align', 'title_color', 'subtitle_color',
    'background', 'background_color', 'background_position', 'background_repeat',
    'background_size', 'background_blend_mode', 'height_vh', 'min_height', 'max_height',
    'grid_options',
    'blend_color', 'blend_stop', 'blend_enabled',
    'card_border_radius', 'card_border_radius_top', 'card_border_radius_bottom',
    'card_box_shadow', 'card_border_style', 'card_border_width', 'card_border_color',
    'fixed', 'fixed_top', 'inset_top', 'inset_left', 'inset_right', 'inset_bottom',
    'title_offset_x', 'title_offset_y', 'subtitle_offset_x', 'subtitle_offset_y',
    'badges_offset_pinned', 'badges_offset_unpinned', 'badges_gap', 'badges_fixed',
    'font_family', 'font_family_custom', 'font_style', 'title_size_px', 'subtitle_size_px',
    'title_weight', 'subtitle_weight', 'mobile_breakpoint'
  ];
  
  simpleProps.forEach(prop => {
    if (oldConfig[prop] !== undefined) {
      newConfig[prop] = oldConfig[prop];
    }
  });
  
  // Migrate top_bar global settings
  if (oldConfig.top_bar_enabled !== undefined || oldConfig.top_bar_offset_y !== undefined || oldConfig.top_bar_padding_x !== undefined) {
    newConfig.top_bar = {};
    if (oldConfig.top_bar_enabled !== undefined) newConfig.top_bar.enabled = oldConfig.top_bar_enabled;
    if (oldConfig.top_bar_offset_y !== undefined) newConfig.top_bar.offset_y = oldConfig.top_bar_offset_y;
    if (oldConfig.top_bar_padding_x !== undefined) newConfig.top_bar.padding_x = oldConfig.top_bar_padding_x;
  }
  
  // Migrate global info styling
  const infoKeys = ['info_size_px', 'info_weight', 'info_color', 'info_pill', 'info_pill_background',
                    'info_pill_padding_x', 'info_pill_padding_y', 'info_pill_radius', 'info_pill_blur',
                    'info_pill_border_style', 'info_pill_border_width', 'info_pill_border_color'];
  if (infoKeys.some(k => oldConfig[k] !== undefined)) {
    newConfig.info = {};
    if (oldConfig.info_size_px !== undefined) newConfig.info.size_px = oldConfig.info_size_px;
    if (oldConfig.info_weight !== undefined) newConfig.info.weight = oldConfig.info_weight;
    if (oldConfig.info_color !== undefined) newConfig.info.color = oldConfig.info_color;
    if (oldConfig.info_pill !== undefined) newConfig.info.pill = oldConfig.info_pill;
    if (oldConfig.info_pill_background !== undefined) newConfig.info.pill_background = oldConfig.info_pill_background;
    if (oldConfig.info_pill_padding_x !== undefined) newConfig.info.pill_padding_x = oldConfig.info_pill_padding_x;
    if (oldConfig.info_pill_padding_y !== undefined) newConfig.info.pill_padding_y = oldConfig.info_pill_padding_y;
    if (oldConfig.info_pill_radius !== undefined) newConfig.info.pill_radius = oldConfig.info_pill_radius;
    if (oldConfig.info_pill_blur !== undefined) newConfig.info.pill_blur = oldConfig.info_pill_blur;
    if (oldConfig.info_pill_border_style !== undefined) newConfig.info.pill_border_style = oldConfig.info_pill_border_style;
    if (oldConfig.info_pill_border_width !== undefined) newConfig.info.pill_border_width = oldConfig.info_pill_border_width;
    if (oldConfig.info_pill_border_color !== undefined) newConfig.info.pill_border_color = oldConfig.info_pill_border_color;
  }
  
  // Migrate each slot (left, center, right) for both bars
  ['top_bar', 'bottom_bar'].forEach(bar => {
  ['left', 'center', 'right'].forEach(slot => {
    const slotType = oldConfig[`${bar}_${slot}`] || "none";
    if (slotType === "none") return;
    
    const prefix = `${bar}_${slot}_`;
    const slotConfig = { type: slotType };
    
    // Common slot properties
    if (oldConfig[prefix + "offset_x"] !== undefined) slotConfig.offset_x = oldConfig[prefix + "offset_x"];
    if (oldConfig[prefix + "offset_y"] !== undefined) slotConfig.offset_y = oldConfig[prefix + "offset_y"];
    if (oldConfig[prefix + "offset_x_mobile"] !== undefined) slotConfig.offset_x_mobile = oldConfig[prefix + "offset_x_mobile"];
    if (oldConfig[prefix + "offset_y_mobile"] !== undefined) slotConfig.offset_y_mobile = oldConfig[prefix + "offset_y_mobile"];
    if (oldConfig[prefix + "overflow"] !== undefined) slotConfig.overflow = oldConfig[prefix + "overflow"];
    
    // Styling (only if not using global)
    if (oldConfig[prefix + "use_global"] === false) {
      slotConfig.styling = {
        size_px: oldConfig[prefix + "size_px"],
        weight: oldConfig[prefix + "weight"],
        color: oldConfig[prefix + "color"],
        pill: oldConfig[prefix + "pill"],
        pill_background: oldConfig[prefix + "pill_background"],
        pill_padding_x: oldConfig[prefix + "pill_padding_x"],
        pill_padding_y: oldConfig[prefix + "pill_padding_y"],
        pill_radius: oldConfig[prefix + "pill_radius"],
        pill_blur: oldConfig[prefix + "pill_blur"],
        pill_border_style: oldConfig[prefix + "pill_border_style"],
        pill_border_width: oldConfig[prefix + "pill_border_width"],
        pill_border_color: oldConfig[prefix + "pill_border_color"]
      };
    }
    
    // Type-specific configurations
    if (slotType === "weather") {
      slotConfig.weather = {
        entity: oldConfig[prefix + "weather_entity"],
        show_icon: oldConfig[prefix + "show_icon"],
        show_condition: oldConfig[prefix + "show_condition"],
        show_temperature: oldConfig[prefix + "show_temperature"],
        show_humidity: oldConfig[prefix + "show_humidity"],
        show_wind: oldConfig[prefix + "show_wind"],
        show_pressure: oldConfig[prefix + "show_pressure"],
        colored_icons: oldConfig[prefix + "weather_colored_icons"],
        icon_color_mode: oldConfig[prefix + "weather_icon_color_mode"],
        icon_color: oldConfig[prefix + "weather_icon_color"],
        animate_icon: oldConfig[prefix + "animate_icon"],
        icon_pack_path: oldConfig[prefix + "icon_pack_path"]
      };
    } else if (slotType === "datetime") {
      slotConfig.datetime = {
        show_day: oldConfig[prefix + "show_day"],
        show_date: oldConfig[prefix + "show_date"],
        show_time: oldConfig[prefix + "show_time"],
        time_format: oldConfig[prefix + "time_format"],
        date_format: oldConfig[prefix + "date_format"],
        separator: oldConfig[prefix + "separator"],
        icon: oldConfig[prefix + "icon"],
        animate_icon: oldConfig[prefix + "animate_icon"]
      };
    } else if (slotType === "button") {
      slotConfig.button = {
        icon: oldConfig[prefix + "icon"],
        label: oldConfig[prefix + "label"]
      };
    } else if (slotType === "custom" || slotType === "notifications") {
      slotConfig.custom = {
        card: oldConfig[prefix + "card"]
      };
      if (slotType === "custom") slotConfig.type = "notifications"; // migrate legacy value
    } else if (slotType === "card") {
      slotConfig.custom = {
        card: oldConfig[prefix + "card"]
      };
    }
    
    // Actions
    slotConfig.actions = {
      tap_action: oldConfig[prefix + "tap_action"],
      hold_action: oldConfig[prefix + "hold_action"],
      double_tap_action: oldConfig[prefix + "double_tap_action"]
    };
    
    newConfig[`${bar}_${slot}`] = slotConfig;
  });
  }); // end bar loop
  
  // Migrate persons
  if (oldConfig.persons_enabled || oldConfig.persons_entities) {
    newConfig.persons = {};
    if (oldConfig.persons_enabled !== undefined) newConfig.persons.enabled = oldConfig.persons_enabled;
    if (oldConfig.persons_align !== undefined) newConfig.persons.align = oldConfig.persons_align;
    if (oldConfig.persons_offset_x !== undefined) newConfig.persons.offset_x = oldConfig.persons_offset_x;
    if (oldConfig.persons_offset_y !== undefined) newConfig.persons.offset_y = oldConfig.persons_offset_y;
    if (oldConfig.persons_size !== undefined) newConfig.persons.size = oldConfig.persons_size;
    if (oldConfig.persons_spacing !== undefined) newConfig.persons.spacing = oldConfig.persons_spacing;
    if (oldConfig.persons_stack_order !== undefined) newConfig.persons.stack_order = oldConfig.persons_stack_order;
    if (oldConfig.persons_dynamic_order !== undefined) newConfig.persons.dynamic_order = oldConfig.persons_dynamic_order;
    if (oldConfig.persons_hide_away !== undefined) newConfig.persons.hide_away = oldConfig.persons_hide_away;
    if (oldConfig.persons_use_entity_picture !== undefined) newConfig.persons.use_entity_picture = oldConfig.persons_use_entity_picture;
    if (oldConfig.persons_border_width !== undefined) newConfig.persons.border_width = oldConfig.persons_border_width;
    if (oldConfig.persons_border_style !== undefined) newConfig.persons.border_style = oldConfig.persons_border_style;
    if (oldConfig.persons_border_radius !== undefined) newConfig.persons.border_radius = oldConfig.persons_border_radius;
    if (oldConfig.persons_border_color !== undefined) newConfig.persons.border_color = oldConfig.persons_border_color;
    if (oldConfig.persons_border_color_away !== undefined) newConfig.persons.border_color_away = oldConfig.persons_border_color_away;
    if (oldConfig.persons_box_shadow !== undefined) newConfig.persons.box_shadow = oldConfig.persons_box_shadow;
    if (oldConfig.persons_grayscale_away !== undefined) newConfig.persons.grayscale_away = oldConfig.persons_grayscale_away;
    if (oldConfig.persons_entities !== undefined) newConfig.persons.entities = oldConfig.persons_entities || [];
  }
  
  return newConfig;
}

// Flatten nested format to flat format for internal use
function flattenNestedFormat(nested) {
  const flat = { type: nested.type || "custom:hki-header-card" };
  
  // Copy simple top-level properties
  const simpleProps = [
    'title', 'subtitle', 'text_align', 'title_color', 'subtitle_color',
    'background', 'background_color', 'background_position', 'background_repeat',
    'background_size', 'background_blend_mode', 'height_vh', 'min_height', 'max_height',
    'grid_options',
    'blend_color', 'blend_stop', 'blend_enabled',
    'card_border_radius', 'card_border_radius_top', 'card_border_radius_bottom',
    'card_box_shadow', 'card_border_style', 'card_border_width', 'card_border_color',
    'fixed', 'fixed_top', 'inset_top', 'inset_left', 'inset_right', 'inset_bottom',
    'title_offset_x', 'title_offset_y', 'subtitle_offset_x', 'subtitle_offset_y',
    'badges_offset_pinned', 'badges_offset_unpinned', 'badges_gap', 'badges_fixed',
    'font_family', 'font_family_custom', 'font_style', 'title_size_px', 'subtitle_size_px',
    'title_weight', 'subtitle_weight', 'mobile_breakpoint'
  ];
  
  simpleProps.forEach(prop => {
    if (nested[prop] !== undefined) {
      flat[prop] = nested[prop];
    }
  });
  
  // Flatten top_bar
  if (nested.top_bar) {
    if (nested.top_bar.enabled !== undefined) flat.top_bar_enabled = nested.top_bar.enabled;
    if (nested.top_bar.offset_y !== undefined) flat.top_bar_offset_y = nested.top_bar.offset_y;
    if (nested.top_bar.padding_x !== undefined) flat.top_bar_padding_x = nested.top_bar.padding_x;
  }

  // Flatten bottom_bar
  if (nested.bottom_bar && typeof nested.bottom_bar === 'object') {
    if (nested.bottom_bar.enabled !== undefined) flat.bottom_bar_enabled = nested.bottom_bar.enabled;
    if (nested.bottom_bar.offset_y !== undefined) flat.bottom_bar_offset_y = nested.bottom_bar.offset_y;
    if (nested.bottom_bar.padding_x !== undefined) flat.bottom_bar_padding_x = nested.bottom_bar.padding_x;
  }
  
  // Flatten info
  if (nested.info) {
    if (nested.info.size_px !== undefined) flat.info_size_px = nested.info.size_px;
    if (nested.info.weight !== undefined) flat.info_weight = nested.info.weight;
    if (nested.info.color !== undefined) flat.info_color = nested.info.color;
    if (nested.info.pill !== undefined) flat.info_pill = nested.info.pill;
    if (nested.info.pill_background !== undefined) flat.info_pill_background = nested.info.pill_background;
    if (nested.info.pill_padding_x !== undefined) flat.info_pill_padding_x = nested.info.pill_padding_x;
    if (nested.info.pill_padding_y !== undefined) flat.info_pill_padding_y = nested.info.pill_padding_y;
    if (nested.info.pill_radius !== undefined) flat.info_pill_radius = nested.info.pill_radius;
    if (nested.info.pill_blur !== undefined) flat.info_pill_blur = nested.info.pill_blur;
    if (nested.info.pill_border_style !== undefined) flat.info_pill_border_style = nested.info.pill_border_style;
    if (nested.info.pill_border_width !== undefined) flat.info_pill_border_width = nested.info.pill_border_width;
    if (nested.info.pill_border_color !== undefined) flat.info_pill_border_color = nested.info.pill_border_color;
  }
  
  // Flatten bottom_info (bottom bar independent global styling)
  if (nested.bottom_info) {
    if (nested.bottom_info.size_px !== undefined) flat.bottom_info_size_px = nested.bottom_info.size_px;
    if (nested.bottom_info.weight !== undefined) flat.bottom_info_weight = nested.bottom_info.weight;
    if (nested.bottom_info.color !== undefined) flat.bottom_info_color = nested.bottom_info.color;
    if (nested.bottom_info.pill !== undefined) flat.bottom_info_pill = nested.bottom_info.pill;
    if (nested.bottom_info.pill_background !== undefined) flat.bottom_info_pill_background = nested.bottom_info.pill_background;
    if (nested.bottom_info.pill_padding_x !== undefined) flat.bottom_info_pill_padding_x = nested.bottom_info.pill_padding_x;
    if (nested.bottom_info.pill_padding_y !== undefined) flat.bottom_info_pill_padding_y = nested.bottom_info.pill_padding_y;
    if (nested.bottom_info.pill_radius !== undefined) flat.bottom_info_pill_radius = nested.bottom_info.pill_radius;
    if (nested.bottom_info.pill_blur !== undefined) flat.bottom_info_pill_blur = nested.bottom_info.pill_blur;
    if (nested.bottom_info.pill_border_style !== undefined) flat.bottom_info_pill_border_style = nested.bottom_info.pill_border_style;
    if (nested.bottom_info.pill_border_width !== undefined) flat.bottom_info_pill_border_width = nested.bottom_info.pill_border_width;
    if (nested.bottom_info.pill_border_color !== undefined) flat.bottom_info_pill_border_color = nested.bottom_info.pill_border_color;
  }
  
  // Flatten slots (top and bottom bar)
  ['top_bar', 'bottom_bar'].forEach(bar => {
  ['left', 'center', 'right'].forEach(slot => {
    const slotConfig = nested[`${bar}_${slot}`];
    if (!slotConfig) return;
    
    const prefix = `${bar}_${slot}_`;
    flat[`${bar}_${slot}`] = slotConfig.type || "none";
    
    // Only process additional properties if slot type is not "none"
    if (slotConfig.type === "none") return;
    
    // Common properties
    if (slotConfig.offset_x !== undefined) flat[prefix + "offset_x"] = slotConfig.offset_x;
    if (slotConfig.offset_y !== undefined) flat[prefix + "offset_y"] = slotConfig.offset_y;
    if (slotConfig.offset_x_mobile !== undefined) flat[prefix + "offset_x_mobile"] = slotConfig.offset_x_mobile;
    if (slotConfig.offset_y_mobile !== undefined) flat[prefix + "offset_y_mobile"] = slotConfig.offset_y_mobile;
    if (slotConfig.overflow !== undefined) flat[prefix + "overflow"] = slotConfig.overflow;
    
    // Styling
    if (slotConfig.styling) {
      flat[prefix + "use_global"] = false;
      flat[prefix + "size_px"] = slotConfig.styling.size_px;
      flat[prefix + "weight"] = slotConfig.styling.weight;
      flat[prefix + "color"] = slotConfig.styling.color;
      flat[prefix + "pill"] = slotConfig.styling.pill;
      flat[prefix + "pill_background"] = slotConfig.styling.pill_background;
      flat[prefix + "pill_padding_x"] = slotConfig.styling.pill_padding_x;
      flat[prefix + "pill_padding_y"] = slotConfig.styling.pill_padding_y;
      flat[prefix + "pill_radius"] = slotConfig.styling.pill_radius;
      flat[prefix + "pill_blur"] = slotConfig.styling.pill_blur;
      flat[prefix + "pill_border_style"] = slotConfig.styling.pill_border_style;
      flat[prefix + "pill_border_width"] = slotConfig.styling.pill_border_width;
      flat[prefix + "pill_border_color"] = slotConfig.styling.pill_border_color;
    } else {
      flat[prefix + "use_global"] = true;
    }
    
    // Type-specific
    if (slotConfig.weather) {
      Object.entries(slotConfig.weather).forEach(([key, val]) => {
        if (key === 'entity') {
          flat[prefix + "weather_entity"] = val;
        } else if (key.startsWith('icon_')) {
          flat[prefix + "weather_" + key] = val;
        } else {
          flat[prefix + key] = val;
        }
      });
    }
    
    if (slotConfig.datetime) {
      Object.entries(slotConfig.datetime).forEach(([key, val]) => {
        flat[prefix + key] = val;
      });
    }
    
    if (slotConfig.button) {
      Object.entries(slotConfig.button).forEach(([key, val]) => {
        flat[prefix + key] = val;
      });
    }
    
    if (slotConfig.custom) {
      flat[prefix + "card"] = slotConfig.custom.card;
    }
    
    if (slotConfig.align !== undefined) flat[prefix + "align"] = slotConfig.align;
    
    // Actions
    if (slotConfig.actions) {
      if (slotConfig.actions.tap_action) flat[prefix + "tap_action"] = slotConfig.actions.tap_action;
      if (slotConfig.actions.hold_action) flat[prefix + "hold_action"] = slotConfig.actions.hold_action;
      if (slotConfig.actions.double_tap_action) flat[prefix + "double_tap_action"] = slotConfig.actions.double_tap_action;
    }

    // HKI Popup config (nested sub-object → flat prefix keys)
    if (slotConfig.hki_popup && typeof slotConfig.hki_popup === 'object') {
      Object.entries(slotConfig.hki_popup).forEach(([k, v]) => {
        if (v !== undefined) flat[prefix + k] = v;
      });
    }
    // Also support legacy flat popup keys directly on slotConfig (pre-hki_popup format)
    copyDefinedKeys({
      src: slotConfig,
      dst: flat,
      keys: HKI_POPUP_CONFIG_KEYS,
      dstPrefix: prefix,
      onlyIfDstMissing: true,
    });
  });
  }); // end bar loop
  
  // Flatten persons
  if (nested.persons) {
    if (nested.persons.enabled !== undefined) flat.persons_enabled = nested.persons.enabled;
    if (nested.persons.align !== undefined) flat.persons_align = nested.persons.align;
    if (nested.persons.offset_x !== undefined) flat.persons_offset_x = nested.persons.offset_x;
    if (nested.persons.offset_y !== undefined) flat.persons_offset_y = nested.persons.offset_y;
    if (nested.persons.size !== undefined) flat.persons_size = nested.persons.size;
    if (nested.persons.spacing !== undefined) flat.persons_spacing = nested.persons.spacing;
    if (nested.persons.stack_order !== undefined) flat.persons_stack_order = nested.persons.stack_order;
    if (nested.persons.dynamic_order !== undefined) flat.persons_dynamic_order = nested.persons.dynamic_order;
    if (nested.persons.hide_away !== undefined) flat.persons_hide_away = nested.persons.hide_away;
    if (nested.persons.use_entity_picture !== undefined) flat.persons_use_entity_picture = nested.persons.use_entity_picture;
    if (nested.persons.border_width !== undefined) flat.persons_border_width = nested.persons.border_width;
    if (nested.persons.border_style !== undefined) flat.persons_border_style = nested.persons.border_style;
    if (nested.persons.border_radius !== undefined) flat.persons_border_radius = nested.persons.border_radius;
    if (nested.persons.border_color !== undefined) flat.persons_border_color = nested.persons.border_color;
    if (nested.persons.border_color_away !== undefined) flat.persons_border_color_away = nested.persons.border_color_away;
    if (nested.persons.box_shadow !== undefined) flat.persons_box_shadow = nested.persons.box_shadow;
    if (nested.persons.grayscale_away !== undefined) flat.persons_grayscale_away = nested.persons.grayscale_away;
    if (nested.persons.entities !== undefined) flat.persons_entities = nested.persons.entities || [];
  }
  
  return flat;
}


// Simplified hash - djb2
function hashStr(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(16);
}

function cacheKey(raw, vars) {
  return `hkiTpl:${hashStr(raw + (vars ? JSON.stringify(vars) : ""))}`;
}

// Date formatting helper - uses locale for proper translations
function formatDateTime(date, format, locale = 'en') {
  const pad = (n) => String(n).padStart(2, '0');
  
  // Get localized day names
  const getDayName = (d, style) => {
    try {
      return new Intl.DateTimeFormat(locale, { weekday: style }).format(d);
    } catch (_) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return style === 'long' ? days[d.getDay()] : daysShort[d.getDay()];
    }
  };
  
  // Get localized month names
  const getMonthName = (d, style) => {
    try {
      return new Intl.DateTimeFormat(locale, { month: style }).format(d);
    } catch (_) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return style === 'long' ? months[d.getMonth()] : monthsShort[d.getMonth()];
    }
  };

  const h24 = date.getHours();
  const h12 = h24 % 12 || 12;
  const ampm = h24 < 12 ? 'AM' : 'PM';

  const tokens = {
    'YYYY': date.getFullYear(),
    'YY': String(date.getFullYear()).slice(-2),
    'MMMM': getMonthName(date, 'long'),
    'MMM': getMonthName(date, 'short'),
    'MM': pad(date.getMonth() + 1),
    'DDDD': getDayName(date, 'long'),
    'DDD': getDayName(date, 'short'),
    'DD': pad(date.getDate()),
    'HH': pad(h24),
    'hh': pad(h12),
    'mm': pad(date.getMinutes()),
    'ss': pad(date.getSeconds()),
    'M': date.getMonth() + 1,
    'D': date.getDate(),
    'H': h24,
    'h': h12,
    'm': date.getMinutes(),
    's': date.getSeconds(),
    'A': ampm,
    'a': ampm.toLowerCase(),
  };

  // Single-pass replacement using regex with all tokens (longest first via alternation order)
  const tokenPattern = /YYYY|MMMM|DDDD|YY|MMM|DDD|MM|DD|HH|hh|mm|ss|M|D|H|h|m|s|A|a/g;
  return format.replace(tokenPattern, match => tokens[match]);
}

class HkiHeaderCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: { attribute: false },
      _offsetLeft: { type: Number },
      _viewportWidth: { type: Number },
      _contentWidth: { type: Number },
      _inPreview: { type: Boolean },
      _headerHeight: { type: Number },
      _kioskMode: { type: Boolean },
      _editMode: { type: Boolean },
      _renderedTitle: { type: String },
      _renderedSubtitle: { type: String },
      _currentTime: { type: Number },
      _customCards: { attribute: false }, // Store elements for left/center/right
    };
  }

  constructor() {
    super();
    this._config = {};
    this._offsetLeft = 0;
    this._viewportWidth = 0;
    this._contentWidth = 0;
    this._inPreview = false;
    this._headerHeight = 0;
    this._kioskMode = false;
    this._editMode = false;
    this._renderedTitle = "";
    this._renderedSubtitle = "";
    this._currentTime = Date.now();
    this._customCards = { left: null, center: null, right: null, bottom_left: null, bottom_center: null, bottom_right: null };

    // Handlers & observers
    this._resizeHandler = null;
    this._ro = null;
    this._rafMeasure = 0;
    this._rafBadges = 0;
    this._kioskCheckInterval = null;
    this._kioskMutationObserver = null;
    this._urlChangeHandler = null;
    this._cachedHeader = null;
    this._visibilityHandler = null;
    this._focusHandler = null;
    this._editModeInterval = null;
    this._timeInterval = null;

    this._tpl = {
      timer: 0,
      title: { raw: "", sig: "", seq: 0, unsub: null },
      subtitle: { raw: "", sig: "", seq: 0, unsub: null },
    };

    this._hassReady = false;
    this._badgesEl = null;
    
    // Performance: Style caches
    this._slotStyleCache = new Map();
    this._lastConfigHash = null;
  }

  static get styles() {
    return css`
      :host { display: block; }

      .header-fixed {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        z-index: 1;
        overflow: hidden; /* Respect border-radius and box-shadow of child */
      }

      ha-card.header {
        position: relative;
        width: 100vw;
        height: 35vh;
        min-height: 180px;
        max-height: 340px;
        margin: 0;
        border-radius: 0; /* Overridden by inline style */
        overflow: visible; /* Allow box-shadow to show when fixed */
        box-sizing: border-box;
        color: var(--hki-header-text-color, #fff);
        /* border and box-shadow controlled via inline styles */
      }

      .overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .content {
        position: relative;
        z-index: 1;
        height: 100%;
        box-sizing: border-box;
      }

      .title-block {
        position: absolute;
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding-right: 16px;
      }

      .title {
        line-height: 1.1;
        text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
        white-space: pre-wrap;
      }

      .subtitle {
        opacity: 0.9;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
        white-space: pre-wrap;
      }

      .header-spacer {
        width: 100%;
        display: block;
      }

      .edit-placeholder {
        border-radius: 14px;
        border: 2px dashed rgba(160, 160, 160, 0.35);
        background: rgba(0, 0, 0, 0.02);
        box-shadow: none;
      }

      .edit-placeholder-inner {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
      }

      .edit-placeholder-text {
        min-width: 0;
      }

      .edit-placeholder-title {
        font-weight: 800;
      }

      .edit-placeholder-subtitle {
        opacity: 0.7;
        font-size: 12px;
      }

      /* PERSON AVATARS */
      .persons-container {
        position: absolute;
        display: flex;
        align-items: center;
        z-index: 2;
      }

      .person-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid rgba(255,255,255,0.3);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        flex-shrink: 0;
        background: var(--primary-background-color);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
      }

      .person-avatar:hover {
        transform: scale(1.05);
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.6);
      }

      .person-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        pointer-events: none;
      }

      .person-avatar ha-icon {
        --mdc-icon-size: 28px;
        color: var(--primary-text-color);
        pointer-events: none;
      }

      /* INFO ITEM (Flex Child for Top Bar) */
      .info-item {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--hki-header-text-color, #fff);
        text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
        flex-shrink: 0;
        flex-grow: 0;
        line-height: 1;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
      }

      .info-clickable {
        cursor: pointer;
        transition: opacity 0.2s;
      }
      .info-clickable:hover { opacity: 0.8; }

      .info-icon {
        color: var(--hki-header-text-color, #fff);
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6));
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        overflow: visible;
        line-height: 0;
        box-sizing: border-box;
      }

      img.info-icon {
        object-fit: contain;
        display: block;
      }

      ha-icon {
        display: block;
        line-height: 0;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
      }
      
      .info-icon ha-icon {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        min-width: 0;
        min-height: 0;
        overflow: visible;
        display: block;
        line-height: 0;
      }
      
      ha-icon svg {
        display: block;
        max-width: 100%;
        max-height: 100%;
        vertical-align: top;
      }

      .info-text { text-transform: capitalize; line-height: 1; display: inline-block; vertical-align: middle; }
      .info-temperature { font-weight: 500; line-height: 1; display: inline-block; vertical-align: middle; }
      .info-condition { line-height: 1; display: inline-block; vertical-align: middle; }
      .info-humidity { line-height: 1; display: inline-block; vertical-align: middle; }
      .info-wind { line-height: 1; display: inline-block; vertical-align: middle; }
      .info-pressure { line-height: 1; display: inline-block; vertical-align: middle; }

      .info-pill {
        background: var(--hki-info-pill-background, rgba(0, 0, 0, 0.25));
        border-radius: var(--hki-info-pill-radius, 999px);
        padding: var(--hki-info-pill-padding-y, 8px) var(--hki-info-pill-padding-x, 12px);
        backdrop-filter: blur(var(--hki-info-pill-blur, 0px));
        -webkit-backdrop-filter: blur(var(--hki-info-pill-blur, 0px));
        border-style: var(--hki-info-pill-border-style, none);
        border-width: var(--hki-info-pill-border-width, 0);
        border-color: var(--hki-info-pill-border-color, rgba(255,255,255,0.1));
        box-sizing: border-box;
        overflow: visible;
      }

      hki-notification-card {
        display: block;
        overflow: hidden;
        border-radius: inherit;
      }

      /* TOP BAR LAYOUT */
      .top-bar-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        z-index: 3;
        box-sizing: border-box;
      }

      .slot {
        display: flex;
        align-items: center;
        min-height: 20px;
        flex: 1 1 0%;
        min-width: 0;
        overflow: hidden;
      }

      .slot-visible {
        overflow: visible !important;
      }

      .slot-left {
        justify-content: flex-start;
        text-align: left;
      }
      .slot-center {
        justify-content: center;
        text-align: center;
      }
      .slot-right {
        justify-content: flex-end;
        text-align: right;
      }
      .slot-align-start  { justify-content: flex-start !important; text-align: left !important; }
      .slot-align-center { justify-content: center !important;     text-align: center !important; }
      .slot-align-end    { justify-content: flex-end !important;   text-align: right !important; }

      /* BOTTOM BAR LAYOUT */
      .bottom-bar-container {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        z-index: 3;
        box-sizing: border-box;
        overflow: visible;
      }
      
      /* Empty slots collapse to allow more space for occupied slots */
      .slot.slot-empty {
        flex: 0 0 auto;
        overflow: visible;
      }
      
      /* Spacer is invisible but takes up layout space */
      .slot-spacer {
        display: block;
        width: 1px;
        height: 1px;
        visibility: hidden;
      }

      .animate-float { animation: hki-float 3s ease-in-out infinite; }
      .animate-pulse { animation: hki-pulse 1.8s ease-in-out infinite; }
      .animate-spin { animation: hki-spin 2.8s linear infinite; }

      @keyframes hki-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      @keyframes hki-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.08); opacity: 0.85; }
      }
      @keyframes hki-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this._detectKioskMode();
    // Fix for template reactivity: re-establish subscriptions when reconnected to DOM
    this._scheduleTemplateSetup(0);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this._resizeHandler) {
      window.removeEventListener("resize", this._resizeHandler);
      this._resizeHandler = null;
    }
    if (this._ro) {
      this._ro.disconnect();
      this._ro = null;
    }
    if (this._rafMeasure) cancelAnimationFrame(this._rafMeasure);
    if (this._rafBadges) cancelAnimationFrame(this._rafBadges);
    if (this._tpl.timer) clearTimeout(this._tpl.timer);
    if (this._kioskCheckInterval) clearInterval(this._kioskCheckInterval);
    if (this._kioskMutationObserver) this._kioskMutationObserver.disconnect();
    if (this._urlChangeHandler) {
      window.removeEventListener("popstate", this._urlChangeHandler);
      window.removeEventListener("hashchange", this._urlChangeHandler);
    }
    if (this._visibilityHandler) document.removeEventListener("visibilitychange", this._visibilityHandler);
    if (this._focusHandler) window.removeEventListener("focus", this._focusHandler);
    if (this._editModeInterval) clearInterval(this._editModeInterval);
    if (this._timeInterval) clearInterval(this._timeInterval);

    this._unsubscribeTemplate("title");
    this._unsubscribeTemplate("subtitle");
    this._resetBadgesZIndex();
  }

  firstUpdated() {
    this._detectPreview();
    this._detectKioskMode();
    this._detectEditMode();

    // Consolidated resize handling
    this._resizeHandler = () => {
      this._debouncedMeasure(true);
      this._debouncedBadgesZIndex();
      this.requestUpdate(); // Force update for responsive mobile offsets
    };
    window.addEventListener("resize", this._resizeHandler, { passive: true });

    this._ro = new ResizeObserver(this._resizeHandler);
    this._ro.observe(this);

    // Mutation observer for kiosk mode
    this._kioskMutationObserver = new MutationObserver(() => this._detectKioskMode());
    this._kioskMutationObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    this._kioskMutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // URL change handler
    this._urlChangeHandler = () => {
      this._detectKioskMode();
      this._detectEditMode();
    };
    window.addEventListener("popstate", this._urlChangeHandler);
    window.addEventListener("hashchange", this._urlChangeHandler);

    // Visibility & focus handlers
    this._visibilityHandler = () => {
      if (!document.hidden) {
        this._cachedHeader = null;
        this._detectKioskMode();
        setTimeout(() => this._detectKioskMode(), 200);
      }
    };
    document.addEventListener("visibilitychange", this._visibilityHandler);

    this._focusHandler = () => {
      this._cachedHeader = null;
      this._detectKioskMode();
    };
    window.addEventListener("focus", this._focusHandler);

    // Reduced polling: edit mode every 2s instead of 1s
    this._editModeInterval = setInterval(() => this._detectEditMode(), 2000);

    // Time update interval for datetime display
    this._timeInterval = setInterval(() => {
      if (this._config?.top_bar_enabled) {
        this._currentTime = Date.now();
        this.requestUpdate();
      }
    }, 1000);

    // Reduced initial checks
    [100, 500, 1500].forEach(delay => {
      setTimeout(() => {
        this._cachedHeader = null;
        this._detectKioskMode();
      }, delay);
    });

    // Reduced kiosk polling: 10s instead of 5s
    this._kioskCheckInterval = setInterval(() => this._detectKioskMode(), 10000);

    requestAnimationFrame(() => this._measure(true));
    this._scheduleTemplateSetup(0);
    this._debouncedBadgesZIndex();

    this._updateCustomCards();
  }

  updated(changed) {
    if (changed.has("_config")) {
      this._slotStyleCache.clear(); // Clear cached styles on config change
      this._detectPreview();
      this._debouncedMeasure(true);
      this._scheduleTemplateSetup(80);
      this._debouncedBadgesZIndex();
      this._updateCustomCards();
      return;
    }

    if (changed.has("hass")) {
      this._detectPreview();
      this._detectEditMode();
      this._debouncedMeasure(true);

      const nowReady = !!this.hass?.connection && typeof this.hass?.callWS === "function";
      if (nowReady && !this._hassReady) {
        this._hassReady = true;
        this._scheduleTemplateSetup(0);
        this._cachedHeader = null;
        this._detectKioskMode();
      }
      this._debouncedBadgesZIndex();

      // Pass hass to custom cards
      Object.values(this._customCards).forEach(el => {
        if (el) el.hass = this.hass;
      });
    }

    if (changed.has("_kioskMode")) {
      this._debouncedMeasure(true);
      this._debouncedBadgesZIndex();
    }
  }

  _detectKioskMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlKiosk = urlParams.get("kiosk") === "true" || window.location.search.includes("kiosk");
    
    const bodyKiosk = document.body.classList.contains("kiosk-mode") || 
                      document.documentElement.classList.contains("kiosk-mode");
    
    if (urlKiosk || bodyKiosk) {
      if (!this._kioskMode) {
        this._kioskMode = true;
        this.requestUpdate();
      }
      return;
    }
    
    let headerHidden = false;
    try {
      if (!this._cachedHeader || !document.contains(this._cachedHeader)) {
        const findHeader = (root, depth = 0) => {
          if (depth > 10) return null;
          
          const selectors = [
            "app-header",
            "mwc-top-app-bar-fixed", 
            ".toolbar",
            "[slot='header']",
            "ha-app-layout app-header",
            "ha-tabs"
          ];
          
          for (const selector of selectors) {
            const header = root.querySelector?.(selector);
            if (header) return header;
          }
          
          const elements = root.querySelectorAll?.("*") || [];
          for (const el of elements) {
            if (el.shadowRoot) {
              const found = findHeader(el.shadowRoot, depth + 1);
              if (found) return found;
            }
          }
          return null;
        };
        
        const ha = document.querySelector("home-assistant");
        if (ha?.shadowRoot) {
          this._cachedHeader = findHeader(ha.shadowRoot);
        }
        
        if (!this._cachedHeader) {
          this._cachedHeader = findHeader(document);
        }
      }
      
      if (this._cachedHeader) {
        const rect = this._cachedHeader.getBoundingClientRect();
        const style = window.getComputedStyle(this._cachedHeader);
        
        headerHidden = 
          rect.height === 0 || 
          this._cachedHeader.offsetHeight === 0 || 
          this._cachedHeader.clientHeight === 0 ||
          rect.top < -100 ||
          style.display === "none" || 
          style.visibility === "hidden" || 
          style.opacity === "0";
      }
    } catch (e) {
      // Silent fail
    }
    
    const newKioskMode = headerHidden;
    
    if (newKioskMode !== this._kioskMode) {
      this._kioskMode = newKioskMode;
      this.requestUpdate();
    }
  }

  _debouncedMeasure(readCard = false) {
    if (this._rafMeasure) return;
    this._rafMeasure = requestAnimationFrame(() => {
      this._rafMeasure = 0;
      this._measure(readCard);
    });
  }

  _measure(readCard = false) {
    const rect = this.getBoundingClientRect?.();
    if (!rect) return;

    const vw = window.innerWidth || document.documentElement.clientWidth || rect.width;

    if (vw !== this._viewportWidth || rect.left !== this._offsetLeft || rect.width !== this._contentWidth) {
      this._viewportWidth = vw;
      this._offsetLeft = rect.left;
      this._contentWidth = rect.width;
      this.requestUpdate();
    }

    if (readCard) {
      const card = this.renderRoot?.querySelector?.("ha-card.header");
      const cr = card?.getBoundingClientRect?.();
      if (cr?.height) this._headerHeight = Math.round(cr.height);
    }
  }

  _detectPreview() {
    let node = this;
    while (node) {
      const root = node.getRootNode?.();
      if (!root || root === document) break;
      const host = root.host;
      if (!host) break;

      const tag = (host.tagName || "").toLowerCase();
      if (tag === "hui-card-preview" || tag === "hui-dialog-edit-card" || tag === "ha-dialog" || tag === "ha-dialog-scroller") {
        this._inPreview = true;
        return;
      }
      node = host;
    }
    this._inPreview = false;
  }

  _detectEditMode() {
    if (this._inPreview) {
      if (!this._editMode) {
        this._editMode = true;
        this.requestUpdate();
      }
      return;
    }

    let edit = false;
    try {
      const huiRoot = document.querySelector("hui-root") ||
                      document.querySelector("home-assistant")?.shadowRoot?.querySelector("hui-root");
      edit = !!(huiRoot?.lovelace?.editMode || huiRoot?.editMode);
    } catch (_) {}

    if (!edit) {
      try {
        edit = document.body?.classList?.contains("edit-mode") ||
               !!document.querySelector("hui-dialog-edit-card");
      } catch (_) {}
    }

    if (edit !== this._editMode) {
      this._editMode = edit;
      this.requestUpdate();
    }
  }

  _isEditMode() {
    try {
      const qs = new URLSearchParams(window.location.search || "");
      if (qs.get("edit") === "1") return true;
    } catch (_) {}
    if (document.body?.classList) {
      if (document.body.classList.contains("edit-mode") || document.body.classList.contains("edit")) return true;
    }
    return false;
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");

    // Detect format and convert if needed
    let workingConfig = config;
    
    // If config uses old flat format, migrate to nested first
    if (isOldFormat(config)) {
      const nested = migrateToNestedFormat(config);
      workingConfig = flattenNestedFormat(nested); // Flatten back for internal use
    } else if (config.top_bar_left && typeof config.top_bar_left === 'object') {
      // New nested format - flatten for internal use
      workingConfig = flattenNestedFormat(config);
    }

    const m = { ...DEFAULTS, ...workingConfig };

    // Numeric clamping
    m.height_vh = clamp(+m.height_vh, 10, 100);
    m.min_height = clamp(+m.min_height, 60, 2000);
    m.max_height = clamp(+m.max_height, m.min_height, 4000);
    m.blend_stop = clamp(+m.blend_stop, 0, 100);
    m.fixed = !!m.fixed;
    m.fixed_top = toNum(m.fixed_top, 0);
    m.title_offset_x = toNum(m.title_offset_x, 5);
    m.title_offset_y = toNum(m.title_offset_y, 32);
    m.subtitle_offset_x = toNum(m.subtitle_offset_x, 5);
    m.subtitle_offset_y = toNum(m.subtitle_offset_y, 32);
    m.badges_offset_pinned = toNum(m.badges_offset_pinned, 48);
    m.badges_offset_unpinned = toNum(m.badges_offset_unpinned, 100);
    m.badges_gap = toNum(m.badges_gap, 0);
    m.mobile_breakpoint = toNum(m.mobile_breakpoint, 768);

    // Person entities configuration
    m.persons_enabled = !!m.persons_enabled;
    
    // Handle backward compatibility and normalize persons_entities structure
    if (Array.isArray(m.persons_entities)) {
      m.persons_entities = m.persons_entities.map(item => {
        // If it's already an object, ensure it has all required fields
        if (typeof item === 'object' && item !== null) {
          const normalized = {
            entity: item.entity || "",
            grayscale_entity: item.grayscale_entity || "",
            icon_home: item.icon_home || "",
            icon_away: item.icon_away || "",
            picture_home: item.picture_home || "",
            picture_away: item.picture_away || "",
            tap_action: item.tap_action || { action: "more-info" },
            hold_action: item.hold_action || { action: "none" },
            double_tap_action: item.double_tap_action || { action: "none" }
          };
          // Preserve popup settings (slot-level, shared across actions)
          if (item.custom_popup_enabled !== undefined) normalized.custom_popup_enabled = item.custom_popup_enabled;
          if (item.custom_popup_card !== undefined) normalized.custom_popup_card = item.custom_popup_card;
          if (item.popup_name !== undefined) normalized.popup_name = item.popup_name;
          if (item.popup_state !== undefined) normalized.popup_state = item.popup_state;
          if (item.popup_border_radius !== undefined) normalized.popup_border_radius = item.popup_border_radius;
          if (item.popup_width !== undefined) normalized.popup_width = item.popup_width;
          if (item.popup_open_animation !== undefined) normalized.popup_open_animation = item.popup_open_animation;
          if (item.popup_close_animation !== undefined) normalized.popup_close_animation = item.popup_close_animation;
          if (item.popup_animation_duration !== undefined) normalized.popup_animation_duration = item.popup_animation_duration;
          if (item.popup_blur_enabled !== undefined) normalized.popup_blur_enabled = item.popup_blur_enabled;
          // Preserve ALL popup config keys
          copyDefinedKeys({
            src: item,
            dst: normalized,
            keys: HKI_POPUP_CONFIG_KEYS,
            onlyIfDstMissing: true,
          });
          return normalized;
        }
        // If it's a string (old format), convert to object
        if (typeof item === 'string') {
          return {
            entity: item,
            grayscale_entity: "",
            icon_home: "",
            icon_away: "",
            picture_home: "",
            picture_away: "",
            tap_action: { action: "more-info" },
            hold_action: { action: "none" },
            double_tap_action: { action: "none" }
          };
        }
        return null;
      }).filter(Boolean);
    } else {
      m.persons_entities = [];
    }
    
    m.persons_align = ["left", "center", "right"].includes(m.persons_align) ? m.persons_align : "left";
    m.persons_offset_x = toNum(m.persons_offset_x, 5);
    m.persons_offset_y = toNum(m.persons_offset_y, 32);
    m.persons_size = clamp(+m.persons_size || 48, 24, 128);
    m.persons_spacing = toNum(m.persons_spacing, -8);
    m.persons_stack_order = ["ascending", "descending"].includes(m.persons_stack_order) ? m.persons_stack_order : "ascending";
    m.persons_dynamic_order = !!m.persons_dynamic_order;
    m.persons_hide_away = !!m.persons_hide_away;
    m.persons_use_entity_picture = m.persons_use_entity_picture !== false;
    m.persons_border_width = clamp(+m.persons_border_width || 1, 0, 10);
    m.persons_border_style = m.persons_border_style || "solid";
    m.persons_border_radius = m.persons_border_radius !== undefined ? m.persons_border_radius : 50;
    m.persons_border_color = m.persons_border_color || "rgba(255,255,255,0.3)";
    m.persons_border_color_away = m.persons_border_color_away || "rgba(255,100,100,0.5)";
    m.persons_box_shadow = m.persons_box_shadow !== undefined ? m.persons_box_shadow : "0 2px 8px rgba(0, 0, 0, 0.4)";
    m.persons_grayscale_away = !!m.persons_grayscale_away;


    // Background extra options
    m.background_blend_mode = m.background_blend_mode || "normal";
    // Allow custom sizing, default to cover if missing
    m.background_size = m.background_size || "cover";
    m.background_color = m.background_color || "";
    m.blend_enabled = m.blend_enabled !== false;
    
    // Header styling options
    // Border radius split: if top/bottom are not set, fall back to legacy card_border_radius.
    m.card_border_radius = m.card_border_radius || "";
    m.card_border_radius_top = m.card_border_radius_top || "";
    m.card_border_radius_bottom = m.card_border_radius_bottom || "";
    if (!m.card_border_radius_top && !m.card_border_radius_bottom && m.card_border_radius) {
      m.card_border_radius_top = m.card_border_radius;
      m.card_border_radius_bottom = m.card_border_radius;
    }
    m.card_box_shadow = m.card_box_shadow || "";
    m.card_border_style = m.card_border_style || "none";
    m.card_border_width = toNum(m.card_border_width, 0);
    m.card_border_color = m.card_border_color || "";

    // Top Bar Settings
    m.top_bar_enabled = m.top_bar_enabled !== false;
    m.top_bar_offset_y = toNum(m.top_bar_offset_y, 10);
    m.top_bar_padding_x = toNum(m.top_bar_padding_x, 5);
    
    const validSlotTypes = ["none", "spacer", "weather", "datetime", "notifications", "custom", "card", "button"];
    // Migrate legacy "custom" value to "notifications"
    if (m.top_bar_left === "custom") m.top_bar_left = "notifications";
    if (m.top_bar_center === "custom") m.top_bar_center = "notifications";
    if (m.top_bar_right === "custom") m.top_bar_right = "notifications";
    // Read bottom_bar settings from nested format
    if (m.bottom_bar && typeof m.bottom_bar === 'object') {
      if (m.bottom_bar.enabled !== undefined) m.bottom_bar_enabled = m.bottom_bar.enabled;
      if (m.bottom_bar.offset_y !== undefined) m.bottom_bar_offset_y = m.bottom_bar.offset_y;
      if (m.bottom_bar.padding_x !== undefined) m.bottom_bar_padding_x = m.bottom_bar.padding_x;
    }
    m.bottom_bar_left = validSlotTypes.includes(m.bottom_bar_left) ? m.bottom_bar_left : "none";
    m.bottom_bar_center = validSlotTypes.includes(m.bottom_bar_center) ? m.bottom_bar_center : "none";
    m.bottom_bar_right = validSlotTypes.includes(m.bottom_bar_right) ? m.bottom_bar_right : "none";
    m.top_bar_left = validSlotTypes.includes(m.top_bar_left) ? m.top_bar_left : "none";
    m.top_bar_center = validSlotTypes.includes(m.top_bar_center) ? m.top_bar_center : "none";
    m.top_bar_right = validSlotTypes.includes(m.top_bar_right) ? m.top_bar_right : "none";
    
    // Per-slot config processing for each slot
    ["left", "center", "right"].forEach(slot => {
      const prefix = `top_bar_${slot}_`;
      m[prefix + "use_global"] = m[prefix + "use_global"] !== false;
      m[prefix + "icon"] = m[prefix + "icon"] || "";
      m[prefix + "label"] = m[prefix + "label"] || "";
      // Alignment default differs per slot
      const defaultAlign = slot === "left" ? "start" : (slot === "right" ? "end" : "center");
      m[prefix + "align"] = ["start", "center", "end", "stretch"].includes(m[prefix + "align"]) ? m[prefix + "align"] : defaultAlign;
    });
    ["left", "center", "right"].forEach(slot => {
      const prefix = `bottom_bar_${slot}_`;
      m[prefix + "use_global"] = m[prefix + "use_global"] !== false;
      m[prefix + "icon"] = m[prefix + "icon"] || "";
      m[prefix + "label"] = m[prefix + "label"] || "";
      const defaultAlign = slot === "left" ? "start" : (slot === "right" ? "end" : "center");
      m[prefix + "align"] = ["start", "center", "end", "stretch"].includes(m[prefix + "align"]) ? m[prefix + "align"] : defaultAlign;
      m[prefix + "tap_action"] = m[prefix + "tap_action"] || { action: "none" };
      m[prefix + "hold_action"] = m[prefix + "hold_action"] || { action: "none" };
      m[prefix + "double_tap_action"] = m[prefix + "double_tap_action"] || { action: "none" };
      m[prefix + "tap_action"] = m[prefix + "tap_action"] || { action: "none" };
      m[prefix + "hold_action"] = m[prefix + "hold_action"] || { action: "none" };
      m[prefix + "double_tap_action"] = m[prefix + "double_tap_action"] || { action: "none" };
      m[prefix + "size_px"] = m[prefix + "size_px"] != null ? clamp(+m[prefix + "size_px"], 8, 64) : null;
      m[prefix + "weight"] = m[prefix + "weight"] ? normalizeWeightKey(m[prefix + "weight"], "medium") : null;
      m[prefix + "color"] = m[prefix + "color"] || null;
      m[prefix + "pill"] = m[prefix + "pill"] != null ? !!m[prefix + "pill"] : null;
      m[prefix + "pill_background"] = m[prefix + "pill_background"] || null;
      m[prefix + "pill_padding_x"] = m[prefix + "pill_padding_x"] != null ? clamp(+m[prefix + "pill_padding_x"], 0, 80) : null;
      m[prefix + "pill_padding_y"] = m[prefix + "pill_padding_y"] != null ? clamp(+m[prefix + "pill_padding_y"], 0, 80) : null;
      m[prefix + "pill_radius"] = m[prefix + "pill_radius"] != null ? clamp(+m[prefix + "pill_radius"], 0, 999) : null;
      m[prefix + "pill_blur"] = m[prefix + "pill_blur"] != null ? clamp(+m[prefix + "pill_blur"], 0, 40) : null;
      m[prefix + "pill_border_style"] = ["none", "solid", "dashed", "dotted"].includes(m[prefix + "pill_border_style"]) ? m[prefix + "pill_border_style"] : null;
      m[prefix + "pill_border_width"] = m[prefix + "pill_border_width"] != null ? clamp(+m[prefix + "pill_border_width"], 0, 10) : null;
      m[prefix + "pill_border_color"] = m[prefix + "pill_border_color"] || null;
      m[prefix + "offset_x"] = toNum(m[prefix + "offset_x"], 0);
      m[prefix + "offset_y"] = toNum(m[prefix + "offset_y"], 0);
      m[prefix + "overflow"] = !!m[prefix + "overflow"]; // New overflow option
      // Offset mobile can be null to inherit desktop, so we check carefully
      m[prefix + "offset_x_mobile"] = m[prefix + "offset_x_mobile"] != null ? toNum(m[prefix + "offset_x_mobile"], 0) : null;
      m[prefix + "offset_y_mobile"] = m[prefix + "offset_y_mobile"] != null ? toNum(m[prefix + "offset_y_mobile"], 0) : null;
    });

    // Global info styling
    m.info_size_px = clamp(+m.info_size_px || 12, 8, 64);
    m.info_weight = normalizeWeightKey(m.info_weight ?? "medium", "medium");
    m.info_pill = !!m.info_pill;
    m.info_pill_padding_x = clamp(+m.info_pill_padding_x || 12, 0, 80);
    m.info_pill_padding_y = clamp(+m.info_pill_padding_y || 8, 0, 80);
    m.info_pill_radius = clamp(+m.info_pill_radius || 999, 0, 999);
    m.info_pill_blur = clamp(+m.info_pill_blur || 0, 0, 40);
    m.info_pill_border_style = ["none", "solid", "dashed", "dotted"].includes(m.info_pill_border_style) ? m.info_pill_border_style : "none";
    m.info_pill_border_width = clamp(+m.info_pill_border_width || 0, 0, 10);
    m.info_pill_border_color = m.info_pill_border_color || "rgba(255,255,255,0.1)";

    // Weather options (Global fallback)
    m.weather_show_icon = m.weather_show_icon !== false;
    m.weather_show_condition = m.weather_show_condition !== false;
    m.weather_show_temperature = m.weather_show_temperature !== false;
    m.weather_show_humidity = !!m.weather_show_humidity;
    m.weather_show_wind = !!m.weather_show_wind;
    m.weather_show_pressure = !!m.weather_show_pressure;
    m.weather_colored_icons = m.weather_colored_icons !== false;
    m.weather_icon_color_mode = ["state", "custom", "inherit"].includes(m.weather_icon_color_mode) ? m.weather_icon_color_mode : "state";
    m.weather_animate_icon = ["none", "float", "pulse", "spin"].includes(m.weather_animate_icon) ? m.weather_animate_icon : "none";

    // Datetime options (Global fallback)
    m.datetime_show_time = m.datetime_show_time !== false;
    m.datetime_show_date = m.datetime_show_date !== false;
    m.datetime_show_day = m.datetime_show_day !== false;
    m.datetime_animate_icon = ["none", "float", "pulse", "spin"].includes(m.datetime_animate_icon) ? m.datetime_animate_icon : "none";

    // Font options
    m.font_family = ["inherit", "system", "roboto", "inter", "arial", "georgia", "mono", "custom"].includes(m.font_family) ? m.font_family : "inherit";
    m.font_family_custom = typeof m.font_family_custom === "string" ? m.font_family_custom : "";
    m.font_style = ["normal", "italic"].includes(m.font_style) ? m.font_style : "normal";
    m.title_size_px = clamp(+m.title_size_px || 36, 8, 256);
    m.subtitle_size_px = clamp(+m.subtitle_size_px || 15, 8, 128);
    m.title_weight = normalizeWeightKey(m.title_weight ?? "bold", "bold");
    m.subtitle_weight = normalizeWeightKey(m.subtitle_weight ?? "medium", "medium");

    // ========== CONFIG CLEANUP ==========
    // Remove deprecated fields from older versions
    // These fields have been replaced or moved to per-entity config
    delete m.persons_gap;           // Replaced by persons_spacing
    delete m.persons_overlap;       // Replaced by persons_spacing
    delete m.persons_tap_action;    // Now per-person in persons_entities
    delete m.persons_hold_action;   // Now per-person in persons_entities
    delete m.persons_double_tap_action; // Now per-person in persons_entities

    // Clean up all action configs to remove unused fields based on action type
    // This prevents having leftover fields like navigation_path when action is "url"
    const actionFields = Object.keys(m).filter(k => k.endsWith('_tap_action') || k.endsWith('_hold_action') || k.endsWith('_double_tap_action'));
    actionFields.forEach(field => {
      if (m[field] && typeof m[field] === 'object') {
        m[field] = this._cleanupActionConfig(m[field]);
      }
    });

    // Clean up persons_entities array to ensure proper structure and clean actions
    if (Array.isArray(m.persons_entities)) {
      m.persons_entities = m.persons_entities.map(person => {
        if (typeof person === 'string') return person;
        if (typeof person !== 'object' || !person) return null;
        
        const cleaned = { entity: person.entity || "" };
        if (person.grayscale_entity) cleaned.grayscale_entity = person.grayscale_entity;
        if (person.icon_home) cleaned.icon_home = person.icon_home;
        if (person.icon_away) cleaned.icon_away = person.icon_away;
        if (person.picture_home) cleaned.picture_home = person.picture_home;
        if (person.picture_away) cleaned.picture_away = person.picture_away;
        if (person.tap_action) cleaned.tap_action = this._cleanupActionConfig(person.tap_action);
        if (person.hold_action) cleaned.hold_action = this._cleanupActionConfig(person.hold_action);
        if (person.double_tap_action) cleaned.double_tap_action = this._cleanupActionConfig(person.double_tap_action);
        // Preserve slot-level popup settings
        copyDefinedKeys({ src: person, dst: cleaned, keys: HKI_POPUP_CONFIG_KEYS });
        
        return cleaned;
      }).filter(Boolean);
    }

    this._config = m;
    this._scheduleTemplateSetup(0);
    this._debouncedBadgesZIndex();
  }

  _cleanupActionConfig(action) {
    if (!action || typeof action !== 'object') return action;
    
    const actionType = action.action || "none";
    const cleaned = { action: actionType };
    
    // Only keep fields relevant to the action type
    switch (actionType) {
      case "navigate":
        if (action.navigation_path) cleaned.navigation_path = action.navigation_path;
        break;
      case "url":
        if (action.url_path) cleaned.url_path = action.url_path;
        break;
      case "more-info":
      case "toggle":
        if (action.entity) cleaned.entity = action.entity;
        break;
      case "perform-action":
        if (action.perform_action) cleaned.perform_action = action.perform_action;
        if (action.data) cleaned.data = action.data;
        if (action.target) cleaned.target = action.target;
        break;
      case "hki-more-info":
        // Preserve entity and all popup settings
        if (action.entity) cleaned.entity = action.entity;
        if (action.custom_popup_card !== undefined) cleaned.custom_popup_card = action.custom_popup_card;
        copyDefinedKeys({
          src: action,
          dst: cleaned,
          keys: HKI_POPUP_CONFIG_KEYS.filter((k) => !["custom_popup_enabled", "custom_popup_card", "popup_name", "popup_state"].includes(k)),
        });
        if (action.popup_name) cleaned.popup_name = action.popup_name;
        if (action.popup_state) cleaned.popup_state = action.popup_state;
        if (action.popup_icon) cleaned.popup_icon = action.popup_icon;
        break;
      case "fire-dom-event":
        // Preserve all properties for fire-dom-event (browser_mod integration)
        Object.keys(action).forEach(key => {
          if (key !== 'action') {
            cleaned[key] = action[key];
          }
        });
        break;
      case "call-service":
        // Legacy support
        if (action.service) cleaned.service = action.service;
        if (action.service_data) cleaned.service_data = action.service_data;
        break;
    }
    
    return cleaned;
  }

  _isTemplateString(s) {
    if (typeof s !== "string") return false;
    return s.includes("{{") || s.includes("{%") || s.includes("{#");
  }

  _getUserVariable() {
    const u = this.hass?.user;
    return u?.name || u?.username || u?.id || "";
  }

  _buildTemplateVariables() {
    return { config: this._config ?? {}, user: this._getUserVariable() };
  }

  _scheduleTemplateSetup(delayMs = 0) {
    if (this._tpl.timer) clearTimeout(this._tpl.timer);
    this._tpl.timer = setTimeout(() => {
      this._tpl.timer = 0;
      this._setupTemplates();
    }, Math.max(0, delayMs));
  }

  _setupTemplates() {
    this._setupTemplateKey("title", this._config?.title ?? "");
    this._setupTemplateKey("subtitle", this._config?.subtitle ?? "");
  }

  _setupTemplateKey(key, raw) {
    const isTpl = this._isTemplateString(raw);

    if (!isTpl) {
      this._unsubscribeTemplate(key);
      this._tpl[key].raw = raw;
      this._tpl[key].sig = "";
      this._setRendered(key, raw);
      return;
    }

    // Don't show raw template - keep previous value or empty until render completes
    // This prevents the flash of unrendered Jinja templates

    const vars = this._buildTemplateVariables();
    const sig = cacheKey(raw, vars);
    const state = this._tpl[key];

    this._unsubscribeTemplate(key);
    state.raw = raw;
    state.sig = sig;
    state.seq += 1;
    const seq = state.seq;

    const hadCache = this._applyCachedTemplate(key, sig);
    
    // If no cache was found, set to empty to avoid showing raw template
    if (!hadCache) {
      this._setRendered(key, "");
    }

    if (!this._inPreview && this.hass?.connection?.subscribeMessage) {
      this._subscribeTemplateImmediate(key, seq, raw, vars, sig);
    } else if (this.hass?.callWS && !hadCache) {
      this._renderTemplateOnce(key, seq, raw, vars, sig);
    }
  }

  _applyCachedTemplate(key, sig) {
    try {
      const cached = sessionStorage.getItem(sig);
      if (cached != null && cached !== "") {
        this._setRendered(key, cached);
        return true;
      }
    } catch (_) {}
    return false;
  }

  async _renderTemplateOnce(key, seq, raw, vars, sig) {
    if (!this.hass?.callWS) return;
    try {
      const res = await this.hass.callWS({
        type: "render_template",
        template: raw,
        variables: vars,
        strict: false,
      });
      if (this._tpl[key].seq !== seq) return;
      const text = res?.result == null ? "" : String(res.result);
      this._setRendered(key, text);
      this._storeTemplateCache(sig, text);
    } catch (err) {
      console.warn(`Template render failed for ${key}:`, err);
    }
  }

  async _subscribeTemplateImmediate(key, seq, raw, vars, sig) {
    if (!this.hass?.connection?.subscribeMessage) return;
    try {
      const unsub = await this.hass.connection.subscribeMessage(
        (msg) => this._onTemplateMsg(key, seq, sig, msg),
        { type: "render_template", template: raw, variables: vars, strict: false, report_errors: false }
      );
      const st = this._tpl[key];
      if (st.seq !== seq) { unsub?.(); return; }
      st.unsub = unsub;
    } catch (err) {
      console.warn(`Template subscription failed for ${key}:`, err);
      this._renderTemplateOnce(key, seq, raw, vars, sig);
    }
  }

  _onTemplateMsg(key, seq, sig, msg) {
    if (this._tpl[key].seq !== seq) return;
    if (msg?.error) { console.warn(`Template update error for ${key}:`, msg.error); return; }
    const text = msg?.result == null ? "" : String(msg.result);
    this._setRendered(key, text);
    this._storeTemplateCache(sig, text);
  }

  _storeTemplateCache(sig, value) {
    try { sessionStorage.setItem(sig, value); } catch (_) {}
  }

  _setRendered(key, value) {
    const v = value == null ? "" : String(value);
    if (key === "title") {
      if (this._renderedTitle !== v) { this._renderedTitle = v; this.requestUpdate(); }
    } else if (key === "subtitle") {
      if (this._renderedSubtitle !== v) { this._renderedSubtitle = v; this.requestUpdate(); }
    }
  }

  _unsubscribeTemplate(key) {
    const st = this._tpl[key];
    if (st?.unsub) { try { st.unsub(); } catch (_) {} }
    if (st) st.unsub = null;
  }

  _resolveFontFamily() {
    const k = this._config?.font_family ?? "inherit";
    if (k === "custom") return (this._config?.font_family_custom || "").trim() || "inherit";
    return FONT_FAMILY_MAP[k] ?? "inherit";
  }

  _resolveWeight(key) {
    return WEIGHT_MAP[this._config?.[key]] ?? 400;
  }

  _resolveWeightValue(weight) {
    return WEIGHT_MAP[weight] ?? 400;
  }

  _resolveBackground(bg) {
    if (!bg || typeof bg !== "string") return bg;
    const t = bg.trim();
    if (t.startsWith("url(") || t.startsWith("linear-gradient(") || t.startsWith("radial-gradient(")) return t;
    const isPath = t.startsWith("/") || t.startsWith("./") || t.startsWith("../") ||
                   t.startsWith("http://") || t.startsWith("https://") ||
                   /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(t);
    return isPath ? `url('${t}')` : t;
  }

  _resolveWeatherIconColor(cfg, state, prefix = "") {
    // Check specific slot config first, then fallback to global
    const mode = cfg[prefix + "weather_icon_color_mode"] || cfg.weather_icon_color_mode;
    const customColor = cfg[prefix + "weather_icon_color"] || cfg.weather_icon_color;
    const coloredIcons = cfg[prefix + "weather_colored_icons"] !== undefined ? cfg[prefix + "weather_colored_icons"] : cfg.weather_colored_icons;

    if (mode === "custom" && customColor) return customColor.trim();
    if (mode === "inherit" || !coloredIcons) return "inherit";
    return WEATHER_COLOR_MAP[state] || "inherit";
  }

  _debouncedBadgesZIndex() {
    if (this._rafBadges) return;
    this._rafBadges = requestAnimationFrame(() => {
      this._rafBadges = 0;
      this._applyBadgesZIndex();
    });
  }

  _applyBadgesZIndex() {
    const cfg = this._config || {};
    const effectiveFixed = !!cfg.fixed && !this._inPreview;

    if (!effectiveFixed) { this._resetBadgesZIndex(); return; }

    const el = this._findHaBadgesElement();
    if (!el) { this._resetBadgesZIndex(); return; }

    if (el !== this._badgesEl) {
      this._resetBadgesZIndex();
      this._badgesEl = el;
    }

    const kioskAdjustment = this._kioskMode ? 0 : 48;
    const badgesOffset = cfg.badges_fixed ? (cfg.badges_offset_pinned || 48) : (cfg.badges_offset_unpinned || 100);
    const topPosition = Math.max(0, (this._headerHeight || 0) - badgesOffset + (cfg.fixed_top || 0) + kioskAdjustment);

    if (cfg.badges_fixed) {
      el.style.cssText = `position:fixed;top:${topPosition}px;left:${this._offsetLeft}px;width:${this._contentWidth}px;z-index:2;`;
    } else {
      const kioskGapAdjustment = this._kioskMode ? 48 : 0;
      const effectiveGap = (cfg.badges_gap || 0) + kioskGapAdjustment;
      el.style.cssText = `position:relative;z-index:0;margin-bottom:${effectiveGap}px;`;
    }
  }

  _resetBadgesZIndex() {
    if (this._badgesEl) {
      try { this._badgesEl.style.cssText = ""; } catch (_) {}
      this._badgesEl = null;
    }
  }

  _findHaBadgesElement() {
    const selectors = "hui-badges, ha-badges, .badges, .header-badges";
    let node = this;
    for (let i = 0; i < 12; i++) {
      const root = node.getRootNode?.();
      if (!root || root === document) break;
      const host = root.host;
      if (!host) break;
      const sr = host.shadowRoot;
      const hit = sr?.querySelector?.(selectors) || host.querySelector?.(selectors);
      if (hit) return hit;
      node = host;
    }
    return null;
  }

  _parseServiceData(serviceData) {
    if (!serviceData) return {};
    if (typeof serviceData === "object") return serviceData;
    if (typeof serviceData !== "string") return {};

    const raw = serviceData.trim();
    if (!raw) return {};

    if (raw.startsWith("{") || raw.startsWith("[")) {
      try { const v = JSON.parse(raw); return v && typeof v === "object" ? v : {}; } catch (_) {}
    }

    try {
      const loader = window?.jsyaml?.load;
      if (typeof loader === "function") {
        const v = loader(raw);
        return v && typeof v === "object" ? v : {};
      }
    } catch (_) {}

    // Simple key: value parser
    const out = {};
    raw.split("\n").forEach((line) => {
      const t = line.trim();
      if (!t || t.startsWith("#")) return;
      const idx = t.indexOf(":");
      if (idx <= 0) return;
      const k = t.slice(0, idx).trim();
      let v = t.slice(idx + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      out[k] = v;
    });
    return out;
  }

  // Build a flat object of all popup fields from a merged popup config to spread into btn.setConfig()
  _buildPopupConfig(p, resolvedName, resolvedState, resolvedIcon = '') {
    const cfg = {};
    const _copyTruthy = (keys) => {
      keys.forEach((k) => {
        if (p[k]) cfg[k] = p[k];
      });
    };
    if (resolvedName) cfg.name = resolvedName;
    if (resolvedState) cfg.state_label = resolvedState;
    copyDefinedKeys({
      src: p,
      dst: cfg,
      keys: [
        "popup_border_radius",
        "popup_width",
        "popup_width_custom",
        "popup_height",
        "popup_height_custom",
        "popup_animation_duration",
        "popup_blur_enabled",
        "popup_blur_amount",
        "popup_card_blur_enabled",
        "popup_card_blur_amount",
        "popup_card_opacity",
        "popup_show_favorites",
        "popup_show_effects",
        "popup_show_presets",
        "popup_slider_radius",
        "popup_hide_button_text",
        "popup_value_font_size",
        "popup_value_font_weight",
        "popup_label_font_size",
        "popup_label_font_weight",
        "popup_highlight_radius",
        "popup_highlight_opacity",
        "popup_button_radius",
        "popup_button_opacity",
        "climate_temp_step",
        "climate_use_circular_slider",
        "climate_show_plus_minus",
        "climate_show_gradient",
        "climate_show_target_range",
        "humidifier_humidity_step",
        "humidifier_use_circular_slider",
        "humidifier_show_plus_minus",
        "humidifier_show_gradient",
        "sensor_graph_gradient",
        "sensor_line_width",
        "sensor_hours",
        "popup_bottom_bar_entities",
        "popup_bottom_bar_align",
        "popup_hide_bottom_bar",
        "_bb_slots",
      ],
    });
    _copyTruthy([
      "popup_open_animation",
      "popup_close_animation",
      "popup_time_format",
      "popup_default_view",
      "popup_default_section",
      "popup_highlight_color",
      "popup_highlight_text_color",
      "popup_highlight_border_color",
      "popup_highlight_border_style",
      "popup_highlight_border_width",
      "popup_highlight_box_shadow",
      "popup_button_bg",
      "popup_button_text_color",
      "popup_button_border_color",
      "popup_button_border_style",
      "popup_button_border_width",
      "climate_humidity_entity",
      "climate_humidity_name",
      "climate_pressure_entity",
      "climate_pressure_name",
      "climate_current_temperature_entity",
      "climate_temperature_name",
      "humidifier_fan_entity",
      "person_geocoded_entity",
      "sensor_graph_color",
      "sensor_graph_style",
    ]);
    // Icon & entity picture
    if (resolvedIcon) cfg.icon = resolvedIcon;
    if (p.popup_use_entity_picture !== undefined) cfg.use_entity_picture = p.popup_use_entity_picture;
    return cfg;
  }

  _handleAction(action, entityId = null, popupConfig = null) {
    if (!action || action.action === "none" || !this.hass) return;

    // If entityId is provided and action doesn't have entity, add it
    // For perform-action, add entity to target if not present
    let finalAction = action;
    if (entityId && !action.entity) {
      finalAction = { ...action, entity: entityId };
    }
    if (entityId && action.action === "perform-action" && (!action.target || !action.target.entity_id)) {
      const existingTarget = action.target || {};
      finalAction = { ...finalAction, target: { ...existingTarget, entity_id: entityId } };
    }

    switch (finalAction.action) {
      case "navigate":
        if (finalAction.navigation_path) {
           if (finalAction.navigation_path === "back") {
             history.back();
           } else {
             history.pushState(null, "", finalAction.navigation_path);
             window.dispatchEvent(new CustomEvent("location-changed", { bubbles: true, composed: true, detail: { replace: false } }));
           }
        }
        break;
      case "back":
        history.back();
        break;
      case "menu":
        this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }));
        break;
      case "url":
        if (finalAction.url_path) window.open(finalAction.url_path, "_blank");
        break;
      case "perform-action":
        if (finalAction.perform_action) {
          const [domain, service] = finalAction.perform_action.split(".");
          if (domain && service) {
            const serviceData = finalAction.data || {};
            const target = finalAction.target || {};
            this.hass.callService(domain, service, serviceData, target);
          }
        }
        break;
      case "call-service":
        // Legacy support for old call-service action
        if (finalAction.service) {
          const [domain, service] = finalAction.service.split(".");
          if (domain && service) this.hass.callService(domain, service, this._parseServiceData(finalAction.service_data));
        }
        break;
      case "more-info": {
        const entity = finalAction.entity;
        if (entity) this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles: true, composed: true, detail: { entityId: entity } }));
        break;
      }
      case "hki-more-info": {
        // Slot-level popupConfig takes precedence over action-level (backward-compat) settings
        const mergedPopup = { ...finalAction, ...(popupConfig || {}) };
        // custom_popup_enabled gates the custom card; undefined = true for backward compat
        const popupCard = mergedPopup.custom_popup_enabled === false
          ? null
          : mergedPopup.custom_popup_card;
        const resolveTemplate = async (str) => {
          if (!str) return str;
          if (!(str.includes('{{') || str.includes('{%'))) return str;
          try {
            const res = await this.hass.callWS({
              type: 'render_template',
              template: str,
              variables: { config: this._config ?? {}, user: this.hass?.user?.name || '' },
              strict: false,
            });
            return res?.result != null ? String(res.result) : str;
          } catch (_) { return str; }
        };
        if (popupCard && customElements.get('hki-button-card')) {
          // Custom popup card configured — open it inside the HKI popup frame
          Promise.all([
            resolveTemplate(mergedPopup.popup_name),
            resolveTemplate(mergedPopup.popup_state),
            resolveTemplate(mergedPopup.popup_icon),
          ]).then(([resolvedName, resolvedState, resolvedIcon]) => {
            try {
              const btn = document.createElement('hki-button-card');
              btn.hass = this.hass;
              btn.setConfig({
                type: 'custom:hki-button-card',
                custom_popup: { enabled: true, card: popupCard },
                ...this._buildPopupConfig(mergedPopup, resolvedName, resolvedState, resolvedIcon),
              });
              btn._openPopup();
            } catch (err) {
              console.error('[hki-header-card] Failed to open popup:', err);
            }
          }).catch(err => console.error('[hki-header-card] Popup promise error:', err));
        } else {
          // No custom popup card — open the domain-appropriate HKI popup for the entity
          const popupEntityId = finalAction.entity || entityId;
          if (popupEntityId && customElements.get('hki-button-card')) {
            Promise.all([
              resolveTemplate(mergedPopup.popup_name),
              resolveTemplate(mergedPopup.popup_state),
              resolveTemplate(mergedPopup.popup_icon),
            ]).then(([resolvedName, resolvedState, resolvedIcon]) => {
              try {
                const btn = document.createElement('hki-button-card');
                btn.hass = this.hass;
                btn.setConfig({
                  type: 'custom:hki-button-card',
                  entity: popupEntityId,
                  ...this._buildPopupConfig(mergedPopup, resolvedName, resolvedState, resolvedIcon),
                });
                btn._openPopup();
              } catch (err) {
                console.error('[hki-header-card] Failed to open domain popup:', err);
              }
            }).catch(err => console.error('[hki-header-card] Popup promise error:', err));
          }
        }
        break;
      }
      case "toggle": {
        const toggleEntity = finalAction.entity;
        if (toggleEntity) this.hass.callService("homeassistant", "toggle", { entity_id: toggleEntity });
        break;
      }
      case "fire-dom-event": {
        // Fire a custom DOM event with all properties except 'action'
        const eventDetail = {};
        Object.keys(finalAction).forEach(key => {
          if (key !== 'action') {
            eventDetail[key] = finalAction[key];
          }
        });
        this.dispatchEvent(new CustomEvent("ll-custom", { 
          bubbles: true, 
          composed: true, 
          detail: eventDetail 
        }));
        break;
      }
    }
  }

  async _updateCustomCards() {
    if (!window.loadCardHelpers) return;
    
    const slots = [
      { key: 'left', bar: 'top_bar' },
      { key: 'center', bar: 'top_bar' },
      { key: 'right', bar: 'top_bar' },
      { key: 'left', bar: 'bottom_bar', cacheId: 'bottom_left' },
      { key: 'center', bar: 'bottom_bar', cacheId: 'bottom_center' },
      { key: 'right', bar: 'bottom_bar', cacheId: 'bottom_right' },
    ];
    let helpersLoaded = null;
    let needsUpdate = false;
    
    for (const slotDef of slots) {
        const slot = typeof slotDef === 'string' ? slotDef : slotDef.key;
        const bar = typeof slotDef === 'string' ? 'top_bar' : slotDef.bar;
        const cardId = (slotDef.cacheId) ? slotDef.cacheId : slot;
        const type = this._config[`${bar}_${slot}`];
        const cardConfigKey = `${bar}_${slot}_card`;
        const cardConfig = this._config[cardConfigKey];
        
        // Generate a simple hash to detect config changes
        const isCardSlot = type === 'notifications' || type === 'custom' || type === 'card';
        const configHash = isCardSlot ? JSON.stringify(cardConfig || {}) : '';
        const cacheKey = `_customCardHash_${cardId}`;
        
        if (isCardSlot) {
            // Only recreate if config has changed
            if (this[cacheKey] !== configHash || !this._customCards[slot]) {
                if (!helpersLoaded) helpersLoaded = await window.loadCardHelpers();
                
                // notifications type injects header-styling helpers; card type is bare
                let finalConfig;
                if (type === 'card') {
                    finalConfig = { ...(cardConfig || {}) };
                } else {
                    finalConfig = { 
                        use_header_styling: true, 
                        show_background: false,
                        show_empty: true,
                        ...(cardConfig || { type: "custom:hki-notification-card" })
                    };
                }

                try {
                    const element = await helpersLoaded.createCardElement(finalConfig);
                    if (this.hass) element.hass = this.hass;
                    element.style.display = "block";
                    this._customCards[cardId] = element;
                    this[cacheKey] = configHash;
                    needsUpdate = true;
                } catch (e) {
                    console.error(`Failed to create custom card for ${slot}`, e);
                }
            }
        } else if (this._customCards[cardId]) {
            this._customCards[cardId] = null;
            this[cacheKey] = '';
            needsUpdate = true;
        }
    }
    
    if (needsUpdate) this.requestUpdate();
  }

  _getSlotStyle(slotName, bar = "top_bar") {
    const cfg = this._config;
    const prefix = `${bar}_${slotName}_`;

    // Pick the right set of global defaults depending on which bar this slot belongs to
    const gp = bar === "bottom_bar" ? "bottom_info_" : "info_";
    
    // Generate cache key based on relevant config values
    const cacheKey = `${bar}:${slotName}:${cfg[prefix + "use_global"]}:${cfg[prefix + "size_px"]}:${cfg[prefix + "weight"]}:${cfg[prefix + "color"]}:${cfg[prefix + "pill"]}:${cfg[gp + "size_px"]}:${cfg[gp + "weight"]}:${cfg[gp + "color"]}:${cfg[gp + "pill"]}:${cfg.font_family}:${cfg.font_style}`;
    
    const cached = this._slotStyleCache.get(cacheKey);
    if (cached) return cached;
    
    const useGlobal = cfg[prefix + "use_global"] !== false;
    
    const fontFamily = this._resolveFontFamily();
    
    // Get values, preferring per-slot if not using global, otherwise use bar-specific global
    const sizePx = (!useGlobal && cfg[prefix + "size_px"] != null) ? cfg[prefix + "size_px"] : cfg[gp + "size_px"];
    const weight = (!useGlobal && cfg[prefix + "weight"] != null) ? cfg[prefix + "weight"] : cfg[gp + "weight"];
    const color = (!useGlobal && cfg[prefix + "color"]) ? cfg[prefix + "color"] : (cfg[gp + "color"]?.trim() || "var(--hki-header-text-color, #fff)");
    const iconSize = Math.round(sizePx * 2);
    
    const pill = (!useGlobal && cfg[prefix + "pill"] != null) ? cfg[prefix + "pill"] : cfg[gp + "pill"];
    const pillBg = (!useGlobal && cfg[prefix + "pill_background"]) ? cfg[prefix + "pill_background"] : cfg[gp + "pill_background"];
    const pillPaddingX = (!useGlobal && cfg[prefix + "pill_padding_x"] != null) ? cfg[prefix + "pill_padding_x"] : cfg[gp + "pill_padding_x"];
    const pillPaddingY = (!useGlobal && cfg[prefix + "pill_padding_y"] != null) ? cfg[prefix + "pill_padding_y"] : cfg[gp + "pill_padding_y"];
    const pillRadius = (!useGlobal && cfg[prefix + "pill_radius"] != null) ? cfg[prefix + "pill_radius"] : cfg[gp + "pill_radius"];
    const pillBlur = (!useGlobal && cfg[prefix + "pill_blur"] != null) ? cfg[prefix + "pill_blur"] : cfg[gp + "pill_blur"];
    const pillBorderStyle = (!useGlobal && cfg[prefix + "pill_border_style"]) ? cfg[prefix + "pill_border_style"] : cfg[gp + "pill_border_style"];
    const pillBorderWidth = (!useGlobal && cfg[prefix + "pill_border_width"] != null) ? cfg[prefix + "pill_border_width"] : cfg[gp + "pill_border_width"];
    const pillBorderColor = (!useGlobal && cfg[prefix + "pill_border_color"]) ? cfg[prefix + "pill_border_color"] : cfg[gp + "pill_border_color"];
    
    const weightValue = this._resolveWeightValue(weight);
    const fontStyleValue = cfg.font_style || "normal";
    
    const inlineStyle = `font-family:${fontFamily};font-style:${fontStyleValue};font-size:${sizePx}px;font-weight:${weightValue};color:${color};`;
    
    const pillStyle = pill ? `--hki-info-pill-background:${pillBg};--hki-info-pill-padding-x:${pillPaddingX}px;--hki-info-pill-padding-y:${pillPaddingY}px;--hki-info-pill-radius:${pillRadius}px;--hki-info-pill-blur:${pillBlur}px;--hki-info-pill-border-style:${pillBorderStyle};--hki-info-pill-border-width:${pillBorderWidth}px;--hki-info-pill-border-color:${pillBorderColor}` : "";
    
    // CSS variables for notification card
    const notifyVars = `--hki-notify-font-size:${sizePx}px;--hki-notify-font-weight:${weightValue};--hki-notify-color:${color};--hki-notify-icon-size:${iconSize}px;--hki-notify-font-family:${fontFamily};--hki-notify-font-style:${fontStyleValue};--hki-notify-pill-enabled:${pill ? '1' : '0'};--hki-notify-pill-bg:${pillBg};--hki-notify-pill-padding-x:${pillPaddingX}px;--hki-notify-pill-padding-y:${pillPaddingY}px;--hki-notify-pill-radius:${pillRadius}px;--hki-notify-pill-blur:${pillBlur}px;--hki-notify-pill-border-style:${pillBorderStyle};--hki-notify-pill-border-width:${pillBorderWidth}px;--hki-notify-pill-border-color:${pillBorderColor}`;
    
    const result = { 
      inlineStyle, 
      pillStyle, 
      notifyVars, 
      iconSize, 
      pill, 
      sizePx, 
      color,
      pillBg,
      pillPaddingX,
      pillPaddingY,
      pillRadius,
      pillBlur,
      pillBorderStyle,
      pillBorderWidth,
      pillBorderColor
    };
    
    // Cache the result (limit cache size)
    if (this._slotStyleCache.size > 20) this._slotStyleCache.clear();
    this._slotStyleCache.set(cacheKey, result);
    
    return result;
  }

  _renderSlotContent(type, slotName, cardId = null, bar = "top_bar", stretch = false) {
      const cfg = this._config;
      const slotStyle = this._getSlotStyle(slotName, bar);
      // Unique key to persist hold/click state across re-renders for this slot
      const stateKey = cardId || slotName;
      
      switch (type) {
          case "weather": return this._renderWeatherSlot(slotName, slotStyle, stateKey, bar);
          case "datetime": return this._renderDatetimeSlot(slotName, slotStyle, stateKey, bar);
          case "notifications":
          case "custom":
          case "card": return this._renderCustomCardSlot(slotName, slotStyle, cardId, type, stretch);
          case "spacer": return this._renderSpacerSlot(slotName, stateKey, bar);
          case "button": return this._renderButtonSlot(slotName, slotStyle, stateKey, bar);
          default: return html``;
      }
  }

  _renderSpacerSlot(slotName, stateKey, bar = "top_bar") {
    const cfg = this._config;
    const prefix = `${bar}_${slotName}_`;
    const tapAction = cfg[prefix + "tap_action"] || { action: "none" };
    const holdAction = cfg[prefix + "hold_action"] || { action: "none" };
    const doubleTapAction = cfg[prefix + "double_tap_action"] || { action: "none" };
    const slotPopupConfig = this._getSlotPopupConfig(prefix);

    const hasAnyAction = tapAction.action !== "none" || holdAction.action !== "none" || doubleTapAction.action !== "none";
    if (!hasAnyAction) return html`<div class="slot-spacer"></div>`;

    if (!this._slotHoldState) this._slotHoldState = {};
    if (!this._slotHoldState[stateKey]) this._slotHoldState[stateKey] = { holdTimer: null, holdActive: false, clickTimer: null, clickCount: 0, touchHandled: false };
    const state = this._slotHoldState[stateKey];

    const startHold = () => {
      state.holdActive = false;
      state.holdTimer = setTimeout(() => {
        state.holdActive = true;
        if (holdAction.action !== "none") this._handleSlotTapAction(holdAction, slotName, null, slotPopupConfig);
      }, 500);
    };
    const endHold = () => {
      if (state.holdTimer) { clearTimeout(state.holdTimer); state.holdTimer = null; }
      if (!state.holdActive) {
        state.clickCount++;
        if (state.clickCount === 1) {
          state.clickTimer = setTimeout(() => {
            if (state.clickCount === 1) this._handleSlotTapAction(tapAction, slotName, null, slotPopupConfig);
            state.clickCount = 0;
          }, 250);
        } else if (state.clickCount === 2) {
          clearTimeout(state.clickTimer);
          state.clickCount = 0;
          this._handleSlotTapAction(doubleTapAction, slotName, null, slotPopupConfig);
        }
      }
      state.holdActive = false;
    };
    const cancelHold = () => {
      if (state.holdTimer) { clearTimeout(state.holdTimer); state.holdTimer = null; }
      state.holdActive = false;
    };

    const handleTouchStart = () => { state.touchHandled = true; startHold(); };
    const handleTouchEnd = () => { endHold(); setTimeout(() => { state.touchHandled = false; }, 500); };
    const handleMouseDown = () => { if (state.touchHandled) return; startHold(); };
    const handleMouseUp = () => { if (state.touchHandled) return; endHold(); };
    const handleMouseLeave = () => { if (!state.touchHandled) cancelHold(); };

    return html`
      <div class="slot-spacer"
        @mousedown=${handleMouseDown}
        @mouseup=${handleMouseUp}
        @mouseleave=${handleMouseLeave}
        @touchstart=${handleTouchStart}
        @touchend=${handleTouchEnd}
        @contextmenu=${(e) => e.preventDefault()}
        style="cursor:pointer;"
      ></div>
    `;
  }

  _renderButtonSlot(slotName, slotStyle, stateKey, bar = "top_bar") {
    const cfg = this._config;
    const prefix = `${bar}_${slotName}_`;
    const icon = cfg[prefix + "icon"] || "mdi:gesture-tap";
    const label = cfg[prefix + "label"] || "";
    const tapAction = cfg[prefix + "tap_action"] || { action: "none" };
    const holdAction = cfg[prefix + "hold_action"] || { action: "none" };
    const doubleTapAction = cfg[prefix + "double_tap_action"] || { action: "none" };
    const slotPopupConfig = this._getSlotPopupConfig(prefix);
    
    const pillClass = slotStyle.pill ? "info-pill" : "";
    
    // Button always uses 5px padding (always has icon)
    const buttonPaddingY = slotStyle.pill ? 5 : slotStyle.pillPaddingY;
    const buttonPillStyle = slotStyle.pill ? `--hki-info-pill-background:${slotStyle.pillBg};--hki-info-pill-padding-x:${slotStyle.pillPaddingX}px;--hki-info-pill-padding-y:${buttonPaddingY}px;--hki-info-pill-radius:${slotStyle.pillRadius}px;--hki-info-pill-blur:${slotStyle.pillBlur}px;--hki-info-pill-border-style:${slotStyle.pillBorderStyle};--hki-info-pill-border-width:${slotStyle.pillBorderWidth}px;--hki-info-pill-border-color:${slotStyle.pillBorderColor}` : "";
    const combinedStyle = `${slotStyle.inlineStyle} ${buttonPillStyle}`;
    
    // Hold/click state lives on the instance (keyed by slot) so it survives re-renders
    // triggered by the 1-second datetime tick, which would otherwise reset local closure vars.
    if (!this._slotHoldState) this._slotHoldState = {};
    if (!this._slotHoldState[stateKey]) this._slotHoldState[stateKey] = { holdTimer: null, holdActive: false, clickTimer: null, clickCount: 0, touchHandled: false };
    const state = this._slotHoldState[stateKey];

    const startHold = () => {
      state.holdActive = false;
      // Always set timer so a long-press is recognized even when holdAction is "none"
      state.holdTimer = setTimeout(() => {
        state.holdActive = true;
        if (holdAction && holdAction.action !== "none") {
          this._handleSlotTapAction(holdAction, slotName, null, slotPopupConfig);
        }
      }, 500);
    };

    const endHold = () => {
      if (state.holdTimer) {
        clearTimeout(state.holdTimer);
        state.holdTimer = null;
      }
      if (!state.holdActive) {
        // Use click debouncing for double-tap detection
        state.clickCount++;
        if (state.clickCount === 1) {
          state.clickTimer = setTimeout(() => {
            if (state.clickCount === 1) {
              this._handleSlotTapAction(tapAction, slotName, null, slotPopupConfig);
            }
            state.clickCount = 0;
          }, 250);
        } else if (state.clickCount === 2) {
          clearTimeout(state.clickTimer);
          state.clickCount = 0;
          this._handleSlotTapAction(doubleTapAction, slotName, null, slotPopupConfig);
        }
      }
      state.holdActive = false;
    };

    const cancelHold = () => {
      if (state.holdTimer) {
        clearTimeout(state.holdTimer);
        state.holdTimer = null;
      }
      state.holdActive = false;
    };
    
    const handleTouchStart = () => { state.touchHandled = true; startHold(); };
    const handleTouchEnd = () => { endHold(); setTimeout(() => { state.touchHandled = false; }, 500); };
    const handleMouseDown = () => { if (state.touchHandled) return; startHold(); };
    const handleMouseUp = () => { if (state.touchHandled) return; endHold(); };
    const handleMouseLeave = () => { if (!state.touchHandled) cancelHold(); };
    
    return html`
      <div 
        class="info-item ${pillClass}" 
        style="${combinedStyle}"
        @mousedown=${handleMouseDown}
        @mouseup=${handleMouseUp}
        @mouseleave=${handleMouseLeave}
        @touchstart=${handleTouchStart}
        @touchend=${handleTouchEnd}
        @contextmenu=${(e) => e.preventDefault()}
      >
        <div class="info-icon" style="width:${slotStyle.iconSize}px;height:${slotStyle.iconSize}px;"><ha-icon .icon=${icon} style="width:100%;height:100%;--mdc-icon-size:${slotStyle.iconSize}px;"></ha-icon></div>
        ${label ? html`<span>${label}</span>` : ''}
      </div>
    `;
  }

  // Build a slot-level popup config object from flat config using the slot prefix
  _getSlotPopupConfig(prefix) {
    const cfg = this._config;
    const pc = {};
    copyDefinedKeys({
      src: cfg,
      dst: pc,
      keys: HKI_POPUP_CONFIG_KEYS,
      srcPrefix: prefix,
    });
    return Object.keys(pc).length ? pc : null;
  }

  _handleSlotTapAction(action, slotName, entityId = null, popupConfig = null) {
    if (!action || action.action === "none") return;
    this._handleAction(action, entityId, popupConfig);
  }

  _renderWeatherSlot(slotName, slotStyle, stateKey, bar = "top_bar") {
    const cfg = this._config;
    const prefix = `${bar}_${slotName}_`;
    const slotPopupConfig = this._getSlotPopupConfig(prefix);
    
    // Fallback to global if local is not set
    const entityId = cfg[prefix + "weather_entity"] || cfg.weather_entity;
    
    if (!entityId || !this.hass) return html``;

    const weatherEntity = this.hass.states[entityId];
    if (!weatherEntity) return html``;

    const state = weatherEntity.state;
    const attrs = weatherEntity.attributes || {};

    const weatherIcon = WEATHER_ICON_MAP[state] || "mdi:weather-cloudy";
    
    // Translate condition state
    let conditionText = state;
    if (this.hass.formatEntityState) {
        conditionText = this.hass.formatEntityState(weatherEntity);
    } else {
        conditionText = (attrs.friendly_name || state).replace(/-/g, " ");
    }
    
    const temperature = attrs.temperature;
    const humidity = attrs.humidity;
    const wind = attrs.wind_speed;
    const pressure = attrs.pressure;
    const unit = this.hass.config?.unit_system?.temperature || "°C";

    // Check for slot specific overrides, fallback to global
    const showIcon = cfg[prefix + "show_icon"] !== undefined ? cfg[prefix + "show_icon"] : (cfg.weather_show_icon !== false);
    const showCondition = cfg[prefix + "show_condition"] !== undefined ? cfg[prefix + "show_condition"] : (cfg.weather_show_condition !== false);
    const showTemp = cfg[prefix + "show_temperature"] !== undefined ? cfg[prefix + "show_temperature"] : (cfg.weather_show_temperature !== false);
    const showHum = cfg[prefix + "show_humidity"] !== undefined ? cfg[prefix + "show_humidity"] : !!cfg.weather_show_humidity;
    const showWind = cfg[prefix + "show_wind"] !== undefined ? cfg[prefix + "show_wind"] : !!cfg.weather_show_wind;
    const showPressure = cfg[prefix + "show_pressure"] !== undefined ? cfg[prefix + "show_pressure"] : !!cfg.weather_show_pressure;

    const iconColor = this._resolveWeatherIconColor(cfg, state, prefix);
    
    const animateIcon = cfg[prefix + "animate_icon"] || cfg.weather_animate_icon;
    const animClass = animateIcon && animateIcon !== "none" ? `animate-${animateIcon}` : "";

    const iconPack = cfg[prefix + "icon_pack_path"] || cfg.weather_icon_pack_path;
    const useSvg = !!iconPack;
    const svgUrl = useSvg ? `${iconPack}/${state}.svg` : "";

    const pillClass = slotStyle.pill ? "info-pill" : "";
    
    // Adjust padding for weather pill to maintain consistent height:
    // - With icon: 5px (to match notification card with icon)
    // - Without icon: 11px (compensates for missing icon height to match pill with icon)
    const weatherPaddingY = slotStyle.pill ? (showIcon ? 5 : 11) : slotStyle.pillPaddingY;
    const weatherPillStyle = slotStyle.pill ? `--hki-info-pill-background:${slotStyle.pillBg};--hki-info-pill-padding-x:${slotStyle.pillPaddingX}px;--hki-info-pill-padding-y:${weatherPaddingY}px;--hki-info-pill-radius:${slotStyle.pillRadius}px;--hki-info-pill-blur:${slotStyle.pillBlur}px;--hki-info-pill-border-style:${slotStyle.pillBorderStyle};--hki-info-pill-border-width:${slotStyle.pillBorderWidth}px;--hki-info-pill-border-color:${slotStyle.pillBorderColor}` : "";
    const combinedStyle = `${slotStyle.inlineStyle} ${weatherPillStyle}`;
    
    const tapAction = cfg[prefix + "tap_action"] || cfg.info_tap_action || { action: "none" };
    const holdAction = cfg[prefix + "hold_action"] || { action: "none" };
    const doubleTapAction = cfg[prefix + "double_tap_action"] || { action: "none" };

    // Hold state lives on the instance (keyed by slot) so it survives re-renders
    if (!this._slotHoldState) this._slotHoldState = {};
    if (!this._slotHoldState[stateKey]) this._slotHoldState[stateKey] = { holdTimer: null, holdActive: false, clickTimer: null, clickCount: 0, touchHandled: false };
    const holdState = this._slotHoldState[stateKey];

    const startHold = () => {
      holdState.holdActive = false;
      // Always set timer so a long-press is recognized even when holdAction is "none"
      holdState.holdTimer = setTimeout(() => {
        holdState.holdActive = true;
        if (holdAction && holdAction.action !== "none") {
          this._handleSlotTapAction(holdAction, slotName, entityId, slotPopupConfig);
        }
      }, 500);
    };

    const endHold = () => {
      if (holdState.holdTimer) {
        clearTimeout(holdState.holdTimer);
        holdState.holdTimer = null;
      }
      if (!holdState.holdActive) {
        holdState.clickCount++;
        if (holdState.clickCount === 1) {
          holdState.clickTimer = setTimeout(() => {
            if (holdState.clickCount === 1) {
              this._handleSlotTapAction(tapAction, slotName, entityId, slotPopupConfig);
            }
            holdState.clickCount = 0;
          }, 250);
        } else if (holdState.clickCount === 2) {
          clearTimeout(holdState.clickTimer);
          holdState.clickCount = 0;
          this._handleSlotTapAction(doubleTapAction, slotName, entityId, slotPopupConfig);
        }
      }
      holdState.holdActive = false;
    };

    const cancelHold = () => {
      if (holdState.holdTimer) {
        clearTimeout(holdState.holdTimer);
        holdState.holdTimer = null;
      }
      holdState.holdActive = false;
    };

    const handleTouchStart = () => { holdState.touchHandled = true; startHold(); };
    const handleTouchEnd = () => { endHold(); setTimeout(() => { holdState.touchHandled = false; }, 500); };
    const handleMouseDown = () => { if (holdState.touchHandled) return; startHold(); };
    const handleMouseUp = () => { if (holdState.touchHandled) return; endHold(); };
    const handleMouseLeave = () => { if (!holdState.touchHandled) cancelHold(); };

    return html`
      <div 
        class="info-item ${pillClass}" 
        style="${combinedStyle}"
        @mousedown=${handleMouseDown}
        @mouseup=${handleMouseUp}
        @mouseleave=${handleMouseLeave}
        @touchstart=${handleTouchStart}
        @touchend=${handleTouchEnd}
        @contextmenu=${(e) => e.preventDefault()}
      >
        ${showIcon ? (useSvg 
            ? html`<img src="${svgUrl}" class="info-icon ${animClass}" style="width:${slotStyle.iconSize}px;height:${slotStyle.iconSize}px;" alt="${state}" />`
            : html`<div class="info-icon" style="width:${slotStyle.iconSize}px;height:${slotStyle.iconSize}px;"><ha-icon class="${animClass}" .icon=${weatherIcon}
                   style="width:100%;height:100%;--mdc-icon-size:${slotStyle.iconSize}px;color:${iconColor};"></ha-icon></div>`)
        : ""}
        ${showCondition ? html`<span class="info-condition">${conditionText}</span>` : ""}
        ${showTemp && temperature != null ? html`<span class="info-temperature">${Math.round(temperature)}${unit}</span>` : ""}
        ${showHum && humidity != null ? html`<span class="info-humidity">${humidity}%</span>` : ""}
        ${showWind && wind != null ? html`<span class="info-wind">${wind} ${attrs.wind_speed_unit || "km/h"}</span>` : ""}
        ${showPressure && pressure != null ? html`<span class="info-pressure">${pressure} ${attrs.pressure_unit || "hPa"}</span>` : ""}
      </div>
    `;
  }

  _renderDatetimeSlot(slotName, slotStyle, stateKey, bar = "top_bar") {
    const cfg = this._config;
    const prefix = `${bar}_${slotName}_`;
    const slotPopupConfig = this._getSlotPopupConfig(prefix);
    const locale = this.hass?.language || 'en';
    
    const now = new Date(this._currentTime);
    const parts = [];

    // Fallback to global defaults if local not set
    const showDay = cfg[prefix + "show_day"] !== undefined ? cfg[prefix + "show_day"] : (cfg.datetime_show_day !== false);
    const showDate = cfg[prefix + "show_date"] !== undefined ? cfg[prefix + "show_date"] : (cfg.datetime_show_date !== false);
    const showTime = cfg[prefix + "show_time"] !== undefined ? cfg[prefix + "show_time"] : (cfg.datetime_show_time !== false);
    
    const dateFormat = cfg[prefix + "date_format"] || cfg.datetime_date_format || "D MMM";
    const timeFormat = cfg[prefix + "time_format"] || cfg.datetime_time_format || "HH:mm";
    const sep = cfg[prefix + "separator"] || cfg.datetime_separator || " • ";
    const icon = cfg[prefix + "icon"] || cfg.datetime_icon;

    if (showDay) parts.push(formatDateTime(now, "DDDD", locale));
    if (showDate) parts.push(formatDateTime(now, dateFormat, locale));
    if (showTime) parts.push(formatDateTime(now, timeFormat, locale));

    const displayText = parts.join(sep);

    const pillClass = slotStyle.pill ? "info-pill" : "";
    
    // Adjust padding for datetime pill to maintain consistent height:
    // - With icon: 5px (to match notification card with icon)
    // - Without icon: 11px (compensates for missing icon height)
    const datetimePaddingY = slotStyle.pill ? (icon ? 5 : 11) : slotStyle.pillPaddingY;
    const datetimePillStyle = slotStyle.pill ? `--hki-info-pill-background:${slotStyle.pillBg};--hki-info-pill-padding-x:${slotStyle.pillPaddingX}px;--hki-info-pill-padding-y:${datetimePaddingY}px;--hki-info-pill-radius:${slotStyle.pillRadius}px;--hki-info-pill-blur:${slotStyle.pillBlur}px;--hki-info-pill-border-style:${slotStyle.pillBorderStyle};--hki-info-pill-border-width:${slotStyle.pillBorderWidth}px;--hki-info-pill-border-color:${slotStyle.pillBorderColor}` : "";
    const combinedStyle = `${slotStyle.inlineStyle} ${datetimePillStyle}`;
    
    const animateIcon = cfg[prefix + "animate_icon"] || cfg.datetime_animate_icon;
    const animClass = animateIcon && animateIcon !== "none" ? `animate-${animateIcon}` : "";
    
    const tapAction = cfg[prefix + "tap_action"] || cfg.info_tap_action || { action: "none" };
    const holdAction = cfg[prefix + "hold_action"] || { action: "none" };
    const doubleTapAction = cfg[prefix + "double_tap_action"] || { action: "none" };

    // Hold state lives on the instance (keyed by slot) so it survives re-renders
    if (!this._slotHoldState) this._slotHoldState = {};
    if (!this._slotHoldState[stateKey]) this._slotHoldState[stateKey] = { holdTimer: null, holdActive: false, clickTimer: null, clickCount: 0, touchHandled: false };
    const state = this._slotHoldState[stateKey];

    const startHold = () => {
      state.holdActive = false;
      // Always set timer so a long-press is recognized even when holdAction is "none"
      state.holdTimer = setTimeout(() => {
        state.holdActive = true;
        if (holdAction && holdAction.action !== "none") {
          this._handleSlotTapAction(holdAction, slotName, null, slotPopupConfig);
        }
      }, 500);
    };

    const endHold = () => {
      if (state.holdTimer) {
        clearTimeout(state.holdTimer);
        state.holdTimer = null;
      }
      if (!state.holdActive) {
        state.clickCount++;
        if (state.clickCount === 1) {
          state.clickTimer = setTimeout(() => {
            if (state.clickCount === 1) {
              this._handleSlotTapAction(tapAction, slotName, null, slotPopupConfig);
            }
            state.clickCount = 0;
          }, 250);
        } else if (state.clickCount === 2) {
          clearTimeout(state.clickTimer);
          state.clickCount = 0;
          this._handleSlotTapAction(doubleTapAction, slotName, null, slotPopupConfig);
        }
      }
      state.holdActive = false;
    };

    const cancelHold = () => {
      if (state.holdTimer) {
        clearTimeout(state.holdTimer);
        state.holdTimer = null;
      }
      state.holdActive = false;
    };

    const handleTouchStart = () => { state.touchHandled = true; startHold(); };
    const handleTouchEnd = () => { endHold(); setTimeout(() => { state.touchHandled = false; }, 500); };
    const handleMouseDown = () => { if (state.touchHandled) return; startHold(); };
    const handleMouseUp = () => { if (state.touchHandled) return; endHold(); };
    const handleMouseLeave = () => { if (!state.touchHandled) cancelHold(); };

    return html`
      <div 
        class="info-item ${pillClass}" 
        style="${combinedStyle}"
        @mousedown=${handleMouseDown}
        @mouseup=${handleMouseUp}
        @mouseleave=${handleMouseLeave}
        @touchstart=${handleTouchStart}
        @touchend=${handleTouchEnd}
        @contextmenu=${(e) => e.preventDefault()}
      >
        ${icon ? html`
          <div class="info-icon ${animClass}" style="width:${slotStyle.iconSize}px;height:${slotStyle.iconSize}px;"><ha-icon .icon=${icon}
                   style="width:100%;height:100%;--mdc-icon-size:${slotStyle.iconSize}px;"></ha-icon></div>
        ` : ""}
        <span>${displayText}</span>
      </div>
    `;
  }

  _renderCustomCardSlot(slotName, slotStyle, cardId = null, type = "notifications", stretch = false) {
    const cardEl = this._customCards[cardId || slotName];
    if (!cardEl) return html``;

    // Force the card element itself to fill the slot when stretching.
    // We set the style directly on the live DOM node so it takes effect regardless
    // of how the card internally sizes itself.
    if (stretch) {
      cardEl.style.width = '100%';
      cardEl.style.minWidth = '0';
      cardEl.style.boxSizing = 'border-box';
    } else {
      cardEl.style.width = '';
      cardEl.style.minWidth = '';
      cardEl.style.boxSizing = '';
    }

    // 'card' type is a bare arbitrary card — do not inject header global styling.
    // 'notifications'/'custom' are hki-notification-card which consume notifyVars via use_header_styling.
    const isNotificationSlot = type !== "card";

    // When stretch is active: switch from inline-flex (content-sized) to flex (fills parent),
    // and make the wrapper fill the full slot width.
    const stretchStyle = stretch ? `display:flex;width:100%;min-width:0;` : '';

    const combinedStyle = isNotificationSlot
      ? `${slotStyle.inlineStyle} ${slotStyle.notifyVars}; min-width: 50px; ${stretchStyle}${slotStyle.pill ? `overflow: hidden; border-radius: ${slotStyle.pillRadius}px;` : ''}`
      : `min-width: 50px; ${stretchStyle}`;

    return html`
      <div class="info-item" style="${combinedStyle}">
        ${cardEl}
      </div>
    `;
  }

  _renderTopBar() {
      if (!this._config.top_bar_enabled) return html``;

      const cfg = this._config;
      const offsetY = cfg.top_bar_offset_y !== undefined ? cfg.top_bar_offset_y : 10;
      const paddingX = cfg.top_bar_padding_x !== undefined ? cfg.top_bar_padding_x : 5;
      const topStyle = `top: ${offsetY}px; padding: 0 ${paddingX}px;`;
      
      const isMobile = this._viewportWidth > 0 && this._viewportWidth <= (cfg.mobile_breakpoint || 768);
      
      // Helper to calculate offset, preferring mobile override if valid number
      const getOffset = (base, mobile) => {
         if (isMobile && typeof mobile === 'number' && Number.isFinite(mobile)) return mobile;
         return base || 0;
      };

      const leftX = getOffset(cfg.top_bar_left_offset_x, cfg.top_bar_left_offset_x_mobile);
      const leftY = getOffset(cfg.top_bar_left_offset_y, cfg.top_bar_left_offset_y_mobile);
      
      const centerX = getOffset(cfg.top_bar_center_offset_x, cfg.top_bar_center_offset_x_mobile);
      const centerY = getOffset(cfg.top_bar_center_offset_y, cfg.top_bar_center_offset_y_mobile);
      
      const rightX = getOffset(cfg.top_bar_right_offset_x, cfg.top_bar_right_offset_x_mobile);
      const rightY = getOffset(cfg.top_bar_right_offset_y, cfg.top_bar_right_offset_y_mobile);
      
      const leftStyle = (leftX || leftY) ? `transform: translate(${leftX}px, ${leftY}px);` : "";
      const centerStyle = (centerX || centerY) ? `transform: translate(${centerX}px, ${centerY}px);` : "";
      const rightStyle = (rightX || rightY) ? `transform: translate(${rightX}px, ${rightY}px);` : "";
      
      // Determine which slots are occupied
      const leftEmpty = cfg.top_bar_left === "none";
      const centerEmpty = cfg.top_bar_center === "none";
      const rightEmpty = cfg.top_bar_right === "none";
      
      // Determine overflow
      const leftOverflow = !!cfg.top_bar_left_overflow;
      const centerOverflow = !!cfg.top_bar_center_overflow;
      const rightOverflow = !!cfg.top_bar_right_overflow;

      const leftAlign = cfg.top_bar_left_align || 'start';
      const centerAlign = cfg.top_bar_center_align || 'center';
      const rightAlign = cfg.top_bar_right_align || 'end';

      // ── Stretch: custom-card slots can absorb adjacent empty slots ──────────
      const CARD_TYPES = ['card', 'custom', 'notifications'];
      const calcStretchSpan = (slot, slotType) => {
        if (!CARD_TYPES.includes(slotType)) return 1;
        const align = cfg[`top_bar_${slot}_align`];
        if (align !== 'stretch') return 1;
        if (slot === 'left')   { let s = 1; if (centerEmpty) { s++; if (rightEmpty)  s++; } return s; }
        if (slot === 'right')  { let s = 1; if (centerEmpty) { s++; if (leftEmpty)   s++; } return s; }
        /* center */             let s = 1; if (leftEmpty) s++;   if (rightEmpty) s++;   return s;
      };
      const leftSpan   = calcStretchSpan('left',   cfg.top_bar_left);
      const centerSpan = calcStretchSpan('center', cfg.top_bar_center);
      const rightSpan  = calcStretchSpan('right',  cfg.top_bar_right);
      const leftStretch   = leftSpan   > 1 || (leftAlign   === 'stretch' && CARD_TYPES.includes(cfg.top_bar_left));
      const centerStretch = centerSpan > 1 || (centerAlign === 'stretch' && CARD_TYPES.includes(cfg.top_bar_center));
      const rightStretch  = rightSpan  > 1 || (rightAlign  === 'stretch' && CARD_TYPES.includes(cfg.top_bar_right));
      // Build per-slot flex-grow override (only when span > 1, i.e. absorbing neighbours)
      const leftFlexExtra   = leftSpan   > 1 ? `flex-grow:${leftSpan};`   : '';
      const centerFlexExtra = centerSpan > 1 ? `flex-grow:${centerSpan};` : '';
      const rightFlexExtra  = rightSpan  > 1 ? `flex-grow:${rightSpan};`  : '';

      return html`
        <div class="top-bar-container" style="${topStyle}">
            <div class="slot slot-left slot-align-${leftAlign} ${leftEmpty ? 'slot-empty' : ''} ${leftOverflow ? 'slot-visible' : ''}" style="${leftStyle}${leftFlexExtra}">${this._renderSlotContent(cfg.top_bar_left, "left", null, "top_bar", leftStretch)}</div>
            <div class="slot slot-center slot-align-${centerAlign} ${centerEmpty ? 'slot-empty' : ''} ${centerOverflow ? 'slot-visible' : ''}" style="${centerStyle}${centerFlexExtra}">${this._renderSlotContent(cfg.top_bar_center, "center", null, "top_bar", centerStretch)}</div>
            <div class="slot slot-right slot-align-${rightAlign} ${rightEmpty ? 'slot-empty' : ''} ${rightOverflow ? 'slot-visible' : ''}" style="${rightStyle}${rightFlexExtra}">${this._renderSlotContent(cfg.top_bar_right, "right", null, "top_bar", rightStretch)}</div>
        </div>
      `;
  }

  _renderBottomBar() {
      if (!this._config.bottom_bar_enabled) return html``;

      const cfg = this._config;
      const offsetY = cfg.bottom_bar_offset_y !== undefined ? cfg.bottom_bar_offset_y : 10;
      const paddingX = cfg.bottom_bar_padding_x !== undefined ? cfg.bottom_bar_padding_x : 5;
      const bottomStyle = `bottom: ${offsetY}px; padding: 0 ${paddingX}px;`;

      const isMobile = this._viewportWidth > 0 && this._viewportWidth <= (cfg.mobile_breakpoint || 768);
      const getOffset = (base, mobile) => {
         if (isMobile && typeof mobile === 'number' && Number.isFinite(mobile)) return mobile;
         return base || 0;
      };

      const leftX = getOffset(cfg.bottom_bar_left_offset_x, cfg.bottom_bar_left_offset_x_mobile);
      const leftY = getOffset(cfg.bottom_bar_left_offset_y, cfg.bottom_bar_left_offset_y_mobile);
      const centerX = getOffset(cfg.bottom_bar_center_offset_x, cfg.bottom_bar_center_offset_x_mobile);
      const centerY = getOffset(cfg.bottom_bar_center_offset_y, cfg.bottom_bar_center_offset_y_mobile);
      const rightX = getOffset(cfg.bottom_bar_right_offset_x, cfg.bottom_bar_right_offset_x_mobile);
      const rightY = getOffset(cfg.bottom_bar_right_offset_y, cfg.bottom_bar_right_offset_y_mobile);

      const leftStyle = (leftX || leftY) ? `transform: translate(${leftX}px, ${leftY}px);` : "";
      const centerStyle = (centerX || centerY) ? `transform: translate(${centerX}px, ${centerY}px);` : "";
      const rightStyle = (rightX || rightY) ? `transform: translate(${rightX}px, ${rightY}px);` : "";

      const leftEmpty = cfg.bottom_bar_left === "none";
      const centerEmpty = cfg.bottom_bar_center === "none";
      const rightEmpty = cfg.bottom_bar_right === "none";

      const leftOverflow = !!cfg.bottom_bar_left_overflow;
      const centerOverflow = !!cfg.bottom_bar_center_overflow;
      const rightOverflow = !!cfg.bottom_bar_right_overflow;

      const leftAlign = cfg.bottom_bar_left_align || 'start';
      const centerAlign = cfg.bottom_bar_center_align || 'center';
      const rightAlign = cfg.bottom_bar_right_align || 'end';

      // ── Stretch: custom-card slots can absorb adjacent empty slots ──────────
      const CARD_TYPES = ['card', 'custom', 'notifications'];
      const calcStretchSpan = (slot, slotType) => {
        if (!CARD_TYPES.includes(slotType)) return 1;
        const align = cfg[`bottom_bar_${slot}_align`];
        if (align !== 'stretch') return 1;
        if (slot === 'left')   { let s = 1; if (centerEmpty) { s++; if (rightEmpty)  s++; } return s; }
        if (slot === 'right')  { let s = 1; if (centerEmpty) { s++; if (leftEmpty)   s++; } return s; }
        /* center */             let s = 1; if (leftEmpty) s++;   if (rightEmpty) s++;   return s;
      };
      const leftSpan   = calcStretchSpan('left',   cfg.bottom_bar_left);
      const centerSpan = calcStretchSpan('center', cfg.bottom_bar_center);
      const rightSpan  = calcStretchSpan('right',  cfg.bottom_bar_right);
      const leftStretch   = leftSpan   > 1 || (leftAlign   === 'stretch' && CARD_TYPES.includes(cfg.bottom_bar_left));
      const centerStretch = centerSpan > 1 || (centerAlign === 'stretch' && CARD_TYPES.includes(cfg.bottom_bar_center));
      const rightStretch  = rightSpan  > 1 || (rightAlign  === 'stretch' && CARD_TYPES.includes(cfg.bottom_bar_right));
      const leftFlexExtra   = leftSpan   > 1 ? `flex-grow:${leftSpan};`   : '';
      const centerFlexExtra = centerSpan > 1 ? `flex-grow:${centerSpan};` : '';
      const rightFlexExtra  = rightSpan  > 1 ? `flex-grow:${rightSpan};`  : '';

      return html`
        <div class="bottom-bar-container" style="${bottomStyle}">
            <div class="slot slot-left slot-align-${leftAlign} ${leftEmpty ? 'slot-empty' : ''} ${leftOverflow ? 'slot-visible' : ''}" style="${leftStyle}${leftFlexExtra}">${this._renderSlotContent(cfg.bottom_bar_left, "left", "bottom_left", "bottom_bar", leftStretch)}</div>
            <div class="slot slot-center slot-align-${centerAlign} ${centerEmpty ? 'slot-empty' : ''} ${centerOverflow ? 'slot-visible' : ''}" style="${centerStyle}${centerFlexExtra}">${this._renderSlotContent(cfg.bottom_bar_center, "center", "bottom_center", "bottom_bar", centerStretch)}</div>
            <div class="slot slot-right slot-align-${rightAlign} ${rightEmpty ? 'slot-empty' : ''} ${rightOverflow ? 'slot-visible' : ''}" style="${rightStyle}${rightFlexExtra}">${this._renderSlotContent(cfg.bottom_bar_right, "right", "bottom_right", "bottom_bar", rightStretch)}</div>
        </div>
      `;
  }

  _renderPersons() {
    const cfg = this._config;
    if (!cfg.persons_enabled || !cfg.persons_entities || cfg.persons_entities.length === 0) {
      return html``;
    }

    const personsAlign = cfg.persons_align || "left";
    const personsX = cfg.persons_offset_x || 5;
    const personsY = cfg.persons_offset_y || 32;
    const personsSize = cfg.persons_size || 48;
    const personsSpacing = cfg.persons_spacing != null ? cfg.persons_spacing : -8;
    const stackOrder = cfg.persons_stack_order || "ascending";
    const dynamicOrder = cfg.persons_dynamic_order || false;
    const hideAway = cfg.persons_hide_away || false;
    const borderWidth = cfg.persons_border_width || 1;
    const borderStyle = cfg.persons_border_style || "solid";
    
    // Parse border radius to handle integer values as pixels
    const parseRadius = (v) => {
      if (v === undefined || v === null || v === "") return "50%";
      if (typeof v === "number" && Number.isFinite(v)) return `${v}px`;
      const s = String(v).trim();
      // If user enters a plain number (incl. negative/decimal), interpret as px.
      // Otherwise pass through as any valid CSS length/value (%, em, var(), etc.)
      return /^-?\d+(?:\.\d+)?$/.test(s) ? `${s}px` : s;
    };
    
    const borderRadius = parseRadius(cfg.persons_border_radius);
    const borderColor = cfg.persons_border_color || "rgba(255,255,255,0.3)";
    const borderColorAway = cfg.persons_border_color_away || "rgba(255,100,100,0.5)";
    const boxShadow = cfg.persons_box_shadow !== undefined ? cfg.persons_box_shadow : "0 2px 8px rgba(0, 0, 0, 0.4)";
    const grayscaleAway = cfg.persons_grayscale_away || false;
    const useEntityPicture = cfg.persons_use_entity_picture !== false;

    // Filter out away persons if hide_away is enabled
    let filteredPersons = [...cfg.persons_entities];
    if (hideAway) {
      filteredPersons = filteredPersons.filter(personConfig => {
        const entityId = typeof personConfig === 'string' ? personConfig : personConfig.entity;
        const entity = this.hass?.states[entityId];
        return entity && entity.state === "home";
      });
    }

    // Sort persons if dynamic ordering is enabled
    let sortedPersons = filteredPersons;
    if (dynamicOrder) {
      sortedPersons = [...filteredPersons].sort((a, b) => {
        const entityIdA = typeof a === 'string' ? a : a.entity;
        const entityIdB = typeof b === 'string' ? b : b.entity;
        const entityA = this.hass?.states[entityIdA];
        const entityB = this.hass?.states[entityIdB];
        
        if (!entityA || !entityB) return 0;
        
        const isHomeA = entityA.state === "home";
        const isHomeB = entityB.state === "home";
        
        // Home entities come first
        if (isHomeA && !isHomeB) return -1;
        if (!isHomeA && isHomeB) return 1;
        
        // Within same group, maintain original order
        return 0;
      });
    }

    // If no persons to show after filtering, return empty
    if (sortedPersons.length === 0) {
      return html``;
    }

    let containerStyle;
    if (personsAlign === "right") {
      containerStyle = `left:auto;right:${personsX}px;top:${personsY}px;`;
    } else if (personsAlign === "center") {
      containerStyle = `left:50%;top:${personsY}px;transform:translateX(-50%);`;
    } else {
      containerStyle = `left:${personsX}px;top:${personsY}px;`;
    }

    const totalPersons = sortedPersons.length;

    return html`
      <div class="persons-container" style="${containerStyle}">
        ${sortedPersons.map((personConfig, index) => {
          const entityId = typeof personConfig === 'string' ? personConfig : personConfig.entity;
          const entity = this.hass?.states[entityId];
          if (!entity) return html``;

          const entityPicture = entity.attributes?.entity_picture;
          const icon = entity.attributes?.icon || "mdi:account";
          
          // Debug: log personConfig structure
          if (typeof personConfig !== 'string' && personConfig.grayscale_entity) {
            console.log(`Person ${entityId} config:`, JSON.stringify(personConfig, null, 2));
          }
          
          // Get per-person grayscale entity if configured
          const grayscaleEntity = (typeof personConfig !== 'string' && personConfig.grayscale_entity) || "";
          
          // Determine "home" state - use grayscale_entity if configured, otherwise use person state
          let isHome;
          if (grayscaleEntity && this.hass?.states[grayscaleEntity]) {
            // Use the grayscale entity's state: "on"/"true"/true = home, anything else = away
            const grayscaleEntityState = this.hass.states[grayscaleEntity];
            const state = String(grayscaleEntityState.state).toLowerCase();
            isHome = state === "on" || state === "true" || state === "home";
            
            // Debug logging
            console.log(`Person ${entityId}: grayscale_entity=${grayscaleEntity}, state=${state}, isHome=${isHome}, grayscaleAway=${grayscaleAway}`);
          } else {
            // Use the person entity's state
            isHome = entity.state === "home";
            
            if (grayscaleEntity) {
              console.log(`Person ${entityId}: grayscale_entity=${grayscaleEntity} NOT FOUND in hass.states`);
            }
          }

          // Get per-person custom icons and pictures
          const customIconHome = (typeof personConfig !== 'string' && personConfig.icon_home) || "";
          const customIconAway = (typeof personConfig !== 'string' && personConfig.icon_away) || "";
          const customPictureHome = (typeof personConfig !== 'string' && personConfig.picture_home) || "";
          const customPictureAway = (typeof personConfig !== 'string' && personConfig.picture_away) || "";

          // Determine which icon or picture to use based on state
          let displayIcon = icon;
          let displayPicture = entityPicture;

          if (isHome) {
            // Home state: use custom home icon/picture if available
            if (customIconHome) displayIcon = customIconHome;
            if (customPictureHome) displayPicture = customPictureHome;
          } else {
            // Away state: use custom away icon/picture if available
            if (customIconAway) displayIcon = customIconAway;
            if (customPictureAway) displayPicture = customPictureAway;
          }

          // Get per-person actions (with fallback to defaults)
          const tapAction = personConfig.tap_action || { action: "more-info" };
          const holdAction = personConfig.hold_action || { action: "none" };
          const doubleTapAction = personConfig.double_tap_action || { action: "none" };

          // Person-level popup config (single popup per person, shared across all actions)
          const personPopupConfig = (() => {
            const pc = {};
            copyDefinedKeys({ src: personConfig, dst: pc, keys: HKI_POPUP_CONFIG_KEYS });
            return Object.keys(pc).length ? pc : null;
          })();

          // Use entity picture if available and enabled, otherwise use icon
          const showPicture = useEntityPicture && displayPicture;
          
          // Determine border color based on state
          const currentBorderColor = isHome ? borderColor : borderColorAway;
          
          // Calculate z-index based on stack order
          // ascending: later avatars on top (1, 2, 3, 4...)
          // descending: earlier avatars on top (4, 3, 2, 1...)
          const zIndex = stackOrder === "ascending" ? index + 1 : totalPersons - index;

          // Apply spacing as margin-left on all but first avatar
          const marginLeft = index > 0 ? `margin-left:${personsSpacing}px;` : "";

          // Avatar container style (no filter here - border should always have color)
          const avatarStyle = `width:${personsSize}px;height:${personsSize}px;border-width:${borderWidth}px;border-style:${borderStyle};border-radius:${borderRadius};border-color:${currentBorderColor};box-shadow:${boxShadow};z-index:${zIndex};${marginLeft}`;
          
          // Apply grayscale filter to image/icon only, not the container
          const contentFilter = (!isHome && grayscaleAway) ? "filter:grayscale(100%);" : "";

          // Hold state lives on the instance (keyed by entity) so it survives re-renders
          if (!this._slotHoldState) this._slotHoldState = {};
          if (!this._slotHoldState[entityId]) this._slotHoldState[entityId] = { holdTimer: null, holdActive: false, clickTimer: null, clickCount: 0, touchHandled: false };
          const state = this._slotHoldState[entityId];

          const startHold = (e) => {
            state.holdActive = false;
            // Always set timer so a long-press is recognized even when holdAction is "none"
            state.holdTimer = setTimeout(() => {
              state.holdActive = true;
              if (holdAction && holdAction.action !== "none") {
                this._handleAction(holdAction, entityId, personPopupConfig);
              }
            }, 500);
          };

          const endHold = (e) => {
            if (state.holdTimer) {
              clearTimeout(state.holdTimer);
              state.holdTimer = null;
            }
            if (!state.holdActive) {
              state.clickCount++;
              if (state.clickCount === 1) {
                state.clickTimer = setTimeout(() => {
                  if (state.clickCount === 1) {
                    this._handleAction(tapAction, entityId, personPopupConfig);
                  }
                  state.clickCount = 0;
                }, 250);
              } else if (state.clickCount === 2) {
                clearTimeout(state.clickTimer);
                state.clickCount = 0;
                this._handleAction(doubleTapAction, entityId, personPopupConfig);
              }
            }
            state.holdActive = false;
          };

          const cancelHold = () => {
            if (state.holdTimer) {
              clearTimeout(state.holdTimer);
              state.holdTimer = null;
            }
            state.holdActive = false;
          };

          const handleTouchStart = () => { state.touchHandled = true; startHold(); };
          const handleTouchEnd = () => { endHold(); setTimeout(() => { state.touchHandled = false; }, 500); };
          const handleMouseDown = () => { if (state.touchHandled) return; startHold(); };
          const handleMouseUp = () => { if (state.touchHandled) return; endHold(); };
          const handleMouseLeave = () => { if (!state.touchHandled) cancelHold(); };

          return html`
            <div 
              class="person-avatar" 
              style="${avatarStyle}"
              @mousedown=${handleMouseDown}
              @mouseup=${handleMouseUp}
              @mouseleave=${handleMouseLeave}
              @touchstart=${handleTouchStart}
              @touchend=${handleTouchEnd}
              @touchcancel=${cancelHold}
              @contextmenu=${(e) => e.preventDefault()}
            >
              ${showPicture 
                ? html`<img src="${displayPicture}" alt="${entity.attributes?.friendly_name || entityId}" style="${contentFilter}" />`
                : html`<ha-icon .icon="${displayIcon}" style="${contentFilter}"></ha-icon>`
              }
            </div>
          `;
        })}
      </div>
    `;
  }

  _renderInfoDisplay() {
    return html``;
  }

  render() {
    if (!this._config) return html``;

    const cfg = this._config;
    const editMode = this._isEditMode() || this._editMode;
    const effectiveFixed = !!cfg.fixed && !this._inPreview;

    const titleText = this._isTemplateString(cfg.title) ? (this._renderedTitle ?? "") : (cfg.title ?? "");
    const subtitleText = this._isTemplateString(cfg.subtitle) ? (this._renderedSubtitle ?? "") : (cfg.subtitle ?? "");
    const subtitleVisible = !!subtitleText.trim();

    // When not fixed (or in preview), allow the header to "bleed" wider left/right and add spacing top/bottom.
    // Left/Right: positive values make the card wider on that side.
    // Top/Bottom: margin spacing.
    const insetTop = toNum(cfg.inset_top, 0);
    const insetLeft = toNum(cfg.inset_left, 0);
    const insetRight = toNum(cfg.inset_right, 0);
    const insetBottom = toNum(cfg.inset_bottom, 0);

    const extraWidth = insetLeft + insetRight;
    const cardWidth = effectiveFixed
      ? "100vw"
      : (extraWidth !== 0 ? `calc(100% + ${extraWidth}px)` : "100%");

    const nonFixedBleedStyle = !effectiveFixed
      ? [
          insetTop ? `margin-top:${insetTop}px` : "",
          insetBottom ? `margin-bottom:${insetBottom}px` : "",
          (insetLeft || insetRight)
            ? `margin-left:${-insetLeft}px;margin-right:${-insetRight}px`
            : "",
        ].filter(Boolean).join(";")
      : "";
    
    // Background can be a CSS color, a gradient, or an image URL.
    // Colors must map to background-color (not background-image).
    const bgRaw = (cfg.background ?? "").toString();
    const bgTrim = bgRaw.trim();
    const isGradient = bgTrim.startsWith("linear-gradient(") || bgTrim.startsWith("radial-gradient(");
    const isUrl = bgTrim.startsWith("url(");
    const isPath = bgTrim.startsWith("/") || bgTrim.startsWith("./") || bgTrim.startsWith("../") ||
                   bgTrim.startsWith("http://") || bgTrim.startsWith("https://") ||
                   /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(bgTrim);

    let bgImage = "";
    let bgColor = "";

    if (bgTrim) {
      if (isGradient || isUrl) bgImage = bgTrim;
      else if (isPath) bgImage = `url('${bgTrim}')`;
      else bgColor = bgTrim;
    }

    // Determine border-radius: split top/bottom > legacy > system default (when not fixed)
    const parseRadius = (v) => {
      if (v === undefined || v === null || v === "") return "";
      if (typeof v === "number" && Number.isFinite(v)) return `${v}px`;
      const s = String(v).trim();
      // If user enters a plain number (incl. negative/decimal), interpret as px.
      // Otherwise pass through as any valid CSS length/value.
      return /^-?\d+(?:\.\d+)?$/.test(s) ? `${s}px` : s;
    };

    let topRadius = parseRadius(cfg.card_border_radius_top);
    let bottomRadius = parseRadius(cfg.card_border_radius_bottom);

    // Back-compat: if neither split value is set, use legacy card_border_radius
    if (!topRadius && !bottomRadius) {
      const legacy = parseRadius(cfg.card_border_radius);
      topRadius = legacy;
      bottomRadius = legacy;
    }

    // If only one is provided, mirror it to the other for a sensible default
    if (topRadius && !bottomRadius) bottomRadius = topRadius;
    if (bottomRadius && !topRadius) topRadius = bottomRadius;

    // System default when not fixed and nothing is set
    if (!topRadius && !bottomRadius && !effectiveFixed) {
      topRadius = "var(--ha-card-border-radius, 12px)";
      bottomRadius = topRadius;
    }

    // CSS border-radius shorthand: tl tr br bl
    const borderRadius = (topRadius || bottomRadius)
      ? `${topRadius || "0"} ${topRadius || "0"} ${bottomRadius || "0"} ${bottomRadius || "0"}`
      : "";

    // Build border style - always explicit to override ha-card defaults
    let borderStyle = "";
    if (cfg.card_border_style && cfg.card_border_style !== "none" && cfg.card_border_width > 0) {
      // Custom border configured
      borderStyle = `border-style:${cfg.card_border_style};border-width:${cfg.card_border_width}px;border-color:${cfg.card_border_color || 'transparent'}`;
    } else {
      // No border - explicitly set to none to override ha-card defaults
      borderStyle = "border:none";
    }

    const cardStyle = [
      `width:${cardWidth}`,
      (!effectiveFixed && nonFixedBleedStyle) ? nonFixedBleedStyle : "",
      `height:${cfg.height_vh}vh`,
      `min-height:${cfg.min_height}px`,
      `max-height:${cfg.max_height}px`,
      (bgColor || cfg.background_color) ? `background-color:${bgColor || cfg.background_color}` : "",
      bgImage ? `background-image:${bgImage}` : "",
      cfg.background_position ? `background-position:${cfg.background_position}` : "",
      cfg.background_repeat ? `background-repeat:${cfg.background_repeat}` : "",
      cfg.background_size ? `background-size:${cfg.background_size}` : "",
      cfg.background_blend_mode ? `background-blend-mode:${cfg.background_blend_mode}` : "",
      borderRadius ? `border-radius:${borderRadius}` : "",
      cfg.card_box_shadow ? `box-shadow:${cfg.card_box_shadow}` : "box-shadow:none",
      borderStyle,
      // Only apply overflow:hidden when not fixed and no bottom bar slot has overflow enabled
      // (bottom bar overflow:visible needs the card to not clip its content)
      !effectiveFixed && !(cfg.bottom_bar_left_overflow || cfg.bottom_bar_center_overflow || cfg.bottom_bar_right_overflow) ? "overflow:hidden" : ""
    ].filter(Boolean).join(";");

    // Only show overlay gradient if blend is enabled
    const blendEnabled = cfg.blend_enabled !== false;
    const overlayStyle = blendEnabled 
      ? `background:linear-gradient(to bottom, transparent 0%, ${cfg.blend_color} ${cfg.blend_stop}%, ${cfg.blend_color} 100%);`
      : "display:none;";
    
    // Change: if not fixed, do not apply calculated offsets
    const contentStyle = effectiveFixed 
      ? `margin-left:${this._offsetLeft}px;width:${this._contentWidth}px;`
      : `width:100%;`;

    const fontFamily = this._resolveFontFamily();
    const fontStyle = cfg.font_style || "normal";
    const titleColor = cfg.title_color?.trim() || "var(--hki-header-text-color, #fff)";
    const subtitleColor = cfg.subtitle_color?.trim() || "var(--hki-header-text-color, #fff)";
    const titleInline = `font-family:${fontFamily};font-style:${fontStyle};font-size:${cfg.title_size_px}px;font-weight:${this._resolveWeight("title_weight")};color:${titleColor};`;
    const subtitleInline = `font-family:${fontFamily};font-style:${fontStyle};font-size:${cfg.subtitle_size_px}px;font-weight:${this._resolveWeight("subtitle_weight")};color:${subtitleColor};`;

    const subtitleOffsetX = (cfg.subtitle_offset_x || 0) - (cfg.title_offset_x || 0);
    const subtitleOffsetY = (cfg.subtitle_offset_y || 0) - (cfg.title_offset_y || 0);
    const subtitleTransform = `transform:translate(${subtitleOffsetX}px, ${subtitleOffsetY}px);`;

    let titleBlockStyle;
    if (cfg.text_align === "right") titleBlockStyle = `left:auto;right:${cfg.title_offset_x}px;top:${cfg.title_offset_y}px;text-align:right;align-items:flex-end;`;
    else if (cfg.text_align === "center") titleBlockStyle = `left:50%;top:${cfg.title_offset_y}px;transform:translateX(-50%);text-align:center;align-items:center;`;
    else titleBlockStyle = `left:${cfg.title_offset_x}px;top:${cfg.title_offset_y}px;text-align:left;align-items:flex-start;`;

    const topOffset = this._kioskMode ? (cfg.fixed_top || 0) : (cfg.fixed_top || 0) + 48;
    const wrapperStyle = effectiveFixed 
      ? `top:${topOffset}px;${borderRadius ? `border-radius:${borderRadius};` : ''}` 
      : "";

    const badgesOffset = cfg.badges_fixed ? (cfg.badges_offset_pinned || 48) : (cfg.badges_offset_unpinned || 100);
    let spacerH = effectiveFixed ? Math.max(0, (this._headerHeight || 0) - badgesOffset + topOffset) : 0;

    if (cfg.badges_fixed && effectiveFixed) {
      const kioskGapAdjustment = this._kioskMode ? 48 : 0;
      spacerH += (cfg.badges_gap || 0) + kioskGapAdjustment - 48;
    }

    if (editMode && cfg.fixed && !this._inPreview) {
      return html`
        <ha-card class="edit-placeholder">
          <div class="edit-placeholder-inner">
            <ha-icon icon="mdi:view-headline"></ha-icon>
            <div class="edit-placeholder-text">
              <div class="edit-placeholder-title">HKI Header Card</div>
              <div class="edit-placeholder-subtitle">Fixed-position header • This header will be hidden in edit mode for easier editing, when editing the header you'll see a preview of the header.</div>
            </div>
          </div>
        </ha-card>
      `;
    }

    const cardMarkup = html`
      <ha-card class="header" style=${cardStyle} aria-label=${titleText || "Header"}>
        <div class="overlay" style=${overlayStyle}></div>
        <div class="content" style=${contentStyle}>
          ${this._renderTopBar()}
          ${this._renderBottomBar()}
          <div class="title-block" style=${titleBlockStyle}>
            <div class="title" style=${titleInline} role="heading" aria-level="1">${titleText}</div>
            ${subtitleVisible ? html`<div class="subtitle" style="${subtitleInline}${subtitleTransform}">${subtitleText}</div>` : html``}
          </div>
          ${this._renderPersons()}
          ${this._renderInfoDisplay()}
        </div>
      </ha-card>
    `;

    if (!effectiveFixed) return cardMarkup;

    return html`
      <div class="header-fixed" style=${wrapperStyle}>${cardMarkup}</div>
      <div class="header-spacer" style="height:${spacerH}px;"></div>
    `;
  }

  static getConfigElement() {
    return document.createElement("hki-header-card-editor");
  }

  static getStubConfig() {
    return {
      ...DEFAULTS,
      title: "Welcome Home",
      subtitle: "Tuesday 19:45",
      font_family: "roboto",
    };
  }

  static getCardSize() {
    return 3;
  }
}

if (!customElements.get(CARD_NAME)) {
  customElements.define(CARD_NAME, HkiHeaderCard);
}


// ─────────────────────────────────────────────────────────────
// EDITOR
// ─────────────────────────────────────────────────────────────

class HkiHeaderCardEditor extends LitElement {
  static get properties() {
    return {
      hass: {},
      lovelace: {},
      _config: { attribute: false },
    };
  }

  // Pre-computed field sets for performance (avoid recreating on every change)
  static _numericFields = new Set([
    "height_vh", "min_height", "max_height", "blend_stop", "fixed_top",
    "inset_top", "inset_left", "inset_right", "inset_bottom",
    "title_offset_x", "title_offset_y", "subtitle_offset_x", "subtitle_offset_y",
    "title_size_px", "subtitle_size_px", "badges_offset_pinned", "badges_offset_unpinned",
    "badges_gap", "info_offset_x", "info_offset_y", "info_size_px",
    "mobile_breakpoint", "info_pill_padding_x", "info_pill_padding_y",
    "info_pill_radius", "info_pill_blur", "top_bar_offset_y", "top_bar_padding_x",
    "top_bar_left_offset_x", "top_bar_left_offset_y",
    "top_bar_center_offset_x", "top_bar_center_offset_y",
    "top_bar_right_offset_x", "top_bar_right_offset_y",
    "top_bar_left_size_px", "top_bar_center_size_px", "top_bar_right_size_px",
    "top_bar_left_pill_padding_x", "top_bar_left_pill_padding_y", "top_bar_left_pill_radius", "top_bar_left_pill_blur",
    "top_bar_center_pill_padding_x", "top_bar_center_pill_padding_y", "top_bar_center_pill_radius", "top_bar_center_pill_blur",
    "top_bar_right_pill_padding_x", "top_bar_right_pill_padding_y", "top_bar_right_pill_radius", "top_bar_right_pill_blur",
    "info_pill_border_width", "top_bar_left_pill_border_width", "top_bar_center_pill_border_width", "top_bar_right_pill_border_width",
    "card_border_width",
    "persons_offset_x", "persons_offset_y", "persons_size", "persons_spacing", "persons_border_width",
    "bottom_bar_offset_y", "bottom_bar_padding_x"
  ]);

  static _nullableNumericFields = new Set([
    "info_offset_x_mobile", "info_offset_y_mobile",
    "top_bar_left_offset_x_mobile", "top_bar_left_offset_y_mobile",
    "top_bar_center_offset_x_mobile", "top_bar_center_offset_y_mobile",
    "top_bar_right_offset_x_mobile", "top_bar_right_offset_y_mobile"
  ]);

  static _booleanFields = new Set([
    "fixed", "badges_fixed", "weather_show_icon", "weather_show_condition",
    "weather_show_temperature", "weather_show_humidity", "weather_show_wind",
    "weather_show_pressure", "weather_colored_icons", "info_pill",
    "datetime_show_time", "datetime_show_date", "datetime_show_day", "top_bar_enabled",
    "blend_enabled", "persons_enabled", "persons_use_entity_picture", "persons_grayscale_away", "persons_dynamic_order", "persons_hide_away",
    "bottom_bar_enabled",
    "top_bar_left_use_global", "top_bar_left_pill", "top_bar_left_overflow", "top_bar_left_show_icon", "top_bar_left_show_condition", "top_bar_left_show_temperature", "top_bar_left_show_humidity", "top_bar_left_show_wind", "top_bar_left_show_pressure", "top_bar_left_weather_colored_icons", "top_bar_left_show_day", "top_bar_left_show_date", "top_bar_left_show_time",
    "top_bar_center_use_global", "top_bar_center_pill", "top_bar_center_overflow", "top_bar_center_show_icon", "top_bar_center_show_condition", "top_bar_center_show_temperature", "top_bar_center_show_humidity", "top_bar_center_show_wind", "top_bar_center_show_pressure", "top_bar_center_weather_colored_icons", "top_bar_center_show_day", "top_bar_center_show_date", "top_bar_center_show_time",
    "top_bar_right_use_global", "top_bar_right_pill", "top_bar_right_overflow", "top_bar_right_show_icon", "top_bar_right_show_condition", "top_bar_right_show_temperature", "top_bar_right_show_humidity", "top_bar_right_show_wind", "top_bar_right_show_pressure", "top_bar_right_weather_colored_icons", "top_bar_right_show_day", "top_bar_right_show_date", "top_bar_right_show_time",
    "bottom_bar_left_use_global", "bottom_bar_left_pill", "bottom_bar_left_overflow", "bottom_bar_left_show_icon", "bottom_bar_left_show_condition", "bottom_bar_left_show_temperature", "bottom_bar_left_show_humidity", "bottom_bar_left_show_wind", "bottom_bar_left_show_pressure", "bottom_bar_left_weather_colored_icons", "bottom_bar_left_show_day", "bottom_bar_left_show_date", "bottom_bar_left_show_time",
    "bottom_bar_center_use_global", "bottom_bar_center_pill", "bottom_bar_center_overflow", "bottom_bar_center_show_icon", "bottom_bar_center_show_condition", "bottom_bar_center_show_temperature", "bottom_bar_center_show_humidity", "bottom_bar_center_show_wind", "bottom_bar_center_show_pressure", "bottom_bar_center_weather_colored_icons", "bottom_bar_center_show_day", "bottom_bar_center_show_date", "bottom_bar_center_show_time",
    "bottom_bar_right_use_global", "bottom_bar_right_pill", "bottom_bar_right_overflow", "bottom_bar_right_show_icon", "bottom_bar_right_show_condition", "bottom_bar_right_show_temperature", "bottom_bar_right_show_humidity", "bottom_bar_right_show_wind", "bottom_bar_right_show_pressure", "bottom_bar_right_weather_colored_icons", "bottom_bar_right_show_day", "bottom_bar_right_show_date", "bottom_bar_right_show_time"
  ]);

  constructor() {
    super();
    this._config = {}; // Will be populated by setConfig
    // Cache for domain selection when ha-service-picker isn't available
    this._paDomainCache = {};
  }

  _getLovelace() {
    if (this.lovelace) return this.lovelace;
    try {
      const root = document.querySelector('home-assistant')?.shadowRoot
        ?.querySelector('ha-panel-lovelace')?.shadowRoot
        ?.querySelector('hui-root');
      return root?.lovelace || root?.__lovelace || null;
    } catch (e) { return null; }
  }

  _renderNavigationPathPicker(label, value, onChange) {
    const val = value || "";
    if (customElements.get("ha-navigation-picker")) {
      return html`
        <ha-navigation-picker
          .hass=${this.hass}
          .label=${label}
          .value=${val}
          @value-changed=${(e) => onChange(e.detail?.value ?? "")}
        ></ha-navigation-picker>
      `;
    }
    if (customElements.get("ha-selector")) {
      return html`
        <ha-selector
          .hass=${this.hass}
          .label=${label}
          .selector=${{ navigation: {} }}
          .value=${val}
          @value-changed=${(e) => onChange(e.detail?.value ?? "")}
        ></ha-selector>
      `;
    }
    return html`
      <ha-textfield
        .label=${label}
        .value=${val}
        placeholder="/lovelace/0"
        @change=${(e) => onChange(e.target.value)}
      ></ha-textfield>
    `;
  }

  setConfig(config) {
    // Ensure we have a valid config object  
    if (!config || typeof config !== 'object') {
      config = { type: "custom:hki-header-card" };
    }
    
    // Ensure type field exists
    if (!config.type) {
      config = { ...config, type: "custom:hki-header-card" };
    }
    
    // Detect format and convert if needed
    let workingConfig = config;
    
    // If config uses old flat format, migrate to nested first
    if (isOldFormat(config)) {
      const nested = migrateToNestedFormat(config);
      workingConfig = flattenNestedFormat(nested); // Flatten back for internal use
    } else if (
      // Detect nested format by checking for any nested objects
      (config.top_bar_left && typeof config.top_bar_left === 'object') ||
      (config.top_bar_center && typeof config.top_bar_center === 'object') ||
      (config.top_bar_right && typeof config.top_bar_right === 'object') ||
      (config.top_bar && typeof config.top_bar === 'object') ||
      (config.info && typeof config.info === 'object') ||
      (config.persons && typeof config.persons === 'object')
    ) {
      // New nested format - flatten for internal use
      workingConfig = flattenNestedFormat(config);
    }
    
    // Merge with defaults - this ensures all fields have values
    this._config = { ...DEFAULTS, ...workingConfig };
    this.requestUpdate();
  }

  _cleanupActionConfig(action) {
    if (!action || typeof action !== 'object') return action;
    
    const actionType = action.action || "none";
    const cleaned = { action: actionType };
    
    // Only keep fields relevant to the action type
    switch (actionType) {
      case "navigate":
        if (action.navigation_path) cleaned.navigation_path = action.navigation_path;
        break;
      case "url":
        if (action.url_path) cleaned.url_path = action.url_path;
        break;
      case "more-info":
      case "toggle":
        if (action.entity) cleaned.entity = action.entity;
        break;
      case "perform-action":
        if (action.perform_action) cleaned.perform_action = action.perform_action;
        if (action.data) cleaned.data = action.data;
        if (action.target) cleaned.target = action.target;
        break;
      case "hki-more-info":
        if (action.entity) cleaned.entity = action.entity;
        if (action.custom_popup_card !== undefined) cleaned.custom_popup_card = action.custom_popup_card;
        if (action.popup_name) cleaned.popup_name = action.popup_name;
        if (action.popup_state) cleaned.popup_state = action.popup_state;
        copyDefinedKeys({
          src: action,
          dst: cleaned,
          keys: HKI_POPUP_CONFIG_KEYS.filter((k) => !["custom_popup_enabled", "custom_popup_card", "popup_name", "popup_state"].includes(k)),
        });
        break;
      case "fire-dom-event":
        // Preserve all properties for fire-dom-event (browser_mod integration)
        Object.keys(action).forEach(key => {
          if (key !== 'action') {
            cleaned[key] = action[key];
          }
        });
        break;
      case "call-service":
        // Legacy support
        if (action.service) cleaned.service = action.service;
        if (action.service_data) cleaned.service_data = action.service_data;
        break;
    }
    
    return cleaned;
  }

  _stripDefaults(config) {
    // Create a clean config object with essential fields always present
    const stripped = { type: config.type };
    // Only write title/subtitle when they differ from defaults (avoids noise in YAML)
    if (config.title && config.title !== "Header") stripped.title = config.title;
    if (config.subtitle) stripped.subtitle = config.subtitle;
    
    // Always include these essential fields even if they match defaults
    // This ensures Home Assistant recognizes this as a valid header card
    const alwaysInclude = [
      'height_vh', 'min_height', 'max_height', 'background',
      'persons_enabled',
      'top_bar_enabled', 'top_bar_left', 'top_bar_center', 'top_bar_right'
    ];
    
    alwaysInclude.forEach(key => {
      if (config[key] !== undefined) {
        stripped[key] = config[key];
      }
    });
    
    // List of deprecated config keys to remove
    const deprecatedKeys = [
      'persons_gap',           // Replaced by persons_spacing
      'persons_overlap',       // Replaced by persons_spacing
      'persons_tap_action',    // Now per-person in persons_entities
      'persons_hold_action',   // Now per-person in persons_entities
      'persons_double_tap_action' // Now per-person in persons_entities
    ];
    
    for (const [key, value] of Object.entries(config)) {
      if (key === 'type' || key === 'title' || key === 'subtitle') continue; // Already added
      if (alwaysInclude.includes(key)) continue; // Already added
      
      // Skip deprecated keys
      if (deprecatedKeys.includes(key)) continue;
      
      const defaultValue = DEFAULTS[key];
      
      // Skip if value matches default
      if (defaultValue === value) continue;
      
      // Special handling for persons_entities array
      if (key === 'persons_entities' && Array.isArray(value)) {
        const cleanedPersons = value.map(person => {
          if (typeof person === 'string') return person;
          if (typeof person !== 'object' || !person) return null;
          
          const cleanedPerson = {
            entity: person.entity || ""
          };
          
          // Preserve grayscale_entity if present
          if (person.grayscale_entity) {
            cleanedPerson.grayscale_entity = person.grayscale_entity;
          }
          
          // Preserve custom icon and picture properties if present
          if (person.icon_home) {
            cleanedPerson.icon_home = person.icon_home;
          }
          if (person.icon_away) {
            cleanedPerson.icon_away = person.icon_away;
          }
          if (person.picture_home) {
            cleanedPerson.picture_home = person.picture_home;
          }
          if (person.picture_away) {
            cleanedPerson.picture_away = person.picture_away;
          }
          
          // Preserve ALL popup settings on the person object
          copyDefinedKeys({ src: person, dst: cleanedPerson, keys: HKI_POPUP_CONFIG_KEYS });

          // Clean up actions for each person
          if (person.tap_action) {
            cleanedPerson.tap_action = this._cleanupActionConfig(person.tap_action);
          }
          if (person.hold_action) {
            cleanedPerson.hold_action = this._cleanupActionConfig(person.hold_action);
          }
          if (person.double_tap_action) {
            cleanedPerson.double_tap_action = this._cleanupActionConfig(person.double_tap_action);
          }
          
          return cleanedPerson;
        }).filter(Boolean);
        
        // Always include persons_entities, even if empty, when persons are enabled
        if (cleanedPersons.length > 0 || config.persons_enabled) {
          stripped[key] = cleanedPersons;
        }
        continue;
      }
      
      // Clean up action configs (tap_action, hold_action, double_tap_action for slots)
      if (key.endsWith('_tap_action') || key.endsWith('_hold_action') || key.endsWith('_double_tap_action')) {
        if (typeof value === 'object' && value !== null) {
          const cleaned = this._cleanupActionConfig(value);
          const defaultAction = DEFAULTS[key] || { action: "none" };
          if (JSON.stringify(cleaned) !== JSON.stringify(defaultAction)) {
            stripped[key] = cleaned;
          }
        }
        continue;
      }
      
      // Handle deep equality for objects
      if (typeof value === 'object' && value !== null && typeof defaultValue === 'object' && defaultValue !== null) {
        if (JSON.stringify(value) === JSON.stringify(defaultValue)) continue;
      }
      
      // Keep the value if it's different from default
      stripped[key] = value;
    }
    
    // Convert stripped flat config to nested format for output
    return this._convertToNestedOutput(stripped);
  }

  _convertToNestedOutput(flat) {
    const nested = { type: flat.type };
    
    // Simple top-level properties stay as-is
    const simpleProps = [
      'title', 'subtitle', 'text_align', 'title_color', 'subtitle_color',
      'background', 'background_color', 'background_position', 'background_repeat',
      'background_size', 'background_blend_mode', 'height_vh', 'min_height', 'max_height',
      'grid_options',
      'blend_color', 'blend_stop', 'blend_enabled',
      'card_border_radius', 'card_border_radius_top', 'card_border_radius_bottom',
      'card_box_shadow', 'card_border_style', 'card_border_width', 'card_border_color',
      'fixed', 'fixed_top', 'inset_top', 'inset_left', 'inset_right', 'inset_bottom',
      'title_offset_x', 'title_offset_y', 'subtitle_offset_x', 'subtitle_offset_y',
      'badges_offset_pinned', 'badges_offset_unpinned', 'badges_gap', 'badges_fixed',
      'font_family', 'font_family_custom', 'font_style', 'title_size_px', 'subtitle_size_px',
      'title_weight', 'subtitle_weight', 'mobile_breakpoint'
    ];
    
    simpleProps.forEach(prop => {
      if (flat[prop] !== undefined) {
        nested[prop] = flat[prop];
      }
    });
    
    // Nest top_bar if any settings exist
    const hasTopBarConfig = flat.top_bar_enabled !== undefined || flat.top_bar_offset_y !== undefined || flat.top_bar_padding_x !== undefined;
    if (hasTopBarConfig) {
      nested.top_bar = {};
      if (flat.top_bar_enabled !== undefined) nested.top_bar.enabled = flat.top_bar_enabled;
      if (flat.top_bar_offset_y !== undefined) nested.top_bar.offset_y = flat.top_bar_offset_y;
      if (flat.top_bar_padding_x !== undefined) nested.top_bar.padding_x = flat.top_bar_padding_x;
    }

    // Nest bottom_bar if any settings exist
    const hasBottomBarConfig = flat.bottom_bar_enabled !== undefined || flat.bottom_bar_offset_y !== undefined || flat.bottom_bar_padding_x !== undefined;
    if (hasBottomBarConfig) {
      nested.bottom_bar = nested.bottom_bar || {};
      if (flat.bottom_bar_enabled !== undefined) nested.bottom_bar.enabled = flat.bottom_bar_enabled;
      if (flat.bottom_bar_offset_y !== undefined) nested.bottom_bar.offset_y = flat.bottom_bar_offset_y;
      if (flat.bottom_bar_padding_x !== undefined) nested.bottom_bar.padding_x = flat.bottom_bar_padding_x;
    }
    
    // Nest info if any settings exist
    const infoKeys = ['info_size_px', 'info_weight', 'info_color', 'info_pill', 'info_pill_background',
                      'info_pill_padding_x', 'info_pill_padding_y', 'info_pill_radius', 'info_pill_blur',
                      'info_pill_border_style', 'info_pill_border_width', 'info_pill_border_color'];
    const hasInfoConfig = infoKeys.some(k => flat[k] !== undefined);
    if (hasInfoConfig) {
      nested.info = {};
      if (flat.info_size_px !== undefined) nested.info.size_px = flat.info_size_px;
      if (flat.info_weight !== undefined) nested.info.weight = flat.info_weight;
      if (flat.info_color !== undefined) nested.info.color = flat.info_color;
      if (flat.info_pill !== undefined) nested.info.pill = flat.info_pill;
      if (flat.info_pill_background !== undefined) nested.info.pill_background = flat.info_pill_background;
      if (flat.info_pill_padding_x !== undefined) nested.info.pill_padding_x = flat.info_pill_padding_x;
      if (flat.info_pill_padding_y !== undefined) nested.info.pill_padding_y = flat.info_pill_padding_y;
      if (flat.info_pill_radius !== undefined) nested.info.pill_radius = flat.info_pill_radius;
      if (flat.info_pill_blur !== undefined) nested.info.pill_blur = flat.info_pill_blur;
      if (flat.info_pill_border_style !== undefined) nested.info.pill_border_style = flat.info_pill_border_style;
      if (flat.info_pill_border_width !== undefined) nested.info.pill_border_width = flat.info_pill_border_width;
      if (flat.info_pill_border_color !== undefined) nested.info.pill_border_color = flat.info_pill_border_color;
    }

    // Nest bottom_info if any settings exist
    const bottomInfoKeys = ['bottom_info_size_px', 'bottom_info_weight', 'bottom_info_color', 'bottom_info_pill', 'bottom_info_pill_background',
                      'bottom_info_pill_padding_x', 'bottom_info_pill_padding_y', 'bottom_info_pill_radius', 'bottom_info_pill_blur',
                      'bottom_info_pill_border_style', 'bottom_info_pill_border_width', 'bottom_info_pill_border_color'];
    const hasBottomInfoConfig = bottomInfoKeys.some(k => flat[k] !== undefined);
    if (hasBottomInfoConfig) {
      nested.bottom_info = {};
      if (flat.bottom_info_size_px !== undefined) nested.bottom_info.size_px = flat.bottom_info_size_px;
      if (flat.bottom_info_weight !== undefined) nested.bottom_info.weight = flat.bottom_info_weight;
      if (flat.bottom_info_color !== undefined) nested.bottom_info.color = flat.bottom_info_color;
      if (flat.bottom_info_pill !== undefined) nested.bottom_info.pill = flat.bottom_info_pill;
      if (flat.bottom_info_pill_background !== undefined) nested.bottom_info.pill_background = flat.bottom_info_pill_background;
      if (flat.bottom_info_pill_padding_x !== undefined) nested.bottom_info.pill_padding_x = flat.bottom_info_pill_padding_x;
      if (flat.bottom_info_pill_padding_y !== undefined) nested.bottom_info.pill_padding_y = flat.bottom_info_pill_padding_y;
      if (flat.bottom_info_pill_radius !== undefined) nested.bottom_info.pill_radius = flat.bottom_info_pill_radius;
      if (flat.bottom_info_pill_blur !== undefined) nested.bottom_info.pill_blur = flat.bottom_info_pill_blur;
      if (flat.bottom_info_pill_border_style !== undefined) nested.bottom_info.pill_border_style = flat.bottom_info_pill_border_style;
      if (flat.bottom_info_pill_border_width !== undefined) nested.bottom_info.pill_border_width = flat.bottom_info_pill_border_width;
      if (flat.bottom_info_pill_border_color !== undefined) nested.bottom_info.pill_border_color = flat.bottom_info_pill_border_color;
    }
    
    // Nest slots - always include them even if "none" for clarity
    ['top_bar', 'bottom_bar'].forEach(bar => {
    ['left', 'center', 'right'].forEach(slot => {
      const slotType = flat[`${bar}_${slot}`];
      
      // If slot is "none" or undefined, just set type: "none"
      if (!slotType || slotType === "none") {
        nested[`${bar}_${slot}`] = { type: "none" };
        return;
      }
      
      const prefix = `${bar}_${slot}_`;
      const slotConfig = { type: slotType };
      
      // Common properties
      if (flat[prefix + "offset_x"] !== undefined) slotConfig.offset_x = flat[prefix + "offset_x"];
      if (flat[prefix + "offset_y"] !== undefined) slotConfig.offset_y = flat[prefix + "offset_y"];
      if (flat[prefix + "offset_x_mobile"] !== undefined) slotConfig.offset_x_mobile = flat[prefix + "offset_x_mobile"];
      if (flat[prefix + "offset_y_mobile"] !== undefined) slotConfig.offset_y_mobile = flat[prefix + "offset_y_mobile"];
      if (flat[prefix + "overflow"] !== undefined) slotConfig.overflow = flat[prefix + "overflow"];
      if (flat[prefix + "align"] !== undefined) slotConfig.align = flat[prefix + "align"];
      
      // Styling (only if not using global)
      if (flat[prefix + "use_global"] === false) {
        slotConfig.styling = {};
        const stylingKeys = ['size_px', 'weight', 'color', 'pill', 'pill_background', 'pill_padding_x',
                            'pill_padding_y', 'pill_radius', 'pill_blur', 'pill_border_style',
                            'pill_border_width', 'pill_border_color'];
        stylingKeys.forEach(key => {
          if (flat[prefix + key] !== undefined) {
            slotConfig.styling[key] = flat[prefix + key];
          }
        });
      }
      
      // Type-specific config
      if (slotType === "weather") {
        const weatherKeys = {
          weather_entity: 'entity',
          show_icon: 'show_icon',
          show_condition: 'show_condition',
          show_temperature: 'show_temperature',
          show_humidity: 'show_humidity',
          show_wind: 'show_wind',
          show_pressure: 'show_pressure',
          weather_colored_icons: 'colored_icons',
          weather_icon_color_mode: 'icon_color_mode',
          weather_icon_color: 'icon_color',
          animate_icon: 'animate_icon',
          icon_pack_path: 'icon_pack_path'
        };
        
        const hasWeatherConfig = Object.keys(weatherKeys).some(k => flat[prefix + k] !== undefined);
        if (hasWeatherConfig) {
          slotConfig.weather = {};
          Object.entries(weatherKeys).forEach(([flatKey, nestedKey]) => {
            if (flat[prefix + flatKey] !== undefined) {
              slotConfig.weather[nestedKey] = flat[prefix + flatKey];
            }
          });
        }
      } else if (slotType === "datetime") {
        const dtKeys = ['show_day', 'show_date', 'show_time', 'time_format', 'date_format', 'separator', 'icon', 'animate_icon'];
        const hasDateTimeConfig = dtKeys.some(k => flat[prefix + k] !== undefined);
        if (hasDateTimeConfig) {
          slotConfig.datetime = {};
          dtKeys.forEach(key => {
            if (flat[prefix + key] !== undefined) {
              slotConfig.datetime[key] = flat[prefix + key];
            }
          });
        }
      } else if (slotType === "button") {
        const hasButtonConfig = flat[prefix + "icon"] !== undefined || flat[prefix + "label"] !== undefined;
        if (hasButtonConfig) {
          slotConfig.button = {};
          if (flat[prefix + "icon"] !== undefined) slotConfig.button.icon = flat[prefix + "icon"];
          if (flat[prefix + "label"] !== undefined) slotConfig.button.label = flat[prefix + "label"];
        }
      } else if (slotType === "notifications" || slotType === "custom" || slotType === "card") {
        if (flat[prefix + "card"] !== undefined) {
          slotConfig.custom = { card: flat[prefix + "card"] };
        }
      }
      
      // Actions
      const hasActions = flat[prefix + "tap_action"] || flat[prefix + "hold_action"] || flat[prefix + "double_tap_action"];
      if (hasActions) {
        slotConfig.actions = {};
        if (flat[prefix + "tap_action"]) slotConfig.actions.tap_action = flat[prefix + "tap_action"];
        if (flat[prefix + "hold_action"]) slotConfig.actions.hold_action = flat[prefix + "hold_action"];
        if (flat[prefix + "double_tap_action"]) slotConfig.actions.double_tap_action = flat[prefix + "double_tap_action"];
      }
      

      // HKI Popup config
      const _slotPopupConfig = {};
      copyDefinedKeys({
        src: flat,
        dst: _slotPopupConfig,
        keys: HKI_POPUP_CONFIG_KEYS,
        srcPrefix: prefix,
      });
      if (Object.keys(_slotPopupConfig).length) slotConfig.hki_popup = _slotPopupConfig;

      nested[`${bar}_${slot}`] = slotConfig;
    });
    }); // end bar loop
    
    // Nest persons
    const personsKeys = ['persons_enabled', 'persons_align', 'persons_offset_x', 'persons_offset_y',
                         'persons_size', 'persons_spacing', 'persons_stack_order', 'persons_dynamic_order',
                         'persons_hide_away', 'persons_use_entity_picture', 'persons_border_width', 'persons_border_style',
                         'persons_border_radius', 'persons_border_color', 'persons_border_color_away', 'persons_box_shadow',
                         'persons_grayscale_away', 'persons_entities'];
    const hasPersonsConfig = personsKeys.some(k => flat[k] !== undefined);
    if (hasPersonsConfig) {
      nested.persons = {};
      if (flat.persons_enabled !== undefined) nested.persons.enabled = flat.persons_enabled;
      if (flat.persons_align !== undefined) nested.persons.align = flat.persons_align;
      if (flat.persons_offset_x !== undefined) nested.persons.offset_x = flat.persons_offset_x;
      if (flat.persons_offset_y !== undefined) nested.persons.offset_y = flat.persons_offset_y;
      if (flat.persons_size !== undefined) nested.persons.size = flat.persons_size;
      if (flat.persons_spacing !== undefined) nested.persons.spacing = flat.persons_spacing;
      if (flat.persons_stack_order !== undefined) nested.persons.stack_order = flat.persons_stack_order;
      if (flat.persons_dynamic_order !== undefined) nested.persons.dynamic_order = flat.persons_dynamic_order;
      if (flat.persons_hide_away !== undefined) nested.persons.hide_away = flat.persons_hide_away;
      if (flat.persons_use_entity_picture !== undefined) nested.persons.use_entity_picture = flat.persons_use_entity_picture;
      if (flat.persons_border_width !== undefined) nested.persons.border_width = flat.persons_border_width;
      if (flat.persons_border_style !== undefined) nested.persons.border_style = flat.persons_border_style;
      if (flat.persons_border_radius !== undefined) nested.persons.border_radius = flat.persons_border_radius;
      if (flat.persons_border_color !== undefined) nested.persons.border_color = flat.persons_border_color;
      if (flat.persons_border_color_away !== undefined) nested.persons.border_color_away = flat.persons_border_color_away;
      if (flat.persons_box_shadow !== undefined) nested.persons.box_shadow = flat.persons_box_shadow;
      if (flat.persons_grayscale_away !== undefined) nested.persons.grayscale_away = flat.persons_grayscale_away;
      if (flat.persons_entities) nested.persons.entities = flat.persons_entities;
    }
    
    return nested;
  }

  _renderEntityPicker(label, field, value, helper = "", domain = null) {
    return html`
      <ha-selector
        .hass=${this.hass}
        .selector=${{ entity: { domain } }}
        .value=${value || ""}
        .label=${label}
        .helper=${helper}
        @value-changed=${(ev) => this._changed(ev, field)}
      ></ha-selector>
    `;
  }

  _renderNavigationPicker(label, field, value, helper = "") {
    return html`
      <ha-selector
        .hass=${this.hass}
        .selector=${{ navigation: {} }}
        .value=${value || ""}
        .label=${label}
        .helper=${helper}
        @value-changed=${(ev) => this._changed(ev, field)}
      ></ha-selector>
    `;
  }

  _renderIconPicker(label, field, value, helper = "") {
    return html`
      <ha-selector
        .hass=${this.hass}
        .selector=${{ icon: {} }}
        .value=${value || ""}
        .label=${label}
        .helper=${helper}
        @value-changed=${(ev) => this._changed(ev, field)}
      ></ha-selector>
    `;
  }

  _val(ev) {
    return ev.detail?.value ?? ev.target?.value;
  }

  _handleCustomCardChange(ev, slot, bar = "top_bar") {
    ev.stopPropagation();
    if (!this._config) return;
    const newCardConfig = ev.detail.config;
    const field = `${bar}_${slot}_card`;
    this._config = { ...this._config, [field]: newCardConfig };
    const strippedConfig = this._stripDefaults(this._config);
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: strippedConfig } }));
  }

  _handleBgSizeSelect(ev) {
    ev.stopPropagation();
    // Use proper value extraction like other handlers - check detail.value first, then target.value
    const val = ev.detail?.value ?? ev.target?.value;
    if (!val) return;
    
    // If selecting "custom", we need to ensure the config has a valid value to start with if it was currently a preset.
    // If it was already custom (e.g. 150%), we keep it. 
    // If switching from "cover" to "custom", we default to "100%" or similar to prep the input.
    if (val === "custom") {
       const current = this._config.background_size || "cover";
       if (BG_SIZE_PRESETS.includes(current)) {
           // Reset to a safe custom default so input is not empty/confusing
           this._config = { ...this._config, background_size: "100%" };
           const strippedConfig = this._stripDefaults(this._config);
           this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: strippedConfig } }));
       }
       // Force re-render to show the custom input field
       this.requestUpdate();
    } else {
       // Selected a preset
       this._config = { ...this._config, background_size: val };
       const strippedConfig = this._stripDefaults(this._config);
       this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: strippedConfig } }));
    }
  }

  _changed(ev, explicitField = null) {
    ev.stopPropagation();
    const field = explicitField || ev.target?.dataset?.field;
    if (!field || !this._config) return;

    let value = this._val(ev);

    // Special handling for persons_entities array field
    if (field === "persons_entities") {
      // Value is already an array from the custom handler, use it directly
      if (Array.isArray(value)) {
        this._config = { ...this._config, [field]: value };
        const strippedConfig = this._stripDefaults(this._config);
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: strippedConfig } }));
        this.requestUpdate();
        return;
      }
    }

    // Card border radius: allow users to enter just a number (interpreted as px at render time)
    // while still allowing any valid CSS value (e.g., 12px, 0, 50%, var(--x)).
    // IMPORTANT: do NOT auto-append "px" or coerce to Number here, because @input fires per-keystroke
    // and coercion can interfere with typing (e.g., "12." or "-" while editing).
    // Same applies to persons_border_radius.
    if (field === "card_border_radius" || field === "card_border_radius_top" || field === "card_border_radius_bottom" || field === "persons_border_radius") {
      const s = (value ?? "").toString().trim();
      value = s; // store raw string; conversion happens when building CSS
    }

    // Use pre-computed static sets for field type checking
    const { _numericFields, _nullableNumericFields, _booleanFields } = HkiHeaderCardEditor;

    if (_nullableNumericFields.has(field)) {
      value = value === "" || value == null ? null : toNum(value, null);
      if (value === null || !Number.isFinite(value)) value = null;
    } else if (_numericFields.has(field)) {
      const n = Number(value);
      if (!Number.isFinite(n)) return;
      value = n;
    }

    if (_booleanFields.has(field)) value = !!(ev.target?.checked ?? value);

    let next;

    if (field.includes(".")) {
      const [rootField, subField] = field.split(".");
      const currentValue = this._config[rootField] || {};
      next = { ...this._config, [rootField]: { ...currentValue, [subField]: value } };

      if (subField === "action" && value === "perform-action") {
        next[rootField] = { ...next[rootField], perform_action: next[rootField].perform_action ?? "" };
      } else if (subField === "action" && value === "call-service") {
        // Legacy support for old call-service action
        next[rootField] = { ...next[rootField], service: next[rootField].service ?? "", service_data: next[rootField].service_data ?? "entity_id: \n" };
      }
    } else {
      next = { ...this._config, [field]: value };
    }

    if (field === "badges_fixed") {
      const currentOffset = this._config.badges_offset;
      if (currentOffset === 48 || currentOffset === 100 || currentOffset === 0) {
        next.badges_offset = value ? 48 : 100;
      }
    }

    this._config = next;
    const strippedConfig = this._stripDefaults(next);
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: strippedConfig } }));
    this.requestUpdate();
  }

  _renderTemplateEditor(label, field, options = {}) {
    // options.value / options.onchange allow standalone use outside of this._config
    const hasCustomBinding = options.onchange !== undefined;
    const value = hasCustomBinding ? (options.value ?? "") : (this._config?.[field] ?? "");
    return html`
      <div class="section">${label}</div>
      <ha-code-editor
        .hass=${this.hass}
        .value=${value}
        mode="jinja2"
        autocomplete-entities
        @value-changed=${(ev) => {
          ev.stopPropagation();
          const newValue = ev.detail?.value ?? "";
          if (newValue === value) return;
          if (hasCustomBinding) {
            options.onchange(newValue);
          } else {
            this._config = { ...this._config, [field]: newValue };
            const strippedConfig = this._stripDefaults(this._config);
            this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: strippedConfig }, bubbles: true, composed: true }));
          }
        }}
        @click=${(e) => e.stopPropagation()}
      ></ha-code-editor>
    `;
  }

  // Removed - using ha-yaml-editor inline instead

  _getSlotLabel(type) {
    const labels = {
      none: "Empty",
      spacer: "Spacer",
      weather: "Weather",
      datetime: "Date/Time",
      notifications: "Notifications",
      custom: "Notifications",
      card: "Custom Card",
      button: "Button"
    };
    return labels[type] || "Empty";
  }

  _renderSlotEditor(slotName, bar = "top_bar") {
    const prefix = `${bar}_${slotName}_`;
    const type = this._config[`${bar}_${slotName}`] || "none";
    const useGlobal = this._config[prefix + "use_global"] !== false;
    
    const displayType = (type === "custom") ? "notifications" : type;
    return html`
      <ha-select label="Content Type" .value=${displayType} data-field="${bar}_${slotName}" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
        <mwc-list-item value="none">None</mwc-list-item>
        <mwc-list-item value="spacer">Spacer</mwc-list-item>
        <mwc-list-item value="weather">Weather</mwc-list-item>
        <mwc-list-item value="datetime">Date/Time</mwc-list-item>
        <mwc-list-item value="notifications">Notifications</mwc-list-item>
        <mwc-list-item value="card">Custom Card</mwc-list-item>
        <mwc-list-item value="button">Button</mwc-list-item>
      </ha-select>
      
      ${type !== "none" && type !== "spacer" ? html`
        <div class="section" style="margin-top: 12px;">Alignment</div>
        <ha-select label="Content Alignment" .value=${this._config[prefix + "align"] || (slotName === "left" ? "start" : slotName === "right" ? "end" : "center")} data-field="${prefix}align" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
          <mwc-list-item value="start">Start (left)</mwc-list-item>
          <mwc-list-item value="center">Center</mwc-list-item>
          <mwc-list-item value="end">End (right)</mwc-list-item>
          ${(type === "card" || type === "notifications" || type === "custom") ? html`
            <mwc-list-item value="stretch">Stretch (fill available slots)</mwc-list-item>
          ` : ''}
        </ha-select>
        <div class="section" style="margin-top: 12px;">Position Offset</div>
        <div class="inline-fields-2">
          <ha-textfield label="X offset (px)" type="number" .value=${String(this._config[prefix + "offset_x"] || 0)} data-field="${prefix}offset_x" @input=${this._changed}></ha-textfield>
          <ha-textfield label="Y offset (px)" type="number" .value=${String(this._config[prefix + "offset_y"] || 0)} data-field="${prefix}offset_y" @input=${this._changed}></ha-textfield>
        </div>
        <div class="inline-fields-2">
          <ha-textfield label="Mobile X offset (px)" type="number" .value=${this._config[prefix + "offset_x_mobile"] == null ? "" : String(this._config[prefix + "offset_x_mobile"])} data-field="${prefix}offset_x_mobile" @input=${this._changed}></ha-textfield>
          <ha-textfield label="Mobile Y offset (px)" type="number" .value=${this._config[prefix + "offset_y_mobile"] == null ? "" : String(this._config[prefix + "offset_y_mobile"])} data-field="${prefix}offset_y_mobile" @input=${this._changed}></ha-textfield>
        </div>
        
        <div class="switch-row" style="margin-top: 8px;">
            <ha-switch .checked=${!!this._config[prefix + "overflow"]} data-field="${prefix}overflow" @change=${this._changed}></ha-switch>
            <span>Allow Overflow (content bleeds out)</span>
        </div>
      ` : ''}

      ${type === "weather" ? html`
        <div class="section" style="margin-top: 12px;">Weather Settings</div>
        ${this._renderEntityPicker("Weather entity", prefix + "weather_entity", this._config[prefix + "weather_entity"] || this._config.weather_entity || "", "Select a weather entity", "weather")}
        
        <div class="inline-fields-3" style="margin-top: 8px;">
            <div class="switch-row"><ha-switch .checked=${this._config[prefix + "show_icon"] !== false} data-field="${prefix}show_icon" @change=${this._changed}></ha-switch><span>Icon</span></div>
            <div class="switch-row"><ha-switch .checked=${this._config[prefix + "show_condition"] !== false} data-field="${prefix}show_condition" @change=${this._changed}></ha-switch><span>Condition</span></div>
            <div class="switch-row"><ha-switch .checked=${this._config[prefix + "show_temperature"] !== false} data-field="${prefix}show_temperature" @change=${this._changed}></ha-switch><span>Temp</span></div>
            <div class="switch-row"><ha-switch .checked=${!!this._config[prefix + "show_humidity"]} data-field="${prefix}show_humidity" @change=${this._changed}></ha-switch><span>Humidity</span></div>
            <div class="switch-row"><ha-switch .checked=${!!this._config[prefix + "show_wind"]} data-field="${prefix}show_wind" @change=${this._changed}></ha-switch><span>Wind</span></div>
            <div class="switch-row"><ha-switch .checked=${!!this._config[prefix + "show_pressure"]} data-field="${prefix}show_pressure" @change=${this._changed}></ha-switch><span>Pressure</span></div>
        </div>
        
        <ha-textfield label="Icon pack path (SVG)" helper="Path to folder (e.g., /local/icons/weather)" .value=${this._config[prefix + "icon_pack_path"] || ""} data-field="${prefix}icon_pack_path" @input=${this._changed}></ha-textfield>

        <div class="switch-row" style="margin-top: 8px;">
            <ha-switch .checked=${this._config[prefix + "weather_colored_icons"] !== false} data-field="${prefix}weather_colored_icons" @change=${this._changed}></ha-switch>
            <span>Colored icons</span>
        </div>
        
        <div class="inline-fields-2">
          <ha-select label="Icon color mode" .value=${this._config[prefix + "weather_icon_color_mode"] || "state"} data-field="${prefix}weather_icon_color_mode" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
            <mwc-list-item value="state">By condition</mwc-list-item>
            <mwc-list-item value="custom">Custom</mwc-list-item>
            <mwc-list-item value="inherit">Inherit</mwc-list-item>
          </ha-select>
          <ha-select label="Icon animation" .value=${this._config[prefix + "animate_icon"] || "none"} data-field="${prefix}animate_icon" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
            <mwc-list-item value="none">None</mwc-list-item>
            <mwc-list-item value="float">Float</mwc-list-item>
            <mwc-list-item value="pulse">Pulse</mwc-list-item>
            <mwc-list-item value="spin">Spin</mwc-list-item>
          </ha-select>
        </div>
        ${this._config[prefix + "weather_icon_color_mode"] === "custom" ? html`
            <ha-textfield label="Custom icon color (CSS)" .value=${this._config[prefix + "weather_icon_color"] || ""} data-field="${prefix}weather_icon_color" @input=${this._changed}></ha-textfield>
        ` : ""}
      ` : ''}

      ${type === "datetime" ? html`
        <div class="section" style="margin-top: 12px;">Date/Time Settings</div>
        <div class="inline-fields-3">
          <div class="switch-row"><ha-switch .checked=${this._config[prefix + "show_day"] !== false} data-field="${prefix}show_day" @change=${this._changed}></ha-switch><span>Day</span></div>
          <div class="switch-row"><ha-switch .checked=${this._config[prefix + "show_date"] !== false} data-field="${prefix}show_date" @change=${this._changed}></ha-switch><span>Date</span></div>
          <div class="switch-row"><ha-switch .checked=${this._config[prefix + "show_time"] !== false} data-field="${prefix}show_time" @change=${this._changed}></ha-switch><span>Time</span></div>
        </div>
        
        <ha-textfield label="Time format" helper="HH:mm (24h) or h:mm A (12h)" .value=${this._config[prefix + "time_format"] || "HH:mm"} data-field="${prefix}time_format" @input=${this._changed}></ha-textfield>
        <ha-textfield label="Date format" helper="D MMM, DD/MM/YYYY, MMMM D, etc." .value=${this._config[prefix + "date_format"] || "D MMM"} data-field="${prefix}date_format" @input=${this._changed}></ha-textfield>
        <ha-textfield label="Separator" .value=${this._config[prefix + "separator"] || " • "} data-field="${prefix}separator" @input=${this._changed}></ha-textfield>
        
        ${this._renderIconPicker("Icon", prefix + "icon", this._config[prefix + "icon"] || "", "Optional icon")}
        <ha-select label="Icon animation" .value=${this._config[prefix + "animate_icon"] || "none"} data-field="${prefix}animate_icon" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
            <mwc-list-item value="none">None</mwc-list-item>
            <mwc-list-item value="float">Float</mwc-list-item>
            <mwc-list-item value="pulse">Pulse</mwc-list-item>
            <mwc-list-item value="spin">Spin</mwc-list-item>
        </ha-select>
      ` : ''}
      
      ${type === "button" ? html`
        <div class="section" style="margin-top: 12px;">Button Settings</div>
        <ha-icon-picker label="Icon" .value=${this._config[prefix + "icon"] || "mdi:gesture-tap"} data-field="${prefix}icon" @value-changed=${(e) => this._changed({target: {value: e.detail.value, dataset: {field: prefix + "icon"}}})}></ha-icon-picker>
        <ha-textfield label="Label (optional)" .value=${this._config[prefix + "label"] || ""} data-field="${prefix}label" @input=${this._changed}></ha-textfield>
      ` : ''}
      
      ${(type === "notifications" || type === "custom") ? html`
          <ha-alert alert-type="info" style="margin-bottom: 8px;">
            This requires the <b>hki-notify</b> integration and the <b>custom:hki-notification-card</b> resource.
          </ha-alert>
          <p style="opacity: 0.7; font-size: 0.9em; margin-top: 8px;">Enable "Use Header Styling" in the notification card below to inherit styling from the Global Styling (Defaults) settings.</p>
          <div class="card-config">
            <hui-card-element-editor
              .hass=${this.hass}
              .lovelace=${this._getLovelace()}
              .value=${{ 
                type: "custom:hki-notification-card", 
                use_header_styling: true, 
                show_background: false,
                show_empty: true,
                ...(this._config[`${bar}_${slotName}_card`] || {})
              }}
              @config-changed=${(ev) => this._handleCustomCardChange(ev, slotName, bar)}
            ></hui-card-element-editor>
          </div>
      ` : ''}
      
      ${type === "card" ? html`
          <div class="card-config">
            <hui-card-element-editor
              .hass=${this.hass}
              .lovelace=${this._getLovelace()}
              .value=${this._config[`${bar}_${slotName}_card`] || { type: "vertical-stack", cards: [] }}
              @config-changed=${(ev) => this._handleCustomCardChange(ev, slotName, bar)}
            ></hui-card-element-editor>
          </div>
      ` : ''}
      
      ${type === "spacer" ? html`
        <div class="section" style="margin-top: 12px;">Actions</div>
        ${this._renderActionEditor("Tap action", prefix + "tap_action")}
        ${this._renderActionEditor("Hold action", prefix + "hold_action")}
        ${this._renderActionEditor("Double tap action", prefix + "double_tap_action")}
        ${this._renderSlotPopupEditor(prefix)}
      ` : ''}
      
      ${(type === "weather" || type === "datetime" || type === "button") ? html`
        <div class="section" style="margin-top: 12px;">Actions</div>
        ${this._renderActionEditor("Tap action", prefix + "tap_action")}
        ${this._renderActionEditor("Hold action", prefix + "hold_action")}
        ${this._renderActionEditor("Double tap action", prefix + "double_tap_action")}
        ${this._renderSlotPopupEditor(prefix)}
      ` : ''}
      
      ${type !== "none" && type !== "notifications" && type !== "custom" && type !== "card" && type !== "spacer" ? html`
        <div class="section" style="margin-top: 12px;">Styling</div>
        <div class="switch-row">
          <ha-switch .checked=${useGlobal} data-field="${prefix}use_global" @change=${this._changed}></ha-switch>
          <span>Use global styling</span>
        </div>
        
        ${!useGlobal ? html`
          <div class="inline-fields-2">
            <ha-textfield label="Font Size (px)" type="number" .value=${String(this._config[prefix + "size_px"] ?? "")} data-field="${prefix}size_px" @input=${this._changed}></ha-textfield>
            <ha-select label="Font Weight" .value=${this._config[prefix + "weight"] || ""} data-field="${prefix}weight" @selected=${this._changed} @closed=${this._changed}>
              <mwc-list-item value="">Use Global</mwc-list-item>
              ${["light", "regular", "medium", "semibold", "bold", "extrabold"].map(w => html`<mwc-list-item .value=${w}>${w.charAt(0).toUpperCase() + w.slice(1)}</mwc-list-item>`)}
            </ha-select>
          </div>
          <ha-textfield label="Text Color" .value=${this._config[prefix + "color"] || ""} data-field="${prefix}color" @input=${this._changed}></ha-textfield>
          
          <div class="switch-row">
            <ha-switch .checked=${this._config[prefix + "pill"] === true} data-field="${prefix}pill" @change=${this._changed}></ha-switch>
            <span>Enable Pill Style</span>
          </div>
          ${this._config[prefix + "pill"] ? html`
            <ha-textfield label="Pill Background" .value=${this._config[prefix + "pill_background"] || ""} data-field="${prefix}pill_background" @input=${this._changed}></ha-textfield>
            <div class="inline-fields-2">
              <ha-textfield label="Padding X" type="number" .value=${String(this._config[prefix + "pill_padding_x"] ?? "")} data-field="${prefix}pill_padding_x" @input=${this._changed}></ha-textfield>
              <ha-textfield label="Padding Y" type="number" .value=${String(this._config[prefix + "pill_padding_y"] ?? "")} data-field="${prefix}pill_padding_y" @input=${this._changed}></ha-textfield>
            </div>
            <div class="inline-fields-2">
              <ha-textfield label="Border Radius" type="number" .value=${String(this._config[prefix + "pill_radius"] ?? "")} data-field="${prefix}pill_radius" @input=${this._changed}></ha-textfield>
              <ha-textfield label="Blur" type="number" .value=${String(this._config[prefix + "pill_blur"] ?? "")} data-field="${prefix}pill_blur" @input=${this._changed}></ha-textfield>
            </div>
          ` : ''}
        ` : ''}
      ` : ''}
    `;
  }

  _renderSlotPopupEditor(prefix, entityId = null) {
    const cfg = this._config;
    const effectiveEntity = entityId
      || cfg[prefix + "tap_action"]?.entity
      || cfg[prefix + "hold_action"]?.entity
      || null;
    const domain = effectiveEntity ? effectiveEntity.split('.')[0] : null;
    const selectedEntity = (effectiveEntity && this.hass?.states?.[effectiveEntity]) || null;
    const hasChildren = selectedEntity?.attributes?.entity_id && Array.isArray(selectedEntity.attributes.entity_id);
    const isLightGroup = domain === 'light' && hasChildren;

    const enabled = !!cfg[prefix + "custom_popup_enabled"];
    const p = (k) => cfg[prefix + k];
    const pp = (patch) => {
      const mapped = {};
      Object.keys(patch).forEach(k => mapped[prefix + k] = patch[k]);
      this._config = { ...this._config, ...mapped };
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._stripDefaults(this._config) }, bubbles: true, composed: true }));
      this.requestUpdate();
    };
    const popupAnimOptions = HKI_POPUP_EDITOR_OPTIONS.animations;
    const popupWidthOptions = HKI_POPUP_EDITOR_OPTIONS.width;
    const popupHeightOptions = HKI_POPUP_EDITOR_OPTIONS.height;
    const popupTimeFormatOptions = HKI_POPUP_EDITOR_OPTIONS.timeFormats;
    const popupBottomBarActionOptions = HKI_EDITOR_OPTIONS.popupBottomBarActionOptions;
    const popupDefaultViewOptions = HKI_EDITOR_OPTIONS.popupDefaultViewOptions;
    const popupDefaultSectionOptions = HKI_EDITOR_OPTIONS.popupDefaultSectionOptions;
    const popupBottomBarAlignOptions = HKI_EDITOR_OPTIONS.popupBottomBarAlignOptions;

    return html`
      <div class="section" style="margin-top: 12px;">HKI More Info Popup</div>
      <p style="font-size: 11px; opacity: 0.7; margin: 4px 0 8px 0;">Settings for the HKI More Info popup. Apply when an action on this slot is set to "HKI More Info".</p>

      <details class="box-section">
        <summary>Popup Header</summary>
        <div class="box-content">
          ${this._renderTemplateEditor("Name (optional, supports Jinja)", "hki_popup_name_" + prefix, { value: p("popup_name") || "", onchange: (v) => pp({ "popup_name": v || undefined }) })}
          ${this._renderTemplateEditor("State text (optional, supports Jinja)", "hki_popup_state_" + prefix, { value: p("popup_state") || "", onchange: (v) => pp({ "popup_state": v || undefined }) })}
          ${this._renderTemplateEditor("Icon (optional, supports Jinja)", "hki_popup_icon_" + prefix, { value: p("popup_icon") || "", placeholder: "mdi:home or {{ ... }}", onchange: (v) => pp({ "popup_icon": v || undefined }) })}
          <div class="switch-row" style="margin-top:6px;">
            <ha-switch .checked=${p("popup_use_entity_picture") === true} @change=${(ev) => pp({ "popup_use_entity_picture": ev.target.checked || undefined })}></ha-switch>
            <span>Use entity picture (if available)</span>
          </div>
        </div>
      </details>

      <details class="box-section" open>
        <summary>Popup Card</summary>
        <div class="box-content">
          <p style="font-size: 11px; opacity: 0.7; margin: 0 0 6px 0;">Enable to show a custom card instead of the auto domain popup.</p>
          <div class="switch-row">
            <ha-switch .checked=${enabled} @change=${(ev) => pp({ "custom_popup_enabled": ev.target.checked })}></ha-switch>
            <span>Enable custom popup card</span>
          </div>
          ${enabled ? html`
            <div class="card-config">
              ${customElements.get('hui-card-element-editor') ? html`
                <hui-card-element-editor
                  .hass=${this.hass}
                  .lovelace=${this._getLovelace()}
                  .value=${p("custom_popup_card") || { type: "vertical-stack", cards: [] }}
                  @config-changed=${(ev) => {
                    ev.stopPropagation();
                    const newCard = ev.detail?.config;
                    if (newCard && JSON.stringify(newCard) !== JSON.stringify(p("custom_popup_card"))) pp({ "custom_popup_card": newCard });
                  }}
                ></hui-card-element-editor>
              ` : html`<p style="font-size:11px;opacity:0.6;">Card editor not available. Use YAML mode.</p>`}
            </div>
          ` : ''}
        </div>
      </details>

      <details class="box-section">
        <summary>Animation</summary>
        <div class="box-content">
          <div class="inline-fields-2">
            <ha-select label="Open Animation" .value=${p("popup_open_animation") || "scale"}
              @selected=${(ev) => { ev.stopPropagation(); pp({ "popup_open_animation": ev.target.value }); }}
              @closed=${(ev) => ev.stopPropagation()}>
              ${popupAnimOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
            </ha-select>
            <ha-select label="Close Animation" .value=${p("popup_close_animation") || p("popup_open_animation") || "scale"}
              @selected=${(ev) => { ev.stopPropagation(); pp({ "popup_close_animation": ev.target.value }); }}
              @closed=${(ev) => ev.stopPropagation()}>
              ${popupAnimOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
            </ha-select>
          </div>
          <ha-textfield label="Animation Duration (ms)" type="number" .value=${String(p("popup_animation_duration") ?? 300)} @input=${(ev) => pp({ "popup_animation_duration": Number(ev.target.value) })}></ha-textfield>
        </div>
      </details>

      <details class="box-section">
        <summary>Container & Size</summary>
        <div class="box-content">
          <ha-textfield label="Border Radius (px)" type="number" .value=${String(p("popup_border_radius") ?? 16)} @input=${(ev) => pp({ "popup_border_radius": Number(ev.target.value) })}></ha-textfield>
          <div class="inline-fields-2">
            <ha-select label="Width" .value=${p("popup_width") || "auto"}
              @selected=${(ev) => { ev.stopPropagation(); pp({ "popup_width": ev.target.value }); }}
              @closed=${(ev) => ev.stopPropagation()}>
              ${popupWidthOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
            </ha-select>
            ${p("popup_width") === "custom" ? html`<ha-textfield label="Custom Width (px)" type="number" .value=${String(p("popup_width_custom") ?? 400)} @input=${(ev) => pp({ "popup_width_custom": Number(ev.target.value) })}></ha-textfield>` : html`<div></div>`}
          </div>
          <div class="inline-fields-2">
            <ha-select label="Height" .value=${p("popup_height") || "auto"}
              @selected=${(ev) => { ev.stopPropagation(); pp({ "popup_height": ev.target.value }); }}
              @closed=${(ev) => ev.stopPropagation()}>
              ${popupHeightOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
            </ha-select>
            ${p("popup_height") === "custom" ? html`<ha-textfield label="Custom Height (px)" type="number" .value=${String(p("popup_height_custom") ?? 600)} @input=${(ev) => pp({ "popup_height_custom": Number(ev.target.value) })}></ha-textfield>` : html`<div></div>`}
          </div>
        </div>
      </details>

      <details class="box-section">
        <summary>Blur & Glass Effect</summary>
        <div class="box-content">
          <p style="font-size: 11px; opacity: 0.7; margin: 0 0 4px 0;">Background (portal)</p>
          <div class="switch-row">
            <ha-switch .checked=${p("popup_blur_enabled") !== false} @change=${(ev) => pp({ "popup_blur_enabled": ev.target.checked })}></ha-switch>
            <span>Enable background blur</span>
          </div>
          <ha-textfield label="Blur Amount (px)" type="number" .value=${String(p("popup_blur_amount") ?? 10)} @input=${(ev) => pp({ "popup_blur_amount": Number(ev.target.value) })} .disabled=${p("popup_blur_enabled") === false}></ha-textfield>
          <p style="font-size: 11px; opacity: 0.7; margin: 4px 0 4px 0;">Card glass effect</p>
          <div class="switch-row">
            <ha-switch .checked=${p("popup_card_blur_enabled") !== false} @change=${(ev) => pp({ "popup_card_blur_enabled": ev.target.checked })}></ha-switch>
            <span>Enable card blur (frosted glass)</span>
          </div>
          <div class="inline-fields-2">
            <ha-textfield label="Card Blur (px)" type="number" .value=${String(p("popup_card_blur_amount") ?? 40)} @input=${(ev) => pp({ "popup_card_blur_amount": Number(ev.target.value) })} .disabled=${p("popup_card_blur_enabled") === false}></ha-textfield>
            <ha-textfield label="Card Opacity" type="number" step="0.1" min="0" max="1" .value=${String(p("popup_card_opacity") ?? 0.4)} @input=${(ev) => pp({ "popup_card_opacity": Number(ev.target.value) })}></ha-textfield>
          </div>
        </div>
      </details>

      ${!enabled ? html`
        ${(hasChildren) ? html`
          <details class="box-section">
            <summary>Default View (Groups)</summary>
            <div class="box-content">
              <div class="inline-fields-2">
                <ha-select label="Default View" .value=${p("popup_default_view") || "main"}
                  @selected=${(ev) => { ev.stopPropagation(); pp({ "popup_default_view": ev.target.value }); }}
                  @closed=${(ev) => ev.stopPropagation()}>
                  ${popupDefaultViewOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
                </ha-select>
                ${isLightGroup ? html`
                  <ha-select label="Default Section" .value=${p("popup_default_section") || "last"}
                    @selected=${(ev) => { ev.stopPropagation(); pp({ "popup_default_section": ev.target.value }); }}
                    @closed=${(ev) => ev.stopPropagation()}>
                    ${popupDefaultSectionOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
                  </ha-select>
                ` : html`<div></div>`}
              </div>
            </div>
          </details>
        ` : ''}

        ${(domain === 'light' || domain === 'cover') ? html`
          <details class="box-section">
            <summary>Features</summary>
            <div class="box-content">
              <div class="switch-row"><ha-switch .checked=${p("popup_show_favorites") !== false} @change=${(ev) => pp({ "popup_show_favorites": ev.target.checked })}></ha-switch><span>Show Favorites</span></div>
              ${domain === 'light' ? html`<div class="switch-row"><ha-switch .checked=${p("popup_show_effects") !== false} @change=${(ev) => pp({ "popup_show_effects": ev.target.checked })}></ha-switch><span>Show Effects</span></div>` : ''}
            </div>
          </details>
        ` : ''}

        ${domain === 'climate' ? html`
          <details class="box-section">
            <summary>Climate Options</summary>
            <div class="box-content">
              <div class="switch-row"><ha-switch .checked=${p("popup_show_presets") !== false} @change=${(ev) => pp({ "popup_show_presets": ev.target.checked })}></ha-switch><span>Show Presets</span></div>
              <ha-textfield label="Temperature Step Size" type="number" step="0.1" .value=${String(p("climate_temp_step") ?? 0.5)} @input=${(ev) => pp({ "climate_temp_step": Number(ev.target.value) })} placeholder="0.5"></ha-textfield>
              <div class="switch-row"><ha-switch .checked=${p("climate_use_circular_slider") === true} @change=${(ev) => pp({ "climate_use_circular_slider": ev.target.checked })}></ha-switch><span>Use Circular Slider</span></div>
              <div class="switch-row"><ha-switch .checked=${p("climate_show_plus_minus") === true} @change=${(ev) => pp({ "climate_show_plus_minus": ev.target.checked })}></ha-switch><span>Show +/- Buttons</span></div>
              <div class="switch-row"><ha-switch .checked=${p("climate_show_gradient") !== false} @change=${(ev) => pp({ "climate_show_gradient": ev.target.checked })}></ha-switch><span>Show Gradient</span></div>
              <div class="switch-row"><ha-switch .checked=${p("climate_show_target_range") !== false} @change=${(ev) => pp({ "climate_show_target_range": ev.target.checked })}></ha-switch><span>Show Min/Max Target Range (if supported)</span></div>
              <p style="font-size: 12px; font-weight: 500; margin: 8px 0 4px 0;">Extra Sensors (optional)</p>
              <ha-entity-picker .hass=${this.hass} label="Current Temperature Entity" .value=${p("climate_current_temperature_entity") || ""} @value-changed=${(ev) => pp({ "climate_current_temperature_entity": ev.detail.value || undefined })}></ha-entity-picker>
              <ha-textfield label="Temperature Sensor Name" .value=${p("climate_temperature_name") || ""} @input=${(ev) => pp({ "climate_temperature_name": ev.target.value || undefined })}></ha-textfield>
              <ha-entity-picker .hass=${this.hass} label="Humidity Entity" .value=${p("climate_humidity_entity") || ""} @value-changed=${(ev) => pp({ "climate_humidity_entity": ev.detail.value || undefined })}></ha-entity-picker>
              <ha-textfield label="Humidity Sensor Name" .value=${p("climate_humidity_name") || ""} @input=${(ev) => pp({ "climate_humidity_name": ev.target.value || undefined })}></ha-textfield>
              <ha-entity-picker .hass=${this.hass} label="Pressure Entity" .value=${p("climate_pressure_entity") || ""} @value-changed=${(ev) => pp({ "climate_pressure_entity": ev.detail.value || undefined })}></ha-entity-picker>
              <ha-textfield label="Pressure Sensor Name" .value=${p("climate_pressure_name") || ""} @input=${(ev) => pp({ "climate_pressure_name": ev.target.value || undefined })}></ha-textfield>
            </div>
          </details>
        ` : ''}

        ${domain === 'humidifier' ? html`
          <details class="box-section">
            <summary>Humidifier Options</summary>
            <div class="box-content">
              <ha-textfield label="Humidity Step Size" type="number" step="1" .value=${String(p("humidifier_humidity_step") ?? 1)} @input=${(ev) => pp({ "humidifier_humidity_step": Number(ev.target.value) })} placeholder="1"></ha-textfield>
              <div class="switch-row"><ha-switch .checked=${p("humidifier_use_circular_slider") === true} @change=${(ev) => pp({ "humidifier_use_circular_slider": ev.target.checked })}></ha-switch><span>Use Circular Slider</span></div>
              <div class="switch-row"><ha-switch .checked=${p("humidifier_show_plus_minus") === true} @change=${(ev) => pp({ "humidifier_show_plus_minus": ev.target.checked })}></ha-switch><span>Show +/- Buttons</span></div>
              <div class="switch-row"><ha-switch .checked=${p("humidifier_show_gradient") !== false} @change=${(ev) => pp({ "humidifier_show_gradient": ev.target.checked })}></ha-switch><span>Show Gradient</span></div>
              <ha-entity-picker .hass=${this.hass} label="Fan Speed Entity (select or fan)" .value=${p("humidifier_fan_entity") || ""} @value-changed=${(ev) => pp({ "humidifier_fan_entity": ev.detail.value || undefined })}></ha-entity-picker>
            </div>
          </details>
        ` : ''}

        ${(domain === 'sensor' || domain === 'input_number') ? html`
          <details class="box-section">
            <summary>Sensor Graph Options</summary>
            <div class="box-content">
              <ha-select label="Graph Style" .value=${p("sensor_graph_style") || "line"}
                @selected=${(ev) => { ev.stopPropagation(); pp({ sensor_graph_style: ev.target.value }); }}
                @closed=${(ev) => ev.stopPropagation()}>
                <mwc-list-item value="line">Line Graph</mwc-list-item>
                <mwc-list-item value="bar">Bar Chart</mwc-list-item>
              </ha-select>
              <div class="switch-row"><ha-switch .checked=${p("sensor_graph_gradient") !== false} @change=${(ev) => pp({ sensor_graph_gradient: ev.target.checked })}></ha-switch><span>Temperature Gradient</span></div>
              <ha-textfield label="Fixed Line Color (overrides gradient)" .value=${p("sensor_graph_color") || ""} @input=${(ev) => pp({ sensor_graph_color: ev.target.value || undefined })} placeholder="e.g. #2196F3"></ha-textfield>
              <ha-textfield label="Line Width (px)" type="number" .value=${String(p("sensor_line_width") ?? 3)} @input=${(ev) => pp({ sensor_line_width: Number(ev.target.value) })}></ha-textfield>
              <ha-textfield label="Default Time Range (hours)" type="number" .value=${String(p("sensor_hours") ?? 24)} @input=${(ev) => pp({ sensor_hours: Number(ev.target.value) })} placeholder="24"></ha-textfield>
            </div>
          </details>
        ` : ''}

        ${domain === 'person' ? html`
          <details class="box-section">
            <summary>Person Map Options</summary>
            <div class="box-content">
              <p style="font-size: 11px; opacity: 0.7; margin: 0 0 6px 0;">Link a geocoded address sensor to show the real street address on the map pin.</p>
              <ha-entity-picker .hass=${this.hass} label="Geocoded Address Entity" .value=${p("person_geocoded_entity") || ""}
                @value-changed=${(ev) => pp({ person_geocoded_entity: ev.detail.value || undefined })}
                allow-custom-entity></ha-entity-picker>
            </div>
          </details>
        ` : ''}

        <details class="box-section">
          <summary>Content Display</summary>
          <div class="box-content">
            <ha-textfield label="Slider Border Radius (px)" type="number" .value=${String(p("popup_slider_radius") ?? 12)} @input=${(ev) => pp({ "popup_slider_radius": Number(ev.target.value) })}></ha-textfield>
            <div class="switch-row"><ha-switch .checked=${p("popup_hide_button_text") === true} @change=${(ev) => pp({ "popup_hide_button_text": ev.target.checked })}></ha-switch><span>Hide Text Under Buttons</span></div>
            <p style="font-size: 11px; opacity: 0.7; margin: 4px 0 2px 0;">Value Display (Temperature/Brightness)</p>
            <div class="inline-fields-2">
              <ha-textfield label="Font Size (px)" type="number" .value=${String(p("popup_value_font_size") ?? 36)} @input=${(ev) => pp({ "popup_value_font_size": Number(ev.target.value) })}></ha-textfield>
              <ha-textfield label="Font Weight" type="number" .value=${String(p("popup_value_font_weight") ?? 300)} @input=${(ev) => pp({ "popup_value_font_weight": Number(ev.target.value) })}></ha-textfield>
            </div>
            <p style="font-size: 11px; opacity: 0.7; margin: 4px 0 2px 0;">Label Display (Color/Mode Names)</p>
            <div class="inline-fields-2">
              <ha-textfield label="Font Size (px)" type="number" .value=${String(p("popup_label_font_size") ?? 16)} @input=${(ev) => pp({ "popup_label_font_size": Number(ev.target.value) })}></ha-textfield>
              <ha-textfield label="Font Weight" type="number" .value=${String(p("popup_label_font_weight") ?? 400)} @input=${(ev) => pp({ "popup_label_font_weight": Number(ev.target.value) })}></ha-textfield>
            </div>
            <ha-select label="Time Format" .value=${p("popup_time_format") || "auto"}
              @selected=${(ev) => { ev.stopPropagation(); pp({ "popup_time_format": ev.target.value }); }}
              @closed=${(ev) => ev.stopPropagation()}>
              ${popupTimeFormatOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
            </ha-select>
          </div>
        </details>

        <details class="box-section">
          <summary>Active Button Styling</summary>
          <div class="box-content">
            <div class="inline-fields-2">
              <ha-textfield label="Color" .value=${p("popup_highlight_color") || ""} @input=${(ev) => pp({ "popup_highlight_color": ev.target.value || undefined })} placeholder="var(--primary-color)"></ha-textfield>
              <ha-textfield label="Text Color" .value=${p("popup_highlight_text_color") || ""} @input=${(ev) => pp({ "popup_highlight_text_color": ev.target.value || undefined })} placeholder="white"></ha-textfield>
            </div>
            <div class="inline-fields-2">
              <ha-textfield label="Border Radius (px)" type="number" .value=${p("popup_highlight_radius") ?? ""} @input=${(ev) => pp({ "popup_highlight_radius": Number(ev.target.value) || undefined })} placeholder="8"></ha-textfield>
              <ha-textfield label="Opacity" type="number" step="0.1" min="0" max="1" .value=${p("popup_highlight_opacity") ?? ""} @input=${(ev) => pp({ "popup_highlight_opacity": Number(ev.target.value) || undefined })} placeholder="1"></ha-textfield>
            </div>
            <div class="inline-fields-2">
              <ha-textfield label="Border Color" .value=${p("popup_highlight_border_color") || ""} @input=${(ev) => pp({ "popup_highlight_border_color": ev.target.value || undefined })}></ha-textfield>
              <ha-textfield label="Border Width" .value=${p("popup_highlight_border_width") || ""} @input=${(ev) => pp({ "popup_highlight_border_width": ev.target.value || undefined })}></ha-textfield>
            </div>
            <ha-textfield label="Box Shadow" .value=${p("popup_highlight_box_shadow") || ""} @input=${(ev) => pp({ "popup_highlight_box_shadow": ev.target.value || undefined })}></ha-textfield>
          </div>
        </details>

        <details class="box-section">
          <summary>Button Styling</summary>
          <div class="box-content">
            <div class="inline-fields-2">
              <ha-textfield label="Background" .value=${p("popup_button_bg") || ""} @input=${(ev) => pp({ "popup_button_bg": ev.target.value || undefined })}></ha-textfield>
              <ha-textfield label="Text Color" .value=${p("popup_button_text_color") || ""} @input=${(ev) => pp({ "popup_button_text_color": ev.target.value || undefined })}></ha-textfield>
            </div>
            <div class="inline-fields-2">
              <ha-textfield label="Border Radius (px)" type="number" .value=${p("popup_button_radius") ?? ""} @input=${(ev) => pp({ "popup_button_radius": Number(ev.target.value) || undefined })}></ha-textfield>
              <ha-textfield label="Opacity" type="number" step="0.1" min="0" max="1" .value=${p("popup_button_opacity") ?? ""} @input=${(ev) => pp({ "popup_button_opacity": Number(ev.target.value) || undefined })}></ha-textfield>
            </div>
            <div class="inline-fields-2">
              <ha-textfield label="Border Color" .value=${p("popup_button_border_color") || ""} @input=${(ev) => pp({ "popup_button_border_color": ev.target.value || undefined })}></ha-textfield>
              <ha-textfield label="Border Width" .value=${p("popup_button_border_width") || ""} @input=${(ev) => pp({ "popup_button_border_width": ev.target.value || undefined })}></ha-textfield>
            </div>
          </div>
        </details>

        <details class="box-section">
          <summary>Bottom Bar Entities</summary>
          <div class="box-content">
            <p style="font-size: 11px; opacity: 0.7; margin: 0 0 6px 0;">Add up to 8 icon buttons to the popup bottom bar.</p>
            <ha-select label="Button Alignment" .value=${p('popup_bottom_bar_align') || 'spread'}
              @selected=${(ev) => { ev.stopPropagation(); pp({ popup_bottom_bar_align: ev.target.value }); }}
              @closed=${(ev) => ev.stopPropagation()}>
              ${popupBottomBarAlignOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
            </ha-select>
            <div class="switch-row"><ha-switch .checked=${p('popup_hide_bottom_bar') !== true} @change=${(ev) => pp({ popup_hide_bottom_bar: !ev.target.checked })}></ha-switch><span>Show bottom bar</span></div>
            ${(() => {
              const _bbSlots = Math.max(1, Math.min(8, p('_bb_slots') ?? Math.max(1, (p('popup_bottom_bar_entities') || []).filter(Boolean).length || 1)));
              return html`
                <div style="display:flex;align-items:center;gap:8px;margin:10px 0 4px 0;">
                  <span style="font-size:12px;opacity:0.7;flex:1;">Slots: ${_bbSlots}</span>
                  <button style="width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:var(--primary-text-color);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;"
                    @click=${(e) => { e.stopPropagation(); pp({ _bb_slots: Math.max(1, _bbSlots - 1) }); }}>&#8722;</button>
                  <button style="width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:var(--primary-text-color);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;"
                    @click=${(e) => { e.stopPropagation(); pp({ _bb_slots: Math.min(8, _bbSlots + 1) }); }}>+</button>
                </div>
                ${Array.from({ length: _bbSlots }, (_, i) => {
                  const _ents = (p('popup_bottom_bar_entities') || []);
                  const _ent = _ents[i] || {};
                  const _tap = _ent.tap_action || { action: 'more-info' };
                  const _act = _tap.action || 'more-info';
                  const setSlot = (patch) => {
                    const src = (p('popup_bottom_bar_entities') || []);
                    const arr = Array.from({ length: Math.max(src.length, i + 1) }, (_, j) => src[j] || null);
                    arr[i] = { ...(arr[i] || {}), ...patch };
                    while (arr.length > 0 && !arr[arr.length - 1]?.entity) arr.pop();
                    pp({ popup_bottom_bar_entities: arr.length ? arr : undefined });
                  };
                  const setTap = (tap) => setSlot({ tap_action: { ..._tap, ...tap } });
                  return html`
                    <div style="margin-top:8px;padding:10px;background:rgba(255,255,255,0.04);border-radius:10px;">
                      <p style="font-size:11px;opacity:0.7;margin:0 0 6px 0;font-weight:600;">Button ${i+1}</p>
                      <ha-entity-picker .hass=${this.hass} .value=${_ent.entity||''} .label=${"Entity"}
                        @value-changed=${(ev) => setSlot({ entity: ev.detail.value || undefined })}
                        allow-custom-entity></ha-entity-picker>
                      ${_ent.entity ? html`
                        <ha-textfield label="Name (optional)" .value=${_ent.name||''}
                          @input=${(ev) => setSlot({ name: ev.target.value || undefined })} style="margin-top:6px;"></ha-textfield>
                        <ha-textfield label="Icon (optional)" .value=${_ent.icon||''} placeholder="mdi:home"
                          @input=${(ev) => setSlot({ icon: ev.target.value || undefined })} style="margin-top:6px;"></ha-textfield>
                        <ha-select label="Tap Action" .value=${_act}
                          @selected=${(ev) => { ev.stopPropagation(); const v=ev.detail?.value||ev.target?.value; if(v && v!==_act) setTap({ action:v }); }}
                          @closed=${(e)=>e.stopPropagation()} @click=${(e)=>e.stopPropagation()} style="margin-top:6px;">
                          ${popupBottomBarActionOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
                        </ha-select>
                        ${_act==='navigate'?html`<ha-textfield label="Navigation Path" .value=${_tap.navigation_path||''} @input=${(ev)=>setTap({navigation_path:ev.target.value})} style="margin-top:6px;"></ha-textfield>`:''}
                        ${_act==='url'?html`<ha-textfield label="URL" .value=${_tap.url_path||''} @input=${(ev)=>setTap({url_path:ev.target.value})} style="margin-top:6px;"></ha-textfield>`:''}
                        ${_act==='perform-action'?html`<ha-textfield label="Action (domain.service)" .value=${_tap.perform_action||''} @input=${(ev)=>setTap({perform_action:ev.target.value})} style="margin-top:6px;"></ha-textfield>`:''}
                      ` : ''}
                    </div>`;
                })}
              `;
            })()}
          </div>
        </details>
      ` : ''}
    `;
  }
  _renderSlotActionEditor(field) {
    const action = this._config?.[field] || { action: "none" };
    const actionType = action.action || "none";

    const setAction = (nextAction) => {
      this._config = { ...this._config, [field]: nextAction };
      const strippedConfig = this._stripDefaults(this._config);
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: strippedConfig },
          bubbles: true,
          composed: true,
        })
      );
      this.requestUpdate();
    };

      const patchAction = (patch) => {
        const current = this._config?.[field] || { action: "none" };
        setAction({ ...current, ...patch });
      };
      const headerActionOptions = HKI_EDITOR_OPTIONS.headerActionOptions;
    
      return html`
      <ha-select label="Action" .value=${actionType} data-field="${field}.action" @selected=${this._changed} @closed=${this._changed}>
        ${headerActionOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
      </ha-select>
      ${actionType === "navigate" ? html`
        ${this._renderNavigationPathPicker("Navigation path", action.navigation_path || "", (v) => patchAction({ navigation_path: v }))}
      ` : ''}
      ${actionType === "url" ? html`
        <ha-textfield label="URL" .value=${action.url_path || ""} data-field="${field}.url_path" @input=${this._changed}></ha-textfield>
      ` : ''}
      ${actionType === "more-info" || actionType === "toggle" ? html`
        <ha-entity-picker .hass=${this.hass} .value=${action.entity || ""} @value-changed=${(e) => this._changed(e, field + ".entity")}></ha-entity-picker>
      ` : ''}
      ${actionType === "hki-more-info" ? html`
        <ha-entity-picker .hass=${this.hass} .value=${action.entity || ""} label="Override Entity" @value-changed=${(e) => patchAction({ entity: e.detail.value || undefined })}></ha-entity-picker>
        <p style="font-size: 11px; opacity: 0.7; margin: 8px 0 4px 0;">Popup settings (card, animations, header) are configured in the slot's "Custom Popup" section above.</p>
      ` : ''}
      ${actionType === "perform-action" ? html`
        ${customElements.get("ha-service-picker") ? html`
          <ha-service-picker
            .hass=${this.hass}
            .label=${"Action (service)"}
            .value=${action.perform_action || ""}
            @value-changed=${(ev) => {
              ev.stopPropagation();
              const v = ev.detail?.value ?? ev.target?.value ?? "";
              patchAction({ perform_action: String(v || "") });
            }}
            @click=${(e) => e.stopPropagation()}
          ></ha-service-picker>
        ` : html`
          ${(() => {
            const key = `${field}`;
            const full = String(action.perform_action || "");
            const derivedDomain = full.includes(".") ? full.split(".")[0] : "";
            const cachedDomain = this._paDomainCache?.[key] || "";
            const domain = cachedDomain || derivedDomain;
            const derivedService = (full.includes(".") && derivedDomain === domain)
              ? (full.split(".")[1] || "")
              : "";
            const services = (domain && this.hass?.services?.[domain])
              ? Object.keys(this.hass.services[domain]).sort()
              : [];
            return html`
              <div class="inline-fields-2">
                <ha-select
                  label="Domain"
                  .value=${domain || undefined}
                  @selected=${(e) => {
                    const nextDomain = e.target.value || "";
                    this._paDomainCache[key] = nextDomain;
                    // Clear service when domain changes
                    patchAction({ perform_action: "" });
                    this.requestUpdate();
                  }}
                  @closed=${(e) => e.stopPropagation()}
                  @click=${(e) => e.stopPropagation()}
                >
                  <mwc-list-item value=""></mwc-list-item>
                  ${Object.keys(this.hass?.services || {}).sort().map((d) => html`<mwc-list-item .value=${d}>${d}</mwc-list-item>`)}
                </ha-select>

                <ha-select
                  label="Service"
                  .value=${derivedService || undefined}
                  .disabled=${!domain}
                  @selected=${(e) => {
                    const service = e.target.value || "";
                    const d = this._paDomainCache[key] || domain;
                    patchAction({ perform_action: (d && service) ? `${d}.${service}` : "" });
                  }}
                  @closed=${(e) => e.stopPropagation()}
                  @click=${(e) => e.stopPropagation()}
                >
                  <mwc-list-item value=""></mwc-list-item>
                  ${services.map((s) => html`<mwc-list-item .value=${s}>${s}</mwc-list-item>`)}
                </ha-select>
              </div>
            `;
          })()}
        `}

        <ha-selector
          .hass=${this.hass}
          .selector=${{ target: {} }}
          .label=${"Target (optional)"}
          .value=${action.target || null}
          @value-changed=${(ev) => {
            ev.stopPropagation();
            const target = ev.detail?.value;
            const currentTarget = action.target;
            if (JSON.stringify(currentTarget) !== JSON.stringify(target)) {
              const updated = { ...action };
              if (target && Object.keys(target).length > 0) {
                updated.target = target;
              } else {
                delete updated.target;
              }
              setAction(updated);
            }
          }}
          @click=${(e) => e.stopPropagation()}
        ></ha-selector>

        <ha-yaml-editor
          .hass=${this.hass}
          .label=${"Service Data (optional, YAML)"}
          .value=${action.data || null}
          @value-changed=${(ev) => {
            ev.stopPropagation();
            const data = ev.detail?.value;
            const currentData = action.data;
            if (JSON.stringify(currentData) !== JSON.stringify(data)) {
              const updated = { ...action };
              if (data && typeof data === "object" && Object.keys(data).length > 0) {
                updated.data = data;
              } else {
                delete updated.data;
              }
              setAction(updated);
            }
          }}
          @click=${(e) => e.stopPropagation()}
        ></ha-yaml-editor>
      ` : ''}
    `;
  }

  _renderPersonActionEditors(personIndex) {
    const personConfig = this._config.persons_entities[personIndex];
    
    const renderPersonAction = (label, actionType) => {
      const action = personConfig[actionType] || { action: actionType === "tap_action" ? "more-info" : "none" };
      const actionValue = action.action || "none";

      const setAction = (nextAction) => {
        const updated = [...this._config.persons_entities];
        updated[personIndex] = { ...updated[personIndex], [actionType]: nextAction };
        this._config = { ...this._config, persons_entities: updated };
        const strippedConfig = this._stripDefaults(this._config);
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: strippedConfig } }));
        this.requestUpdate();
      };

      const patchAction = (patch) => {
        const current = personConfig[actionType] || { action: "none" };
        setAction({ ...current, ...patch });
      };
      const headerActionOptions = HKI_EDITOR_OPTIONS.headerActionOptions;

      return html`
        <div style="margin-top: 8px;">
          <p style="font-weight: 500; margin-bottom: 4px; font-size: 0.9em;">${label}</p>
          <ha-select label="Action" .value=${actionValue} @selected=${(e) => setAction({ action: e.target.value })} @closed=${(e) => e.stopPropagation()}>
            ${headerActionOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
          </ha-select>
          ${actionValue === "navigate" ? html`
            ${this._renderNavigationPathPicker("Navigation path", action.navigation_path || "", (v) => patchAction({ navigation_path: v }))}
          ` : ''}
          ${actionValue === "url" ? html`
            <ha-textfield label="URL" .value=${action.url_path || ""} @input=${(e) => patchAction({ url_path: e.target.value })}></ha-textfield>
          ` : ''}
          ${actionValue === "more-info" || actionValue === "toggle" ? html`
            <ha-entity-picker .hass=${this.hass} .value=${action.entity || personConfig.entity || ""} @value-changed=${(e) => patchAction({ entity: e.detail.value })}></ha-entity-picker>
          ` : ''}
          ${actionValue === "hki-more-info" ? html`
            <ha-entity-picker .hass=${this.hass} .value=${action.entity || personConfig.entity || ""} label="Override Entity" @value-changed=${(e) => patchAction({ entity: e.detail.value || undefined })}></ha-entity-picker>
            <p style="font-size: 11px; opacity: 0.7; margin: 8px 0 4px 0;">Popup settings are configured in the person's "Custom Popup" section.</p>
          ` : ''}
          ${actionValue === "perform-action" ? html`
            ${customElements.get("ha-service-picker") ? html`
              <ha-service-picker
                .hass=${this.hass}
                .label=${"Action (service)"}
                .value=${action.perform_action || ""}
                @value-changed=${(ev) => {
                  ev.stopPropagation();
                  const v = ev.detail?.value ?? ev.target?.value ?? "";
                  patchAction({ perform_action: String(v || "") });
                }}
                @click=${(e) => e.stopPropagation()}
              ></ha-service-picker>
            ` : html`
              ${(() => {
                const key = `person_${personIndex}_${actionType}`;
                const full = String(action.perform_action || "");
                const derivedDomain = full.includes(".") ? full.split(".")[0] : "";
                const cachedDomain = this._paDomainCache?.[key] || "";
                const domain = cachedDomain || derivedDomain;
                const derivedService = (full.includes(".") && derivedDomain === domain)
                  ? (full.split(".")[1] || "")
                  : "";
                const services = (domain && this.hass?.services?.[domain])
                  ? Object.keys(this.hass.services[domain]).sort()
                  : [];
                return html`
                  <div class="inline-fields-2">
                    <ha-select
                      label="Domain"
                      .value=${domain || undefined}
                      @selected=${(e) => {
                        const nextDomain = e.target.value || "";
                        this._paDomainCache[key] = nextDomain;
                        patchAction({ perform_action: "" });
                        this.requestUpdate();
                      }}
                      @closed=${(e) => e.stopPropagation()}
                      @click=${(e) => e.stopPropagation()}
                    >
                      <mwc-list-item value=""></mwc-list-item>
                      ${Object.keys(this.hass?.services || {}).sort().map((d) => html`<mwc-list-item .value=${d}>${d}</mwc-list-item>`)}
                    </ha-select>

                    <ha-select
                      label="Service"
                      .value=${derivedService || undefined}
                      .disabled=${!domain}
                      @selected=${(e) => {
                        const service = e.target.value || "";
                        const d = this._paDomainCache[key] || domain;
                        patchAction({ perform_action: (d && service) ? `${d}.${service}` : "" });
                      }}
                      @closed=${(e) => e.stopPropagation()}
                      @click=${(e) => e.stopPropagation()}
                    >
                      <mwc-list-item value=""></mwc-list-item>
                      ${services.map((s) => html`<mwc-list-item .value=${s}>${s}</mwc-list-item>`)}
                    </ha-select>
                  </div>
                `;
              })()}
            `}

            <ha-selector
              .hass=${this.hass}
              .selector=${{ target: {} }}
              .label=${"Target (optional)"}
              .value=${action.target || null}
              @value-changed=${(ev) => {
                ev.stopPropagation();
                const target = ev.detail?.value;
                const currentTarget = action.target;
                if (JSON.stringify(currentTarget) !== JSON.stringify(target)) {
                  const updated = { ...action };
                  if (target && Object.keys(target).length > 0) {
                    updated.target = target;
                  } else {
                    delete updated.target;
                  }
                  setAction(updated);
                }
              }}
              @click=${(e) => e.stopPropagation()}
            ></ha-selector>

            <ha-yaml-editor
              .hass=${this.hass}
              .label=${"Service Data (optional, YAML)"}
              .value=${action.data || null}
              @value-changed=${(ev) => {
                ev.stopPropagation();
                const data = ev.detail?.value;
                const currentData = action.data;
                if (JSON.stringify(currentData) !== JSON.stringify(data)) {
                  const updated = { ...action };
                  if (data && typeof data === "object" && Object.keys(data).length > 0) {
                    updated.data = data;
                  } else {
                    delete updated.data;
                  }
                  setAction(updated);
                }
              }}
              @click=${(e) => e.stopPropagation()}
            ></ha-yaml-editor>
          ` : ''}
        </div>
      `;
    };

    const patchPerson = (patch) => {
      const updated = [...this._config.persons_entities];
      updated[personIndex] = { ...updated[personIndex], ...patch };
      this._config = { ...this._config, persons_entities: updated };
      const strippedConfig = this._stripDefaults(this._config);
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: strippedConfig } }));
      this.requestUpdate();
    };

    // Person popup editor — accordion layout matching slot editor
    const pc = personConfig;
    const pv = (k) => pc[k];
    const pp = patchPerson;
    const p_ent = pc.entity || '';
    const p_domain = p_ent ? p_ent.split('.')[0] : null;
    const p_entState = (p_ent && this.hass?.states?.[p_ent]) || null;
    const p_hasChildren = p_entState?.attributes?.entity_id && Array.isArray(p_entState.attributes.entity_id);
    const p_isLightGroup = p_domain === 'light' && p_hasChildren;
    const p_enabled = !!pv('custom_popup_enabled');
    const popupAnimOptions = HKI_POPUP_EDITOR_OPTIONS.animations;
    const popupWidthOptions = HKI_POPUP_EDITOR_OPTIONS.width;
    const popupHeightOptions = HKI_POPUP_EDITOR_OPTIONS.height;
    const popupTimeFormatOptions = HKI_POPUP_EDITOR_OPTIONS.timeFormats;
    const popupBottomBarActionOptions = HKI_EDITOR_OPTIONS.popupBottomBarActionOptions;
    const popupDefaultViewOptions = HKI_EDITOR_OPTIONS.popupDefaultViewOptions;
    const popupDefaultSectionOptions = HKI_EDITOR_OPTIONS.popupDefaultSectionOptions;
    const popupBottomBarAlignOptions = HKI_EDITOR_OPTIONS.popupBottomBarAlignOptions;

    return html`
      ${renderPersonAction('Tap action', 'tap_action')}
      ${renderPersonAction('Hold action', 'hold_action')}
      ${renderPersonAction('Double tap action', 'double_tap_action')}

      <div class="section" style="margin-top: 12px;">HKI More Info Popup</div>
      <p style="font-size: 11px; opacity: 0.7; margin: 4px 0 8px 0;">Settings for the HKI More Info popup triggered by actions on this person.</p>

      <details class="box-section">
        <summary>Popup Header</summary>
        <div class="box-content">
          ${this._renderTemplateEditor('Name (optional, supports Jinja)', 'hki_popup_name_person_' + personIndex, { value: pv('popup_name') || '', onchange: (v) => pp({ popup_name: v || undefined }) })}
          ${this._renderTemplateEditor('State text (optional, supports Jinja)', 'hki_popup_state_person_' + personIndex, { value: pv('popup_state') || '', onchange: (v) => pp({ popup_state: v || undefined }) })}
          ${this._renderTemplateEditor('Icon (optional, supports Jinja)', 'hki_popup_icon_person_' + personIndex, { value: pv('popup_icon') || '', placeholder: 'mdi:account or {{ ... }}', onchange: (v) => pp({ popup_icon: v || undefined }) })}
          <div class="switch-row" style="margin-top:6px;">
            <ha-switch .checked=${pv('popup_use_entity_picture') === true} @change=${(ev) => pp({ popup_use_entity_picture: ev.target.checked || undefined })}></ha-switch>
            <span>Use entity picture (if available)</span>
          </div>
        </div>
      </details>

      <details class="box-section" open>
        <summary>Popup Card</summary>
        <div class="box-content">
          <p style="font-size: 11px; opacity: 0.7; margin: 0 0 6px 0;">Enable to show a custom card instead of the auto domain popup.</p>
          <div class="switch-row">
            <ha-switch .checked=${p_enabled} @change=${(ev) => pp({ custom_popup_enabled: ev.target.checked })}></ha-switch>
            <span>Enable custom popup card</span>
          </div>
          ${p_enabled ? html`
            <div class="card-config">
              ${customElements.get('hui-card-element-editor') ? html`
                <hui-card-element-editor
                  .hass=${this.hass}
                  .lovelace=${this._getLovelace()}
                  .value=${pv('custom_popup_card') || { type: 'vertical-stack', cards: [] }}
                  @config-changed=${(ev) => {
                    ev.stopPropagation();
                    const newCard = ev.detail?.config;
                    if (newCard && JSON.stringify(newCard) !== JSON.stringify(pv('custom_popup_card'))) pp({ custom_popup_card: newCard });
                  }}
                ></hui-card-element-editor>
              ` : html`<p style="font-size:11px;opacity:0.6;">Card editor not available. Use YAML mode.</p>`}
            </div>
          ` : ''}
        </div>
      </details>

      <details class="box-section">
        <summary>Animation</summary>
        <div class="box-content">
          <div class="inline-fields-2">
            <ha-select label="Open Animation" .value=${pv('popup_open_animation') || 'scale'}
              @selected=${(ev) => { ev.stopPropagation(); pp({ popup_open_animation: ev.target.value }); }}
              @closed=${(ev) => ev.stopPropagation()}>
              ${popupAnimOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
            </ha-select>
            <ha-select label="Close Animation" .value=${pv('popup_close_animation') || pv('popup_open_animation') || 'scale'}
              @selected=${(ev) => { ev.stopPropagation(); pp({ popup_close_animation: ev.target.value }); }}
              @closed=${(ev) => ev.stopPropagation()}>
              ${popupAnimOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
            </ha-select>
          </div>
          <ha-textfield label="Animation Duration (ms)" type="number" .value=${String(pv('popup_animation_duration') ?? 300)} @input=${(ev) => pp({ popup_animation_duration: Number(ev.target.value) })}></ha-textfield>
        </div>
      </details>

      <details class="box-section">
        <summary>Container & Size</summary>
        <div class="box-content">
          <ha-textfield label="Border Radius (px)" type="number" .value=${String(pv('popup_border_radius') ?? 16)} @input=${(ev) => pp({ popup_border_radius: Number(ev.target.value) })}></ha-textfield>
          <div class="inline-fields-2">
            <ha-select label="Width" .value=${pv('popup_width') || 'auto'}
              @selected=${(ev) => { ev.stopPropagation(); pp({ popup_width: ev.target.value }); }}
              @closed=${(ev) => ev.stopPropagation()}>
              ${popupWidthOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
            </ha-select>
            ${pv('popup_width') === 'custom' ? html`<ha-textfield label="Custom Width (px)" type="number" .value=${String(pv('popup_width_custom') ?? 400)} @input=${(ev) => pp({ popup_width_custom: Number(ev.target.value) })}></ha-textfield>` : html`<div></div>`}
          </div>
          <div class="inline-fields-2">
            <ha-select label="Height" .value=${pv('popup_height') || 'auto'}
              @selected=${(ev) => { ev.stopPropagation(); pp({ popup_height: ev.target.value }); }}
              @closed=${(ev) => ev.stopPropagation()}>
              ${popupHeightOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
            </ha-select>
            ${pv('popup_height') === 'custom' ? html`<ha-textfield label="Custom Height (px)" type="number" .value=${String(pv('popup_height_custom') ?? 600)} @input=${(ev) => pp({ popup_height_custom: Number(ev.target.value) })}></ha-textfield>` : html`<div></div>`}
          </div>
        </div>
      </details>

      <details class="box-section">
        <summary>Blur & Glass Effect</summary>
        <div class="box-content">
          <p style="font-size: 11px; opacity: 0.7; margin: 0 0 4px 0;">Background (portal)</p>
          <div class="switch-row">
            <ha-switch .checked=${pv('popup_blur_enabled') !== false} @change=${(ev) => pp({ popup_blur_enabled: ev.target.checked })}></ha-switch>
            <span>Enable background blur</span>
          </div>
          <ha-textfield label="Blur Amount (px)" type="number" .value=${String(pv('popup_blur_amount') ?? 10)} @input=${(ev) => pp({ popup_blur_amount: Number(ev.target.value) })} .disabled=${pv('popup_blur_enabled') === false}></ha-textfield>
          <p style="font-size: 11px; opacity: 0.7; margin: 4px 0 4px 0;">Card glass effect</p>
          <div class="switch-row">
            <ha-switch .checked=${pv('popup_card_blur_enabled') !== false} @change=${(ev) => pp({ popup_card_blur_enabled: ev.target.checked })}></ha-switch>
            <span>Enable card blur (frosted glass)</span>
          </div>
          <div class="inline-fields-2">
            <ha-textfield label="Card Blur (px)" type="number" .value=${String(pv('popup_card_blur_amount') ?? 40)} @input=${(ev) => pp({ popup_card_blur_amount: Number(ev.target.value) })} .disabled=${pv('popup_card_blur_enabled') === false}></ha-textfield>
            <ha-textfield label="Card Opacity" type="number" step="0.1" min="0" max="1" .value=${String(pv('popup_card_opacity') ?? 0.4)} @input=${(ev) => pp({ popup_card_opacity: Number(ev.target.value) })}></ha-textfield>
          </div>
        </div>
      </details>

      ${!p_enabled ? html`
        ${p_hasChildren ? html`
          <details class="box-section">
            <summary>Default View (Groups)</summary>
            <div class="box-content">
              <div class="inline-fields-2">
                <ha-select label="Default View" .value=${pv('popup_default_view') || 'main'}
                  @selected=${(ev) => { ev.stopPropagation(); pp({ popup_default_view: ev.target.value }); }}
                  @closed=${(ev) => ev.stopPropagation()}>
                  ${popupDefaultViewOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
                </ha-select>
                ${p_isLightGroup ? html`
                  <ha-select label="Default Section" .value=${pv('popup_default_section') || 'last'}
                    @selected=${(ev) => { ev.stopPropagation(); pp({ popup_default_section: ev.target.value }); }}
                    @closed=${(ev) => ev.stopPropagation()}>
                    ${popupDefaultSectionOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
                  </ha-select>
                ` : html`<div></div>`}
              </div>
            </div>
          </details>
        ` : ''}

        ${(p_domain === 'light' || p_domain === 'cover') ? html`
          <details class="box-section">
            <summary>Features</summary>
            <div class="box-content">
              <div class="switch-row"><ha-switch .checked=${pv('popup_show_favorites') !== false} @change=${(ev) => pp({ popup_show_favorites: ev.target.checked })}></ha-switch><span>Show Favorites</span></div>
              ${p_domain === 'light' ? html`<div class="switch-row"><ha-switch .checked=${pv('popup_show_effects') !== false} @change=${(ev) => pp({ popup_show_effects: ev.target.checked })}></ha-switch><span>Show Effects</span></div>` : ''}
            </div>
          </details>
        ` : ''}

        ${p_domain === 'climate' ? html`
          <details class="box-section">
            <summary>Climate Options</summary>
            <div class="box-content">
              <div class="switch-row"><ha-switch .checked=${pv('popup_show_presets') !== false} @change=${(ev) => pp({ popup_show_presets: ev.target.checked })}></ha-switch><span>Show Presets</span></div>
              <ha-textfield label="Temperature Step Size" type="number" step="0.1" .value=${String(pv('climate_temp_step') ?? 0.5)} @input=${(ev) => pp({ climate_temp_step: Number(ev.target.value) })} placeholder="0.5"></ha-textfield>
              <div class="switch-row"><ha-switch .checked=${pv('climate_use_circular_slider') === true} @change=${(ev) => pp({ climate_use_circular_slider: ev.target.checked })}></ha-switch><span>Use Circular Slider</span></div>
              <div class="switch-row"><ha-switch .checked=${pv('climate_show_plus_minus') === true} @change=${(ev) => pp({ climate_show_plus_minus: ev.target.checked })}></ha-switch><span>Show +/- Buttons</span></div>
              <div class="switch-row"><ha-switch .checked=${pv('climate_show_gradient') !== false} @change=${(ev) => pp({ climate_show_gradient: ev.target.checked })}></ha-switch><span>Show Gradient</span></div>
              <div class="switch-row"><ha-switch .checked=${pv('climate_show_target_range') !== false} @change=${(ev) => pp({ climate_show_target_range: ev.target.checked })}></ha-switch><span>Show Min/Max Target Range (if supported)</span></div>
              <p style="font-size: 12px; font-weight: 500; margin: 8px 0 4px 0;">Extra Sensors (optional)</p>
              <ha-entity-picker .hass=${this.hass} label="Current Temperature Entity" .value=${pv('climate_current_temperature_entity') || ''} @value-changed=${(ev) => pp({ climate_current_temperature_entity: ev.detail.value || undefined })}></ha-entity-picker>
              <ha-textfield label="Temperature Sensor Name" .value=${pv('climate_temperature_name') || ''} @input=${(ev) => pp({ climate_temperature_name: ev.target.value || undefined })}></ha-textfield>
              <ha-entity-picker .hass=${this.hass} label="Humidity Entity" .value=${pv('climate_humidity_entity') || ''} @value-changed=${(ev) => pp({ climate_humidity_entity: ev.detail.value || undefined })}></ha-entity-picker>
              <ha-textfield label="Humidity Sensor Name" .value=${pv('climate_humidity_name') || ''} @input=${(ev) => pp({ climate_humidity_name: ev.target.value || undefined })}></ha-textfield>
              <ha-entity-picker .hass=${this.hass} label="Pressure Entity" .value=${pv('climate_pressure_entity') || ''} @value-changed=${(ev) => pp({ climate_pressure_entity: ev.detail.value || undefined })}></ha-entity-picker>
              <ha-textfield label="Pressure Sensor Name" .value=${pv('climate_pressure_name') || ''} @input=${(ev) => pp({ climate_pressure_name: ev.target.value || undefined })}></ha-textfield>
            </div>
          </details>
        ` : ''}

        ${p_domain === 'humidifier' ? html`
          <details class="box-section">
            <summary>Humidifier Options</summary>
            <div class="box-content">
              <ha-textfield label="Humidity Step Size" type="number" step="1" .value=${String(pv('humidifier_humidity_step') ?? 1)} @input=${(ev) => pp({ humidifier_humidity_step: Number(ev.target.value) })} placeholder="1"></ha-textfield>
              <div class="switch-row"><ha-switch .checked=${pv('humidifier_use_circular_slider') === true} @change=${(ev) => pp({ humidifier_use_circular_slider: ev.target.checked })}></ha-switch><span>Use Circular Slider</span></div>
              <div class="switch-row"><ha-switch .checked=${pv('humidifier_show_plus_minus') === true} @change=${(ev) => pp({ humidifier_show_plus_minus: ev.target.checked })}></ha-switch><span>Show +/- Buttons</span></div>
              <div class="switch-row"><ha-switch .checked=${pv('humidifier_show_gradient') !== false} @change=${(ev) => pp({ humidifier_show_gradient: ev.target.checked })}></ha-switch><span>Show Gradient</span></div>
              <ha-entity-picker .hass=${this.hass} label="Fan Speed Entity (select or fan)" .value=${pv('humidifier_fan_entity') || ''} @value-changed=${(ev) => pp({ humidifier_fan_entity: ev.detail.value || undefined })}></ha-entity-picker>
            </div>
          </details>
        ` : ''}

        <details class="box-section">
          <summary>Content Display</summary>
          <div class="box-content">
            <ha-textfield label="Slider Border Radius (px)" type="number" .value=${String(pv('popup_slider_radius') ?? 12)} @input=${(ev) => pp({ popup_slider_radius: Number(ev.target.value) })}></ha-textfield>
            <div class="switch-row"><ha-switch .checked=${pv('popup_hide_button_text') === true} @change=${(ev) => pp({ popup_hide_button_text: ev.target.checked })}></ha-switch><span>Hide Text Under Buttons</span></div>
            <p style="font-size: 11px; opacity: 0.7; margin: 4px 0 2px 0;">Value Display (Temperature/Brightness)</p>
            <div class="inline-fields-2">
              <ha-textfield label="Font Size (px)" type="number" .value=${String(pv('popup_value_font_size') ?? 36)} @input=${(ev) => pp({ popup_value_font_size: Number(ev.target.value) })}></ha-textfield>
              <ha-textfield label="Font Weight" type="number" .value=${String(pv('popup_value_font_weight') ?? 300)} @input=${(ev) => pp({ popup_value_font_weight: Number(ev.target.value) })}></ha-textfield>
            </div>
            <p style="font-size: 11px; opacity: 0.7; margin: 4px 0 2px 0;">Label Display (Color/Mode Names)</p>
            <div class="inline-fields-2">
              <ha-textfield label="Font Size (px)" type="number" .value=${String(pv('popup_label_font_size') ?? 16)} @input=${(ev) => pp({ popup_label_font_size: Number(ev.target.value) })}></ha-textfield>
              <ha-textfield label="Font Weight" type="number" .value=${String(pv('popup_label_font_weight') ?? 400)} @input=${(ev) => pp({ popup_label_font_weight: Number(ev.target.value) })}></ha-textfield>
            </div>
            <ha-select label="Time Format" .value=${pv('popup_time_format') || 'auto'}
              @selected=${(ev) => { ev.stopPropagation(); pp({ popup_time_format: ev.target.value }); }}
              @closed=${(ev) => ev.stopPropagation()}>
              ${popupTimeFormatOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
            </ha-select>
          </div>
        </details>

        <details class="box-section">
          <summary>Active Button Styling</summary>
          <div class="box-content">
            <div class="inline-fields-2">
              <ha-textfield label="Color" .value=${pv('popup_highlight_color') || ''} @input=${(ev) => pp({ popup_highlight_color: ev.target.value || undefined })} placeholder="var(--primary-color)"></ha-textfield>
              <ha-textfield label="Text Color" .value=${pv('popup_highlight_text_color') || ''} @input=${(ev) => pp({ popup_highlight_text_color: ev.target.value || undefined })} placeholder="white"></ha-textfield>
            </div>
            <div class="inline-fields-2">
              <ha-textfield label="Border Radius (px)" type="number" .value=${pv('popup_highlight_radius') ?? ''} @input=${(ev) => pp({ popup_highlight_radius: Number(ev.target.value) || undefined })} placeholder="8"></ha-textfield>
              <ha-textfield label="Opacity" type="number" step="0.1" min="0" max="1" .value=${pv('popup_highlight_opacity') ?? ''} @input=${(ev) => pp({ popup_highlight_opacity: Number(ev.target.value) || undefined })} placeholder="1"></ha-textfield>
            </div>
            <div class="inline-fields-2">
              <ha-textfield label="Border Color" .value=${pv('popup_highlight_border_color') || ''} @input=${(ev) => pp({ popup_highlight_border_color: ev.target.value || undefined })}></ha-textfield>
              <ha-textfield label="Border Width" .value=${pv('popup_highlight_border_width') || ''} @input=${(ev) => pp({ popup_highlight_border_width: ev.target.value || undefined })}></ha-textfield>
            </div>
            <ha-textfield label="Box Shadow" .value=${pv('popup_highlight_box_shadow') || ''} @input=${(ev) => pp({ popup_highlight_box_shadow: ev.target.value || undefined })}></ha-textfield>
          </div>
        </details>

        <details class="box-section">
          <summary>Button Styling</summary>
          <div class="box-content">
            <div class="inline-fields-2">
              <ha-textfield label="Background" .value=${pv('popup_button_bg') || ''} @input=${(ev) => pp({ popup_button_bg: ev.target.value || undefined })}></ha-textfield>
              <ha-textfield label="Text Color" .value=${pv('popup_button_text_color') || ''} @input=${(ev) => pp({ popup_button_text_color: ev.target.value || undefined })}></ha-textfield>
            </div>
            <div class="inline-fields-2">
              <ha-textfield label="Border Radius (px)" type="number" .value=${pv('popup_button_radius') ?? ''} @input=${(ev) => pp({ popup_button_radius: Number(ev.target.value) || undefined })}></ha-textfield>
              <ha-textfield label="Opacity" type="number" step="0.1" min="0" max="1" .value=${pv('popup_button_opacity') ?? ''} @input=${(ev) => pp({ popup_button_opacity: Number(ev.target.value) || undefined })}></ha-textfield>
            </div>
            <div class="inline-fields-2">
              <ha-textfield label="Border Color" .value=${pv('popup_button_border_color') || ''} @input=${(ev) => pp({ popup_button_border_color: ev.target.value || undefined })}></ha-textfield>
              <ha-textfield label="Border Width" .value=${pv('popup_button_border_width') || ''} @input=${(ev) => pp({ popup_button_border_width: ev.target.value || undefined })}></ha-textfield>
            </div>
          </div>
        </details>

        <details class="box-section">
          <summary>Bottom Bar Entities</summary>
          <div class="box-content">
            <p style="font-size: 11px; opacity: 0.7; margin: 0 0 6px 0;">Add up to 8 icon buttons to the popup bottom bar.</p>
            <ha-select label="Button Alignment" .value=${pv('popup_bottom_bar_align') || 'spread'}
              @selected=${(ev) => { ev.stopPropagation(); pp({ popup_bottom_bar_align: ev.target.value }); }}
              @closed=${(ev) => ev.stopPropagation()}>
              ${popupBottomBarAlignOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
            </ha-select>
            <div class="switch-row"><ha-switch .checked=${pv('popup_hide_bottom_bar') !== true} @change=${(ev) => pp({ popup_hide_bottom_bar: !ev.target.checked })}></ha-switch><span>Show bottom bar</span></div>
            ${(() => {
              const _bbSlots = Math.max(1, Math.min(8, pv('_bb_slots') ?? Math.max(1, (pv('popup_bottom_bar_entities') || []).filter(Boolean).length || 1)));
              return html`
                <div style="display:flex;align-items:center;gap:8px;margin:10px 0 4px 0;">
                  <span style="font-size:12px;opacity:0.7;flex:1;">Slots: ${_bbSlots}</span>
                  <button style="width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:var(--primary-text-color);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;"
                    @click=${(e) => { e.stopPropagation(); pp({ _bb_slots: Math.max(1, _bbSlots - 1) }); }}>&#8722;</button>
                  <button style="width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:var(--primary-text-color);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;"
                    @click=${(e) => { e.stopPropagation(); pp({ _bb_slots: Math.min(8, _bbSlots + 1) }); }}>+</button>
                </div>
                ${Array.from({ length: _bbSlots }, (_, i) => {
                  const _ents = (pv('popup_bottom_bar_entities') || []);
                  const _ent = _ents[i] || {};
                  const _tap = _ent.tap_action || { action: 'more-info' };
                  const _act = _tap.action || 'more-info';
                  const setSlot = (patch) => {
                    const src = (pv('popup_bottom_bar_entities') || []);
                    const arr = Array.from({ length: Math.max(src.length, i + 1) }, (_, j) => src[j] || null);
                    arr[i] = { ...(arr[i] || {}), ...patch };
                    while (arr.length > 0 && !arr[arr.length - 1]?.entity) arr.pop();
                    pp({ popup_bottom_bar_entities: arr.length ? arr : undefined });
                  };
                  const setTap = (tap) => setSlot({ tap_action: { ..._tap, ...tap } });
                  return html`
                    <div style="margin-top:8px;padding:10px;background:rgba(255,255,255,0.04);border-radius:10px;">
                      <p style="font-size:11px;opacity:0.7;margin:0 0 6px 0;font-weight:600;">Button ${i+1}</p>
                      <ha-entity-picker .hass=${this.hass} .value=${_ent.entity||''} .label=${"Entity"}
                        @value-changed=${(ev) => setSlot({ entity: ev.detail.value || undefined })}
                        allow-custom-entity></ha-entity-picker>
                      ${_ent.entity ? html`
                        <ha-textfield label="Name (optional)" .value=${_ent.name||''}
                          @input=${(ev) => setSlot({ name: ev.target.value || undefined })} style="margin-top:6px;"></ha-textfield>
                        <ha-textfield label="Icon (optional)" .value=${_ent.icon||''} placeholder="mdi:home"
                          @input=${(ev) => setSlot({ icon: ev.target.value || undefined })} style="margin-top:6px;"></ha-textfield>
                        <ha-select label="Tap Action" .value=${_act}
                          @selected=${(ev) => { ev.stopPropagation(); const v=ev.detail?.value||ev.target?.value; if(v && v!==_act) setTap({ action:v }); }}
                          @closed=${(e)=>e.stopPropagation()} @click=${(e)=>e.stopPropagation()} style="margin-top:6px;">
                          ${popupBottomBarActionOptions.map((o) => html`<mwc-list-item value="${o.value}">${o.label}</mwc-list-item>`)}
                        </ha-select>
                        ${_act==='navigate'?html`<ha-textfield label="Navigation Path" .value=${_tap.navigation_path||''} @input=${(ev)=>setTap({navigation_path:ev.target.value})} style="margin-top:6px;"></ha-textfield>`:''}
                        ${_act==='url'?html`<ha-textfield label="URL" .value=${_tap.url_path||''} @input=${(ev)=>setTap({url_path:ev.target.value})} style="margin-top:6px;"></ha-textfield>`:''}
                        ${_act==='perform-action'?html`<ha-textfield label="Action (domain.service)" .value=${_tap.perform_action||''} @input=${(ev)=>setTap({perform_action:ev.target.value})} style="margin-top:6px;"></ha-textfield>`:''}
                      ` : ''}
                    </div>`;
                })}
              `;
            })()}
          </div>
        </details>
      ` : ''}
    `;
  }
  _renderActionEditor(label, field) {
    return html`
      <div style="margin-top: 8px;">
        <p style="font-weight: 500; margin-bottom: 4px;">${label}</p>
        ${this._renderSlotActionEditor(field)}
      </div>
    `;
  }

  render() {
    // Don't render until setConfig has been called and config has been merged with DEFAULTS
    if (!this._config || !this._config.type) return html``;

    const showCustomFont = this._config.font_family === "custom";

    // --- LOGIC FOR BACKGROUND SIZE HYBRID SELECTOR ---
    const bgSize = this._config.background_size || "cover";
    const isCustomBgSize = !BG_SIZE_PRESETS.includes(bgSize);
    const bgSizeSelectValue = isCustomBgSize ? "custom" : bgSize;

    return html`
      <div class="card-config">
        <div class="disclaimer">
          <ha-alert alert-type="info" title="Documentation">
            This card can be placed in the header slot, but to make use of advanced layout settings put it in a normal section at the top of the page and make the section as wide as possible. <br><br>
            Please read the documentation for details and examples: <a href="https://jimz011.github.io/hki-elements/cards/hki-header-card/overview/" target="_blank" rel="noopener noreferrer">HKI Header Card</a> <br><br>
            This card may contain bugs. Use at your own risk!
          </ha-alert>
        </div>

        <details class="box-section" open>
          <summary>Header Text</summary>
          <div class="box-content">
            ${this._renderTemplateEditor("Title template (Jinja)", "title")}
            ${this._renderTemplateEditor("Subtitle template (Jinja)", "subtitle")}

            <ha-select label="Text alignment" .value=${this._config.text_align} data-field="text_align" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
              <mwc-list-item value="left">Left</mwc-list-item>
              <mwc-list-item value="center">Center</mwc-list-item>
              <mwc-list-item value="right">Right</mwc-list-item>
            </ha-select>
          </div>
        </details>

        <details class="box-section">
          <summary>Layout & Visibility</summary>
          <div class="box-content">
            <div class="section">Title position</div>
            <div class="inline-fields-2">
              <ha-textfield label="Title horizontal offset (px)" type="number" .value=${String(this._config.title_offset_x)} data-field="title_offset_x" @input=${this._changed}></ha-textfield>
              <ha-textfield label="Title vertical offset (px)" type="number" .value=${String(this._config.title_offset_y)} data-field="title_offset_y" @input=${this._changed}></ha-textfield>
            </div>

            <div class="section">Subtitle position</div>
            <div class="inline-fields-2">
              <ha-textfield label="Subtitle horizontal offset (px)" type="number" .value=${String(this._config.subtitle_offset_x)} data-field="subtitle_offset_x" @input=${this._changed}></ha-textfield>
              <ha-textfield label="Subtitle vertical offset (px)" type="number" .value=${String(this._config.subtitle_offset_y)} data-field="subtitle_offset_y" @input=${this._changed}></ha-textfield>
            </div>

            <div class="inline-fields-2">
              <ha-textfield label="Min height (px)" type="number" .value=${String(this._config.min_height)} data-field="min_height" @input=${this._changed}></ha-textfield>
              <ha-textfield label="Max height (px)" type="number" .value=${String(this._config.max_height)} data-field="max_height" @input=${this._changed}></ha-textfield>
            </div>
            
            <ha-textfield label="Mobile Breakpoint (px)" type="number" .value=${String(this._config.mobile_breakpoint || 768)} data-field="mobile_breakpoint" @input=${this._changed}></ha-textfield>
          </div>
        </details>

        <details class="box-section">
          <summary>Persons</summary>
          <div class="box-content">
            <ha-formfield label="Enable persons">
              <ha-switch .checked=${!!this._config.persons_enabled} data-field="persons_enabled" @change=${this._changed}></ha-switch>
            </ha-formfield>

            ${this._config.persons_enabled ? html`
              <div class="section">Persons</div>
              <p style="opacity: 0.7; font-size: 0.9em; margin: 8px 0;">Configure individual persons below. ${this._config.persons_grayscale_away ? html`<span style="color: var(--primary-color);">Enable "Grayscale when away" in Options to show per-person state override.</span>` : html`Enable "Grayscale when away" in Options below to add per-person state control.`}</p>
              
              ${(this._config.persons_entities || []).map((personConfig, index) => {
                const entityId = typeof personConfig === 'string' ? personConfig : personConfig.entity;
                return html`
                  <div style="border: 1px solid var(--divider-color); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <strong>Person ${index + 1}</strong>
                      <mwc-icon-button 
                        @click=${() => {
                          const updated = [...this._config.persons_entities];
                          updated.splice(index, 1);
                          this._config = { ...this._config, persons_entities: updated };
                          const strippedConfig = this._stripDefaults(this._config);
                          this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: strippedConfig } }));
                          this.requestUpdate();
                        }}
                      >
                        <ha-icon icon="mdi:delete"></ha-icon>
                      </mwc-icon-button>
                    </div>
                    
                    <ha-entity-picker
                      .hass=${this.hass}
                      .value=${entityId}
                      .label=${"Person Entity"}
                      .includeDomains=${["person"]}
                      @value-changed=${(e) => {
                        const updated = [...this._config.persons_entities];
                        if (typeof updated[index] === 'string') {
                          updated[index] = {
                            entity: e.detail.value,
                            tap_action: { action: "more-info" },
                            hold_action: { action: "none" },
                            double_tap_action: { action: "none" }
                          };
                        } else {
                          updated[index] = { ...updated[index], entity: e.detail.value };
                        }
                        this._config = { ...this._config, persons_entities: updated };
                        const strippedConfig = this._stripDefaults(this._config);
                        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: strippedConfig } }));
                        this.requestUpdate();
                      }}
                    ></ha-entity-picker>

                    ${this._config.persons_grayscale_away ? html`
                      <ha-entity-picker
                        .hass=${this.hass}
                        .value=${typeof personConfig !== 'string' ? (personConfig.grayscale_entity || "") : ""}
                        .label=${"State Override Entity (optional)"}
                        helper="Override person state with this entity: ON = home/color, OFF = away/grayscale"
                        @value-changed=${(e) => {
                          const updated = [...this._config.persons_entities];
                          if (typeof updated[index] === 'string') {
                            updated[index] = {
                              entity: updated[index],
                              grayscale_entity: e.detail.value || "",
                              tap_action: { action: "more-info" },
                              hold_action: { action: "none" },
                              double_tap_action: { action: "none" }
                            };
                          } else {
                            updated[index] = { ...updated[index], grayscale_entity: e.detail.value || "" };
                          }
                          this._config = { ...this._config, persons_entities: updated };
                          const strippedConfig = this._stripDefaults(this._config);
                          this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: strippedConfig } }));
                          this.requestUpdate();
                        }}
                      ></ha-entity-picker>
                    ` : ''}

                    <details style="margin-top: 8px;">
                      <summary style="cursor: pointer; font-weight: 500; padding: 8px 0;">Custom Icons & Pictures</summary>
                      <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 8px;">
                        <ha-icon-picker
                          .hass=${this.hass}
                          .value=${typeof personConfig !== 'string' ? (personConfig.icon_home || "") : ""}
                          .label=${"Icon (Home)"}
                          helper="Custom icon when home (overrides entity icon)"
                          @value-changed=${(e) => {
                            const updated = [...this._config.persons_entities];
                            if (typeof updated[index] === 'string') {
                              updated[index] = {
                                entity: updated[index],
                                icon_home: e.detail.value || "",
                                tap_action: { action: "more-info" },
                                hold_action: { action: "none" },
                                double_tap_action: { action: "none" }
                              };
                            } else {
                              updated[index] = { ...updated[index], icon_home: e.detail.value || "" };
                            }
                            this._config = { ...this._config, persons_entities: updated };
                            const strippedConfig = this._stripDefaults(this._config);
                            this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: strippedConfig } }));
                            this.requestUpdate();
                          }}
                        ></ha-icon-picker>

                        <ha-icon-picker
                          .hass=${this.hass}
                          .value=${typeof personConfig !== 'string' ? (personConfig.icon_away || "") : ""}
                          .label=${"Icon (Away)"}
                          helper="Custom icon when away (overrides entity icon)"
                          @value-changed=${(e) => {
                            const updated = [...this._config.persons_entities];
                            if (typeof updated[index] === 'string') {
                              updated[index] = {
                                entity: updated[index],
                                icon_away: e.detail.value || "",
                                tap_action: { action: "more-info" },
                                hold_action: { action: "none" },
                                double_tap_action: { action: "none" }
                              };
                            } else {
                              updated[index] = { ...updated[index], icon_away: e.detail.value || "" };
                            }
                            this._config = { ...this._config, persons_entities: updated };
                            const strippedConfig = this._stripDefaults(this._config);
                            this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: strippedConfig } }));
                            this.requestUpdate();
                          }}
                        ></ha-icon-picker>

                        <ha-textfield
                          .hass=${this.hass}
                          .value=${typeof personConfig !== 'string' ? (personConfig.picture_home || "") : ""}
                          .label=${"Picture URL (Home)"}
                          helper="Custom picture URL when home (e.g., /local/person_home.jpg)"
                          @input=${(e) => {
                            const updated = [...this._config.persons_entities];
                            if (typeof updated[index] === 'string') {
                              updated[index] = {
                                entity: updated[index],
                                picture_home: e.target.value || "",
                                tap_action: { action: "more-info" },
                                hold_action: { action: "none" },
                                double_tap_action: { action: "none" }
                              };
                            } else {
                              updated[index] = { ...updated[index], picture_home: e.target.value || "" };
                            }
                            this._config = { ...this._config, persons_entities: updated };
                            const strippedConfig = this._stripDefaults(this._config);
                            this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: strippedConfig } }));
                            this.requestUpdate();
                          }}
                        ></ha-textfield>

                        <ha-textfield
                          .hass=${this.hass}
                          .value=${typeof personConfig !== 'string' ? (personConfig.picture_away || "") : ""}
                          .label=${"Picture URL (Away)"}
                          helper="Custom picture URL when away (e.g., /local/person_away.jpg)"
                          @input=${(e) => {
                            const updated = [...this._config.persons_entities];
                            if (typeof updated[index] === 'string') {
                              updated[index] = {
                                entity: updated[index],
                                picture_away: e.target.value || "",
                                tap_action: { action: "more-info" },
                                hold_action: { action: "none" },
                                double_tap_action: { action: "none" }
                              };
                            } else {
                              updated[index] = { ...updated[index], picture_away: e.target.value || "" };
                            }
                            this._config = { ...this._config, persons_entities: updated };
                            const strippedConfig = this._stripDefaults(this._config);
                            this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: strippedConfig } }));
                            this.requestUpdate();
                          }}
                        ></ha-textfield>
                      </div>
                    </details>

                    ${this._renderPersonActionEditors(index)}
                  </div>
                `;
              })}

              <mwc-button 
                @click=${() => {
                  const updated = [...(this._config.persons_entities || []), {
                    entity: "",
                    tap_action: { action: "more-info" },
                    hold_action: { action: "none" },
                    double_tap_action: { action: "none" }
                  }];
                  this._config = { ...this._config, persons_entities: updated };
                  const strippedConfig = this._stripDefaults(this._config);
                  this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: strippedConfig } }));
                  this.requestUpdate();
                }}
              >
                <ha-icon icon="mdi:plus"></ha-icon> Add Person
              </mwc-button>

              <div class="section" style="margin-top: 16px;">Position</div>
              <div class="inline-fields-2">
                <ha-textfield label="Horizontal offset (px)" type="number" .value=${String(this._config.persons_offset_x || 5)} data-field="persons_offset_x" @input=${this._changed}></ha-textfield>
                <ha-textfield label="Vertical offset (px)" type="number" .value=${String(this._config.persons_offset_y || 32)} data-field="persons_offset_y" @input=${this._changed}></ha-textfield>
              </div>

              <div class="section">Alignment</div>
              <ha-select label="Persons alignment" .value=${this._config.persons_align || "left"} data-field="persons_align" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
                <mwc-list-item value="left">Left</mwc-list-item>
                <mwc-list-item value="center">Center</mwc-list-item>
                <mwc-list-item value="right">Right</mwc-list-item>
              </ha-select>

              <div class="section">Appearance</div>
              <div class="inline-fields-2">
                <ha-textfield label="Avatar size (px)" type="number" .value=${String(this._config.persons_size || 48)} data-field="persons_size" @input=${this._changed}></ha-textfield>
                <ha-textfield label="Spacing (px)" helper="Negative = overlap" type="number" .value=${String(this._config.persons_spacing != null ? this._config.persons_spacing : -8)} data-field="persons_spacing" @input=${this._changed}></ha-textfield>
              </div>

              <ha-select label="Stack order" helper="Only affects overlapping (negative spacing)" .value=${this._config.persons_stack_order || "ascending"} data-field="persons_stack_order" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
                <mwc-list-item value="ascending">Ascending (last on top)</mwc-list-item>
                <mwc-list-item value="descending">Descending (first on top)</mwc-list-item>
              </ha-select>

              <div class="inline-fields-2">
                <ha-textfield label="Border width (px)" type="number" .value=${String(this._config.persons_border_width || 1)} data-field="persons_border_width" @input=${this._changed}></ha-textfield>
                <ha-select label="Border style" .value=${this._config.persons_border_style || "solid"} data-field="persons_border_style" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
                  <mwc-list-item value="solid">Solid</mwc-list-item>
                  <mwc-list-item value="dashed">Dashed</mwc-list-item>
                  <mwc-list-item value="dotted">Dotted</mwc-list-item>
                  <mwc-list-item value="double">Double</mwc-list-item>
                  <mwc-list-item value="groove">Groove</mwc-list-item>
                  <mwc-list-item value="ridge">Ridge</mwc-list-item>
                  <mwc-list-item value="inset">Inset</mwc-list-item>
                  <mwc-list-item value="outset">Outset</mwc-list-item>
                  <mwc-list-item value="none">None</mwc-list-item>
                </ha-select>
              </div>

              <div class="inline-fields-2">
                <ha-textfield label="Border radius (px)" helper="Integer for pixels, or CSS value" .value=${String(this._config.persons_border_radius !== undefined ? this._config.persons_border_radius : 50)} data-field="persons_border_radius" @input=${this._changed}></ha-textfield>
                <ha-textfield label="Border color" .value=${this._config.persons_border_color || "rgba(255,255,255,0.3)"} data-field="persons_border_color" @input=${this._changed}></ha-textfield>
              </div>

              <ha-textfield label="Border color (away)" .value=${this._config.persons_border_color_away || "rgba(255,100,100,0.5)"} data-field="persons_border_color_away" @input=${this._changed}></ha-textfield>

              <ha-textfield label="Box shadow" helper="Leave empty for no shadow" .value=${this._config.persons_box_shadow !== undefined ? this._config.persons_box_shadow : "0 2px 8px rgba(0, 0, 0, 0.4)"} data-field="persons_box_shadow" @input=${this._changed}></ha-textfield>

              <div class="section">Options</div>
              <ha-formfield label="Use entity picture (if available)">
                <ha-switch .checked=${this._config.persons_use_entity_picture !== false} data-field="persons_use_entity_picture" @change=${this._changed}></ha-switch>
              </ha-formfield>

              <ha-formfield label="Dynamic order (home persons first)">
                <ha-switch .checked=${!!this._config.persons_dynamic_order} data-field="persons_dynamic_order" @change=${this._changed}></ha-switch>
              </ha-formfield>

              <ha-formfield label="Hide away persons">
                <ha-switch .checked=${!!this._config.persons_hide_away} data-field="persons_hide_away" @change=${this._changed}></ha-switch>
              </ha-formfield>

              <ha-formfield label="Grayscale when away">
                <ha-switch .checked=${!!this._config.persons_grayscale_away} data-field="persons_grayscale_away" @change=${this._changed}></ha-switch>
              </ha-formfield>
              ${this._config.persons_grayscale_away ? html`
                <p style="opacity: 0.6; font-size: 0.85em; margin: 4px 0 8px 24px; font-style: italic;">Per-person state override available in Persons section above</p>
              ` : ''}
            ` : ''}
          </div>
        </details>

        <details class="box-section">
          <summary>Header Styling</summary>
          <div class="box-content">
            <div class="section">Text Colors</div>
            <div class="inline-fields-2">
              <ha-textfield label="Title color" helper="Any CSS color (hex, rgb, rgba, etc.)" placeholder="inherit" .value=${this._config.title_color || ""} data-field="title_color" @input=${this._changed}></ha-textfield>
              <ha-textfield label="Subtitle color" helper="Any CSS color (hex, rgb, rgba, etc.)" placeholder="inherit" .value=${this._config.subtitle_color || ""} data-field="subtitle_color" @input=${this._changed}></ha-textfield>
            </div>

            <div class="section">Background</div>
            <ha-textfield label="Background" helper="CSS color (hex, rgb, rgba, color name), gradient, or image URL (/local/image.jpg)" .value=${this._config.background} data-field="background" @input=${this._changed}></ha-textfield>

            <div class="inline-fields-2">
                <ha-select label="Background position" .value=${this._config.background_position} data-field="background_position" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
                  <mwc-list-item value="top">Top</mwc-list-item>
                  <mwc-list-item value="center">Center</mwc-list-item>
                  <mwc-list-item value="bottom">Bottom</mwc-list-item>
                  <mwc-list-item value="left">Left</mwc-list-item>
                  <mwc-list-item value="right">Right</mwc-list-item>
                </ha-select>

                <ha-select label="Background repeat" .value=${this._config.background_repeat} data-field="background_repeat" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
                  <mwc-list-item value="no-repeat">No repeat</mwc-list-item>
                  <mwc-list-item value="repeat">Repeat</mwc-list-item>
                  <mwc-list-item value="repeat-x">Repeat horizontally</mwc-list-item>
                  <mwc-list-item value="repeat-y">Repeat vertically</mwc-list-item>
                </ha-select>
            </div>

            <div class="inline-fields-2">
                <ha-select 
                    label="Background size" 
                    .value=${bgSizeSelectValue} 
                    
                    @selected=${this._handleBgSizeSelect} 
                    @closed=${(e) => e.stopPropagation()}
                >
                  <mwc-list-item value="cover">Cover</mwc-list-item>
                  <mwc-list-item value="contain">Contain</mwc-list-item>
                  <mwc-list-item value="auto">Auto</mwc-list-item>
                  <mwc-list-item value="custom">Custom</mwc-list-item>
                </ha-select>
                
                <ha-select label="Background blend mode" .value=${this._config.background_blend_mode || "normal"} data-field="background_blend_mode" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
                  <mwc-list-item value="normal">Normal</mwc-list-item>
                  <mwc-list-item value="multiply">Multiply</mwc-list-item>
                  <mwc-list-item value="screen">Screen</mwc-list-item>
                  <mwc-list-item value="overlay">Overlay</mwc-list-item>
                  <mwc-list-item value="darken">Darken</mwc-list-item>
                  <mwc-list-item value="lighten">Lighten</mwc-list-item>
                  <mwc-list-item value="color-dodge">Color Dodge</mwc-list-item>
                  <mwc-list-item value="soft-light">Soft Light</mwc-list-item>
                  <mwc-list-item value="difference">Difference</mwc-list-item>
                </ha-select>
            </div>
            
            ${isCustomBgSize ? html`
                <ha-textfield 
                    label="Custom Size (e.g. 150%)" 
                    .value=${this._config.background_size} 
                    data-field="background_size" 
                    @input=${this._changed}
                ></ha-textfield>
            ` : ""}

            <ha-textfield label="Background blend color" helper="Color to blend with background image using blend mode above" .value=${this._config.background_color} data-field="background_color" @input=${this._changed}></ha-textfield>

            <div class="section">Gradient Overlay</div>
            <div class="switch-row">
              <ha-formfield label="Enable gradient overlay">
                <ha-switch .checked=${this._config.blend_enabled !== false} data-field="blend_enabled" @change=${this._changed}></ha-switch>
              </ha-formfield>
            </div>
            ${this._config.blend_enabled !== false ? html`
              <ha-textfield label="Blend color" helper="Any CSS color" .value=${this._config.blend_color} data-field="blend_color" @input=${this._changed}></ha-textfield>
              <ha-textfield label="Blend stop (%)" type="number" .value=${String(this._config.blend_stop)} data-field="blend_stop" @input=${this._changed}></ha-textfield>
            ` : ""}

            <div class="section">Border & Shadow</div>
            <div class="inline-fields-2">
              <ha-textfield
                label="Border radius (top)"
                helper="Number (px) like 12, or any CSS value (12px, 0, 50%, var(--radius))"
                .value=${(this._config.card_border_radius_top ?? "").toString()}
                data-field="card_border_radius_top"
                @input=${this._changed}
              ></ha-textfield>
              <ha-textfield
                label="Border radius (bottom)"
                helper="Number (px) like 12, or any CSS value (12px, 0, 50%, var(--radius))"
                .value=${(this._config.card_border_radius_bottom ?? "").toString()}
                data-field="card_border_radius_bottom"
                @input=${this._changed}
              ></ha-textfield>
            </div>
            <ha-textfield label="Box Shadow" helper="e.g. 0 4px 12px rgba(0,0,0,0.3)" .value=${this._config.card_box_shadow || ""} data-field="card_box_shadow" @input=${this._changed}></ha-textfield>
            <div class="inline-fields-3">
              <ha-select label="Border Style" .value=${this._config.card_border_style || "none"} data-field="card_border_style" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
                <mwc-list-item value="none">None</mwc-list-item>
                <mwc-list-item value="solid">Solid</mwc-list-item>
                <mwc-list-item value="dashed">Dashed</mwc-list-item>
                <mwc-list-item value="dotted">Dotted</mwc-list-item>
                <mwc-list-item value="double">Double</mwc-list-item>
                <mwc-list-item value="groove">Groove</mwc-list-item>
                <mwc-list-item value="ridge">Ridge</mwc-list-item>
                <mwc-list-item value="inset">Inset</mwc-list-item>
                <mwc-list-item value="outset">Outset</mwc-list-item>
              </ha-select>
              <ha-textfield label="Border Width (px)" type="number" .value=${String(this._config.card_border_width || 0)} data-field="card_border_width" @input=${this._changed}></ha-textfield>
              <ha-textfield label="Border Color" .value=${this._config.card_border_color || ""} data-field="card_border_color" @input=${this._changed}></ha-textfield>
            </div>
          </div>
        </details>

        <details class="box-section">
          <summary>Typography</summary>
          <div class="box-content">
            <div class="section">Font Settings</div>
            <ha-select label="Font family" .value=${this._config.font_family} data-field="font_family" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
              <mwc-list-item value="inherit">Inherit</mwc-list-item>
              <mwc-list-item value="system">System</mwc-list-item>
              <mwc-list-item value="roboto">Roboto</mwc-list-item>
              <mwc-list-item value="inter">Inter</mwc-list-item>
              <mwc-list-item value="arial">Arial</mwc-list-item>
              <mwc-list-item value="georgia">Georgia</mwc-list-item>
              <mwc-list-item value="mono">Monospace</mwc-list-item>
              <mwc-list-item value="custom">Custom…</mwc-list-item>
            </ha-select>

            ${showCustomFont ? html`<ha-textfield label="Custom font-family (CSS)" .value=${this._config.font_family_custom} data-field="font_family_custom" @input=${this._changed}></ha-textfield>` : ""}

            <ha-select label="Font style" .value=${this._config.font_style} data-field="font_style" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
              <mwc-list-item value="normal">Normal</mwc-list-item>
              <mwc-list-item value="italic">Italic</mwc-list-item>
            </ha-select>

            <div class="inline-fields-2">
              <ha-textfield label="Title size (px)" type="number" .value=${String(this._config.title_size_px)} data-field="title_size_px" @input=${this._changed}></ha-textfield>
              <ha-textfield label="Subtitle size (px)" type="number" .value=${String(this._config.subtitle_size_px)} data-field="subtitle_size_px" @input=${this._changed}></ha-textfield>
            </div>

            <div class="inline-fields-2">
              <ha-select label="Title weight" .value=${this._config.title_weight} data-field="title_weight" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
                <mwc-list-item value="light">Light</mwc-list-item>
                <mwc-list-item value="regular">Regular</mwc-list-item>
                <mwc-list-item value="medium">Medium</mwc-list-item>
                <mwc-list-item value="semibold">Semi-bold</mwc-list-item>
                <mwc-list-item value="bold">Bold</mwc-list-item>
                <mwc-list-item value="black">Black</mwc-list-item>
              </ha-select>

              <ha-select label="Subtitle weight" .value=${this._config.subtitle_weight} data-field="subtitle_weight" @selected=${this._changed} @closed=${this._changed} @value-changed=${this._changed}>
                <mwc-list-item value="light">Light</mwc-list-item>
                <mwc-list-item value="regular">Regular</mwc-list-item>
                <mwc-list-item value="medium">Medium</mwc-list-item>
                <mwc-list-item value="semibold">Semi-bold</mwc-list-item>
                <mwc-list-item value="bold">Bold</mwc-list-item>
                <mwc-list-item value="black">Black</mwc-list-item>
              </ha-select>
            </div>
          </div>
        </details>
        <details class="box-section">
          <summary>Top Bar</summary>
          <div class="box-content">
            <div class="switch-row">
                <ha-switch .checked=${this._config.top_bar_enabled !== false} data-field="top_bar_enabled" @change=${this._changed}></ha-switch>
                <span>Enable top bar</span>
            </div>

            ${this._config.top_bar_enabled !== false ? html`
                <div class="inline-fields-2">
                    <ha-textfield label="Bar vertical offset (px)" type="number" .value=${String(this._config.top_bar_offset_y ?? 10)} data-field="top_bar_offset_y" @input=${this._changed}></ha-textfield>
                    <ha-textfield label="Bar padding X (px)" type="number" .value=${String(this._config.top_bar_padding_x ?? 5)} data-field="top_bar_padding_x" @input=${this._changed}></ha-textfield>
                </div>
                
                <details class="box-section">
                  <summary>Global Styling (Defaults)</summary>
                  <div class="box-content">
                    <div class="inline-fields-2">
                      <ha-textfield label="Font Size (px)" type="number" .value=${String(this._config.info_size_px || 12)} data-field="info_size_px" @input=${this._changed}></ha-textfield>
                      <ha-select label="Font Weight" .value=${this._config.info_weight || "medium"} data-field="info_weight" @selected=${this._changed} @closed=${this._changed}>
                        ${["light", "regular", "medium", "semibold", "bold", "extrabold"].map(w => html`<mwc-list-item .value=${w}>${w.charAt(0).toUpperCase() + w.slice(1)}</mwc-list-item>`)}
                      </ha-select>
                    </div>
                    <ha-textfield label="Text Color" .value=${this._config.info_color || ""} data-field="info_color" @input=${this._changed}></ha-textfield>
                    
                    <div class="switch-row">
                      <ha-switch .checked=${!!this._config.info_pill} data-field="info_pill" @change=${this._changed}></ha-switch>
                      <span>Enable Pill Style</span>
                    </div>
                    ${this._config.info_pill ? html`
                      <ha-textfield label="Pill Background" .value=${this._config.info_pill_background || "rgba(0,0,0,0.25)"} data-field="info_pill_background" @input=${this._changed}></ha-textfield>
                      <div class="inline-fields-2">
                        <ha-textfield label="Padding X (px)" type="number" .value=${String(this._config.info_pill_padding_x ?? 12)} data-field="info_pill_padding_x" @input=${this._changed}></ha-textfield>
                        <ha-textfield label="Padding Y (px)" type="number" .value=${String(this._config.info_pill_padding_y ?? 8)} data-field="info_pill_padding_y" @input=${this._changed}></ha-textfield>
                      </div>
                      <div class="inline-fields-2">
                        <ha-textfield label="Border Radius (px)" type="number" .value=${String(this._config.info_pill_radius ?? 999)} data-field="info_pill_radius" @input=${this._changed}></ha-textfield>
                        <ha-textfield label="Blur (px)" type="number" .value=${String(this._config.info_pill_blur ?? 0)} data-field="info_pill_blur" @input=${this._changed}></ha-textfield>
                      </div>
                      <div class="inline-fields-3">
                        <ha-select label="Border Style" .value=${this._config.info_pill_border_style || "none"} data-field="info_pill_border_style" @selected=${this._changed} @closed=${this._changed}>
                          <mwc-list-item value="none">None</mwc-list-item>
                          <mwc-list-item value="solid">Solid</mwc-list-item>
                          <mwc-list-item value="dashed">Dashed</mwc-list-item>
                          <mwc-list-item value="dotted">Dotted</mwc-list-item>
                        </ha-select>
                        <ha-textfield label="Border Width" type="number" .value=${String(this._config.info_pill_border_width ?? 0)} data-field="info_pill_border_width" @input=${this._changed}></ha-textfield>
                        <ha-textfield label="Border Color" .value=${this._config.info_pill_border_color || "rgba(255,255,255,0.1)"} data-field="info_pill_border_color" @input=${this._changed}></ha-textfield>
                      </div>
                    ` : ''}
                  </div>
                </details>

                <details class="box-section">
                  <summary>Left Slot: ${this._getSlotLabel(this._config.top_bar_left)}</summary>
                  <div class="box-content">
                    ${this._renderSlotEditor('left', 'top_bar')}
                  </div>
                </details>

                <details class="box-section">
                  <summary>Center Slot: ${this._getSlotLabel(this._config.top_bar_center)}</summary>
                  <div class="box-content">
                    ${this._renderSlotEditor('center', 'top_bar')}
                  </div>
                </details>

                <details class="box-section">
                  <summary>Right Slot: ${this._getSlotLabel(this._config.top_bar_right)}</summary>
                  <div class="box-content">
                    ${this._renderSlotEditor('right', 'top_bar')}
                  </div>
                </details>
            ` : ''}
          </div>
        </details>

        <details class="box-section">
          <summary>Bottom Bar</summary>
          <div class="box-content">
            <div class="switch-row">
              <ha-switch .checked=${!!this._config.bottom_bar_enabled} data-field="bottom_bar_enabled" @change=${this._changed}></ha-switch>
              <span>Enable Bottom Bar</span>
            </div>
            ${this._config.bottom_bar_enabled ? html`
              <div class="inline-fields-2" style="margin-top: 8px;">
                <ha-textfield label="Y Offset (px)" type="number" .value=${String(this._config.bottom_bar_offset_y ?? 10)} data-field="bottom_bar_offset_y" @input=${this._changed}></ha-textfield>
                <ha-textfield label="Padding X (px)" type="number" .value=${String(this._config.bottom_bar_padding_x ?? 0)} data-field="bottom_bar_padding_x" @input=${this._changed}></ha-textfield>
              </div>

              <details class="box-section">
                <summary>Global Styling (Defaults)</summary>
                <div class="box-content">
                  <div class="inline-fields-2">
                    <ha-textfield label="Font Size (px)" type="number" .value=${String(this._config.bottom_info_size_px || 12)} data-field="bottom_info_size_px" @input=${this._changed}></ha-textfield>
                    <ha-select label="Font Weight" .value=${this._config.bottom_info_weight || "medium"} data-field="bottom_info_weight" @selected=${this._changed} @closed=${this._changed}>
                      ${["light", "regular", "medium", "semibold", "bold", "extrabold"].map(w => html`<mwc-list-item .value=${w}>${w.charAt(0).toUpperCase() + w.slice(1)}</mwc-list-item>`)}
                    </ha-select>
                  </div>
                  <ha-textfield label="Text Color" .value=${this._config.bottom_info_color || ""} data-field="bottom_info_color" @input=${this._changed}></ha-textfield>
                  
                  <div class="switch-row">
                    <ha-switch .checked=${!!this._config.bottom_info_pill} data-field="bottom_info_pill" @change=${this._changed}></ha-switch>
                    <span>Enable Pill Style</span>
                  </div>
                  ${this._config.bottom_info_pill ? html`
                    <ha-textfield label="Pill Background" .value=${this._config.bottom_info_pill_background || "rgba(0,0,0,0.25)"} data-field="bottom_info_pill_background" @input=${this._changed}></ha-textfield>
                    <div class="inline-fields-2">
                      <ha-textfield label="Padding X (px)" type="number" .value=${String(this._config.bottom_info_pill_padding_x ?? 12)} data-field="bottom_info_pill_padding_x" @input=${this._changed}></ha-textfield>
                      <ha-textfield label="Padding Y (px)" type="number" .value=${String(this._config.bottom_info_pill_padding_y ?? 8)} data-field="bottom_info_pill_padding_y" @input=${this._changed}></ha-textfield>
                    </div>
                    <div class="inline-fields-2">
                      <ha-textfield label="Border Radius (px)" type="number" .value=${String(this._config.bottom_info_pill_radius ?? 999)} data-field="bottom_info_pill_radius" @input=${this._changed}></ha-textfield>
                      <ha-textfield label="Blur (px)" type="number" .value=${String(this._config.bottom_info_pill_blur ?? 0)} data-field="bottom_info_pill_blur" @input=${this._changed}></ha-textfield>
                    </div>
                    <div class="inline-fields-3">
                      <ha-select label="Border Style" .value=${this._config.bottom_info_pill_border_style || "none"} data-field="bottom_info_pill_border_style" @selected=${this._changed} @closed=${this._changed}>
                        <mwc-list-item value="none">None</mwc-list-item>
                        <mwc-list-item value="solid">Solid</mwc-list-item>
                        <mwc-list-item value="dashed">Dashed</mwc-list-item>
                        <mwc-list-item value="dotted">Dotted</mwc-list-item>
                      </ha-select>
                      <ha-textfield label="Border Width" type="number" .value=${String(this._config.bottom_info_pill_border_width ?? 0)} data-field="bottom_info_pill_border_width" @input=${this._changed}></ha-textfield>
                      <ha-textfield label="Border Color" .value=${this._config.bottom_info_pill_border_color || "rgba(255,255,255,0.1)"} data-field="bottom_info_pill_border_color" @input=${this._changed}></ha-textfield>
                    </div>
                  ` : ''}
                </div>
              </details>

              <details class="box-section">
                <summary>Left Slot: ${this._getSlotLabel(this._config.bottom_bar_left)}</summary>
                <div class="box-content">
                  ${this._renderSlotEditor('left', 'bottom_bar')}
                </div>
              </details>

              <details class="box-section">
                <summary>Center Slot: ${this._getSlotLabel(this._config.bottom_bar_center)}</summary>
                <div class="box-content">
                  ${this._renderSlotEditor('center', 'bottom_bar')}
                </div>
              </details>

              <details class="box-section">
                <summary>Right Slot: ${this._getSlotLabel(this._config.bottom_bar_right)}</summary>
                <div class="box-content">
                  ${this._renderSlotEditor('right', 'bottom_bar')}
                </div>
              </details>
            ` : ''}
          </div>
        </details>

        <details class="box-section">
          <summary>Fixed Header</summary>
          <div class="box-content">
            <div class="section">Positioning</div>
            <div class="switch-row">
              <ha-formfield label="Keep header fixed to top">
                <ha-switch .checked=${!!this._config.fixed} data-field="fixed" @change=${this._changed}></ha-switch>
              </ha-formfield>
            </div>

            ${this._config.fixed ? html`
              <ha-textfield label="Fixed top offset (px)" type="number" .value=${String(this._config.fixed_top)} data-field="fixed_top" @input=${this._changed}></ha-textfield>
            ` : html`
              <div class="section">Card size (not fixed)</div>
              <div class="inline-fields-2">
                <ha-textfield label="Inset top (px)" type="number" .value=${String(this._config.inset_top ?? 0)} data-field="inset_top" @input=${this._changed}></ha-textfield>
                <ha-textfield label="Inset bottom (px)" type="number" .value=${String(this._config.inset_bottom ?? 0)} data-field="inset_bottom" @input=${this._changed}></ha-textfield>
              </div>
              <div class="inline-fields-2">
                <ha-textfield label="Inset left (px)" helper="Positive values make the card wider left" type="number" .value=${String(this._config.inset_left ?? 0)} data-field="inset_left" @input=${this._changed}></ha-textfield>
                <ha-textfield label="Inset right (px)" helper="Positive values make the card wider right" type="number" .value=${String(this._config.inset_right ?? 0)} data-field="inset_right" @input=${this._changed}></ha-textfield>
              </div>
            `}
          </div>
        </details>

        <details class="box-section">
          <summary>Badge Positioning</summary>
          <div class="box-content">
            <div class="section">Badge Settings</div>
            
            <ha-alert alert-type="warning" class="badge-warning">
              For badge positioning to work, this card must be placed in the <strong>header slot</strong> of your view/section. Otherwise, these badge settings will have no effect. <br><br>
              NOTE: This card does not manage or display any badges itself. Badges must be added separately using Home Assistant's native badge support (e.g. via the "badges" option in your Lovelace view/section configuration).
            </ha-alert>
            
            <div class="switch-row">
              <ha-formfield label="Pin badges in place (content scrolls beneath)">
                <ha-switch .checked=${!!this._config.badges_fixed} data-field="badges_fixed" @change=${this._changed}></ha-switch>
              </ha-formfield>
            </div>
            
            ${this._config.badges_fixed
              ? html`<ha-textfield label="Badges vertical offset when pinned (px)" helper="Negative values pull badges up (into header), positive values push down" type="number" .value=${String(this._config.badges_offset_pinned)} data-field="badges_offset_pinned" @input=${this._changed}></ha-textfield>`
              : html`<ha-textfield label="Badges vertical offset when unpinned (px)" helper="Negative values pull badges up (into header), positive values push down" type="number" .value=${String(this._config.badges_offset_unpinned)} data-field="badges_offset_unpinned" @input=${this._changed}></ha-textfield>`}
            
            <ha-textfield label="Gap under badges (px)" helper="Space between badges and next content (auto-adjusts -48px when pinned, +48px in kiosk mode)" type="number" .value=${String(this._config.badges_gap)} data-field="badges_gap" @input=${this._changed}></ha-textfield>
          </div>
        </details>

      </div>
    `;
  }

  static get styles() {
    return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 8px;
      }
      .disclaimer { margin-bottom: 8px; }
      .disclaimer ha-alert { margin-bottom: 0; }
      .disclaimer a { color: var(--primary-color); text-decoration: none; }
      .disclaimer a:hover { text-decoration: underline; }
      .badge-warning { margin-bottom: 12px; }
      .section { margin-top: 8px; font-weight: 600; }
      .switch-row { display: flex; align-items: center; gap: 12px; }
      .inline-fields-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
      .inline-fields-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
      ha-textfield, ha-select, ha-combo-box, ha-navigation-picker, ha-entity-picker, ha-selector, ha-service-picker, ha-yaml-editor, ha-code-editor { width: 100%; }
      
      /* Collapsible Sections */
      details.box-section {
        background: var(--secondary-background-color);
        border-radius: 4px;
        margin-bottom: 8px;
        border: 1px solid var(--divider-color);
      }
      summary {
        padding: 12px;
        cursor: pointer;
        font-weight: 600;
        background: var(--primary-background-color);
        border-bottom: 1px solid var(--divider-color);
        list-style: none; /* Hide default triangle in some browsers */
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 4px 4px 0 0;
      }
      details:not([open]) summary {
        border-radius: 4px;
        border-bottom: none;
      }
      summary::-webkit-details-marker { display: none; } /* Hide Chrome marker */
      summary::after {
        content: '+'; 
        font-weight: bold;
        font-size: 1.2em;
      }
      details[open] summary::after {
        content: '-';
      }
      .box-content {
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        border-radius: 0 0 4px 4px;
      }
    `;
  }
}

if (!customElements.get("hki-header-card-editor")) {
  customElements.define("hki-header-card-editor", HkiHeaderCardEditor);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: CARD_NAME,
  name: "HKI Header Card",
  description: "Full Width Customizable Header.",
  preview: true,
  documentationURL: "https://github.com/jimz011/hki-header-card",
});
