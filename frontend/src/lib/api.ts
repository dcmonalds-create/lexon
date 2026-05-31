import axios from 'axios';
import type { AnalyzeRequest, AnalyzeResponse, UnlockRequest, UnlockResponse, HistoryItem, FollowUpRequest, FollowUpResponse } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' },
});

export async function analyze(data: AnalyzeRequest): Promise<AnalyzeResponse> {
  const res = await api.post<AnalyzeResponse>('/analyze', data);
  return res.data;
}

export async function unlock(data: UnlockRequest): Promise<UnlockResponse> {
  const res = await api.post<UnlockResponse>('/unlock', data);
  return res.data;
}

export async function getHistory(telegramId: string): Promise<HistoryItem[]> {
  const res = await api.get<{ results: HistoryItem[] }>(`/history/${telegramId}`);
  return res.data.results;
}

export async function followUp(data: FollowUpRequest): Promise<FollowUpResponse> {
  const res = await api.post<FollowUpResponse>('/followup', data);
  return res.data;
}

export interface SolanaUnlockRequest {
  sessionToken: string;
  txSignature: string;
  userId: string;
}

export async function solanaUnlock(data: SolanaUnlockRequest): Promise<{ full: string }> {
  const res = await api.post<{ full: string }>('/solana-unlock', data);
  return res.data;
}

export interface CreateReminderRequest {
  telegramId: string;
  toolId: string;
  toolName: string;
  summary: string;
  days: number;
}

export async function createReminder(data: CreateReminderRequest): Promise<{ id: number; remindAt: number }> {
  const res = await api.post<{ id: number; remindAt: number }>('/reminders', data);
  return res.data;
}

export default api;
