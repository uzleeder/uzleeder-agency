// Modern Netlify Functions preserve the platform-provided strong-consistency Blobs context.
import adapt from './vercel-adapter.js';
export default function webAdapter(apiHandler) {
  const handler = adapt(apiHandler, { legacy: false });
  return async (request, context) => {
    const url = new URL(request.url);
    const headers = Object.fromEntries(request.headers);
    if (context.ip) headers['x-nf-client-connection-ip'] = context.ip;
    const result = await handler({
      httpMethod: request.method, headers, rawUrl: request.url, path: url.pathname,
      queryStringParameters: Object.fromEntries(url.searchParams),
      body: ['GET', 'HEAD'].includes(request.method) ? '' : await request.text(),
      isBase64Encoded: false,
    }, context);
    const body = [204, 304].includes(result.statusCode) || request.method === 'HEAD' ? null
      : result.isBase64Encoded ? Buffer.from(result.body, 'base64') : result.body;
    return new Response(body, { status: result.statusCode, headers: result.headers });
  };
}
