function LogoMark({ size = "h-7 w-7" }: { size?: string }) {
  return (
    <div className={`${size} flex items-center justify-center rounded-lg bg-gradient-to-br from-[#7667ff] to-[#9b5cff] shadow-[0_10px_24px_rgba(124,92,255,0.45)]`}>
      <svg viewBox="0 0 18 18" className="h-[54%] w-[54%] text-white" fill="none" aria-hidden="true">
        <path d="M4.35 3.2h7.55c.78 0 1.4.63 1.4 1.4v8.8c0 .78-.62 1.4-1.4 1.4H4.35c-.78 0-1.4-.62-1.4-1.4V4.6c0-.77.62-1.4 1.4-1.4Z" stroke="currentColor" strokeWidth="1.45" />
        <path d="M6.1 3.2v11.6M9.05 5.45h2.35M9.05 8.95h2.35" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function Header() {
  return (
    <header className="absolute left-0 right-0 top-0 z-40">
      <div className="mx-auto flex h-[118px] w-full max-w-[2560px] items-center justify-between px-10 sm:px-12 lg:px-16">
        <a href="#" className="flex items-center gap-4" aria-label="Codebase Wiki home">
          <LogoMark />
          <span className="text-base font-bold tracking-[-0.04em] text-white">Codebase Wiki</span>
        </a>
        <nav className="hidden items-center gap-8 text-base text-[#a1a1aa] md:flex">
          <a className="transition hover:text-white" href="#features">Features</a>
          <a className="transition hover:text-white" href="#documentation">Documentation</a>
        </nav>
        <div className="flex items-center gap-4 text-base">
          <a className="hidden px-3 text-[#a1a1aa] transition hover:text-white sm:block" href="#login">Log in</a>
          <a className="rounded-lg bg-gradient-to-br from-[#7667ff] to-[#a855f7] px-5 py-3 font-medium text-white shadow-[0_10px_24px_rgba(124,92,255,0.32)] transition hover:brightness-110" href="#get-started">Get Started</a>
        </div>
      </div>
    </header>
  );
}

function HeroArt({ side }: { side: "left" | "right" }) {
  const position = side === "left" ? "left-[max(24px,4vw)] top-[350px]" : "right-[max(24px,4vw)] top-[356px]";
  const direction = side === "left" ? "" : "scale-x-[-1]";

  return (
    <div className={`pointer-events-none absolute hidden h-[300px] w-[300px] lg:block ${position} ${direction}`} aria-hidden="true">
      <div className="absolute inset-[-52px] rounded-full bg-[#0ea5e9]/15 blur-[44px]" />
      <div className="absolute left-8 top-9 h-[132px] w-[132px] rotate-[-26deg] rounded-[22px] border border-cyan-200/35 bg-cyan-300/15 shadow-[0_0_45px_rgba(56,189,248,0.45),inset_0_0_34px_rgba(125,211,252,0.22)] backdrop-blur-sm">
        <div className="absolute inset-4 rounded-[16px] border border-cyan-100/25 bg-gradient-to-br from-cyan-200/22 to-blue-500/10" />
        <span className="absolute left-9 top-14 rotate-[26deg] text-[11px] font-bold uppercase tracking-[0.12em] text-cyan-100/80">Codebase</span>
      </div>
      <div className="absolute left-[108px] top-[106px] h-[124px] w-[72px] rotate-[-8deg] rounded-[12px] bg-white/90 shadow-[0_18px_40px_rgba(15,23,42,0.45)]" />
      <div className="absolute left-[143px] top-[122px] h-[136px] w-[74px] rotate-[-10deg] rounded-[12px] bg-white/95 shadow-[0_18px_40px_rgba(15,23,42,0.45)]" />
      <div className="absolute left-[181px] top-[140px] h-[144px] w-[78px] rotate-[-12deg] rounded-[14px] bg-white shadow-[0_20px_44px_rgba(15,23,42,0.5)]">
        <div className="mx-auto mt-8 h-2 w-12 rounded-full bg-slate-300" />
        <div className="mx-auto mt-5 h-2 w-9 rounded-full bg-slate-200" />
        <div className="mx-auto mt-3 h-2 w-11 rounded-full bg-slate-200" />
      </div>
      <div className="absolute left-[-24px] top-[112px] h-px w-[128px] rotate-[18deg] bg-cyan-200/45 shadow-[0_0_10px_rgba(103,232,249,0.75)]" />
      <div className="absolute left-[-12px] top-[136px] h-px w-[118px] rotate-[18deg] bg-cyan-200/35 shadow-[0_0_10px_rgba(103,232,249,0.65)]" />
      <div className="absolute bottom-7 left-[155px] h-6 w-6 rotate-45 rounded-[4px] bg-cyan-300/25 shadow-[0_0_16px_rgba(103,232,249,0.45)]" />
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.16c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18A10.9 10.9 0 0 1 12 6c.98 0 1.96.13 2.88.38 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function Hero() {
  return (
    <section className="relative h-[760px] w-full overflow-hidden px-6 pt-[168px]">
      <HeroArt side="left" />
      <HeroArt side="right" />
      <div className="pointer-events-none absolute left-[0px] top-[-180px] h-[520px] w-[520px] rounded-full bg-[#2630ff]/10 blur-[115px]" />
      <div className="pointer-events-none absolute right-[0px] top-[360px] h-[560px] w-[560px] rounded-full bg-[#2630ff]/10 blur-[120px]" />
      <div className="relative z-10 mx-auto flex max-w-[754px] flex-col items-center text-center">
        <h1 className="max-w-[590px] text-[40px] font-bold leading-[1.23] tracking-[-0.035em] text-white sm:text-[50px]">
          <span>Generate structured</span>
          <br />
          <span>documentation </span>
          <span className="bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">from</span>
          <br />
          <span className="bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">source.</span>
        </h1>
        <p className="mt-9 max-w-[754px] text-base leading-[26px] text-[#a1a1aa]">
          Codebase Wiki parses your repository structure, extracts inline<br className="hidden sm:block" /> comments, and builds a navigable wiki. No manual maintenance required.
        </p>
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <a href="#connect" className="flex h-[52px] items-center gap-3 rounded-xl border border-white/10 bg-gradient-to-br from-[#28224d] to-[#1a1231] px-8 font-semibold text-white shadow-[0_22px_45px_rgba(99,102,241,0.18)] transition hover:border-white/20 hover:brightness-110">
            <GitHubIcon />
            Connect GitHub Repo
          </a>
          <a href="#actions" className="flex h-[54px] items-center rounded-xl border border-white/10 bg-[#18181b]/40 px-7 text-base text-[#a1a1aa] backdrop-blur-md transition hover:border-white/20 hover:text-white">
            Github Actions
          </a>
        </div>
      </div>
    </section>
  );
}

function FeatureIcon({ type }: { type: "graph" | "api" }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#6366f1]/25 bg-[#6366f1]/10 text-[#7667ff]">
      {type === "graph" ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M7 7h4v4H7zM15 4h4v4h-4zM15 16h4v4h-4z" />
          <path d="M11 9h4M11 10l4 7" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />
        </svg>
      )}
    </div>
  );
}

function CodeBlock() {
  const lines = [
    "{",
    "  \"type\": \"ClassDeclaration\",",
    "  \"id\": { \"type\": \"Identifier\", \"name\": \"AuthService\" },",
    "  \"superClass\": null,",
    "  \"body\": {",
    "    \"type\": \"ClassBody\",",
    "    \"body\": [",
  ];
  return (
    <div className="relative mt-11 h-[193px] overflow-hidden rounded-xl border border-white/15 bg-black/40 px-5 py-8">
      <pre className="font-mono text-xs leading-[18px] text-[#a5b4fc]/80">
        {lines.join("\n")}
      </pre>
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
    </div>
  );
}

function PreviewPanel() {
  return (
    <div className="relative flex h-full min-h-[220px] items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-black/35">
      <div className="absolute inset-0 bg-[#6366f1]/5 blur-2xl" />
      <div className="relative w-[254px] rounded-xl border border-white/15 bg-[#18181b]/45 p-4 shadow-[0_20px_45px_rgba(0,0,0,0.25)] backdrop-blur-md">
        <div className="mb-4 h-2.5 w-20 rounded-full bg-[#f0ecf9]/20" />
        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-[#5b5d61]/60" />
          <div className="h-2 w-[89%] rounded-full bg-[#5b5d61]/60" />
          <div className="h-2 w-[70%] rounded-full bg-[#5b5d61]/60" />
        </div>
      </div>
    </div>
  );
}

function Capabilities() {
  return (
    <section id="features" className="relative -mt-[150px] min-h-[900px] overflow-hidden px-6 pb-24 pt-[170px]">
      <div className="absolute left-1/2 top-0 h-[1280px] w-[170vw] min-w-[1600px] -translate-x-1/2 rounded-[50%] bg-[#03001d]" />
      <div className="absolute left-0 right-0 top-[1px] h-[2px] bg-gradient-to-r from-transparent via-[#2c2368]/60 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-[2200px]">
        <h2 className="text-center text-[44px] font-semibold leading-tight tracking-[-0.035em] text-white sm:text-[50px]">
          System <span className="text-[#d0bcff]">Capabilities</span>
        </h2>
        <div className="mt-[68px] grid grid-cols-1 gap-6 lg:grid-cols-[1.04fr_1fr]">
          <article className="rounded-2xl border border-white/20 bg-[#18181b]/40 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_26px_80px_rgba(99,102,241,0.11)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-6">
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-white">AST-Driven Analysis</h3>
              <span className="rounded-lg border border-[#6366f1]/25 bg-[#18181b]/40 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#6366f1] backdrop-blur-md">CORE ENGINE</span>
            </div>
            <p className="mt-8 max-w-[538px] text-base leading-[26px] text-[#a1a1aa]">
              We don&apos;t rely on simple regex. Our parser builds full Abstract Syntax Trees to understand variable scope, inheritance, and dependency injection patterns across your entire project.
            </p>
            <CodeBlock />
          </article>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-[#1a0f2c]/70 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
              <FeatureIcon type="graph" />
              <h3 className="mt-[26px] text-base font-normal text-white">Dependency Graphs</h3>
              <p className="mt-3 text-base leading-[26px] text-[#a1a1aa]">Visualizes import/export relationships automatically.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[#1a0f2c]/70 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
              <FeatureIcon type="api" />
              <h3 className="mt-[26px] text-base font-normal text-white">API Extraction</h3>
              <p className="mt-3 text-base leading-[26px] text-[#a1a1aa]">Maps REST and GraphQL endpoints from router definitions.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[#1a0f2c]/70 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
              <h3 className="text-base font-normal text-white">Zero Config Output</h3>
              <p className="mt-4 text-base leading-[26px] text-[#a1a1aa]">Generates highly structured markdown or HTML. Ready to host on Pages or S3 immediately.</p>
            </article>
            <PreviewPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050507] px-6 py-10">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 text-sm text-[#a1a1aa] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <LogoMark size="h-6 w-6" />
          <span className="text-base font-semibold tracking-[-0.04em] text-white">Codebase Wiki</span>
        </div>
        <nav className="flex flex-wrap gap-8">
          <a className="transition hover:text-white" href="#documentation">Documentation</a>
          <a className="transition hover:text-white" href="#api">API</a>
          <a className="transition hover:text-white" href="#github">GitHub</a>
          <a className="transition hover:text-white" href="#terms">Terms</a>
        </nav>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#080f17] font-sans text-white">
      <Header />
      <main>
        <Hero />
        <Capabilities />
      </main>
      <Footer />
    </div>
  );
}
