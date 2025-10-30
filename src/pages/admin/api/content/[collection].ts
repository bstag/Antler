import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { generateSlug } from '../../../../lib/utils/slug';

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
    const body = await request.json();
    const { frontmatter, content, filename } = body;

    // Generate filename if not provided
    const slug = filename || generateSlug(frontmatter.title || 'untitled');
    const filePath = path.join(process.cwd(), 'src', 'content', collection, `${slug}.md`);

    // Create markdown content with frontmatter
    const fileContent = matter.stringify(content || '', frontmatter);

    // Write file to disk
    await fs.writeFile(filePath, fileContent, 'utf-8');

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
    const body = await request.json();
    const { frontmatter, content } = body;

    const filePath = path.join(process.cwd(), 'src', 'content', collection, `${id}.md`);

    // Create markdown content with frontmatter
    const fileContent = matter.stringify(content || '', frontmatter);

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
    const filePath = path.join(process.cwd(), 'src', 'content', collection, `${id}.md`);
    await fs.unlink(filePath);

    return new Response(JSON.stringify({
      success: true,
      data: { id }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to delete content'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};