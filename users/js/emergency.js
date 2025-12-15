// Emergency Management
class EmergencyManager {
    constructor() {
        this.emergencyData = null;
        this.timerInterval = null;
        this.init();
    }

    async init() {
        await this.loadEmergencyData();
        this.initMap();
        this.startTimer();
        this.setupEventListeners();
    }

    async loadEmergencyData() {
        // Simulate API call
        await this.delay(1000);
        
        this.emergencyData = {
            id: 1,
            hospital: 'Hôpital Necker - Enfants Malades',
            bloodType: 'O-',
            quantity: 3,
            urgency: 'critical',
            reason: 'Enfant 5 ans - Intervention chirurgicale cardiaque urgente',
            distance: '0.8 km',
            contact: 'Dr. Martin - 01 44 49 49 49',
            coordinates: { lat: 48.8462, lng: 2.3159 },
            address: '149 Rue de Sèvres, 75015 Paris',
            codeUrgence: 'URG-NCK-2024-001'
        };
    }

    initMap() {
        // Initialize emergency map
        const map = L.map('emergencyMap').setView([48.8462, 2.3159], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add hospital marker
        L.marker([48.8462, 2.3159])
            .addTo(map)
            .bindPopup(`
                <div class="text-center">
                    <h6>${this.emergencyData.hospital}</h6>
                    <p><strong>Code Urgence:</strong> ${this.emergencyData.codeUrgence}</p>
                    <p>${this.emergencyData.address}</p>
                </div>
            `)
            .openPopup();
        
        // Add user location marker (simulated)
        L.marker([48.8566, 2.3522])
            .addTo(map)
            .bindPopup('Votre position')
            .openPopup();
    }

    startTimer() {
        let timeLeft = 135; // 2 minutes 15 seconds
        const timerElement = document.getElementById('emergencyTimer');
        
        this.timerInterval = setInterval(() => {
            timeLeft--;
            
            if (timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.handleTimerExpired();
                return;
            }
            
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Flash red when under 30 seconds
            if (timeLeft <= 30) {
                timerElement.style.color = timeLeft % 2 === 0 ? '#dc2626' : '#fff';
            }
        }, 1000);
    }

    handleTimerExpired() {
        document.getElementById('emergencyTimer').textContent = '00:00';
        document.getElementById('emergencyTimer').style.color = '#dc2626';
        
        this.showToast('Temps écoulé - Alerte en cours de mise à jour', 'warning');
    }

    setupEventListeners() {
        // Checkbox validation
        const checkboxes = document.querySelectorAll('.form-check-input');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', this.validateCheckboxes.bind(this));
        });
    }

    validateCheckboxes() {
        const checkboxes = document.querySelectorAll('.form-check-input');
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        document.getElementById('finalConfirmBtn').disabled = !allChecked;
    }

    confirmEmergencyDonation() {
        const modal = new bootstrap.Modal(document.getElementById('emergencyConfirmModal'));
        modal.show();
    }

    finalConfirm() {
        // Simulate emergency response
        this.showToast('Confirmation enregistrée - Code urgence envoyé', 'success');
        
        // Send emergency notification
        this.sendEmergencyNotification();
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('emergencyConfirmModal')).hide();
        
        // Redirect to navigation
        setTimeout(() => {
            this.openNavigation();
        }, 2000);
    }

    sendEmergencyNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('BloodLink - Urgence Confirmée', {
                body: `Code: ${this.emergencyData.codeUrgence} - Direction ${this.emergencyData.hospital}`,
                icon: '/assets/icons/emergency.png',
                requireInteraction: true
            });
        }
    }

    openNavigation() {
        // Simulate opening navigation app
        const destination = encodeURIComponent(this.emergencyData.address);
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
        
        this.showToast('Ouverture de la navigation...', 'info');
        window.open(url, '_blank');
    }

    callHospital() {
        // Simulate phone call
        this.showToast(`Appel en cours: ${this.emergencyData.contact}`, 'info');
        // In a real app: window.location.href = `tel:${this.emergencyData.contact}`;
    }

    shareEmergency() {
        const shareData = {
            title: 'URGENCE BloodLink - Aide Requise',
            text: `Urgence sang ${this.emergencyData.bloodType} - ${this.emergencyData.hospital}`,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(() => this.showToast('Urgence partagée', 'success'))
                .catch(() => this.showToast('Partage annulé', 'warning'));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareData.text + ' ' + shareData.url)
                .then(() => this.showToast('Lien copié dans le presse-papier', 'success'));
        }
    }

    showToast(message, type = 'info') {
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

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global functions for HTML onclick handlers
function confirmEmergencyDonation() {
    window.EmergencyManager.confirmEmergencyDonation();
}

function finalConfirm() {
    window.EmergencyManager.finalConfirm();
}

function shareEmergency() {
    window.EmergencyManager.shareEmergency();
}

function openNavigation() {
    window.EmergencyManager.openNavigation();
}

function callHospital() {
    window.EmergencyManager.callHospital();
}

// Initialize emergency manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.EmergencyManager = new EmergencyManager();
});