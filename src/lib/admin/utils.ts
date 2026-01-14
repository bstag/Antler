import React from 'react';
import type { ContentItem, FileReference } from './types';

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

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

export const getFileIconJSX = (file: FileReference): JSX.Element => {
  if (file.type === 'image') {
    return React.createElement('img', {
      src: file.path,
      alt: file.name,
      className: "w-full h-32 object-cover rounded",
      loading: "lazy"
    });
  }

  // File type icons
  const extension = file.name.split('.').pop()?.toLowerCase();
  let iconColor = 'text-gray-400';
  let iconContent = '📄';

  switch (extension) {
    case 'pdf':
      iconColor = 'text-red-500';
      iconContent = '📄';
      break;
    case 'doc':
    case 'docx':
      iconColor = 'text-blue-500';
      iconContent = '📝';
      break;
    case 'xls':
    case 'xlsx':
      iconColor = 'text-green-500';
      iconContent = '📊';
      break;
    case 'zip':
    case 'rar':
      iconColor = 'text-yellow-500';
      iconContent = '🗜️';
      break;
    default:
      iconContent = '📄';
  }

  return React.createElement('div', {
    className: `w-full h-32 flex items-center justify-center text-4xl ${iconColor}`
  }, iconContent);
};
