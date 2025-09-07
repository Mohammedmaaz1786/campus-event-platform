// Enhanced Admin & Student Mock Data with Detailed Event Information

export interface EnhancedAdminData {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  college: string;
  role: string;
  department: string;
  joinDate: string;
  permissions: string[];
}

export interface EnhancedStudentData {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  college: string;
  year: string;
  major: string;
  joinDate: string;
  gpa?: number;
}

export interface DetailedEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  college: string;
  max_capacity: number;
  current_registrations: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
  image_url?: string;
  registration_deadline?: string;
  requirements?: string;
  contact_email?: string;
  contact_phone?: string;
  tags?: string[];
  agenda?: string[];
  speakers?: string[];
  certificates: boolean;
  fees?: number;
}

// Enhanced Admin Accounts (10 admins)
export const mockAdmins: EnhancedAdminData[] = [
  {
    id: 'ADM001',
    name: 'Dr. Sarah Johnson',
    email: 'admin@campus.edu',
    password: 'admin123',
    phone: '+1 (555) 987-6543',
    college: 'Main Campus',
    role: 'Campus Administrator',
    department: 'Administration',
    joinDate: '2023-01-15',
    permissions: ['event_management', 'user_management', 'reports_access', 'system_admin']
  },
  {
    id: 'ADM002',
    name: 'Prof. Michael Chen',
    email: 'engineering.admin@campus.edu',
    password: 'eng123',
    phone: '+1 (555) 876-5432',
    college: 'Engineering',
    role: 'Dean',
    department: 'Engineering Administration',
    joinDate: '2022-08-20',
    permissions: ['event_management', 'user_management', 'reports_access']
  },
  {
    id: 'ADM003',
    name: 'Dr. Lisa Rodriguez',
    email: 'arts.admin@campus.edu',
    password: 'arts123',
    phone: '+1 (555) 765-4321',
    college: 'Arts & Sciences',
    role: 'Department Head',
    department: 'Arts & Sciences',
    joinDate: '2023-03-10',
    permissions: ['event_management', 'reports_access']
  },
  {
    id: 'ADM004',
    name: 'Dr. James Wilson',
    email: 'business.admin@campus.edu',
    password: 'biz123',
    phone: '+1 (555) 654-3210',
    college: 'Business School',
    role: 'Event Coordinator',
    department: 'Business Administration',
    joinDate: '2023-06-05',
    permissions: ['event_management', 'reports_access']
  },
  {
    id: 'ADM005',
    name: 'Dr. Emily Martinez',
    email: 'medical.admin@campus.edu',
    password: 'med123',
    phone: '+1 (555) 543-2109',
    college: 'Medical School',
    role: 'Associate Dean',
    department: 'Medical Education',
    joinDate: '2022-11-12',
    permissions: ['event_management', 'user_management', 'reports_access']
  },
  {
    id: 'ADM006',
    name: 'Prof. Robert Kim',
    email: 'law.admin@campus.edu',
    password: 'law123',
    phone: '+1 (555) 432-1098',
    college: 'Law School',
    role: 'Academic Director',
    department: 'Legal Studies',
    joinDate: '2023-02-28',
    permissions: ['event_management', 'reports_access']
  },
  {
    id: 'ADM007',
    name: 'Dr. Amanda Foster',
    email: 'agriculture.admin@campus.edu',
    password: 'agri123',
    phone: '+1 (555) 321-0987',
    college: 'Agriculture',
    role: 'Research Director',
    department: 'Agricultural Sciences',
    joinDate: '2022-09-15',
    permissions: ['event_management', 'user_management', 'reports_access']
  },
  {
    id: 'ADM008',
    name: 'Prof. David Thompson',
    email: 'arts.creative.admin@campus.edu',
    password: 'creative123',
    phone: '+1 (555) 210-9876',
    college: 'Fine Arts',
    role: 'Creative Director',
    department: 'Fine Arts',
    joinDate: '2023-04-18',
    permissions: ['event_management', 'reports_access']
  },
  {
    id: 'ADM009',
    name: 'Dr. Maria Santos',
    email: 'education.admin@campus.edu',
    password: 'edu123',
    phone: '+1 (555) 109-8765',
    college: 'Education',
    role: 'Program Director',
    department: 'Education Studies',
    joinDate: '2022-12-08',
    permissions: ['event_management', 'user_management', 'reports_access']
  },
  {
    id: 'ADM010',
    name: 'Prof. Jennifer Chang',
    email: 'nursing.admin@campus.edu',
    password: 'nurse123',
    phone: '+1 (555) 098-7654',
    college: 'Nursing',
    role: 'Clinical Director',
    department: 'Nursing Administration',
    joinDate: '2023-01-25',
    permissions: ['event_management', 'reports_access']
  }
];

