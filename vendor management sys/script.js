// Initialize data storage (using localStorage for persistence)
if (!localStorage.getItem('vendors')) {
    localStorage.setItem('vendors', JSON.stringify({}));
  }
  
  if (!localStorage.getItem('ratings')) {
    localStorage.setItem('ratings', JSON.stringify({}));
  }
  
  if (!localStorage.getItem('services')) {
    localStorage.setItem('services', JSON.stringify({}));
  }
  
  if (!localStorage.getItem('reviews')) {
    localStorage.setItem('reviews', JSON.stringify({}));
  }
  
  if (!localStorage.getItem('admin')) {
    localStorage.setItem('admin', JSON.stringify({ username: 'admin', password: 'admin123' }));
  }
  
  // Login Function
  document.getElementById('admin-login-btn').addEventListener('click', function () {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (username === admin.username && password === admin.password) {
      showAdminPanel();
    } else {
      document.getElementById('login-error').textContent = 'Invalid credentials';
      document.getElementById('login-error').style.textAlign = 'center';
    }
  });
  
  // Show Admin Panel
  function showAdminPanel() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    document.getElementById('vendor-form').style.display = 'none';
    document.getElementById('search-vendors').style.display = 'none';
    document.getElementById('highest-rated').style.display = 'none';
    document.getElementById('vendor-info').style.display = 'none';
    document.getElementById('review-form').style.display = 'none';
    document.getElementById('contract-management-panel').style.display = 'none';

  }
  
  // Show Vendor Registration Form
    function showVendorForm() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('vendor-form').style.display = 'block';
  }
  
  // Register Vendor
// Show or hide custom service input based on the selected service
document.getElementById('vendor-service').addEventListener('change', function () {
  const customServiceInput = document.getElementById('custom-service');
  const customServiceLabel = document.getElementById('custom-service-label');
  
  if (this.value === 'others') {
      // Show input for custom service
      customServiceInput.style.display = 'block';
      customServiceLabel.style.display = 'block';
  } else {
      // Hide input for custom service
      customServiceInput.style.display = 'none';
      customServiceLabel.style.display = 'none';
  }
});

// Register Vendor
document.getElementById('add-vendor-btn').addEventListener('click', function () {
  const vendorID = document.getElementById('vendor-id').value;
  const vendorName = document.getElementById('vendor-name').value;
  let service = document.getElementById('vendor-service').value;
  const location = document.getElementById('vendor-location').value;
  const vendorDate = document.getElementById('vendor-date').value;

  if (service === 'others') {
      service = document.getElementById('custom-service').value;
      if (!service) {
          document.getElementById('vendor-form-error').textContent = 'Please specify a custom service.';
          return;
      }
  }
  if (!vendorID || !vendorName || !service || !location) {
      document.getElementById('vendor-form-error').textContent = 'Please fill in all fields.';
      return; 
  }

  const vendors = JSON.parse(localStorage.getItem('vendors')) || {};
  if (vendors[vendorID]) {
      document.getElementById('vendor-form-error').textContent = 'Vendor ID already exists.';
  } else {
      vendors[vendorID] = { name: vendorName, service, location, date: vendorDate };
      localStorage.setItem('vendors', JSON.stringify(vendors));

      // Add to services category
      const services = JSON.parse(localStorage.getItem('services')) || {};
      if (!services[service]) services[service] = [];
      services[service].push(vendorID);
      localStorage.setItem('services', JSON.stringify(services));

      alert('Vendor added successfully!');
      showAdminPanel();
  }
});


  // Logout 
  function logout() {
    // Hide all sections and show the login form
    document.getElementById('admin-panel').style.display = 'block';
    document.getElementById('vendor-form').style.display = 'none';
    document.getElementById('search-vendors').style.display = 'none';
    document.getElementById('highest-rated').style.display = 'none';
    document.getElementById('vendor-info').style.display = 'none';

    // Show login form
    document.getElementById('admin-login').style.display = 'block';

    // Clear input fields
    document.getElementById('admin-username').value = '';
    document.getElementById('admin-password').value = '';
    
    // Clear any errors
    document.getElementById('login-error').textContent = '';
    document.getElementById('admin-panel-error').textContent = '';
}
  
// Show Search Vendors
function showSearchVendors() {
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'none';
  document.getElementById('search-vendors').style.display = 'block';
}

