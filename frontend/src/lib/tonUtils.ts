export const LEXON_WALLET_ADDRESS = import.meta.env.VITE_LEXON_WALLET_ADDRESS || '';
export const TON_AMOUNT = '1000000000'; // 1 TON in nanotons (kept for legacy reference)

// ─── USDT Jetton constants ──────────────────────────────────────────────────
export const USDT_MASTER_ADDRESS = 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs';
export const USDT_AMOUNT = 1_000_000n;       // 1 USDT (6 decimals)
export const JETTON_GAS_AMOUNT = '100000000'; // 0.1 TON gas for the Jetton transfer

/**
 * Get the user's USDT Jetton wallet address via TONApi.
 * Returns the raw address string (0:hex) which TonConnect accepts.
 */
export async function getJettonWalletAddress(userAddress: string): Promise<string> {
  const masterEncoded = encodeURIComponent(USDT_MASTER_ADDRESS);
  const userEncoded = encodeURIComponent(userAddress);
  const res = await fetch(
    `https://tonapi.io/v2/accounts/${userEncoded}/jettons/${masterEncoded}`
  );
  if (!res.ok) {
    throw new Error('No USDT found in your wallet. Please add USDT first.');
  }
  const data = await res.json();
  const addr = data?.wallet_address?.address;
  if (!addr) throw new Error('Could not determine your USDT wallet address.');
  return addr;
}

/**
 * Build a Jetton transfer BOC payload (base64).
 *
 * Jetton transfer body layout:
 *   op             0xf8a7ea5  (32 bits)
 *   query_id       0          (64 bits)
 *   amount         USDT_AMOUNT (coins)
 *   destination    Lexon wallet (address)
 *   response_dest  Lexon wallet (address)
 *   custom_payload false      (1 bit)
 *   forward_ton    1n         (coins — triggers transfer notification)
 *   forward_ref    true       (1 bit — payload is a ref)
 *   ref: text comment cell (op 0x00000000 + session token)
 */
export async function buildJettonTransferPayload(
  destinationAddress: string,
  sessionToken: string
): Promise<string> {
  const { beginCell, Address } = await import('@ton/ton');

  // Comment cell: text-comment op + UTF-8 session token
  const commentCell = beginCell()
    .storeUint(0, 32)
    .storeStringTail(sessionToken)
    .endCell();

  // Jetton transfer body
  const body = beginCell()
    .storeUint(0xf8a7ea5, 32)
    .storeUint(0, 64)
    .storeCoins(USDT_AMOUNT)
    .storeAddress(Address.parse(destinationAddress))
    .storeAddress(Address.parse(destinationAddress))
    .storeBit(false)
    .storeCoins(1n)
    .storeBit(true)
    .storeRef(commentCell)
    .endCell();

  return body.toBoc().toString('base64');
}

/**
 * Encode a text comment as a minimal TON BOC (Bag of Cells).
 *
 * TON text-comment cell layout:
 *   4 bytes: op-code 0x00000000  (marks this as a text comment)
 *   N bytes: UTF-8 text
 *
 * BOC structure (size_bytes=1, off_bytes=1, 1 cell, no index, no CRC32):
 *   4  bytes: magic   b5 ee 9c 72
 *   1  byte:  flags   0x01  (size=1, has_idx=0, has_crc32c=0, has_cache_bits=0)
 *   1  byte:  off_bytes = 1
 *   1  byte:  cells_count = 1
 *   1  byte:  roots_count = 1
 *   1  byte:  absent_count = 0
 *   1  byte:  tot_cells_size = 2 + 4 + len(text)  (d1 + d2 + data)
 *   1  byte:  root_list[0] = 0
 *   2  bytes: cell descriptors d1=0x00, d2=(byteLen*2 for whole bytes)
 *   4  bytes: op-code (zeros)
 *   N  bytes: UTF-8 text
 */
export function encodeComment(text: string): string {
  const textBytes = new TextEncoder().encode(text);

  // ── Cell data: op-code (4 bytes) + text ──────────────────────────────────
  const cellData = new Uint8Array(4 + textBytes.length);
  cellData.set(textBytes, 4); // bytes 0-3 stay 0x00 (text comment op-code)

  // ── Cell descriptors ──────────────────────────────────────────────────────
  const bitCount = cellData.length * 8; // all ASCII → whole bytes, no partial byte
  const d1 = 0x00; // leaf cell: 0 refs, level 0, not exotic, no hashes
  const d2 = bitCount % 8 === 0
    ? (bitCount / 8) * 2          // complete bytes: d2 = byteLen * 2
    : Math.floor(bitCount / 8) * 2 + 1; // partial last byte: +1

  const cellEncoded = new Uint8Array(2 + cellData.length);
  cellEncoded[0] = d1;
  cellEncoded[1] = d2;
  cellEncoded.set(cellData, 2);

  const totCellsSize = cellEncoded.length; // d1(1) + d2(1) + cellData(4+N)

  // ── BOC header (11 bytes) + cell data ────────────────────────────────────
  const boc = new Uint8Array(11 + cellEncoded.length);
  let i = 0;
  boc[i++] = 0xb5; boc[i++] = 0xee; boc[i++] = 0x9c; boc[i++] = 0x72; // magic
  boc[i++] = 0x01; // flags: size=1, no has_idx, no has_crc32c, no has_cache_bits
  boc[i++] = 0x01; // off_bytes = 1
  boc[i++] = 0x01; // cells_count = 1
  boc[i++] = 0x01; // roots_count = 1
  boc[i++] = 0x00; // absent_count = 0
  boc[i++] = totCellsSize & 0xff; // tot_cells_size (fits in 1 byte up to ~249-char comments)
  boc[i++] = 0x00; // root_list[0] = 0
  boc.set(cellEncoded, i);

  let binary = '';
  for (let j = 0; j < boc.length; j++) {
    binary += String.fromCharCode(boc[j]);
  }
  return btoa(binary);
}
