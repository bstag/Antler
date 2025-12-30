import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { logger } from '../../../../../lib/utils/logger';
import { resolveSafePath, validateCollection } from '../../../../../lib/file-security';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { collection, id } = params;

  if (!collection || !id) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Collection and id parameters required' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    validateCollection(collection);

    // We can't rely solely on getEntry for file reading because it returns processed data.
    // We want raw content for the editor.
    // However, we should check if entry exists via getEntry first?
    // getEntry is safe, but we also read the file manually.

    const entry = await getEntry(collection as any, id) as any;
    
    if (!entry) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Content not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Read the raw markdown file to get the content
    const contentRoot = path.join(process.cwd(), 'src', 'content');
    const filePath = resolveSafePath(contentRoot, path.join(collection, `${id}.md`));

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    return new Response(JSON.stringify({
      success: true,
      data: {
        id: entry?.slug || id,
        collection,
        title: entry?.data?.title || entry?.slug || id,
        filePath: `src/content/${collection}/${id}.md`,
        frontmatter,
        content,
        createdAt: entry?.data?.publicationDate || entry?.data?.createdAt || new Date(),
        updatedAt: new Date()
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('Access denied') || errorMessage.includes('Invalid collection')) {
         return new Response(JSON.stringify({
            success: false,
            error: 'Invalid path or collection'
        }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch content'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  const { collection, id } = params;

  if (!collection || !id) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Collection and id parameters required'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    validateCollection(collection);

    const body = await request.json();
    const { frontmatter, content } = body;

    // Create markdown content with frontmatter
    const fileContent = matter.stringify(content || '', frontmatter);

    const contentRoot = path.join(process.cwd(), 'src', 'content');
    const filePath = resolveSafePath(contentRoot, path.join(collection, `${id}.md`));

    // Write file to disk
    await fs.writeFile(filePath, fileContent, 'utf-8');

    return new Response(JSON.stringify({
      success: true,
      data: {
        id,
        filePath: `src/content/${collection}/${id}.md`
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    logger.error('PUT error:', error);

    const errorMessage = (error as Error).message;
    if (errorMessage.includes('Access denied') || errorMessage.includes('Invalid collection')) {
         return new Response(JSON.stringify({
            success: false,
            error: 'Invalid path or collection'
        }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to update content'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
