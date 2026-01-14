## 2024-05-23 - [SSR vs Static Security Nuance]
**Vulnerability:** Admin interface exposed in production without auth if SSR adapter is used.
**Learning:** Even with 'output: static', 'prerender = false' routes with an adapter enable SSR. User belief of 'local only' is fragile.
**Prevention:** Defense in Depth: Secure the routes via middleware regardless of deployment target. Use opt-in config to avoid breaking static workflow.
