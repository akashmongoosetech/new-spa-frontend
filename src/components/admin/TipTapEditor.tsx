import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onFocus?: () => void;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  className = '',
  onFocus,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({ placeholder: placeholder || 'Start writing...' }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-[#2CB5A0] underline hover:text-[#259b89]' },
      }),
      Image.configure({ HTMLAttributes: { class: 'max-w-full h-auto rounded-lg' } }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Underline,
      Strike,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CodeBlockLowlight.configure({ lowlight }),
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    onFocus: () => onFocus?.(),
  });

  if (!editor) return null;

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="border border-gray-200 rounded-t-xl bg-gray-50 p-2 space-y-1">
        <div className="flex flex-wrap gap-1">
          <select
            value={editor.isActive('heading') ? editor.getAttributes('heading').level : ''}
            onChange={(e) => {
              const level = parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6;
              if (level) editor.chain().focus().toggleHeading({ level }).run();
              else editor.chain().focus().setParagraph().run();
            }}
            disabled={disabled}
            className="px-2 py-1 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2CB5A0]"
          >
            <option value="">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
            <option value="5">Heading 5</option>
            <option value="6">Heading 6</option>
          </select>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={disabled || !editor.can().chain().focus().toggleBold().run()}
            className={`px-2 py-1 text-xs rounded ${editor.isActive('bold') ? 'bg-[#2CB5A0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={disabled || !editor.can().chain().focus().toggleItalic().run()}
            className={`px-2 py-1 text-xs rounded ${editor.isActive('italic') ? 'bg-[#2CB5A0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={disabled || !editor.can().chain().focus().toggleUnderline().run()}
            className={`px-2 py-1 text-xs rounded ${editor.isActive('underline') ? 'bg-[#2CB5A0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Underline"
          >
            <u>U</u>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={disabled || !editor.can().chain().focus().toggleStrike().run()}
            className={`px-2 py-1 text-xs rounded ${editor.isActive('strike') ? 'bg-[#2CB5A0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            disabled={disabled || !editor.can().chain().focus().toggleHighlight().run()}
            className={`px-2 py-1 text-xs rounded ${editor.isActive('highlight') ? 'bg-[#2CB5A0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Highlight"
          >
            <mark>H</mark>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            disabled={disabled || !editor.can().chain().focus().setTextAlign('left').run()}
            className={`px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-[#2CB5A0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Align Left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h13M3 12h13M3 16h13" /></svg>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            disabled={disabled || !editor.can().chain().focus().setTextAlign('center').run()}
            className={`px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-[#2CB5A0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Align Center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4h6M9 8h6M9 12h6M9 16h6" /></svg>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            disabled={disabled || !editor.can().chain().focus().setTextAlign('right').run()}
            className={`px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-[#2CB5A0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Align Right"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4h13M8 8h13M8 12h13M8 16h13" /></svg>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            disabled={disabled || !editor.can().chain().focus().setTextAlign('justify').run()}
            className={`px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-[#2CB5A0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Justify"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 8h18M3 12h18M3 16h18" /></svg>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={disabled || !editor.can().chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 text-xs rounded ${editor.isActive('bulletList') ? 'bg-[#2CB5A0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Bullet List"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11h14M5 11l-1.5 1.5M5 11l-1.5 -1.5M5 6h14M5 6l-1.5 1.5M5 6l-1.5 -1.5M5 16h14M5 16l-1.5 1.5M5 16l-1.5 -1.5" /></svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={disabled || !editor.can().chain().focus().toggleOrderedList().run()}
            className={`px-2 py-1 text-xs rounded ${editor.isActive('orderedList') ? 'bg-[#2CB5A0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Numbered List"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9h18M3 15h18M3 3h18M3 21h18" /></svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            disabled={disabled || !editor.can().chain().focus().toggleTaskList().run()}
            className={`px-2 py-1 text-xs rounded ${editor.isActive('taskList') ? 'bg-[#2CB5A0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Task List"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={disabled || !editor.can().chain().focus().toggleBlockquote().run()}
            className={`px-2 py-1 text-xs rounded ${editor.isActive('blockquote') ? 'bg-[#2CB5A0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Blockquote"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={disabled || !editor.can().chain().focus().toggleCodeBlock().run()}
            className={`px-2 py-1 text-xs rounded ${editor.isActive('codeBlock') ? 'bg-[#2CB5A0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Code Block"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            disabled={disabled}
            className="px-2 py-1 text-xs rounded text-gray-600 hover:bg-gray-100"
            title="Insert Table"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 18h18M3 6h18v12H3V6z" /></svg>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            onClick={() => {
              const url = window.prompt('Enter URL:', 'https://');
              if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }}
            disabled={disabled || !editor.can().chain().focus().setLink({ href: '#' }).run()}
            className={`px-2 py-1 text-xs rounded ${editor.isActive('link') ? 'bg-[#2CB5A0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Add Link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={disabled || !editor.can().undo()}
            className="px-2 py-1 text-xs rounded text-gray-600 hover:bg-gray-100"
            title="Undo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={disabled || !editor.can().redo()}
            className="px-2 py-1 text-xs rounded text-gray-600 hover:bg-gray-100"
            title="Redo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>
          </button>
          <button
            onClick={() => editor.chain().focus().clearNodes().run()}
            disabled={disabled}
            className="px-2 py-1 text-xs rounded text-gray-600 hover:bg-gray-100"
            title="Clear Formatting"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <div className="border border-gray-200 border-t-0 rounded-b-xl bg-white min-h-[200px]">
        <EditorContent editor={editor} className="prose prose-sm max-w-none p-4 focus:outline-none min-h-[200px]" />
      </div>
    </div>
  );
};

export default TipTapEditor;