# Content guide — কনটেন্ট এডিট করার গাইড

এই ফোল্ডারের JSON ফাইলগুলোই সাইটের সব লেখা, দাম আর project। কোড ছুঁতে হবে না।

## সবচেয়ে সহজ উপায়: Admin panel (Pages CMS)

1. যাও **https://app.pagescms.org** → **Sign in with GitHub**
2. তোমার repo (`mojumder01.github.io`) বেছে নাও
3. বাম পাশের মেনু থেকে **Site settings / Services / Projects / Pricing …** খোলো
4. ফর্মে বদলাও → **Save** → ১–২ মিনিটে live সাইট আপডেট হবে

Admin panel-এ JSON-এর comma বা quote নিয়ে চিন্তা করতে হয় না — ফর্মই সব ঠিক রাখে।

## কোন ফাইলে কী আছে

| File | Admin-এ নাম | কী বদলায় |
|---|---|---|
| `site.json` | Site settings | নাম, পরিচয়, email, WhatsApp, social link, About লেখা, skills |
| `services.json` | Services | ৬টা service card |
| `projects.json` | Projects | Portfolio + case study |
| `pricing.json` | Pricing | দাম (Starter/Professional/Custom) আর **Negotiation** অপশন |
| `testimonials.json` | Testimonials | শুধু সত্যিকারের client review |
| `form-options.json` | Form options | Budget আর timeline-এর পছন্দগুলো |

## হাতে JSON এডিট করলে ৬টা নিয়ম

1. লেখা সবসময় **"double quotes"**-এর ভেতরে: `"title": "My project"`
2. প্রতিটা আইটেমের পরে **comma**, কিন্তু **শেষ আইটেমের পরে comma নয়**
3. সংখ্যা আর true/false quote ছাড়া: `"startingPriceUsd": 49`, `"isSample": false`
4. দাম খালি রাখতে: `"startingPriceUsd": null` → সাইটে দেখাবে "Request a quote"
5. JSON-এ **comment (`//`) দেওয়া যায় না**
6. লিস্ট `[ ]`, গ্রুপ `{ }` — খোলা আর বন্ধ সংখ্যায় সমান হতে হবে

```json
"deliverables": ["Item one", "Item two", "Item three"]
```

## ভুল হলো কিনা কীভাবে বুঝবে

```bash
npm run check-content
```

ভুল থাকলে ঠিক কোন ফাইলের কোন জায়গায় আর কী করতে হবে তা লিখে দেবে, যেমন:

```
• pricing.json → tiers → #2 (Professional) → startingPriceUsd:
  should be a number like 49 (no $ sign, no quotes), or empty for "Request a quote"
```

এই check **প্রতিটা build-এ নিজে থেকেই চলে** — ভুল থাকলে GitHub-এর deploy থেমে যাবে আর পুরনো (ঠিক) সাইটটাই live থাকবে। GitHub-এর **Actions** ট্যাবে লাল ❌ খুলে একই মেসেজ দেখতে পাবে।

## Allowed values (এর বাইরে লিখলে check ভুল ধরবে)

- **Service icon:** `website`, `landing-page`, `chart`, `automation`, `cleaning`, `ai`, `code`, `shopping`, `database`, `bot`, `mail`, `globe`
- **Accent:** `blue`, `violet`, `cyan`
- **Project mockup (ছবি না থাকলে যে illustration দেখায়):** `landing`, `website`, `dashboard`, `automation`, `cleaning`, `ai`
- **Id:** ছোট হাতের অক্ষর, সংখ্যা আর `-` — যেমন `sales-kpi-dashboard`। একই id দুবার হবে না।
- **Project-এর `serviceId`** অবশ্যই `services.json`-এর কোনো একটা `id` হতে হবে।

## ছবি

- Admin panel-এ project বা profile-এর image ঘরে আপলোড করলে ফাইল `public/media/`-এ জমা হয়।
- হাতে দিলে: ছবি `public/media/`-এ রাখো আর লেখো `"src": "media/my-shot.png"`।
- প্রতিটা ছবির `alt`-এ ছোট বর্ণনা দাও (screen reader আর SEO-র জন্য)।
