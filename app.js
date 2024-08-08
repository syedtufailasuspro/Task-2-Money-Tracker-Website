const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.json());
app.use(express.static(__dirname));


mongoose.connect('mongodb://localhost:27017/money-tracker');


const transactionSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    type: String,
    category: String, 
    date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);


app.get('/api/transactions', async (req, res) => {
    const transactions = await Transaction.find();
    res.json(transactions);
});

app.post('/api/transactions', async (req, res) => {
    const { description, amount, type, category } = req.body;
    const transaction = new Transaction({ description, amount, type, category });
    await transaction.save();
    res.json(transaction);
});

app.delete('/api/transactions/:id', async (req, res) => {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted' });
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
