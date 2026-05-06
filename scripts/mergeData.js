const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/products.json');
const selectedImagesPath = path.join(__dirname, '../data/selectedImages.json');

// Read files
let products = [];
try {
    products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
} catch (e) {
    console.error("Could not read products.json", e);
    process.exit(1);
}

let selectedImages = [];
try {
    if (fs.existsSync(selectedImagesPath)) {
        selectedImages = JSON.parse(fs.readFileSync(selectedImagesPath, 'utf8'));
    }
} catch (e) {
    console.warn("Could not read selectedImages.json or it doesn't exist. Proceeding with empty mapping.");
}

// 1. Create image map from selectedImages.json
const imageMap = {};
for (const item of selectedImages) {
    if (item.id && item.image && item.image.trim() !== "") {
        imageMap[item.id] = item.image.trim();
    }
}

// 2 & 3 & 4 & 5. Process products
const validProducts = [];

for (const p of products) {
    // Step 4: Remove broken products
    if (!p.id || !p.name || p.price === undefined || p.price === null || isNaN(Number(p.price))) {
        continue; // Skip broken
    }

    // Step 2: Merge into products
    if (imageMap[p.id]) {
        p.image = imageMap[p.id];
    } else {
        // Keep existing image IF valid, OTHERWISE placeholder
        if (!p.image) {
            p.image = "/images/placeholder.png";
        }
    }

    // Step 3: Validate image
    if (!p.image.startsWith("http") && !p.image.startsWith("/images/")) {
        p.image = "/images/placeholder.png";
    }

    // Step 5: Ensure safe structure
    p.price = Number(p.price); // ensure number
    if (!p.tags || !Array.isArray(p.tags)) {
        p.tags = ["electronics"];
    }

    validProducts.push(p);
}

// 6. Save result
fs.writeFileSync(productsPath, JSON.stringify(validProducts, null, 2));

console.log(`Successfully merged images and cleaned data. Total valid products: ${validProducts.length}`);
