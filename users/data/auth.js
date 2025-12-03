// Authentication Manager
class AuthManager {
    constructor() {
        console.log('✅ AuthManager initialisé');
        this.currentUser = null;
        this.isLoggedIn = false;
        this.loadSession();
        this.checkPageAccess();
        if (this.isLoggedIn) {
            this.updateUIAfterLogin();
        }
    }

    showLoginModal() {
        const modalElement = document.getElementById('loginModal');
        if (!modalElement || typeof bootstrap === 'undefined') {
            return;
        }
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }

    showRegisterModal() {
        const modalElement = document.getElementById('registerModal');
        if (!modalElement || typeof bootstrap === 'undefined') {
            return;
        }
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const email = (formData.get('email') || '').toString().trim();
        const password = (formData.get('password') || '').toString();
        
        try {
            if (!email || !password) {
                throw new Error('Veuillez remplir tous les champs');
            }

            await this.delay(500);

            const users = this.getAllUsers();
            const existing = users.find(user => user.email === email && user.password === password);

            if (!existing) {
                throw new Error('Identifiants invalides');
            }

            this.currentUser = {
                id: existing.id,
                name: existing.name,
                email: existing.email,
                role: existing.role,
                bloodType: existing.bloodType || null
            };

            this.isLoggedIn = true;
            this.saveSession();
            this.updateUIAfterLogin();

            this.showToast('Connexion réussie! Redirection...', 'success');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1200);
        } catch (error) {
            this.showToast('Erreur de connexion: ' + error.message, 'error');
        }
    }

    async handleRegister(event) {
        console.log('🚀 handleRegister appelé');
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const name = (formData.get('name') || '').toString().trim();
        const email = (formData.get('email') || '').toString().trim();
        const phone = (formData.get('phone') || '').toString().trim();
        const birthDate = (formData.get('birthDate') || '').toString().trim();
        const address = (formData.get('address') || '').toString().trim();
        const accountType = (formData.get('accountType') || '').toString();
        const bloodType = (formData.get('bloodType') || '').toString() || null;
        const password = (formData.get('password') || '').toString();
        const confirmPassword = (formData.get('confirmPassword') || '').toString();
        
        try {
            console.log('📝 Validation du formulaire');
            
            if (!name || !email || !phone || !birthDate || !address || !accountType || !password || !confirmPassword) {
                throw new Error('Veuillez remplir tous les champs obligatoires');
            }

            if (password !== confirmPassword) {
                throw new Error('Les mots de passe ne correspondent pas');
            }

            // Vérifier l'âge minimum (18 ans)
            const birthDateObj = new Date(birthDate);
            const today = new Date();
            let age = today.getFullYear() - birthDateObj.getFullYear();
            const monthDiff = today.getMonth() - birthDateObj.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
                age--;
            }
            
            if (age < 18) {
                throw new Error('Vous devez avoir au moins 18 ans pour vous inscrire');
            }

            console.log('⏳ Vérification des doublons...');
            await this.delay(800);

            const users = this.getAllUsers();
            const existing = users.find(user => user.email === email);
            if (existing) {
                throw new Error('Un compte existe déjà avec cet email');
            }

            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                phone: phone,
                birthDate: birthDate,
                address: address,
                role: accountType,
                bloodType: bloodType,
                password: password,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            this.saveAllUsers(users);

            this.currentUser = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                birthDate: newUser.birthDate,
                address: newUser.address,
                role: newUser.role,
                bloodType: newUser.bloodType
            };

            this.isLoggedIn = true;
            this.saveSession();
            this.updateUIAfterLogin();

            console.log('✅ Compte créé avec succès!');
            this.showToast('Compte créé avec succès! Redirection en cours...', 'success');

            // CORRECTION ICI : Changement de register-success.html à register-succes.html
            console.log('🔄 Redirection vers register-succes.html dans 1.5 secondes');
            setTimeout(() => {
                console.log('🔗 Redirection vers register-succes.html');
                window.location.href = 'register-succes.html';
            }, 1500);
        } catch (error) {
            console.error('❌ Erreur d\'inscription:', error);
            this.showToast('Erreur d\'inscription: ' + error.message, 'error');
        }
    }

    handleAccountTypeChange(select) {
        const bloodTypeField = document.getElementById('bloodTypeField');
        if (!bloodTypeField) {
            return;
        }
        if (select.value === 'donor') {
            bloodTypeField.style.display = 'block';
        } else {
            bloodTypeField.style.display = 'none';
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    loadSession() {
        try {
            if (!window.localStorage) {
                return;
            }
            const raw = localStorage.getItem('bloodlink_current_user');
            if (!raw) {
                return;
            }
            const parsed = JSON.parse(raw);
            if (parsed && parsed.email) {
                this.currentUser = parsed;
                this.isLoggedIn = true;
                console.log('📂 Session chargée pour:', parsed.email);
            }
        } catch (error) {
            console.error('Erreur de chargement de session:', error);
        }
    }

    saveSession() {
        try {
            if (!window.localStorage) {
                return;
            }
            if (this.currentUser) {
                localStorage.setItem('bloodlink_current_user', JSON.stringify(this.currentUser));
                console.log('💾 Session sauvegardée');
            } else {
                localStorage.removeItem('bloodlink_current_user');
            }
        } catch (error) {
            console.error('Erreur de sauvegarde de session:', error);
        }
    }

    getAllUsers() {
        try {
            if (!window.localStorage) {
                return [];
            }
            const raw = localStorage.getItem('bloodlink_users');
            if (!raw) {
                return [];
            }
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error('Erreur de chargement des utilisateurs:', error);
            return [];
        }
    }

    saveAllUsers(users) {
        try {
            if (!window.localStorage) {
                return;
            }
            localStorage.setItem('bloodlink_users', JSON.stringify(users || []));
            console.log('👥 Utilisateurs sauvegardés:', users.length);
        } catch (error) {
            console.error('Erreur de sauvegarde des utilisateurs:', error);
        }
    }

    checkPageAccess() {
        const path = window.location.pathname.toLowerCase();
        if (path.endsWith('dashboard.html') && !this.isLoggedIn) {
            window.location.href = 'login.html';
        }
    }

    updateUIAfterLogin() {
        if (!this.currentUser) {
            return;
        }

        const displayName = this.currentUser.name || this.currentUser.email;
        const roleLabel = this.getRoleLabel(this.currentUser.role);
        const blood = this.currentUser.bloodType || '';

        const navbarUserName = document.getElementById('navbarUserName');
        const navbarUserMenu = document.getElementById('navbarUserMenu');
        const navbarAuthButtons = document.getElementById('navbarAuthButtons');

        if (navbarUserName) {
            navbarUserName.textContent = displayName;
        }
        if (navbarUserMenu) {
            navbarUserMenu.style.display = 'flex';
        }
        if (navbarAuthButtons) {
            navbarAuthButtons.style.display = 'none';
        }

        const dashboardName = document.getElementById('dashboardUserName');
        const dashboardMeta = document.getElementById('dashboardUserMeta');

        if (dashboardName) {
            dashboardName.textContent = displayName;
        }
        if (dashboardMeta) {
            dashboardMeta.textContent = roleLabel + (blood ? ' • ' + blood : '');
        }

        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileBloodType = document.getElementById('profileBloodType');

        if (profileName) {
            profileName.value = this.currentUser.name || '';
        }
        if (profileEmail) {
            profileEmail.value = this.currentUser.email || '';
        }
        if (profileBloodType && this.currentUser.bloodType) {
            profileBloodType.value = this.currentUser.bloodType;
        }
    }

    getRoleLabel(role) {
        if (role === 'hospital') return 'Hôpital';
        if (role === 'admin') return 'Administrateur';
        return 'Donneur';
    }

    showToast(message, type) {
        console.log(`📢 Toast [${type}]:`, message);
        
        // Essayez d'abord d'utiliser l'implémentation d'alerte de la page
        const alertsContainer = document.getElementById('authAlerts');
        if (alertsContainer) {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type === 'error' ? 'danger' : 'success'} alert-custom alert-dismissible fade show`;
            alertDiv.innerHTML = `
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            
            alertsContainer.innerHTML = '';
            alertsContainer.appendChild(alertDiv);
            
            // Auto-dismiss après 5 secondes
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 5000);
            return;
        }
        
        // Fallback aux alertes natives
        alert(message);
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.saveSession();
        this.updateUIAfterLogout();
        this.showToast('Déconnexion réussie', 'success');
        window.location.href = 'index.html';
    }

    updateUIAfterLogout() {
        const navbarUserMenu = document.getElementById('navbarUserMenu');
        const navbarAuthButtons = document.getElementById('navbarAuthButtons');

        if (navbarUserMenu) {
            navbarUserMenu.style.display = 'none';
        }
        if (navbarAuthButtons) {
            navbarAuthButtons.style.display = '';
        }
    }
}

console.log('🔧 Chargement de AuthManager...');
window.Auth = new AuthManager();