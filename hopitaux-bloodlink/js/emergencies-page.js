// BloodLink Hôpitaux - Page Urgences
class EmergenciesPage {
    constructor() {
        this.emergencies = [];
        this.filteredEmergencies = [];
        this.currentFilters = {
            urgency: 'all',
            bloodType: 'all'
        };
        
        this.init();
    }

    init() {
        this.loadEmergencyData();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.renderEmergencies();
        this.updateStats();
    }

    loadEmergencyData() {
        // Données d'exemple pour les urgences
        this.emergencies = [
            {
                id: 1,
                bloodType: 'O-',
                quantity: 5,
                urgency: 'critical',
                reason: 'Chirurgie cardiaque urgente - Patient en état critique',
                hospital: 'Hôpital Central Paris',
                timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
                status: 'active',
                responded: 8,
                required: 12,
                service: 'Chirurgie Cardiaque',
                intervention: 'Pontage coronarien urgent',
                progress: 67
            },
            {
                id: 2,
                bloodType: 'A+',
                quantity: 3,
                urgency: 'high',
                reason: 'Transfusion urgente pour hémorragie post-opératoire',
                hospital: 'Clinique Saint-Louis',
                timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
                status: 'active',
                responded: 5,
                required: 8,
                service: 'Chirurgie Générale',
                intervention: 'Contrôle hémorragie',
                progress: 63
            },
            {
                id: 3,
                bloodType: 'B+',
                quantity: 2,
                urgency: 'medium',
                reason: 'Besoin pour transfusion programmée en oncologie',
                hospital: 'Hôpital Nord',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                status: 'active',
                responded: 3,
                required: 6,
                service: 'Oncologie',
                intervention: 'Chimiothérapie',
                progress: 50
            }
        ];

        this.filteredEmergencies = [...this.emergencies];
    }

