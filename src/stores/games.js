import { reactive } from 'vue';
import { apiClient } from '../api/client.js';

// Store de juegos
export const gamesStore = reactive({
    gameTypes: [],
    gameHistory: [],
    currentGame: null,
    loading: false,
    error: null,
    
    // Acciones
    async fetchGameTypes() {
        try {
            gamesStore.loading = true;
            gamesStore.error = null;
            
            const gameTypes = await apiClient.getGameTypes();
            gamesStore.gameTypes = gameTypes || [];
            
            return gameTypes;
        } catch (error) {
            gamesStore.error = error.message || 'Error al cargar tipos de juegos';
            console.error('Error fetching game types:', error);
            throw error;
        } finally {
            gamesStore.loading = false;
        }
    },
    
    async fetchGameHistory() {
        try {
            gamesStore.loading = true;
            gamesStore.error = null;
            
            const history = await apiClient.getGameHistory();
            gamesStore.gameHistory = history || [];
            
            return history;
        } catch (error) {
            gamesStore.error = error.message || 'Error al cargar historial de juegos';
            console.error('Error fetching game history:', error);
            throw error;
        } finally {
            gamesStore.loading = false;
        }
    },
    
    async playGame(gameType, betAmount) {
        try {
            gamesStore.loading = true;
            gamesStore.error = null;
            
            const result = await apiClient.playGame(gameType, betAmount);
            
            // Actualizar juego actual
            gamesStore.currentGame = {
                gameType,
                betAmount,
                result,
                timestamp: new Date()
            };
            
            // Agregar al historial local
            if (result) {
                gamesStore.gameHistory.unshift({
                    id: result.game_id || Date.now(),
                    game_type: gameType,
                    bet_amount: betAmount,
                    win_amount: result.win_amount || 0,
                    is_winner: result.is_winner || false,
                    multiplier: result.multiplier || 0,
                    created_at: new Date().toISOString(),
                    status: 'completed'
                });
            }
            
            return result;
        } catch (error) {
            gamesStore.error = error.message || 'Error al jugar';
            console.error('Error playing game:', error);
            throw error;
        } finally {
            gamesStore.loading = false;
        }
    },
    
    // Obtener tipo de juego por ID
    getGameTypeById(id) {
        return gamesStore.gameTypes.find(type => type.id === id);
    },
    
    // Limpiar juego actual
    clearCurrentGame() {
        gamesStore.currentGame = null;
    },
    
    // Limpiar errores
    clearError() {
        gamesStore.error = null;
    }
});

export default gamesStore;