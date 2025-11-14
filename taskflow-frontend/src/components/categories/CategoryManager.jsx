import React, { useState } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import Button from '../ui/Button';
import { categoriesAPI } from '../../services/api';

const CategoryManager = ({ categories, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3B82F6' });
  const [loading, setLoading] = useState(false);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    setLoading(true);
    try {
      await categoriesAPI.create(newCategory);
      setNewCategory({ name: '', color: '#3B82F6' });
      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Les tâches associées seront conservées sans catégorie.')) {
      try {
        await categoriesAPI.delete(categoryId);
        onUpdate();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const colorOptions = [
    { value: '#3B82F6', name: 'Bleu' },
    { value: '#EF4444', name: 'Rouge' },
    { value: '#10B981', name: 'Vert' },
    { value: '#F59E0B', name: 'Jaune' },
    { value: '#8B5CF6', name: 'Violet' },
    { value: '#EC4899', name: 'Rose' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Catégories</h3>
        <Button
          size="small"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateCategory} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la catégorie
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="input-field"
                placeholder="Ex: Travail, Personnel..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Couleur
              </label>
              <div className="flex space-x-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      newCategory.color === color.value ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setNewCategory({ ...newCategory, color: color.value })}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowForm(false)}
            >
              Annuler
            </Button>
            <Button type="submit" loading={loading}>
              Créer
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {categories.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Aucune catégorie créée
          </p>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <span className="font-medium text-gray-900">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({category.tasks_count} tâches)
                  </span>
                </div>
              </div>
              <Button
                variant="danger"
                size="small"
                onClick={() => handleDeleteCategory(category.id)}
                className="!p-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryManager;