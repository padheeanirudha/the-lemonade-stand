import React from 'react';

export default function CartRow({ item, onUpdateQty, onDelete }) {
  const lineTotal = (item.price * item.quantity).toFixed(2);

  return (
    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
      <td style={{ padding: '16px 8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Lemon Icon Circle placeholder matching mockup */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#fef08a',
          border: '2px solid #000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '20px'
        }}>
          🍋
        </div>
        <div>
          <div style={{ fontWeight: '600', color: '#111827' }}>{item.productName}</div>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>{item.sizeName}</div>
        </div>
      </td>
      <td style={{ padding: '16px 8px', color: '#4b5563', verticalAlign: 'middle' }}>
        ${item.price.toFixed(2)}
      </td>
      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
        {/* QTY Control Box Block Layout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => onUpdateQty(item.variantId, item.quantity - 1)}
            style={{ width: '28px', height: '28px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', borderRadius: '4px' }}
          >
            -
          </button>
          <span style={{ minWidth: '16px', textAlign: 'center', fontWeight: '500' }}>{item.quantity}</span>
          <button 
            onClick={() => onUpdateQty(item.variantId, item.quantity + 1)}
            style={{ width: '28px', height: '28px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', borderRadius: '4px' }}
          >
            +
          </button>
        </div>
      </td>
      <td style={{ padding: '16px 8px', fontWeight: '600', color: '#111827', verticalAlign: 'middle' }}>
        ${lineTotal}
      </td>
      <td style={{ padding: '16px 8px', verticalAlign: 'middle', textAlign: 'center' }}>
        <button 
          onClick={() => onDelete(item.variantId)}
          style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '16px' }}
          title="Remove item"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
}