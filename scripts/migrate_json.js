const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const updatedProducts = products.map(product => {
  if (product.image && typeof product.image === 'string') {
    product.images = [product.image];
    delete product.image;
  }
  return product;
});

fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));
console.log('Migrated products.json successfully.');
