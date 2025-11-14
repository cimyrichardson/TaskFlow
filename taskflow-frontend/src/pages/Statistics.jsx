import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { tasksAPI, categoriesAPI } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Statistics = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

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

  const getStatusData = () => {
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    
    return [
      { name: 'Terminées', value: completed, color: '#10B981' },
      { name: 'En cours', value: pending, color: '#F59E0B' }
    ];
  };

  const getPriorityData = () => {
    const priorities = {
      low: tasks.filter(t => t.priority === 'low').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      high: tasks.filter(t => t.priority === 'high').length,
    };

    return [
      { name: 'Basse', value: priorities.low, color: '#10B981' },
      { name: 'Moyenne', value: priorities.medium, color: '#F59E0B' },
      { name: 'Haute', value: priorities.high, color: '#EF4444' }
    ];
  };

  const getCategoryData = () => {
    const categoryMap = {};
    
    categories.forEach(category => {
      categoryMap[category.id] = {
        name: category.name,
        color: category.color,
        count: 0
      };
    });

    categoryMap.uncategorized = {
      name: 'Non catégorisé',
      color: '#6B7280',
      count: 0
    };

    tasks.forEach(task => {
      if (task.category_id && categoryMap[task.category_id]) {
        categoryMap[task.category_id].count++;
      } else {
        categoryMap.uncategorized.count++;
      }
    });

    return Object.values(categoryMap).filter(item => item.count > 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const statusData = getStatusData();
  const priorityData = getPriorityData();
  const categoryData = getCategoryData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="input-field"
        >
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="year">Cette année</option>
          <option value="all">Tout le temps</option>
        </select>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
          <div className="text-gray-600">Tâches totales</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-success-500">
            {((statusData[0]?.value / tasks.length) * 100 || 0).toFixed(1)}%
          </div>
          <div className="text-gray-600">Taux de completion</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-danger-500">
            {tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status === 'pending').length}
          </div>
          <div className="text-gray-600">Tâches en retard</div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statut des tâches */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par statut</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priorités */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par priorité</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Catégories */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par catégorie</h3>
        <div className="space-y-3">
          {categoryData.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium text-gray-900">{category.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{category.count} tâches</span>
                <span className="text-sm text-gray-500">
                  ({((category.count / tasks.length) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;