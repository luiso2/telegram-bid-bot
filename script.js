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
    
    // Initialize user data
    if (tg.initDataUnsafe?.user) {
        const telegramUser = tg.initDataUnsafe.user;
        appState.user.name = telegramUser.first_name || 'User';
        appState.user.telegram_id = telegramUser.id;
        
        // Load user status from server (simulated)
        loadUserStatus();
    }
    
    // Set up main button
    tg.MainButton.setText('Close');
    tg.MainButton.onClick(() => tg.close());
    tg.MainButton.show();
}

function loadUserStatus() {
    // Simulate API call to check user status
    // In real app, this would be an API call
    const savedStatus = localStorage.getItem('userStatus');
    if (savedStatus) {
        appState.user.status = savedStatus;
    }
    
    // Update UI based on user status
    updateUIForUserStatus();
}

// User status constants
const USER_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    SUSPENDED: 'suspended'
};

// App state
let appState = {
    currentTab: 'auctions',
    cars: [],
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
    profile: JSON.parse(localStorage.getItem('profile') || '{}'),
    biddingHistory: JSON.parse(localStorage.getItem('biddingHistory') || '[]'),
    user: {
        status: localStorage.getItem('userStatus') || USER_STATUS.PENDING,
        id: null,
        name: null,
        telegram_id: null,
        approved_at: null,
        pending_since: new Date().toISOString()
    }
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
        timeLeft: '2 days',
        image: 'https://via.placeholder.com/300x200/0066cc/ffffff?text=Toyota+Camry',
        description: 'Excellent condition, single owner, up-to-date maintenance.',
        specs: {
            'Engine': '2.5L I4',
            'Transmission': 'Automatic',
            'Fuel': 'Gasoline',
            'Color': 'White',
            'Drive': 'Front-wheel',
            'Seats': '5'
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
        timeLeft: '1 day',
        image: 'https://via.placeholder.com/300x200/cc0000/ffffff?text=Honda+Civic',
        description: 'Like new, extended warranty, excellent fuel economy.',
        specs: {
            'Engine': '1.5L Turbo',
            'Transmission': 'CVT',
            'Fuel': 'Gasoline',
            'Color': 'Red',
            'Drive': 'Front-wheel',
            'Seats': '5'
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
        timeLeft: '5 hours',
        image: 'https://via.placeholder.com/300x200/003366/ffffff?text=Ford+F-150',
        description: 'Rugged pickup, ideal for work, excellent load capacity.',
        specs: {
            'Engine': '3.5L V6',
            'Transmission': '10-Speed Auto',
            'Fuel': 'Gasoline',
            'Color': 'Blue',
            'Drive': '4WD',
            'Seats': '5'
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
        timeLeft: '3 days',
        image: 'https://via.placeholder.com/300x200/666666/ffffff?text=Chevrolet+Malibu',
        description: 'Modern sedan with advanced technology, very low usage.',
        specs: {
            'Engine': '1.5L Turbo',
            'Transmission': 'CVT',
            'Fuel': 'Gasoline',
            'Color': 'Gray',
            'Drive': 'Front-wheel',
            'Seats': '5'
        }
    }
];

function initApp() {
    // Initialize sample data
    appState.cars = sampleCars;
    
    // Set up event listeners
    setupEventListeners();
    
    // Check user status and load appropriate content
    if (appState.user.status === USER_STATUS.APPROVED) {
        // Load initial data for approved users
        loadCars();
        loadProfile();
        loadBiddingHistory();
    } else {
        // Show appropriate status screen
        showUserStatusScreen();
    }
}

function updateUIForUserStatus() {
    const container = document.querySelector('.container');
    const userNameElement = document.getElementById('user-name');
    
    // Update user name with status indicator
    if (userNameElement && appState.user.name) {
        const statusEmoji = getStatusEmoji(appState.user.status);
        userNameElement.innerHTML = `${statusEmoji} ${appState.user.name}`;
    }
    
    // Show/hide content based on status
    if (appState.user.status !== USER_STATUS.APPROVED) {
        showUserStatusScreen();
    } else {
        showMainApp();
    }
}

function getStatusEmoji(status) {
    const emojiMap = {
        [USER_STATUS.PENDING]: '⏳',
        [USER_STATUS.APPROVED]: '✅',
        [USER_STATUS.REJECTED]: '❌',
        [USER_STATUS.SUSPENDED]: '🚫'
    };
    return emojiMap[status] || '❓';
}

function showUserStatusScreen() {
    const container = document.querySelector('.container');
    
    // Hide navigation and content
    const nav = document.querySelector('.nav-tabs');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (nav) nav.style.display = 'none';
    tabContents.forEach(tab => tab.style.display = 'none');
    
    // Create or update status screen
    let statusScreen = document.getElementById('status-screen');
    if (!statusScreen) {
        statusScreen = document.createElement('div');
        statusScreen.id = 'status-screen';
        statusScreen.className = 'status-screen';
        container.appendChild(statusScreen);
    }
    
    statusScreen.innerHTML = getStatusScreenContent();
    statusScreen.style.display = 'block';
}

function showMainApp() {
    // Show navigation and content
    const nav = document.querySelector('.nav-tabs');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (nav) nav.style.display = 'flex';
    
    // Hide status screen with smooth transition
    const statusScreen = document.getElementById('status-screen');
    if (statusScreen) {
        statusScreen.style.opacity = '0';
        setTimeout(() => {
            statusScreen.style.display = 'none';
        }, 300);
    }
    
    // Show appropriate tab with content
    switchTab('auctions'); // Always start with auctions tab
    
    // Ensure content is loaded
    if (appState.user.status === USER_STATUS.APPROVED) {
        // Add welcome message
        setTimeout(() => {
            showToast('🚗 Welcome to Car Auction! You can now bid on cars.', 'success');
        }, 1000);
    }
}

function getStatusScreenContent() {
    const status = appState.user.status;
    const userName = appState.user.name || 'User';
    
    switch (status) {
        case USER_STATUS.PENDING:
            return `
                <div class="status-content pending">
                    <div class="status-icon">⏳</div>
                    <h2>Account Pending Approval</h2>
                    <p>Hello ${userName}!</p>
                    <p>Your account is currently being reviewed by our administrators.</p>
                    <div class="status-details">
                        <p><strong>What happens next?</strong></p>
                        <ul>
                            <li>Our team will review your account within 24-48 hours</li>
                            <li>You'll receive a notification once approved</li>
                            <li>Then you can start bidding on car auctions</li>
                        </ul>
                    </div>
                    <div class="status-actions">
                        <button onclick="refreshUserStatus()" class="refresh-btn">
                            🔄 Check Status
                        </button>
                        <button onclick="contactSupport()" class="support-btn">
                            💬 Contact Support
                        </button>
                    </div>
                    <div class="status-footer">
                        <p>Thank you for your patience!</p>
                    </div>
                </div>
            `;
            
        case USER_STATUS.REJECTED:
            return `
                <div class="status-content rejected">
                    <div class="status-icon">❌</div>
                    <h2>Account Not Approved</h2>
                    <p>Unfortunately, your account application was not approved.</p>
                    <div class="status-details">
                        <p><strong>Possible reasons:</strong></p>
                        <ul>
                            <li>Incomplete profile information</li>
                            <li>Documentation requirements not met</li>
                            <li>Previous violations of terms of service</li>
                        </ul>
                    </div>
                    <div class="status-actions">
                        <button onclick="reapplyAccount()" class="reapply-btn">
                            📝 Reapply
                        </button>
                        <button onclick="contactSupport()" class="support-btn">
                            💬 Contact Support
                        </button>
                    </div>
                </div>
            `;
            
        case USER_STATUS.SUSPENDED:
            return `
                <div class="status-content suspended">
                    <div class="status-icon">🚫</div>
                    <h2>Account Suspended</h2>
                    <p>Your account has been temporarily suspended.</p>
                    <div class="status-details">
                        <p><strong>During suspension you cannot:</strong></p>
                        <ul>
                            <li>Place bids on auctions</li>
                            <li>Add items to favorites</li>
                            <li>Access premium features</li>
                        </ul>
                    </div>
                    <div class="status-actions">
                        <button onclick="contactSupport()" class="support-btn">
                            💬 Appeal Suspension
                        </button>
                    </div>
                </div>
            `;
            
        default:
            return `
                <div class="status-content unknown">
                    <div class="status-icon">❓</div>
                    <h2>Status Unknown</h2>
                    <p>We're having trouble determining your account status.</p>
                    <div class="status-actions">
                        <button onclick="refreshUserStatus()" class="refresh-btn">
                            🔄 Refresh
                        </button>
                        <button onclick="contactSupport()" class="support-btn">
                            💬 Contact Support
                        </button>
                    </div>
                </div>
            `;
    }
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
    
    // Show skeleton loading
    showSkeletonLoading(carsGrid);
    
    // Simulate loading delay
    setTimeout(() => {
        carsGrid.innerHTML = '';
        
        appState.cars.forEach((car, index) => {
            setTimeout(() => {
                const carCard = createCarCard(car);
                carCard.style.animationDelay = `${index * 0.1}s`;
                carsGrid.appendChild(carCard);
            }, index * 100);
        });
    }, 800);
}

function showSkeletonLoading(container) {
    container.innerHTML = '';
    
    // Create 6 skeleton cards
    for (let i = 0; i < 6; i++) {
        const skeletonCard = document.createElement('div');
        skeletonCard.className = 'skeleton-card';
        skeletonCard.innerHTML = `
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-details"></div>
                <div class="skeleton skeleton-price"></div>
                <div class="skeleton-actions">
                    <div class="skeleton skeleton-btn"></div>
                    <div class="skeleton skeleton-btn-small"></div>
                </div>
            </div>
        `;
        container.appendChild(skeletonCard);
    }
}

function createCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';
    
    // Create image container with placeholder
    const imageContainer = document.createElement('div');
    imageContainer.className = 'car-image-container';
    
    // Create placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'car-image-placeholder';
    placeholder.innerHTML = '🚗';
    
    // Create actual image
    const img = document.createElement('img');
    img.className = 'car-image car-image-loading';
    img.alt = car.title;
    img.onerror = function() {
        this.style.display = 'none';
        placeholder.innerHTML = '📷';
    };
    img.onload = function() {
        this.classList.remove('car-image-loading');
        this.classList.add('car-image-loaded');
        placeholder.style.display = 'none';
    };
    
    imageContainer.appendChild(placeholder);
    imageContainer.appendChild(img);
    
    // Set image source after setup to prevent flickering
    setTimeout(() => {
        img.src = car.image;
    }, 50);
    
    card.appendChild(imageContainer);
    
    const carInfo = document.createElement('div');
    carInfo.className = 'car-info';
    carInfo.innerHTML = `
        <div class="car-title">${car.title}</div>
        <div class="car-details">
            <span>${car.year} • ${car.mileage}</span>
            <span>⏰ ${car.timeLeft}</span>
        </div>
        <div class="car-price">$${car.currentBid.toLocaleString()}</div>
        <div class="car-actions">
            <button class="bid-btn" onclick="openBidModal(${car.id})">Bid</button>
            <button class="favorite-btn ${appState.favorites.includes(car.id) ? 'active' : ''}" 
                    onclick="toggleFavorite(${car.id})">
                ${appState.favorites.includes(car.id) ? '❤️' : '🤍'}
            </button>
        </div>
    `;
    
    card.appendChild(carInfo);
    
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
        carsGrid.innerHTML = '<div class="empty-state"><p>No cars found</p></div>';
        return;
    }
    
    cars.forEach(car => {
        const carCard = createCarCard(car);
        carsGrid.appendChild(carCard);
    });
}

