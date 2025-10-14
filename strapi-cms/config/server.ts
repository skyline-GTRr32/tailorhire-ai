export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  // Allow Railway host for development mode
  allowedHosts: [
    'localhost',
    '127.0.0.1',
    'unique-solace-production.up.railway.app',
    env('RAILWAY_PUBLIC_DOMAIN', ''),
  ].filter(Boolean),
});
