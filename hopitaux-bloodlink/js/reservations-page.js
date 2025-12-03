// BloodLink Hôpitaux - Page Réservations
class ReservationsPage {
    constructor() {
        this.reservations = [];
        this.filteredReservations = [];
        this.currentFilters = {
            status: 'all',
            bloodType: 'all',
            urgency: 'all',
            search: ''
        };
        
        this.init();
    }

    init() {
        this.loadReservations();
        this.setupEventListeners();
        this.renderReservations();
        this.updateStats();
    }

    loadReservations() {
        // Chargement des réservations depuis le localStorage ou données par défaut
        const savedReservations = localStorage.getItem('bloodlink_reservations');
        
        if (savedReservations) {
            this.reservations = JSON.parse(savedReservations);
        } else {
            // Données d'exemple
            this.reservations = [
                {
                    id: 'RES-2024001',
                    bloodType: 'O-',
                    quantity: 4,
                    urgency: 'critical',
                    service: 'Urgences Traumatologie',
                    reason: 'Accident de la route - patient critique',
                    status: 'pending',
                    requestedAt: new Date('2024-01-15T08:30:00'),
                    estimatedDelivery: new Date('2024-01-15T12:30:00'),
                    hospital: 'Hôpital Central Paris'
                },
                {
                    id: 'RES-2024002',
                    bloodType: 'A+',
                    quantity: 6,
                    urgency: 'normal',
                    service: 'Chirurgie Cardiaque',
                    reason: 'Pontage coronarien programmé',
                    status: 'confirmed',
                    requestedAt: new Date('2024-01-14T14:20:00'),
                    confirmedAt: new Date('2024-01-14T16:45:00'),
                    estimatedDelivery: new Date('2024-01-16T14:20:00'),
                    hospital: 'Hôpital Central Paris'
                },
                {
                    id: 'RES-2024003',
                    bloodType: 'B+',
                    quantity: 2,
                    urgency: 'urgent',
                    service: 'Maternité',
                    reason: 'Hémorragie du post-partum',
                    status: 'shipped',
                    requestedAt: new Date('2024-01-15T10:15:00'),
                    confirmedAt: new Date('2024-01-15T11:30:00'),
                    shippedAt: new Date('2024-01-15T13:45:00'),
                    estimatedDelivery: new Date('2024-01-15T16:00:00'),
                    hospital: 'Hôpital Central Paris'
                },
                {
                    id: 'RES-2024004',
                    bloodType: 'AB-',
                    quantity: 3,
                    urgency: 'normal',
                    service: 'Oncologie',
                    reason: 'Chimiothérapie - préparation',
                    status: 'delivered',
                    requestedAt: new Date('2024-01-13T09:00:00'),
                    confirmedAt: new Date('2024-01-13T11:20:00'),
                    shippedAt: new Date('2024-01-14T08:30:00'),
                    deliveredAt: new Date('2024-01-14T14:15:00'),
                    hospital: 'Hôpital Central Paris'
                },
                {
                    id: 'RES-2024005',
                    bloodType: 'O+',
                    quantity: 8,
                    urgency: 'critical',
                    service: 'Chirurgie Vasculaire',
                    reason: 'Anévrisme aortique rompu',
                    status: 'pending',
                    requestedAt: new Date('2024-01-15T16:45:00'),
                    estimatedDelivery: new Date('2024-01-15T20:45:00'),
                    hospital: 'Hôpital Central Paris'
                }
            ];
            this.saveReservations();
        }
        
        this.filteredReservations = [...this.reservations];
    }

    saveReservations() {
        localStorage.setItem('bloodlink_reservations', JSON.stringify(this.reservations));
    }

