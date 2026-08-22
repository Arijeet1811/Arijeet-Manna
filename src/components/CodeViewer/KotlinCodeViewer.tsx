import React, { useState } from 'react';
import { 
  FileCode, Copy, Check, Download, Layers, ShieldCheck, 
  Terminal, ExternalLink, Code2, Sparkles, FolderGit2
} from 'lucide-react';
import { KOTLIN_CODEBASE } from '../../data/kotlinCodebase';
import { KotlinCodeFile } from '../../types';

export const KotlinCodeViewer: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>('overlay_service');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedFile = KOTLIN_CODEBASE.find(f => f.id === selectedFileId) || KOTLIN_CODEBASE[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Android 16 (API 36) Production Kotlin Architecture</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete modular codebase with WindowManager, SpringSpec, NotificationListenerService, and E2E insets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="copy-kotlin-code-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-white transition border border-white/10 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy File'}</span>
          </button>

          <button
            id="download-kotlin-file-btn"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition shadow-lg shadow-blue-900/40 border border-blue-400/30 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .kt</span>
          </button>
        </div>
      </div>

      {/* File Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-white/5">
        {KOTLIN_CODEBASE.map((file) => {
          const isSelected = file.id === selectedFileId;
          return (
            <button
              key={file.id}
              id={`file-tab-${file.id}`}
              onClick={() => setSelectedFileId(file.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-blue-600/30 text-white font-bold border border-blue-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
              <span>{file.fileName}</span>
            </button>
          );
        })}
      </div>

      {/* Selected File Details Banner */}
      <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-inner">
        <div>
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <span>{selectedFile.title}</span>
            <span className="text-[10px] font-mono bg-slate-800/80 px-2 py-0.5 rounded text-slate-300 border border-white/5">
              {selectedFile.packagePath}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{selectedFile.description}</p>
        </div>
        <div className="text-[10px] font-mono text-blue-400 bg-blue-950/40 border border-blue-500/30 px-2.5 py-1 rounded-lg">
          API 36 Ready
        </div>
      </div>

      {/* Syntax Code Editor Canvas */}
      <div className="relative rounded-2xl bg-black/70 border border-white/10 overflow-hidden shadow-2xl font-mono text-xs">
        <div className="w-full bg-slate-900/60 px-4 py-2 flex items-center justify-between border-b border-white/5 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <span className="ml-2 text-slate-300 font-semibold">{selectedFile.fileName}</span>
          </div>
          <span className="text-slate-400">Kotlin 2.1 • Compose BOM 2026</span>
        </div>

        <pre className="p-4 overflow-x-auto max-h-[480px] text-slate-300 leading-relaxed no-scrollbar select-text">
          <code>{selectedFile.code}</code>
        </pre>
      </div>
    </div>
  );
};
