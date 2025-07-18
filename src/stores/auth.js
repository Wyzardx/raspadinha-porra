import { reactive, computed } from 'vue';
import { apiClient } from '../api/client.js';

// Store de autenticación
export const authStore = reactive({
    user: null,
    token: null,
    loading: false,
    error: null,
    
    // Estado computado
    isAuthenticated: computed(() => !!authStore.user && !!authStore.token),
    isAdmin: computed(() => authStore.user?.is_admin || false),
    
    // Acciones
    async login(email, password) {
        try {
            authStore.loading = true;
            authStore.error = null;
            
            const response = await apiClient.login(email, password);
            
            if (response.user && response.token) {
                authStore.user = response.user;
                authStore.token = response.token;
                
                // Guardar en localStorage
                try {
                    localStorage.setItem('user_data', JSON.stringify(response.user));
                } catch (error) {
                    console.warn('No se pudo guardar datos de usuario');
                }
                
                return response;
            } else {
                throw new Error('Respuesta de login inválida');
            }
        } catch (error) {
            authStore.error = error.message || 'Error al iniciar sesión';
            throw error;
        } finally {
            authStore.loading = false;
        }
    },
    
    async register(userData) {
        try {
            authStore.loading = true;
            authStore.error = null;
            
            const response = await apiClient.register(userData);
            
            if (response.user && response.token) {
                authStore.user = response.user;
                authStore.token = response.token;
                
                // Guardar en localStorage
                try {
                    localStorage.setItem('user_data', JSON.stringify(response.user));
                } catch (error) {
                    console.warn('No se pudo guardar datos de usuario');
                }
                
                return response;
            } else {
                throw new Error('Respuesta de registro inválida');
            }
        } catch (error) {
            authStore.error = error.message || 'Error al registrarse';
            throw error;
        } finally {
            authStore.loading = false;
        }
    },
    
    async updateUser(userData) {
        try {
            authStore.loading = true;
            authStore.error = null;
            
            await apiClient.updateUser(userData);
            
            // Actualizar datos locales
            if (authStore.user) {
                Object.assign(authStore.user, userData);
                
                // Actualizar localStorage
                try {
                    localStorage.setItem('user_data', JSON.stringify(authStore.user));
                } catch (error) {
                    console.warn('No se pudo actualizar datos de usuario');
                }
            }
        } catch (error) {
            authStore.error = error.message || 'Error al actualizar usuario';
            throw error;
        } finally {
            authStore.loading = false;
        }
    },
    
    async refreshUser() {
        try {
            if (!authStore.isAuthenticated) return;
            
            const userData = await apiClient.getUser();
            if (userData.user) {
                authStore.user = userData.user;
                
                // Actualizar localStorage
                try {
                    localStorage.setItem('user_data', JSON.stringify(userData.user));
                } catch (error) {
                    console.warn('No se pudo actualizar datos de usuario');
                }
            }
        } catch (error) {
            console.error('Error al refrescar datos de usuario:', error);
            // Si hay error de autenticación, hacer logout
            if (error.response?.status === 401) {
                authStore.logout();
            }
        }
    },
    
    logout() {
        authStore.user = null;
        authStore.token = null;
        authStore.error = null;
        
        // Limpiar API client
        apiClient.logout();
        
        // Limpiar localStorage
        try {
            localStorage.removeItem('user_data');
        } catch (error) {
            console.warn('No se pudo limpiar localStorage');
        }
    },
    
    // Inicializar desde localStorage
    init() {
        try {
            const storedUser = localStorage.getItem('user_data');
            const storedToken = localStorage.getItem('auth_token');
            
            if (storedUser && storedToken) {
                authStore.user = JSON.parse(storedUser);
                authStore.token = storedToken;
            }
        } catch (error) {
            console.warn('Error al inicializar auth store:', error);
            // Limpiar datos corruptos
            authStore.logout();
        }
    }
});

// Inicializar el store
authStore.init();

export default authStore;