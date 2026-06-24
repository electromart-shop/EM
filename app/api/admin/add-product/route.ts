import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// ─── Only available in local dev ─────────────────────────────────────────────
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false, error: "Admin API is not available in production." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, category, price, images } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Product name is required." }, { status: 400 });
    }
    if (!category || !category.trim()) {
      return NextResponse.json({ success: false, error: "Category is required." }, { status: 400 });
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json({ success: false, error: "A valid price is required." }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "data", "products.json");
    const fileData = fs.readFileSync(filePath, "utf-8");
    const products = JSON.parse(fileData);

    // Generate a unique ID
    const id = `${name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${Date.now()}`;

    const newProduct = {
      id,
      name: name.trim(),
      category: category.trim(),
      price: parsedPrice,
      images: Array.isArray(images) ? images.filter(Boolean) : [],
      description: body.description?.trim() || "",
      tags: [],
    };

    products.push(newProduct);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf-8");

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
