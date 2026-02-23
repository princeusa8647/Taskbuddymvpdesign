import { Link } from 'react-router';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useApp, JobStatus } from '../../context/AppContext';
import { Calendar, ArrowRight } from 'lucide-react';

const statusColors: { [key in JobStatus]: string } = {
  'REQUESTED': 'bg-blue-100 text-blue-700',
  'QUOTED': 'bg-yellow-100 text-yellow-700',
  'CONFIRMED': 'bg-green-100 text-green-700',
  'IN_PROGRESS': 'bg-purple-100 text-purple-700',
  'READY_FOR_MEET': 'bg-orange-100 text-orange-700',
  'DELIVERED': 'bg-indigo-100 text-indigo-700',
  'COMPLETED': 'bg-gray-100 text-gray-700',
};

export function MyJobs() {
  const { jobs, currentUser } = useApp();
  
  const myJobs = jobs.filter(job => job.customerId === currentUser?.id);
  const activeJobs = myJobs.filter(job => 
    !['COMPLETED'].includes(job.status)
  );
  const completedJobs = myJobs.filter(job => job.status === 'COMPLETED');

  const JobCard = ({ job }: { job: any }) => (
    <Link to={`/customer/job/${job.id}`}>
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

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar size={14} />
              <span>{new Date(job.deadline).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600">
              <span>View Details</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {job.quote && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Quoted Price:</span>
                <span className="font-semibold text-green-600">₹{job.quote.price}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">My Jobs</h1>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="active">
              Active ({activeJobs.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedJobs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3 mt-4">
            {activeJobs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 mb-4">No active jobs</p>
                  <Link to="/customer/create-request">
                    <span className="text-blue-600 hover:underline">
                      Create your first work request
                    </span>
                  </Link>
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
