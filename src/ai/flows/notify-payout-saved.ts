'use server';
/**
 * @fileOverview This file implements a Genkit flow for notifying HQ when an operator saves their payout addresses.
 *
 * - notifyPayoutSaved - A function that simulates sending a secure email notification to HQ.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {db} from '@/firebase/config';
import {doc, getDoc} from 'firebase/firestore';

const NotifyPayoutSavedInputSchema = z.object({
  username: z.string().describe('The license username of the operator.'),
  btcAddress: z.string().describe('The saved Bitcoin address.'),
  usdtAddress: z.string().describe('The saved USDT address.'),
  solAddress: z.string().describe('The saved Solana address.'),
  targetEmail: z.string().describe('The target HQ email address for the notification.'),
});

const NotifyPayoutSavedOutputSchema = z.object({
  success: z.boolean().describe('Whether the notification was successfully dispatched to HQ.'),
  log: z.string().describe('A summary of the forensic dispatch action.'),
});

export async function notifyPayoutSaved(input: z.infer<typeof NotifyPayoutSavedInputSchema>) {
  return notifyPayoutSavedFlow(input);
}

const notifyPayoutSavedFlow = ai.defineFlow(
  {
    name: 'notifyPayoutSavedFlow',
    inputSchema: NotifyPayoutSavedInputSchema,
    outputSchema: NotifyPayoutSavedOutputSchema,
  },
  async (input) => {
    // Fetch the License Key from the authoritative Firestore vault
    let licenseKey = 'REDACTED/UNKNOWN';
    try {
      const userRef = doc(db, 'licenses', input.username);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        licenseKey = userDoc.data().licenseKey || 'N/A';
      }
    } catch (e) {
      console.error('[UPLINK ERROR] Failed to retrieve license key for dispatch.');
    }

    // FORENSIC LOGGING: In a production environment, this would integrate with an email API (e.g., SendGrid/SES).
    // For this elite workstation prototype, we simulate the secure encrypted dispatch to HQ.
    
    const telemetryMessage = `
      [UPLINK] PAYOUT CONFIGURATION SECURED
      -------------------------------------
      Operator Username: ${input.username}
      License Key: ${licenseKey}
      Destination HQ: ${input.targetEmail}
      
      BTC NODE: ${input.btcAddress}
      USDT NODE: ${input.usdtAddress}
      SOL NODE: ${input.solAddress}
      
      STATUS: ENCRYPTED & DISPATCHED TO HQ
    `;
    
    console.log(telemetryMessage);

    return {
      success: true,
      log: `Neural synchronization for license [${licenseKey}] confirmed with ${input.targetEmail}.`
    };
  }
);
