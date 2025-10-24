import type { APIRoute } from 'astro';
import { collections } from '../../../../content/config';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { collection } = params;

  if (!collection || !collections[collection as keyof typeof collections]) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Collection not found' 
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const collectionSchema = collections[collection as keyof typeof collections];
    const zodSchema = collectionSchema?.schema;
    
    if (!zodSchema) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Schema not found for collection'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse Zod schema to extract field definitions
    const fields = parseZodSchema(zodSchema);
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        collection,
        type: collectionSchema.type,
        fields,
        schema: zodSchema
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to parse schema'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

function parseZodSchema(schema: any) {
  const fields: any[] = [];
  
  // Handle function schemas (like those with context)
  if (typeof schema === 'function') {
    // For function schemas, we'll create a basic schema structure
    return [{
      name: 'content',
      type: 'string',
      required: true,
      description: 'Content field'
    }];
  }
  
  const shape = schema._def?.shape();
  
  for (const [key, value] of Object.entries(shape)) {
    const fieldDef = value as any;

    // Get the inner type by unwrapping optional/default wrappers
    let innerDef = fieldDef;
    while (innerDef._def.typeName === 'ZodOptional' || innerDef._def.typeName === 'ZodDefault') {
      innerDef = innerDef._def.innerType;
    }

    const field = {
      name: key,
      type: getZodType(fieldDef),
      required: !fieldDef.isOptional(),
      optional: fieldDef.isOptional(),
      defaultValue: fieldDef._def.defaultValue?.() || undefined
    };

    // Handle array types (check inner type for wrapped arrays)
    if (innerDef._def.typeName === 'ZodArray') {
      (field as any).arrayType = getZodType(innerDef._def.type);
    }

    // Handle coerced dates (check inner type for wrapped effects)
    if (innerDef._def.typeName === 'ZodEffects' && innerDef._def.schema._def.typeName === 'ZodDate') {
      field.type = 'date';
    }

    fields.push(field);
  }
  
  return fields;
}

function getZodType(zodDef: any): string {
  // Unwrap optional and default types to get the inner type
  let innerDef = zodDef;
  while (innerDef._def.typeName === 'ZodOptional' || innerDef._def.typeName === 'ZodDefault') {
    innerDef = innerDef._def.innerType;
  }

  switch (innerDef._def.typeName) {
    case 'ZodString':
      return 'string';
    case 'ZodNumber':
      return 'number';
    case 'ZodBoolean':
      return 'boolean';
    case 'ZodDate':
      return 'date';
    case 'ZodArray':
      return 'array';
    case 'ZodObject':
      return 'object';
    case 'ZodEffects':
      return getZodType(innerDef._def.schema);
    default:
      return 'unknown';
  }
}