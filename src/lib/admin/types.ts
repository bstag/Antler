export interface ContentItem {
  id: string;
  collection: 'blog' | 'projects' | 'docs';
  title: string;
  filePath: string;
  frontmatter: Record<string, any>;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  slug?: string;
}

export interface BlogPost extends ContentItem {
  collection: 'blog';
  frontmatter: {
    title: string;
    description: string;
    publicationDate: Date;
    featuredImage?: string;
    tags: string[];
    author?: string;
    readingTime?: number;
    featured?: boolean;
  };
}

export interface Project extends ContentItem {
  collection: 'projects';
  frontmatter: {
    projectName: string;
    projectImage: string;
    description: string;
    technologies: string[];
    githubLink?: string;
    liveUrl?: string;
    featured?: boolean;
    createdAt?: Date;
  };
}

export interface Documentation extends ContentItem {
  collection: 'docs';
  frontmatter: {
    title: string;
    description?: string;
    group: string;
    order: number;
  };
}

export interface FieldDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  required: boolean;
  optional: boolean;
  defaultValue?: any;
  arrayType?: string;
  enumValues?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };
}

export interface SchemaDefinition {
  collection: string;
  type: 'content';
  fields: FieldDefinition[];
  relationships?: RelationshipDefinition[];
}

export interface RelationshipDefinition {
  field: string;
  targetCollection: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  displayField: string;
}

export interface FileReference {
  name: string;
  path: string;
  url: string;
  type: 'image' | 'document' | 'other';
  size: number;
  uploadedAt: Date;
  modifiedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
}

export interface ContentListResponse {
  items: ContentItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface UploadResult {
  success: boolean;
  path?: string;
  url?: string;
  filename?: string;
  size?: number;
  type?: string;
  error?: string;
}