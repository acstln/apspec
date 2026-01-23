#!/usr/bin/env node

/**
 * Script d'auto-incrémentation de version
 * Appelé automatiquement avant chaque build
 * 
 * Incrémente la version PATCH (1.2.1 -> 1.2.2)
 * Met à jour :
 * - package.json
 * - src/components/ui/InfoModal.tsx
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Lire package.json
const packageJsonPath = path.join(rootDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Incrémenter la version (PATCH)
const [major, minor, patch] = packageJson.version.split('.').map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;

console.log(`🔢 Version actuelle: ${packageJson.version}`);
console.log(`🔢 Nouvelle version: ${newVersion}`);

// Mettre à jour package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
console.log(`✅ package.json mis à jour`);

// Mettre à jour InfoModal.tsx
const infoModalPath = path.join(rootDir, 'src/components/ui/InfoModal.tsx');
let infoModalContent = fs.readFileSync(infoModalPath, 'utf8');

// Remplacer la version dans InfoModal.tsx
infoModalContent = infoModalContent.replace(
  /version:\s*['"][\d.]+['"]/,
  `version: '${newVersion}'`
);

fs.writeFileSync(infoModalPath, infoModalContent, 'utf8');
console.log(`✅ InfoModal.tsx mis à jour`);

console.log(`\n✨ Version incrémentée avec succès : ${newVersion}`);
