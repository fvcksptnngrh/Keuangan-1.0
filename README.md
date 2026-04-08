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

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev

# Build untuk production
npm run build
```

Aplikasi berjalan di `http://localhost:3000`

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

```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_USE_MOCK=true
```

Set `VITE_USE_MOCK=false` untuk menggunakan backend API asli.
