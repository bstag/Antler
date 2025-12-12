## 2024-05-22 - Icon-only Buttons & Checkboxes Accessibility
**Learning:** Icon-only toggle buttons (like view switchers) and individual item checkboxes in management interfaces are common accessibility gaps. Using emojis as icons without `aria-label` makes them completely inaccessible to screen readers.
**Action:** Always add `aria-label` and `title` to icon-only buttons. For list item checkboxes, dynamically generate `aria-label` using the item's name (e.g., `aria-label={"Select " + file.name}`).
