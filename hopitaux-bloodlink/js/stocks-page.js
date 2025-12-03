// BloodLink Hôpitaux - Page Gestion des Stocks
class StocksPage {
    constructor() {
        this.stocks = {
            'O-': { current: 2, min: 5, max: 50, status: 'critical', trend: 'down' },
            'O+': { current: 15, min: 10, max: 80, status: 'low', trend: 'stable' },
            'A-': { current: 28, min: 8, max: 60, status: 'normal', trend: 'up' },
            'A+': { current: 35, min: 12, max: 70, status: 'normal', trend: 'stable' },
            'B-': { current: 18, min: 6, max: 40, status: 'normal', trend: 'down' },
            'B+': { current: 22, min: 8, max: 50, status: 'normal', trend: 'up' },
            'AB-': { current: 8, min: 4, max: 30, status: 'normal', trend: 'stable' },
            'AB+': { current: 19, min: 5, max: 35, status: 'normal', trend: 'up' }
        };

        this.movements = [];
        this.viewMode = 'grid';
        this.consumptionChart = null;

        this.init();
    }

    init() {
        this.loadStockData();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.renderStockGrid();
        this.renderStockTable();
        this.renderCriticalAlerts();
        this.renderMovements();
        this.updateStats();
        this.initCharts();
    }

    loadStockData() {
        // Chargement initial des données de stock
        this.generateSampleMovements();
    }

    setupEventListeners() {
        // Filtres des mouvements
        document.getElementById('movementTypeFilter').addEventListener('change', () => {
            this.filterMovements();
        });

        document.getElementById('movementPeriodFilter').addEventListener('change', () => {
            this.filterMovements();
        });

        // Période analytics
        document.getElementById('analyticsPeriod').addEventListener('change', () => {
            this.updateAnalytics();
        });

        // Sélecteur de type sanguin dans le modal
        document.getElementById('updateBloodType').addEventListener('change', (e) => {
            this.updateModalStockInfo(e.target.value);
        });
    }

    startRealTimeUpdates() {
        // Mise à jour en temps réel des stocks
        setInterval(() => {
            this.simulateStockChanges();
            this.updateStats();
            this.renderStockGrid();
            this.renderStockTable();
            this.renderCriticalAlerts();
        }, 15000); // Toutes les 15 secondes

        // Vérification des alertes critiques
        setInterval(() => {
            this.checkCriticalStocks();
        }, 30000); // Toutes les 30 secondes
    }

    simulateStockChanges() {
        // Simulation de changements de stock aléatoires
        Object.keys(this.stocks).forEach(bloodType => {
            const stock = this.stocks[bloodType];
            
            // 20% de chance de changement
            if (Math.random() < 0.2) {
                const change = Math.random() < 0.5 ? -1 : 1; // -1 ou +1
                const newValue = stock.current + change;
                
                // Vérifier les limites
                if (newValue >= 0 && newValue <= stock.max) {
                    stock.current = newValue;
                    
                    // Enregistrer le mouvement
                    this.recordMovement(
                        bloodType,
                        change > 0 ? 'in' : 'out',
                        Math.abs(change),
                        change > 0 ? 'simulation_entree' : 'simulation_sortie',
                        'Système'
                    );

                    // Mettre à jour le statut
                    this.updateStockStatus(bloodType);
                }
            }
        });
    }

    updateStockStatus(bloodType) {
        const stock = this.stocks[bloodType];
        
        if (stock.current <= stock.min * 0.5) {
            stock.status = 'critical';
        } else if (stock.current <= stock.min) {
            stock.status = 'low';
        } else if (stock.current >= stock.max * 0.8) {
            stock.status = 'optimal';
        } else {
            stock.status = 'normal';
        }
    }

    recordMovement(bloodType, type, quantity, reason, service) {
        const movement = {
            id: Date.now(),
            bloodType: bloodType,
            type: type,
            quantity: quantity,
            reason: reason,
            service: service,
            timestamp: new Date(),
            user: 'Système Auto'
        };

        this.movements.unshift(movement);
        
        // Garder seulement les 50 derniers mouvements
        if (this.movements.length > 50) {
            this.movements.pop();
        }

        this.renderMovements();
    }

