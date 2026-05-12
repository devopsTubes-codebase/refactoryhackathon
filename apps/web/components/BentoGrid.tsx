import React from 'react';
import { Card } from './Card';

export function BentoGrid() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            System Capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="px-3 py-1 bg-[rgba(99,102,241,0.2)] border border-[rgba(99,102,241,0.3)] rounded-full">
                <span className="text-xs font-semibold text-[#6366f1]">CORE ENGINE</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              AST-Driven Analysis
            </h3>
            <p className="text-[#a1a1aa] mb-4">
              Parses source code into Abstract Syntax Trees to extract structure, 
              types, and relationships with precision.
            </p>
            <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4 font-mono text-sm text-[#a1a1aa]">
              <code>{'// Code snippet preview'}</code>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <svg className="w-8 h-8 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Dependency Graphs
            </h3>
            <p className="text-[#a1a1aa]">
              Visualizes import/export relationships automatically.
            </p>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <svg className="w-8 h-8 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              API Extraction
            </h3>
            <p className="text-[#a1a1aa]">
              Maps REST and GraphQL endpoints from router definitions.
            </p>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <svg className="w-8 h-8 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Zero Config Output
            </h3>
            <p className="text-[#a1a1aa]">
              Generates highly structured markdown or HTML. Ready to host on Pages or S3 immediately.
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8 md:col-span-2">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Intelligent Code Understanding
                </h3>
                <p className="text-[#a1a1aa] text-lg mb-6">
                  Our AI doesn&apos;t just read your code—it understands it. From complex 
                  architectures to subtle patterns, we capture the essence of your codebase 
                  and translate it into clear, comprehensive documentation.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[#6366f1] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#a1a1aa]">Automatic dependency mapping and visualization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[#6366f1] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#a1a1aa]">Pattern recognition across your entire codebase</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[#6366f1] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#a1a1aa]">Context-aware explanations for complex logic</span>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-80 h-64 bg-gradient-to-br from-[#6366f1]/20 to-[#a855f7]/20 rounded-xl flex items-center justify-center">
                <div className="text-6xl">📊</div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="h-full flex flex-col">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Lightning Fast Setup
              </h3>
              <p className="text-[#a1a1aa] flex-1">
                Connect your repository and get comprehensive documentation in minutes, 
                not days. No complex configuration or manual setup required.
              </p>
              <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.1)]">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                  &lt; 5 min
                </div>
                <div className="text-sm text-[#a1a1aa] mt-1">Average setup time</div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="h-full flex flex-col">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Always Up-to-Date
              </h3>
              <p className="text-[#a1a1aa] flex-1">
                Automatic synchronization with your codebase. Every commit triggers 
                intelligent updates to keep your documentation fresh and accurate.
              </p>
              <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.1)]">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                  Real-time
                </div>
                <div className="text-sm text-[#a1a1aa] mt-1">Sync with your repo</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
