import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const MockPassportVerification = ({ onVerify }) => {
  const [passportNumber, setPassportNumber] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');

  const handleVerification = () => {
    setError('');
    // Simple mock verification logic - accept multiple date formats
    const validDates = ['1990-01-01', '01/01/1990', '1990/01/01'];
    if (passportNumber === '12345' && validDates.includes(dob)) {
      onVerify(true);
    } else {
      setError('Invalid passport number or date of birth. Please use mock data: Passport Number: 12345, DOB: 1990-01-01');
      onVerify(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-160px)]">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Identity Verification</CardTitle>
          <CardDescription>Please verify your identity to sell tickets.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="passportNumber">Passport Number</Label>
              <Input
                id="passportNumber"
                placeholder="Enter your passport number"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button onClick={handleVerification} className="w-full mt-4">Verify Identity</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MockPassportVerification;


