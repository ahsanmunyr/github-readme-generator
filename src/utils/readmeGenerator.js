import { SKILLS, getSkillBadgeUrl } from './skillsData';

const ALL_SKILLS = Object.values(SKILLS).flat();

function getSkill(id) {
  return ALL_SKILLS.find(s => s.id === id);
}

const STATS_THEMES = {
  minimal: 'default', hacker: 'chartreuse-dark',
  gamer: 'synthwave', creative: 'radical', professional: 'default',
};

function statsTheme(form) {
  return form.statsTheme || 'tokyonight';
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function field(label, value) {
  if (!value?.trim()) return '';
  return `- 🔭 ${label} **${value}**`;
}

function socialBadge(label, color, logo, url) {
  if (!url) return '';
  return `[![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${color}?style=for-the-badge&logo=${logo}&logoColor=white)](${url})`;
}

function formatUrl(base, val) {
  if (!val) return '';
  if (val.startsWith('http')) return val;
  return `${base}${val}`;
}

// ── Sections ─────────────────────────────────────────────────────────────────

function buildHeader(form) {
  const name = form.name || 'Your Name';
  const tagline = form.tagline || '';

  return [
    `<div align="center">`,
    ``,
    `# Hi there 👋 I'm ${name}`,
    tagline ? `\n### ${tagline}` : '',
    ``,
    `</div>`,
  ].filter(l => l !== null).join('\n');
}

function buildAbout(form) {
  const lines = [];
  if (form.about?.trim()) {
    lines.push(form.about.trim());
    lines.push('');
  }

  const bullets = [
    form.currentlyWorking && `- 🔭 Currently working on **${form.currentlyWorking}**`,
    form.currentlyLearning && `- 🌱 Currently learning **${form.currentlyLearning}**`,
    form.collaborateOn && `- 👯 Looking to collaborate on **${form.collaborateOn}**`,
    form.askMeAbout && `- 💬 Ask me about **${form.askMeAbout}**`,
    form.email && `- 📫 Reach me at **${form.email}**`,
    form.portfolio && `- 🌐 Portfolio: [${form.portfolio}](${form.portfolio.startsWith('http') ? form.portfolio : 'https://' + form.portfolio})`,
    form.location && `- 📍 Based in **${form.location}**`,
    form.pronouns && `- 😄 Pronouns: **${form.pronouns}**`,
    form.funFact && `- ⚡ Fun fact: ${form.funFact}`,
  ].filter(Boolean);

  if (!lines.length && !bullets.length) return '';

  return [`## 👨‍💻 About Me`, '', ...lines, ...bullets].join('\n');
}

function buildSkills(form) {
  if (!form.skills?.length) return '';
  const badges = form.skills.map(id => {
    const skill = getSkill(id);
    if (!skill) return '';
    return `![${skill.label}](${getSkillBadgeUrl(skill)})`;
  }).filter(Boolean);

  if (!badges.length) return '';
  return `## 🛠️ Tech Stack\n\n<div align="center">\n\n${badges.join('\n')}\n\n</div>`;
}

function buildSocial(form) {
  const badges = [
    form.github && socialBadge('GitHub', '181717', 'github', formatUrl('https://github.com/', form.github)),
    form.linkedin && socialBadge('LinkedIn', '0A66C2', 'linkedin', formatUrl('https://linkedin.com/in/', form.linkedin)),
    form.twitter && socialBadge('Twitter', '1DA1F2', 'twitter', formatUrl('https://twitter.com/', form.twitter)),
    form.instagram && socialBadge('Instagram', 'E4405F', 'instagram', formatUrl('https://instagram.com/', form.instagram)),
    form.youtube && socialBadge('YouTube', 'FF0000', 'youtube', formatUrl('https://youtube.com/@', form.youtube)),
    form.devto && socialBadge('Dev.to', '0A0A0A', 'devdotto', formatUrl('https://dev.to/', form.devto)),
    form.medium && socialBadge('Medium', '12100E', 'medium', formatUrl('https://medium.com/@', form.medium)),
    form.hashnode && socialBadge('Hashnode', '2962FF', 'hashnode', formatUrl('https://hashnode.com/@', form.hashnode)),
    form.stackoverflow && socialBadge('Stack Overflow', 'FE7A16', 'stackoverflow', formatUrl('https://stackoverflow.com/users/', form.stackoverflow)),
    form.codepen && socialBadge('CodePen', '000000', 'codepen', formatUrl('https://codepen.io/', form.codepen)),
    form.discord && socialBadge('Discord', '5865F2', 'discord', formatUrl('https://discord.gg/', form.discord)),
    form.kaggle && socialBadge('Kaggle', '20BEFF', 'kaggle', formatUrl('https://kaggle.com/', form.kaggle)),
  ].filter(Boolean);

  if (!badges.length) return '';
  return `## 🌐 Connect With Me\n\n<div align="center">\n\n${badges.join('\n')}\n\n</div>`;
}

function buildProjects(form) {
  const projects = (form.projects || []).filter(p => p.name?.trim());
  if (!projects.length) return '';

  const items = projects.map(p => {
    const links = [];
    if (p.liveUrl) links.push(`[🌐 Live](${p.liveUrl})`);
    if (p.githubUrl) links.push(`[💻 Code](${p.githubUrl})`);
    const linkStr = links.length ? ` — ${links.join(' · ')}` : '';
    const desc = p.description?.trim() ? `\n  > ${p.description}` : '';
    return `- **${p.name}**${linkStr}${desc}`;
  });

  return `## 🚀 Projects\n\n${items.join('\n\n')}`;
}

function buildExperience(form) {
  const exp = (form.experience || []).filter(e => e.company?.trim() || e.role?.trim());
  if (!exp.length) return '';

  const items = exp.map(e => {
    const header = [e.role, e.company].filter(Boolean).join(' @ ');
    const period = e.period?.trim() ? ` *(${e.period})*` : '';
    const desc = e.description?.trim() ? `\n  ${e.description}` : '';
    return `- **${header}**${period}${desc}`;
  });

  return `## 💼 Experience\n\n${items.join('\n\n')}`;
}

function buildStats(form) {
  const u = form.github?.trim();
  if (!u) return '';
  if (!form.showStats && !form.showStreak && !form.showTopLangs && !form.showTrophies) return '';

  const t = statsTheme(form);
  const parts = [];

  if (form.showStats || form.showTopLangs) {
    const cards = [];
    if (form.showStats) cards.push(`<img src="https://github-readme-stats.vercel.app/api?username=${u}&show_icons=true&theme=${t}&hide_border=true&count_private=true" height="165" />`);
    if (form.showTopLangs) cards.push(`<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${u}&layout=compact&theme=${t}&hide_border=true" height="165" />`);
    parts.push(cards.join('\n'));
  }
  if (form.showStreak) {
    parts.push(`<img src="https://streak-stats.demolab.com?user=${u}&theme=${t}&hide_border=true" />`);
  }
  if (form.showTrophies) {
    parts.push(`<img src="https://github-profile-trophy.vercel.app/?username=${u}&theme=${t}&no-frame=true&row=1" />`);
  }

  return `## 📊 GitHub Stats\n\n<div align="center">\n\n${parts.join('\n\n')}\n\n</div>`;
}

function buildVisitorBadge(form) {
  const u = form.github?.trim();
  if (!u || !form.visitorBadge) return '';
  return `<div align="center">\n\n![Profile Views](https://komarev.com/ghpvc/?username=${u}&color=blueviolet&style=for-the-badge)\n\n</div>`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function generateReadme(form) {
  const sections = [
    buildVisitorBadge(form),
    buildHeader(form),
    buildAbout(form),
    buildSkills(form),
    buildExperience(form),
    buildProjects(form),
    buildStats(form),
    buildSocial(form),
  ].filter(Boolean);

  return sections.join('\n\n---\n\n');
}
