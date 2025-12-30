'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useExamContext } from '@/components/providers/exam-context';
import { useExam, useRegions, useCouncils, useWards, useSchools } from '@/lib/hooks';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/error-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';

interface SubjectEntry {
  subject_code: string;
  subject_name: string;
}

export default function RegisterStudentPage() {
  const router = useRouter();
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId || '');
  
  const [formData, setFormData] = useState({
    exam_number: '',
    first_name: '',
    middle_name: '',
    surname: '',
    sex: '',
    centre_number: '',
  });
  
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Location filters
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCouncil, setSelectedCouncil] = useState('all');
  
  const { data: regions } = useRegions();
  const { data: councils } = useCouncils(selectedRegion);
  const { data: schools } = useSchools();

  const filteredSchools = schools?.filter(s => {
    if (selectedRegion && selectedRegion !== 'all' && s.region_name !== selectedRegion) return false;
    if (selectedCouncil && selectedCouncil !== 'all' && s.council_name !== selectedCouncil) return false;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedExamId) {
      setError('Please select an exam first');
      return;
    }

    if (!formData.exam_number || !formData.first_name || !formData.surname || !formData.sex || !formData.centre_number) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.registerStudent(selectedExamId, {
        ...formData,
        subjects: selectedSubjects.map(s => s.subject_code),
      });
      setSuccess('Student registered successfully');
      setFormData({
        exam_number: '',
        first_name: '',
        middle_name: '',
        surname: '',
        sex: '',
        centre_number: '',
      });
      setSelectedSubjects([]);
    } catch (err: any) {
      setError(getErrorMessage(err) || 'Failed to register student');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam from the header first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Register Student</h1>
          <p className="text-muted-foreground">{exam?.exam_name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Enter the student's details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exam_number">Exam Number *</Label>
              <Input
                id="exam_number"
                value={formData.exam_number}
                onChange={(e) => setFormData({ ...formData, exam_number: e.target.value })}
                placeholder="e.g., S0001/0001"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middle_name">Middle Name</Label>
                <Input
                  id="middle_name"
                  value={formData.middle_name}
                  onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Surname *</Label>
                <Input
                  id="surname"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sex *</Label>
              <Select
                value={formData.sex}
                onValueChange={(value) => setFormData({ ...formData, sex: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>School Selection</CardTitle>
            <CardDescription>Select the student's school</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Region (filter)</Label>
                <Select
                  value={selectedRegion}
                  onValueChange={(value) => {
                    setSelectedRegion(value);
                    setSelectedCouncil('all');
                    setFormData({ ...formData, centre_number: '' });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions?.map((region) => (
                      <SelectItem key={region.id} value={region.region_name}>
                        {region.region_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Council (filter)</Label>
                <Select
                  value={selectedCouncil}
                  onValueChange={(value) => {
                    setSelectedCouncil(value);
                    setFormData({ ...formData, centre_number: '' });
                  }}
                  disabled={!selectedRegion}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All councils" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Councils</SelectItem>
                    {councils?.map((council) => (
                      <SelectItem key={council.id} value={council.council_name}>
                        {council.council_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>School *</Label>
              <Select
                value={formData.centre_number}
                onValueChange={(value) => setFormData({ ...formData, centre_number: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select school" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSchools?.map((school) => (
                    <SelectItem key={school.centre_number} value={school.centre_number}>
                      {school.centre_number} - {school.school_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="text-sm text-green-500 bg-green-50 dark:bg-green-950 p-3 rounded">
            {success}
          </div>
        )}

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              'Register Student'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
