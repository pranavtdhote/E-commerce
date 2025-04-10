// Assume we're using a simple userId for demonstration (in reality, you'd get this from authentication)
const userId = 'user123'; // This should come from your authentication system

// DOM Elements
const cartProductsEl = document.getElementById('cart-products');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartTotalEl = document.getElementById('cart-total');
const proceedBtn = document.getElementById('proceed-btn');
const backToCartBtn = document.getElementById('back-to-cart-btn');
const placeOrderBtn = document.getElementById('place-order-btn');
const cartSection = document.getElementById('cart');
const cartAddSection = document.getElementById('cart-add');
const checkoutFormSection = document.getElementById('checkout-form');
const orderConfirmationSection = document.getElementById('order-confirmation');
const confirmationEmailEl = document.getElementById('confirmation-email');
const orderNumberEl = document.getElementById('order-number');

// Load cart from backend
async function loadCart() {
    try {
        const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
        const cart = await response.json();

        if (cart.items.length === 0) {
            cartProductsEl.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 30px;">
                        <p>Your cart is empty</p>
                        <button class="normal" onclick="window.location.href='shop.html'" style="margin-top: 20px;">
                            Continue Shopping
                        </button>
                    </td>
                </tr>
            `;
            proceedBtn.disabled = true;
            proceedBtn.classList.add('disabled');
            updateCartTotals(0);
            return;
        }

        let cartHtml = '';
        let subtotal = 0;

        cart.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            cartHtml += `
                <tr>
                    <td><a href="#" class="remove-item" data-id="${item.productId}"><i class="far fa-times-circle"></i></a></td>
                    <td><img src="${item.image}" alt="${item.name}"></td>
                    <td>${item.name}</td>
                    <td>$${item.price}</td>
                    <td>
                        <div class="quantity-selector">
                            <button class="qty-btn minus" data-id="${item.productId}">-</button>
                            <input type="number" value="${item.quantity}" min="1" class="qty-input" data-id="${item.productId}">
                            <button class="qty-btn plus" data-id="${item.productId}">+</button>
                        </div>
                    </td>
                    <td>$${itemTotal.toFixed(2)}</td>
                </tr>
            `;
        });

        cartProductsEl.innerHTML = cartHtml;
        updateCartTotals(subtotal);
        addQuantityListeners();
        addRemoveItemListeners();
    } catch (err) {
        console.error('Error loading cart:', err);
    }
}

// Update cart totals
function updateCartTotals(subtotal) {
    cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    cartTotalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// Add event listeners to quantity selectors
function addQuantityListeners() {
    document.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', async function() {
            const id = this.dataset.id;
            const input = document.querySelector(`.qty-input[data-id="${id}"]`);
            const currentValue = parseInt(input.value);

            if (currentValue > 1) {
                input.value = currentValue - 1;
                await updateItemQuantity(id, currentValue - 1);
            }
        });
    });

    document.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', async function() {
            const id = this.dataset.id;
            const input = document.querySelector(`.qty-input[data-id="${id}"]`);
            const currentValue = parseInt(input.value);

            input.value = currentValue + 1;
            await updateItemQuantity(id, currentValue + 1);
        });
    });

    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', async function() {
            const id = this.dataset.id;
            const value = parseInt(this.value);

            if (value < 1) {
                this.value = 1;
                await updateItemQuantity(id, 1);
            } else {
                await updateItemQuantity(id, value);
            }
        });
    });
}

// Add event listeners to remove item buttons
function addRemoveItemListeners() {
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.preventDefault();
            const id = this.dataset.id;
            await removeItemFromCart(id);
        });
    });
}

// Update item quantity in cart
async function updateItemQuantity(productId, quantity) {
    try {
        const response = await fetch(`http://localhost:5000/api/cart/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity }),
        });
        const updatedCart = await response.json();
        loadCart(); // Reload cart to reflect changes
    } catch (err) {
        console.error('Error updating quantity:', err);
    }
}

// Remove item from cart
async function removeItemFromCart(productId) {
    try {
        await fetch(`http://localhost:5000/api/cart/${userId}/${productId}`, {
            method: 'DELETE',
        });
        loadCart(); // Reload cart to reflect changes
    } catch (err) {
        console.error('Error removing item:', err);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    loadCart();

    proceedBtn.addEventListener('click', function() {
        cartSection.style.display = 'none';
        cartAddSection.style.display = 'none';
        checkoutFormSection.style.display = 'block';
        window.scrollTo({ top: document.querySelector('#page-header').offsetTop, behavior: 'smooth' });
    });

    backToCartBtn.addEventListener('click', function() {
        checkoutFormSection.style.display = 'none';
        cartSection.style.display = 'block';
        cartAddSection.style.display = 'flex';
        window.scrollTo({ top: document.querySelector('#page-header').offsetTop, behavior: 'smooth' });
    });

    placeOrderBtn.addEventListener('click', async function() {
        const shippingForm = document.getElementById('shipping-form');
        const paymentForm = document.getElementById('payment-form');

        if (!shippingForm.checkValidity() || !paymentForm.checkValidity()) {
            alert('Please fill in all required fields');
            return;
        }

        const shipping = {
            fullName: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipcode: document.getElementById('zipcode').value,
            country: document.getElementById('country').value,
        };

        const payment = {
            cardName: document.getElementById('cardname').value,
            cardNumber: document.getElementById('cardnumber').value,
            expiry: document.getElementById('expiry').value,
            cvv: document.getElementById('cvv').value,
        };

        try {
            const response = await fetch(`http://localhost:5000/api/orders/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shipping, payment }),
            });
            const order = await response.json();

            checkoutFormSection.style.display = 'none';
            orderConfirmationSection.style.display = 'block';
            orderNumberEl.textContent = order.orderNumber;
            confirmationEmailEl.textContent = shipping.email;
            window.scrollTo({ top: document.querySelector('#page-header').offsetTop, behavior: 'smooth' });
        } catch (err) {
            console.error('Error placing order:', err);
            alert('Failed to place order');
        }
    });
});