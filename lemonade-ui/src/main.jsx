import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'; // 👈 Added HttpLink here
import { ApolloProvider } from '@apollo/client/react';

// Explicitly define the network link to your .NET backend portal
const link = new HttpLink({
  uri: 'https://orange-space-fortnight-p77j47w46g7f77r6-5070.app.github.dev/graphql', // 👈 Paste your exact copied 5070 link here
});
const client = new ApolloClient({
  link: link, // 👈 Provide the link object explicitly here
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)