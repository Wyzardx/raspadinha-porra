import { reactive } from 'vue';
import { apiClient } from '../api/client.js';

// Store principal de la aplicación
export const appStore = reactive({
    settings: null,
    loading: false,
    error: null,
    initialized: false,
    
    // Acciones
    async fetchSettings() {
        try {
            appStore.loading = true;
            appStore.error = null;
            
            const settings = await apiClient.fetchSettings();
            appStore.settings = settings;
            
            return settings;
        } catch (error) {
            appStore.error = error.message || 'Error al cargar configuración';
            console.error('Error fetching settings:', error);
            
            // Usar configuración por defecto en caso de error
            appStore.settings = {
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
                currency_symbol: 'R$'
            };
            
            throw error;
        } finally {
            appStore.loading = false;
        }
    },
    
    async init() {
        if (appStore.initialized) return;
        
        try {
            await appStore.fetchSettings();
            appStore.initialized = true;
        } catch (error) {
            console.warn('Error al inicializar app store, usando configuración por defecto');
            appStore.initialized = true;
        }
    },
    
    // Getters
    getAppName() {
        return appStore.settings?.app_name || 'Raspadinha';
    },
    
    getCurrency() {
        return appStore.settings?.currency || 'BRL';
    },
    
    getCurrencySymbol() {
        return appStore.settings?.currency_symbol || 'R$';
    },
    
    isMaintenanceMode() {
        return appStore.settings?.maintenance_mode || false;
    },
    
    areGamesEnabled() {
        return appStore.settings?.games_enabled !== false;
    },
    
    isRegistrationEnabled() {
        return appStore.settings?.registration_enabled !== false;
    },
    
    getDepositLimits() {
        return {
            min: appStore.settings?.min_deposit || 10.00,
            max: appStore.settings?.max_deposit || 5000.00
        };
    },
    
    getWithdrawLimits() {
        return {
            min: appStore.settings?.min_withdraw || 20.00,
            max: appStore.settings?.max_withdraw || 10000.00
        };
    },
    
    // Limpiar errores
    clearError() {
        appStore.error = null;
    }
});

export default appStore;