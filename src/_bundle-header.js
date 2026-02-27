// HKI Elements Bundle
// A collection of custom Home Assistant cards by Jimz011

console.info(
  '%c HKI-ELEMENTS %c v1.4.0-dev-16 ',
  'color: white; background: #7017b8; font-weight: bold;',
  'color: #7017b8; background: white; font-weight: bold;'
);

// Import Lit once for all cards
import { LitElement, html, css } from "https://unpkg.com/lit@2.8.0/index.js?module";

// Make Lit available globally for cards that use dynamic loading
if (!window.LitElement) {
  window.LitElement = LitElement;
  window.html = html;
  window.css = css;
}

// HKI shared helpers (load once, reuse across cards)
window.HKI = window.HKI || {};

// Shared popup-related keys used across cards/editors.
window.HKI.POPUP_CONFIG_KEYS = window.HKI.POPUP_CONFIG_KEYS || [
  "custom_popup_enabled",
  "custom_popup_card",
  "popup_name",
  "popup_state",
  "popup_icon",
  "popup_use_entity_picture",
  "popup_border_radius",
  "popup_width",
  "popup_width_custom",
  "popup_height",
  "popup_height_custom",
  "popup_open_animation",
  "popup_close_animation",
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
  "popup_time_format",
  "popup_default_view",
  "popup_default_section",
  "popup_highlight_color",
  "popup_highlight_text_color",
  "popup_highlight_radius",
  "popup_highlight_opacity",
  "popup_highlight_border_color",
  "popup_highlight_border_style",
  "popup_highlight_border_width",
  "popup_highlight_box_shadow",
  "popup_button_bg",
  "popup_button_text_color",
  "popup_button_radius",
  "popup_button_opacity",
  "popup_button_border_color",
  "popup_button_border_style",
  "popup_button_border_width",
  "popup_bottom_bar_entities",
  "popup_bottom_bar_align",
  "popup_hide_bottom_bar",
  "popup_hide_top_bar",
  "popup_show_close_button",
  "popup_close_on_action",
  "_bb_slots",
  "person_geocoded_entity",
  "sensor_graph_color",
  "sensor_graph_gradient",
  "sensor_line_width",
  "sensor_hours",
  "sensor_graph_style",
  "climate_temp_step",
  "climate_use_circular_slider",
  "climate_show_plus_minus",
  "climate_show_gradient",
  "climate_show_target_range",
  "climate_humidity_entity",
  "climate_humidity_name",
  "climate_pressure_entity",
  "climate_pressure_name",
  "climate_current_temperature_entity",
  "climate_temperature_name",
  "humidifier_humidity_step",
  "humidifier_use_circular_slider",
  "humidifier_show_plus_minus",
  "humidifier_show_gradient",
  "humidifier_fan_entity",
];

window.HKI.copyDefinedKeys = window.HKI.copyDefinedKeys || (({
  src,
  dst,
  keys,
  srcPrefix = "",
  dstPrefix = "",
  onlyIfDstMissing = false,
} = {}) => {
  if (!src || !dst || !Array.isArray(keys)) return dst;
  keys.forEach((k) => {
    const srcKey = `${srcPrefix}${k}`;
    const dstKey = `${dstPrefix}${k}`;
    if (src[srcKey] === undefined) return;
    if (onlyIfDstMissing && dst[dstKey] !== undefined) return;
    dst[dstKey] = src[srcKey];
  });
  return dst;
});

