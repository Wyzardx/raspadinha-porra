import { reactive } from 'vue';
import { apiClient } from '../api/client.js';

// Store de transacciones
export const transactionsStore = reactive({
    transactions: [],
    loading: false,
    error: null,
    
    // Acciones
    async fetchTransactions() {
        try {
            transactionsStore.loading = true;
            transactionsStore.error = null;
            
            const transactions = await apiClient.getTransactions();
            transactionsStore.transactions = transactions || [];
            
            return transactions;
        } catch (error) {
            transactionsStore.error = error.message || 'Error al cargar transacciones';
            console.error('Error fetching transactions:', error);
            throw error;
        } finally {
            transactionsStore.loading = false;
        }
    },
    
    async createDeposit(amount) {
        try {
            transactionsStore.loading = true;
            transactionsStore.error = null;
            
            const result = await apiClient.createDeposit(amount);
            
            // Agregar transacción pendiente al store local
            if (result) {
                const newTransaction = {
                    id: result.id || Date.now(),
                    type: 'deposit',
                    amount: amount,
                    status: 'pending',
                    payment_method: 'pix',
                    created_at: new Date().toISOString(),
                    external_id: result.id
                };
                
                transactionsStore.transactions.unshift(newTransaction);
            }
            
            return result;
        } catch (error) {
            transactionsStore.error = error.message || 'Error al crear depósito';
            console.error('Error creating deposit:', error);
            throw error;
        } finally {
            transactionsStore.loading = false;
        }
    },
    
    async createWithdraw(amount, pixKey) {
        try {
            transactionsStore.loading = true;
            transactionsStore.error = null;
            
            const result = await apiClient.createWithdraw(amount, pixKey);
            
            // Agregar transacción pendiente al store local
            if (result) {
                const newTransaction = {
                    id: result.transaction_id || Date.now(),
                    type: 'withdraw',
                    amount: amount,
                    status: 'pending',
                    payment_method: 'pix',
                    created_at: new Date().toISOString(),
                    pix_key: pixKey
                };
                
                transactionsStore.transactions.unshift(newTransaction);
            }
            
            return result;
        } catch (error) {
            transactionsStore.error = error.message || 'Error al crear saque';
            console.error('Error creating withdraw:', error);
            throw error;
        } finally {
            transactionsStore.loading = false;
        }
    },
    
    // Obtener transacciones por tipo
    getTransactionsByType(type) {
        return transactionsStore.transactions.filter(t => t.type === type);
    },
    
    // Obtener transacciones por estado
    getTransactionsByStatus(status) {
        return transactionsStore.transactions.filter(t => t.status === status);
    },
    
    // Limpiar errores
    clearError() {
        transactionsStore.error = null;
    }
});

export default transactionsStore;