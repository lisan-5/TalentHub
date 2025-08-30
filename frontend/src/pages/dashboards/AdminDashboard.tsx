import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, Briefcase, FileText, TrendingUp, MoreVertical, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../App';
import { mockUsers } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { jobs, applications, deleteJob, updateApplicationStatus } = useJobs();
  const { showToast } = useToast();
  const [selectedView, setSelectedView] = useState<'users' | 'jobs' | 'applications'>('jobs');
  const [selectedJobApplications, setSelectedJobApplications] = useState<string | null>(null);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const stats = [
    { label: 'Total Users', value: mockUsers.length, icon: Users, color: 'text-blue-700' },
    { label: 'Active Jobs', value: jobs.length, icon: Briefcase, color: 'text-green-600' },
    { label: 'Applications', value: applications.length, icon: FileText, color: 'text-purple-600' },
    { label: 'Companies', value: new Set(jobs.map(job => job.company)).size, icon: TrendingUp, color: 'text-orange-600' }
  ];

  const handleDeleteJob = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      deleteJob(jobId);
      showToast('Job deleted successfully', 'success');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'applied': return 'info';
      case 'shortlisted': return 'warning';
      case 'rejected': return 'danger';
      case 'hired': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const selectedJob = selectedJobApplications ? jobs.find(job => job.id === selectedJobApplications) : null;
  const jobApplications = selectedJobApplications ? 
    applications.filter(app => app.jobId === selectedJobApplications) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <img
            src={user.avatar || `https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100`}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">System overview and management</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
                  <div className="text-sm text-gray-600">{label}</div>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { key: 'jobs', label: 'Jobs Management', icon: Briefcase },
              { key: 'users', label: 'Users', icon: Users },
              { key: 'applications', label: 'Applications', icon: FileText }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedView(key as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  selectedView === key
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      {selectedView === 'jobs' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">All Jobs</h2>
          <div className="space-y-4">
            {jobs.map(job => {
              const jobApplications = applications.filter(app => app.jobId === job.id);
              
              return (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600 text-sm">{job.company}</p>
                        <p className="text-gray-700 text-sm mt-2 line-clamp-2">{job.shortDescription}</p>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span>Posted {formatDate(job.postedAt)}</span>
                          <span>{jobApplications.length} applications</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          icon={Eye}
                          onClick={() => setSelectedJobApplications(job.id)}
                        >
                          View Applications
                        </Button>
                        <Button 
                          size="sm" 
                          variant="danger" 
                          icon={Trash2}
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {selectedView === 'users' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockUsers.map(userData => (
              <Card key={userData.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={userData.avatar || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100`}
                      alt={userData.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{userData.name}</h3>
                      <p className="text-gray-600 text-sm">{userData.email}</p>
                      <Badge variant="default" size="sm" className="mt-2">
                        {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedView === 'applications' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">All Applications</h2>
          <div className="space-y-4">
            {applications.map(application => {
              const job = jobs.find(j => j.id === application.jobId);
              if (!job) return null;

              return (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{application.applicantName}</h3>
                          <Badge variant={getStatusVariant(application.status)}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{application.applicantEmail}</p>
                        <p className="text-gray-700 text-sm mt-1">
                          Applied to: <span className="font-medium">{job.title}</span> at {job.company}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">Applied {formatDate(application.appliedAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Applications Modal for specific job */}
      <Modal
        isOpen={!!selectedJobApplications}
        onClose={() => setSelectedJobApplications(null)}
        title={selectedJob ? `Applications for ${selectedJob.title}` : 'Applications'}
        size="xl"
      >
        {jobApplications.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600">Applications will appear here once candidates apply to this job</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobApplications.map(application => (
              <Card key={application.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{application.applicantName}</h3>
                      <p className="text-gray-600 text-sm">{application.applicantEmail}</p>
                      <p className="text-gray-500 text-sm">Applied {formatDate(application.appliedAt)}</p>
                    </div>
                    <Badge variant={getStatusVariant(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                      {application.coverLetter}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <a 
                      href={application.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                    >
                      View Resume ↗
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};