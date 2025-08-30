import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Plus, FileText, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../App';

export const EmployerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { jobs, userJobs, applications, deleteJob, updateApplicationStatus } = useJobs();
  const { showToast } = useToast();
  const [selectedJobApplications, setSelectedJobApplications] = useState<string | null>(null);

  if (!user || user.role !== 'employer') {
    return <Navigate to="/login" replace />;
  }

  const employerJobs = (userJobs && userJobs.length > 0)
    ? userJobs
    : jobs.filter(job => String(job.employerId) === String(user.id));
  const totalApplications = applications.filter(app => 
    employerJobs.some(job => job.id === app.jobId)
  );

  const handleDeleteJob = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      deleteJob(jobId);
      showToast('Job deleted successfully', 'success');
    }
  };

  const handleStatusUpdate = (applicationId: string, status: string) => {
    updateApplicationStatus(applicationId, status as any);
    showToast('Application status updated', 'success');
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

  const selectedJob = selectedJobApplications ? employerJobs.find(job => job.id === selectedJobApplications) : null;
  const jobApplications = selectedJobApplications ? 
    applications.filter(app => app.jobId === selectedJobApplications) : [];

  const formatDate = (date?: Date | null) => {
    if (!date) return 'Unknown';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <img
            src={(user as any).avatarUrl || `https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100`}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}</p>
          </div>
        </div>
        <Link to="/jobs/create">
          <Button icon={Plus}>Post New Job</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-2xl font-bold text-blue-700 mb-1">{employerJobs.length}</div>
            <div className="text-sm text-gray-600">Active Jobs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-2xl font-bold text-green-600 mb-1">{totalApplications.length}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {totalApplications.filter(app => app.status === 'shortlisted').length}
            </div>
            <div className="text-sm text-gray-600">Shortlisted</div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Management */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Job Postings</h2>
        
        {employerJobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Posted Yet</h3>
              <p className="text-gray-600 mb-6">Start by posting your first job to attract talented candidates</p>
              <Link to="/jobs/create">
                <Button icon={Plus}>Post Your First Job</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {employerJobs.map(job => {
              const jobApplications = applications.filter(app => app.jobId === job.id);
              
              return (
                <Card key={job.id} hover>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link 
                            to={`/jobs/${job.id}`}
                            className="text-lg font-semibold text-blue-700 hover:text-blue-800 transition-colors duration-200 block"
                          >
                            {job.title}
                          </Link>
                          <p className="text-gray-600 text-sm mt-1">{job.company}</p>
                          <p className="text-gray-700 text-sm mt-2 line-clamp-2">{job.shortDescription}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Posted {formatDate(job.postedAt)}</span>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
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
                          View Applications ({jobApplications.length})
                        </Button>
                        <Link to={`/jobs/${job.id}/edit`}>
                          <Button size="sm" variant="ghost" icon={Edit}>Edit</Button>
                        </Link>
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
        )}
      </div>

      {/* Applications Modal */}
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
                    
                    <div className="flex space-x-2">
                      {application.status === 'applied' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(application.id, 'shortlisted')}
                          >
                            Shortlist
                          </Button>
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => handleStatusUpdate(application.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {application.status === 'shortlisted' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(application.id, 'hired')}
                          >
                            Hire
                          </Button>
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => handleStatusUpdate(application.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
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