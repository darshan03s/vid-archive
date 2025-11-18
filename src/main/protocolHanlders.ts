import { protocol } from 'electron';
import { readFile } from 'node:fs/promises';
import mime from 'mime-types';

async function registerProtocolHandlers() {
  protocol.handle('media', async (req) => {
    const urlPath = req.url.replace('media:///', '');
    const filePath = decodeURIComponent(urlPath);
    const data = await readFile(filePath);
    return new Response(data, {
      headers: {
        'Content-Type': mime.lookup(filePath) || 'application/octet-stream'
      }
    });
  });
}

export default registerProtocolHandlers;
