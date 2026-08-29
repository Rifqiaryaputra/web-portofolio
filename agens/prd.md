# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Personal Portfolio & Admin Dashboard

**STATUS: DRAFT SEMENTARA**

| | |
| --- | --- |
| **Nama Produk** | Sistem Portofolio Dinamis & Panel Admin |
| **Versi Dokumen** | v0.1 |
| **Disusun oleh** | Pengembang (AI) |
| **Untuk** | Pemilik Portofolio (Nia Loren / Klien) |
| **Tanggal** | 27 Agustus 2026 |
| **Dokumen Terkait** | Referensi HTML mockup (admin_dashboard (4).html, portfolio_website (1).html) |

---

# 1. Ringkasan Produk (Overview)

Saat ini, pengelolaan website portofolio statis membutuhkan perubahan kode secara manual setiap kali ada penambahan proyek, pengalaman kerja, atau pembaruan profil. Hal ini tidak efisien dan rentan terhadap kesalahan teknis bagi pengguna yang ingin memperbarui konten secara cepat dan berkala.

Solusi yang akan dibangun adalah sistem website portofolio dinamis yang dilengkapi dengan Panel Admin terintegrasi. Sistem ini mencakup dua modul utama: halaman publik yang interaktif untuk menampilkan profil profesional, dan dashboard admin tersembunyi yang memungkinkan pemilik portofolio melakukan fungsi CRUD (Create, Read, Update, Delete) pada data profil, keterampilan, pendidikan, pengalaman, dan proyek.

# 2. Tujuan & Sasaran (Goals)

- Memusatkan manajemen konten portofolio dalam satu antarmuka dashboard yang mudah digunakan.
- Menghilangkan kebutuhan untuk mengedit kode sumber (HTML/CSS) saat memperbarui informasi profesional.
- Menyediakan tampilan publik yang profesional, unik (Brutalist/Paper aesthetic), dan responsif di berbagai perangkat.
- Menampilkan data dan portofolio secara terstruktur melalui sistem navigasi tab yang interaktif.

# 3. Pengguna & Peran (Users & Roles)

- **Admin (Pemilik Portofolio) :** Memiliki hak akses penuh untuk masuk ke panel admin, melihat statistik ringkas, dan mengelola seluruh entitas data (profil, *skills*, alat, pengalaman, pendidikan, proyek).
- **Pengunjung (Publik/Rekruter) :** Mengakses halaman utama portofolio untuk membaca informasi, melihat galeri proyek, dan mengunduh CV.

# 4. Ruang Lingkup (Scope)

## 4.1 Termasuk (MVP)

- Halaman Publik (Hero section, tab Informasi, tab Proyek, tautan kontak sosial).
- Dashboard Admin (Ringkasan statistik, manajemen profil dasar).
- Modul CRUD Admin (Skills, Tools & Tech, Experience, Education, Projects).
- Notifikasi *Toast* untuk umpan balik aksi pengguna di panel admin.

## 4.2 Di Luar Lingkup Awal / Fase Lanjutan

- Fitur ekspor/backup data secara riil.
- Halaman detail dinamis untuk masing-masing proyek (saat ini hanya menampilkan tautan 'Lihat Detail' tanpa navigasi spesifik).
- Fitur *Live Preview* dari panel admin.

# 5. Asumsi & Batasan (Assumptions & Constraints)

- **Asumsi Teknis:** Berdasarkan mockup HTML yang diberikan, tampilan depan dibangun murni dengan Tailwind CSS via CDN dan Vanilla JavaScript. Untuk berfungsi secara riil, dibutuhkan pengembangan Backend dan Database (API) yang saat ini belum ditentukan tumpukan teknologinya.
- **Asumsi Arsitektur:** Otentikasi admin (login/logout) belum terdefinisi secara detail dalam mockup dan diasumsikan akan menggunakan mekanisme standar (misal: JWT/Session) pada saat pengembangan Backend.
- **Batasan Tampilan:** Konsep desain *Brutalist/Paper* menggunakan border tebal dan bayangan solid, sehingga elemen UI harus mematuhi CSS *box-shadow* dan *border* yang telah dikonfigurasi.

# 6. Kebutuhan Fungsional (Functional Requirements)

## 6.1 Admin — Manajemen Profil & Dashboard

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **ADM-1** | Sistem menampilkan ringkasan statistik (total proyek, jumlah skill, pengalaman) pada halaman Dashboard. | **Wajib** |
| **ADM-2** | Admin dapat memperbarui informasi profil dasar (Nama, Title, URL Gambar, Email, Lokasi, WhatsApp, LinkedIn, Bio). | **Wajib** |
| **ADM-3** | Admin dapat mengunggah atau menautkan file CV (format PDF). | **Wajib** |
| **ADM-4** | Sistem menyediakan tombol "Logout" untuk keluar dari panel admin. | **Wajib** |
| **ADM-5** | Admin dapat melakukan "Backup Data". | **Fase 2** |

