# Restaurant Test Site: Astro + Sanity + Cloudflare Pages

A working starter for restaurant websites. Costs $0/month and needs no credit card.

```
restaurant-test/
├── studio/   ← Sanity Studio (the CMS the client logs into)
└── web/      ← Astro website (what visitors see)
```

How it works:

```
Client edits menu in Sanity Studio ──publish──▶ Sanity Content Lake (cloud)
                                                     │  webhook
                                                     ▼
                         Cloudflare Pages rebuilds web/ (~30s) ──▶ static HTML on CDN
```

---

## Step 0: Run the site right now (demo mode)

```bash
cd web
npm install
npm run dev          # → http://localhost:4321
```

With no Sanity project ID in `web/.env`, the site uses built-in sample data (`src/lib/demo-data.ts`) and shows a "Demo mode" bar. Use this to work on design before Sanity is set up.

---

## Step 1: Create your Sanity project (one time, ~3 min)

```bash
cd studio
npm install
npx sanity login                 # opens browser; sign in with Google/GitHub/email
npx sanity projects create "Restaurant Test" --dataset production --dataset-visibility public
```

Copy the **project ID** it prints. You can also find it later at <https://www.sanity.io/manage>.

```bash
cp .env.example .env             # then paste the ID into SANITY_STUDIO_PROJECT_ID
```

> **Public vs private dataset:** with *public*, anyone can **read** published content without a token. That's fine for a restaurant menu and keeps things simple. Writing always requires login.

### Load the sample content

```bash
npm run seed                     # imports seed/seed.ndjson into the "production" dataset
```

### Open the Studio

```bash
npm run dev                      # → http://localhost:3333
```

### Connect the website

In `web/.env`:

```
PUBLIC_SANITY_PROJECT_ID=<same id>
PUBLIC_SANITY_DATASET=production
```

Restart `npm run dev` in `web/`. The demo bar disappears and the content now comes from Sanity.

### Allow the Studio's URL (CORS)

`localhost:3333` is allowed automatically. When you deploy the Studio somewhere other than `*.sanity.studio`, add that URL at **sanity.io/manage → project → API → CORS origins**.

---

## Step 2: Learn Sanity in 15 minutes

### The core ideas

| Concept | What it is | Where in this repo |
|---|---|---|
| **Schema** | The shape of your content: fields, types, validation. Written in code, so the Studio UI is generated from it. | `studio/schemaTypes/` |
| **Document** | One record (a menu item, a category). Has `_id` and `_type`. | Created in the Studio |
| **Object** | A reusable group of fields that lives *inside* a document (e.g. one row of opening hours). | `schemaTypes/objects/` |
| **Reference** | A link from one document to another (menu item → category). | `menuItem.ts` → `category` |
| **Singleton** | A document type with exactly one instance (site settings). | `structure.ts` |
| **Structure** | Controls the Studio's left sidebar. | `studio/structure.ts` |
| **Dataset** | A database inside your project (`production`, maybe `staging`). | `.env` |
| **Draft vs published** | Edits are drafts until you press **Publish**. The site only reads *published* content. | `web/src/lib/sanity.ts` → `perspective: 'published'` |
| **GROQ** | Sanity's query language. | `web/src/lib/queries.ts` |

### Exercise 1: add a field (e.g. "Chef's pick")

1. In `studio/schemaTypes/menuItem.ts`, add to `fields`:
   ```ts
   defineField({name: 'chefsPick', title: "Chef's pick", type: 'boolean', initialValue: false}),
   ```
2. The Studio hot-reloads, and the toggle appears on every menu item. No database migration is needed, because Sanity is schemaless underneath.
3. Add it to the GROQ projection in `web/src/lib/queries.ts` (`..., dietary, image, chefsPick`).
4. Add `chefsPick?: boolean` to `MenuItem` in `web/src/lib/types.ts`.
5. Render it in `web/src/components/MenuItemCard.astro`:
   ```astro
   {item.chefsPick && <span class="badge">Chef's pick</span>}
   ```

That's the whole workflow every time: **schema → query → type → component.**

### Exercise 2: play with GROQ

Open the Studio → **Vision** tab (top bar) and try:

