// BloodLink Hôpitaux - Page Profil
class ProfilPage {
    constructor() {
        this.hospitalData = {};
        this.currentSettings = {};
        this.init();
    }

    init() {
        this.loadHospitalData();
        this.loadSettings();
        this.setupEventListeners();
        this.setupTabs();
        this.updateDisplay();
    }

    loadHospitalData() {
        // Chargement des données de l'hôpital depuis le localStorage
        const savedData = localStorage.getItem('bloodlink_hospital_profile');
        
        if (savedData) {
            this.hospitalData = JSON.parse(savedData);
        } else {
            // Données par défaut
            this.hospitalData = {
                id: 1,
                name: "Hôpital Central Paris",
                type: "CHU",
                finess: "750000123",
                siret: "12345678900123",
                address: "123 Avenue de Paris, 75015 Paris",
                phone: "+33 1 45 67 89 00",
                email: "contact@hopital-central.fr",
                website: "www.hopital-central.fr",
                beds: 850,
                services: "Urgences, Chirurgie, Cardiologie, Maternité, Oncologie, Pédiatrie",
                surgeryRooms: 12,
                bloodBank: "Interne - Niveau 3",
                director: "Dr. Martin",
                hematologyResponsible: "Dr. Martin",
                qualityResponsible: "Mme. Dubois",
                coordinator: "Dr. Martin",
                staffCount: 1250,
                annualTransfusions: 12458,
                status: "active",
                joinedDate: new Date('2020-01-15')
            };
            this.saveHospitalData();
        }
    }

    saveHospitalData() {
        localStorage.setItem('bloodlink_hospital_profile', JSON.stringify(this.hospitalData));
    }

    loadSettings() {
        // Chargement des paramètres
        const savedSettings = localStorage.getItem('bloodlink_hospital_settings');
        
        if (savedSettings) {
            this.currentSettings = JSON.parse(savedSettings);
        } else {
            // Paramètres par défaut
            this.currentSettings = {
                alertThresholds: true,
                criticalThreshold: 5,
                lowThreshold: 15,
                pushNotifications: true,
                emailAlerts: true,
                smsAlerts: false,
                dailyReport: true,
                weeklyReport: false,
                monthlyReport: true,
                darkMode: true,
                language: "fr",
                timezone: "Europe/Paris",
                twoFactorAuth: false,
                autoLock: true,
                activityLogging: true
            };
            this.saveSettings();
        }
        
        this.applySettingsToUI();
    }

    saveSettings() {
        localStorage.setItem('bloodlink_hospital_settings', JSON.stringify(this.currentSettings));
    }

