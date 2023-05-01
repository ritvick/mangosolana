# Mango Events Parser

This is a Node TypeScript repository for parsing Mango events from transactions on Solana mainnet using the Mango program account ID: **_4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg_**.

### Installation

    git clone https://github.com/ritvick/mangosolana.git

### Usage

    docker-compose -f docker-compose.development.yml up

This will bring the docker up and program will do the following:

- The application will establish a connection to Solana mainnet via an RPC endpoint.
- The application will query transactions from Mango's program account and try to decode and parse for any available Mango events in each transaction's logs.
- If an event is found, the parsed data along with the transaction signature and block time will be logged to the console.

### Output

#### Sample snippet of parsed event

    Transacton Signature 2YHHuVRzLot3aSBpamYMVFUXqqmM8uQ6AEEhaYf74SpWnHFPN8C7RZmwc9j1N482gEY2Rf6J1qQ4Gmz5ywPacF2E
    event {
      data: {
        mangoGroup: PublicKey [PublicKey(78b8f4cGCwmZ9ysPFMWLaLTkkaYnUjwMJYStWe5RTSSX)] {
          _bn: <BN: 5b17c7c86a6e739faf1751818363e94f908bf37004ce6d3fbcf197bdd2f51f1c>
        },
        tokenIndex: 455,
        depositIndex: <BN: f4240000000000000>,
        borrowIndex: <BN: f4241f26d7c543a6c>,
        avgUtilization: <BN: 0>,
        price: <BN: 69facd4ee21>,
        stablePrice: <BN: 69facd4ee21>,
        collectedFees: <BN: 0>,
        loanFeeRate: <BN: 147ae147ae1>,
        totalBorrows: <BN: 0>,
        totalDeposits: <BN: bbd62a980000000000000>,
        borrowRate: <BN: 0>,
        depositRate: <BN: 0>
      },
      name: 'UpdateIndexLog'
    }
