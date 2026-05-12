# MEDIOBYTES – Digital Agency Website

## How to Edit Content (No Coding Required!)

Open the file: **`js/cms-data.js`**

This single file controls ALL text, links, and settings across the entire website.

---

## What You Can Edit

| Section                | What to change                               |
| ---------------------- | -------------------------------------------- |
| `site`                 | Agency name, city, year                      |
| `contact`              | Email, phone, address, map                   |
| `social`               | LinkedIn, Facebook, Twitter, Instagram links |
| `nav`                  | Menu items and their links                   |
| `home.hero`            | Hero headline, description, buttons          |
| `home.servicesSection` | Service card titles & descriptions           |
| `home.whyUs`           | Features / USP list                          |
| `home.portfolio`       | Portfolio preview labels                     |
| `home.careers.jobs`    | Job listings (add/remove/edit)               |
| `home.cta`             | Call-to-action banner text                   |
| `about`                | About page content & stats                   |
| `pricing`              | All pricing packages & add-on prices         |

---

## How to Run the Site

Simply open `index.html` in any browser. No server needed.

For best results with contact form, run using a local server:

```
npx serve .
```

---

## File Structure

```
xevon/
├── index.html          ← Homepage
├── css/
│   └── style.css       ← All styles (mobile-first)
├── js/
│   ├── cms-data.js     ← ✏️ EDIT THIS FILE for content changes
│   └── script.js       ← Site logic (don't edit)
├── pages/
│   ├── about.html
│   ├── services.html
│   ├── web-design.html
│   ├── logo-design.html
│   ├── digital-marketing.html
│   ├── portfolio.html
│   ├── career.html
│   ├── contact.html
│   └── apply.html
└── images/
    └── bg1.jpg, bg2.jpg, bg3.jpg  ← Hero background images
```

---

## Adding a New Job Listing

In `js/cms-data.js`, find `home.careers.jobs` and add a new object:

```js
{
  icon: "🚀",
  role: "Content Writer",
  dept: "Marketing Department",
  status: "open",   // change to "closed" to show as closed
  details: [
    "Write blogs, social media posts & ad copy",
    "SEO knowledge preferred",
  ],
  applyHref: "/pages/apply.html?role=Content+Writer",
},
```

---

## Changing Prices

In `js/cms-data.js`, find `pricing.web.base` and update the numbers:

```js
web: {
  base:   { small: 5000, medium: 10000, large: 20000 },
  addons: { "extra-pages": 1000, "database": 2000 },
},
```

---

Made with ❤️ by MedioBytes – Coimbatore
