import { useParams, useNavigate, Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useApp, JobStatus } from '../../context/AppContext';
import { ArrowLeft, Calendar, MessageCircle, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const statusColors: { [key in JobStatus]: string } = {
  'REQUESTED': 'bg-blue-100 text-blue-700',
  'QUOTED': 'bg-yellow-100 text-yellow-700',
  'CONFIRMED': 'bg-green-100 text-green-700',
  'IN_PROGRESS': 'bg-purple-100 text-purple-700',
  'READY_FOR_MEET': 'bg-orange-100 text-orange-700',
  'DELIVERED': 'bg-indigo-100 text-indigo-700',
  'COMPLETED': 'bg-gray-100 text-gray-700',
};

export function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJobStatus, providers } = useApp();

  const job = jobs.find(j => j.id === id);
  const provider = job?.providerId ? providers.find(p => p.id === job.providerId) : null;

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Job not found</p>
      </div>
    );
  }

  const handleAcceptQuote = () => {
    updateJobStatus(job.id, 'CONFIRMED');
    toast.success('Quote accepted! Deal confirmed.');
  };

  const handleRejectQuote = () => {
    updateJobStatus(job.id, 'REQUESTED');
    toast.info('Quote rejected. Request sent back to pending.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">Job Details</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Status */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status</span>
              <Badge className={statusColors[job.status]}>
                {job.status.replace(/_/g, ' ')}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Job Info */}
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">Work Type</div>
              <div className="font-semibold">{job.workType}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Subject</div>
              <div className="font-semibold">{job.subject}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Description</div>
              <div className="text-gray-700">{job.description}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Quantity</div>
                <div className="font-semibold">{job.quantity} pages</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Your Budget</div>
                <div className="font-semibold">
                  {job.budget ? `₹${job.budget}` : 'Not specified'}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Deadline</div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{new Date(job.deadline).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider Info */}
        {provider && (
          <Card>
            <CardHeader>
              <CardTitle>Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white">
                  {provider.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{provider.name}</div>
                  <div className="text-sm text-gray-600">{provider.area}</div>
                </div>
                <Link to={`/chat/${job.id}`}>
                  <Button size="sm" variant="outline">
                    <MessageCircle size={16} className="mr-1" />
                    Chat
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quote */}
        {job.quote && (
          <Card className="border-2 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Quote Received
                {job.status === 'QUOTED' && (
                  <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Final Price</div>
                <div className="text-2xl font-bold text-green-600">₹{job.quote.price}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Delivery Date</div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{new Date(job.quote.deliveryDate).toLocaleString()}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Meetup Location</div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{job.quote.meetupLocation}</span>
                </div>
              </div>
              {job.quote.message && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Message</div>
                  <div className="text-gray-700">{job.quote.message}</div>
                </div>
              )}

              {job.status === 'QUOTED' && (
                <div className="flex gap-2 pt-3">
                  <Button onClick={handleAcceptQuote} className="flex-1 bg-green-600 hover:bg-green-700">
                    <CheckCircle2 size={18} className="mr-2" />
                    Accept Deal
                  </Button>
                  <Button onClick={handleRejectQuote} variant="outline" className="flex-1">
                    <XCircle size={18} className="mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions based on status */}
        {job.status === 'READY_FOR_MEET' && (
          <Link to={`/meetup/${job.id}`}>
            <Button className="w-full">
              <MapPin className="mr-2" size={18} />
              View Meetup Details
            </Button>
          </Link>
        )}

        {job.status === 'DELIVERED' && (
          <Link to={`/rating/${job.id}`}>
            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              Rate & Review
            </Button>
          </Link>
        )}

        {/* Chat Button */}
        {job.providerId && job.status !== 'REQUESTED' && (
          <Link to={`/chat/${job.id}`}>
            <Button variant="outline" className="w-full">
              <MessageCircle className="mr-2" size={18} />
              Open Chat
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
