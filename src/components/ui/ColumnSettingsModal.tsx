import { useState, useEffect } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ColumnConfig } from '../../types';
import Button from './Button';
import { IconClose, IconGripVertical, IconCheck } from '../icons';
import SearchInput from './SearchInput';
import './ColumnSettingsModal.css';

interface ColumnSettingsModalProps {
  columns: ColumnConfig[];
  visibleColumns: string[];
  columnOrder: string[];
  onSave: (visibleColumns: string[], columnOrder: string[]) => void;
  onClose: () => void;
}

interface SortableItemProps {
  id: string;
  column: ColumnConfig;
  isVisible: boolean;
  isLocked: boolean;
  onToggle: (key: string) => void;
}

function SortableItem({ id, column, isVisible, isLocked, onToggle }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isLocked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`column-settings-item ${isLocked ? 'column-settings-item--locked' : ''}`}
    >
      <div className="column-settings-item__drag" {...attributes} {...listeners}>
        <IconGripVertical size={16} />
      </div>
      <label className="column-settings-item__label">
        <input
          type="checkbox"
          checked={isVisible}
          onChange={() => !isLocked && onToggle(column.key)}
          disabled={isLocked}
          className="column-settings-item__checkbox"
        />
        <span className="column-settings-item__checkbox-icon">
          {isVisible && <IconCheck size={14} />}
        </span>
        <span className="column-settings-item__text">
          {column.label}
          {isLocked && <span className="column-settings-item__locked-badge"> (locked)</span>}
        </span>
      </label>
    </div>
  );
}

export default function ColumnSettingsModal({
  columns,
  visibleColumns: initialVisible,
  columnOrder: initialOrder,
  onSave,
  onClose,
}: ColumnSettingsModalProps) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(initialVisible);
  const [columnOrder, setColumnOrder] = useState<string[]>(initialOrder);
  const [searchQuery, setSearchQuery] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        
        // Empêcher le déplacement des colonnes pinnées (vendor et model doivent rester en positions 0 et 1)
        const activeColumn = columns.find(c => c.key === active.id);
        const overColumn = columns.find(c => c.key === over.id);
        
        if (activeColumn?.pinned || overColumn?.pinned) {
          return items; // Ne pas permettre le réordonnancement des colonnes pinnées
        }
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleColumn = (key: string) => {
    // Ne pas permettre de désactiver les colonnes pinnées (vendor et model)
    const column = columns.find(c => c.key === key);
    if (column?.pinned) return;
    
    setVisibleColumns((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  const selectAll = () => {
    setVisibleColumns(columns.map((c) => c.key));
  };

  const deselectAll = () => {
    // Garder toujours les colonnes pinnées visibles
    const pinnedKeys = columns.filter(c => c.pinned).map(c => c.key);
    setVisibleColumns(pinnedKeys);
  };

  const handleSave = () => {
    onSave(visibleColumns, columnOrder);
    onClose();
  };

  const orderedColumns = columnOrder
    .map((key) => columns.find((c) => c.key === key))
    .filter((c): c is ColumnConfig => c !== undefined);

  const filteredColumns = orderedColumns.filter((c) =>
    c.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="column-settings-overlay" onClick={onClose}>
      <div className="column-settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="column-settings-modal__header">
          <h2 className="column-settings-modal__title">Table Settings</h2>
          <Button
            variant="ghost"
            size="sm"
            icon={<IconClose size={20} />}
            onClick={onClose}
            aria-label="Close"
          />
        </div>

        <div className="column-settings-modal__search">
          <SearchInput
            placeholder="Search columns"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
        </div>

        <div className="column-settings-modal__actions">
          <Button variant="ghost" size="sm" onClick={selectAll}>
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={deselectAll}>
            Deselect All
          </Button>
        </div>

        <div className="column-settings-modal__list">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredColumns.map((c) => c.key)}
              strategy={verticalListSortingStrategy}
            >
              {filteredColumns.map((column) => (
                <SortableItem
                  key={column.key}
                  id={column.key}
                  column={column}
                  isVisible={visibleColumns.includes(column.key)}
                  isLocked={column.pinned || false}
                  onToggle={toggleColumn}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="column-settings-modal__footer">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
