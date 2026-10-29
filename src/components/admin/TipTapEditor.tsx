import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import {
  BackgroundColor,
  Color,
  FontFamily,
  FontSize,
  LineHeight,
  TextStyle,
} from '@tiptap/extension-text-style';
import { common, createLowlight } from 'lowlight';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Columns3,
  Eraser,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Palette,
  Quote,
  Redo2,
  Rows3,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table2,
  Trash2,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
} from 'lucide-react';

const lowlight = createLowlight(common);

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onFocus?: () => void;
  minHeight?: string;
  compact?: boolean;
}

function isSafeEditorUrl(value: string): boolean {
  const url = value.trim();
  return /^(https?:\/\/|\/(?!\/)|mailto:|tel:|#)/i.test(url);
}

const ToolbarButton: React.FC<{
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}> = ({ onClick, active = false, disabled = false, title, children }) => (
  <button
    type="button"
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
    aria-pressed={active}
    className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
      active
        ? 'bg-brand-500 text-brand-950 shadow-sm'
        : 'text-gray-600 hover:bg-white hover:text-[var(--brand-ink)]'
    }`}
  >
    {children}
  </button>
);

const Divider: React.FC = () => <span className="mx-1 h-6 w-px shrink-0 bg-gray-300" />;

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  className = '',
  onFocus,
  minHeight = '300px',
  compact = false,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        link: {
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
          HTMLAttributes: {
            class: 'text-[var(--brand-ink)] underline underline-offset-2',
            rel: 'noopener noreferrer',
          },
        },
      }),
      Placeholder.configure({ placeholder: placeholder || 'Start writing...' }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: { class: 'max-w-full h-auto rounded-lg', loading: 'lazy' },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CodeBlockLowlight.configure({ lowlight }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      BackgroundColor,
      FontFamily,
      FontSize,
      LineHeight,
      Subscript,
      Superscript,
    ],
    content: value || '',
    editable: !disabled,
    editorProps: {
      attributes: {
        class: 'p-4 focus:outline-none',
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.isEmpty ? '' : current.getHTML());
    },
    onFocus: () => onFocus?.(),
  });

  // The edit form loads its record asynchronously. Tiptap only reads `content`
  // on creation, so push later values into the instance without emitting an
  // update (which would fight the parent form state and reset the cursor).
  useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? '' : editor.getHTML();
    if (current === (value || '')) return;
    editor.commands.setContent(value || '', { emitUpdate: false });
  }, [editor, value]);

  useEffect(() => {
    if (editor) editor.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) {
    return (
      <div className={`rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-500 ${className}`}>
        Loading editor...
      </div>
    );
  }

  const setLink = () => {
    const previous = editor.getAttributes('link').href || '';
    const url = window.prompt('Link URL (https://, mailto:, tel: or a site path)', previous || 'https://');
    if (url === null) return;
    const trimmed = url.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    if (!isSafeEditorUrl(trimmed)) {
      window.alert('Enter a safe URL beginning with https://, http://, mailto:, tel:, # or /.');
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: trimmed }).run();
  };

  const insertImage = () => {
    const url = window.prompt('Image URL (https:// or a site path beginning with /)', 'https://');
    if (url === null) return;
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!isSafeEditorUrl(trimmed)) {
      window.alert('Enter a safe image URL beginning with https://, http:// or /.');
      return;
    }
    const alt = window.prompt('Image alt text (required for accessibility)', '') || '';
    editor.chain().focus().setImage({ src: trimmed, alt }).run();
  };

  const textStyle = editor.getAttributes('textStyle');
  const headingLevel = editor.isActive('heading') ? editor.getAttributes('heading').level : '';

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-xs font-bold uppercase text-gray-700">
          {label}
        </label>
      )}

      <div className="rounded-t-xl border border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 p-2">
          <select
            aria-label="Text style"
            title="Text style"
            value={headingLevel || 'p'}
            disabled={disabled}
            onChange={(event) => {
              const level = Number(event.target.value);
              if (level) editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
              else editor.chain().focus().setParagraph().run();
            }}
            className="h-8 rounded-lg border border-gray-300 bg-white px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#BFA476]"
          >
            <option value="p">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
          </select>

          {!compact && (
            <>
              <select
                aria-label="Font family"
                title="Font family"
                value={textStyle.fontFamily || ''}
                disabled={disabled}
                onChange={(event) => {
                  if (event.target.value) editor.chain().focus().setFontFamily(event.target.value).run();
                  else editor.chain().focus().unsetFontFamily().run();
                }}
                className="h-8 max-w-28 rounded-lg border border-gray-300 bg-white px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#BFA476]"
              >
                <option value="">Font</option>
                <option value="'Plus Jakarta Sans', sans-serif">Sans</option>
                <option value="'Playfair Display', Georgia, serif">Serif</option>
                <option value="'Cormorant Garamond', Georgia, serif">Display</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Arial, Helvetica, sans-serif">Arial</option>
              </select>

              <select
                aria-label="Font size"
                title="Font size"
                value={textStyle.fontSize || ''}
                disabled={disabled}
                onChange={(event) => {
                  if (event.target.value) editor.chain().focus().setFontSize(event.target.value).run();
                  else editor.chain().focus().unsetFontSize().run();
                }}
                className="h-8 rounded-lg border border-gray-300 bg-white px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#BFA476]"
              >
                <option value="">Size</option>
                {['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '40px'].map((size) => (
                  <option key={size} value={size}>{size.replace('px', '')}</option>
                ))}
              </select>

              <select
                aria-label="Line height"
                title="Line spacing"
                value={textStyle.lineHeight || ''}
                disabled={disabled}
                onChange={(event) => {
                  if (event.target.value) editor.chain().focus().setLineHeight(event.target.value).run();
                  else editor.chain().focus().unsetLineHeight().run();
                }}
                className="h-8 rounded-lg border border-gray-300 bg-white px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#BFA476]"
              >
                <option value="">Spacing</option>
                <option value="1.2">1.2</option>
                <option value="1.4">1.4</option>
                <option value="1.6">1.6</option>
                <option value="1.8">1.8</option>
                <option value="2">2.0</option>
              </select>
            </>
          )}

          <Divider />

          <ToolbarButton title="Bold" active={editor.isActive('bold')} disabled={disabled} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Italic" active={editor.isActive('italic')} disabled={disabled} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Underline" active={editor.isActive('underline')} disabled={disabled} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Strikethrough" active={editor.isActive('strike')} disabled={disabled} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Highlight" active={editor.isActive('highlight')} disabled={disabled} onClick={() => editor.chain().focus().toggleHighlight({ color: '#f5ede0' }).run()}>
            <Highlighter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Subscript" active={editor.isActive('subscript')} disabled={disabled} onClick={() => editor.chain().focus().toggleSubscript().run()}>
            <SubscriptIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Superscript" active={editor.isActive('superscript')} disabled={disabled} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
            <SuperscriptIcon className="h-4 w-4" />
          </ToolbarButton>

          {!compact && (
            <>
              <label className="ml-1 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-600 hover:bg-white" title="Text colour">
                <Palette className="h-4 w-4" />
                <input
                  type="color"
                  aria-label="Text colour"
                  value={textStyle.color || '#523f28'}
                  disabled={disabled}
                  onChange={(event) => editor.chain().focus().setColor(event.target.value).run()}
                  className="sr-only"
                />
              </label>
              <label className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-600 hover:bg-white" title="Highlight colour">
                <span className="h-4 w-4 rounded border border-gray-400 bg-[#f5ede0]" />
                <input
                  type="color"
                  aria-label="Highlight colour"
                  value={textStyle.backgroundColor || '#f5ede0'}
                  disabled={disabled}
                  onChange={(event) => editor.chain().focus().setBackgroundColor(event.target.value).run()}
                  className="sr-only"
                />
              </label>
            </>
          )}

          <Divider />

          <ToolbarButton title="Align left" active={editor.isActive({ textAlign: 'left' })} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Align centre" active={editor.isActive({ textAlign: 'center' })} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Align right" active={editor.isActive({ textAlign: 'right' })} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Justify" active={editor.isActive({ textAlign: 'justify' })} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
            <AlignJustify className="h-4 w-4" />
          </ToolbarButton>

          <Divider />

          <ToolbarButton title="Bullet list" active={editor.isActive('bulletList')} disabled={disabled} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Numbered list" active={editor.isActive('orderedList')} disabled={disabled} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Blockquote" active={editor.isActive('blockquote')} disabled={disabled} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Code block" active={editor.isActive('codeBlock')} disabled={disabled} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <Code2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Horizontal rule" disabled={disabled} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Minus className="h-4 w-4" />
          </ToolbarButton>

          <Divider />

          <ToolbarButton title="Add or edit link" active={editor.isActive('link')} disabled={disabled} onClick={setLink}>
            <Link2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Remove link" disabled={disabled || !editor.isActive('link')} onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}>
            <Unlink className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Insert image from URL" disabled={disabled} onClick={insertImage}>
            <ImagePlus className="h-4 w-4" />
          </ToolbarButton>

          <Divider />

          <ToolbarButton title="Insert table" disabled={disabled} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
            <Table2 className="h-4 w-4" />
          </ToolbarButton>
          {editor.isActive('table') && (
            <>
              <ToolbarButton title="Add row" disabled={disabled} onClick={() => editor.chain().focus().addRowAfter().run()}>
                <Rows3 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton title="Add column" disabled={disabled} onClick={() => editor.chain().focus().addColumnAfter().run()}>
                <Columns3 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton title="Delete table" disabled={disabled} onClick={() => editor.chain().focus().deleteTable().run()}>
                <Trash2 className="h-4 w-4" />
              </ToolbarButton>
            </>
          )}

          <Divider />

          <ToolbarButton title="Undo" disabled={disabled || !editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            <Undo2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Redo" disabled={disabled || !editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            <Redo2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Clear formatting"
            disabled={disabled}
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          >
            <Eraser className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      <div className="rounded-b-xl border border-t-0 border-gray-200 bg-white">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none focus:outline-none"
        />
      </div>
      <p className="mt-1 text-[10px] text-gray-400">
        Add descriptive alt text to every image. Use headings in order and avoid pasting scripts or unsupported widgets.
      </p>
    </div>
  );
};

export default TipTapEditor;
