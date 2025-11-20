# Product Code Review & Security Audit

**Date:** 2024-05-24
**Reviewer:** Jules

## Executive Summary

The Antler CMS is a well-structured static site generator leveraging Astro, React, and Tailwind. It offers a compelling local development experience for managing Markdown content. However, the current architecture presents significant **Critical Security Vulnerabilities** if deployed to a public environment with the admin interface exposed. It is currently designed as a local-first tool, but this limitation is not explicitly enforced or communicated, leading to potential misuse in production environments.

## 1. Security Vulnerabilities

### 🚨 Critical: Unrestricted Admin Access & API
- **Issue**: The `/admin` interface and its underlying API endpoints (`src/pages/admin/api/**/*`) have **zero authentication or authorization**.
- **Impact**: Anyone who discovers the URL can read, modify, create, and delete all content on the site. They can also upload files.
- **Location**: `src/pages/admin/index.astro`, `src/pages/admin/api/content/[collection].ts`
- **Recommendation**: Implement a robust authentication system (e.g., Auth.js, Clerk, or a simple password protection middleware) immediately. Ensure all API routes verify the user's session before performing actions.

### 🚨 Critical: Directory Traversal (File Uploads & Listing)
- **Issue**: The file upload and listing APIs accept a `directory` parameter directly from the client without sanitization.
- **Impact**: An attacker can traverse directories (e.g., `../../`) to upload files to arbitrary locations on the server or list sensitive files outside the `public/` directory.
- **Location**: `src/pages/admin/api/files/upload.ts`, `src/pages/admin/api/files/list.ts`
- **Code Snippet**: `const uploadDir = path.join(process.cwd(), 'public', directory);`
- **Recommendation**: Validate the `directory` parameter against an allowlist or strictly sanitize it to prevent `..` segments.

### 🚨 Critical: Stored XSS via SVG Uploads
- **Issue**: The file uploader allows `.svg` files. SVGs can contain executable JavaScript.
- **Impact**: If an admin or user views a malicious SVG uploaded by an attacker, the script will execute in their browser context (Stored XSS).
- **Location**: `src/pages/admin/api/files/upload.ts`
- **Recommendation**: Sanitize SVG files upon upload using a library like `isomorphic-dompurify` or similar, or serve them with `Content-Security-Policy` headers that prevent script execution.

### ⚠️ High: Arbitrary File Overwrite
- **Issue**: While the upload script adds a timestamp to filenames, the lack of strict directory controls and the predictable nature of timestamps could allow an attacker to overwrite files if they can guess the timing or flood the server.
- **Location**: `src/pages/admin/api/files/upload.ts`

## 2. Architectural Gaps

### ⚠️ Deployment Incompatibility (Serverless)
- **Observation**: The Admin API relies on `fs.writeFile` to save content and images to the local filesystem.
- **Impact**: This architecture is **incompatible with standard serverless deployments** (Vercel, Cloudflare Pages, Netlify) where the filesystem is ephemeral. Changes made in the Admin UI will be lost upon the next deployment/cold start.
- **Recommendation**:
    -   **Option A (Local-First)**: Explicitly document that the Admin UI is for *local development only*. The workflow would be: Run locally -> Edit Content -> Commit & Push -> CI/CD builds static site.
    -   **Option B (Git-Based)**: Refactor the API to commit changes to a Git repository (GitHub API) instead of the local filesystem.
    -   **Option C (Database)**: Move content storage to a database (e.g., Supabase, Firebase) instead of Markdown files, though this changes the "flat-file" nature of the CMS.

### ⚠️ Static Output vs. Dynamic API
- **Observation**: `astro.config.mjs` sets `output: 'static'`.
- **Impact**: While `adapter: node` is present, mixing static output with dynamic API routes can be tricky depending on the host. If deployed as a purely static site, the API routes will not function at all.

## 3. Code Quality & Improvements

-   **Validation**: The project uses Zod for content schemas (`src/content/config.ts`), which is excellent. However, the API does not validate incoming data against these schemas before writing to disk. It blindly writes the received JSON.
    -   **Recommendation**: Import the collections from `src/content/config.ts` in the API routes and use `.parse()` to validate data before saving.
-   **Error Handling**: The frontend `ContentEditor` handles errors gracefully, but the backend API returns generic 500 errors often. More specific error messages would help debugging.
-   **CSRF**: There is no CSRF protection. If auth is added, CSRF tokens must be implemented for API requests.

## 4. Feature Gaps

-   **Search**: There is no public-facing search functionality for the blog or documentation.
-   **Draft Mode**: There is no clear "Draft" status workflow other than potentially using a `draft: true` frontmatter field, but the build process doesn't seem to filter these out explicitly (needs verification in listing pages).
-   **Image Optimization**: While uploaded, images are served directly. Astro's `<Image />` component should be used in the frontend to optimize these assets automatically.

## 5. Action Plan

1.  **Immediate**: Add a warning to the README stating the Admin UI is unsecured and intended for local use only.
2.  **Short-term**: Fix Directory Traversal vulnerabilities in the File API.
3.  **Medium-term**:
    -   Decide on the deployment strategy (Local vs. Cloud).
    -   Implement Authentication if the Admin UI is to be deployed.
    -   Implement Server-side Zod validation.
