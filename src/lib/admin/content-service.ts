import type { ContentItem, ContentListResponse, ApiResponse } from './types';
import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';

export class ContentService {
  private static readonly CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

  static async getContentList(
    collection: string,
    options: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      filters?: Record<string, any>;
    } = {}
  ): Promise<ContentListResponse> {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'updatedAt',
      sortOrder = 'desc',
      filters = {}
    } = options;

    try {
      const collectionDir = path.join(this.CONTENT_DIR, collection);
      const files = await fs.readdir(collectionDir);
      const mdFiles = files.filter(file => file.endsWith('.md'));

      let items: ContentItem[] = [];

      for (const file of mdFiles) {
        const filePath = path.join(collectionDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data: frontmatter } = matter(fileContent);
        const stats = await fs.stat(filePath);

        const item: ContentItem = {
          id: path.basename(file, '.md'),
          collection: collection as any,
          title: frontmatter.title || frontmatter.projectName || 'Untitled',
          filePath: path.relative(process.cwd(), filePath),
          frontmatter,
          createdAt: stats.birthtime,
          updatedAt: stats.mtime
        };

        items.push(item);
      }

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        items = items.filter(item => 
          item.title.toLowerCase().includes(searchLower) ||
          (item.frontmatter.description && 
           item.frontmatter.description.toLowerCase().includes(searchLower)) ||
          (item.frontmatter.tags && 
           item.frontmatter.tags.some((tag: string) => 
             tag.toLowerCase().includes(searchLower)))
        );
      }

      // Apply additional filters
      if (Object.keys(filters).length > 0) {
        items = items.filter(item => {
          return Object.entries(filters).every(([key, value]) => {
            if (value === undefined || value === null || value === '') return true;
            
            const itemValue = item.frontmatter[key];
            
            if (Array.isArray(itemValue)) {
              return itemValue.includes(value);
            }
            
            return itemValue === value;
          });
        });
      }

      // Sort items
      items.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortBy === 'title') {
          aValue = a.title;
          bValue = b.title;
        } else if (sortBy === 'createdAt') {
          aValue = a.createdAt;
          bValue = b.createdAt;
        } else if (sortBy === 'updatedAt') {
          aValue = a.updatedAt;
          bValue = b.updatedAt;
        } else {
          aValue = a.frontmatter[sortBy];
          bValue = b.frontmatter[sortBy];
        }

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      // Paginate
      const total = items.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = items.slice(startIndex, endIndex);

      return {
        items: paginatedItems,
        total,
        page,
        limit,
        hasMore: endIndex < total
      };
    } catch (error) {
      console.error(`Failed to get content list for ${collection}:`, error);
      return {
        items: [],
        total: 0,
        page,
        limit,
        hasMore: false
      };
    }
  }

  static async getContentItem(collection: string, id: string): Promise<ContentItem | null> {
    try {
      const filePath = path.join(this.CONTENT_DIR, collection, `${id}.md`);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent);
      const stats = await fs.stat(filePath);

      return {
        id,
        collection: collection as any,
        title: frontmatter.title || frontmatter.projectName || 'Untitled',
        filePath: path.relative(process.cwd(), filePath),
        frontmatter,
        content,
        createdAt: stats.birthtime,
        updatedAt: stats.mtime
      };
    } catch (error) {
      console.error(`Failed to get content item ${collection}/${id}:`, error);
      return null;
    }
  }

  static async createContentItem(
    collection: string,
    data: { frontmatter: Record<string, any>; content: string }
  ): Promise<ApiResponse<ContentItem>> {
    try {
      // Generate ID from title or projectName
      const title = data.frontmatter.title || data.frontmatter.projectName || 'untitled';
      const id = this.generateSlug(title);
      
      const filePath = path.join(this.CONTENT_DIR, collection, `${id}.md`);
      
      // Check if file already exists
      try {
        await fs.access(filePath);
        return {
          success: false,
          error: `Content with ID "${id}" already exists`
        };
      } catch {
        // File doesn't exist, which is what we want
      }

      // Ensure directory exists
      const collectionDir = path.join(this.CONTENT_DIR, collection);
      await fs.mkdir(collectionDir, { recursive: true });

      // Create file content
      const fileContent = matter.stringify(data.content, data.frontmatter);
      await fs.writeFile(filePath, fileContent, 'utf-8');

      // Return created item
      const createdItem = await this.getContentItem(collection, id);
      
      return {
        success: true,
        data: createdItem!
      };
    } catch (error) {
      console.error(`Failed to create content item in ${collection}:`, error);
      return {
        success: false,
        error: 'Failed to create content item'
      };
    }
  }

  static async updateContentItem(
    collection: string,
    id: string,
    data: { frontmatter: Record<string, any>; content: string }
  ): Promise<ApiResponse<ContentItem>> {
    try {
      const filePath = path.join(this.CONTENT_DIR, collection, `${id}.md`);
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        return {
          success: false,
          error: `Content with ID "${id}" not found`
        };
      }

      // Update file content
      const fileContent = matter.stringify(data.content, data.frontmatter);
      await fs.writeFile(filePath, fileContent, 'utf-8');

      // Return updated item
      const updatedItem = await this.getContentItem(collection, id);
      
      return {
        success: true,
        data: updatedItem!
      };
    } catch (error) {
      console.error(`Failed to update content item ${collection}/${id}:`, error);
      return {
        success: false,
        error: 'Failed to update content item'
      };
    }
  }

  static async deleteContentItem(collection: string, id: string): Promise<ApiResponse<void>> {
    try {
      const filePath = path.join(this.CONTENT_DIR, collection, `${id}.md`);
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        return {
          success: false,
          error: `Content with ID "${id}" not found`
        };
      }

      // Delete file
      await fs.unlink(filePath);
      
      return {
        success: true
      };
    } catch (error) {
      console.error(`Failed to delete content item ${collection}/${id}:`, error);
      return {
        success: false,
        error: 'Failed to delete content item'
      };
    }
  }

  private static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  }

  static async getCollectionStats(collection: string): Promise<{
    total: number;
    recent: number;
    featured?: number;
  }> {
    try {
      const collectionDir = path.join(this.CONTENT_DIR, collection);
      const files = await fs.readdir(collectionDir);
      const mdFiles = files.filter(file => file.endsWith('.md'));

      let featuredCount = 0;
      let recentCount = 0;
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      for (const file of mdFiles) {
        const filePath = path.join(collectionDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data: frontmatter } = matter(fileContent);
        const stats = await fs.stat(filePath);

        if (frontmatter.featured) {
          featuredCount++;
        }

        if (stats.mtime > oneWeekAgo) {
          recentCount++;
        }
      }

      return {
        total: mdFiles.length,
        recent: recentCount,
        ...(featuredCount > 0 && { featured: featuredCount })
      };
    } catch (error) {
      console.error(`Failed to get stats for ${collection}:`, error);
      return {
        total: 0,
        recent: 0
      };
    }
  }
}