export interface User {
  id: string;
  name: string;
  email: string;
  role: 'applicant' | 'employer' | 'admin';
  avatar?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  company: string;
  employerId: string;
  tags: string[];
  isRemote: boolean;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  location?: string;
  salary?: string;
  postedAt: Date;
  requirements: string[];
  benefits: string[];
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
  deleteJob: (jobId: string) => void;
  applyToJob: (jobId: string, application: Omit<Application, 'id' | 'appliedAt' | 'jobId'>) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}