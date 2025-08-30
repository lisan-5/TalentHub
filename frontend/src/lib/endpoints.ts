import api from './api';
import { ApiUser, ApiJob, mapUser, mapJob } from '../types';

export async function fetchCurrentUser(): Promise<ReturnType<typeof mapUser>> {
  const res = await api.get<ApiUser>('/user');
  const apiUser: ApiUser = (res.data as any).user ?? (res.data as any);
  return mapUser(apiUser);
}

export async function loginApi(email: string, password: string) {
  return api.post('/auth/login', { email, password });
}

export async function registerApi(name: string, email: string, password: string, role = 'applicant') {
  return api.post('/auth/register', { name, email, password, role });
}

export async function fetchJobs(): Promise<ReturnType<typeof mapJob>[]> {
  const res = await api.get<{ data: ApiJob[] }>('/jobs');
  const arr = (res.data as any).data ?? res.data;
  return (arr as ApiJob[]).map(mapJob);
}

export async function fetchUserJobs(): Promise<ReturnType<typeof mapJob>[]> {
  const res = await api.get<{ data: ApiJob[] }>('/user/jobs');
  const arr = (res.data as any).data ?? res.data;
  return (arr as ApiJob[]).map(mapJob);
}

export async function createJobApi(payload: any) {
  return api.post('/jobs', payload);
}

export async function applyToJobApi(jobId: string, formData: FormData) {
  return api.post(`/jobs/${jobId}/apply`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}
