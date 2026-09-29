import React, { useEffect, useState } from 'react';
import {
  Bot,
  Database,
  FlaskConical,
  RefreshCw,
  Trash2,
  Activity,
  AlertTriangle,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../services/api';
import { showToast } from '../../utils/toastEvents';
import { DeleteModal } from '../../components/ui/DeleteModal';

interface RagSource {
  source: string;
  chunks: number;
  updatedAt: string | null;
  status: string;
}

interface TestChunk {
  title: string;
  source: string;
  category: string;
  url: string;
  score: number;
  excerpt: string;
}

interface ReviewItem {
  id: string;
  conversationId: string;
  question: string;
  answer: string;
  confidence: number;
  createdAt: string;
}

export const AdminRagPage: React.FC = () => {
  const [sources, setSources] = useState<RagSource[]>([]);
  const [usage, setUsage] = useState<Record<string, string | number> | null>(null);
  const [review, setReview] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reindexing, setReindexing] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [testQuery, setTestQuery] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ usedVector: boolean; threshold: number; chunks: TestChunk[] } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [s, u, r] = await Promise.all([
        api.getRagSources(),
        api.getRagUsage(),
        api.getRagReview(20),
      ]);
      setSources(s.sources);
      setUsage(u as unknown as Record<string, string | number>);
      setReview(r.items);
    } catch (err) {
      showToast({ type: 'error', title: 'Load failed', message: 'Could not load RAG status.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleReindex = async (source?: string) => {
    setReindexing(source || 'all');
    try {
      await api.reindexRag(source);
      showToast({ type: 'success', title: 'Reindex started', message: source ? `${source} reindexed.` : 'All sources reindexed.' });
      await load();
    } catch (err: unknown) {
      showToast({ type: 'error', title: 'Reindex failed', message: err instanceof Error ? err.message : 'Could not reindex.' });
    } finally {
      setReindexing(null);
    }
  };

  const handleDeleteSource = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteRagSource(deleteTarget);
      setDeleteTarget(null);
      await load();
      showToast({ type: 'info', title: 'Source cleared', message: `${deleteTarget} chunks removed.` });
    } catch (err: unknown) {
      showToast({ type: 'error', title: 'Delete failed', message: err instanceof Error ? err.message : 'Could not clear source.' });
      throw err;
    }
  };

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) return;
    setTesting(true);
    setTestResult(null);
    try {
      const r = await api.testRagRetrieval(testQuery.trim());
      setTestResult({ usedVector: r.usedVector, threshold: r.threshold, chunks: r.chunks });
    } catch (err: unknown) {
      showToast({ type: 'error', title: 'Test failed', message: err instanceof Error ? err.message : 'Retrieval test failed.' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">AI Knowledge Base</h1>
          <p className="text-xs text-gray-500 mt-1">Vector sources, reindexing, retrieval tests and chat quality</p>
        </div>
        <button
          onClick={() => handleReindex()}
          disabled={reindexing !== null}
          className="px-4 py-2.5 bg-[#2CB5A0] hover:bg-[#259b89] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${reindexing ? 'animate-spin' : ''}`} />
          {reindexing ? 'Reindexing…' : 'Reindex All'}
        </button>
      </div>

      {usage && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Answers (7d)', value: usage.answers7d, icon: Bot },
            { label: 'Low-confidence (7d)', value: usage.lowConfidence7d, icon: AlertTriangle },
            { label: 'Tokens (7d)', value: usage.tokens7d, icon: Activity },
            { label: 'Avg latency', value: `${usage.avgLatencyMs} ms`, icon: FileText },
          ].map((c) => (
            <div key={c.label} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <c.icon className="w-4 h-4 text-[#2CB5A0]" />
                <span className="text-[11px] font-bold uppercase tracking-wider">{c.label}</span>
              </div>
              <p className="mt-1 text-xl font-bold text-gray-900">{String(c.value)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#2CB5A0]" />
          <h2 className="text-sm font-bold text-gray-900">Knowledge sources</h2>
        </div>
        {loading ? (
          <p className="p-6 text-xs text-gray-500">Loading sources…</p>
        ) : sources.length === 0 ? (
          <p className="p-6 text-xs text-gray-500">No sources indexed yet. Run a reindex.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {sources.map((s) => (
              <li key={s.source} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 capitalize">{s.source}</p>
                  <p className="text-[11px] text-gray-500">
                    {s.chunks} chunks
                    {s.updatedAt ? ` · updated ${new Date(s.updatedAt).toLocaleString()}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                      s.status === 'indexed'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}
                  >
                    {s.status}
                  </span>
                  <button
                    onClick={() => handleReindex(s.source)}
                    disabled={reindexing !== null}
                    title={`Reindex ${s.source}`}
                    aria-label={`Reindex ${s.source}`}
                    className="p-2 rounded-lg text-gray-500 hover:text-[#2CB5A0] hover:bg-teal-50 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${reindexing === s.source ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(s.source)}
                    title={`Clear ${s.source}`}
                    aria-label={`Clear ${s.source} chunks`}
                    className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-[#2CB5A0]" /> Retrieval test
        </h2>
        <form onSubmit={handleTest} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="e.g. What is the price of Swedish massage?"
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2CB5A0] focus:ring-1 focus:ring-[#2CB5A0]"
          />
          <button
            type="submit"
            disabled={testing || !testQuery.trim()}
            className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-black text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            {testing ? 'Testing…' : 'Run Test'}
          </button>
        </form>
        {testResult && (
          <div className="space-y-2">
            <p className="text-[11px] text-gray-500">
              {testResult.usedVector ? 'Vector search' : 'Keyword fallback'} · threshold {testResult.threshold} ·{' '}
              {testResult.chunks.length} chunk(s)
            </p>
            {testResult.chunks.map((c, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-bold text-gray-900">
                  {c.title}{' '}
                  <span className="ml-1 font-mono text-[10px] text-teal-700">
                    {(c.score || 0).toFixed(3)}
                  </span>
                </p>
                <p className="text-[11px] text-gray-500">
                  {c.source} · {c.category}
                </p>
                <p className="mt-1 text-xs text-gray-600 line-clamp-2">{c.excerpt}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-bold text-gray-900">Low-confidence review</h2>
        </div>
        {review.length === 0 ? (
          <p className="p-6 text-xs text-gray-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No low-confidence answers. The assistant is well grounded.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {review.map((r) => (
              <li key={r.id} className="p-4 space-y-1">
                <p className="text-xs font-bold text-gray-900">Q: {r.question}</p>
                <p className="text-xs text-gray-600 line-clamp-2">A: {r.answer}</p>
                <p className="text-[10px] text-gray-400">
                  confidence {(r.confidence ?? 0).toFixed(2)} · {new Date(r.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteSource}
        title="Clear Knowledge Source"
        itemName={deleteTarget ? `${deleteTarget} index` : undefined}
        message={
          deleteTarget
            ? `This removes every indexed chunk for “${deleteTarget}”. Run Reindex to rebuild it.`
            : undefined
        }
      />
    </div>
  );
};

export default AdminRagPage;
