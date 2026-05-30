export interface Tool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  inputType: 'textarea' | 'form';
  inputLabel: string;
  inputPlaceholder: string;
  price: number;
}

export interface AnalyzeRequest {
  toolId: string;
  input: string;
  telegramId: string;
  fileData?: string;
  fileType?: string;
  fileName?: string;
  languageCode?: string; // BCP-47 language code from Telegram user (e.g. 'en', 'ro', 'ru')
}

export interface AnalyzeResponse {
  teaser: string;
  sessionToken: string;
}

export interface UnlockRequest {
  sessionToken: string;
  txHash: string;
  telegramId: string;
}

export interface UnlockResponse {
  full: string;
}

export interface HistoryItem {
  id: number;
  tool_id: string;
  input_summary: string;
  full_result: string;
  tx_hash: string;
  paid_at: number;
  created_at: number;
}

export interface AnalysisResult {
  teaser: string;
  full: string;
}
