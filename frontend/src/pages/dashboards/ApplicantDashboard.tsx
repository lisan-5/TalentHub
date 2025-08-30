import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { User, FileText, Eye, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const ApplicantDashboard: React.FC = () => {
  const { user } = useAuth();
  const { applications, jobs } = useJobs();

  if (!user || user.role !== 'applicant') {
    return <Navigate to="/login" replace />;
  }

  const userApplications = applications.filter(app => app.applicantId === user.id);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <img
            src={user.avatar || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100`}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
            <p className="text-gray-600">Track your job applications and opportunities</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-2xl font-bold text-blue-700 mb-1">{userApplications.length}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {userApplications.filter(app => app.status === 'shortlisted').length}
            </div>
            <div className="text-sm text-gray-600">Shortlisted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {userApplications.filter(app => app.status === 'hired').length}
            </div>
            <div className="text-sm text-gray-600">Hired</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-2xl font-bold text-gray-600 mb-1">{jobs.length}</div>
            <div className="text-sm text-gray-600">Available Jobs</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/jobs">
            <Button icon={FileText}>Browse Jobs</Button>
          </Link>
          <Link to="/jobs" state={{ filter: 'remote' }}>
            <Button variant="ghost">Find Remote Work</Button>
          </Link>
        </div>
      </div>

      {/* Applications */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Applications</h2>
        
        {userApplications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600 mb-6">Start applying to jobs that match your skills and interests</p>
              <Link to="/jobs">
                <Button>Browse Available Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {userApplications.map(application => {
              const job = jobs.find(j => j.id === application.jobId);
              if (!job) return null;

              return (
                <Card key={application.id} hover>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <Link 
                              to={`/jobs/${job.id}`}
                              className="text-lg font-semibold text-blue-700 hover:text-blue-800 transition-colors duration-200"
                            >
                              {job.title}
                            </Link>
                            <p className="text-gray-600 font-medium">{job.company}</p>
                          </div>
                          <Badge variant={getStatusVariant(application.status)}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{job.shortDescription}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Applied on {formatDate(application.appliedAt)}</span>
                          <Link to={`/jobs/${job.id}`}>
                            <Button variant="ghost" size="sm" icon={ExternalLink}>
                              View Job
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};