'use client';

import { ADMIN_ROUTES } from '@/config/routes';
import {
  deletePageContent,
  setPageContentStatus,
} from '@/features/pages/repositories/pages.repository';
import {
  syncNavItemForPage,
  updateNavItems,
} from '@/features/settings/repositories/settings.repository';
import { useToast } from '@/features/shared/components/Toast/Toast';
import { ConfirmDialog } from '@/features/shared/forms/ConfirmDialog/ConfirmDialog';
import type { NavItem, PageContent, PublishStatus } from '@/types';
import Link from 'next/link';
import { useRef, useState } from 'react';
import './NavManager.css';

// =============================================================================
// NavManager
// Single drag-and-drop list with three sections:
//   In Navigation (published) | Drafts | Archived
// Dragging a page between sections updates its status in Firestore immediately.
// Dragging within "In Navigation" reorders the nav (Save order button appears).
// =============================================================================

const BUILT_IN_NAV_ROUTES: NavItem[] = [
  { label: { ar: 'الأماكن', en: 'Places' }, path: '/places' },
  { label: { ar: 'تواصل معنا', en: 'Contact' }, path: '/contact' },
];

type PageRow = { kind: 'page'; page: PageContent };
type BuiltinRow = { kind: 'builtin'; navItem: NavItem };
type PublishedRow = PageRow | BuiltinRow;
type DragSection = 'nav' | 'draft' | 'archived';

interface DragState {
  fromSection: DragSection;
  fromIndex: number;
  slug: string;
  isBuiltin: boolean;
}

const STATUS_LABELS: Record<PublishStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildPublishedRows(
  pages: PageContent[],
  navItems: NavItem[],
): PublishedRow[] {
  // Start from navItems order so existing order is preserved
  const rows: PublishedRow[] = navItems
    .map((ni): PublishedRow | null => {
      const builtin = BUILT_IN_NAV_ROUTES.find((r) => r.path === ni.path);
      if (builtin) return { kind: 'builtin', navItem: builtin };
      const page = pages.find(
        (p) => `/${p.slug}` === ni.path && p.status === 'published',
      );
      return page ? { kind: 'page', page } : null;
    })
    .filter((r): r is PublishedRow => r !== null);

  // Append built-ins not yet in navItems
  for (const builtin of BUILT_IN_NAV_ROUTES) {
    if (
      !rows.some((r) => r.kind === 'builtin' && r.navItem.path === builtin.path)
    ) {
      rows.push({ kind: 'builtin', navItem: builtin });
    }
  }

  // Append published pages not yet in nav
  for (const page of pages.filter((p) => p.status === 'published')) {
    const path = `/${page.slug}`;
    const alreadyIn = rows.some(
      (r) =>
        (r.kind === 'page' && `/${r.page.slug}` === path) ||
        (r.kind === 'builtin' && r.navItem.path === path),
    );
    if (!alreadyIn) rows.push({ kind: 'page', page });
  }

  return rows;
}