// Enhanced Student Accounts (50 students)
export const mockStudents: EnhancedStudentData[] = [
  // Engineering Students (15)
  {
    id: 'STU001',
    name: 'John Doe',
    email: 'john.doe@student.edu',
    password: 'student123',
    phone: '+1 (555) 123-4567',
    college: 'Engineering',
    year: 'Junior',
    major: 'Computer Science',
    joinDate: '2023-09-01',
    gpa: 3.7
  },
  {
    id: 'STU002',
    name: 'Emily Chen',
    email: 'emily.chen@student.edu',
    password: 'student123',
    phone: '+1 (555) 456-7890',
    college: 'Engineering',
    year: 'Freshman',
    major: 'Mechanical Engineering',
    joinDate: '2024-09-01',
    gpa: 3.8
  },
  {
    id: 'STU003',
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@student.edu',
    password: 'student123',
    phone: '+1 (555) 234-5678',
    college: 'Engineering',
    year: 'Senior',
    major: 'Electrical Engineering',
    joinDate: '2021-09-01',
    gpa: 3.6
  },
  {
    id: 'STU004',
    name: 'Sarah Kim',
    email: 'sarah.kim@student.edu',
    password: 'student123',
    phone: '+1 (555) 345-6789',
    college: 'Engineering',
    year: 'Sophomore',
    major: 'Civil Engineering',
    joinDate: '2023-09-01',
    gpa: 3.9
  },
  {
    id: 'STU005',
    name: 'Michael Torres',
    email: 'michael.torres@student.edu',
    password: 'student123',
    phone: '+1 (555) 567-8901',
    college: 'Engineering',
    year: 'Junior',
    major: 'Chemical Engineering',
    joinDate: '2022-09-01',
    gpa: 3.5
  },
  
  // Arts & Sciences Students (15)
  {
    id: 'STU006',
    name: 'Jane Smith',
    email: 'jane.smith@student.edu',
    password: 'student123',
    phone: '+1 (555) 234-5678',
    college: 'Arts & Sciences',
    year: 'Sophomore',
    major: 'Psychology',
    joinDate: '2023-09-01',
    gpa: 3.9
  },
  {
    id: 'STU007',
    name: 'David Brown',
    email: 'david.brown@student.edu',
    password: 'student123',
    phone: '+1 (555) 567-8901',
    college: 'Arts & Sciences',
    year: 'Senior',
    major: 'Biology',
    joinDate: '2021-09-01',
    gpa: 3.6
  },
  {
    id: 'STU008',
    name: 'Lisa Wang',
    email: 'lisa.wang@student.edu',
    password: 'student123',
    phone: '+1 (555) 678-9012',
    college: 'Arts & Sciences',
    year: 'Junior',
    major: 'Chemistry',
    joinDate: '2022-09-01',
    gpa: 3.8
  },
  {
    id: 'STU009',
    name: 'James Anderson',
    email: 'james.anderson@student.edu',
    password: 'student123',
    phone: '+1 (555) 789-0123',
    college: 'Arts & Sciences',
    year: 'Freshman',
    major: 'Physics',
    joinDate: '2024-09-01',
    gpa: 3.7
  },
  {
    id: 'STU010',
    name: 'Maria Garcia',
    email: 'maria.garcia@student.edu',
    password: 'student123',
    phone: '+1 (555) 890-1234',
    college: 'Arts & Sciences',
    year: 'Sophomore',
    major: 'Mathematics',
    joinDate: '2023-09-01',
    gpa: 3.9
  },

  // Business School Students (10)
  {
    id: 'STU011',
    name: 'Mike Wilson',
    email: 'mike.wilson@student.edu',
    password: 'student123',
    phone: '+1 (555) 345-6789',
    college: 'Business School',
    year: 'Senior',
    major: 'Marketing',
    joinDate: '2021-09-01',
    gpa: 3.5
  },
  {
    id: 'STU012',
    name: 'Ashley Davis',
    email: 'ashley.davis@student.edu',
    password: 'student123',
    phone: '+1 (555) 456-7890',
    college: 'Business School',
    year: 'Junior',
    major: 'Finance',
    joinDate: '2022-09-01',
    gpa: 3.8
  },
  {
    id: 'STU013',
    name: 'Robert Taylor',
    email: 'robert.taylor@student.edu',
    password: 'student123',
    phone: '+1 (555) 567-8901',
    college: 'Business School',
    year: 'Sophomore',
    major: 'Management',
    joinDate: '2023-09-01',
    gpa: 3.6
  },
  {
    id: 'STU014',
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@student.edu',
    password: 'student123',
    phone: '+1 (555) 678-9012',
    college: 'Business School',
    year: 'Senior',
    major: 'Accounting',
    joinDate: '2021-09-01',
    gpa: 3.7
  },
  {
    id: 'STU015',
    name: 'Kevin Lee',
    email: 'kevin.lee@student.edu',
    password: 'student123',
    phone: '+1 (555) 789-0123',
    college: 'Business School',
    year: 'Freshman',
    major: 'Economics',
    joinDate: '2024-09-01',
    gpa: 3.9
  },

  // Medical School Students (5)
  {
    id: 'STU016',
    name: 'Dr. Amanda Foster',
    email: 'amanda.foster@student.edu',
    password: 'student123',
    phone: '+1 (555) 890-1234',
    college: 'Medical School',
    year: 'Junior',
    major: 'Medicine',
    joinDate: '2022-09-01',
    gpa: 3.9
  },
  {
    id: 'STU017',
    name: 'Thomas White',
    email: 'thomas.white@student.edu',
    password: 'student123',
    phone: '+1 (555) 901-2345',
    college: 'Medical School',
    year: 'Senior',
    major: 'Medicine',
    joinDate: '2021-09-01',
    gpa: 3.8
  },
  {
    id: 'STU018',
    name: 'Rachel Green',
    email: 'rachel.green@student.edu',
    password: 'student123',
    phone: '+1 (555) 012-3456',
    college: 'Medical School',
    year: 'Sophomore',
    major: 'Pre-Med',
    joinDate: '2023-09-01',
    gpa: 3.9
  },
  {
    id: 'STU019',
    name: 'Daniel Clark',
    email: 'daniel.clark@student.edu',
    password: 'student123',
    phone: '+1 (555) 123-4567',
    college: 'Medical School',
    year: 'Freshman',
    major: 'Biomedical Sciences',
    joinDate: '2024-09-01',
    gpa: 3.7
  },
  {
    id: 'STU020',
    name: 'Sophia Rodriguez',
    email: 'sophia.rodriguez@student.edu',
    password: 'student123',
    phone: '+1 (555) 234-5678',
    college: 'Medical School',
    year: 'Junior',
    major: 'Medicine',
    joinDate: '2022-09-01',
    gpa: 3.8
  },

  // Law School Students (5)
  {
    id: 'STU021',
    name: 'Christopher Johnson',
    email: 'christopher.johnson@student.edu',
    password: 'student123',
    phone: '+1 (555) 345-6789',
    college: 'Law School',
    year: 'Senior',
    major: 'Law',
    joinDate: '2021-09-01',
    gpa: 3.6
  },
  {
    id: 'STU022',
    name: 'Emma Thompson',
    email: 'emma.thompson@student.edu',
    password: 'student123',
    phone: '+1 (555) 456-7890',
    college: 'Law School',
    year: 'Junior',
    major: 'Law',
    joinDate: '2022-09-01',
    gpa: 3.9
  },
  {
    id: 'STU023',
    name: 'Matthew Davis',
    email: 'matthew.davis@student.edu',
    password: 'student123',
    phone: '+1 (555) 567-8901',
    college: 'Law School',
    year: 'Sophomore',
    major: 'Pre-Law',
    joinDate: '2023-09-01',
    gpa: 3.7
  },
  {
    id: 'STU024',
    name: 'Olivia Wilson',
    email: 'olivia.wilson@student.edu',
    password: 'student123',
    phone: '+1 (555) 678-9012',
    college: 'Law School',
    year: 'Freshman',
    major: 'Political Science',
    joinDate: '2024-09-01',
    gpa: 3.8
  },
  {
    id: 'STU025',
    name: 'Joshua Brown',
    email: 'joshua.brown@student.edu',
    password: 'student123',
    phone: '+1 (555) 789-0123',
    college: 'Law School',
    year: 'Senior',
    major: 'Law',
    joinDate: '2021-09-01',
    gpa: 3.5
  },

  // Additional students for other colleges (25 more)
  // Agriculture (5)
  {
    id: 'STU026',
    name: 'Hannah Miller',
    email: 'hannah.miller@student.edu',
    password: 'student123',
    phone: '+1 (555) 890-1234',
    college: 'Agriculture',
    year: 'Junior',
    major: 'Agricultural Engineering',
    joinDate: '2022-09-01',
    gpa: 3.6
  },
  {
    id: 'STU027',
    name: 'Andrew Jones',
    email: 'andrew.jones@student.edu',
    password: 'student123',
    phone: '+1 (555) 901-2345',
    college: 'Agriculture',
    year: 'Senior',
    major: 'Crop Science',
    joinDate: '2021-09-01',
    gpa: 3.7
  },
  {
    id: 'STU028',
    name: 'Samantha Garcia',
    email: 'samantha.garcia@student.edu',
    password: 'student123',
    phone: '+1 (555) 012-3456',
    college: 'Agriculture',
    year: 'Sophomore',
    major: 'Animal Science',
    joinDate: '2023-09-01',
    gpa: 3.8
  },
  {
    id: 'STU029',
    name: 'Ryan Martinez',
    email: 'ryan.martinez@student.edu',
    password: 'student123',
    phone: '+1 (555) 123-4567',
    college: 'Agriculture',
    year: 'Freshman',
    major: 'Environmental Science',
    joinDate: '2024-09-01',
    gpa: 3.9
  },
  {
    id: 'STU030',
    name: 'Nicole Anderson',
    email: 'nicole.anderson@student.edu',
    password: 'student123',
    phone: '+1 (555) 234-5678',
    college: 'Agriculture',
    year: 'Junior',
    major: 'Food Science',
    joinDate: '2022-09-01',
    gpa: 3.5
  },

  // Fine Arts (5)
  {
    id: 'STU031',
    name: 'Tyler Thomas',
    email: 'tyler.thomas@student.edu',
    password: 'student123',
    phone: '+1 (555) 345-6789',
    college: 'Fine Arts',
    year: 'Senior',
    major: 'Studio Art',
    joinDate: '2021-09-01',
    gpa: 3.8
  },
  {
    id: 'STU032',
    name: 'Megan Jackson',
    email: 'megan.jackson@student.edu',
    password: 'student123',
    phone: '+1 (555) 456-7890',
    college: 'Fine Arts',
    year: 'Junior',
    major: 'Music',
    joinDate: '2022-09-01',
    gpa: 3.7
  },
  {
    id: 'STU033',
    name: 'Brandon White',
    email: 'brandon.white@student.edu',
    password: 'student123',
    phone: '+1 (555) 567-8901',
    college: 'Fine Arts',
    year: 'Sophomore',
    major: 'Theater',
    joinDate: '2023-09-01',
    gpa: 3.6
  },
  {
    id: 'STU034',
    name: 'Stephanie Harris',
    email: 'stephanie.harris@student.edu',
    password: 'student123',
    phone: '+1 (555) 678-9012',
    college: 'Fine Arts',
    year: 'Freshman',
    major: 'Dance',
    joinDate: '2024-09-01',
    gpa: 3.9
  },
  {
    id: 'STU035',
    name: 'Justin Clark',
    email: 'justin.clark@student.edu',
    password: 'student123',
    phone: '+1 (555) 789-0123',
    college: 'Fine Arts',
    year: 'Senior',
    major: 'Film Studies',
    joinDate: '2021-09-01',
    gpa: 3.4
  },

  // Education (5)
  {
    id: 'STU036',
    name: 'Brittany Lewis',
    email: 'brittany.lewis@student.edu',
    password: 'student123',
    phone: '+1 (555) 890-1234',
    college: 'Education',
    year: 'Junior',
    major: 'Elementary Education',
    joinDate: '2022-09-01',
    gpa: 3.8
  },
  {
    id: 'STU037',
    name: 'Jordan Robinson',
    email: 'jordan.robinson@student.edu',
    password: 'student123',
    phone: '+1 (555) 901-2345',
    college: 'Education',
    year: 'Senior',
    major: 'Secondary Education',
    joinDate: '2021-09-01',
    gpa: 3.6
  },
  {
    id: 'STU038',
    name: 'Kayla Walker',
    email: 'kayla.walker@student.edu',
    password: 'student123',
    phone: '+1 (555) 012-3456',
    college: 'Education',
    year: 'Sophomore',
    major: 'Special Education',
    joinDate: '2023-09-01',
    gpa: 3.9
  },
  {
    id: 'STU039',
    name: 'Nathan Hall',
    email: 'nathan.hall@student.edu',
    password: 'student123',
    phone: '+1 (555) 123-4567',
    college: 'Education',
    year: 'Freshman',
    major: 'Educational Psychology',
    joinDate: '2024-09-01',
    gpa: 3.7
  },
  {
    id: 'STU040',
    name: 'Courtney Allen',
    email: 'courtney.allen@student.edu',
    password: 'student123',
    phone: '+1 (555) 234-5678',
    college: 'Education',
    year: 'Junior',
    major: 'Curriculum & Instruction',
    joinDate: '2022-09-01',
    gpa: 3.5
  },

  // Nursing (5)
  {
    id: 'STU041',
    name: 'Victoria Young',
    email: 'victoria.young@student.edu',
    password: 'student123',
    phone: '+1 (555) 345-6789',
    college: 'Nursing',
    year: 'Senior',
    major: 'Nursing',
    joinDate: '2021-09-01',
    gpa: 3.8
  },
  {
    id: 'STU042',
    name: 'Trevor Hernandez',
    email: 'trevor.hernandez@student.edu',
    password: 'student123',
    phone: '+1 (555) 456-7890',
    college: 'Nursing',
    year: 'Junior',
    major: 'Nursing',
    joinDate: '2022-09-01',
    gpa: 3.7
  },
  {
    id: 'STU043',
    name: 'Jasmine King',
    email: 'jasmine.king@student.edu',
    password: 'student123',
    phone: '+1 (555) 567-8901',
    college: 'Nursing',
    year: 'Sophomore',
    major: 'Pre-Nursing',
    joinDate: '2023-09-01',
    gpa: 3.9
  },
  {
    id: 'STU044',
    name: 'Cameron Wright',
    email: 'cameron.wright@student.edu',
    password: 'student123',
    phone: '+1 (555) 678-9012',
    college: 'Nursing',
    year: 'Freshman',
    major: 'Health Sciences',
    joinDate: '2024-09-01',
    gpa: 3.6
  },
  {
    id: 'STU045',
    name: 'Alexis Lopez',
    email: 'alexis.lopez@student.edu',
    password: 'student123',
    phone: '+1 (555) 789-0123',
    college: 'Nursing',
    year: 'Senior',
    major: 'Nursing',
    joinDate: '2021-09-01',
    gpa: 3.8
  },

  // Main Campus (5)
  {
    id: 'STU046',
    name: 'Austin Hill',
    email: 'austin.hill@student.edu',
    password: 'student123',
    phone: '+1 (555) 890-1234',
    college: 'Main Campus',
    year: 'Junior',
    major: 'General Studies',
    joinDate: '2022-09-01',
    gpa: 3.5
  },
  {
    id: 'STU047',
    name: 'Morgan Scott',
    email: 'morgan.scott@student.edu',
    password: 'student123',
    phone: '+1 (555) 901-2345',
    college: 'Main Campus',
    year: 'Senior',
    major: 'Liberal Arts',
    joinDate: '2021-09-01',
    gpa: 3.7
  },
  {
    id: 'STU048',
    name: 'Taylor Green',
    email: 'taylor.green@student.edu',
    password: 'student123',
    phone: '+1 (555) 012-3456',
    college: 'Main Campus',
    year: 'Sophomore',
    major: 'Undecided',
    joinDate: '2023-09-01',
    gpa: 3.6
  },
  {
    id: 'STU049',
    name: 'Blake Adams',
    email: 'blake.adams@student.edu',
    password: 'student123',
    phone: '+1 (555) 123-4567',
    college: 'Main Campus',
    year: 'Freshman',
    major: 'Exploratory',
    joinDate: '2024-09-01',
    gpa: 3.8
  },
  {
    id: 'STU050',
    name: 'Sydney Baker',
    email: 'sydney.baker@student.edu',
    password: 'student123',
    phone: '+1 (555) 234-5678',
    college: 'Main Campus',
    year: 'Junior',
    major: 'Interdisciplinary Studies',
    joinDate: '2022-09-01',
    gpa: 3.9
  }
];

