import React, { useState, useEffect } from 'react';
import { Plus, Filter, Grid3X3, BarChart3 } from 'lucide-react';
import Button from '../components/ui/Button';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import CategoryManager from '../components/categories/CategoryManager';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { tasksAPI, categoriesAPI } from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksResponse, categoriesResponse] = await Promise.all([
        tasksAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      setTasks(tasksResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // CREATE - Créer une tâche
  const handleCreateTask = async (taskData) => {
    setFormLoading(true);
    try {
      await tasksAPI.create(taskData);
      setShowTaskForm(false);
      await loadData(); // Recharger les données
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Erreur lors de la création de la tâche');
    } finally {
      setFormLoading(false);
    }
  };

  // UPDATE - Modifier une tâche
  const handleUpdateTask = async (taskData) => {
    setFormLoading(true);
    try {
      await tasksAPI.update(editingTask.id, taskData);
      setShowTaskForm(false);
      setEditingTask(null);
      await loadData(); // Recharger les données
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Erreur lors de la modification de la tâche');
    } finally {
      setFormLoading(false);
    }
  };

  // DELETE - Supprimer une tâche
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await tasksAPI.delete(taskId);
        await loadData(); // Recharger les données
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Erreur lors de la suppression de la tâche');
      }
    }
  };

  // UPDATE STATUS - Changer le statut d'une tâche
  const handleStatusChange = async (taskId, status) => {
    try {
      await tasksAPI.updateStatus(taskId, status);
      // Mettre à jour localement pour une meilleure performance
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, status } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Erreur lors du changement de statut');
    }
  };

  // READ - Filtrer les tâches
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed' && task.status !== 'completed') return false;
    if (filter === 'pending' && task.status !== 'pending') return false;
    if (categoryFilter !== 'all' && task.category_id !== parseInt(categoryFilter)) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  const tabs = [
    { id: 'tasks', name: 'Tâches', icon: Grid3X3 },
    { id: 'categories', name: 'Catégories', icon: BarChart3 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête et onglets */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === 'tasks' ? 'Mes Tâches' : 'Catégories'}
          </h1>
          {activeTab === 'tasks' && (
            <p className="text-gray-600">
              {stats.completed} sur {stats.total} tâches complétées
            </p>
          )}
        </div>
        
        {activeTab === 'tasks' && (
          <Button onClick={() => setShowTaskForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle tâche
          </Button>
        )}
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'tasks' ? (
        <>
          {/* Filtres */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filtrer :</span>
              </div>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field text-sm"
              >
                <option value="all">Toutes</option>
                <option value="pending">En cours</option>
                <option value="completed">Terminées</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field text-sm"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Liste des tâches */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">
                  {tasks.length === 0 ? 'Aucune tâche pour le moment' : 'Aucune tâche ne correspond aux filtres'}
                </div>
                {tasks.length === 0 && (
                  <Button 
                    onClick={() => setShowTaskForm(true)}
                    className="mt-4"
                  >
                    Créer votre première tâche
                  </Button>
                )}
              </div>
            ) : (
              filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={setEditingTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <CategoryManager 
          categories={categories} 
          onUpdate={loadData}
        />
      )}

      {/* Modal de formulaire de tâche */}
      {(showTaskForm || editingTask) && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default Dashboard;