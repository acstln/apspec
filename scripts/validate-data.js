import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import Ajv from 'ajv';

const schemaPath = resolve(process.cwd(), 'schemas/machines.schema.json');
const dataPath = resolve(process.cwd(), 'public/data/machines.json');

console.log('📋 Validation des données machines.json...\n');

try {
  // Charger le schéma JSON
  const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
  
  // Charger les données
  const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
  
  // Valider avec AJV
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);
  
  if (!valid) {
    console.error('❌ Validation échouée !\n');
    console.error('Erreurs trouvées:');
    validate.errors.forEach(error => {
      console.error(`  - ${error.instancePath}: ${error.message}`);
    });
    process.exit(1);
  }
  
  console.log('✅ Validation réussie !');
  console.log(`   ${data.length} entrées validées avec succès.\n`);
  
} catch (error) {
  console.error('❌ Erreur lors de la validation:', error.message);
  process.exit(1);
}
