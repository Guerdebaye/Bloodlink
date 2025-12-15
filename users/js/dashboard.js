// Enhanced Dashboard Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du Dashboard BloodLink Pro Ultra-Pro...');
    
    // Initialize Particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('dashboard-particles', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#dc2626" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#dc2626",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                }
            }
        });
    }

    // Enhanced AOS Initialization
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            mirror: false,
            offset: 50
        });
    }

    // Enhanced Chart.js Initialization
    initializeEnhancedCharts();

    // Enhanced Navigation
    initializeEnhancedNavigation();

    // Enhanced User Interactions
    initializeEnhancedInteractions();

    // Enhanced Data Loading
    loadEnhancedMockData();

    // Enhanced Real-time Updates
    initializeRealTimeUpdates();

    // Hide loading screen with enhanced animation
    setTimeout(function() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                console.log('✅ Écran de chargement masqué avec style');
            }, 500);
        }
    }, 2000);

    console.log('🎯 Dashboard BloodLink Pro Ultra-Pro initialisé avec succès!');
});

function initializeEnhancedCharts() {
    const activityCtx = document.getElementById('donationActivityChart');
    if (activityCtx) {
        const activityChart = new Chart(activityCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                datasets: [{
                    label: 'Dons de Sang',
                    data: [2, 3, 1, 4, 2, 3, 2, 4, 3, 2, 1, 3],
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#dc2626',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(31, 41, 55, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#dc2626',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
}

function initializeEnhancedNavigation() {
    // Enhanced smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Hide all sections
                document.querySelectorAll('.dashboard-section').forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show target section
                target.classList.add('active');
                
                // Smooth scroll
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Enhanced navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.dashboard-nav');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initializeEnhancedInteractions() {
    // Enhanced quick actions
    window.quickAction = function(action) {
        const toast = createEnhancedToast(`Action rapide: ${action}`, 'success');
        showEnhancedToast(toast);
        
        // Simulate action with enhanced animation
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Chargement...';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            createEnhancedToast('Action complétée avec succès!', 'success');
        }, 2000);
    };

    // Enhanced emergency response
    window.respondToEmergency = function() {
        const toast = createEnhancedToast('🚨 Merci pour votre réponse à l\'urgence!', 'success');
        showEnhancedToast(toast);
        
        // Simulate API call
        setTimeout(() => {
            createEnhancedToast('✅ Votre disponibilité a été enregistrée', 'success');
        }, 1500);
    };

    // Enhanced profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const toast = createEnhancedToast('✅ Profil mis à jour avec succès', 'success');
            showEnhancedToast(toast);
        });
    }
}

function createEnhancedToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${getToastIcon(type)} me-3 fa-lg"></i>
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    return toast;
}

function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function showEnhancedToast(toast) {
    const container = document.getElementById('toastContainer');
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 500);
        }
    }, 5000);
}

function loadEnhancedMockData() {
    console.log('📊 Chargement des données mock améliorées...');
    
    // Enhanced alerts data
    const enhancedAlerts = [
        {
            id: 1,
            hopital: "Hôpital Saint-Louis",
            typeSang: "O-",
            quantite: 2,
            urgence: true,
            distance: "2.3 km",
            timestamp: "Il y a 15 min",
            besoin: "Urgence chirurgicale"
        },
        {
            id: 2,
            hopital: "Clinique du Val d'Or", 
            typeSang: "A+",
            quantite: 3,
            urgence: false,
            distance: "5.1 km",
            timestamp: "Il y a 2h",
            besoin: "Stock régulier"
        },
        {
            id: 3,
            hopital: "Hôpital Necker",
            typeSang: "B+",
            quantite: 1,
            urgence: true,
            distance: "3.7 km", 
            timestamp: "Il y a 5 min",
            besoin: "Accident de la route"
        }
    ];

    updateEnhancedAlerts(enhancedAlerts);
    updateEnhancedBadges();
    updateEnhancedHistory();
}

function updateEnhancedAlerts(alerts) {
    const containers = ['recentAlertsGrid', 'alertsContainer'];
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = alerts.map(alert => `
                <div class="alert-card-dashboard ${alert.urgence ? 'urgent' : ''}" 
                     onclick="handleEnhancedAlertClick(${alert.id})">
                    <div class="alert-header-dashboard">
                        <div class="alert-badge-dashboard ${alert.urgence ? '' : 'normal'}">
                            <i class="fas fa-${alert.urgence ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
                            ${alert.typeSang} • ${alert.quantite} unité(s)
                        </div>
                        <small class="text-muted">${alert.timestamp}</small>
                    </div>
                    <h6 class="mb-2">${alert.hopital}</h6>
                    <p class="mb-2 text-muted">${alert.besoin}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-${alert.urgence ? 'danger' : 'muted'}">
                            <i class="fas fa-map-marker-alt me-1"></i>À ${alert.distance}
                        </small>
                        <button class="btn btn-sm btn-${alert.urgence ? 'danger' : 'primary'}" 
                                onclick="event.stopPropagation(); handleQuickDonate(${alert.id})">
                            <i class="fas fa-heartbeat me-1"></i>Donner
                        </button>
                    </div>
                </div>
            `).join('');
        }
    });
}

function updateEnhancedBadges() {
    const badgesGrid = document.getElementById('badgesGrid');
    if (badgesGrid) {
        const badges = [
            { id: 1, name: "Premier Don", description: "Effectuez votre premier don", earned: true, progress: 100 },
            { id: 2, name: "Sauveur d'Urgence", description: "Répondez à 5 alertes urgentes", earned: true, progress: 100 },
            { id: 3, name: "Donneur Régulier", description: "10 dons effectués", earned: false, progress: 80 },
            { id: 4, name: "Héros Local", description: "Aidez 3 hôpitaux différents", earned: false, progress: 60 }
        ];

        badgesGrid.innerHTML = badges.map(badge => `
            <div class="badge-card ${badge.earned ? 'earned' : 'locked'}" 
                 onclick="handleBadgeClick(${badge.id})">
                <div class="badge-icon">
                    <i class="fas fa-${getBadgeIcon(badge.id)}"></i>
                </div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-description">${badge.description}</div>
                ${!badge.earned ? `
                    <div class="badge-progress">
                        <div class="badge-progress-bar" style="width: ${badge.progress}%"></div>
                    </div>
                    <div class="badge-progress-text">${badge.progress}% complété</div>
                ` : ''}
            </div>
        `).join('');
    }
}

function getBadgeIcon(badgeId) {
    const icons = ['trophy', 'star', 'medal', 'award'];
    return icons[badgeId - 1] || 'certificate';
}

