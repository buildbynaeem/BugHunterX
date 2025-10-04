'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export default function TaskCard({ task }: TaskCardProps) {
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
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
  const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
    >
      <Card className={`hover:shadow-md transition-shadow ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
              <Badge 
                variant="outline" 
                className={priorityColors[task.priority]}
              >
                {task.priority}
              </Badge>
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Category */}
            <Badge variant="secondary" className="text-xs">
              {task.category}
            </Badge>

            {/* Assignee */}
            {task.assignee && (
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                  <AvatarFallback className="text-xs">
                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {task.assignee.name}
                </span>
              </div>
            )}

            {/* Due Date */}
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(task.dueDate)}</span>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs ml-2">
                  Overdue
                </Badge>
              )}
              {!isOverdue && daysUntilDue <= 3 && daysUntilDue > 0 && (
                <Badge variant="outline" className="text-xs ml-2 bg-yellow-100 text-yellow-800">
                  Due Soon
                </Badge>
              )}
            </div>

            {/* Created Date */}
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Created {formatDate(task.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

