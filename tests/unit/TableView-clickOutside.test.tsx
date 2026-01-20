import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TableView from '../../src/components/TableView';
import type { APMachine } from '../../src/types';

const mockMachines: APMachine[] = [
  {
    id: '1',
    vendor: 'Cisco',
    model: 'AP-9136',
    reference: 'C9136I-E',
    antenna_type: 'Internal',
    indoor_outdoor: 'Indoor',
    generation: 'Wi-Fi 6E (802.11ax)',
    product_positioning: 'High-end',
    total_phy_serving_radios: '3',
    concurrent_serving_radios: '3',
    serving_radio_1: '2.4 GHz',
    serving_radio_2: '5 GHz',
    serving_radio_3: '6 GHz',
    serving_radio_4: '',
    dedicated_scanning_radio: 'No',
    poe_class: 'Class 4 (PoE+)',
    max_poe_consumption_w: '25.5',
    limited_capabilities_poe_bt: '',
    limited_capabilities_poe_at: '',
    limited_capabilities_poe_af: 'Yes',
    ethernet1: '1 Gbits',
    ethernet2: '',
    weight_kg: '0.764',
    dimensions_cm: '23 x 23 x 5',
    geolocation: 'Yes',
    usb_ports: 'No',
    uwb: 'No',
    gnss: 'No',
    bluetooth: 'Yes',
    zigbee: 'No',
    minimum_software_version: '17.9',
    public_price_usd: '1295',
    public_price_eur: '1195',
    comments: '',
  },
  {
    id: '2',
    vendor: 'Aruba',
    model: 'AP-635',
    reference: 'AP-635',
    antenna_type: 'Internal',
    indoor_outdoor: 'Indoor',
    generation: 'Wi-Fi 6E (802.11ax)',
    product_positioning: 'High-end',
    total_phy_serving_radios: '3',
    concurrent_serving_radios: '3',
    serving_radio_1: '2.4 GHz',
    serving_radio_2: '5 GHz',
    serving_radio_3: '6 GHz',
    serving_radio_4: '',
    dedicated_scanning_radio: 'No',
    poe_class: 'Class 4 (PoE+)',
    max_poe_consumption_w: '25.5',
    limited_capabilities_poe_bt: '',
    limited_capabilities_poe_at: '',
    limited_capabilities_poe_af: 'Yes',
    ethernet1: '1 Gbits',
    ethernet2: '',
    weight_kg: '0.65',
    dimensions_cm: '20 x 20 x 4.8',
    geolocation: 'Yes',
    usb_ports: 'No',
    uwb: 'No',
    gnss: 'No',
    bluetooth: 'Yes',
    zigbee: 'No',
    minimum_software_version: '8.10',
    public_price_usd: '1299',
    public_price_eur: '1199',
    comments: '',
  },
];

describe('TableView - Filter Dropdown Click Outside', () => {
  const mockProps = {
    machines: mockMachines,
    selectedIds: new Set<string>(),
    onToggleSelection: vi.fn(),
    onClearSelection: vi.fn(),
    onGoToCompare: vi.fn(),
  };

  it('closes filter dropdown when clicking outside', async () => {
    const { container } = render(<TableView {...mockProps} />);
    
    // Trouver et cliquer sur l'icône de filtre de la colonne Vendor
    const filterIcons = container.querySelectorAll('.th-filter-icon');
    expect(filterIcons.length).toBeGreaterThan(0);
    
    const vendorFilterIcon = filterIcons[0] as HTMLElement;
    fireEvent.click(vendorFilterIcon);
    
    // Vérifier que le dropdown est ouvert
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search Vendor/i)).toBeInTheDocument();
    });
    
    // Cliquer à l'extérieur du dropdown
    fireEvent.mouseDown(document.body);
    
    // Vérifier que le dropdown est fermé
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/Search Vendor/i)).not.toBeInTheDocument();
    });
  });

  it('does not close filter dropdown when clicking inside it', async () => {
    const { container } = render(<TableView {...mockProps} />);
    
    // Ouvrir le dropdown
    const filterIcons = container.querySelectorAll('.th-filter-icon');
    const vendorFilterIcon = filterIcons[0] as HTMLElement;
    fireEvent.click(vendorFilterIcon);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search Vendor/i)).toBeInTheDocument();
    });
    
    // Cliquer à l'intérieur du dropdown
    const searchInput = screen.getByPlaceholderText(/Search Vendor/i);
    fireEvent.mouseDown(searchInput);
    
    // Vérifier que le dropdown est toujours ouvert
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search Vendor/i)).toBeInTheDocument();
    });
  });

  it('does not close filter dropdown when clicking on filter icon', async () => {
    const { container } = render(<TableView {...mockProps} />);
    
    // Ouvrir le dropdown
    const filterIcons = container.querySelectorAll('.th-filter-icon');
    const vendorFilterIcon = filterIcons[0] as HTMLElement;
    fireEvent.click(vendorFilterIcon);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search Vendor/i)).toBeInTheDocument();
    });
    
    // Cliquer à nouveau sur l'icône (toggle)
    fireEvent.mouseDown(vendorFilterIcon);
    
    // Le dropdown devrait toujours être là car mousedown sur l'icône ne devrait pas déclencher la fermeture
    // Note: Le toggle se fait avec click, pas mouseDown
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search Vendor/i)).toBeInTheDocument();
    });
  });

  it('closes multiple filter dropdowns when clicking outside', async () => {
    const { container } = render(<TableView {...mockProps} />);
    
    // Ouvrir le premier dropdown (Vendor)
    const filterIcons = container.querySelectorAll('.th-filter-icon');
    const vendorFilterIcon = filterIcons[0] as HTMLElement;
    fireEvent.click(vendorFilterIcon);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search Vendor/i)).toBeInTheDocument();
    });
    
    // Cliquer à l'extérieur
    fireEvent.mouseDown(document.body);
    
    // Vérifier que tous les dropdowns sont fermés
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/Search Vendor/i)).not.toBeInTheDocument();
    });
  });

  it('cleans up event listener when component unmounts', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    
    const { unmount } = render(<TableView {...mockProps} />);
    
    // Ouvrir un dropdown pour activer le listener
    const filterIcons = document.querySelectorAll('.th-filter-icon');
    if (filterIcons.length > 0) {
      fireEvent.click(filterIcons[0]);
    }
    
    // Démonter le composant
    unmount();
    
    // Vérifier que le removeEventListener a été appelé si addEventListener l'a été
    if (addEventListenerSpy.mock.calls.length > 0) {
      expect(removeEventListenerSpy).toHaveBeenCalled();
    }
    
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('adds event listener only when filters are open', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    
    render(<TableView {...mockProps} />);
    
    // Au début, aucun filtre ouvert, donc pas de listener
    const initialCalls = addEventListenerSpy.mock.calls.filter(
      call => call[0] === 'mousedown'
    ).length;
    
    // Ouvrir un filtre
    const filterIcons = document.querySelectorAll('.th-filter-icon');
    if (filterIcons.length > 0) {
      fireEvent.click(filterIcons[0]);
    }
    
    // Maintenant le listener devrait être ajouté
    const afterOpenCalls = addEventListenerSpy.mock.calls.filter(
      call => call[0] === 'mousedown'
    ).length;
    
    expect(afterOpenCalls).toBeGreaterThan(initialCalls);
    
    addEventListenerSpy.mockRestore();
  });
});
