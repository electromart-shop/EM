import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { id, images } = await request.json();

    if (!id || !images || !Array.isArray(images) || images.length < 2 || images.length > 4) {
      return NextResponse.json({ error: "Invalid input. Require product ID and 2-4 images." }, { status: 400 });
    }

    const dataFilePath = path.join(process.cwd(), "data", "products.json");
    
    // Read the existing products
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    const products = JSON.parse(fileContents);
    
    // Find and update the product
    const productIndex = products.findIndex((p: any) => p.id === id);
    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    products[productIndex].images = images;
    
    // Write back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), "utf8");
    
    return NextResponse.json({ success: true, product: products[productIndex] });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
