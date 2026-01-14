const assert = require('assert');
const fs = require('fs');

const css = fs.readFileSync('assets/css/styles.css', 'utf8');
const js = fs.readFileSync('assets/js/main.js', 'utf8');

function getBlock(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`${escaped}\\s*{[^}]*}`, 's');
  const match = css.match(re);
  assert(match, `Missing CSS block for ${selector}`);
  return match[0];
}

const overlay = getBlock('.mobile-menu-overlay');
assert(/pointer-events:\s*none/.test(overlay), 'Overlay should ignore pointer events when inactive');

const overlayActive = getBlock('.mobile-menu-overlay.active');
assert(/pointer-events:\s*auto/.test(overlayActive), 'Overlay should capture pointer events when active');

const nav = getBlock('.mobile-nav');
assert(/visibility:\s*hidden/.test(nav), 'Mobile nav should be hidden when closed');
assert(/pointer-events:\s*none/.test(nav), 'Mobile nav should ignore pointer events when closed');

const navOpen = getBlock('.mobile-nav.open');
assert(/visibility:\s*visible/.test(navOpen), 'Mobile nav should be visible when open');
assert(/pointer-events:\s*auto/.test(navOpen), 'Mobile nav should accept pointer events when open');

assert(/aria-hidden/.test(js), 'JS should manage aria-hidden for mobile nav');
assert(/setAttribute\(\s*['"]aria-hidden['"]\s*,\s*['"]true['"]\s*\)/.test(js), 'JS should set aria-hidden="true" when closed');
assert(/setAttribute\(\s*['"]aria-hidden['"]\s*,\s*['"]false['"]\s*\)/.test(js), 'JS should set aria-hidden="false" when open');

console.log('mobile-menu.test.js: OK');
