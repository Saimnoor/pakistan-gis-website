


// Complete JavaScript for Pakistan GIS Platform

// Global variables
let map;
let studySpaces = [];
let currentMarkers = [];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    loadStudySpaces();
    initEventListeners();
    updatePakistanTime();
});

// Initialize map
function initializeMap() {
    map = L.map('map').setView([30.3753, 69.3451], 6);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors | Pakistan GIS',
        maxZoom: 19
    }).addTo(map);
    
    // Map controls
    document.getElementById('zoom-in').addEventListener('click', () => map.zoomIn());
    document.getElementById('zoom-out').addEventListener('click', () => map.zoomOut());
    document.getElementById('locate-me').addEventListener('click', locateUser);
    document.getElementById('fullscreen').addEventListener('click', toggleFullscreen);
    document.getElementById('pakistan-view').addEventListener('click', () => map.setView([30.3753, 69.3451], 6));
    
    // Update location info
    map.on('moveend', updateLocationInfo);
}

// Load study spaces data
function loadStudySpaces() {
    studySpaces = [
        {
            id: 1,
            name: "National Library of Pakistan",
            type: "library",
            city: "Islamabad",
            province: "Islamabad",
            lat: 33.7294,
            lng: 73.0931,
            features: ["wifi", "ac", "quiet", "books"],
            rating: 4.5,
            capacity: 500,
            hours: "9:00 AM - 9:00 PM"
        },
        {
            id: 2,
            name: "Quaid-e-Azam Library",
            type: "library",
            city: "Lahore",
            province: "Punjab",
            lat: 31.5590,
            lng: 74.3318,
            features: ["wifi", "ac", "historical"],
            rating: 4.7,
            capacity: 300,
            hours: "8:00 AM - 8:00 PM"
        },
        {
            id: 3,
            name: "Karachi University Library",
            type: "university",
            city: "Karachi",
            province: "Sindh",
            lat: 24.9285,
            lng: 67.1147,
            features: ["wifi", "ac", "24hrs", "research"],
            rating: 4.3,
            capacity: 1000,
            hours: "24/7"
        },
        {
            id: 4,
            name: "Coffee Wagera",
            type: "cafe",
            city: "Islamabad",
            province: "Islamabad",
            lat: 33.6901,
            lng: 73.0551,
            features: ["wifi", "ac", "coffee", "power"],
            rating: 4.2,
            capacity: 50,
            hours: "8:00 AM - 12:00 AM"
        },
        {
            id: 5,
            name: "Peshawar Central Library",
            type: "library",
            city: "Peshawar",
            province: "KPK",
            lat: 34.0151,
            lng: 71.5817,
            features: ["wifi", "ac", "quiet"],
            rating: 4.0,
            capacity: 200,
            hours: "9:00 AM - 7:00 PM"
        },
        {
            id: 6,
            name: "NUST Learning Commons",
            type: "university",
            city: "Islamabad",
            province: "Islamabad",
            lat: 33.6427,
            lng: 72.9921,
            features: ["wifi", "ac", "24hrs", "group"],
            rating: 4.8,
            capacity: 800,
            hours: "24/7"
        },
        {
            id: 7,
            name: "University of Punjab Library",
            type: "university",
            city: "Lahore",
            province: "Punjab",
            lat: 31.5760,
            lng: 74.3366,
            features: ["wifi", "ac", "digital"],
            rating: 4.4,
            capacity: 600,
            hours: "8:00 AM - 10:00 PM"
        },
        {
            id: 8,
            name: "University of Balochistan",
            type: "university",
            city: "Quetta",
            province: "Balochistan",
            lat: 30.1798,
            lng: 66.9750,
            features: ["wifi", "ac", "library"],
            rating: 3.9,
            capacity: 400,
            hours: "9:00 AM - 6:00 PM"
        }
    ];
    
    addMarkersToMap();
    applyFilters(); // Initial display
}

// Add markers to map
function addMarkersToMap() {
    // Clear existing markers
    currentMarkers.forEach(marker => map.removeLayer(marker));
    currentMarkers = [];
    
    studySpaces.forEach(space => {
        const marker = L.marker([space.lat, space.lng])
            .addTo(map)
            .bindPopup(createPopupContent(space));
        currentMarkers.push(marker);
    });
}

// Create popup content
function createPopupContent(space) {
    return `
        <div style="min-width: 250px;">
            <h5>${space.name}</h5>
            <p><strong>Location:</strong> ${space.city}, ${space.province}</p>
            <p><strong>Type:</strong> ${space.type}</p>
            <p><strong>Rating:</strong> ${getRatingStars(space.rating)}</p>
            <p><strong>Hours:</strong> ${space.hours}</p>
            <p><strong>Capacity:</strong> ${space.capacity} seats</p>
            <button class="btn btn-sm btn-primary w-100 mt-2" onclick="showSpaceDetails(${space.id})">
                View Details
            </button>
        </div>
    `;
}

// Filter functions
function filterProvince(province) {
    const filtered = studySpaces.filter(space => space.province === province);
    updateResultsDisplay(filtered);
    showNotification(`Showing ${filtered.length} spaces in ${province}`);
}

