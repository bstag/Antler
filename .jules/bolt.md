## 2026-02-03 - React Component Definition in Render
**Learning:** Found components (`NestedObjectField`, `ArrayOfObjectsField`) defined inside the `DynamicForm` component body. This causes full unmount/remount on every render, destroying focus and state.
**Action:** Always define components at the top level or in separate files. Pass necessary context (like `control` from `react-hook-form`) via props.

## 2025-03-03 - Batched API Calls for Schemas
**Learning:** Found an N+1 fetching pattern in `AdminApp.tsx` where 10 separate API calls were made to fetch schemas sequentially on application initialization. This caused significant latency when opening the admin panel.
**Action:** Batched multiple API calls into a single request by creating an `index.ts` endpoint under `admin/api/schema` to return all schemas at once, improving initial load time significantly.

## 2025-03-10 - Batched API Calls for Stats
**Learning:** Found an N+1 fetching pattern in `ResumeManager.tsx` where 7 separate API calls to `/admin/api/content/:collection` were made concurrently to count "total" and "recent" items for each resume collection. Returning full entries just to compute counts/recent totals caused performance overhead on the server and frontend.
**Action:** Added `recent` and `featured` stats computation on the server-side within the existing `src/pages/admin/api/stats.ts` batch endpoint. Updated the component to make a single API call to `admin/api/stats` instead, drastically reducing network requests and payload sizes.
