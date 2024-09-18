let products = []; // Array to store product data

// Load products from localStorage when the page loads
window.addEventListener('load', function() {
    products = loadProductsFromLocalStorage();
    displayProducts();
});

document.getElementById('openFormButton').addEventListener('click', function() {
    document.getElementById('modal').classList.add('show');
    document.getElementById('formTitle').textContent = 'Внеси нов продукт';
    document.getElementById('productForm').reset();
    document.getElementById('editIndex').value = '';
    document.getElementById('removeButton').style.display = 'none'; // Hide remove button for new products
});

document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('modal').classList.remove('show');
});

document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const imageInput = document.getElementById('imageInput').files[0];
    const editIndex = document.getElementById('editIndex').value;

    const image = imageInput ? URL.createObjectURL(imageInput) : '';

    if (editIndex === '') {
        // Add new product
        addProduct(title, quantity, price, image);
    } else {
        // Edit existing product
        updateProduct(editIndex, title, quantity, price, image);
    }

    // Clear form fields and hide form
    document.getElementById('modal').classList.remove('show');
});

document.getElementById('removeButton').addEventListener('click', function() {
    const index = document.getElementById('editIndex').value;
    if (index !== '') {
        removeProduct(index);
    }
});

function addProduct(title, quantity, price, image) {
    const productList = document.getElementById('productList');
    
    const productItem = document.createElement('div');
    productItem.className = 'product-item';
    
    const index = products.length;
    products.push({ title, quantity, price, image });
    
    productItem.innerHTML = `
        <img src="${image}" alt="${title}">
        <div class="details">
            <span><strong>Назив на продукт:</strong> ${title}</span>
            <span><strong>Бројки:</strong> ${quantity}</span>
            <span><strong>Цена:</strong> ${price}</span>
        </div>
        <button class="edit-button" data-index="${index}">Измени</button>
    `;

    productList.appendChild(productItem);

    saveProductsToLocalStorage(); // Save products to local storage
}

function updateProduct(index, title, quantity, price, image) {
    const productList = document.getElementById('productList');
    const productItem = productList.querySelector(`.edit-button[data-index="${index}"]`).closest('.product-item');
    
    products[index] = { title, quantity, price, image };

    productItem.innerHTML = `
        <img src="${image}" alt="${title}">
        <div class="details">
            <span><strong>Продукт:</strong> ${title}</span>
            <span><strong>Бројки:</strong> ${quantity}</span>
            <span><strong>Цена:</strong> денари${price}</span>
        </div>
        <button class="edit-button" data-index="${index}">Edit</button>
    `;

    saveProductsToLocalStorage(); // Save products to local storage
}

function removeProduct(index) {
    products.splice(index, 1); // Remove the product from the array
    
    const productList = document.getElementById('productList');
    const productItem = productList.querySelector(`.edit-button[data-index="${index}"]`).closest('.product-item');
    
    productList.removeChild(productItem); // Remove the product from the DOM

    // Hide the modal
    document.getElementById('modal').classList.remove('show');
    
    // Update indices for remaining products
    document.querySelectorAll('.edit-button').forEach((button, i) => {
        button.setAttribute('data-index', i);
    });

    saveProductsToLocalStorage(); // Save products to local storage
}

function saveProductsToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

function loadProductsFromLocalStorage() {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
}

function displayProducts() {
    const productList = document.getElementById('productList');
    products.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="details">
                <span><strong>Назив на продукт:</strong> ${product.title}</span>
                <span><strong>Бројки:</strong> ${product.quantity}</span>
                <span><strong>Цена:</strong> $${product.price}</span>
            </div>
            <button class="edit-button" data-index="${index}">Измени</button>
        `;

        productList.appendChild(productItem);
    });
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-button')) {
        const index = event.target.getAttribute('data-index');
        const product = products[index];

        document.getElementById('title').value = product.title;
        document.getElementById('quantity').value = product.quantity;
        document.getElementById('price').value = product.price;
        document.getElementById('editIndex').value = index;
        
        document.getElementById('modal').classList.add('show');
        document.getElementById('formTitle').textContent = 'Edit Product';
        document.getElementById('removeButton').style.display = 'block'; // Show remove button when editing
    }
});
