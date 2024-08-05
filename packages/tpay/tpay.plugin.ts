import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';

import { TPAY_PLUGIN_OPTIONS } from './constants';
import { PluginInitOptions } from './types';
import { NotificationsController } from './api/notifications.controller';


@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [NotificationsController],
    providers: [{ provide: TPAY_PLUGIN_OPTIONS, useFactory: () => TpayPlugin.options }],
    configuration: config => {
        // Plugin-specific configuration
        // such as custom fields, custom permissions,
        // strategies etc. can be configured here by
        // modifying the `config` object.
        return config;
    },
    compatibility: '^3.0.0',
})
export class TpayPlugin {
    static options: PluginInitOptions;

    static init(options: PluginInitOptions): Type<TpayPlugin> {
        this.options = options;
        return TpayPlugin;
    }
}
