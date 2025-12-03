// BloodLink Hôpitaux - Simulations Avancées
class HospitalSimulations {
    constructor(hospitalApp) {
        this.app = hospitalApp;
        this.simulationInterval = null;
        this.isSimulationActive = false;
    }

    startComprehensiveSimulation() {
        if (this.isSimulationActive) return;
        
        this.isSimulationActive = true;
        this.app.showNotification('🚀 Démarrage des simulations complètes', 'info');

        // Simulation d'urgences aléatoires
        this.simulationInterval = setInterval(() => {
            this.runRandomSimulation();
        }, 15000); // Toutes les 15 secondes

        // Démarrer les simulations initiales
        this.runInitialSimulations();
    }

    stopSimulation() {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
        this.isSimulationActive = false;
        this.app.showNotification('⏹️ Simulations arrêtées', 'info');
    }

    runInitialSimulations() {
        // Créer quelques urgences initiales
        setTimeout(() => this.simulateEmergency('O-', 3, 'critical'), 2000);
        setTimeout(() => this.simulateEmergency('A+', 2, 'high'), 5000);
        
        // Créer des réservations initiales
        setTimeout(() => this.simulateReservation('B+', 4, 'normal'), 8000);
        setTimeout(() => this.simulateReservation('AB-', 2, 'urgent'), 11000);
    }

    runRandomSimulation() {
        const simulations = [
            () => this.simulateRandomEmergency(),
            () => this.simulateStockUpdate(),
            () => this.simulateDonation(),
            () => this.simulateMedicalUsage(),
            () => this.simulateReservationUpdate()
        ];

        const randomSimulation = simulations[Math.floor(Math.random() * simulations.length)];
        randomSimulation();
    }

    simulateRandomEmergency() {
        const bloodTypes = Object.keys(this.app.stocks);
        const randomType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
        const quantity = Math.floor(Math.random() * 4) + 1; // 1-4 unités
        const urgency = Math.random() > 0.7 ? 'critical' : 'high';

        this.simulateEmergency(randomType, quantity, urgency);
    }

    simulateEmergency(bloodType, quantity, urgency) {
        const emergency = {
            id: Date.now(),
            bloodType: bloodType,
            quantity: quantity,
            urgency: urgency,
            reason: this.getRandomEmergencyReason(),
            timestamp: new Date(),
            status: 'active',
            responded: 0,
            required: quantity * 2,
            hospital: this.app.currentHospital.name
        };

        // Utiliser le système d'urgence pour déclarer l'urgence
        emergencySystem.declareEmergency(emergency);
    }

    getRandomEmergencyReason() {
        const reasons = [
            'Accident de la route',
            'Chirurgie cardiaque urgente',
            'Hémorragie interne',
            'Accouchement compliqué',
            'Traumatisme grave',
            'Transplantation urgente'
        ];
        return reasons[Math.floor(Math.random() * reasons.length)];
    }

    simulateStockUpdate() {
        const bloodTypes = Object.keys(this.app.stocks);
        const randomType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
        
        // 70% de chance d'ajout, 30% de chance de retrait
        if (Math.random() > 0.3) {
            const quantity = Math.floor(Math.random() * 5) + 1;
            stockManager.simulateStockDelivery(randomType, quantity);
        } else {
            const quantity = Math.floor(Math.random() * 3) + 1;
            if (this.app.stocks[randomType].current >= quantity) {
                stockManager.simulateStockUsage(randomType, quantity);
            }
        }
    }

    simulateDonation() {
        const bloodTypes = Object.keys(this.app.stocks);
        const randomType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
        const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 unités

        this.app.stocks[randomType].current += quantity;
        
        this.app.addActivityLog({
            type: 'stock',
            title: `Don reçu - ${randomType}`,
            description: `Don de ${quantity} unité(s) ${randomType} par un donneur`,
            time: 'Maintenant',
            metadata: { 
                type: randomType, 
                quantity: quantity,
                source: 'don'
            }
        });

        this.app.showNotification(`🎉 Don de ${quantity} unité(s) ${randomType} reçu!`, 'success');
        this.app.updateDashboard();
    }

    simulateMedicalUsage() {
        const bloodTypes = Object.keys(this.app.stocks);
        const randomType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
        const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 unités

        if (this.app.stocks[randomType].current >= quantity) {
            this.app.stocks[randomType].current -= quantity;
            
            this.app.addActivityLog({
                type: 'stock',
                title: `Utilisation médicale - ${randomType}`,
                description: `${quantity} unité(s) ${randomType} utilisée(s) pour soins patients`,
                time: 'Maintenant',
                metadata: { 
                    type: randomType, 
                    quantity: quantity,
                    department: this.getRandomDepartment()
                }
            });

            this.app.updateDashboard();

            // Vérifier le stock critique
            if (this.app.stocks[randomType].current <= this.app.stocks[randomType].min) {
                this.app.stocks[randomType].status = 'critical';
                this.app.showNotification(
                    `⚠️ Stock ${randomType} critique: ${this.app.stocks[randomType].current} unité(s)`,
                    'warning'
                );
            }
        }
    }

