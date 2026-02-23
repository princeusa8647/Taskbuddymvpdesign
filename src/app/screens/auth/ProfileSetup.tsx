import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { useApp } from '../../context/AppContext';
import { UserCircle } from 'lucide-react';
import { toast } from 'sonner';

const states = ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Gujarat'];
const districts: { [key: string]: string[] } = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore'],
  'Delhi': ['Central Delhi', 'North Delhi', 'South Delhi'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara'],
};

export function ProfileSetup() {
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const navigate = useNavigate();
  const { updateUserProfile, currentUser } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateUserProfile({
      role,
      name,
      email: email || undefined,
      state,
      district,
      profileComplete: role === 'customer',
    });
    
    if (role === 'customer') {
      toast.success('Profile created successfully!');
      navigate('/customer');
    } else {
      toast.success('Profile saved! Complete provider onboarding.');
      navigate('/auth/provider-onboarding');
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <UserCircle className="text-purple-600" size={24} />
        </div>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          Tell us a bit about yourself
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label>I want to</Label>
            <RadioGroup value={role} onValueChange={(v) => setRole(v as any)}>
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="customer" id="customer" />
                <Label htmlFor="customer" className="cursor-pointer flex-1">
                  Find Writers & Artists (Customer)
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="provider" id="provider" />
                <Label htmlFor="provider" className="cursor-pointer flex-1">
                  Offer my services (Provider)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select value={state} onValueChange={(v) => { setState(v); setDistrict(''); }}>
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">District *</Label>
            <Select value={district} onValueChange={setDistrict} disabled={!state}>
              <SelectTrigger id="district">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {state && districts[state]?.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={!name || !state || !district}>
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}