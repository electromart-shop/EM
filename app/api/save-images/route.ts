
import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function POST(req: Request) {
  const { name, images } = await req.json();

  const folderPath = path.join(process.cwd(), "public", "products");
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const savedPaths: string[] = [];

  for (let i = 0; i < images.length; i++) {
    try {
      console.log("Downloading:", images[i]);

      const res = await fetch(images[i], {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
          "Referer": "https://duckduckgo.com/"
        },
        redirect: "follow"
      });

      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("image")) {
        console.log("Skipped (not image):", images[i]);
        continue;
      }

      const buffer = Buffer.from(await res.arrayBuffer());

      const safeName = name.replace(/[^a-z0-9]/gi, "-").toLowerCase();
      const fileName = `${safeName}-${i + 1}.webp`;
      const filePath = path.join(folderPath, fileName);

      await sharp(buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(filePath);

      savedPaths.push(`/products/${fileName}`);

    } catch (e) {
      console.log("Error:", e);
    }
  }

  console.log("Saved:", savedPaths);
  return Response.json({ success: true, images: savedPaths });
}
