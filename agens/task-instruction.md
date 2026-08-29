# Task Instruction: Web Portofolio & Admin Dashboard

**Proyek:** Sistem Portofolio Dinamis dengan Pendekatan Desain Brutalist/Paper
**Tech Stack:**
- **Frontend (Publik):** Next.js, Tailwind CSS
- **Backend & Admin Panel:** Laravel, Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (Frontend), VPS/Cloud Hosting (Backend Laravel)

---

## Fase 1: Persiapan Database & Infrastruktur (Supabase)

- [ ] **Task 1.1:** Buat proyek baru di [Supabase](https://supabase.com).
- [ ] **Task 1.2:** Dapatkan kredensial koneksi database PostgreSQL (Host, Port, Database Name, User, Password).
- [ ] **Task 1.3:** Dapatkan Supabase URL dan Anon/Public Key (jika Next.js akan mengambil data langsung dari Supabase Client, opsional jika melalui Laravel API).

## Fase 2: Pengembangan Backend & Admin Panel (Laravel)

- [ ] **Task 2.1: Inisialisasi Proyek Laravel**
  - Buat proyek Laravel baru (`composer create-project laravel/laravel portfolio-admin`).
  - Konfigurasi `.env` untuk terhubung ke database PostgreSQL Supabase.
- [ ] **Task 2.2: Migrasi Database**
  - Buat file migrasi berdasarkan PRD:
    - `users` (atau `user_profiles` untuk profil statis pemilik).
    - `skills` (id, name).
    - `tools` (id, name, icon_class, color_hex).
    - `experiences` (id, location, duration, role, description).
    - `educations` (id, year, degree).
    - `projects` (id, title, image_url, description, tags).
  - Jalankan `php artisan migrate`.
- [ ] **Task 2.3: Autentikasi Admin**
  - Implementasikan Laravel Breeze atau Jetstream untuk fitur Login/Logout Admin.
- [ ] **Task 2.4: Pembuatan Admin Panel UI (Tailwind CSS)**
  - Implementasikan layout Sidebar dan Dashboard berdasarkan mockup HTML (`admin_dashboard (4).html`).
  - Aplikasikan gaya desain *Brutalist* (border tebal, box-shadow solid `4px 4px 0 0 #000`).
- [ ] **Task 2.5: Implementasi CRUD Admin**
  - Buat Controller, Model, dan Views (Blade) untuk mengelola: Profil, Skills, Tools, Experiences, Educations, dan Projects.
  - Tambahkan notifikasi *Toast* (sukses/gagal) setelah aksi CRUD.
- [ ] **Task 2.6: Pembuatan REST API (Opsional tapi Direkomendasikan)**
  - Jika frontend Next.js tidak mengakses Supabase secara langsung, buat *API Routes* (`routes/api.php`) di Laravel untuk menyajikan data publik (GET profile, projects, dll) berformat JSON.

## Fase 3: Pengembangan Frontend Publik (Next.js)

- [ ] **Task 3.1: Inisialisasi Proyek Next.js**
  - Buat proyek baru (`npx create-next-app@latest portfolio-web`).
  - Aktifkan Tailwind CSS dalam konfigurasi setup.
- [ ] **Task 3.2: Konfigurasi Tailwind & Desain Sistem**
  - Sesuaikan `tailwind.config.js` dengan warna utama (`hsl(90, 82%, 68%)`), font *Montserrat*, dan *box-shadow brutalist*.
- [ ] **Task 3.3: Integrasi Data (Supabase / API Laravel)**
  - Konfigurasi *Environment Variables* (`.env.local`) untuk *Supabase Client* atau URL API Laravel.
  - Buat fungsi/layanan *fetching* data untuk mengambil data profil, skills, experiences, dan projects.
- [ ] **Task 3.4: Pembuatan Komponen UI (React/Next.js)**
  - Buat struktur layout "Kertas" (Paper container) di tengah layar.
  - Implementasikan navigasi Tab (*Information* dan *Projects*) menggunakan state React (bukan manipulasi DOM Vanilla JS).
- [ ] **Task 3.5: Styling & Interaksi Visual**
  - Terapkan efek *grayscale* pada gambar profil dan proyek yang berubah menjadi berwarna saat di-*hover*.
  - Pastikan halaman sepenuhnya responsif (Mobile-first).

## Fase 4: Pengujian (Testing & QA)

- [ ] **Task 4.1:** Lakukan uji coba input data CRUD di Laravel Admin Panel dan pastikan data tersimpan di Supabase.
- [ ] **Task 4.2:** Verifikasi bahwa perubahan data di Admin Panel langsung tercermin di frontend Next.js (pastikan *cache revalidation* diatur dengan benar di Next.js).
- [ ] **Task 4.3:** Uji tampilan di berbagai ukuran layar (Mobile, Tablet, Desktop).

## Fase 5: Deployment

- [ ] **Task 5.1: Deployment Frontend (Vercel)**
  - Hubungkan repositori GitHub/GitLab Next.js ke Vercel.
  - Konfigurasikan Environment Variables di Vercel.
  - Lakukan *Build & Deploy*.
- [ ] **Task 5.2: Deployment Backend Admin (Laravel)**
  - Siapkan *server hosting* (seperti Forge, Vapor, Railway, atau VPS konvensional) untuk proyek Laravel.
  - Konfigurasikan `.env` *production* (koneksi ke Supabase, APP_ENV, APP_KEY).
  - Tautkan URL API Laravel (jika ada) ke variabel lingkungan Vercel.
