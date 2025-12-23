## 2025-02-05 - Path Traversal Vulnerability in File API
**Vulnerability:** The Admin File API (list and upload endpoints) blindly accepted the `directory` query parameter and used it to construct file paths without validation, allowing path traversal (e.g., `directory=../../etc`).
**Learning:** Even internal admin tools must sanitize file paths. Relying on the assumption that only trusted users will access the API is insufficient.
**Prevention:** Created a centralized `resolveSafePath` utility that verifies the resolved path is within the intended root directory using `path.resolve` and `startsWith`.

## 2025-02-06 - Stored XSS via SVG Upload
**Vulnerability:** The Admin File Upload API allowed uploading `.svg` files (MIME `image/svg+xml`). SVGs can contain executable JavaScript which executes when viewed in a browser. Since uploads are served from the same domain, this created a Stored XSS vulnerability.
**Learning:** File upload restrictions must consider not just "executable" extensions (like .php, .exe) but also client-side executable formats like SVG. Content-Type validation alone is insufficient; context (viewing in browser) matters.
**Prevention:** Removed `image/svg+xml` from the allowed file types in the upload endpoint. SVG usage should be restricted to sanitized inputs or text-based configuration where possible.
