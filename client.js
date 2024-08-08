document.getElementById('transaction-form').addEventListener('submit', addTransaction);

async function addTransaction(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;

    const transaction = {
        description,
        amount: parseFloat(amount),
        type,
        category
    };

    const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
    });

    const data = await response.json();
    displayTransaction(data);

    document.getElementById('transaction-form').reset();
    calculateBalance(); 
}

function displayTransaction(transaction) {
    const transactionsList = document.getElementById('transactions');
    const li = document.createElement('li');
    li.classList.add(transaction.type === 'income' ? 'income' : 'expense');
    li.textContent = `${transaction.description} (${transaction.category}): ₹${transaction.amount.toFixed(2)}`;
    transactionsList.appendChild(li);
}

async function calculateBalance() {
    const response = await fetch('/api/transactions');
    const transactions = await response.json();

    const balance = transactions.reduce((acc, transaction) => {
        return transaction.type === 'income'
            ? acc + transaction.amount
            : acc - transaction.amount;
    }, 0);

    document.getElementById('balance-amount').textContent = balance.toFixed(2);
}

window.onload = async () => {
    const response = await fetch('/api/transactions');
    const transactions = await response.json();
    transactions.forEach(displayTransaction);
    calculateBalance(); 
};
