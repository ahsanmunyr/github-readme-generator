import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { SKILLS, getSkillBadgeUrl } from '../utils/skillsData';

const ALL_SKILLS = Object.entries(SKILLS).flatMap(([cat, skills]) =>
  skills.map(s => ({ ...s, category: cat }))
);

export default function SkillsPicker({ selected, onChange }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Object.keys(SKILLS)];

  const visible = ALL_SKILLS.filter(s => {
    const matchCat = activeCategory === 'All' || s.category === activeCategory;
    const matchSearch = !search || s.label.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggle = (id) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  const selectedSkills = ALL_SKILLS.filter(s => selected.includes(s.id));

  return (
    <div className="space-y-3">
      {/* Selected pills */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-slate-800/60 border border-slate-700/50 rounded-lg min-h-8">
          {selectedSkills.map(s => (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className="flex items-center gap-1 bg-violet-500/20 border border-violet-500/40 text-violet-300 text-xs px-2 py-0.5 rounded-full hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 transition-colors"
            >
              {s.label}
              <X size={10} />
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search skills..."
          className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-2 py-1 rounded-md transition-colors ${
              activeCategory === cat
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
        {visible.map(skill => {
          const isSelected = selected.includes(skill.id);
          return (
            <button
              key={skill.id}
              onClick={() => toggle(skill.id)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-medium transition-all text-left ${
                isSelected
                  ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                  : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0`} style={{ background: `#${skill.color.split('&')[0]}` }} />
              <span className="truncate">{skill.label}</span>
            </button>
          );
        })}
        {visible.length === 0 && (
          <p className="col-span-2 text-xs text-slate-500 text-center py-3">No skills found</p>
        )}
      </div>

      {selected.length > 0 && (
        <button
          onClick={() => onChange([])}
          className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
        >
          Clear all ({selected.length})
        </button>
      )}
    </div>
  );
}
