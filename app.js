let entries = JSON.parse(localStorage.getItem("entries")) || [];

function addEntry() {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.querySelector('input[name="type"]:checked').value;

  const newEntry = {
    description,
    amount,
    type,
    id: Date.now()
  };

  entries.push(newEntry);
  updateLocalStorage();
  renderEntries();
}

function deleteEntry(id) {
  entries = entries.filter(entry => entry.id !== id);
  updateLocalStorage();
  renderEntries();
}

function updateEntry(id) {
  const entry = entries.find(entry => entry.id === id);
  document.getElementById('description').value = entry.description;
  document.getElementById('amount').value = entry.amount;
  document.querySelector(`input[name="type"][value="${entry.type}"]`).checked = true;
  deleteEntry(id);
}

function updateLocalStorage() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

function renderEntries(filter = "all") {
  const list = document.getElementById('entryList');
  list.innerHTML = '';
  
  const filteredEntries = filter === "all" ? entries : entries.filter(entry => entry.type === filter);
  
  let totalIncome = 0;
  let totalExpense = 0;

  filteredEntries.forEach(entry => {
    const li = document.createElement('li');
    li.classList.add('entry');
    li.innerHTML = `
      ${entry.description} - $${entry.amount} (${entry.type}) 
      <button onclick="updateEntry(${entry.id})">Edit</button> 
      <button onclick="deleteEntry(${entry.id})">Delete</button>
    `;
    list.appendChild(li);

    if (entry.type === "income") {
      totalIncome += entry.amount;
    } else {
      totalExpense += entry.amount;
    }
  });

  const netBalance = totalIncome - totalExpense;
  document.getElementById('totalIncome').innerText = totalIncome;
  document.getElementById('totalExpense').innerText = totalExpense;
  document.getElementById('netBalance').innerText = netBalance;
}

function handleFilter() {
  const selectedFilter = document.querySelector('input[name="filter"]:checked').value;
  renderEntries(selectedFilter);
}

document.getElementById('addButton').addEventListener('click', addEntry);
document.getElementById('resetButton').addEventListener('click', () => {
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  document.querySelector('input[name="type"]:checked').checked = false;
});
document.querySelectorAll('input[name="filter"]').forEach(input => {
  input.addEventListener('change', handleFilter);
});

renderEntries();  // Initial render
