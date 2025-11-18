const API_BASE_URL = 'http://localhost:3000/api';
function updateUI() {

    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    

    document.getElementById('auth-section').style.display = token ? 'none' : 'block';
    document.getElementById('admin-panel').style.display = token ? 'block' : 'none';
    
    if (token) {
        document.getElementById('current-user').textContent = username;
        loadCategories();
        loadItems();
    }
}

// Log in 
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const authMessage = document.getElementById('auth-message');
    authMessage.textContent = '...'; 

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', username);
            authMessage.textContent = 'Login successful!';
            updateUI();
        } else {
            authMessage.textContent = data.message || 'Login error.';
        }

    } catch (error) {
        authMessage.textContent = 'Server connection error.';
        console.error('Login error:', error);
    }
});
// Log out
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    updateUI();
});

// Categories table loading
async function loadCategories() {
    const tableBody = document.getElementById('categories-table-body');
    tableBody.innerHTML = `<tr>
                 <td></td>
                 <td colspan="2">Loading categories...</td>
                 <td></td>
                 </tr>`;

    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const categories = await response.json();

        if (response.ok) {
            tableBody.innerHTML = '';

            if (categories.length === 0) {
                  tableBody.innerHTML = `<tr>
                 <td></td>
                 <td colspan="2">No categories found. Create one below.</td>
                 <td></td>
                 </tr>`;
                 return;
            }

            categories.forEach(cat => {
                const row = document.createElement('tr');
                row.dataset.id = cat.id;
                row.innerHTML = `
                    <td>${cat.id}</td>
                    <td class="category-name-cell" data-name="${cat.name}">${cat.name}</td>
                    <td class="category-order-cell" data-order-index="${cat.orderIndex}">${cat.orderIndex}</td>
                    <td>
                        <button class="edit-btn" data-id="${cat.id}">Edit</button>
                        <button class="save-btn hidden" data-id="${cat.id}">Save</button> 
                        <button class="delete-btn" data-id="${cat.id}" data-name="${cat.name}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
            attachActionListeners();

        } else {
            tableBody.innerHTML = `<tr>
                 <td></td>
                 <td colspan="2">Failed to load categories.</td>
                 <td></td>
                 </tr>`;
        }

    } catch (error) {
        tableBody.innerHTML = `<tr>
                 <td></td>
                 <td colspan="2">Server connection error during fetch.</td>
                 <td></td>
                 </tr>`;
        console.error('Load categories error:', error);
    }
};
// Content items table loading
async function loadItems() {
    const tableBody = document.getElementById('item-table-body');
    tableBody.innerHTML = `<tr>
                 <td></td>
                 <td colspan="5">No content items found. Create one below.</td>
                 <td></td>
                 </tr>`;

    try {
        const response = await fetch(`${API_BASE_URL}/items`);
        const items = await response.json();

        if (response.ok) {
            tableBody.innerHTML = '';

            if (items.length === 0) {
                 tableBody.innerHTML = `<tr>
                 <td></td>
                 <td colspan="5">No content items found. Create one below.</td>
                 <td></td>
                 </tr>`;
                 return;
            }

            items.forEach(item => {
                const row = document.createElement('tr');
                row.dataset.id = item.id;
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td class="item-category-id-cell" data-category-id="${item.categoryId}">${item.categoryId}</td>
                    <td class="item-title-cell" data-title="${item.title}">${item.title}</td>
                    <td class="item-description-cell" data-description="${item.description}">${item.description}</td>
                    <td class="item-price-cell" data-price="${item.price}">${item.price}</td>
                    <td class="item-image-url-cell" data-image-url="${item.imageUrl}">${item.imageUrl}</td>
                    <td>
                        <button class="edit-btn" data-id="${item.id}">Edit</button>
                        <button class="save-btn hidden" data-id="${item.id}">Save</button> 
                        <button class="delete-btn" data-id="${item.id}" data-title="${item.title}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
           attachActionListeners();

        } else {
            tableBody.innerHTML = `<tr>
                 <td></td>
                 <td colspan="5">Failed to load content items.</td>
                 <td></td>
                 </tr>`;
        }

    } catch (error) {
        tableBody.innerHTML = `<tr>
                 <td></td>
                 <td colspan="5">Server connection error during fetch.</td>
                 <td></td>
                 </tr>`;
        console.error('Load content items error:', error);
    }
};


// Category creation field
document.getElementById('create-category-btn').addEventListener('click', async () => {
        const nameInput = document.getElementById('category-name-new');
        const orderIndexInput = document.getElementById('category-order-index-new');
        
        const name = nameInput.value.trim();
        const orderIndex = parseInt(orderIndexInput.value) || 0; 
        
        if (!name) {
           console.error('Error: Category name cannot be empty.');
            return;
        }
        

        const authToken = localStorage.getItem('authToken');

        try {
            const response = await fetch(`${API_BASE_URL}/categories`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` 
                },
                body: JSON.stringify({ name, orderIndex }) 
            });

            const data = await response.json();

            if (response.ok) {
                console.log(`Category "${data.name}" successfully created!`);
                nameInput.value = '';
                orderIndexInput.value = '0';
                loadCategories();
            } else if (response.status === 401 || response.status === 403) {
                console.log('Session expired. Please log in again.');
                localStorage.removeItem('authToken');
                updateUI(); 
            } else {
                const errorMsg = data.errors ? data.errors[0].msg : data.message;
                console.error(`Error: ${errorMsg}`);
            }
        } catch (error) {
            console.error('Create category error:', error);
        }
    });

