'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '@/lib/types';
import TaskCard from './TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface KanbanProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' },
] as const;

export default function Kanban({ tasks, onTaskUpdate }: KanbanProps) {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];
    
    if (newStatus && ['todo', 'in-progress', 'done'].includes(newStatus)) {
      onTaskUpdate(taskId, { status: newStatus });
    }
    
    setActiveTask(null);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id as Task['status']);
          
          return (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="h-fit">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{column.title}</CardTitle>
                    <Badge variant="secondary" className="bg-muted">
                      {columnTasks.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <SortableContext 
                    items={columnTasks.map(task => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3 min-h-[200px]">
                      {columnTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                      {columnTasks.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p className="text-sm">No tasks in this column</p>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-50">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