function toggleFavorite(carId) {
    // Check if user can add favorites
    if (!canUserAddFavorites()) {
        showToast('🔒 Please get your account approved to add favorites', 'warning');
        return;
    }
    
    const index = appState.favorites.indexOf(carId);
    const car = appState.cars.find(c => c.id === carId);
    let isAdded = false;
    
    if (index > -1) {
        appState.favorites.splice(index, 1);
        showToast('❤️ Removed from favorites', 'warning');
    } else {
        appState.favorites.push(carId);
        showToast('💖 Added to favorites', 'success');
        isAdded = true;
    }
    
    localStorage.setItem('favorites', JSON.stringify(appState.favorites));
    
    // Update UI with animation
    updateFavoriteButton(carId, isAdded);
    
    if (appState.currentTab === 'favorites') {
        loadFavorites();
    }
    
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

function updateFavoriteButton(carId, isAdded) {
    const favoriteButtons = document.querySelectorAll(`[onclick*="toggleFavorite(${carId})"]`);
    favoriteButtons.forEach(btn => {
        if (isAdded) {
            btn.classList.add('active');
            btn.innerHTML = '❤️';
            btn.style.animation = 'bounce 0.6s ease';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '🤍';
        }
        
        // Reset animation
        setTimeout(() => {
            btn.style.animation = '';
        }, 600);
    });
}

function loadFavorites() {
    const favoritesGrid = document.getElementById('favorites-grid');
    const favoriteCars = appState.cars.filter(car => appState.favorites.includes(car.id));
    
    if (favoriteCars.length === 0) {
        favoritesGrid.innerHTML = `
            <div class="empty-state">
                <p>No favorite cars yet</p>
                <p>Add cars to favorites from auctions</p>
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
            <div class="car-price">Current bid: $${car.currentBid.toLocaleString()}</div>
            <p><strong>Time remaining:</strong> ${car.timeLeft}</p>
            <p><strong>Description:</strong> ${car.description}</p>
            
            <h4>Specifications:</h4>
            <div class="car-detail-specs">
                ${Object.entries(car.specs).map(([key, value]) => `
                    <div><strong>${key}:</strong> ${value}</div>
                `).join('')}
            </div>
            
            <div class="car-actions">
                <button class="bid-btn" onclick="openBidModal(${car.id}); closeModal();">Place Bid</button>
                <button class="favorite-btn ${appState.favorites.includes(car.id) ? 'active' : ''}" 
                        onclick="toggleFavorite(${car.id})">
                    ${appState.favorites.includes(car.id) ? '❤️ Favorite' : '🤍 Add to favorites'}
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('car-modal').style.display = 'block';
}

function openBidModal(carId) {
    // Check if user can bid
    if (!canUserBid()) {
        showToast('🔒 Please get your account approved to place bids', 'warning');
        return;
    }
    
    const car = appState.cars.find(c => c.id === carId);
    if (!car) return;
    
    const currentBidInfo = document.getElementById('current-bid-info');
    currentBidInfo.innerHTML = `
        <h4>${car.title}</h4>
        <div class="current-bid-amount">Current bid: $${car.currentBid.toLocaleString()}</div>
        <p>Minimum bid: $${car.minBid.toLocaleString()}</p>
        <p>Time remaining: ${car.timeLeft}</p>
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
        alert(`Minimum bid is $${car.minBid.toLocaleString()}`);
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
    
    // Show success message with toast
    showToast(`🎉 Bid successful! $${bidAmount.toLocaleString()}`, 'success');
    
    // Also show Telegram popup if available
    if (tg.showPopup) {
        tg.showPopup({
            title: 'Bid successful!',
            message: `Your bid of $${bidAmount.toLocaleString()} has been registered.`,
            buttons: [{type: 'ok'}]
        });
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
    
    // Show success message with toast
    showToast('✅ Profile saved successfully', 'success');
    
    // Also show Telegram popup if available
    if (tg.showPopup) {
        tg.showPopup({
            title: 'Profile saved',
            message: 'Your profile has been updated successfully.',
            buttons: [{type: 'ok'}]
        });
    }
    
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

function loadBiddingHistory() {
    const historyList = document.getElementById('bidding-history-list');
    
    if (appState.biddingHistory.length === 0) {
        historyList.innerHTML = '<div class="empty-state"><p>No bids placed yet</p></div>';
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
                <div><span class="status-${bid.status}">${bid.status === 'active' ? 'Active' : 'Finished'}</span></div>
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
            const timeOptions = ['30 min', '1 hour', '2 hours', '5 hours', '1 day', '2 days'];
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

// User status management functions
function refreshUserStatus() {
    showToast('🔄 Checking status...', 'info');
    
    // Show loading state for better UX
    const refreshButtons = document.querySelectorAll('[onclick="refreshUserStatus()"]');
    refreshButtons.forEach(btn => {
        btn.disabled = true;
        btn.innerHTML = '⏳ Checking...';
    });
    
    // Simulate API call with automatic approval for demo
    setTimeout(() => {
        // In demo mode, always approve the user for testing
        updateUserStatus(USER_STATUS.APPROVED);
        showToast('🎉 Account approved! Welcome to Car Auction!', 'success');
        
        // Load the main app content
        setTimeout(() => {
            loadCars();
            loadProfile();
            loadBiddingHistory();
        }, 500);
        
    }, 2000);
}

function updateUserStatus(newStatus) {
    appState.user.status = newStatus;
    localStorage.setItem('userStatus', newStatus);
    
    if (newStatus === USER_STATUS.APPROVED) {
        appState.user.approved_at = new Date().toISOString();
        
        // Show success haptic feedback
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
    }
    
    updateUIForUserStatus();
}

function contactSupport() {
    showToast('📞 Opening support channel...', 'info');
    
    // In a real app, this would open a support ticket or chat
    if (tg.openLink) {
        tg.openLink('https://t.me/support'); // Replace with actual support channel
    } else {
        showToast('💬 Please contact @support for assistance', 'info');
    }
}

function reapplyAccount() {
    showToast('📝 Starting reapplication process...', 'info');
    
    // Reset status to pending
    updateUserStatus(USER_STATUS.PENDING);
    appState.user.pending_since = new Date().toISOString();
    
    showToast('✅ Reapplication submitted! We\'ll review it soon.', 'success');
}

// Restrict functions based on user status
function canUserBid() {
    return appState.user.status === USER_STATUS.APPROVED;
}

function canUserAddFavorites() {
    return appState.user.status === USER_STATUS.APPROVED;
}

function canUserEditProfile() {
    return [USER_STATUS.PENDING, USER_STATUS.APPROVED].includes(appState.user.status);
}

// Toast notification system
function showToast(message, type = 'success') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${iconMap[type] || iconMap.info}</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Enhanced search with suggestions
function setupSearchEnhancements() {
    const searchInput = document.getElementById('search-input');
    let searchSuggestions = null;
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        
        if (query.length < 2) {
            hideSearchSuggestions();
            return;
        }
        
        const suggestions = getSuggestions(query);
        showSearchSuggestions(suggestions);
    });
    
    searchInput.addEventListener('blur', function() {
        setTimeout(() => hideSearchSuggestions(), 150);
    });
}

function getSuggestions(query) {
    const suggestions = [];
    const brands = [...new Set(appState.cars.map(car => car.brand))];
    const titles = appState.cars.map(car => car.title);
    
    // Brand suggestions
    brands.forEach(brand => {
        if (brand.toLowerCase().includes(query)) {
            suggestions.push({ type: 'brand', text: brand, icon: '🏷️' });
        }
    });
    
    // Title suggestions
    titles.forEach(title => {
        if (title.toLowerCase().includes(query)) {
            suggestions.push({ type: 'title', text: title, icon: '🚗' });
        }
    });
    
    return suggestions.slice(0, 5);
}

function showSearchSuggestions(suggestions) {
    hideSearchSuggestions();
    
    if (suggestions.length === 0) return;
    
    const searchBar = document.querySelector('.search-bar');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.innerHTML = `${suggestion.icon} ${suggestion.text}`;
        item.addEventListener('click', () => {
            document.getElementById('search-input').value = suggestion.text;
            searchCars();
            hideSearchSuggestions();
        });
        suggestionsContainer.appendChild(item);
    });
    
    searchBar.appendChild(suggestionsContainer);
}

function hideSearchSuggestions() {
    const suggestions = document.querySelector('.search-suggestions');
    if (suggestions) suggestions.remove();
}

// Improved bidding experience
function validateBidAmount(carId, amount) {
    const car = appState.cars.find(c => c.id === carId);
    if (!car) return { valid: false, message: 'Car not found' };
    
    if (amount < car.minBid) {
        return { 
            valid: false, 
            message: `Minimum bid is $${car.minBid.toLocaleString()}` 
        };
    }
    
    if (amount <= car.currentBid) {
        return { 
            valid: false, 
            message: `Your bid must be higher than $${car.currentBid.toLocaleString()}` 
        };
    }
    
    return { valid: true, message: 'Valid bid' };
}

// Enhanced placeBid with better validation
function placeBidEnhanced() {
    const carId = parseInt(document.getElementById('place-bid').dataset.carId);
    const bidAmount = parseInt(document.getElementById('bid-amount').value);
    
    const validation = validateBidAmount(carId, bidAmount);
    if (!validation.valid) {
        showToast(validation.message, 'error');
        return;
    }
    
    // Show loading state
    const bidButton = document.getElementById('place-bid');
    const originalText = bidButton.textContent;
    bidButton.textContent = 'Processing...';
    bidButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        const car = appState.cars.find(c => c.id === carId);
        
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
        
        // Reset button
        bidButton.textContent = originalText;
        bidButton.disabled = false;
        
        // Show success message with toast
        showToast(`🎉 Bid successful! $${bidAmount.toLocaleString()}`, 'success');
        
        // Haptic feedback
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
    }, 1000);
}

