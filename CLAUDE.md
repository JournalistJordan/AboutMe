# CLAUDE.md — AI Assistant Guide for Jordan's Portfolio Website

## Project Overview

This is a **static personal portfolio website** for Jordan Foltz, a data analyst. It is a single-page application (SPA) built with vanilla HTML5, CSS3, and JavaScript — no build tools, no frameworks, no package manager.

**Live sections**: Home (hero), About, Projects, Resume, Blog, Contact

**Additional pages**: `brand.html` — Personal Brand (Mission, Vision, Values)

---

## Repository Structure

```
AboutMe/
├── index.html                                    # Main portfolio — entire single-page structure
├── brand.html                                    # Personal brand page (Mission, Vision, Values)
├── style.css                                     # All styles, theming, and responsive CSS (shared)
├── brand.css                                     # Brand-page-specific layout styles
├── script.js                                     # All JavaScript interactivity (ES6 classes)
├── README.md                                     # User-facing project documentation
├── CLAUDE.md                                     # This file
├── Headshot Professional Resized.jpg             # Profile photo
├── Jordan Foltz Data Analyst Resume.docx         # Resume (downloadable asset)
├── Facebook_Engagemnt_Algorithm_AB_Test_Case_Study.pdf   # Case study asset (note "Engagemnt" typo in filename)
├── Mobile_Site_Survey_AB_Testing_Case_Study.pdf  # Case study asset
└── Referral_Campaign_Jordan_Foltz.pdf            # Case study asset
```

**There is no `package.json`, no build step, no node_modules.** The site runs by opening `index.html` directly in a browser or serving the directory with any static file server.

---

## Architecture

### HTML (`index.html`)
- Single file, semantic HTML5
- Sections use `id` attributes for anchor navigation: `#home`, `#about`, `#projects`, `#resume`, `#blog`, `#contact`
- External dependencies loaded via CDN (no local copies):
  - **Font Awesome 6.0.0** — icons (`cdnjs.cloudflare.com`)
  - **Google Fonts** — Montserrat + Open Sans

### CSS (`style.css`)
- **CSS custom properties** (variables) are the design system — defined in `:root`
- **Dark mode** uses `[data-theme="dark"]` attribute on `<html>`, overriding the same variables
- **No CSS preprocessor** (no Sass/Less); plain CSS only
- Layout uses CSS Grid and Flexbox
- Responsive breakpoints handled via `@media` queries
- Key variable categories:
  - Colors: `--primary-green`, `--secondary-green`, `--accent-gold`, `--light-gold`
  - Theme-aware: `--bg-primary`, `--bg-secondary`, `--text-primary`, `--nav-bg`, `--card-bg`, `--border-color`
  - Typography: `--font-primary` (Montserrat), `--font-secondary` (Open Sans)
  - Spacing: `--section-padding`, `--container-padding`, `--border-radius`
  - Transitions: `--transition-fast` (0.3s), `--transition-slow` (0.5s)

### JavaScript (`script.js`)
- **All vanilla JS, no libraries**
- Organized as ES6 classes, one per feature
- All classes instantiated at `DOMContentLoaded`
- Uses `IntersectionObserver` API for scroll-triggered animations (no scroll event polling for animations)
- Uses `localStorage` for theme persistence

**Class inventory:**

| Class | Responsibility |
|---|---|
| `ThemeManager` | Dark/light toggle, persists to `localStorage` |
| `MobileNavigation` | Hamburger menu open/close |
| `NavigationManager` | Smooth scroll to sections, active nav link highlighting |
| `NavbarManager` | Navbar background change on scroll |
| `EnhancedScrollAnimations` | Fade-in animations via `IntersectionObserver` |
| `ContactForm` | Form validation and submission (simulated) |
| `TypingAnimation` | Cycling typewriter text in hero subtitle |
| `ParallaxEffect` | Hero section parallax on scroll |
| `ProjectFilter` | Filter buttons show/hide project cards by category |
| `ProjectInteractions` | Basic hover scale on project images |
| `EnhancedProjectInteractions` | Full hover effects + ripple click effect on cards |
| `SkillsAnimation` | Animates skill bar widths when scrolled into view |
| `StatsCounter` | Animates hero stat numbers counting up |
| `ResumeTracker` | Loading state + toast notification on resume download clicks |

Note: `ProjectInteractions` and `EnhancedProjectInteractions` both exist — the enhanced version supersedes the basic one. Both are instantiated but `EnhancedProjectInteractions` takes precedence due to event listener ordering.

---

## Design System

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--primary-green` | `#2d5016` | Section titles, primary buttons, accents |
| `--secondary-green` | `#4a7c59` | Secondary elements |
| `--accent-gold` | `#d4af37` | Highlights, spinner border, badges |
| `--light-gold` | `#f4e4a6` | Subtle gold backgrounds |
| `--pure-black` | `#000000` | Dark mode background |
| `--pure-white` | `#ffffff` | Light mode background |

