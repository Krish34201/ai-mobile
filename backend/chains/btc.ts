import axios from 'axios';

const API_URL = 'https://blockstream.info/api/address/';

export async function getBitcoinBalance(address: string): Promise<number> {
    try {
        const response = await axios.get(`${API_URL}${address}`, { timeout: 5000 });
        const { chain_stats } = response.data;
        const confirmedBalance = chain_stats.funded_txo_sum - chain_stats.spent_txo_sum;
        return confirmedBalance / 1e8; // Convert satoshis to BTC
    } catch (error) {
        if (axios.isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 404)) {
            return 0;
        }
        console.error(`Error getting Bitcoin balance for ${address}:`, error);
        return 0;
    }
}
