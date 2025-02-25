document.addEventListener('DOMContentLoaded', function () {
    loadEvents();
    updateCartCount();
});

let cart = JSON.parse(localStorage.getItem('cart')) || {};

function saveEvent() {
    let name = document.getElementById('eventName').value.trim();
    let goal = document.getElementById('eventGoal').value.trim();
    let imageInput = document.getElementById('eventImage');

    if (name === '' || goal === '' || isNaN(goal) || goal <= 0) {
        alert('Isi semua kolom dengan benar!');
        return;
    }

    if (imageInput.files.length === 0) {
        alert('Pilih gambar untuk event!');
        return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(imageInput.files[0]);
    reader.onload = function () {
        let imageBase64 = reader.result;
        let events = JSON.parse(localStorage.getItem('events')) || [];
        events.push({ name: name, goal: goal, image: imageBase64 });
        localStorage.setItem('events', JSON.stringify(events));

        document.getElementById('eventName').value = '';
        document.getElementById('eventGoal').value = '';
        document.getElementById('eventImage').value = '';

        loadEvents();
    };
}

function loadEvents() {
    let container = document.getElementById('eventContainer');
    container.innerHTML = '';

    let events = JSON.parse(localStorage.getItem('events')) || [];

    events.forEach((event, index) => {
        let count = cart[index] || 0;

        let newEvent = document.createElement('div');
        newEvent.className = `col-lg-4 col-md-6 col-sm-12`;
        newEvent.innerHTML = `
            <div class="card shadow-sm">
                <img src="${event.image}" class="card-img-top" alt="Event">
                <div class="card-body">
                    <h5 class="card-title">${event.name}</h5>
                    <p class="text-muted">Harga: Rp ${event.goal}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-danger btn-sm" onclick="updateCart(${index}, -1)">-</button>
                        <span id="cartCount-${index}" class="fw-bold">${count}</span>
                        <button class="btn btn-success btn-sm" onclick="updateCart(${index}, 1)">+</button>
                    </div>
                    <button class="btn btn-dark btn-sm mt-2 w-100" onclick="deleteEvent(${index})">🗑 Hapus</button>
                </div>
            </div>`;
        container.appendChild(newEvent);
    });
}

function updateCart(index, change) {
    if (!cart[index]) {
        cart[index] = 0;
    }

    cart[index] += change;

    if (cart[index] <= 0) {
        delete cart[index];
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadEvents();
}

function buyAll() {
    let events = JSON.parse(localStorage.getItem('events')) || [];

    if (Object.keys(cart).length === 0) {
        alert("Keranjang masih kosong.");
        return;
    }

    let purchasedItems = Object.keys(cart).map(index => 
        `${events[index].name} x${cart[index]} - Rp ${events[index].goal * cart[index]}`
    ).join("%0A");
    
    let waMessage = `Halo, saya ingin membeli event berikut:%0A%0A${purchasedItems}%0A%0ATerima kasih!`;
    let waNumber = "6285372736144";
    let waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

    window.open(waLink, "_blank");

    cart = {}; 
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadEvents();
}

function deleteEvent(index) {
    let password = prompt("Masukkan password untuk menghapus event:");
    
    if (password !== "4718") {
        alert("Password salah! Event tidak dihapus.");
        return;
    }

    let events = JSON.parse(localStorage.getItem('events')) || [];

    if (confirm(`Yakin ingin menghapus event: ${events[index].name}?`)) {
        events.splice(index, 1);
        localStorage.setItem('events', JSON.stringify(events));
        delete cart[index];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        loadEvents();
    }
}

function updateCartCount() {
    let totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0);
    document.getElementById('buyAllButton').innerText = `🛒 Beli Semua (${totalItems})`;
}
