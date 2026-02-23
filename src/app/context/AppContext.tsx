import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'customer' | 'provider' | 'admin';
export type JobStatus = 'REQUESTED' | 'QUOTED' | 'CONFIRMED' | 'IN_PROGRESS' | 'READY_FOR_MEET' | 'DELIVERED' | 'COMPLETED';
export type ProviderStatus = 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  name: string;
  email?: string;
  state?: string;
  district?: string;
  city?: string;
  area?: string;
  profileComplete: boolean;
  // Provider specific
  profession?: string;
  instituteName?: string;
  course?: string;
  providerRole?: 'Writer' | 'Artist';
  expertise?: string[];
  startingPrice?: number;
  bio?: string;
  samples?: string[];
  idProof?: string;
  status?: ProviderStatus;
  verified?: boolean;
  rating?: number;
  totalReviews?: number;
  latitude?: number;
  longitude?: number;
}

export interface Job {
  id: string;
  customerId: string;
  providerId?: string;
  workType: string;
  subject: string;
  description: string;
  quantity: number;
  deadline: string;
  budget?: number;
  attachments?: string[];
  status: JobStatus;
  quote?: Quote;
  createdAt: string;
  customerName: string;
  providerName?: string;
  providerPhoto?: string;
}

export interface Quote {
  price: number;
  deliveryDate: string;
  meetupLocation: string;
  message?: string;
}

export interface Message {
  id: string;
  jobId: string;
  senderId: string;
  text?: string;
  image?: string;
  timestamp: string;
  type: 'user' | 'system';
}

