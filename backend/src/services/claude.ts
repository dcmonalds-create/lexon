import Anthropic from '@anthropic-ai/sdk';
import { AnalysisResult } from '../../../shared/types';
import { SIGNSAFE_PROMPT } from '../prompts/signsafe';
import { FINEBOT_PROMPT } from '../prompts/finebot';
import { TENANTSHIELD_PROMPT } from '../prompts/tenantshield';
import { WORKERSHIELD_PROMPT } from '../prompts/workershield';
import { REFUNDFORCE_PROMPT } from '../prompts/refundforce';
import { TOKENLEGAL_PROMPT } from '../prompts/tokenlegal';
import { DOCWIZARD_PROMPT } from '../prompts/docwizard';

const client = new Anthropic();

const PROMPT_MAP: Record<string, (input: string) => string> = {
  signsafe: SIGNSAFE_PROMPT,
  finebot: FINEBOT_PROMPT,
  tenantshield: TENANTSHIELD_PROMPT,
  workershield: WORKERSHIELD_PROMPT,
  refundforce: REFUNDFORCE_PROMPT,
  tokenlegal: TOKENLEGAL_PROMPT,
  docwizard: DOCWIZARD_PROMPT,
};

export async function analyzeWithClaude(toolId: string, input: string): Promise<AnalysisResult> {
  const promptFn = PROMPT_MAP[toolId];
  if (!promptFn) {
    throw new Error(`Unknown tool: ${toolId}`);
  }

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: promptFn(input),
      },
    ],
  });

  const text = response.content[0];
  if (text.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  const parsed: AnalysisResult = JSON.parse(text.text);
  if (!parsed.teaser || !parsed.full) {
    throw new Error('Invalid response structure from Claude');
  }

  return parsed;
}
