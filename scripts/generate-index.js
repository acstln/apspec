import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const dataPath = resolve(process.cwd(), 'public/data/machines.json');
const indexPath = resolve(process.cwd(), 'public/data/index.json');

console.log('🔍 Génération de l\'index de recherche...\n');

try {
  // Charger les données
  const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
  
  // Créer un index simple: mapper tous les champs searchable
  const searchableFields = [
    'model', 'manufacturer', 'frequency', 'wifi_standard',
    'antenna_type', 'poe_type', 'mounting', 'indoor_outdoor',
    'management_system', 'ethernet_speed', 'mimo'
  ];
  
  const index = data.map(item => {
    const searchText = searchableFields
      .map(field => String(item[field] || '').toLowerCase())
      .join(' ');
    
    return {
      id: item.id,
      text: searchText,
      item
    };
  });
  
  // Sauvegarder l'index
  writeFileSync(indexPath, JSON.stringify(index), 'utf-8');
  
  console.log('✅ Index généré avec succès !');
  console.log(`   ${data.length} entrées indexées.`);
  console.log(`   Fichier: ${indexPath}\n`);
  
} catch (error) {
  console.error('❌ Erreur lors de la génération de l\'index:', error.message);
  process.exit(1);
}