export interface Review {
  id: string;
  jobId: string;
  providerId: string;
  customerId: string;
  rating: number;
  text: string;
  tags: string[];
  createdAt: string;
  customerName: string;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  providers: User[];
  jobs: Job[];
  messages: { [jobId: string]: Message[] };
  reviews: Review[];
  loginWithOTP: (phone: string, otp: string) => Promise<User | null>;
  updateUserProfile: (updates: Partial<User>) => void;
  createJob: (job: Omit<Job, 'id' | 'createdAt' | 'status' | 'customerName'>) => Job;
  updateJobStatus: (jobId: string, status: JobStatus, quote?: Quote) => void;
  sendMessage: (jobId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  submitReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getNearbyProviders: (role?: 'Writer' | 'Artist', filters?: any) => User[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockProviders: User[] = [
  {
    id: 'p1',
    phone: '+919876543210',
    role: 'provider',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    city: 'Mumbai',
    area: 'Andheri West',
    profileComplete: true,
    profession: 'Student',
    instituteName: 'Mumbai University',
    course: 'B.Sc Computer Science',
    providerRole: 'Writer',
    expertise: ['Diagrams', 'Lab Records', 'Notes'],
    startingPrice: 50,
    bio: 'Experienced in creating neat diagrams and lab records. Fast turnaround time.',
    samples: ['https://images.unsplash.com/photo-1455390582262-044cdead277a', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b', 'https://images.unsplash.com/photo-1586281380349-632531db7ed4'],
    status: 'VERIFIED',
    verified: true,
    rating: 4.8,
    totalReviews: 42,
    latitude: 19.1136,
    longitude: 72.8697,
  },
  {
    id: 'p2',
    phone: '+919876543211',
    role: 'provider',
    name: 'Rahul Verma',
    email: 'rahul@example.com',
    city: 'Mumbai',
    area: 'Bandra',
    profileComplete: true,
    profession: 'Student',
    instituteName: 'IIT Bombay',
    course: 'B.Tech Mechanical',
    providerRole: 'Artist',
    expertise: ['Diagrams', 'Charts', 'Project Formatting'],
    startingPrice: 75,
    bio: 'Specializing in technical drawings and engineering diagrams. Precision guaranteed.',
    samples: ['https://images.unsplash.com/photo-1517842645767-c639042777db', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b', 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23'],
    status: 'VERIFIED',
    verified: true,
    rating: 4.9,
    totalReviews: 38,
    latitude: 19.0596,
    longitude: 72.8295,
  },
  {
    id: 'p3',
    phone: '+919876543212',
    role: 'provider',
    name: 'Anjali Patel',
    email: 'anjali@example.com',
    city: 'Mumbai',
    area: 'Powai',
    profileComplete: true,
    profession: 'Housewife',
    providerRole: 'Writer',
    expertise: ['Assignments', 'Notes', 'Lab Records'],
    startingPrice: 40,
    bio: 'Patient and detail-oriented. Perfect handwriting for notes and assignments.',
    samples: ['https://images.unsplash.com/photo-1501504905252-473c47e087f8', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b'],
    status: 'PENDING_VERIFICATION',
    verified: false,
    rating: 0,
    totalReviews: 0,
    latitude: 19.1197,
    longitude: 72.9078,
  },
  {
    id: 'p4',
    phone: '+919876543213',
    role: 'provider',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    city: 'Mumbai',
    area: 'Goregaon',
    profileComplete: true,
    profession: 'Job',
    providerRole: 'Artist',
    expertise: ['Charts', 'Diagrams'],
    startingPrice: 60,
    bio: 'Quick delivery and professional quality diagrams.',
    samples: ['https://images.unsplash.com/photo-1434030216411-0b793f4b4173', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40'],
    status: 'VERIFIED',
    verified: true,
    rating: 4.7,
    totalReviews: 25,
    latitude: 19.1546,
    longitude: 72.8492,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [providers] = useState<User[]>(mockProviders);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [messages, setMessages] = useState<{ [jobId: string]: Message[] }>({});
  const [reviews, setReviews] = useState<Review[]>([]);

  const loginWithOTP = async (phone: string, otp: string): Promise<User | null> => {
    // Mock OTP verification (in real app, verify with backend)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists
    const existingUser = providers.find(p => p.phone === phone);
    if (existingUser) {
      return existingUser;
    }
    
    // New user - return minimal user object
    return {
      id: `user_${Date.now()}`,
      phone,
      role: 'customer',
      name: '',
      profileComplete: false,
    };
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const createJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'status' | 'customerName'>): Job => {
    const newJob: Job = {
      ...jobData,
      id: `job_${Date.now()}`,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
      customerName: currentUser?.name || 'Unknown',
    };
    setJobs([...jobs, newJob]);
    return newJob;
  };

  const updateJobStatus = (jobId: string, status: JobStatus, quote?: Quote) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        return { ...job, status, ...(quote && { quote }) };
      }
      return job;
    }));

    // Add system message
    if (quote) {
      sendMessage(jobId, {
        jobId,
        senderId: 'system',
        text: `Quote sent: ₹${quote.price} - Delivery: ${new Date(quote.deliveryDate).toLocaleDateString()}`,
        type: 'system',
      });
    } else if (status === 'CONFIRMED') {
      sendMessage(jobId, {
        jobId,
        senderId: 'system',
        text: 'Deal confirmed! Work will begin soon.',
        type: 'system',
      });
    }
  };

  const sendMessage = (jobId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => ({
      ...prev,
      [jobId]: [...(prev[jobId] || []), newMessage],
    }));
  };

  const submitReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReviews([...reviews, newReview]);
    
    // Update job status to COMPLETED
    updateJobStatus(reviewData.jobId, 'COMPLETED');
  };

  const getNearbyProviders = (role?: 'Writer' | 'Artist', filters?: any) => {
    let filtered = providers.filter(p => p.role === 'provider' && p.profileComplete);
    
    if (role) {
      filtered = filtered.filter(p => p.providerRole === role);
    }
    
    if (filters?.verified) {
      filtered = filtered.filter(p => p.verified);
    }
    
    // Sort by distance (mock), rating, and verified status
    filtered.sort((a, b) => {
      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;
      return (b.rating || 0) - (a.rating || 0);
    });
    
    return filtered;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        providers,
        jobs,
        messages,
        reviews,
        loginWithOTP,
        updateUserProfile,
        createJob,
        updateJobStatus,
        sendMessage,
        submitReview,
        getNearbyProviders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
