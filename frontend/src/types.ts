export interface ToolTemplate {
  label: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  fieldLabel: string;
  type: 'select' | 'multiselect' | 'text' | 'textarea';
  options?: string[];
  placeholder?: string;
  required?: boolean; // default true; false = skippable
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
  quiz?: QuizQuestion[];
  // Tools that compare two uploaded documents (e.g. LexCompare: old vs new contract).
  // When true, the input form shows two upload slots and the text field becomes optional context.
  dualFile?: boolean;
  dualFileLabels?: { first: string; second: string };
}

export interface AnalyzeRequest {
  toolId: string;
  input: string;
  telegramId: string;
  fileData?: string;   // base64 encoded
  fileType?: string;   // MIME type e.g. image/jpeg, application/pdf
  fileName?: string;
  fileData2?: string;
  fileType2?: string;
  fileName2?: string;
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

export interface FollowUpRequest {
  fullResult: string;
  question: string;
  telegramId: string;
  languageCode?: string;
}

export interface FollowUpResponse {
  answer: string;
}
