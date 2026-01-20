## 2024-05-22 - Icon-only Buttons & Checkboxes Accessibility
**Learning:** Icon-only toggle buttons (like view switchers) and individual item checkboxes in management interfaces are common accessibility gaps. Using emojis as icons without `aria-label` makes them completely inaccessible to screen readers.
**Action:** Always add `aria-label` and `title` to icon-only buttons. For list item checkboxes, dynamically generate `aria-label` using the item's name (e.g., `aria-label={"Select " + file.name}`).

## 2026-01-13 - Semantic Links for File Actions
**Learning:** Using `<button>` with `window.open()` for external links (like "View" file) triggers popup blockers and lacks proper link semantics for assistive technology.
**Action:** Use `<a>` tags with `target="_blank"` and `rel="noopener noreferrer"` for external links or file views, ensuring they are styled consistently with buttons if needed. Always include an `aria-label` if the visible text is generic (e.g., "View").

## 2026-01-20 - Keyboard Shortcuts & React State
**Learning:** React event listeners attached via `useEffect` (like window keydown) often capture stale state unless `useRef` is used to store mutable callbacks. Also, UI claiming to have shortcuts that don't work is a significant UX gap.
**Action:** Always verify "advertised" shortcuts actually function. Use `useRef` to hold `handleSave` or `handleSubmit` functions when binding global event listeners to ensure they access the latest state/props.
