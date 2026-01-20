#!/usr/bin/env node
/**
 * Script pour calculer les largeurs optimales des colonnes basées sur le contenu réel
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lire les données
const machinesPath = join(__dirname, '../public/data/machines.json');
const machines = JSON.parse(readFileSync(machinesPath, 'utf-8'));

// Fonction pour estimer la largeur en pixels (approximation)
function estimateTextWidth(text, isBold = false) {
  if (!text) return 0;
  const str = String(text);
  // Approximation: ~8px par caractère pour texte normal, ~9px pour bold
  const charWidth = isBold ? 9 : 8;
  return str.length * charWidth;
}

// Calculer la largeur optimale pour chaque colonne
const columns = {};

// Obtenir toutes les clés possibles
const allKeys = new Set();
machines.forEach(machine => {
  Object.keys(machine).forEach(key => allKeys.add(key));
});

allKeys.forEach(key => {
  // Largeur du titre (en gras)
  const titleWidth = estimateTextWidth(key.replace(/_/g, ' '), true);
  
  // Largeur maximale du contenu
  let maxContentWidth = 0;
  machines.forEach(machine => {
    const value = machine[key];
    if (value !== undefined && value !== null) {
      const width = estimateTextWidth(String(value));
      if (width > maxContentWidth) {
        maxContentWidth = width;
      }
    }
  });
  
  // Prendre le max entre titre et contenu, avec un peu de padding
  // +60px pour les icônes, padding et marge de sécurité
  const optimalWidth = Math.max(titleWidth, maxContentWidth) + 60;
  
  // Limites min/max raisonnables
  const finalWidth = Math.min(Math.max(optimalWidth, 100), 400);
  
  columns[key] = {
    width: finalWidth,
    titleWidth: titleWidth,
    maxContentWidth: maxContentWidth
  };
});

// Afficher les résultats
console.log('Largeurs optimales calculées:');
console.log('===============================\n');

Object.entries(columns)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .forEach(([key, data]) => {
    console.log(`${key.padEnd(30)} : ${data.width}px (titre: ${data.titleWidth}px, contenu: ${data.maxContentWidth}px)`);
  });

// Générer le code TypeScript pour columns.ts
console.log('\n\nCode TypeScript suggéré:');
console.log('===================================\n');

const columnMappings = {
  'vendor': { label: 'Vendor', pinned: true },
  'model': { label: 'Model', pinned: true },
  'reference': { label: 'Reference' },
  'antenna_type': { label: 'Antenna Type' },
  'indoor_outdoor': { label: 'Indoor/Outdoor' },
  'generation': { label: 'Generation' },
  'product_positioning': { label: 'Product Positioning' },
  'total_phy_serving_radios': { label: 'Total PHY Serving Radios' },
  'concurrent_serving_radios': { label: 'Concurrent Serving Radios', filterable: false },
  'serving_radio_1': { label: 'Serving Radio 1' },
  'serving_radio_2': { label: 'Serving Radio 2' },
  'serving_radio_3': { label: 'Serving Radio 3' },
  'serving_radio_4': { label: 'Serving Radio 4' },
  'dedicated_scanning_radio': { label: 'Dedicated Scanning Radio' },
  'poe_class': { label: 'PoE Class' },
  'max_poe_consumption_w': { label: 'Max PoE Consumption (W)', filterable: false },
  'limited_capabilities_poe_bt': { label: 'Limited PoE BT' },
  'limited_capabilities_poe_at': { label: 'Limited PoE AT' },
  'limited_capabilities_poe_af': { label: 'Limited PoE AF' },
  'ethernet1': { label: 'Ethernet 1' },
  'ethernet2': { label: 'Ethernet 2' },
  'weight_kg': { label: 'Weight (kg)', filterable: false },
  'dimensions_cm': { label: 'Dimensions (cm)', sortable: false, filterable: false },
  'geolocation': { label: 'Geolocation' },
  'usb_ports': { label: 'USB Ports', filterable: false },
  'uwb': { label: 'UWB' },
  'gnss': { label: 'GNSS' },
  'bluetooth': { label: 'Bluetooth' },
  'zigbee': { label: 'Zigbee' },
  'minimum_software_version': { label: 'Min Software Version' },
  'public_price_usd': { label: 'Price (USD)', filterable: false },
  'public_price_eur': { label: 'Price (EUR)', filterable: false },
  'comments': { label: 'Comments', sortable: false }
};

Object.entries(columnMappings).forEach(([key, config]) => {
  const width = columns[key]?.width || 150;
  const sortable = config.sortable !== false;
  const filterable = config.filterable !== false;
  const pinned = config.pinned || false;
  
  console.log(`  { key: '${key}', label: '${config.label}', sortable: ${sortable}, filterable: ${filterable}${pinned ? ', pinned: true' : ''}, width: ${width} },`);
});
