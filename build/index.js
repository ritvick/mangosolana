"use strict";
console.log('Hello world!');

import { Connection } from '@solana/web3.js';

const endpoint = 'https://api.mainnet-beta.solana.com';

// Create a connection to the Solana mainnet endpoint
const connection = new Connection(endpoint, 'confirmed');

// Check if the connection is successful
connection.getBalance("5ZFarHkQsXCsxZmprr4VTr6L87mYAcmsw4eQzCubTb9U").then((balance) => {
  console.log(`Balance: ${balance}`);
}).catch((err) => {
  console.error(err);
});

