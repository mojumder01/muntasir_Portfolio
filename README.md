# Muntasir Mojumder — Digital Services Portfolio

A fast, animated, responsive portfolio and freelance business website for **Md Muntasir Mamun Mojumder**: websites, landing pages, Excel dashboards, Excel automation, Excel data cleaning and AI automation.

Built with **React 19 + TypeScript + Vite + Tailwind CSS 4 + Motion + Lucide icons**. Fully static, so it is free to host on **GitHub Pages** (auto-deploy included) or Vercel.

---

## 1. Run it on your computer

You need [Node.js 20+](https://nodejs.org) (LTS).

```bash
npm install        # install packages (first time only)
npm run dev        # open http://localhost:5173 — updates live while you edit
npm run build      # type-check + production build into dist/
npm run preview    # preview the production build
```

---

## 2. Edit your content — Admin panel (no coding needed)

All text, prices and projects live in **`src/content/*.json`**. The easiest way to edit them is the free **Pages CMS** admin panel:

1. Push this project to GitHub (section 4).
2. Go to **https://app.pagescms.org** → **Sign in with GitHub** → pick your repository.
3. Edit **Site settings, Services, Projects, Pricing, Testimonials, Form options** through simple forms (image uploads included).
4. Press **Save** — it commits to GitHub and the site redeploys in 1–2 minutes.

The admin forms are defined in **`.pages.yml`**. Login is handled by GitHub, so no password or key ever sits in the website code — keep 2-factor authentication on for your GitHub account.

| File | Admin section | What it controls |
|---|---|---|
| `site.json` | Site settings | Name, role, bio, **email**, **WhatsApp**, social links, skills, availability badge, profile photo, **colors** |
| `services.json` | Services | The service cards (icon, accent, text, button labels) |
| `projects.json` | Projects | Portfolio projects + case studies + screenshots |
| `pricing.json` | Pricing | Tiers (`startingPriceUsd`: number or empty → "Request a quote") and the **Negotiation** option |
| `testimonials.json` | Testimonials | Real client reviews only. While empty, "What you can expect" is shown instead |
| `form-options.json` | Form options | Budget and timeline choices in the inquiry form |

**Editing JSON by hand?** Read `src/content/README.md` (Bangla + English rules and examples), then run:

```bash
npm run check-content   # explains any mistake: file → field → what to fix
```

The same check runs automatically before every build, so a broken file stops the deploy and the last working site stays live.

Tips
- An empty value **hides** that item — no broken links.
- Uploaded images go to `public/media/`.
- Projects with `isSample: true` show a "Sample project" badge. Set it to `false` only for real client work, and only write **verified** results in `outcome`.

### Colors & themes
- **Site settings → Appearance** in the admin:
  - **Color palette** — `ocean` (blue/violet/cyan, default), `emerald` (green/teal), `sunset` (orange/rose), `royal` (indigo/purple/pink) or `mono` (black & white).
  - **Default theme for new visitors** — `light` or `dark`.
- Visitors can switch light/dark with the moon/sun button in the navbar; their choice is remembered in their browser.
- The palette colors are in `src/index.css` (all chosen to stay readable).

### Negotiation (price offers)
The Pricing section has a **Negotiation** card, and every package has an "or make an offer" link. Visitors fill in **name, phone, email, address, their bid price + currency**, what it's for and optional notes. It is delivered the same way as the inquiry form (below). Turn it off with `negotiation.isEnabled: false` in the admin.

---

## 3. How the forms send messages

The inquiry form and the price-offer form never pretend a message was delivered. It picks the best option you've configured:

1. **Formspree (recommended, free)** — messages arrive straight in your inbox.
   1. Create a form at [formspree.io](https://formspree.io) and copy its ID (e.g. `xyzabcde`).
   2. GitHub repo → **Settings → Secrets and variables → Actions → Variables → New variable**
      Name: `VITE_FORMSPREE_FORM_ID`, Value: your ID. Re-run the deploy.
   3. For local testing, copy `.env.example` to `.env` and fill in the ID.
2. **Email / WhatsApp** — if you set `email` / `whatsappNumber` in Site settings (`site.json`), the form opens the visitor's email app or WhatsApp with the full message ready to send.
3. **Nothing configured** — visitors can copy their inquiry and contact you via your profile links.

---

## 3b. Save every inquiry & offer to Google Sheet (free)

Each message becomes a new row in **your own private Google Sheet** — tab **Inquiries** and tab **Offers** (created automatically, with a *Status* column you can update). Optional: an email and/or Telegram message for every new row.

1. Create a new Google Sheet (e.g. "Website leads").
2. **Extensions → Apps Script**. Delete the sample code, paste everything from `google-apps-script/inquiry-to-sheet.gs`, click **Save**.
3. **Deploy → New deployment** → type **Web app** → *Execute as:* **Me** → *Who has access:* **Anyone** → **Deploy**. Approve the permission screen (Google shows it because the script writes to your sheet; on "unsafe" warnings choose *Advanced → Go to project*).
4. Copy the **Web app URL** (ends with `/exec`).
5. Admin panel → **Site settings → Integrations → Google Sheet web app URL** → paste → Save.
6. Optional notifications: Apps Script → **Project Settings → Script properties** → add
   - `NOTIFY_EMAIL` = your email
   - `TELEGRAM_BOT_TOKEN` = token from @BotFather, and `TELEGRAM_CHAT_ID` = your chat id
   These secrets stay on Google's side — never in the website.

Good to know
- When you **edit the script later**, use *Deploy → Manage deployments → Edit → Version: New version*, so the same URL keeps working.
- The sheet itself stays private; the website can only **add** rows, never read them.
- Built-in protection: spam-trap field, max 20 messages per minute, values that look like formulas (`=`, `+`, `-`, `@`) are stored as plain text, long text is cut.
- Works together with Formspree/email/WhatsApp: if the sheet is set, messages are saved automatically; the visitor sees "sent" only after a destination confirms it.

## 3c. Floating chat button (Messenger · WhatsApp · Telegram · Email)

A round chat button sits at the bottom-right of every page. Set it in **Site settings → Floating chat button**:
- **Facebook / Messenger** — your Facebook username, or paste your profile/page link (opens `m.me/<username>`).
- **WhatsApp** — uses the number from Contact (switch with *Show WhatsApp*).
- **Telegram username** — your exact username from Telegram → Settings → Username, without `@` (opens `t.me/<username>`).
- **Email** — uses the email from Contact (switch with *Show Email*). The address is shown too, for visitors without an email app.

Empty fields are hidden; if none is set, the button doesn't appear. (Facebook retired its embedded chat plugin, so Messenger opens via the official `m.me` link.)

---

## 4. Publish on GitHub Pages (free)

**Recommended repo name:** `mojumder01.github.io` → site lives at **https://mojumder01.github.io**

1. Create a new **public** repository on GitHub named `mojumder01.github.io` (don't add a README).
2. Upload this project:
   ```bash
   git init
   git add .
   git commit -m "Portfolio website"
   git branch -M main
   git remote add origin https://github.com/mojumder01/mojumder01.github.io.git
   git push -u origin main
   ```
   (No Git? On the empty repo page use **"uploading an existing file"** and drag in all files and folders, including `.github`. Do **not** upload `node_modules` or `dist`.)
3. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Open the **Actions** tab — the "Deploy to GitHub Pages" workflow builds and publishes the site (≈1–2 minutes). Every later push to `main` redeploys automatically.

Using a different repo name (e.g. `portfolio`)? It still works (paths are relative) — the site will be at `https://mojumder01.github.io/portfolio/`. Update the URLs in `index.html`, `public/robots.txt` and `public/sitemap.xml` to match.

### Alternative: Vercel
Import the GitHub repo at [vercel.com/new](https://vercel.com/new). Framework: **Vite**, build command `npm run build`, output directory `dist`. Add `VITE_FORMSPREE_FORM_ID` under Environment Variables if you use Formspree.

---

## 5. Project structure

```
.github/workflows/deploy.yml   GitHub Pages auto-deploy
.pages.yml                     Admin panel (Pages CMS) forms
google-apps-script/            Google Sheet saver (paste into Apps Script)
scripts/validate-content.mjs   Content checker (npm run check-content)
public/                        favicon, theme script, social image, robots.txt, sitemap.xml, media/
src/
  content/                     ← all editable content (JSON) + content guide
  config/                      Loads the JSON into typed data for the components
  components/
    layout/                    Navbar, Footer
    sections/                  Hero, Services, Portfolio, Process, About, Trust, Pricing, Contact
    inquiry/                   Inquiry form, shared form fields, delivery status, "next step" panel
    pricing/                   Negotiation price-offer popup
    chat/                      Floating chat button
    ui/                        Button, Reveal animations, case study dialog, error boundary, icons
    visuals/                   Hero illustration, project mockups (pure CSS — no image files)
  context/inquiry-context.tsx  Lets any CTA open the form with a service/plan preselected
  hooks/                       Active nav section, theme switch, shared message delivery
  lib/                         Validation, message building, sending, safe links
  types/content.ts             Shared TypeScript types
  App.tsx, main.tsx, index.css
```

---

## 6. Security notes

- No secret keys in the code. The Formspree form ID is public by design.
- A Content-Security-Policy is added to the production build (blocks scripts from other sites).
- All external links open with `rel="noopener noreferrer"`; config links must be `https://`.
- Form input (including phone, address and bid amount) is length-limited and validated; a hidden honeypot field filters simple spam bots.
- The admin panel signs in through GitHub — no admin password exists in the site code.
- Online payments, when added later, must go through a secure backend or payment provider — never put payment keys in this frontend.

---

## 7. Common problems

| Problem | Fix |
|---|---|
| Blank page after deploy | Settings → Pages → Source must be **GitHub Actions**; check the Actions tab for a red ❌ and open the log |
| Workflow fails at `npm ci` | Make sure `package-lock.json` was uploaded |
| Form shows "Direct messaging is being set up" | Add your email/WhatsApp in Site settings or set `VITE_FORMSPREE_FORM_ID` |
| Deploy failed with "Found N problem(s) in src/content" | Open the failed run in the Actions tab — it lists each file → field → fix. Or run `npm run check-content` |
| Old version still showing | Hard-refresh (Ctrl + F5); deploys take 1–2 minutes |
