#!/usr/bin/env python3
import yaml
import json
import sys

# Lire le YAML
with open('/Users/acas/Downloads/ap_models.yaml', 'r', encoding='utf-8') as f:
    data = yaml.safe_load(f)

# Convertir
machines = []
for idx, ap in enumerate(data, 1):
    machines.append({
        'id': f'ap-{idx:03d}',
        'vendor': ap.get('Vendor', ''),
        'model': ap.get('Model', ''),
        'reference': ap.get('Reference', ''),
        'antenna_type': ap.get('Antenna_Type', ''),
        'indoor_outdoor': ap.get('Indoor_Outdoor', ''),
        'generation': ap.get('Generation', ''),
        'product_positioning': ap.get('Product_Positioning', ''),
        'total_phy_serving_radios': ap.get('Total_PHY_Serving_Radios', ''),
        'concurrent_serving_radios': str(ap.get('Concurrent_Serving_Radios', '')),
        'serving_radio_1': ap.get('Serving_Radio_1', ''),
        'serving_radio_2': ap.get('Serving_Radio_2', ''),
        'serving_radio_3': ap.get('Serving_Radio_3', ''),
        'serving_radio_4': ap.get('Serving_Radio_4', ''),
        'dedicated_scanning_radio': ap.get('Dedicated_Scanning_Radio', ''),
        'poe_class': ap.get('PoE_Class', ''),
        'max_poe_consumption_w': str(ap.get('Max_PoE_Consumption_W', '')),
        'limited_capabilities_poe_bt': ap.get('Limited_Capabilities_PoE_bt_Class5_45W', ''),
        'limited_capabilities_poe_at': ap.get('Limited_Capabilities_PoE_at_30W', ''),
        'limited_capabilities_poe_af': ap.get('Limited_Capabilities_PoE_af_15W', ''),
        'ethernet1': ap.get('Ethernet1', ''),
        'ethernet2': ap.get('Ethernet2', ''),
        'weight_kg': str(ap.get('Weight_kg', '')),
        'dimensions_cm': ap.get('Dimensions_cm', ''),
        'geolocation': ap.get('Geolocation_FTM_80211mc_80211az', ''),
        'usb_ports': str(ap.get('USB_Ports', '')),
        'uwb': ap.get('UWB', ''),
        'gnss': ap.get('GNSS', ''),
        'bluetooth': ap.get('Bluetooth', ''),
        'zigbee': ap.get('Zigbee', ''),
        'minimum_software_version': ap.get('Minimum_Software_Version', ''),
        'public_price_usd': str(ap.get('Public_Price_USD', '')),
        'public_price_eur': str(ap.get('Public_Price_EUR', '')),
        'comments': ap.get('Comments', '')
    })

# Écrire le JSON
output_file = '/Users/acas/Documents/dev/Axians/apspec/public/data/machines.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(machines, f, indent=2, ensure_ascii=False)

print(f'✅ Converti {len(machines)} APs du YAML vers {output_file}')
