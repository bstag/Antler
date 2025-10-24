import type { FieldDefinition, SchemaDefinition } from './types';
import { z } from 'zod';

export class SchemaParser {
  private static parseZodType(zodType: any, fieldName: string): FieldDefinition {
    const field: FieldDefinition = {
      name: fieldName,
      type: 'string',
      required: true,
      optional: false
    };

    // Handle ZodOptional
    if (zodType instanceof z.ZodOptional) {
      field.optional = true;
      field.required = false;
      zodType = zodType._def.innerType;
    }

    // Handle ZodDefault
    if (zodType instanceof z.ZodDefault) {
      field.defaultValue = zodType._def.defaultValue();
      zodType = zodType._def.innerType;
    }

    // Determine the base type
    if (zodType instanceof z.ZodString) {
      field.type = 'string';
      
      // Check for enum values
      if (zodType._def.checks) {
        const enumCheck = zodType._def.checks.find((check: any) => check.kind === 'includes');
        if (enumCheck) {
          field.enumValues = (enumCheck as any).value;
        }
      }
    } else if (zodType instanceof z.ZodNumber) {
      field.type = 'number';
      
      // Extract min/max validation
      if (zodType._def.checks) {
        const minCheck = zodType._def.checks.find((check: any) => check.kind === 'min');
        const maxCheck = zodType._def.checks.find((check: any) => check.kind === 'max');
        
        if (minCheck || maxCheck) {
          field.validation = {
            ...(minCheck && { min: (minCheck as any).value }),
            ...(maxCheck && { max: (maxCheck as any).value })
          };
        }
      }
    } else if (zodType instanceof z.ZodBoolean) {
      field.type = 'boolean';
    } else if (zodType instanceof z.ZodDate) {
      field.type = 'date';
    } else if (zodType instanceof z.ZodArray) {
      field.type = 'array';
      
      // Determine array element type
      const elementType = zodType._def.type;
      if (elementType instanceof z.ZodString) {
        field.arrayType = 'string';
      } else if (elementType instanceof z.ZodNumber) {
        field.arrayType = 'number';
      } else if (elementType instanceof z.ZodObject) {
        field.arrayType = 'object';
      } else {
        field.arrayType = 'string'; // fallback
      }
    } else if (zodType instanceof z.ZodObject) {
      field.type = 'object';
    } else if (zodType instanceof z.ZodEnum) {
      field.type = 'string';
      field.enumValues = zodType._def.values;
    } else if (zodType instanceof z.ZodLiteral) {
      field.type = 'string';
      field.enumValues = [zodType._def.value];
    } else if (zodType instanceof z.ZodUnion) {
      // Handle union types - try to extract enum values
      const options = zodType._def.options;
      if (options.every((opt: any) => opt instanceof z.ZodLiteral)) {
        field.type = 'string';
        field.enumValues = options.map((opt: any) => opt._def.value);
      } else {
        field.type = 'string'; // fallback
      }
    }

    return field;
  }

  static parseSchema(zodSchema: z.ZodObject<any>, collectionName: string): SchemaDefinition {
    const fields: FieldDefinition[] = [];
    const shape = zodSchema._def.shape();

    for (const [fieldName, zodType] of Object.entries(shape)) {
      const field = this.parseZodType(zodType, fieldName);
      fields.push(field);
    }

    return {
      collection: collectionName,
      type: 'content',
      fields,
      relationships: this.inferRelationships(fields, collectionName)
    };
  }

  private static inferRelationships(fields: FieldDefinition[], collectionName: string) {
    const relationships = [];
    
    // Look for potential relationship fields
    for (const field of fields) {
      // Check for fields that might reference other collections
      if (field.type === 'string' && field.name.includes('Id')) {
        const targetCollection = field.name.replace('Id', '').toLowerCase();
        if (['blog', 'projects', 'docs'].includes(targetCollection)) {
          relationships.push({
            field: field.name,
            targetCollection,
            type: 'one-to-one' as const,
            displayField: 'title'
          });
        }
      }
      
      // Check for array fields that might be relationships
      if (field.type === 'array' && field.arrayType === 'string') {
        if (field.name.includes('tags') || field.name.includes('categories')) {
          // These are typically tag arrays, not relationships
          continue;
        }
        
        const singularName = field.name.replace(/s$/, '');
        if (['blog', 'project', 'doc'].includes(singularName)) {
          relationships.push({
            field: field.name,
            targetCollection: singularName === 'project' ? 'projects' : `${singularName}s`,
            type: 'one-to-many' as const,
            displayField: 'title'
          });
        }
      }
    }
    
    return relationships.length > 0 ? relationships : undefined;
  }

  static async loadContentCollections(): Promise<Record<string, SchemaDefinition>> {
    try {
      // In a real implementation, we would dynamically import the config
      // For now, we'll create the schemas based on the known structure
      const schemas: Record<string, SchemaDefinition> = {};

      // Blog schema
      schemas.blog = {
        collection: 'blog',
        type: 'content',
        fields: [
          { name: 'title', type: 'string', required: true, optional: false },
          { name: 'description', type: 'string', required: true, optional: false },
          { name: 'publicationDate', type: 'date', required: true, optional: false },
          { name: 'featuredImage', type: 'string', required: false, optional: true },
          { name: 'tags', type: 'array', arrayType: 'string', required: true, optional: false },
          { name: 'author', type: 'string', required: false, optional: true },
          { name: 'readingTime', type: 'number', required: false, optional: true },
          { name: 'featured', type: 'boolean', required: false, optional: true, defaultValue: false }
        ]
      };

      // Projects schema
      schemas.projects = {
        collection: 'projects',
        type: 'content',
        fields: [
          { name: 'projectName', type: 'string', required: true, optional: false },
          { name: 'projectImage', type: 'string', required: true, optional: false },
          { name: 'description', type: 'string', required: true, optional: false },
          { name: 'technologies', type: 'array', arrayType: 'string', required: true, optional: false },
          { name: 'githubLink', type: 'string', required: false, optional: true },
          { name: 'liveUrl', type: 'string', required: false, optional: true },
          { name: 'featured', type: 'boolean', required: false, optional: true, defaultValue: false },
          { name: 'createdAt', type: 'date', required: false, optional: true }
        ]
      };

      // Docs schema
      schemas.docs = {
        collection: 'docs',
        type: 'content',
        fields: [
          { name: 'title', type: 'string', required: true, optional: false },
          { name: 'description', type: 'string', required: false, optional: true },
          { name: 'group', type: 'string', required: true, optional: false },
          { name: 'order', type: 'number', required: true, optional: false }
        ]
      };

      return schemas;
    } catch (error) {
      console.error('Failed to load content collections:', error);
      return {};
    }
  }
}