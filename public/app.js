const API_URL = 'http://localhost:5000/users'; // Backend API URL

let isEditMode = false; // Track if we are in edit mode

// Fetch all users and display them in the table
async function fetchUsers() {
  const response = await fetch(API_URL);
  const users = await response.json();
  
  const userList = document.getElementById('userList');
  userList.innerHTML = ''; // Clear existing rows

  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.age}</td>
      <td>
        <button onclick="editUser('${user._id}')">Edit</button>
        <button onclick="deleteUser('${user._id}')">Delete</button>
      </td>
    `;
    userList.appendChild(row);
  });
}

// Create or update a user
document.getElementById('createUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const age = document.getElementById('age').value;

  if (isEditMode) {
    // If in edit mode, update the user
    const userId = document.getElementById('userId').value;
    const response = await fetch(`${API_URL}/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, age })
    });

    if (response.ok) {
      alert('User updated successfully!');
      fetchUsers(); // Refresh user list
      resetForm(); // Reset form
    } else {
      alert('Error updating user.');
    }
  } else {
    // Create a new user
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, age })
    });

    if (response.ok) {
      alert('User created successfully!');
      fetchUsers(); // Refresh user list
      resetForm(); // Reset form
    } else {
      alert('Error creating user.');
    }
  }
});

// Reset form and switch to add new user mode
function resetForm() {
  document.getElementById('createUserForm').reset();
  isEditMode = false;
  document.getElementById('userId').value = ''; // Clear hidden userId field
}

// Edit user by ID
async function editUser(userId) {
  // Fetch user data by ID
  const response = await fetch(`${API_URL}/${userId}`);
  const user = await response.json();
  
  // Populate the form with the user's current details
  document.getElementById('name').value = user.name;
  document.getElementById('email').value = user.email;
  document.getElementById('age').value = user.age;
  
  // Set hidden userId field
  document.getElementById('userId').value = user._id;

  // Switch to edit mode
  isEditMode = true;
}

// Delete a user
async function deleteUser(userId) {
  const response = await fetch(`${API_URL}/${userId}`, { method: 'DELETE' });

  if (response.ok) {
    alert('User deleted successfully!');
    fetchUsers(); // Refresh user list
  } else {
    alert('Error deleting user.');
  }
}

// Initial fetch when page loads
window.onload = fetchUsers;
