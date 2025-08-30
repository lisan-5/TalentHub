import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Edit, Trash2 } from 'lucide-react';
import { Job } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { user } = useAuth();
  const { deleteJob } = useJobs();
  
  const canModify = user && (user.role === 'admin' || (user.role === 'employer' && user.id === job.employerId));
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this job?')) {
      deleteJob(job.id);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card hover className="h-full flex flex-col">
      <CardContent className="flex-1">
        <div className="flex justify-between items-start mb-3">
          <Link 
            to={`/jobs/${job.id}`}
            className="text-lg font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200 line-clamp-2"
          >
            {job.title}
          </Link>
          {canModify && (
            <div className="flex space-x-1">
              <Link to={`/jobs/${job.id}/edit`}>
                <Button variant="ghost" size="sm" icon={Edit} />
              </Link>
              <Button variant="ghost" size="sm" icon={Trash2} onClick={handleDelete} />
            </div>
          )}
        </div>
        
  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">{job.company}</p>
  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">{job.shortDescription}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {job.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="info" size="sm">{tag}</Badge>
          ))}
          {job.tags.length > 3 && (
            <Badge variant="default" size="sm">+{job.tags.length - 3} more</Badge>
          )}
        </div>
        
  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{job.isRemote ? 'Remote' : job.location || 'Location TBD'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}</span>
          </div>
          {job.salary && (
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{formatDate(job.postedAt)}</span>
        <Link to={`/jobs/${job.id}`}>
          <Button size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};