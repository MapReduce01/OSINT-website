// script.js

function handleSearch() {
    const searchInput = document.getElementById('searchInput').value;
  
    // Check if the input is not empty
    if (!searchInput.trim()) {
      alert("Please enter a search term.");
      return;
    }
  
    // Create the request payload
    const data = { query: searchInput };
  
    // Send a POST request
    fetch('http://localhost:3000/api/search', { // Replace with your API endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Handle the response data
      displayResults(data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }
  
  // Function to display results in the results div
  function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results
  
    // Assuming results is an array of items
    results.forEach(result => {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      resultItem.textContent = result; // Customize based on your data structure
      resultsContainer.appendChild(resultItem);
    });
  }
  