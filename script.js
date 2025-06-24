// Telegram Web App initialization
const tg = window.Telegram.WebApp;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initTelegramApp();
    initApp();
});

function initTelegramApp() {
    // Initialize Telegram Web App
    tg.ready();
    
    // Set up Telegram theme
    document.body.style.backgroundColor = tg.themeParams.bg_color || '#ffffff';
    
    // Show user info
    const userNameElement = document.getElementById('user-name');
    if (tg.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        userNameElement.textContent = user.first_name || 'Usuario';
    }
    
    // Set up main button
    tg.MainButton.setText('Cerrar');
    tg.MainButton.onClick(() => tg.close());
    tg.MainButton.show();
}

// App state
let appState = {
    currentTab: 'auctions',
    cars: [],
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
    profile: JSON.parse(localStorage.getItem('profile') || '{}'),
    biddingHistory: JSON.parse(localStorage.getItem('biddingHistory') || '[]')
};

// Sample car data
const sampleCars = [
    {
        id: 1,
        title: '2019 Toyota Camry',
        brand: 'toyota',
        year: 2019,
        mileage: '35,000 km',
        currentBid: 15000,
        minBid: 15500,
        timeLeft: '2 días',
        image: 'https://via.placeholder.com/300x200/0066cc/ffffff?text=Toyota+Camry',
        description: 'Excelente condición, un solo dueño, mantenimiento al día.',
        specs: {
            'Motor': '2.5L I4',
            'Transmisión': 'Automática',
            'Combustible': 'Gasolina',
            'Color': 'Blanco',
            'Tracción': 'Delantera',
            'Asientos': '5'
        }
    },
    {
        id: 2,
        title: '2020 Honda Civic',
        brand: 'honda',
        year: 2020,
        mileage: '25,000 km',
        currentBid: 18000,
        minBid: 18500,
        timeLeft: '1 día',
        image: 'https://via.placeholder.com/300x200/cc0000/ffffff?text=Honda+Civic',
        description: 'Como nuevo, garantía extendida, excelente economía de combustible.',
        specs: {
            'Motor': '1.5L Turbo',
            'Transmisión': 'CVT',
            'Combustible': 'Gasolina',
            'Color': 'Rojo',
            'Tracción': 'Delantera',
            'Asientos': '5'
        }
    },
    {
        id: 3,
        title: '2018 Ford F-150',
        brand: 'ford',
        year: 2018,
        mileage: '45,000 km',
        currentBid: 25000,
        minBid: 25500,
        timeLeft: '5 horas',
        image: 'https://via.placeholder.com/300x200/003366/ffffff?text=Ford+F-150',
        description: 'Pickup robusta, ideal para trabajo, excelente capacidad de carga.',
        specs: {
            'Motor': '3.5L V6',
            'Transmisión': '10-Speed Auto',
            'Combustible': 'Gasolina',
            'Color': 'Azul',
            'Tracción': '4WD',
            'Asientos': '5'
        }
    },
    {
        id: 4,
        title: '2021 Chevrolet Malibu',
        brand: 'chevrolet',
        year: 2021,
        mileage: '15,000 km',
        currentBid: 20000,
        minBid: 20500,
        timeLeft: '3 días',
        image: 'https://via.placeholder.com/300x200/666666/ffffff?text=Chevrolet+Malibu',
        description: 'Sedán moderno con tecnología avanzada, muy poco uso.',
        specs: {
            'Motor': '1.5L Turbo',
            'Transmisión': 'CVT',
            'Combustible': 'Gasolina',
            'Color': 'Gris',
            'Tracción': 'Delantera',
            'Asientos': '5'
        }
    }
];

function initApp() {
    // Initialize sample data
    appState.cars = sampleCars;
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial data
    loadCars();
    loadProfile();
    loadBiddingHistory();
}

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Search functionality
    document.getElementById('search-btn').addEventListener('click', searchCars);
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchCars();
        }
    });
    
    // Filter functionality
    document.getElementById('brand-filter').addEventListener('change', filterCars);
    document.getElementById('price-filter').addEventListener('change', filterCars);
    
    // Profile functionality
    document.getElementById('save-profile').addEventListener('click', saveProfile);
    document.getElementById('profile-btn').addEventListener('click', () => switchTab('profile'));
    
    // Modal functionality
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModal);
    });
    
    // Bid modal
    document.getElementById('place-bid').addEventListener('click', placeBid);
    
    // Click outside modal to close
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
}

function switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update active content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    appState.currentTab = tabName;
    
    // Load content based on tab
    if (tabName === 'favorites') {
        loadFavorites();
    }
}

function loadCars() {
    const carsGrid = document.getElementById('cars-grid');
    carsGrid.innerHTML = '';
    
    appState.cars.forEach(car => {
        const carCard = createCarCard(car);
        carsGrid.appendChild(carCard);
    });
}

function createCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.innerHTML = `
        <img src="${car.image}" alt="${car.title}" class="car-image" onerror="this.src='https://via.placeholder.com/300x200/cccccc/666666?text=No+Image'">
        <div class="car-info">
            <div class="car-title">${car.title}</div>
            <div class="car-details">
                <span>${car.year} • ${car.mileage}</span>
                <span>⏰ ${car.timeLeft}</span>
            </div>
            <div class="car-price">$${car.currentBid.toLocaleString()}</div>
            <div class="car-actions">
                <button class="bid-btn" onclick="openBidModal(${car.id})">Pujar</button>
                <button class="favorite-btn ${appState.favorites.includes(car.id) ? 'active' : ''}" 
                        onclick="toggleFavorite(${car.id})">
                    ${appState.favorites.includes(car.id) ? '❤️' : '🤍'}
                </button>
            </div>
        </div>
    `;
    
    // Add click listener for car details
    card.addEventListener('click', function(e) {
        if (!e.target.closest('.car-actions')) {
            openCarDetail(car.id);
        }
    });
    
    return card;
}

function searchCars() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredCars = appState.cars.filter(car => 
        car.title.toLowerCase().includes(searchTerm) ||
        car.brand.toLowerCase().includes(searchTerm)
    );
    
    displayCars(filteredCars);
}

