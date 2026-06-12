import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const handle = searchParams.get("handle") || "";
    const cursor = searchParams.get("cursor") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    
    // Fetch from backend search which connects to Shopify
    let url = `${BACKEND_URL}/api/products/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    if (handle) url += `&handle=${handle}`;
    if (cursor) url += `&cursor=${cursor}`;

    const res = await fetch(url);
    
    if (!res.ok) {
        throw new Error(`Backend search failed with status ${res.status}`);
    }

    const data = await res.json();
    const products = data.products || [];

    return NextResponse.json({
      products: products.map((p) => ({
        id: p.shopifyId || p.id,
        title: p.title,
        handle: p.handle,
        image: p.image || p.variants?.[0]?.image || "",
        price: p.price || p.variants?.[0]?.price || 0,
        sku: p.variants?.[0]?.sku || "",
      })),
      pagination: data.pagination || { hasNextPage: false, endCursor: null }
    });
  } catch (error) {
    console.error("Admin Product Search Error:", error);
    return NextResponse.json(
      { error: "Failed to search products", message: error.message },
      { status: 500 }
    );
  }
}
