export type Category = 'All' | 'Grocery' | 'Dairy' | 'Snacks' | 'Beverages' | 'Household';

export interface Product {
  id: string;
  name: string;
  nameHindi: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: Category;
  unit: string;
  description: string;
  descriptionHindi: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  tags?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  deliveryType: 'delivery' | 'pickup';
}

export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'dispatched' | 'delivered';

export interface Order {
  id: string;
  items: CartItem[];
  details: OrderDetails;
  total: number;
  status: OrderStatus;
  createdAt: string;
  paymentId?: string;
}
