import { describe, it, expect } from 'vitest';
import { getCollectionName } from '../../../lib/admin/utils';

describe('getCollectionName', () => {
  it('returns Documentation for docs', () => {
    expect(getCollectionName('docs')).toBe('Documentation');
  });

  it('capitalizes first letter for other collections', () => {
    expect(getCollectionName('blog')).toBe('Blog');
    expect(getCollectionName('projects')).toBe('Projects');
  });

  // Test for the NEW functionality we are about to add
  it('returns Personal Info for resumePersonal', () => {
    expect(getCollectionName('resumePersonal')).toBe('Personal Info');
  });

  it('returns Experience for resumeExperience', () => {
    expect(getCollectionName('resumeExperience')).toBe('Experience');
  });

  it('returns proper name for other resume collections', () => {
    expect(getCollectionName('resumeEducation')).toBe('Education');
    expect(getCollectionName('resumeCertifications')).toBe('Certifications');
    expect(getCollectionName('resumeSkills')).toBe('Skills');
    expect(getCollectionName('resumeLanguages')).toBe('Languages');
    expect(getCollectionName('resumeProjects')).toBe('Resume Projects');
  });
});
