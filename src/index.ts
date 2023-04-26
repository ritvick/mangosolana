console.log('Hello world!')


console.log('Hello worldasdasd!')

import { Connection, PublicKey, ConfirmedSignaturesForAddress2Options   } from '@solana/web3.js';

// Set the endpoint for Solana's mainnet-beta network
const endpoint = 'https://api.mainnet-beta.solana.com';

// Set the public key for the Mango program's account
const mangoProgramId = new PublicKey('4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg');


// Create a connection to the Solana mainnet endpoint
const connection = new Connection(endpoint, 'confirmed');



async function  test() {
    const address = new PublicKey('4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg');

    const balance = await connection.getBalance(address)
    console.log('Balance', balance)

    // Define the options for the transaction history query
    const options: ConfirmedSignaturesForAddress2Options = {
        programId: '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg',
        filters: [
        { dataSize: 216 },
        ],
        encoding: 'jsonParsed'
    };
    // Fetch the transaction history for the Mango program account
    const transactionHistory = await connection.getConfirmedSignaturesForAddress2(
        mangoProgramId,
        options
    );
}

test()