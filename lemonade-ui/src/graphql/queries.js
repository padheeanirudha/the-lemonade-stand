import { gql } from '@apollo/client';

// Dynamic pull for varieties and active pricing structures
export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      variants {
        id
        sizeName
        price
      }
    }
  }
`;

// Secure customer checkout order processor
export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      orderNumber
      success
      message
    }
  }
`;