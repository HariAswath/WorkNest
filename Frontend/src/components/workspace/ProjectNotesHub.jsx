import React, { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { noteApi } from '../../api/note.api';
import MarkdownRenderer from './MarkdownRenderer';
import {
  FileText,
  Plus,
  Search,
  Save,
  Trash2,
  Edit3,
  Eye,
  Columns,
  Code,
  Bold,
  Italic,
  List,
  CheckSquare,
  Heading1,
  Heading2,
  Quote,
  Clock,
  User,
  Check,
  AlertCircle,
  Download,
  Copy,
  Loader2,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

const ProjectNotesHub = forwardRef(function ProjectNotesHub(
  { projectId, userRole, canManageNotes: propCanManageNotes, currentUser, searchQuery = '' },
  ref
) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Controls whether the editor is open or the saved files list is shown
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // Editor states
  const [editorContent, setEditorContent] = useState('');
  const [viewMode, setViewMode] = useState('split'); // 'edit', 'preview', 'split'
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'unsaved', 'saving'
  const [copyNotification, setCopyNotification] = useState(false);

  const isNotesAdmin = propCanManageNotes !== undefined ? propCanManageNotes : (userRole === 'admin');

  // Load real notes from backend API
  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      if (/^[0-9a-fA-F]{24}$/.test(projectId)) {
        const res = await noteApi.getNotes(projectId);
        const data = res.data || [];
        setNotes(data);
      } else {
        setNotes([]);
      }
    } catch (err) {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchNotes();
    }
  }, [projectId]);

  // Selected note object
  const activeNote = useMemo(() => {
    return notes.find((n) => n._id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  // Open note in editor / viewer
  const handleOpenNote = (note) => {
    setSelectedNoteId(note._id);
    setEditorContent(note.content || '');
    setSaveStatus('saved');
    setViewMode(isNotesAdmin ? 'split' : 'preview');
    setIsEditorOpen(true);
  };

  // Content change in editor
  const handleContentChange = (newVal) => {
    if (!isNotesAdmin) return;
    setEditorContent(newVal);
    setSaveStatus('unsaved');
  };

  // Create new note and open editor
  const handleCreateNewNote = () => {
    if (!isNotesAdmin) return;
    const defaultTemplate = `# New Specification\n\nWrite your specification, architecture notes, or requirements here...`;
    const tempId = `temp_${Date.now()}`;
    const newNoteObj = {
      _id: tempId,
      content: defaultTemplate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser || { username: 'user' },
    };

    setNotes((prev) => [newNoteObj, ...prev]);
    setSelectedNoteId(tempId);
    setEditorContent(defaultTemplate);
    setSaveStatus('unsaved');
    setViewMode('edit');
    setIsEditorOpen(true);
  };

  // Expose createNewNote method to parent ProjectWorkspacePage navbar
  useImperativeHandle(ref, () => ({
    createNewNote: handleCreateNewNote,
  }));

  // Save note & close editor to return to saved files view
  const handleSaveNote = async () => {
    if (!activeNote) return;
    setSaving(true);
    setSaveStatus('saving');

    const updatedTimestamp = new Date().toISOString();

    // Optimistically update in local state
    setNotes((prev) =>
      prev.map((n) =>
        n._id === activeNote._id ? { ...n, content: editorContent, updatedAt: updatedTimestamp } : n
      )
    );

    try {
      if (/^[0-9a-fA-F]{24}$/.test(projectId)) {
        if (/^[0-9a-fA-F]{24}$/.test(activeNote._id)) {
          // Existing MongoDB note
          await noteApi.updateNote(projectId, activeNote._id, { content: editorContent });
        } else {
          // New note, persist to backend
          const res = await noteApi.createNote(projectId, { content: editorContent });
          if (res?.data) {
            const savedNote = res.data;
            setNotes((prev) =>
              prev.map((n) => (n._id === activeNote._id ? savedNote : n))
            );
          }
        }
      }
    } catch (err) {
      // Keep optimistic state
    } finally {
      setSaving(false);
      setSaveStatus('saved');
      // Completely close the editor and show the saved files list
      setIsEditorOpen(false);
      setSelectedNoteId(null);
    }
  };

  // Delete note
  const handleDeleteNote = async (e, noteToDelete) => {
    if (e) e.stopPropagation();
    const target = noteToDelete || activeNote;
    if (!target) return;
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      if (/^[0-9a-fA-F]{24}$/.test(projectId) && /^[0-9a-fA-F]{24}$/.test(target._id)) {
        await noteApi.deleteNote(projectId, target._id);
      }
    } catch (err) {
      // Ignored
    }

    const updated = notes.filter((n) => n._id !== target._id);
    setNotes(updated);
    if (activeNote?._id === target._id) {
      setIsEditorOpen(false);
      setSelectedNoteId(null);
      setEditorContent('');
    }
  };

  // Formatting helpers for editor
  const insertFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('note-markdown-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent =
      editorContent.substring(0, start) + replacement + editorContent.substring(end);
    handleContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  // Download raw markdown file
  const handleExportMarkdown = (e, noteToExport) => {
    if (e) e.stopPropagation();
    const target = noteToExport || activeNote;
    if (!target) return;
    const content = target.content || editorContent;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `spec-${target._id.slice(-6)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy raw content
  const handleCopyRaw = () => {
    navigator.clipboard.writeText(editorContent);
    setCopyNotification(true);
    setTimeout(() => setCopyNotification(false), 2000);
  };

  // Filter notes by search query passed from parent project navbar
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    return notes.filter((note) =>
      note.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

  // Extract title from first heading
  const getNoteTitle = (content = '') => {
    const firstLine = content.split('\n').find((l) => l.startsWith('# '));
    if (firstLine) return firstLine.replace('# ', '').trim();
    const secondLine = content.split('\n').find((l) => l.trim().length > 0);
    return secondLine ? secondLine.slice(0, 40) : 'Untitled Document';
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-medium">Loading workspace documents...</p>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: EDITOR / VIEWER MODE (When open)
  // ==========================================
  if (isEditorOpen && activeNote) {
    return (
      <div className="space-y-4">
        {/* Editor Top Navigation Bar */}
        <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#16181d] border border-white/5 shadow-sm w-full overflow-x-auto">
          {/* Left: Back Button */}
          <button
            onClick={() => {
              setIsEditorOpen(false);
              setSelectedNoteId(null);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#232630] hover:bg-[#2b2f3d] border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Notes</span>
          </button>

          {/* Center: View Mode Switches */}
          {isNotesAdmin ? (
            <div className="flex items-center bg-[#111216] rounded-xl p-1 border border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'edit' ? 'bg-[#232630] text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'split' ? 'bg-[#232630] text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'preview' ? 'bg-[#232630] text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-slate-300 font-semibold">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Document Reader (Read-Only)</span>
            </div>
          )}

          {/* Right: Actions (Copy, Export, Save & Close, Delete) */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <button
              type="button"
              onClick={handleCopyRaw}
              title="Copy Markdown"
              className="p-2 rounded-xl bg-[#111216] hover:bg-[#232630] border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              {copyNotification ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={(e) => handleExportMarkdown(e, activeNote)}
              title="Download .md file"
              className="p-2 rounded-xl bg-[#111216] hover:bg-[#232630] border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Save & Close Button (Admin only) */}
            {isNotesAdmin && (
              <button
                type="button"
                onClick={handleSaveNote}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save & Close</span>
              </button>
            )}

            {isNotesAdmin && (
              <button
                type="button"
                onClick={(e) => handleDeleteNote(e, activeNote)}
                title="Delete document"
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Editor Box */}
        <div className="rounded-2xl bg-[#16181d] border border-white/5 shadow-sm overflow-hidden flex flex-col min-h-[580px]">
          {/* Formatting Helper Toolbar (Admin only) */}
          {isNotesAdmin && viewMode !== 'preview' && (
            <div className="px-4 py-2 bg-[#111216] border-b border-white/5 flex flex-wrap items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => insertFormatting('**', '**')}
                className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-colors text-xs font-bold cursor-pointer"
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('*', '*')}
                className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-colors text-xs italic cursor-pointer"
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('# ')}
                className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-colors text-xs cursor-pointer"
                title="Heading 1"
              >
                <Heading1 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('## ')}
                className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-colors text-xs cursor-pointer"
                title="Heading 2"
              >
                <Heading2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('`', '`')}
                className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-colors text-xs cursor-pointer"
                title="Inline Code"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('- ')}
                className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-colors text-xs cursor-pointer"
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('- [ ] ')}
                className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-colors text-xs cursor-pointer"
                title="Task Checklist"
              >
                <CheckSquare className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('> ')}
                className="p-1.5 hover:bg-white/5 hover:text-white rounded transition-colors text-xs cursor-pointer"
                title="Quote"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Split / Edit / Preview Workspace */}
          {!isNotesAdmin ? (
            <div className="p-8 bg-[#16181d] overflow-y-auto max-h-[700px]">
              <MarkdownRenderer content={editorContent} />
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5 min-h-[500px]">
              {/* Editor Column */}
              {(viewMode === 'edit' || viewMode === 'split') && (
                <div className={`${viewMode === 'edit' ? 'col-span-2' : ''} flex flex-col bg-[#111216]`}>
                  <textarea
                    id="note-markdown-textarea"
                    value={editorContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Type Markdown content here..."
                    className="w-full flex-1 p-5 bg-transparent text-slate-200 font-mono text-xs focus:outline-none resize-none leading-relaxed selection:bg-white/20 min-h-[460px]"
                  />
                </div>
              )}

              {/* Preview Column */}
              {(viewMode === 'preview' || viewMode === 'split') && (
                <div className={`${viewMode === 'preview' ? 'col-span-2' : ''} p-6 bg-[#16181d] overflow-y-auto max-h-[640px]`}>
                  <MarkdownRenderer content={editorContent} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: SAVED FILES / NOTES LIST VIEW
  // ==========================================
  return (
    <div className="space-y-5">
      {/* Empty State when no notes exist */}
      {notes.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#16181d] border border-white/5 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#232630] border border-white/10 flex items-center justify-center text-slate-400 mx-auto shadow-sm">
            <FileText className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-sm font-bold text-white">No documents created yet</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {isNotesAdmin
                ? 'Create your first specification, architecture doc, or PRD note to store in this workspace.'
                : 'No specifications or notes have been published to this workspace yet.'}
            </p>
          </div>
          {isNotesAdmin && (
            <button
              onClick={handleCreateNewNote}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Create First Note</span>
            </button>
          )}
        </div>
      ) : (
        /* Saved Documents Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full p-8 text-center rounded-2xl bg-[#16181d] border border-white/5 text-xs text-slate-500">
              No saved documents match "{searchQuery}".
            </div>
          ) : (
            filteredNotes.map((note) => {
              const title = getNoteTitle(note.content);
              const wordCount = (note.content || '').trim().split(/\s+/).filter(Boolean).length;
              const previewSnippet =
                (note.content || '').replace(/^#+.*$/gm, '').trim() || 'No preview text available...';

              return (
                <div
                  key={note._id}
                  onClick={() => handleOpenNote(note)}
                  className="p-5 rounded-2xl bg-[#16181d] hover:bg-[#1a1c23] border border-white/5 hover:border-white/15 transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    {/* Card Header: Icon + Title + Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[#232630] border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="text-xs font-bold text-white group-hover:text-slate-200 truncate transition-colors">
                          {title}
                        </h3>
                      </div>

                      {/* Delete Button (Admin only) */}
                      {isNotesAdmin && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteNote(e, note)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Content Snippet */}
                    <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                      {previewSnippet}
                    </p>
                  </div>

                  {/* Card Footer: Metadata + Open Chevron */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{note.createdBy?.username || 'User'}</span>
                      </span>
                      <span>•</span>
                      <span>{wordCount} words</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-white font-medium text-[11px] transition-colors">
                      <span>Open</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
});

export default ProjectNotesHub;