// Shared popup editor option lists to reduce duplication across card editors.
window.HKI.POPUP_EDITOR_OPTIONS = window.HKI.POPUP_EDITOR_OPTIONS || Object.freeze({
  animations: Object.freeze([
    Object.freeze({ value: "none", label: "None" }),
    Object.freeze({ value: "fade", label: "Fade" }),
    Object.freeze({ value: "scale", label: "Scale" }),
    Object.freeze({ value: "zoom", label: "Zoom" }),
    Object.freeze({ value: "slide-up", label: "Slide Up" }),
    Object.freeze({ value: "slide-down", label: "Slide Down" }),
    Object.freeze({ value: "slide-left", label: "Slide Left" }),
    Object.freeze({ value: "slide-right", label: "Slide Right" }),
    Object.freeze({ value: "flip", label: "Flip" }),
    Object.freeze({ value: "bounce", label: "Bounce" }),
    Object.freeze({ value: "rotate", label: "Rotate" }),
    Object.freeze({ value: "drop", label: "Drop" }),
    Object.freeze({ value: "swing", label: "Swing" }),
  ]),
  width: Object.freeze([
    Object.freeze({ value: "auto", label: "Auto (Responsive)" }),
    Object.freeze({ value: "default", label: "Default (400px)" }),
    Object.freeze({ value: "custom", label: "Custom" }),
  ]),
  height: Object.freeze([
    Object.freeze({ value: "auto", label: "Auto (Responsive)" }),
    Object.freeze({ value: "default", label: "Default (600px)" }),
    Object.freeze({ value: "custom", label: "Custom" }),
  ]),
  timeFormats: Object.freeze([
    Object.freeze({ value: "auto", label: "Auto" }),
    Object.freeze({ value: "12", label: "12-Hour Clock" }),
    Object.freeze({ value: "24", label: "24-Hour Clock" }),
  ]),
});

// Shared editor option lists across HKI card editors.
window.HKI.EDITOR_OPTIONS = window.HKI.EDITOR_OPTIONS || Object.freeze({
  borderStyles: Object.freeze([
    Object.freeze({ value: "solid", label: "solid" }),
    Object.freeze({ value: "dashed", label: "dashed" }),
    Object.freeze({ value: "dotted", label: "dotted" }),
    Object.freeze({ value: "double", label: "double" }),
    Object.freeze({ value: "none", label: "none" }),
  ]),
  buttonActionOptions: Object.freeze([
    Object.freeze({ value: "toggle", label: "Toggle" }),
    Object.freeze({ value: "hki-more-info", label: "More Info (HKI)" }),
    Object.freeze({ value: "more-info", label: "More Info (Native)" }),
    Object.freeze({ value: "navigate", label: "Navigate" }),
    Object.freeze({ value: "perform-action", label: "Perform Action" }),
    Object.freeze({ value: "url", label: "URL" }),
    Object.freeze({ value: "fire-dom-event", label: "Fire DOM Event" }),
    Object.freeze({ value: "none", label: "None" }),
  ]),
  headerActionOptions: Object.freeze([
    Object.freeze({ value: "none", label: "None" }),
    Object.freeze({ value: "navigate", label: "Navigate" }),
    Object.freeze({ value: "back", label: "Back" }),
    Object.freeze({ value: "menu", label: "Toggle Menu" }),
    Object.freeze({ value: "url", label: "Open URL" }),
    Object.freeze({ value: "more-info", label: "More Info" }),
    Object.freeze({ value: "hki-more-info", label: "HKI More Info" }),
    Object.freeze({ value: "toggle", label: "Toggle Entity" }),
    Object.freeze({ value: "perform-action", label: "Perform Action" }),
    Object.freeze({ value: "fire-dom-event", label: "Fire DOM Event" }),
  ]),
  popupBottomBarActionOptions: Object.freeze([
    Object.freeze({ value: "toggle", label: "Toggle" }),
    Object.freeze({ value: "more-info", label: "More Info" }),
    Object.freeze({ value: "hki-more-info", label: "HKI More Info" }),
    Object.freeze({ value: "navigate", label: "Navigate" }),
    Object.freeze({ value: "perform-action", label: "Perform Action" }),
    Object.freeze({ value: "fire-dom-event", label: "Fire DOM Event" }),
    Object.freeze({ value: "url", label: "URL" }),
    Object.freeze({ value: "none", label: "None" }),
  ]),
  popupDefaultViewOptions: Object.freeze([
    Object.freeze({ value: "main", label: "Main (Group Controls)" }),
    Object.freeze({ value: "individual", label: "Individual Entities" }),
  ]),
  popupDefaultSectionOptions: Object.freeze([
    Object.freeze({ value: "last", label: "Last Used" }),
    Object.freeze({ value: "brightness", label: "Always Brightness" }),
    Object.freeze({ value: "color", label: "Always Color" }),
    Object.freeze({ value: "temperature", label: "Always Temperature" }),
  ]),
  popupDefaultSectionOptionsTagged: Object.freeze([
    Object.freeze({ value: "last", label: "Last Used (Default)" }),
    Object.freeze({ value: "brightness", label: "Always Brightness" }),
    Object.freeze({ value: "color", label: "Always Color" }),
    Object.freeze({ value: "temperature", label: "Always Temperature" }),
  ]),
  popupBottomBarAlignOptions: Object.freeze([
    Object.freeze({ value: "spread", label: "Spread" }),
    Object.freeze({ value: "start", label: "Start" }),
    Object.freeze({ value: "center", label: "Center" }),
    Object.freeze({ value: "end", label: "End" }),
  ]),
  popupBottomBarAlignOptionsDetailed: Object.freeze([
    Object.freeze({ value: "spread", label: "Spread (space around)" }),
    Object.freeze({ value: "start", label: "Start (left aligned)" }),
    Object.freeze({ value: "center", label: "Center" }),
    Object.freeze({ value: "end", label: "End (right aligned)" }),
  ]),
});

