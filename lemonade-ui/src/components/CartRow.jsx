import React from 'react';
// Import your hand-drawn lemon image asset
import lemonImg from '../assets/lemon.png'; 

export default function CartRow({ item, onUpdateQty, onDelete }) {
  const lineTotal = (item.price * item.quantity).toFixed(2);
  const formattedPrice = item.price.toFixed(2);

  return (
    <tr style={{ 
      borderBottom: '1px solid #f3f4f6', 
      backgroundColor: '#ffffff'
    }}>
      {/* Product Logo / Image Asset Cell */}
      <td style={{ padding: '20px 8px', verticalAlign: 'middle' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          
          {/* Displaying your exact hand-drawn lemon.png asset */}
          <img 
            src={lemonImg} 
            alt="Lemon Product" 
            style={{
              width: '44px',
              height: '44px',
              objectFit: 'contain',
              flexShrink: 0
            }} 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontWeight: '600', fontSize: '15px', color: '#000000' }}>
              {item.productName}
            </span>
            <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '400' }}>
              {item.sizeName}
            </span>
          </div>
        </div>
      </td>

      {/* Unit Price Column */}
      <td style={{ padding: '20px 8px', color: '#000000', fontSize: '15px', fontWeight: '400', verticalAlign: 'middle' }}>
        {formattedPrice}
      </td>

      {/* Square Edge Quantity Control Blocks */}
      <td style={{ padding: '20px 8px', verticalAlign: 'middle', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => onUpdateQty(item.variantId, item.quantity - 1)}
            style={{ 
              width: '24px', 
              height: '24px', 
              border: '1px solid #000000',
              background: '#ffffff', 
              cursor: 'pointer', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: '#000000',
              borderRadius: '0px',
              padding: 0
            }}
          >
            -
          </button>
          
          <span style={{ fontWeight: '500', fontSize: '15px', color: '#000000', minWidth: '12px' }}>
            {item.quantity}
          </span>
          
          <button 
            onClick={() => onUpdateQty(item.variantId, item.quantity + 1)}
            style={{ 
              width: '24px', 
              height: '24px', 
              border: '1px solid #000000',
              background: '#ffffff', 
              cursor: 'pointer', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: '#000000',
              borderRadius: '0px',
              padding: 0
            }}
          >
            +
          </button>
        </div>
      </td>

      {/* Aggregate Row Total */}
      <td style={{ padding: '20px 8px', fontWeight: '500', fontSize: '15px', color: '#000000', verticalAlign: 'middle' }}>
        {lineTotal}
      </td>

      {/* Wireframe Trash Action SVG */}
      <td style={{ padding: '20px 8px', verticalAlign: 'middle', textAlign: 'center' }}>
        <button 
          onClick={() => onDelete(item.variantId)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#000000', 
            cursor: 'pointer', 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </td>
    </tr>
  );
}