function filterCars() {
    const brandFilter = document.getElementById('brand-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    
    let filteredCars = appState.cars;
    
    if (brandFilter) {
        filteredCars = filteredCars.filter(car => car.brand === brandFilter);
    }
    
    if (priceFilter) {
        filteredCars = filteredCars.filter(car => {
            const price = car.currentBid;
            switch(priceFilter) {
                case '0-5000': return price <= 5000;
                case '5000-10000': return price > 5000 && price <= 10000;
                case '10000-20000': return price > 10000 && price <= 20000;
                case '20000+': return price > 20000;
                default: return true;
            }
        });
    }
    
    displayCars(filteredCars);
}

function displayCars(cars) {
    const carsGrid = document.getElementById('cars-grid');
    carsGrid.innerHTML = '';
    
    if (cars.length === 0) {
        carsGrid.innerHTML = '<div class="empty-state"><p>No se encontraron carros</p></div>';
        return;
    }
    
    cars.forEach(car => {
        const carCard = createCarCard(car);
        carsGrid.appendChild(carCard);
    });
}

function toggleFavorite(carId) {
    const index = appState.favorites.indexOf(carId);
    if (index > -1) {
        appState.favorites.splice(index, 1);
    } else {
        appState.favorites.push(carId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(appState.favorites));
    
    // Update UI
    loadCars();
    if (appState.currentTab === 'favorites') {
        loadFavorites();
    }
    
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

function loadFavorites() {
    const favoritesGrid = document.getElementById('favorites-grid');
    const favoriteCars = appState.cars.filter(car => appState.favorites.includes(car.id));
    
    if (favoriteCars.length === 0) {
        favoritesGrid.innerHTML = `
            <div class="empty-state">
                <p>No tienes carros favoritos aún</p>
                <p>Agrega carros a favoritos desde las subastas</p>
            </div>
        `;
        return;
    }
    
    favoritesGrid.innerHTML = '';
    favoriteCars.forEach(car => {
        const carCard = createCarCard(car);
        favoritesGrid.appendChild(carCard);
    });
}

function openCarDetail(carId) {
    const car = appState.cars.find(c => c.id === carId);
    if (!car) return;
    
    const carDetail = document.getElementById('car-detail');
    carDetail.innerHTML = `
        <img src="${car.image}" alt="${car.title}" class="car-detail-image" onerror="this.src='https://via.placeholder.com/400x250/cccccc/666666?text=No+Image'">
        <div class="car-detail-info">
            <h3>${car.title}</h3>
            <div class="car-price">Puja actual: $${car.currentBid.toLocaleString()}</div>
            <p><strong>Tiempo restante:</strong> ${car.timeLeft}</p>
            <p><strong>Descripción:</strong> ${car.description}</p>
            
            <h4>Especificaciones:</h4>
            <div class="car-detail-specs">
                ${Object.entries(car.specs).map(([key, value]) => `
                    <div><strong>${key}:</strong> ${value}</div>
                `).join('')}
            </div>
            
            <div class="car-actions">
                <button class="bid-btn" onclick="openBidModal(${car.id}); closeModal();">Hacer Puja</button>
                <button class="favorite-btn ${appState.favorites.includes(car.id) ? 'active' : ''}" 
                        onclick="toggleFavorite(${car.id})">
                    ${appState.favorites.includes(car.id) ? '❤️ Favorito' : '🤍 Agregar a favoritos'}
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('car-modal').style.display = 'block';
}

function openBidModal(carId) {
    const car = appState.cars.find(c => c.id === carId);
    if (!car) return;
    
    const currentBidInfo = document.getElementById('current-bid-info');
    currentBidInfo.innerHTML = `
        <h4>${car.title}</h4>
        <div class="current-bid-amount">Puja actual: $${car.currentBid.toLocaleString()}</div>
        <p>Puja mínima: $${car.minBid.toLocaleString()}</p>
        <p>Tiempo restante: ${car.timeLeft}</p>
    `;
    
    const bidAmountInput = document.getElementById('bid-amount');
    bidAmountInput.min = car.minBid;
    bidAmountInput.value = car.minBid;
    
    // Store current car ID for bidding
    document.getElementById('place-bid').dataset.carId = carId;
    
    document.getElementById('bid-modal').style.display = 'block';
}

function placeBid() {
    const carId = parseInt(document.getElementById('place-bid').dataset.carId);
    const bidAmount = parseInt(document.getElementById('bid-amount').value);
    
    const car = appState.cars.find(c => c.id === carId);
    if (!car) return;
    
    if (bidAmount < car.minBid) {
        alert(`La puja mínima es $${car.minBid.toLocaleString()}`);
        return;
    }
    
    // Update car bid
    car.currentBid = bidAmount;
    car.minBid = bidAmount + 500;
    
    // Add to bidding history
    const bidRecord = {
        carId: carId,
        carTitle: car.title,
        amount: bidAmount,
        timestamp: new Date().toISOString(),
        status: 'active'
    };
    
    appState.biddingHistory.unshift(bidRecord);
    localStorage.setItem('biddingHistory', JSON.stringify(appState.biddingHistory));
    
    // Update UI
    loadCars();
    closeModal();
    
    // Show success message
    if (tg.showPopup) {
        tg.showPopup({
            title: '¡Puja exitosa!',
            message: `Tu puja de $${bidAmount.toLocaleString()} ha sido registrada.`,
            buttons: [{type: 'ok'}]
        });
    } else {
        alert(`¡Puja exitosa! Tu puja de $${bidAmount.toLocaleString()} ha sido registrada.`);
    }
    
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function loadProfile() {
    const profile = appState.profile;
    if (profile.displayName) document.getElementById('display-name').value = profile.displayName;
    if (profile.phone) document.getElementById('phone').value = profile.phone;
    if (profile.email) document.getElementById('email').value = profile.email;
    if (profile.location) document.getElementById('location').value = profile.location;
}

function saveProfile() {
    const profile = {
        displayName: document.getElementById('display-name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        location: document.getElementById('location').value
    };
    
    appState.profile = profile;
    localStorage.setItem('profile', JSON.stringify(profile));
    
    // Show success message
    if (tg.showPopup) {
        tg.showPopup({
            title: 'Perfil guardado',
            message: 'Tu perfil ha sido actualizado exitosamente.',
            buttons: [{type: 'ok'}]
        });
    } else {
        alert('Perfil guardado exitosamente.');
    }
    
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

function loadBiddingHistory() {
    const historyList = document.getElementById('bidding-history-list');
    
    if (appState.biddingHistory.length === 0) {
        historyList.innerHTML = '<div class="empty-state"><p>No has hecho pujas aún</p></div>';
        return;
    }
    
    historyList.innerHTML = '';
    appState.biddingHistory.forEach(bid => {
        const historyItem = document.createElement('div');
        historyItem.className = 'bid-history-item';
        historyItem.innerHTML = `
            <div>
                <div><strong>${bid.carTitle}</strong></div>
                <div>$${bid.amount.toLocaleString()}</div>
            </div>
            <div>
                <div>${new Date(bid.timestamp).toLocaleDateString()}</div>
                <div><span class="status-${bid.status}">${bid.status === 'active' ? 'Activa' : 'Finalizada'}</span></div>
            </div>
        `;
        historyList.appendChild(historyItem);
    });
}

// Periodic updates (simulate real-time updates)
setInterval(() => {
    // Update time left for auctions (simplified)
    appState.cars.forEach(car => {
        // This is a simplified simulation - in real app, this would come from server
        if (Math.random() < 0.1) { // 10% chance to update
            const timeOptions = ['30 min', '1 hora', '2 horas', '5 horas', '1 día', '2 días'];
            car.timeLeft = timeOptions[Math.floor(Math.random() * timeOptions.length)];
        }
    });
    
    // Refresh current view
    if (appState.currentTab === 'auctions') {
        loadCars();
    } else if (appState.currentTab === 'favorites') {
        loadFavorites();
    }
}, 30000); // Update every 30 seconds 