// Resolve LitElement/html/css from HA's base elements when possible (better compatibility),
// and cache the result to avoid repeated lookups.
window.HKI.getLit = window.HKI.getLit || (() => {
  let cache = null;
  return () => {
    if (cache) return cache;
    const base =
      customElements.get("hui-masonry-view") ||
      customElements.get("ha-panel-lovelace") ||
      customElements.get("ha-app");
    const LitElementRef = base ? Object.getPrototypeOf(base) : window.LitElement;
    const htmlRef = LitElementRef?.prototype?.html || window.html;
    const cssRef = LitElementRef?.prototype?.css || window.css;
    cache = { LitElement: LitElementRef, html: htmlRef, css: cssRef };
    return cache;
  };
})();

// Inject popup animation keyframes once into the document
window.HKI.ensurePopupAnimations = window.HKI.ensurePopupAnimations || (() => {
  let done = false;
  return () => {
    if (done) return;
    done = true;
    try {
      if (document.getElementById("hki-popup-animations")) return;
      const s = document.createElement("style");
      s.id = "hki-popup-animations";
      s.textContent = `
@keyframes hki-anim-fade-in        { from { opacity: 0; } to { opacity: 1; } }
@keyframes hki-anim-fade-out       { from { opacity: 1; } to { opacity: 0; } }

@keyframes hki-anim-scale-in       { from { transform: scale(.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes hki-anim-scale-out      { from { transform: scale(1); opacity: 1; } to { transform: scale(.92); opacity: 0; } }

@keyframes hki-anim-zoom-in        { from { transform: scale(.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes hki-anim-zoom-out       { from { transform: scale(1); opacity: 1; } to { transform: scale(.92); opacity: 0; } }

@keyframes hki-anim-slide-up       { from { transform: translateY(14px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes hki-anim-slide-down     { from { transform: translateY(-14px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes hki-anim-slide-left     { from { transform: translateX(14px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes hki-anim-slide-right    { from { transform: translateX(-14px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

@keyframes hki-anim-slide-out-up    { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-14px); opacity: 0; } }
@keyframes hki-anim-slide-out-down  { from { transform: translateY(0); opacity: 1; } to { transform: translateY(14px); opacity: 0; } }
@keyframes hki-anim-slide-out-left  { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-14px); opacity: 0; } }
@keyframes hki-anim-slide-out-right { from { transform: translateX(0); opacity: 1; } to { transform: translateX(14px); opacity: 0; } }

@keyframes hki-anim-rotate-in      { from { transform: rotate(-2deg) scale(.96); opacity: 0; } to { transform: rotate(0) scale(1); opacity: 1; } }
@keyframes hki-anim-rotate-out     { from { transform: rotate(0) scale(1); opacity: 1; } to { transform: rotate(2deg) scale(.96); opacity: 0; } }

@keyframes hki-anim-drop-in        { from { transform: translateY(-18px) scale(.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
@keyframes hki-anim-drop-out       { from { transform: translateY(0) scale(1); opacity: 1; } to { transform: translateY(-18px) scale(.98); opacity: 0; } }

@keyframes hki-anim-bounce-in {
  0%   { transform: scale(.9); opacity: 0; }
  60%  { transform: scale(1.03); opacity: 1; }
  80%  { transform: scale(.985); }
  100% { transform: scale(1); }
}
@keyframes hki-anim-bounce-out {
  0%   { transform: scale(1); opacity: 1; }
  20%  { transform: scale(1.02); }
  100% { transform: scale(.9); opacity: 0; }
}

@keyframes hki-anim-flip-in {
  0%   { transform: perspective(800px) rotateX(14deg) scale(.98); opacity: 0; }
  100% { transform: perspective(800px) rotateX(0deg) scale(1); opacity: 1; }
}
@keyframes hki-anim-flip-out {
  0%   { transform: perspective(800px) rotateX(0deg) scale(1); opacity: 1; }
  100% { transform: perspective(800px) rotateX(-12deg) scale(.98); opacity: 0; }
}

@keyframes hki-anim-swing-in {
  0%   { transform: translateY(8px) rotate(-2deg); opacity: 0; }
  60%  { transform: translateY(0) rotate(1deg); opacity: 1; }
  100% { transform: translateY(0) rotate(0deg); }
}
@keyframes hki-anim-swing-out {
  0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(8px) rotate(2deg); opacity: 0; }
}
`;
      document.head.appendChild(s);
    } catch (e) {
      // no-op
    }
  };
})();

