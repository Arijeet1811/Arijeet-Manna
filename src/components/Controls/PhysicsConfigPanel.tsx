import React from 'react';
import { Sliders, Activity, Sparkles, Move, Camera, Check } from 'lucide-react';
import { SpringPhysicsConfig, CutoutType } from '../../types';

interface PhysicsConfigPanelProps {
  physics: SpringPhysicsConfig;
  onUpdatePhysics: (config: SpringPhysicsConfig) => void;
  cutout: CutoutType;
  onUpdateCutout: (type: CutoutType) => void;
  cutoutSize: number;
  onUpdateCutoutSize: (size: number) => void;
  cutoutOffsetY: number;
  onUpdateCutoutOffsetY: (offset: number) => void;
  targetFps: 30 | 60 | 90 | 120;
  onUpdateTargetFps: (fps: 30 | 60 | 90 | 120) => void;
}

export const PhysicsConfigPanel: React.FC<PhysicsConfigPanelProps> = ({
  physics,
  onUpdatePhysics,
  cutout,
  onUpdateCutout,
  cutoutSize,
  onUpdateCutoutSize,
  cutoutOffsetY,
  onUpdateCutoutOffsetY,
  targetFps,
  onUpdateTargetFps
}) => {
  const presets: { name: string; stiffness: number; damping: number; mass: number; desc: string }[] = [
    {
      name: 'Ultra-Smooth 120Hz Liquid',
      stiffness: 280,
      damping: 24,
      mass: 0.9,
      desc: 'Silky smooth fluid spring with zero jitter and organic deceleration'
    },
    {
      name: 'Android 16 Fluid (Default)',
      stiffness: 450,
      damping: 28,
      mass: 0.95,
      desc: 'Sub-critically damped, organic snap with low latency'
    },
    {
      name: 'Apple iOS Matched',
      stiffness: 400,
      damping: 26,
      mass: 1.0,
      desc: 'Natural frequency 18.5 rad/s with authentic rubberband physics'
    },
    {
      name: 'Bouncy Elastic',
      stiffness: 320,
      damping: 18,
      mass: 1.1,
      desc: 'High overshoot and dynamic rubberband oscillation'
    },
    {
      name: 'Ultra Snappy (Gaming)',
      stiffness: 680,
      damping: 38,
      mass: 0.8,
      desc: 'Near-instant 3ms settlement time for 120Hz/144Hz displays'
    }
  ];

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            Jetpack Compose Spring Physics & Cutout Engine
          </h3>
          <p className="text-xs text-slate-400">Tuned for Android 16 SpringSpec & DisplayCutout insets</p>
        </div>
        
        {/* Display Refresh Rate Selector */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
          {[30, 60, 90, 120].map((hz) => (
            <button
              key={hz}
              id={`fps-mode-${hz}`}
              onClick={() => onUpdateTargetFps(hz as 30 | 60 | 90 | 120)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                targetFps === hz
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {hz}Hz
            </button>
          ))}
        </div>
      </div>

      {/* Physics Preset Cards */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Physics Profile Presets:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presets.map((preset) => {
            const isSelected = physics.presetName === preset.name;
            return (
              <button
                key={preset.name}
                id={`preset-btn-${preset.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => {
                  onUpdatePhysics({
                    presetName: preset.name,
                    stiffness: preset.stiffness,
                    damping: preset.damping,
                    mass: preset.mass
                  });
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-blue-950/30 border-blue-500/80 text-white shadow-lg shadow-blue-900/20'
                    : 'bg-black/40 border-white/5 text-slate-300 hover:border-white/20 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{preset.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{preset.desc}</p>
                <div className="flex gap-2 text-[10px] font-mono text-slate-500 mt-2">
                  <span>k: {preset.stiffness}</span>
                  <span>ζ: {preset.damping}</span>
                  <span>m: {preset.mass}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Fine-Tuning Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 shadow-inner">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Stiffness (k):</span>
            <span className="text-blue-400 font-mono font-bold">{physics.stiffness} N/m</span>
          </div>
          <input
            type="range"
            min="150"
            max="900"
            step="10"
            value={physics.stiffness}
            onChange={(e) => onUpdatePhysics({ ...physics, stiffness: Number(e.target.value), presetName: 'Custom' })}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Damping (ζ):</span>
            <span className="text-blue-400 font-mono font-bold">{physics.damping}</span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="1"
            value={physics.damping}
            onChange={(e) => onUpdatePhysics({ ...physics, damping: Number(e.target.value), presetName: 'Custom' })}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Mass (m):</span>
            <span className="text-blue-400 font-mono font-bold">{physics.mass} kg</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={physics.mass}
            onChange={(e) => onUpdatePhysics({ ...physics, mass: Number(e.target.value), presetName: 'Custom' })}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Hardware Cutout Position Calibrator */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-blue-400" />
          Hardware Camera Punch-Hole Calibration:
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'center-hole' as CutoutType, name: 'Center Punch-Hole', sub: 'Samsung / Pixel' },
            { id: 'left-hole' as CutoutType, name: 'Left Punch-Hole', sub: 'OnePlus / Xiaomi' },
            { id: 'pill-center' as CutoutType, name: 'Dual Pill Cutout', sub: 'Dual Cam / 3D Sensor' },
            { id: 'waterdrop-notch' as CutoutType, name: 'Top Notch', sub: 'Bezel-integrated' },
          ].map((item) => (
            <button
              key={item.id}
              id={`cutout-btn-${item.id}`}
              onClick={() => onUpdateCutout(item.id)}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                cutout === item.id
                  ? 'bg-blue-600/30 border-blue-500/80 text-white font-bold shadow-md'
                  : 'bg-black/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <div className="text-xs truncate">{item.name}</div>
              <div className="text-[10px] text-slate-500">{item.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
