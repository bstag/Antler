# Antler CMS Resume Management System - Complete Guide

## Overview

Antler CMS includes a specialized resume management system that allows you to create, manage, and display professional resumes through a dedicated admin interface. The system uses 7 separate content collections to organize different aspects of your professional profile.

## Resume Collections Structure

### 1. Personal Information (`resumePersonal`)
Basic contact and personal details.

**Schema Fields**:
- `name` (string, required) - Full name
- `title` (string, required) - Professional title/position
- `summary` (string, required) - Professional summary/bio
- `email` (string, optional) - Contact email
- `phone` (string, optional) - Phone number
- `location` (string, optional) - Current location
- `website` (string, optional) - Personal website URL
- `linkedin` (string, optional) - LinkedIn profile URL
- `github` (string, optional) - GitHub profile URL
- `order` (number, default: 1) - Display order

### 2. Work Experience (`resumeExperience`)
Professional work history and achievements.

**Schema Fields**:
- `title` (string, required) - Job title
- `company` (string, required) - Company name
- `location` (string, required) - Job location
- `startDate` (date, required) - Employment start date
- `endDate` (date, optional) - Employment end date
- `current` (boolean, default: false) - Currently employed
- `description` (string, required) - Job description
- `achievements` (string[], optional) - Key achievements
- `order` (number, default: 1) - Display order

### 3. Education (`resumeEducation`)
Academic background and qualifications.

**Schema Fields**:
- `degree` (string, required) - Degree type and field
- `school` (string, required) - Institution name
- `location` (string, required) - School location
- `startDate` (date, required) - Start date
- `endDate` (date, optional) - Graduation date
- `gpa` (string, optional) - GPA or grade
- `details` (string, optional) - Additional details
- `order` (number, default: 1) - Display order

### 4. Certifications (`resumeCertifications`)
Professional certifications and licenses.

**Schema Fields**:
- `name` (string, required) - Certification name
- `issuer` (string, required) - Issuing organization
- `date` (date, required) - Issue date
- `expirationDate` (date, optional) - Expiration date
- `credentialId` (string, optional) - Credential ID
- `url` (string, optional) - Verification URL
- `order` (number, default: 1) - Display order

### 5. Skills (`resumeSkills`)
Technical and soft skills organized by category.

**Schema Fields**:
- `category` (string, required) - Skill category (e.g., "Programming", "Design")
- `skills` (string[], required) - Array of skills in this category
- `order` (number, default: 1) - Display order

### 6. Languages (`resumeLanguages`)
Language proficiency levels.

**Schema Fields**:
- `name` (string, required) - Language name
- `proficiency` (string, required) - Proficiency level (e.g., "Native", "Fluent", "Intermediate")
- `order` (number, default: 1) - Display order

### 7. Projects (`resumeProjects`)
Personal and professional projects (separate from main projects collection).

**Schema Fields**:
- `name` (string, required) - Project name
- `description` (string, required) - Project description
- `technologies` (string[], required) - Technologies used
- `url` (string, optional) - Live project URL
- `githubUrl` (string, optional) - GitHub repository URL
- `startDate` (date, optional) - Project start date
- `endDate` (date, optional) - Project end date
- `order` (number, default: 1) - Display order

## Admin Interface Features

### Resume Manager Dashboard
Located at `/admin/resume/`, the resume manager provides:

- **Overview of all resume sections** with content counts
- **Quick navigation** to each resume collection
- **Integrated workflow** for building complete resumes
- **Cross-referencing** between resume sections
- **Preview capabilities** for the complete resume

### Specialized Resume Layout
The resume manager uses a dedicated layout (`ResumeLayout`) that provides:

- **Resume-specific navigation** separate from main content
- **Section-based organization** for easy management
- **Contextual editing** with resume focus
- **Integrated preview** of resume sections

### Content Management Features

#### Schema-Aware Forms
Each resume collection uses dynamically generated forms based on its specific schema:

- **Date pickers** for employment and education dates
- **Array inputs** for skills and achievements
- **URL validation** for websites and profiles
- **Boolean toggles** for current employment status

#### Ordering System
All resume collections include an `order` field for:
- **Custom sorting** of entries within each section
- **Flexible organization** of resume content
- **Professional presentation** order control

