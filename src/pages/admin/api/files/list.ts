import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const directory = searchParams.get('directory') || 'images';
    
    const targetDir = path.join(process.cwd(), 'public', directory);

    // Security check: Ensure targetDir is within public directory
    const publicRoot = path.join(process.cwd(), 'public');
    const resolvedTargetDir = path.resolve(targetDir);
    const resolvedPublicRoot = path.resolve(publicRoot);

    if (!resolvedTargetDir.startsWith(resolvedPublicRoot)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid directory path'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    try {
      const files = await fs.readdir(targetDir);
      const fileList = [];
      
      for (const file of files) {
        const filePath = path.join(targetDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isFile()) {
          const extension = path.extname(file).toLowerCase();
          const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(extension);
          
          fileList.push({
            name: file,
            path: `/${directory}/${file}`,
            url: `/${directory}/${file}`,
            size: stats.size,
            type: isImage ? 'image' : 'file',
            uploadedAt: stats.birthtime,
            modifiedAt: stats.mtime
          });
        }
      }
      
      // Sort by upload date (newest first)
      fileList.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
      
      return new Response(JSON.stringify({
        success: true,
        data: {
          files: fileList,
          directory,
          total: fileList.length
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (dirError) {
      // Directory doesn't exist, return empty list
      return new Response(JSON.stringify({
        success: true,
        data: {
          files: [],
          directory,
          total: 0
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to list files'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};