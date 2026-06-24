import React, { useState, useEffect } from 'react';
// import { useQuery } from '@apollo/client/react/hooks/useQuery.js';
import { useQuery, useMutation } from '@apollo/client/react'; // 👈 Direct React bundle entry point
import { GET_PRODUCTS, CREATE_ORDER } from './graphql/queries';
import CartRow from './components/CartRow';


export default function App() {
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const [createOrder, { loading: submitting }] = useMutation(CREATE_ORDER);

  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', contact: '' });
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Hydrate cart rows once active menu choices return from database service
  useEffect(() => {
    if (data && data.products) {
      const initialItems = [];
      data.products.forEach(product => {
        product.variants.forEach(variant => {
          initialItems.push({
            variantId: parseInt(variant.id),
            productName: product.name,
            sizeName: variant.sizeName,
            price: variant.price,
            quantity: 1 // Baseline mock default from Figma design state layout
          });
        });
      });
      setCart(initialItems);
    }
  }, [data]);

  const handleUpdateQty = (variantId, newQty) => {
    if (newQty < 0) return;
    setCart(prev => prev.map(item => 
      item.variantId === variantId ? { ...item, quantity: newQty } : item
    ));
  };

  const handleDelete = (variantId) => {
    setCart(prev => prev.filter(item => item.variantId !== variantId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!customer.name.trim() || !customer.contact.trim()) {
      setValidationError('Please supply your name and contact info to pick up your order.');
      return;
    }

    const filteredItems = cart.filter(item => item.quantity > 0).map(item => ({
      variantId: item.variantId,
      quantity: item.quantity
    }));

    if (filteredItems.length === 0) {
      setValidationError('Your shopping cart is currently empty.');
      return;
    }

    try {
      const response = await createOrder({
        variables: {
          input: {
            customerName: customer.name,
            customerContact: customer.contact,
            items: filteredItems
          }
        }
      });

      const result = response.data.createOrder;
      if (result.success) {
        setOrderConfirmation(result.orderNumber);
      } else {
        setValidationError(result.message);
      }
    } catch (err) {
      setValidationError('Failed to connect to the backend order submission service.');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>Hydrating virtual storefront from datastore...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red', fontFamily: 'sans-serif' }}>Error connecting to GraphQL platform: {error.message}</div>;

  // Success Confirmation Template state view switch block mapping
  if (orderConfirmation) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '40px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontFamily: 'sans-serif' }}>
        <span style={{ fontSize: '64px' }}>🎉</span>
        <h2 style={{ fontSize: '28px', marginTop: '16px', color: '#111827' }}>Thank You For Supporting Us!</h2>
        <p style={{ color: '#4b5563', margin: '16px 0 32px' }}>Your virtual fundraiser order has been compiled and recorded.</p>
        <div style={{ backgroundColor: '#f3f4f6', padding: '24px', borderRadius: '12px', display: 'inline-block' }}>
          <span style={{ textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Your Pickup Confirmation Code</span>
          <strong style={{ fontSize: '24px', color: '#111827', fontFamily: 'monospace' }}>{orderConfirmation}</strong>
        </div>
        <button onClick={() => window.location.reload()} style={{ marginTop: '40px', display: 'block', width: '100%', padding: '14px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Order Again</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Dynamic header title structure branding banner layer matching image 1 */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ border: '4px solid #000', display: 'inline-block', padding: '16px 40px', backgroundColor: '#fff', textAlign: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '32px', letterSpacing: '4px', fontWeight: '800' }}>
              THE <span style={{ color: '#eab308' }}>LEMONADE</span> STAND
            </h1>
          </div>
        </div>

        {/* Dual Flexible layout block splitting split table list configuration from form parameters */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
          
          {/* Left Grid Layout Partition Card: Shopping Checkout Cart List Summary Table Wrapper */}
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f3f4f6', color: '#6b7280', fontSize: '13px', textTransform: 'uppercase' }}>
                  <th style={{ paddingBottom: '12px', fontWeight: '600' }}>Item</th>
                  <th style={{ paddingBottom: '12px', fontWeight: '600' }}>Price</th>
                  <th style={{ paddingBottom: '12px', fontWeight: '600' }}>Qty</th>
                  <th style={{ paddingBottom: '12px', fontWeight: '600' }}>Total</th>
                  <th style={{ paddingBottom: '12px' }}></th>
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
          </div>

          {/* Right Grid Layout Partition Card: Customer Contact Pickup Verification Ledger Form */}
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Order Summary</h3>
            
            <form onSubmit={handleOrderSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>Full Name</label>
                <input type="text" placeholder="John Doe" value={customer.name} onChange={e => setCustomer(prev => ({ ...prev, name: e.target.value }))} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '6px' }} />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>Email or Phone Number</label>
                <input type="text" placeholder="john@example.com" value={customer.contact} onChange={e => setCustomer(prev => ({ ...prev, contact: e.target.value }))} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '6px' }} />
              </div>

              {validationError && (
                <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
                  ⚠️ {validationError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '16px', marginBottom: '24px' }}>
                <span style={{ fontSize: '16px', color: '#4b5563', flexGrow: 1 }}>Total Balance:</span>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>${calculateTotal()}</span>
              </div>

              <button type="submit" disabled={submitting} style={{ width: '100%', padding: '14px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '15px' }}>
                {submitting ? 'Processing Ledger Securely...' : 'Order Now'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}