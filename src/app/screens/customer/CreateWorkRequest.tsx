import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Upload, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const workTypes = ['Diagrams', 'Lab Records', 'Assignments', 'Notes', 'Charts', 'Project Formatting'];

export function CreateWorkRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  const { createJob, currentUser } = useApp();
  
  const providerId = location.state?.providerId;

  const [workType, setWorkType] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login first');
      return;
    }

    const job = createJob({
      customerId: currentUser.id,
      providerId,
      workType,
      subject,
      description,
      quantity: parseInt(quantity),
      deadline,
      budget: budget ? parseFloat(budget) : undefined,
      attachments: attachments.map((_, i) => `attachment_${i}.jpg`),
    });

    toast.success('Work request submitted successfully!');
    navigate('/customer/my-jobs');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">Create Work Request</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workType">Work Type *</Label>
                <Select value={workType} onValueChange={setWorkType}>
                  <SelectTrigger id="workType">
                    <SelectValue placeholder="Select work type" />
                  </SelectTrigger>
                  <SelectContent>
                    {workTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Physics, Chemistry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (pages/diagrams) *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="10"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (₹) - Optional</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="500"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Attachments (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    id="attachments"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        setAttachments(Array.from(e.target.files));
                      }
                    }}
                  />
                  <label htmlFor="attachments" className="cursor-pointer">
                    <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-sm text-gray-600">
                      {attachments.length > 0
                        ? `${attachments.length} file(s) selected`
                        : 'Click to upload reference images'}
                    </p>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-800">
                  💡 Provide clear requirements to get accurate quotes faster
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={!workType || !subject || !description || !quantity || !deadline}>
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
