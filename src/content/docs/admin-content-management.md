---
title: "Admin Content Management"
description: "Detailed guide to creating, editing, and managing content using the Antler admin interface"
group: "Admin Interface"
order: 2
---
The Antler admin interface provides powerful content management capabilities through schema-aware forms, a rich markdown editor, and real-time validation. This guide covers all aspects of creating and managing content through the admin interface.

## Content Editor Overview

The content editor is the heart of the admin interface, providing a dual-pane approach to content creation:

1. **Metadata Tab** - Schema-aware form for frontmatter fields
2. **Content Tab** - Rich markdown editor with live preview

### Accessing the Content Editor

#### Creating New Content
1. Navigate to any content collection (Blog, Projects, Docs)
2. Click the **"New"** button in the collection list
3. The editor opens with empty forms ready for content creation

#### Editing Existing Content
1. Browse to the content collection
2. Click on any content item in the list
3. The editor opens with existing data pre-populated

## Schema-Aware Forms

### Dynamic Form Generation
The admin interface automatically generates forms based on your content schemas defined in `src/content/config.ts`. Each field type has its own specialized input component with appropriate validation.

### Supported Field Types

#### Text Fields
- **Single-line text**: Standard text inputs with validation
- **Multi-line text**: Textarea inputs for longer content
- **Rich text**: Enhanced inputs with formatting options

```typescript
// Example schema field
{
  name: 'title',
  type: 'string',
  label: 'Post Title',
  required: true,
  validation: {
    minLength: 5,
    maxLength: 100
  }
}
```

#### Number Fields
- **Integer inputs**: Whole numbers with min/max validation
- **Decimal inputs**: Floating-point numbers with precision control
- **Range inputs**: Slider controls for bounded values

#### Boolean Fields
- **Checkbox inputs**: True/false toggles
- **Switch controls**: Enhanced toggle interfaces
- **Radio buttons**: For explicit yes/no choices

#### Date Fields
- **Date picker**: Calendar interface for date selection
- **DateTime picker**: Combined date and time selection
- **Relative dates**: Smart date inputs with shortcuts

#### Array Fields
- **Tag inputs**: Dynamic tag creation and management
- **List inputs**: Ordered list management
- **Multi-select**: Choose from predefined options

#### Object Fields
- **Nested forms**: Complex object editing with sub-fields
- **Key-value pairs**: Dynamic property management
- **Structured data**: Hierarchical content organization

### Form Validation

#### Real-time Validation
- **Field-level validation**: Immediate feedback as you type
- **Schema validation**: Ensures data matches defined structure
- **Custom validation**: Business logic validation rules
- **Cross-field validation**: Dependencies between fields

#### Validation States
- **Valid**: Green indicators and checkmarks
- **Invalid**: Red borders and error messages
- **Warning**: Yellow indicators for non-critical issues
- **Required**: Clear indicators for mandatory fields

#### Error Handling
- **Inline errors**: Messages appear directly below fields
- **Summary errors**: Overview of all validation issues
- **Contextual help**: Tooltips and guidance text
- **Auto-correction**: Suggestions for fixing common errors

## Markdown Editor

### Editor Interface

#### Dual-Tab Design
- **Edit Tab**: Raw markdown editing with toolbar
- **Preview Tab**: Live preview of rendered content
- **Seamless switching**: Maintain context between tabs

#### Toolbar Features
The markdown editor includes a comprehensive toolbar with common formatting options:

- **Bold** (`**text**`) - Ctrl+B
- **Italic** (`*text*`) - Ctrl+I  
- **Links** (`[text](url)`) - Ctrl+K
- **Code** (`` `code` ``) - Inline code formatting
- **Headers** (`# ## ###`) - H1, H2, H3 levels
- **Lists** (`- 1.`) - Bullet and numbered lists
- **Quotes** (`> text`) - Blockquote formatting

#### Keyboard Shortcuts
- **Ctrl+B**: Bold formatting
- **Ctrl+I**: Italic formatting
- **Ctrl+K**: Insert link
- **Tab**: Indent (useful for nested lists)
- **Ctrl+S**: Save content
- **Ctrl+1**: Switch to Metadata tab
- **Ctrl+2**: Switch to Content tab

### Advanced Editing Features

#### Auto-resize Textarea
- **Dynamic height**: Expands as you type
- **Minimum height**: Ensures adequate editing space
- **Scroll handling**: Smooth scrolling for long content

#### Syntax Highlighting
- **Markdown syntax**: Visual distinction for different elements
- **Code blocks**: Syntax highlighting for code snippets
- **Link detection**: Visual indicators for URLs and references

#### Live Preview
- **Real-time rendering**: See changes as you type
- **Styled output**: Preview matches your site's styling
- **Image preview**: Inline image rendering
- **Link validation**: Check link accessibility

### Content Organization

#### Frontmatter Management
- **YAML frontmatter**: Structured metadata at file top
- **Schema validation**: Ensures required fields are present
- **Type safety**: Prevents data type mismatches
- **Default values**: Pre-populated common fields

#### Content Structure
- **Hierarchical organization**: Headers create document structure
- **Table of contents**: Auto-generated from headers
- **Cross-references**: Link between content items
- **Media integration**: Seamless image and file embedding

## Workflow Features

### Auto-save Functionality
- **Periodic saves**: Automatic backup every few minutes
- **Change detection**: Only saves when content changes
- **Recovery**: Restore unsaved changes after browser crashes
- **Conflict resolution**: Handle concurrent editing scenarios