// Global scroll lock helpers (shared across cards)
window.HKI._scrollState = window.HKI._scrollState || {
  prevOverflow: null,
  prevPosition: null,
  prevTop: null,
  scrollY: 0,
};

window.HKI.lockScroll = window.HKI.lockScroll || (() => {
  const st = window.HKI._scrollState;
  return () => {
    try {
      if (st.prevOverflow !== null) return; // already locked
      st.scrollY = window.scrollY || window.pageYOffset || 0;
      st.prevOverflow = document.body.style.overflow;
      st.prevPosition = document.body.style.position;
      st.prevTop = document.body.style.top;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${st.scrollY}px`;
      document.body.style.width = "100%";
    } catch (e) {
      // no-op
    }
  };
})();

window.HKI.unlockScroll = window.HKI.unlockScroll || (() => {
  const st = window.HKI._scrollState;
  return () => {
    try {
      if (st.prevOverflow === null) return;
      document.body.style.overflow = st.prevOverflow || "";
      document.body.style.position = st.prevPosition || "";
      document.body.style.top = st.prevTop || "";
      document.body.style.width = "";
      window.scrollTo(0, st.scrollY || 0);
    } catch (e) {
      // no-op
    } finally {
      st.prevOverflow = null;
      st.prevPosition = null;
      st.prevTop = null;
      st.scrollY = 0;
    }
  };
})();

// Shared popup style/dimension helpers used by multiple HKI cards
window.HKI.getPopupBackdropStyle = window.HKI.getPopupBackdropStyle || ((config = {}) => {
  const blurEnabled = config.popup_blur_enabled !== false;
  const blurAmount = config.popup_blur_amount !== undefined ? Number(config.popup_blur_amount) : 10;
  const blur = blurEnabled && blurAmount > 0
    ? `backdrop-filter: blur(${blurAmount}px); -webkit-backdrop-filter: blur(${blurAmount}px); will-change: backdrop-filter;`
    : "";
  return `background: rgba(0,0,0,0.7); ${blur}`;
});

window.HKI.getPopupCardStyle = window.HKI.getPopupCardStyle || ((config = {}) => {
  const cardBlurEnabled = config.popup_card_blur_enabled !== false;
  const cardBlurAmount = config.popup_card_blur_amount !== undefined ? Number(config.popup_card_blur_amount) : 40;
  let cardOpacity = config.popup_card_opacity !== undefined ? Number(config.popup_card_opacity) : 0.4;

  // Keep transparency when blur is on so the glass effect remains visible.
  if (cardBlurEnabled && cardOpacity === 1) cardOpacity = 0.7;

  const bg = (cardOpacity < 1 || cardBlurEnabled)
    ? `background: rgba(28, 28, 28, ${cardOpacity});`
    : `background: var(--card-background-color, #1c1c1c);`;

  const blur = cardBlurEnabled && cardBlurAmount > 0
    ? `backdrop-filter: blur(${cardBlurAmount}px); -webkit-backdrop-filter: blur(${cardBlurAmount}px);`
    : "";

  return bg + (blur ? ` ${blur}` : "");
});

window.HKI.getPopupDimensions = window.HKI.getPopupDimensions || ((config = {}) => {
  const widthCfg = config.popup_width || "auto";
  const heightCfg = config.popup_height || "auto";

  let width = "95vw; max-width: 500px";
  let height = "90vh; max-height: 800px";

  if (widthCfg === "custom") {
    width = `${config.popup_width_custom ?? 400}px`;
  } else if (widthCfg === "default") {
    width = "90%; max-width: 400px";
  } else if (!isNaN(Number(widthCfg))) {
    width = `${Number(widthCfg)}px`;
  }

  if (heightCfg === "custom") {
    height = `${config.popup_height_custom ?? 600}px`;
  } else if (heightCfg === "default") {
    height = "600px";
  } else if (!isNaN(Number(heightCfg))) {
    height = `${Number(heightCfg)}px`;
  }

  return { width, height };
});

window.HKI.getPopupOpenKeyframe = window.HKI.getPopupOpenKeyframe || ((anim) => {
  const map = {
    fade: "hki-anim-fade-in",
    scale: "hki-anim-scale-in",
    "slide-up": "hki-anim-slide-up",
    "slide-down": "hki-anim-slide-down",
    "slide-left": "hki-anim-slide-left",
    "slide-right": "hki-anim-slide-right",
    flip: "hki-anim-flip-in",
    bounce: "hki-anim-bounce-in",
    zoom: "hki-anim-zoom-in",
    rotate: "hki-anim-rotate-in",
    drop: "hki-anim-drop-in",
    swing: "hki-anim-swing-in",
  };
  return map[anim] || "hki-anim-fade-in";
});

window.HKI.getPopupCloseKeyframe = window.HKI.getPopupCloseKeyframe || ((anim) => {
  const map = {
    fade: "hki-anim-fade-out",
    scale: "hki-anim-scale-out",
    "slide-up": "hki-anim-slide-out-down",
    "slide-down": "hki-anim-slide-out-up",
    "slide-left": "hki-anim-slide-out-right",
    "slide-right": "hki-anim-slide-out-left",
    flip: "hki-anim-flip-out",
    bounce: "hki-anim-scale-out",
    zoom: "hki-anim-zoom-out",
    rotate: "hki-anim-rotate-out",
    drop: "hki-anim-drop-out",
    swing: "hki-anim-swing-out",
  };
  return map[anim] || "hki-anim-fade-out";
});

window.HKI.animatePopupOpen = window.HKI.animatePopupOpen || (({
  portal,
  config = {},
  selector = ".hki-popup-container",
} = {}) => {
  if (!portal) return false;
  const anim = config.popup_open_animation || "scale";
  if (anim === "none") return false;
  const dur = config.popup_animation_duration ?? 300;
  const container = portal.querySelector(selector);
  if (!container) return false;
  window.HKI?.ensurePopupAnimations?.();
  container.style.animation = "none";
  void container.offsetWidth;
  container.style.animation = `${window.HKI.getPopupOpenKeyframe(anim)} ${dur}ms ease forwards`;
  return true;
});

window.HKI.animatePopupClose = window.HKI.animatePopupClose || (({
  portal,
  config = {},
  selector = ".hki-popup-container",
  onDone,
  fallbackDelayMs = 100,
} = {}) => {
  const done = (() => {
    let called = false;
    return () => {
      if (called) return;
      called = true;
      onDone?.();
    };
  })();

  if (!portal) {
    done();
    return;
  }

  const anim = config.popup_close_animation || config.popup_open_animation || "scale";
  const dur = config.popup_animation_duration ?? 300;
  if (anim === "none") {
    done();
    return;
  }

  const container = portal.querySelector(selector);
  if (!container) {
    done();
    return;
  }

  window.HKI?.ensurePopupAnimations?.();
  container.style.animation = "none";
  void container.offsetWidth;
  container.style.animation = `${window.HKI.getPopupCloseKeyframe(anim)} ${dur}ms ease forwards`;
  container.addEventListener("animationend", done, { once: true });
  setTimeout(done, dur + fallbackDelayMs);
});

// HKI global card defaults (shared across card types)
window.HKI.GLOBAL_SETTINGS_STORAGE_KEY = window.HKI.GLOBAL_SETTINGS_STORAGE_KEY || "hki_elements_global_settings_v1";
window.HKI._globalSettingsCache = window.HKI._globalSettingsCache || null;

window.HKI.isUnsetValue = window.HKI.isUnsetValue || ((value) => {
  if (value === undefined || value === null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  return false;
});

window.HKI.getGlobalSettings = window.HKI.getGlobalSettings || (() => {
  const key = window.HKI.GLOBAL_SETTINGS_STORAGE_KEY;
  if (window.HKI._globalSettingsCache) return window.HKI._globalSettingsCache;
  try {
    const raw = window.localStorage?.getItem(key);
    if (!raw) {
      window.HKI._globalSettingsCache = { button: {}, header: {}, navigation: {}, popup: {} };
      return window.HKI._globalSettingsCache;
    }
    const parsed = JSON.parse(raw);
    const next = {
      button: (parsed?.button && typeof parsed.button === "object") ? parsed.button : {},
      header: (parsed?.header && typeof parsed.header === "object") ? parsed.header : {},
      navigation: (parsed?.navigation && typeof parsed.navigation === "object") ? parsed.navigation : {},
      popup: (parsed?.popup && typeof parsed.popup === "object") ? parsed.popup : {},
    };
    window.HKI._globalSettingsCache = next;
    return next;
  } catch (_) {
    window.HKI._globalSettingsCache = { button: {}, header: {}, navigation: {}, popup: {} };
    return window.HKI._globalSettingsCache;
  }
});

window.HKI.setGlobalSettings = window.HKI.setGlobalSettings || ((settings = {}) => {
  const current = window.HKI.getGlobalSettings();
  const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj || {}, key);
  const next = {
    ...current,
    ...(settings || {}),
    button: hasOwn(settings, "button")
      ? (((settings && settings.button) && typeof settings.button === "object") ? { ...settings.button } : {})
      : { ...(current.button || {}) },
    header: hasOwn(settings, "header")
      ? (((settings && settings.header) && typeof settings.header === "object") ? { ...settings.header } : {})
      : { ...(current.header || {}) },
    navigation: hasOwn(settings, "navigation")
      ? (((settings && settings.navigation) && typeof settings.navigation === "object") ? { ...settings.navigation } : {})
      : { ...(current.navigation || {}) },
    popup: hasOwn(settings, "popup")
      ? (((settings && settings.popup) && typeof settings.popup === "object") ? { ...settings.popup } : {})
      : { ...(current.popup || {}) },
  };
  window.HKI._globalSettingsCache = next;
  try {
    window.localStorage?.setItem(window.HKI.GLOBAL_SETTINGS_STORAGE_KEY, JSON.stringify(next));
  } catch (_) {
    // Ignore storage write failures (private mode / quota / restricted env).
  }
  try {
    window.dispatchEvent(new CustomEvent("hki-global-settings-changed", { detail: { settings: next } }));
  } catch (_) {
    // Ignore event dispatch failures.
  }
  return next;
});

window.HKI.getGlobalDefaultsFor = window.HKI.getGlobalDefaultsFor || ((scope) => {
  const settings = window.HKI.getGlobalSettings();
  if (!scope) return {};
  const scoped = settings?.[scope];
  return (scoped && typeof scoped === "object") ? scoped : {};
});

window.HKI.applyGlobalDefaultsToConfig = window.HKI.applyGlobalDefaultsToConfig || (({
  scope,
  config,
  sourceConfig = {},
  fields = [],
} = {}) => {
  if (!scope || !config || typeof config !== "object" || !Array.isArray(fields) || !fields.length) return config;
  const scopedDefaults = window.HKI.getGlobalDefaultsFor(scope);
  if (!scopedDefaults || typeof scopedDefaults !== "object") return config;

  fields.forEach((entry) => {
    const targetKey = (typeof entry === "string") ? entry : entry?.target;
    const sourceKey = (typeof entry === "string") ? entry : (entry?.source || entry?.target);
    const globalKey = (typeof entry === "string") ? entry : (entry?.global || entry?.target);
    if (!targetKey || !globalKey) return;

    const sourceValue = sourceConfig ? sourceConfig[sourceKey] : undefined;
    if (!window.HKI.isUnsetValue(sourceValue)) return;

    const globalValue = scopedDefaults[globalKey];
    if (window.HKI.isUnsetValue(globalValue)) return;
    config[targetKey] = globalValue;
  });

  return config;
});
