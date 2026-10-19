# Aplikasi Web Pencatat Pengeluaran Sederhana Berbantuan Generative AI

Tugas I mata kuliah 11S3133 Pengembangan Aplikasi Berbasis Web. Aplikasi pencatat pengeluaran (HTML, CSS, JavaScript vanilla, localStorage) yang dikembangkan dengan bantuan Generative AI, lengkap dengan dokumentasi prompt, bug, dan perbaikan.

## Fitur
- Tambah pengeluaran (deskripsi, nominal, kategori) dengan validasi
- Daftar pengeluaran, hapus per item
- Filter kategori (Semua/Makanan/Transportasi/Belanja/Lainnya)
- Total pengeluaran dan jumlah item sesuai filter
- Hapus semua dengan konfirmasi (jumlah + total)
- Data tersimpan di localStorage, tahan terhadap data korup

## Cara Menjalankan
Buka `index.html` di browser (versi final). Untuk melihat bug yang sengaja dibuat, buka `index-buggy.html`.

## Struktur Repository
- `index.html`, `style.css`, `app.js` — versi final (bug sudah diperbaiki)
- `index-buggy.html`, `app.buggy.js` — versi berbug (4 bug, ditandai `BUG #n`)
- `prompt-log.md` — catatan prompt AI, evaluasi, bug, dan perbaikan
- `proposal.md`, `proposal.pdf` — dokumen proposal
- `screenshots/prompts|bugs|testing` — dokumentasi gambar

## Empat Bug yang Didokumentasikan
| # | Bug | Perbaikan |
|---|---|---|
| 1 | Total tergabung sebagai string (`Rp 01500020000`) | `Number()` + validasi nominal |
| 2 | Hapus item salah saat filter aktif | Hapus berdasarkan ID |
| 3 | XSS lewat `innerHTML` | `createElement` + `textContent` |
| 4 | Data valid JSON tapi bukan array membuat crash | Validasi `Array.isArray` + tiap item |
