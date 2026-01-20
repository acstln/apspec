import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire le YAML
const yamlFile = '/Users/acas/Downloads/ap_models.yaml';
const data = yaml.load(fs.readFileSync(yamlFile, 'utf8'));

// Convertir
const machines = data.map((ap, idx) => ({
  id: `ap-${String(idx + 1).padStart(3, '0')}`,
  vendor: ap.Vendor || '',
  model: ap.Model || '',
  reference: ap.Reference || '',
  antenna_type: ap.Antenna_Type || '',
  indoor_outdoor: ap.Indoor_Outdoor || '',
  generation: ap.Generation || '',
  product_positioning: ap.Product_Positioning || '',
  total_phy_serving_radios: ap.Total_PHY_Serving_Radios || '',
  concurrent_serving_radios: String(ap.Concurrent_Serving_Radios || ''),
  serving_radio_1: ap.Serving_Radio_1 || '',
  serving_radio_2: ap.Serving_Radio_2 || '',
  serving_radio_3: ap.Serving_Radio_3 || '',
  serving_radio_4: ap.Serving_Radio_4 || '',
  dedicated_scanning_radio: ap.Dedicated_Scanning_Radio || '',
  poe_class: ap.PoE_Class || '',
  max_poe_consumption_w: String(ap.Max_PoE_Consumption_W || ''),
  limited_capabilities_poe_bt: ap.Limited_Capabilities_PoE_bt_Class5_45W || '',
  limited_capabilities_poe_at: ap.Limited_Capabilities_PoE_at_30W || '',
  limited_capabilities_poe_af: ap.Limited_Capabilities_PoE_af_15W || '',
  ethernet1: ap.Ethernet1 || '',
  ethernet2: ap.Ethernet2 || '',
  weight_kg: String(ap.Weight_kg || ''),
  dimensions_cm: ap.Dimensions_cm || '',
  geolocation: ap.Geolocation_FTM_80211mc_80211az || '',
  usb_ports: String(ap.USB_Ports || ''),
  uwb: ap.UWB || '',
  gnss: ap.GNSS || '',
  bluetooth: ap.Bluetooth || '',
  zigbee: ap.Zigbee || '',
  minimum_software_version: ap.Minimum_Software_Version || '',
  public_price_usd: String(ap.Public_Price_USD || ''),
  public_price_eur: String(ap.Public_Price_EUR || ''),
  comments: ap.Comments || ''
}));

// Écrire le JSON
const outputFile = path.join(__dirname, '../public/data/machines.json');
fs.writeFileSync(outputFile, JSON.stringify(machines, null, 2), 'utf8');

console.log(`✅ Converti ${machines.length} APs du YAML vers JSON`);
