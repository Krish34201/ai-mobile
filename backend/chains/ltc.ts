import axios from 'axios';

const API_URL = 'https://api.blockcypher.com/v1/ltc/main/addrs/';

export async function getLitecoinBalance(address: string): Promise<number> {
    try {
        const response = await axios.get(`${API_URL}${address}/balance`, { timeout: 5000 });
        const balance = response.data.balance;
        return balance / 1e8; // Convert litoshis to LTC
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return 0;
        }
        console.error(`Error getting Litecoin balance for ${address}:`, error);
        return 0;
    }
}
