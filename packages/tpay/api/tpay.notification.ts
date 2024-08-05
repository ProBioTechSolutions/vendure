import { RequestContext } from "@vendure/core"
import {Md5} from 'ts-md5';
import 'dotenv/config';
import { validateJwsSignature } from "./jws.api"

export class TpayNotification {
    id: string;
    tr_id: string;
    tr_date: string;
    tr_crc: string;
    tr_amount: string;
    tr_paid: string;
    tr_desc: string;
    tr_status: string;
    tr_error: string;
    tr_email: string;
    md5sum: string;
    constructor(private ctx: RequestContext) {
        const body = this.ctx.req?.res?.req.body;
        this.id = body['id'],
        this.tr_id = body['tr_id'],
        this.tr_date = body['tr_date'],
        this.tr_crc = body['tr_crc'],
        this.tr_amount = body['tr_amount'],
        this.tr_paid = body['tr_paid'],
        this.tr_desc = body['tr_desc'],
        this.tr_status = body['tr_status'],
        this.tr_error = body['tr_error'],
        this.tr_email = body['tr_email'],
        this.md5sum = body['md5sum']
    }

    public validateJws(req: Request){
        validateJwsSignature(req)
        .then((isValid) => {
            if (isValid) {
            console.log('TRUE');
            // Process request data and send valid response
            } else {
            console.error('Invalid JWS signature');
            // Handle invalid signature error
            }
        })
        .catch((error) => {
            console.error(error.message);
        });
    }

    public calculateMd5() {
        return (Md5.hashStr(
            process.env.PUBLIC_TPAY_ID +
            this.tr_id +
            this.tr_amount +
            this.tr_crc +
            process.env.PUBLIC_TPAY_SECURITY_CODE
        ))
    }
}