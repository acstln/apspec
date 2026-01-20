import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterDropdown from '../../src/components/ui/FilterDropdown';

describe('FilterDropdown', () => {
  const mockProps = {
    columnLabel: 'Vendor',
    searchValue: '',
    selectedValues: new Set<string>(),
    availableValues: ['Cisco', 'Aruba', 'Juniper', 'Huawei'],
    onSearchChange: vi.fn(),
    onValuesChange: vi.fn(),
    onApply: vi.fn(),
    onClear: vi.fn(),
  };

  it('renders search input with correct placeholder', () => {
    render(<FilterDropdown {...mockProps} />);
    expect(screen.getByPlaceholderText('Search Vendor...')).toBeInTheDocument();
  });

  it('displays available values as checkboxes', () => {
    render(<FilterDropdown {...mockProps} />);
    
    mockProps.availableValues.forEach(value => {
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  it('shows selected values as checked', () => {
    const selectedValues = new Set(['Cisco', 'Aruba']);
    render(<FilterDropdown {...mockProps} selectedValues={selectedValues} />);
    
    const ciscoCheckbox = screen.getByRole('checkbox', { name: /Cisco/i });
    const arubaCheckbox = screen.getByRole('checkbox', { name: /Aruba/i });
    const juniperCheckbox = screen.getByRole('checkbox', { name: /Juniper/i });
    
    expect(ciscoCheckbox).toBeChecked();
    expect(arubaCheckbox).toBeChecked();
    expect(juniperCheckbox).not.toBeChecked();
  });

  it('calls onValuesChange when checkbox is toggled', () => {
    render(<FilterDropdown {...mockProps} />);
    
    const ciscoCheckbox = screen.getByRole('checkbox', { name: /Cisco/i });
    fireEvent.click(ciscoCheckbox);
    
    expect(mockProps.onValuesChange).toHaveBeenCalled();
    const callArg = mockProps.onValuesChange.mock.calls[0][0];
    expect(callArg).toBeInstanceOf(Set);
    expect(callArg.has('Cisco')).toBe(true);
  });

  it('filters values based on search input', () => {
    render(<FilterDropdown {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search Vendor...');
    fireEvent.change(searchInput, { target: { value: 'Cisco' } });
    
    // Cisco devrait être visible
    expect(screen.getByText('Cisco')).toBeInTheDocument();
    
    // Les autres ne devraient pas être visibles dans la liste filtrée
    // Note: ils sont quand même dans le DOM mais pas affichés
  });

  it('calls select all with filtered values', () => {
    console.log('[TEST SELECT ALL] Starting test');
    mockProps.onValuesChange.mockClear();
    
    render(<FilterDropdown {...mockProps} />);
    console.log('[TEST SELECT ALL] Component rendered');
    
    const selectAllBtn = screen.getByText(/Select All/);
    console.log('[TEST SELECT ALL] Found Select All button');
    fireEvent.click(selectAllBtn);
    console.log('[TEST SELECT ALL] Clicked Select All');
    
    expect(mockProps.onValuesChange).toHaveBeenCalled();
    console.log('[TEST SELECT ALL] Mock calls:', mockProps.onValuesChange.mock.calls.length);
    console.log('[TEST SELECT ALL] All calls:', JSON.stringify(mockProps.onValuesChange.mock.calls.map(call => Array.from(call[0]))));
    const callArg = mockProps.onValuesChange.mock.calls[0][0];
    console.log('[TEST SELECT ALL] Call arg size:', callArg.size, 'values:', Array.from(callArg));
    expect(callArg.size).toBe(4);
  }, 10000);

  it('calls deselect all', () => {
    console.log('[TEST DESELECT] Starting test');
    mockProps.onValuesChange.mockClear();
    
    const selectedValues = new Set(['Cisco', 'Aruba']);
    console.log('[TEST DESELECT] Selected values:', Array.from(selectedValues));
    render(<FilterDropdown {...mockProps} selectedValues={selectedValues} />);
    console.log('[TEST DESELECT] Component rendered');
    
    const deselectAllBtn = screen.getByText('Deselect All');
    console.log('[TEST DESELECT] Found Deselect All button');
    fireEvent.click(deselectAllBtn);
    console.log('[TEST DESELECT] Clicked Deselect All');
    
    expect(mockProps.onValuesChange).toHaveBeenCalled();
    console.log('[TEST DESELECT] Mock calls:', mockProps.onValuesChange.mock.calls.length);
    console.log('[TEST DESELECT] All calls:', JSON.stringify(mockProps.onValuesChange.mock.calls.map(call => Array.from(call[0]))));
    const callArg = mockProps.onValuesChange.mock.calls[0][0];
    console.log('[TEST DESELECT] Call arg size:', callArg.size, 'values:', Array.from(callArg));
    expect(callArg.size).toBe(0);
  }, 10000);

  it('does not display Select All when no filtered values', () => {
    console.log('[TEST NO SELECT] Starting test');
    render(<FilterDropdown {...mockProps} availableValues={[]} />);
    console.log('[TEST NO SELECT] Component rendered with empty values');
    
    const selectAllBtn = screen.queryByText(/Select All/);
    console.log('[TEST NO SELECT] Select All button:', selectAllBtn);
    expect(selectAllBtn).not.toBeInTheDocument();
    console.log('[TEST NO SELECT] Test completed');
  }, 10000);

  it('disables Deselect All when no selected values', () => {
    render(<FilterDropdown {...mockProps} />);
    
    const deselectAllBtn = screen.getByText('Deselect All');
    expect(deselectAllBtn).toBeDisabled();
  });

  it('calls onApply when Apply button is clicked', () => {
    render(<FilterDropdown {...mockProps} />);
    
    const applyBtn = screen.getByText('Apply');
    fireEvent.click(applyBtn);
    
    expect(mockProps.onApply).toHaveBeenCalled();
  });

  it('calls onClear when Clear button is clicked', () => {
    render(<FilterDropdown {...mockProps} />);
    
    const clearBtn = screen.getByText('Clear');
    fireEvent.click(clearBtn);
    
    expect(mockProps.onClear).toHaveBeenCalled();
  });

  it('calls onApply when Enter key is pressed in search input', () => {
    render(<FilterDropdown {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search Vendor...');
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    
    expect(mockProps.onApply).toHaveBeenCalled();
  });

  it('calls onClear when Escape key is pressed in search input', () => {
    render(<FilterDropdown {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search Vendor...');
    fireEvent.keyDown(searchInput, { key: 'Escape' });
    
    expect(mockProps.onClear).toHaveBeenCalled();
  });

  it('shows empty state when no values match search', () => {
    render(<FilterDropdown {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search Vendor...');
    fireEvent.change(searchInput, { target: { value: 'NonExistent' } });
    
    expect(screen.getByText('No values found')).toBeInTheDocument();
  });

  it('auto-focuses search input on mount', () => {
    render(<FilterDropdown {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search Vendor...');
    expect(searchInput).toHaveFocus();
  });

  it('shows correct count in Select All button', () => {
    render(<FilterDropdown {...mockProps} />);
    
    expect(screen.getByText('Select All (4)')).toBeInTheDocument();
  });

  it('updates Select All count when search filters values', () => {
    render(<FilterDropdown {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search Vendor...');
    fireEvent.change(searchInput, { target: { value: 'Cisco' } });
    
    expect(screen.getByText('Select All (1)')).toBeInTheDocument();
  });

  it('sanitizes display values to prevent XSS', () => {
    console.log('[TEST XSS] Starting XSS test');
    const xssValues = ['<script>alert("xss")</script>', 'Normal Value'];
    console.log('[TEST XSS] Rendering with values:', xssValues);
    
    render(<FilterDropdown {...mockProps} availableValues={xssValues} />);
    console.log('[TEST XSS] Component rendered');
    
    // React échappe automatiquement le contenu texte - le texte complet devrait être présent en tant que texte
    const xssTextElement = screen.getByText('<script>alert("xss")</script>');
    console.log('[TEST XSS] Found XSS text element:', xssTextElement);
    expect(xssTextElement).toBeInTheDocument();
    
    // Vérifier qu'il n'y a pas de balise script réelle dans le DOM
    const dropdownContainer = xssTextElement.closest('.filter-dropdown');
    console.log('[TEST XSS] Dropdown container:', dropdownContainer?.innerHTML.substring(0, 200));
    const scriptTag = dropdownContainer?.querySelector('script');
    console.log('[TEST XSS] Script tag found:', scriptTag);
    expect(scriptTag).toBeNull();
    console.log('[TEST XSS] Test completed successfully');
  }, 10000);
});
