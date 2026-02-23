import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Progress } from '../../components/ui/progress';
import { useApp } from '../../context/AppContext';
import { Upload, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function ProviderOnboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { updateUserProfile } = useApp();

  // Step 1 - Personal Info
  const [profession, setProfession] = useState('');
  const [otherProfession, setOtherProfession] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [course, setCourse] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');

  // Step 2 - Identity Verification
  const [idProof, setIdProof] = useState<File | null>(null);
  const [last4Digits, setLast4Digits] = useState('');
  const [idConfirm, setIdConfirm] = useState(false);

  // Step 3 - Service Setup
  const [providerRole, setProviderRole] = useState<'Writer' | 'Artist'>('Writer');
  const [expertise, setExpertise] = useState<string[]>([]);
  const [startingPrice, setStartingPrice] = useState('');
  const [bio, setBio] = useState('');
  const [samples, setSamples] = useState<File[]>([]);

  // Step 4 - Terms
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [infoConfirmed, setInfoConfirmed] = useState(false);

  const expertiseOptions = ['Diagrams', 'Lab Records', 'Assignments', 'Notes', 'Charts'];

  const handleNext = () => {
    if (step === 1) {
      if (!profession || !city || !area) {
        toast.error('Please fill all required fields');
        return;
      }
      if (profession === 'Student' && (!instituteName || !course)) {
        toast.error('Please provide institute details');
        return;
      }
    } else if (step === 2) {
      if (!idProof || !idConfirm) {
        toast.error('Please upload ID proof and confirm');
        return;
      }
    } else if (step === 3) {
      if (expertise.length === 0 || !startingPrice || !bio || samples.length < 2) {
        toast.error('Please complete all fields and upload at least 2 samples');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = () => {
    if (!termsAccepted || !infoConfirmed) {
      toast.error('Please accept terms and conditions');
      return;
    }

    updateUserProfile({
      profession: profession === 'Other' ? otherProfession : profession,
      instituteName: profession === 'Student' ? instituteName : undefined,
      course: profession === 'Student' ? course : undefined,
      city,
      area,
      providerRole,
      expertise,
      startingPrice: parseFloat(startingPrice),
      bio,
      samples: samples.map((_, i) => `https://images.unsplash.com/photo-${1455390582262 + i * 1000}-044cdead277a`),
      idProof: 'uploaded',
      status: 'PENDING_VERIFICATION',
      verified: false,
      profileComplete: true,
    });

    toast.success('Application submitted! Awaiting admin approval.');
    navigate('/provider');
  };

  const toggleExpertise = (item: string) => {
    setExpertise(prev =>
      prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]
    );
  };

  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg">Provider Onboarding</h2>
            <span className="text-sm text-gray-600">Step {step} of 4</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession *</Label>
                  <Select value={profession} onValueChange={setProfession}>
                    <SelectTrigger id="profession">
                      <SelectValue placeholder="Select profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Housewife">Housewife</SelectItem>
                      <SelectItem value="Job">Job</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {profession === 'Other' && (
                  <div className="space-y-2">
                    <Label htmlFor="otherProfession">Specify Profession *</Label>
                    <Input
                      id="otherProfession"
                      value={otherProfession}
                      onChange={(e) => setOtherProfession(e.target.value)}
                    />
                  </div>
                )}

                {profession === 'Student' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="institute">Institute Name *</Label>
                      <Input
                        id="institute"
                        value={instituteName}
                        onChange={(e) => setInstituteName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="course">Course/Class *</Label>
                      <Input
                        id="course"
                        placeholder="e.g., B.Sc Computer Science"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Area/Locality *</Label>
                  <Input
                    id="area"
                    placeholder="e.g., Andheri West"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Don't provide full home address for safety
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Identity Verification</CardTitle>
                <CardDescription>Upload your ID proof (Safe & Secure)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload ID Proof *</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="idProof"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setIdProof(e.target.files[0]);
                        }
                      }}
                    />
                    <label htmlFor="idProof" className="cursor-pointer">
                      <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                      <p className="text-sm text-gray-600">
                        {idProof ? idProof.name : 'Click to upload Aadhaar (masked) or College ID'}
                      </p>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last4">Last 4 Digits (Optional)</Label>
                  <Input
                    id="last4"
                    maxLength={4}
                    placeholder="XXXX"
                    value={last4Digits}
                    onChange={(e) => setLast4Digits(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="idConfirm"
                    checked={idConfirm}
                    onCheckedChange={(checked) => setIdConfirm(checked as boolean)}
                  />
                  <Label htmlFor="idConfirm" className="cursor-pointer text-sm">
                    I confirm this ID belongs to me
                  </Label>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-800">
                    🔒 Your ID will be reviewed by admin for verification. We respect your privacy.
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>Service Setup</CardTitle>
                <CardDescription>Configure your service offerings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Select Role *</Label>
                  <RadioGroup value={providerRole} onValueChange={(v) => setProviderRole(v as any)}>
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <RadioGroupItem value="Writer" id="writer" />
                      <Label htmlFor="writer" className="cursor-pointer flex-1">Writer</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <RadioGroupItem value="Artist" id="artist" />
                      <Label htmlFor="artist" className="cursor-pointer flex-1">Artist</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Select Expertise * (Multiple)</Label>
                  <div className="space-y-2">
                    {expertiseOptions.map(option => (
                      <div key={option} className="flex items-center space-x-2 border rounded-lg p-3">
                        <Checkbox
                          id={option}
                          checked={expertise.includes(option)}
                          onCheckedChange={() => toggleExpertise(option)}
                        />
                        <Label htmlFor={option} className="cursor-pointer flex-1">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Starting Price (₹ per page/diagram) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="50"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Short Bio *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell customers about your skills and experience..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload Samples (4-5 JPG images) *</Label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        setSamples(Array.from(e.target.files).slice(0, 5));
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500">
                    {samples.length} file(s) selected. Minimum 2 required.
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
                <CardDescription>Review and accept to continue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto text-sm">
                  <h4 className="font-semibold mb-2">TaskBuddy Provider Terms</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• You must deliver work on time as per agreed quote</li>
                    <li>• All work must be original and meet quality standards</li>
                    <li>• Meet customers only in public places for safety</li>
                    <li>• Payment is offline after delivery verification</li>
                    <li>• Maintain professional conduct at all times</li>
                    <li>• Your verification badge depends on admin approval</li>
                    <li>• Violation of terms may result in account suspension</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="cursor-pointer text-sm">
                      I agree to Terms & Conditions
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="infoConfirm"
                      checked={infoConfirmed}
                      onCheckedChange={(checked) => setInfoConfirmed(checked as boolean)}
                    />
                    <Label htmlFor="infoConfirm" className="cursor-pointer text-sm">
                      I confirm all information provided is correct
                    </Label>
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⏳ Your profile will be reviewed by admin. You'll be notified once approved.
                  </p>
                </div>
              </CardContent>
            </>
          )}

          <div className="px-6 pb-6 flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                Back
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={handleNext} className="flex-1">
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="mr-2" size={18} />
                Submit Application
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
