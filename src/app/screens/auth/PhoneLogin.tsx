import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Smartphone } from 'lucide-react';
import { DemoInstructions } from '../../components/DemoInstructions';

export function PhoneLogin() {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      // Store phone in session for OTP step
      sessionStorage.setItem('pending_phone', phone);
      navigate('/auth/otp');
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Smartphone className="text-blue-600" size={24} />
          </div>
          <CardTitle>Welcome to TaskBuddy</CardTitle>
          <CardDescription>
            Enter your phone number to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <div className="bg-gray-100 px-3 py-2 rounded-md border border-gray-300 flex items-center">
                  <span className="text-gray-700">+91</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={phone.length !== 10}>
              Send OTP
            </Button>
            
            <p className="text-xs text-center text-gray-500 mt-4">
              By continuing, you agree to our Terms & Conditions
            </p>
          </form>
        </CardContent>
      </Card>
      
      <DemoInstructions />
    </>
  );
}