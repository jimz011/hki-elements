// HKI Elements Bundle
// A collection of custom Home Assistant cards by Jimmy
// Version: 1.0.0

console.info(
  '%c HKI-ELEMENTS %c v1.0.4-dev-01 ',
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
