// API DTOs reflect backend JSON (dates as strings)
export type ApiUser = {
  id: number;
  name: string;
  email: string;
  role?: 'applicant' | 'employer' | 'admin';
  avatar_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

// Client-side models use Date objects where helpful
export type User = {
  id: string;
  name: string;
  email: string;
  role?: 'applicant' | 'employer' | 'admin';
  avatarUrl?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type ApiJob = {
  id: number;
  title: string;
  company: string;
  description: string;
  short_description?: string | null;
  employer_id?: number | string;
  tags?: string[];
  is_remote?: boolean;
  job_type?: 'full-time' | 'part-time' | 'contract' | 'internship';
  location?: string | null;
  salary?: string | null;
  requirements?: string[];
  benefits?: string[];
  posted_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  description: string;
  shortDescription?: string | null;
  employerId?: string;
  tags?: string[];
  isRemote?: boolean;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  location?: string | null;
  salary?: string | null;
  requirements?: string[];
  benefits?: string[];
  postedAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export function toDateOrNull(iso?: string | null): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function mapUser(api: ApiUser): User {
  return {
  id: String(api.id),
    name: api.name,
    email: api.email,
    role: api.role,
    avatarUrl: api.avatar_url ?? null,
    createdAt: toDateOrNull(api.created_at ?? null),
    updatedAt: toDateOrNull(api.updated_at ?? null),
  };
}

export function mapJob(api: ApiJob): Job {
  return {
  id: String(api.id),
    title: api.title,
    company: api.company,
    description: api.description,
  shortDescription: api.short_description ?? null,
  employerId: api.employer_id ? String(api.employer_id) : undefined,
  tags: api.tags ?? [],
  isRemote: api.is_remote ?? false,
  jobType: api.job_type,
  location: api.location ?? null,
  salary: api.salary ?? null,
  requirements: api.requirements ?? [],
  benefits: api.benefits ?? [],
  postedAt: toDateOrNull(api.posted_at ?? null),
  createdAt: toDateOrNull(api.created_at ?? null),
  updatedAt: toDateOrNull(api.updated_at ?? null),
  };
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  resumeUrl: string;
  coverLetter: string;
  status: 'applied' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

export interface JobContextType {
  jobs: Job[];
  userJobs?: Job[];
  applications: Application[];
  createJob: (job: Omit<Job, 'id' | 'postedAt' | 'employerId'>) => void;
  refreshJobs?: () => Promise<void>;
  refreshUserJobs?: () => Promise<void>;
  addJob?: (job: Job) => void;
  deleteJob: (jobId: string) => void;
  applyToJob: (jobId: string, application: Omit<Application, 'id' | 'appliedAt' | 'jobId'>) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}
