import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Calendar, ArrowLeft, Edit, Trash2, Send } from 'lucide-react';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { ApplicationForm } from '../components/jobs/ApplicationForm';
import { useToast } from '../App';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { jobs, deleteJob, applications } = useJobs();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  const job = jobs.find(j => j.id === id);
  
  if (!job) {
    return <Navigate to="/jobs" replace />;
  }

  const hasApplied = user && applications.some(
    app => app.jobId === job.id && app.applicantId === user.id
  );

  const canModify = user && (user.role === 'admin' || (user.role === 'employer' && user.id === job.employerId));
  const canApply = user && user.role === 'applicant' && !hasApplied;

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this job?')) {
      deleteJob(job.id);
      showToast('Job deleted successfully', 'success');
    }
  };

  const handleApplicationSuccess = () => {
    showToast('Application submitted successfully!', 'success');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link 
          to="/jobs"
          className="inline-flex items-center text-blue-700 hover:text-blue-800 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Jobs
        </Link>
        
        {canModify && (
          <div className="flex space-x-2">
            <Link to={`/jobs/${job.id}/edit`}>
              <Button variant="ghost" icon={Edit}>Edit</Button>
            </Link>
            <Button variant="danger" icon={Trash2} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{job.title}</h1>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{job.company}</p>
                </div>
                
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.isRemote ? 'Remote' : job.location || 'Location TBD'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Posted {formatDate(job.postedAt)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.tags.map(tag => (
                    <Badge key={tag} variant="info">{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Job Description</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{job.description}</p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Requirements</h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-700 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Benefits</h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          <Card>
            <CardContent className="text-center space-y-4">
              {!user ? (
                <>
                  <p className="text-gray-600">Please log in to apply for this job</p>
                  <div className="space-y-2">
                    <Link to="/login" className="block">
                      <Button className="w-full">Login</Button>
                    </Link>
                    <Link to="/register" className="block">
                      <Button variant="ghost" className="w-full">Register</Button>
                    </Link>
                  </div>
                </>
              ) : user.role !== 'applicant' ? (
                <p className="text-gray-600">Only applicants can apply for jobs</p>
              ) : hasApplied ? (
                <div className="space-y-3">
                  <Badge variant="success" size="md">Application Submitted</Badge>
                  <p className="text-sm text-gray-600">You have already applied for this position</p>
                </div>
              ) : canApply ? (
                <Button 
                  className="w-full" 
                  icon={Send}
                  onClick={() => setShowApplicationForm(true)}
                >
                  Apply Now
                </Button>
              ) : null}
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">About {job.company}</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-gray-600">
                    {job.company.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">{job.company}</p>
                  <p className="text-sm text-gray-600">Technology Company</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Form Modal */}
      <ApplicationForm
        job={job}
        isOpen={showApplicationForm}
        onClose={() => setShowApplicationForm(false)}
        onSuccess={handleApplicationSuccess}
      />
    </div>
  );
};