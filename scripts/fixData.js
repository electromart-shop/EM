const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/products.json');
let products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 1. Remove bad products (> 20K)
products = products.filter(p => (p.price || 0) <= 20000);

// 2. Remove duplicate IDs
const seen = new Set();
const uniqueProducts = [];
for (const p of products) {
    if (!seen.has(p.id)) {
        seen.add(p.id);
        uniqueProducts.push(p);
    }
}
products = uniqueProducts;

// 3. Fix image and tags
for (const p of products) {
    // IMAGE FIX
    if (!p.image || p.image === "" || (p.image.startsWith("/images/products/") && !fs.existsSync(path.join(__dirname, '..', p.image)))) {
        p.image = "/images/placeholder.png";
    }

    // TAGS FIX
    if (!p.tags || !Array.isArray(p.tags)) {
        p.tags = [];
        const lowerName = (p.name || "").toLowerCase();
        if (lowerName.includes("arduino")) p.tags.push("microcontroller");
        else if (lowerName.includes("raspberry")) p.tags.push("microcomputer");
        else if (lowerName.includes("sensor")) p.tags.push("sensor");
        else if (lowerName.includes("kit")) p.tags.push("kit");
        else p.tags.push("electronics");
    }
}

fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
console.log(`Fixed data. Total valid products: ${products.length}`);
