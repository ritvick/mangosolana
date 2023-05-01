
import { Connection, PublicKey, ParsedTransactionWithMeta    } from '@solana/web3.js';
import {BorshCoder, EventParser} from "@project-serum/anchor";
import { convertBNKeysToNative } from './util/bnUtil';
import { readFileSync } from 'fs';
import MangoEvent from "./models/MangoEvent"
import { connect as dbConnect } from './util/database';

const delay = require('delay');

// Set the endpoint for Solana's mainnet-beta network
const CLUSTER_URL = 'https://api.mainnet-beta.solana.com';

const MANGO_ACCOUNT_ADDRESS = '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg'

const MANGO_ACCOUNT_PUBLICKEY = new PublicKey(MANGO_ACCOUNT_ADDRESS);


async function processTransactionsWithMeta(transactionsWithMeta: Array<ParsedTransactionWithMeta | null>, idl: any, db:any) {
    for(let transactionWithMeta of transactionsWithMeta) {
    
        const eventParser = new EventParser(MANGO_ACCOUNT_PUBLICKEY, new BorshCoder(idl))
    
        if(transactionWithMeta?.meta?.logMessages?.length) {
            const events = eventParser.parseLogs(transactionWithMeta?.meta?.logMessages)
            for (let event of events) {
                console.log('Transacton Signature', transactionWithMeta.transaction.signatures[0])
                console.log('Block Time', transactionWithMeta.blockTime)
                console.log('Event Name', event.name);
                console.log('Event Data', convertBNKeysToNative(event.data))

                const eventRecord = new MangoEvent({
                    transactionSignature: transactionWithMeta.transaction.signatures[0],
                    eventName: event.name,
                    blockTime: transactionWithMeta.blockTime,
                    eventData: convertBNKeysToNative(event.data)
                })

                const result = await eventRecord.save();
                console.log('result', result)
            }

        }
    }
}
async function  getLatestTransaction(connection: Connection, idl: any, db:any) {


    let transactionList = await connection.getConfirmedSignaturesForAddress2(MANGO_ACCOUNT_PUBLICKEY, {limit:100});

    console.log('Got transactions latest slot = ', transactionList[0].slot, ' and oldest slot = ', transactionList[transactionList.length - 1].slot)
    let signatureList = transactionList.map(transaction=>transaction.signature);
    let transactionsWithMeta = await connection.getParsedTransactions(signatureList, {maxSupportedTransactionVersion:0});

    await processTransactionsWithMeta(transactionsWithMeta, idl, db)

    const lastProcessedSignature = transactionList[0].signature;
    
    return lastProcessedSignature;
}

async function main() {
    console.log('Connecting to database....');
    const db = await dbConnect();
    console.log('Database Connected');
    const connection = new Connection(CLUSTER_URL, {disableRetryOnRateLimit: true});
    
    
    const balance = await connection.getBalance(MANGO_ACCOUNT_PUBLICKEY)
    console.log('Balance', balance)

    const idl_file = await readFileSync('./src/mango_v4.json', 'utf-8');
    const idl = JSON.parse(idl_file)
    const eventTypes = idl.events.map(event=>event.name)
    console.log('Events', eventTypes)
    let delayTime = 1000
    while(true) {
        await delay(delayTime)
        try{
            await getLatestTransaction(connection, idl, db)
            delayTime = 1000
        }catch(e) {
            delayTime = delayTime * 2
            console.log('Will try after delay ', delayTime)
        }

    }
}


main()