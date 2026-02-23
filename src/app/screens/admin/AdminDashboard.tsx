import { useState } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, XCircle, Eye, Users, Briefcase, Star } from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const { providers, jobs, reviews } = useApp();
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  const pendingProviders = providers.filter(p => p.status === 'PENDING_VERIFICATION');
  const verifiedProviders = providers.filter(p => p.status === 'VERIFIED');
  const rejectedProviders = providers.filter(p => p.status === 'REJECTED');

  const handleApprove = (providerId: string) => {
    // In real app, update backend
    toast.success('Provider approved successfully');
    setSelectedProvider(null);
  };

  const handleReject = (providerId: string) => {
    // In real app, update backend
    toast.info('Provider rejected');
    setSelectedProvider(null);
  };

  const stats = [
    {
      title: 'Total Providers',
      value: providers.length,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Pending Verification',
      value: pendingProviders.length,
      icon: Eye,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Total Jobs',
      value: jobs.length,
      icon: Briefcase,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Total Reviews',
      value: reviews.length,
      icon: Star,
      color: 'bg-green-100 text-green-600',
    },
  ];

  const ProviderCard = ({ provider }: { provider: any }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white">
              {provider.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold">{provider.name}</div>
              <div className="text-sm text-gray-600">{provider.email}</div>
            </div>
          </div>
          <Badge
            className={
              provider.status === 'VERIFIED'
                ? 'bg-green-100 text-green-700'
                : provider.status === 'PENDING_VERIFICATION'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }
          >
            {provider.status.replace(/_/g, ' ')}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <span className="text-gray-600">Phone:</span>{' '}
            <span className="font-medium">{provider.phone}</span>
          </div>
          <div>
            <span className="text-gray-600">Role:</span>{' '}
            <Badge variant="outline">{provider.providerRole}</Badge>
          </div>
          <div>
            <span className="text-gray-600">Location:</span>{' '}
            <span className="font-medium">{provider.area}, {provider.city}</span>
          </div>
          <div>
            <span className="text-gray-600">Profession:</span>{' '}
            <span className="font-medium">{provider.profession}</span>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedProvider(provider)}>
              <Eye size={16} className="mr-2" />
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Provider Details</DialogTitle>
            </DialogHeader>
            {selectedProvider && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xl">
                    {selectedProvider.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{selectedProvider.name}</div>
                    <div className="text-sm text-gray-600">{selectedProvider.email}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium">{selectedProvider.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-medium">{selectedProvider.area}, {selectedProvider.city}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Profession</div>
                    <div className="font-medium">{selectedProvider.profession}</div>
                  </div>
                  {selectedProvider.instituteName && (
                    <div>
                      <div className="text-sm text-gray-600">Institute</div>
                      <div className="font-medium">{selectedProvider.instituteName}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-600">Role</div>
                    <Badge>{selectedProvider.providerRole}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Expertise</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedProvider.expertise?.map((exp: string) => (
                        <Badge key={exp} variant="outline">{exp}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                    <div className="font-medium text-blue-600">₹{selectedProvider.startingPrice}/page</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Bio</div>
                    <div className="text-gray-700">{selectedProvider.bio}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">Work Samples</div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProvider.samples?.map((sample: string, idx: number) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img src={sample} alt={`Sample ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">ID Proof Status</div>
                  <Badge className="bg-blue-100 text-blue-700">Uploaded</Badge>
                </div>

                {selectedProvider.status === 'PENDING_VERIFICATION' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() => handleApprove(selectedProvider.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 size={18} className="mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedProvider.id)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle size={18} className="mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage providers and monitor platform activity</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
                      <Icon size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Provider Management */}
        <Card>
          <CardHeader>
            <CardTitle>Provider Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">
                  Pending ({pendingProviders.length})
                </TabsTrigger>
                <TabsTrigger value="verified">
                  Verified ({verifiedProviders.length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({rejectedProviders.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-3 mt-4">
                {pendingProviders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No pending verifications
                  </div>
                ) : (
                  pendingProviders.map(provider => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="verified" className="space-y-3 mt-4">
                {verifiedProviders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No verified providers
                  </div>
                ) : (
                  verifiedProviders.map(provider => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="rejected" className="space-y-3 mt-4">
                {rejectedProviders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No rejected providers
                  </div>
                ) : (
                  rejectedProviders.map(provider => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
