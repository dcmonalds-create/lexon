export const LEXON_WALLET_ADDRESS = import.meta.env.VITE_LEXON_WALLET_ADDRESS || '';
export const TON_AMOUNT = '1000000000'; // 1 TON in nanotons

export function encodeComment(text: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  const buffer = new Uint8Array(bytes);
  let binary = '';
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
}