## 6.2 Admin — Manajemen Konten (CRUD)

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **CON-1** | Admin dapat menambahkan, mengedit, dan menghapus *Skill* (teks). | **Wajib** |
| **CON-2** | Admin dapat menambahkan, mengedit, dan menghapus *Tool* (Nama, kelas Ikon Remix, Kode Warna Hex). | **Wajib** |
| **CON-3** | Admin dapat menambahkan, mengedit, dan menghapus *Experience* (Lokasi, Durasi, Peran, Deskripsi berformat *bullet points*). | **Wajib** |
| **CON-4** | Admin dapat menambahkan, mengedit, dan menghapus *Education* (Tahun/Kelas, Gelar & Institusi). | **Wajib** |
| **CON-5** | Admin dapat menambahkan, mengedit, dan menghapus *Project* (Judul, URL Gambar, Deskripsi, Tags dipisah koma). | **Wajib** |
| **CON-6** | Sistem menampilkan *Toast Notification* (sukses/gagal) untuk setiap aksi CRUD. | **Penting** |

## 6.3 Pengunjung — Halaman Portofolio Publik

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **PUB-1** | Sistem menampilkan profil ringkas (Nama, Jabatan, Bio, Foto) pada bagian atas halaman. | **Wajib** |
| **PUB-2** | Pengunjung dapat menekan tombol untuk mengunduh CV. | **Wajib** |
| **PUB-3** | Pengunjung dapat melakukan *toggle* tab antara "Information" dan "Projects" tanpa memuat ulang halaman (*smooth transition*). | **Wajib** |
| **PUB-4** | Tab Informasi menampilkan daftar Skills, Tools (dengan ikon warna), Pengalaman, dan Pendidikan. | **Wajib** |
| **PUB-5** | Tab Proyek menampilkan *grid* kartu proyek berisi gambar, judul, deskripsi, dan tag keterampilan. | **Wajib** |
| **PUB-6** | Gambar proyek dan profil berstatus *grayscale* dan akan berwarna serta sedikit membesar ketika di-hover (interaksi visual). | **Penting** |

# 7. Alur Pengguna Utama (Key User Flows)

## 7.1 Alur Admin Menambahkan Proyek Baru

1. Admin menekan menu "Projects" pada sidebar atau "Add New Project" pada Quick Actions di Dashboard.
2. Sistem menampilkan daftar proyek yang sudah ada.
3. Admin menekan tombol "Add Project".
4. Sistem memunculkan *Modal* "Add Project".
5. Admin mengisi *Project Title*, *Image URL*, *Description*, dan *Tags*.
6. Admin menekan tombol "Save Project".
7. Sistem menutup modal, memperbarui daftar proyek, dan menampilkan *Toast* "Action successful" berikon centang hijau.

## 7.2 Alur Pengunjung Melihat Proyek

1. Pengunjung membuka halaman utama portofolio.
2. Pengunjung menekan tombol tab "Projects".
3. Sistem secara dinamis (via JavaScript) mengubah visibilitas konten dengan efek *fade in/out*.
4. Sistem menampilkan kartu-kartu proyek.
5. Pengunjung mengarahkan kursor (*hover*) ke salah satu gambar proyek, sistem memberikan efek *zoom* dan menghilangkan efek *grayscale*.

# 8. UI/UX Overview

## 8.1 Gaya & Tema Visual

- **Tema Brutalist / Paper:** Menggunakan gaya desain yang terinspirasi dari antarmuka brutalist dipadukan dengan tekstur atau tata letak mirip kertas dokumen. 
- **Ciri Visual:** Bayangan kotak tebal tanpa *blur* (`box-shadow: 4px 4px 0 0 rgba(0,0,0,1)`), garis pembatas solid 2px, serta aksen garis putus-putus (*dashed borders*) yang sengaja dibuat miring.
- **Palet Warna:** Warna utama menggunakan hijau muda (`hsl(90, 82%, 68%)`), teks menggunakan warna mendekati hitam (`hsl(0, 0%, 4%)`), dengan latar belakang dokumen berwarna putih-abu (`#F3F3F3`) di atas latar meja `#EAEAEA`.
- **Tipografi & Ikon:** Font menggunakan *Montserrat*, sementara ikonografi menggunakan pustaka *Remix Icon*.

## 8.2 Perangkat & Responsivitas

- **Mobile & Desktop Responsive:** 
  - Panel admin menggunakan *sidebar* yang tersembunyi pada layar kecil (dapat dibuka melalui tombol *hamburger menu*).
  - Halaman publik menggunakan sistem grid (CSS Grid) yang menyesuaikan kolom dari 1 kolom di mobile menjadi 2 kolom atau pembagian rasio khusus di desktop.

## 8.3 Referensi Desain

Belum ada referensi desain kompetitor spesifik yang disebutkan, desain murni merujuk pada file HTML statis yang diberikan.

# 9. Model Data & Database Overview (High-Level)

## 9.1 Ringkasan Basis Data