    setupEventListeners() {
        // Filtres
        document.getElementById('emergencyFilter').addEventListener('change', (e) => {
            this.currentFilters.urgency = e.target.value;
            this.applyFilters();
        });

        document.getElementById('bloodTypeFilter').addEventListener('change', (e) => {
            this.currentFilters.bloodType = e.target.value;
            this.applyFilters();
        });

        // Boutons de quantité prédéfinis
        document.querySelectorAll('.quantity-presets button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const quantity = parseInt(button.getAttribute('data-quantity'));
                document.getElementById('advancedQuantity').value = quantity;
                
                // Mise en surbrillance du bouton actif
                document.querySelectorAll('.quantity-presets button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
            });
        });

        // Clic sur les points de la carte
        document.querySelectorAll('.map-point').forEach(point => {
            point.addEventListener('click', () => {
                const emergencyId = parseInt(point.getAttribute('data-emergency'));
                this.focusEmergency(emergencyId);
            });
        });
    }

    startRealTimeUpdates() {
        // Mise à jour en temps réel des statistiques
        setInterval(() => {
            this.updateLiveStats();
            this.simulateNewResponses();
        }, 10000); // Toutes les 10 secondes

        // Simulation de nouvelles urgences aléatoires
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% de chance
                this.simulateRandomEmergency();
            }
        }, 30000); // Toutes les 30 secondes
    }

    updateLiveStats() {
        const activeCount = this.emergencies.filter(e => e.status === 'active').length;
        const pendingResponses = this.emergencies.reduce((sum, emergency) => 
            sum + (emergency.required - emergency.responded), 0
        );

        document.getElementById('activeEmergenciesCount').textContent = activeCount;
        document.getElementById('pendingResponses').textContent = pendingResponses;
        document.getElementById('urgentBadge').textContent = activeCount;

        // Mise à jour des donneurs actifs (simulation)
        const donorsElement = document.getElementById('activeDonors');
        if (donorsElement) {
            const current = parseInt(donorsElement.textContent);
            const change = Math.floor(Math.random() * 3) - 1; // -1, 0, ou +1
            donorsElement.textContent = Math.max(150, current + change);
        }
    }

    simulateNewResponses() {
        // Simulation de nouvelles réponses aux urgences actives
        this.emergencies.forEach(emergency => {
            if (emergency.status === 'active' && emergency.responded < emergency.required) {
                // 30% de chance de nouvelle réponse
                if (Math.random() < 0.3) {
                    emergency.responded += 1;
                    emergency.progress = Math.round((emergency.responded / emergency.required) * 100);
                    
                    // Mise à jour visuelle
                    this.updateEmergencyProgress(emergency.id);
                    
                    // Notification si objectif atteint
                    if (emergency.responded >= emergency.required) {
                        this.completeEmergency(emergency.id);
                    }
                }
            }
        });
        
        this.renderEmergencies();
    }

    updateEmergencyProgress(emergencyId) {
        const emergency = this.emergencies.find(e => e.id === emergencyId);
        if (emergency) {
            const progressBar = document.querySelector(`[data-emergency="${emergencyId}"] .progress-fill`);
            if (progressBar) {
                progressBar.style.width = `${emergency.progress}%`;
            }
            
            const percentageElement = document.querySelector(`[data-emergency="${emergencyId}"] .progress-percentage`);
            if (percentageElement) {
                percentageElement.textContent = `${emergency.progress}%`;
            }
        }
    }

    simulateRandomEmergency() {
        const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
        const urgencies = ['critical', 'high', 'medium'];
        const hospitals = ['Hôpital Central', 'Clinique Saint-Louis', 'Hôpital Européen', 'Centre Médical Sud'];
        const services = ['Urgences', 'Chirurgie', 'Cardiologie', 'Maternité', 'Oncologie'];
        const interventions = ['Accident', 'Chirurgie urgente', 'Hémorragie', 'Transfusion', 'Accouchement'];
        
        const newEmergency = {
            id: Date.now(),
            bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
            quantity: Math.floor(Math.random() * 4) + 1, // 1-4 unités
            urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
            reason: `${interventions[Math.floor(Math.random() * interventions.length)]} - Situation critique`,
            hospital: hospitals[Math.floor(Math.random() * hospitals.length)],
            timestamp: new Date(),
            status: 'active',
            responded: 0,
            required: Math.floor(Math.random() * 8) + 4, // 4-11 donneurs nécessaires
            service: services[Math.floor(Math.random() * services.length)],
            intervention: interventions[Math.floor(Math.random() * interventions.length)],
            progress: 0
        };

        this.emergencies.unshift(newEmergency);
        this.applyFilters();
        
        // Notification
        hospitalApp.showNotification(
            `🚨 Nouvelle urgence ${newEmergency.bloodType} déclarée à ${newEmergency.hospital}`,
            'emergency'
        );

        // Ajout d'un point sur la carte
        this.addMapPoint(newEmergency);
    }

    addMapPoint(emergency) {
        const map = document.getElementById('emergencyMap');
        const point = document.createElement('div');
        
        // Position aléatoire sur la carte
        const top = Math.random() * 80 + 10;
        const left = Math.random() * 80 + 10;
        
        point.className = `map-point ${emergency.urgency}`;
        point.style.top = `${top}%`;
        point.style.left = `${left}%`;
        point.setAttribute('data-emergency', emergency.id);
        
        point.innerHTML = `
            <div class="pulse-dot"></div>
            <div class="map-tooltip">
                <strong>Urgence ${emergency.bloodType} ${emergency.urgency}</strong>
                <span>${emergency.hospital} - ${emergency.quantity} unités</span>
                <span>${emergency.responded}/${emergency.required} réponses</span>
            </div>
        `;
        
        point.addEventListener('click', () => this.focusEmergency(emergency.id));
        map.appendChild(point);
    }

    applyFilters() {
        this.filteredEmergencies = this.emergencies.filter(emergency => {
            const urgencyMatch = this.currentFilters.urgency === 'all' || emergency.urgency === this.currentFilters.urgency;
            const bloodTypeMatch = this.currentFilters.bloodType === 'all' || emergency.bloodType === this.currentFilters.bloodType;
            return urgencyMatch && bloodTypeMatch;
        });
        
        this.renderEmergencies();
    }

    renderEmergencies() {
        const container = document.getElementById('emergenciesContainer');
        if (!container) return;

        if (this.filteredEmergencies.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🚨</div>
                    <h3>Aucune urgence active</h3>
                    <p>Toutes les urgences sont actuellement résolues.</p>
                    <button class="btn btn-emergency" onclick="declareQuickEmergency()">
                        Déclarer une nouvelle urgence
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredEmergencies.map(emergency => `
            <div class="emergency-card ${emergency.urgency}" data-emergency="${emergency.id}">
                <div class="emergency-header">
                    <div class="emergency-title">
                        <span class="emergency-badge ${emergency.urgency}">
                            ${this.getUrgencyLabel(emergency.urgency)}
                        </span>
                        <span class="emergency-blood-type">${emergency.bloodType}</span>
                    </div>
                    <div class="emergency-meta">
                        <span class="emergency-time">${this.formatTime(emergency.timestamp)}</span>
                        <span class="emergency-hospital">${emergency.hospital}</span>
                    </div>
                </div>
                
                <div class="emergency-content">
                    <div class="emergency-reason">${emergency.reason}</div>
                    
                    <div class="emergency-details">
                        <div class="detail-item">
                            <span class="detail-icon">🩸</span>
                            <div class="detail-info">
                                <span class="detail-label">Quantité requise</span>
                                <span class="detail-value">${emergency.quantity} unités</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <span class="detail-icon">🏥</span>
                            <div class="detail-info">
                                <span class="detail-label">Service</span>
                                <span class="detail-value">${emergency.service}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <span class="detail-icon">⚡</span>
                            <div class="detail-info">
                                <span class="detail-label">Intervention</span>
                                <span class="detail-value">${emergency.intervention}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="progress-container">
                        <div class="progress-header">
                            <span class="progress-label">Progression des réponses</span>
                            <span class="progress-percentage">${emergency.progress}%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-fill ${emergency.urgency}" style="width: ${emergency.progress}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="emergency-actions">
                    <button class="btn btn-primary" onclick="emergenciesPage.manageEmergency(${emergency.id})">
                        📋 Gérer l'urgence
                    </button>
                    <button class="btn btn-outline" onclick="emergenciesPage.viewEmergencyDetails(${emergency.id})">
                        👁️ Détails
                    </button>
                    <button class="btn btn-outline" onclick="emergenciesPage.escalateEmergency(${emergency.id})">
                        ⬆️ Escalader
                    </button>
                </div>
            </div>
        `).join('');
    }

    getUrgencyLabel(urgency) {
        const labels = {
            'critical': 'CRITIQUE',
            'high': 'ÉLEVÉE',
            'medium': 'MOYENNE'
        };
        return labels[urgency] || 'INCONNUE';
    }

    formatTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);

        if (minutes < 1) return 'À l\'instant';
        if (minutes < 60) return `Il y a ${minutes} min`;
        if (hours < 24) return `Il y a ${hours} h`;
        return timestamp.toLocaleDateString('fr-FR');
    }

    updateStats() {
        // Mise à jour des statistiques principales
        const activeCount = this.emergencies.filter(e => e.status === 'active').length;
        const totalResponses = this.emergencies.reduce((sum, e) => sum + e.responded, 0);
        const totalRequired = this.emergencies.reduce((sum, e) => sum + e.required, 0);
        const responseRate = totalRequired > 0 ? Math.round((totalResponses / totalRequired) * 100) : 0;

        document.getElementById('responseRate').textContent = `${responseRate}%`;
        document.getElementById('resolvedEmergencies').textContent = '12'; // Valeur simulée
        document.getElementById('livesSaved').textContent = '47'; // Valeur simulée
    }

    focusEmergency(emergencyId) {
        const emergency = this.emergencies.find(e => e.id === emergencyId);
        if (emergency) {
            // Scroll vers l'urgence et mise en surbrillance
            const element = document.querySelector(`[data-emergency="${emergencyId}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.style.animation = 'pulse 2s ease';
                setTimeout(() => {
                    element.style.animation = '';
                }, 2000);
            }
        }
    }

    manageEmergency(emergencyId) {
        const emergency = this.emergencies.find(e => e.id === emergencyId);
        if (emergency) {
            hospitalApp.showNotification(
                `📋 Ouverture du panneau de gestion pour l'urgence ${emergency.bloodType}`,
                'info'
            );
            
            // Simulation d'ouverture du panneau de gestion
            setTimeout(() => {
                this.openEmergencyManagementPanel(emergency);
            }, 500);
        }
    }

    openEmergencyManagementPanel(emergency) {
        const panelHTML = `
            <div class="modal-overlay active" id="managementPanel">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>📋 Gestion Urgence ${emergency.bloodType}</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="management-stats">
                            <div class="stat">
                                <span class="stat-value">${emergency.responded}/${emergency.required}</span>
                                <span class="stat-label">Donneurs répondants</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">${emergency.progress}%</span>
                                <span class="stat-label">Objectif atteint</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">${this.formatTime(emergency.timestamp)}</span>
                                <span class="stat-label">Déclenchée</span>
                            </div>
                        </div>
                        
                        <div class="management-actions">
                            <button class="btn btn-primary" onclick="emergenciesPage.notifyMoreDonors(${emergency.id})">
                                📢 Notifier plus de donneurs
                            </button>
                            <button class="btn btn-secondary" onclick="emergenciesPage.updateEmergency(${emergency.id})">
                                ✏️ Modifier l'urgence
                            </button>
                            <button class="btn btn-outline" onclick="emergenciesPage.cancelEmergency(${emergency.id})">
                                ❌ Annuler l'urgence
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', panelHTML);
    }

    viewEmergencyDetails(emergencyId) {
        const emergency = this.emergencies.find(e => e.id === emergencyId);
        if (emergency) {
            hospitalApp.showNotification(
                `👁️ Affichage des détails de l'urgence ${emergency.bloodType}`,
                'info'
            );
            
            // Ici, on pourrait ouvrir un modal avec tous les détails
            console.log('Détails urgence:', emergency);
        }
    }

    escalateEmergency(emergencyId) {
        const emergency = this.emergencies.find(e => e.id === emergencyId);
        if (emergency) {
            emergency.urgency = 'critical';
            this.renderEmergencies();
            
            hospitalApp.showNotification(
                `⬆️ Urgence ${emergency.bloodType} escaladée au niveau CRITIQUE`,
                'warning'
            );
        }
    }

    notifyMoreDonors(emergencyId) {
        const emergency = this.emergencies.find(e => e.id === emergencyId);
        if (emergency) {
            emergency.required += 5; // Notifier 5 donneurs supplémentaires
            this.renderEmergencies();
            
            hospitalApp.showNotification(
                `📢 5 donneurs supplémentaires notifiés pour l'urgence ${emergency.bloodType}`,
                'success'
            );
        }
    }

    completeEmergency(emergencyId) {
        const emergency = this.emergencies.find(e => e.id === emergencyId);
        if (emergency) {
            emergency.status = 'completed';
            this.renderEmergencies();
            
            hospitalApp.showNotification(
                `✅ Urgence ${emergency.bloodType} résolue avec succès!`,
                'success'
            );

            // Retirer de la carte après un délai
            setTimeout(() => {
                const point = document.querySelector(`[data-emergency="${emergencyId}"]`);
                if (point) {
                    point.remove();
                }
            }, 5000);
        }
    }

    // Méthodes pour les boutons d'action rapide
    declareQuickBloodType(bloodType) {
        const urgency = bloodType === 'O-' ? 'critical' : 
                       bloodType === 'O+' ? 'high' : 
                       bloodType === 'A-' ? 'high' : 'medium';
        
        const emergency = {
            id: Date.now(),
            bloodType: bloodType,
            quantity: 2,
            urgency: urgency,
            reason: 'Besoin urgent détecté via déclaration rapide',
            hospital: hospitalApp.currentHospital.name,
            timestamp: new Date(),
            status: 'active',
            responded: 0,
            required: 4,
            service: 'Urgences',
            intervention: 'Besoin immédiat',
            progress: 0
        };

        this.emergencies.unshift(emergency);
        this.applyFilters();
        
        hospitalApp.showNotification(
            `🚨 Urgence ${bloodType} déclarée via bouton rapide!`,
            'emergency'
        );

        this.addMapPoint(emergency);
    }
}

