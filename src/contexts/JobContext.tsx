import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Job, Application, JobContextType } from '../types';
import { useAuth } from './AuthContext';
import { mockJobs, mockApplications } from '../data/mockData';
import { fetchUserJobs, fetchJobs } from '../lib/endpoints';
import { useEffect } from 'react';

const JobContext = createContext<JobContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

interface JobProviderProps {
  children: ReactNode;
}

export const JobProvider: React.FC<JobProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  // Always load the public jobs list; if it fails, fall back to mock data.
  useEffect(() => {
    let mounted = true;
    async function loadJobs() {
      try {
        const remoteJobs = await fetchJobs();
        if (!mounted) return;
        const sorted = (remoteJobs as Job[]).slice().sort((a, b) => {
          const ta = a.postedAt ? new Date(a.postedAt).getTime() : 0;
          const tb = b.postedAt ? new Date(b.postedAt).getTime() : 0;
          return tb - ta;
        });
        setJobs(sorted);
      } catch (err) {
        console.warn('Failed to load jobs from API, using mock data', err);
  setJobs(mockJobs.slice().sort((a, b) => (b.postedAt?.getTime() ?? 0) - (a.postedAt?.getTime() ?? 0)));
      }
    }
    loadJobs();
    return () => { mounted = false; };
  }, [user]);

  // When authenticated user changes to an employer, load their jobs
  useEffect(() => {
    if (user && user.role === 'employer') {
      refreshUserJobs();
    } else {
      setUserJobs([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const createJob = (jobData: Omit<Job, 'id' | 'postedAt' | 'employerId'>) => {
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      postedAt: new Date(),
      // Use current authenticated user's id when available, fallback to '2'
      employerId: String(user?.id ?? '2')
    };
    setJobs(prev => [newJob, ...prev]);
    // If current user is an employer, also add to userJobs so dashboard shows it
    if (user && user.role === 'employer') {
      setUserJobs(prev => [newJob, ...prev]);
    }
  };

  const addJob = (job: Job) => {
    setJobs(prev => [job, ...prev]);
    if (user && user.role === 'employer') {
      setUserJobs(prev => [job, ...prev]);
    }
  };

  const refreshJobs = async () => {
    try {
      const remoteJobs = await fetchJobs();
      const sorted = (remoteJobs as Job[]).slice().sort((a, b) => {
        const ta = a.postedAt ? new Date(a.postedAt).getTime() : 0;
        const tb = b.postedAt ? new Date(b.postedAt).getTime() : 0;
        return tb - ta;
      });
      setJobs(sorted);
    } catch (err) {
      console.warn('Failed to refresh jobs', err);
  setJobs(mockJobs.slice().sort((a, b) => (b.postedAt?.getTime() ?? 0) - (a.postedAt?.getTime() ?? 0)));
    }
  };

  const refreshUserJobs = async () => {
    if (!(user && user.role === 'employer')) {
      setUserJobs([]);
      return;
    }
    try {
      const remoteJobs = await fetchUserJobs();
      setUserJobs(remoteJobs as Job[]);
    } catch (err) {
      console.warn('Failed to refresh user jobs', err);
      // fallback: filter current jobs by employerId
  setUserJobs(jobs.filter(j => String(j.employerId) === String(user?.id)));
    }
  };

  const deleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
    setApplications(prev => prev.filter(app => app.jobId !== jobId));
  };

  const applyToJob = (jobId: string, applicationData: Omit<Application, 'id' | 'appliedAt' | 'jobId'>) => {
    // Check if user already applied
    const existingApplication = applications.find(
      app => app.jobId === jobId && app.applicantId === applicationData.applicantId
    );
    
    if (existingApplication) {
      throw new Error('You have already applied to this job');
    }

    const newApplication: Application = {
      ...applicationData,
      id: Date.now().toString(),
      jobId,
      appliedAt: new Date()
    };
    setApplications(prev => [newApplication, ...prev]);
  };

  const updateApplicationStatus = (applicationId: string, status: Application['status']) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId ? { ...app, status } : app
      )
    );
  };

  return (
    <JobContext.Provider value={{
      jobs,
  userJobs,
      applications,
      createJob,
  refreshJobs,
  refreshUserJobs,
      deleteJob,
      applyToJob,
      updateApplicationStatus,
      searchTerm,
    setSearchTerm,
    addJob
    }}>
      {children}
    </JobContext.Provider>
  );
};