// Content Items creation field
document.getElementById('create-item-btn').addEventListener('click', async () => {
        const categoryIdInput = document.getElementById('item-category-id-new');
        const titleInput = document.getElementById('item-title-new');
        const descriptionInput = document.getElementById('item-desc-new');
        const priceInput = document.getElementById('item-price-new');
        const imageUrlInput = document.getElementById('item-img-new');
        
        const categoryId = parseInt(categoryIdInput.value);
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const price = parseFloat(priceInput.value) || 0;
        const imageUrl = imageUrlInput.value.trim();
        if (!title || !categoryId) {
           console.error('Error: Content Item title or category Id cannot be empty.');
            return;
        }
        
        const authToken = localStorage.getItem('authToken');

        try {
            const response = await fetch(`${API_BASE_URL}/items`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` 
                },
                body: JSON.stringify({ title, description, price, imageUrl, categoryId}) 
            });

            const data = await response.json();

            if (response.ok) {
                console.log(`Content item with a name "${data.title}" successfully created!`);
                categoryIdInput.value = '0';
                titleInput.value = '';
                descriptionInput.value = '';
                priceInput.value = '0';
                imageUrlInput.value = '';
                loadItems();
            } else if (response.status === 401 || response.status === 403) {
                console.log('Session expired. Please log in again.');
                localStorage.removeItem('authToken');
                updateUI(); 
            } else {
                const errorMsg = data.errors ? data.errors[0].msg : data.message;
                console.error(`Error: ${errorMsg}`);
            }
        } catch (error) {
            console.error('Create content item error:', error);
        }
    });


// Action listeners for dynamic objects of category table
function attachActionListeners() {

    const categoryPanel = document.getElementById('category-panel'); 
    const itemPanel = document.getElementById('item-panel');


    categoryPanel.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const name = e.target.dataset.name;
            if (confirm(`Are you sure you want to delete category "${name}" (ID: ${id})?`)) {
                handleCategoryDelete(id);
            }
        });
    });
    categoryPanel.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            toggleCategoryEditMode(id, true); 
        });
    });
    categoryPanel.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            handleCategoryUpdate(id); 
        });
    });

    itemPanel.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const title = e.target.dataset.title;
            if (confirm(`Are you sure you want to delete the item "${title}" (ID: ${id})?`)) {
                handleItemDelete(id);
            }
        });
    });
    itemPanel.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
           toggleItemEditMode(id, true); 
        });
    });
    itemPanel.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
           handleItemUpdate(id); 
        });
    });
    
};

// Delete for categories
async function handleCategoryDelete(id) {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert('Session expired. Please log in.');
        updateUI();
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (response.ok) {
            console.log(`Category ID ${id} deleted successfully.`);
            loadCategories(); 
        } else if (response.status === 404) {
             alert(`Error: Category with ID ${id} not found.`);
        } else if (response.status === 401 || response.status === 403) {
            alert('Access denied or session expired.');
            localStorage.removeItem('authToken');
            updateUI(); 
        } else {
            const data = await response.json();
            alert(`Deletion Error: ${data.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('API connection error during deletion.');
    }
};
// Delete for content items
async function handleItemDelete(id) {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert('Session expired. Please log in.');
        updateUI();
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (response.ok) {
            console.log(`Content Item ID ${id} deleted successfully.`);
            loadItems(); 
        } else if (response.status === 404) {
             alert(`Error: Content Item with ID ${id} not found.`);
        } else if (response.status === 401 || response.status === 403) {
            alert('Access denied or session expired.');
            localStorage.removeItem('authToken');
            updateUI(); 
        } else {
            const data = await response.json();
            alert(`Deletion Error: ${data.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('API connection error during deletion.');
    }
};

// Turning on/off category edit mode with buttons
function toggleCategoryEditMode(rowId, isEditing){
    const row = document.querySelector(`tr[data-id="${rowId}"]`);
    if (!row) return;
    const nameCell = row.querySelector('.category-name-cell');
    const orderCell = row.querySelector('.category-order-cell');
    const editBtn = row.querySelector('.edit-btn');
    const saveBtn = row.querySelector('.save-btn');
    if (isEditing){
        const currentName = nameCell.dataset.name;
        const currentOrder = orderCell.dataset.orderIndex;
        
        nameCell.innerHTML = `<input type="text" value="${currentName}" id="edit-name-${rowId}">`;
        orderCell.innerHTML = `<input type="number" value="${currentOrder}" id="edit-order-${rowId}" style="width: 80px;">`;
        
        editBtn.classList.add('hidden');
        saveBtn.classList.remove('hidden');
    }
    else {
        const newName = row.querySelector(`#edit-name-${rowId}`).value;
        const newOrder = row.querySelector(`#edit-order-${rowId}`).value;

        nameCell.dataset.name = newName;
        orderCell.dataset.orderIndex = newOrder;

        nameCell.textContent = newName;
        orderCell.textContent = newOrder;

        editBtn.classList.remove('hidden');
        saveBtn.classList.add('hidden');
    }   
}

// Turning on/off item edit mode with buttons
function toggleItemEditMode(rowId, isEditing){
    const row = document.querySelector(`tr[data-id="${rowId}"]`);
    if (!row) return;
    const categoryIdCell = row.querySelector('.item-category-id-cell');
    const titleCell = row.querySelector('.item-title-cell');
    const descriptionCell = row.querySelector('.item-description-cell');
    const priceCell = row.querySelector('.item-price-cell');
    const imageUrlCell = row.querySelector('.item-image-url-cell');
    const editBtn = row.querySelector('.edit-btn');
    const saveBtn = row.querySelector('.save-btn');
    console.log(categoryIdCell);
    if (isEditing){
        const currentCategoryId = categoryIdCell.dataset.categoryId;
        const currentTitle = titleCell.dataset.title;
        const currentDescription = descriptionCell.dataset.description;
        const currentPrice = priceCell.dataset.price;
        const currentImageUrl = imageUrlCell.dataset.imageUrl;
        
        categoryIdCell.innerHTML = `<input type="number" value="${currentCategoryId}" id="edit-categoryId-${rowId}" style="width: 80px;">`;
        titleCell.innerHTML = `<input type="text" value="${currentTitle}" id="edit-title-${rowId}">`;
        descriptionCell.innerHTML = `<input type="text" value="${currentDescription}" id="edit-description-${rowId}">`;
        priceCell.innerHTML = `<input type="number" value="${currentPrice}" id="edit-price-${rowId}" style="width: 80px;">`;
        imageUrlCell.innerHTML = `<input type="url" value="${currentImageUrl}" id="edit-imageUrl-${rowId}">`;
        
        editBtn.classList.add('hidden');
        saveBtn.classList.remove('hidden');
    }
    else {
        const newCategoryId = row.querySelector(`#edit-categoryId-${rowId}`).value;
        const newTitle = row.querySelector(`#edit-title-${rowId}`).value;
        const newDescription = row.querySelector(`#edit-description-${rowId}`).value;
        const newPrice = row.querySelector(`#edit-price-${rowId}`).value;
        const newImageUrl = row.querySelector(`#edit-imageUrl-${rowId}`).value;

        categoryIdCell.dataset.categoryId = newCategoryId;
        titleCell.dataset.title = newTitle;
        descriptionCell.dataset.description = newDescription;
        priceCell.dataset.price = newPrice;
        imageUrlCell.dataset.imageUrl = newImageUrl;

        categoryIdCell.textContent = newCategoryId;
        titleCell.textContent = newTitle;
        descriptionCell.textContent = newDescription;
        priceCell.textContent = newPrice;
        imageUrlCell.textContent = newImageUrl;

        editBtn.classList.remove('hidden');
        saveBtn.classList.add('hidden');
    }   
}
// Update for categories
async function handleCategoryUpdate(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    const nameInput = row.querySelector(`#edit-name-${id}`);
    const orderInput = row.querySelector(`#edit-order-${id}`);
    
    const name = nameInput.value.trim();
    const orderIndex = parseInt(orderInput.value) || 0; 
    
    if (!name) {
        alert('Category name cannot be empty.');
        return;
    }

    const authToken = localStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` 
            },
            body: JSON.stringify({ name, orderIndex })
        });

        if (response.ok) {
            console.log(`Category ID ${id} updated successfully.`);
            toggleCategoryEditMode(id, false); 
        } else {
            const data = await response.json();
            alert(`Update Error: ${data.message || 'Unknown error'}`);
            toggleCategoryEditMode(id, false); 
        }

    } catch (error) {
        console.error('Update error:', error);
        alert('API connection error during update.');
    }
};

// Update for content items
async function handleItemUpdate(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    const categoryIdInput = row.querySelector(`#edit-categoryId-${id}`);
    const titleInput = row.querySelector(`#edit-title-${id}`);
    const descriptionInput = row.querySelector(`#edit-description-${id}`);
    const priceInput = row.querySelector(`#edit-price-${id}`);
    const imageUrlInput = row.querySelector(`#edit-imageUrl-${id}`);
    const nameInput = row.querySelector(`#edit-name-${id}`);
    const orderInput = row.querySelector(`#edit-order-${id}`);
    

    const categoryId = parseInt(categoryIdInput.value);
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const price = parseFloat(priceInput.value) || 0;
    const imageUrl = imageUrlInput.value.trim();
    
        if (!title || !categoryId) {
           console.error('Error: Content Item title or category Id cannot be empty.');
            return;
        }

    const authToken = localStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` 
            },
            body: JSON.stringify({ title, description, price, imageUrl, categoryId})
        });

        if (response.ok) {
            console.log(`Content Item ID ${id} updated successfully.`);
            toggleItemEditMode(id, false); 
        } else {
            const data = await response.json();
            alert(`Update Error: ${data.message || 'Unknown error'}`);
            toggleItemEditMode(id, false); 
        }

    } catch (error) {
        console.error('Update error:', error);
        alert('API connection error during update.');
    }
};

//Processing table buttons
document.getElementById('category-btn').addEventListener('click', () => {
    const categoriesPanel = document.querySelector('#category-panel');
    const ItemsPanel = document.querySelector('#item-panel');

    categoriesPanel.classList.remove('hidden');
    ItemsPanel.classList.add('hidden');
    
});
document.getElementById('item-btn').addEventListener('click', () => {
    const categoriesPanel = document.querySelector('#category-panel');
    const ItemsPanel = document.querySelector('#item-panel');

    categoriesPanel.classList.add('hidden');
    ItemsPanel.classList.remove('hidden');
    
});
        

updateUI();

