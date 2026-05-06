const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'data', 'products.json');
const folderPath = path.join(__dirname, '..', 'public', 'products');

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

let products = require(dataFile);

async function downloadImages() {
  let updatedCount = 0;

  for (let p of products) {
    if (!p.images || p.images.length === 0) continue;

    let newImages = [];
    let needsUpdate = false;

    for (let i = 0; i < p.images.length; i++) {
      const imgUrl = p.images[i];

      if (imgUrl.startsWith('/products/')) {
        newImages.push(imgUrl);
        continue;
      }

      console.log(`Downloading for ${p.name}:`, imgUrl);

      try {
        const res = await fetch(imgUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
            "Referer": "https://duckduckgo.com/"
          },
          redirect: "follow"
        });

        const contentType = res.headers.get("content-type") || "";
        if (!res.ok || !contentType.includes("image")) {
          console.log("Skipped (not image):", imgUrl);
          // Keep old URL if it failed, or maybe not? 
          // Actually, let's keep it if we can't download, so we don't break the product entirely,
          // but the goal is to make them local. We'll keep the external URL if it fails.
          newImages.push(imgUrl);
          continue;
        }

        const buffer = Buffer.from(await res.arrayBuffer());

        const safeName = p.name.replace(/[^a-z0-9]/gi, "-").toLowerCase();
        const fileName = `${safeName}-${i + 1}.jpg`;

        const filePath = path.join(folderPath, fileName);
        fs.writeFileSync(filePath, buffer);

        newImages.push(`/products/${fileName}`);
        needsUpdate = true;
      } catch (e) {
        console.log("Error:", e);
        newImages.push(imgUrl);
      }
    }

    if (needsUpdate) {
      p.images = newImages;
      updatedCount++;
    }
  }

  if (updatedCount > 0) {
    fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));
    console.log(`Successfully updated ${updatedCount} products with local images.`);
  } else {
    console.log("No new images were downloaded.");
  }
}

downloadImages();
