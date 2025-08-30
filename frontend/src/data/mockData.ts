import { User, Job, Application } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'applicant',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@techcorp.com',
    role: 'employer',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@talenthub.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    description: 'We are looking for an experienced React developer to join our dynamic team. You will be responsible for building user interfaces for our web applications using React, TypeScript, and modern development tools. The ideal candidate has 5+ years of experience with React, strong knowledge of JavaScript/TypeScript, and experience with state management libraries.',
    shortDescription: 'Build amazing user interfaces with React and TypeScript',
    company: 'TechCorp Solutions',
    employerId: '2',
    tags: ['React', 'TypeScript', 'JavaScript', 'Redux'],
    isRemote: true,
    jobType: 'full-time',
    location: 'Remote',
    salary: '$80,000 - $120,000',
    postedAt: new Date('2024-12-01'),
    requirements: [
      '5+ years of React experience',
      'Strong TypeScript skills',
      'Experience with state management',
      'Knowledge of testing frameworks'
    ],
    benefits: [
      'Flexible working hours',
      'Health insurance',
      'Professional development budget',
      '401k matching'
    ]
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    description: 'Join our design team to create intuitive and beautiful user experiences. We\'re seeking a talented designer with a passion for user-centered design and modern design principles. You\'ll work closely with our development team to bring designs to life.',
    shortDescription: 'Design beautiful and intuitive user experiences',
    company: 'Design Studio Inc',
    employerId: '2',
    tags: ['UI/UX', 'Figma', 'Design Systems', 'Prototyping'],
    isRemote: false,
    jobType: 'full-time',
    location: 'San Francisco, CA',
    salary: '$70,000 - $95,000',
    postedAt: new Date('2024-11-28'),
    requirements: [
      '3+ years of UX/UI design experience',
      'Proficiency in Figma or Sketch',
      'Portfolio demonstrating design process',
      'Understanding of accessibility principles'
    ],
    benefits: [
      'Creative work environment',
      'Latest design tools',
      'Conference attendance',
      'Flexible PTO'
    ]
  },
  {
    id: '3',
    title: 'Product Manager',
    description: 'Lead product strategy and development for our growing SaaS platform. Work with cross-functional teams to define product roadmaps, prioritize features, and ensure successful product launches.',
    shortDescription: 'Drive product strategy and roadmap planning',
    company: 'StartupXYZ',
    employerId: '2',
    tags: ['Product Management', 'Strategy', 'Agile', 'Analytics'],
    isRemote: true,
    jobType: 'full-time',
    location: 'New York, NY / Remote',
    salary: '$90,000 - $130,000',
    postedAt: new Date('2024-11-25'),
    requirements: [
      '4+ years product management experience',
      'Experience with SaaS products',
      'Strong analytical skills',
      'Excellent communication abilities'
    ],
    benefits: [
      'Equity participation',
      'Unlimited vacation',
      'Learning stipend',
      'Remote work options'
    ]
  },
  {
    id: '4',
    title: 'Data Scientist',
    description: 'Analyze complex datasets to drive business insights and build predictive models. Work with large-scale data to identify trends, create visualizations, and support data-driven decision making.',
    shortDescription: 'Unlock insights from data with machine learning',
    company: 'DataFlow Analytics',
    employerId: '2',
    tags: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    isRemote: true,
    jobType: 'full-time',
    location: 'Boston, MA / Remote',
    salary: '$85,000 - $115,000',
    postedAt: new Date('2024-11-20'),
    requirements: [
      'MS in Data Science or related field',
      'Strong Python and SQL skills',
      'Experience with ML frameworks',
      'Statistical analysis expertise'
    ],
    benefits: [
      'Cutting-edge technology',
      'Research time allocation',
      'Conference presentations',
      'Professional growth path'
    ]
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    description: 'Build and maintain our cloud infrastructure, implement CI/CD pipelines, and ensure high availability of our services. Work with containerization, orchestration, and monitoring tools.',
    shortDescription: 'Scale infrastructure and automate deployments',
    company: 'CloudTech Systems',
    employerId: '2',
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    isRemote: false,
    jobType: 'full-time',
    location: 'Austin, TX',
    salary: '$75,000 - $105,000',
    postedAt: new Date('2024-11-15'),
    requirements: [
      '3+ years DevOps experience',
      'AWS certification preferred',
      'Docker and Kubernetes experience',
      'Infrastructure as code knowledge'
    ],
    benefits: [
      'Latest DevOps tools',
      'Certification reimbursement',
      'Flexible schedule',
      'Team building events'
    ]
  }
];

export const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    applicantId: '1',
    applicantName: 'John Doe',
    applicantEmail: 'john@example.com',
    resumeUrl: '/documents/john-doe-resume.pdf',
    coverLetter: 'I am excited to apply for this position. With 6 years of React experience, I believe I would be a great fit for your team.',
    status: 'applied',
    appliedAt: new Date('2024-12-02')
  },
  {
    id: '2',
    jobId: '2',
    applicantId: '1',
    applicantName: 'John Doe',
    applicantEmail: 'john@example.com',
    resumeUrl: '/documents/john-doe-resume.pdf',
    coverLetter: 'Though my background is in development, I have a strong interest in UX/UI design and have completed several design courses.',
    status: 'shortlisted',
    appliedAt: new Date('2024-11-29')
  }
];