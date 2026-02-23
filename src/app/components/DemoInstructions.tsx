import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Info } from 'lucide-react';

export function DemoInstructions() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info size={20} />
          Demo Instructions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            This is a frontend prototype. All data is stored locally and resets on page refresh.
          </AlertDescription>
        </Alert>

        <div>
          <h4 className="font-semibold mb-2">📱 Quick Start Guide:</h4>
          <ol className="space-y-2 list-decimal list-inside">
            <li>
              <strong>Customer Flow:</strong> Use any 10-digit phone + any 6-digit OTP → Select "Find Writers & Artists" → Browse providers → Request work
            </li>
            <li>
              <strong>Provider Flow:</strong> Use phone: 9876543210 + any OTP → Select "Offer my services" → Complete 4-step onboarding
            </li>
            <li>
              <strong>Admin Panel:</strong> Visit <code className="bg-gray-100 px-1 rounded">/admin</code> to approve providers
            </li>
          </ol>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-1">⚠️ Production Note:</h4>
          <p className="text-yellow-700 text-xs">
            For production deployment, integrate with Supabase/Firebase for real authentication, database, real-time chat, file storage, and geospatial queries.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">✨ Key Features Implemented:</h4>
          <ul className="space-y-1 text-xs text-gray-700">
            <li>✓ OTP-based authentication (mock)</li>
            <li>✓ Role-based access (Customer, Provider, Admin)</li>
            <li>✓ Provider 4-step onboarding with verification</li>
            <li>✓ Location-based provider discovery</li>
            <li>✓ Work request creation with deadlines</li>
            <li>✓ Quote system with deal confirmation</li>
            <li>✓ Real-time chat interface</li>
            <li>✓ Job status flow (7 states)</li>
            <li>✓ Meetup coordination with safety mode</li>
            <li>✓ Rating & review system with tags</li>
            <li>✓ Admin dashboard for provider verification</li>
            <li>✓ Verified badge system</li>
            <li>✓ Mobile-first responsive design</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
