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

const dataPath = path.join(__dirname, '../data/products.json');
const outputPath = path.join(__dirname, '../data/imageQueries.json');

const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const imageQueries = products.map(product => {
    const id = product.id || slugify(product.name);
    return {
        id: id,
        name: product.name,
        searchQuery: `${product.name} electronics product white background top view`
    };
});

fs.writeFileSync(outputPath, JSON.stringify(imageQueries, null, 2));

console.log(`Generated ${imageQueries.length} image queries at /data/imageQueries.json`);
