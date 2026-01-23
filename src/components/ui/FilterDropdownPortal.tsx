import { useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import FilterDropdown from './FilterDropdown';

interface Props {
  columnKey: string;
  columnLabel: string;
  searchValue: string;
  selectedValues: Set<string>;
  availableValues: string[];
  onSearchChange: (search: string) => void;
  onValuesChange: (selectedValues: Set<string>) => void;
  onApply: () => void;
  onClear: () => void;
}

/**
 * Wrapper pour FilterDropdown qui utilise un portal React et position fixed
 * pour éviter les problèmes d'overflow du tableau
 */
export default function FilterDropdownPortal({
  columnKey,
  columnLabel,
  searchValue,
  selectedValues,
  availableValues,
  onSearchChange,
  onValuesChange,
  onApply,
  onClear,
}: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Utiliser useLayoutEffect pour calculer la position AVANT le paint
  useLayoutEffect(() => {
    const button = document.querySelector(`[data-filter-button="${columnKey}"]`);
    if (button) {
      // Trouver le th parent pour avoir la position correcte de la colonne
      const thElement = button.closest('th');
      if (thElement) {
        const thRect = thElement.getBoundingClientRect();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPosition({
          top: thRect.bottom, // Position en dessous du header de colonne
          left: thRect.left, // Aligné avec le début de la colonne
        });
      }
    }
  }, [columnKey]);

  return createPortal(
    <div
      ref={dropdownRef}
      className="th-filter th-filter-floating"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
      }}
    >
      <FilterDropdown
        columnLabel={columnLabel}
        searchValue={searchValue}
        selectedValues={selectedValues}
        availableValues={availableValues}
        onSearchChange={onSearchChange}
        onValuesChange={onValuesChange}
        onApply={onApply}
        onClear={onClear}
      />
    </div>,
    document.body
  );
}
