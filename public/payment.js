function makePayment(){
    // fetch user data to make payment 
    const sender = document.getElementById('senderName').value;
    const receiver = document.getElementById('receiverName').value;
    const amount = document.getElementById('amount').value;
  
  
    if (sender && receiver && !isNaN(amount) && amount > 0) {
      fetch('/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender, receiver, amount }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            alert(`Error: ${data.error}`);
          } else {
            // Optionally, update the UI or show a confirmation message
            alert(data.message);
            // Example: Refresh customers list after a successful transfer
            fetchCustomers();
          }
        })
        .catch(error => console.error('Error transferring money:', error));
    } else {
      alert('Invalid input. Please try again.');
    }
  
  }

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