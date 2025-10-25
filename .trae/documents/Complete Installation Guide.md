# Complete Installation Guide

This comprehensive guide will walk you through installing Antler, a modern static site generator with an integrated admin interface. Follow these step-by-step instructions to get your development environment up and running.

## System Requirements

### Minimum Requirements

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB free space for installation, additional space for content

### Recommended Requirements

- **Node.js**: Version 20.0.0 or higher (LTS version)
- **npm**: Version 10.0.0 or higher
- **RAM**: 8GB or more for optimal development experience
- **Storage**: 2GB free space for development dependencies
- **Code Editor**: VS Code with Astro extension recommended

### Checking Your System

Before installation, verify your system meets the requirements:

```bash
# Check Node.js version
node --version
# Should output v18.0.0 or higher

# Check npm version
npm --version
# Should output 8.0.0 or higher

# Check available disk space
# Windows: dir
# macOS/Linux: df -h
```

## Installation Methods

### Method 1: Clone from GitHub (Recommended)

This method gives you the latest version with full git history:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/antler.git
   cd antler
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify installation**:
   ```bash
   npm run dev
   ```

### Method 2: Use as GitHub Template

Create a new repository based on Antler:

1. **Visit the Antler repository** on GitHub
2. **Click "Use this template"** button
3. **Create your new repository**
4. **Clone your new repository**:
   ```bash
   git clone https://github.com/yourusername/your-site-name.git
   cd your-site-name
   ```

5. **Install dependencies**:
   ```bash
   npm install
   ```

### Method 3: Download ZIP

For users who don't want to use Git:

1. **Download the ZIP file** from the GitHub repository
2. **Extract the archive** to your desired location
3. **Navigate to the directory**:
   ```bash
   cd antler-main
   ```

4. **Initialize Git repository** (optional but recommended):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

5. **Install dependencies**:
   ```bash
   npm install
   ```

## Initial Setup

### Environment Configuration

1. **Create environment file**:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Or create manually
   touch .env
   ```

2. **Configure environment variables** (optional):
   ```env
   # Contact form configuration (optional)
   RESEND_API_KEY=your_resend_api_key_here
   CONTACT_EMAIL=your@email.com
   FROM_EMAIL=noreply@yourdomain.com
   
   # Site configuration
   SITE_URL=http://localhost:4321
   SITE_TITLE=Your Site Name
   ```

### Content Setup

1. **Review existing content** in `src/content/`:
   ```
   src/content/
   ├── blog/          # Blog posts
   ├── projects/      # Portfolio projects
   ├── docs/          # Documentation
   └── config.ts      # Content schemas
   ```

2. **Customize content schemas** (optional):
   Edit `src/content/config.ts` to modify content types:
   ```typescript
   // Example: Add new field to blog schema
   const blog = defineCollection({
     type: 'content',
     schema: z.object({
       title: z.string(),
       description: z.string(),
       publishDate: z.date(),
       tags: z.array(z.string()),
       // Add your custom fields here
       author: z.string().optional(),
       featured: z.boolean().default(false),
     }),
   });
   ```

3. **Add your content**:
   - Replace sample blog posts in `src/content/blog/`
   - Add your projects to `src/content/projects/`
   - Update documentation in `src/content/docs/`

### Site Configuration

1. **Update site metadata** in `src/config.ts`:
   ```typescript
   export const SITE = {
     title: 'Your Site Name',
     description: 'Your site description',
     defaultLanguage: 'en-us',
   } as const;
   
   export const OPEN_GRAPH = {
     image: {
       src: 'https://github.com/withastro/astro/blob/main/assets/social/banner-minimal.png?raw=true',
       alt: 'Your site description',
     },
     twitter: 'yourtwitterhandle',
   };
   ```

2. **Configure Astro settings** in `astro.config.mjs`:
   ```javascript
   export default defineConfig({
     site: 'https://yourdomain.com', // Your production URL
     integrations: [
       tailwind(),
       react(),
       // Add other integrations as needed
     ],
   });
   ```

## Development Environment

### Starting the Development Server

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access your site**:
   - **Public site**: http://localhost:4321
   - **Admin interface**: http://localhost:4321/admin

3. **Verify everything works**:
   - Browse the public site
   - Test the admin interface
   - Create a test blog post
   - Upload an image

### Development Scripts

Antler provides several npm scripts for development:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Linting (if configured)
npm run lint

# Format code (if configured)
npm run format
```