// Touch gestures for mobile
function setupTouchGestures() {
    let startX, startY;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!startX || !startY) return;
        
        const diffX = startX - e.touches[0].clientX;
        const diffY = startY - e.touches[0].clientY;
        
        // Prevent default scroll if swiping horizontally
        if (Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault();
        }
    });
    
    document.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Swipe threshold
        const threshold = 50;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swiped left - next tab
                switchToNextTab();
            } else {
                // Swiped right - previous tab
                switchToPreviousTab();
            }
        }
        
        startX = null;
        startY = null;
    });
}

function switchToNextTab() {
    const tabs = ['auctions', 'favorites', 'profile'];
    const currentIndex = tabs.indexOf(appState.currentTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    switchTab(tabs[nextIndex]);
}

function switchToPreviousTab() {
    const tabs = ['auctions', 'favorites', 'profile'];
    const currentIndex = tabs.indexOf(appState.currentTab);
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    switchTab(tabs[prevIndex]);
}

// Debug functions for testing (remove in production)
function simulateApproval() {
    updateUserStatus(USER_STATUS.APPROVED);
    showToast('🎉 Account approved! (Debug)', 'success');
    loadCars();
    loadProfile();
    loadBiddingHistory();
}

function simulateRejection() {
    updateUserStatus(USER_STATUS.REJECTED);
    showToast('❌ Account rejected! (Debug)', 'error');
}

function simulateSuspension() {
    updateUserStatus(USER_STATUS.SUSPENDED);
    showToast('🚫 Account suspended! (Debug)', 'warning');
}

function resetToPending() {
    updateUserStatus(USER_STATUS.PENDING);
    showToast('⏳ Status reset to pending! (Debug)', 'info');
}

// Demo mode function - always approves for testing
function enableDemoMode() {
    console.log('🎮 Demo mode enabled - all status checks will result in approval');
    showToast('🎮 Demo mode enabled - instant approval for testing', 'info');
}

// Add debug buttons to console (development only)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.debugUserStatus = {
        approve: simulateApproval,
        reject: simulateRejection,
        suspend: simulateSuspension,
        pending: resetToPending
    };
    console.log('Debug functions available: window.debugUserStatus.approve(), .reject(), .suspend(), .pending()');
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    // Original initialization
    initTelegramApp();
    initApp();
    
    // Enhanced features
    setupSearchEnhancements();
    setupTouchGestures();
    
    // Replace original placeBid with enhanced version
    document.getElementById('place-bid').removeEventListener('click', placeBid);
    document.getElementById('place-bid').addEventListener('click', placeBidEnhanced);
}); 