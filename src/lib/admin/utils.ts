import type { ContentItem } from './types';

export const getCollectionName = (collection: string): string => {
  switch (collection) {
    case 'docs':
      return 'Documentation';
    case 'resumePersonal':
      return 'Personal Info';
    case 'resumeExperience':
      return 'Experience';
    case 'resumeEducation':
      return 'Education';
    case 'resumeCertifications':
      return 'Certifications';
    case 'resumeSkills':
      return 'Skills';
    case 'resumeLanguages':
      return 'Languages';
    case 'resumeProjects':
      return 'Resume Projects';
    default:
      return collection.charAt(0).toUpperCase() + collection.slice(1);
  }
};

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getItemPreview = (item: ContentItem): string => {
  if (item.frontmatter.description) {
    return item.frontmatter.description;
  }
  if (item.content) {
    return item.content.substring(0, 150) + '...';
  }
  return 'No description available';
};

export const getItemTags = (item: ContentItem): string[] => {
  if (item.frontmatter.tags && Array.isArray(item.frontmatter.tags)) {
    return item.frontmatter.tags;
  }
  if (item.frontmatter.technologies && Array.isArray(item.frontmatter.technologies)) {
    return item.frontmatter.technologies;
  }
  return [];
};
