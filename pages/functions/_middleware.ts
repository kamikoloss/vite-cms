import cloudflareAccessPlugin from '@cloudflare/pages-plugin-cloudflare-access';
import { Env } from './interfaces';

export const onRequest: PagesFunction<Env>[] = [
  // Cloudflare Access の JWT を検証する
  // ref. https://developers.cloudflare.com/pages/functions/plugins/cloudflare-access/
  (context) => {
    return cloudflareAccessPlugin({
      domain: context.env.ACCESS_DOMAIN,
      aud: context.env.ACCESS_AUD,
    })(context);
  },
];
