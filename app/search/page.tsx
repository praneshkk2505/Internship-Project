'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, X, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

// Sample product data - in a real app, this would come from an API
const allProducts = [
  {
    id: 1,
    name: 'Ladoo',
    price: 20,
    image: '/Images/IMG-20250630-WA0002.jpg',
    categories: ['Sweets', 'Diwali Special'],
    description: 'Delicious and crispy potato chips with perfect seasoning.'
  },
  {
    id: 2,
    name: 'Murukku',
    price: 30,
    image: '/Images/IMG-20250630-WA0003.jpg',
    categories: ['Savory', 'Snacks'],
    description: 'Crunchy and savory rice-based snack.'
  },
  {
    id: 3,
    name: 'Mysore Pak',
    price: 40,
    image: '/Images/IMG-20250630-WA0004.jpg',
    categories: ['Sweets', 'Festive Special'],
    description: 'Rich and sweet traditional Indian dessert.'
  },
  {
    id: 4,
    name: 'Kara Boondhi',
    price: 25,
    image: '/Images/IMG-20250630-WA0005.jpg',
    categories: ['Snacks', 'Spicy'],
    description: 'Spicy and crispy snack mix.'
  }
];

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  categories: string[];
  description: string;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const router = useRouter();

  // Filter products based on search query
  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to cart logic here
    console.log('Added to cart:', product);
  };

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-br from-purple-600 to-pink-500 p-4 shadow-md sticky top-0 z-10">
        <div className="relative max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-10 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white bg-white text-gray-900 placeholder-gray-500"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="p-4 max-w-7xl mx-auto">
        {searchQuery ? (
          <div>
            <h2 className="text-lg font-medium mb-6 text-gray-700">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} for &quot;{searchQuery}&quot;
            </h2>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <motion.div 
                    key={product.id} 
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onMouseEnter={() => setIsHovered(product.id)}
                    onMouseLeave={() => setIsHovered(null)}
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="relative h-56 bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        width={200}
                        height={200}
                        className={`w-full h-full object-contain transition-transform duration-500 ${isHovered === product.id ? 'scale-110' : 'scale-100'}`}
                      />
                      <div className="absolute top-3 left-3 flex items-center bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 mr-1 fill-amber-400" />
                        <span>Bestseller</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.categories.map((category, idx) => (
                              <span key={idx} className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 text-xl">
                          ${product.price}
                        </span>
                      </div>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => addToCart(product, e)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No products found matching your search.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-amber-600 hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-amber-500" size={28} />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">Search for products</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Find your favorite snacks, sweets, and more by typing in the search bar above.
            </p>
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Try searching for:</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {['Snacks', 'Bakery', 'Crunchy','Spicy','Sweets', 'Premium', 'Dessert', 'Festive'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <Navbar />
      </main>
    </div>
  );
}