import React, { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { FormInput } from '../components/ui/FormInput';
import { FormTextarea } from '../components/ui/FormTextarea';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useJobs } from '../contexts/JobContext';
import { useToast } from '../App';

export const EditJobPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobs } = useJobs();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const job = jobs.find(j => j.id === id);
  
  if (!job) {
    return <Navigate to="/jobs" replace />;
  }

  // Authorization check
  const canEdit = user && (user.role === 'admin' || (user.role === 'employer' && user.id === job.employerId));
  if (!canEdit) {
    return <Navigate to={`/jobs/${id}`} replace />;
  }

  const [formData, setFormData] = useState({
    title: job.title,
    company: job.company,
    description: job.description,
    shortDescription: job.shortDescription,
    tags: job.tags.join(', '),
    isRemote: job.isRemote,
    jobType: job.jobType,
    location: job.location || '',
    salary: job.salary || '',
    requirements: job.requirements.join('\n'),
    benefits: job.benefits.join('\n')
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validation
      const newErrors: { [key: string]: string } = {};
      if (!formData.title.trim()) newErrors.title = 'Job title is required';
      if (!formData.company.trim()) newErrors.company = 'Company name is required';
      if (!formData.description.trim()) newErrors.description = 'Job description is required';
      if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      // For this mock, we'll just show success
      showToast('Job updated successfully!', 'success');
      navigate(`/jobs/${id}`);
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to update job' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/jobs/${id}`)}
          className="inline-flex items-center text-blue-700 hover:text-blue-800 transition-colors duration-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Job
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
        <p className="text-gray-600 mt-2">Update the job details below</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center">
            <Save className="w-5 h-5 mr-2" />
            Job Details
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Job Title"
                placeholder="e.g., Senior React Developer"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={errors.title}
              />
              <FormInput
                label="Company Name"
                placeholder="e.g., TechCorp Solutions"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                error={errors.company}
              />
            </div>

            <FormTextarea
              label="Short Description"
              placeholder="A brief, compelling summary of the role (1-2 sentences)"
              value={formData.shortDescription}
              onChange={(e) => handleChange('shortDescription', e.target.value)}
              rows={2}
              error={errors.shortDescription}
            />

            <FormTextarea
              label="Full Job Description"
              placeholder="Provide a detailed description of the role, responsibilities, and what you're looking for in a candidate..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={6}
              error={errors.description}
            />

            <FormInput
              label="Skills & Tags"
              placeholder="e.g., React, TypeScript, Node.js (separate with commas)"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  value={formData.jobType}
                  onChange={(e) => handleChange('jobType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 pt-6">
                <input
                  type="checkbox"
                  id="isRemote"
                  checked={formData.isRemote}
                  onChange={(e) => handleChange('isRemote', e.target.checked)}
                  className="w-4 h-4 text-blue-700 rounded focus:ring-blue-500"
                />
                <label htmlFor="isRemote" className="text-sm font-medium text-gray-700">
                  Remote Position
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Location"
                placeholder={formData.isRemote ? "Remote (optional)" : "e.g., San Francisco, CA"}
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
              <FormInput
                label="Salary Range (optional)"
                placeholder="e.g., $80,000 - $120,000"
                value={formData.salary}
                onChange={(e) => handleChange('salary', e.target.value)}
              />
            </div>

            <FormTextarea
              label="Requirements"
              placeholder="List the key requirements for this role (one per line)..."
              value={formData.requirements}
              onChange={(e) => handleChange('requirements', e.target.value)}
              rows={5}
            />

            <FormTextarea
              label="Benefits"
              placeholder="List the benefits and perks offered (one per line)..."
              value={formData.benefits}
              onChange={(e) => handleChange('benefits', e.target.value)}
              rows={4}
            />

            <div className="flex justify-end space-x-3 pt-6">
              <Button variant="ghost" onClick={() => navigate(`/jobs/${id}`)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting} icon={Save}>
                Update Job
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};