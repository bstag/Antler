import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { generateSlug } from '../../../../lib/utils/slug';
import { resolveSafePath, validateCollection } from '../../../../lib/file-security';

export const prerender = false;

export const GET: APIRoute = async ({ params, url }) => {
  const { collection } = params;
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';

  if (!collection) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Collection parameter required' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    validateCollection(collection);

    // Explicitly cast to any because getCollection types are tricky in this generic context
    const entries = await getCollection(collection as any) as any[];
    
    // Filter by search term if provided
    let filteredEntries = entries;
    if (search) {
      filteredEntries = entries.filter((entry: any) => 
        entry?.data?.title?.toLowerCase().includes(search.toLowerCase()) ||
        entry?.data?.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const total = filteredEntries.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEntries = filteredEntries.slice(startIndex, endIndex);

    // Transform entries for API response
    const items = paginatedEntries.map((entry: any) => ({
      id: entry?.slug || 'unknown',
      collection,
      title: entry?.data?.title || entry?.slug || 'Untitled',
      filePath: `src/content/${collection}/${entry?.slug || 'unknown'}.md`,
      frontmatter: entry?.data || {},
      createdAt: entry?.data?.publicationDate || entry?.data?.createdAt || new Date(),
      updatedAt: new Date()
    }));

    return new Response(JSON.stringify({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        hasMore: endIndex < total
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    // If validation fails or collection doesn't exist
    if ((error as Error).message === 'Invalid collection name' || (error as Error).message.includes('Collection')) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Invalid collection'
        }), {
            status: 400,
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

export const POST: APIRoute = async ({ params, request }) => {
  const { collection } = params;

  if (!collection) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Collection parameter required' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    validateCollection(collection);

    const body = await request.json();
    const { frontmatter, content, filename } = body;

    // Generate filename if not provided
    const slug = filename || generateSlug(frontmatter.title || 'untitled');

    // Define the content root
    const contentRoot = path.join(process.cwd(), 'src', 'content');

    // Construct the target directory
    // Note: Since we validated collection with regex, path.join(contentRoot, collection) is safe

    const targetPath = resolveSafePath(contentRoot, path.join(collection, `${slug}.md`));

    // Create markdown content with frontmatter
    const fileContent = matter.stringify(content || '', frontmatter);

    // Write file to disk
    await fs.writeFile(targetPath, fileContent, 'utf-8');

    return new Response(JSON.stringify({
      success: true,
      data: {
        id: slug,
        filePath: `src/content/${collection}/${slug}.md`
      }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('POST Content Error:', error);
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
      error: 'Failed to create content'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  const { collection } = params;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

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

    const contentRoot = path.join(process.cwd(), 'src', 'content');
    const targetPath = resolveSafePath(contentRoot, path.join(collection, `${id}.md`));

    // Create markdown content with frontmatter
    const fileContent = matter.stringify(content || '', frontmatter);

    // Write file to disk
    await fs.writeFile(targetPath, fileContent, 'utf-8');

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

export const DELETE: APIRoute = async ({ params, request }) => {
  const { collection } = params;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

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

    const contentRoot = path.join(process.cwd(), 'src', 'content');
    const targetPath = resolveSafePath(contentRoot, path.join(collection, `${id}.md`));

    await fs.unlink(targetPath);

    return new Response(JSON.stringify({
      success: true,
      data: { id }
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
      error: 'Failed to delete content'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