    setupEventListeners() {
        // Recherche en temps réel
        const searchInput = document.getElementById('reservationSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.applyFilters();
            });
        }

        // Filtres
        const statusFilter = document.getElementById('statusFilter');
        const bloodTypeFilter = document.getElementById('bloodTypeFilter');
        const urgencyFilter = document.getElementById('urgencyFilter');

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value;
                this.applyFilters();
            });
        }

        if (bloodTypeFilter) {
            bloodTypeFilter.addEventListener('change', (e) => {
                this.currentFilters.bloodType = e.target.value;
                this.applyFilters();
            });
        }

        if (urgencyFilter) {
            urgencyFilter.addEventListener('change', (e) => {
                this.currentFilters.urgency = e.target.value;
                this.applyFilters();
            });
        }

        // Date minimale pour le formulaire
        const dateInput = document.getElementById('reservationDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
    }

    applyFilters() {
        this.filteredReservations = this.reservations.filter(reservation => {
            // Filtre par statut
            if (this.currentFilters.status !== 'all' && reservation.status !== this.currentFilters.status) {
                return false;
            }
            
            // Filtre par groupe sanguin
            if (this.currentFilters.bloodType !== 'all' && reservation.bloodType !== this.currentFilters.bloodType) {
                return false;
            }
            
            // Filtre par urgence
            if (this.currentFilters.urgency !== 'all' && reservation.urgency !== this.currentFilters.urgency) {
                return false;
            }
            
            // Filtre par recherche
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase();
                const searchableText = [
                    reservation.id,
                    reservation.bloodType,
                    reservation.service,
                    reservation.reason,
                    reservation.status
                ].join(' ').toLowerCase();
                
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.renderReservations();
    }

    renderReservations() {
        const container = document.getElementById('reservationsContainer');
        if (!container) return;

        if (this.filteredReservations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h3>Aucune réservation trouvée</h3>
                    <p>Aucune réservation ne correspond à vos critères de recherche.</p>
                    <button class="btn btn-primary" onclick="reservationSystem.openReservationModal()">
                        Créer une nouvelle réservation
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredReservations.map(reservation => `
            <div class="reservation-card ${reservation.status}" onclick="reservationsPage.showReservationDetail('${reservation.id}')">
                <div class="reservation-header">
                    <div class="reservation-id">${reservation.id}</div>
                    <div class="reservation-status ${reservation.status}">
                        ${this.getStatusText(reservation.status)}
                    </div>
                </div>
                
                <div class="reservation-content">
                    <div class="reservation-info">
                        <div class="info-item">
                            <span class="info-label">Groupe sanguin:</span>
                            <span class="info-value blood-type ${reservation.bloodType}">${reservation.bloodType}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Quantité:</span>
                            <span class="info-value">${reservation.quantity} unités</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Service:</span>
                            <span class="info-value">${reservation.service}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Urgence:</span>
                            <span class="info-value urgency-${reservation.urgency}">
                                ${this.getUrgencyText(reservation.urgency)}
                            </span>
                        </div>
                    </div>
                    
                    <div class="reservation-timeline">
                        <div class="timeline-item ${reservation.status === 'pending' ? 'active' : 'completed'}">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <span class="timeline-title">Demandée</span>
                                <span class="timeline-date">${this.formatDate(reservation.requestedAt)}</span>
                            </div>
                        </div>
                        
                        <div class="timeline-item ${reservation.status === 'confirmed' || reservation.status === 'shipped' || reservation.status === 'delivered' ? 'completed' : ''} ${reservation.status === 'confirmed' ? 'active' : ''}">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <span class="timeline-title">Confirmée</span>
                                <span class="timeline-date">${reservation.confirmedAt ? this.formatDate(reservation.confirmedAt) : 'En attente'}</span>
                            </div>
                        </div>
                        
                        <div class="timeline-item ${reservation.status === 'shipped' || reservation.status === 'delivered' ? 'completed' : ''} ${reservation.status === 'shipped' ? 'active' : ''}">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <span class="timeline-title">Expédiée</span>
                                <span class="timeline-date">${reservation.shippedAt ? this.formatDate(reservation.shippedAt) : 'En attente'}</span>
                            </div>
                        </div>
                        
                        <div class="timeline-item ${reservation.status === 'delivered' ? 'completed' : ''} ${reservation.status === 'delivered' ? 'active' : ''}">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <span class="timeline-title">Livrée</span>
                                <span class="timeline-date">${reservation.deliveredAt ? this.formatDate(reservation.deliveredAt) : 'En attente'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="reservation-actions">
                    ${reservation.status === 'pending' ? `
                        <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); reservationsPage.cancelReservation('${reservation.id}')">
                            Annuler
                        </button>
                    ` : ''}
                    
                    ${reservation.status === 'delivered' ? `
                        <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); reservationsPage.downloadReceipt('${reservation.id}')">
                            📄 Reçu
                        </button>
                    ` : ''}
                    
                    <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); reservationsPage.showReservationDetail('${reservation.id}')">
                        Détails
                    </button>
                </div>
            </div>
        `).join('');

        // Mise à jour des réservations en retard
        this.renderDelayedReservations();
    }

    renderDelayedReservations() {
        const container = document.getElementById('delayedReservations');
        if (!container) return;

        const delayed = this.reservations.filter(reservation => {
            if (reservation.status !== 'shipped') return false;
            
            const now = new Date();
            const deliveryDate = new Date(reservation.estimatedDelivery);
            return now > deliveryDate;
        });

        if (delayed.length === 0) {
            container.innerHTML = `
                <div class="empty-state small">
                    <div class="empty-icon">✅</div>
                    <p>Aucune réservation en retard</p>
                </div>
            `;
            return;
        }

        container.innerHTML = delayed.map(reservation => `
            <div class="delayed-card">
                <div class="delayed-header">
                    <div class="delayed-id">${reservation.id}</div>
                    <div class="delayed-alert">⚠️ En retard</div>
                </div>
                
                <div class="delayed-content">
                    <div class="delayed-info">
                        <span class="blood-type ${reservation.bloodType}">${reservation.bloodType}</span>
                        <span class="quantity">${reservation.quantity} unités</span>
                        <span class="service">${reservation.service}</span>
                    </div>
                    
                    <div class="delayed-time">
                        <span>Livraison prévue: ${this.formatDate(reservation.estimatedDelivery)}</span>
                        <span class="time-late">Retard: ${this.calculateDelay(reservation.estimatedDelivery)}</span>
                    </div>
                </div>
                
                <div class="delayed-actions">
                    <button class="btn btn-sm btn-emergency" onclick="reservationsPage.contactSupplier('${reservation.id}')">
                        📞 Contacter
                    </button>
                </div>
            </div>
        `).join('');
    }

    getStatusText(status) {
        const statusTexts = {
            'pending': 'En attente',
            'confirmed': 'Confirmée',
            'shipped': 'En transit',
            'delivered': 'Livrée',
            'cancelled': 'Annulée'
        };
        return statusTexts[status] || status;
    }

    getUrgencyText(urgency) {
        const urgencyTexts = {
            'normal': 'Normale',
            'urgent': 'Urgente',
            'critical': 'Critique'
        };
        return urgencyTexts[urgency] || urgency;
    }

    formatDate(date) {
        if (!date) return 'N/A';
        
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    calculateDelay(estimatedDate) {
        const now = new Date();
        const estimated = new Date(estimatedDate);
        const diffMs = now - estimated;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffHours < 1) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            return `${diffMinutes} min`;
        } else if (diffHours < 24) {
            return `${diffHours} h`;
        } else {
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays} j`;
        }
    }

    updateStats() {
        const pendingCount = this.reservations.filter(r => r.status === 'pending').length;
        const confirmedCount = this.reservations.filter(r => r.status === 'confirmed').length;
        const shippedCount = this.reservations.filter(r => r.status === 'shipped').length;
        const deliveredCount = this.reservations.filter(r => r.status === 'delivered').length;

        document.getElementById('pendingCount').textContent = pendingCount;
        document.getElementById('confirmedCount').textContent = confirmedCount;
        document.getElementById('shippedCount').textContent = shippedCount;
        document.getElementById('deliveredCount').textContent = deliveredCount;

        // Mise à jour du badge dans la navigation
        const reservationBadge = document.getElementById('reservationBadge');
        if (reservationBadge) {
            reservationBadge.textContent = pendingCount;
        }
    }

    showReservationDetail(reservationId) {
        const reservation = this.reservations.find(r => r.id === reservationId);
        if (!reservation) return;

        const modal = document.getElementById('reservationDetailModal');
        const content = document.getElementById('reservationDetailContent');
        
        if (!modal || !content) return;

        content.innerHTML = `
            <div class="reservation-detail">
                <div class="detail-header">
                    <div class="detail-id">${reservation.id}</div>
                    <div class="detail-status ${reservation.status}">
                        ${this.getStatusText(reservation.status)}
                    </div>
                </div>
                
                <div class="detail-grid">
                    <div class="detail-section">
                        <h4>Informations Produit</h4>
                        <div class="detail-item">
                            <span class="detail-label">Groupe sanguin:</span>
                            <span class="detail-value blood-type ${reservation.bloodType}">${reservation.bloodType}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Quantité:</span>
                            <span class="detail-value">${reservation.quantity} unités</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Urgence:</span>
                            <span class="detail-value urgency-${reservation.urgency}">
                                ${this.getUrgencyText(reservation.urgency)}
                            </span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Informations Demande</h4>
                        <div class="detail-item">
                            <span class="detail-label">Service:</span>
                            <span class="detail-value">${reservation.service}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Motif:</span>
                            <span class="detail-value">${reservation.reason || 'Non spécifié'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Hôpital:</span>
                            <span class="detail-value">${reservation.hospital}</span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Dates Importantes</h4>
                        <div class="detail-item">
                            <span class="detail-label">Demandée le:</span>
                            <span class="detail-value">${this.formatDate(reservation.requestedAt)}</span>
                        </div>
                        ${reservation.confirmedAt ? `
                        <div class="detail-item">
                            <span class="detail-label">Confirmée le:</span>
                            <span class="detail-value">${this.formatDate(reservation.confirmedAt)}</span>
                        </div>
                        ` : ''}
                        ${reservation.shippedAt ? `
                        <div class="detail-item">
                            <span class="detail-label">Expédiée le:</span>
                            <span class="detail-value">${this.formatDate(reservation.shippedAt)}</span>
                        </div>
                        ` : ''}
                        ${reservation.deliveredAt ? `
                        <div class="detail-item">
                            <span class="detail-label">Livrée le:</span>
                            <span class="detail-value">${this.formatDate(reservation.deliveredAt)}</span>
                        </div>
                        ` : ''}
                        ${reservation.estimatedDelivery ? `
                        <div class="detail-item">
                            <span class="detail-label">Livraison estimée:</span>
                            <span class="detail-value ${new Date() > new Date(reservation.estimatedDelivery) ? 'late' : ''}">
                                ${this.formatDate(reservation.estimatedDelivery)}
                                ${new Date() > new Date(reservation.estimatedDelivery) ? ' (En retard)' : ''}
                            </span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="detail-actions">
                    ${reservation.status === 'pending' ? `
                        <button class="btn btn-outline" onclick="reservationsPage.cancelReservation('${reservation.id}')">
                            Annuler la réservation
                        </button>
                    ` : ''}
                    
                    ${reservation.status === 'shipped' ? `
                        <button class="btn btn-emergency" onclick="reservationsPage.contactSupplier('${reservation.id}')">
                            📞 Contacter le fournisseur
                        </button>
                    ` : ''}
                    
                    ${reservation.status === 'delivered' ? `
                        <button class="btn btn-primary" onclick="reservationsPage.downloadReceipt('${reservation.id}')">
                            📄 Télécharger le reçu
                        </button>
                    ` : ''}
                    
                    <button class="btn btn-outline" onclick="closeReservationDetail()">
                        Fermer
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    cancelReservation(reservationId) {
        if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
            return;
        }

        const reservation = this.reservations.find(r => r.id === reservationId);
        if (reservation) {
            reservation.status = 'cancelled';
            reservation.cancelledAt = new Date();
            this.saveReservations();
            this.renderReservations();
            this.updateStats();
            
            hospitalApp.showNotification(`Réservation ${reservationId} annulée`, 'warning');
            closeReservationDetail();
        }
    }

    contactSupplier(reservationId) {
        hospitalApp.showNotification(`Contact du fournisseur pour ${reservationId}...`, 'info');
        // Simulation d'appel
        setTimeout(() => {
            hospitalApp.showNotification(`✅ Fournisseur contacté pour ${reservationId}`, 'success');
        }, 2000);
    }

    downloadReceipt(reservationId) {
        hospitalApp.showNotification(`Téléchargement du reçu pour ${reservationId}`, 'info');
        // Simulation de téléchargement
        setTimeout(() => {
            hospitalApp.showNotification(`📄 Reçu téléchargé pour ${reservationId}`, 'success');
        }, 1500);
    }

    addReservation(reservationData) {
        const newReservation = {
            id: `RES-${new Date().getFullYear()}${String(this.reservations.length + 1).padStart(3, '0')}`,
            bloodType: reservationData.bloodType,
            quantity: reservationData.quantity,
            urgency: reservationData.urgency,
            service: reservationData.service,
            reason: reservationData.reason,
            status: 'pending',
            requestedAt: new Date(),
            estimatedDelivery: reservationSystem.calculateDeliveryDate(reservationData.urgency),
            hospital: 'Hôpital Central Paris'
        };

        this.reservations.unshift(newReservation);
        this.saveReservations();
        this.renderReservations();
        this.updateStats();
        
        hospitalApp.showNotification(`Réservation ${newReservation.id} créée avec succès!`, 'success');
        
        // Simulation de traitement
        reservationSystem.simulateReservationProcessing(newReservation);
    }
}

// Initialisation de la page
const reservationsPage = new ReservationsPage();

// Fonctions globales
function applyFilters() {
    reservationsPage.applyFilters();
}

function closeReservationDetail() {
    const modal = document.getElementById('reservationDetailModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function exportReservations() {
    hospitalApp.showNotification('Export des réservations en cours...', 'info');
    // Simulation d'export
    setTimeout(() => {
        hospitalApp.showNotification('📊 Réservations exportées avec succès!', 'success');
    }, 2000);
}

// Gestion de la soumission du formulaire de réservation
document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                bloodType: document.getElementById('reservationBloodType').value,
                quantity: parseInt(document.getElementById('reservationQuantity').value),
                urgency: document.getElementById('reservationUrgency').value,
                service: document.getElementById('reservationService').value,
                reason: document.getElementById('reservationReason').value
            };
            
            reservationsPage.addReservation(formData);
            reservationSystem.closeReservationModal();
        });
    }
});