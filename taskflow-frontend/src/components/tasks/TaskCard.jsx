import React from 'react';
import { Edit, Trash2, Calendar, Tag } from 'lucide-react';
import Button from '../ui/Button';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status === 'pending';

  return (
    <div className={`task-card ${task.status === 'completed' ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={(e) => onStatusChange(task.id, e.target.checked ? 'completed' : 'pending')}
            className="mt-1 h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-gray-900 ${
              task.status === 'completed' ? 'line-through text-gray-500' : ''
            }`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {task.description}
              </p>
            )}
            
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              {task.category && (
                <span className="inline-flex items-center space-x-1">
                  <Tag className="h-3 w-3" />
                  <span>{task.category.name}</span>
                </span>
              )}
              
              {task.due_date && (
                <span className={`inline-flex items-center space-x-1 ${
                  isOverdue ? 'text-danger-500 font-medium' : ''
                }`}>
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.due_date)}</span>
                  {isOverdue && <span className="text-xs">(En retard)</span>}
                </span>
              )}
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-4">
          <Button
            variant="secondary"
            size="small"
            onClick={() => onEdit(task)}
            className="!p-1"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={() => onDelete(task.id)}
            className="!p-1"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;