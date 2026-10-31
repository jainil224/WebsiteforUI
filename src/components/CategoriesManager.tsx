import { useState } from 'react'
import { Icon, type IconName } from './icons'
import { CategoryModal } from './CategoryModal'
import { ConfirmDeleteModal } from './ConfirmDeleteModal'
import type { CategoryRecord, InspirationRecord } from '../lib/storageTypes'

type CategoriesManagerProps = {
  categories: CategoryRecord[]
  items: InspirationRecord[]
  onSelectCategory?: (id: string) => void
  onCreateCategory: (data: { label: string; icon?: string }) => { success: boolean; error?: Error }
  onDeleteCategory: (id: string) => { success: boolean; error?: Error }
}

export function CategoriesManager({
  categories,
  items,
  onSelectCategory,
  onCreateCategory,
  onDeleteCategory,
}: CategoriesManagerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteConfirm = () => {
    if (!categoryToDelete) return
    setIsDeleting(true)
    const res = onDeleteCategory(categoryToDelete.id)
    setIsDeleting(false)
    if (res.success) {
      setCategoryToDelete(null)
    }
  }

  return (
    <div className="categories-manager-view">
      <div className="categories-manager-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
        paddingBottom: 'var(--space-4)',
        borderBottom: 'var(--border-width) solid var(--color-border)',
      }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-h2)', color: 'var(--color-cream)', margin: 0 }}>
            Manage Categories
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-label)', margin: 'var(--space-1) 0 0' }}>
            Add new categories or delete existing ones. Deleted category references are safely reassigned to &ldquo;Other&rdquo;.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Icon name="plus" size={16} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="categories-grid" role="list" aria-label="Browse and manage categories">
        {categories.map((cat) => {
          const count = items.filter((item) => item.categoryId === cat.id).length
          const isProtected = cat.id === 'other'

          return (
            <div key={cat.id} className="card category-card" role="listitem">
              <div className="category-card__header">
                <div className="category-card__icon" aria-hidden="true">
                  <Icon name={(cat.icon as IconName) || 'categories'} size={20} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span className="chip chip--tag">
                    {count} {count === 1 ? 'item' : 'items'}
                  </span>
                  {!isProtected && (
                    <button
                      type="button"
                      className="btn btn--ghost btn--icon"
                      style={{ width: '2rem', height: '2rem', color: 'var(--color-danger)' }}
                      onClick={() => setCategoryToDelete(cat)}
                      title={`Delete "${cat.label}" category`}
                      aria-label={`Delete "${cat.label}" category`}
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="category-card__title">{cat.label}</h3>
              <p className="category-card__desc">
                {isProtected
                  ? 'Default fallback category for items and unclassified sparks.'
                  : `Organize design inspirations related to ${cat.label.toLowerCase()}.`}
              </p>

              <div style={{ marginTop: 'auto', paddingTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)' }}>
                <a
                  href="#/dashboard"
                  className="btn btn--ghost btn--sm category-card__action"
                  onClick={() => onSelectCategory?.(cat.id)}
                >
                  <span>Filter in Dashboard</span>
                  <Icon name="arrow-right" size={13} />
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {isAddModalOpen && (
        <CategoryModal
          open={isAddModalOpen}
          existingCategories={categories}
          onClose={() => setIsAddModalOpen(false)}
          onSave={onCreateCategory}
        />
      )}

      {categoryToDelete && (
        <ConfirmDeleteModal
          open={Boolean(categoryToDelete)}
          title={categoryToDelete.label}
          dialogTitle={`Delete Category "${categoryToDelete.label}"?`}
          message={`Are you sure you want to delete the "${categoryToDelete.label}" category? All saved inspirations currently under this category will automatically be kept safe and moved to "Other".`}
          confirmLabel="Delete Category"
          isDeleting={isDeleting}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  )
}

