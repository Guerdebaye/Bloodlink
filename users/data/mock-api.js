// Comprehensive mock data for all pages
class MockData {
    static getDashboardData() {
        return {
            user: {
                id: 1,
                name: 'Jean Dupont',
                email: 'jean.dupont@email.com',
                bloodType: 'O+',
                avatar: null,
                phone: '+33 6 12 34 56 78',
                address: '123 Avenue de Paris, 75001 Paris',
                totalDonations: 12,
                livesSaved: 36,
                points: 1250,
                level: 'gold',
                nextDonation: '2024-03-15',
                joinDate: '2023-01-15'
            },
            stats: {
                responseTime: '18min',
                alertsResponded: 8,
                completionRate: '98%',
                communityRank: 'Top 5%'
            },
            recentAlerts: [
                {
                    id: 1,
                    hospital: 'Hôpital Européen Georges-Pompidou',
                    bloodType: 'O-',
                    quantity: 2,
                    urgent: true,
                    distance: '1.2 km',
                    duration: '2 min',
                    timestamp: '2 min'
                },
                {
                    id: 2,
                    hospital: 'Hôpital Saint-Louis',
                    bloodType: 'A+',
                    quantity: 3,
                    urgent: false,
                    distance: '2.3 km',
                    duration: '15 min',
                    timestamp: '15 min'
                }
            ],
            donationHistory: [
                {
                    id: 1,
                    hospital: 'Hôpital Saint-Louis',
                    date: '2024-02-15',
                    bloodType: 'O+',
                    quantity: 1,
                    status: 'completed',
                    points: 100
                },
                {
                    id: 2,
                    hospital: 'Hôpital Necker',
                    date: '2024-01-28',
                    bloodType: 'O+',
                    quantity: 1,
                    status: 'completed',
                    points: 100
                }
            ],
            badges: [
                {
                    id: 1,
                    name: 'Premier Don',
                    description: 'Effectuez votre premier don de sang',
                    icon: 'fas fa-star',
                    earned: true,
                    progress: 100,
                    points: 50
                },
                {
                    id: 2,
                    name: 'Héros du Sang',
                    description: '10 dons effectués',
                    icon: 'fas fa-trophy',
                    earned: true,
                    progress: 100,
                    points: 200
                },
                {
                    id: 3,
                    name: 'Sauveur d\'Urgence',
                    description: 'Répondez à 5 alertes urgentes',
                    icon: 'fas fa-bolt',
                    earned: false,
                    progress: 60,
                    points: 150
                }
            ]
        };
    }

    static getAdminData() {
        return {
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
                    type: 'donor',
                    bloodType: 'O+',
                    donations: 12,
                    status: 'active',
                    joinDate: '2023-01-15'
                },
                {
                    id: 2,
                    name: 'Marie Martin',
                    type: 'donor',
                    bloodType: 'A-',
                    donations: 8,
                    status: 'active',
                    joinDate: '2023-03-20'
                },
                {
                    id: 3,
                    name: 'Hôpital Saint-Louis',
                    type: 'hospital',
                    bloodType: null,
                    donations: 245,
                    status: 'verified',
                    joinDate: '2023-01-10'
                }
            ],
            analytics: {
                totalDonations: 15247,
                activeDonors: 2847,
                connectedHospitals: 156,
                monthlyGrowth: '12%',
                regionalDistribution: {
                    'Île-de-France': 65,
                    'Auvergne-Rhône-Alpes': 45,
                    'Provence-Alpes-Côte d\'Azur': 38,
                    'Nouvelle-Aquitaine': 32
                }
            }
        };
    }

    static getEmergencyData() {
        return {
            emergency: {
                id: 1,
                hospital: 'Hôpital Necker - Enfants Malades',
                bloodType: 'O-',
                quantity: 3,
                urgency: 'critical',
                reason: 'Enfant 5 ans - Intervention chirurgicale urgente',
                distance: '0.8 km',
                contact: 'Dr. Martin - 01 44 49 49 49',
                coordinates: { lat: 48.8462, lng: 2.3159 }
            },
            steps: [
                'Confirmez votre disponibilité immédiate',
                'Préparez votre pièce d\'identité',
                'Direction l\'hôpital indiqué',
                'Accueil prioritaire au service transfusion'
            ],
            requirements: [
                'Être en bonne santé',
                'Peser plus de 50kg',
                'Avoir entre 18 et 70 ans',
                'Aucun don dans les 8 dernières semaines'
            ]
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockData;
}