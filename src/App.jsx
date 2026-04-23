import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from './components/Navbar';
import FormSidebar from './components/FormSidebar';
import MarkdownPreview from './components/MarkdownPreview';
import BottomBar from './components/BottomBar';
import { generateReadme } from './utils/readmeGenerator';

const DEFAULT_FORM = {
  name: '', tagline: '', about: '', location: '', pronouns: '', email: '', portfolio: '',
  currentlyWorking: '', currentlyLearning: '', collaborateOn: '', askMeAbout: '', funFact: '',
  skills: [],
  github: '', linkedin: '', twitter: '', instagram: '', youtube: '',
  devto: '', medium: '', hashnode: '', stackoverflow: '', codepen: '', discord: '', kaggle: '',
  projects: [],
  experience: [],
  showStats: true, showStreak: true, showTopLangs: true, showTrophies: false,
  statsTheme: 'tokyonight',
  visitorBadge: true,
};

export default function App() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [markdown, setMarkdown] = useState('');
  const [fetching, setFetching] = useState(false);

  // Live preview
  useEffect(() => {
    setMarkdown(generateReadme(form));
  }, [form]);

  // Pre-fill from GitHub
  const handleFetch = useCallback(async (username) => {
    const trimmed = username.trim();
    if (!trimmed) return;
    setFetching(true);
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${trimmed}`),
        fetch(`https://api.github.com/users/${trimmed}/repos?per_page=100&sort=pushed`),
      ]);

      if (userRes.status === 404) throw new Error(`User "${trimmed}" not found on GitHub.`);
      if (userRes.status === 403) throw new Error('GitHub rate limit reached. Try again in a few minutes.');
      if (!userRes.ok) throw new Error(`GitHub error: ${userRes.status}`);

      const user = await userRes.json();
      const repos = reposRes.ok ? await reposRes.json() : [];

      setForm(prev => ({
        ...prev,
        name:      user.name      || prev.name,
        about:     user.bio       || prev.about,
        location:  user.location  || prev.location,
        email:     user.email     || prev.email,
        portfolio: user.blog      || prev.portfolio,
        github:    user.login     || prev.github,
        twitter:   user.twitter_username || prev.twitter,
      }));

      toast.success(`Pre-filled from @${user.login}`);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch GitHub profile.');
    } finally {
      setFetching(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', fontSize: '13px' },
          success: { iconTheme: { primary: '#10b981', secondary: '#f1f5f9' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' } },
        }}
      />

      <Navbar onFetch={handleFetch} loading={fetching} />

      <div className="flex flex-1 overflow-hidden">
        <FormSidebar form={form} onChange={setForm} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <MarkdownPreview markdown={markdown} generating={false} />
          <BottomBar markdown={markdown} />
        </div>
      </div>
    </div>
  );
}
