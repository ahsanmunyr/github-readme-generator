import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Info } from 'lucide-react';
import SkillsPicker from './SkillsPicker';

function Section({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/60 hover:bg-slate-800 transition-colors"
        type="button"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <span>{icon}</span>{title}
        </span>
        {open
          ? <ChevronUp size={14} className="text-slate-400" />
          : <ChevronDown size={14} className="text-slate-400" />}
      </button>
      {open && <div className="p-4 bg-slate-900/40 space-y-3">{children}</div>}
    </div>
  );
}

function Input({ label, placeholder, value, onChange, type = 'text', textarea = false }) {
  const cls = "w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition";
  return (
    <div className="space-y-1">
      {label && <label className="text-xs font-medium text-slate-400">{label}</label>}
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className={`${cls} resize-none`} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  );
}

// Fixed toggle — pill has relative, ball transitions inside it
function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer select-none">
      <span className="text-sm text-slate-300">{label}</span>
      <div
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${checked ? 'bg-violet-600' : 'bg-slate-600'}`}
      >
        <span
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-150"
          style={{ left: checked ? '22px' : '2px' }}
        />
      </div>
    </label>
  );
}

function Hint({ children }) {
  return (
    <div className="flex items-start gap-1.5 bg-slate-800/50 border border-slate-700/40 rounded-lg p-2.5">
      <Info size={11} className="text-slate-500 mt-0.5 shrink-0" />
      <p className="text-xs text-slate-500 leading-relaxed">{children}</p>
    </div>
  );
}

const STATS_THEMES = [
  'tokyonight', 'radical', 'merko', 'gruvbox', 'synthwave',
  'highcontrast', 'dracula', 'vue-dark', 'github-dark', 'default',
];

export default function FormSidebar({ form, onChange }) {
  const set = (key) => (val) => onChange({ ...form, [key]: val });

  const addProject = () => onChange({
    ...form,
    projects: [...(form.projects || []), { name: '', description: '', liveUrl: '', githubUrl: '' }],
  });
  const updateProject = (i, key, val) => {
    const updated = [...form.projects];
    updated[i] = { ...updated[i], [key]: val };
    onChange({ ...form, projects: updated });
  };
  const removeProject = (i) => onChange({ ...form, projects: form.projects.filter((_, idx) => idx !== i) });

  const addExp = () => onChange({
    ...form,
    experience: [...(form.experience || []), { company: '', role: '', period: '', description: '' }],
  });
  const updateExp = (i, key, val) => {
    const updated = [...form.experience];
    updated[i] = { ...updated[i], [key]: val };
    onChange({ ...form, experience: updated });
  };
  const removeExp = (i) => onChange({ ...form, experience: form.experience.filter((_, idx) => idx !== i) });

  const hasGitHub = !!form.github?.trim();

  return (
    <aside className="w-96 shrink-0 bg-slate-900 border-r border-slate-700/50 flex flex-col h-[calc(100vh-57px)] overflow-y-auto">
      <div className="p-4 space-y-3">

        {/* ── Profile ── */}
        <Section title="Profile" icon="👤" defaultOpen>
          <Input label="Display Name *" placeholder="John Doe" value={form.name} onChange={set('name')} />
          <Input label="Tagline / Subtitle" placeholder="Full Stack Developer | Open Source Enthusiast" value={form.tagline} onChange={set('tagline')} />
          <Input label="About Me" placeholder="A short bio about yourself..." value={form.about} onChange={set('about')} textarea />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Location" placeholder="New York, USA" value={form.location} onChange={set('location')} />
            <Input label="Pronouns" placeholder="he/him" value={form.pronouns} onChange={set('pronouns')} />
          </div>
          <Input label="Email" placeholder="you@email.com" value={form.email} onChange={set('email')} type="email" />
          <Input label="Portfolio / Website" placeholder="https://yoursite.com" value={form.portfolio} onChange={set('portfolio')} />
        </Section>

        {/* ── What I'm Up To ── */}
        <Section title="What I'm Up To" icon="💡">
          <Input label="Currently Working On" placeholder="A cool open-source project..." value={form.currentlyWorking} onChange={set('currentlyWorking')} />
          <Input label="Currently Learning" placeholder="Rust, WebAssembly, AI..." value={form.currentlyLearning} onChange={set('currentlyLearning')} />
          <Input label="Looking to Collaborate On" placeholder="Open source, startups..." value={form.collaborateOn} onChange={set('collaborateOn')} />
          <Input label="Ask Me About" placeholder="React, Node.js, System Design..." value={form.askMeAbout} onChange={set('askMeAbout')} />
          <Input label="Fun Fact" placeholder="I can solve a Rubik's cube in 30 seconds!" value={form.funFact} onChange={set('funFact')} />
        </Section>

        {/* ── Skills ── */}
        <Section title="Skills & Technologies" icon="🛠️">
          <SkillsPicker selected={form.skills || []} onChange={set('skills')} />
        </Section>

        {/* ── Social Links ── */}
        <Section title="Social Links" icon="🔗">
          <Hint>GitHub Username is also used for stats cards and visitor badge below.</Hint>
          <Input label="GitHub Username" placeholder="torvalds" value={form.github} onChange={set('github')} />
          <Input label="LinkedIn Username" placeholder="john-doe-123" value={form.linkedin} onChange={set('linkedin')} />
          <Input label="Twitter / X Username" placeholder="johndoe" value={form.twitter} onChange={set('twitter')} />
          <Input label="Instagram Username" placeholder="johndoe" value={form.instagram} onChange={set('instagram')} />
          <Input label="YouTube Handle" placeholder="johndoe or @johndoe" value={form.youtube} onChange={set('youtube')} />
          <Input label="Dev.to Username" placeholder="johndoe" value={form.devto} onChange={set('devto')} />
          <Input label="Medium Username" placeholder="johndoe" value={form.medium} onChange={set('medium')} />
          <Input label="Hashnode Username" placeholder="johndoe" value={form.hashnode} onChange={set('hashnode')} />
          <Input label="Stack Overflow User ID" placeholder="12345678" value={form.stackoverflow} onChange={set('stackoverflow')} />
          <Input label="CodePen Username" placeholder="johndoe" value={form.codepen} onChange={set('codepen')} />
          <Input label="Discord Server Invite Code" placeholder="abcdefg" value={form.discord} onChange={set('discord')} />
          <Input label="Kaggle Username" placeholder="johndoe" value={form.kaggle} onChange={set('kaggle')} />
        </Section>

        {/* ── Projects ── */}
        <Section title="Projects" icon="🚀">
          <div className="space-y-4">
            {(form.projects || []).map((p, i) => (
              <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Project {i + 1}</span>
                  <button onClick={() => removeProject(i)} className="text-slate-500 hover:text-rose-400 transition-colors" type="button">
                    <Trash2 size={13} />
                  </button>
                </div>
                <Input placeholder="Project name *" value={p.name} onChange={v => updateProject(i, 'name', v)} />
                <Input placeholder="Short description..." value={p.description} onChange={v => updateProject(i, 'description', v)} textarea />
                <Input placeholder="Live URL (https://...)" value={p.liveUrl} onChange={v => updateProject(i, 'liveUrl', v)} />
                <Input placeholder="GitHub URL (https://...)" value={p.githubUrl} onChange={v => updateProject(i, 'githubUrl', v)} />
              </div>
            ))}
            <button
              onClick={addProject}
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-600 hover:border-violet-500 text-slate-400 hover:text-violet-400 rounded-lg py-2.5 text-sm transition-colors"
            >
              <Plus size={14} /> Add Project
            </button>
          </div>
        </Section>

        {/* ── Experience ── */}
        <Section title="Experience" icon="💼">
          <div className="space-y-4">
            {(form.experience || []).map((e, i) => (
              <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Experience {i + 1}</span>
                  <button onClick={() => removeExp(i)} className="text-slate-500 hover:text-rose-400 transition-colors" type="button">
                    <Trash2 size={13} />
                  </button>
                </div>
                <Input placeholder="Job Title / Role" value={e.role} onChange={v => updateExp(i, 'role', v)} />
                <Input placeholder="Company Name" value={e.company} onChange={v => updateExp(i, 'company', v)} />
                <Input placeholder="Period (e.g. Jan 2022 – Present)" value={e.period} onChange={v => updateExp(i, 'period', v)} />
                <Input placeholder="What did you do? Key achievements..." value={e.description} onChange={v => updateExp(i, 'description', v)} textarea />
              </div>
            ))}
            <button
              onClick={addExp}
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-600 hover:border-violet-500 text-slate-400 hover:text-violet-400 rounded-lg py-2.5 text-sm transition-colors"
            >
              <Plus size={14} /> Add Experience
            </button>
          </div>
        </Section>

        {/* ── GitHub Stats ── */}
        <Section title="GitHub Stats" icon="📊">
          {!hasGitHub && (
            <Hint>Enter your GitHub username in Social Links to enable stats cards.</Hint>
          )}
          <Toggle label="Stats Card" checked={form.showStats ?? true} onChange={set('showStats')} />
          <Toggle label="Streak Stats" checked={form.showStreak ?? true} onChange={set('showStreak')} />
          <Toggle label="Top Languages" checked={form.showTopLangs ?? true} onChange={set('showTopLangs')} />
          <Toggle label="Trophy Card" checked={form.showTrophies ?? false} onChange={set('showTrophies')} />
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Stats Theme</label>
            <select
              value={form.statsTheme || 'tokyonight'}
              onChange={e => set('statsTheme')(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            >
              {STATS_THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </Section>

        {/* ── Add-ons ── */}
        <Section title="Add-ons" icon="✨">
          {!hasGitHub && (
            <Hint>Visitor badge requires your GitHub username — set it in Social Links.</Hint>
          )}
          <Toggle
            label="Visitor Badge"
            checked={form.visitorBadge ?? true}
            onChange={set('visitorBadge')}
          />
          {hasGitHub && form.visitorBadge && (
            <div className="text-xs text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Active — will show on your README
            </div>
          )}
        </Section>

      </div>
    </aside>
  );
}
