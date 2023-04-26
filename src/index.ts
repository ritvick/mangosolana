
import { Connection, PublicKey, ConfirmedSignaturesForAddress2Options   } from '@solana/web3.js';
import * as anchor from "@project-serum/anchor";
import {BorshCoder, EventParser, Program, web3} from "@project-serum/anchor";
import BN from 'bn.js';

import { readFileSync } from 'fs';
// Set the endpoint for Solana's mainnet-beta network
const CLUSTER_URL = 'https://api.mainnet-beta.solana.com';

const mango_account_address = '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg'

type ObjectWithBNKeys<T> = {
    [K in keyof T]: T[K] extends BN ? string | number : T[K];
  };
  
  function convertBNKeysToNative<T extends Record<string, unknown>>(obj: T): ObjectWithBNKeys<T> {
    const newObj = {} as ObjectWithBNKeys<T>;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (value instanceof BN) {
          // Convert the BN.js object to a native number or string
          newObj[key as keyof T] = value.toString() as ObjectWithBNKeys<T>[keyof T];
          // Type assertion here ----^
        } else {
          // Keep the original value
          newObj[key as keyof T] = value as ObjectWithBNKeys<T>[keyof T];
        }
      }
    }
    return newObj;
}

async function  test() {
    const connection = new Connection(CLUSTER_URL);
    
    const mango_account_publicKey = new PublicKey(mango_account_address);

    const balance = await connection.getBalance(mango_account_publicKey)
    console.log('Balance', balance)

    let transactionList = await connection.getConfirmedSignaturesForAddress2(mango_account_publicKey, {limit:100});

    console.log('Got transactions = ', transactionList.length)
    let signatureList = transactionList.map(transaction=>transaction.signature);
    let transactionDetails = await connection.getParsedTransactions(signatureList, {maxSupportedTransactionVersion:0});

    for(let transaction of transactionDetails) {
        const transaction = transactionDetails[0]
        const idl_file = await readFileSync('./src/mango_v4.json', 'utf-8');
        const idl = JSON.parse(idl_file)
    
        const eventParser = new EventParser(mango_account_publicKey, new BorshCoder(idl))
    
        if(transaction?.meta?.logMessages?.length) {
            const events = eventParser.parseLogs(transaction?.meta?.logMessages)
            for (let event of events) {
                console.log(event.name);
                console.log(convertBNKeysToNative(event.data))
            }
        }
    }

    
    //console.log(Program.programId)
    //const mangoClient = new MangoClient(new Connection(CLUSTER_URL), MANGO_PROGRAM_ID, 'mainnet-beta');

}

test()