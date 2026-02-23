import { Link } from 'react-router';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useApp, JobStatus } from '../../context/AppContext';
import { Calendar, ArrowRight, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const statusColors: { [key in JobStatus]: string } = {
  'REQUESTED': 'bg-blue-100 text-blue-700',
  'QUOTED': 'bg-yellow-100 text-yellow-700',
  'CONFIRMED': 'bg-green-100 text-green-700',
  'IN_PROGRESS': 'bg-purple-100 text-purple-700',
  'READY_FOR_MEET': 'bg-orange-100 text-orange-700',
  'DELIVERED': 'bg-indigo-100 text-indigo-700',
  'COMPLETED': 'bg-gray-100 text-gray-700',
};

export function ProviderDashboard() {
  const { jobs, currentUser } = useApp();
  
  const myJobs = jobs.filter(job => 
    job.providerId === currentUser?.id || 
    (job.status === 'REQUESTED' && !job.providerId)
  );
  
  const newRequests = myJobs.filter(job => job.status === 'REQUESTED');
  const activeJobs = myJobs.filter(job => 
    ['QUOTED', 'CONFIRMED', 'IN_PROGRESS', 'READY_FOR_MEET', 'DELIVERED'].includes(job.status)
  );
  const completedJobs = myJobs.filter(job => job.status === 'COMPLETED');

  const JobCard = ({ job }: { job: any }) => (
    <Link to={`/provider/job/${job.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{job.workType}</h3>
              <p className="text-sm text-gray-600">{job.subject}</p>
            </div>
            <Badge className={statusColors[job.status]}>
              {job.status.replace(/_/g, ' ')}
            </Badge>
          </div>

          <p className="text-sm text-gray-700 line-clamp-2 mb-3">
            {job.description}
          </p>

          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar size={14} />
              <span>{new Date(job.deadline).toLocaleDateString()}</span>
            </div>
            <span className="text-gray-600">
              {job.quantity} pages
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-sm text-gray-600">
              {job.budget ? `Budget: ₹${job.budget}` : 'Budget not specified'}
            </span>
            <div className="flex items-center gap-1 text-blue-600">
              <span>View</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Verification Status */}
        {currentUser?.status === 'PENDING_VERIFICATION' && (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Your profile is under review. You'll be notified once verified.
            </AlertDescription>
          </Alert>
        )}

        {currentUser?.status === 'VERIFIED' && currentUser?.verified && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your profile is verified! You can now receive work requests.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Manage your jobs</p>
          </div>
          {currentUser?.verified && (
            <Badge className="bg-green-500 text-white">
              <CheckCircle2 size={14} className="mr-1" />
              Verified
            </Badge>
          )}
        </div>

        <Tabs defaultValue="new" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="new">
              New ({newRequests.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeJobs.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Done ({completedJobs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-3 mt-4">
            {newRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">No new requests</p>
                </CardContent>
              </Card>
            ) : (
              newRequests.map(job => <JobCard key={job.id} job={job} />)
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-3 mt-4">
            {activeJobs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">No active jobs</p>
                </CardContent>
              </Card>
            ) : (
              activeJobs.map(job => <JobCard key={job.id} job={job} />)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3 mt-4">
            {completedJobs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">No completed jobs yet</p>
                </CardContent>
              </Card>
            ) : (
              completedJobs.map(job => <JobCard key={job.id} job={job} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
