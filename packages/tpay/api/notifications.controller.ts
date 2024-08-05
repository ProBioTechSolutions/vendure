// notifications.controller.ts
import { Controller, Post, HttpStatus, Res } from '@nestjs/common';
import { Ctx, PaymentService, RequestContext } from '@vendure/core';
import { TpayNotification } from "./tpay.notification"
import { Response } from 'express';
import { validateJwsSignature } from "./jws.api"


@Controller('notifications')
export class NotificationsController {
    constructor(private paymentService: PaymentService) {
    }

    @Post()
    processNotification(@Ctx() ctx: RequestContext, @Res({ passthrough: true }) res: Response) {
        let notification = new TpayNotification(ctx);
        /*validateJwsSignature(ctx.req)
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
        });*/
        console.log(ctx.req?.body)
        if (notification.md5sum === notification.calculateMd5()){
            res.status(HttpStatus.OK)
            res.send(Buffer.from("TRUE"))
        }
    }
}