function updateEnhancedHistory() {
    const historyContainer = document.getElementById('donationHistory');
    if (historyContainer) {
        const history = [
            { id: 1, hopital: "Hôpital Saint-Louis", date: "15 Fév 2024", type: "Sang total", volume: "450ml" },
            { id: 2, hopital: "Clinique du Val d'Or", date: "12 Jan 2024", type: "Sang total", volume: "450ml" },
            { id: 3, hopital: "Hôpital Necker", date: "08 Déc 2023", type: "Sang total", volume: "450ml" }
        ];

        historyContainer.innerHTML = history.map(donation => `
            <div class="donation-item" onclick="handleDonationClick(${donation.id})">
                <div class="donation-icon">
                    <i class="fas fa-syringe"></i>
                </div>
                <div class="donation-content">
                    <div class="donation-hospital">${donation.hopital}</div>
                    <div class="donation-details">${donation.type} • ${donation.volume}</div>
                    <div class="donation-meta">
                        <span><i class="fas fa-calendar me-1"></i>${donation.date}</span>
                        <span><i class="fas fa-clock me-1"></i>18 minutes</span>
                    </div>
                </div>
                <div class="donation-actions">
                    <button class="btn btn-outline-primary btn-sm" 
                            onclick="event.stopPropagation(); downloadCertificate(${donation.id})">
                        <i class="fas fa-download me-1"></i>Attestation
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function initializeRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        updateLiveCounters();
    }, 5000);

    // Simulate new alert every 30 seconds
    setInterval(() => {
        simulateNewAlert();
    }, 30000);
}

function updateLiveCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const current = parseInt(counter.textContent);
        const increment = Math.floor(Math.random() * 3);
        if (Math.random() > 0.3) { // 70% chance to increase
            counter.textContent = current + increment;
            counter.style.color = '#10b981';
            setTimeout(() => counter.style.color = '', 1000);
        }
    });
}

function simulateNewAlert() {
    const newAlert = {
        id: Date.now(),
        hopital: "Nouvel Hôpital",
        typeSang: "AB+",
        quantite: 1,
        urgence: Math.random() > 0.5,
        distance: (Math.random() * 10).toFixed(1) + " km",
        timestamp: "À l'instant",
        besoin: "Nouveau besoin identifié"
    };

    createEnhancedToast(`🚨 Nouvelle alerte: ${newAlert.hopital} a besoin de sang ${newAlert.typeSang}`, 'warning');
}

// Enhanced global functions
window.handleEnhancedAlertClick = function(alertId) {
    createEnhancedToast(`🔍 Affichage des détails de l'alerte ${alertId}`, 'info');
};

window.handleBadgeClick = function(badgeId) {
    createEnhancedToast(`🏅 Détails du badge ${badgeId}`, 'info');
};

window.handleDonationClick = function(donationId) {
    createEnhancedToast(`📋 Détails du don ${donationId}`, 'info');
};

window.downloadCertificate = function(donationId) {
    createEnhancedToast(`📄 Téléchargement de l'attestation pour le don ${donationId}`, 'success');
};

window.handleQuickDonate = function(alertId) {
    createEnhancedToast(`❤️ Merci! Votre don pour l'alerte ${alertId} a été enregistré`, 'success');
};

console.log('✨ Scripts du Dashboard BloodLink Pro Ultra-Pro chargés avec succès!');
// Classe Ultra Pro pour la gestion des dons
class UltraDonationManager {
    constructor() {
        this.selectedType = null;
        this.selectedCenter = null;
        this.selectedSlot = null;
        this.userLocation = null;
        this.recommendationEngine = new RecommendationEngine();
        this.mapManager = new MapManager();
        this.calendarManager = new CalendarManager();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserPreferences();
        this.initializeMap();
        this.setupRecommendationEngine();
        this.checkEligibility();
    }

    setupEventListeners() {
        // Navigation des tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.getAttribute('data-tab'));
            });
        });

        // Sélection des types de don
        document.querySelectorAll('.donation-type-advanced').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.btn')) {
                    this.selectDonationType(card.getAttribute('data-type'));
                }
            });
        });

        // Checklist interactive
        document.querySelectorAll('.check-input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateConfirmationState();
            });
        });

        // Géolocalisation
        document.getElementById('useLocationBtn').addEventListener('click', () => {
            this.getUserLocation();
        });

        // Recherche en temps réel
        document.getElementById('centerSearch').addEventListener('input', (e) => {
            this.searchCenters(e.target.value);
        });
    }

    // Moteur de recommandation intelligent
    setupRecommendationEngine() {
        this.recommendationEngine.analyzeUserProfile(this.currentUser);
        this.recommendationEngine.checkCurrentNeeds();
        this.displaySmartRecommendation();
    }

    displaySmartRecommendation() {
        const recommendation = this.recommendationEngine.getRecommendation();
        
        if (recommendation) {
            this.showSmartBanner(recommendation);
            this.highlightRecommendedType(recommendation.type);
        }
    }

    showSmartBanner(recommendation) {
        const banner = document.querySelector('.smart-banner');
        const reasons = recommendation.reasons.map(reason => 
            `<span><i class="fas fa-check"></i> ${reason}</span>`
        ).join('');

        banner.innerHTML = `
            <div class="banner-content">
                <div class="banner-main">
                    <div class="banner-icon">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="banner-text">
                        <h3>🎯 ${recommendation.title}</h3>
                        <p>${recommendation.description}</p>
                        <div class="recommendation-reasons">
                            ${reasons}
                        </div>
                    </div>
                </div>
                <div class="banner-actions">
                    <button class="btn btn-primary" onclick="donationManager.acceptRecommendation()">
                        <i class="fas fa-bolt"></i>
                        ${recommendation.actionText}
                    </button>
                    <button class="btn btn-outline" onclick="donationManager.seeOtherOptions()">
                        Voir autres options
                    </button>
                </div>
            </div>
        `;
    }

    acceptRecommendation() {
        const recommendation = this.recommendationEngine.getRecommendation();
        this.selectDonationType(recommendation.type);
        this.showToast('✅ Recommandation acceptée!', 'success');
    }

    // Gestion de la carte avancée
    initializeMap() {
        this.mapManager.init('advancedMap');
        this.loadNearbyCenters();
    }

    async loadNearbyCenters() {
        try {
            const centers = await this.api.getNearbyCenters({
                latitude: this.userLocation?.lat,
                longitude: this.userLocation?.lng,
                radius: document.getElementById('radiusFilter').value,
                type: this.selectedType
            });

            this.mapManager.displayCenters(centers);
            this.updateCentersList(centers);
        } catch (error) {
            console.error('Erreur chargement centres:', error);
            this.showToast('❌ Impossible de charger les centres', 'error');
        }
    }

    updateCentersList(centers) {
        const container = document.querySelector('.centers-list-advanced');
        container.innerHTML = centers.map(center => `
            <div class="center-card-advanced" data-center="${center.id}">
                <div class="center-header">
                    <div class="center-info">
                        <h5>${center.name}</h5>
                        <p><i class="fas fa-map-marker-alt"></i> ${center.address}</p>
                        <div class="center-meta">
                            <span><i class="fas fa-clock"></i> ${center.waitTime}</span>
                            <span><i class="fas fa-walking"></i> ${center.distance}</span>
                            <span><i class="fas fa-star"></i> ${center.rating}</span>
                        </div>
                    </div>
                    <div class="center-status">
                        <div class="status-badge ${center.status}">${center.statusText}</div>
                    </div>
                </div>
                <div class="center-features">
                    ${center.features.map(feature => 
                        `<span class="feature"><i class="fas fa-${feature.icon}"></i> ${feature.name}</span>`
                    ).join('')}
                </div>
                <div class="center-actions">
                    <button class="btn btn-sm btn-outline" onclick="donationManager.viewCenterDetails('${center.id}')">
                        <i class="fas fa-info"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="donationManager.selectCenter('${center.id}')">
                        Choisir
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Gestion du calendrier intelligent
    setupCalendar() {
        this.calendarManager.init({
            onDateSelect: (date) => this.onDateSelect(date),
            onSlotSelect: (slot) => this.onSlotSelect(slot),
            availableSlots: this.getAvailableSlots()
        });
    }

    getAvailableSlots() {
        // Simulation d'API - en réalité, ça viendrait du backend
        return {
            '2024-03-11': ['09:00', '09:30', '10:00', '14:00', '14:30'],
            '2024-03-12': ['09:00', '09:30', '10:00', '14:00', '15:00'],
            '2024-03-13': ['09:00', '14:00', '14:30', '15:00']
        };
    }

    onDateSelect(date) {
        this.selectedDate = date;
        this.loadTimeSlots(date);
        this.updateSlotPreview();
    }

    onSlotSelect(slot) {
        this.selectedSlot = slot;
        this.updateSlotPreview();
        this.enableStepNavigation(2);
    }

    updateSlotPreview() {
        if (this.selectedDate && this.selectedSlot) {
            const preview = document.getElementById('slotPreview');
            const dateTime = document.getElementById('previewDateTime');
            const location = document.getElementById('previewLocation');

            const formattedDate = this.formatDate(this.selectedDate);
            dateTime.textContent = `${formattedDate} - ${this.selectedSlot}`;
            location.textContent = this.selectedCenter?.name || 'Centre à sélectionner';

            preview.style.display = 'block';
        }
    }

    // Gestion des étapes
    nextStep(stepNumber) {
        this.validateCurrentStep(stepNumber - 1);
        this.showStep(stepNumber);
        this.updateNavigation(stepNumber);
        this.animateStepTransition(stepNumber);
    }

    previousStep(stepNumber) {
        this.showStep(stepNumber);
        this.updateNavigation(stepNumber);
    }

    showStep(stepNumber) {
        // Masquer toutes les étapes
        document.querySelectorAll('.process-step').forEach(step => {
            step.classList.remove('active');
        });

        // Afficher l'étape demandée
        document.getElementById(`step${stepNumber}`).classList.add('active');

        // Initialiser les composants spécifiques à l'étape
        this.initializeStepComponents(stepNumber);
    }

    initializeStepComponents(stepNumber) {
        switch(stepNumber) {
            case 1:
                this.setupDonationTypeSelection();
                break;
            case 2:
                this.initializeMap();
                this.setupCalendar();
                break;
            case 3:
                this.updateConfirmationDetails();
                this.setupChecklist();
                break;
            case 4:
                this.setupSuccessScreen();
                break;
        }
    }

    validateCurrentStep(stepNumber) {
        switch(stepNumber) {
            case 1:
                if (!this.selectedType) {
                    throw new Error('Veuillez sélectionner un type de don');
                }
                break;
            case 2:
                if (!this.selectedCenter || !this.selectedSlot) {
                    throw new Error('Veuillez sélectionner un centre et un créneau');
                }
                break;
            case 3:
                if (!this.isChecklistComplete()) {
                    throw new Error('Veuillez compléter la checklist de préparation');
                }
                break;
        }
    }

    // Confirmation et validation
    async confirmDonation() {
        try {
            this.showLoadingState();

            // Validation finale
            this.validateCurrentStep(3);

            // Préparation des données
            const donationData = {
                type: this.selectedType,
                centerId: this.selectedCenter.id,
                date: this.selectedDate,
                time: this.selectedSlot,
                userId: this.currentUser.id,
                preferences: this.getUserPreferences()
            };

            // Envoi à l'API
            const result = await this.api.createAppointment(donationData);

            // Mise à jour de l'interface
            this.showSuccessScreen(result);
            this.updateUserStats();
            this.sendConfirmationNotifications();

        } catch (error) {
            this.showError(error);
        } finally {
            this.hideLoadingState();
        }
    }

    // Fonctions utilitaires avancées
    async getUserLocation() {
        try {
            this.showToast('📍 Localisation en cours...', 'info');
            
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                });
            });

            this.userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            this.mapManager.centerMap(this.userLocation);
            this.loadNearbyCenters();
            this.showToast('✅ Localisation réussie!', 'success');

        } catch (error) {
            console.error('Erreur géolocalisation:', error);
            this.showToast('❌ Localisation impossible', 'error');
            this.useFallbackLocation();
        }
    }

    useFallbackLocation() {
        // Utiliser la dernière position connue ou une position par défaut
        this.userLocation = this.lastKnownLocation || {
            lat: 48.8566,
            lng: 2.3522
        };
        this.mapManager.centerMap(this.userLocation);
    }

    // Gestion des erreurs avancée
    showError(error) {
        console.error('Erreur donation:', error);
        
        const errorConfig = {
            'NETWORK_ERROR': {
                title: 'Erreur réseau',
                message: 'Vérifiez votre connexion internet',
                action: 'Réessayer'
            },
            'VALIDATION_ERROR': {
                title: 'Données invalides',
                message: error.message,
                action: 'Corriger'
            },
            'TIME_SLOT_TAKEN': {
                title: 'Créneau indisponible',
                message: 'Ce créneau vient d\'être réservé',
                action: 'Choisir un autre créneau'
            }
        };

        const config = errorConfig[error.code] || {
            title: 'Erreur',
            message: 'Une erreur est survenue',
            action: 'Réessayer'
        };

        this.showErrorModal(config);
    }

    showErrorModal(config) {
        const modal = document.createElement('div');
        modal.className = 'error-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>${config.title}</h3>
                <p>${config.message}</p>
                <div class="error-actions">
                    <button class="btn btn-primary" onclick="this.closest('.error-modal').remove()">
                        ${config.action}
                    </button>
                    <button class="btn btn-outline" onclick="donationManager.contactSupport()">
                        <i class="fas fa-headset"></i>
                        Support
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Analytics et tracking
    trackUserJourney(step, action, data = {}) {
        const eventData = {
            step,
            action,
            userId: this.currentUser.id,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ...data
        };

        this.analytics.track('donation_journey', eventData);
    }

    // Gestion des états de chargement
    showLoadingState() {
        document.body.classList.add('loading');
        this.disableInteractions();
    }

    hideLoadingState() {
        document.body.classList.remove('loading');
        this.enableInteractions();
    }

    disableInteractions() {
        document.querySelectorAll('button, input, select').forEach(el => {
            el.disabled = true;
        });
    }

    enableInteractions() {
        document.querySelectorAll('button, input, select').forEach(el => {
            el.disabled = false;
        });
    }
}

// Moteur de recommandation
class RecommendationEngine {
    analyzeUserProfile(user) {
        this.user = user;
        this.analysis = {
            bloodType: user.bloodType,
            lastDonation: user.lastDonation,
            donationFrequency: user.donationFrequency,
            preferredCenters: user.preferredCenters,
            healthConditions: user.healthConditions
        };
    }

    checkCurrentNeeds() {
        // Simulation de données en temps réel des besoins
        this.currentNeeds = {
            'blood': { level: 'high', urgency: 'medium', points: 50 },
            'plasma': { level: 'medium', urgency: 'low', points: 75 },
            'platelets': { level: 'critical', urgency: 'high', points: 100 }
        };
    }

    getRecommendation() {
        const scores = this.calculateScores();
        const bestType = Object.keys(scores).reduce((a, b) => 
            scores[a] > scores[b] ? a : b
        );

        return {
            type: bestType,
            title: this.getRecommendationTitle(bestType),
            description: this.getRecommendationDescription(bestType),
            reasons: this.getRecommendationReasons(bestType),
            actionText: this.getActionText(bestType),
            confidence: scores[bestType]
        };
    }

    calculateScores() {
        const scores = {};
        const types = ['blood', 'plasma', 'platelets'];

        types.forEach(type => {
            let score = 0;
            
            // Score basé sur les besoins actuels
            score += this.getNeedScore(type);
            
            // Score basé sur la compatibilité utilisateur
            score += this.getCompatibilityScore(type);
            
            // Score basé sur l'historique
            score += this.getHistoryScore(type);
            
            // Bonus points
            score += this.getBonusPoints(type);

            scores[type] = score;
        });

        return scores;
    }

    getNeedScore(type) {
        const need = this.currentNeeds[type];
        const needScores = {
            'critical': 100,
            'high': 75,
            'medium': 50,
            'low': 25
        };
        return needScores[need.level] || 0;
    }

    getCompatibilityScore(type) {
        // Logique de compatibilité avancée
        const compatibility = {
            'blood': this.user.bloodType !== null ? 100 : 0,
            'plasma': this.canDonatePlasma() ? 80 : 0,
            'platelets': this.canDonatePlatelets() ? 60 : 0
        };
        return compatibility[type] || 0;
    }

    canDonatePlasma() {
        return this.user.weight > 50 && 
               !this.user.healthConditions.includes('bleeding_disorder');
    }

    canDonatePlatelets() {
        return this.user.weight > 50 &&
               this.user.plateletCount > 150 &&
               !this.user.recentMedications.includes('aspirin');
    }
}

// Gestionnaire de carte avancé
class MapManager {
    init(mapElementId) {
        this.map = L.map(mapElementId).setView([48.8566, 2.3522], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);

        this.setupMapControls();
        this.addUserLocationMarker();
    }

    setupMapControls() {
        // Contrôles personnalisés
        this.map.addControl(new L.Control.Zoom({ position: 'topright' }));
        
        // Layer pour les centres
        this.centersLayer = L.layerGroup().addTo(this.map);
    }

    addUserLocationMarker() {
        if (this.userLocation) {
            L.marker([this.userLocation.lat, this.userLocation.lng])
                .addTo(this.map)
                .bindPopup('Votre position')
                .openPopup();
        }
    }

    displayCenters(centers) {
        this.centersLayer.clearLayers();

        centers.forEach(center => {
            const marker = L.marker([center.latitude, center.longitude])
                .addTo(this.centersLayer);

            const popupContent = this.createCenterPopup(center);
            marker.bindPopup(popupContent);

            marker.on('click', () => {
                this.onCenterSelect(center);
            });
        });

        // Ajuster la vue pour montrer tous les centres
        if (centers.length > 0) {
            const group = new L.featureGroup(centers.map(c => 
                L.marker([c.latitude, c.longitude])
            ));
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    createCenterPopup(center) {
        return `
            <div class="map-popup-advanced">
                <h4>${center.name}</h4>
                <p>${center.address}</p>
                <div class="popup-meta">
                    <span><i class="fas fa-clock"></i> ${center.waitTime}</span>
                    <span><i class="fas fa-star"></i> ${center.rating}</span>
                </div>
                <div class="popup-actions">
                    <button class="btn btn-sm btn-primary" onclick="donationManager.selectCenter('${center.id}')">
                        Choisir ce centre
                    </button>
                </div>
            </div>
        `;
    }

    centerMap(coordinates) {
        this.map.setView([coordinates.lat, coordinates.lng], 13);
    }

    zoomIn() {
        this.map.zoomIn();
    }

    zoomOut() {
        this.map.zoomOut();
    }
}

// Gestionnaire de calendrier intelligent
class CalendarManager {
    init(config) {
        this.config = config;
        this.setupCalendarUI();
        this.loadAvailableSlots();
    }

    setupCalendarUI() {
        this.createCalendarHeader();
        this.createWeekView();
        this.setupTimeSlotGrid();
    }

    createCalendarHeader() {
        // Navigation entre semaines
        // Affichage de la période courante
        // Indicateurs de disponibilité
    }

    createWeekView() {
        // Vue semaine avec jours et créneaux
        // Indicateurs visuels de disponibilité
        // Sélection de date
    }

    setupTimeSlotGrid() {
        // Grille de créneaux horaires
        // Système de réservation en temps réel
        // Indicateurs de popularité
    }

    loadAvailableSlots() {
        // Chargement asynchrone des créneaux
        // Mise à jour en temps réel
        // Gestion des conflits
    }

    onSlotSelect(slot) {
        this.config.onSlotSelect(slot);
        this.highlightSelectedSlot(slot);
    }

    highlightSelectedSlot(slot) {
        // Mise en évidence visuelle du créneau sélectionné
        // Animation de confirmation
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.donationManager = new UltraDonationManager();
});
// Gestionnaire des Rendez-vous Ultra Pro
class UltraAppointmentsManager {
    constructor() {
        this.currentTab = 'upcoming';
        this.appointments = [];
        this.filters = {
            period: 'all',
            sort: 'recent'
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAppointments();
        this.initializeCalendar();
        this.setupRealTimeUpdates();
    }

    setupEventListeners() {
        // Navigation par onglets
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.getAttribute('data-tab'));
            });
        });

        // Filtres historiques
        document.getElementById('historyPeriod').addEventListener('change', (e) => {
            this.filters.period = e.target.value;
            this.filterHistory();
        });

        document.getElementById('historySort').addEventListener('change', (e) => {
            this.filters.sort = e.target.value;
            this.sortHistory();
        });
    }

    switchTab(tabName) {
        // Mettre à jour les boutons d'onglets
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Mettre à jour le contenu des onglets
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;
        this.trackTabSwitch(tabName);
    }

    async loadAppointments() {
        try {
            this.showLoadingState();
            
            // Simulation d'API
            const data = await this.api.getAppointments({
                userId: this.currentUser.id,
                includeHistory: true
            });

            this.appointments = data;
            this.renderAppointments();
            this.updateStats();

        } catch (error) {
            this.showError('Erreur lors du chargement des rendez-vous');
        } finally {
            this.hideLoadingState();
        }
    }

    renderAppointments() {
        this.renderUpcomingAppointments();
        this.renderHistory();
    }

    renderUpcomingAppointments() {
        const upcoming = this.appointments.filter(apt => 
            apt.status === 'confirmed' && new Date(apt.date) > new Date()
        );

        // Mettre à jour le compteur
        document.querySelector('[data-tab="upcoming"]').innerHTML = `
            <i class="fas fa-calendar-check"></i>
            À venir (${upcoming.length})
        `;

        // Rendu des cartes (simplifié)
        // En réalité, on utiliserait un template engine
    }

    // Fonctionnalités principales
    viewDetails(appointmentId) {
        const appointment = this.getAppointmentById(appointmentId);
        this.showAppointmentModal(appointment);
    }

    editAppointment(appointmentId) {
        const appointment = this.getAppointmentById(appointmentId);
        this.openEditForm(appointment);
    }

    async cancelAppointment(appointmentId) {
        if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
            return;
        }

        try {
            await this.api.cancelAppointment(appointmentId);
            this.showToast('✅ Rendez-vous annulé avec succès', 'success');
            this.loadAppointments(); // Recharger les données
        } catch (error) {
            this.showError('Erreur lors de l\'annulation du rendez-vous');
        }
    }

    reschedule(appointmentId) {
        const appointment = this.getAppointmentById(appointmentId);
        this.openRescheduler(appointment);
    }

    addToCalendar(appointmentId) {
        const appointment = this.getAppointmentById(appointmentId);
        this.downloadCalendarFile(appointment);
    }

    getDirections(appointmentId) {
        const appointment = this.getAppointmentById(appointmentId);
        const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(appointment.address)}`;
        window.open(mapsUrl, '_blank');
    }

    shareAppointment(appointmentId) {
        const appointment = this.getAppointmentById(appointmentId);
        this.showShareModal(appointment);
    }

    viewPreparation(appointmentId) {
        const appointment = this.getAppointmentById(appointmentId);
        this.showPreparationGuide(appointment);
    }

    downloadCertificate(appointmentId) {
        const appointment = this.getAppointmentById(appointmentId);
        this.generateCertificatePDF(appointment);
    }

    viewImpact(appointmentId) {
        const appointment = this.getAppointmentById(appointmentId);
        this.showImpactAnalysis(appointment);
    }

    // Gestion du calendrier
    initializeCalendar() {
        this.calendar = new MiniCalendar({
            onDateClick: (date) => this.onCalendarDateClick(date),
            appointments: this.getCalendarAppointments()
        });
        this.calendar.render();
    }

    getCalendarAppointments() {
        return this.appointments.map(apt => ({
            date: apt.date,
            type: apt.type,
            status: apt.status
        }));
    }

    onCalendarDateClick(date) {
        const appointmentsOnDate = this.appointments.filter(apt => 
            apt.date.split('T')[0] === date
        );
        
        if (appointmentsOnDate.length > 0) {
            this.showDateAppointmentsModal(appointmentsOnDate, date);
        } else {
            this.scheduleNewOnDate(date);
        }
    }

    // Actions rapides
    scheduleNew() {
        window.location.hash = '#donate';
    }

    importCalendar() {
        this.showImportCalendarModal();
    }

    setPreferences() {
        this.showPreferencesModal();
    }

    contactSupport() {
        this.openSupportChat();
    }

    exportHistory() {
        this.generateHistoryExport();
    }

    // Fonctions utilitaires
    getAppointmentById(id) {
        return this.appointments.find(apt => apt.id === id);
    }

    filterHistory() {
        const filtered = this.appointments.filter(apt => {
            if (this.filters.period === 'all') return true;
            
            const aptDate = new Date(apt.date);
            const now = new Date();
            
            switch(this.filters.period) {
                case 'year':
                    return aptDate.getFullYear() === now.getFullYear();
                case 'month':
                    return aptDate.getMonth() === now.getMonth() && 
                           aptDate.getFullYear() === now.getFullYear();
                case 'week':
                    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                    return aptDate >= weekStart;
                default:
                    return true;
            }
        });

        this.renderFilteredHistory(filtered);
    }

    sortHistory() {
        const sorted = [...this.appointments].sort((a, b) => {
            switch(this.filters.sort) {
                case 'recent':
                    return new Date(b.date) - new Date(a.date);
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'center':
                    return a.center.localeCompare(b.center);
                case 'type':
                    return a.type.localeCompare(b.type);
                default:
                    return 0;
            }
        });

        this.renderSortedHistory(sorted);
    }

    // Mise à jour en temps réel
    setupRealTimeUpdates() {
        // Écouter les changements de statut
        this.setupWebSocket();
        
        // Vérifier les rappels
        this.setupReminderChecks();
    }

    setupWebSocket() {
        // Connexion WebSocket pour les mises à jour en temps réel
        this.socket = new WebSocket('/appointments');
        
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleRealTimeUpdate(data);
        };
    }

    handleRealTimeUpdate(update) {
        switch(update.type) {
            case 'status_change':
                this.updateAppointmentStatus(update.appointmentId, update.newStatus);
                break;
            case 'new_appointment':
                this.addNewAppointment(update.appointment);
                break;
            case 'cancellation':
                this.removeAppointment(update.appointmentId);
                break;
        }
    }

    setupReminderChecks() {
        // Vérifier les rappels toutes les minutes
        setInterval(() => {
            this.checkUpcomingReminders();
        }, 60000);
    }

    checkUpcomingReminders() {
        const now = new Date();
        const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const upcomingAppointments = this.appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate > now && aptDate <= oneDayFromNow && !apt.reminderSent;
        });

        upcomingAppointments.forEach(apt => {
            this.sendReminder(apt);
        });
    }

    sendReminder(appointment) {
        // Envoyer une notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Rappel de don de sang', {
                body: `Votre rendez-vous est demain à ${appointment.time}`,
                icon: '/icons/heart.png'
            });
        }

        // Marquer comme rappel envoyé
        appointment.reminderSent = true;
    }

    // Gestion des états
    showLoadingState() {
        document.querySelector('.appointments-grid').innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Chargement des rendez-vous...</p>
            </div>
        `;
    }

    hideLoadingState() {
        // Cacher l'indicateur de chargement
    }

    showToast(message, type) {
        // Afficher une notification toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }

    showError(message) {
        this.showToast(message, 'error');
    }
}

// Calendrier Miniature
class MiniCalendar {
    constructor(config) {
        this.config = config;
        this.currentDate = new Date();
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const container = document.querySelector('.calendar-grid');
        if (!container) return;

        // Nettoyer le contenu existant
        container.innerHTML = '';

        // Ajouter les en-têtes de jours
        const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        days.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day-header';
            dayElement.textContent = day;
            container.appendChild(dayElement);
        });

        // Ajouter les jours du mois
        const daysInMonth = this.getDaysInMonth();
        const firstDay = this.getFirstDayOfMonth();
        
        // Jours vides au début
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            container.appendChild(emptyDay);
        }

        // Jours du mois
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            dayElement.setAttribute('data-date', this.formatDate(day));

            // Vérifier s'il y a des rendez-vous ce jour
            if (this.hasAppointmentsOnDay(day)) {
                dayElement.classList.add('has-appointment');
            }

            dayElement.addEventListener('click', () => {
                this.onDayClick(day);
            });

            container.appendChild(dayElement);
        }
    }

    getDaysInMonth() {
        return new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + 1,
            0
        ).getDate();
    }

    getFirstDayOfMonth() {
        const firstDay = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            1
        );
        // Lundi = 0, Dimanche = 6
        return (firstDay.getDay() + 6) % 7;
    }

    formatDate(day) {
        return `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    hasAppointmentsOnDay(day) {
        const dateStr = this.formatDate(day);
        return this.config.appointments.some(apt => 
            apt.date.split('T')[0] === dateStr
        );
    }

    onDayClick(day) {
        const date = this.formatDate(day);
        this.config.onDateClick(date);
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
        this.updateHeader();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
        this.updateHeader();
    }

    updateHeader() {
        const header = document.querySelector('.calendar-header h4');
        if (header) {
            header.textContent = this.currentDate.toLocaleDateString('fr-FR', {
                month: 'long',
                year: 'numeric'
            });
        }
    }

    setupEventListeners() {
        document.querySelector('.calendar-header .btn:first-child').addEventListener('click', () => {
            this.previousMonth();
        });

        document.querySelector('.calendar-header .btn:last-child').addEventListener('click', () => {
            this.nextMonth();
        });
    }
}

