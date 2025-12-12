## 2025-02-05 - Path Traversal Vulnerability in File API
**Vulnerability:** The Admin File API (list and upload endpoints) blindly accepted the `directory` query parameter and used it to construct file paths without validation, allowing path traversal (e.g., `directory=../../etc`).
**Learning:** Even internal admin tools must sanitize file paths. Relying on the assumption that only trusted users will access the API is insufficient.
**Prevention:** Created a centralized `resolveSafePath` utility that verifies the resolved path is within the intended root directory using `path.resolve` and `startsWith`.
