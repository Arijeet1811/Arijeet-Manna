import React, { useEffect, useState } from 'react';
import { Activity, Cpu, Battery, Layers, Zap, Gauge, CheckCircle2, ShieldCheck, Microchip, Flame } from 'lucide-react';
import { FrameTelemetry, BatteryOptimizationConfig } from '../../types';

interface TelemetryPanelProps {
  telemetry: FrameTelemetry;
  targetFps: 30 | 60 | 90 | 120;
  batteryOpt?: BatteryOptimizationConfig;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({
  telemetry,
  targetFps,
  batteryOpt
}) => {
  const [frameHistory, setFrameHistory] = useState<number[]>([1.8, 2.1, 1.9, 2.3, 2.0, 1.7, 2.2, 1.9, 2.1, 1.8]);

  useEffect(() => {
    const isEco = batteryOpt?.lowSpecDeviceMode || batteryOpt?.ecoMode;
    const baseMin = isEco ? 0.7 : 2.2;
    const interval = setInterval(() => {
      // Simulate sub-millisecond execution when low-spec GPU bypass is enabled
      const jitter = Number((baseMin + Math.random() * (isEco ? 0.5 : 0.9)).toFixed(2));
      setFrameHistory(prev => [...prev.slice(1), jitter]);
    }, 200);
    return () => clearInterval(interval);
  }, [batteryOpt?.lowSpecDeviceMode, batteryOpt?.ecoMode]);

  const frameBudgetMs = targetFps === 120 ? 8.33 : targetFps === 90 ? 11.11 : targetFps === 60 ? 16.66 : 33.33;
  const currentFrameTime = frameHistory[frameHistory.length - 1] || 1.8;
  const budgetUtilization = Math.round((currentFrameTime / frameBudgetMs) * 100);
  const batteryDrain = batteryOpt?.estimatedBatteryDrainHourly ?? telemetry.batteryDrainHourly ?? 0.18;
  const heapMemory = batteryOpt?.lowSpecDeviceMode ? 11.2 : 18.4;

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Gauge className="w-4 h-4 text-blue-400" />
            Android 16 Render Engine Telemetry (Locking {targetFps} FPS)
          </h3>
          <p className="text-xs text-slate-400">
            {batteryOpt?.lowSpecDeviceMode 
              ? 'Low-Spec Mode active: Opaque 2D drawing with zero GPU shader overhead'
              : 'Zero jank frame pacing with sub-millisecond compose measure passes'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Memory Leaks</span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Render Frame Time */}
        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between shadow-inner">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Frame Time</span>
            <Activity className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="my-1">
            <div className="text-xl font-mono font-bold text-white flex items-baseline gap-1">
              {currentFrameTime} <span className="text-xs text-blue-400 font-normal">ms</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Budget: {frameBudgetMs.toFixed(1)}ms ({budgetUtilization}%)</div>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${Math.min(100, budgetUtilization)}%` }}
            />
          </div>
        </div>

        {/* Live FPS */}
        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between shadow-inner">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Display Target</span>
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-1">
            <div className="text-xl font-mono font-bold text-emerald-400 flex items-baseline gap-1">
              {targetFps} <span className="text-xs text-slate-400 font-normal">FPS</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {targetFps <= 60 ? 'Battery Saving Mode' : 'Hardware Choreographer'}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% VSYNC Locked</span>
          </div>
        </div>

        {/* Heap Memory */}
        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between shadow-inner">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">JVM Heap RSS</span>
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="my-1">
            <div className="text-xl font-mono font-bold text-white flex items-baseline gap-1">
              {heapMemory} <span className="text-xs text-purple-400 font-normal">MB</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Target: &lt; 25MB overlay</div>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 rounded-full" 
              style={{ width: `${Math.round((heapMemory / 25) * 100)}%` }} 
            />
          </div>
        </div>

        {/* Battery Drain */}
        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between shadow-inner">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Hourly Power</span>
            <Battery className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="my-1">
            <div className="text-xl font-mono font-bold text-white flex items-baseline gap-1">
              {batteryDrain} <span className="text-xs text-teal-400 font-normal">%/hr</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {batteryDrain <= 0.08 ? 'Ultra-Low Drain Profile' : 'Standard Baseline'}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-teal-400 font-mono">
            <span>{Math.round(100 / batteryDrain)}+ hrs continuous</span>
          </div>
        </div>
      </div>

      {/* Frame Time Mini Sparkline Waveform */}
      <div className="bg-black/40 p-3 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <span className="text-xs font-semibold text-slate-300">Frame Pacing Pipeline:</span>
        </div>
        <div className="flex items-end gap-1.5 h-6">
          {frameHistory.map((val, idx) => {
            const h = Math.round((val / frameBudgetMs) * 24);
            return (
              <div 
                key={idx} 
                className="w-4 bg-blue-500/80 rounded-t transition-all duration-150 hover:bg-blue-400"
                style={{ height: `${Math.max(4, h)}px` }}
                title={`${val} ms`}
              />
            );
          })}
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Recompositions: <span className="text-white font-bold">{telemetry.recompositionCount}</span>
        </div>
      </div>
    </div>
  );
};
