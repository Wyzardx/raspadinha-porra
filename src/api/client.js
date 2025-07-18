import { API_CONFIG, MOCK_RESPONSES } from './config.js';

// Clase principal para manejar las llamadas a la API
export class ApiClient {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
        this.token = this.getStoredToken();
        this.mockMode = false; // Cambiar a true para usar datos mock
    }
    
    // Obtener token almacenado
    getStoredToken() {
        try {
            return localStorage.getItem('auth_token');
        } catch (error) {
            return null;
        }
    }
    
    // Configurar token de autenticación
    setToken(token) {
        this.token = token;
        try {
            if (token) {
                localStorage.setItem('auth_token', token);
            } else {
                localStorage.removeItem('auth_token');
            }
        } catch (error) {
            console.warn('No se pudo guardar el token en localStorage');
        }
    }
    
    // Obtener headers con autenticación
    getHeaders() {
        const headers = { ...API_CONFIG.DEFAULT_HEADERS };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }
    
    // Método genérico para hacer peticiones
    async request(endpoint, options = {}) {
        // Si está en modo mock, devolver datos simulados
        if (this.mockMode) {
            return this.getMockResponse(endpoint, options);
        }
        
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };
        
        try {
            const response = await fetch(url, config);
            
            // Manejar respuestas no-JSON (como redirects)
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return { success: true, status: response.status };
            }
            
            const data = await response.json();
            
            if (!response.ok) {
                const error = new Error(data.message || 'Error en la petición');
                error.response = { data, status: response.status };
                throw error;
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            
            // Si es un error de red, intentar con datos mock como fallback
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                console.warn('Error de red, usando datos mock como fallback');
                return this.getMockResponse(endpoint, options);
            }
            
            throw error;
        }
    }
    
    // Obtener respuesta mock basada en el endpoint
    getMockResponse(endpoint, options) {
        return new Promise((resolve) => {
            setTimeout(() => {
                switch (endpoint) {
                    case API_CONFIG.ENDPOINTS.CORE:
                        resolve(MOCK_RESPONSES.CORE_SETTINGS);
                        break;
                    case API_CONFIG.ENDPOINTS.LOGIN:
                        resolve({
                            message: "Login realizado com sucesso.",
                            user: {
                                id: 1,
                                username: "usuario_demo",
                                email: "demo@raspadinha.com",
                                phone: "11999999999",
                                document: "12345678901",
                                balance: 100.50,
                                is_admin: false,
                                stat: {
                                    deposit_sum: 200.00,
                                    withdraw_sum: 99.50
                                }
                            },
                            token: "demo_token_123"
                        });
                        break;
                    case API_CONFIG.ENDPOINTS.GAMES_TYPES:
                        resolve([
                            {
                                id: 'dinheiro',
                                name: 'Raspadinha Dinheiro',
                                description: 'Ganhe dinheiro real raspando!',
                                min_bet: 1.00,
                                max_bet: 100.00,
                                win_chance: 0.3,
                                multipliers: [1.5, 2, 3, 5, 10],
                                image: '/assets/scratch.png',
                                active: true
                            },
                            {
                                id: 'eletronicos',
                                name: 'Eletrônicos',
                                description: 'Ganhe smartphones, tablets e mais!',
                                min_bet: 5.00,
                                max_bet: 50.00,
                                win_chance: 0.25,
                                multipliers: [2, 3, 5, 8],
                                image: '/assets/scratch.png',
                                active: true
                            }
                        ]);
                        break;
                    default:
                        resolve({ message: 'Mock response', data: [] });
                }
            }, 100); // Simular latencia de red
        });
    }
    
    // Métodos de autenticación
    async login(email, password) {
        const data = await this.request(API_CONFIG.ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (data.token) {
            this.setToken(data.token);
        }
        
        return data;
    }
    
    async register(userData) {
        return await this.request(API_CONFIG.ENDPOINTS.REGISTER, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }
    
    // Métodos de usuario
    async getUser() {
        return await this.request(API_CONFIG.ENDPOINTS.USER);
    }
    
    async updateUser(userData) {
        return await this.request(API_CONFIG.ENDPOINTS.USER, {
            method: 'PATCH',
            body: JSON.stringify(userData)
        });
    }
    
    async getUserProfile() {
        return await this.request(API_CONFIG.ENDPOINTS.USER_PROFILE);
    }
    
    // Métodos de pagos
    async createDeposit(amount) {
        return await this.request(API_CONFIG.ENDPOINTS.DEPOSIT, {
            method: 'POST',
            body: JSON.stringify({ amount })
        });
    }
    
    async createWithdraw(amount, pixKey) {
        return await this.request(API_CONFIG.ENDPOINTS.WITHDRAW, {
            method: 'POST',
            body: JSON.stringify({ amount, pix_key: pixKey })
        });
    }
    
    // Métodos de transacciones
    async getTransactions() {
        return await this.request(API_CONFIG.ENDPOINTS.TRANSACTIONS);
    }
    
    // Métodos de juegos
    async playGame(gameType, betAmount) {
        return await this.request(API_CONFIG.ENDPOINTS.GAMES_PLAY, {
            method: 'POST',
            body: JSON.stringify({ game_type: gameType, bet_amount: betAmount })
        });
    }
    
    async getGameHistory() {
        return await this.request(API_CONFIG.ENDPOINTS.GAMES_HISTORY);
    }
    
    async getGameTypes() {
        return await this.request(API_CONFIG.ENDPOINTS.GAMES_TYPES);
    }
    
    // Métodos de entregas
    async getDeliveries() {
        return await this.request(API_CONFIG.ENDPOINTS.DELIVERIES);
    }
    
    // Método para obtener configuraciones del core
    async fetchSettings() {
        return await this.request(API_CONFIG.ENDPOINTS.CORE);
    }
    
    // Métodos de admin
    async getAdminDashboard() {
        return await this.request(API_CONFIG.ENDPOINTS.ADMIN_DASHBOARD);
    }
    
    async getAdminUsers() {
        return await this.request(API_CONFIG.ENDPOINTS.ADMIN_USERS);
    }
    
    async getAdminTransactions() {
        return await this.request(API_CONFIG.ENDPOINTS.ADMIN_TRANSACTIONS);
    }
    
    // Método para logout
    logout() {
        this.setToken(null);
        // Limpiar cualquier otro dato de sesión
        try {
            localStorage.removeItem('user_data');
        } catch (error) {
            console.warn('No se pudo limpiar localStorage');
        }
    }
    
    // Método para verificar si el usuario está autenticado
    isAuthenticated() {
        return !!this.token;
    }
    
    // Método para habilitar/deshabilitar modo mock
    setMockMode(enabled) {
        this.mockMode = enabled;
    }
}

// Instancia global del cliente API
export const apiClient = new ApiClient();

// Exportar por defecto
export default apiClient;