```groq
*[_type == "menuItem"]                                  // all menu items
*[_type == "menuItem" && price < 12]{name, price}       // filter + pick fields
*[_type == "menuItem"]{name, "category": category->title} // follow a reference with ->
*[_type == "menuItem"] | order(price desc)[0...3]       // top 3 most expensive
count(*[_type == "menuItem" && "vegetarian" in dietary]) // count veg dishes
```

Syntax: `*[filter] | order(...) [slice] { projection }`.

### Exercise 3: upload images

The seed has no images. That's intentional, so you practise:

1. **Restaurant Settings → Images tab** → upload a hero image and a few gallery photos.
2. Click the crop icon on an image to set the **hotspot** (the focal point). The site crops around it at every size.
3. Add a photo to a couple of featured menu items.
4. Publish, then refresh the site.

Images are served from `cdn.sanity.io`, resized and converted to WebP/AVIF automatically (`web/src/components/SanityImg.astro`). Upload big originals; the CDN handles the rest.

### Exercise 4: add a new document type (e.g. Events)

1. Create `studio/schemaTypes/event.ts` (copy `menuCategory.ts` as a starting point).
2. Register it in `studio/schemaTypes/index.ts`.
3. Add `S.documentTypeListItem('event').title('Events')` in `structure.ts`.
4. Write a query, then create `web/src/pages/events.astro`.

---

## Step 3: Deploy (free)

### The Studio → `<name>.sanity.studio`

```bash
cd studio
npm run deploy            # pick a hostname, e.g. himalayan-table
```

Then invite the client: **sanity.io/manage → project → Members → Invite** (Editor role). They log in at `https://himalayan-table.sanity.studio`.

### The website → Cloudflare Pages

1. Push this repo to GitHub.
2. Go to **dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git**.
3. Build settings:
   - **Root directory:** `web`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Environment variables:** `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `SITE_URL`, `PUBLIC_WEB3FORMS_KEY`
4. Deploy. You'll get `<project>.pages.dev`. Add the client's domain under **Custom domains**.

### Auto-rebuild when the client publishes

1. Cloudflare Pages → your project → **Settings → Builds → Deploy hooks** → create one and copy the URL.
2. **sanity.io/manage → project → API → Webhooks → Create**:
   - URL: the deploy hook URL
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - HTTP method: POST
   - Filter (optional): `_type in ["menuItem", "menuCategory", "siteSettings"]`
3. Publish something in the Studio. The site updates in about 30 seconds.

---

## Contact form

Uses [Web3Forms](https://web3forms.com) (free, no backend, no card). Enter the client's email there, and they'll receive an access key. Put it in `PUBLIC_WEB3FORMS_KEY`. Submissions arrive in that inbox. The key is designed to be public.

---

## SEO checklist (already built in)

- [x] Static HTML pages (fully crawlable, fast)
- [x] Per-page `<title>`, meta description, canonical URL
- [x] Open Graph tags (link previews on WhatsApp, Facebook)
- [x] `Restaurant` JSON-LD with address, hours, phone, cuisine (`web/src/layouts/Base.astro`)
- [x] `Menu` JSON-LD with every dish and price (`web/src/pages/menu.astro`)
- [x] `sitemap-index.xml` + `robots.txt`
- [x] Responsive images with alt text (alt is required in the schema)
- [x] Demo mode adds `noindex`, so a half-done site never gets indexed
- [ ] **You:** set `SITE_URL` to the real domain before launch
- [ ] **You:** set up the client's Google Business Profile, then submit the sitemap in Google Search Console
- [ ] **You:** validate at <https://search.google.com/test/rich-results>

---

## Where to change things

| I want to… | Edit |
|---|---|
| Change colours / fonts | `web/src/styles/global.css` (`:root` tokens at the top) |
| Change page layout | `web/src/pages/*.astro` |
| Change SEO / head tags | `web/src/layouts/Base.astro` |
| Change what data a page gets | `web/src/lib/queries.ts` + `web/src/lib/types.ts` |
| Add a CMS field | `studio/schemaTypes/*.ts` |
| Change the Studio sidebar | `studio/structure.ts` |

## Free-tier notes

- **Sanity Free:** plenty for one restaurant. Check current limits at sanity.io/pricing.
- **Cloudflare Pages Free:** unlimited bandwidth, commercial use OK. There's a monthly build limit, but webhook rebuilds won't come close.
- Create the Sanity and Cloudflare accounts **in the client's name** for real projects, and invite yourself as admin.