function applyFilters() {
    const type = document.getElementById('typeFilter').value;
    let filtered = studySpaces;
    
    if (type !== 'all') {
        filtered = studySpaces.filter(space => space.type === type);
    }
    
    updateResultsDisplay(filtered);
}

function updateResultsDisplay(filteredSpaces) {
    const resultsContainer = document.getElementById('results');
    
    if (filteredSpaces.length === 0) {
        resultsContainer.innerHTML = '<div class="alert alert-warning">No study spaces found</div>';
        return;
    }
    
    let html = `<h6>Found ${filteredSpaces.length} study spaces:</h6>`;
    
    filteredSpaces.forEach(space => {
        html += `
            <div class="border-bottom py-2">
                <strong>${space.name}</strong><br>
                <small>${space.city}, ${space.province} | ${space.type}</small><br>
                <small>${getRatingStars(space.rating)}</small>
                <button class="btn btn-sm btn-outline-primary mt-1" onclick="zoomToSpace(${space.lat}, ${space.lng})">
                    View on Map
                </button>
            </div>
        `;
    });
    
    resultsContainer.innerHTML = html;
}

// GIS Tools
function initMeasurement() {
    alert('Measurement tool activated. Click on map to start measuring.');
}

function initDrawing() {
    alert('Drawing tool activated. Click to draw on map.');
}

function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            map.setView([position.coords.latitude, position.coords.longitude], 15);
            L.marker([position.coords.latitude, position.coords.longitude])
                .addTo(map)
                .bindPopup("Your location")
                .openPopup();
        });
    } else {
        alert("Geolocation not supported");
    }
}

function toggleFullscreen() {
    const elem = document.getElementById('map').parentElement;
    if (!document.fullscreenElement) {
        elem.requestFullscreen?.();
    } else {
        document.exitFullscreen?.();
    }
}

// Booking system
function checkBookingAvailability() {
    alert('Booking availability check - In production, this would connect to a database');
}

// Route planning
function calculateRoute() {
    const start = document.getElementById('route-start').value;
    const end = document.getElementById('route-end').value;
    
    if (!start || !end) {
        alert('Please enter start and destination');
        return;
    }
    
    const routeDetails = document.getElementById('route-details');
    routeDetails.innerHTML = `
        <div class="alert alert-success">
            <h6>Route from ${start} to ${end}</h6>
            <p><strong>Distance:</strong> 15.2 km</p>
            <p><strong>Time:</strong> 45 minutes</p>
            <p><strong>Cost:</strong> Rs. 200 (estimated)</p>
        </div>
    `;
}

// Reviews system
function submitReview() {
    const reviewText = document.getElementById('review-text').value;
    if (reviewText) {
        alert('Review submitted successfully!');
        document.getElementById('review-text').value = '';
    } else {
        alert('Please enter a review');
    }
}

// Helper functions
function getRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆';
    }
    return stars;
}

function showSpaceDetails(spaceId) {
    const space = studySpaces.find(s => s.id === spaceId);
    if (space) {
        const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
        modal.show();
    }
}

function zoomToSpace(lat, lng) {
    map.setView([lat, lng], 15);
    currentMarkers.forEach(marker => {
        if (marker.getLatLng().lat === lat && marker.getLatLng().lng === lng) {
            marker.openPopup();
        }
    });
}

function updateLocationInfo() {
    const center = map.getCenter();
    document.getElementById('location-info').textContent = 
        `Center: ${center.lat.toFixed(4)}°N, ${center.lng.toFixed(4)}°E`;
}

function updatePakistanTime() {
    const now = new Date();
    const pakTime = now.toLocaleTimeString('en-PK', {
        timeZone: 'Asia/Karachi',
        hour12: true
    });
    document.getElementById('pakistan-time').textContent = `Pakistan Time: ${pakTime}`;
    
    const date = now.toLocaleDateString('en-PK', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('current-date').textContent = `Date: ${date}`;
    
    setTimeout(updatePakistanTime, 1000);
}

function showNotification(message, type = 'info') {
    const alertClass = type === 'error' ? 'alert-danger' : 
                      type === 'success' ? 'alert-success' : 'alert-info';
    
    const alert = document.createElement('div');
    alert.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

// Initialize event listeners
function initEventListeners() {
    // Search functionality
    document.getElementById('main-search-btn').addEventListener('click', function() {
        const query = document.getElementById('main-search').value;
        if (query) {
            const found = studySpaces.filter(space => 
                space.name.toLowerCase().includes(query.toLowerCase()) ||
                space.city.toLowerCase().includes(query.toLowerCase())
            );
            updateResultsDisplay(found);
            showNotification(`Found ${found.length} results for "${query}"`);
        }
    });
    
    // PWA installation
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        document.getElementById('installPWA').style.display = 'block';
        document.getElementById('installBtn').style.display = 'block';
    });
    
    document.getElementById('installPWA').addEventListener('click', installPWA);
    document.getElementById('installBtn').addEventListener('click', installPWA);
    
    function installPWA() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    showNotification('App installed successfully!', 'success');
                }
                deferredPrompt = null;
            });
        }
    }
}

console.log('Pakistan GIS Study Spaces Platform initialized successfully!');
const CACHE_NAME = 'pakistan-gis-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
