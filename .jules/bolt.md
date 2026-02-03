## 2026-02-03 - React Component Definition in Render
**Learning:** Found components (`NestedObjectField`, `ArrayOfObjectsField`) defined inside the `DynamicForm` component body. This causes full unmount/remount on every render, destroying focus and state.
**Action:** Always define components at the top level or in separate files. Pass necessary context (like `control` from `react-hook-form`) via props.
