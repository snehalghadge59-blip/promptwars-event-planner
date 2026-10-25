# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :white_check_mark: |

## Client-Side Security Model

AuraPlan AI executes completely within the client's browser environment:
1. **Zero Secret Persistence:** API keys entered into the modal are stored exclusively in non-persisted `sessionStorage` and are never transmitted to third-party tracking or remote telemetry servers.
2. **XSS & Injection Protection:** User inputs into custom event parameters and invitation generators are sanitized before HTML or DOM rendering.
3. **Data Sovereignty:** All RFC 5545 `.ics` and Markdown export files are compiled using pure client-side standard libraries with zero external proxy dependencies.

## Reporting a Vulnerability

If you discover any potential security vulnerability, please contact:
- **Email:** snehalghadge59@gmail.com
- All reports receive an initial acknowledgment within 24 hours.
