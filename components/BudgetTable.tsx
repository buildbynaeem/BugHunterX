'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BudgetItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface BudgetTableProps {
  budget: BudgetItem[];
  onUpdateItem: (itemId: string, updates: Partial<BudgetItem>) => void;
  onAddItem: (item: Omit<BudgetItem, 'id'>) => void;
  onDeleteItem: (itemId: string) => void;
}

const statusColors = {
  planned: 'bg-gray-100 text-gray-800',
  approved: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
};

export default function BudgetTable({ 
  budget, 
  onUpdateItem, 
  onAddItem, 
  onDeleteItem 
}: BudgetTableProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    amount: 0,
    status: 'planned' as const,
    vendor: '',
    notes: '',
  });

  const totalBudget = budget.reduce((sum, item) => sum + item.amount, 0);
  const approvedBudget = budget
    .filter(item => item.status === 'approved' || item.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0);
  const paidBudget = budget
    .filter(item => item.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0);

  const handleAddItem = () => {
    onAddItem(newItem);
    setNewItem({
      name: '',
      category: '',
      amount: 0,
      status: 'planned',
      vendor: '',
      notes: '',
    });
    setIsAddDialogOpen(false);
  };

  const handleEditItem = (item: BudgetItem) => {
    setEditingItem(item);
  };

  const handleUpdateItem = () => {
    if (editingItem) {
      onUpdateItem(editingItem.id, editingItem);
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(approvedBudget)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paidBudget)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Budget Items</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Budget Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Item name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      placeholder="Category"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Amount</label>
                    <Input
                      type="number"
                      value={newItem.amount}
                      onChange={(e) => setNewItem({ ...newItem, amount: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Vendor</label>
                    <Input
                      value={newItem.vendor}
                      onChange={(e) => setNewItem({ ...newItem, vendor: e.target.value })}
                      placeholder="Vendor name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Input
                      value={newItem.notes}
                      onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                      placeholder="Additional notes"
                    />
                  </div>
                  <Button onClick={handleAddItem} className="w-full">
                    Add Item
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budget.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="font-mono">{formatCurrency(item.amount)}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[item.status]}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.vendor || '-'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Budget Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  value={editingItem.amount}
                  onChange={(e) => setEditingItem({ ...editingItem, amount: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={editingItem.status}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="planned">Planned</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <Button onClick={handleUpdateItem} className="w-full">
                Update Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