// Detailed Mock Events with Rich Information
export const mockDetailedEvents: DetailedEvent[] = [
  {
    id: 'EVT001',
    title: 'AI & Machine Learning Summit 2024',
    description: 'Join industry leaders and researchers as they explore the latest breakthroughs in artificial intelligence and machine learning. This comprehensive summit features keynote presentations, hands-on workshops, and networking opportunities with top tech companies.',
    date: '2024-12-30',
    time: '09:00',
    location: 'Engineering Auditorium',
    type: 'Conference',
    college: 'Engineering',
    max_capacity: 300,
    current_registrations: 0,
    status: 'upcoming',
    created_by: 'engineering.admin@campus.edu',
    created_at: new Date().toISOString(),
    registration_deadline: '2024-12-25',
    requirements: 'Basic knowledge of programming preferred but not required',
    contact_email: 'ai-summit@campus.edu',
    contact_phone: '+1 (555) 876-5432',
    tags: ['AI', 'Machine Learning', 'Technology', 'Industry'],
    agenda: [
      '9:00 AM - Registration & Welcome Coffee',
      '10:00 AM - Keynote: Future of AI in Industry',
      '11:30 AM - Workshop: Introduction to Deep Learning',
      '1:00 PM - Lunch & Networking',
      '2:30 PM - Panel: Ethics in AI Development',
      '4:00 PM - Hands-on: Building ML Models',
      '5:30 PM - Closing Remarks & Certificates'
    ],
    speakers: ['Dr. Anna Kumar (Google AI)', 'Prof. Robert Lee (MIT)', 'Sarah Tech (OpenAI)'],
    certificates: true,
    fees: 0
  },
  {
    id: 'EVT002',
    title: 'Creative Arts & Culture Festival',
    description: 'Immerse yourself in a celebration of creativity, diversity, and cultural expression. This three-day festival showcases student artwork, performances, cultural exhibitions, and interactive workshops from around the world.',
    date: '2024-12-28',
    time: '14:00',
    location: 'Arts Center Main Hall',
    type: 'Cultural',
    college: 'Arts & Sciences',
    max_capacity: 500,
    current_registrations: 0,
    status: 'upcoming',
    created_by: 'arts.admin@campus.edu',
    created_at: new Date().toISOString(),
    registration_deadline: '2024-12-23',
    requirements: 'Open to all students and community members',
    contact_email: 'arts-festival@campus.edu',
    contact_phone: '+1 (555) 765-4321',
    tags: ['Arts', 'Culture', 'Festival', 'International', 'Student Life'],
    agenda: [
      '2:00 PM - Opening Ceremony',
      '2:30 PM - International Cultural Showcase',
      '4:00 PM - Student Art Exhibition Opening',
      '5:30 PM - Interactive Workshop Sessions',
      '7:00 PM - Evening Performance & Music',
      '9:00 PM - Cultural Food Fair'
    ],
    speakers: ['Local Artists Collective', 'International Students Association'],
    certificates: false,
    fees: 5
  },
  {
    id: 'EVT003',
    title: 'Entrepreneurship & Innovation Workshop',
    description: 'Learn the fundamentals of starting your own business in today\'s digital economy. This intensive workshop covers business planning, funding strategies, digital marketing, and features presentations from successful young entrepreneurs.',
    date: '2024-12-29',
    time: '10:00',
    location: 'Business School Conference Center',
    type: 'Workshop',
    college: 'Business School',
    max_capacity: 150,
    current_registrations: 0,
    status: 'upcoming',
    created_by: 'business.admin@campus.edu',
    created_at: new Date().toISOString(),
    registration_deadline: '2024-12-26',
    requirements: 'Bring a business idea or be prepared to develop one during the workshop',
    contact_email: 'entrepreneur@campus.edu',
    contact_phone: '+1 (555) 654-3210',
    tags: ['Business', 'Entrepreneurship', 'Innovation', 'Startup', 'Career'],
    agenda: [
      '10:00 AM - Welcome & Icebreaker',
      '10:30 AM - Business Idea Development',
      '12:00 PM - Lunch & Startup Showcase',
      '1:30 PM - Funding & Investment Strategies',
      '3:00 PM - Digital Marketing Basics',
      '4:30 PM - Pitch Practice Sessions',
      '6:00 PM - Final Presentations & Feedback'
    ],
    speakers: ['Jessica Startup (TechCorp CEO)', 'Mark Venture (Angel Investor)', 'Alex Digital (Marketing Expert)'],
    certificates: true,
    fees: 15
  },
  {
    id: 'EVT004',
    title: 'Campus Innovation Hackathon 2024',
    description: 'A 48-hour coding and innovation challenge where students collaborate to solve real campus and community problems. Teams will work with mentors from tech companies to develop prototypes and compete for prizes.',
    date: '2025-01-05',
    time: '18:00',
    location: 'Computer Science Building',
    type: 'Competition',
    college: 'Main Campus',
    max_capacity: 200,
    current_registrations: 0,
    status: 'upcoming',
    created_by: 'admin@campus.edu',
    created_at: new Date().toISOString(),
    registration_deadline: '2025-01-01',
    requirements: 'Teams of 3-5 students, at least one member with programming experience',
    contact_email: 'hackathon@campus.edu',
    contact_phone: '+1 (555) 987-6543',
    tags: ['Hackathon', 'Programming', 'Innovation', 'Competition', 'Technology'],
    agenda: [
      'Friday 6:00 PM - Opening Ceremony & Team Formation',
      'Friday 7:00 PM - Problem Statements Released',
      'Friday 8:00 PM - Hacking Begins',
      'Saturday All Day - Development & Mentoring',
      'Sunday 4:00 PM - Final Presentations',
      'Sunday 6:00 PM - Awards Ceremony'
    ],
    speakers: ['Industry Mentors from Google, Microsoft, Apple'],
    certificates: true,
    fees: 0
  },
  {
    id: 'EVT005',
    title: 'Sustainability & Climate Action Seminar',
    description: 'Explore the urgent challenges of climate change and discover practical solutions for sustainable living. This seminar features environmental scientists, policy experts, and student-led green initiatives.',
    date: '2024-12-27',
    time: '13:00',
    location: 'Main Auditorium',
    type: 'Seminar',
    college: 'Arts & Sciences',
    max_capacity: 250,
    current_registrations: 0,
    status: 'upcoming',
    created_by: 'arts.admin@campus.edu',
    created_at: new Date().toISOString(),
    registration_deadline: '2024-12-24',
    requirements: 'Interest in environmental issues and sustainability',
    contact_email: 'sustainability@campus.edu',
    contact_phone: '+1 (555) 765-4321',
    tags: ['Environment', 'Sustainability', 'Climate', 'Policy', 'Future'],
    agenda: [
      '1:00 PM - Registration & Welcome',
      '1:30 PM - Climate Science Update',
      '2:30 PM - Campus Sustainability Initiatives',
      '3:30 PM - Coffee Break',
      '4:00 PM - Policy Solutions Panel',
      '5:00 PM - Student Action Groups',
      '6:00 PM - Call to Action & Next Steps'
    ],
    speakers: ['Dr. Green Climate (Environmental Scientist)', 'Policy Expert Panel', 'Student Environmental Leaders'],
    certificates: false,
    fees: 0
  }
];

