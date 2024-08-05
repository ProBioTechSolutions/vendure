import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';

import { PAYMENT_PLUGIN_OPTIONS } from './constants';
import { PluginInitOptions } from './types';

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3004;

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [{ provide: PAYMENT_PLUGIN_OPTIONS, useFactory: () => PaymentPlugin.options }],
    configuration: config => {
        // Plugin-specific configuration
        // such as custom fields, custom permissions,
        // strategies etc. can be configured here by
        // modifying the `config` object.
        return config;
    },
    compatibility: '^2.0.0',
})
export class PaymentPlugin {
    static options: PluginInitOptions;

    static init(options: PluginInitOptions): Type<PaymentPlugin> {
        this.options = options;
        return PaymentPlugin;
    }
}
