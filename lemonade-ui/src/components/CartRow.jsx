import React from 'react';
import lemonImg from '../assets/lemon.png'; 

export default function CartRow({ item, onUpdateQty, onDelete }) {
  const lineTotal = (item.price * item.quantity).toFixed(2);
  const formattedPrice = item.price.toFixed(2);

  return (
    <tr style={{ 
      borderBottom: '1px solid #f2f2f2', 
      backgroundColor: '#fbfbfb'         
    }}>
      {/* Product Image & Meta text Column */}
      <td style={{ padding: '20px 16px', verticalAlign: 'middle' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img 
            src={lemonImg} 
            alt="Lemon Product" 
            style={{
              width: '48px',
              height: '48px',
              objectFit: 'contain',
              flexShrink: 0
            }} 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ 
              fontFamily: '"Georgia", serif', 
              fontWeight: 'normal', 
              fontSize: '16px', 
              color: '#000000' 
            }}>
              {item.productName}
            </span>
            <span style={{ 
              fontFamily: 'sans-serif', 
              fontSize: '13px', 
              color: '#a3a3a3', 
              fontWeight: '400' 
            }}>
              {item.sizeName}
            </span>
          </div>
        </div>
      </td>

      {/* Unit Price Column */}
      <td style={{ 
        padding: '20px 16px', 
        color: '#000000', 
        fontFamily: '"Georgia", serif', 
        fontSize: '16px', 
        verticalAlign: 'middle' 
      }}>
        {formattedPrice}
      </td>

      {/* Numeric Quantity Box Component Controls */}
      <td style={{ padding: '20px 16px', verticalAlign: 'middle', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => onUpdateQty(item.variantId, item.quantity - 1)}
            style={{ 
              width: '22px', 
              height: '22px', 
              border: '1px solid #000000',
              background: '#ffffff', 
              cursor: 'pointer', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#000000',
              borderRadius: '0px',
              padding: 0
            }}
          >
            -
          </button>
          
          <span style={{ 
            fontFamily: '"Georgia", serif', 
            fontSize: '16px', 
            color: '#000000', 
            minWidth: '16px',
            textAlign: 'center'
          }}>
            {item.quantity}
          </span>
          
          <button 
            onClick={() => onUpdateQty(item.variantId, item.quantity + 1)}
            style={{ 
              width: '22px', 
              height: '22px', 
              border: '1px solid #000000',
              background: '#ffffff', 
              cursor: 'pointer', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#000000',
              borderRadius: '0px',
              padding: 0
            }}
          >
            +
          </button>
        </div>
      </td>

      {/* Line Subtotal Column */}
      <td style={{ 
        padding: '20px 16px', 
        color: '#000000', 
        fontFamily: '"Georgia", serif', 
        fontSize: '16px', 
        verticalAlign: 'middle' 
      }}>
        {lineTotal}
      </td>

      {/* Wireframe Trash Action Trigger */}
      <td style={{ padding: '20px 16px', verticalAlign: 'middle', textAlign: 'center' }}>
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </td>
    </tr>
  );
}