    applySettingsToUI() {
        // Application des paramètres aux éléments UI
        Object.keys(this.currentSettings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.currentSettings[key];
                } else {
                    element.value = this.currentSettings[key];
                }
            }
        });
    }

    setupEventListeners() {
        // Gestion des formulaires
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfileChanges();
            });
        }

        // Sauvegarde automatique des paramètres modifiés
        document.querySelectorAll('#parametres-tab input, #parametres-tab select').forEach(element => {
            element.addEventListener('change', () => {
                this.settingsChanged = true;
            });
        });

        // Sécurité - changement des paramètres
        document.querySelectorAll('#securite-tab input').forEach(element => {
            element.addEventListener('change', () => {
                this.securityChanged = true;
            });
        });
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Désactiver tous les onglets
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Activer l'onglet sélectionné
                button.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });
    }

    updateDisplay() {
        // Mise à jour de l'affichage avec les données de l'hôpital
        document.getElementById('hospitalNameDisplay').textContent = this.hospitalData.name;
        document.getElementById('currentHospital').textContent = this.hospitalData.name;
        
        // Mise à jour des statistiques
        document.getElementById('bedCount').textContent = this.hospitalData.beds.toLocaleString();
        document.getElementById('staffCount').textContent = this.hospitalData.staffCount.toLocaleString();
        document.getElementById('annualTransfusions').textContent = this.hospitalData.annualTransfusions.toLocaleString();

        // Mise à jour des informations détaillées
        document.getElementById('infoHospitalName').textContent = this.hospitalData.name;
        document.getElementById('infoHospitalType').textContent = this.getHospitalTypeText(this.hospitalData.type);
        document.getElementById('infoFiness').textContent = this.hospitalData.finess;
        document.getElementById('infoSiret').textContent = this.hospitalData.siret;
        document.getElementById('infoAddress').textContent = this.hospitalData.address;
        document.getElementById('infoPhone').textContent = this.hospitalData.phone;
        document.getElementById('infoEmail').textContent = this.hospitalData.email;
        document.getElementById('infoWebsite').textContent = this.hospitalData.website;
        document.getElementById('infoBeds').textContent = this.hospitalData.beds.toLocaleString();
        document.getElementById('infoServices').textContent = this.hospitalData.services;
        document.getElementById('infoSurgeryRooms').textContent = this.hospitalData.surgeryRooms + " salles";
        document.getElementById('infoBloodBank').textContent = this.hospitalData.bloodBank;
        document.getElementById('infoDirector').textContent = this.hospitalData.director;
        document.getElementById('infoHematology').textContent = this.hospitalData.hematologyResponsible;
        document.getElementById('infoQuality').textContent = this.hospitalData.qualityResponsible;
        document.getElementById('infoCoordinator').textContent = this.hospitalData.coordinator;
    }

    getHospitalTypeText(type) {
        const types = {
            'CHU': 'Centre Hospitalier Universitaire (CHU)',
            'CH': 'Centre Hospitalier',
            'CL': 'Clinique',
            'autre': 'Autre'
        };
        return types[type] || type;
    }

    editHospitalInfo() {
        // Remplir le formulaire d'édition avec les données actuelles
        document.getElementById('editHospitalName').value = this.hospitalData.name;
        document.getElementById('editHospitalType').value = this.hospitalData.type;
        document.getElementById('editFiness').value = this.hospitalData.finess;
        document.getElementById('editSiret').value = this.hospitalData.siret;
        document.getElementById('editAddress').value = this.hospitalData.address;
        document.getElementById('editPhone').value = this.hospitalData.phone;
        document.getElementById('editEmail').value = this.hospitalData.email;
        document.getElementById('editWebsite').value = this.hospitalData.website;
        document.getElementById('editBeds').value = this.hospitalData.beds;
        document.getElementById('editSurgeryRooms').value = this.hospitalData.surgeryRooms;
        document.getElementById('editServices').value = this.hospitalData.services;

        // Ouvrir le modal
        const modal = document.getElementById('editProfileModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeEditModal() {
        const modal = document.getElementById('editProfileModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    saveProfileChanges() {
        // Récupérer les valeurs du formulaire
        this.hospitalData.name = document.getElementById('editHospitalName').value;
        this.hospitalData.type = document.getElementById('editHospitalType').value;
        this.hospitalData.finess = document.getElementById('editFiness').value;
        this.hospitalData.siret = document.getElementById('editSiret').value;
        this.hospitalData.address = document.getElementById('editAddress').value;
        this.hospitalData.phone = document.getElementById('editPhone').value;
        this.hospitalData.email = document.getElementById('editEmail').value;
        this.hospitalData.website = document.getElementById('editWebsite').value;
        this.hospitalData.beds = parseInt(document.getElementById('editBeds').value);
        this.hospitalData.surgeryRooms = parseInt(document.getElementById('editSurgeryRooms').value);
        this.hospitalData.services = document.getElementById('editServices').value;

        // Sauvegarder
        this.saveHospitalData();
        this.updateDisplay();
        this.closeEditModal();

        hospitalApp.showNotification('✅ Profil mis à jour avec succès!', 'success');
    }

    saveSettings() {
        // Récupérer les valeurs des paramètres
        this.currentSettings.alertThresholds = document.getElementById('alertThresholds').checked;
        this.currentSettings.criticalThreshold = parseInt(document.getElementById('criticalThreshold').value);
        this.currentSettings.lowThreshold = parseInt(document.getElementById('lowThreshold').value);
        this.currentSettings.pushNotifications = document.getElementById('pushNotifications').checked;
        this.currentSettings.emailAlerts = document.getElementById('emailAlerts').checked;
        this.currentSettings.smsAlerts = document.getElementById('smsAlerts').checked;
        this.currentSettings.dailyReport = document.getElementById('dailyReport').checked;
        this.currentSettings.weeklyReport = document.getElementById('weeklyReport').checked;
        this.currentSettings.monthlyReport = document.getElementById('monthlyReport').checked;
        this.currentSettings.darkMode = document.getElementById('darkMode').checked;
        this.currentSettings.language = document.getElementById('language').value;
        this.currentSettings.timezone = document.getElementById('timezone').value;
        this.currentSettings.twoFactorAuth = document.getElementById('twoFactorAuth').checked;
        this.currentSettings.autoLock = document.getElementById('autoLock').checked;
        this.currentSettings.activityLogging = document.getElementById('activityLogging').checked;

        // Sauvegarder
        this.saveSettings();
        this.settingsChanged = false;

        hospitalApp.showNotification('✅ Paramètres sauvegardés!', 'success');
    }

    cancelSettings() {
        // Restaurer les paramètres précédents
        this.applySettingsToUI();
        this.settingsChanged = false;
        
        hospitalApp.showNotification('❌ Modifications annulées', 'warning');
    }

    resetSettings() {
        if (confirm('Êtes-vous sûr de vouloir restaurer les paramètres par défaut ?')) {
            localStorage.removeItem('bloodlink_hospital_settings');
            this.loadSettings();
            hospitalApp.showNotification('✅ Paramètres restaurés aux valeurs par défaut', 'success');
        }
    }

    changePassword() {
        hospitalApp.showNotification('Ouverture du changement de mot de passe...', 'info');
        // Ici on pourrait ouvrir un modal spécifique pour le changement de mot de passe
    }

    manageSessions() {
        hospitalApp.showNotification('Gestion des sessions...', 'info');
        // Ici on pourrait ouvrir un modal pour gérer les sessions actives
    }

    addUser() {
        hospitalApp.showNotification('Ajout d\'un nouvel utilisateur...', 'info');
        // Ici on pourrait ouvrir un modal pour ajouter un utilisateur
    }

    auditLog() {
        hospitalApp.showNotification('Ouverture du journal d\'audit...', 'info');
        // Ici on pourrait ouvrir un modal avec le journal d'audit
    }

    exportHospitalData() {
        hospitalApp.showNotification('Export des données de l\'hôpital...', 'info');
        
        // Simulation d'export
        setTimeout(() => {
            const dataStr = JSON.stringify(this.hospitalData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `bloodlink_${this.hospitalData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            hospitalApp.showNotification('📊 Données exportées avec succès!', 'success');
        }, 1000);
    }

    exportStats(format) {
        const formats = {
            'pdf': 'PDF',
            'excel': 'Excel',
            'full': 'Rapport Complet'
        };
        
        hospitalApp.showNotification(`Génération du rapport ${formats[format]}...`, 'info');
        
        // Simulation de génération de rapport
        setTimeout(() => {
            hospitalApp.showNotification(`📈 Rapport ${formats[format]} généré avec succès!`, 'success');
        }, 2000);
    }

    updateStats() {
        const period = document.getElementById('statsPeriod').value;
        hospitalApp.showNotification(`Mise à jour des statistiques (${period})...`, 'info');
        
        // Ici on pourrait charger les statistiques en fonction de la période sélectionnée
        setTimeout(() => {
            hospitalApp.showNotification('✅ Statistiques mises à jour', 'success');
        }, 500);
    }
}

// Initialisation de la page
const profilPage = new ProfilPage();