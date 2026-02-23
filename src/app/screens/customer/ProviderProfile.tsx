import { useParams, useNavigate, Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, MapPin, Star, CheckCircle2, MessageCircle, Briefcase } from 'lucide-react';

export function ProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { providers, reviews, currentUser } = useApp();

  const provider = providers.find(p => p.id === id);
  const providerReviews = reviews.filter(r => r.providerId === id);

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Provider not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">Provider Profile</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <Card className="m-4">
          <CardContent className="pt-6">
            <div className="flex gap-4 mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
                {provider.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold">{provider.name}</h2>
                  {provider.verified && (
                    <CheckCircle2 size={20} className="text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <MapPin size={14} />
                  <span>{provider.area}, {provider.city}</span>
                </div>
                {provider.verified && provider.rating && provider.rating > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                      <Star size={16} className="fill-green-600 text-green-600" />
                      <span className="font-semibold text-green-700">{provider.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {provider.totalReviews} reviews
                    </span>
                  </div>
                ) : (
                  <Badge variant="secondary">Pending Verification</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Role:</span>
                <Badge>{provider.providerRole}</Badge>
              </div>
              {provider.profession && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Profession:</span>
                  <span>{provider.profession}</span>
                </div>
              )}
              {provider.instituteName && (
                <div className="text-sm">
                  <span className="text-gray-600">Institute:</span>{' '}
                  <span>{provider.instituteName}</span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {provider.expertise?.map(exp => (
                  <Badge key={exp} variant="outline">{exp}</Badge>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Starting Price</div>
              <div className="text-2xl font-bold text-blue-600">
                ₹{provider.startingPrice}
                <span className="text-sm font-normal text-gray-600">/page</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="about" className="px-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="samples">Samples</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Bio</h3>
                <p className="text-gray-700">{provider.bio}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="samples" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-3">
                  {provider.samples && provider.samples.length > 0 ? (
                    provider.samples.map((sample, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={sample}
                          alt={`Sample ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-8 text-center text-gray-500">
                      No samples available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4 space-y-3">
            {providerReviews.length > 0 ? (
              providerReviews.map(review => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold">{review.customerName}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{review.text}</p>
                    <div className="flex flex-wrap gap-1">
                      {review.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">No reviews yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
          <Link to="/customer/create-request" state={{ providerId: provider.id }} className="flex-1">
            <Button className="w-full">
              <Briefcase className="mr-2" size={18} />
              Request Work
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
