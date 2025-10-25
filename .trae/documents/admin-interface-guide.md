---
title: "Admin Interface Guide"
description: "Complete guide to using the Antler admin interface for content management"
group: "Content Management"
order: 1
---

# Admin Interface Guide

The Antler admin interface provides a powerful, user-friendly way to manage all your content without directly editing Markdown files. This guide covers all aspects of using the admin interface effectively.

## Accessing the Admin Interface

### Development Environment
- **URL**: http://localhost:4321/admin
- **Requirements**: Development server must be running (`npm run dev`)
- **Authentication**: No authentication required in development

### Important Note
The admin interface is **only available during development**. When you build your site for production deployment, the admin interface is excluded to maintain the static nature of your deployed site.

## Dashboard Overview

The admin dashboard provides a central hub for managing all your content:

### Content Statistics
- **Blog Posts**: Total count and recent posts
- **Projects**: Portfolio items and featured projects  
- **Documentation**: Organized by groups
- **Resume Sections**: Professional information sections

### Quick Actions
- Create new content in any category
- Access recent edits
- View content statistics
- Navigate to different content types

## Content Management

### Blog Posts

#### Creating a New Blog Post
1. Navigate to **Blog** section in the admin
2. Click **"New Post"** button
3. Fill out the required fields:
   - **Title**: Post title (required)
   - **Description**: Brief description for SEO (required)
   - **Publication Date**: When the post should be published (required)
   - **Tags**: Comma-separated tags (required)
   - **Featured Image**: Upload or select an image (optional)
   - **Author**: Author name (optional)
   - **Reading Time**: Estimated minutes to read (optional)
   - **Featured**: Check to display on homepage (optional)

#### Writing Content
- Use the **Markdown Editor** with syntax highlighting
- **Live Preview**: See how your content will look in real-time
- **Image Insertion**: Drag and drop or use the file manager
- **Formatting Tools**: Bold, italic, headers, lists, code blocks, and more

#### Managing Existing Posts
- **Edit**: Click on any post to modify it
- **Delete**: Remove posts you no longer need
- **Duplicate**: Create a copy of an existing post
- **Preview**: See how the post appears on the public site

### Projects

#### Creating a Project
1. Go to **Projects** section
2. Click **"New Project"**
3. Complete the project form:
   - **Project Name**: Display name (required)
   - **Description**: Brief project overview (required)
   - **Project Image**: Main project image (required)
   - **Technologies**: Array of tech stack items (required)
   - **GitHub Link**: Repository URL (optional)
   - **Live URL**: Demo or production URL (optional)
   - **Featured**: Show on homepage (optional)
   - **Created At**: Project creation date (optional)

#### Project Content
- Write detailed project descriptions in Markdown
- Include screenshots, architecture diagrams, and code examples
- Explain challenges, solutions, and learnings
- Add technical implementation details

### Documentation

#### Creating Documentation
1. Access **Documentation** section
2. Click **"New Document"**
3. Set document properties:
   - **Title**: Document title (required)
   - **Description**: Brief description (optional)
   - **Group**: Organization category (required)
   - **Order**: Position within group (required)

#### Documentation Organization
- **Groups**: Organize docs into logical categories
- **Order**: Control the sequence within each group
- **Cross-references**: Link between related documents
- **Table of Contents**: Automatic generation from headers

### Resume Sections

The admin interface provides dedicated management for different resume sections:

#### Personal Information
- Contact details
- Professional summary
- Social media links

#### Experience
- Job positions
- Company information
- Responsibilities and achievements
- Employment dates

#### Education
- Degrees and certifications
- Institutions and dates
- Relevant coursework

#### Skills
- Technical skills
- Proficiency levels
- Skill categories

#### Projects
- Professional and personal projects
- Technologies used
- Project outcomes

#### Languages
- Language proficiency
- Certification levels

#### Certifications
- Professional certifications
- Issuing organizations
- Validity dates

## File Management

### Image Uploads
1. Click **"File Manager"** or use drag-and-drop in editors
2. **Upload**: Select files from your computer
3. **Organize**: Create folders for different content types
4. **Insert**: Click to insert images into your content
5. **Optimize**: Images are automatically optimized for web

### File Organization
```
public/images/
├── blog/           # Blog post images
├── projects/       # Project screenshots
├── resume/         # Resume-related images
└── general/        # General site images
```

### Supported Formats
- **Images**: JPG, PNG, WebP, SVG
- **Documents**: PDF (for downloadable resources)
- **Maximum Size**: 10MB per file

## Content Editor Features

### Markdown Editor
- **Syntax Highlighting**: Color-coded Markdown syntax
- **Auto-completion**: Smart suggestions for Markdown syntax
- **Line Numbers**: Easy navigation and reference
- **Find and Replace**: Powerful search functionality
- **Vim/Emacs Keybindings**: Optional for power users

### Live Preview
- **Real-time Rendering**: See changes as you type
- **Responsive Preview**: Test different screen sizes
- **Theme Preview**: See content in light and dark modes
- **Print Preview**: How content appears when printed

### Form Validation
- **Schema-based Validation**: Automatic validation based on content type
- **Required Fields**: Clear indication of mandatory fields
- **Format Validation**: Ensure dates, URLs, and other formats are correct
- **Error Messages**: Helpful feedback for corrections

## Workflow Best Practices

### Content Creation Workflow
1. **Plan**: Outline your content structure
2. **Draft**: Use the admin interface to create initial content
3. **Review**: Use live preview to check formatting
4. **Optimize**: Add images, tags, and metadata
5. **Publish**: Save to make content available on the site

### Content Organization
- **Consistent Tagging**: Use standardized tags across posts
- **Image Naming**: Use descriptive filenames for images
- **Regular Backups**: Your content is stored as files in the repository
- **Version Control**: Use Git to track content changes

### Performance Tips
- **Image Optimization**: Upload appropriately sized images
- **Content Length**: Break long content into multiple pages
- **Tag Management**: Don't over-tag content
- **Regular Cleanup**: Remove unused images and drafts

## Keyboard Shortcuts

### Editor Shortcuts
- **Ctrl/Cmd + S**: Save content
- **Ctrl/Cmd + B**: Bold text
- **Ctrl/Cmd + I**: Italic text
- **Ctrl/Cmd + K**: Insert link
- **Ctrl/Cmd + Shift + P**: Toggle preview
- **Ctrl/Cmd + /**: Toggle comment

### Navigation Shortcuts
- **Ctrl/Cmd + 1-9**: Switch between content types
- **Ctrl/Cmd + N**: Create new content
- **Ctrl/Cmd + F**: Search content
- **Esc**: Close modals and dialogs

## Troubleshooting

### Common Issues

#### Content Not Appearing
- Check that all required fields are filled
- Verify the publication date is not in the future
- Ensure the content is saved properly

#### Images Not Loading
- Verify image file format is supported
- Check file size is under 10MB
- Ensure image path is correct

#### Editor Performance
- Close unused tabs in the admin interface
- Refresh the page if editor becomes slow
- Check browser console for error messages

### Getting Help
- Check the browser console for error messages
- Verify all required fields are completed
- Restart the development server if needed
- Review the content schema requirements

## Security Considerations

### Development Security
- Admin interface is only available in development mode
- No authentication required for local development
- Content is stored as files in your repository

### Production Security
- Admin interface is completely excluded from production builds
- No admin endpoints are available in deployed sites
- Content changes require rebuilding and redeploying

### Best Practices
- Keep your development environment secure
- Use version control to track all content changes
- Regular backups of your content repository
- Review content before deploying to production