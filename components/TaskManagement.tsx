'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatDateConsistent } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Plus, 
  Calendar, 
  User, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  Search,
  Target,
  Zap,
  Award,
  Users,
  RefreshCw,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Circle,
  Sparkles,
  TrendingUp,
  Settings,
  Bell
} from 'lucide-react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  dueDate: string;
  status: 'todo' | 'inprogress' | 'done';
  createdAt: string;
  updatedAt: string;
}

interface TaskManagementProps {
  eventId?: string;
}

const TaskCard = ({ task, index, onDelete }: { task: Task; index: number; onDelete: (taskId: string) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-200';
      case 'low': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-3 w-3" />;
      case 'medium': return <Circle className="h-3 w-3" />;
      case 'low': return <CheckCircle className="h-3 w-3" />;
      default: return <Circle className="h-3 w-3" />;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.3,
        delay: index * 0.1,
        ease: [0.4, 0.0, 0.2, 1]
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={`
          hover:shadow-xl hover:shadow-primary/10 
          transition-all duration-300 ease-out
          border-l-4 border-l-transparent
          ${isDragging ? 'shadow-2xl shadow-primary/20 scale-105 rotate-2' : 'shadow-lg shadow-black/5'}
          ${isOverdue ? 'border-l-red-500 bg-red-50/50' : ''}
          backdrop-blur-sm bg-white/95
          group overflow-hidden
        `}
        onClick={(e) => {
          // Prevent any default click behavior that might cause issues
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Drag handle area - only this area should be draggable */}
        <div 
          {...listeners}
          className="absolute top-2 right-8 w-6 h-6 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-gray-100 rounded"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="flex flex-col gap-0.5">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
        <CardContent className="p-4 relative">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-1">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {task.status === 'done' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : task.status === 'inprogress' ? (
                    <Zap className="h-4 w-4 text-blue-500 animate-pulse" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                </motion.div>
                <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                  {task.title}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-100 hover:text-red-600"
                      onClick={(e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
                           onDelete(task.id);
                         }
                       }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete task</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Future: Add task options menu
                        console.log('Task options clicked for:', task.title);
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Task options</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            <motion.p 
              className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {task.description}
            </motion.p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge className={`text-xs px-3 py-1.5 font-medium shadow-sm ${getPriorityColor(task.priority)}`}>
                    <div className="flex items-center gap-1">
                      {getPriorityIcon(task.priority)}
                      <span className="capitalize">{task.priority}</span>
                    </div>
                  </Badge>
                </motion.div>
                
                {isOverdue && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 text-red-500"
                  >
                    <AlertCircle className="h-3 w-3" />
                    <span className="text-xs font-medium">Overdue</span>
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold">
                      {getInitials(task.assignedTo)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-600 font-medium">{task.assignedTo}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                  {formatDateConsistent(task.dueDate)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TaskColumn = ({ 
  title, 
  tasks, 
  status, 
  color,
  icon,
  index,
  onDelete,
  onSave
}: { 
  title: string; 
  tasks: Task[]; 
  status: 'todo' | 'inprogress' | 'done';
  color: string;
  icon: React.ReactNode;
  index: number;
  onDelete: (taskId: string) => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });
  const getColumnGradient = (status: string) => {
    switch (status) {
      case 'todo': return 'from-gray-50 to-gray-100';
      case 'inprogress': return 'from-blue-50 to-blue-100';
      case 'done': return 'from-green-50 to-green-100';
      default: return 'from-gray-50 to-gray-100';
    }
  };

  return (
    <motion.div 
      className="flex-1 min-w-0"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div 
        className={`bg-gradient-to-r ${getColumnGradient(status)} rounded-xl p-4 mb-6 shadow-lg border border-white/20`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="p-2 rounded-lg bg-white/50 shadow-sm"
            >
              {icon}
            </motion.div>
            <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Badge variant="secondary" className="bg-white/80 text-gray-900 font-semibold px-3 py-1 shadow-sm">
              {tasks.length}
            </Badge>
          </motion.div>
        </div>
      </motion.div>
      
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div 
          ref={setNodeRef}
          className={`space-y-4 min-h-[200px] p-2 rounded-lg transition-all duration-200 ${
            isOver ? 'bg-primary/10 border-2 border-primary border-dashed' : ''
          }`}
        >
          <AnimatePresence>
            {tasks.map((task, taskIndex) => (
              <TaskCard key={task.id} task={task} index={taskIndex} onDelete={onDelete} />
            ))}
          </AnimatePresence>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Card className="border-dashed border-2 border-gray-300 hover:border-primary/50 cursor-pointer transition-all duration-300 group bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary/5 hover:to-secondary/5">
                  <CardContent className="flex items-center justify-center py-8">
                    <motion.div 
                      className="flex items-center text-gray-500 group-hover:text-primary transition-colors"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                      <span className="text-sm font-medium">Add task</span>
                    </motion.div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Add New Task
                  </DialogTitle>
                </DialogHeader>
                <TaskForm status={status} onSave={onSave} onClose={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </SortableContext>
    </motion.div>
  );
};

const TaskForm = ({ status, task, onSave, onClose }: { 
  status: 'todo' | 'inprogress' | 'done'; 
  task?: Task;
  onSave?: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose?: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium' as 'low' | 'medium' | 'high',
    assignedTo: task?.assignedTo || '',
    dueDate: task?.dueDate || '',
    status: task?.status || status
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation - title is required
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }
    
    if (onSave) {
      onSave(formData);
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
          className="mt-2 shadow-sm focus:shadow-md transition-shadow"
          placeholder="Enter task title"
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="mt-2 shadow-sm focus:shadow-md transition-shadow"
          placeholder="Describe the task details..."
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Label htmlFor="priority" className="text-sm font-semibold text-gray-700">Priority</Label>
        <Select value={formData.priority} onValueChange={(value) => 
          setFormData(prev => ({ ...prev, priority: value as 'low' | 'medium' | 'high' }))
        }>
          <SelectTrigger className="mt-2 shadow-sm focus:shadow-md transition-shadow">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Low Priority
            </SelectItem>
            <SelectItem value="medium" className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-yellow-500" />
              Medium Priority
            </SelectItem>
            <SelectItem value="high" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              High Priority
            </SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Label htmlFor="assignedTo" className="text-sm font-semibold text-gray-700">Assigned To</Label>
        <Input
          id="assignedTo"
          value={formData.assignedTo}
          onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
          placeholder="Enter assignee name"
          className="mt-2 shadow-sm focus:shadow-md transition-shadow"
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Label htmlFor="dueDate" className="text-sm font-semibold text-gray-700">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          className="mt-2 shadow-sm focus:shadow-md transition-shadow"
        />
      </motion.div>
      
      <motion.div 
        className="flex gap-3 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button 
          type="submit" 
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {task ? 'Update Task' : 'Add Task'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1 shadow-sm"
          onClick={() => {
            if (onClose) {
              onClose();
            }
          }}
        >
          Cancel
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default function TaskManagement({ eventId = '1' }: TaskManagementProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from API on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/tasks?eventId=${eventId}`);
        if (response.ok) {
          const tasksData = await response.json();
          setTasks(tasksData);
        } else {
          console.error('Failed to load tasks');
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [eventId]);

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inprogress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    // Optimistically update the UI
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus as 'todo' | 'inprogress' | 'done', updatedAt: new Date().toISOString() }
        : task
    ));

    // Save to database
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus as 'todo' | 'inprogress' | 'done' 
        }),
      });

      if (!response.ok) {
        console.error('Failed to update task status');
        // Revert the optimistic update on failure
        handleRefresh();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      // Revert the optimistic update on failure
      handleRefresh();
    }

    setActiveTask(null);
  };

  const handleAddTask = async (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Add eventId to the task data
      const taskData = {
        ...newTask,
        eventId: eventId
      };

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTasks(prev => [...prev, createdTask]);
      } else {
        console.error('Failed to create task');
        alert('Failed to create task. Please try again.');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    }
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tasks?eventId=${eventId}`);
      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      } else {
        console.error('Failed to refresh tasks');
      }
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSchedule = () => {
    // In a real app, this would update schedule
    console.log('Updating schedule...');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="w-full overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-gray-50/50 to-white">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50" />
        
        <CardHeader className="pb-6 relative z-10">
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg"
              >
                <Target className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Task Management
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Organize and track your event tasks</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="sm" onClick={handleRefresh} className="shadow-sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh task data</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="sm" onClick={handleUpdateSchedule} className="shadow-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Update task schedule</p>
                </TooltipContent>
              </Tooltip>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Add New Task
                      </DialogTitle>
                    </DialogHeader>
                    <TaskForm status="todo" onSave={handleAddTask} />
                  </DialogContent>
                </Dialog>
              </motion.div>
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="relative z-10">
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <motion.div 
              className="flex gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <TaskColumn 
                title="To Do" 
                tasks={todoTasks} 
                status="todo"
                color="bg-gray-100"
                icon={<Circle className="h-5 w-5 text-gray-600" />}
                index={0}
                onDelete={handleDeleteTask}
                onSave={handleAddTask}
              />
              <TaskColumn 
                title="In Progress" 
                tasks={inProgressTasks} 
                status="inprogress"
                color="bg-blue-100"
                icon={<Zap className="h-5 w-5 text-blue-600" />}
                index={1}
                onDelete={handleDeleteTask}
                onSave={handleAddTask}
              />
              <TaskColumn 
                title="Done" 
                tasks={doneTasks} 
                status="done"
                color="bg-green-100"
                icon={<CheckCircle className="h-5 w-5 text-green-600" />}
                index={2}
                onDelete={handleDeleteTask}
                onSave={handleAddTask}
              />
            </motion.div>
            
            <DragOverlay>
              {activeTask ? (
                <motion.div
                  initial={{ scale: 0.8, rotate: -5 }}
                  animate={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskCard task={activeTask} index={0} onDelete={handleDeleteTask} />
                </motion.div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </CardContent>
      </Card>
    </motion.div>
  );
}
