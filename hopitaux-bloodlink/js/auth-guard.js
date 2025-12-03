// Auth Guard - Protection des pages
class AuthGuard {
    constructor() {
        this.isAuthenticated = this.checkAuth();
        this.init();
    }

    init() {
        // Vérifier l'authentification au chargement
        this.protectCurrentPage();
        
        // Écouter les changements de page
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('lastPage', window.location.pathname);
        });
    }

    checkAuth() {
        // Vérifier si l'utilisateur est connecté via localStorage
        const authData = localStorage.getItem('bloodlink_auth');
        if (authData) {
            try {
                const data = JSON.parse(authData);
                // Vérifier si la session n'est pas expirée (24h)
                const sessionAge = Date.now() - data.timestamp;
                if (sessionAge < 24 * 60 * 60 * 1000) {
                    return true;
                } else {
                    // Session expirée
                    this.logout();
                    return false;
                }
            } catch (e) {
                console.error('Erreur lors de la lecture des données d\'auth:', e);
                return false;
            }
        }
        return false;
    }

    protectCurrentPage() {
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop();
        
        // Pages protégées qui nécessitent une authentification
        const protectedPages = ['index.html', 'urgences.html', 'stocks.html', 'reservations.html', 'demandes.html', 'profil.html'];
        
        // Pages publiques accessibles sans authentification
        const publicPages = ['auth.html', 'register-success.html'];
        
        if (protectedPages.includes(fileName) && !this.isAuthenticated) {
            // Rediriger vers la page de connexion
            this.redirectToLogin();
            return false;
        }
        
        if (publicPages.includes(fileName) && this.isAuthenticated) {
            // Si déjà connecté et sur une page publique, rediriger vers le dashboard
            this.redirectToDashboard();
            return false;
        }
        
        return true;
    }

    login(email, hospitalName = 'Hôpital Principal de Dakar') {
        const authData = {
            email: email,
            hospitalName: hospitalName,
            timestamp: Date.now(),
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('bloodlink_auth', JSON.stringify(authData));
        localStorage.setItem('bloodlink_user', JSON.stringify({
            email: email,
            hospitalName: hospitalName,
            role: 'hospital_admin'
        }));
        
        this.isAuthenticated = true;
        
        // Mettre à jour les informations dans l'interface si on est sur une page protégée
        this.updateUserInfo();
        
        return true;
    }

    logout() {
        localStorage.removeItem('bloodlink_auth');
        localStorage.removeItem('bloodlink_user');
        sessionStorage.removeItem('lastPage');
        
        this.isAuthenticated = false;
        
        // Rediriger vers la page de connexion
        this.redirectToLogin();
    }

    redirectToLogin() {
        const currentUrl = window.location.href;
        const loginUrl = 'auth.html';
        
        // Sauvegarder l'URL demandée pour rediriger après connexion
        if (currentUrl !== window.location.origin + '/' + loginUrl) {
            sessionStorage.setItem('redirectAfterLogin', currentUrl);
        }
        
        window.location.href = loginUrl;
    }

    redirectToDashboard() {
        window.location.href = 'index.html';
    }

    updateUserInfo() {
        // Mettre à jour les informations utilisateur dans l'interface
        const userData = this.getUserData();
        if (userData) {
            // Mettre à jour le nom de l'hôpital
            const hospitalNameElement = document.getElementById('currentHospital');
            if (hospitalNameElement) {
                hospitalNameElement.textContent = userData.hospitalName;
            }
            
            // Mettre à jour le profil utilisateur
            const profileNameElement = document.querySelector('.profile-name');
            if (profileNameElement) {
                profileNameElement.textContent = userData.email.split('@')[0];
            }
        }
    }

    getUserData() {
        const userData = localStorage.getItem('bloodlink_user');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (e) {
                console.error('Erreur lors de la lecture des données utilisateur:', e);
                return null;
            }
        }
        return null;
    }

    // Vérifier si l'utilisateur a accès à une fonctionnalité spécifique
    hasPermission(permission) {
        const userData = this.getUserData();
        if (!userData) return false;
        
        // Pour l'instant, tous les admins hôpitaux ont toutes les permissions
        return userData.role === 'hospital_admin';
    }

    // Rafraîchir la session
    refreshSession() {
        if (this.isAuthenticated) {
            const authData = localStorage.getItem('bloodlink_auth');
            if (authData) {
                try {
                    const data = JSON.parse(authData);
                    data.timestamp = Date.now();
                    localStorage.setItem('bloodlink_auth', JSON.stringify(data));
                } catch (e) {
                    console.error('Erreur lors du rafraîchissement de la session:', e);
                }
            }
        }
    }
}

// Initialiser le guard
const authGuard = new AuthGuard();

// Fonctions globales pour faciliter l'utilisation
window.requireAuth = () => {
    if (!authGuard.isAuthenticated) {
        authGuard.redirectToLogin();
        return false;
    }
    return true;
};

window.logout = () => {
    authGuard.logout();
};

window.getCurrentUser = () => {
    return authGuard.getUserData();
};

window.hasPermission = (permission) => {
    return authGuard.hasPermission(permission);
};

// Rafraîchir la session toutes les 30 minutes
setInterval(() => {
    authGuard.refreshSession();
}, 30 * 60 * 1000);

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthGuard;
}
