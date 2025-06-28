'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Sparkles, Star, ChevronRight } from 'lucide-react';
import Navigation from './components/Navigation';
import { motion } from 'framer-motion';


// Move products to a separate file or keep it here
const allProducts = [
  {
    id: 1,
    name: 'Crunchy Chips',
    price: 20,
    image: '/Images/download.jpeg',
    category: 'Snacks'
  },
  {
    id: 2,
    name: 'Chocolate Bar',
    price: 50,
    image: '/Images/images.jpeg',
    category: 'Sweets'
  },
  {
    id: 3,
    name: 'Cookies Pack',
    price: 40,
    image: '/Images/download (2).jpeg',
    category: 'Bakery'
  },
  {
    id: 4,
    name: 'Nuts Mix',
    price: 80,
    image: '/Images/download (1).jpeg',
    category: 'Healthy'
  }
];

// Cart state management
const useCart = () => {
  const [cart, setCart] = useState<Array<{product: typeof allProducts[0], quantity: number}>>([]);
  const [isClient, setIsClient] = useState(false);

  // Load cart from localStorage on client-side
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart', e);
          localStorage.removeItem('cart');
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isClient]);

  // Handle window storage event to sync cart between tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        try {
          if (e.newValue) {
            setCart(JSON.parse(e.newValue));
          } else {
            setCart([]);
          }
        } catch (e) {
          console.error('Failed to parse updated cart', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = (product: typeof allProducts[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      let newCart;
      
      if (existingItem) {
        newCart = prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        newCart = [...prevCart, { product, quantity: 1 }];
      }
      
      return newCart;
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartCount,
    getCartTotal
  };
};

export default function Home() {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAllProducts, setShowAllProducts] = useState(false);
  const router = useRouter();

  // Filter products by category
  const filteredProducts = selectedCategory === 'All' 
    ? allProducts 
    : allProducts.filter(product => product.category === selectedCategory);

  // Show only 4 featured products initially, or all if showAllProducts is true
  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 4);
  const categories = ['All', ...new Set(allProducts.map(p => p.category))];

  const handleShopNow = () => {
    // Scroll to featured products section
    const featuredSection = document.getElementById('featured-products');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewAll = () => {
    setShowAllProducts(!showAllProducts);
  };

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="text-amber-400" size={16} />
          </div>
        ))}
      </div>
      <main className="min-h-screen pb-32 bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16">
        <div className="absolute inset-0 rounded-xl opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center"></div>
        </div>
        
        {/* Top Title */}
        

        <div className="container mx-auto px-4 relative z-10 mt-6">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-5">
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="mt-10 text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                Discover Amazing <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-pink-300">Products</span>
              </h2>
            
              <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-2xl mx-auto md:mx-0">
                Shop the latest collection of premium snacks and treats. Fast delivery and premium quality guaranteed.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button 
                  onClick={handleShopNow}
                  className="bg-white text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                >
                  Shop Now <ChevronRight className="ml-2 h-5 w-5" />
                </button>
                <button className="bg-transparent border-2 border-white/30 hover:border-white/50 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              {/* Add any image or content for the right side here */}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div id="featured-products" className="container mx-auto px-4 py-16">
        <div className=" flex-col sm:flex-row justify-between items-start sm:items-center mb-10 ">
          <div>
            <h2 className="text-center text-3xl font-bold text-gray-900">Shop by Category</h2>
            {/* <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 mt- rounded-full"></div> */}
          </div>
          <div className=" justify-center flex flex-row space-x-2">
          {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
              {category}
              </button>
            ))}
            </div>
          {filteredProducts.length > 4 && (
            <button 
              onClick={handleViewAll}
              className="text-purple-600 hover:text-purple-800 font-medium flex items-center bg-purple-50 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors"
            >
              {showAllProducts ? 'Show Less' : 'View All'}
              <ChevronRight className={`ml-1 h-4 w-4 transition-transform ${showAllProducts ? 'transform rotate-90' : ''}`} />
            </button>
          )}
        </div>
        
        {displayedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedProducts.map((product) => (
            <motion.div 
              key={product.id} 
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onMouseEnter={() => setIsHovered(product.id)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <div className="relative h-56 bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  layout="fill"
                  objectFit="contain"
                  className={`transition-transform duration-500 ${isHovered === product.id ? 'scale-110' : 'scale-100'}`}
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
                    <span className="text-sm text-pink-500 font-medium">{product.category}</span>
                  </div>
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 text-xl">
                    ${product.price}
                  </span>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(product)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
          </div>
        )}
        


        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16 mt-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to satisfy your cravings?</h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of happy customers enjoying our premium snacks delivered to their doorstep.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="bg-white text-purple-700 hover:bg-purple-50 px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>

      <Navigation />
    </main>
    </>
  );
}