#### Content Validation
- **Required field validation** ensures complete information
- **Date validation** prevents invalid date ranges
- **URL validation** for web links and profiles
- **Email validation** for contact information

## Resume Display Integration

### Public Resume Page
The system generates a public resume page at `/resume` that:

- **Aggregates all resume collections** into a cohesive display
- **Respects ordering** specified in each collection
- **Handles missing sections** gracefully
- **Provides professional formatting** and layout

### Template Integration
Resume data can be integrated into:
- **Custom resume templates** with different layouts
- **PDF generation** for downloadable resumes
- **Print-friendly** formatting
- **Multiple format exports**

## API Integration

### Resume-Specific Endpoints
The resume system integrates with the standard content API:

```
GET /admin/api/content/resumePersonal
GET /admin/api/content/resumeExperience
GET /admin/api/content/resumeEducation
GET /admin/api/content/resumeCertifications
GET /admin/api/content/resumeSkills
GET /admin/api/content/resumeLanguages
GET /admin/api/content/resumeProjects
```

### Bulk Operations
- **Export entire resume** as JSON
- **Import resume data** from external sources
- **Backup resume collections** together
- **Sync resume sections** across environments

## Content Creation Workflow

### Step-by-Step Resume Building

1. **Personal Information**
   - Start with basic contact details
   - Add professional summary
   - Include social media profiles

2. **Work Experience**
   - Add positions in reverse chronological order
   - Include detailed descriptions and achievements
   - Mark current position if applicable

3. **Education**
   - Add degrees and certifications
   - Include relevant coursework or honors
   - Specify graduation dates

4. **Skills & Certifications**
   - Organize skills by category
   - Add professional certifications
   - Include expiration dates where relevant

5. **Additional Sections**
   - Add language proficiencies
   - Include relevant projects
   - Customize ordering for best presentation

### Content Guidelines

#### Professional Writing
- **Use action verbs** in experience descriptions
- **Quantify achievements** where possible
- **Keep descriptions concise** but informative
- **Maintain consistent tense** (past for previous roles, present for current)

#### Data Consistency
- **Use consistent date formats** across all sections
- **Maintain professional tone** throughout
- **Verify all URLs** and contact information
- **Keep information current** and relevant

## Advanced Features

### Resume Templates
The system supports multiple resume templates:
- **Traditional format** for conservative industries
- **Modern design** for creative fields
- **Technical focus** for engineering roles
- **Academic format** for research positions

### Export Options
- **PDF generation** for applications
- **Print optimization** for physical copies
- **Web-friendly** formats for online portfolios
- **ATS-friendly** versions for applicant tracking systems

### Integration Capabilities
- **LinkedIn import** for automatic data population
- **GitHub integration** for project information
- **Portfolio synchronization** with main projects
- **Contact form integration** for inquiries

## Best Practices

### Content Organization
- **Use meaningful ordering** to highlight most relevant information
- **Group related skills** in logical categories
- **Prioritize recent experience** in chronological sections
- **Keep contact information current** and professional

### Professional Presentation
- **Maintain consistent formatting** across all sections
- **Use professional language** and terminology
- **Highlight key achievements** and quantifiable results
- **Tailor content** for specific opportunities when possible

### Data Management
- **Regular updates** to keep information current
- **Backup resume data** regularly
- **Version control** for different resume versions
- **Privacy considerations** for sensitive information

## Troubleshooting

### Common Issues

#### Resume Not Displaying
- Check that all required fields are completed
- Verify content exists in resume collections
- Ensure proper ordering values are set
- Check for validation errors in admin interface

#### Missing Sections
- Confirm content exists in respective collections
- Check collection schema compliance
- Verify proper frontmatter formatting
- Ensure files are in correct directories

#### Formatting Issues
- Validate date formats in experience and education
- Check URL formatting for links and profiles
- Verify array formatting for skills and achievements
- Ensure consistent data types across entries

### Data Recovery
- Resume content stored as individual Markdown files
- Version control friendly for backup and recovery
- Easy migration between environments
- Standard content collection structure for reliability

This comprehensive resume management system provides professional-grade resume building capabilities while maintaining the flexibility and simplicity of the Antler CMS content management approach.