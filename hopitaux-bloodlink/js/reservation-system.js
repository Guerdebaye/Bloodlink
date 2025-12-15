// BloodLink Hôpitaux - Système de Réservations
class ReservationSystem {
    constructor(hospitalApp) {
        this.app = hospitalApp;
        this.setupReservationEvents();
    }

    setupReservationEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[onclick*="makeReservation"]')) {
                e.preventDefault();
                this.openReservationModal();
            }
            
            if (e.target.closest('[onclick*="openReservationsPage"]')) {
                e.preventDefault();
                this.openReservationsPage();
            }
        });
    }

    openReservationModal() {
        this.app.showNotification('Ouverture du module de réservation...', 'info');
        // Simulation d'ouverture de modal de réservation
        setTimeout(() => {
            this.showReservationForm();
        }, 500);
    }

    showReservationForm() {
        const modalHTML = `
            <div class="modal-overlay active" id="reservationModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>📦 Nouvelle Réservation</h3>
                        <button class="modal-close" onclick="reservationSystem.closeReservationModal()">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="reservationForm">
                            <div class="form-group">
                                <label>Produit Sanguin *</label>
                                <select id="reservationBloodType" required>
                                    <option value="">Sélectionnez un produit</option>
                                    ${Object.keys(this.app.stocks).map(type => `
                                        <option value="${type}" data-stock="${this.app.stocks[type].current}">
                                            ${type} (${this.app.stocks[type].current} unités disponibles)
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Quantité *</label>
                                <input type="number" id="reservationQuantity" min="1" max="50" required>
                            </div>
                            <div class="form-group">
                                <label>Urgence de la demande</label>
                                <select id="reservationUrgency">
                                    <option value="normal">Normale (48h)</option>
                                    <option value="urgent">Urgente (24h)</option>
                                    <option value="critical">Critique (4h)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Motif de la demande</label>
                                <textarea id="reservationReason" placeholder="Chirurgie programmée, stock sécurité, etc."></textarea>
                            </div>
                            <div class="form-group">
                                <label>Service demandeur</label>
                                <input type="text" id="reservationService" placeholder="Ex: Chirurgie Cardiaque">
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn btn-outline" onclick="reservationSystem.closeReservationModal()">
                                    Annuler
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    📋 Soumettre la réservation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Gestion du formulaire
        const form = document.getElementById('reservationForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleReservationSubmission();
        });

        // Mise à jour de la quantité max basée sur le stock
        const bloodTypeSelect = document.getElementById('reservationBloodType');
        const quantityInput = document.getElementById('reservationQuantity');
        
        bloodTypeSelect.addEventListener('change', () => {
            const selectedOption = bloodTypeSelect.options[bloodTypeSelect.selectedIndex];
            const availableStock = parseInt(selectedOption.getAttribute('data-stock'));
            quantityInput.max = Math.min(50, availableStock * 2); // Permettre de commander jusqu'à 2x le stock
        });
    }

    closeReservationModal() {
        const modal = document.getElementById('reservationModal');
        if (modal) {
            modal.remove();
        }
    }

    handleReservationSubmission() {
        const bloodType = document.getElementById('reservationBloodType').value;
        const quantity = parseInt(document.getElementById('reservationQuantity').value);
        const urgency = document.getElementById('reservationUrgency').value;
        const reason = document.getElementById('reservationReason').value;
        const service = document.getElementById('reservationService').value;

        if (!bloodType || !quantity) {
            this.app.showNotification('Veuillez remplir tous les champs obligatoires', 'warning');
            return;
        }

        const reservation = {
            id: `RES-${Date.now()}`,
            bloodType: bloodType,
            quantity: quantity,
            urgency: urgency,
            reason: reason,
            service: service,
            status: 'pending',
            requestedAt: new Date(),
            hospital: this.app.currentHospital.name,
            estimatedDelivery: this.calculateDeliveryDate(urgency)
        };

        this.createReservation(reservation);
        this.closeReservationModal();
    }

    calculateDeliveryDate(urgency) {
        const now = new Date();
        switch (urgency) {
            case 'critical':
                return new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 heures
            case 'urgent':
                return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 heures
            case 'normal':
            default:
                return new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 heures
        }
    }

    createReservation(reservation) {
        this.app.pendingReservations.push(reservation);

        this.app.addActivityLog({
            type: 'reservation',
            title: `Nouvelle réservation - ${reservation.bloodType}`,
            description: `Réservation de ${reservation.quantity} unité(s) ${reservation.bloodType} pour ${reservation.service}`,
            time: 'Maintenant',
            metadata: {
                bloodType: reservation.bloodType,
                quantity: reservation.quantity,
                id: reservation.id,
                service: reservation.service
            }
        });

        this.app.showNotification(
            `📋 Réservation ${reservation.id} créée! Livraison estimée: ${this.formatDeliveryDate(reservation.estimatedDelivery)}`,
            'success'
        );

        // Simulation de traitement
        this.simulateReservationProcessing(reservation);

        this.app.updateDashboard();
    }

    formatDeliveryDate(date) {
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    simulateReservationProcessing(reservation) {
        // Simulation des différentes étapes de la réservation
        const processingTime = this.getProcessingTime(reservation.urgency);

        setTimeout(() => {
            reservation.status = 'confirmed';
            reservation.confirmedAt = new Date();
            
            this.app.addActivityLog({
                type: 'reservation',
                title: `Réservation confirmée - ${reservation.id}`,
                description: `Réservation confirmée par le centre de sang`,
                time: 'Maintenant',
                metadata: {
                    id: reservation.id,
                    status: 'confirmed'
                }
            });

            this.app.showNotification(`✅ Réservation ${reservation.id} confirmée!`, 'success');

            // Passage à l'étape suivante
            this.simulateReservationShipping(reservation);

        }, processingTime.confirmation);
    }

    simulateReservationShipping(reservation) {
        const processingTime = this.getProcessingTime(reservation.urgency);

        setTimeout(() => {
            reservation.status = 'shipped';
            reservation.shippedAt = new Date();
            
            this.app.addActivityLog({
                type: 'reservation',
                title: `Réservation expédiée - ${reservation.id}`,
                description: `Les produits sanguins ont été expédiés`,
                time: 'Maintenant',
                metadata: {
                    id: reservation.id,
                    status: 'shipped'
                }
            });

            this.app.showNotification(`🚚 Réservation ${reservation.id} expédiée!`, 'info');

            // Livraison finale
            this.simulateReservationDelivery(reservation);

        }, processingTime.shipping);
    }

    simulateReservationDelivery(reservation) {
        const processingTime = this.getProcessingTime(reservation.urgency);

        setTimeout(() => {
            reservation.status = 'delivered';
            reservation.deliveredAt = new Date();
            
            // Mise à jour du stock
            this.app.stocks[reservation.bloodType].current += reservation.quantity;
            
            this.app.addActivityLog({
                type: 'stock',
                title: `Livraison reçue - ${reservation.bloodType}`,
                description: `${reservation.quantity} unité(s) ${reservation.bloodType} livrée(s) - ${reservation.id}`,
                time: 'Maintenant',
                metadata: {
                    bloodType: reservation.bloodType,
                    quantity: reservation.quantity,
                    id: reservation.id
                }
            });

            this.app.showNotification(
                `📦 ${reservation.quantity} unité(s) ${reservation.bloodType} livrée(s)! Stock mis à jour.`,
                'success'
            );

            this.app.updateDashboard();

        }, processingTime.delivery);
    }

    getProcessingTime(urgency) {
        const times = {
            critical: {
                confirmation: 3000,   // 3 secondes
                shipping: 5000,       // 5 secondes
                delivery: 7000        // 7 secondes
            },
            urgent: {
                confirmation: 8000,   // 8 secondes
                shipping: 10000,      // 10 secondes
                delivery: 12000       // 12 secondes
            },
            normal: {
                confirmation: 15000,  // 15 secondes
                shipping: 20000,      // 20 secondes
                delivery: 25000       // 25 secondes
            }
        };
        
        return times[urgency] || times.normal;
    }

    openReservationsPage() {
        this.app.showNotification('Ouverture de la page des réservations...', 'info');
        // Redirection simulée
        setTimeout(() => {
            window.location.href = 'reservations.html';
        }, 1000);
    }

    // Méthode pour annuler une réservation
    cancelReservation(reservationId) {
        const reservation = this.app.pendingReservations.find(r => r.id === reservationId);
        if (reservation && reservation.status === 'pending') {
            reservation.status = 'cancelled';
            reservation.cancelledAt = new Date();
            
            this.app.addActivityLog({
                type: 'reservation',
                title: `Réservation annulée - ${reservationId}`,
                description: `Réservation annulée par l'hôpital`,
                time: 'Maintenant',
                metadata: {
                    id: reservationId,
                    status: 'cancelled'
                }
            });

            this.app.showNotification(`❌ Réservation ${reservationId} annulée`, 'warning');
            this.app.updateDashboard();
        }
    }
}

// Initialisation du système de réservations
const reservationSystem = new ReservationSystem(hospitalApp);

// Fonctions globales
function makeReservation() { reservationSystem.openReservationModal(); }
function openReservationsPage() { reservationSystem.openReservationsPage(); }