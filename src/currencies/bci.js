import axios from 'axios';
import base58check from '../base58check';

export async function getBalance(addr) {
  try {
    const { data: { balanceSat } } = await axios.get(
      `https://explorer.bitcoininterest.io/api/addr/${addr}/?noTxList=1`
    );
    return balanceSat;
  } catch (e) {
    throw new Error(e);
  }
}

export function convertAddr(add) {
  var decoded = base58check.decode(add, 'hex');
  if (decoded.prefix === '00') {
    // 1: dec: 0 hex: 00
    console.log('Pay-to-PubkeyHash Bitcoin to Bitcoin Interest');
    return base58check.encode(decoded.data, '66');
  } else if (decoded.prefix === '05') {
    // 5: dec: 5 hex: 05
    console.log('Pay-to-Script-Hash Bitcoin to Bitcoin Interest');
    return base58check.encode(decoded.data, '17');
  } else if (decoded.prefix === '17') {
    // A: dec: 23 hex: 17
    console.log('Pay-to-Script-Hash Bitcoin Interest to Bitcoin');
    return base58check.encode(decoded.data, '05');
  } else if (decoded.prefix === '66') {
    // i: dec: 102 hex: 66
    console.log('Pay-to-PubkeyHash Bitcoin Interest to Bitcoin');
    return base58check.encode(decoded.data, '00');
  }
}

export function getBlockExplorerLink(addr) {
  return `https://explorer.bitcoininterest.io/address/${addr}`;
}

export const ticker = 'bci';
export const cmcName = 'bitcoin-interest';
