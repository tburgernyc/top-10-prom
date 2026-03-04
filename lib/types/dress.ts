/**
 * Dress — mirrors the `public.dresses` table schema.
 * `attributes` JSONB carries size options, color swatches, length, silhouette, etc.
 */
export interface DressAttributes {
  sizes?: string[];       // e.g. ["0", "2", "4", "6", "8", "10", "12", "14"]
  colors?: string[];      // e.g. ["Midnight Blue", "Champagne", "Rose Gold"]
  length?: string;        // "floor" | "midi" | "mini"
  silhouette?: string;    // "A-line" | "Ball Gown" | "Mermaid" | "Sheath"
  [key: string]: unknown;
}

export interface Dress {
  id: string;
  name: string;
  designer: string;
  description?: string | null;
  price?: number | null;
  image_urls: string[];
  available_stores: string[];
  attributes: DressAttributes;
  inventory_status: "available" | "limited" | "sold_out";
  created_at: string;
  updated_at: string;
}

/** Lightweight version used in fitting room items / wishlist */
export interface DressStub {
  id: string;
  name: string;
  designer: string;
  image_url: string; // first image from image_urls
}
