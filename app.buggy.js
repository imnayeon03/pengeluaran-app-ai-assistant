// ======================================================================
// VERSI BERBUG (sengaja) - hasil "output AI" Iterasi 2 sebelum dievaluasi.
// Berisi 4 bug yang ditandai dengan komentar "BUG #n".
// Versi yang sudah diperbaiki ada di app.js
// ======================================================================

// Elemen DOM
const expenseForm = document.getElementById('expense-form');
const descInput = document.getElementById('desc-input');
const amountInput = document.getElementById('amount-input');
const categoryInput = document.getElementById('category-input');
const expenseList = document.getElementById('expense-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const expenseTotal = document.getElementById('expense-total');
const expenseCount = document.getElementById('expense-count');
const clearAllBtn = document.getElementById('clear-all-btn');

// Inisialisasi data dari localStorage
// BUG #4: try/catch hanya menangkap JSON yang tidak valid secara sintaks.
// Jika isinya JSON valid tetapi BUKAN array (mis. {"a":1} atau 5),
// expenses menjadi bukan array dan renderExpenses() crash.
let expenses;
try {
  expenses = JSON.parse(localStorage.getItem('expenses')) || [];
} catch (e) {
  expenses = [];
  localStorage.removeItem('expenses');
}

let currentFilter = 'all';

function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function getFilteredExpenses() {
  return expenses.filter(item => currentFilter === 'all' || item.category === currentFilter);
}

function formatRupiah(value) {
  return 'Rp ' + value.toLocaleString('id-ID');
}

function renderExpenses() {
  expenseList.innerHTML = '';
  const filtered = getFilteredExpenses();

  if (filtered.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = currentFilter === 'all'
      ? 'Belum ada pengeluaran. Catat pengeluaran pertamamu!'
      : 'Tidak ada pengeluaran pada kategori ini.';
    expenseList.appendChild(empty);
  } else {
    filtered.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'expense-item';

      // BUG #3: deskripsi dari pengguna dimasukkan lewat innerHTML
      // tanpa di-escape -> rawan XSS (HTML/script dari input dieksekusi).
      li.innerHTML = `
        <div class="expense-info">
          <span class="expense-desc">${item.description}</span>
          <span class="expense-meta">${item.category}</span>
        </div>
        <span class="expense-amount">${formatRupiah(item.amount)}</span>`;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Hapus';
      // BUG #2: yang dikirim adalah index di dalam daftar TERFILTER,
      // bukan posisi/ID item di array expenses yang sebenarnya.
      deleteBtn.addEventListener('click', () => deleteExpense(index));
      li.appendChild(deleteBtn);

      expenseList.appendChild(li);
    });
  }

  // BUG #1: item.amount bertipe string (nilai mentah dari <input>),
  // sehingga operator + melakukan penggabungan string, bukan penjumlahan.
  const total = filtered.reduce((sum, item) => sum + item.amount, 0);
  expenseTotal.textContent = 'Total: ' + formatRupiah(total);
  expenseCount.textContent = `${filtered.length} item`;
  clearAllBtn.disabled = expenses.length === 0;
}

expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const description = descInput.value.trim();

  if (description !== '') {
    expenses.push({
      id: Date.now(),
      description: description,
      amount: amountInput.value,          // BUG #1: tidak dikonversi ke angka
      category: categoryInput.value
    });
    saveExpenses();
    renderExpenses();
    descInput.value = '';
    amountInput.value = '';
  }
});

function deleteExpense(index) {
  expenses.splice(index, 1);              // BUG #2: menghapus item yang salah saat filter aktif
  saveExpenses();
  renderExpenses();
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderExpenses();
  });
});

clearAllBtn.addEventListener('click', () => {
  if (!confirm('Apakah Anda yakin ingin menghapus semua pengeluaran?')) return;
  expenses = [];
  saveExpenses();
  renderExpenses();
});

renderExpenses();
