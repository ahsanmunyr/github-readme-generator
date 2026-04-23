import { useState, useCallback } from 'react';
import { generateReadme } from '../utils/readmeGenerator';

export function useReadmeGenerator() {
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState(null);

  const generate = useCallback(({ githubData, repos, sections, theme, youtubeUrl, currentlyWorkingOn, funFact }) => {
    try {
      const result = generateReadme({ profile: githubData, repos, sections, theme, youtubeUrl, currentlyWorkingOn, funFact });
      setMarkdown(result);
      setError(null);
    } catch (err) {
      setError('Failed to generate README. Please try again.');
      console.error(err);
    }
  }, []);

  const clear = useCallback(() => {
    setMarkdown('');
    setError(null);
  }, []);

  return { markdown, setMarkdown, generating: false, error, generate, abort: () => {}, clear };
}
