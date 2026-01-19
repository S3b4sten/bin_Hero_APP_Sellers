
export interface Product {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  category: string;
  imageUrl: string;
  createdAt: string; // ISO String
  sellerName: string;
  status: 'active' | 'sold';
  soldPrice?: number;
  soldAt?: string;
}

export interface CartItem extends Product {
  currentPriceAtAddition: number;
}

export interface Transaction {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
}

export interface GeminiSuggestion {
  suggestedPrice: number;
  description: string;
  category: string;
}
