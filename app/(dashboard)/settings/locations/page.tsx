'use client';

import { useState } from 'react';
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, MapPin } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import type { Region, Council } from '@/lib/types';

export default function LocationsPage() {
  const { data: locations } = useLocations();
  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();
  const deleteLocation = useDeleteLocation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    region_code: '',
    region_name: '',
    council_code: '',
    council_name: '',
  });
  const [activeTab, setActiveTab] = useState('regions');

  const regions = locations?.regions || [];
  const councils = locations?.councils || [];

  const handleEdit = (item: any, type: 'region' | 'council') => {
    setEditingId(item.id);
    setEditForm({ ...item, type });
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      await updateLocation.mutateAsync({
        locationId: editingId,
        location: editForm,
      });
      setEditingId(null);
      setEditForm({});
      toast.success('Location updated successfully');
    } catch (error: any) {
      console.error('Failed to update location:', error);
      toast.error(error.response?.data?.detail || 'Failed to update location');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleCreate = async () => {
    if (activeTab === 'regions') {
      if (!createForm.region_code || !createForm.region_name) {
        toast.error('Please fill in all fields');
        return;
      }
    } else {
      if (!createForm.council_code || !createForm.council_name) {
        toast.error('Please fill in all fields');
        return;
      }
    }

    try {
      await createLocation.mutateAsync(createForm);
      setIsCreating(false);
      setCreateForm({
        region_code: '',
        region_name: '',
        council_code: '',
        council_name: '',
      });
      toast.success('Location created successfully');
    } catch (error: any) {
      console.error('Failed to create location:', error);
      toast.error(error.response?.data?.detail || 'Failed to create location');
    }
  };

  const handleDelete = async (locationId: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      await deleteLocation.mutateAsync(locationId);
      toast.success('Location deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete location:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete location');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Locations</h1>
            <p className="text-muted-foreground">Manage regions and councils</p>
          </div>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location Management</CardTitle>
          <CardDescription>
            Configure regions and councils for school locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="regions">
                <MapPin className="mr-2 h-4 w-4" />
                Regions ({regions.length})
              </TabsTrigger>
              <TabsTrigger value="councils">
                <MapPin className="mr-2 h-4 w-4" />
                Councils ({councils.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="regions" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region Code</TableHead>
                    <TableHead>Region Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isCreating && activeTab === 'regions' && (
                    <TableRow>
                      <TableCell>
                        <Input
                          value={createForm.region_code}
                          onChange={(e) => setCreateForm({ ...createForm, region_code: e.target.value })}
                          placeholder="01"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={createForm.region_name}
                          onChange={(e) => setCreateForm({ ...createForm, region_name: e.target.value })}
                          placeholder="Dar es Salaam"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={handleCreate}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {regions.map((region: Region) => (
                    <TableRow key={region.id}>
                      <TableCell>
                        {editingId === region.id ? (
                          <Input
                            value={editForm.region_code}
                            onChange={(e) => setEditForm({ ...editForm, region_code: e.target.value })}
                          />
                        ) : (
                          <Badge variant="outline">{region.region_code}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === region.id ? (
                          <Input
                            value={editForm.region_name}
                            onChange={(e) => setEditForm({ ...editForm, region_name: e.target.value })}
                          />
                        ) : (
                          <span className="font-medium">{region.region_name}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === region.id ? (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" onClick={handleSave}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleCancel}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(region, 'region')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(region.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="councils" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Council Code</TableHead>
                    <TableHead>Council Name</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isCreating && activeTab === 'councils' && (
                    <TableRow>
                      <TableCell>
                        <Input
                          value={createForm.council_code}
                          onChange={(e) => setCreateForm({ ...createForm, council_code: e.target.value })}
                          placeholder="0101"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={createForm.council_name}
                          onChange={(e) => setCreateForm({ ...createForm, council_name: e.target.value })}
                          placeholder="Ilala"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={createForm.region_code}
                          onValueChange={(value) => setCreateForm({ ...createForm, region_code: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            {regions.map((region: Region) => (
                              <SelectItem key={region.id} value={region.region_code}>
                                {region.region_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={handleCreate}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {councils.map((council: Council) => (
                    <TableRow key={council.id}>
                      <TableCell>
                        {editingId === council.id ? (
                          <Input
                            value={editForm.council_code}
                            onChange={(e) => setEditForm({ ...editForm, council_code: e.target.value })}
                          />
                        ) : (
                          <Badge variant="outline">{council.council_code}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === council.id ? (
                          <Input
                            value={editForm.council_name}
                            onChange={(e) => setEditForm({ ...editForm, council_name: e.target.value })}
                          />
                        ) : (
                          <span className="font-medium">{council.council_name}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === council.id ? (
                          <Select
                            value={editForm.region_code}
                            onValueChange={(value) => setEditForm({ ...editForm, region_code: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {regions.map((region: Region) => (
                                <SelectItem key={region.id} value={region.region_code}>
                                  {region.region_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="secondary">{council.region_name}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === council.id ? (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" onClick={handleSave}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleCancel}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(council, 'council')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(council.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
