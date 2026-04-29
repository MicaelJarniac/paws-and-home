# 🐾 Paws & Home

A pet adoption website built with **HTML**, **CSS**, **JavaScript**, and **Bootstrap 5.3** as a college assignment.

## About

Paws & Home is a fictional no-kill animal shelter website where visitors can browse available pets, learn about the adoption process, and submit an adoption application — all through a clean, accessible, and responsive interface.

## Features

- **Login system** — hardcoded authentication with session management (`sessionStorage`)
- **Pet catalog** — browsable cards with photos, descriptions, and adoption status
- **"Adopt Me" buttons** — pre-fill the adoption form with the selected pet's info
- **Adoption form** — multi-section application with real-time field validation
- **CPF validation** — custom check-digit algorithm with input mask
- **Phone mask** — auto-formats to (XX) XXXX-XXXX or (XX) XXXXX-XXXX
- **Dark mode** — Bootstrap 5.3 native `data-bs-theme` with OS preference detection and `localStorage` persistence
- **Responsive navbar** — Bootstrap collapse with custom animated hamburger icon
- **Adoption fees table** — tabular data with proper `<thead>`/`<tbody>` and `scope` attributes
- **How It Works** — ordered process list with numbered step indicators
- **Accessible** — skip link, ARIA labels, `aria-live` regions, `aria-current`, focus-visible styles, semantic HTML throughout
- **SEO** — meta descriptions, proper heading hierarchy, descriptive alt text

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Login page |
| `home.html` | Main page with hero, pet cards, process steps, fees table, and about section |
| `adopt.html` | Adoption application form with validation |
| `privacy.html` | Privacy Policy |
| `terms.html` | Terms of Service |

## Tech Stack

- HTML5 (semantic elements, ARIA)
- [Bootstrap 5.3](https://getbootstrap.com/) (grid, navbar, cards, forms, table, badges, dark mode)
- CSS3 (custom overrides on top of Bootstrap — color palette, hero gradient, animations)
- Vanilla JavaScript (authentication, form validation, dark mode toggle)

## Project Structure

```
paws-and-home/
├── index.html          Login page
├── home.html           Main page (protected)
├── adopt.html          Adoption form (protected)
├── privacy.html        Privacy Policy
├── terms.html          Terms of Service
├── styles.css          Custom CSS overrides
├── js/
│   ├── auth.js         Login/logout with sessionStorage
│   ├── theme.js        Dark mode toggle (data-bs-theme)
│   └── validation.js   Form validation, CPF/phone masks
├── images/
│   ├── buddy.jpg
│   ├── luna.jpg
│   ├── max.jpg
│   ├── milo.jpg
│   ├── daisy.jpg
│   └── cinnamon.jpg
└── README.md
```

## Author

**Micael Jarniac** — [GitHub](https://github.com/MicaelJarniac)
