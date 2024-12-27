const readline = require('readline-sync');

// Data structures for storing vendor, ratings, contracts, and collaborations
let vendors = {};  // { vendorID: {name, service, location} }
let services = {}; // { serviceType: [vendorIDs] }
let ratings = {};  // { vendorID: rating }
let contracts = {};  // { vendorID: [{ service, startDate, endDate }] }
let collaborations = {}; // { vendorID: [collaboratorIDs] }

// Admin credentials
const adminUsername = 'admin';
const adminPassword = 'admin123';

// Function to add a vendor
function registerVendor(id, name, service, location) {
  vendors[id] = { name, service, location };
  
  // Add vendor to the service category
  if (!services[service]) {
    services[service] = [];
  }
  services[service].push(id);
}

// Function to categorize vendors by service
function categorizeVendorByService(vendorID, serviceType) {
  if (!vendors[vendorID]) {
    console.log('Vendor not found!');
    return;
  }

  // Remove vendor from previous service if exists
  const oldService = vendors[vendorID].service;
  if (services[oldService]) {
    const index = services[oldService].indexOf(vendorID);
    if (index !== -1) services[oldService].splice(index, 1);
  }

  vendors[vendorID].service = serviceType;
  if (!services[serviceType]) services[serviceType] = [];
  services[serviceType].push(vendorID);
}

// Function to update vendor rating
function updateVendorRating(vendorID, rating) {
  if (!vendors[vendorID]) {
    console.log('Vendor not found!');
    return;
  }
  ratings[vendorID] = rating;
}

// Function to add a contract for a vendor
function addContract(vendorID, service, startDate, endDate) {
  if (!vendors[vendorID]) {
    console.log('Vendor not found!');
    return;
  }

  if (!contracts[vendorID]) {
    contracts[vendorID] = [];
  }

  contracts[vendorID].push({ service, startDate, endDate });
}

// Function to view vendor details by ID
function viewVendor(vendorID) {
  if (vendors[vendorID]) {
    console.log(vendors[vendorID]);
  } else {
    console.log('Vendor not found!');
  }
}

// Function to get all vendors by service type
function getVendorsByService(serviceType) {
  if (services[serviceType]) {
    services[serviceType].forEach(vendorID => {
      console.log(vendors[vendorID]);
    });
  } else {
    console.log('No vendors found for this service type!');
  }
}

// Function to find the highest rated vendor
function getHighestRatedVendor() {
  let highestRating = -1;
  let highestRatedVendor = null;

  for (let vendorID in ratings) {
    if (ratings[vendorID] > highestRating) {
      highestRating = ratings[vendorID];
      highestRatedVendor = vendors[vendorID];
    }
  }

  if (highestRatedVendor) {
    console.log('Highest Rated Vendor:', highestRatedVendor);
  } else {
    console.log('No ratings available!');
  }
}

// Function to view collaborators for a vendor
function getCollaborators(vendorID) {
  if (!collaborations[vendorID]) {
    console.log('No collaborations found for this vendor.');
    return;
  }

  collaborations[vendorID].forEach(collaboratorID => {
    console.log(vendors[collaboratorID]);
  });
}

// Function to add a collaboration between two vendors
function addCollaboration(vendorID1, vendorID2) {
  if (!collaborations[vendorID1]) collaborations[vendorID1] = [];
  if (!collaborations[vendorID2]) collaborations[vendorID2] = [];

  collaborations[vendorID1].push(vendorID2);
  collaborations[vendorID2].push(vendorID1);
}

// Admin authentication function
function authenticateAdmin() {
  const username = readline.question('Enter admin username: ');
  const password = readline.question('Enter admin password: ', { hideEchoBack: true });

  if (username === adminUsername && password === adminPassword) {
    console.log('Admin authenticated successfully!');
    return true;
  } else {
    console.log('Authentication failed!');
    return false;
  }
}

// CLI to interact with the system
function main() {
  const isAdmin = authenticateAdmin();
  if (!isAdmin) return;

  let running = true;
  while (running) {
    console.log('\n--- Vendor Management System ---');
    console.log('1. Add Vendor');
    console.log('2. Update Vendor Rating');
    console.log('3. View Vendor');
    console.log('4. Get Vendors by Service');
    console.log('5. View Highest Rated Vendor');
    console.log('6. Add Contract');
    console.log('7. Add Collaboration');
    console.log('8. View Collaborators');
    console.log('9. Exit');
    
    const choice = readline.question('Enter your choice: ');

    switch (choice) {
      case '1':
        const id = readline.question('Enter vendor ID: ');
        const name = readline.question('Enter vendor name: ');
        const service = readline.question('Enter service type: ');
        const location = readline.question('Enter vendor location: ');
        registerVendor(id, name, service, location);
        break;

      case '2':
        const vendorIDForRating = readline.question('Enter vendor ID: ');
        const rating = readline.question('Enter rating (1 to 5): ');
        updateVendorRating(vendorIDForRating, rating);
        break;

      case '3':
        const vendorIDForView = readline.question('Enter vendor ID to view: ');
        viewVendor(vendorIDForView);
        break;

      case '4':
        const serviceType = readline.question('Enter service type to get vendors: ');
        getVendorsByService(serviceType);
        break;

      case '5':
        getHighestRatedVendor();
        break;

      case '6':
        const vendorIDForContract = readline.question('Enter vendor ID for contract: ');
        const contractService = readline.question('Enter service type: ');
        const startDate = readline.question('Enter contract start date (YYYY-MM-DD): ');
        const endDate = readline.question('Enter contract end date (YYYY-MM-DD): ');
        addContract(vendorIDForContract, contractService, startDate, endDate);
        break;

      case '7':
        const vendorID1 = readline.question('Enter first vendor ID: ');
        const vendorID2 = readline.question('Enter second vendor ID: ');
        addCollaboration(vendorID1, vendorID2);
        break;

      case '8':
        const vendorIDForCollab = readline.question('Enter vendor ID to view collaborators: ');
        getCollaborators(vendorIDForCollab);
        break;

      case '9':
        console.log('Exiting...');
        running = false;
        break;

      default:
        console.log('Invalid choice, please try again.');
    }
  }
}

main();
