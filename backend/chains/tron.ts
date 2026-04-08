import TronWeb from 'tronweb';

let tronWeb: any;

try {
    tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
    });
} catch (e) {
    console.error("Failed to initialize TronWeb", e)
}


export async function getTronBalance(address: string): Promise<number> {
    if (!tronWeb) {
        console.error("TronWeb not initialized");
        return 0;
    }
    try {
        const balance = await tronWeb.trx.getBalance(address);
        return tronWeb.fromSun(balance);
    } catch (error) {
        console.error(`Error getting Tron balance for ${address}:`, error);
        return 0;
    }
}
