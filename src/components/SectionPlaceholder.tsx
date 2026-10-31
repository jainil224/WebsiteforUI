import { useRef, useState, type ChangeEvent } from 'react'
import { Icon } from './icons'
import { categories as defaultCategories } from '../data/categories'
import { CategoriesManager } from './CategoriesManager'
import { InspirationCard } from './InspirationCard'
import { FilterToolbar } from './FilterToolbar'
import type { RoutePath } from '../lib/routes'
import type { CategoryRecord, InspirationRecord } from '../lib/storageTypes'
import type { SortOption } from '../lib/libraryFilters'
import {
  parseLocalBackup,
  type BackupRestoreMode,
  type BackupRestoreResult,
  type ParsedLocalBackup,
} from '../lib/localBackup'
import type { StorageResult } from '../lib/storageTypes'

type SectionPlaceholderProps = {
  path: RoutePath
  items?: InspirationRecord[]
  categories?: CategoryRecord[]
  filteredFavorites?: InspirationRecord[]
  searchQuery?: string
  selectedCategory?: string
  selectedTag?: string
  availableTags?: { tag: string; count: number }[]
  sort?: SortOption
  onSelectCategory?: (id: string) => void
  onSelectTag?: (tag: string) => void
  onSortChange?: (sort: SortOption) => void
  onClearFilters?: () => void
  onOpenAddModal: () => void
  onToggleFavorite?: (id: string) => void
  onSelectRecord?: (item: InspirationRecord) => void
  onEditRecord?: (item: InspirationRecord) => void
  onDeleteRecord?: (item: InspirationRecord) => void
  onCreateCategory?: (data: { label: string; icon?: string }) => { success: boolean; error?: Error }
  onDeleteCategory?: (id: string) => { success: boolean; error?: Error }
  onExportJson?: () => void
  onExportFullBackup?: (
    onProgress: (message: string) => void,
  ) => Promise<StorageResult<{
    summary: { inspirations: number; collections: number; screenshots: number; missingScreenshots: number }
    warnings: string[]
  }>>
  onRestoreBackup?: (
    backup: ParsedLocalBackup,
    mode: BackupRestoreMode,
    onProgress: (message: string) => void,
  ) => Promise<StorageResult<BackupRestoreResult>>
  onImportJson?: (file: File) => Promise<{ success: boolean; error?: Error }>
  onExportCsv?: () => void
  onClearData?: () => Promise<{ success: boolean; error?: Error }>
  opfsAvailable?: boolean
}