// Mock event registrations data
export const mockEventRegistrations = [
  // Registrations for AI & ML Summit (EVT001)
  { id: 'REG001', eventId: 'EVT001', studentEmail: 'john.smith@campus.edu', registeredAt: '2024-11-20T10:30:00Z' },
  { id: 'REG002', eventId: 'EVT001', studentEmail: 'jane.doe@campus.edu', registeredAt: '2024-11-20T11:15:00Z' },
  { id: 'REG003', eventId: 'EVT001', studentEmail: 'alex.johnson@campus.edu', registeredAt: '2024-11-20T14:22:00Z' },
  { id: 'REG004', eventId: 'EVT001', studentEmail: 'sarah.williams@campus.edu', registeredAt: '2024-11-21T09:45:00Z' },
  { id: 'REG005', eventId: 'EVT001', studentEmail: 'mike.brown@campus.edu', registeredAt: '2024-11-21T16:33:00Z' },
  
  // Registrations for Cultural Heritage Festival (EVT002)
  { id: 'REG006', eventId: 'EVT002', studentEmail: 'emily.davis@campus.edu', registeredAt: '2024-11-18T12:00:00Z' },
  { id: 'REG007', eventId: 'EVT002', studentEmail: 'david.wilson@campus.edu', registeredAt: '2024-11-18T15:30:00Z' },
  { id: 'REG008', eventId: 'EVT002', studentEmail: 'lisa.miller@campus.edu', registeredAt: '2024-11-19T08:15:00Z' },
  { id: 'REG009', eventId: 'EVT002', studentEmail: 'chris.moore@campus.edu', registeredAt: '2024-11-19T11:45:00Z' },
  { id: 'REG010', eventId: 'EVT002', studentEmail: 'amanda.taylor@campus.edu', registeredAt: '2024-11-19T17:20:00Z' },
  { id: 'REG011', eventId: 'EVT002', studentEmail: 'kevin.anderson@campus.edu', registeredAt: '2024-11-20T10:10:00Z' },
  { id: 'REG012', eventId: 'EVT002', studentEmail: 'rachel.thomas@campus.edu', registeredAt: '2024-11-20T13:55:00Z' },
  
  // Registrations for Business Innovation Workshop (EVT003)
  { id: 'REG013', eventId: 'EVT003', studentEmail: 'daniel.jackson@campus.edu', registeredAt: '2024-11-17T09:30:00Z' },
  { id: 'REG014', eventId: 'EVT003', studentEmail: 'jessica.white@campus.edu', registeredAt: '2024-11-17T14:20:00Z' },
  { id: 'REG015', eventId: 'EVT003', studentEmail: 'matthew.harris@campus.edu', registeredAt: '2024-11-18T11:00:00Z' },
  { id: 'REG016', eventId: 'EVT003', studentEmail: 'ashley.martin@campus.edu', registeredAt: '2024-11-18T16:45:00Z' },
  
  // Registrations for Medical Research Symposium (EVT004)
  { id: 'REG017', eventId: 'EVT004', studentEmail: 'joshua.garcia@campus.edu', registeredAt: '2024-11-16T08:15:00Z' },
  { id: 'REG018', eventId: 'EVT004', studentEmail: 'stephanie.martinez@campus.edu', registeredAt: '2024-11-16T12:30:00Z' },
  { id: 'REG019', eventId: 'EVT004', studentEmail: 'andrew.rodriguez@campus.edu', registeredAt: '2024-11-17T10:45:00Z' },
  { id: 'REG020', eventId: 'EVT004', studentEmail: 'michelle.lewis@campus.edu', registeredAt: '2024-11-17T15:20:00Z' },
  { id: 'REG021', eventId: 'EVT004', studentEmail: 'tyler.lee@campus.edu', registeredAt: '2024-11-18T09:30:00Z' },
  { id: 'REG022', eventId: 'EVT004', studentEmail: 'nicole.walker@campus.edu', registeredAt: '2024-11-18T14:15:00Z' },
  { id: 'REG023', eventId: 'EVT004', studentEmail: 'brandon.hall@campus.edu', registeredAt: '2024-11-19T11:00:00Z' },
  { id: 'REG024', eventId: 'EVT004', studentEmail: 'samantha.allen@campus.edu', registeredAt: '2024-11-19T16:40:00Z' },
  
  // Registrations for Art & Design Exhibition (EVT005)
  { id: 'REG025', eventId: 'EVT005', studentEmail: 'jason.young@campus.edu', registeredAt: '2024-11-15T13:20:00Z' },
  { id: 'REG026', eventId: 'EVT005', studentEmail: 'megan.hernandez@campus.edu', registeredAt: '2024-11-15T17:45:00Z' },
  { id: 'REG027', eventId: 'EVT005', studentEmail: 'jonathan.king@campus.edu', registeredAt: '2024-11-16T10:30:00Z' },
  { id: 'REG028', eventId: 'EVT005', studentEmail: 'brittany.wright@campus.edu', registeredAt: '2024-11-16T14:55:00Z' },
  { id: 'REG029', eventId: 'EVT005', studentEmail: 'robert.lopez@campus.edu', registeredAt: '2024-11-17T09:15:00Z' },
  
  // Additional registrations for various events to create realistic diversity
  { id: 'REG030', eventId: 'EVT001', studentEmail: 'anthony.hill@campus.edu', registeredAt: '2024-11-22T08:00:00Z' },
  { id: 'REG031', eventId: 'EVT001', studentEmail: 'kimberly.green@campus.edu', registeredAt: '2024-11-22T12:30:00Z' },
  { id: 'REG032', eventId: 'EVT002', studentEmail: 'jacob.adams@campus.edu', registeredAt: '2024-11-21T14:15:00Z' },
  { id: 'REG033', eventId: 'EVT003', studentEmail: 'lauren.baker@campus.edu', registeredAt: '2024-11-19T10:45:00Z' },
  { id: 'REG034', eventId: 'EVT004', studentEmail: 'ryan.gonzalez@campus.edu', registeredAt: '2024-11-20T16:20:00Z' },
  { id: 'REG035', eventId: 'EVT005', studentEmail: 'crystal.nelson@campus.edu', registeredAt: '2024-11-18T11:30:00Z' }
];

