const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const getCategory = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('arduino') || lowerName.includes('uno') || lowerName.includes('mega') || lowerName.includes('nano')) return 'Arduino';
  if (lowerName.includes('sensor') || lowerName.includes('detector') || lowerName.includes('probe')) return 'Sensors';
  if (lowerName.includes('module') || lowerName.includes('board') || lowerName.includes('shield')) return 'Modules';
  if (lowerName.includes('motor') || lowerName.includes('servo') || lowerName.includes('stepper') || lowerName.includes('pump') || lowerName.includes('wheel')) return 'Motors & Robotics';
  if (lowerName.includes('display') || lowerName.includes('lcd') || lowerName.includes('oled')) return 'Displays';
  if (lowerName.includes('cable') || lowerName.includes('wire') || lowerName.includes('jumper') || lowerName.includes('connector')) return 'Cables & Connectors';
  if (lowerName.includes('power') || lowerName.includes('battery') || lowerName.includes('adapter')) return 'Power Supply';
  if (lowerName.includes('switch') || lowerName.includes('button') || lowerName.includes('relay')) return 'Switches & Relays';
  if (lowerName.includes('resistor') || lowerName.includes('capacitor') || lowerName.includes('diode') || lowerName.includes('transistor') || lowerName.includes('led')) return 'Basic Components';
  if (lowerName.includes('raspberry') || lowerName.includes('pi ')) return 'Raspberry Pi';
  return 'Accessories';
};

products = products.map(p => {
  p.category = getCategory(p.name);
  return p;
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
console.log('Categories updated successfully!');
