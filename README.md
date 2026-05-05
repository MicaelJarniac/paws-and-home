# 🐾 Paws & Home

A pet adoption website built with **Node.js**, **Express**, **EJS**, **Bootstrap 5.3**, and custom CSS as a college assignment.

## About

Paws & Home is a fictional no-kill animal shelter website where visitors can browse available pets, learn about the adoption process, and submit an adoption application — all through a clean, accessible, and responsive interface.

## Features

- **Server-rendered pages** with Express + EJS
- **Reusable EJS partials** (`header`, `nav`, `footer`, `theme`, `card`)
- **Login system** — hardcoded authentication with session management (`sessionStorage`)
- **Dynamic pet catalog** — pet data defined in `index.js`, rendered with card partial loop
- **Conditional adoption status UI** — available vs pending cards
- **"Adopt Me" buttons** — pre-fill the adoption form with selected pet data via query params
- **Adoption form** — multi-section form with real-time validation
- **CPF validation** — professor-required custom algorithm + input mask
- **Phone mask** — auto-formats to `(XX) XXXX-XXXX` or `(XX) XXXXX-XXXX`
- **Dark mode** — Bootstrap 5.3 `data-bs-theme` with persistence via `localStorage`
- **Responsive navbar** with Bootstrap collapse
- **Scrollspy on home page** for section-based nav highlighting (Adopt / About)
- **Accessible** — skip link, semantic HTML, ARIA labels, `aria-live`, `aria-current`, focus-visible styles
- **SEO basics** — per-page title + meta description

## Routes

| Route | View |
|------|------|
| `/` | `views/index.ejs` |
| `/home` | `views/home.ejs` |
| `/adopt` | `views/adopt.ejs` |
| `/privacy` | `views/privacy.ejs` |
| `/terms` | `views/terms.ejs` |

## Tech Stack

- **Node.js** + **Express 5**
- **EJS** templates
- **Bootstrap 5.3**
- **Vanilla JavaScript** (auth, theme toggle, validation)
- **Custom CSS** overrides on top of Bootstrap

## Project Structure

```text
paws-and-home/
├── index.js
├── package.json
├── package-lock.json
├── .gitignore
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── theme.js
│   │   └── validation.js
│   └── img/
│       ├── buddy.jpg
│       ├── luna.jpg
│       ├── max.jpg
│       ├── milo.jpg
│       ├── daisy.jpg
│       └── cinnamon.jpg
├── views/
│   ├── index.ejs
│   ├── home.ejs
│   ├── adopt.ejs
│   ├── privacy.ejs
│   ├── terms.ejs
│   └── partials/
│       ├── header.ejs
│       ├── nav.ejs
│       ├── footer.ejs
│       ├── theme.ejs
│       └── card.ejs
└── README.md
```

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Author

**Micael Jarniac** — [GitHub](https://github.com/MicaelJarniac)
