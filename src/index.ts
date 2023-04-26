
import { Connection, PublicKey, ParsedTransactionWithMeta    } from '@solana/web3.js';
import * as anchor from "@project-serum/anchor";
import {BorshCoder, EventParser, Program, web3} from "@project-serum/anchor";
import { convertBNKeysToNative } from './util/bnUtil';

import { readFileSync } from 'fs';
const delay = require('delay');
// Set the endpoint for Solana's mainnet-beta network
const CLUSTER_URL = 'https://api.mainnet-beta.solana.com';

const mango_account_address = '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg'

const MANGO_ACCOUNT_PUBLICKEY = new PublicKey(mango_account_address);


async function processTransactionsWithMeta(transactionsWithMeta: Array<ParsedTransactionWithMeta | null>) {
    for(let transactionWithMeta of transactionsWithMeta) {

        const idl_file = await readFileSync('./src/mango_v4.json', 'utf-8');
        const idl = JSON.parse(idl_file)
    
        const eventParser = new EventParser(MANGO_ACCOUNT_PUBLICKEY, new BorshCoder(idl))
    
        if(transactionWithMeta?.meta?.logMessages?.length) {
            const events = eventParser.parseLogs(transactionWithMeta?.meta?.logMessages)
            for (let event of events) {
                // console.log('Transacton Signature', transactionWithMeta.transaction.signatures[0])
                // console.log('Block Time', transactionWithMeta.blockTime)
                // console.log('Event Name', event.name);
                // console.log('Event Data', convertBNKeysToNative(event.data))
            }
        }
    }
}
async function  getLatestTransaction(connection: Connection) {


    let transactionList = await connection.getConfirmedSignaturesForAddress2(MANGO_ACCOUNT_PUBLICKEY, {limit:100});

    console.log('Got transactions latest slot = ', transactionList[0].signature, ' and oldest slot = ', transactionList[transactionList.length - 1].signature)
    let signatureList = transactionList.map(transaction=>transaction.signature);
    let transactionsWithMeta = await connection.getParsedTransactions(signatureList, {maxSupportedTransactionVersion:0});

    await processTransactionsWithMeta(transactionsWithMeta)

    const lastProcessedSignature = transactionList[0].signature;
    
    return lastProcessedSignature;
}

async function main() {
    const connection = new Connection(CLUSTER_URL, {disableRetryOnRateLimit: true});
    
    
    const balance = await connection.getBalance(MANGO_ACCOUNT_PUBLICKEY)
    console.log('Balance', balance)
    let delayTime = 1000
    while(true) {
        await delay(delayTime)
        try{
            await getLatestTransaction(connection)
            delayTime = 1000
        }catch(e) {
            delayTime = delayTime * 2
            console.log('Will try after delay ', delayTime)
        }
    
    }

}

main()