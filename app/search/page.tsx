'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, X, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';

// Sample product data - in a real app, this would come from an API
const allProducts = [
  {
    id: 1,
    name: 'Crunchy Chips',
    price: 20,
    image: '/Images/download.jpeg',
    category: 'Snacks',
    description: 'Delicious and crispy potato chips with perfect seasoning.'
  },
  {
    id: 2,
    name: 'Chocolate Bar',
    price: 50,
    image: '/Images/images.jpeg',
    category: 'Sweets',
    description: 'Creamy milk chocolate bar for your sweet cravings.'
  },
  {
    id: 3,
    name: 'Cookies Pack',
    price: 40,
    image: '/Images/download (2).jpeg',
    category: 'Bakery',
    description: 'Freshly baked cookies with chocolate chips.'
  },
  {
    id: 4,
    name: 'Nuts Mix',
    price: 80,
    image: '/Images/download (1).jpeg',
    category: 'Healthy',
    description: 'Healthy mix of almonds, cashews, and walnuts.'
  }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<typeof allProducts>([]);

  // Filter products based on search query
  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: typeof allProducts[0]) => {
    setCart(prevCart => {
      // Check if product already in cart
      if (prevCart.some(item => item.id === product.id)) {
        return prevCart;
      }
      return [...prevCart, product];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-br from-blue-600 p-4 shadow-md sticky top-0 z-10">
        <div className="relative max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="p-4">
        {searchQuery ? (
          <div>
            <h2 className="text-lg font-medium mb-4">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} for "{searchQuery}"
            </h2>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                    <div className="flex">
                      <div className="relative w-24 h-24 bg-gray-100 flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 flex-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{product.category}</p>
                        <p className="text-amber-600 font-semibold">₹{product.price}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                      </div>
                      <div className="p-2 flex items-center">
                        <button
                          onClick={() => addToCart(product)}
                          className="p-2 bg-amber-100 text-amber-600 rounded-full hover:bg-amber-200 transition-colors"
                          title="Add to cart"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
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
                {['Chips', 'Chocolate', 'Cookies', 'Nuts'].map((term) => (
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
      </main>
      <Navbar />
    </div>
  );
}