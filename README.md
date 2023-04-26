# Mango Events Parser

This is a Node TypeScript repository for parsing Mango events from transactions on Solana mainnet using the Mango program account ID: ***4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg***.

### Installation
```
git clone https://github.com/ritvick/mangosolana.git
```

### Usage
```
docker-compose -f docker-compose.development.yml up
```

This will bring the docker up and program will do the following:
- The application will establish a connection to Solana mainnet via an RPC endpoint.
- The application will query transactions from Mango's program account and try to decode and parse for any available Mango events in each transaction's logs.
- If an event is found, the parsed data along with the transaction signature and block time will be logged to the console.
