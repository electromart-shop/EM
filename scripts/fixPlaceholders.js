const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/products.json');
const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

for (const product of products) {
    if (!product.image || !product.image.startsWith('http')) {
        product.image = "/images/placeholder.png";
    }
}

fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
console.log('Fixed missing images.');
