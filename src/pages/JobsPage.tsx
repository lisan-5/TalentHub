import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { JobCard } from '../components/jobs/JobCard';
import { Job } from '../types';
import { Button } from '../components/ui/Button';
import { useJobs } from '../contexts/JobContext';

export const JobsPage: React.FC = () => {
  const { jobs, searchTerm, setSearchTerm } = useJobs();
  const [filters, setFilters] = useState<{ jobType: string; location: string; isRemote: string }>({
    jobType: '',
    location: '',
    isRemote: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = useMemo<Job[]>(() => {
    let filtered = jobs as Job[];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((job: Job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.tags ?? []).some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (filters.jobType) {
      filtered = filtered.filter((job: Job) => job.jobType === filters.jobType);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter((job: Job) => 
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Remote filter
    if (filters.isRemote === 'true') {
      filtered = filtered.filter((job: Job) => job.isRemote);
    } else if (filters.isRemote === 'false') {
      filtered = filtered.filter((job: Job) => !job.isRemote);
    }

    return filtered;
  }, [jobs, searchTerm, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  const clearFilters = () => {
    setFilters({ jobType: '', location: '', isRemote: '' });
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Find Your Next Opportunity</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Discover {jobs.length} amazing job opportunities from top companies
        </p>
      </div>

      {/* Search and Filters */}
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          {/* Filter Toggle */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  icon={Filter}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Filters {Object.values(filters).some(v => v) && `(${Object.values(filters).filter(v => v).length})`}
                </Button>
                {Object.values(filters).some(v => v) && (
                  <Button variant="ghost" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  value={filters.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
                <select
                  value={filters.isRemote}
                  onChange={(e) => handleFilterChange('isRemote', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="true">Remote</option>
                  <option value="false">On-site</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-300">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job: Job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No jobs found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your search criteria or browse all available positions.</p>
            <Button onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};