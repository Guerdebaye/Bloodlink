// Authentication Manager
class AuthManager {
    constructor() {
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
        event.preventDefault();
        console.log('handleRegister appelé');
        
        const formData = new FormData(event.target);
        const name = (formData.get('name') || '').toString().trim();
        const email = (formData.get('email') || '').toString().trim();
        const phone = (formData.get('phone') || '').toString().trim();
        const birthDate = (formData.get('birthDate') || '').toString().trim();
        const address = (formData.get('address') || '').toString().trim();
        const accountType = (formData.get('accountType') || '').toString();
        const bloodType = (formData.get('bloodType') || '').toString() || null;
        const password = (formData.get('password') || '').toString();
        const confirmPassword = (formData.get('confirmPassword') || '').toString();
        
        console.log('Données formulaire:', { name, email, phone, birthDate, address, accountType, bloodType });
        
        try {
            if (!name || !email || !phone || !birthDate || !address || !accountType || !password || !confirmPassword) {
                throw new Error('Veuillez remplir tous les champs obligatoires');
            }

            if (password !== confirmPassword) {
                throw new Error('Les mots de passe ne correspondent pas');
            }

            // Vérifier l'âge minimum (18 ans)
            const birthDateObj = new Date(birthDate);
            const today = new Date();
            const age = today.getFullYear() - birthDateObj.getFullYear();
            const monthDiff = today.getMonth() - birthDateObj.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
                age--;
            }
            
            if (age < 18) {
                throw new Error('Vous devez avoir au moins 18 ans pour vous inscrire');
            }

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
                password: password
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

            this.showToast('Compte créé avec succès!', 'success');
            console.log('Redirection vers register-success.html...');

            setTimeout(() => {
                console.log('Exécution de la redirection...');
                window.location.href = 'register-success.html';
            }, 1500);
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
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
        
        // Créer un nom court (première lettre du nom + première lettre du prénom)
        const nameParts = displayName.split(' ');
        const shortName = nameParts.length >= 2 
            ? nameParts[0].charAt(0).toUpperCase() + nameParts[nameParts.length - 1].charAt(0).toUpperCase() + '.'
            : displayName.length > 2 
                ? displayName.charAt(0).toUpperCase() + displayName.slice(1, 3) + '.'
                : displayName;

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

        // Dashboard elements
        const dashboardName = document.getElementById('dashboardUserName');
        const dashboardMeta = document.getElementById('dashboardUserMeta');

        if (dashboardName) {
            dashboardName.textContent = displayName;
        }
        if (dashboardMeta) {
            dashboardMeta.textContent = roleLabel + (blood ? ' • ' + blood : '');
        }

        // Profile elements
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
        
        // Dashboard specific elements
        const dashboardUserShortName = document.getElementById('dashboardUserShortName');
        if (dashboardUserShortName) {
            dashboardUserShortName.textContent = shortName;
        }
        
        const dashboardUserFullName = document.getElementById('dashboardUserFullName');
        if (dashboardUserFullName) {
            dashboardUserFullName.textContent = displayName;
        }
        
        const dashboardProfileName = document.getElementById('dashboardProfileName');
        if (dashboardProfileName) {
            dashboardProfileName.textContent = displayName;
        }
        
        const dashboardMessageUserName = document.getElementById('dashboardMessageUserName');
        if (dashboardMessageUserName) {
            dashboardMessageUserName.textContent = displayName + ' (Vous)';
        }
        
        const dashboardFormUserName = document.getElementById('dashboardFormUserName');
        if (dashboardFormUserName) {
            dashboardFormUserName.textContent = displayName;
        }
    }

    getRoleLabel(role) {
        if (role === 'hospital') return 'Hôpital';
        if (role === 'admin') return 'Administrateur';
        return 'Donneur';
    }

    showToast(message, type) {
        if (window.App && typeof App.showToast === 'function') {
            App.showToast(message, type);
            return;
        }

        if (window.bloodLinkApp && typeof window.bloodLinkApp.showToast === 'function') {
            window.bloodLinkApp.showToast(message, type);
            return;
        }

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

window.Auth = new AuthManager();