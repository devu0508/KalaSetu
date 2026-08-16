// ── User ──────────────────────────────────────────────────────────
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  address: Address;
  role: 'customer' | 'artisan' | 'admin';
  googleId: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Product ───────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  category: string;
  images: string[];
  image: string;        // virtual: images[0]
  glbAsset: string;
  stock: number;
  ratings: {
    average: number;
    count: number;
  };
  artisan?: Artisan | null;
  userId?: string;
  createdAt: string;
}

// ── Artisan ───────────────────────────────────────────────────────
export interface Artisan {
  id: string;
  name: string;
  bio: string;
  story: string;
  craft: string;
  location: { city: string; state: string };
  profileImage: string;
  coverImage: string;
  since: number;
  featured: boolean;
  products: Product[];
  createdAt: string;
}

export interface ArtisanListResponse {
  artisans: Artisan[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductListResponse {
  products: Product[];
  pagination: Pagination;
}

// ── Cart ──────────────────────────────────────────────────────────
export interface CartItem {
  productId: Product;    // populated
  quantity: number;
  priceAtAdd: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
}

// ── Wishlist ──────────────────────────────────────────────────────
export interface Wishlist {
  id: string;
  userId: string;
  products: Product[];   // populated
}

// ── API Response ──────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