### Content Validation

#### Schema Compliance
- **Required fields**: Ensure all mandatory data is present
- **Data types**: Validate field types match schema
- **Format validation**: Check dates, URLs, email formats
- **Length limits**: Enforce minimum and maximum lengths

#### Content Quality
- **Markdown validation**: Check for syntax errors
- **Link validation**: Verify internal and external links
- **Image validation**: Ensure images exist and are accessible
- **SEO validation**: Check meta descriptions, titles, etc.

### Publishing Workflow

#### Draft Management
- **Draft status**: Save content without publishing
- **Preview mode**: See how content will appear
- **Revision history**: Track changes over time
- **Collaboration**: Multiple editors can work on drafts

#### Publication Process
1. **Content creation**: Write and format content
2. **Metadata completion**: Fill all required fields
3. **Validation check**: Ensure all requirements met
4. **Preview review**: Check final appearance
5. **Publication**: Save and make live

## Content Types

### Blog Posts
Blog posts use a comprehensive schema with the following key fields:

#### Required Fields
- **Title**: Post headline (5-100 characters)
- **Description**: SEO description (50-160 characters)
- **Publication Date**: When the post goes live
- **Tags**: Categorization and discovery

#### Optional Fields
- **Featured Image**: Hero image for the post
- **Author**: Post author information
- **Reading Time**: Estimated reading duration
- **Featured**: Highlight on homepage

#### Content Guidelines
- **Structure**: Use headers to organize content
- **Images**: Include alt text for accessibility
- **Links**: Use descriptive link text
- **Code**: Use code blocks for technical content

### Projects
Project showcases have their own specialized schema:

#### Required Fields
- **Project Name**: Clear, descriptive title
- **Project Image**: Visual representation
- **Description**: Brief project overview
- **Technologies**: Array of tech stack items

#### Optional Fields
- **GitHub Link**: Repository URL
- **Live URL**: Deployed application link
- **Featured**: Highlight on homepage
- **Created At**: Project start date

#### Content Structure
- **Overview**: Project purpose and goals
- **Features**: Key functionality highlights
- **Technical Details**: Architecture and implementation
- **Challenges**: Problems solved and lessons learned

### Documentation
Documentation uses a hierarchical organization system:

#### Required Fields
- **Title**: Document title
- **Group**: Organizational category
- **Order**: Position within group

#### Optional Fields
- **Description**: Document summary

#### Organization
- **Groups**: Logical content categories
- **Ordering**: Numerical sequence within groups
- **Cross-references**: Links between related docs
- **Navigation**: Automatic menu generation

## Advanced Features

### Resume Management
The admin interface includes specialized resume management:

#### Separate Interface
- **Dedicated section**: `/admin/resume/` path
- **Specialized layout**: Optimized for resume content
- **Cross-section integration**: Link related resume parts

#### Resume Sections
- **Personal Information**: Contact and basic details
- **Experience**: Work history and achievements
- **Education**: Academic background
- **Skills**: Technical and soft skills
- **Projects**: Portfolio integration
- **Certifications**: Professional credentials

### File Integration
Content editor integrates seamlessly with file management:

#### Image Embedding
- **Drag-and-drop**: Direct image upload in editor
- **File browser**: Select from existing images
- **Auto-optimization**: Resize and compress images
- **Alt text**: Accessibility metadata

#### Asset Management
- **File organization**: Folder-based structure
- **Version control**: Track file changes
- **Usage tracking**: See where files are used
- **Cleanup tools**: Remove unused assets

## Best Practices

### Content Creation
1. **Plan structure**: Outline before writing
2. **Use templates**: Consistent formatting across content
3. **Optimize images**: Compress before uploading
4. **Write for SEO**: Include relevant keywords naturally
5. **Test links**: Verify all URLs work correctly

### Form Management
1. **Fill required fields first**: Avoid validation errors
2. **Use descriptive titles**: Clear, searchable names
3. **Tag consistently**: Use established tag vocabulary
4. **Preview before saving**: Check final appearance
5. **Save frequently**: Prevent data loss

### Quality Assurance
1. **Proofread content**: Check spelling and grammar
2. **Validate metadata**: Ensure all fields are correct
3. **Test responsive design**: Check mobile appearance
4. **Verify accessibility**: Include alt text and proper headers
5. **Check performance**: Optimize images and content length

## Troubleshooting

### Common Issues

#### Form Validation Errors
- **Check required fields**: Ensure all mandatory data is present
- **Verify data types**: Match field types to schema requirements
- **Review field lengths**: Stay within character limits
- **Fix format errors**: Correct date, URL, and email formats

#### Editor Problems
- **Refresh browser**: Clear temporary issues
- **Check JavaScript**: Ensure browser supports required features
- **Clear cache**: Remove stored data that might conflict
- **Update browser**: Use supported browser versions

#### Save Failures
- **Check network**: Ensure stable internet connection
- **Verify permissions**: File system write access required
- **Review content**: Large files may timeout
- **Try again**: Temporary server issues may resolve

### Getting Help
- **Console logs**: Check browser developer tools
- **Network tab**: Monitor API requests and responses
- **Error messages**: Read validation feedback carefully
- **Documentation**: Refer to schema definitions and examples

## Next Steps

- Explore [File Management](./admin-file-management) for media handling
- Review [API Reference](./admin-api-reference) for technical details
- Learn about [Deployment](./deployment) considerations
- Check [Admin Interface Overview](./admin-interface) for navigation help