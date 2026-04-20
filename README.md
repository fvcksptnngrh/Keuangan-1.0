# Dashboard Keuangan

Aplikasi web dashboard untuk manajemen arsip dokumen dan inventaris persediaan kantor.

## Tech Stack

- **React 18** + **Vite 5**
- **Redux Toolkit** + **Redux Persist** (state management)
- **React Router v6** (routing)
- **Tailwind CSS 3** (styling)
- **Lucide React** (icons)
- **Axios** (HTTP client)

## Fitur

- Login dengan role-based access (Admin, Management, Staff)
- Dashboard dengan statistik dan donut chart
- Arsip Dokumen (Kepegawaian, Keuangan, Umum) — upload, download, hapus, filter, search, pagination
- Katalog Inventaris Barang — grid card, preview, peminjaman
- Manajemen Akun (admin only) — CRUD user
- Manajemen Inventaris (admin only) — CRUD barang
- Connected tab sidebar dengan animasi smooth
- Page transition animation
- Error pages (403, 404, 500)

## Setup

### Local Development

```bash
# Install dependencies
npm install

# Copy environment template to local file
cp .env.example .env.local

# Edit .env.local with your API URL
# VITE_API_URL=http://localhost:8082
# VITE_USE_MOCK=true

# Jalankan dev server
npm run dev
```

Aplikasi berjalan di `http://localhost:5173` (default Vite port)

## Demo Credentials

| Username     | Password  | Role       |
|-------------|-----------|------------|
| admin       | admin123  | Admin      |
| management  | mgmt123   | Management |
| staff       | staff123  | Staff      |

## Struktur Folder

```
src/
├── api/                  # API calls & mock API
├── app/                  # Redux store config
├── components/
│   ├── common/           # Table, Modal, SearchBar, Pagination, DonutChart, Avatar, Badge
│   └── layout/           # Sidebar, MainLayout, ProtectedRoute, ArsipPage, PageTransition
├── features/
│   ├── auth/             # Auth slice & thunks
│   ├── arsip/            # Arsip slice & thunks
│   └── inventaris/       # Inventaris slice & thunks
├── hooks/                # useAuth
├── pages/
│   ├── admin/            # ManajemenAkun, ManajemenInventaris
│   ├── arsip/            # ArsipKepegawaian, ArsipKeuangan, ArsipUmum
│   ├── errors/           # NotFound (404), ServerError (500), Forbidden (403)
│   └── katalog/          # KatalogBarang
├── routes/               # AppRouter
└── utils/                # mockData, roleGuard
```

## Environment Variables

**Configuration for development:**

Create `.env.local` file (not committed to git):
```env
VITE_API_URL=http://localhost:8082
VITE_USE_MOCK=true
```

**Production deployment (Vercel):**
- Set environment variables in Vercel Dashboard → Settings → Environment Variables
- `VITE_API_URL` = Your production backend URL
- `VITE_USE_MOCK` = false

⚠️ **Security note:** Never commit `.env` files with real credentials or API URLs. Use `.env.example` as a template for contributors.

## Contributing

Before submitting a PR:

1. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your local backend URL
   npm install
   npm run dev
   ```

2. **Security Guidelines**
   - ✅ DO commit `.env.example` with placeholder values
   - ❌ DON'T commit `.env` or `.env.local` files
   - ❌ DON'T commit credentials, tokens, or real API URLs
   - Use environment variables for sensitive config

3. **Testing**
   - Test with mock API: `VITE_USE_MOCK=true`
   - Test with real API before pushing

## License

Internal use for institution | Open source portfolio
