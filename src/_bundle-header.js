// HKI Elements Bundle
// A collection of custom Home Assistant cards by Jimz011

console.info(
  '%c HKI-ELEMENTS %c v1.3.0-dev-01 ',
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
