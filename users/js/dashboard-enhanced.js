// Enhanced Dashboard Functionality with Animations
class BloodLinkDashboard {
    constructor() {
        this.currentUser = null;
        this.alerts = [];
        this.isSidebarOpen = false;
        this.animationsEnabled = true;
        this.init();
    }

    init() {
        this.initializeComponents();
        this.loadUserData();
        this.loadAlerts();
        this.setupEventListeners();
        this.initializeCharts();
        this.initializeMap();
        this.setupScrollAnimations();
        this.setupIntersectionObserver();
    }

    initializeComponents() {
        // Initialize AOS with enhanced settings
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                disable: window.innerWidth < 768
            });
        }

        // Enhanced loading screen with animations
        this.initializeLoadingScreen();
        
        // Initialize theme
        this.initializeTheme();
    }

    initializeLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            // Add loading animation
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    this.showWelcomeToast();
                }, 500);
            }, 2000);
        }
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('bloodlink-theme') || 'light';
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        
        // Update theme selector if exists
        const themeSelector = document.getElementById('theme');
        if (themeSelector) {
            themeSelector.value = savedTheme;
        }
    }

    loadUserData() {
        // Simulate user data loading with animation
        this.showSkeletonLoading();
        
        setTimeout(() => {
            this.currentUser = {
                name: "Jean Dupont",
                bloodType: "O+",
                donationCount: 12,
                points: 1250,
                level: "Or",
                nextDonation: "2024-03-15",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face"
            };

            this.updateUserInterface();
            this.hideSkeletonLoading();
        }, 1500);
    }

    showSkeletonLoading() {
        const elements = document.querySelectorAll('.stat-card, .chart-card, .upcoming-card');
        elements.forEach(el => {
            el.classList.add('skeleton-loading');
        });
    }

    hideSkeletonLoading() {
        const elements = document.querySelectorAll('.skeleton-loading');
        elements.forEach(el => {
            el.classList.remove('skeleton-loading');
            el.classList.add('fade-in');
        });
    }

    updateUserInterface() {
        // Update user info with animations
        this.animateValue('.user-details h6', this.currentUser.name);
        this.animateValue('.blood-type .badge', this.currentUser.bloodType);
        
        // Update stats with counting animation
        this.updateStats();
    }

    animateValue(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                element.textContent = value;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.classList.add('success-animation');
                
                setTimeout(() => {
                    element.classList.remove('success-animation');
                }, 600);
            }, 200);
        }
    }

    updateStats() {
        const stats = {
            livesSaved: this.currentUser.donationCount * 3,
            alertsResponded: Math.floor(this.currentUser.donationCount * 0.7),
            points: this.currentUser.points,
            nextDonation: this.getDaysUntilNextDonation()
        };

        // Animate stat numbers
        Object.keys(stats).forEach((key, index) => {
            const elements = document.querySelectorAll('.stat-content h3');
            if (elements[index]) {
                this.animateNumber(elements[index], stats[key]);
            }
        });
    }

    animateNumber(element, targetValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const duration = 1000;
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(currentValue + (targetValue - currentValue) * easeOutQuart);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = targetValue;
            }
        };
        
        requestAnimationFrame(updateNumber);
    }

    getDaysUntilNextDonation() {
        const nextDate = new Date(this.currentUser.nextDonation);
        const today = new Date();
        const diffTime = nextDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays}j`;
    }

    loadAlerts() {
        // Simulate API call for alerts with loading animation
        setTimeout(() => {
            this.alerts = [
                {
                    id: 1,
                    hospital: "Hôpital Saint-Louis",
                    bloodType: "O-",
                    quantity: 2,
                    urgency: "high",
                    distance: "2.3 km",
                    timestamp: "Il y a 15 min",
                    need: "Urgence chirurgicale",
                    coordinates: [48.8738, 2.3700]
                },
                {
                    id: 2,
                    hospital: "Clinique du Val d'Or",
                    bloodType: "A+",
                    quantity: 3,
                    urgency: "medium",
                    distance: "5.1 km",
                    timestamp: "Il y a 2h",
                    need: "Stock régulier",
                    coordinates: [48.8362, 2.2759]
                },
                {
                    id: 3,
                    hospital: "Hôpital Necker",
                    bloodType: "B+",
                    quantity: 1,
                    urgency: "high",
                    distance: "3.7 km",
                    timestamp: "Il y a 5 min",
                    need: "Accident de la route",
                    coordinates: [48.8462, 2.3159]
                }
            ];

            this.renderAlerts();
            this.renderAlertsMap();
        }, 1000);
    }

    renderAlerts() {
        const containers = ['recentAlertsGrid', 'alertsList'];
        
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = this.alerts.map((alert, index) => `
                    <div class="alert-item-map ${alert.urgency === 'high' ? 'urgent' : ''}" 
                         onclick="dashboard.handleAlertClick(${alert.id})"
                         style="animation-delay: ${index * 0.1}s">
                        <div class="alert-header-map">
                            <div class="alert-blood-type ${alert.bloodType.toLowerCase()}">${alert.bloodType}</div>
                            <small class="alert-time">${alert.timestamp}</small>
                        </div>
                        <div class="alert-hospital">${alert.hospital}</div>
                        <div class="alert-details">${alert.need}</div>
                        <div class="alert-meta">
                            <span><i class="fas fa-map-marker-alt"></i> ${alert.distance}</span>
                            <span><i class="fas fa-tint"></i> ${alert.quantity} unité(s)</span>
                        </div>
                        <div class="alert-actions">
                            <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); dashboard.shareAlert(${alert.id})">
                                <i class="fas fa-share"></i>
                            </button>
                            <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); dashboard.respondToAlert(${alert.id})">
                                Je donne
                            </button>
                        </div>
                    </div>
                `).join('');
                
                // Add animation classes
                setTimeout(() => {
                    const alertItems = container.querySelectorAll('.alert-item-map');
                    alertItems.forEach(item => {
                        item.classList.add('fade-in');
                    });
                }, 100);
            }
        });
    }

    renderAlertsMap() {
        const mapElement = document.getElementById('alertsMap');
        if (mapElement && typeof L !== 'undefined') {
            const map = L.map('alertsMap').setView([48.8566, 2.3522], 12);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Add alert markers with animations
            this.alerts.forEach((alert, index) => {
                setTimeout(() => {
                    const marker = L.marker(alert.coordinates).addTo(map);
                    const icon = L.divIcon({
                        className: `map-marker ${alert.urgency}`,
                        html: `<div class="marker-pulse"><i class="fas fa-tint"></i></div>`,
                        iconSize: [30, 30]
                    });
                    
                    marker.setIcon(icon);
                    
                    const popupContent = `
                        <div class="map-popup">
                            <h6>${alert.hospital}</h6>
                            <p><strong class="blood-type ${alert.bloodType.toLowerCase()}">${alert.bloodType}</strong> • ${alert.quantity} unité(s)</p>
                            <p>${alert.need}</p>
                            <small>${alert.distance} • ${alert.timestamp}</small>
                            <div class="mt-2">
                                <button class="btn btn-sm btn-primary" onclick="dashboard.respondToAlert(${alert.id})">
                                    Je donne
                                </button>
                            </div>
                        </div>
                    `;
                    marker.bindPopup(popupContent);
                }, index * 200);
            });
        }
    }

    initializeCharts() {
        const activityCtx = document.getElementById('donationActivityChart');
        if (activityCtx) {
            // Add loading state
            activityCtx.innerHTML = '<div class="chart-loading"><div class="loader"></div></div>';
            
            setTimeout(() => {
                activityCtx.innerHTML = '<canvas></canvas>';
                const canvas = activityCtx.querySelector('canvas');
                
                new Chart(canvas, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                        datasets: [{
                            label: 'Dons de Sang',
                            data: [2, 3, 1, 4, 2, 3, 2, 4, 3, 2, 1, 3],
                            borderColor: '#e63946',
                            backgroundColor: 'rgba(230, 57, 70, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#e63946',
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                backgroundColor: 'rgba(29, 53, 87, 0.9)',
                                titleColor: '#ffffff',
                                bodyColor: '#ffffff',
                                callbacks: {
                                    label: function(context) {
                                        return `Dons: ${context.parsed.y}`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: { color: 'rgba(0, 0, 0, 0.1)' },
                                ticks: { color: '#6c757d' }
                            },
                            x: {
                                grid: { display: false },
                                ticks: { color: '#6c757d' }
                            }
                        },
                        animation: {
                            duration: 2000,
                            easing: 'easeOutQuart'
                        }
                    }
                });
            }, 1000);
        }
    }

    initializeMap() {
        // Map initialization is handled in renderAlertsMap
    }

    setupEventListeners() {
        const sidebar = document.querySelector('.dashboard-sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarBackdrop = document.getElementById('sidebarBackdrop');

        // Enhanced navigation with animations
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                this.handleNavigation(target);

                // Add click animation
                link.classList.add('wave-effect');
                setTimeout(() => link.classList.remove('wave-effect'), 600);

                // Close sidebar on mobile after navigation
                if (window.innerWidth <= 768 && sidebar && this.isSidebarOpen) {
                    this.toggleSidebar();
                }
            });
        });

        // Enhanced hamburger toggle
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Enhanced backdrop click
        if (sidebarBackdrop) {
            sidebarBackdrop.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Enhanced filter events
        document.querySelectorAll('.form-select').forEach(select => {
            select.addEventListener('change', () => {
                this.applyFilters();
            });
        });

        // Enhanced quick actions
        document.querySelectorAll('.fab-item').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = button.querySelector('span').textContent.toLowerCase();
                this.handleQuickAction(action);
                
                // Add click animation
                button.classList.add('success-animation');
                setTimeout(() => button.classList.remove('success-animation'), 600);
            });
        });

        // Theme switcher
        const themeSelector = document.getElementById('theme');
        if (themeSelector) {
            themeSelector.addEventListener('change', (e) => {
                this.changeTheme(e.target.value);
            });
        }

        // Scroll animations
        window.addEventListener('scroll', this.handleScroll.bind(this));

        // Resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.dashboard-sidebar');
        const sidebarBackdrop = document.getElementById('sidebarBackdrop');
        
        this.isSidebarOpen = !this.isSidebarOpen;
        
        if (sidebar) {
            sidebar.classList.toggle('open', this.isSidebarOpen);
        }
        
        if (sidebarBackdrop) {
            sidebarBackdrop.classList.toggle('show', this.isSidebarOpen);
        }
        
        document.body.classList.toggle('sidebar-open', this.isSidebarOpen);
    }

    handleNavigation(sectionId) {
        // Hide all sections with fade out
        document.querySelectorAll('.dashboard-section').forEach(section => {
            if (section.classList.contains('active')) {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    section.classList.remove('active');
                }, 300);
            }
        });

        // Show target section with fade in
        setTimeout(() => {
            const targetSection = document.querySelector(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                setTimeout(() => {
                    targetSection.style.opacity = '1';
                    targetSection.style.transform = 'translateY(0)';
                }, 50);
            }

            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector(`[href="${sectionId}"]`).classList.add('active');
        }, 300);

        // Scroll to top with smooth animation
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    handleAlertClick(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            this.showAlertDetails(alert);
        }
    }

    showAlertDetails(alert) {
        // Create modal with animations
        const modal = document.createElement('div');
        modal.className = 'alert-modal show';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content glass-modal">
                    <div class="modal-header">
                        <h5 class="modal-title">Détails de l'alerte</h5>
                        <button type="button" class="btn-close" onclick="this.closest('.alert-modal').remove()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert-detail">
                            <div class="alert-header-detail">
                                <h4>${alert.hospital}</h4>
                                <div class="blood-type-badge ${alert.bloodType.toLowerCase()}">${alert.bloodType}</div>
                            </div>
                            <div class="alert-info-grid">
                                <div class="info-item">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    <span>${alert.need}</span>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-tint"></i>
                                    <span>${alert.quantity} unité(s) nécessaire(s)</span>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span>${alert.distance}</span>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-clock"></i>
                                    <span>${alert.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="this.closest('.alert-modal').remove()">Fermer</button>
                        <button class="btn btn-primary" onclick="dashboard.respondToAlert(${alert.id}); this.closest('.alert-modal').remove()">
                            <i class="fas fa-heartbeat"></i> Je donne maintenant
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);

        // Close on backdrop click
        backdrop.addEventListener('click', () => {
            modal.remove();
            backdrop.remove();
        });
    }

    respondToAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        
        // Show loading state
        this.showToast(`Préparation de votre réponse à l'alerte ${alert.hospital}...`, 'info');
        
        // Simulate API call
        setTimeout(() => {
            this.showToast(`✅ Merci! Votre réponse à l'alerte ${alert.hospital} a été enregistrée.`, 'success');
            
            // Show confirmation modal
            setTimeout(() => {
                this.showConfirmationModal(alert);
            }, 1000);
        }, 2000);
    }

    showConfirmationModal(alert) {
        const modal = document.createElement('div');
        modal.className = 'alert-modal show';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content glass-modal">
                    <div class="modal-header">
                        <h5 class="modal-title">🎉 Merci pour votre engagement!</h5>
                        <button type="button" class="btn-close" onclick="this.closest('.alert-modal').remove()"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="confirmation-animation">
                            <i class="fas fa-heartbeat"></i>
                        </div>
                        <h4>Votre réponse a été envoyée</h4>
                        <p>Le centre ${alert.hospital} vous contactera dans les plus brefs délais pour confirmer votre don.</p>
                        <div class="confirmation-details">
                            <p><strong>Type sanguin:</strong> ${alert.bloodType}</p>
                            <p><strong>Centre:</strong> ${alert.hospital}</p>
                            <p><strong>Distance:</strong> ${alert.distance}</p>
                        </div>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button class="btn btn-primary" onclick="this.closest('.alert-modal').remove()">
                            Compris
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);

        backdrop.addEventListener('click', () => {
            modal.remove();
            backdrop.remove();
        });
    }

    shareAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        
        // Simulate share functionality
        if (navigator.share) {
            navigator.share({
                title: `Alerte Sang Urgente - ${alert.hospital}`,
                text: `Besoin urgent de sang ${alert.bloodType} à ${alert.hospital}. ${alert.need}`,
                url: window.location.href
            });
        } else {
            this.showToast('Lien de partage copié dans le presse-papier!', 'info');
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`Alerte sang urgent: ${alert.hospital} a besoin de ${alert.bloodType}`);
        }
    }

    handleQuickAction(action) {
        switch (action) {
            case 'donner':
                this.showDonationCenters();
                break;
            case 'centres':
                this.handleNavigation('#centers');
                break;
            case 'alertes':
                this.handleNavigation('#alerts');
                break;
        }
    }

    showDonationCenters() {
        this.showToast('🔍 Recherche des centres de don les plus proches...', 'info');
        
        // Simulate search with loading
        setTimeout(() => {
            this.handleNavigation('#centers');
            this.showToast('📍 Centres de don trouvés près de chez vous!', 'success');
        }, 1500);
    }

    applyFilters() {
        const bloodType = document.getElementById('bloodTypeFilter').value;
        const urgency = document.getElementById('urgencyFilter').value;
        const distance = document.getElementById('distanceFilter').value;

        // Show loading state
        this.showToast('Application des filtres...', 'info');
        
        // Simulate filter application
        setTimeout(() => {
            this.showToast('✅ Filtres appliqués avec succès', 'success');
            
            // Animate filter results
            const alertItems = document.querySelectorAll('.alert-item-map');
            alertItems.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
                item.classList.remove('fade-in');
                setTimeout(() => item.classList.add('fade-in'), 50);
            });
        }, 800);
    }

    changeTheme(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('bloodlink-theme', theme);
        
        this.showToast(`Thème ${theme === 'dark' ? 'sombre' : 'clair'} activé`, 'success');
    }

    setupScrollAnimations() {
        // Add scroll event listener for navbar
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    setupIntersectionObserver() {
        // Observe elements for animation triggers
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animate progress bars
                    if (entry.target.classList.contains('progress-bar')) {
                        const width = entry.target.style.width;
                        entry.target.style.width = '0';
                        setTimeout(() => {
                            entry.target.style.width = width;
                        }, 300);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all animate-able elements
        document.querySelectorAll('.section, .feature-card, .stat-card').forEach(el => {
            observer.observe(el);
        });
    }

    handleScroll() {
        // Parallax effect for hero section
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-background');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }

    handleResize() {
        // Handle responsive behaviors
        if (window.innerWidth > 768 && this.isSidebarOpen) {
            this.toggleSidebar();
        }
    }

    showToast(message, type = 'info') {
        // Create toast element with enhanced styling
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fade-in`;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    <i class="fas fa-${this.getToastIcon(type)}"></i>
                </div>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        // Add to container or create one
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);

        // Enhanced close on click
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        });
    }

    showWelcomeToast() {
        this.showToast('👋 Bienvenue sur BloodLink Pro! Votre tableau de bord est prêt.', 'success');
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Global functions for HTML onclick attributes
    respondToEmergency() {
        this.showToast('🚨 Merci pour votre réponse à l\'urgence! Un coordinateur vous contactera.', 'success');
        
        // Show emergency response modal
        setTimeout(() => {
            this.showConfirmationModal({
                hospital: "Hôpital Necker",
                bloodType: "O+",
                distance: "3.2 km"
            });
        }, 1000);
    }

    quickAction(action) {
        this.handleQuickAction(action);
    }
}

// Enhanced initialization with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.dashboard = new BloodLinkDashboard();
        
        // Add global error handler
        window.addEventListener('error', (e) => {
            console.error('BloodLink Error:', e.error);
            if (window.dashboard) {
                window.dashboard.showToast('Une erreur est survenue. Veuillez rafraîchir la page.', 'error');
            }
        });
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && window.dashboard) {
                window.dashboard.showToast('👋 Bon retour!', 'info');
            }
        });
        
    } catch (error) {
        console.error('Failed to initialize BloodLink Dashboard:', error);
        
        // Fallback: show basic functionality
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        alert('BloodLink Pro a rencontré un problème. Certaines fonctionnalités peuvent être limitées.');
    }
});

// Global functions for HTML onclick attributes
window.respondToEmergency = function() {
    if (window.dashboard) {
        window.dashboard.respondToEmergency();
    }
};

window.quickAction = function(action) {
    if (window.dashboard) {
        window.dashboard.quickAction(action);
    }
};

// Utility function for external use
window.BloodLinkUtils = {
    refreshData: function() {
        if (window.dashboard) {
            window.dashboard.loadUserData();
            window.dashboard.loadAlerts();
            window.dashboard.showToast('Données actualisées', 'success');
        }
    },
    
    toggleAnimations: function() {
        if (window.dashboard) {
            window.dashboard.animationsEnabled = !window.dashboard.animationsEnabled;
            const message = window.dashboard.animationsEnabled ? 
                'Animations activées' : 'Animations désactivées';
            window.dashboard.showToast(message, 'info');
        }
    }
};


