import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { JobCard } from '../components/jobs/JobCard';
import { useJobs } from '../contexts/JobContext';

export const HomePage: React.FC = () => {
  const { jobs } = useJobs();
  const latestJobs = jobs.slice(0, 6);

  const stats = [
    { icon: Briefcase, label: 'Active Jobs', value: jobs.length },
    { icon: Users, label: 'Companies', value: new Set(jobs.map(job => job.company)).size },
    { icon: TrendingUp, label: 'Applications', value: '500+' }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1600')] opacity-5 bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                Your Gateway to{' '}
                <span className="text-blue-700 bg-clip-text">Opportunities</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Connect talented professionals with amazing companies worldwide. 
                Find your dream job or discover the perfect candidate.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/jobs">
                <Button size="lg" icon={Search} className="w-full sm:w-auto">
                  Browse Jobs
                </Button>
              </Link>
              <Link to="/jobs/create">
                <Button variant="secondary" size="lg" icon={Briefcase} className="w-full sm:w-auto">
                  Post a Job
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
                    <Icon className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Latest Opportunities</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover exciting career opportunities from top companies looking for talented professionals like you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {latestJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/jobs">
            <Button size="lg" icon={ArrowRight}>
              View All Jobs
            </Button>
          </Link>
        </div>
      </section>

      {/* Call to Action Section */}
  <section className="bg-blue-700 text-white dark:text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold dark:text-gray-100">Ready to Get Started?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">For Job Seekers</h3>
                <p className="text-blue-100 dark:text-blue-200 mb-4">Find your next career opportunity and take your professional journey to the next level.</p>
                <Link to="/jobs">
                  <Button variant="secondary" className="w-full">
                    Find Jobs
                  </Button>
                </Link>
              </div>
              <div className="bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">For Employers</h3>
                <p className="text-blue-100 dark:text-blue-200 mb-4">Post jobs and connect with talented professionals who can drive your business forward.</p>
                <Link to="/jobs/create">
                  <Button variant="secondary" className="w-full">
                    Post a Job
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};