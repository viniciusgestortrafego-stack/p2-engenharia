'use strict';

const express = require('express');
const path = require('path');

const app = express();
const publicDirectory = path.join(__dirname, 'public');
const port = Number.parseInt(process.env.PORT || '3000', 10);
const canonicalHost = process.env.CANONICAL_HOST || 'p2engenhariaeavaliacoes.com.br';
const isProduction = process.env.NODE_ENV === 'production';

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use((request, response, next) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'SAMEORIGIN');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (isProduction) {
    const forwardedProtocol = request.get('x-forwarded-proto');
    if (forwardedProtocol && forwardedProtocol !== 'https') {
      return response.redirect(301, `https://${canonicalHost}${request.originalUrl}`);
    }

    if (request.hostname === `www.${canonicalHost}`) {
      return response.redirect(301, `https://${canonicalHost}${request.originalUrl}`);
    }
  }

  next();
});

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok', service: 'p2-engenharia' });
});

app.use(express.static(publicDirectory, {
  etag: true,
  maxAge: isProduction ? '7d' : 0,
  index: 'index.html',
  setHeaders(response, filePath) {
    if (filePath.endsWith('.html')) {
      response.setHeader('Cache-Control', 'no-cache');
    } else if (/\.(?:jpg|jpeg|png|webp|mp4)$/i.test(filePath)) {
      response.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
    }
  }
}));

app.get('*', (_request, response) => {
  response.sendFile(path.join(publicDirectory, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`P2 Engenharia disponível na porta ${port}`);
});
