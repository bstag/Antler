import type { APIRoute } from 'astro';
import { collections } from '../../../../content.config';

export const GET: APIRoute = async () => {
  if (!import.meta.env.DEV && process.env.NODE_ENV !== 'test') {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Admin API only available in local development mode' 
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const schemasData: Record<string, any> = {};

    for (const [collection, collectionSchema] of Object.entries(collections)) {
      const zodSchema = collectionSchema?.schema;

      if (zodSchema) {
        // Parse Zod schema to extract field definitions
        const fields = parseZodSchema(zodSchema);
        schemasData[collection] = {
          collection,
          type: (collectionSchema as any).type || 'content',
          fields
        };
      }
    }

    return new Response(JSON.stringify({
      success: true,
      data: schemasData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to parse schemas'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

function unwrapZodType(schema: any): any {
  let curr = schema;
  while (curr) {
    const typeName = curr._def?.typeName;
    if (typeName === 'ZodOptional' || typeName === 'ZodDefault' || typeName === 'ZodNullable') {
      curr = curr._def.innerType || curr._def.type;
    } else if (typeName === 'ZodEffects') {
      curr = curr._def.schema;
    } else {
      break;
    }
  }
  return curr;
}

function getObjectShape(schema: any): Record<string, any> | null {
  const unwrapped = unwrapZodType(schema);
  if (!unwrapped) return null;
  if (typeof unwrapped.shape === 'object' && unwrapped.shape !== null) return unwrapped.shape;
  if (typeof unwrapped._def?.shape === 'function') return unwrapped._def.shape();
  if (typeof unwrapped._def?.shape === 'object' && unwrapped._def.shape !== null) return unwrapped._def.shape;
  return null;
}

function parseZodSchema(schema: any) {
  const fields: any[] = [];

  // Handle function schemas (like those with context)
  if (typeof schema === 'function') {
    return [{
      name: 'content',
      type: 'string',
      required: true,
      description: 'Content field'
    }];
  }

  const shape = getObjectShape(schema);
  if (!shape) return fields;

  for (const [key, value] of Object.entries(shape)) {
    const fieldDef = value as any;
    const innerDef = unwrapZodType(fieldDef);

    const isOptional = typeof fieldDef.isOptional === 'function' 
      ? fieldDef.isOptional() 
      : fieldDef._def?.typeName === 'ZodOptional';

    const rawDefaultValue = typeof fieldDef._def?.defaultValue === 'function'
      ? fieldDef._def.defaultValue()
      : fieldDef._def?.defaultValue;

    const field: any = {
      name: key,
      type: getZodType(fieldDef),
      required: !isOptional,
      optional: isOptional,
      defaultValue: rawDefaultValue ?? undefined
    };

    // Handle array types
    if (innerDef?._def?.typeName === 'ZodArray') {
      field.arrayType = getZodType(innerDef._def.type);
    }

    // Handle coerced dates / date effects
    if (innerDef?._def?.typeName === 'ZodEffects' && innerDef._def.schema?._def?.typeName === 'ZodDate') {
      field.type = 'date';
    }

    fields.push(field);
  }

  return fields;
}

function getZodType(zodDef: any): string {
  const innerDef = unwrapZodType(zodDef);
  if (!innerDef || !innerDef._def) return 'string';

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
    default:
      return 'string';
  }
}
