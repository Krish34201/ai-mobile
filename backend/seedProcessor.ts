import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';

const bip32Factory = BIP32Factory(ecc);

export function processSeed(mnemonic: string) {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid seed phrase');
  }
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32Factory.fromSeed(seed);
  return root;
}
