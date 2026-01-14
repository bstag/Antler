## 2025-02-05 - Path Traversal Vulnerability in File API
**Vulnerability:** The Admin File API (list and upload endpoints) blindly accepted the `directory` query parameter and used it to construct file paths without validation, allowing path traversal (e.g., `directory=../../etc`).
**Learning:** Even internal admin tools must sanitize file paths. Relying on the assumption that only trusted users will access the API is insufficient.
**Prevention:** Created a centralized `resolveSafePath` utility that verifies the resolved path is within the intended root directory using `path.resolve` and `startsWith`.

## 2025-02-06 - Stored XSS via SVG Upload
**Vulnerability:** The Admin File Upload API allowed uploading `.svg` files (MIME `image/svg+xml`). SVGs can contain executable JavaScript which executes when viewed in a browser. Since uploads are served from the same domain, this created a Stored XSS vulnerability.
**Learning:** File upload restrictions must consider not just "executable" extensions (like .php, .exe) but also client-side executable formats like SVG. Content-Type validation alone is insufficient; context (viewing in browser) matters.
**Prevention:** Removed `image/svg+xml` from the allowed file types in the upload endpoint. SVG usage should be restricted to sanitized inputs or text-based configuration where possible.

## 2024-05-22 - Path Traversal in Admin Content API
**Vulnerability:** The Admin API content endpoints (`GET`, `POST`, `PUT`, `DELETE` in `src/pages/admin/api/content/[collection].ts` and `[collection]/[id].ts`) accepted raw `collection` and `id` parameters which were directly concatenated into file paths. This allowed path traversal (e.g., `collection=../../`).
**Learning:** Even when using higher-level abstractions like Astro's `getCollection`, manual file system operations in API endpoints must always validate and sanitize user inputs against a whitelist or use secure path resolution helpers.
**Prevention:**
1.  Implemented `validateCollection` in `src/lib/file-security.ts` to enforce a strict whitelist regex (`^[a-zA-Z0-9_-]+$`).
2.  Used `resolveSafePath` for all file operations to ensure the resolved path stays within the intended root directory.
