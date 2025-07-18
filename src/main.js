import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Importar stores
import authStore from './stores/auth.js';
import appStore from './stores/app.js';
import gamesStore from './stores/games.js';
import transactionsStore from './stores/transactions.js';

// Importar utilidades
import formatters from './utils/formatters.js';
import validators from './utils/validators.js';

// Importar cliente API
import { apiClient } from './api/client.js';

// Crear la aplicación
const app = createApp(App);

// Configurar router
app.use(router);

// Proporcionar stores globalmente
app.provide('authStore', authStore);
app.provide('appStore', appStore);
app.provide('gamesStore', gamesStore);
app.provide('transactionsStore', transactionsStore);

// Proporcionar utilidades globalmente
app.provide('formatters', formatters);
app.provide('validators', validators);
app.provide('apiClient', apiClient);

// Propiedades globales
app.config.globalProperties.$formatters = formatters;
app.config.globalProperties.$validators = validators;
app.config.globalProperties.$apiClient = apiClient;

// Inicializar aplicación
async function initApp() {
    try {
        // Inicializar configuración de la app
        await appStore.init();
        
        // Si hay token, intentar refrescar datos del usuario
        if (authStore.isAuthenticated) {
            try {
                await authStore.refreshUser();
            } catch (error) {
                console.warn('Error al refrescar usuario:', error);
                // Si hay error de autenticación, hacer logout
                if (error.response?.status === 401) {
                    authStore.logout();
                }
            }
        }
    } catch (error) {
        console.error('Error al inicializar aplicación:', error);
    } finally {
        // Montar la aplicación
        app.mount('#app');
    }
}

// Inicializar
initApp();

// Manejar errores globales
app.config.errorHandler = (error, instance, info) => {
    console.error('Error global de Vue:', error, info);
    
    // Aquí podrías enviar el error a un servicio de logging
    // logError(error, { instance, info });
};

// Manejar errores de promesas no capturadas
window.addEventListener('unhandledrejection', event => {
    console.error('Promesa rechazada no manejada:', event.reason);
    
    // Prevenir que el error aparezca en la consola del navegador
    event.preventDefault();
});

export default app;