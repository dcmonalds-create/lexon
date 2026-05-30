export interface ToolTemplate {
  label: string;
  text: string;
}

export interface Tool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  inputType: 'textarea' | 'form' | 'url';
  inputLabel: string;
  inputPlaceholder: string;
  price: number;
  templates: ToolTemplate[];
}

export interface AnalyzeRequest {
  toolId: string;
  input: string;
  telegramId: string;
  fileData?: string;   // base64 encoded
  fileType?: string;   // MIME type e.g. image/jpeg, application/pdf
  fileName?: string;
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
