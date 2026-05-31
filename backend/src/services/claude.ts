import Anthropic from '@anthropic-ai/sdk';
import { AnalysisResult } from '../../../shared/types';
import { SIGNSAFE_PROMPT } from '../prompts/signsafe';
import { FINEBOT_PROMPT } from '../prompts/finebot';
import { TENANTSHIELD_PROMPT } from '../prompts/tenantshield';
import { WORKERSHIELD_PROMPT } from '../prompts/workershield';
import { REFUNDFORCE_PROMPT } from '../prompts/refundforce';
import { TOKENLEGAL_PROMPT } from '../prompts/tokenlegal';
import { DOCWIZARD_PROMPT } from '../prompts/docwizard';
import { TOSCANNER_PROMPT } from '../prompts/toscanner';
import { LEXDRAFT_PROMPT } from '../prompts/lexdraft';
import { LEXSCAM_PROMPT } from '../prompts/lexscam';

const client = new Anthropic();

// ─── Language code → full language name ────────────────────────────────────

const LANGUAGE_MAP: Record<string, string> = {
  ro: 'Romanian',
  ru: 'Russian',
  es: 'Spanish',
  ar: 'Arabic',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese',
  it: 'Italian',
  tr: 'Turkish',
  uk: 'Ukrainian',
  pl: 'Polish',
  zh: 'Chinese',
  nl: 'Dutch',
  sv: 'Swedish',
  fi: 'Finnish',
  no: 'Norwegian',
  da: 'Danish',
  cs: 'Czech',
  sk: 'Slovak',
  hu: 'Hungarian',
  el: 'Greek',
  bg: 'Bulgarian',
  hr: 'Croatian',
  sr: 'Serbian',
  id: 'Indonesian',
  ms: 'Malay',
  hi: 'Hindi',
  bn: 'Bengali',
  ja: 'Japanese',
  ko: 'Korean',
  vi: 'Vietnamese',
  th: 'Thai',
  fa: 'Persian',
  he: 'Hebrew',
};

const PROMPT_MAP: Record<string, (input: string) => string> = {
  signsafe: SIGNSAFE_PROMPT,
  finebot: FINEBOT_PROMPT,
  tenantshield: TENANTSHIELD_PROMPT,
  workershield: WORKERSHIELD_PROMPT,
  refundforce: REFUNDFORCE_PROMPT,
  tokenlegal: TOKENLEGAL_PROMPT,
  docwizard: DOCWIZARD_PROMPT,
  toscanner: TOSCANNER_PROMPT,
  lexdraft: LEXDRAFT_PROMPT,
  lexscam: LEXSCAM_PROMPT,
};

type SupportedImageType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
const SUPPORTED_IMAGE_TYPES: SupportedImageType[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

interface FileAttachment {
  fileData: string;   // base64
  fileType: string;   // MIME type
  fileName?: string;
}

export async function analyzeWithClaude(
  toolId: string,
  input: string,
  attachment?: FileAttachment,
  languageCode?: string
): Promise<AnalysisResult> {
  const promptFn = PROMPT_MAP[toolId];
  if (!promptFn) {
    throw new Error(`Unknown tool: ${toolId}`);
  }

  // Resolve language and append instruction if not English
  const normalizedLang = languageCode?.toLowerCase().split('-')[0] ?? 'en';
  const languageName = LANGUAGE_MAP[normalizedLang];
  const languageInstruction = languageName
    ? `\n\nIMPORTANT: Respond entirely in ${languageName}. Every field in the JSON — including the "teaser" and "full" fields — must be written in ${languageName}. Do not use English except for proper nouns or technical terms that have no equivalent.`
    : '';

  const promptText = promptFn(input) + languageInstruction;

  // Build message content — add file first if present, then the text prompt
  type ContentBlock =
    | { type: 'text'; text: string }
    | { type: 'image'; source: { type: 'base64'; media_type: SupportedImageType; data: string } }
    | { type: 'document'; source: { type: 'base64'; media_type: 'application/pdf'; data: string } };

  const content: ContentBlock[] = [];

  if (attachment) {
    const { fileData, fileType } = attachment;

    if (SUPPORTED_IMAGE_TYPES.includes(fileType as SupportedImageType)) {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: fileType as SupportedImageType,
          data: fileData,
        },
      });
    } else if (fileType === 'application/pdf') {
      content.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: fileData,
        },
      });
    }
  }

  content.push({ type: 'text', text: promptText });

  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 6000,
    messages: [{ role: 'user', content }],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Strip markdown code fences if Claude wrapped the JSON
  const raw = textBlock.text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');

  const parsed: AnalysisResult = JSON.parse(raw);
  if (!parsed.teaser || !parsed.full) {
    throw new Error('Invalid response structure from Claude');
  }

  return parsed;
}
