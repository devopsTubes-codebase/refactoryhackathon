import React from 'react';
import { Card } from './Card';

export function SystemCapabilities() {
  const capabilities = [
    {
      icon: '🤖',
      title: 'AI-Powered Analysis',
      description: 'Advanced language models analyze your codebase structure, dependencies, and patterns to generate accurate documentation.'
    },
    {
      icon: '📚',
      title: 'GitBook-Style Output',
      description: 'Beautiful, navigable documentation that looks and feels like professionally crafted GitBook pages.'
    },
    {
      icon: '⚡',
      title: 'Real-Time Updates',
      description: 'Documentation stays in sync with your code. Push changes and watch your docs update automatically.'
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Powerful search across all documentation with AI-enhanced relevance and context understanding.'
    },
    {
      icon: '🎨',
      title: 'Customizable Themes',
      description: 'Match your brand with customizable themes, colors, and layouts. Make the docs truly yours.'
    },
    {
      icon: '🔐',
      title: 'Access Control',
      description: 'Fine-grained permissions for teams. Control who can view, edit, or publish documentation.'
    }
  ];

  return (
    <section id="capabilities" className="py-20 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            System Capabilities
          </h2>
          <p className="text-xl text-[#a1a1aa] max-w-2xl mx-auto">
            Everything you need to transform your codebase into comprehensive, 
            maintainable documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <Card key={index} className="p-6 hover:border-[rgba(255,255,255,0.2)] transition-all">
              <div className="text-4xl mb-4">{capability.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {capability.title}
              </h3>
              <p className="text-[#a1a1aa]">
                {capability.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