// Search Vendors
function searchVendors(action) {
  const searchTerm = document.getElementById('vendor-search-name').value.toLowerCase();
  const vendors = JSON.parse(localStorage.getItem('vendors')) || {};
  const vendorListElement = document.getElementById('vendor-list');
  vendorListElement.innerHTML = ''; // Clear previous list

  if (action === 'search') {
    if (!searchTerm) {
      // If search term is empty, show alert
      alert('Please enter the vendor\'s name');
      return; // Stop further execution
    }

    // Search for vendors by name
    const vendorList = Object.values(vendors).filter(vendor => vendor.name.toLowerCase().startsWith(searchTerm));

    if (vendorList.length > 0) {
      vendorList.forEach(vendor => {
        const li = document.createElement('li');
        li.textContent = `${vendor.name} - ${vendor.service} - ${vendor.location}`;
        const btn = document.createElement('button');
        btn.textContent = 'View Info';
        btn.onclick = () => showVendorInfo(vendor);
        btn.classList.add('view-info-btn'); 
        li.appendChild(btn);
        vendorListElement.appendChild(li);
      });
    } else {
      vendorListElement.innerHTML = '<li>No vendors found.</li>';
    }
  } else if (action === 'searchAll') {
    // Show all vendors if searchAll button is clicked
    const vendorList = Object.values(vendors);
    if (vendorList.length > 0) {
      vendorList.forEach(vendor => {
        const li = document.createElement('li');
        li.textContent = `${vendor.name} - ${vendor.service} - ${vendor.location}`;
        const btn = document.createElement('button');
        btn.textContent = 'View Info';
        btn.onclick = () => showVendorInfo(vendor);
        btn.classList.add('view-info-btn'); 
        li.appendChild(btn);
        vendorListElement.appendChild(li);
      });
    } else {
      vendorListElement.innerHTML = '<li>No vendors available.</li>';
    }
  }
}

  // Show Vendor Info and Reviews
  function showVendorInfo(vendor) {
    // Hide the search vendor list and show the vendor info section
    document.getElementById('search-vendors').style.display = 'none';
    document.getElementById('vendor-info').style.display = 'block';

    // Format the vendor information
    const vendorInfoText = `
        Name: ${vendor.name} <br>
        Service: ${vendor.service} <br>
        Location: ${vendor.location}
    `;
    document.getElementById('vendor-info-text').innerHTML = vendorInfoText;

    // Retrieve the reviews from local storage
    const reviews = JSON.parse(localStorage.getItem('reviews'));
    const vendorReviews = reviews[vendor.name] || [];
    const reviewListElement = document.getElementById('review-list');
    reviewListElement.innerHTML = '';

    // Display the reviews
    if (vendorReviews.length > 0) {
        vendorReviews.forEach(review => {
            const li = document.createElement('li');
            li.innerHTML = `${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}: ${review.text}`;
            reviewListElement.appendChild(li);
        });
    } else {
        reviewListElement.innerHTML = '<li>No reviews yet.</li>';
    }
}

// Function to show vendor information (example, can be customized)
// function showVendorInfo(vendor) {
//   alert(`Vendor Name: ${vendor.name}\nService: ${vendor.service}\nLocation: ${vendor.location}`);
// }

// Show Vendors for Rating and Review
function giveVendorsForReview() {
  document.getElementById('admin-panel').style.display = 'none';
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('vendor-review-form').style.display = 'block';
  
  const vendors = JSON.parse(localStorage.getItem('vendors')) || {};
  const vendorListElement = document.getElementById('vendor-list-for-review');
  vendorListElement.innerHTML = ''; // Clear previous list
  
  Object.values(vendors).forEach(vendor => {
    const li = document.createElement('li');
    li.textContent = `${vendor.name} - ${vendor.service} - ${vendor.location}`;
    
    const btn = document.createElement('button');
    btn.textContent = 'Review';
    btn.onclick = () => showReviewForm(vendor);
    
    li.appendChild(btn);
    vendorListElement.appendChild(li);
  });
}

// Show Review Form for Vendor
function showReviewForm(vendor) {
  document.getElementById('vendor-review-form').style.display = 'none';
  document.getElementById('review-form').style.display = 'block';
  
  document.getElementById('vendor-name-for-review').textContent = vendor.name;
  document.getElementById('vendor-id-for-review').value = vendor.name; // Using vendor name as ID for simplicity
  document.getElementById('review-text').value = '';
  
  // Reset selected rating
  document.querySelectorAll('.star').forEach(star => {
    star.classList.remove('selected');
  });
  document.getElementById('selected-rating').textContent = 'Rating: 0 Stars';
}

