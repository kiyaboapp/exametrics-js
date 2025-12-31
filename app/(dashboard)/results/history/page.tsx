'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { History, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { History, Download, Eye } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    setHistory([
      {
        id: '1',
        examName: 'CSEE 2024',
        processedAt: '2024-12-15 10:30',
        status: 'completed',
        schools: 287,
        students: 45678,
      },
      {
        id: '2',
        examName: 'ACSEE 2024',
        processedAt: '2024-11-20 14:15',
        status: 'completed',
        schools: 156,
        students: 23456,
      },
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <History className="h-8 w-8" />
          Processing History
        </h1>
        <p className="text-muted-foreground">View past result processing records</p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading history...</p>
          </CardContent>
        </Card>
      ) : history.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Processed At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Schools</TableHead>
                  <TableHead className="text-right">Students</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.examName}</TableCell>
                    <TableCell>{item.processedAt}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{item.schools}</TableCell>
                    <TableCell className="text-right">{item.students.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No processing history found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
