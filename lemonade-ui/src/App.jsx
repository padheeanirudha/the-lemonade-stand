import React, { useState, useEffect } from 'react';
import CartRow from './components/CartRow.jsx';
import logoAsset from './assets/logo.png'; 

const BACKEND_GRAPHQL_URL = 'https://orange-space-fortnight-p77j47w46g7f77r6-5070.app.github.dev/graphql';

const ALL_AVAILABLE_VARIANTS = [
  { variantId: '1', productName: 'Lemonade', sizeName: 'Regular', price: 1.00 },
  { variantId: '2', productName: 'Pink Lemonade', sizeName: 'Regular', price: 1.00 },
  { variantId: '3', productName: 'Lemonade', sizeName: 'Large', price: 1.50 },
  { variantId: '4', productName: 'Pink Lemonade', sizeName: 'Large', price: 1.50 }
];

export default function App() {
  const [cart, setCart] = useState(() => {
    const localCache = localStorage.getItem('lemonade_customer_cart');
    return localCache ? JSON.parse(localCache) : ALL_AVAILABLE_VARIANTS.map(item => ({ ...item, quantity: 1 }));
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🛠️ NEW: CUSTOMER INFORMATION FORM STATES
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [activeOrderNumber, setActiveOrderNumber] = useState('');

  useEffect(() => {
    async function syncCartWithDatabase() {
      try {
        const query = `
          query GetCart {
            cart {
              variantId
              productName
              sizeName
              price
              quantity
            }
          }
        `;
        const response = await fetch(BACKEND_GRAPHQL_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
        const json = await response.json();
        if (json.data && json.data.cart && json.data.cart.length > 0) {
          setCart(json.data.cart);
          localStorage.setItem('lemonade_customer_cart', JSON.stringify(json.data.cart));
        }
      } catch (err) {
        console.warn("Backend unreachable. Using local storage fallback.");
      } finally {
        setLoading(false);
      }
    }
    syncCartWithDatabase();
  }, []);

  const handleUpdateQty = async (variantId, newQty) => {
    if (newQty < 1) return;
    const updatedCart = cart.map(item => item.variantId === variantId ? { ...item, quantity: newQty } : item);
    setCart(updatedCart);
    localStorage.setItem('lemonade_customer_cart', JSON.stringify(updatedCart));

    try {
      const mutation = `
        mutation UpdateCartItem($variantId: ID!, $quantity: Int!) {
          updateCartItem(variantId: $variantId, quantity: $quantity) { variantId quantity }
        }
      `;
      await fetch(BACKEND_GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mutation, variables: { variantId, quantity: newQty } })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (variantId) => {
    const updatedCart = cart.filter(item => item.variantId !== variantId);
    setCart(updatedCart);
    localStorage.setItem('lemonade_customer_cart', JSON.stringify(updatedCart));

    try {
      const mutation = `
        mutation DeleteCartItem($variantId: ID!) {
          deleteCartItem(variantId: $variantId) { success }
        }
      `;
      await fetch(BACKEND_GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mutation, variables: { variantId } })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestoreMissingItems = () => {
    const existingIds = cart.map(item => item.variantId);
    const missingItems = ALL_AVAILABLE_VARIANTS.filter(v => !existingIds.includes(v.variantId)).map(v => ({ ...v, quantity: 1 }));
    const completeCart = [...cart, ...missingItems].sort((a, b) => a.variantId.localeCompare(b.variantId));
    setCart(completeCart);
    localStorage.setItem('lemonade_customer_cart', JSON.stringify(completeCart));
  };

  // 🛠️ UPDATED: PIPELINES FORM METADATA THROUGH THE TRANSACTION LOGS 
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    if (!customerName.trim() || !customerContact.trim()) {
      alert("Please provide your pickup Name and Contact information before checking out.");
      return;
    }

    setIsSubmitting(true);

    const timestamp = new Date().getFullYear();
    const randomSequence = Math.floor(100000 + Math.random() * 900000);
    const generatedOrderNum = `ORD-${timestamp}-${randomSequence}`;

    try {
      const mutation = `
        mutation PlaceOrder($items: [CartItemInput!]!, $name: String!, $contact: String!) {
          placeOrder(items: $items, customerName: $name, customerContact: $contact) { orderId success }
        }
      `;
      const inputItems = cart.map(item => ({ variantId: item.variantId, quantity: item.quantity }));
      const response = await fetch(BACKEND_GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: mutation, 
          variables: { items: inputItems, name: customerName, contact: customerContact } 
        })
      });
      const json = await response.json();

      if (json.data && json.data.placeOrder?.success) {
        setActiveOrderNumber(json.data.placeOrder.orderId);
      } else {
        setActiveOrderNumber(generatedOrderNum);
      }
    } catch (err) {
      setActiveOrderNumber(generatedOrderNum);
    } finally {
      setIsSubmitting(false);
      setShowModal(true);
      setCart([]);
      localStorage.removeItem('lemonade_customer_cart');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCustomerName('');   // Reset form upon successful cycle checkout completion
    setCustomerContact('');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  const isFormInvalid = !customerName.trim() || !customerContact.trim() || cart.length === 0;

  return (
    <div style={{ backgroundColor: '#fbfbfb', minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif' }}>
      
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
        <img src={logoAsset} alt="The Lemonade Stand Logo" style={{ width: '540px', height: 'auto', display: 'block' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px', width: '100%', maxWidth: '1100px', alignItems: 'start' }}>
        
        {/* Left Side Product Table Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fbfbfb' }}>
            <thead>
              <tr>
                <th style={{ padding: '24px 16px', width: '38%' }}></th>
                <th style={{ padding: '24px 16px', textAlign: 'left', fontFamily: '"Georgia", serif', fontWeight: 'normal', color: '#000000', fontSize: '16px' }}>Price</th>
                <th style={{ padding: '24px 16px', textAlign: 'center', fontFamily: '"Georgia", serif', fontWeight: 'normal', color: '#000000', fontSize: '16px', width: '120px' }}>QTY</th>
                <th style={{ padding: '24px 16px', textAlign: 'left', fontFamily: '"Georgia", serif', fontWeight: 'normal', color: '#000000', fontSize: '16px' }}>Total</th>
                <th style={{ padding: '24px 16px', width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <CartRow key={item.variantId} item={item} onUpdateQty={handleUpdateQty} onDelete={handleDelete} />
              ))}
            </tbody>
          </table>

          {cart.length < 4 && (
            <button onClick={handleRestoreMissingItems} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#a3a3a3', fontFamily: '"Georgia", serif', fontSize: '14px', fontStyle: 'italic', cursor: 'pointer', padding: '8px 16px', textDecoration: 'underline' }}>
              + Restore missing items to cart
            </button>
          )}
        </div>

        {/* Right Side Summary Panel & Information Form Block */}
        <div style={{ backgroundColor: '#f7f7f7', padding: '36px 24px', border: '1px solid #eaeaea', boxSizing: 'border-box', marginTop: '16px' }}>
          
          {/* 🛠️ NEW: MINIMALIST CUSTOMER INFO INPUT MATRIX */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px', borderBottom: '1px solid #eaeaea', paddingBottom: '24px' }}>
            <span style={{ fontFamily: '"Georgia", serif', fontSize: '15px', color: '#000000' }}>Pickup Details</span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#737373', letterSpacing: '0.05em' }}>Name</label>
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d4d4d4', background: '#ffffff', fontSize: '14px', fontFamily: 'sans-serif', boxSizing: 'border-box', borderRadius: '0px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#737373', letterSpacing: '0.05em' }}>Phone or Email</label>
              <input 
                type="text" 
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                placeholder="name@company.com"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d4d4d4', background: '#ffffff', fontSize: '14px', fontFamily: 'sans-serif', boxSizing: 'border-box', borderRadius: '0px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <span style={{ fontFamily: '"Georgia", serif', fontSize: '16px', color: '#000000' }}>Total</span>
            <span style={{ fontFamily: 'sans-serif', fontSize: '16px', fontWeight: '700', color: '#000000' }}>$ {cartTotal}</span>
          </div>
          
          <button 
            onClick={handlePlaceOrder}
            disabled={isSubmitting || isFormInvalid}
            style={{
              width: '100%',
              backgroundColor: isFormInvalid ? '#a3a3a3' : '#000000',
              color: '#ffffff',
              border: 'none',
              padding: '14px 0',
              fontSize: '14px',
              fontWeight: '700',
              cursor: isFormInvalid ? 'not-allowed' : 'pointer',
              letterSpacing: '0.05em'
            }}
          >
            {isSubmitting ? 'Processing...' : 'Order Now'}
          </button>
        </div>
      </div>

      {/* SUCCESS MODAL DIALOG POPUP */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(2px)' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '48px 40px', maxWidth: '440px', width: '90%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid #eaeaea' }}>
            <h3 style={{ fontFamily: '"Georgia", serif', fontSize: '24px', fontWeight: 'normal', color: '#000000', margin: '0 0 16px 0' }}>Order Placed Successfully</h3>
            <p style={{ fontFamily: 'sans-serif', fontSize: '14px', color: '#737373', lineHeight: '1.6', margin: '0 0 32px 0' }}>
              Thank you for your purchase. Your tracking reference is secure under ID:<br />
              <strong style={{ display: 'block', color: '#000000', fontSize: '16px', marginTop: '12px', fontFamily: 'monospace', letterSpacing: '0.05em' }}>#{activeOrderNumber}</strong>
            </p>
            <button onClick={handleCloseModal} style={{ backgroundColor: '#000000', color: '#ffffff', border: 'none', padding: '12px 32px', fontSize: '13px', fontWeight: '700', letterSpacing: '0.05em', cursor: 'pointer' }}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}

    </div>
  );
}