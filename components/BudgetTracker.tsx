'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IndianRupee, TrendingUp, Plus, FileText } from 'lucide-react';
import { useEvents } from '@/lib/event-context';

interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  status: 'on track' | 'over' | 'under' | 'pending';
}

interface BudgetTrackerProps {
  eventId?: string;
}

export default function BudgetTracker({ eventId }: BudgetTrackerProps) {
  const { events, updateEvent } = useEvents();
  const currentEvent = eventId ? events.find(event => event.id === eventId) : (events.length > 0 ? events[0] : null);
  
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([
    {
      id: '1',
      name: 'Venue',
      allocated: 45000,
      spent: 35000,
      status: 'on track'
    },
    {
      id: '2',
      name: 'Catering',
      allocated: 30000,
      spent: 25000,
      status: 'on track'
    },
    {
      id: '3',
      name: 'Marketing',
      allocated: 20000,
      spent: 12000,
      status: 'under'
    },
    {
      id: '4',
      name: 'Speakers',
      allocated: 15000,
      spent: 6500,
      status: 'over'
    },
    {
      id: '5',
      name: 'Tech Setup',
      allocated: 10000,
      spent: 0,
      status: 'pending'
    },
    {
      id: '6',
      name: 'Miscellaneous',
      allocated: 5000,
      spent: 0,
      status: 'pending'
    }
  ]);

  const [budgetLimit, setBudgetLimit] = useState<number>(0);

  // Load budget limit from event data
  useEffect(() => {
    if (currentEvent && currentEvent.budget_limit) {
      setBudgetLimit(currentEvent.budget_limit);
    }
  }, [currentEvent]);

  // Load budget categories from database
  useEffect(() => {
    const loadBudgetCategories = async () => {
      if (currentEvent) {
        console.log('Loading budget categories for event:', currentEvent.id);
        try {
          const response = await fetch(`/api/budgets?event_id=${currentEvent.id}`);
          console.log('Budget API response status:', response.status);
          if (response.ok) {
            const budgets = await response.json();
            console.log('Loaded budgets from database:', budgets);
            if (budgets.length > 0) {
              // Convert database format to component format
              const categories = budgets.map((budget: any) => ({
                id: budget.id,
                name: budget.category,
                allocated: budget.allocated,
                spent: budget.spent,
                status: budget.status
              }));
              console.log('Setting budget categories:', categories);
              setBudgetCategories(categories);
            } else {
              console.log('No budgets found in database, keeping default categories');
            }
          } else {
            console.error('Failed to fetch budgets, response not ok');
          }
        } catch (error) {
          console.error('Failed to load budget categories:', error);
        }
      } else {
        console.log('No current event available, currentEvent:', currentEvent);
      }
    };

    loadBudgetCategories();
  }, [currentEvent]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showSetBudgetDialog, setShowSetBudgetDialog] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: ''
  });
  const [tempBudgetLimit, setTempBudgetLimit] = useState('');

  // Calculate totals
  const totalAllocated = budgetCategories.reduce((sum, category) => sum + category.allocated, 0);
  const totalSpent = budgetCategories.reduce((sum, category) => sum + category.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  
  // Calculate usage percentage based on budget limit if set, otherwise use allocated amount
  const usagePercentage = budgetLimit > 0 
    ? (totalSpent / budgetLimit) * 100 
    : (totalSpent / totalAllocated) * 100;



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on track': return 'bg-green-500';
      case 'over': return 'bg-red-500';
      case 'under': return 'bg-blue-500';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getProgressColor = (category: BudgetCategory) => {
    const percentage = (category.spent / category.allocated) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-teal-500';
  };

  const getUsagePercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-green-600';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-100';
    if (percentage >= 75) return 'bg-yellow-100';
    if (percentage >= 50) return 'bg-orange-100';
    return 'bg-green-100';
  };

  const handleAddExpense = async () => {
    if (!newExpense.category || !newExpense.amount) return;

    const amount = parseFloat(newExpense.amount);
    console.log('Adding expense:', { category: newExpense.category, amount, description: newExpense.description });
    
    try {
      // Find the category to update
      const categoryToUpdate = budgetCategories.find(cat => cat.id === newExpense.category);
      console.log('Category to update:', categoryToUpdate);
      if (!categoryToUpdate) {
        console.error('Category not found:', newExpense.category);
        return;
      }

      const newSpent = categoryToUpdate.spent + amount;
      let status: BudgetCategory['status'] = 'on track';
      
      if (newSpent > categoryToUpdate.allocated) {
        status = 'over';
      } else if (newSpent < categoryToUpdate.allocated * 0.7) {
        status = 'under';
      } else if (newSpent === 0) {
        status = 'pending';
      }

      console.log('Updating budget with:', { newSpent, status });

      // Update the budget in the database
      const response = await fetch(`/api/budgets/${categoryToUpdate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spent: newSpent,
          status: status
        })
      });

      console.log('API response status:', response.status);

      if (response.ok) {
        // Update local state only after successful API call
        setBudgetCategories(prev => prev.map(category => {
          if (category.id === newExpense.category) {
            return { ...category, spent: newSpent, status };
          }
          return category;
        }));

        setNewExpense({ category: '', amount: '', description: '' });
        setShowAddExpense(false);
      } else {
        console.error('Failed to save expense to database');
        // Still update local state as fallback
        setBudgetCategories(prev => prev.map(category => {
          if (category.id === newExpense.category) {
            return { ...category, spent: newSpent, status };
          }
          return category;
        }));

        setNewExpense({ category: '', amount: '', description: '' });
        setShowAddExpense(false);
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      // Fallback to local state update
      setBudgetCategories(prev => prev.map(category => {
        if (category.id === newExpense.category) {
          const newSpent = category.spent + amount;
          let status: BudgetCategory['status'] = 'on track';
          
          if (newSpent > category.allocated) {
            status = 'over';
          } else if (newSpent < category.allocated * 0.7) {
            status = 'under';
          } else if (newSpent === 0) {
            status = 'pending';
          }

          return { ...category, spent: newSpent, status };
        }
        return category;
      }));

      setNewExpense({ category: '', amount: '', description: '' });
      setShowAddExpense(false);
    }
  };

  const handleSetBudgetLimit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const limit = parseFloat(tempBudgetLimit);
    if (isNaN(limit) || limit <= 0) {
      return;
    }

    // Save to event if we have a current event
    if (currentEvent) {
      try {
        await updateEvent(currentEvent.id, { budget_limit: limit });
        setBudgetLimit(limit);
        setTempBudgetLimit('');
        setShowSetBudgetDialog(false);
      } catch (error) {
        console.error('Failed to save budget limit:', error);
        // Still update local state even if API call fails
        setBudgetLimit(limit);
        setTempBudgetLimit('');
        setShowSetBudgetDialog(false);
      }
    } else {
      // Fallback to local state if no event
      setBudgetLimit(limit);
      setTempBudgetLimit('');
      setShowSetBudgetDialog(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg font-semibold">
            <IndianRupee className="h-5 w-5 mr-2" />
            Budget Tracker
          </CardTitle>
          <div className="flex items-center gap-2">
            {budgetLimit > 0 && (
              <Badge variant={totalSpent > budgetLimit ? "destructive" : totalSpent > budgetLimit * 0.9 ? "secondary" : "default"}>
                ₹{totalSpent.toFixed(2)} / ₹{budgetLimit.toFixed(2)}
              </Badge>
            )}
            <div className={`flex items-center text-sm ${getUsagePercentageColor(usagePercentage)}`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              {usagePercentage.toFixed(1)}% used
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Budget Limit Section */}
        {budgetLimit > 0 ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Overall Budget Limit</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  ₹{totalSpent.toFixed(2)} / ₹{budgetLimit.toFixed(2)}
                </span>
              </div>
            </div>
            <Progress 
              value={budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0} 
              className={`h-3 ${totalSpent > budgetLimit ? 'bg-red-100' : totalSpent > budgetLimit * 0.9 ? 'bg-yellow-100' : 'bg-green-100'}`}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Spent: ₹{totalSpent.toLocaleString()}</span>
              <span>Remaining: ₹{(budgetLimit - totalSpent).toLocaleString()}</span>
            </div>
            {totalSpent > budgetLimit && (
              <p className="text-sm text-red-600 font-medium">
                ⚠️ Budget exceeded by ₹{(totalSpent - budgetLimit).toFixed(2)}
              </p>
            )}
            {totalSpent > budgetLimit * 0.9 && totalSpent <= budgetLimit && (
              <p className="text-sm text-yellow-600 font-medium">
                ⚠️ Approaching budget limit (90% used)
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Set Budget Limit</h3>
            <p className="text-sm text-gray-600">
              Set an overall budget limit to track your spending against your expected budget.
            </p>
          </div>
        )}

        {/* Total Budget Progress - only show when no budget limit is set */}
        {budgetLimit === 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Total Budget Progress</Label>
              <span className="text-sm font-medium">
                 ₹{totalSpent.toLocaleString()} / ₹{totalAllocated.toLocaleString()}
               </span>
            </div>
            <Progress 
              value={usagePercentage} 
              className={`h-3 ${getProgressBarColor(usagePercentage)}`}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
               <span>Spent: ₹{totalSpent.toLocaleString()}</span>
               <span>Remaining: ₹{totalRemaining.toLocaleString()}</span>
             </div>
          </div>
        )}

        {/* Budget Categories */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Budget Categories</h3>
          <div className="space-y-3">
            {budgetCategories.map((category) => {
              // Calculate percentage based on budget limit if set, otherwise use allocated amount
              let percentage;
              let displayLimit;
              
              if (budgetLimit > 0) {
                // Use the budget limit as the limit for each category
                percentage = (category.spent / budgetLimit) * 100;
                displayLimit = budgetLimit;
              } else {
                percentage = (category.spent / category.allocated) * 100;
                displayLimit = category.allocated;
              }
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.name}</span>
                    <Badge 
                      className={`${getStatusColor(category.status)} text-white text-xs px-2 py-1`}
                    >
                      {category.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Progress 
                      value={percentage} 
                      className={`h-2 ${getProgressBarColor(percentage)}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹{category.spent.toLocaleString()} / ₹{displayLimit.toLocaleString()}</span>
                      <span>{percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
            <DialogTrigger asChild>
              <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newExpense.category} onValueChange={(value) => 
                    setNewExpense(prev => ({ ...prev, category: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Expense description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleAddExpense}
                    className="flex-1"
                  >
                    Add Expense
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowAddExpense(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={() => {
              if (budgetLimit > 0) {
                setTempBudgetLimit(budgetLimit.toString());
              }
              setShowSetBudgetDialog(true);
            }}
            variant="outline"
            className="flex-1"
          >
            {budgetLimit <= 0 ? 'Set Limit' : 'Edit Limit'}
          </Button>

          <Button variant="outline" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            View Report
          </Button>
        </div>

        {/* Set Budget Limit Dialog */}
        <Dialog open={showSetBudgetDialog} onOpenChange={setShowSetBudgetDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{budgetLimit <= 0 ? 'Set Budget Limit' : 'Edit Budget Limit'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSetBudgetLimit} className="space-y-4">
              <div>
                <Label htmlFor="budgetLimit">Budget Limit</Label>
                <Input
                  id="budgetLimit"
                  type="number"
                  placeholder="Enter budget limit"
                  value={tempBudgetLimit}
                  onChange={(e) => setTempBudgetLimit(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  Set Limit
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowSetBudgetDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
