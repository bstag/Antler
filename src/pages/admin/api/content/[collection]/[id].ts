import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

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
    const filePath = path.join(process.cwd(), 'src', 'content', collection, `${id}.md`);
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
    const body = await request.json();
    const { frontmatter, content } = body;

    // Create markdown content with frontmatter
    const fileContent = matter.stringify(content || '', frontmatter);
    const filePath = path.join(process.cwd(), 'src', 'content', collection, `${id}.md`);

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
    console.error('PUT error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to update content'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};