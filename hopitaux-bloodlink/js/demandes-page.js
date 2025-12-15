// BloodLink Hôpitaux - Page Demandes
class DemandesPage {
    constructor() {
        this.demands = [];
        this.filteredDemands = [];
        this.currentFilters = {
            status: 'all',
            department: 'all',
            priority: 'all',
            search: ''
        };
        
        this.init();
    }

    init() {
        this.loadDemands();
        this.setupEventListeners();
        this.renderDemands();
        this.updateStats();
    }

    loadDemands() {
        // Chargement des demandes depuis le localStorage ou données par défaut
        const savedDemands = localStorage.getItem('bloodlink_demands');
        
        if (savedDemands) {
            this.demands = JSON.parse(savedDemands);
        } else {
            // Données d'exemple
            this.demands = [
                {
                    id: 'DEM-2024001',
                    bloodType: 'O-',
                    quantity: 3,
                    department: 'urgence',
                    priority: 'critical',
                    patient: 'M. DUPONT Jean',
                    reason: 'Accident de la route - hémorragie interne',
                    doctor: 'Dr. MARTIN',
                    status: 'pending',
                    requestedAt: new Date('2024-01-15T08:30:00'),
                    neededBy: new Date('2024-01-15T10:00:00'),
                    hospital: 'Hôpital Central Paris'
                },
                {
                    id: 'DEM-2024002',
                    bloodType: 'A+',
                    quantity: 4,
                    department: 'chirurgie',
                    priority: 'high',
                    patient: 'Mme. LEROY Marie',
                    reason: 'Pontage coronarien programmé',
                    doctor: 'Dr. LEFEBVRE',
                    status: 'approved',
                    requestedAt: new Date('2024-01-14T14:20:00'),
                    approvedAt: new Date('2024-01-14T15:45:00'),
                    neededBy: new Date('2024-01-16T08:00:00'),
                    hospital: 'Hôpital Central Paris'
                },
                {
                    id: 'DEM-2024003',
                    bloodType: 'B+',
                    quantity: 2,
                    department: 'maternite',
                    priority: 'high',
                    patient: 'Mme. DURAND Sophie',
                    reason: 'Hémorragie du post-partum',
                    doctor: 'Dr. MOREAU',
                    status: 'completed',
                    requestedAt: new Date('2024-01-15T10:15:00'),
                    approvedAt: new Date('2024-01-15T11:30:00'),
                    completedAt: new Date('2024-01-15T13:45:00'),
                    neededBy: new Date('2024-01-15T12:00:00'),
                    hospital: 'Hôpital Central Paris'
                },
                {
                    id: 'DEM-2024004',
                    bloodType: 'AB-',
                    quantity: 1,
                    department: 'oncologie',
                    priority: 'medium',
                    patient: 'M. BERNARD Pierre',
                    reason: 'Transfusion suite chimiothérapie',
                    doctor: 'Dr. GIRARD',
                    status: 'rejected',
                    requestedAt: new Date('2024-01-13T09:00:00'),
                    rejectedAt: new Date('2024-01-13T11:20:00'),
                    rejectionReason: 'Stock insuffisant - alternative proposée',
                    neededBy: new Date('2024-01-14T14:00:00'),
                    hospital: 'Hôpital Central Paris'
                },
                {
                    id: 'DEM-2024005',
                    bloodType: 'O+',
                    quantity: 5,
                    department: 'cardiologie',
                    priority: 'critical',
                    patient: 'M. PETIT Robert',
                    reason: 'Anévrisme aortique rompu - chirurgie urgente',
                    doctor: 'Dr. ROUSSEAU',
                    status: 'pending',
                    requestedAt: new Date('2024-01-15T16:45:00'),
                    neededBy: new Date('2024-01-15T18:00:00'),
                    hospital: 'Hôpital Central Paris'
                },
                {
                    id: 'DEM-2024006',
                    bloodType: 'A-',
                    quantity: 2,
                    department: 'pediatrie',
                    priority: 'high',
                    patient: 'Enfant DUBOIS Lucas (8 ans)',
                    reason: 'Leucémie aiguë - transfusion plaquettes',
                    doctor: 'Dr. FOURNIER',
                    status: 'approved',
                    requestedAt: new Date('2024-01-15T09:30:00'),
                    approvedAt: new Date('2024-01-15T10:15:00'),
                    neededBy: new Date('2024-01-15T14:00:00'),
                    hospital: 'Hôpital Central Paris'
                }
            ];
            this.saveDemands();
        }
        
        this.filteredDemands = [...this.demands];
    }

