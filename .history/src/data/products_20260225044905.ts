export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: "hot" | "sale" | "new" | "discount";
  discountPercent?: number;
  weight?: string;
  description?: string;
}

export const products: Product[] = [
  { id: 1, name: "Seeds of Change Organic Quinoa", category: "Snack", brand: "NestFood", price: 28.85, oldPrice: 32.80, rating: 4, reviews: 14, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop", badge: "hot" },
  { id: 2, name: "All Natural Italian-Style Chicken Meatballs", category: "Hallo Foods", brand: "Stouffer", price: 52.85, oldPrice: 55.80, rating: 4, reviews: 15, image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300&h=300&fit=crop", badge: "sale" },
  { id: 3, name: "Angie's Boomchickapop Sweet & Salty", category: "Snack", brand: "StarKist", price: 48.85, oldPrice: 52.80, rating: 5, reviews: 12, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&h=300&fit=crop", badge: "new" },
  { id: 4, name: "Foster Farms Takeout Crispy Classic", category: "Vegetables", brand: "NestFood", price: 17.85, oldPrice: 19.80, rating: 4, reviews: 18, image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&h=300&fit=crop" },
  { id: 5, name: "Blue Diamond Almonds Lightly Salted", category: "Pet Foods", brand: "NestFood", price: 23.85, oldPrice: 25.80, rating: 3, reviews: 11, image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&h=300&fit=crop", badge: "discount", discountPercent: 14 },
  { id: 6, name: "Chobani Complete Vanilla Greek Yogurt", category: "Fresh Foods", brand: "NestFood", price: 54.85, oldPrice: 60.80, rating: 4, reviews: 9, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop" },
  { id: 7, name: "Canada Dry Ginger Ale 2L Bottle", category: "Drinks", brand: "NestFood", price: 32.85, oldPrice: 35.80, rating: 4, reviews: 7, image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300&h=300&fit=crop", badge: "sale" },
  { id: 8, name: "Encore Seafoods Stuffed Alaskan", category: "Snack", brand: "NestFood", price: 35.85, oldPrice: 39.80, rating: 5, reviews: 20, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop" },
  { id: 9, name: "Gorton's Beer Battered Fish Fillets", category: "Coffee", brand: "Old El Paso", price: 23.85, oldPrice: 25.80, rating: 4, reviews: 6, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&h=300&fit=crop", badge: "hot" },
  { id: 10, name: "Haagen-Dazs Caramel Cone Ice Cream", category: "Cream", brand: "Tyson", price: 22.85, oldPrice: 24.80, rating: 5, reviews: 15, image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=300&h=300&fit=crop" },
  { id: 11, name: "Simply Lemonade with Raspberry Juice", category: "Drinks", brand: "Sunkist", price: 15.85, oldPrice: 18.80, rating: 4, reviews: 22, image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300&h=300&fit=crop" },
  { id: 12, name: "Signature Wood-Fired Mushroom", category: "Vegetables", brand: "Progresso", price: 12.85, oldPrice: 15.80, rating: 4, reviews: 8, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop" },
  { id: 13, name: "Perdue Simply Smart Organics Gluten", category: "Pet Foods", brand: "Old El Paso", price: 24.85, oldPrice: 28.80, rating: 3, reviews: 10, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop", badge: "sale" },
  { id: 14, name: "Seeds of Change Organic Quinoa Brown", category: "Snack", brand: "NestFood", price: 32.85, oldPrice: 38.80, rating: 5, reviews: 16, image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=300&fit=crop" },
  { id: 15, name: "Extra Virgin Olive Oil Premium", category: "Fresh Foods", brand: "Tofino Pizza", price: 55.00, oldPrice: 62.00, rating: 5, reviews: 25, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop", badge: "new" },
  { id: 16, name: "Frozen Fruit Strawberry Banana", category: "Fresh Foods", brand: "Mashter Klass", price: 79.00, oldPrice: 85.00, rating: 4, reviews: 13, image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=300&fit=crop" },
];
