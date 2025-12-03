// BloodLink Hôpitaux - Système de Gestion des Urgences
class EmergencySystem {
    constructor(hospitalApp) {
        this.app = hospitalApp;
        this.emergencyPanel = document.getElementById('emergencyPanel');
        this.setupEmergencyEvents();
    }

    setupEmergencyEvents() {
        // Ouverture du panneau d'urgence
        document.querySelectorAll('[onclick*="declareQuickEmergency"], [onclick*="declareEmergency"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openEmergencyPanel();
            });
        });

        // Gestion du formulaire d'urgence
        const emergencyForm = document.getElementById('emergencyForm');
        if (emergencyForm) {
            emergencyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEmergencySubmission();
            });
        }

        // Gestion des quantités
        const quantityInput = document.getElementById('emergencyQuantity');
        if (quantityInput) {
            // Les boutons + et - sont gérés par les fonctions globales
        }
    }

    openEmergencyPanel(bloodType = '') {
        this.emergencyPanel.classList.add('active');
        this.createOverlay();

        if (bloodType) {
            document.getElementById('emergencyBloodType').value = bloodType;
        }

        // Animation d'entrée
        this.emergencyPanel.style.animation = 'modalSlideIn 0.3s ease';
    }

    closeEmergencyPanel() {
        this.emergencyPanel.classList.remove('active');
        this.closeOverlay();
    }

    createOverlay() {
        let overlay = document.querySelector('.overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'overlay';
            overlay.addEventListener('click', () => this.closeEmergencyPanel());
            document.body.appendChild(overlay);
        }
        overlay.classList.add('active');
    }

    closeOverlay() {
        const overlay = document.querySelector('.overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    handleEmergencySubmission() {
        const bloodType = document.getElementById('emergencyBloodType').value;
        const quantity = parseInt(document.getElementById('emergencyQuantity').value);
        const urgencyLevel = document.querySelector('input[name="urgency"]:checked').value;
        const reason = document.getElementById('emergencyReason').value;

        if (!bloodType) {
            this.app.showNotification('Veuillez sélectionner un groupe sanguin', 'warning');
            return;
        }

        // Création de l'urgence
        const emergency = {
            id: Date.now(),
            bloodType: bloodType,
            quantity: quantity,
            urgency: urgencyLevel,
            reason: reason,
            timestamp: new Date(),
            status: 'active',
            responded: 0,
            required: quantity * 2, // On notifie 2x plus de donneurs que nécessaire
            hospital: this.app.currentHospital.name
        };

        this.declareEmergency(emergency);
        this.closeEmergencyPanel();
    }

    declareEmergency(emergency) {
        this.app.activeEmergencies.push(emergency);

        // Ajout dans les activités
        this.app.addActivityLog({
            type: 'emergency',
            title: `Urgence ${emergency.bloodType} déclarée`,
            description: `Urgence ${emergency.urgency} pour ${emergency.quantity} unité(s) ${emergency.bloodType}`,
            time: 'Maintenant',
            metadata: { 
                bloodType: emergency.bloodType, 
                quantity: emergency.quantity,
                urgency: emergency.urgency,
                reason: emergency.reason
            }
        });

        // Notification
        this.app.showNotification(
            `🚨 Urgence ${emergency.bloodType} déclarée! ${emergency.required} donneurs notifiés.`,
            'emergency'
        );

        // Mise à jour des stocks (simulation de consommation future)
        this.app.stocks[emergency.bloodType].current -= emergency.quantity;
        if (this.app.stocks[emergency.bloodType].current < 0) {
            this.app.stocks[emergency.bloodType].current = 0;
        }

        // Simulation de réponses progressives
        this.simulateEmergencyResponses(emergency);

        // Mise à jour de l'interface
        this.app.updateDashboard();
    }

    simulateEmergencyResponses(emergency) {
        // Simulation de réponses progressives des donneurs
        let responses = 0;
        const maxResponses = Math.min(emergency.required, emergency.required * 0.8); // 80% de réponse max

        const responseInterval = setInterval(() => {
            if (responses < maxResponses && emergency.status === 'active') {
                responses += Math.floor(Math.random() * 3) + 1;
                emergency.responded = Math.min(responses, maxResponses);

                // Notification périodique
                if (responses % 5 === 0) {
                    this.app.showNotification(
                        `🎯 ${emergency.responded} donneurs ont répondu à l'urgence ${emergency.bloodType}`,
                        'info'
                    );
                }

                // Si objectif atteint
                if (emergency.responded >= emergency.required) {
                    clearInterval(responseInterval);
                    this.completeEmergency(emergency);
                }

                this.app.updateDashboard();
            }
        }, 10000); // Nouvelle réponse toutes les 10 secondes

        // Timeout pour compléter l'urgence après 5 minutes
        setTimeout(() => {
            if (emergency.status === 'active') {
                clearInterval(responseInterval);
                this.completeEmergency(emergency);
            }
        }, 300000); // 5 minutes
    }

    completeEmergency(emergency) {
        emergency.status = 'completed';
        emergency.completedAt = new Date();

        this.app.addActivityLog({
            type: 'emergency',
            title: `Urgence ${emergency.bloodType} complétée`,
            description: `${emergency.responded} donneurs ont répondu à l'appel`,
            time: 'Maintenant',
            metadata: { 
                bloodType: emergency.bloodType,
                responses: emergency.responded,
                required: emergency.required
            }
        });

        this.app.showNotification(
            `✅ Urgence ${emergency.bloodType} complétée avec succès!`,
            'success'
        );

        // Retirer l'urgence active après un délai
        setTimeout(() => {
            const index = this.app.activeEmergencies.findIndex(e => e.id === emergency.id);
            if (index > -1) {
                this.app.activeEmergencies.splice(index, 1);
                this.app.updateDashboard();
            }
        }, 10000);
    }

    // Fonctions globales pour les boutons
    declareQuickEmergency() {
        this.openEmergencyPanel();
    }

    declareEmergencyFromStock(bloodType) {
        this.openEmergencyPanel(bloodType);
    }

    respondToUrgency(type) {
        const message = type === 'critical' 
            ? '🚨 Merci pour votre réponse rapide à cette urgence critique!' 
            : '⚠️ Merci de répondre à ce besoin important!';
        
        this.app.showNotification(message, 'success');
        
        // Animation de confirmation
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '✓ Confirmé';
        button.style.background = 'var(--success-green)';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 3000);
    }
}

// Initialisation du système d'urgence
const emergencySystem = new EmergencySystem(hospitalApp);

// Fonctions globales pour les onclick
function declareQuickEmergency() { emergencySystem.declareQuickEmergency(); }
function declareEmergency(bloodType) { emergencySystem.declareEmergencyFromStock(bloodType); }
function closeEmergencyPanel() { emergencySystem.closeEmergencyPanel(); }
function increaseQuantity() {
    const input = document.getElementById('emergencyQuantity');
    if (input && parseInt(input.value) < 20) {
        input.value = parseInt(input.value) + 1;
    }
}
function decreaseQuantity() {
    const input = document.getElementById('emergencyQuantity');
    if (input && parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}
function submitEmergency(event) { 
    event.preventDefault(); 
    emergencySystem.handleEmergencySubmission(); 
}