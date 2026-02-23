import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { User, Mail, MapPin, Phone, Star, CheckCircle2, LogOut, Edit } from 'lucide-react';
import { toast } from 'sonner';

export function Profile() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useApp();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login first</p>
      </div>
    );
  }

  const handleLogout = () => {
    setCurrentUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <Button variant="outline" size="sm">
            <Edit size={16} className="mr-1" />
            Edit
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-3xl mb-3">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{currentUser.name}</h2>
                {currentUser.verified && (
                  <CheckCircle2 size={20} className="text-green-500" />
                )}
              </div>
              <Badge className="mt-2">
                {currentUser.role === 'customer' ? 'Customer' : currentUser.role === 'provider' ? 'Provider' : 'Admin'}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone size={18} className="text-gray-600" />
                <div>
                  <div className="text-xs text-gray-500">Phone</div>
                  <div className="font-medium">{currentUser.phone}</div>
                </div>
              </div>

              {currentUser.email && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail size={18} className="text-gray-600" />
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-medium">{currentUser.email}</div>
                  </div>
                </div>
              )}

              {(currentUser.city || currentUser.area) && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin size={18} className="text-gray-600" />
                  <div>
                    <div className="text-xs text-gray-500">Location</div>
                    <div className="font-medium">
                      {currentUser.area && `${currentUser.area}, `}
                      {currentUser.city}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Provider Details */}
        {currentUser.role === 'provider' && (
          <>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Provider Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  {currentUser.verified ? (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle2 size={14} className="mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-700">
                      Pending Verification
                    </Badge>
                  )}
                </div>

                {currentUser.profession && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Profession</div>
                    <div className="font-medium">{currentUser.profession}</div>
                  </div>
                )}

                {currentUser.providerRole && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Role</div>
                    <Badge>{currentUser.providerRole}</Badge>
                  </div>
                )}

                {currentUser.expertise && currentUser.expertise.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Expertise</div>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.expertise.map(exp => (
                        <Badge key={exp} variant="outline">{exp}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentUser.startingPrice && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Starting Price</div>
                    <div className="text-xl font-bold text-blue-600">
                      ₹{currentUser.startingPrice}
                      <span className="text-sm font-normal text-gray-600">/page</span>
                    </div>
                  </div>
                )}

                {currentUser.rating !== undefined && currentUser.rating > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Rating</div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                        <Star size={16} className="fill-green-600 text-green-600" />
                        <span className="font-semibold text-green-700">{currentUser.rating}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        ({currentUser.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                )}

                {currentUser.bio && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Bio</div>
                    <div className="text-gray-700">{currentUser.bio}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {currentUser.samples && currentUser.samples.length > 0 && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Work Samples</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {currentUser.samples.map((sample, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={sample}
                          alt={`Sample ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Account Actions */}
        <Card className="mb-4">
          <CardContent className="pt-6 space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <User className="mr-2" size={18} />
              Account Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Help & Support
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Terms & Conditions
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Privacy Policy
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full"
        >
          <LogOut className="mr-2" size={18} />
          Logout
        </Button>
      </div>
    </div>
  );
}