    generateSampleMovements() {
        const reasons = {
            in: ['don', 'delivery', 'transfer'],
            out: ['usage', 'waste', 'transfer']
        };

        const services = ['Urgences', 'Chirurgie', 'Cardiologie', 'Maternité', 'Oncologie'];

        // Générer 20 mouvements d'exemple
        for (let i = 0; i < 20; i++) {
            const bloodTypes = Object.keys(this.stocks);
            const bloodType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
            const type = Math.random() < 0.6 ? 'out' : 'in';
            const quantity = Math.floor(Math.random() * 5) + 1;
            const reason = reasons[type][Math.floor(Math.random() * reasons[type].length)];
            const service = services[Math.floor(Math.random() * services.length)];
            const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);

            this.movements.push({
                id: Date.now() - i,
                bloodType: bloodType,
                type: type,
                quantity: quantity,
                reason: reason,
                service: service,
                timestamp: timestamp,
                user: `Dr. ${['Martin', 'Dubois', 'Lefebvre', 'Moreau'][Math.floor(Math.random() * 4)]}`
            });
        }

        // Trier par date (plus récent en premier)
        this.movements.sort((a, b) => b.timestamp - a.timestamp);
    }

    renderStockGrid() {
        const grid = document.querySelector('.stock-grid');
        if (!grid) return;

        grid.innerHTML = Object.entries(this.stocks).map(([bloodType, data]) => {
            const percentage = Math.round((data.current / data.max) * 100);
            const progressWidth = Math.max(5, percentage); // Minimum 5% pour visibilité

            return `
                <div class="stock-card ${data.status}" data-blood-type="${bloodType}">
                    <div class="stock-header">
                        <span class="blood-type-large">${bloodType}</span>
                        <span class="stock-status ${data.status}">${this.getStatusLabel(data.status)}</span>
                    </div>
                    
                    <div class="stock-info">
                        <span class="current-stock">${data.current}</span>
                        <span class="stock-label">unités disponibles</span>
                    </div>
                    
                    <div class="stock-limits">
                        <span>Min: ${data.min}</span>
                        <span>Max: ${data.max}</span>
                    </div>
                    
                    <div class="stock-progress">
                        <div class="progress-bar-stock">
                            <div class="progress-fill-stock" style="width: ${progressWidth}%"></div>
                        </div>
                        <div class="progress-labels">
                            <span>0</span>
                            <span>${percentage}%</span>
                            <span>${data.max}</span>
                        </div>
                    </div>
                    
                    <div class="stock-actions">
                        <button class="btn btn-primary" onclick="stocksPage.quickAddStock('${bloodType}')">
                            ➕ Ajouter
                        </button>
                        <button class="btn btn-outline" onclick="stocksPage.quickRemoveStock('${bloodType}')">
                            ➖ Retirer
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderStockTable() {
        const tbody = document.getElementById('stockTableBody');
        if (!tbody) return;

        tbody.innerHTML = Object.entries(this.stocks).map(([bloodType, data]) => {
            const percentage = Math.round((data.current / data.max) * 100);
            const trendIcon = this.getTrendIcon(data.trend);

            return `
                <tr>
                    <td>
                        <strong>${bloodType}</strong>
                    </td>
                    <td>
                        <span class="${data.status === 'critical' ? 'critical' : ''}">${data.current}</span>
                    </td>
                    <td>${data.min}</td>
                    <td>${data.max}</td>
                    <td>
                        <span class="level-badge level-${data.status}">
                            ${this.getStatusLabel(data.status)}
                        </span>
                    </td>
                    <td>
                        <span class="trend-indicator ${data.trend}">
                            ${trendIcon}
                            ${data.trend}
                        </span>
                    </td>
                    <td class="table-actions">
                        <button class="btn btn-sm" onclick="stocksPage.openStockUpdateModal('${bloodType}')">
                            ✏️
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="stocksPage.viewStockHistory('${bloodType}')">
                            📋
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderCriticalAlerts() {
        const grid = document.getElementById('criticalAlertsGrid');
        if (!grid) return;

        const criticalStocks = Object.entries(this.stocks).filter(([_, data]) => data.status === 'critical');

        if (criticalStocks.length === 0) {
            grid.innerHTML = `
                <div class="alert-card-stock" style="border-color: #00C853; animation: none;">
                    <div class="alert-header-stock">
                        <div class="alert-icon-stock">✅</div>
                        <div class="alert-content-stock">
                            <h3 style="color: #00C853;">Aucun Stock Critique</h3>
                            <p>Tous les stocks sont à des niveaux acceptables</p>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        grid.innerHTML = criticalStocks.map(([bloodType, data]) => `
            <div class="alert-card-stock">
                <div class="alert-header-stock">
                    <div class="alert-icon-stock">🚨</div>
                    <div class="alert-content-stock">
                        <h3>Stock ${bloodType} Critique</h3>
                        <p>Seulement ${data.current} unité(s) disponible(s) - Seuil minimum: ${data.min}</p>
                    </div>
                </div>
                <div class="alert-actions-stock">
                    <button class="btn btn-emergency" onclick="stocksPage.emergencyReorder('${bloodType}')">
                        🚨 Commander d'Urgence
                    </button>
                    <button class="btn btn-primary" onclick="stocksPage.openStockUpdateModal('${bloodType}')">
                        📝 Mettre à jour
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderMovements() {
        const container = document.getElementById('movementsList');
        if (!container) return;

        const filteredMovements = this.getFilteredMovements();

        if (filteredMovements.length === 0) {
            container.innerHTML = `
                <div class="movement-item">
                    <div class="movement-icon">📊</div>
                    <div class="movement-content">
                        <div class="movement-header">
                            <span class="movement-title">Aucun mouvement</span>
                        </div>
                        <div class="movement-details">
                            <span>Aucun mouvement ne correspond aux filtres sélectionnés</span>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredMovements.slice(0, 10).map(movement => `
            <div class="movement-item">
                <div class="movement-icon ${movement.type}">
                    ${movement.type === 'in' ? '⬆️' : '⬇️'}
                </div>
                <div class="movement-content">
                    <div class="movement-header">
                        <span class="movement-title">
                            ${movement.type === 'in' ? 'Entrée' : 'Sortie'} ${movement.bloodType}
                        </span>
                        <span class="movement-time">${this.formatMovementTime(movement.timestamp)}</span>
                    </div>
                    <div class="movement-details">
                        <span class="movement-quantity ${movement.type}">
                            ${movement.type === 'in' ? '+' : '-'}${movement.quantity} unité(s)
                        </span>
                        <span>•</span>
                        <span>${this.getReasonLabel(movement.reason)}</span>
                        <span>•</span>
                        <span>${movement.service}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getFilteredMovements() {
        const typeFilter = document.getElementById('movementTypeFilter').value;
        const periodFilter = parseInt(document.getElementById('movementPeriodFilter').value);
        
        const periodMs = periodFilter * 60 * 60 * 1000; // Convertir en millisecondes
        const cutoffTime = new Date(Date.now() - periodMs);

        return this.movements.filter(movement => {
            const typeMatch = typeFilter === 'all' || movement.type === typeFilter;
            const timeMatch = movement.timestamp >= cutoffTime;
            return typeMatch && timeMatch;
        });
    }

    filterMovements() {
        this.renderMovements();
    }

    getStatusLabel(status) {
        const labels = {
            'critical': 'CRITIQUE',
            'low': 'FAIBLE',
            'normal': 'NORMAL',
            'optimal': 'OPTIMAL'
        };
        return labels[status] || 'INCONNU';
    }

    getTrendIcon(trend) {
        const icons = {
            'up': '📈',
            'down': '📉',
            'stable': '➡️'
        };
        return icons[trend] || '➡️';
    }

    getReasonLabel(reason) {
        const labels = {
            'don': 'Don de sang',
            'delivery': 'Livraison',
            'transfer': 'Transfert',
            'usage': 'Utilisation médicale',
            'waste': 'Péremption',
            'simulation_entree': 'Simulation entrée',
            'simulation_sortie': 'Simulation sortie',
            'other': 'Autre'
        };
        return labels[reason] || reason;
    }

    formatMovementTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'À l\'instant';
        if (minutes < 60) return `Il y a ${minutes} min`;
        if (hours < 24) return `Il y a ${hours} h`;
        if (days < 7) return `Il y a ${days} j`;
        return timestamp.toLocaleDateString('fr-FR');
    }

    updateStats() {
        const totalStock = Object.values(this.stocks).reduce((sum, stock) => sum + stock.current, 0);
        const criticalStocks = Object.values(this.stocks).filter(stock => stock.status === 'critical').length;
        const lowStocks = Object.values(this.stocks).filter(stock => stock.status === 'low').length;
        const totalCapacity = Object.values(this.stocks).reduce((sum, stock) => sum + stock.max, 0);
        const capacityPercentage = Math.round((totalStock / totalCapacity) * 100);

        document.getElementById('totalStock').textContent = totalStock;
        document.getElementById('criticalStocks').textContent = criticalStocks;
        document.getElementById('lowStocks').textContent = lowStocks;
        document.getElementById('stockCapacity').textContent = `${capacityPercentage}%`;

        // Mettre à jour le badge de navigation
        const navBadge = document.querySelector('.nav-badge.critical');
        if (navBadge) {
            navBadge.textContent = criticalStocks > 0 ? 'CRITIQUE' : 'NORMAL';
            navBadge.style.background = criticalStocks > 0 ? '#E53935' : '#00C853';
        }
    }

    initCharts() {
        const ctx = document.getElementById('consumptionChart');
        if (!ctx) return;

        this.consumptionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(this.stocks),
                datasets: [{
                    label: 'Stock Actuel',
                    data: Object.values(this.stocks).map(stock => stock.current),
                    backgroundColor: Object.values(this.stocks).map(stock => 
                        stock.status === 'critical' ? '#E53935' :
                        stock.status === 'low' ? '#FF6D00' :
                        stock.status === 'normal' ? '#00C853' : '#2196F3'
                    ),
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.9)',
                        titleColor: '#FFFFFF',
                        bodyColor: '#FFFFFF'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });
    }

    updateAnalytics() {
        const period = document.getElementById('analyticsPeriod').value;
        hospitalApp.showNotification(`Mise à jour des analytics pour ${period} jours`, 'info');
        
        // Simulation de mise à jour des données
        if (this.consumptionChart) {
            // Animer la mise à jour du graphique
            this.consumptionChart.data.datasets[0].data = 
                Object.values(this.stocks).map(stock => stock.current + Math.floor(Math.random() * 5));
            this.consumptionChart.update('active');
        }
    }

    // Méthodes d'action
    quickStockUpdate() {
        this.openStockUpdateModal();
    }

    openStockUpdateModal(bloodType = '') {
        const modal = document.getElementById('stockUpdateModal');
        const overlay = document.querySelector('.overlay') || this.createOverlay();
        
        modal.classList.add('active');
        overlay.classList.add('active');

        if (bloodType) {
            document.getElementById('updateBloodType').value = bloodType;
            this.updateModalStockInfo(bloodType);
        }
    }

    closeStockUpdateModal() {
        document.getElementById('stockUpdateModal').classList.remove('active');
        document.querySelector('.overlay').classList.remove('active');
    }

    updateModalStockInfo(bloodType) {
        const stock = this.stocks[bloodType];
        if (stock) {
            // Mettre à jour les informations affichées dans le modal
            const infoElement = document.getElementById('modalStockInfo');
            if (!infoElement) {
                // Créer l'élément d'info s'il n'existe pas
                const formGroup = document.querySelector('#stockUpdateForm .form-group:nth-child(2)');
                if (formGroup) {
                    formGroup.insertAdjacentHTML('afterend', `
                        <div class="form-group" id="modalStockInfo">
                            <div class="stock-info-modal">
                                <span>Stock actuel: <strong>${stock.current}</strong> unités</span>
                                <span>Seuil critique: <strong>${stock.min}</strong> unités</span>
                            </div>
                        </div>
                    `);
                }
            } else {
                infoElement.querySelector('.stock-info-modal').innerHTML = `
                    <span>Stock actuel: <strong>${stock.current}</strong> unités</span>
                    <span>Seuil critique: <strong>${stock.min}</strong> unités</span>
                `;
            }
        }
    }

    handleStockUpdate(event) {
        event.preventDefault();
        
        const bloodType = document.getElementById('updateBloodType').value;
        const movementType = document.querySelector('input[name="movementType"]:checked').value;
        const quantity = parseInt(document.getElementById('updateQuantity').value);
        const reason = document.getElementById('updateReason').value;
        const service = document.getElementById('updateService').value;
        const notes = document.getElementById('updateNotes').value;

        if (!bloodType) {
            hospitalApp.showNotification('Veuillez sélectionner un groupe sanguin', 'warning');
            return;
        }

        // Mettre à jour le stock
        const stock = this.stocks[bloodType];
        if (movementType === 'in') {
            stock.current += quantity;
        } else {
            stock.current = Math.max(0, stock.current - quantity);
        }

        // Mettre à jour le statut
        this.updateStockStatus(bloodType);

        // Enregistrer le mouvement
        this.recordMovement(
            bloodType,
            movementType,
            quantity,
            reason,
            service || 'Non spécifié'
        );

        // Mettre à jour l'interface
        this.renderStockGrid();
        this.renderStockTable();
        this.renderCriticalAlerts();
        this.updateStats();

        if (this.consumptionChart) {
            this.consumptionChart.update();
        }

        this.closeStockUpdateModal();
        
        hospitalApp.showNotification(
            `✅ Stock ${bloodType} mis à jour: ${movementType === 'in' ? '+' : '-'}${quantity} unité(s)`,
            'success'
        );
    }

    quickAddStock(bloodType) {
        this.stocks[bloodType].current += 1;
        this.updateStockStatus(bloodType);
        this.recordMovement(bloodType, 'in', 1, 'ajout_rapide', 'Interface');
        
        this.renderStockGrid();
        this.renderStockTable();
        this.updateStats();
        
        hospitalApp.showNotification(`➕ 1 unité ${bloodType} ajoutée`, 'success');
    }

    quickRemoveStock(bloodType) {
        if (this.stocks[bloodType].current > 0) {
            this.stocks[bloodType].current -= 1;
            this.updateStockStatus(bloodType);
            this.recordMovement(bloodType, 'out', 1, 'retrait_rapide', 'Interface');
            
            this.renderStockGrid();
            this.renderStockTable();
            this.updateStats();
            
            hospitalApp.showNotification(`➖ 1 unité ${bloodType} retirée`, 'info');
        } else {
            hospitalApp.showNotification(`Stock ${bloodType} déjà vide`, 'warning');
        }
    }

    emergencyReorder(bloodType) {
        const stock = this.stocks[bloodType];
        const needed = stock.min * 2 - stock.current; // Commander 2x le minimum
        
        if (needed > 0) {
            hospitalApp.showNotification(
                `🚨 Commande d'urgence: ${needed} unités ${bloodType} en cours...`,
                'emergency'
            );
            
            // Simulation de livraison
            setTimeout(() => {
                stock.current += needed;
                this.updateStockStatus(bloodType);
                this.recordMovement(bloodType, 'in', needed, 'commande_urgence', 'Approvisionnement');
                
                this.renderStockGrid();
                this.renderStockTable();
                this.renderCriticalAlerts();
                this.updateStats();
                
                hospitalApp.showNotification(
                    `📦 ${needed} unités ${bloodType} livrées en urgence!`,
                    'success'
                );
            }, 3000);
        }
    }

    autoReorderCritical() {
        const criticalStocks = Object.entries(this.stocks).filter(([_, data]) => data.status === 'critical');
        
        if (criticalStocks.length === 0) {
            hospitalApp.showNotification('Aucun stock critique à réapprovisionner', 'info');
            return;
        }

        hospitalApp.showNotification(
            `🔄 Réapprovisionnement automatique de ${criticalStocks.length} stock(s) critique(s)`,
            'info'
        );

        criticalStocks.forEach(([bloodType, stock]) => {
            const needed = stock.min * 2 - stock.current;
            if (needed > 0) {
                setTimeout(() => {
                    stock.current += needed;
                    this.updateStockStatus(bloodType);
                    this.recordMovement(bloodType, 'in', needed, 'reappro_auto', 'Système');
                    
                    hospitalApp.showNotification(
                        `✅ ${needed} unités ${bloodType} réapprovisionnées`,
                        'success'
                    );
                }, Math.random() * 2000 + 1000);
            }
        });

        // Mettre à jour l'interface après tous les réapprovisionnements
        setTimeout(() => {
            this.renderStockGrid();
            this.renderStockTable();
            this.renderCriticalAlerts();
            this.updateStats();
        }, 3000);
    }

    toggleViewMode() {
        const gridView = document.getElementById('stockGridView');
        const tableView = document.getElementById('stockTableView');
        
        if (this.viewMode === 'grid') {
            this.viewMode = 'table';
            gridView.style.display = 'none';
            tableView.style.display = 'block';
        } else {
            this.viewMode = 'grid';
            gridView.style.display = 'block';
            tableView.style.display = 'none';
        }
        
        hospitalApp.showNotification(
            `Vue changée: ${this.viewMode === 'grid' ? 'Grille' : 'Tableau'}`,
            'info'
        );
    }

    generateStockReport() {
        hospitalApp.showNotification('📊 Génération du rapport de stocks...', 'info');
        
        // Simulation de génération de rapport
        setTimeout(() => {
            const report = {
                timestamp: new Date(),
                totalStock: Object.values(this.stocks).reduce((sum, stock) => sum + stock.current, 0),
                criticalStocks: Object.values(this.stocks).filter(stock => stock.status === 'critical').length,
                stockValue: Object.values(this.stocks).reduce((sum, stock) => sum + stock.current * 150, 0), // Estimation 150€/unité
                movementsLast24h: this.movements.filter(m => 
                    new Date() - m.timestamp < 24 * 60 * 60 * 1000
                ).length
            };
            
            console.log('📈 Rapport Stocks BloodLink:', report);
            hospitalApp.showNotification('📊 Rapport généré (voir console navigateur)', 'success');
        }, 2000);
    }

    exportStockData() {
        hospitalApp.showNotification('📁 Export des données de stocks...', 'info');
        
        // Simulation d'export
        setTimeout(() => {
            const dataStr = JSON.stringify(this.stocks, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            // Créer un lien de téléchargement
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `bloodlink-stocks-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            hospitalApp.showNotification('✅ Données exportées avec succès', 'success');
        }, 1000);
    }

    checkCriticalStocks() {
        Object.entries(this.stocks).forEach(([bloodType, stock]) => {
            if (stock.status === 'critical' && Math.random() < 0.3) {
                hospitalApp.showNotification(
                    `⚠️ Stock ${bloodType} toujours critique: ${stock.current} unité(s)`,
                    'warning'
                );
            }
        });
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.addEventListener('click', () => {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
            });
            overlay.classList.remove('active');
        });
        document.body.appendChild(overlay);
        return overlay;
    }

    // Méthodes de gestion par lot
    openBatchManagement() {
        document.getElementById('batchManagementModal').classList.add('active');
        this.createOverlay().classList.add('active');
    }

    closeBatchModal() {
        document.getElementById('batchManagementModal').classList.remove('active');
        document.querySelector('.overlay').classList.remove('active');
    }

    switchBatchTab(tabName) {
        // Désactiver tous les onglets
        document.querySelectorAll('.batch-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.batch-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Activer l'onglet sélectionné
        document.querySelector(`.batch-tab[onclick*="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    // Méthodes pour les actions rapides
    quickInventory() {
        hospitalApp.showNotification('📋 Démarrage de l\'inventory rapide...', 'info');
        // Simulation d'inventaire
    }

    autoReorder() {
        hospitalApp.showNotification('🔄 Réapprovisionnement automatique lancé', 'info');
        this.autoReorderCritical();
    }

    stockOptimization() {
        hospitalApp.showNotification('🎯 Optimisation des stocks en cours...', 'info');
        // Simulation d'optimisation
    }

    qualityControl() {
        hospitalApp.showNotification('✅ Contrôle qualité des stocks démarré', 'info');
        // Simulation de contrôle qualité
    }

    viewStockHistory(bloodType) {
        hospitalApp.showNotification(`📋 Ouverture de l'historique ${bloodType}`, 'info');
        // Ouvrir l'historique des mouvements pour ce groupe sanguin
    }

    saveThresholds() {
        hospitalApp.showNotification('💾 Seuils sauvegardés avec succès', 'success');
        // Logique de sauvegarde des seuils
    }
}

// Initialisation de la page stocks
const stocksPage = new StocksPage();