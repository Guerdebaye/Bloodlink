// BloodLink Hôpitaux - Application Principale
class HospitalApp {
    constructor() {
        this.currentHospital = {
            id: 1,
            name: "Hôpital Central Paris",
            address: "123 Avenue de Paris, 75015",
            phone: "+33 1 45 67 89 00",
            email: "contact@hopital-central.fr",
            director: "Dr. Martin",
            capacity: 500,
            emergencyContact: "Dr. Lefebvre"
        };

        this.stocks = {
            'O-': { current: 2, min: 5, max: 50, status: 'critical' },
            'O+': { current: 15, min: 10, max: 80, status: 'low' },
            'A-': { current: 28, min: 8, max: 60, status: 'normal' },
            'A+': { current: 35, min: 12, max: 70, status: 'normal' },
            'B-': { current: 18, min: 6, max: 40, status: 'normal' },
            'B+': { current: 22, min: 8, max: 50, status: 'normal' },
            'AB-': { current: 8, min: 4, max: 30, status: 'normal' },
            'AB+': { current: 19, min: 5, max: 35, status: 'normal' }
        };

        this.activeEmergencies = [];
        this.pendingReservations = [];
        this.notifications = [];
        this.activityLog = [];

        this.init();
    }

    init() {
        this.loadHospitalData();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.generateSampleData();
        this.updateDashboard();
    }