### Typography
- **Headings**: Montserrat (300, 400, 600, 700)
- **Body**: Open Sans (300, 400, 600)
- Section titles: `2.5rem`, color `var(--primary-green)`, centered with gold underline pseudo-element

### Spacing
- Max content width: `1200px` (`.container`)
- Section padding: `80px 0`

---

## Key Conventions

### Adding a New Section
1. Add a `<section id="new-section">` block in `index.html`
2. Add a nav link `<a href="#new-section" class="nav-link">` in the navbar
3. Style in `style.css` using existing CSS variables — never hardcode colors
4. If the section needs scroll animation, add its elements to the `querySelectorAll` selector inside `EnhancedScrollAnimations.init()`

### Modifying the Color Scheme
Only change values in the `:root` block and `[data-theme="dark"]` block at the top of `style.css`. Never use raw color values elsewhere in CSS — always use CSS variables.

### Adding a Project Card
Copy an existing `.project-card` div in the `#projects` section of `index.html`. Set `data-category` to one or more of: `dashboard`, `ml`, `analytics`, `automation` (space-separated). The `ProjectFilter` class reads these automatically.

### Dark Mode
The JS `ThemeManager` class toggles `data-theme="dark"` on `document.documentElement`. CSS handles the rest via variable overrides in `[data-theme="dark"]`. Do not add inline style dark-mode overrides in JS — keep it in CSS variables.

### Contact Form
The form uses Formspree (`action="https://formspree.io/f/mgopvvvd"`). `ContactForm.handleSubmit()` submits via `fetch()` with `Accept: application/json`. The class has a null guard (`if (!this.form) return`) so pages without `#contact-form` don't error.

### Cross-Page Navigation — CRITICAL
`NavigationManager` in `script.js` intercepts **all** `.nav-link` clicks with `e.preventDefault()` and tries to scroll within the current page. This breaks cross-page links like `href="index.html#projects"`.

**Nav link class conventions:**
- `.nav-link` — use on `index.html` only, for in-page anchor scrolling (intercepted by JS)
- `.nav-link-ext` — use on other pages (e.g., `brand.html`) for links back to `index.html#section` (looks identical to `.nav-link`, NOT intercepted by JS)
- `.nav-link-brand` — use for the "My Brand" pill button in all navbars

### Adding a New Page
1. Create the `.html` file loading both `style.css` (shared variables/navbar/theme) and a page-specific `.css` file
2. Use `.nav-link-ext` for all navbar section links (never `.nav-link`)
3. Load `script.js` — `ThemeManager`, `NavbarManager`, and `MobileNavigation` work on all pages; other classes are no-ops if their elements don't exist
4. Add a `#footer-year` span in the footer (auto-populated by `script.js`)

---

## Development Workflow

### Running Locally
No build step needed. Options:
```bash
# Option 1: Python simple server
python3 -m http.server 8080

# Option 2: Node http-server (if installed)
npx http-server .

# Option 3: VS Code Live Server extension — open index.html, click "Go Live"
```

### Making Changes
1. Edit the relevant file (`index.html`, `style.css`, or `script.js`)
2. Refresh the browser — no compile step
3. Test both light and dark themes after CSS/HTML changes
4. Test at mobile widths (375px) after layout changes

### Testing Checklist (manual)
- [ ] Theme toggle works and persists on reload
- [ ] Mobile hamburger menu opens/closes
- [ ] Smooth scroll navigation works
- [ ] Project filter buttons show/hide correct cards
- [ ] Skill bars animate when scrolled into view
- [ ] Contact form validates and shows success/error messages
- [ ] Page loads without console errors

---

## Deployment

This is a static site. Deploy by uploading all files (except `.git/`) to:
- **GitHub Pages**: push to `main`/`master`, enable Pages in repo settings
- **Netlify / Vercel**: connect repo, no build command needed, publish directory is `.` (root)
- **Any web host**: upload files via FTP/SFTP

---

## Assets

| File | Purpose |
|---|---|
| `Jordan Foltz Data Analyst Resume.docx` | Linked from the Resume section download buttons |
| `Facebook_Engagemnt_Algorithm_AB_Test_Case_Study.pdf` | Case study referenced in projects |
| `Mobile_Site_Survey_AB_Testing_Case_Study.pdf` | Case study referenced in projects |

**Profile photo**: Currently a placeholder (`via.placeholder.com`). Replace by adding an image file and updating the `<img src="...">` in the hero section of `index.html`.

---

## Known Issues / TODOs

- The resume download buttons in `index.html` link to `href="#"` — update to actual file paths once PDFs are in the repo
- `ProjectInteractions` class is redundant with `EnhancedProjectInteractions` — the basic class could be removed
- The contact form submission is simulated — needs real backend integration
- Blog "Read More" links and project GitHub/demo links are all `href="#"` placeholders
- Profile photo is a placeholder image from an external service
- CSS animations (`@keyframes spin`, `@keyframes ripple`, etc.) are injected dynamically via JS `createElement('style')` — consider moving these to `style.css`
