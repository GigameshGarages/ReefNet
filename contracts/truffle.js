/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

const HDWalletProvider = require('truffle-hdwallet-provider')
const NonceTrackerSubprovider = require('web3-provider-engine/subproviders/nonce-tracker')
const utils = require('web3-utils')

const MNEMONIC = process.env.MNEMONIC || process.env.NMEMORIC
const rpcHost = process.env.NETWORK_RPC_HOST
const rpcPort = process.env.NETWORK_RPC_PORT
const hdWalletStartIndex = 0
const hdWalletAccounts = 5
let hdWalletProvider

const setupWallet = (
    url
) => {
    if (!hdWalletProvider) {
        hdWalletProvider = new HDWalletProvider(
            MNEMONIC,
            url,
            hdWalletStartIndex,
            hdWalletAccounts)
        hdWalletProvider.engine.addProvider(new NonceTrackerSubprovider())
    }
    return hdWalletProvider
}

module.exports = {
    /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

    networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
        development: {
            host: rpcHost || '127.0.0.1',
            port: rpcPort || 8545,
            // has to be '*' because this is usually ganache
            network_id: '*'
        },
        ganache: {
            host: rpcHost || '127.0.0.1',
            port: rpcPort || 8545,
            // has to be '*' because this is usually ganache
            network_id: '*'
        },
        coverage: {
            host: 'localhost',
            // has to be '*' because this is usually ganache
            network_id: '*',
            port: 8555,
            gas: 0xfffffffffff,
            gasPrice: 0x01
        },
        // nile the ocean beta network
        nile: {
            provider: () => setupWallet('https://nile.dev-ocean.com'),
            network_id: 0x2323, // 8995
            gas: 6000000,
            gasPrice: 10000,
            from: '0x90eE7A30339D05E07d9c6e65747132933ff6e624'
        },
        // mainnet the ethereum mainnet
        mainnet: {
            provider: () => setupWallet(`https://mainnet.infura.io/v3/${process.env.INFURA_TOKEN}`),
            network_id: 0x1, // 1
            from: '0x614E188acBB597C2b2BF0CB39819975b05217C33',
            gas: 7 * 1000000,
            gasPrice: utils.toWei('60', 'gwei')
        },
        // mainnet the ethereum mainnet
        rinkeby: {
            provider: () => setupWallet(`https://rinkeby.infura.io/v3/${process.env.INFURA_TOKEN}`),
            network_id: 0x4,
            from: '0xD6e0F938323A9D9d52b26700716E2e8E027f3795',
            gas: 7 * 1000000,
            gasPrice: utils.toWei('8', 'gwei')
        },
        // pacific the ethereum mainnet
        pacific: {
            provider: () => setupWallet('https://pacific.oceanprotocol.com'),
            network_id: 0xCEA11, // 846353
            from: '0xba3e0ec852dc24ca7f454ea545d40b1462501711',
            gas: 6 * 1000000,
            gasPrice: utils.toWei('10', 'mwei')
        }
    },
    plugins: ['solidity-coverage'],
    // Set default mocha options here, use special reporters etc.
    mocha: {
    // timeout: 100000
    },

    // Configure your compilers
    compilers: {
        solc: {
            version: '0.5.7', // Fetch exact version from solc-bin (default: truffle's version)
            docker: false, // Use "0.5.1" you've installed locally with docker (default: false)
            settings: { // See the solidity docs for advice about optimization and evmVersion
                optimizer: {
                    enabled: true,
                    runs: 200
                },
                evmVersion: 'byzantium'
            }
        }
    }
}
