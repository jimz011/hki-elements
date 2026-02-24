// HKI Elements Bundle
// A collection of custom Home Assistant cards by Jimz011

console.info(
  '%c HKI-ELEMENTS %c v1.1.3-dev-23 ',
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
