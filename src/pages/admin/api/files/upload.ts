import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const prerender = false;

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

    // Generate unique filename
    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const baseName = path.basename(file.name, extension).replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const filename = `${baseName}-${timestamp}${extension}`;

    // Create directory path
    const uploadDir = path.join(process.cwd(), 'public', directory);
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