export function generateReference(): string {
  return `TXN_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

