import React, { useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Category } from '../../types';
import { SafeImage } from '../SafeImage';

const CATEGORY_IMAGE_OPTIONS = [
  { label: 'Books Collection', url: '/src/assets/images/prod_book_exam_guide_1795005669002.jpg' },
  { label: 'Dresses Collection', url: '/src/assets/images/prod_dress_orange_lawn_1795005669304.jpg' },
  { label: 'Clothes Collection', url: '/src/assets/images/prod_clothes_oxford_shirt_1795005672326.jpg' },
  { label: 'Shoes Collection', url: '/src/assets/images/prod_shoes_running_sneakers_1795005698922.jpg' },
  { label: 'Bags Collection', url: '/src/assets/images/prod_bags_leather_tote_1795005728322.jpg' },
  { label: 'Cosmetics Collection', url: '/src/assets/images/prod_cosmetics_makeup_kit_1795005980967.jpg' },
];

export const AdminCategoriesTab: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(CATEGORY_IMAGE_OPTIONS[0].url);
  const [error, setError] = useState('');

  const openAdd = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setImage(CATEGORY_IMAGE_OPTIONS[0].url);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image);
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }
    if (!description.trim()) {
      setError('Category description is required.');
      return;
    }

    if (editing) {
      updateCategory(editing.id, {
        name: name.trim(),
        description: description.trim(),
        image,
      });
    } else {
      addCategory({
        name: name.trim(),
        description: description.trim(),
        image,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            Categories ({categories.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Changes update both the homepage category showcase and shop filters immediately.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 cursor-pointer"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const itemCount = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/9] bg-slate-100">
                <SafeImage
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-base font-bold text-slate-900">
                      {cat.name}
                    </h3>
                    <span className="text-xs font-semibold text-slate-500 tabular-nums">
                      {itemCount} items
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400">
                    {cat.isDemo ? 'Sample Demo' : 'Custom Category'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(cat)}
                      aria-label={`Edit ${cat.name}`}
                      className="p-2 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-orange-50 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCategory(cat.id)}
                      aria-label={`Delete ${cat.name}`}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={editing ? 'Edit Category' : 'Add Category'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
        >
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-slate-900">
                {editing ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <p role="alert" className="text-xs font-medium text-rose-700 bg-rose-50 p-3 rounded-lg">
                  {error}
                </p>
              )}
              <div>
                <label htmlFor="cat-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  id="cat-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="cat-desc" className="block text-xs font-semibold text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="cat-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-300 text-sm text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="cat-img" className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Image
                </label>
                <select
                  id="cat-img"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white"
                >
                  {CATEGORY_IMAGE_OPTIONS.map((opt) => (
                    <option key={opt.url} value={opt.url}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
