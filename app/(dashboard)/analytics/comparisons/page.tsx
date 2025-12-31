'use client';

import { useState } from 'react';
import { useExamContext } from '@/components/providers/exam-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';

export default function ComparisonsPage() {
  const { selectedExamId } = useExamContext();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ArrowUpDown className="h-8 w-8" />
          Comparisons
        </h1>
        <p className="text-muted-foreground">Compare performance across different metrics</p>
      </div>

      {!selectedExamId ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Please select an exam to view comparisons</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                School Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Compare multiple schools side by side
              </p>
              <Button className="w-full">Compare Schools</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Regional Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Compare performance across regions
              </p>
              <Button className="w-full">Compare Regions</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
