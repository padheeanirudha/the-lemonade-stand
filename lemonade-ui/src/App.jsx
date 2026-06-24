import React, { useState } from 'react';
import CartRow from './components/CartRow.jsx';
// Import the exact asset sliced from your design
import logoAsset from './assets/logo.png'; 

const INITIAL_CART = [
  { variantId: '1', productName: 'Lemonade', sizeName: 'Regular', price: 1.00, quantity: 1 },
  { variantId: '2', productName: 'Pink Lemonade', sizeName: 'Regular', price: 1.00, quantity: 1 },
  { variantId: '3', productName: 'Lemonade', sizeName: 'Large', price: 1.50, quantity: 1 },
  { variantId: '4', productName: 'Pink Lemonade', sizeName: 'Large', price: 1.50, quantity: 1 }
];

export default function App() {
  const [cart, setCart] = useState(INITIAL_CART);

  const handleUpdateQty = (variantId, newQty) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(item => 
      item.variantId === variantId ? { ...item, quantity: newQty } : item
    ));
  };

  const handleDelete = (variantId) => {
    setCart(prev => prev.filter(item => item.variantId !== variantId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

  return (
    <div style={{ 
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      padding: '60px 40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      {/* HEADER LOGO CONTAINER - Rendering the Exact Asset */}
      <div style={{ marginBottom: '50px', display: 'flex', justifyContent: 'center' }}>
        <img 
          src={logoAsset} 
          alt="The Lemonade Stand Logo" 
          style={{
            width: '540px',   // Matches exact spec layout bounds
            height: 'auto',   // Protects aspect ratio from stretching
            display: 'block'
          }} 
        />
      </div>

      {/* CORE CONTENT LAYOUT GRID */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 300px', 
        gap: '48px', 
        width: '100%',
        maxWidth: '1100px', 
        alignItems: 'start',
        marginTop: '20px'
      }}>
        
        {/* Left Side Product Table Container */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '12px 16px', width: '45%' }}></th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: '"Georgia", serif', fontWeight: 'normal', color: '#6b7280', fontSize: '15px' }}>Price</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontFamily: '"Georgia", serif', fontWeight: 'normal', color: '#6b7280', fontSize: '15px', width: '100px' }}>QTY</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: '"Georgia", serif', fontWeight: 'normal', color: '#6b7280', fontSize: '15px' }}>Total</th>
              <th style={{ padding: '12px 16px', width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <CartRow 
                key={item.variantId}
                item={item}
                onUpdateQty={handleUpdateQty}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>

        {/* Right Side Summary Panel */}
        <div style={{ 
          backgroundColor: '#f9fafb', 
          padding: '40px 24px',
          border: '1px solid #e5e7eb',
          borderRadius: '2px',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
            <span style={{ fontFamily: '"Georgia", serif', fontSize: '16px', color: '#000000' }}>Total</span>
            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '16px', fontWeight: '700', color: '#000000' }}>$ {cartTotal}</span>
          </div>
          
          <button style={{
            width: '100%',
            backgroundColor: '#000000',
            color: '#ffffff',
            border: 'none',
            padding: '14px 0',
            fontFamily: '"Inter", sans-serif',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            borderRadius: '2px'
          }}>
            Order Now
          </button>
        </div>

      </div>
    </div>
  );
}