import { useState } from 'react';
import { Link } from 'react-router';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useApp } from '../../context/AppContext';
import { Search, Filter, MapPin, Star, MessageCircle, CheckCircle2, Plus } from 'lucide-react';

export function Home() {
  const { getNearbyProviders, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Writer' | 'Artist'>('Writer');
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const providers = getNearbyProviders(
    activeTab,
    showVerifiedOnly ? { verified: true } : {}
  ).filter(p =>
    searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.expertise?.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl">TaskBuddy</h1>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin size={14} />
                <span>{currentUser?.city || 'Mumbai'}</span>
              </div>
            </div>
            <Link to="/customer/my-jobs">
              <Button size="sm" variant="outline">My Jobs</Button>
            </Link>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by name or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Distance</label>
                    <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All distances</SelectItem>
                        <SelectItem value="2km">Within 2 km</SelectItem>
                        <SelectItem value="5km">Within 5 km</SelectItem>
                        <SelectItem value="10km">Within 10 km</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rating</label>
                    <Select value={ratingFilter} onValueChange={setRatingFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All ratings</SelectItem>
                        <SelectItem value="4+">4+ stars</SelectItem>
                        <SelectItem value="4.5+">4.5+ stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="verified"
                      checked={showVerifiedOnly}
                      onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="verified" className="text-sm">
                      Show verified only
                    </label>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-md mx-auto">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="Writer">Writers</TabsTrigger>
            <TabsTrigger value="Artist">Artists</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="px-4 pb-4">
            <div className="space-y-3 mt-4">
              {providers.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">No providers found</p>
                  </CardContent>
                </Card>
              ) : (
                providers.map(provider => (
                  <Card key={provider.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex gap-3 p-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0">
                          {provider.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold truncate">{provider.name}</h3>
                                {provider.verified && (
                                  <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin size={12} />
                                <span>2.3 km • {provider.area}</span>
                              </div>
                            </div>
                            {provider.rating && provider.rating > 0 ? (
                              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                                <Star size={14} className="fill-green-600 text-green-600" />
                                <span className="text-sm font-semibold text-green-700">
                                  {provider.rating}
                                </span>
                              </div>
                            ) : (
                              <Badge variant="secondary">New</Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {provider.expertise?.slice(0, 3).map(exp => (
                              <Badge key={exp} variant="outline" className="text-xs">
                                {exp}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="text-sm">
                              <span className="text-gray-500">Starting at</span>{' '}
                              <span className="font-semibold text-blue-600">
                                ₹{provider.startingPrice}/page
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Link to={`/customer/provider/${provider.id}`}>
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <Link to="/customer/create-request">
        <Button
          size="lg"
          className="fixed bottom-24 right-4 rounded-full h-14 w-14 shadow-lg"
        >
          <Plus size={24} />
        </Button>
      </Link>
    </div>
  );
}
