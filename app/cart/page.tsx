'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// This would ideally come from a shared types file
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

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

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.product.id !== productId));
      return;
    }
    
    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 to-yellow-500/90">
      <header className="bg-gradient-to-br  bg-white  p-4 shadow-md sticky top-0 z-15">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link href="/" className="text-black">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-black">Your Cart</h1>
          <div className="w-6"></div> {/* For balance */}
        </div>
      </header>

      <main className="p-4 pb-32">
        {cart.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link 
              href="/" 
              className="inline-block bg-gradient-to-br from-blue-600 to-pink-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center bg-gradient-to-br from-blue-600  rounded-lg shadow-sm p-3">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-amber-600 font-semibold">₹{item.product.price}</p>
                    <div className="flex items-center mt-1">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 text-gray-500 hover:text-amber-600"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="mx-2 w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-gray-500 hover:text-amber-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">₹{getTotal()}</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <button 
                className=" bg-amber-500 text-white py-3 rounded-lg font-medium text-center hover:bg-amber-600 transition-colors"
              >
                Proceed to Checkout (₹{getTotal()})
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}