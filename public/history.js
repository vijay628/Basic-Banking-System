function fetchTransactionHistory() {
    fetch('/transactions')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch transaction history: ${response.statusText}`);
        }
        return response.json();
      })
      .then(transactions => {
        const transactionHistoryDiv = document.getElementById('transaction-history');
        transactionHistoryDiv.innerHTML = "";
  
        transactions.forEach(transaction => {
          transactionHistoryDiv.innerHTML += `
          <tbody>
          <tr>
            <td>${transaction.sender}</td>
            <td>${transaction.receiver}</td>
            <td>${transaction.amount}</td>
            <td>${new Date(transaction.timestamp).toLocaleString()}</td>
          </tr>
        </tbody>
            `;
        });
      })
      .catch(error => console.error('Error fetching transaction history:', error));
  }


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
    } else {
      alert('Please enter a valid sender name.');
    }
  }
  
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
  
