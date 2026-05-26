# 🐾 Paws & Home

A pet adoption website built with **TypeScript**, **Node.js**, **Express 5**, **EJS**, **Sequelize**, **SQLite**, **Bootstrap 5.3**, and custom CSS as a college assignment.

## About

Paws & Home is a fictional no-kill animal shelter website where visitors can browse available pets, learn about the adoption process, and submit an adoption application — all through a clean, accessible, and responsive interface. Admins can manage the pet catalog and other admin accounts through a protected panel.

## Features

- **Server-rendered pages** with Express + EJS
- **Reusable EJS partials** (`header`, `nav`, `footer`, `theme`, `card`, `flash`, `admin-nav`)
- **Database-backed authentication** — bcrypt-hashed admin credentials stored in SQLite, session-based login
- **Admin panel** — full CRUD for pets and admins, protected by `requireAdmin` middleware
- **Dynamic pet catalog** — Sequelize-backed, with computed age and age labels
- **Image uploads** — multer-handled with file-type/size validation, automatic cleanup on edit/delete
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
- **Global error handling** — async errors caught by Express 5 + custom `errorMiddleware`

## Tech Stack

- **TypeScript 5** (strict, NodeNext) — full-stack type safety
- **Node.js 22** with ESM (`"type": "module"`)
- **Express 5** — HTTP framework with native async error handling
- **Sequelize 6** + **sqlite3** — class-based models with `InferAttributes`
- **sequelize-cli** — JSDoc-typed migrations and seeders
- **EJS 5** — server-rendered templates
- **express-session** — cookie-based session management with augmented `SessionData`
- **bcryptjs** — password hashing (own types bundled)
- **multer** — file upload handling with disk storage
- **Bootstrap 5.3** — UI components
- **tsx** — TypeScript dev runner
- **Custom CSS** overrides on top of Bootstrap

## Project Structure

```text
paws-and-home/
├── src/
│   ├── index.ts                # Express entry point
│   ├── config/database.ts      # Sequelize instance
│   ├── controllers/            # Route handlers (home, auth, admin, pet)
│   ├── middleware/             # auth + errorHandler
│   ├── models/                 # Class-based Sequelize models (Admin, Pet)
│   ├── routes/                 # public + admin routers
│   ├── types/                  # Express/Session declaration merging
│   ├── scripts/                # copy-seed-images
│   └── client/                 # Browser-side TypeScript (theme, validation)
├── migrations/                 # sequelize-cli JSDoc-typed .cjs migrations
├── seeders/                    # sequelize-cli JSDoc-typed .cjs seeders
├── seeds/img/                  # Source images for seeder
├── config/
│   └── config.cjs              # sequelize-cli DB config (CJS for tool compat)
├── views/                      # EJS templates (unchanged from JS version)
│   ├── home.ejs, adopt.ejs, privacy.ejs, terms.ejs, error.ejs
│   ├── admin/                  # Admin panel views
│   └── partials/               # Reusable partials
├── public/
│   ├── css/                    # Source CSS
│   ├── img/                    # Static images + uploaded pet images
│   └── js/                     # Compiled browser JS (gitignored)
├── dist/                       # Compiled backend JS (gitignored)
├── .sequelizerc                # sequelize-cli paths config
├── tsconfig.json               # Backend tsconfig (NodeNext, strict)
├── tsconfig.client.json        # Frontend tsconfig (DOM, ES2020)
├── package.json
└── README.md
```

## Why some files are `.cjs`

The project is fully ESM (`"type": "module"` in `package.json`), but the following files **must** use the `.cjs` extension (or, for `.sequelizerc`, CommonJS syntax):

| File | Why |
|---|---|
| `.sequelizerc` | sequelize-cli loads it through its own `require()`-based loader |
| `config/config.cjs` | sequelize-cli reads it via `require()`; also read at runtime by `src/config/database.ts` through `createRequire()` (single source of truth) |
| `migrations/*.cjs` | sequelize-cli loads each migration via `require()` |
| `seeders/*.cjs` | sequelize-cli loads each seeder via `require()` |

**Do not rename these to `.js`.** Because `package.json` declares `"type": "module"`, Node treats `.js` files as ES modules, and `require()` cannot load ESM. The exact failure mode is:

```
ERROR: module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file
extension and '/path/to/project/package.json' contains "type": "module".
To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
```

**Why not just convert sequelize-cli to ESM?** `sequelize-cli` v6 was written long before ESM was practical in Node, and its CLI internals call `require()` directly to load migrations, seeders, and configs. There is an open PR — [sequelize/cli#1436](https://github.com/sequelize/cli/issues/1436) — to add `--esm` support, but it has been unmerged since 2023. Until that ships (or until this project migrates to Sequelize v7's separate `@sequelize/cli`, or replaces sequelize-cli with [Umzug](https://github.com/sequelize/umzug)), these files stay CJS.

Each `.cjs` file has a header comment restating this constraint so the rule is local to the file that enforces it.

## Routes

| Route | View | Auth |
|------|------|------|
| `/` | `views/home.ejs` | public |
| `/home` | redirects to `/` | public |
| `/adopt` | `views/adopt.ejs` | public |
| `/privacy` | `views/privacy.ejs` | public |
| `/terms` | `views/terms.ejs` | public |
| `/admin/login` | `views/admin/login.ejs` | public |
| `/admin/logout` | redirects to login | authenticated |
| `/admin/` | `views/admin/dashboard.ejs` | authenticated |
| `/admin/pets[/...]` | `views/admin/pets/*.ejs` | authenticated |
| `/admin/admins[/...]` | `views/admin/admins/*.ejs` | authenticated |

Default seeded admin credentials: `admin` / `admin123` (change in production).

## Run Locally

### First-time setup

```bash
npm install
npm run setup     # builds, migrates, copies seed images, seeds DB
```

### Development

```bash
npm run dev       # compiles client + runs `tsx watch src/index.ts`
```

### Production

```bash
npm run build
npm start         # node dist/index.js
```

Then open `http://localhost:3000`.

### Useful scripts

| Script | Purpose |
|---|---|
| `npm run typecheck` | Full-strict typecheck (server + client) |
| `npm run build` | Compile server (`tsc`) and client (`tsc -p tsconfig.client.json`) |
| `npm run build:server` / `npm run build:client` | Compile only one half |
| `npm run migrate` / `npm run migrate:undo` / `npm run migrate:undo:all` | sequelize-cli migrations |
| `npm run seed` / `npm run seed:undo` | sequelize-cli seeders |
| `npm run seed:images` | Copy `seeds/img/*` to `public/img/pets/` |
| `npm run setup` | Full chain: build + migrate + seed:images + seed |

## Author

**Micael Jarniac** — [GitHub](https://github.com/MicaelJarniac)
