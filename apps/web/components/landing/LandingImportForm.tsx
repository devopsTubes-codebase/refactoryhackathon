'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type ProjectResponse = {
  data: {
    id: string;
    name: string;
  };
};

export function LandingImportForm() {
  const router = useRouter();
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submitRepository(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const sourceInput = repositoryUrl.trim();
    if (!sourceInput) {
      setError('Paste a GitHub repository URL first.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sourceInput.split('/').filter(Boolean).at(-1) ?? 'GitHub Project',
          sourceType: 'github',
          sourceInput,
        }),
      });

      if (response.status === 401) {
        router.push('/auth/sign-in');
        return;
      }

      if (!response.ok) {
        throw new Error('Could not create project from this repository.');
      }

      const payload = (await response.json()) as ProjectResponse;
      router.push(`/dashboard/generating?projectId=${encodeURIComponent(payload.data.id)}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not start import.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form id="connect" onSubmit={submitRepository} className="mt-12 flex w-full max-w-[720px] flex-col items-center gap-4">
      <div className="flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-black/25 p-3 shadow-[0_22px_45px_rgba(99,102,241,0.18)] backdrop-blur-md sm:flex-row">
        <label className="sr-only" htmlFor="github-repository-url">GitHub repository URL</label>
        <input
          id="github-repository-url"
          value={repositoryUrl}
          onChange={(event) => setRepositoryUrl(event.target.value)}
          placeholder="https://github.com/owner/repository"
          className="min-h-[52px] flex-1 rounded-xl border border-white/10 bg-[#080f17]/80 px-5 font-mono text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300/60 focus:ring-2 focus:ring-violet-300/20"
        />
        <button
          type="submit"
          disabled={submitting}
          className="flex h-[52px] items-center justify-center gap-3 rounded-xl border border-white/10 bg-gradient-to-br from-[#28224d] to-[#1a1231] px-7 font-semibold text-white transition hover:border-white/20 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Starting...' : 'Connect GitHub Repo'}
        </button>
      </div>
      {error ? <p className="text-sm text-red-200">{error}</p> : null}
    </form>
  );
}
