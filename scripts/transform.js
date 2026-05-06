const fs = require('fs');
const path = require('path');

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const match = priceStr.match(/Rs\s*([\d,]+)/);
    if (match) {
        return parseFloat(match[1].replace(/,/g, ''));
    }
    return 0;
}

const dataPath = path.join(__dirname, '../data/products.json');
const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let allProducts = [];

rawData.forEach((section) => {
    // There are up to ~30 products per section
    for (let i = 1; i <= 100; i++) {
        const titleKey = i === 1 ? 'card-title' : `card-title ${i}`;
        const priceKey = i === 1 ? 'price-item' : `price-item ${4 * i - 3}`;
        
        const title = section[titleKey];
        if (title && title.trim() !== '') {
            const priceStr = section[priceKey];
            const price = parsePrice(priceStr);
            
            allProducts.push({
                id: slugify(title),
                name: title,
                price: price,
            });
        }
    }
});

// If the file was already processed, it would be an array of objects with 'id', 'name', 'price'.
// Let's handle the case where the file is already processed or partially processed.
if (rawData.length > 0 && rawData[0].id && rawData[0].name) {
    allProducts = rawData;
}

// Filter out price > 20000
const filteredProducts = allProducts.filter(p => p.price <= 20000);

fs.writeFileSync(dataPath, JSON.stringify(filteredProducts, null, 2));

console.log(`Original count (approx): ${allProducts.length}`);
console.log(`Filtered count: ${filteredProducts.length}`);
