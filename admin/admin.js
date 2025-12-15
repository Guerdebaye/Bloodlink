// Admin Management System
class AdminManager {
    constructor() {
        this.currentSection = 'overview';
        this.adminData = null;
        this.currentUser = null;
        this.init();
    }

    async init() {
        await this.loadAdminData();
        this.setupEventListeners();
        this.loadCharts();
        this.updateDashboard();
        this.hideLoadingScreen();
        this.setupUserInterface();
    }

    checkAuthentication() {
        // Check for existing session
        const session = localStorage.getItem('bloodlink_session') || 
                       sessionStorage.getItem('bloodlink_session');
        
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                this.currentUser = sessionData.user;
                return true;
            } catch (error) {
                console.error('Invalid session:', error);
                return false;
            }
        }
        
        return false;
    }

    setupUserInterface() {
        // Set default user since authentication is removed
        this.currentUser = {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@bloodlink.com',
            role: 'super_admin'
        };
        
        // Update user info in the interface
        const userNameElements = document.querySelectorAll('.current-user-name');
        const userEmailElements = document.querySelectorAll('.current-user-email');
        const userRoleElements = document.querySelectorAll('.current-user-role');
        
        userNameElements.forEach(el => {
            el.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        });
        
        userEmailElements.forEach(el => {
            el.textContent = this.currentUser.email;
        });
        
        userRoleElements.forEach(el => {
            el.textContent = this.getRoleDisplayText(this.currentUser.role);
        });
        
        // Setup logout functionality
        this.setupLogout();
    }

    getRoleDisplayText(role) {
        const roleMap = {
            'super_admin': 'Super Administrateur',
            'admin': 'Administrateur',
            'manager': 'Gestionnaire',
            'viewer': 'Lecteur'
        };
        return roleMap[role] || role;
    }

    setupLogout() {
        // Add logout button if it doesn't exist
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        // Create logout dropdown if needed
        this.createUserDropdown();
    }

    logout() {
        // Clear session storage
        localStorage.removeItem('adminSession');
        sessionStorage.removeItem('adminSession');
        
        // Show confirmation message
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            // Redirect to login page
            window.location.href = 'login.html';
        }
    }

    createUserDropdown() {
        const navbar = document.querySelector('.navbar-nav');
        if (!navbar) return;
        
        const dropdownHtml = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" 
                   data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-user-circle me-2"></i>
                    <span class="current-user-name">${this.currentUser.firstName} ${this.currentUser.lastName}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><h6 class="dropdown-header">Compte</h6></li>
                    <li><a class="dropdown-item" href="#">
                        <i class="fas fa-user me-2"></i>
                        <span class="current-user-email">${this.currentUser.email}</span>
                    </a></li>
                    <li><a class="dropdown-item" href="#">
                        <i class="fas fa-shield-alt me-2"></i>
                        <span class="current-user-role">${this.getRoleDisplayText(this.currentUser.role)}</span>
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="Admin.logout()">
                        <i class="fas fa-sign-out-alt me-2"></i>Déconnexion
                    </a></li>
                </ul>
            </li>
        `;
        
        // Check if dropdown already exists
        if (!document.getElementById('userDropdown')) {
            navbar.insertAdjacentHTML('beforeend', dropdownHtml);
        }
    }

    logout() {
        // Show logout message
        this.showToast('Déconnexion réussie', 'Vous avez été déconnecté avec succès', 'info');
        
        // Redirect to admin page after delay since login is removed
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
    }

    async loadAdminData() {
        // Simulate API call
        await this.delay(1000);
        
        this.adminData = {
            systemStatus: {
                api: { status: 'online', uptime: '99.8%' },
                database: { status: 'optimal', usage: '2.4GB' },
                notifications: { status: 'warning', alerts: 12 },
                mobile: { status: 'stable', version: 'v2.4.1' }
            },
            users: [
                {
                    id: 1,
                    name: 'Jean Dupont',
                    email: 'jean.dupont@email.com',
                    type: 'donor',
                    bloodType: 'O+',
                    donations: 12,
                    status: 'active',
                    joinDate: '2023-01-15',
                    lastActive: '2024-02-20'
                },
                {
                    id: 2,
                    name: 'Marie Martin',
                    email: 'marie.martin@email.com',
                    type: 'donor',
                    bloodType: 'A-',
                    donations: 8,
                    status: 'active',
                    joinDate: '2023-03-20',
                    lastActive: '2024-02-19'
                },
                {
                    id: 3,
                    name: 'Hôpital Saint-Louis',
                    email: 'contact@saintlouis.fr',
                    type: 'hospital',
                    bloodType: null,
                    donations: 245,
                    status: 'verified',
                    joinDate: '2023-01-10',
                    lastActive: '2024-02-20'
                }
            ],
            hospitals: [
                {
                    id: 1,
                    name: 'Hôpital Saint-Louis',
                    address: '1 Avenue Claude Vellefaux, 75010 Paris',
                    contact: '01 42 49 49 49',
                    status: 'verified',
                    donations: 245,
                    alerts: 12
                },
                {
                    id: 2,
                    name: 'Hôpital Européen Georges-Pompidou',
                    address: '20 Rue Leblanc, 75015 Paris',
                    contact: '01 56 09 20 00',
                    status: 'verified',
                    donations: 189,
                    alerts: 8
                }
            ],
            alerts: [
                {
                    id: 1,
                    hospital: 'Hôpital Necker',
                    bloodType: 'O-',
                    quantity: 3,
                    urgent: true,
                    status: 'active',
                    createdAt: '2024-02-20 14:30',
                    responses: 2
                },
                {
                    id: 2,
                    hospital: 'Clinique Saint-Michel',
                    bloodType: 'A+',
                    quantity: 2,
                    urgent: false,
                    status: 'active',
                    createdAt: '2024-02-20 13:15',
                    responses: 5
                }
            ],
            activity: [
                {
                    id: 1,
                    type: 'donation',
                    user: 'Jean Dupont',
                    description: 'Don effectué à Hôpital Saint-Louis',
                    time: 'Il y a 2 heures'
                },
                {
                    id: 2,
                    type: 'alert',
                    user: 'Hôpital Necker',
                    description: 'Nouvelle alerte urgente O-',
                    time: 'Il y a 3 heures'
                }
            ]
        };

        this.updateCounts();
    }

    updateCounts() {
        document.getElementById('usersCount').textContent = this.adminData.users.length.toLocaleString();
        document.getElementById('hospitalsCount').textContent = this.adminData.hospitals.length.toLocaleString();
        document.getElementById('alertsCount').textContent = this.adminData.alerts.length.toLocaleString();
        document.getElementById('donationsCount').textContent = '15,247';
    }

    setupEventListeners() {
        // User search
        document.getElementById('userSearch')?.addEventListener('input', (e) => {
            this.filterUsers(e.target.value);
        });

        // Select all users
        document.getElementById('selectAllUsers')?.addEventListener('change', (e) => {
            this.toggleSelectAllUsers(e.target.checked);
        });

        // Alert filter
        document.getElementById('alertStatusFilter')?.addEventListener('change', (e) => {
            this.filterAlerts(e.target.value);
        });
    }

    switchSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        document.getElementById(sectionId).classList.add('active');

        // Update menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[href="#${sectionId}"]`).classList.add('active');

        this.currentSection = sectionId;
        
        // Load section-specific data
        this.loadSectionData(sectionId);
    }

    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'users':
                this.loadUsers();
                break;
            case 'hospitals':
                this.loadHospitals();
                break;
            case 'alerts':
                this.loadAlerts();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'overview':
                this.loadOverview();
                break;
        }
    }

    loadCharts() {
        this.createAdminDonationChart();
        this.createResponseTimeChart();
        this.createUserGrowthChart();
    }

    createAdminDonationChart() {
        const ctx = document.getElementById('adminDonationChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                datasets: [{
                    label: 'Dons cette semaine',
                    data: [45, 52, 38, 61, 55, 48, 42],
                    backgroundColor: '#dc2626',
                    borderColor: '#dc2626',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 10
                        }
                    }
                }
            }
        });
    }

    createResponseTimeChart() {
        const ctx = document.getElementById('responseTimeChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Temps de réponse moyen (min)',
                    data: [25, 22, 20, 18, 17, 16],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
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

    createUserGrowthChart() {
        const ctx = document.getElementById('userGrowthChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Nouveaux utilisateurs',
                    data: [150, 230, 180, 290, 320, 280],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
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

    loadUsers() {
        const container = document.getElementById('usersTableBody');
        if (!container) return;

        container.innerHTML = this.adminData.users.map(user => `
            <tr>
                <td>
                    <input type="checkbox" class="form-check-input user-checkbox" value="${user.id}">
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="user-avatar-table">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="user-info-table">
                            <div class="user-name-table">${user.name}</div>
                            <div class="user-email-table">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-${user.type === 'donor' ? 'primary' : user.type === 'hospital' ? 'success' : 'warning'}">
                        ${user.type === 'donor' ? 'Donneur' : user.type === 'hospital' ? 'Hôpital' : 'Admin'}
                    </span>
                </td>
                <td>${user.bloodType || '-'}</td>
                <td>${user.donations}</td>
                <td>
                    <span class="badge bg-${user.status === 'active' ? 'success' : user.status === 'inactive' ? 'secondary' : 'danger'}">
                        ${user.status === 'active' ? 'Actif' : user.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                    </span>
                </td>
                <td>${new Date(user.joinDate).toLocaleDateString('fr-FR')}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="Admin.editUser(${user.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="Admin.deleteUser(${user.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    loadHospitals() {
        const container = document.getElementById('hospitalsGrid');
        if (!container) return;

        container.innerHTML = this.adminData.hospitals.map(hospital => `
            <div class="hospital-card">
                <div class="hospital-header">
                    <div>
                        <div class="hospital-name">${hospital.name}</div>
                        <div class="hospital-address">${hospital.address}</div>
                    </div>
                    <div class="hospital-status ${hospital.status}">
                        ${hospital.status === 'verified' ? 'Vérifié' : 'En attente'}
                    </div>
                </div>
                <div class="hospital-details">
                    <div class="hospital-contact">
                        <i class="fas fa-phone me-2"></i>${hospital.contact}
                    </div>
                </div>
                <div class="hospital-stats">
                    <div class="hospital-stat">
                        <div class="stat-number">${hospital.donations}</div>
                        <div class="stat-label">Dons</div>
                    </div>
                    <div class="hospital-stat">
                        <div class="stat-number">${hospital.alerts}</div>
                        <div class="stat-label">Alertes</div>
                    </div>
                </div>
                <div class="hospital-actions">
                    <button class="btn btn-primary btn-sm me-2" onclick="Admin.editHospital(${hospital.id})">
                        <i class="fas fa-edit me-1"></i>Modifier
                    </button>
                    <button class="btn btn-outline-primary btn-sm" onclick="Admin.viewHospital(${hospital.id})">
                        <i class="fas fa-eye me-1"></i>Voir
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadAlerts() {
        const container = document.getElementById('alertsManagement');
        if (!container) return;

        container.innerHTML = this.adminData.alerts.map(alert => `
            <div class="alert-management-item ${alert.urgent ? 'urgent' : ''}">
                <div class="alert-management-header">
                    <div class="alert-management-info">
                        <div class="alert-management-hospital">${alert.hospital}</div>
                        <div class="alert-management-blood">${alert.bloodType}</div>
                        <div class="alert-management-details">
                            ${alert.quantity} unité(s) nécessaire(s) - 
                            ${alert.urgent ? 'URGENT' : 'Standard'}
                        </div>
                        <div class="alert-management-meta">
                            <span><i class="fas fa-clock"></i> ${alert.createdAt}</span>
                            <span><i class="fas fa-users"></i> ${alert.responses} réponses</span>
                        </div>
                    </div>
                    <div class="alert-management-actions">
                        <button class="btn btn-success btn-sm" onclick="Admin.resolveAlert(${alert.id})">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="Admin.editAlert(${alert.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="Admin.cancelAlert(${alert.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadOverview() {
        this.loadActivityTimeline();
        this.loadUrgentAlerts();
    }

    loadActivityTimeline() {
        const container = document.getElementById('adminActivityTimeline');
        if (!container) return;

        container.innerHTML = this.adminData.activity.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${activity.type === 'donation' ? 'heart' : 'bell'}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.user}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    loadUrgentAlerts() {
        const container = document.getElementById('urgentAlertsList');
        if (!container) return;

        const urgentAlerts = this.adminData.alerts.filter(alert => alert.urgent);
        
        container.innerHTML = urgentAlerts.map(alert => `
            <div class="urgent-alert-item">
                <div class="urgent-alert-header">
                    <div class="urgent-alert-hospital">${alert.hospital}</div>
                    <div class="urgent-alert-blood">${alert.bloodType}</div>
                </div>
                <div class="urgent-alert-details">
                    ${alert.quantity} unité(s) nécessaire(s) - Situation critique
                </div>
                <div class="urgent-alert-meta">
                    <span><i class="fas fa-clock"></i> ${alert.createdAt}</span>
                    <span><i class="fas fa-users"></i> ${alert.responses} donneurs</span>
                </div>
            </div>
        `).join('');
    }

    loadAnalytics() {
        // Additional analytics charts would be loaded here
        this.showToast('Analytics avancés chargés', 'success');
    }

    // User Management
    showUserModal(userId = null) {
        const modal = new bootstrap.Modal(document.getElementById('userModal'));
        const title = document.getElementById('userModalTitle');
        
        if (userId) {
            title.textContent = 'Modifier l\'utilisateur';
            // Load user data
        } else {
            title.textContent = 'Nouvel utilisateur';
            document.getElementById('userForm').reset();
        }
        
        modal.show();
    }

    saveUser() {
        this.showToast('Utilisateur enregistré avec succès', 'success');
        bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
    }

    editUser(userId) {
        this.showUserModal(userId);
    }

    deleteUser(userId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            this.showToast('Utilisateur supprimé', 'success');
            this.loadUsers();
        }
    }

    filterUsers(searchTerm) {
        // Implementation for user search
        this.showToast(`Recherche: ${searchTerm}`, 'info');
    }

    toggleSelectAllUsers(checked) {
        document.querySelectorAll('.user-checkbox').forEach(checkbox => {
            checkbox.checked = checked;
        });
    }

    exportUsers() {
        this.showToast('Export des utilisateurs en cours...', 'info');
        // Simulate export
        setTimeout(() => {
            this.showToast('Export terminé - users.csv téléchargé', 'success');
        }, 2000);
    }

    // Hospital Management
    showHospitalModal(hospitalId = null) {
        this.showToast('Modal hôpital ouvert', 'info');
    }

    editHospital(hospitalId) {
        this.showHospitalModal(hospitalId);
    }

    viewHospital(hospitalId) {
        this.showToast(`Visualisation hôpital ${hospitalId}`, 'info');
    }

    // Alert Management
    createAlert() {
        this.showToast('Création d\'une nouvelle alerte', 'info');
    }

    resolveAlert(alertId) {
        this.showToast(`Alerte ${alertId} résolue`, 'success');
    }

    editAlert(alertId) {
        this.showToast(`Modification alerte ${alertId}`, 'info');
    }

    cancelAlert(alertId) {
        if (confirm('Êtes-vous sûr de vouloir annuler cette alerte ?')) {
            this.showToast(`Alerte ${alertId} annulée`, 'success');
        }
    }

    filterAlerts(status) {
        this.showToast(`Filtrage alertes: ${status}`, 'info');
    }

    updateDashboard() {
        // Update any real-time data
        this.showToast('Tableau de bord mis à jour', 'info');
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    showToast(message, type = 'info') {
        // Use the same toast system from main app
        if (window.App && window.App.showToast) {
            window.App.showToast(message, type);
        } else {
            // Fallback toast implementation
            const toast = document.createElement('div');
            toast.className = `alert alert-${type} position-fixed`;
            toast.style.cssText = `
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
            `;
            toast.innerHTML = message;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    loadDonations() {
        const container = document.getElementById('donationsTableBody');
        if (!container) return;

        const donationsData = this.getDonationsData();
        
        container.innerHTML = donationsData.map(donation => `
            <tr>
                <td>
                    <input type="checkbox" class="form-check-input donation-checkbox" value="${donation.id}">
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="user-avatar-table">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="user-info-table">
                            <div class="user-name-table">${donation.donorName}</div>
                            <div class="user-email-table">${donation.donorEmail}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="hospital-info">
                        <div class="hospital-name">${donation.hospital}</div>
                        <div class="hospital-location">${donation.location}</div>
                    </div>
                </td>
                <td>
                    <span class="blood-type-badge ${donation.bloodType}">${donation.bloodType}</span>
                </td>
                <td>
                    <div class="donation-date">
                        <div class="date">${new Date(donation.date).toLocaleDateString('fr-FR')}</div>
                        <div class="time">${donation.time}</div>
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${donation.status}">
                        ${this.getDonationStatusText(donation.status)}
                    </span>
                </td>
                <td>
                    <span class="badge bg-${donation.type === 'planned' ? 'info' : 'warning'}">
                        ${donation.type === 'planned' ? 'Programmé' : 'Urgence'}
                    </span>
                </td>
                <td>
                    <div class="volume-info">
                        <span class="volume">${donation.volume}ml</span>
                        <div class="volume-bar">
                            <div class="volume-progress" style="width: ${(donation.volume / 450) * 100}%"></div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="Admin.viewDonationDetails(${donation.id})" title="Voir détails">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="Admin.validateDonation(${donation.id})" title="Valider">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="Admin.cancelDonation(${donation.id})" title="Annuler">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.updateDonationStats();
    }

    getDonationsData() {
        return [
            {
                id: 1,
                donorName: 'Jean Dupont',
                donorEmail: 'jean.dupont@email.com',
                hospital: 'Hôpital Saint-Louis',
                location: 'Paris 10e',
                bloodType: 'O+',
                date: '2024-02-20',
                time: '14:30',
                status: 'completed',
                type: 'planned',
                volume: 450,
                urgency: false
            },
            {
                id: 2,
                donorName: 'Marie Martin',
                donorEmail: 'marie.martin@email.com',
                hospital: 'Hôpital Européen Georges-Pompidou',
                location: 'Paris 15e',
                bloodType: 'A-',
                date: '2024-02-20',
                time: '11:15',
                status: 'pending',
                type: 'emergency',
                volume: 450,
                urgency: true
            },
            {
                id: 3,
                donorName: 'Pierre Lefebvre',
                donorEmail: 'pierre.lefebvre@email.com',
                hospital: 'Hôpital Necker',
                location: 'Paris 15e',
                bloodType: 'B+',
                date: '2024-02-19',
                time: '16:45',
                status: 'completed',
                type: 'planned',
                volume: 450,
                urgency: false
            },
            {
                id: 4,
                donorName: 'Sophie Bernard',
                donorEmail: 'sophie.bernard@email.com',
                hospital: 'Clinique Saint-Michel',
                location: 'Paris 6e',
                bloodType: 'AB-',
                date: '2024-02-19',
                time: '09:30',
                status: 'rejected',
                type: 'planned',
                volume: 0,
                urgency: false
            },
            {
                id: 5,
                donorName: 'Michel Durand',
                donorEmail: 'michel.durand@email.com',
                hospital: 'Hôpital Lariboisière',
                location: 'Paris 10e',
                bloodType: 'O-',
                date: '2024-02-18',
                time: '13:20',
                status: 'completed',
                type: 'emergency',
                volume: 450,
                urgency: true
            }
        ];
    }

    getDonationStatusText(status) {
        const statusMap = {
            'completed': 'Complété',
            'pending': 'En attente',
            'cancelled': 'Annulé',
            'rejected': 'Rejeté'
        };
        return statusMap[status] || status;
    }

    updateDonationStats() {
        const donations = this.getDonationsData();
        
        document.getElementById('totalDonations').textContent = '15,247';
        document.getElementById('monthlyDonations').textContent = '1,284';
        document.getElementById('pendingDonations').textContent = donations.filter(d => d.status === 'pending').length;
        document.getElementById('activeHospitals').textContent = '89';
        document.getElementById('bloodCollected').textContent = '7,623L';
        document.getElementById('livesSaved').textContent = '45,741';
    }

    viewDonationDetails(donationId) {
        const donation = this.getDonationsData().find(d => d.id === donationId);
        if (!donation) return;

        const modal = new bootstrap.Modal(document.getElementById('donationDetailModal'));
        const content = document.getElementById('donationDetailContent');
        
        content.innerHTML = `
            <div class="donation-details">
                <div class="row">
                    <div class="col-md-6">
                        <h6>Informations Donneur</h6>
                        <div class="detail-item">
                            <label>Nom:</label>
                            <span>${donation.donorName}</span>
                        </div>
                        <div class="detail-item">
                            <label>Email:</label>
                            <span>${donation.donorEmail}</span>
                        </div>
                        <div class="detail-item">
                            <label>Groupe sanguin:</label>
                            <span class="blood-type-badge ${donation.bloodType}">${donation.bloodType}</span>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h6>Informations Don</h6>
                        <div class="detail-item">
                            <label>Hôpital:</label>
                            <span>${donation.hospital}</span>
                        </div>
                        <div class="detail-item">
                            <label>Date et heure:</label>
                            <span>${new Date(donation.date).toLocaleDateString('fr-FR')} à ${donation.time}</span>
                        </div>
                        <div class="detail-item">
                            <label>Type:</label>
                            <span class="badge bg-${donation.type === 'planned' ? 'info' : 'warning'}">
                                ${donation.type === 'planned' ? 'Programmé' : 'Urgence'}
                            </span>
                        </div>
                        <div class="detail-item">
                            <label>Volume:</label>
                            <span>${donation.volume}ml</span>
                        </div>
                        <div class="detail-item">
                            <label>Statut:</label>
                            <span class="status-badge status-${donation.status}">
                                ${this.getDonationStatusText(donation.status)}
                            </span>
                        </div>
                    </div>
                </div>
                
                ${donation.status === 'rejected' ? `
                <div class="alert alert-warning mt-3">
                    <h6>Raison du rejet:</h6>
                    <p>Contrôle qualité non conforme - Hémoglobine insuffisante</p>
                </div>
                ` : ''}
                
                <div class="donation-timeline mt-4">
                    <h6>Historique du Don</h6>
                    <div class="timeline">
                        <div class="timeline-item completed">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <div class="timeline-title">Pré-enregistrement</div>
                                <div class="timeline-time">${donation.date} ${donation.time}</div>
                            </div>
                        </div>
                        <div class="timeline-item ${donation.status !== 'pending' ? 'completed' : 'pending'}">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <div class="timeline-title">Entretien médical</div>
                                <div class="timeline-time">${donation.status !== 'pending' ? 'Complété' : 'En attente'}</div>
                            </div>
                        </div>
                        <div class="timeline-item ${donation.status === 'completed' ? 'completed' : 'pending'}">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <div class="timeline-title">Prélèvement</div>
                                <div class="timeline-time">${donation.status === 'completed' ? 'Complété' : 'En attente'}</div>
                            </div>
                        </div>
                        <div class="timeline-item ${donation.status === 'completed' ? 'completed' : 'pending'}">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <div class="timeline-title">Contrôle qualité</div>
                                <div class="timeline-time">${donation.status === 'completed' ? 'Validé' : 'En attente'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.show();
    }

    validateDonation(donationId) {
        if (confirm('Êtes-vous sûr de vouloir valider ce don ?')) {
            this.showToast('Don validé avec succès', 'success');
            this.loadDonations();
        }
    }

    cancelDonation(donationId) {
        if (confirm('Êtes-vous sûr de vouloir annuler ce don ?')) {
            this.showToast('Don annulé', 'warning');
            this.loadDonations();
        }
    }

    filterDonations() {
        const period = document.getElementById('donationPeriod').value;
        const status = document.getElementById('donationStatus').value;
        const bloodType = document.getElementById('donationBloodType').value;
        const hospital = document.getElementById('donationHospital').value;
        
        this.showToast(`Filtrage appliqué: ${period}, ${status}, ${bloodType}, ${hospital}`, 'info');
        this.loadDonations();
    }

    searchDonations() {
        const searchTerm = document.getElementById('donationSearch').value;
        this.showToast(`Recherche: ${searchTerm}`, 'info');
        this.loadDonations();
    }

    resetDonationFilters() {
        document.getElementById('donationPeriod').value = 'month';
        document.getElementById('donationStatus').value = 'all';
        document.getElementById('donationBloodType').value = 'all';
        document.getElementById('donationHospital').value = 'all';
        document.getElementById('donationSearch').value = '';
        
        this.showToast('Filtres réinitialisés', 'info');
        this.loadDonations();
    }

    applyDonationFilters() {
        this.filterDonations();
    }

    toggleUrgentDonations() {
        const showOnlyUrgent = document.getElementById('showOnlyUrgent').checked;
        this.showToast(showOnlyUrgent ? 'Affichage des dons urgents seulement' : 'Affichage de tous les dons', 'info');
    }

    refreshDonations() {
        this.showToast('Liste des dons actualisée', 'success');
        this.loadDonations();
    }

    exportDonations(type) {
        this.showToast(`Export des dons (${type}) en cours...`, 'info');
        // Simulation d'export
        setTimeout(() => {
            this.showToast('Export terminé - donations.csv téléchargé', 'success');
        }, 2000);
    }

    showDonationStats() {
        this.showToast('Ouverture des statistiques détaillées...', 'info');
        // Ici on pourrait ouvrir un modal avec des statistiques avancées
    }

    printDonationCertificate() {
        this.showToast('Impression du certificat de don...', 'info');
        // Logique d'impression
    }

    createDonationCharts() {
        this.createDonationTrendChart();
        this.createBloodTypeDistributionChart();
    }

    createDonationTrendChart() {
        const ctx = document.getElementById('donationTrendChart').getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                datasets: [{
                    label: 'Dons 2024',
                    data: [1200, 1150, 1280, 1340, 1420, 1380, 1450, 1520, 1480, 1620, 1580, 1650],
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Dons 2023',
                    data: [1100, 1050, 1120, 1180, 1240, 1200, 1280, 1320, 1290, 1380, 1340, 1400],
                    borderColor: '#9ca3af',
                    backgroundColor: 'rgba(156, 163, 175, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Nombre de dons'
                        }
                    }
                }
            }
        });
    }

    createBloodTypeDistributionChart() {
        const ctx = document.getElementById('bloodTypeDistributionChart').getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'],
                datasets: [{
                    data: [36, 28, 12, 4, 7, 8, 3, 2],
                    backgroundColor: [
                        '#dc2626', '#ef4444', '#f87171', '#fca5a5',
                        '#991b1b', '#b91c1c', '#dc2626', '#ef4444'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }

    // Dans loadSectionData, ajoutez le cas pour les dons
    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'users':
                this.loadUsers();
                break;
            case 'hospitals':
                this.loadHospitals();
                break;
            case 'alerts':
                this.loadAlerts();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'overview':
                this.loadOverview();
                break;
            case 'donations':
                this.loadDonations();
                this.createDonationCharts();
                break;
        }
    }
}

// Initialize admin when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.Admin = new AdminManager();
});








// PremiumAnalytics Class
class PremiumAnalytics {
    static init() {
        console.log('Initializing Premium Analytics...');
        this.initCharts();
        this.setupEventListeners();
        this.startLiveUpdates();
    }

    static initCharts() {
        // Growth Trend Chart
        const growthCtx = document.getElementById('growthTrendChart');
        if (growthCtx) {
            new Chart(growthCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul'],
                    datasets: [{
                        label: 'Utilisateurs Actifs',
                        data: [6500, 7200, 7800, 8200, 8800, 9200, 9700],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Dons Mensuels',
                        data: [1100, 1250, 1300, 1420, 1500, 1650, 1800],
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: {
                                    size: 12,
                                    family: "'Inter', sans-serif"
                                },
                                color: '#495057'
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(0,0,0,0.05)'
                            },
                            ticks: {
                                color: '#6c757d'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.05)'
                            },
                            ticks: {
                                color: '#6c757d'
                            }
                        }
                    }
                }
            });
        }

        // Predictive Model Chart
        const predictiveCtx = document.getElementById('predictiveModelChart');
        if (predictiveCtx) {
            new Chart(predictiveCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                    datasets: [{
                        label: 'Prédiction',
                        data: [180, 195, 210, 245, 220, 190, 170],
                        backgroundColor: 'rgba(102, 126, 234, 0.8)',
                        borderColor: '#667eea',
                        borderWidth: 1
                    }, {
                        label: 'Réel',
                        data: [175, 190, 205, 240, 215, 185, 165],
                        backgroundColor: 'rgba(76, 175, 80, 0.8)',
                        borderColor: '#4CAF50',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    }
                }
            });
        }
    }

    static setupEventListeners() {
        // Timeframe buttons
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                PremiumAnalytics.updateData(this.dataset.period);
            });
        });

        // Region click events
        document.querySelectorAll('.region').forEach(region => {
            region.addEventListener('click', function() {
                const value = this.dataset.value;
                PremiumAnalytics.showRegionDetails(this.querySelector('.region-name').textContent, value);
            });
        });
    }

    static updateData(period) {
        console.log('Updating data for period:', period);
        // In a real app, this would fetch new data from the server
        this.showToast(`Données mises à jour pour la période: ${period}`, 'success');
    }

    static startLiveUpdates() {
        // Update last update time every minute
        setInterval(() => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
            document.getElementById('lastUpdateTime').textContent = timeStr;
        }, 60000);
    }

    static exportReport() {
        // Simulate report generation
        this.showToast('Génération du rapport en cours...', 'info');
        setTimeout(() => {
            this.showToast('Rapport exporté avec succès!', 'success');
            // In a real app, this would trigger a download
        }, 2000);
    }

    static generateInsights() {
        this.showToast('Génération d\'insights intelligents...', 'info');
        // Simulate AI processing
        setTimeout(() => {
            this.showToast('Nouveaux insights générés!', 'success');
        }, 1500);
    }

    static generateAIInsights() {
        this.showToast('L\'IA analyse les données en temps réel...', 'info');
        setTimeout(() => {
            this.showToast('Insights IA mis à jour!', 'success');
        }, 2000);
    }

    static toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const icon = document.querySelector('.btn-analytics-action .fa-moon');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            this.showToast('Mode sombre activé', 'info');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            this.showToast('Mode clair activé', 'info');
        }
    }

    static drillDown(section) {
        this.openFullscreen(section);
    }

    static openFullscreen(section) {
        const modal = document.getElementById('analyticsModal');
        const content = document.getElementById('modalAnalyticsContent');
        
        // Load section content based on section type
        content.innerHTML = `
            <div class="fullscreen-analytics">
                <h3>Analyses détaillées: ${section}</h3>
                <div class="fullscreen-charts">
                    <!-- More detailed charts would go here -->
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    static closeFullscreen() {
        document.getElementById('analyticsModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    static showRegionDetails(region, value) {
        this.showToast(`Région ${region}: ${value}% d'activité`, 'info');
    }

    static showToast(message, type) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to container
        const container = document.getElementById('toastContainer') || (() => {
            const div = document.createElement('div');
            div.id = 'toastContainer';
            div.className = 'toast-container';
            document.body.appendChild(div);
            return div;
        })();
        
        container.appendChild(toast);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    PremiumAnalytics.init();
});
