import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { collections } from '../../../content/config';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const collectionKeys = Object.keys(collections);
    const stats: Record<string, { total: number; recent?: number; featured?: number }> = {};

    // Parallelize the collection fetching on the server side
    // This is still N internal calls, but avoids N HTTP round trips
    await Promise.all(
      collectionKeys.map(async (key) => {
        try {
          const entries = await getCollection(key as any);

          let recent = 0;
          let featured = 0;

          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

          entries.forEach((entry: any) => {
            const date = new Date(entry.data?.lastModified || entry.data?.createdAt || entry.data?.publicationDate || 0);
            if (date > weekAgo) recent++;
            if (entry.data?.featured) featured++;
          });

          stats[key] = {
            total: entries.length,
            recent,
            featured
          };
        } catch (error) {
          console.error(`Failed to fetch stats for collection ${key}:`, error);
          stats[key] = { total: 0, recent: 0, featured: 0 };
        }
      })
    );

    return new Response(JSON.stringify({
      success: true,
      data: stats
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch dashboard stats'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
