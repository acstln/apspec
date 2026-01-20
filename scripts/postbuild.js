import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const docsDir = resolve(process.cwd(), 'docs');

console.log('🔨 Post-build processing...\n');

try {
  // Créer le fichier .nojekyll si nécessaire
  const nojekyllPath = resolve(docsDir, '.nojekyll');
  if (!existsSync(nojekyllPath)) {
    writeFileSync(nojekyllPath, '', 'utf-8');
    console.log('✅ Fichier .nojekyll créé');
  }
  
  console.log('✅ Post-build terminé avec succès !\n');
  
} catch (error) {
  console.error('❌ Erreur lors du post-build:', error.message);
  process.exit(1);
}
