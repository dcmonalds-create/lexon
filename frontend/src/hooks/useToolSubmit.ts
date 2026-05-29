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
}

export function useToolSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const telegramId = useUserStore((s) => s.telegramId);

  const submit = async ({ toolId, input, fileData, fileType, fileName }: SubmitOptions) => {
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
      });
      setResult(res);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Analysis failed. Please try again.';
      setError(msg);
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
