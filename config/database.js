// Archivo de configuración legacy - mantenido para compatibilidad
// La nueva configuración está en src/api/config.js y src/api/client.js

console.warn('database.js está deprecated. Usar src/api/client.js en su lugar.');

// Redireccionar a la nueva API si está disponible
if (window.location.pathname.includes('/api/')) {
    console.log('Redirigiendo a nueva estructura de API...');
}