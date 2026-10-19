// Pencatat Pengeluaran - versi FINAL (semua bug sudah diperbaiki).
// Versi berbug untuk demonstrasi: app.buggy.js + index-buggy.html

// Elemen DOM
const expenseForm = document.getElementById('expense-form');
const descInput = document.getElementById('desc-input');
const amountInput = document.getElementById('amount-input');
const categoryInput = document.getElementById('category-input');
const formError = document.getElementById('form-error');
const expenseList = document.getElementById('expense-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const expenseTotal = document.getElementById('expense-total');
const expenseCount = document.getElementById('expense-count');
const clearAllBtn = document.getElementById('clear-all-btn');

const STORAGE_KEY = 'expenses';
const MAX_AMOUNT = 1e12;

// Memastikan satu data yang dibaca dari localStorage berbentuk benar
function isValidExpense(item) {
  return item !== null
    && typeof item === 'object'
    && typeof item.id === 'string'
    && typeof item.description === 'string'
    && typeof item.amount === 'number' && Number.isFinite(item.amount)
    && typeof item.category === 'string';
}

// FIX #4: validasi bentuk data, bukan hanya sintaks JSON
function loadExpenses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error('Data bukan array');
    return data.filter(isValidExpense);
  } catch (e) {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

let expenses = loadExpenses();
let currentFilter = 'all';

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
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
    filtered.forEach(item => {
      const li = document.createElement('li');
      li.className = 'expense-item';

      const info = document.createElement('div');
      info.className = 'expense-info';

      // FIX #3: textContent menampilkan input sebagai teks biasa (aman dari XSS)
      const desc = document.createElement('span');
      desc.className = 'expense-desc';
      desc.textContent = item.description;

      const meta = document.createElement('span');
      meta.className = 'expense-meta';
      meta.textContent = item.category;

      info.appendChild(desc);
      info.appendChild(meta);

      const amount = document.createElement('span');
      amount.className = 'expense-amount';
      amount.textContent = formatRupiah(item.amount);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Hapus';
      // FIX #2: hapus berdasarkan ID unik, bukan posisi di daftar terfilter
      deleteBtn.addEventListener('click', () => deleteExpense(item.id));

      li.appendChild(info);
      li.appendChild(amount);
      li.appendChild(deleteBtn);
      expenseList.appendChild(li);
    });
  }

  // FIX #1: amount sudah bertipe number, jadi + adalah penjumlahan
  const total = filtered.reduce((sum, item) => sum + item.amount, 0);
  expenseTotal.textContent = 'Total: ' + formatRupiah(total);
  expenseCount.textContent = `${filtered.length} item`;
  clearAllBtn.disabled = expenses.length === 0;
}

function showError(message) {
  formError.textContent = message;
}

expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const description = descInput.value.trim();
  const amount = Number(amountInput.value);   // FIX #1: konversi eksplisit ke number

  if (description === '') {
    showError('Deskripsi tidak boleh kosong.');
    return;
  }
  if (amountInput.value.trim() === '' || !Number.isFinite(amount) || amount <= 0) {
    showError('Nominal harus berupa angka lebih dari 0.');
    return;
  }
  if (amount > MAX_AMOUNT) {
    showError('Nominal terlalu besar.');
    return;
  }

  showError('');
  expenses.push({
    id: createId(),
    description: description,
    amount: amount,
    category: categoryInput.value
  });
  saveExpenses();
  renderExpenses();
  descInput.value = '';
  amountInput.value = '';
  descInput.focus();
});

function deleteExpense(id) {
  expenses = expenses.filter(item => item.id !== id);
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
  if (expenses.length === 0) return;
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const message = `Hapus ${expenses.length} pengeluaran (total ${formatRupiah(total)})?`;
  if (!confirm(message)) return;

  expenses = [];
  saveExpenses();
  renderExpenses();
});

renderExpenses();
