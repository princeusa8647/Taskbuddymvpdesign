import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useApp } from '../context/AppContext';
import { ArrowLeft, MapPin, Calendar, Phone, AlertTriangle, Shield } from 'lucide-react';
import { toast } from 'sonner';

export function Meetup() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, currentUser } = useApp();
  const [safetyMode, setSafetyMode] = useState(false);

  const job = jobs.find(j => j.id === jobId);

  if (!job || !job.quote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Meetup details not available</p>
      </div>
    );
  }

  const handleEmergencyCall = () => {
    toast.info('Calling Emergency Services (112)...');
    window.location.href = 'tel:112';
  };

  const handleReportUser = () => {
    toast.success('User reported. Our team will review this case.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">Meetup Details</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Safety Alert */}
        <Alert className="bg-orange-50 border-orange-200">
          <Shield className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Always meet in public places for your safety. Avoid sharing personal address.
          </AlertDescription>
        </Alert>

        {/* Meetup Info */}
        <Card>
          <CardHeader>
            <CardTitle>Meetup Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <MapPin size={16} />
                <span>Location</span>
              </div>
              <div className="font-semibold text-lg">{job.quote.meetupLocation}</div>
              <p className="text-sm text-gray-600 mt-1">
                Make sure this is a public, well-lit area
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Calendar size={16} />
                <span>Date & Time</span>
              </div>
              <div className="font-semibold text-lg">
                {new Date(job.quote.deliveryDate).toLocaleString()}
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Meeting Partner</h4>
              <div className="text-sm">
                <div className="font-semibold">
                  {currentUser?.role === 'customer' ? job.providerName : job.customerName}
                </div>
                <div className="text-gray-600 mt-1">
                  {currentUser?.role === 'customer' ? 'Provider' : 'Customer'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Mode */}
        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} />
              Safety Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="safety-mode" className="text-base">Enable Safety Mode</Label>
                <p className="text-xs text-gray-600 mt-1">
                  Quick access to emergency features
                </p>
              </div>
              <Switch
                id="safety-mode"
                checked={safetyMode}
                onCheckedChange={setSafetyMode}
              />
            </div>

            {safetyMode && (
              <div className="space-y-3 pt-3 border-t">
                <Button
                  onClick={handleEmergencyCall}
                  variant="destructive"
                  className="w-full"
                >
                  <Phone className="mr-2" size={18} />
                  Emergency Call (112)
                </Button>

                <Button
                  onClick={handleReportUser}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                >
                  <AlertTriangle className="mr-2" size={18} />
                  Report User
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Safety Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Meet in public places like college gates, metro stations, or cafes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Inform a friend or family member about the meetup</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Verify the work quality before making payment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Keep your phone charged and accessible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">✗</span>
                <span>Never share your home address</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(job.quote.meetupLocation)}`)}
            variant="outline"
            className="flex-1"
          >
            <MapPin className="mr-2" size={18} />
            Open in Maps
          </Button>
          <Button
            onClick={() => navigate(`/chat/${jobId}`)}
            variant="outline"
            className="flex-1"
          >
            Message
          </Button>
        </div>
      </div>
    </div>
  );
}