    saveDemands() {
        localStorage.setItem('bloodlink_demands', JSON.stringify(this.demands));
    }

    setupEventListeners() {
        // Recherche en temps réel
        const searchInput = document.getElementById('demandSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.applyFilters();
            });
        }

        // Filtres
        const statusFilter = document.getElementById('statusFilter');
        const departmentFilter = document.getElementById('departmentFilter');
        const priorityFilter = document.getElementById('priorityFilter');

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value;
                this.applyFilters();
            });
        }

        if (departmentFilter) {
            departmentFilter.addEventListener('change', (e) => {
                this.currentFilters.department = e.target.value;
                this.applyFilters();
            });
        }

        if (priorityFilter) {
            priorityFilter.addEventListener('change', (e) => {
                this.currentFilters.priority = e.target.value;
                this.applyFilters();
            });
        }

        // Date minimale pour le formulaire
        const dateInput = document.getElementById('demandDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }

        // Gestion de la soumission du formulaire
        const demandForm = document.getElementById('demandForm');
        if (demandForm) {
            demandForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleDemandSubmission();
            });
        }
    }

    applyFilters() {
        this.filteredDemands = this.demands.filter(demand => {
            // Filtre par statut
            if (this.currentFilters.status !== 'all' && demand.status !== this.currentFilters.status) {
                return false;
            }
            
            // Filtre par service
            if (this.currentFilters.department !== 'all' && demand.department !== this.currentFilters.department) {
                return false;
            }
            
            // Filtre par priorité
            if (this.currentFilters.priority !== 'all' && demand.priority !== this.currentFilters.priority) {
                return false;
            }
            
            // Filtre par recherche
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase();
                const searchableText = [
                    demand.id,
                    demand.bloodType,
                    demand.department,
                    demand.patient,
                    demand.doctor,
                    demand.reason,
                    demand.status
                ].join(' ').toLowerCase();
                
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.renderDemands();
    }

    renderDemands() {
        const container = document.getElementById('demandsContainer');
        if (!container) return;

        if (this.filteredDemands.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h3>Aucune demande trouvée</h3>
                    <p>Aucune demande ne correspond à vos critères de recherche.</p>
                    <button class="btn btn-primary" onclick="demandesPage.openNewDemandModal()">
                        Créer une nouvelle demande
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredDemands.map(demand => `
            <div class="demand-card ${demand.status} ${demand.priority}" onclick="demandesPage.showDemandDetail('${demand.id}')">
                <div class="demand-header">
                    <div class="demand-id">${demand.id}</div>
                    <div class="demand-priority ${demand.priority}">
                        ${this.getPriorityText(demand.priority)}
                    </div>
                </div>
                
                <div class="demand-content">
                    <div class="demand-info">
                        <div class="info-item">
                            <span class="info-label">Groupe sanguin:</span>
                            <span class="info-value blood-type ${demand.bloodType}">${demand.bloodType}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Quantité:</span>
                            <span class="info-value">${demand.quantity} unités</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Service:</span>
                            <span class="info-value">${this.getDepartmentText(demand.department)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Patient:</span>
                            <span class="info-value">${demand.patient || 'Non spécifié'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Médecin:</span>
                            <span class="info-value">${demand.doctor}</span>
                        </div>
                    </div>
                    
                    <div class="demand-reason">
                        <div class="reason-label">Motif:</div>
                        <div class="reason-text">${demand.reason}</div>
                    </div>
                </div>
                
                <div class="demand-footer">
                    <div class="demand-status ${demand.status}">
                        ${this.getStatusText(demand.status)}
                    </div>
                    <div class="demand-date">
                        Demandée: ${this.formatDate(demand.requestedAt)}
                    </div>
                </div>
                
                <div class="demand-actions">
                    ${demand.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="event.stopPropagation(); demandesPage.approveDemand('${demand.id}')">
                            ✅ Approuver
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); demandesPage.rejectDemand('${demand.id}')">
                            ❌ Rejeter
                        </button>
                    ` : ''}
                    
                    ${demand.status === 'approved' ? `
                        <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); demandesPage.completeDemand('${demand.id}')">
                            📦 Marquer comme traitée
                        </button>
                    ` : ''}
                    
                    <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); demandesPage.showDemandDetail('${demand.id}')">
                        Détails
                    </button>
                </div>
            </div>
        `).join('');

        // Mise à jour des demandes prioritaires
        this.renderPriorityDemands();
    }

    renderPriorityDemands() {
        const container = document.getElementById('priorityDemands');
        if (!container) return;

        const priority = this.demands.filter(demand => {
            return (demand.priority === 'high' || demand.priority === 'critical') && 
                   (demand.status === 'pending' || demand.status === 'approved');
        });

        if (priority.length === 0) {
            container.innerHTML = `
                <div class="empty-state small">
                    <div class="empty-icon">✅</div>
                    <p>Aucune demande prioritaire en cours</p>
                </div>
            `;
            return;
        }

        container.innerHTML = priority.map(demand => `
            <div class="priority-card ${demand.priority}">
                <div class="priority-header">
                    <div class="priority-id">${demand.id}</div>
                    <div class="priority-alert ${demand.priority}">
                        ${demand.priority === 'critical' ? '🚨 CRITIQUE' : '⚠️ HAUTE PRIORITÉ'}
                    </div>
                </div>
                
                <div class="priority-content">
                    <div class="priority-info">
                        <span class="blood-type ${demand.bloodType}">${demand.bloodType}</span>
                        <span class="quantity">${demand.quantity} unités</span>
                        <span class="department">${this.getDepartmentText(demand.department)}</span>
                        <span class="patient">${demand.patient || 'Non spécifié'}</span>
                    </div>
                    
                    <div class="priority-time">
                        <span>Demandée: ${this.formatDate(demand.requestedAt)}</span>
                        ${demand.neededBy ? `
                            <span class="time-needed">Besoin: ${this.formatDate(demand.neededBy)}</span>
                        ` : ''}
                    </div>
                </div>
                
                <div class="priority-actions">
                    ${demand.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="demandesPage.approveDemand('${demand.id}')">
                            ✅ Approuver
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-primary" onclick="demandesPage.showDemandDetail('${demand.id}')">
                        Détails
                    </button>
                </div>
            </div>
        `).join('');
    }

    getStatusText(status) {
        const statusTexts = {
            'pending': 'En attente',
            'approved': 'Approuvée',
            'rejected': 'Rejetée',
            'completed': 'Terminée'
        };
        return statusTexts[status] || status;
    }

    getPriorityText(priority) {
        const priorityTexts = {
            'low': 'Basse',
            'medium': 'Moyenne',
            'high': 'Haute',
            'critical': 'Critique'
        };
        return priorityTexts[priority] || priority;
    }

    getDepartmentText(department) {
        const departmentTexts = {
            'urgence': 'Urgences',
            'chirurgie': 'Chirurgie',
            'cardiologie': 'Cardiologie',
            'maternite': 'Maternité',
            'oncologie': 'Oncologie',
            'pediatrie': 'Pédiatrie',
            'autres': 'Autre service'
        };
        return departmentTexts[department] || department;
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

    updateStats() {
        const pendingCount = this.demands.filter(d => d.status === 'pending').length;
        const approvedCount = this.demands.filter(d => d.status === 'approved').length;
        const rejectedCount = this.demands.filter(d => d.status === 'rejected').length;
        const completedCount = this.demands.filter(d => d.status === 'completed').length;

        document.getElementById('pendingDemandsCount').textContent = pendingCount;
        document.getElementById('approvedDemandsCount').textContent = approvedCount;
        document.getElementById('rejectedDemandsCount').textContent = rejectedCount;
        document.getElementById('completedDemandsCount').textContent = completedCount;

        // Mise à jour du badge dans la navigation
        const demandBadge = document.getElementById('demandBadge');
        if (demandBadge) {
            demandBadge.textContent = pendingCount;
        }
    }

    openNewDemandModal() {
        const modal = document.getElementById('demandModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeDemandModal() {
        const modal = document.getElementById('demandModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    handleDemandSubmission() {
        const formData = {
            bloodType: document.getElementById('demandBloodType').value,
            quantity: parseInt(document.getElementById('demandQuantity').value),
            department: document.getElementById('demandDepartment').value,
            priority: document.getElementById('demandPriority').value,
            patient: document.getElementById('demandPatient').value,
            reason: document.getElementById('demandReason').value,
            doctor: document.getElementById('demandDoctor').value,
            neededBy: document.getElementById('demandDate').value ? new Date(document.getElementById('demandDate').value) : null
        };

        if (!formData.bloodType || !formData.quantity || !formData.department || !formData.priority || !formData.reason || !formData.doctor) {
            hospitalApp.showNotification('Veuillez remplir tous les champs obligatoires', 'warning');
            return;
        }

        this.createDemand(formData);
        this.closeDemandModal();
    }

    createDemand(demandData) {
        const newDemand = {
            id: `DEM-${new Date().getFullYear()}${String(this.demands.length + 1).padStart(3, '0')}`,
            bloodType: demandData.bloodType,
            quantity: demandData.quantity,
            department: demandData.department,
            priority: demandData.priority,
            patient: demandData.patient,
            reason: demandData.reason,
            doctor: demandData.doctor,
            status: 'pending',
            requestedAt: new Date(),
            neededBy: demandData.neededBy,
            hospital: 'Hôpital Central Paris'
        };

        this.demands.unshift(newDemand);
        this.saveDemands();
        this.renderDemands();
        this.updateStats();
        
        hospitalApp.showNotification(`Demande ${newDemand.id} créée avec succès!`, 'success');
    }

    showDemandDetail(demandId) {
        const demand = this.demands.find(d => d.id === demandId);
        if (!demand) return;

        const modal = document.getElementById('demandDetailModal');
        const content = document.getElementById('demandDetailContent');
        
        if (!modal || !content) return;

        content.innerHTML = `
            <div class="demand-detail">
                <div class="detail-header">
                    <div class="detail-id">${demand.id}</div>
                    <div class="detail-status ${demand.status}">
                        ${this.getStatusText(demand.status)}
                    </div>
                </div>
                
                <div class="detail-priority ${demand.priority}">
                    Priorité: ${this.getPriorityText(demand.priority)}
                </div>
                
                <div class="detail-grid">
                    <div class="detail-section">
                        <h4>Informations Produit</h4>
                        <div class="detail-item">
                            <span class="detail-label">Groupe sanguin:</span>
                            <span class="detail-value blood-type ${demand.bloodType}">${demand.bloodType}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Quantité:</span>
                            <span class="detail-value">${demand.quantity} unités</span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Informations Patient</h4>
                        <div class="detail-item">
                            <span class="detail-label">Service:</span>
                            <span class="detail-value">${this.getDepartmentText(demand.department)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Patient:</span>
                            <span class="detail-value">${demand.patient || 'Non spécifié'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Médecin:</span>
                            <span class="detail-value">${demand.doctor}</span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Dates Importantes</h4>
                        <div class="detail-item">
                            <span class="detail-label">Demandée le:</span>
                            <span class="detail-value">${this.formatDate(demand.requestedAt)}</span>
                        </div>
                        ${demand.approvedAt ? `
                        <div class="detail-item">
                            <span class="detail-label">Approuvée le:</span>
                            <span class="detail-value">${this.formatDate(demand.approvedAt)}</span>
                        </div>
                        ` : ''}
                        ${demand.rejectedAt ? `
                        <div class="detail-item">
                            <span class="detail-label">Rejetée le:</span>
                            <span class="detail-value">${this.formatDate(demand.rejectedAt)}</span>
                        </div>
                        ` : ''}
                        ${demand.completedAt ? `
                        <div class="detail-item">
                            <span class="detail-label">Terminée le:</span>
                            <span class="detail-value">${this.formatDate(demand.completedAt)}</span>
                        </div>
                        ` : ''}
                        ${demand.neededBy ? `
                        <div class="detail-item">
                            <span class="detail-label">Besoin pour le:</span>
                            <span class="detail-value ${new Date() > new Date(demand.neededBy) ? 'late' : ''}">
                                ${this.formatDate(demand.neededBy)}
                                ${new Date() > new Date(demand.neededBy) ? ' (Dépassé)' : ''}
                            </span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="detail-section full-width">
                    <h4>Motif de la Demande</h4>
                    <div class="detail-reason">
                        ${demand.reason}
                    </div>
                </div>
                
                ${demand.rejectionReason ? `
                <div class="detail-section full-width">
                    <h4>Raison du Rejet</h4>
                    <div class="detail-rejection">
                        ${demand.rejectionReason}
                    </div>
                </div>
                ` : ''}
                
                <div class="detail-actions">
                    ${demand.status === 'pending' ? `
                        <button class="btn btn-success" onclick="demandesPage.approveDemand('${demand.id}')">
                            ✅ Approuver la demande
                        </button>
                        <button class="btn btn-danger" onclick="demandesPage.rejectDemand('${demand.id}')">
                            ❌ Rejeter la demande
                        </button>
                    ` : ''}
                    
                    ${demand.status === 'approved' ? `
                        <button class="btn btn-primary" onclick="demandesPage.completeDemand('${demand.id}')">
                            📦 Marquer comme traitée
                        </button>
                    ` : ''}
                    
                    <button class="btn btn-outline" onclick="demandesPage.closeDemandDetail()">
                        Fermer
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    closeDemandDetail() {
        const modal = document.getElementById('demandDetailModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    approveDemand(demandId) {
        const demand = this.demands.find(d => d.id === demandId);
        if (demand) {
            demand.status = 'approved';
            demand.approvedAt = new Date();
            this.saveDemands();
            this.renderDemands();
            this.updateStats();
            
            hospitalApp.showNotification(`Demande ${demandId} approuvée!`, 'success');
            this.closeDemandDetail();
        }
    }

    rejectDemand(demandId) {
        const modal = document.getElementById('validationModal');
        const content = document.getElementById('validationContent');
        
        if (!modal || !content) return;
        
        content.innerHTML = `
            <div class="validation-content">
                <p>Veuillez indiquer la raison du rejet de la demande <strong>${demandId}</strong>:</p>
                <div class="form-group">
                    <textarea id="rejectionReason" placeholder="Raison du rejet..." rows="4" required></textarea>
                </div>
                <div class="form-actions">
                    <button class="btn btn-outline" onclick="demandesPage.closeValidationModal()">
                        Annuler
                    </button>
                    <button class="btn btn-danger" onclick="demandesPage.confirmRejection('${demandId}')">
                        ❌ Confirmer le rejet
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }

    confirmRejection(demandId) {
        const rejectionReason = document.getElementById('rejectionReason').value;
        if (!rejectionReason) {
            hospitalApp.showNotification('Veuillez indiquer la raison du rejet', 'warning');
            return;
        }

        const demand = this.demands.find(d => d.id === demandId);
        if (demand) {
            demand.status = 'rejected';
            demand.rejectedAt = new Date();
            demand.rejectionReason = rejectionReason;
            this.saveDemands();
            this.renderDemands();
            this.updateStats();
            
            hospitalApp.showNotification(`Demande ${demandId} rejetée.`, 'warning');
            this.closeValidationModal();
            this.closeDemandDetail();
        }
    }

    completeDemand(demandId) {
        const demand = this.demands.find(d => d.id === demandId);
        if (demand) {
            demand.status = 'completed';
            demand.completedAt = new Date();
            this.saveDemands();
            this.renderDemands();
            this.updateStats();
            
            hospitalApp.showNotification(`Demande ${demandId} marquée comme traitée!`, 'success');
            this.closeDemandDetail();
        }
    }

    closeValidationModal() {
        const modal = document.getElementById('validationModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    exportDemands() {
        hospitalApp.showNotification('Export des demandes en cours...', 'info');
        // Simulation d'export
        setTimeout(() => {
            hospitalApp.showNotification('📊 Demandes exportées avec succès!', 'success');
        }, 2000);
    }
}

// Initialisation de la page
const demandesPage = new DemandesPage();