    loadHospitalData() {
        // Chargement des données de l'hôpital
        document.getElementById('currentHospital').textContent = this.currentHospital.name;
        this.updateStockDisplay();
        this.updateNotificationCount();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link.getAttribute('href'));
            });
        });

        // Notification bell
        document.getElementById('notificationBell').addEventListener('click', () => {
            this.toggleNotificationCenter();
        });

        // Overlay pour fermer les modals
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('overlay')) {
                this.closeAllModals();
            }
        });
    }

    startRealTimeUpdates() {
        // Mises à jour en temps réel
        setInterval(() => {
            this.simulateRealTimeActivity();
            this.updateDashboard();
        }, 10000); // Toutes les 10 secondes

        // Vérification des stocks critiques
        setInterval(() => {
            this.checkCriticalStocks();
        }, 30000); // Toutes les 30 secondes
    }

    simulateRealTimeActivity() {
        // Simulation d'activité en temps réel
        const activities = [
            () => this.simulateNewDonation(),
            () => this.simulateStockUpdate(),
            () => this.simulateReservationUpdate(),
            () => this.simulateEmergencyResponse()
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        randomActivity();
    }

    generateSampleData() {
        // Génération de données d'exemple
        this.activityLog = [
            {
                type: 'emergency',
                title: 'Urgence O- déclarée',
                description: 'Urgence critique pour 5 unités O-. 12 donneurs notifiés.',
                time: 'Il y a 15 min',
                metadata: { responses: 8, type: 'Chirurgie' }
            },
            {
                type: 'stock',
                title: 'Stock A+ mis à jour',
                description: 'Réception de 10 unités A+ du Centre Régional',
                time: 'Il y a 45 min',
                metadata: { delivery: 'L-2847', newStock: 35 }
            },
            {
                type: 'reservation',
                title: 'Nouvelle réservation confirmée',
                description: 'Réservation de 4 unités B+ pour chirurgie programmée',
                time: 'Il y a 2h',
                metadata: { doctor: 'Dr. Lefebvre', date: '15/03/2024' }
            }
        ];

        this.notifications = [
            {
                id: 1,
                type: 'emergency',
                title: 'Nouvelle réponse à votre urgence',
                message: '3 donneurs supplémentaires ont répondu à votre urgence O-',
                time: '5 min',
                read: false
            },
            {
                id: 2,
                type: 'stock',
                title: 'Stock O- critique',
                message: 'Le stock O- est descendu à 2 unités',
                time: '15 min',
                read: false
            },
            {
                id: 3,
                type: 'reservation',
                title: 'Livraison confirmée',
                message: 'Votre réservation de 4 unités A+ sera livrée à 14h',
                time: '1h',
                read: true
            }
        ];
    }

    updateDashboard() {
        this.updateStockOverview();
        this.updateEmergencyStats();
        this.updateReservationStats();
        this.updateActivityTimeline();
        this.updateQuickStats();
    }

    updateStockOverview() {
        const totalStock = Object.values(this.stocks).reduce((sum, stock) => sum + stock.current, 0);
        const totalCapacity = Object.values(this.stocks).reduce((sum, stock) => sum + stock.max, 0);
        const percentage = Math.round((totalStock / totalCapacity) * 100);

        document.getElementById('totalStock').textContent = totalStock;
        document.querySelector('.progress-fill').style.width = `${percentage}%`;
        document.querySelector('.stock-progress span').textContent = `${percentage}% de la capacité`;

        // Mise à jour du breakdown
        const breakdownContainer = document.querySelector('.stock-breakdown');
        if (breakdownContainer) {
            breakdownContainer.innerHTML = Object.entries(this.stocks)
                .map(([type, data]) => `
                    <div class="blood-type-stock" data-type="${type}">
                        <span class="blood-type">${type}</span>
                        <span class="stock-value ${data.status}">${data.current}</span>
                        <div class="stock-indicator ${data.status}"></div>
                    </div>
                `).join('');
        }
    }

    updateEmergencyStats() {
        const activeCount = this.activeEmergencies.length;
        const pendingResponses = this.activeEmergencies.reduce((sum, emergency) => 
            sum + (emergency.required - emergency.responded), 0
        );

        document.getElementById('activeEmergencies').textContent = activeCount;
        
        const detailsContainer = document.querySelector('.stat-card:nth-child(2) .stat-details');
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <div class="detail-item">
                    <span class="detail-label">En attente de réponse</span>
                    <span class="detail-value">${pendingResponses} donneurs</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Temps moyen de réponse</span>
                    <span class="detail-value">18 min</span>
                </div>
            `;
        }
    }

    updateReservationStats() {
        const pendingCount = this.pendingReservations.filter(r => r.status === 'pending').length;
        const todayDeliveries = this.pendingReservations.filter(r => 
            r.deliveryDate === new Date().toDateString() && r.status === 'shipped'
        ).length;
        const lateDeliveries = this.pendingReservations.filter(r => 
            r.status === 'late'
        ).length;

        document.getElementById('pendingReservations').textContent = pendingCount;
        
        const detailsContainer = document.querySelector('.stat-card:nth-child(3) .stat-details');
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <div class="detail-item">
                    <span class="detail-label">Livraisons aujourd'hui</span>
                    <span class="detail-value">${todayDeliveries}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">En retard</span>
                    <span class="detail-value ${lateDeliveries > 0 ? 'critical' : ''}">${lateDeliveries}</span>
                </div>
            `;
        }
    }

    updateActivityTimeline() {
        const timelineContainer = document.querySelector('.activity-timeline');
        if (timelineContainer) {
            timelineContainer.innerHTML = this.activityLog
                .slice(0, 5)
                .map(activity => `
                    <div class="activity-item ${activity.type}">
                        <div class="activity-icon">${this.getActivityIcon(activity.type)}</div>
                        <div class="activity-content">
                            <div class="activity-header">
                                <h4>${activity.title}</h4>
                                <span class="activity-time">${activity.time}</span>
                            </div>
                            <p>${activity.description}</p>
                            <div class="activity-meta">
                                ${this.getActivityMetadata(activity)}
                            </div>
                        </div>
                    </div>
                `).join('');
        }
    }

    getActivityIcon(type) {
        const icons = {
            emergency: '🚨',
            stock: '🩸',
            reservation: '📋',
            default: '📝'
        };
        return icons[type] || icons.default;
    }

    getActivityMetadata(activity) {
        if (activity.type === 'emergency') {
            return `
                <span class="meta-item">📞 ${activity.metadata.responses} réponses</span>
                <span class="meta-item">📍 ${activity.metadata.type}</span>
            `;
        } else if (activity.type === 'stock') {
            return `
                <span class="meta-item">📦 ${activity.metadata.delivery}</span>
                <span class="meta-item">✅ Stock maintenant: ${activity.metadata.newStock} unités</span>
            `;
        } else if (activity.type === 'reservation') {
            return `
                <span class="meta-item">👤 ${activity.metadata.doctor}</span>
                <span class="meta-item">📅 ${activity.metadata.date}</span>
            `;
        }
        return '';
    }

    updateQuickStats() {
        // Mise à jour des badges de navigation
        const urgentBadge = document.getElementById('urgentBadge');
        const reservationBadge = document.getElementById('reservationBadge');

        if (urgentBadge) {
            urgentBadge.textContent = this.activeEmergencies.length;
        }

        if (reservationBadge) {
            const pending = this.pendingReservations.filter(r => r.status === 'pending').length;
            reservationBadge.textContent = pending;
        }

        // Mise à jour du compteur de notifications
        this.updateNotificationCount();
    }

    updateNotificationCount() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const notificationCount = document.querySelector('.notification-count');
        if (notificationCount) {
            notificationCount.textContent = unreadCount;
            notificationCount.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }

    handleNavigation(path) {
        // Simulation de navigation
        console.log('Navigation vers:', path);
        this.showNotification(`Navigation vers ${path}`, 'info');
        
        // Mise à jour de la navigation active
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        event.target.closest('.nav-item').classList.add('active');
    }

    toggleNotificationCenter() {
        const center = document.getElementById('notificationCenter');
        const overlay = document.querySelector('.overlay') || this.createOverlay();
        
        center.classList.toggle('active');
        overlay.classList.toggle('active');
        
        if (center.classList.contains('active')) {
            this.renderNotifications();
        }
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.addEventListener('click', () => this.closeAllModals());
        document.body.appendChild(overlay);
        return overlay;
    }

    renderNotifications() {
        const container = document.getElementById('notificationList');
        if (!container) return;

        container.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}">
                <div class="notification-icon">${this.getNotificationIcon(notification.type)}</div>
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <span class="notification-time">${notification.time}</span>
                </div>
                <button class="notification-action" onclick="hospitalApp.markNotificationAsRead(${notification.id})">
                    ${notification.read ? '✓' : 'Marquer comme lu'}
                </button>
            </div>
        `).join('');
    }

    getNotificationIcon(type) {
        const icons = {
            emergency: '🚨',
            stock: '🩸',
            reservation: '📦',
            default: '💡'
        };
        return icons[type] || icons.default;
    }

    markNotificationAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.updateNotificationCount();
            this.renderNotifications();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.updateNotificationCount();
        this.renderNotifications();
    }

    closeAllModals() {
        document.querySelectorAll('.emergency-panel, .notification-center').forEach(modal => {
            modal.classList.remove('active');
        });
        document.querySelectorAll('.overlay').forEach(overlay => {
            overlay.classList.remove('active');
        });
    }

    showNotification(message, type = 'info') {
        // Création d'une notification toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(toast);

        // Animation d'entrée
        setTimeout(() => toast.classList.add('show'), 100);

        // Suppression automatique
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }, 5000);
    }

    // Simulations de données réalistes
    simulateNewDonation() {
        const bloodTypes = Object.keys(this.stocks);
        const randomType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;

        this.stocks[randomType].current += quantity;
        
        this.addActivityLog({
            type: 'stock',
            title: `Don reçu - ${randomType}`,
            description: `Réception de ${quantity} unité(s) ${randomType} par don`,
            time: 'Maintenant',
            metadata: { type: randomType, quantity: quantity }
        });

        this.showNotification(`🎉 ${quantity} unité(s) ${randomType} reçue(s) par don`, 'success');
    }

    simulateStockUpdate() {
        // Simulation de consommation aléatoire
        const bloodTypes = Object.keys(this.stocks);
        const randomType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
        const consumption = Math.floor(Math.random() * 2) + 1;

        if (this.stocks[randomType].current >= consumption) {
            this.stocks[randomType].current -= consumption;
            
            this.addActivityLog({
                type: 'stock',
                title: `Utilisation - ${randomType}`,
                description: `${consumption} unité(s) ${randomType} utilisée(s) pour soins`,
                time: 'Maintenant',
                metadata: { type: randomType, consumption: consumption }
            });
        }
    }

    simulateReservationUpdate() {
        // Simulation de mise à jour de réservation
        if (this.pendingReservations.length > 0) {
            const randomReservation = this.pendingReservations[Math.floor(Math.random() * this.pendingReservations.length)];
            if (randomReservation.status === 'pending') {
                randomReservation.status = 'shipped';
                
                this.addActivityLog({
                    type: 'reservation',
                    title: 'Réservation expédiée',
                    description: `Réservation #${randomReservation.id} en cours de livraison`,
                    time: 'Maintenant',
                    metadata: { id: randomReservation.id, status: 'shipped' }
                });

                this.showNotification(`📦 Réservation #${randomReservation.id} expédiée`, 'info');
            }
        }
    }

    simulateEmergencyResponse() {
        // Simulation de réponses aux urgences
        if (this.activeEmergencies.length > 0) {
            const randomEmergency = this.activeEmergencies[Math.floor(Math.random() * this.activeEmergencies.length)];
            if (randomEmergency.responded < randomEmergency.required) {
                randomEmergency.responded += Math.floor(Math.random() * 2) + 1;
                
                this.addActivityLog({
                    type: 'emergency',
                    title: 'Nouvelles réponses',
                    description: `${randomEmergency.responded}/${randomEmergency.required} donneurs ont répondu à l'urgence ${randomEmergency.bloodType}`,
                    time: 'Maintenant',
                    metadata: { bloodType: randomEmergency.bloodType, responses: randomEmergency.responded }
                });
            }
        }
    }

    addActivityLog(activity) {
        this.activityLog.unshift(activity);
        if (this.activityLog.length > 10) {
            this.activityLog.pop();
        }
        this.updateActivityTimeline();
    }

    checkCriticalStocks() {
        Object.entries(this.stocks).forEach(([type, data]) => {
            if (data.current <= data.min && data.status !== 'critical') {
                data.status = 'critical';
                this.showNotification(`⚠️ Stock ${type} critique: ${data.current} unité(s) restante(s)`, 'warning');
                
                this.addActivityLog({
                    type: 'stock',
                    title: `Stock ${type} critique`,
                    description: `Le stock ${type} est descendu à ${data.current} unité(s)`,
                    time: 'Maintenant',
                    metadata: { type: type, level: data.current, status: 'critical' }
                });
            }
        });
    }
}

// Initialisation de l'application
const hospitalApp = new HospitalApp();