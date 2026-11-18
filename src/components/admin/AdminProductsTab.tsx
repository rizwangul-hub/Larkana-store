import React, { useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Product } from '../../types';
import { formatPKR, getEffectivePrice } from '../../utils/storeLogic';
import { SafeImage } from '../SafeImage';

const PRESET_IMAGES = [
  { label: 'Study Books Bundle', url: '/src/assets/images/prod_book_exam_guide_1795005669002.jpg' },
  { label: 'Hardcover Novel', url: '/src/assets/images/prod_book_literary_novel_1795005669425.jpg' },
  { label: 'Embroidered Lawn Dress', url: '/src/assets/images/prod_dress_orange_lawn_1795005669304.jpg' },
  { label: 'Festive Organza Kurti', url: '/src/assets/images/prod_dress_emerald_festive_1795005672927.jpg' },
  { label: "Men's Oxford Shirt", url: '/src/assets/images/prod_clothes_oxford_shirt_1795005672326.jpg' },
  { label: 'Cotton Kurta', url: '/src/assets/images/prod_clothes_cotton_kurta_1795005672498.jpg' },
  { label: 'Running Sneakers', url: '/src/assets/images/prod_shoes_running_sneakers_1795005698922.jpg' },
  { label: 'Formal Leather Oxfords', url: '/src/assets/images/prod_shoes_formal_oxford_1795005674850.jpg' },
  { label: 'Cognac Leather Tote', url: '/src/assets/images/prod_bags_leather_tote_1795005728322.jpg' },
  { label: 'Canvas School Backpack', url: '/src/assets/images/prod_bags_school_backpack_1795005678747.jpg' },
  { label: 'Eyeshadow Makeup Kit', url: '/src/assets/images/prod_cosmetics_makeup_kit_1795005980967.jpg' },
  { label: 'Vitamin C Skincare', url: '/src/assets/images/prod_cosmetics_skincare_serum_1795005980784.jpg' },
];