## IDE Setup

### Visual Studio Code (Recommended)

1. **Install VS Code** from https://code.visualstudio.com/

2. **Install recommended extensions**:
   - Astro (astro-build.astro-vscode)
   - Tailwind CSS IntelliSense
   - TypeScript and JavaScript Language Features
   - Prettier - Code formatter
   - Auto Rename Tag

3. **Configure VS Code settings**:
   Create `.vscode/settings.json`:
   ```json
   {
     "typescript.preferences.includePackageJsonAutoImports": "off",
     "typescript.suggest.autoImports": false,
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "[astro]": {
       "editor.defaultFormatter": "astro-build.astro-vscode"
     }
   }
   ```

4. **Configure VS Code extensions**:
   Create `.vscode/extensions.json`:
   ```json
   {
     "recommendations": [
       "astro-build.astro-vscode",
       "bradlc.vscode-tailwindcss",
       "esbenp.prettier-vscode"
     ]
   }
   ```

### Other IDEs

- **WebStorm**: Install Astro plugin from JetBrains marketplace
- **Vim/Neovim**: Use vim-astro plugin
- **Sublime Text**: Install Astro syntax highlighting package

## Troubleshooting Installation

### Common Issues

#### Node.js Version Issues

**Problem**: "Node.js version not supported"

**Solution**:
```bash
# Check current version
node --version

# Install Node Version Manager (nvm)
# Windows: Download from https://github.com/coreybutler/nvm-windows
# macOS/Linux: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 20
nvm install 20
nvm use 20
```

#### npm Installation Failures

**Problem**: "npm install" fails with permission errors

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Try installing with different registry
npm install --registry https://registry.npmjs.org/

# On macOS/Linux, avoid using sudo
# Instead, configure npm to use a different directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

#### Port Already in Use

**Problem**: "Port 4321 is already in use"

**Solution**:
```bash
# Use a different port
npm run dev -- --port 3000

# Or kill the process using the port
# Windows: netstat -ano | findstr :4321
# macOS/Linux: lsof -ti:4321 | xargs kill
```

#### TypeScript Errors

**Problem**: TypeScript compilation errors

**Solution**:
```bash
# Clear TypeScript cache
rm -rf node_modules/.astro
rm -rf dist

# Reinstall dependencies
npm install

# Run type checking
npm run check
```

### Getting Help

If you encounter issues not covered here:

1. **Check the documentation** in the `.trae/documents/` folder
2. **Search existing issues** on the GitHub repository
3. **Create a new issue** with:
   - Your operating system and version
   - Node.js and npm versions
   - Complete error message
   - Steps to reproduce the issue

## Next Steps

After successful installation:

1. **Read the Getting Started guide** (`.trae/documents/getting-started.md`)
2. **Explore the admin interface** (`.trae/documents/admin-interface-guide.md`)
3. **Learn about content management** (`.trae/documents/Content Management Guide.md`)
4. **Customize your site** (`.trae/documents/Customization and Theming Guide.md`)
5. **Deploy your site** (`.trae/documents/Building and Deployment Guide.md`)

## Verification Checklist

Before proceeding with development, verify:

- [ ] Node.js 18+ is installed
- [ ] npm dependencies are installed successfully
- [ ] Development server starts without errors
- [ ] Public site loads at http://localhost:4321
- [ ] Admin interface loads at http://localhost:4321/admin
- [ ] You can create and edit content through the admin
- [ ] Images can be uploaded through the admin
- [ ] Production build completes successfully (`npm run build`)

Congratulations! You now have Antler installed and ready for development. The next step is to familiarize yourself with the admin interface and start creating your content.