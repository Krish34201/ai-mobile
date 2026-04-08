import { Client } from 'xrpl';

const RPC_URL = 'wss://s1.ripple.com';

export async function getRippleBalance(address: string): Promise<number> {
    const client = new Client(RPC_URL);
    try {
        await client.connect();
        const response = await client.request({
            command: 'account_info',
            account: address,
            ledger_index: 'validated'
        });
        const balance = (response.result.account_data as any).Balance;
        return parseInt(balance) / 1_000_000; // Convert drops to XRP
    } catch (error: any) {
        // account_not_found is a common error for new wallets
        if (error.data?.error === 'actNotFound' || error.name === 'NotFoundError') {
            return 0;
        }
        console.error(`Error getting Ripple balance for ${address}:`, error);
        return 0;
    } finally {
        if (client.isConnected()) {
            await client.disconnect();
        }
    }
}