// Handle Star Rating Selection
document.querySelectorAll('.star').forEach(star => {
  star.addEventListener('click', function () {
    const rating = this.getAttribute('data-value');
    document.getElementById('selected-rating').textContent = `Rating: ${rating} Stars`;

    // Highlight selected stars
    document.querySelectorAll('.star').forEach(star => {
      star.classList.remove('selected');
    });
    for (let i = 0; i < rating; i++) {
      document.querySelectorAll('.star')[i].classList.add('selected');
    }
  });
});


// Submit Review
function submitReview() {
  const reviewText = document.getElementById('review-text').value;
  const rating = document.querySelector('.selected') ? document.querySelector('.selected').getAttribute('data-value') : 0;

  if (!reviewText || rating === 0) {
    document.getElementById('review-error').textContent = 'Please provide a rating and a review text.';
    return;
  }

  const vendorName = document.getElementById('vendor-id-for-review').value;
  const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
  const ratings = JSON.parse(localStorage.getItem('ratings')) || {};  // Get the ratings object from localStorage

  // Ensure reviews object exists for the vendor
  if (!reviews[vendorName]) reviews[vendorName] = [];
  reviews[vendorName].push({ text: reviewText, rating: parseInt(rating) });  // Store review text and rating
  localStorage.setItem('reviews', JSON.stringify(reviews));  // Save reviews back to localStorage

  // Ensure ratings object exists for the vendor
  if (!ratings[vendorName]) ratings[vendorName] = [];
  ratings[vendorName].push(parseInt(rating));  // Store the rating for the vendor
  localStorage.setItem('ratings', JSON.stringify(ratings));  // Save ratings back to localStorage

  alert('Review submitted successfully!');
  showVendorInfo({ name: vendorName, service: '', location: '' });
}

function showViewHighestRated() {
  document.getElementById('admin-panel').style.display = 'none';
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('highest-rated').style.display = 'block';

  const ratings = JSON.parse(localStorage.getItem('ratings')) || {};  // Ensure ratings exist
  const reviews = JSON.parse(localStorage.getItem('reviews')) || {};  // Ensure reviews exist
  const vendors = JSON.parse(localStorage.getItem('vendors')) || {};  // Ensure vendors exist

  const sortedVendors = [];

  // Calculate average rating and count for each vendor
  for (const vendorID in vendors) {
    const vendor = vendors[vendorID];
    const vendorRatings = ratings[vendorID] || [];  // Get the ratings for the vendor
    const vendorReviews = reviews[vendor.name] || [];  // Get the reviews for the vendor

    console.log(vendor.name, 'Ratings:', vendorRatings);  // Debugging line
    console.log(vendor.name, 'Reviews:', vendorReviews); 
    // Count the occurrences of each rating (1-5 stars)
    const ratingCounts = [0, 0, 0, 0, 0];  // Initialize array to count stars (1-5 stars)
    vendorRatings.forEach(rating => {
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating - 1] += 1;  // Increment the appropriate star count
      }
    });

    // Calculate the average rating for the vendor
    const totalRating = vendorRatings.reduce((sum, rating) => sum + rating, 0);
    const averageRating = vendorRatings.length > 0 ? (totalRating / vendorRatings.length).toFixed(1) : 0;

    // Store vendor with their rating counts and average rating
    sortedVendors.push({
      name: vendor.name,
      ratingCounts: ratingCounts,
      averageRating: averageRating,
      ratingCount: vendorRatings.length,
      reviewsCount: vendorReviews.length,
    });
  }

  // Sort vendors by average rating (highest first)
  sortedVendors.sort((a, b) => b.averageRating - a.averageRating);

  // Display vendors in the highest-rated section
  const highestRatedElement = document.getElementById('highest-rated-vendor');
  highestRatedElement.innerHTML = '';  // Clear previous content

  // If there are vendors with ratings, display them in the list
  if (sortedVendors.length > 0) {
    sortedVendors.forEach(vendor => {
      // Construct the rating display
      const ratingDisplay = [
        `5 stars: ${vendor.ratingCounts[4]}`,
        `4 stars: ${vendor.ratingCounts[3]}`,
        `3 stars: ${vendor.ratingCounts[2]}`,
        `2 stars: ${vendor.ratingCounts[1]}`,
        `1 star: ${vendor.ratingCounts[0]}`
      ].join('<br>');  // Join with <br> to create line breaks for each rating

      // Construct the vendor info to display
      const vendorInfo = `${vendor.name}<br>${ratingDisplay}<br>Average Rating: ${vendor.averageRating} (${vendor.reviewsCount} reviews)`;

      const li = document.createElement('li');
      li.innerHTML = vendorInfo;  // Use innerHTML to allow HTML tags (like <br>) inside the list item
      highestRatedElement.appendChild(li);
    });
  } else {
    highestRatedElement.textContent = 'No ratings available.';
  }
}


