import { useState } from 'react';
import { analyze } from '../lib/api';
import { useUserStore } from '../store/userStore';
import type { AnalyzeResponse } from '../types';

interface SubmitOptions {
  toolId: string;
  input: string;
  fileData?: string;
  fileType?: string;
  fileName?: string;
  fileData2?: string;
  fileType2?: string;
  fileName2?: string;
}

export function useToolSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const telegramId = useUserStore((s) => s.telegramId);
  const languageCode = useUserStore((s) => s.languageCode);

  const submit = async ({
    toolId, input,
    fileData, fileType, fileName,
    fileData2, fileType2, fileName2,
  }: SubmitOptions) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await analyze({
        toolId,
        input,
        telegramId,
        fileData,
        fileType,
        fileName,
        fileData2,
        fileType2,
        fileName2,
        languageCode,
      });
      setResult(res);
    } catch (err: any) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.error;

      if (status === 429) {
        // Rate limit — show the exact server message (includes minutes remaining)
        setError(`⏳ ${serverMsg || 'Too many requests. Please wait before trying again.'}`);
      } else if (status === 400 && serverMsg?.includes('PDF')) {
        // PDF too long
        setError(`📄 ${serverMsg}`);
      } else {
        setError(serverMsg || 'Analysis failed. Please try again.');
      }

      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { submit, loading, error, result, reset };
}
