//Function to fetch Customer list
function fetchCustomers() {
  fetch('/customers')
    .then(response => response.json())
    .then(customers => {
      const customersList = document.getElementById('customers-list');
      customers.forEach(customer => {
        customersList.innerHTML += `
        <tbody>
        <tr>
          <td>${customer.name}</td>
          <td>${customer.email}</td>
          <td>${customer.balance}</td>
        </tr>
      </tbody>
          `;
      });
    })
    .catch(error => console.error('Error fetching customers:', error));
}


// Function to fetch transaction history for a specific customer
function searchTransaction() {
  var senderName = document.getElementById("senderNameInput").value;
  if (senderName !== "") {
  fetch(`/transactions/${encodeURIComponent(senderName)}`)
    .then(response => {
      if (!response.ok) {
        alert(`No transactions found for ${senderName}.`);
        throw new Error(`Failed to fetch transaction history for ${senderName}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(transactions => {
      displayTransactions(transactions);
    })
    .catch(error => {
      console.error(`Error fetching transaction history for ${senderName}:`, error);
    });
  

function displayTransactions(transactions) {
  var transactionHistoryTable = document.getElementById("transaction-history");
  // Clear the existing rows
  transactionHistoryTable.innerHTML = "";

  // Populate the table with the transactions
  transactions.forEach(function (transaction) {
    var row = transactionHistoryTable.insertRow();
    var cellFrom = row.insertCell(0);
    var cellTo = row.insertCell(1);
    var cellAmount = row.insertCell(2);
    var cellDateTime = row.insertCell(3);

    cellFrom.textContent = transaction.sender;
    cellTo.textContent = transaction.receiver;
    cellAmount.textContent = transaction.amount;
    cellDateTime.textContent = new Date(transaction.timestamp).toLocaleString();
  });
}
}else{
alert('Please enter a valid sender name.');
}
}
window.onload = fetchCustomers;