function rowsToNavItems(rows: PublishedRow[]): NavItem[] {
  return rows.map((r) =>
    r.kind === 'builtin'
      ? r.navItem
      : { label: r.page.title, path: `/${r.page.slug}` },
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

interface NavManagerProps {
  initialPages: PageContent[];
  initialNavItems: NavItem[];
}

export function NavManager({ initialPages, initialNavItems }: NavManagerProps) {
  const [pages, setPages] = useState<PageContent[]>(initialPages);
  const [publishedRows, setPublishedRows] = useState<PublishedRow[]>(() =>
    buildPublishedRows(initialPages, initialNavItems),
  );
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dragOverSection, setDragOverSection] = useState<DragSection | null>(
    null,
  );
  const [dragOverNavIndex, setDragOverNavIndex] = useState<number | null>(null);
  const dragState = useRef<DragState | null>(null);
  const { toast } = useToast();

  const draftPages = pages.filter((p) => p.status === 'draft');
  const archivedPages = pages.filter((p) => p.status === 'archived');

  // ─── Drag: within nav for reordering ────────────────────────────────────────

  function handleNavRowDragStart(index: number, row: PublishedRow) {
    dragState.current = {
      fromSection: 'nav',
      fromIndex: index,
      slug: row.kind === 'builtin' ? row.navItem.path : row.page.slug,
      isBuiltin: row.kind === 'builtin',
    };
  }

  function handleNavRowDragOver(e: React.DragEvent, toIndex: number) {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSection('nav');
    const state = dragState.current;
    if (!state || state.fromSection !== 'nav') return;
    setDragOverNavIndex(toIndex);
    if (state.fromIndex === toIndex) return;
    const rows = [...publishedRows];
    const [moved] = rows.splice(state.fromIndex, 1);
    if (!moved) return;
    rows.splice(toIndex, 0, moved);
    dragState.current = { ...state, fromIndex: toIndex };
    setPublishedRows(rows);
    setHasOrderChanged(true);
  }

  // ─── Drag: cross-section to change status ───────────────────────────────────

  function handlePageRowDragStart(
    section: DragSection,
    index: number,
    slug: string,
  ) {
    dragState.current = {
      fromSection: section,
      fromIndex: index,
      slug,
      isBuiltin: false,
    };
  }

  function handleSectionDragOver(e: React.DragEvent, section: DragSection) {
    e.preventDefault();
    setDragOverSection(section);
  }

  async function handleSectionDrop(e: React.DragEvent, toSection: DragSection) {
    e.preventDefault();
    const state = dragState.current;
    dragState.current = null;
    setDragOverSection(null);
    setDragOverNavIndex(null);
    if (!state || state.isBuiltin || state.fromSection === toSection) return;
    const page = pages.find((p) => p.slug === state.slug);
    if (!page) return;
    const newStatus: PublishStatus =
      toSection === 'nav' ? 'published' : toSection;
    await handleStatusChange(page, newStatus);
  }

  function handleDragEnd() {
    dragState.current = null;
    setDragOverSection(null);
    setDragOverNavIndex(null);
  }

  // ─── Save nav order ─────────────────────────────────────────────────────────

  async function handleSaveOrder() {
    setSavingOrder(true);
    try {
      await updateNavItems(rowsToNavItems(publishedRows));
      setHasOrderChanged(false);
      toast('Navigation order saved.', 'success');
    } catch {
      toast('Failed to save navigation order.', 'error');
    } finally {
      setSavingOrder(false);
    }
  }

  // ─── Status change ──────────────────────────────────────────────────────────

  async function handleStatusChange(
    page: PageContent,
    newStatus: PublishStatus,
  ) {
    const updatedPage = { ...page, status: newStatus };

    // Optimistic local update
    setPages((prev) =>
      prev.map((p) => (p.slug === page.slug ? updatedPage : p)),
    );
    if (page.status === 'published' && newStatus !== 'published') {
      setPublishedRows((prev) =>
        prev.filter((r) => !(r.kind === 'page' && r.page.slug === page.slug)),
      );
    } else if (page.status !== 'published' && newStatus === 'published') {
      setPublishedRows((prev) => [
        ...prev,
        { kind: 'page', page: updatedPage },
      ]);
    }

    try {
      await setPageContentStatus(page.slug, newStatus);
      await syncNavItemForPage({
        title: page.title,
        slug: page.slug,
        status: newStatus,
      }).catch(() => {});
      toast(
        `"${page.title.en}" is now ${STATUS_LABELS[newStatus].toLowerCase()}.`,
        'success',
      );
    } catch {
      // Revert optimistic update
      setPages((prev) => prev.map((p) => (p.slug === page.slug ? page : p)));
      if (page.status === 'published' && newStatus !== 'published') {
        setPublishedRows((prev) => [...prev, { kind: 'page', page }]);
      } else if (page.status !== 'published' && newStatus === 'published') {
        setPublishedRows((prev) =>
          prev.filter((r) => !(r.kind === 'page' && r.page.slug === page.slug)),
        );
      }
      toast('Failed to update status.', 'error');
    }
  }

  // ─── Delete ─────────────────────────────────────────────────────────────────

  async function handleDelete(slug: string) {
    const page = pages.find((p) => p.slug === slug);
    setDeleting(slug);
    try {
      await deletePageContent(slug);
      setPages((prev) => prev.filter((p) => p.slug !== slug));
      setPublishedRows((prev) =>
        prev.filter((r) => !(r.kind === 'page' && r.page.slug === slug)),
      );
      if (page) {
        await syncNavItemForPage({
          title: page.title,
          slug,
          status: 'archived',
        }).catch(() => {});
      }
      toast('Page deleted.', 'success');
    } catch {
      toast('Failed to delete page.', 'error');
    } finally {
      setDeleting(null);
      setConfirmSlug(null);
    }
  }

  // ─── Row renderer ────────────────────────────────────────────────────────────

  function renderPageRow(
    page: PageContent,
    opts: { section: DragSection; index: number; navDragHandlers?: boolean },
  ) {
    const { section, index, navDragHandlers = false } = opts;
    const isDragOver = navDragHandlers && dragOverNavIndex === index;
    return (
      <div
        key={page.slug}
        className={[
          'nav-manager__row',
          `nav-manager__row--${page.status}`,
          isDragOver ? 'nav-manager__row--drag-over' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        draggable
        onDragStart={
          navDragHandlers
            ? () => handleNavRowDragStart(index, { kind: 'page', page })
            : () => handlePageRowDragStart(section, index, page.slug)
        }
        onDragOver={
          navDragHandlers ? (e) => handleNavRowDragOver(e, index) : undefined
        }
        onDragEnd={handleDragEnd}
        onDrop={(e) => e.preventDefault()}
      >
        <span
          className="nav-manager__handle"
          aria-hidden="true"
          title="Drag to move"
        >
          ⠿
        </span>
        <div className="nav-manager__info">
          <span className="nav-manager__label">{page.title.en}</span>
          {page.title.ar && (
            <span className="nav-manager__label-ar" dir="rtl" lang="ar">
              {page.title.ar}
            </span>
          )}
          <code className="nav-manager__path">/{page.slug}</code>
        </div>
        <span
          className={`nav-manager__status-tag nav-manager__status-tag--${page.status}`}
        >
          {STATUS_LABELS[page.status]}
        </span>
        <Link
          href={ADMIN_ROUTES.PAGE_EDIT(page.slug)}
          className="btn btn--ghost btn--sm"
        >
          Edit
        </Link>
        <button
          type="button"
          className="btn btn--ghost btn--sm btn--danger"
          disabled={deleting === page.slug}
          onClick={() => setConfirmSlug(page.slug)}
        >
          Delete
        </button>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  const confirmPage = pages.find((p) => p.slug === confirmSlug);

  return (
    <div className="nav-manager">
      {/* ── In Navigation ────────────────────────────────────── */}
      <div className="nav-manager__section-header">
        <span className="nav-manager__section-label">In Navigation</span>
        <span className="nav-manager__section-hint">
          Drag between sections to change status · Drag within to reorder
        </span>
        {hasOrderChanged && (
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={handleSaveOrder}
            disabled={savingOrder}
            style={{ marginInlineStart: 'auto' }}
          >
            {savingOrder ? 'Saving…' : 'Save order'}
          </button>
        )}
      </div>

      <div
        className={[
          'nav-manager__section-zone',
          dragOverSection === 'nav' ? 'nav-manager__section-zone--over' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onDragOver={(e) => handleSectionDragOver(e, 'nav')}
        onDrop={(e) => handleSectionDrop(e, 'nav')}
      >
        {/* Home — always first, locked */}
        <div className="nav-manager__row nav-manager__row--locked">
          <span
            className="nav-manager__handle nav-manager__handle--disabled"
            aria-hidden="true"
          >
            ⠿
          </span>
          <div className="nav-manager__info">
            <span className="nav-manager__label">Home</span>
            <code className="nav-manager__path">/</code>
          </div>
          <span className="nav-manager__badge nav-manager__badge--pinned">
            Pinned
          </span>
        </div>

        {publishedRows.map((row, index) => {
          const isDragOver =
            dragOverSection === 'nav' && dragOverNavIndex === index;
          if (row.kind === 'builtin') {
            return (
              <div
                key={row.navItem.path}
                className={[
                  'nav-manager__row',
                  'nav-manager__row--builtin',
                  isDragOver ? 'nav-manager__row--drag-over' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                draggable
                onDragStart={() => handleNavRowDragStart(index, row)}
                onDragOver={(e) => handleNavRowDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => e.preventDefault()}
              >
                <span
                  className="nav-manager__handle"
                  aria-hidden="true"
                  title="Drag to reorder"
                >
                  ⠿
                </span>
                <div className="nav-manager__info">
                  <span className="nav-manager__label">
                    {row.navItem.label.en}
                  </span>
                  {row.navItem.label.ar && (
                    <span className="nav-manager__label-ar" dir="rtl" lang="ar">
                      {row.navItem.label.ar}
                    </span>
                  )}
                  <code className="nav-manager__path">{row.navItem.path}</code>
                </div>
                <span className="nav-manager__badge nav-manager__badge--builtin">
                  Built-in
                </span>
              </div>
            );
          }
          return renderPageRow(row.page, {
            section: 'nav',
            index,
            navDragHandlers: true,
          });
        })}

        {publishedRows.length === 0 && (
          <p className="nav-manager__drop-hint">
            Drop a page here to publish it and add it to the navigation.
          </p>
        )}
      </div>

      {/* ── Drafts ──────────────────────────────────────────────── */}
      <div className="nav-manager__section-header nav-manager__section-header--secondary">
        <span className="nav-manager__section-label">Drafts</span>
      </div>
      <div
        className={[
          'nav-manager__section-zone',
          'nav-manager__section-zone--min',
          dragOverSection === 'draft' ? 'nav-manager__section-zone--over' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onDragOver={(e) => handleSectionDragOver(e, 'draft')}
        onDrop={(e) => handleSectionDrop(e, 'draft')}
      >
        {draftPages.length === 0 ? (
          <p className="nav-manager__drop-hint">
            Drop a page here to save it as draft.
          </p>
        ) : (
          draftPages.map((page, index) =>
            renderPageRow(page, { section: 'draft', index }),
          )
        )}
      </div>

      {/* ── Archived ────────────────────────────────────────────── */}
      <div className="nav-manager__section-header nav-manager__section-header--secondary">
        <span className="nav-manager__section-label">Archived</span>
      </div>
      <div
        className={[
          'nav-manager__section-zone',
          'nav-manager__section-zone--min',
          dragOverSection === 'archived'
            ? 'nav-manager__section-zone--over'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onDragOver={(e) => handleSectionDragOver(e, 'archived')}
        onDrop={(e) => handleSectionDrop(e, 'archived')}
      >
        {archivedPages.length === 0 ? (
          <p className="nav-manager__drop-hint">
            Drop a page here to archive it.
          </p>
        ) : (
          archivedPages.map((page, index) =>
            renderPageRow(page, { section: 'archived', index }),
          )
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmSlug !== null}
        title="Delete page"
        message={`Are you sure you want to permanently delete "${confirmPage?.title.en ?? confirmSlug}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDangerous
        onConfirm={() => confirmSlug && handleDelete(confirmSlug)}
        onCancel={() => setConfirmSlug(null)}
      />
    </div>
  );
}
