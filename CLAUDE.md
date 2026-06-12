# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
```

No linting or test scripts are configured.

## Environment Variables

`RESEND_API_KEY` — required for the contact form email sending (`src/app/actions/sendEmail.js`).

**Google Calendar Booking** (all three required for the booking widget to work):
- `GOOGLE_CALENDAR_ID` — the calendar to read/write events on
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` — service account email from Google Cloud Console
- `GOOGLE_PRIVATE_KEY` — private key from the service account JSON (newlines as `\n`)

## Architecture

This is a **Next.js 16 marketing/portfolio site** for Bluehydra, a software development agency. It uses the App Router, React 19, Tailwind CSS v4, and Framer Motion for animations.

### Pages
- `/` — Homepage composed of section components stacked vertically
- `/contact` — Contact form + Google Calendar booking widget (`BookingWidget.jsx`)

### API Routes
- `GET /api/availability?date=YYYY-MM-DD` — returns available 30-min slots for a weekday by querying Google Calendar free/busy
- `POST /api/book` — creates a Google Calendar event and sends the client a calendar invite via the Resend attendee mechanism

### Key Patterns

**Centralized data** — All site content (copy, services, projects, testimonials, navigation, contact info) lives in `src/lib/data.js` as `companyData`. Components import from there rather than hardcoding content.

**Component structure** — `src/components/` holds all homepage section components:
- `Navbar.jsx` / `Footer.jsx` — persistent layout (rendered in `layout.js`)
- `HeroSection.jsx`, `ExpertiseStrip.jsx`, `ServicesOverview.jsx`, `ProjectsShowcase.jsx`, `ValueProposition.jsx`, `Testimonials.jsx` — homepage sections in order

**Email** — `src/app/actions/sendEmail.js` is a Next.js Server Action (`"use server"`) using the Resend SDK. It sends inquiries to `bluehydra001@gmail.com`.

### Styling

Tailwind CSS v4 with a custom theme defined in `src/app/globals.css` via `@theme`. Key design tokens:
- `navy-deep` (#09051e) — dark backgrounds
- `navy-primary` (#7c3aed) — electric violet, main brand color
- `accent-gold` (#06b6d4) — electric cyan/teal accent
- `charcoal` (#1e1b4b) — body text

Reusable CSS classes defined in `globals.css`: `.btn-primary`, `.btn-secondary`, `.gradient-text`, `.card-hover`, `.decorative-line`, `.section-padding`, `.backdrop-blur-glass`.

### React Compiler

`reactCompiler: true` is enabled in `next.config.mjs`, so manual `useMemo`/`useCallback` optimization is generally unnecessary.

## Workstation Security Constraints

This project runs on a corporate bank workstation with enterprise endpoint protection (EDR/XDR) that monitors all process activity. The following behaviors have been flagged as suspicious or blocked by IT security. Claude Code MUST avoid all of them.

### Banned Behaviors
1. **No Base64 encoding/decoding in command line** — Do not use `base64.b64decode()`, `base64.b64encode()`, or pass Base64-encoded payloads via CLI arguments. This is the #1 malware indicator that gets flagged.
2. **No temporary script creation** — Do not create temp `.py`, `.ps1`, `.bat`, `.vbs`, or `.sh` files in AppData/Temp or any temp directory for bootstrapping or execution purposes.
3. **No shell spawning via Git Bash** — Do not invoke `bash.exe` from Git's installation directory to run commands. Use `cmd.exe` or PowerShell directly if a shell is needed.
4. **No `eval()` or `exec()` with dynamically constructed code** — These patterns are flagged as code injection by endpoint protection.
5. **No downloading executables or scripts from the internet at runtime** — Do not use `curl`, `wget`, `Invoke-WebRequest`, or similar to fetch and execute remote scripts.
6. **No obfuscated or encoded command-line arguments** — All CLI commands must be human-readable. No hex escapes, no encoded strings, no nested quoting tricks.
7. **No process injection or hooking** — Do not attach to, modify, or spawn child processes in unusual ways.
8. **No modifying system PATH, registry, or startup entries** — Do not write to HKCU\Run, Startup folders, or modify environment variables system-wide.
9. **No keylogging-like behaviors** — Do not capture keyboard input, clipboard content, or screen activity.
10. **No network scanning or port probing** — Do not run `nmap`, port scans, or enumerate network hosts.
11. **No credential access patterns** — Do not read browser saved passwords, tokens from credential stores, or access SAM/LSASS.
12. **No creating scheduled tasks or services** — Do not use `schtasks`, `sc create`, or Windows Task Scheduler programmatically.

### Safe Alternatives for File Writing
When writing multi-line source files (JSX, JS, CSS, etc.), use the dedicated **Write** and **Edit** tools directly — never route file content through shell heredocs, encoded strings, or temp scripts. The Write/Edit tools write files directly without spawning suspicious processes.

## Founders' Five Campaign Emails

`send-emails.js` (root) handles bulk email for the Founders' Five programme. Usage:
```bash
node send-emails.js acknowledge   # acknowledgement to all who haven't received one yet
node send-emails.js selected      # "you're in" — add winner emails to SELECTED array first
node send-emails.js not-selected  # "not this time" — everyone not in SELECTED array
```

- Applicants are stored in Supabase table `founders_five_applications`. Credentials are in `.env.local`.
- Sent status is tracked via `acknowledge_sent_at` and `results_sent_at` columns — the script skips anyone already emailed, safe to re-run.
- To check who is new / not yet emailed, query Supabase directly: `acknowledge_sent_at=is.null`.
- **SMTP is blocked on the corporate network** — `node send-emails.js` will fail. Use PowerShell `Send-MailMessage` on port 587 as a fallback, or run from a personal hotspot. If a Resend API key is available, update the script to use Resend over HTTPS instead (always works on this network).
