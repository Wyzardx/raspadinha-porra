// Configuración de la API local
export const API_CONFIG = {
    // URL base local
    BASE_URL: '/api',
    
    // Endpoints de la API
    ENDPOINTS: {
        // Autenticación
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        
        // Core/Configuración
        CORE: '/core',
        
        // Usuario
        USER: '/user',
        USER_PROFILE: '/user/profile',
        
        // Pagos
        DEPOSIT: '/payments/deposit',
        WITHDRAW: '/payments/withdraw',
        
        // Transacciones
        TRANSACTIONS: '/transactions',
        
        // Juegos
        GAMES_PLAY: '/games/play',
        GAMES_HISTORY: '/games/history',
        GAMES_TYPES: '/games/types',
        
        // Entregas
        DELIVERIES: '/deliveries',
        
        // Admin
        ADMIN_DASHBOARD: '/admin/dashboard',
        ADMIN_USERS: '/admin/users',
        ADMIN_TRANSACTIONS: '/admin/transactions',
        
        // Webhooks
        WEBHOOK_NITRO: '/webhooks/nitro'
    },
    
    // Headers por defecto
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    // Configuración de Nitro Pagamentos
    NITRO: {
        API_TOKEN: 'AJTQzn8xWuYXrjNu5XWajspWi8i6sd9XzkgEViaDpkIrwyKRKCkC1fHCFY1P',
        OFFER_HASH: 'ydpamubeay',
        PRODUCT_HASH: '8cru5klgqv',
        ENDPOINT: 'https://api.nitropagamentos.com/api/public/v1/transactions'
    }
};

// Configuración de respuestas mock para desarrollo
export const MOCK_RESPONSES = {
    // Configuración del sistema
    CORE_SETTINGS: {
        app_name: 'Raspadinha',
        app_version: '1.0.0',
        maintenance_mode: false,
        min_deposit: 10.00,
        max_deposit: 5000.00,
        min_withdraw: 20.00,
        max_withdraw: 10000.00,
        pix_enabled: true,
        games_enabled: true,
        registration_enabled: true,
        currency: 'BRL',
        currency_symbol: 'R$',
        nitro_config: {
            enabled: true,
            offer_hash: 'ydpamubeay',
            product_hash: '8cru5klgqv'
        },
        game_types: {
            'dinheiro': {
                name: 'Raspadinha Dinheiro',
                min_bet: 1.00,
                max_bet: 100.00,
                win_chance: 0.3,
                multipliers: [1.5, 2, 3, 5, 10]
            },
            'eletronicos': {
                name: 'Eletrônicos',
                min_bet: 5.00,
                max_bet: 50.00,
                win_chance: 0.25,
                multipliers: [2, 3, 5, 8]
            },
            'eletrodomesticos': {
                name: 'Eletrodomésticos',
                min_bet: 10.00,
                max_bet: 200.00,
                win_chance: 0.2,
                multipliers: [3, 5, 10, 15]
            },
            'camisa-de-futebol': {
                name: 'Camisa de Futebol',
                min_bet: 2.00,
                max_bet: 30.00,
                win_chance: 0.35,
                multipliers: [1.5, 2, 4, 6]
            }
        }
    }
};