function showContractManagement() {
  const vendors = JSON.parse(localStorage.getItem('vendors')) || {};
  
  // Clear previous content
  const vendorListDiv = document.getElementById('vendor-list-con');
  vendorListDiv.innerHTML = '';

  if (Object.keys(vendors).length === 0) {
      vendorListDiv.innerHTML = 'No vendors registered yet.';
      return;
  }

  // Create a table or list for displaying vendors and their services
  const table = document.createElement('table');
  table.innerHTML = `<thead><tr><th>Vendor ID</th><th>Vendor Name</th><th>Assign Service</th><th>Contract Date</th></tr></thead><tbody></tbody>`;
  const tbody = table.querySelector('tbody');
  
  Object.keys(vendors).forEach(vendorID => {
      const vendor = vendors[vendorID];

      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${vendorID}</td>
          <td>${vendor.name}</td>
          <td>
              <select id="service-${vendorID}">
                <option value="">Select a Service</option>
                <option value="catering">Catering</option>
                <option value="decoration">Decoration</option>
                <option value="lighting">Lighting</option>
                <option value="dj-party">DJ Party</option>
                <option value="stall">Stall</option>
                <option value="housekeeping">Housekeeping</option>
                <option value="room-service">Room Service</option>
                <option value="parking-service">Parking Service</option>
                <option value="others">Others</option> <!-- Option for custom service -->
              </select>
              <input type="text" id="custom-service-${vendorID}" placeholder="Specify custom service" style="display:none;">
          </td>
          <td><input type="date" id="contract-date-${vendorID}"></td>
      `;
      
      // Add event listener to show custom service input if "Others" is selected
      const serviceSelect = row.querySelector(`#service-${vendorID}`);
      const customServiceInput = row.querySelector(`#custom-service-${vendorID}`);

      serviceSelect.addEventListener('change', function () {
          if (this.value === 'others') {
              customServiceInput.style.display = 'block';
          } else {
              customServiceInput.style.display = 'none';
          }
      });

      tbody.appendChild(row);
  });

  vendorListDiv.appendChild(table);
  document.getElementById('contract-management-panel').style.display = 'block';
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'none';
}

// Save the contracts (assign service and contract date) to localStorage
function saveContracts() {
  const vendors = JSON.parse(localStorage.getItem('vendors')) || {};
  const services = JSON.parse(localStorage.getItem('services')) || {};
  
  let contractsUpdated = false;

  Object.keys(vendors).forEach(vendorID => {
      const serviceSelect = document.getElementById(`service-${vendorID}`);
      const customServiceInput = document.getElementById(`custom-service-${vendorID}`);
      const contractDate = document.getElementById(`contract-date-${vendorID}`).value;

      let service = serviceSelect.value;
      if (service === 'others') {
          service = customServiceInput.value;
      }

      if (!service || !contractDate) {
          document.getElementById('contract-form-error').textContent = 'Please fill in all fields for each vendor.';
          return;
      }

      // Save the assigned service and contract date
      vendors[vendorID].contract = { service, contractDate };

      // Update the services data
      if (!services[service]) services[service] = [];
      if (!services[service].includes(vendorID)) {
          services[service].push(vendorID);
      }

      contractsUpdated = true;
  });

  if (contractsUpdated) {
      localStorage.setItem('vendors', JSON.stringify(vendors));
      localStorage.setItem('services', JSON.stringify(services));
      alert('Contracts saved successfully!');
      document.getElementById('contract-form-error').textContent = '';
      showAdminPanel();
  }
}