// Fonctions globales pour la page urgences
function refreshEmergencyMap() {
    hospitalApp.showNotification('🔄 Carte des urgences actualisée', 'info');
}

function toggleHeatMap() {
    hospitalApp.showNotification('🔥 Mode carte de chaleur activé', 'info');
}

function openAdvancedEmergencyForm() {
    document.getElementById('advancedEmergencyModal').classList.add('active');
    document.querySelector('.overlay').classList.add('active');
}

function closeAdvancedEmergencyModal() {
    document.getElementById('advancedEmergencyModal').classList.remove('active');
    document.querySelector('.overlay').classList.remove('active');
}

function submitAdvancedEmergency(event) {
    event.preventDefault();
    
    const bloodType = document.getElementById('advancedBloodType').value;
    const quantity = parseInt(document.getElementById('advancedQuantity').value);
    const urgency = document.querySelector('input[name="advancedUrgency"]:checked').value;
    const service = document.getElementById('emergencyService').value;
    const intervention = document.getElementById('interventionType').value;
    const notes = document.getElementById('emergencyNotes').value;

    const emergency = {
        id: Date.now(),
        bloodType: bloodType,
        quantity: quantity,
        urgency: urgency,
        reason: notes || `Besoin urgent pour ${service} - ${intervention}`,
        hospital: hospitalApp.currentHospital.name,
        timestamp: new Date(),
        status: 'active',
        responded: 0,
        required: quantity * 2,
        service: service,
        intervention: intervention,
        progress: 0
    };

    emergenciesPage.emergencies.unshift(emergency);
    emergenciesPage.applyFilters();
    emergenciesPage.addMapPoint(emergency);
    
    closeAdvancedEmergencyModal();
    
    hospitalApp.showNotification(
        `🚨 Urgence ${bloodType} avancée déclarée avec succès!`,
        'success'
    );
}

function openEmergencyAnalytics() {
    document.getElementById('analyticsPanel').classList.add('active');
    document.querySelector('.overlay').classList.add('active');
}

function closeAnalyticsPanel() {
    document.getElementById('analyticsPanel').classList.remove('active');
    document.querySelector('.overlay').classList.remove('active');
}

function declareEmergencyFromAlert(bloodType) {
    emergenciesPage.declareQuickBloodType(bloodType);
}

function viewDemandTrends() {
    hospitalApp.showNotification('📈 Ouverture des tendances de demandes', 'info');
}

function exportEmergencyHistory() {
    hospitalApp.showNotification('📄 Export de l\'historique des urgences', 'success');
}

// Initialisation de la page urgences
const emergenciesPage = new EmergenciesPage();