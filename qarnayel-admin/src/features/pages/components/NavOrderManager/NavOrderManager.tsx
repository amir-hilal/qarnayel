'use client';

import { updateNavItems } from '@/features/settings/repositories/settings.repository';
import { useToast } from '@/features/shared/components/Toast/Toast';
import type { NavItem, PageContent } from '@/types';
import { useRef, useState } from 'react';
import './NavOrderManager.css';

// =============================================================================
// NavOrderManager — drag-and-drop nav ordering with save
// =============================================================================

/**
 * Static Next.js routes that exist outside the pageContent collection.
 * These are always available to add to the nav, regardless of Firestore data.
 */
const BUILT_IN_NAV_ROUTES: NavItem[] = [
  { label: { ar: 'الأماكن', en: 'Places' }, path: '/places' },
];

interface NavOrderManagerProps {
  initialNavItems: NavItem[];
  /** All page content documents (for the "add to nav" picker). */
  pages: PageContent[];
}

export function NavOrderManager({
  initialNavItems,
  pages,
}: NavOrderManagerProps) {
  const [navItems, setNavItems] = useState<NavItem[]>(initialNavItems);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedPath, setSelectedPath] = useState('');
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragIndex = useRef<number | null>(null);
  const { toast } = useToast();

  // Built-in static routes not already in the nav
  const availableBuiltIns = BUILT_IN_NAV_ROUTES.filter(
    (r) => !navItems.some((n) => n.path === r.path),
  );

  // Published pageContent pages not already in the nav
  const availablePages: NavItem[] = pages
    .filter((p) => p.status === 'published')
    .filter((p) => !navItems.some((n) => n.path === `/${p.slug}`))
    .map((p) => ({ label: p.title, path: `/${p.slug}` }));

  // ─── Drag handlers ──────────────────────────────────────────────────────────

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOverIndex(index);
    if (dragIndex.current === null || dragIndex.current === index) return;
    const items = [...navItems];
    const [moved] = items.splice(dragIndex.current, 1);
    if (moved === undefined) return;
    items.splice(index, 0, moved);
    dragIndex.current = index;
    setNavItems(items);
    setHasChanges(true);
  }

  function handleDragEnd() {
    dragIndex.current = null;
    setDragOverIndex(null);
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  function removeItem(index: number) {
    setNavItems((prev) => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  }

  function addPage() {
    const allAvailable = [...availableBuiltIns, ...availablePages];
    const item = allAvailable.find((a) => a.path === selectedPath);
    if (!item) return;
    setNavItems((prev) => [...prev, item]);
    setSelectedPath('');
    setHasChanges(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateNavItems(navItems);
      setHasChanges(false);
      toast('Navigation order saved.', 'success');
    } catch {
      toast('Failed to save navigation order.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="nav-order-manager">
      {/* Locked home row */}
      <div className="nav-order-manager__item nav-order-manager__item--locked">
        <span className="nav-order-manager__handle" aria-hidden="true">
          ⠿
        </span>
        <div className="nav-order-manager__info">
          <span className="nav-order-manager__label">Home</span>
          <code className="nav-order-manager__path">/</code>
        </div>
        <span className="nav-order-manager__pin-badge">Pinned</span>
      </div>

      {/* Draggable items */}
      {navItems.map((item, index) => (
        <div
          key={item.path}
          className={[
            'nav-order-manager__item',
            dragOverIndex === index ? 'nav-order-manager__item--drag-over' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          onDrop={(e) => e.preventDefault()}
        >
          <span
            className="nav-order-manager__handle"
            aria-hidden="true"
            title="Drag to reorder"
          >
            ⠿
          </span>
          <div className="nav-order-manager__info">
            <span className="nav-order-manager__label">{item.label.en}</span>
            {item.label.ar && (
              <span className="nav-order-manager__label-ar" dir="rtl" lang="ar">
                {item.label.ar}
              </span>
            )}
            <code className="nav-order-manager__path">{item.path}</code>
          </div>
          <button
            type="button"
            className="btn btn--ghost btn--sm btn--danger"
            onClick={() => removeItem(index)}
            aria-label={`Remove ${item.label.en} from nav`}
          >
            Remove
          </button>
        </div>
      ))}

      {navItems.length === 0 && (
        <p className="nav-order-manager__empty">
          No nav items yet. Add pages below.
        </p>
      )}

      {/* Add page picker */}
      {(availableBuiltIns.length > 0 || availablePages.length > 0) && (
        <div className="nav-order-manager__add">
          <select
            className="form-field__control"
            value={selectedPath}
            onChange={(e) => setSelectedPath(e.target.value)}
            aria-label="Select page to add to navigation"
          >
            <option value="">— Add a page to nav —</option>
            {availableBuiltIns.length > 0 && (
              <optgroup label="Site sections">
                {availableBuiltIns.map((r) => (
                  <option key={r.path} value={r.path}>
                    {r.label.en} ({r.path})
                  </option>
                ))}
              </optgroup>
            )}
            {availablePages.length > 0 && (
              <optgroup label="Custom pages">
                {availablePages.map((item) => (
                  <option key={item.path} value={item.path}>
                    {item.label.en} ({item.path})
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            disabled={!selectedPath}
            onClick={addPage}
          >
            Add
          </button>
        </div>
      )}

      {/* Save */}
      <div className="nav-order-manager__footer">
        <p className="nav-order-manager__hint">
          The nav shows up to 5 items; extras appear in an &ldquo;Other&rdquo;
          dropdown. Changes only apply after saving.
        </p>
        <button
          type="button"
          className="btn btn--primary"
          disabled={!hasChanges || saving}
          onClick={handleSave}
        >
          {saving ? 'Saving…' : 'Save nav order'}
        </button>
      </div>
    </div>
  );
}
