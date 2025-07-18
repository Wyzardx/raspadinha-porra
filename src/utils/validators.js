// Utilidades para validación de datos

// Validar email
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validar CPF
export function isValidCPF(cpf) {
    if (!cpf) return false;
    
    // Remover caracteres não numéricos
    const cleaned = cpf.replace(/\D/g, '');
    
    // Verificar se tem 11 dígitos
    if (cleaned.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleaned)) return false;
    
    // Validar dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.charAt(10))) return false;
    
    return true;
}

// Validar CNPJ
export function isValidCNPJ(cnpj) {
    if (!cnpj) return false;
    
    // Remover caracteres não numéricos
    const cleaned = cnpj.replace(/\D/g, '');
    
    // Verificar se tem 14 dígitos
    if (cleaned.length !== 14) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cleaned)) return false;
    
    // Validar primeiro dígito verificador
    let sum = 0;
    let weight = 2;
    
    for (let i = 11; i >= 0; i--) {
        sum += parseInt(cleaned.charAt(i)) * weight;
        weight = weight === 9 ? 2 : weight + 1;
    }
    
    let remainder = sum % 11;
    const firstDigit = remainder < 2 ? 0 : 11 - remainder;
    
    if (firstDigit !== parseInt(cleaned.charAt(12))) return false;
    
    // Validar segundo dígito verificador
    sum = 0;
    weight = 2;
    
    for (let i = 12; i >= 0; i--) {
        sum += parseInt(cleaned.charAt(i)) * weight;
        weight = weight === 9 ? 2 : weight + 1;
    }
    
    remainder = sum % 11;
    const secondDigit = remainder < 2 ? 0 : 11 - remainder;
    
    if (secondDigit !== parseInt(cleaned.charAt(13))) return false;
    
    return true;
}

// Validar telefone brasileiro
export function isValidPhone(phone) {
    if (!phone) return false;
    
    const cleaned = phone.replace(/\D/g, '');
    
    // Deve ter 10 ou 11 dígitos (com DDD)
    if (cleaned.length < 10 || cleaned.length > 11) return false;
    
    // Verificar se o DDD é válido (11-99)
    const ddd = parseInt(cleaned.substring(0, 2));
    if (ddd < 11 || ddd > 99) return false;
    
    // Se tem 11 dígitos, o terceiro deve ser 9 (celular)
    if (cleaned.length === 11 && cleaned.charAt(2) !== '9') return false;
    
    return true;
}

// Validar senha
export function isValidPassword(password, minLength = 6) {
    if (!password) return false;
    
    return password.length >= minLength;
}

// Validar senha forte
export function isStrongPassword(password) {
    if (!password || password.length < 8) return false;
    
    // Deve ter pelo menos uma letra minúscula, uma maiúscula, um número e um caractere especial
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return hasLowerCase && hasUpperCase && hasNumbers && hasSpecialChar;
}

// Validar valor monetário
export function isValidAmount(amount, min = 0, max = Infinity) {
    if (typeof amount === 'string') {
        amount = parseFloat(amount);
    }
    
    if (isNaN(amount)) return false;
    
    return amount >= min && amount <= max;
}

// Validar chave PIX
export function isValidPixKey(pixKey) {
    if (!pixKey) return false;
    
    const cleaned = pixKey.trim();
    
    // CPF
    if (/^\d{11}$/.test(cleaned.replace(/\D/g, ''))) {
        return isValidCPF(cleaned);
    }
    
    // CNPJ
    if (/^\d{14}$/.test(cleaned.replace(/\D/g, ''))) {
        return isValidCNPJ(cleaned);
    }
    
    // Email
    if (cleaned.includes('@')) {
        return isValidEmail(cleaned);
    }
    
    // Telefone
    if (/^\+?\d{10,15}$/.test(cleaned.replace(/\D/g, ''))) {
        return isValidPhone(cleaned);
    }
    
    // Chave aleatória (UUID)
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleaned)) {
        return true;
    }
    
    return false;
}

// Validar username
export function isValidUsername(username) {
    if (!username) return false;
    
    // Entre 3 e 30 caracteres, apenas letras, números, _ e -
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    return usernameRegex.test(username);
}

// Limpar documento (remover formatação)
export function cleanDocument(document) {
    if (!document) return '';
    return document.replace(/\D/g, '');
}

// Limpar telefone (remover formatação)
export function cleanPhone(phone) {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
}

export default {
    isValidEmail,
    isValidCPF,
    isValidCNPJ,
    isValidPhone,
    isValidPassword,
    isStrongPassword,
    isValidAmount,
    isValidPixKey,
    isValidUsername,
    cleanDocument,
    cleanPhone
};