    getRandomDepartment() {
        const departments = [
            'Urgences',
            'Chirurgie',
            'Cardiologie',
            'Maternité',
            'Oncologie',
            'Pédiatrie'
        ];
        return departments[Math.floor(Math.random() * departments.length)];
    }

    simulateReservationUpdate() {
        if (this.app.pendingReservations.length > 0) {
            const randomReservation = this.app.pendingReservations[
                Math.floor(Math.random() * this.app.pendingReservations.length)
            ];
            
            if (randomReservation.status === 'pending' && Math.random() > 0.7) {
                reservationSystem.simulateReservationProcessing(randomReservation);
            }
        } else {
            // Créer une nouvelle réservation si aucune en attente
            this.simulateNewReservation();
        }
    }

    simulateNewReservation() {
        const bloodTypes = Object.keys(this.app.stocks);
        const randomType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
        const quantity = Math.floor(Math.random() * 4) + 2; // 2-5 unités
        const urgency = ['normal', 'urgent', 'critical'][Math.floor(Math.random() * 3)];

        this.simulateReservation(randomType, quantity, urgency);
    }

    simulateReservation(bloodType, quantity, urgency) {
        const reservation = {
            id: `RES-${Date.now()}`,
            bloodType: bloodType,
            quantity: quantity,
            urgency: urgency,
            reason: 'Commande de stock sécurité',
            service: this.getRandomDepartment(),
            status: 'pending',
            requestedAt: new Date(),
            hospital: this.app.currentHospital.name,
            estimatedDelivery: reservationSystem.calculateDeliveryDate(urgency)
        };

        reservationSystem.createReservation(reservation);
    }

    // Simulation de crise majeure
    simulateMajorCrisis() {
        this.app.showNotification('🚨 SIMULATION: Crise majeure déclarée!', 'emergency');
        
        // Créer plusieurs urgences simultanées
        this.simulateEmergency('O-', 8, 'critical');
        this.simulateEmergency('O+', 6, 'critical');
        this.simulateEmergency('A+', 5, 'high');
        
        // Ajouter des notifications d'urgence
        setTimeout(() => {
            this.app.showNotification('📢 APPEL URGENT: Tous les donneurs O- et O+ requis!', 'emergency');
        }, 3000);
        
        setTimeout(() => {
            this.app.showNotification('🏥 Plan ORSEC sanguin activé - Coordination nationale', 'emergency');
        }, 6000);
    }

    // Simulation de scénario optimiste
    simulatePositiveScenario() {
        this.app.showNotification('🌟 SIMULATION: Scénario optimal activé', 'success');
        
        // Réapprovisionner tous les stocks
        Object.keys(this.app.stocks).forEach(type => {
            const needed = this.app.stocks[type].max - this.app.stocks[type].current;
            if (needed > 0) {
                this.app.stocks[type].current += needed;
            }
            this.app.stocks[type].status = 'normal';
        });
        
        // Compléter toutes les urgences
        this.app.activeEmergencies.forEach(emergency => {
            emergency.responded = emergency.required;
            emergency.status = 'completed';
        });
        
        // Livrer toutes les réservations
        this.app.pendingReservations.forEach(reservation => {
            if (reservation.status === 'pending' || reservation.status === 'confirmed') {
                reservation.status = 'delivered';
                reservation.deliveredAt = new Date();
            }
        });
        
        this.app.showNotification('✅ Tous les stocks réapprovisionnés! ✅ Toutes les urgences résolues!', 'success');
        this.app.updateDashboard();
    }

    // Génération de rapport de simulation
    generateSimulationReport() {
        const report = {
            timestamp: new Date(),
            duration: '15 minutes',
            emergenciesGenerated: this.app.activityLog.filter(a => a.type === 'emergency').length,
            stockUpdates: this.app.activityLog.filter(a => a.type === 'stock').length,
            reservationsProcessed: this.app.activityLog.filter(a => a.type === 'reservation').length,
            currentStocks: this.app.stocks,
            activeEmergencies: this.app.activeEmergencies.length,
            pendingReservations: this.app.pendingReservations.filter(r => 
                r.status === 'pending' || r.status === 'confirmed'
            ).length
        };

        console.log('📊 Rapport de Simulation BloodLink:', report);
        this.app.showNotification('📊 Rapport de simulation généré (voir console)', 'info');
        
        return report;
    }
}

// Initialisation des simulations
const hospitalSimulations = new HospitalSimulations(hospitalApp);

// Fonctions globales pour le contrôle des simulations
function startSimulation() { hospitalSimulations.startComprehensiveSimulation(); }
function stopSimulation() { hospitalSimulations.stopSimulation(); }
function simulateCrisis() { hospitalSimulations.simulateMajorCrisis(); }
function simulateOptimistic() { hospitalSimulations.simulatePositiveScenario(); }
function generateReport() { hospitalSimulations.generateSimulationReport(); }