// ===== RÉSEAU SOCIAL - GESTION DES INTERACTIONS =====
class NetworkManager {
    constructor() {
        this.currentTab = 'feed';
        this.posts = [];
        this.messages = [];
        this.friends = [];
        this.groups = [];
        this.events = [];
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupPostInteractions();
        this.setupMessageSystem();
        this.loadMockData();
        console.log('🌐 Réseau social BloodLink initialisé');
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        const navLinks = document.querySelectorAll('.nav-link[data-tab]');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = btn.dataset.tab;
                this.switchTab(targetTab);
            });
        });

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = link.dataset.tab;
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.tab === tabName);
        });

        // Update tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.id === `${tabName}-tab`);
        });

        this.currentTab = tabName;
        console.log(`🔄 Changement vers l'onglet: ${tabName}`);
    }

    setupPostInteractions() {
        // Like buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.like-btn')) {
                this.toggleLike(e.target.closest('.like-btn'));
            }
        });

        // Comment buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.engagement-btn')) {
                const btn = e.target.closest('.engagement-btn');
                if (btn.textContent.includes('Commenter')) {
                    this.focusComment(btn);
                }
            }
        });

        // Share buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.engagement-btn')) {
                const btn = e.target.closest('.engagement-btn');
                if (btn.textContent.includes('Partager')) {
                    this.sharePost(btn);
                }
            }
        });
    }

    toggleLike(button) {
        button.classList.toggle('active');
        const isActive = button.classList.contains('active');
        const icon = button.querySelector('i');
        
        if (isActive) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.showNotification('❤️ Publication aimée', 'success');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.showNotification('💔 Like retiré', 'info');
        }

        // Update like count
        const postCard = button.closest('.post-card');
        const statsItem = postCard.querySelector('.stats-item');
        if (statsItem) {
            const currentCount = parseInt(statsItem.textContent) || 0;
            const newCount = isActive ? currentCount + 1 : currentCount - 1;
            statsItem.innerHTML = `<i class="fas fa-heart"></i><span>${newCount} vies sauvées</span>`;
        }
    }

    focusComment(button) {
        const postCard = button.closest('.post-card');
        const commentInput = postCard.querySelector('.comment-field');
        if (commentInput) {
            commentInput.focus();
            commentInput.placeholder = "Écrivez votre commentaire...";
        }
    }

    sharePost(button) {
        this.showNotification('📤 Publication partagée', 'success');
        // In a real app, this would open a share dialog
    }

    setupMessageSystem() {
        // Conversation switching
        document.addEventListener('click', (e) => {
            if (e.target.closest('.conversation-item')) {
                const conversation = e.target.closest('.conversation-item');
                this.switchConversation(conversation);
            }
        });

        // Message sending
        const messageField = document.querySelector('.message-field');
        const sendButton = document.querySelector('.chat-input .btn-primary');
        
        if (messageField && sendButton) {
            const sendMessage = () => {
                const message = messageField.value.trim();
                if (message) {
                    this.sendMessage(message);
                    messageField.value = '';
                }
            };

            sendButton.addEventListener('click', sendMessage);
            messageField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }

    switchConversation(conversation) {
        // Update active conversation
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.classList.remove('active');
        });
        conversation.classList.add('active');

        // Update chat header
        const partnerName = conversation.querySelector('strong').textContent;
        const chatHeader = document.querySelector('.chat-partner strong');
        if (chatHeader) {
            chatHeader.textContent = partnerName;
        }

        // Clear unread badge
        const unreadBadge = conversation.querySelector('.unread-badge');
        if (unreadBadge) {
            unreadBadge.remove();
        }
    }

    sendMessage(message) {
        const chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages) return;

        const messageHTML = `
            <div class="message sent" data-aos="fade-up">
                <div class="message-content">
                    <p>${message}</p>
                    <span class="message-time">${this.getCurrentTime()}</span>
                </div>
            </div>
        `;

        chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Simulate response
        setTimeout(() => {
            this.simulateResponse();
        }, 1000);
    }

    simulateResponse() {
        const responses = [
            "Merci pour ton message !",
            "Super idée !",
            "Je suis d'accord avec toi",
            "On devrait se voir bientôt",
            "Tu viens à la collecte ?"
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const chatMessages = document.querySelector('.chat-messages');
        
        if (chatMessages) {
            const messageHTML = `
                <div class="message received" data-aos="fade-up">
                    <div class="message-content">
                        <p>${randomResponse}</p>
                        <span class="message-time">${this.getCurrentTime()}</span>
                    </div>
                </div>
            `;
            
            chatMessages.insertAdjacentHTML('beforeend', messageHTML);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    loadMockData() {
        // Mock posts data
        this.posts = [
            {
                id: 1,
                author: 'Marie Laurent',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=48&h=48&fit=crop&crop=face',
                content: '🎉 Je viens de faire mon 8ème don ! Merci à l\'équipe de l\'Hôpital Saint-Louis pour leur accueil chaleureux.',
                likes: 24,
                comments: 8,
                shares: 3,
                time: '2h',
                achievement: 'Badge "Donneur Régulier" débloqué !'
            }
        ];

        // Mock friends data
        this.friends = [
            {
                id: 1,
                name: 'Marie Laurent',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
                bloodType: 'A+',
                level: 'Argent',
                donations: 18,
                livesSaved: 54,
                mutualFriends: 12,
                online: true
            }
        ];
    }

    // Public methods for HTML onclick handlers
    createPost() {
        this.showNotification('📝 Éditeur de publication en cours de développement', 'info');
    }

    editProfile() {
        this.showNotification('✏️ Éditeur de profil en cours de développement', 'info');
    }

    sendFriendRequest(userId) {
        this.showNotification('👋 Demande d\'ami envoyée', 'success');
    }

    messageFriend(friendId) {
        this.switchTab('messages');
        this.showNotification('💬 Conversation ouverte', 'success');
    }

    viewProfile(userId) {
        this.showNotification('👤 Profil utilisateur en cours de chargement', 'info');
    }

    inviteToEvent(friendId) {
        this.showNotification('📅 Invitation envoyée', 'success');
    }

    joinGroup(groupId) {
        this.showNotification('👥 Vous avez rejoint le groupe', 'success');
    }

    requestToJoin(groupId) {
        this.showNotification('⏳ Demande d\'adhésion envoyée', 'info');
    }

    viewGroup(groupId) {
        this.showNotification('👥 Groupe en cours de chargement', 'info');
    }

    createEvent() {
        this.showNotification('📅 Création d\'événement en cours de développement', 'info');
    }

    joinEvent(eventId) {
        this.showNotification('✅ Participation confirmée', 'success');
    }

    startNewConversation() {
        this.showNotification('💬 Nouvelle conversation en cours de développement', 'info');
    }

    openPostEditor() {
        this.showNotification('📝 Éditeur de publication en cours de développement', 'info');
    }

    attachPhoto() {
        this.showNotification('📷 Sélection de photo en cours de développement', 'info');
    }

    shareAchievement() {
        this.showNotification('🏆 Partage de réussite en cours de développement', 'info');
    }

    shareDonation() {
        this.showNotification('🩸 Partage de don en cours de développement', 'info');
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `network-notification network-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.appointments = new UltraAppointmentsManager();
    window.calendar = window.appointments.calendar;
    window.network = new NetworkManager();
});
// Gestionnaire du Réseau Ultra Sophistiqué
class UltraNetworkManager {
    constructor() {
        this.currentUser = null;
        this.friends = [];
        this.groups = [];
        this.events = [];
        this.messages = [];
        this.posts = [];
        this.currentTab = 'feed';
        this.selectedConversation = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.loadNetworkData();
        this.setupRealTimeUpdates();
        this.initializeNotifications();
    }

    setupEventListeners() {
        // Navigation par onglets
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.getAttribute('data-tab'));
            });
        });

        // Navigation sidebar
        document.querySelectorAll('.nav-link[data-tab]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(link.getAttribute('data-tab'));
            });
        });

        // Recherche en temps réel
        const searchInput = document.querySelector('.search-friends input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.searchFriends(e.target.value);
            }, 300));
        }

        // Envoi de messages
        const messageInput = document.querySelector('.message-field');
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Sélection de conversations
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectConversation(item);
            });
        });
    }

    // Chargement des données
    async loadUserData() {
        try {
            this.currentUser = await this.api.getCurrentUser();
            this.renderUserProfile();
        } catch (error) {
            console.error('Erreur chargement utilisateur:', error);
        }
    }

    async loadNetworkData() {
        try {
            const [
                friendsData,
                groupsData,
                eventsData,
                messagesData,
                postsData
            ] = await Promise.all([
                this.api.getFriends(),
                this.api.getGroups(),
                this.api.getEvents(),
                this.api.getMessages(),
                this.api.getPosts()
            ]);

            this.friends = friendsData;
            this.groups = groupsData;
            this.events = eventsData;
            this.messages = messagesData;
            this.posts = postsData;

            this.renderAllData();
        } catch (error) {
            console.error('Erreur chargement données réseau:', error);
        }
    }

    // Rendu des données
    renderAllData() {
        this.renderFriends();
        this.renderGroups();
        this.renderEvents();
        this.renderMessages();
        this.renderPosts();
        this.renderSuggestions();
        this.renderActivity();
    }

    renderUserProfile() {
        const profileCard = document.querySelector('.profile-card-network');
        if (profileCard && this.currentUser) {
            // Mise à jour des informations du profil
        }
    }

    renderFriends() {
        const container = document.querySelector('.friends-grid');
        if (!container) return;

        container.innerHTML = this.friends.map(friend => `
            <div class="friend-card" data-aos="fade-up">
                <div class="friend-header">
                    <div class="user-avatar">
                        <img src="${friend.avatar}" alt="${friend.name}">
                        <div class="online-status ${friend.online ? 'online' : 'offline'}"></div>
                    </div>
                    <div class="friend-actions">
                        <button class="btn btn-sm btn-outline" onclick="network.messageFriend(${friend.id})">
                            <i class="fas fa-comment"></i>
                        </button>
                    </div>
                </div>
                <div class="friend-info">
                    <h4>${friend.name}</h4>
                    <p class="friend-title">${friend.bloodType} • ${friend.level}</p>
                    <div class="friend-stats">
                        <div class="stat">
                            <strong>${friend.donationCount}</strong>
                            <span>Dons</span>
                        </div>
                        <div class="stat">
                            <strong>${friend.livesSaved}</strong>
                            <span>Vies</span>
                        </div>
                    </div>
                    <div class="friend-mutual">
                        <span>${friend.mutualFriends} amis en commun</span>
                    </div>
                </div>
                <div class="friend-footer">
                    <button class="btn btn-sm btn-outline" onclick="network.viewProfile(${friend.id})">
                        Voir profil
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="network.inviteToEvent(${friend.id})">
                        Inviter
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderGroups() {
        const container = document.querySelector('.groups-grid');
        if (!container) return;

        container.innerHTML = this.groups.map(group => `
            <div class="group-card" data-aos="fade-up">
                <div class="group-header">
                    <div class="group-avatar">
                        <i class="fas fa-${group.icon}"></i>
                    </div>
                    <div class="group-actions">
                        <button class="btn btn-sm btn-outline" onclick="network.leaveGroup(${group.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="group-info">
                    <h4>${group.name}</h4>
                    <p class="group-description">${group.description}</p>
                    <div class="group-stats">
                        <div class="stat">
                            <i class="fas fa-users"></i>
                            <span>${this.formatNumber(group.memberCount)} membres</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-comment"></i>
                            <span>${group.weeklyPosts} publications/semaine</span>
                        </div>
                    </div>
                </div>
                <div class="group-footer">
                    <div class="members-preview">
                        ${group.recentMembers.map(member => `
                            <img src="${member.avatar}" alt="${member.name}">
                        `).join('')}
                        <span class="more-count">+${this.formatNumber(group.memberCount - 3)}</span>
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="network.viewGroup(${group.id})">
                        Voir groupe
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderPosts() {
        const container = document.querySelector('.feed-posts');
        if (!container) return;

        container.innerHTML = this.posts.map(post => `
            <div class="post-card ${post.type === 'event' ? 'event-post' : ''}" data-aos="fade-up">
                ${this.getPostHeaderHTML(post)}
                <div class="post-content">
                    ${this.getPostContentHTML(post)}
                </div>
                ${this.getPostEngagementHTML(post)}
            </div>
        `).join('');
    }

    // Gestion des onglets
    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Mettre à jour la navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Afficher le contenu
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Actions spécifiques à l'onglet
        this.onTabChange(tabName);
    }

    onTabChange(tabName) {
        switch(tabName) {
            case 'messages':
                this.loadConversations();
                break;
            case 'ranking':
                this.loadRanking();
                break;
            case 'events':
                this.loadEvents();
                break;
        }
    }

    // Fonctionnalités sociales
    async sendFriendRequest(userId) {
        try {
            await this.api.sendFriendRequest(userId);
            this.showToast('Demande d\'ami envoyée !', 'success');
            this.updateSuggestions();
        } catch (error) {
            this.showToast('Erreur lors de l\'envoi de la demande', 'error');
        }
    }

    async createPost() {
        const modal = new PostCreationModal();
        const postData = await modal.show();
        
        if (postData) {
            try {
                const newPost = await this.api.createPost(postData);
                this.posts.unshift(newPost);
                this.renderPosts();
                this.showToast('Publication créée !', 'success');
            } catch (error) {
                this.showToast('Erreur lors de la création de la publication', 'error');
            }
        }
    }

    async joinEvent(eventId) {
        try {
            await this.api.joinEvent(eventId);
            this.showToast('Vous participez à l\'événement !', 'success');
            this.updateEventParticipation(eventId, true);
        } catch (error) {
            this.showToast('Erreur lors de la participation', 'error');
        }
    }

    async likePost(postId) {
        try {
            await this.api.likePost(postId);
            this.updatePostLikes(postId, true);
        } catch (error) {
            console.error('Erreur like:', error);
        }
    }

    async commentOnPost(postId, comment) {
        try {
            await this.api.commentOnPost(postId, comment);
            this.updatePostComments(postId, comment);
        } catch (error) {
            this.showToast('Erreur lors du commentaire', 'error');
        }
    }

    async sendMessage() {
        const input = document.querySelector('.message-field');
        const message = input.value.trim();
        
        if (!message || !this.selectedConversation) return;

        try {
            await this.api.sendMessage(this.selectedConversation.id, message);
            this.addMessageToChat(message, true);
            input.value = '';
        } catch (error) {
            this.showToast('Erreur lors de l\'envoi du message', 'error');
        }
    }

    // Gestion des conversations
    selectConversation(conversationElement) {
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.classList.remove('active');
        });
        conversationElement.classList.add('active');

        const conversationId = conversationElement.dataset.conversationId;
        this.selectedConversation = this.messages.find(m => m.id === conversationId);
        
        this.renderChat();
    }

    renderChat() {
        if (!this.selectedConversation) return;

        const messagesContainer = document.querySelector('.chat-messages');
        messagesContainer.innerHTML = this.selectedConversation.messages.map(msg => `
            <div class="message ${msg.sent ? 'sent' : 'received'}">
                <div class="message-content">
                    <p>${msg.content}</p>
                    <span class="message-time">${this.formatTime(msg.timestamp)}</span>
                </div>
            </div>
        `).join('');

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Recherche et filtres
    searchFriends(query) {
        if (!query) {
            this.renderFriends();
            return;
        }

        const filtered = this.friends.filter(friend =>
            friend.name.toLowerCase().includes(query.toLowerCase()) ||
            friend.bloodType.toLowerCase().includes(query.toLowerCase())
        );

        this.renderFilteredFriends(filtered);
    }

    // Mise à jour en temps réel
    setupRealTimeUpdates() {
        // WebSocket pour les messages en temps réel
        this.socket = new WebSocket('/network');
        
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleRealTimeUpdate(data);
        };

        // Mise à jour périodique des statuts
        setInterval(() => {
            this.updateOnlineStatus();
        }, 30000);
    }

    handleRealTimeUpdate(update) {
        switch(update.type) {
            case 'new_message':
                this.handleNewMessage(update.message);
                break;
            case 'friend_request':
                this.handleFriendRequest(update.request);
                break;
            case 'post_like':
                this.handlePostLike(update);
                break;
            case 'user_online':
                this.updateUserOnlineStatus(update.userId, true);
                break;
            case 'user_offline':
                this.updateUserOnlineStatus(update.userId, false);
                break;
        }
    }

    handleNewMessage(message) {
        if (message.conversationId === this.selectedConversation?.id) {
            this.addMessageToChat(message.content, false);
        }
        
        this.updateUnreadCount(message.conversationId);
        this.showNotification('Nouveau message', `${message.senderName}: ${message.content}`);
    }

    // Notifications
    initializeNotifications() {
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    }

    showNotification(title, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/icons/bloodlink-heart.png'
            });
        }
    }

    // Utilitaires
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showToast(message, type = 'info') {
        // Implémentation du système de toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // Méthodes de template
    getPostHeaderHTML(post) {
        return `
            <div class="post-header">
                <div class="post-author">
                    <div class="user-avatar">
                        <img src="${post.author.avatar}" alt="${post.author.name}">
                        ${post.author.online ? '<div class="online-status online"></div>' : ''}
                    </div>
                    <div class="author-info">
                        <strong>${post.author.name}</strong>
                        <span>${post.timeAgo}</span>
                    </div>
                </div>
                <div class="post-actions">
                    <button class="btn btn-sm btn-outline">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
        `;
    }

    getPostContentHTML(post) {
        if (post.type === 'event') {
            return this.getEventPostHTML(post);
        }
        
        return `
            <p>${post.content}</p>
            ${post.achievement ? this.getAchievementHTML(post.achievement) : ''}
        `;
    }

    getEventPostHTML(post) {
        return `
            <h4>${post.event.emoji} ${post.event.title}</h4>
            <p>${post.event.description}</p>
            <div class="event-details">
                <div class="event-info">
                    <i class="fas fa-calendar"></i>
                    <div>
                        <strong>${post.event.date}</strong>
                        <span>${post.event.time}</span>
                    </div>
                </div>
                <div class="event-info">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <strong>${post.event.location.name}</strong>
                        <span>${post.event.location.address}</span>
                    </div>
                </div>
            </div>
            <div class="event-participants">
                <div class="participants-avatars">
                    ${post.event.participants.slice(0, 3).map(p => `
                        <img src="${p.avatar}" alt="${p.name}">
                    `).join('')}
                    <span class="more-count">+${post.event.participants.length - 3}</span>
                </div>
                <button class="btn btn-primary" onclick="network.joinEvent(${post.event.id})">
                    <i class="fas fa-check"></i>
                    Participer
                </button>
            </div>
        `;
    }

    getAchievementHTML(achievement) {
        return `
            <div class="post-achievement">
                <div class="achievement-badge">
                    <i class="fas fa-medal"></i>
                    ${achievement.text}
                </div>
            </div>
        `;
    }

    getPostEngagementHTML(post) {
        return `
            <div class="post-stats">
                <div class="stats-item">
                    <i class="fas fa-heart"></i>
                    <span>${post.likes} j'aime</span>
                </div>
                <div class="stats-item">
                    <i class="fas fa-comment"></i>
                    <span>${post.comments} commentaires</span>
                </div>
                <div class="stats-item">
                    <i class="fas fa-share"></i>
                    <span>${post.shares} partages</span>
                </div>
            </div>
            <div class="post-engagement">
                <button class="engagement-btn like-btn ${post.liked ? 'active' : ''}" 
                        onclick="network.toggleLike(${post.id})">
                    <i class="fas fa-heart"></i>
                    <span>J'aime</span>
                </button>
                <button class="engagement-btn" onclick="network.focusComment(${post.id})">
                    <i class="fas fa-comment"></i>
                    <span>Commenter</span>
                </button>
                <button class="engagement-btn" onclick="network.sharePost(${post.id})">
                    <i class="fas fa-share"></i>
                    <span>Partager</span>
                </button>
            </div>
            <div class="post-comments">
                <div class="comment-input">
                    <div class="user-avatar">
                        <img src="${this.currentUser.avatar}" alt="Vous">
                    </div>
                    <input type="text" placeholder="Écrivez un commentaire..." 
                           class="comment-field" data-post-id="${post.id}">
                </div>
            </div>
        `;
    }
}

// Modal de création de publication
class PostCreationModal {
    constructor() {
        this.modal = null;
        this.resolve = null;
        this.reject = null;
    }

    async show() {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.createModal();
        });
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal fade show d-block';
        this.modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Créer une publication</h5>
                        <button type="button" class="btn-close" onclick="this.close()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="post-editor">
                            <div class="editor-header">
                                <div class="user-avatar">
                                    <img src="${window.network.currentUser.avatar}" alt="Vous">
                                </div>
                                <div class="user-info">
                                    <strong>${window.network.currentUser.name}</strong>
                                    <span>Public</span>
                                </div>
                            </div>
                            <textarea class="post-content" placeholder="Partagez votre expérience..."></textarea>
                            <div class="editor-actions">
                                <button class="action-btn" onclick="this.attachPhoto()">
                                    <i class="fas fa-image"></i>
                                </button>
                                <button class="action-btn" onclick="this.addAchievement()">
                                    <i class="fas fa-trophy"></i>
                                </button>
                                <button class="action-btn" onclick="this.tagFriends()">
                                    <i class="fas fa-user-tag"></i>
                                </button>
                                <button class="action-btn" onclick="this.addFeeling()">
                                    <i class="fas fa-smile"></i>
                                </button>
                            </div>
                            <div class="editor-preview" id="mediaPreview"></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="this.close()">Annuler</button>
                        <button type="button" class="btn btn-primary" onclick="this.publish()">Publier</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.modal);
    }

    close() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
        this.reject?.(new Error('Modal fermé'));
    }

    publish() {
        const content = this.modal.querySelector('.post-content').value;
        if (!content.trim()) {
            window.network.showToast('Veuillez écrire un message', 'error');
            return;
        }

        const postData = {
            content: content,
            type: 'text',
            audience: 'public'
        };

        this.resolve?.(postData);
        this.close();
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.network = new UltraNetworkManager();
    window.impactManager = new ImpactManager();
});

// ===== IMPACT MANAGER CLASS =====
class ImpactManager {
    constructor() {
        this.currentTab = 'overview';
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.initializeCharts();
        this.updateTimers();
        this.loadImpactData();
        this.setupEventListeners();
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const targetTab = button.dataset.tab;
                
                // Update active states
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                button.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');
                
                this.currentTab = targetTab;
                this.handleTabChange(targetTab);
            });
        });
    }

    handleTabChange(tab) {
        switch(tab) {
            case 'overview':
                this.updateOverviewData();
                break;
            case 'stories':
                this.loadStories();
                break;
            case 'statistics':
                this.updateStatistics();
                break;
            case 'community':
                this.updateCommunityData();
                break;
        }
    }

    initializeCharts() {
        // Initialize donations evolution chart
        const donationsCtx = document.getElementById('donationsChart');
        if (donationsCtx) {
            this.createDonationsChart(donationsCtx);
        }

        // Initialize blood type distribution chart
        const bloodTypeCtx = document.getElementById('bloodTypeChart');
        if (bloodTypeCtx) {
            this.createBloodTypeChart(bloodTypeCtx);
        }

        // Initialize impact map
        const impactMapCtx = document.getElementById('impactMap');
        if (impactMapCtx) {
            this.createImpactMap(impactMapCtx);
        }
    }

    createDonationsChart(ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov'],
                datasets: [{
                    label: 'Dons mensuels',
                    data: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    createBloodTypeChart(ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'],
                datasets: [{
                    data: [8, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: [
                        '#dc2626', '#3b82f6', '#10b981', '#f59e0b',
                        '#ef4444', '#2563eb', '#059669', '#d97706'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createImpactMap(ctx) {
        // Create a simple impact visualization
        const canvas = ctx;
        const context = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = 300;
        
        // Draw simple visualization
        context.fillStyle = '#e0f2fe';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw impact points
        const points = [
            { x: 100, y: 100, type: 'hospital', label: 'Hôpital Central' },
            { x: 200, y: 150, type: 'patient', label: '12 patients aidés' },
            { x: 300, y: 80, type: 'collection', label: 'Centre de collecte' }
        ];
        
        points.forEach(point => {
            context.beginPath();
            context.arc(point.x, point.y, 8, 0, 2 * Math.PI);
            
            switch(point.type) {
                case 'hospital':
                    context.fillStyle = '#dc2626';
                    break;
                case 'patient':
                    context.fillStyle = '#10b981';
                    break;
                case 'collection':
                    context.fillStyle = '#f59e0b';
                    break;
            }
            
            context.fill();
            
            // Add label
            context.fillStyle = '#374151';
            context.font = '12px Arial';
            context.fillText(point.label, point.x - 30, point.y - 15);
        });
    }

    updateTimers() {
        // Update countdown timer for next donation
        setInterval(() => {
            const timerElements = document.querySelectorAll('.time-value');
            if (timerElements.length >= 3) {
                // Simulate countdown (would be calculated from actual next donation date)
                const now = new Date();
                const nextDonation = new Date('2024-12-20T09:00:00');
                const diff = nextDonation - now;
                
                if (diff > 0) {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    
                    timerElements[0].textContent = days;
                    timerElements[1].textContent = hours;
                    timerElements[2].textContent = minutes;
                }
            }
        }, 60000); // Update every minute
    }

    loadImpactData() {
        // Simulate loading impact data
        this.impactData = {
            livesSaved: 12,
            donationsCompleted: 8,
            totalBloodDonated: '4.8L',
            hospitalsHelped: 3,
            patientsHelped: 12,
            bloodType: 'O+',
            totalTimeDonated: '8 heures',
            achievements: [
                { id: 1, name: 'Premier Don', unlocked: true, date: '15 Mars 2024', icon: '🌟' },
                { id: 2, name: 'Donneur Dévoué', unlocked: true, description: '3 Dons', icon: '⭐' },
                { id: 3, name: 'Bronze', unlocked: true, description: '5 Dons', icon: '🥉' },
                { id: 4, name: 'Argent', unlocked: true, description: '8 Dons', icon: '🥈' },
                { id: 5, name: 'Or', unlocked: false, description: '10 Dons', icon: '🥇' },
                { id: 6, name: 'Diamant', unlocked: false, description: '25 Dons', icon: '💎' }
            ],
            stories: [
                {
                    id: 1,
                    patientName: 'Marie',
                    patientAge: '8 ans',
                    patientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
                    condition: 'Intervention chirurgicale',
                    bloodType: 'O+',
                    story: 'Grâce à des donneurs généreux comme vous, Marie a pu subir son opération cardiaque avec succès. Votre sang O+ a été parfait pour elle.',
                    date: '15 Novembre 2024',
                    livesSaved: 1
                },
                {
                    id: 2,
                    patientName: 'Thomas',
                    patientAge: '45 ans',
                    patientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
                    condition: 'Accident de voiture',
                    bloodType: 'O+',
                    story: 'Thomas a été impliqué dans un grave accident de voiture. Il avait besoin de sang urgently. Votre don a été crucial pour sa survie.',
                    date: '2 Octobre 2024',
                    livesSaved: 1
                },
                {
                    id: 3,
                    patientName: 'Sophie',
                    patientAge: '32 ans',
                    patientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
                    condition: 'Accouchement compliqué',
                    bloodType: 'O+',
                    story: 'Sophie a eu des complications lors de son accouchement. Votre don a permis de sauver sa vie et celle de son bébé.',
                    date: '20 Septembre 2024',
                    livesSaved: 2
                }
            ],
            communityRanking: [
                { position: 3, name: 'Vous', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', donations: 8, livesSaved: 12, score: 2450, isCurrentUser: true },
                { position: 1, name: 'Marie Laurent', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face', donations: 12, livesSaved: 18, score: 3120 },
                { position: 2, name: 'Thomas Bernard', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', donations: 10, livesSaved: 15, score: 2890 }
            ]
        };
    }

    updateOverviewData() {
        // Update personal impact metrics
        const metrics = document.querySelectorAll('.metric-item');
        if (metrics.length >= 4) {
            // Metrics are already set in HTML, but could be updated dynamically
        }
    }

    loadStories() {
        // Stories are already rendered in HTML, but could be loaded dynamically
        console.log('Loading impact stories...');
    }

    updateStatistics() {
        // Update statistics based on selected period
        const periodFilter = document.querySelector('.period-filter');
        if (periodFilter) {
            periodFilter.addEventListener('change', (e) => {
                this.loadStatisticsForPeriod(e.target.value);
            });
        }
    }

    loadStatisticsForPeriod(period) {
        console.log(`Loading statistics for period: ${period}`);
        // Would load actual statistics based on period
    }

    updateCommunityData() {
        // Update community impact and rankings
        console.log('Updating community data...');
    }

    setupEventListeners() {
        // Setup action buttons
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.textContent.trim();
                this.handleAction(action);
            });
        });

        // Setup share buttons
        const shareButtons = document.querySelectorAll('.share-btn');
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const platform = button.className.split(' ')[1];
                this.shareOn(platform);
            });
        });
    }

    handleAction(action) {
        switch(action) {
            case 'Prochain Don':
                this.scheduleNextDonation();
                break;
            case 'Partager Impact':
                this.shareImpact();
                break;
            case 'Certificat':
                this.downloadCertificate();
                break;
            case 'Inviter des Amis':
                this.inviteFriends();
                break;
        }
    }

    scheduleNextDonation() {
        // Show notification or modal for scheduling next donation
        this.showNotification('📅 Redirection vers la prise de rendez-vous...', 'info');
        setTimeout(() => {
            // Would navigate to appointments section
            document.querySelector('[data-section="appointments"]')?.click();
        }, 1500);
    }

    shareImpact() {
        // Create share modal or open share dialog
        const shareText = "J'ai sauvé 12 vies grâce à mes dons ! Rejoignez-moi sur BloodLink 🩸❤️";
        
        if (navigator.share) {
            navigator.share({
                title: 'Mon Impact BloodLink',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(shareText);
            this.showNotification('📋 Message copié dans le presse-papiers !', 'success');
        }
    }

    downloadCertificate() {
        // Generate and download certificate
        this.showNotification('📄 Génération de votre certificat en cours...', 'info');
        
        // Would generate actual certificate PDF
        setTimeout(() => {
            this.showNotification('✅ Certificat téléchargé avec succès !', 'success');
        }, 2000);
    }

    inviteFriends() {
        // Open invitation modal
        this.showNotification('👥 Ouverture du formulaire d\'invitation...', 'info');
        
        // Would open invitation modal
        setTimeout(() => {
            this.showNotification('📧 Invitation envoyée !', 'success');
        }, 1500);
    }

    shareOn(platform) {
        const shareText = encodeURIComponent("J'ai sauvé 12 vies grâce à mes dons ! Rejoignez-moi sur BloodLink 🩸❤️");
        const shareUrl = encodeURIComponent(window.location.href);
        
        let url = '';
        switch(platform) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
                break;
            case 'whatsapp':
                url = `https://wa.me/?text=${shareText}%20${shareUrl}`;
                break;
        }
        
        if (url) {
            window.open(url, '_blank', 'width=600,height=400');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `impact-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Setup close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 1rem;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Public methods for external access
    refreshData() {
        this.loadImpactData();
        this.updateOverviewData();
        this.updateStatistics();
        this.updateCommunityData();
    }

    exportImpactData() {
        // Export impact data as JSON
        const dataStr = JSON.stringify(this.impactData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'bloodlink-impact-data.json';
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('📊 Données d\'impact exportées !', 'success');
    }
}