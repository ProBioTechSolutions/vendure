import {
    CancelPaymentResult,
    CancelPaymentErrorResult,
    PaymentMethodHandler,
    VendureConfig,
    CreatePaymentResult,
    SettlePaymentResult,
    SettlePaymentErrorResult,
    LanguageCode
} from '@vendure/core';
import { sdk } from './tpay-sdk';

/**
 * This is a handler which integrates Vendure with an imaginary
 * payment provider, who provide a Node SDK which we use to
 * interact with their APIs.
 */
export const tpayPaymentHandler = new PaymentMethodHandler({
    code: 'tpay-payment',
    description: [{
        languageCode: LanguageCode.pl,
        value: 'Tpay Provider',
    }],
    args: {
    },

    /** This is called when the `addPaymentToOrder` mutation is executed */
    createPayment: async (ctx, order, amount, args, metadata): Promise<CreatePaymentResult> => {
        try {
            const result = await sdk.createPayment(
                amount,
                metadata.description,
                metadata.crc,
                metadata.email,
                metadata.name,
                metadata.returnUrl,
        );
        console.log(result)
        return {
            amount: order.totalWithTax,
            state: 'Authorized' as const,
            transactionId: result.title,
            metadata: {
                //cardInfo: result.cardInfo,
                // Any metadata in the `public` field
                // will be available in the Shop API,
                // All other metadata is private and
                // only available in the Admin API.
                public: {
                    referenceCode: result.transactionPaymentUrl,
                }
            },
        };
        } catch (err) {
            return {
                amount: order.total,
                state: 'Declined' as const,
                metadata: {
                    errorMessage: err.message,
                },
            };
        }
    },

    /** This is called when the `settlePayment` mutation is executed */
    settlePayment: async (ctx, order, payment, args): Promise<SettlePaymentResult | SettlePaymentErrorResult> => {
        return {
            success: true,
        }
    },

    /** This is called when a payment is cancelled. */
    cancelPayment: async (ctx, order, payment, args): Promise<CancelPaymentResult | CancelPaymentErrorResult> => {
        return {
            success: true,
        }
    },
});
