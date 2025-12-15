// BloodLink Pro - Version Simplifiée et Robuste
console.log('BloodLink Pro - Initialisation');

class BloodLinkApp {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            console.log('Début de l\'initialisation...');
            
            // Masquer l'écran de chargement après un court délai
            this.setLoadingTimeout();
            
            // Initialiser les composants de base
            await this.initializeBasicComponents();
            
            // Marquer comme initialisé
            this.isInitialized = true;
            document.body.classList.add('loaded');
            
            console.log('BloodLink Pro initialisé avec succès');
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
            this.forceHideLoading();
        }
    }

    setLoadingTimeout() {
        // Timeout de sécurité pour masquer l'écran de chargement
        setTimeout(() => {
            if (!this.isInitialized) {
                console.warn('Timeout - Masquage forcé de l\'écran de chargement');
                this.forceHideLoading();
            }
        }, 5000);
    }

    async initializeBasicComponents() {
        // 1. Initialiser AOS si disponible
        this.initAOS();
        
        // 2. Initialiser la carte
        this.initMap();
        
        // 3. Charger les données
        this.loadData();
        
        // 4. Initialiser les événements
        this.initEvents();
        
        // 5. Mettre à jour l'UI
        this.updateUI();
    }

    initAOS() {
        if (typeof AOS !== 'undefined') {
            try {
                AOS.init({
                    duration: 800,
                    once: true,
                    offset: 50
                });
                console.log('AOS initialisé');
            } catch (error) {
                console.warn('AOS non initialisé:', error);
            }
        }
    }

    initMap() {
        const mapElement = document.getElementById('liveMap');
        if (!mapElement) {
            console.log('Élément carte non trouvé');
            return;
        }

        if (typeof L === 'undefined') {
            console.warn('Leaflet non chargé - affichage fallback');
            this.showMapFallback();
            return;
        }

        try {
            const map = L.map('liveMap').setView([48.8566, 2.3522], 12);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(map);

            // Ajouter des marqueurs de démonstration
            this.addDemoMarkers(map);
            
            console.log('Carte initialisée avec succès');
            
        } catch (error) {
            console.error('Erreur initialisation carte:', error);
            this.showMapFallback();
        }
    }

    showMapFallback() {
        const mapElement = document.getElementById('liveMap');
        if (mapElement) {
            mapElement.innerHTML = `
                <div class="text-center p-5">
                    <i class="fas fa-map-marked-alt fa-3x text-muted mb-3"></i>
                    <h5>Carte non disponible</h5>
                    <p class="text-muted">Fonctionnalité en cours de chargement</p>
                    <button class="btn btn-primary btn-sm" onclick="location.reload()">
                        <i class="fas fa-redo me-1"></i>Réessayer
                    </button>
                </div>
            `;
        }
    }

    addDemoMarkers(map) {
        const hospitals = [
            { name: "Hôpital Saint-Louis", lat: 48.8738, lng: 2.3700, urgent: true },
            { name: "Hôpital Européen", lat: 48.8362, lng: 2.2759, urgent: false },
            { name: "Hôpital Necker", lat: 48.8462, lng: 2.3159, urgent: true }
        ];

        hospitals.forEach(hospital => {
            const marker = L.marker([hospital.lat, hospital.lng])
                .addTo(map)
                .bindPopup(`
                    <div class="map-popup">
                        <h6>${hospital.name}</h6>
                        <p class="${hospital.urgent ? 'text-danger' : 'text-muted'}">
                            <i class="fas fa-${hospital.urgent ? 'exclamation-triangle' : 'info-circle'}"></i>
                            ${hospital.urgent ? 'URGENT' : 'Disponible'}
                        </p>
                        <button class="btn btn-sm btn-danger" onclick="handleQuickDonate(1)">
                            Je donne
                        </button>
                    </div>
                `);

            if (hospital.urgent) {
                marker.setIcon(L.icon({
                    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc3545" width="32" height="32">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                        </svg>
                    `),
                    iconSize: [32, 32],
                    iconAnchor: [16, 32]
                }));
            }
        });
    }

    loadData() {
        console.log('Chargement des données...');
        
        // Données de démonstration
        const demoData = {
            alertes: [
                {
                    id: 1,
                    hopital: "Hôpital Saint-Louis",
                    typeSang: "O-",
                    quantite: 2,
                    urgence: true,
                    distance: "2.3 km",
                    timestamp: "Il y a 15 min"
                },
                {
                    id: 2,
                    hopital: "Clinique du Val d'Or",
                    typeSang: "A+", 
                    quantite: 3,
                    urgence: false,
                    distance: "5.1 km",
                    timestamp: "Il y a 2h"
                }
            ],
            stats: {
                totalDonations: 15247,
                livesSaved: 45741,
                activeDonors: 2847,
                connectedHospitals: 156,
                activeAlerts: 12
            }
        };

        this.updateAlertsList(demoData.alertes);
        this.updateStatistics(demoData.stats);
        this.initCharts();
    }

    updateAlertsList(alertes) {
        const container = document.getElementById('alertsList');
        if (!container) return;

        container.innerHTML = alertes.map(alerte => `
            <div class="alerte-item ${alerte.urgence ? 'urgent' : ''}">
                <div class="alerte-header">
                    <div>
                        <span class="badge bg-${alerte.urgence ? 'danger' : 'warning'}">
                            ${alerte.typeSang}
                        </span>
                        <span class="badge bg-secondary ms-1">${alerte.quantite} unité(s)</span>
                    </div>
                    <small class="text-muted">${alerte.timestamp}</small>
                </div>
                <h6 class="mb-1">${alerte.hopital}</h6>
                <p class="mb-1 text-muted">À ${alerte.distance} de vous</p>
                <div class="d-flex justify-content-between align-items-center mt-2">
                    <small class="text-${alerte.urgence ? 'danger' : 'muted'}">
                        <i class="fas fa-${alerte.urgence ? 'exclamation-triangle' : 'info-circle'} me-1"></i>
                        ${alerte.urgence ? 'URGENT' : 'Besoin régulier'}
                    </small>
                    <button class="btn btn-sm btn-outline-danger" onclick="App.handleQuickDonate(${alerte.id})">
                        Donner
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateStatistics(stats) {
        this.animateCounter('liveDonors', stats.activeDonors);
        this.animateCounter('liveHospitals', stats.connectedHospitals);
        this.animateCounter('liveAlerts', stats.activeAlerts);
        this.animateCounter('totalDonations', stats.totalDonations);
        this.animateCounter('livesSaved', stats.livesSaved);
        
        // Mettre à jour les compteurs de la carte
        const activeAlertsCount = document.getElementById('activeAlertsCount');
        const activeDonorsCount = document.getElementById('activeDonorsCount');
        if (activeAlertsCount) activeAlertsCount.textContent = stats.activeAlerts;
        if (activeDonorsCount) activeDonorsCount.textContent = Math.floor(stats.activeDonors / 60); // Simulation
    }

    animateCounter(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let current = 0;
        const increment = target / 100;
        const duration = 2000;
        const stepTime = duration / 100;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, stepTime);
    }

    initCharts() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js non disponible');
            return;
        }

        try {
            // Graphique de distribution des groupes sanguins
            const bloodCtx = document.getElementById('bloodDistributionChart');
            if (bloodCtx) {
                new Chart(bloodCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['O+', 'A+', 'B+', 'O-', 'A-', 'AB+', 'B-', 'AB-'],
                        datasets: [{
                            data: [36, 28, 12, 8, 7, 5, 3, 1],
                            backgroundColor: [
                                '#dc2626', '#ef4444', '#f87171', '#fca5a5',
                                '#fecaca', '#fee2e2', '#fef2f2', '#fff'
                            ]
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
            }

            // Graphique des dons mensuels
            const monthlyCtx = document.getElementById('monthlyTrendChart');
            if (monthlyCtx) {
                new Chart(monthlyCtx, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
                        datasets: [{
                            label: 'Dons',
                            data: [1200, 1900, 1500, 2100, 1800, 2400],
                            borderColor: '#dc2626',
                            backgroundColor: 'rgba(220, 38, 38, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true
                    }
                });
            }

            console.log('Graphiques initialisés');
        } catch (error) {
            console.error('Erreur initialisation graphiques:', error);
        }
    }

    initEvents() {
        // Navigation smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Scroll navbar
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        });

        console.log('Événements initialisés');
    }

    updateUI() {
        // Mettre à jour l'heure de dernière mise à jour
        const lastUpdate = document.getElementById('lastUpdate');
        if (lastUpdate) {
            lastUpdate.textContent = 'Maintenant';
        }

        console.log('UI mise à jour');
    }

    forceHideLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            document.body.classList.add('loaded');
            console.log('Écran de chargement masqué (forcé)');
        }
    }

    // Méthodes publiques
    handleQuickDonate(alertId) {
        this.showToast(`Merci ! Don confirmé pour l'alerte ${alertId}`, 'success');
    }

    refreshMap() {
        this.showToast('Carte actualisée', 'info');
        // Recharger la carte si nécessaire
    }

    showToast(message, type = 'info') {
        // Implémentation basique des toasts
        console.log(`Toast [${type}]: ${message}`);
        alert(message); // Fallback simple
    }
}

// Interface publique
window.App = {
    handleQuickDonate: (id) => window.bloodLinkApp.handleQuickDonate(id),
    refreshMap: () => window.bloodLinkApp.refreshMap(),
    showToast: (msg, type) => window.bloodLinkApp.showToast(msg, type)
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded - Lancement de BloodLink Pro');
    window.bloodLinkApp = new BloodLinkApp();
});

// Gestionnaire d'erreurs global
window.addEventListener('error', (e) => {
    console.error('Erreur globale attrapée:', e.error);
});

// Fallback pour les fonctions globales
window.openLoginModal = () => alert('Connexion - Fonctionnalité en développement');
window.openRegisterModal = () => alert('Inscription - Fonctionnalité en développement');
window.scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
};