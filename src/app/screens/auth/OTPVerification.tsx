import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../components/ui/input-otp';
import { useApp } from '../../context/AppContext';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function OTPVerification() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithOTP, setCurrentUser } = useApp();
  
  const phone = sessionStorage.getItem('pending_phone') || '';

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    
    setLoading(true);
    try {
      const user = await loginWithOTP('+91' + phone, otp);
      
      if (user) {
        setCurrentUser(user);
        
        if (!user.profileComplete) {
          navigate('/auth/profile-setup');
        } else if (user.role === 'customer') {
          navigate('/customer');
        } else if (user.role === 'provider') {
          navigate('/provider');
        } else if (user.role === 'admin') {
          navigate('/admin');
        }
      } else {
        toast.error('Invalid OTP');
      }
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="text-green-600" size={24} />
        </div>
        <CardTitle>Enter OTP</CardTitle>
        <CardDescription>
          We've sent a 6-digit code to<br />
          <span className="font-semibold">+91 {phone}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        
        <Button 
          onClick={handleVerify} 
          className="w-full" 
          disabled={otp.length !== 6 || loading}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>
        
        <div className="text-center">
          <button className="text-sm text-blue-600 hover:underline">
            Resend OTP
          </button>
        </div>
        
        <p className="text-xs text-center text-gray-500">
          Demo: Use any 6-digit code
        </p>
      </CardContent>
    </Card>
  );
}