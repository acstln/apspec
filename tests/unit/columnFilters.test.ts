import { describe, it, expect } from 'vitest';
import { getUniqueColumnValues, filterMachinesByColumn } from '../../src/utils/columnFilters';
import type { APMachine } from '../../src/types';

describe('columnFilters utilities', () => {
  const mockMachines: APMachine[] = [
    {
      id: '1',
      vendor: 'Cisco',
      model: 'AP1840',
      reference: 'AIR-AP1840I-E-K9',
      antenna_type: 'Internal',
      indoor_outdoor: 'Indoor',
      generation: 'Wi-Fi 6',
      product_positioning: 'High End',
      total_phy_serving_radios: '4',
      concurrent_serving_radios: '2',
      serving_radio_1: '2.4 GHz',
      serving_radio_2: '5 GHz',
      serving_radio_3: '',
      serving_radio_4: '',
      dedicated_scanning_radio: 'Yes',
      poe_class: 'Class 6',
      max_poe_consumption_w: '30',
      limited_capabilities_poe_bt: 'No',
      limited_capabilities_poe_at: 'Yes',
      limited_capabilities_poe_af: 'Yes',
      ethernet1: '1 Gbps',
      ethernet2: '1 Gbps',
      weight_kg: '0.8',
      dimensions_cm: '20x20x5',
      geolocation: 'Yes',
      usb_ports: '1',
      uwb: 'No',
      gnss: 'No',
      bluetooth: 'Yes',
      zigbee: 'No',
      minimum_software_version: '8.10',
      public_price_usd: '1200',
      public_price_eur: '1100',
      comments: 'Premium model',
    },
    {
      id: '2',
      vendor: 'Aruba',
      model: 'AP-515',
      reference: 'R2H28A',
      antenna_type: 'Internal',
      indoor_outdoor: 'Indoor',
      generation: 'Wi-Fi 6',
      product_positioning: 'Mid Range',
      total_phy_serving_radios: '2',
      concurrent_serving_radios: '2',
      serving_radio_1: '2.4 GHz',
      serving_radio_2: '5 GHz',
      serving_radio_3: '',
      serving_radio_4: '',
      dedicated_scanning_radio: 'No',
      poe_class: 'Class 4',
      max_poe_consumption_w: '20',
      limited_capabilities_poe_bt: 'No',
      limited_capabilities_poe_at: 'No',
      limited_capabilities_poe_af: 'Yes',
      ethernet1: '1 Gbps',
      ethernet2: '1 Gbps',
      weight_kg: '0.6',
      dimensions_cm: '18x18x4',
      geolocation: 'Yes',
      usb_ports: '0',
      uwb: 'No',
      gnss: 'No',
      bluetooth: 'Yes',
      zigbee: 'No',
      minimum_software_version: '8.8',
      public_price_usd: '800',
      public_price_eur: '750',
      comments: '',
    },
    {
      id: '3',
      vendor: 'Cisco',
      model: 'AP2802',
      reference: 'AIR-AP2802I-E-K9',
      antenna_type: 'Internal',
      indoor_outdoor: 'Indoor',
      generation: 'Wi-Fi 5',
      product_positioning: 'Mid Range',
      total_phy_serving_radios: '2',
      concurrent_serving_radios: '2',
      serving_radio_1: '2.4 GHz',
      serving_radio_2: '5 GHz',
      serving_radio_3: '',
      serving_radio_4: '',
      dedicated_scanning_radio: 'No',
      poe_class: 'Class 4',
      max_poe_consumption_w: '18',
      limited_capabilities_poe_bt: 'No',
      limited_capabilities_poe_at: 'No',
      limited_capabilities_poe_af: 'Yes',
      ethernet1: '1 Gbps',
      ethernet2: '1 Gbps',
      weight_kg: '0.7',
      dimensions_cm: '19x19x4',
      geolocation: 'No',
      usb_ports: '1',
      uwb: 'No',
      gnss: 'No',
      bluetooth: 'No',
      zigbee: 'No',
      minimum_software_version: '8.5',
      public_price_usd: '600',
      public_price_eur: '550',
      comments: '',
    },
  ];

  describe('getUniqueColumnValues', () => {
    it('extracts unique vendor values', () => {
      const values = getUniqueColumnValues(mockMachines, 'vendor');
      expect(values).toEqual(['Aruba', 'Cisco']); // Sorted alphabetically
    });

    it('extracts unique generation values', () => {
      const values = getUniqueColumnValues(mockMachines, 'generation');
      expect(values).toEqual(['Wi-Fi 5', 'Wi-Fi 6']);
    });

    it('filters out empty strings', () => {
      const values = getUniqueColumnValues(mockMachines, 'comments');
      expect(values).toEqual(['Premium model']);
      expect(values).not.toContain('');
    });

    it('trims whitespace from values', () => {
      const machinesWithWhitespace: APMachine[] = [
        { ...mockMachines[0], vendor: '  Cisco  ' },
        { ...mockMachines[1], vendor: 'Aruba' },
      ];
      const values = getUniqueColumnValues(machinesWithWhitespace, 'vendor');
      expect(values).toEqual(['Aruba', 'Cisco']);
    });

    it('handles columns with all empty values', () => {
      const values = getUniqueColumnValues(mockMachines, 'serving_radio_3');
      expect(values).toEqual([]);
    });

    it('sorts values case-insensitively', () => {
      console.log('[TEST CASE] Starting case-insensitive test');
      const machinesWithCase: APMachine[] = [
        { ...mockMachines[0], vendor: 'cisco' },
        { ...mockMachines[1], vendor: 'Aruba' },
        { ...mockMachines[2], vendor: 'CISCO' },
      ];
      console.log('[TEST CASE] Input vendors:', machinesWithCase.map(m => m.vendor));
      
      const values = getUniqueColumnValues(machinesWithCase, 'vendor');
      console.log('[TEST CASE] Unique values result:', values);
      console.log('[TEST CASE] Values length:', values.length);
      
      // Devrait avoir "Aruba" puis "CISCO" ou "cisco" (un seul des deux car unique)
      expect(values.length).toBe(2);
      console.log('[TEST CASE] First value:', values[0], 'lowercase:', values[0].toLowerCase());
      expect(values[0].toLowerCase()).toBe('aruba');
      console.log('[TEST CASE] Second value:', values[1], 'lowercase:', values[1].toLowerCase());
      expect(values[1].toLowerCase()).toBe('cisco');
      console.log('[TEST CASE] Test completed successfully');
    }, 10000);
  });

  describe('filterMachinesByColumn', () => {
    it('filters by selected values', () => {
      const selectedValues = new Set(['Cisco']);
      const filtered = filterMachinesByColumn(
        mockMachines,
        'vendor',
        '',
        selectedValues
      );
      expect(filtered).toHaveLength(2);
      expect(filtered.every(m => m.vendor === 'Cisco')).toBe(true);
    });

    it('filters by multiple selected values', () => {
      const selectedValues = new Set(['Cisco', 'Aruba']);
      const filtered = filterMachinesByColumn(
        mockMachines,
        'vendor',
        '',
        selectedValues
      );
      expect(filtered).toHaveLength(3);
    });

    it('filters by search text when no values selected', () => {
      const filtered = filterMachinesByColumn(
        mockMachines,
        'model',
        'AP18',
        undefined
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].model).toBe('AP1840');
    });

    it('search is case-insensitive', () => {
      const filtered = filterMachinesByColumn(
        mockMachines,
        'vendor',
        'cisco',
        undefined
      );
      expect(filtered).toHaveLength(2);
    });

    it('prioritizes selected values over search text', () => {
      const selectedValues = new Set(['Aruba']);
      const filtered = filterMachinesByColumn(
        mockMachines,
        'vendor',
        'Cisco', // search text ignoré car selectedValues est fourni
        selectedValues
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].vendor).toBe('Aruba');
    });

    it('returns all machines when no filter applied', () => {
      const filtered = filterMachinesByColumn(
        mockMachines,
        'vendor',
        '',
        undefined
      );
      expect(filtered).toHaveLength(3);
    });

    it('returns empty array when no matches', () => {
      const selectedValues = new Set(['NonExistent']);
      const filtered = filterMachinesByColumn(
        mockMachines,
        'vendor',
        '',
        selectedValues
      );
      expect(filtered).toHaveLength(0);
    });

    it('handles null/undefined values correctly', () => {
      const machinesWithNull: APMachine[] = [
        { ...mockMachines[0], comments: '' },
        { ...mockMachines[1], comments: 'Test' },
      ];
      const selectedValues = new Set(['Test']);
      const filtered = filterMachinesByColumn(
        machinesWithNull,
        'comments',
        '',
        selectedValues
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('2');
    });

    it('handles empty Set as no filter', () => {
      const emptySet = new Set<string>();
      const filtered = filterMachinesByColumn(
        mockMachines,
        'vendor',
        '',
        emptySet
      );
      expect(filtered).toHaveLength(3);
    });
  });
});