export const AdminProductsTab: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-books');
  const [price, setPrice] = useState('1500');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [available, setAvailable] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [formError, setFormError] = useState('');

  const catMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (filterCat !== 'all' && p.categoryId !== filterCat) return false;
      if (q && !`${p.name} ${p.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, search, filterCat]);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setCategoryId(categories[0]?.id || '');
    setPrice('1500');
    setDiscountPrice('');
    setStock('15');
    setAvailable(true);
    setFeatured(false);
    setIsDemo(false);
    setImageUrl(PRESET_IMAGES[0].url);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setCategoryId(product.categoryId);
    setPrice(String(product.price));
    setDiscountPrice(product.discountPrice ? String(product.discountPrice) : '');
    setStock(String(product.stock));
    setAvailable(product.available);
    setFeatured(product.featured);
    setIsDemo(Boolean(product.isDemo));
    setImageUrl(product.images[0] || PRESET_IMAGES[0].url);
    setFormError('');
    setModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = Number(price);
    const numDiscount = discountPrice.trim() ? Number(discountPrice) : undefined;
    const numStock = Number(stock);

    if (!name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (!description.trim()) {
      setFormError('Product description is required.');
      return;
    }
    if (!Number.isFinite(numPrice) || numPrice <= 0) {
      setFormError('Enter a valid price in PKR.');
      return;
    }
    if (numDiscount !== undefined && (numDiscount <= 0 || numDiscount >= numPrice)) {
      setFormError('Discount price must be lower than the original PKR price.');
      return;
    }
    if (!Number.isFinite(numStock) || numStock < 0) {
      setFormError('Enter a valid stock quantity (0 or higher).');
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      categoryId,
      price: Math.round(numPrice),
      discountPrice: numDiscount ? Math.round(numDiscount) : undefined,
      stock: Math.round(numStock),
      available,
      featured,
      isDemo,
      images: [imageUrl.trim() || PRESET_IMAGES[0].url],
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            Product Inventory ({products.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sample demo items are labeled separately from custom store inventory added by you.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <label htmlFor="admin-prod-search" className="sr-only">
            Search products
          </label>
          <input
            id="admin-prod-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
          />
        </div>
        <select
          aria-label="Filter by category"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-800 bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Origin</th>
                <th className="py-3 px-4 font-semibold text-right">Price</th>
                <th className="py-3 px-4 font-semibold text-right">Stock</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 aspect-[4/3] rounded overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <SafeImage
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 max-w-[220px]">
                        <p className="font-semibold text-slate-900 truncate">
                          {product.name}
                        </p>
                        {product.featured && (
                          <span className="text-[11px] font-semibold text-orange-600">
                            Featured on Home
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {catMap.get(product.categoryId) || 'Unassigned'}
                  </td>
                  <td className="py-3 px-4 text-xs">
                    <span
                      className={`font-semibold ${
                        product.isDemo ? 'text-slate-500' : 'text-emerald-700'
                      }`}
                    >
                      {product.isDemo ? 'Sample Demo' : 'Store Inventory'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    <span className="font-semibold text-slate-900">
                      {formatPKR(getEffectivePrice(product))}
                    </span>
                    {product.discountPrice && product.discountPrice < product.price && (
                      <span className="block text-xs text-slate-400 line-through">
                        {formatPKR(product.price)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-700">
                    {product.stock}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() =>
                        updateProduct(product.id, { available: !product.available })
                      }
                      className={`text-xs font-semibold cursor-pointer ${
                        product.available && product.stock > 0
                          ? 'text-emerald-700 hover:underline'
                          : 'text-rose-700 hover:underline'
                      }`}
                    >
                      {product.available && product.stock > 0 ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(product)}
                        aria-label={`Edit ${product.name}`}
                        className="p-2 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-orange-50 cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" aria-hidden="true" />
                      </button>

                      {confirmDeleteId === product.id ? (
                        <button
                          type="button"
                          onClick={() => {
                            deleteProduct(product.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-semibold cursor-pointer"
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(product.id)}
                          aria-label={`Delete ${product.name}`}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-slate-500">
                    No products match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={editingProduct ? 'Edit Product' : 'Add New Product'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
        >
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-display text-lg font-bold text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
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

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {formError && (
                <p role="alert" className="text-xs font-medium text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200">
                  {formError}
                </p>
              )}

              <div>
                <label htmlFor="prod-form-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  id="prod-form-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sindhi Ajrak Cotton Shawl"
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-900"
                />
              </div>

              <div>
                <label htmlFor="prod-form-desc" className="block text-xs font-semibold text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="prod-form-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe material, size, or highlights..."
                  className="w-full p-3 rounded-lg border border-slate-300 text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="prod-form-cat" className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    id="prod-form-cat"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="prod-form-stock" className="block text-xs font-semibold text-slate-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    id="prod-form-stock"
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-900 tabular-nums"
                  />
                </div>

                <div>
                  <label htmlFor="prod-form-price" className="block text-xs font-semibold text-slate-700 mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    id="prod-form-price"
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-900 tabular-nums"
                  />
                </div>

                <div>
                  <label htmlFor="prod-form-discount" className="block text-xs font-semibold text-slate-700 mb-1">
                    Discount Price (PKR, Optional)
                  </label>
                  <input
                    id="prod-form-discount"
                    type="number"
                    min="1"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="Leave blank if no sale"
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-900 tabular-nums"
                  />
                </div>
              </div>

              {/* Image Selection / Upload */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700">
                  Product Image (Choose Studio Preset or Upload Photo)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                    <SafeImage src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <select
                    aria-label="Select studio preset image"
                    value={PRESET_IMAGES.some((p) => p.url === imageUrl) ? imageUrl : 'custom'}
                    onChange={(e) => {
                      if (e.target.value !== 'custom') setImageUrl(e.target.value);
                    }}
                    className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                  >
                    {PRESET_IMAGES.map((preset) => (
                      <option key={preset.url} value={preset.url}>
                        {preset.label}
                      </option>
                    ))}
                    <option value="custom">Custom Uploaded / URL</option>
                  </select>
                  <label className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-5 pt-2">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="accent-orange-600"
                  />
                  <span>Available for Purchase</span>
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-orange-600"
                  />
                  <span>Feature on Homepage</span>
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDemo}
                    onChange={(e) => setIsDemo(e.target.checked)}
                    className="accent-orange-600"
                  />
                  <span>Mark as Sample Demo Item</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
