import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { resolveSafePath } from '../../../../lib/file-security';

export const prerender = false;

// Security: Validate file extension matches the declared MIME type
// This prevents uploading 'malicious.php' as 'image/png'
const MIME_TYPE_EXTENSIONS: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/jpg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const directory = formData.get('directory') as string || 'images';

    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No file provided'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file type (images only for now)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid file type. Only images are allowed.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const originalExtension = path.extname(file.name).toLowerCase();
    const allowedExtensions = MIME_TYPE_EXTENSIONS[file.type] || [];

    if (!allowedExtensions.includes(originalExtension)) {
      return new Response(JSON.stringify({
        success: false,
        error: `Invalid file extension for type ${file.type}. Allowed: ${allowedExtensions.join(', ')}`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = originalExtension;
    const baseName = path.basename(file.name, extension).replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const filename = `${baseName}-${timestamp}${extension}`;

    // Create directory path safely
    let uploadDir;
    try {
      const rootDir = path.join(process.cwd(), 'public');
      uploadDir = resolveSafePath(rootDir, directory);
    } catch (e) {
      console.error('Directory path resolution error:', e);
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid directory path'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await fs.mkdir(uploadDir, { recursive: true });

    // Save file
    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Return file info
    const publicPath = `/${directory}/${filename}`;
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        path: publicPath,
        url: publicPath,
        filename,
        size: file.size,
        type: file.type
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to upload file'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
