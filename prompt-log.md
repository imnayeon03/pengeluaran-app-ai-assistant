# Prompt Log

Dokumen ini mencatat proses penggunaan Generative AI dalam pengembangan aplikasi Pencatat Pengeluaran.

Format: Tanggal, Tujuan, Prompt, Output AI, Evaluasi, Bug/Masalah, Perbaikan, Alasan keputusan.

---

## Catatan 1 — Iterasi 1: Rancangan Awal
- Tanggal: 19/10/2026
- Tujuan: Meminta rancangan awal dan struktur file.
- Prompt: (lihat `screenshots/prompts/01-iterasi1-prompt.png`) Meminta rancangan aplikasi Pencatat Pengeluaran dengan 7 fitur, tanpa framework/backend, tanpa kode lengkap.
- Output AI: (lihat `02-iterasi1-output.png`) Struktur `index.html`, `style.css`, `app.js`; model data `{id, description, amount, category}`. AI juga menyarankan React/Vue, Chart.js, anggaran bulanan, ekspor CSV, multi-mata-uang.
- Evaluasi: Struktur sesuai; saran tambahan berlebihan untuk tugas sederhana.
- Bug/Masalah: Belum ada kode.
- Perbaikan: Prompt berikutnya menegaskan JS vanilla dan satu fungsi render.
- Alasan keputusan: Ruang lingkup 1 minggu; saran di luar kebutuhan ditolak dan dicatat sebagai bukti evaluasi kritis.

---

## Catatan 2 — Iterasi 2: Implementasi Kode
- Tanggal: 19/10/2026
- Tujuan: Meminta kode lengkap 3 file.
- Prompt: (lihat `03-iterasi2-prompt.png`)
- Output AI: (lihat `04`–`06-iterasi2-output.png`) Kode lengkap; tersimpan sebagai `app.buggy.js`.
- Evaluasi: Jalan pada skenario normal, tetapi pengujian kondisi tepi menemukan 4 bug (Catatan 4–7).
- Alasan keputusan: Kode dijalankan apa adanya sebagai versi berbug agar kondisi sebelum perbaikan terdokumentasi.

---

## Catatan 3 — Iterasi 3: Perbaikan Bug
- Tanggal: 19/10/2026
- Tujuan: Meminta perbaikan keempat bug dalam bentuk diff.
- Prompt: (lihat `07-iterasi3-prompt.png`) Gejala 4 bug, diff saja, jangan ubah fitur lain, jelaskan penyebab.
- Output AI: (lihat `08`–`09-iterasi3-output.png`) Diff dan penjelasan penyebab.
- Evaluasi: Perbaikan benar secara teknis, tetapi: input ditolak tanpa pesan, konfirmasi hapus generik, item tidak divalidasi satu per satu, ID `Date.now()` berisiko duplikat.
- Perbaikan manual: pesan error form, konfirmasi dengan jumlah+total, `isValidExpense`, `createId()`.
- Hasil: `app.js` versi final.

---

## Catatan 4 — Bug #1: Total tergabung sebagai string
- Gejala: 15000 + 20000 tampil `Rp 01500020000` (`screenshots/bugs/bug-01-total-string.png`).
- Penyebab: `input.value` bertipe string, `+` menjadi penggabungan teks.
- Perbaikan: `Number(amountInput.value)` + validasi (`fix-01-total-string.png`).

## Catatan 5 — Bug #2: Hapus item yang salah saat filter aktif
- Gejala: Hapus "Ojek online" di filter Transportasi malah menghapus "Makan siang" (`bug-02-delete-filter.png`).
- Penyebab: indeks dari array terfilter dipakai pada `splice` array penuh.
- Perbaikan: hapus berdasarkan `item.id` (`fix-02-delete-filter.png`).

## Catatan 6 — Bug #3: XSS lewat innerHTML
- Gejala: `<img onerror=...>` pada deskripsi dieksekusi (`bug-03-xss.png`).
- Penyebab: input pengguna disisipkan sebagai HTML mentah.
- Perbaikan: `createElement` + `textContent` (`fix-03-xss.png`).

## Catatan 7 — Bug #4: Data valid JSON tapi bukan array
- Gejala: `localStorage.setItem('expenses','{"a":1}')` → `expenses.filter is not a function` (`bug-04-shape.png`).
- Penyebab: `try/catch` hanya menangkap sintaks JSON yang salah.
- Perbaikan: `Array.isArray` + `isValidExpense` (`fix-04-shape.png`).

## Catatan 8 — Pengujian
- 9 skenario uji manual pada versi final lolos; bukti di `screenshots/testing/`. Keempat bug tidak muncul kembali.
