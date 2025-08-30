import React, { useState } from 'react';
import { FormInput } from '../ui/FormInput';
import { FormTextarea } from '../ui/FormTextarea';
import { FileUpload } from '../ui/FileUpload';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { applyToJobApi } from '../../lib/endpoints';
import { Job } from '../../types';

interface ApplicationFormProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ 
  job, 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const { user } = useAuth();
  const { applyToJob, refreshJobs } = useJobs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: '',
    resume: null as File | null
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validation
      const newErrors: { [key: string]: string } = {};
      if (!formData.resume) {
        newErrors.resume = 'Resume is required';
      }
      if (!formData.coverLetter.trim()) {
        newErrors.coverLetter = 'Cover letter is required';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      if (!user) {
        throw new Error('You must be logged in to apply');
      }

      // Prepare FormData for file upload
      const fd = new FormData();
      fd.append('applicant_id', String(user.id));
      fd.append('applicant_name', user.name);
      fd.append('applicant_email', user.email);
      fd.append('cover_letter', formData.coverLetter);
      if (formData.resume) fd.append('resume', formData.resume);

      try {
        await applyToJobApi(job.id, fd);
        // refresh local apps/jobs if needed
        await refreshJobs();
        onSuccess();
        onClose();
        setFormData({ coverLetter: '', resume: null });
      } catch (err) {
        // fallback to local mocked application
        console.warn('Apply API failed, falling back to local apply', err);
        const resumeUrl = `/documents/${user.name.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`;
        await applyToJob(job.id, {
          applicantId: user.id,
          applicantName: user.name,
          applicantEmail: user.email,
          resumeUrl,
          coverLetter: formData.coverLetter,
          status: 'applied'
        });
        onSuccess();
        onClose();
        setFormData({ coverLetter: '', resume: null });
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to submit application' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply to ${job.title}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-1">{job.title}</h3>
          <p className="text-sm text-blue-700">{job.company}</p>
        </div>

        <FileUpload
          label="Resume (PDF, DOC, DOCX)"
          accept=".pdf,.doc,.docx"
          value={formData.resume}
          onChange={(file) => setFormData(prev => ({ ...prev, resume: file }))}
          error={errors.resume}
        />

        <FormTextarea
          label="Cover Letter"
          placeholder="Tell us why you're interested in this position and how your skills match our requirements..."
          value={formData.coverLetter}
          onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
          rows={6}
          error={errors.coverLetter}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};