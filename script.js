// Global variable to track if we are editing or creating a new user
let isEditMode = false;

// Fetch all users and display them
async function fetchUsers() {
  const response = await fetch('http://localhost:5000/users');
  const users = await response.json();
  
  const userTable = document.getElementById('userList');
  
  // Clear existing table rows
  userTable.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Age</th>
      <th>Actions</th>
    </tr>
  `;
  
  // Add rows to the table for each user
  users.forEach(user => {
    const row = userTable.insertRow();
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.age}</td>
      <td>
        <button onclick="editUser('${user._id}')">Edit</button>
        <button onclick="deleteUser('${user._id}')">Delete</button>
      </td>
    `;
  });
}

// Edit user by ID
async function editUser(userId) {
  const response = await fetch(`http://localhost:5000/users/${userId}`);
  const user = await response.json();

  // Populate the form with the user's current details
  document.getElementById('name').value = user.name;
  document.getElementById('email').value = user.email;
  document.getElementById('age').value = user.age;
  
  // Set the hidden userId field
  document.getElementById('userId').value = user._id;
  
  // Change the form action to update the user
  isEditMode = true;
}

// Delete user by ID
async function deleteUser(userId) {
  const confirmDelete = confirm('Are you sure you want to delete this user?');
  if (confirmDelete) {
    try {
      const res = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('User deleted');
        fetchUsers();  // Refresh user list
      } else {
        alert('Error deleting user');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    }
  }
}

// Create or Update user
document.getElementById('createUserForm').onsubmit = async (e) => {
  e.preventDefault();
  
  const userId = document.getElementById('userId').value; // Get userId for editing
  const newUser = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    age: document.getElementById('age').value,
  };

  try {
    if (isEditMode && userId) {
      // If we are editing, perform PUT request to update the user
      const res = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        alert('User updated!');
        fetchUsers();  // Refresh user list
      } else {
        alert('Error updating user');
      }
    } else {
      // If not editing, create a new user
      const res = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        alert('User created!');
        fetchUsers();  // Refresh user list
      } else {
        alert('Error creating user');
      }
    }

    // Reset form and switch to create mode
    document.getElementById('createUserForm').reset();
    document.getElementById('userId').value = '';  // Clear userId
    isEditMode = false; // Reset to create mode
  } catch (err) {
    console.error(err);
    alert('Error saving user');
  }
};

// Initial fetch when page loads
window.onload = fetchUsers;
