const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/products.json');
const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let updatedCount = 0;

for (const product of products) {
    if (product.images && Array.isArray(product.images)) {
        // Slice up to 4 images, and transform to local paths
        const newImages = product.images.slice(0, 4).map((_, index) => {
            return `/images/products/${product.id}-${index + 1}.jpg`;
        });
        product.images = newImages;
        updatedCount++;
    } else if (typeof product.image === 'string') {
        // In case 'image' is used instead of 'images'
        product.images = [
            `/images/products/${product.id}-1.jpg`,
            `/images/products/${product.id}-2.jpg`
        ];
        updatedCount++;
    } else {
        // If missing completely, add two dummy placeholders so the UI functions normally?
        // Wait, the prompt says "Filter products: validProducts = products.filter(p => p.images && p.images.length >= 2);"
        // If we want to filter them out, we should probably not generate false arrays, or we can just give them empty arrays.
        // Let's just not touch them if they don't have images at all.
    }
}

fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
console.log(`Updated images array to local paths for ${updatedCount} products.`);
