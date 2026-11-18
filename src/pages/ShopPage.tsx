import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, PackageSearch } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { SortOption } from '../types';
import { filterAndSortProducts } from '../utils/storeLogic';
import { ProductCard } from '../components/ProductCard';

export const ShopPage: React.FC = () => {
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  const categoryNameById = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    const next = new URLSearchParams(searchParams);
    if (catId === 'all') {
      next.delete('category');
    } else {
      next.set('category', catId);
    }
    setSearchParams(next);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const next = new URLSearchParams(searchParams);
    if (!value.trim()) {
      next.delete('q');
    } else {
      next.set('q', value);
    }
    setSearchParams(next, { replace: true });
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSortBy('newest');
    setOnlyAvailable(false);
    setSearchParams({});
  };

  const filteredProducts = useMemo(
    () =>
      filterAndSortProducts(products, {
        categoryId: selectedCategory,
        search: searchTerm,
        onlyAvailable,
        sortBy,
        categories,
      }),
    [products, selectedCategory, searchTerm, onlyAvailable, sortBy, categories],
  );

  const activeCategoryName =
    selectedCategory === 'all'
      ? 'All Products'
      : categoryNameById.get(selectedCategory) || 'All Products';

  return (
    <div className="bg-slate-50 min-h-[70vh] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {activeCategoryName}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 tabular-nums">
            Showing {filteredProducts.length} of {products.length} products in Pakistani Rupees (PKR)
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-6 overflow-x-auto pb-1">
          <div
            role="tablist"
            aria-label="Filter products by category"
            className="inline-flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-xl"
          >
            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              All ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Search, Sort & Availability Controls */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <label htmlFor="shop-search" className="sr-only">
              Search products
            </label>
            <input
              id="shop-search"
              type="search"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by product name, description, or category..."
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer min-h-[40px]">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 rounded accent-orange-600 cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <label htmlFor="shop-sort" className="sr-only">
                Sort products
              </label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-11 px-3 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:border-orange-600 cursor-pointer"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 sm:p-16 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4">
              <PackageSearch className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              No matching products found
            </h2>
            <p className="text-sm text-slate-600 mt-2 mb-6">
              Try clearing your search keywords or switching back to all categories.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categoryNameById.get(product.categoryId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
