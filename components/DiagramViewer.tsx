// components/DiagramViewer.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { toPng, toSvg } from 'html-to-image';
import { Download, RefreshCw, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#fff',
    lineColor: '#6b7280',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    background: '#ffffff',
  },
  flowchart: { useMaxWidth: true, htmlLabels: true },
  securityLevel: 'loose',
});

interface Props {
  mermaidCode: string;
  onRefine: () => void;
}

export default function DiagramViewer({ mermaidCode, onRefine }: Props) {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mermaidCode || !diagramRef.current) return;

    const renderDiagram = async () => {
      diagramRef.current!.innerHTML = '<div class="text-center py-20 text-gray-500">Rendering diagram...</div>';
      setError(null);

      try {
        const { svg } = await mermaid.render('mermaid-diagram-' + Date.now(), mermaidCode);
        diagramRef.current!.innerHTML = svg;
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        setError(err?.message || 'Failed to render diagram');
        diagramRef.current!.innerHTML = `<pre class="text-red-600 p-4">${err?.message || 'Invalid Mermaid syntax'}</pre>`;
      }
    };

    renderDiagram();
  }, [mermaidCode]);

  const download = async (format: 'png' | 'svg') => {
    const svgEl = diagramRef.current?.querySelector('svg');
    if (!svgEl) return alert('No diagram to export');

    // Ensure SVG has proper dimensions
    if (!svgEl.getAttribute('height')) {
      const viewBox = svgEl.getAttribute('viewBox');
      if (viewBox) {
        const [, , width, height] = viewBox.split(' ').map(Number);
        svgEl.setAttribute('width', width.toString());
        svgEl.setAttribute('height', height.toString());
      }
    }

    const dataUrl = format === 'png' ? await toPng(svgEl as unknown as HTMLElement)
    : await toSvg(svgEl as unknown as HTMLElement);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `archsketch-diagram.${format}`;
    a.click();
  };

  const share = () => {
    const url = `${location.origin}?diagram=${encodeURIComponent(btoa(mermaidCode))}`;
    navigator.clipboard.writeText(url);
    alert('Shareable link copied to clipboard!');
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={onRefine} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refine
        </Button>
        <Button onClick={() => download('png')} variant="outline">PNG</Button>
        <Button onClick={() => download('svg')} variant="outline">SVG</Button>
        <Button onClick={share} variant="outline" className="gap-2">
          <Share2 className="w-4 h-4" /> Share
        </Button>
      </div>

      <Card className="overflow-hidden border-2">
        <div ref={diagramRef} className="p-4 bg-gray-50 min-h-96 flex items-center justify-center" />
        {error && <div className="p-4 text-red-600 text-center">{error}</div>}
      </Card>
    </div>
  );
}