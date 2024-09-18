let products = JSON.parse(localStorage.getItem('products')) || []; // Retrieve products from local storage or initialize empty array

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDQtwtfReF61LZ0u9Ca2C4zGUytE1eor_Y",
    authDomain: "smikifashionshows.firebaseapp.com",
    projectId: "smikifashionshows",
    storageBucket: "smikifashionshows.appspot.com",
    messagingSenderId: "523756063718",
    appId: "1:523756063718:web:4698ef88e6adc244bf6427",
    measurementId: "G-VJ3V6BC6YE"
};

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

// Reference to Firebase database
const db = firebase.database();

// Function to save products to local storage
function saveProductsToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Function to sync products to Firebase
function syncProductsToFirebase() {
    const updates = {};
    products.forEach((product, index) => {
        const newProductKey = db.ref().child('products').push().key;
        updates[`/products/${newProductKey}`] = product;
    });
    db.ref().update(updates);
}

// Load products from Firebase when page loads
function loadProductsFromFirebase() {
    db.ref('/products').on('value', (snapshot) => {
        const productList = document.getElementById('productList');
        productList.innerHTML = ''; // Clear existing list
        products = [];

        const data = snapshot.val();
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                const product = data[key];
                products.push(product); // Push each product to the array
                
                // Display the product on the page
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <div class="details">
                        <span><strong>Title:</strong> ${product.title}</span>
                        <span><strong>Quantity:</strong> ${product.quantity}</span>
                        <span><strong>Price:</strong> $${product.price}</span>
                    </div>
                    <button class="edit-button" data-index="${products.length - 1}">Измени</button>
                `;
                productList.appendChild(productItem);
            }
        }
        saveProductsToLocalStorage(); // Save to local storage as well
    });
}

// Load products from local storage if Firebase is unavailable
function loadProductsFromLocalStorage() {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Clear existing list
    products.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="details">
                <span><strong>Title:</strong> ${product.title}</span>
                <span><strong>Quantity:</strong> ${product.quantity}</span>
                <span><strong>Price:</strong> $${product.price}</span>
            </div>
            <button class="edit-button" data-index="${index}">Измени</button>
        `;
        productList.appendChild(productItem);
    });
}

// When the page loads, display products
window.onload = function() {
    loadProductsFromFirebase(); // Load from Firebase first
};

// Add product
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

    // Save to local storage and Firebase
    saveProductsToLocalStorage();
    syncProductsToFirebase();
    loadProductsFromFirebase(); // Refresh list from Firebase

    // Clear form fields and hide form
    document.getElementById('modal').classList.remove('show');
});

// Remove product
document.getElementById('removeButton').addEventListener('click', function() {
    const index = document.getElementById('editIndex').value;
    if (index !== '') {
        removeProduct(index);
    }
});

function addProduct(title, quantity, price, image) {
    products.push({ title, quantity, price, image });
    
    saveProductsToLocalStorage(); // Save updated products to local storage
    syncProductsToFirebase(); // Sync products with Firebase
}

function updateProduct(index, title, quantity, price, image) {
    products[index] = { title, quantity, price, image };

    saveProductsToLocalStorage(); // Save updated products to local storage
    syncProductsToFirebase(); // Sync products with Firebase
}

function removeProduct(index) {
    products.splice(index, 1); // Remove the product from the array

    saveProductsToLocalStorage(); // Save updated products to local storage
    syncProductsToFirebase(); // Sync products with Firebase
    loadProductsFromFirebase(); // Refresh product list from Firebase
}

// Edit button click event
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


{
    "rules": {
      ".read": true,
      ".write": true
    }
  }
  