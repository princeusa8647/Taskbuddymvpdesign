import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useApp, JobStatus } from '../../context/AppContext';
import { ArrowLeft, Calendar, MessageCircle, Send, MapPin } from 'lucide-react';
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

export function ProviderJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJobStatus, currentUser } = useApp();

  const [quotePrice, setQuotePrice] = useState('');
  const [quoteDelivery, setQuoteDelivery] = useState('');
  const [quoteMeetup, setQuoteMeetup] = useState('');
  const [quoteMessage, setQuoteMessage] = useState('');
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);

  const job = jobs.find(j => j.id === id);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Job not found</p>
      </div>
    );
  }

  const handleSendQuote = () => {
    if (!quotePrice || !quoteDelivery || !quoteMeetup) {
      toast.error('Please fill all required fields');
      return;
    }

    // Assign provider to job if not already assigned
    const quote = {
      price: parseFloat(quotePrice),
      deliveryDate: quoteDelivery,
      meetupLocation: quoteMeetup,
      message: quoteMessage,
    };

    updateJobStatus(job.id, 'QUOTED', quote);
    
    // Also update providerId (in real app, this would be handled in backend)
    if (!job.providerId) {
      job.providerId = currentUser?.id;
    }

    setShowQuoteDialog(false);
    toast.success('Quote sent successfully!');
  };

  const handleUpdateStatus = (newStatus: JobStatus) => {
    updateJobStatus(job.id, newStatus);
    toast.success(`Job status updated to ${newStatus.replace(/_/g, ' ')}`);
  };

  const canSendQuote = job.status === 'REQUESTED' && !job.providerId;
  const canUpdateStatus = job.providerId === currentUser?.id;

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
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Current Status</span>
              <Badge className={statusColors[job.status]}>
                {job.status.replace(/_/g, ' ')}
              </Badge>
            </div>

            {canUpdateStatus && job.status !== 'COMPLETED' && (
              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select onValueChange={(value) => handleUpdateStatus(value as JobStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    {job.status === 'CONFIRMED' && (
                      <SelectItem value="IN_PROGRESS">Mark In Progress</SelectItem>
                    )}
                    {job.status === 'IN_PROGRESS' && (
                      <SelectItem value="READY_FOR_MEET">Mark Ready for Meetup</SelectItem>
                    )}
                    {job.status === 'READY_FOR_MEET' && (
                      <SelectItem value="DELIVERED">Mark Delivered</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white">
                {job.customerName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{job.customerName}</div>
                <div className="text-sm text-gray-600">Student</div>
              </div>
              {job.providerId === currentUser?.id && (
                <Link to={`/chat/${job.id}`}>
                  <Button size="sm" variant="outline">
                    <MessageCircle size={16} className="mr-1" />
                    Chat
                  </Button>
                </Link>
              )}
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
                <div className="text-sm text-gray-600 mb-1">Budget</div>
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

        {/* Quote Info (if exists) */}
        {job.quote && (
          <Card>
            <CardHeader>
              <CardTitle>Your Quote</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Price</div>
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
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {canSendQuote && (
          <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Send className="mr-2" size={18} />
                Send Quote
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Quote</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Final Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="500"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery">Delivery Date & Time *</Label>
                  <Input
                    id="delivery"
                    type="datetime-local"
                    value={quoteDelivery}
                    onChange={(e) => setQuoteDelivery(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meetup">Meetup Location *</Label>
                  <Input
                    id="meetup"
                    placeholder="e.g., College Gate, Metro Station"
                    value={quoteMeetup}
                    onChange={(e) => setQuoteMeetup(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Additional details..."
                    value={quoteMessage}
                    onChange={(e) => setQuoteMessage(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleSendQuote} className="w-full">
                  Send Quote
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {job.status === 'READY_FOR_MEET' && (
          <Link to={`/meetup/${job.id}`}>
            <Button className="w-full">
              <MapPin className="mr-2" size={18} />
              View Meetup Details
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