export function SectionPlaceholder({
  path,
  items = [],
  categories = defaultCategories,
  filteredFavorites = [],
  searchQuery = '',
  selectedCategory = '',
  selectedTag = '',
  availableTags = [],
  sort = 'newest',
  onSelectCategory,
  onSelectTag,
  onSortChange,
  onClearFilters,
  onOpenAddModal,
  onToggleFavorite,
  onSelectRecord,
  onEditRecord,
  onDeleteRecord,
  onCreateCategory,
  onDeleteCategory,
  onExportJson,
  onExportFullBackup,
  onRestoreBackup,
  onImportJson,
  onExportCsv,
  onClearData,
  opfsAvailable = true,
}: SectionPlaceholderProps) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusTone, setStatusTone] = useState<'success' | 'error' | 'info'>('info')
  const [backupFile, setBackupFile] = useState<File | null>(null)
  const [parsedBackup, setParsedBackup] = useState<ParsedLocalBackup | null>(null)
  const [restoreMode, setRestoreMode] = useState<BackupRestoreMode>('merge')
  const [backupProgress, setBackupProgress] = useState<string | null>(null)
  const [isBackupWorking, setIsBackupWorking] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const backupInputRef = useRef<HTMLInputElement | null>(null)

  const handleBackupFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setBackupFile(file)
    setParsedBackup(null)
    if (!file) return

    setIsBackupWorking(true)
    setBackupProgress('Validating backup archive…')
    setStatusTone('info')
    setStatusMessage(null)
    try {
      const result = await parseLocalBackup(file)
      if (!result.success) {
        setStatusTone('error')
        setStatusMessage(result.error.message)
      } else {
        setParsedBackup(result.data)
        setStatusTone(result.data.warnings.length ? 'info' : 'success')
        setStatusMessage(
          result.data.warnings.length
            ? `Backup validated with ${result.data.warnings.length} warning(s). Review the summary before restoring.`
            : 'Backup validated. Review the summary and choose how to restore it.',
        )
      }
    } finally {
      setBackupProgress(null)
      setIsBackupWorking(false)
      event.target.value = ''
    }
  }

  const handleFullBackupExport = async () => {
    if (!onExportFullBackup) return
    setIsBackupWorking(true)
    setStatusMessage(null)
    try {
      const result = await onExportFullBackup(setBackupProgress)
      if (!result.success) {
        setStatusTone('error')
        setStatusMessage(result.error.message)
      } else {
        const { summary, warnings } = result.data
        setStatusTone(warnings.length ? 'info' : 'success')
        setStatusMessage(
          `Full backup downloaded: ${summary.inspirations} inspirations, ${summary.collections} collections, ${summary.screenshots} screenshots.` +
            (warnings.length ? ` ${warnings.length} preview warning(s): ${warnings.join(' ')}` : ''),
        )
      }
    } catch (error) {
      setStatusTone('error')
      setStatusMessage(error instanceof Error ? error.message : 'Could not export the full backup.')
    } finally {
      setBackupProgress(null)
      setIsBackupWorking(false)
    }
  }

  const handleBackupRestore = async () => {
    if (!parsedBackup || !onRestoreBackup) return
    if (restoreMode === 'replace') {
      const confirmed = window.confirm(
        `Replace the current library with this backup? This will replace ${items.length} inspirations and the current collections. This cannot be undone.`,
      )
      if (!confirmed) return
    }

    setIsBackupWorking(true)
    setStatusMessage(null)
    try {
      const result = await onRestoreBackup(parsedBackup, restoreMode, setBackupProgress)
      if (!result.success) {
        setStatusTone('error')
        setStatusMessage(result.error.message)
      } else {
        const summary = result.data
        setStatusTone(summary.warnings.length ? 'info' : 'success')
        setStatusMessage(
          `Restore complete: ${summary.importedInspirations} inspirations, ${summary.importedCollections} collections, ${summary.restoredScreenshots} screenshots restored; ${summary.skippedInspirations} duplicate inspiration(s) skipped.` +
            (summary.warnings.length ? ` ${summary.warnings.join(' ')}` : ''),
        )
      }
    } catch (error) {
      setStatusTone('error')
      setStatusMessage(error instanceof Error ? error.message : 'Could not restore this backup.')
    } finally {
      setBackupProgress(null)
      setIsBackupWorking(false)
    }
  }

  const runStatusAction = async (
    action: () => Promise<{ success: boolean; error?: Error }> | void,
    successMessage: string,
  ) => {
    const result = await action()

    if (result && !result.success) {
      const message = result.error?.message || 'The action could not be completed.'
      setStatusTone('error')
      setStatusMessage(message)
      return
    }

    setStatusTone('success')
    setStatusMessage(successMessage)
  }

  const handleImportFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!onImportJson) {
      setStatusTone('error')
      setStatusMessage('Import is not available in this browser session.')
      event.target.value = ''
      return
    }

    const result = await onImportJson(file)
    if (result.success) {
      setStatusTone('success')
      setStatusMessage(`Imported ${file.name}. Your library updated successfully.`)
    } else {
      setStatusTone('error')
      setStatusMessage(result.error?.message || 'The imported JSON file could not be validated.')
    }

    event.target.value = ''
  }
  if (path === '/favorites') {
    const totalFavorites = items.filter((item) => item.favorite)
    const hasActiveFilters = Boolean(
      searchQuery.trim() || selectedCategory || selectedTag,
    )

    if (totalFavorites.length === 0) {
      return (
        <div className="section-placeholder">
          <section className="empty-state" aria-label="Favorites empty state">
            <div className="empty-state__icon" aria-hidden="true">
              <Icon name="heart" size={24} />
            </div>
            <h2 className="empty-state__title">No favorite inspirations yet</h2>
            <p className="empty-state__text">
              When you find a reference that stands out, mark it with a heart to keep it in this quick-access list.
            </p>
            <div className="empty-state__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={onOpenAddModal}
              >
                <Icon name="plus" size={16} />
                <span>Add Inspiration</span>
              </button>
              <a href="#/dashboard" className="btn btn--secondary">
                Back to Dashboard
              </a>
            </div>
          </section>
        </div>
      )
    }

    return (
      <div className="section-placeholder">
        {/* Filter and sorting toolbar for favorites */}
        {onSelectCategory && onSelectTag && onSortChange && onClearFilters && (
          <FilterToolbar
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            selectedTag={selectedTag}
            onSelectTag={onSelectTag}
            availableTags={availableTags}
            sort={sort}
            onSortChange={onSortChange}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={onClearFilters}
            resultCount={filteredFavorites.length}
          />
        )}

        {filteredFavorites.length === 0 ? (
          <section className="empty-state" aria-label="No favorite results">
            <div className="empty-state__icon" aria-hidden="true">
              <Icon name="search" size={24} />
            </div>
            <h2 className="empty-state__title">No favorites match your filters</h2>
            <p className="empty-state__text">
              None of your {totalFavorites.length} favorites match the current search or filter criteria.
            </p>
            {onClearFilters && (
              <div className="empty-state__actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={onClearFilters}
                >
                  Reset filters
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="inspirations-section" aria-label="Favorite inspirations">
            <div className="section-header">
              <h2 className="section-title">Favorite Inspirations</h2>
              <span className="section-subtitle">
                Showing {filteredFavorites.length} of {totalFavorites.length} kept close
              </span>
            </div>
            <div className="inspirations-grid">
              {filteredFavorites.map((item) => (
                <InspirationCard
                  key={item.id}
                  item={item}
                  onSelect={onSelectRecord}
                  onEdit={onEditRecord}
                  onDelete={onDeleteRecord}
                  onFavoriteClick={onToggleFavorite}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }

  if (path === '/categories') {
    return (
      <div className="section-placeholder categories-view">
        <CategoriesManager
          categories={categories}
          items={items}
          onSelectCategory={onSelectCategory}
          onCreateCategory={onCreateCategory || (() => ({ success: false }))}
          onDeleteCategory={onDeleteCategory || (() => ({ success: false }))}
        />
      </div>
    )
  }

  if (path === '/settings') {
    return (
      <div className="section-placeholder settings-view">
        <div className="settings-cards">
          <section className="card settings-card" aria-labelledby="storage-heading">
            <div className="settings-card__header">
              <div className="settings-card__icon" aria-hidden="true">
                <Icon name="database" size={20} />
              </div>
              <div>
                <h2 id="storage-heading" className="settings-card__title">100% Local Storage</h2>
                <p className="settings-card__desc">
                  Zero databases, zero servers, zero external sync. All data lives on your computer.
                </p>
              </div>
            </div>
            <div className="settings-card__body">
              <div className="settings-info-row">
                <span className="settings-info-row__label">Metadata &amp; Records</span>
                <span className="chip chip--active">Browser localStorage</span>
              </div>
              <div className="settings-info-row">
                <span className="settings-info-row__label">Preview &amp; Screenshot Files</span>
                <span className={`chip ${opfsAvailable ? 'chip--active' : ''}`}>
                  {opfsAvailable ? 'OPFS (Local Filesystem)' : 'OPFS Unavailable'}
                </span>
              </div>
              <div className="settings-info-row">
                <span className="settings-info-row__label">Database / Cloud</span>
                <span className="status-chip">
                  <span className="status-dot" aria-hidden="true" />
                  None &middot; 100% Private
                </span>
              </div>
              <div className="settings-info-row">
                <span className="settings-info-row__label">External Network Tracking</span>
                <span>Zero telemetry or sync</span>
              </div>
            </div>
          </section>

          <section className="card settings-card" aria-labelledby="backup-heading">
            <div className="settings-card__header">
              <div className="settings-card__icon" aria-hidden="true">
                <Icon name="shield" size={20} />
              </div>
              <div>
                <h2 id="backup-heading" className="settings-card__title">Data Management</h2>
                <p className="settings-card__desc">Back up, restore, and clear your local library whenever needed.</p>
              </div>
            </div>
            <div className="settings-card__body">
              <p className="settings-text">
                Full ZIP backups stay in this browser and include your records, collections, settings, and available preview images. Nothing is sent to a server. JSON is a metadata-only format; CSV is for spreadsheets.
              </p>

              <div className="backup-action-group">
                <h3 className="backup-action-group__title">Complete local backup</h3>
                <p className="settings-text">
                  ZIP archives include local screenshots. Missing or unsupported preview files are reported and are not represented as backed up.
                </p>
                <div className="settings-card__actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => void handleFullBackupExport()}
                    disabled={!onExportFullBackup || !opfsAvailable || isBackupWorking}
                  >
                    Export Full Backup
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => backupInputRef.current?.click()}
                    disabled={isBackupWorking}
                  >
                    Select Backup to Restore
                  </button>
                </div>
                {!opfsAvailable && (
                  <p className="settings-status settings-status--error" role="status">
                    Full backups require OPFS support in this browser.
                  </p>
                )}
              </div>

              {backupFile && (
                <div className="backup-restore-panel">
                  <h3 className="backup-action-group__title">Restore from Backup</h3>
                  <p className="settings-text">Selected file: {backupFile.name}</p>
                  {parsedBackup && (
                    <>
                      <dl className="backup-summary" aria-label="Backup contents">
                        <div><dt>Inspirations</dt><dd>{parsedBackup.summary.inspirations}</dd></div>
                        <div><dt>Collections</dt><dd>{parsedBackup.summary.collections}</dd></div>
                        <div><dt>Screenshots</dt><dd>{parsedBackup.summary.screenshots}</dd></div>
                        {parsedBackup.summary.missingScreenshots > 0 && (
                          <div><dt>Missing screenshots</dt><dd>{parsedBackup.summary.missingScreenshots}</dd></div>
                        )}
                      </dl>
                      <fieldset className="backup-mode-options">
                        <legend>Restore behavior</legend>
                        <label className="backup-mode-option">
                          <input
                            type="radio"
                            name="backup-restore-mode"
                            value="merge"
                            checked={restoreMode === 'merge'}
                            onChange={() => setRestoreMode('merge')}
                            disabled={isBackupWorking}
                          />
                          <span><strong>Merge</strong> — add new URLs and collections; existing records are kept and duplicate URLs are skipped.</span>
                        </label>
                        <label className="backup-mode-option">
                          <input
                            type="radio"
                            name="backup-restore-mode"
                            value="replace"
                            checked={restoreMode === 'replace'}
                            onChange={() => setRestoreMode('replace')}
                            disabled={isBackupWorking}
                          />
                          <span><strong>Replace</strong> — replace all current inspirations, collections, and settings with this backup.</span>
                        </label>
                      </fieldset>
                      {restoreMode === 'replace' && (
                        <p className="settings-status settings-status--error" role="alert">
                          Replacing is destructive. Your current library will be removed only after the archive and its contents have been validated, and you must confirm before restore begins.
                        </p>
                      )}
                      <div className="settings-card__actions">
                        <button
                          type="button"
                          className={restoreMode === 'replace' ? 'btn btn--destructive' : 'btn btn--primary'}
                          onClick={() => void handleBackupRestore()}
                          disabled={!onRestoreBackup || isBackupWorking}
                        >
                          Restore from Backup
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost"
                          onClick={() => {
                            setBackupFile(null)
                            setParsedBackup(null)
                            setStatusMessage(null)
                            if (backupInputRef.current) backupInputRef.current.value = ''
                          }}
                          disabled={isBackupWorking}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="backup-action-group">
                <h3 className="backup-action-group__title">Metadata and spreadsheet exports</h3>
                <div className="settings-card__actions">
                  <button type="button" className="btn btn--secondary" onClick={onExportJson}>
                    Export JSON (metadata only)
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Import JSON (metadata only)
                  </button>
                  <button type="button" className="btn btn--secondary" onClick={onExportCsv}>
                    Export CSV
                  </button>
                  <button type="button" className="btn btn--destructive" onClick={() => void runStatusAction(async () => {
                    if (!onClearData) {
                      return { success: false, error: new Error('Clear data is unavailable.') }
                    }
                    return onClearData()
                  }, 'Your local library has been cleared.') }>
                    Clear Local Data
                  </button>
                </div>
              </div>

              {backupProgress && (
                <p className="settings-status settings-status--info" role="status" aria-live="polite">
                  {backupProgress}
                </p>
              )}
              {statusMessage && (
                <p className={`settings-status settings-status--${statusTone}`} role={statusTone === 'error' ? 'alert' : 'status'} aria-live={statusTone === 'error' ? 'assertive' : 'polite'}>
                  {statusMessage}
                </p>
              )}

              <input
                ref={backupInputRef}
                type="file"
                accept=".zip,application/zip"
                hidden
                onChange={(event) => void handleBackupFileChange(event)}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                hidden
                onChange={handleImportFiles}
              />
            </div>
          </section>
        </div>
      </div>
    )
  }

  return null
}
