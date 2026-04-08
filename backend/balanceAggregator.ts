import { processSeed } from './seedProcessor';
import { getEvmBalances } from './chains/evm';
import { getBitcoinBalance } from './chains/btc';
import { getLitecoinBalance } from './chains/ltc';
import { getSolanaBalance } from './chains/sol';
import { getTronBalance } from './chains/tron';
import { getRippleBalance } from './chains/xrp';

import { BIP32Interface } from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import TronWeb from 'tronweb';
import { deriveAddress, deriveKeypair } from 'xrpl-accountlib';
import { Keypair } from '@solana/web3.js';
import { ethers } from 'ethers';

// Helper for derivation
const derive = (root: BIP32Interface, path: string) => root.derivePath(path);

// Timeout wrapper
function withTimeout(promise: Promise<any>, ms: number) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            // Reject with a custom error, or just a generic one
            reject(new Error('Promise timed out'));
        }, ms);

        promise.then(
            (res) => {
                clearTimeout(timer);
                resolve(res);
            },
            (err) => {
                clearTimeout(timer);
                reject(err);
            }
        );
    });
}


export async function getBalances(mnemonic: string) {
    const root = processSeed(mnemonic);

    // --- Address Derivation ---
    const ethNode = derive(root, "m/44'/60'/0'/0/0");
    const ethAddress = ethers.computeAddress(ethNode.publicKey);

    const btcNode = derive(root, "m/84'/0'/0'/0/0");
    const btcAddress = bitcoin.payments.p2wpkh({ pubkey: btcNode.publicKey }).address!;

    const litecoinNetwork = {
        messagePrefix: '\x19Litecoin Signed Message:\n',
        bech32: 'ltc',
        bip32: { public: 0x019da462, private: 0x019d9cfe },
        pubKeyHash: 0x30,
        scriptHash: 0x32,
        wif: 0xb0,
    };
    const ltcNode = derive(root, "m/84'/2'/0'/0/0");
    const ltcAddress = bitcoin.payments.p2wpkh({ pubkey: ltcNode.publicKey, network: litecoinNetwork }).address!;

    const solNode = derive(root, "m/44'/501'/0'/0'");
    const solKeyPair = Keypair.fromSeed(solNode.privateKey!);
    const solAddress = solKeyPair.publicKey.toBase58();

    const tronNode = derive(root, "m/44'/195'/0'/0/0");
    const tronAddress = (new TronWeb({fullHost: 'https://api.trongrid.io'})).address.fromPrivateKey(tronNode.privateKey!.toString('hex'));

    const xrpNode = derive(root, "m/44'/144'/0'/0/0");
    const xrpKeyPair = deriveKeypair(xrpNode.privateKey!.toString('hex'));
    const xrpAddress = deriveAddress(xrpKeyPair.publicKey);
    
    // --- Balance Fetching ---
    const timeout = 5000;

    const promises = [
        withTimeout(getEvmBalances(ethAddress), timeout).catch(() => ({ ethereum: 0, bnb: 0, polygon: 0, usdt: 0, usdc: 0 })),
        withTimeout(getBitcoinBalance(btcAddress), timeout).catch(() => 0),
        withTimeout(getSolanaBalance(solAddress), timeout).catch(() => 0),
        withTimeout(getTronBalance(tronAddress), timeout).catch(() => 0),
        withTimeout(getRippleBalance(xrpAddress), timeout).catch(() => 0),
        withTimeout(getLitecoinBalance(ltcAddress), timeout).catch(() => 0)
    ];

    const [
        evmResults,
        btcBalance,
        solBalance,
        tronBalance,
        xrpBalance,
        ltcBalance
    ] = await Promise.all(promises);

    return {
        bitcoin: btcBalance,
        ethereum: evmResults.ethereum,
        solana: solBalance,
        bnb: evmResults.bnb,
        tron: tronBalance,
        ripple: xrpBalance,
        litecoin: ltcBalance,
        polygon: evmResults.polygon,
        usdt: evmResults.usdt,
        usdc: evmResults.usdc
    };
}
