export type Category = 'Graduation' | 'Wedding' | 'Art Session' | 'Birthday' | 'Others';

export interface PortfolioItem {
  id: number;
  category: Category;
  imageUrl: string;
  title: string;
}

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingPackage {
  id: string;
  category: Category;
  name: string;
  subtitle: string;
  price: string;
  originalPrice?: string; // Added for marketing strategy (strikethrough price)
  features: string[];
  recommended?: boolean;
}
