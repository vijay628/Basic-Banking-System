const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://0.0.0.0:27017/banking_system', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  balance: Number,
});

const Customer = mongoose.model('Customer', customerSchema);
const transferSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    amount: Number,
    timestamp: { type: Date, default: Date.now },
  });
  
  const Transfer = mongoose.model('Transfer', transferSchema);

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('images'));

// Seed initial data into the database
const initialCustomers = [
    { name: 'Customer 1', email: 'customer1@example.com', balance: 1000 },
    { name: 'Customer 2', email: 'customer2@example.com', balance: 1500 },
    { name: 'Customer 3', email: 'customer3@example.com', balance: 2000 },
    { name: 'Customer 4', email: 'customer4@example.com', balance: 1200 },
    { name: 'Customer 5', email: 'customer5@example.com', balance: 1800 },
    { name: 'Customer 6', email: 'customer6@example.com', balance: 900 },
    { name: 'Customer 7', email: 'customer7@example.com', balance: 1300 },
    { name: 'Customer 8', email: 'customer8@example.com', balance: 1600 },
    { name: 'Customer 9', email: 'customer9@example.com', balance: 1100 },
    { name: 'Customer 10', email: 'customer10@example.com', balance: 1400 },
  ];
  
  const initialTransfers = [
    { sender: 'Customer 1', receiver: 'Customer 2', amount: 200 },
    { sender: 'Customer 3', receiver: 'Customer 1', amount: 150 },
    { sender: 'Customer 4', receiver: 'Customer 5', amount: 50 },
    { sender: 'Customer 6', receiver: 'Customer 7', amount: 100 },
    { sender: 'Customer 8', receiver: 'Customer 9', amount: 120 },
    // Add more transfer data here
  ];

  // Function to check if data already exists in the database
async function isDataSeeded() {
    const customersCount = await Customer.countDocuments();
    const transfersCount = await Transfer.countDocuments();
    return customersCount == 10 && transfersCount > 0;
  }
  
  // Use insertMany only if data is not already seeded
  isDataSeeded()
    .then((dataSeeded) => {
      if (!dataSeeded) {
        return Promise.all([
          Customer.insertMany(initialCustomers),
          Transfer.insertMany(initialTransfers),
        ]);
      }
    })
    .then(() => {
      console.log('Initial data seeded successfully');
    })
    .catch((err) => {
      console.error('Error seeding initial data:', err);
    });
  

app.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find({}, { _id: 0, __v: 0 });
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/transfer', async (req, res) => {
  const { sender, receiver, amount } = req.body;

  try {
      const parsedAmount = parseFloat(amount);

      if (isNaN(parsedAmount)) {
          throw new Error(`Invalid amount: ${amount}`);
      }

      const senderCustomer = await Customer.findOne({ name: sender });
      if (!senderCustomer) {
          throw new Error(`Sender (${sender}) not found`);
      }

      senderCustomer.balance -= parsedAmount;
      await senderCustomer.save();

      const receiverCustomer = await Customer.findOne({ name: receiver });
      if (!receiverCustomer) {
          throw new Error(`Receiver (${receiver}) not found`);
      }

      receiverCustomer.balance += parsedAmount;
      await receiverCustomer.save();

      const transfer = new Transfer({ sender, receiver, amount: parsedAmount });
      await transfer.save();

      // Fetch the transfer details including the timestamp
      const transferDetails = await Transfer.findOne({ _id: transfer._id }, { _id: 0, __v: 0 });

      res.json({ message: 'Transfer successful', transfer: transferDetails });
  } catch (error) {
      console.error('Error transferring money:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

 
  app.get('/transactions', async (req, res) => {
    try {
      const transactions = await Transfer.find().sort({ timestamp: -1 });
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.get('/transactions/:senderName', async (req, res) => {
    try {
      const senderName = req.params.senderName;
    
      const transactions = await Transfer.find({ sender: senderName })
        .sort({ timestamp: -1 });
        
        if (transactions.length === 0) {
          // If no transactions are found, send a custom response
          res.status(404).json({ error: 'Sender name not found in transaction history' });
        } else {
          // If transactions are found, send them in the response
          res.json(transactions);
        }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// API endpoint to fetch customer by name
app.get('/customers/:customerName', async (req, res) => {
  try {
    const customerName = req.params.customerName;

    // Search for the customer by name in the database
    const customers = await Customer.find({ name: { $regex: new RegExp(customerName, 'i') } });

    // Sending an object with a "customers" property as an array
    if (customers.length === 0) {
      // If no details are found, send a custom response
      res.status(404).json({ error: 'Sender name not found in transaction history' });
    } else {
      // If details are found, send them in the response
      res.json({customers});
    }
    // res.json({ customers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
