// Utilidades para formatear datos

// Formatear moneda
export function formatCurrency(amount, currency = 'BRL') {
    if (typeof amount !== 'number') {
        amount = parseFloat(amount) || 0;
    }
    
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Formatear número
export function formatNumber(number, decimals = 2) {
    if (typeof number !== 'number') {
        number = parseFloat(number) || 0;
    }
    
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
}

// Formatear fecha
export function formatDate(date, options = {}) {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return new Intl.DateTimeFormat('pt-BR', { ...defaultOptions, ...options }).format(dateObj);
}

// Formatear fecha relativa (hace X tiempo)
export function formatRelativeDate(date) {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Agora mesmo';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} dia${days > 1 ? 's' : ''} atrás`;
    } else {
        return formatDate(dateObj, { year: 'numeric', month: 'short', day: 'numeric' });
    }
}

// Formatear status de transacción
export function formatTransactionStatus(status) {
    const statusMap = {
        'pending': 'Pendente',
        'completed': 'Concluída',
        'failed': 'Falhou',
        'cancelled': 'Cancelada'
    };
    
    return statusMap[status] || status;
}

// Formatear tipo de transacción
export function formatTransactionType(type) {
    const typeMap = {
        'deposit': 'Depósito',
        'withdraw': 'Saque'
    };
    
    return typeMap[type] || type;
}

// Formatear método de pago
export function formatPaymentMethod(method) {
    const methodMap = {
        'pix': 'PIX',
        'credit_card': 'Cartão de Crédito',
        'debit_card': 'Cartão de Débito',
        'bank_transfer': 'Transferência Bancária'
    };
    
    return methodMap[method] || method;
}

// Formatear CPF
export function formatCPF(cpf) {
    if (!cpf) return '';
    
    const cleaned = cpf.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    return cpf;
}

// Formatear CNPJ
export function formatCNPJ(cnpj) {
    if (!cnpj) return '';
    
    const cleaned = cnpj.replace(/\D/g, '');
    
    if (cleaned.length === 14) {
        return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    
    return cnpj;
}

// Formatear telefone
export function formatPhone(phone) {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
}

// Truncar texto
export function truncateText(text, maxLength = 50) {
    if (!text || text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
}

// Capitalizar primera letra
export function capitalize(text) {
    if (!text) return '';
    
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Formatear porcentaje
export function formatPercentage(value, decimals = 1) {
    if (typeof value !== 'number') {
        value = parseFloat(value) || 0;
    }
    
    return `${(value * 100).toFixed(decimals)}%`;
}

export default {
    formatCurrency,
    formatNumber,
    formatDate,
    formatRelativeDate,
    formatTransactionStatus,
    formatTransactionType,
    formatPaymentMethod,
    formatCPF,
    formatCNPJ,
    formatPhone,
    truncateText,
    capitalize,
    formatPercentage
};