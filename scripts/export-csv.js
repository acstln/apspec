import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { stringify } from 'csv-stringify/sync';

const dataPath = resolve(process.cwd(), 'public/data/machines.json');
const outputPath = resolve(process.cwd(), 'export-' + Date.now() + '.csv');

console.log('📄 Export CSV des données machines...\n');

try {
  // Charger les données
  const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
  
  // Générer le CSV
  const csv = stringify(data, {
    header: true,
    columns: [
      'id', 'model', 'manufacturer', 'frequency', 'wifi_standard',
      'max_clients', 'throughput_mbps', 'antenna_count', 'antenna_type',
      'power_w', 'poe_type', 'ethernet_ports', 'ethernet_speed',
      'mounting', 'indoor_outdoor', 'dimensions', 'weight_kg',
      'operating_temp', 'ip_rating', 'mimo', 'mu_mimo',
      'beamforming', 'mesh_capable', 'management_system',
      'price_eur', 'warranty_years'
    ]
  });
  
  // Sauvegarder le CSV
  writeFileSync(outputPath, csv, 'utf-8');
  
  console.log('✅ Export CSV réussi !');
  console.log(`   ${data.length} entrées exportées.`);
  console.log(`   Fichier: ${outputPath}\n`);
  
} catch (error) {
  console.error('❌ Erreur lors de l\'export:', error.message);
  process.exit(1);
}
