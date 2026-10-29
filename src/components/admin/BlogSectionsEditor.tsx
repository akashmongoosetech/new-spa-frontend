import React from 'react';
import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2 } from 'lucide-react';
import { BlogSection } from '../../types';
import { TipTapEditor } from './TipTapEditor';

interface BlogSectionsEditorProps {
  sections: BlogSection[];
  onChange: (sections: BlogSection[]) => void;
  disabled?: boolean;
}

function newSectionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `section-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const BlogSectionsEditor: React.FC<BlogSectionsEditorProps> = ({ sections, onChange, disabled = false }) => {
  const update = (index: number, patch: Partial<BlogSection>) => {
    onChange(sections.map((section, i) => (i === index ? { ...section, ...patch } : section)));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((section, order) => ({ ...section, order })));
  };

  const add = () => {
    onChange([
      ...sections,
      { id: newSectionId(), heading: '', content: '', order: sections.length },
    ]);
  };

  const remove = (index: number) => {
    onChange(sections.filter((_, i) => i !== index).map((section, order) => ({ ...section, order })));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">Optional sections</h3>
          <p className="mt-1 text-[11px] text-gray-500">
            Sections appear in this exact order after the main article content. Use them for FAQs, checklists, cautions or quick summaries.
          </p>
        </div>
        <button
          type="button"
          onClick={add}
          disabled={disabled || sections.length >= 100}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#BFA476]/40 bg-brand-50 px-3.5 py-2 text-xs font-bold text-[var(--brand-ink)] hover:bg-brand-100 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Add section
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-xs text-gray-500">
          No extra sections. The article will render the main content only.
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={section.id || index} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                  <GripVertical className="h-4 w-4 text-gray-300" />
                  Section {index + 1}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={disabled || index === 0}
                    title="Move section up"
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[var(--brand-ink)] disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={disabled || index === sections.length - 1}
                    title="Move section down"
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[var(--brand-ink)] disabled:opacity-30"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={disabled}
                    title="Remove section"
                    className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase text-gray-600">Section heading</label>
                  <input
                    type="text"
                    value={section.heading}
                    maxLength={300}
                    disabled={disabled}
                    onChange={(event) => update(index, { heading: event.target.value })}
                    placeholder="e.g. When to choose this therapy"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-[#BFA476] focus:outline-none focus:ring-1 focus:ring-[#BFA476]"
                  />
                </div>
                <TipTapEditor
                  value={section.content}
                  onChange={(content) => update(index, { content })}
                  placeholder="Add supporting content for this section..."
                  disabled={disabled}
                  minHeight="180px"
                  compact
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogSectionsEditor;