// Function to initialize all mock data
export const initializeEnhancedMockData = (): void => {
  // Initialize admin data
  localStorage.setItem('mock_admins', JSON.stringify(mockAdmins));
  
  // Initialize student data  
  localStorage.setItem('mock_students_enhanced', JSON.stringify(mockStudents));
  
  // Initialize detailed events (only if no events exist)
  const existingEvents = localStorage.getItem('admin_events');
  if (!existingEvents || JSON.parse(existingEvents).length === 0) {
    localStorage.setItem('admin_events', JSON.stringify(mockDetailedEvents));
  }
  
  // Initialize event registrations (only if no registrations exist)
  const existingRegistrations = localStorage.getItem('event_registrations');
  if (!existingRegistrations || JSON.parse(existingRegistrations).length === 0) {
    localStorage.setItem('event_registrations', JSON.stringify(mockEventRegistrations));
  }
  
  console.log('Enhanced mock data initialized with:');
  console.log('- Admins:', JSON.parse(localStorage.getItem('mock_admins') || '[]').length);
  console.log('- Students:', JSON.parse(localStorage.getItem('mock_students_enhanced') || '[]').length);
  console.log('- Events:', JSON.parse(localStorage.getItem('admin_events') || '[]').length);
  console.log('- Registrations:', JSON.parse(localStorage.getItem('event_registrations') || '[]').length);
};

// Function to get admin by email
export const getAdminByEmail = (email: string): EnhancedAdminData | null => {
  const admins = JSON.parse(localStorage.getItem('mock_admins') || '[]');
  return admins.find((admin: EnhancedAdminData) => admin.email === email) || null;
};

// Function to get student by email
export const getStudentByEmail = (email: string): EnhancedStudentData | null => {
  const students = JSON.parse(localStorage.getItem('mock_students_enhanced') || '[]');
  return students.find((student: EnhancedStudentData) => student.email === email) || null;
};
