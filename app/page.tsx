import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, BarChart3, Users, FileCheck, Trophy, School } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            ExaMetrics
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Comprehensive Examination Analytics Platform
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Analyze exam results, track student performance, compare schools, 
            and make data-driven decisions to improve educational outcomes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-blue-500 mb-4" />
              <CardTitle>Advanced Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Deep dive into exam performance with gender breakdowns, 
                school type comparisons, subject analysis, and top performers.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <School className="h-12 w-12 text-green-500 mb-4" />
              <CardTitle>School Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Compare schools nationally, regionally, and by council. 
                Track performance metrics and identify top performers.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-500 mb-4" />
              <CardTitle>Student Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Register students manually or upload PDF documents. 
                Track individual performance and detailed analytics.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-orange-500 mb-4" />
              <CardTitle>Exam Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Configure subjects, divisions, and grades for different exam types. 
                Support for both primary and secondary education levels.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileCheck className="h-12 w-12 text-red-500 mb-4" />
              <CardTitle>Results Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Process exam results automatically. Export templates for marks entry 
                and upload completed Excel files with validation.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Trophy className="h-12 w-12 text-yellow-500 mb-4" />
              <CardTitle>Performance Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Track GPA, average marks, division distribution, and grade summaries. 
                Monitor progress over time and identify trends.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Sign in to access the full dashboard and explore exam analytics.
          </p>
          <Link href="/login">
            <Button size="lg" className="text-lg px-8 py-3">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
