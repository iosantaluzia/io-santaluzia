/**
 * Utilitários para formatação de moeda brasileira (R$)
 */

/**
 * Remove todos os caracteres não numéricos de uma string
 */
export function removeNonNumeric(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Converte um valor numérico (em centavos) para formato de moeda brasileira
 * Exemplo: 123456 -> "1.234,56"
 */
export function formatCurrencyFromCents(cents: number): string {
  const value = cents / 100;
  return formatCurrency(value);
}

/**
 * Formata um valor numérico para moeda brasileira
 * Exemplo: 1234.56 -> "1.234,56"
 */
export function formatCurrency(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  
  if (isNaN(numValue)) {
    return '0,00';
  }

  return numValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Converte uma string formatada (ex: "1.234,56") para número
 * Exemplo: "1.234,56" -> 1234.56
 */
export function parseCurrency(value: string): number {
  if (!value) return 0;
  
  // Remove pontos (separadores de milhar) e substitui vírgula por ponto
  const cleaned = value.replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formata o valor enquanto o usuário digita
 * Aceita apenas números e formata automaticamente
 * Exemplo: "1234" -> "12,34" -> "1.234,56"
 */
export function formatCurrencyInput(value: string): string {
  // Remove tudo que não é número
  const numbers = removeNonNumeric(value);
  
  if (!numbers || numbers === '0') {
    return '';
  }

  // Converte para número (em centavos)
  const cents = parseInt(numbers, 10);
  
  if (isNaN(cents)) {
    return '';
  }

  // Converte centavos para valor decimal
  const decimalValue = cents / 100;
  
  // Formata com 2 casas decimais
  return formatCurrency(decimalValue);
}

/**
 * Obtém o valor numérico de uma string formatada para salvar no banco
 */
export function getNumericValue(formattedValue: string): number {
  if (!formattedValue) return 0;
  return parseCurrency(formattedValue);
}