Mengingat sifat data yang sangat terstruktur dan berelasi (seorang pemilik portofolio memiliki banyak proyek, pengalaman, dll), diasumsikan bahwa sistem akan menggunakan **Basis Data Relasional (SQL)**. Saat ini, sistem menggunakan *mock data* (array objek di memori JavaScript). Untuk fase produksi riil, akan dibutuhkan relasi di mana entitas User/Profile menjadi entitas utama.

## 9.2 Detail Entitas

| **Entitas** | **Field Utama** | **Keterangan** |
| --- | --- | --- |
| **user_profile** | name, title, image_url, email, location, phone, linkedin, about_me, cv_url | Menyimpan data statis profil pemilik. |
| **skills** | id, name | Daftar keterampilan tekstual. |
| **tools** | id, name, icon_class, color_hex | Daftar perangkat lunak lengkap dengan ikon. |
| **experiences** | id, location, duration, role, description | Riwayat pekerjaan (deskripsi dipisah *newline*). |
| **educations** | id, year, degree | Riwayat pendidikan formal/non-formal. |
| **projects** | id, title, image_url, description, tags | Galeri portofolio. Tag dapat berformat CSV atau direlasikan ke tabel lain. |

**Catatan:** Pembuatan model ERD terperinci akan menyusul setelah tumpukan (stack) backend diputuskan.

# 10. Kebutuhan Non-Fungsional (Non-Functional Requirements)

- **Keamanan & Hak Akses :** Panel admin (termasuk Endpoint API Backend) wajib dilindungi oleh otentikasi. Publik tidak boleh memiliki akses masuk ke *route* admin.
- **Performa Antarmuka :** Transisi antar tab di halaman publik harus mulus memanfaatkan efek *opacity* dan CSS *transition* tanpa memicu pergantian halaman (SPA-like feel). Modal di admin harus responsif dan cepat.

# 11. Kebutuhan Teknis (Technical Requirements)

## 11.1 Arsitektur & Platform

- **Arsitektur Frontend:** Monolitik statis atau *Single Page Application* (SPA) dengan manipulasi DOM langsung, berjalan sepenuhnya di *browser* klien.

## 11.2 Teknologi / Stack

| **Layer** | **Teknologi** | **Catatan** |
| --- | --- | --- |
| **Frontend UI** | HTML5, Tailwind CSS | Menggunakan *CDN script* untuk Tailwind. |
| **Interaksi UI** | Vanilla JavaScript | Tidak menggunakan *framework* JS seperti React/Vue pada prototipe awal. |
| **Tipografi & Ikon** | Google Fonts (Montserrat), Remix Icons (v4.9.0) | Disertakan melalui *external stylesheet*. |
| **Backend & DB** | TBD | Belum ditentukan. (Lihat Bab 14) |

## 11.3 Hosting & Environment

- TBD (Tergantung pemilihan stack Backend nantinya).

# 12. Integrasi Pihak Ketiga

| **Layanan** | **Fungsi** | **Catatan** |
| --- | --- | --- |
| **Remix Icon** | Pustaka ikon grafis | Diambil melalui CDN. |
| **Google Fonts** | Pustaka font (Montserrat) | Diambil melalui layanan Google API. |

# 13. Fitur Usulan / Fase Lanjutan

- **Detail Proyek Dinamis.** Membuat halaman atau modal pop-up khusus yang memberikan studi kasus panjang lebar saat pengunjung menekan teks "Lihat Detail" pada kartu proyek di halaman publik.
- **Live Preview.** Fitur pada Panel Admin untuk melihat secara *real-time* bagaimana portofolio akan terlihat oleh pengunjung sebelum perubahan disimpan.

# 14. Pertanyaan Terbuka / TBD

- **Backend & Basis Data:** Teknologi apa yang akan digunakan untuk menggantikan mekanisme *in-memory array* pada JavaScript (misal: Node.js, PHP/Laravel, Firebase, Supabase)?
- **Otentikasi:** Bagaimana metode login untuk admin akan diterapkan?
- **Penyimpanan Berkas (Storage):** Di mana *file* unggahan CV (PDF) dan Gambar akan disimpan (misal: AWS S3, Cloudinary, penyimpanan lokal server)?
- **Hosting / Domain:** Di mana sistem ini akan di-hosting secara *live* dan apa nama domainnya?

# 15. Glosarium

- **Brutalist Web Design :** Gaya desain web yang sengaja menampilkan elemen secara kasar, berani, tanpa penghalusan gradasi, dengan *border* dan *shadow* tebal.
- **CRUD :** *Create, Read, Update, Delete* – fungsi dasar manipulasi data dalam sistem aplikasi.
- **Tailwind CSS :** *Framework* CSS berbasis utilitas yang digunakan untuk styling cepat langsung di elemen HTML.
- **Toast Notification :** Pesan umpan balik kecil yang muncul sejenak (biasanya di pojok layar) untuk mengonfirmasi bahwa aksi berhasil atau gagal tanpa mengganggu pengalaman pengguna.

---

*Dokumen ini merupakan draft sementara dan dapat berubah seiring pembahasan lebih lanjut dengan klien.*
