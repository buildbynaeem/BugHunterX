import { useState, useCallback } from 'react';
import { OrganizerData, Task, BudgetItem, Vendor } from '@/lib/types';
import { mockOrganizerData } from '@/lib/mockData';

export function useOrganizerData() {
  const [data, setData] = useState<OrganizerData>(mockOrganizerData);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
  }, []);

  const updateBudgetItem = useCallback((itemId: string, updates: Partial<BudgetItem>) => {
    setData(prev => ({
      ...prev,
      budget: prev.budget.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));
  }, []);

  const addBudgetItem = useCallback((item: Omit<BudgetItem, 'id'>) => {
    const newItem: BudgetItem = {
      ...item,
      id: Date.now().toString(),
    };
    setData(prev => ({
      ...prev,
      budget: [...prev.budget, newItem]
    }));
  }, []);

  const updateVendor = useCallback((vendorId: string, updates: Partial<Vendor>) => {
    setData(prev => ({
      ...prev,
      vendors: prev.vendors.map(vendor => 
        vendor.id === vendorId ? { ...vendor, ...updates } : vendor
      )
    }));
  }, []);

  const addVendor = useCallback((vendor: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = {
      ...vendor,
      id: Date.now().toString(),
    };
    setData(prev => ({
      ...prev,
      vendors: [...prev.vendors, newVendor]
    }));
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.map(notification =>
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    }));
  }, []);

  const getTasksByStatus = useCallback((status: Task['status']) => {
    return data.tasks.filter(task => task.status === status);
  }, [data.tasks]);

  const getTotalBudget = useCallback(() => {
    return data.budget.reduce((total, item) => total + item.amount, 0);
  }, [data.budget]);

  const getApprovedBudget = useCallback(() => {
    return data.budget
      .filter(item => item.status === 'approved' || item.status === 'paid')
      .reduce((total, item) => total + item.amount, 0);
  }, [data.budget]);

  return {
    data,
    updateTask,
    addTask,
    updateBudgetItem,
    addBudgetItem,
    updateVendor,
    addVendor,
    markNotificationAsRead,
    getTasksByStatus,
    getTotalBudget,
    getApprovedBudget,
  };
}

