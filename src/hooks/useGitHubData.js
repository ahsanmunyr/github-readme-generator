import { useState, useCallback } from 'react';
import { MOCK_GITHUB_DATA, MOCK_REPOS } from '../utils/mockData';

const CACHE_KEY = (u) => `gh_cache_${u.toLowerCase()}`;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function readCache(username) {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY(username));
    if (!raw) return null;
    const { ts, profile, repos } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return { profile, repos };
  } catch {
    return null;
  }
}

function writeCache(username, profile, repos) {
  try {
    sessionStorage.setItem(CACHE_KEY(username), JSON.stringify({ ts: Date.now(), profile, repos }));
  } catch {
    // sessionStorage full — ignore
  }
}

export function useGitHubData() {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  const fetchProfile = useCallback(async (username) => {
    setLoading(true);
    setError(null);
    setIsDemo(false);

    const cached = readCache(username);
    if (cached) {
      setProfile(cached.profile);
      setRepos(cached.repos);
      setLoading(false);
      return;
    }

    const headers = {};

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, { headers }),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, { headers }),
      ]);

      if (userRes.status === 404) {
        throw new Error(`GitHub user "${username}" not found.`);
      }
      if (userRes.status === 403 || reposRes.status === 403) {
        const reset = userRes.headers.get('x-ratelimit-reset');
        const resetTime = reset ? new Date(reset * 1000).toLocaleTimeString() : null;
        throw new Error(
          resetTime
            ? `GitHub API rate limit reached. Resets at ${resetTime}. Please wait and try again.`
            : 'GitHub API rate limit reached. Please wait a few minutes and try again.'
        );
      }
      if (!userRes.ok) {
        throw new Error(`GitHub API error: ${userRes.status}`);
      }

      const userData = await userRes.json();
      const reposData = reposRes.ok ? await reposRes.json() : [];
      const reposList = Array.isArray(reposData) ? reposData : [];

      writeCache(username, userData, reposList);
      setProfile(userData);
      setRepos(reposList);
    } catch (err) {
      setError(err.message);
      setProfile(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDemo = useCallback(() => {
    setProfile(MOCK_GITHUB_DATA);
    setRepos(MOCK_REPOS);
    setIsDemo(true);
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setProfile(null);
    setRepos([]);
    setError(null);
    setIsDemo(false);
  }, []);

  return { profile, repos, loading, error, isDemo, fetchProfile, loadDemo, reset };
}
