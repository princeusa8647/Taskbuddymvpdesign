import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { UserCircle, Briefcase, Shield } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-4">📚 TaskBuddy</h1>
          <p className="text-xl text-gray-600 mb-2">Hyperlocal Student Marketplace</p>
          <p className="text-gray-500">Find Writers & Artists Nearby for Academic Work</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCircle className="text-blue-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">I'm a Student</h3>
              <p className="text-sm text-gray-600 mb-4">
                Find verified Writers & Artists for diagrams, notes, and assignments
              </p>
              <Link to="/auth">
                <Button className="w-full">Get Started</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="text-purple-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">I'm a Provider</h3>
              <p className="text-sm text-gray-600 mb-4">
                Offer your writing or artistic services to students nearby
              </p>
              <Link to="/auth">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Join as Provider
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Admin Panel</h3>
              <p className="text-sm text-gray-600 mb-4">
                Review and verify provider applications
              </p>
              <Link to="/admin">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Admin Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">✨ Key Features</h3>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>OTP-based secure authentication</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Location-based provider discovery</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Quote system with deal confirmation</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Real-time chat with providers</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Verified badge for trusted providers</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Safety mode with emergency features</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Rating & review system</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Public meetup coordination</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}