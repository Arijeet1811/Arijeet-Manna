import React from 'react';
import { 
  Move, Smartphone, Eye, Sparkles, Droplets, Sliders, 
  RotateCcw, ShieldCheck, Check, Layers, Compass, ArrowRight,
  Maximize2, Crosshair, SunMedium, Paintbrush
} from 'lucide-react';
import { 
  IslandCustomizerConfig, SpringPhysicsConfig, CutoutType, 
  PhysicsAnimationType, IslandThemeStyle 
} from '../../types';

interface IslandCustomizerPanelProps {
  customizer: IslandCustomizerConfig;
  onUpdateCustomizer: (cfg: Partial<IslandCustomizerConfig>) => void;
  physics: SpringPhysicsConfig;
  onUpdatePhysics: (phys: Partial<SpringPhysicsConfig>) => void;
  cutout: CutoutType;
  onUpdateCutout: (cutout: CutoutType) => void;
  cutoutSize: number;
  onUpdateCutoutSize: (size: number) => void;
}

export const IslandCustomizerPanel: React.FC<IslandCustomizerPanelProps> = ({
  customizer,
  onUpdateCustomizer,
  physics,
  onUpdatePhysics,
  cutout,
  onUpdateCutout,
  cutoutSize,
  onUpdateCutoutSize
}) => {
  // Preset phone models with exact cutout and offset geometry
  const phonePresets = [
    {
      id: 'galaxy-s24',
      name: 'Galaxy S24 / S25 Ultra',
      brand: 'Samsung OneUI 7',
      cutout: 'center-hole' as CutoutType,
      cutoutSize: 13,
      offsetX: 0,
      offsetY: 4,
      widthScale: 1.0,
      baseHeight: 35,
      cornerRadius: 18,
      theme: 'frosted-glass' as IslandThemeStyle
    },
    {
      id: 'pixel-9-pro',
      name: 'Pixel 8 / 9 Pro',
      brand: 'Google Material You',
      cutout: 'center-hole' as CutoutType,
      cutoutSize: 14,
      offsetX: 0,
      offsetY: 7,
      widthScale: 1.05,
      baseHeight: 36,
      cornerRadius: 20,
      theme: 'obsidian' as IslandThemeStyle
    },
    {
      id: 'oneplus-12',
      name: 'OnePlus 12 / Ace 3',
      brand: 'OxygenOS 15',
      cutout: 'left-hole' as CutoutType,
      cutoutSize: 14,
      offsetX: -68,
      offsetY: 4,
      widthScale: 1.0,
      baseHeight: 35,
      cornerRadius: 18,
      theme: 'cyber-glow' as IslandThemeStyle
    },
    {
      id: 'xiaomi-14',
      name: 'Xiaomi 14 / HyperOS',
      brand: 'HyperOS 2',
      cutout: 'pill-center' as CutoutType,
      cutoutSize: 16,
      offsetX: 0,
      offsetY: 5,
      widthScale: 1.02,
      baseHeight: 37,
      cornerRadius: 22,
      theme: 'translucent-blue' as IslandThemeStyle
    }
  ];

  // Physics animation modes (Butter, Droplet, Glass, Snappy, Jelly)
  const animationProfiles: {
    id: PhysicsAnimationType;
    name: string;
    badge: string;
    desc: string;
    stiffness: number;
    damping: number;
    mass: number;
    viscosity: number;
    specular: number;
    icon: string;
  }[] = [
    {
      id: 'butter-smooth',
      name: 'Butter Smooth Spring',
      badge: 'Zero Jitter',
      desc: 'Silky smooth organic curve with sub-critical damping and soft gliding landings.',
      stiffness: 280,
      damping: 25,
      mass: 0.95,
      viscosity: 0.65,
      specular: 0.7,
      icon: '🧈'
    },
    {
      id: 'liquid-droplet',
      name: 'Raindrop / Liquid Droplet',
      badge: 'Fluid Elasticity',
      desc: 'Organic fluid droplet with surface tension wobble, squash & stretch morphing, and splash ripples.',
      stiffness: 330,
      damping: 21,
      mass: 0.9,
      viscosity: 0.95,
      specular: 0.9,
      icon: '💧'
    },
    {
      id: 'frosted-glass',
      name: 'Liquid Glass Aero',
      badge: 'Specular Refraction',
      desc: 'Translucent frosted glass with dynamic specular sheen sweep and refractive border light.',
      stiffness: 300,
      damping: 27,
      mass: 1.0,
      viscosity: 0.5,
      specular: 1.0,
      icon: '🪟'
    },
    {
      id: 'snappy-pro',
      name: 'Snappy Pro Tactile',
      badge: 'High Responsiveness',
      desc: 'Rapid acceleration with instant mechanical snap for power users.',
      stiffness: 480,
      damping: 32,
      mass: 0.85,
      viscosity: 0.2,
      specular: 0.5,
      icon: '⚡'
    },
    {
      id: 'jelly-bounce',
      name: 'Playful Jelly Wobble',
      badge: 'High Elasticity',
      desc: 'Low damping spring providing a playful, fluid droplet bounce.',
      stiffness: 210,
      damping: 16,
      mass: 1.15,
      viscosity: 0.85,
      specular: 0.75,
      icon: '🍮'
    }
  ];

  // Visual Theme Styles
  const themeStyles: {
    id: IslandThemeStyle;
    name: string;
    desc: string;
    previewBg: string;
  }[] = [
    {
      id: 'frosted-glass',
      name: 'Frosted Liquid Glass',
      desc: 'Frosted glass with light refraction, ambient blur & sheen',
      previewBg: 'bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-white/20'
    },
    {
      id: 'obsidian',
      name: 'Pure Obsidian OLED',
      desc: 'Deep pitch black with ultra-thin hairline border for OLEDs',
      previewBg: 'bg-black border border-white/10'
    },
    {
      id: 'cyber-glow',
      name: 'Cyber Aurora Glow',
      desc: 'Translucent dark glass with electric blue/cyan neon rim',
      previewBg: 'bg-slate-950 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
    },
    {
      id: 'translucent-blue',
      name: 'Sapphire Crystal',
      desc: 'Subtle deep sapphire tint with specular gloss',
      previewBg: 'bg-blue-950/70 border border-blue-400/30'
    }
  ];

  const applyPhonePreset = (preset: typeof phonePresets[0]) => {
    onUpdateCutout(preset.cutout);
    onUpdateCutoutSize(preset.cutoutSize);
    onUpdateCustomizer({
      offsetX: preset.offsetX,
      offsetY: preset.offsetY,
      widthScale: preset.widthScale,
      baseHeight: preset.baseHeight,
      cornerRadius: preset.cornerRadius,
      themeStyle: preset.theme,
      devicePreset: preset.id
    });
  };

  const applyAnimationProfile = (profile: typeof animationProfiles[0]) => {
    onUpdatePhysics({
      stiffness: profile.stiffness,
      damping: profile.damping,
      mass: profile.mass,
      presetName: profile.name,
      animationType: profile.id,
      dropletViscosity: profile.viscosity,
      glassSpecularIntensity: profile.specular
    });
  };

  const resetToCenterDefaults = () => {
    onUpdateCustomizer({
      offsetX: 0,
      offsetY: 4,
      widthScale: 1.0,
      baseHeight: 36,
      expandedHeightScale: 1.0,
      cornerRadius: 18,
      showCalibrationGuide: false,
      allowDirectDragAdjust: false
    });
  };

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-6">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-400" />
            Dynamic Island Phone Customizer & Calibration
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Adjust position, size, butter/droplet physics, and glass styling to perfectly match your phone
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Calibration Toggle */}
          <button
            id="toggle-calibration-guide-btn"
            onClick={() => onUpdateCustomizer({ showCalibrationGuide: !customizer.showCalibrationGuide })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
              customizer.showCalibrationGuide
                ? 'bg-blue-600 text-white border-blue-400/50 shadow-md shadow-blue-900/30'
                : 'bg-black/40 text-slate-300 border-white/5 hover:bg-slate-800/40'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{customizer.showCalibrationGuide ? 'Hide Guides' : 'Alignment Guides'}</span>
          </button>

          {/* Reset button */}
          <button
            id="reset-island-adjustment-btn"
            onClick={resetToCenterDefaults}
            title="Reset position and size to default"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/40 text-slate-400 hover:text-white border border-white/5 text-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: 1-Click Phone Model Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            1-Click Phone Hardware Calibration Presets
          </label>
          <span className="text-[10px] text-slate-500 font-mono">Auto-fits punch-hole & insets</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {phonePresets.map((preset) => {
            const isSelected = customizer.devicePreset === preset.id;
            return (
              <button
                key={preset.id}
                id={`phone-preset-${preset.id}`}
                onClick={() => applyPhonePreset(preset)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500/80 text-white shadow-lg shadow-blue-900/20 ring-1 ring-blue-400/40'
                    : 'bg-black/30 border-white/5 text-slate-300 hover:border-white/20 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold truncate text-white">{preset.name}</span>
                  {isSelected ? (
                    <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono capitalize">{preset.cutout.replace('-hole', '')}</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">{preset.brand}</div>
                <div className="mt-2 text-[9px] font-mono text-slate-500 flex gap-2">
                  <span>X: {preset.offsetX}px</span>
                  <span>Y: {preset.offsetY}px</span>
                  <span>H: {preset.baseHeight}px</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Physics Animation Styles (Butter, Raindrop Droplet, Glass) */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            Animation Physics Engine (Butter & Liquid Droplet Modes)
          </label>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Active: {physics.presetName}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {animationProfiles.map((profile) => {
            const isSelected = physics.animationType === profile.id;
            return (
              <button
                key={profile.id}
                id={`anim-profile-${profile.id}`}
                onClick={() => applyAnimationProfile(profile)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/30 border-blue-500/80 text-white shadow-lg shadow-blue-900/30 ring-1 ring-blue-400/40'
                    : 'bg-black/30 border-white/5 text-slate-300 hover:border-white/20 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold flex items-center gap-1.5 text-white">
                      <span>{profile.icon}</span>
                      <span>{profile.name}</span>
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-blue-500/30 text-blue-300 border border-blue-400/40' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {profile.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-1">{profile.desc}</p>
                </div>

                <div className="mt-3 flex items-center justify-between text-[9px] font-mono text-slate-500 pt-2 border-t border-white/5">
                  <span>k: {profile.stiffness}</span>
                  <span>ζ: {profile.damping}</span>
                  <span>Viscosity: {Math.round(profile.viscosity * 100)}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Visual Material & Glass Styling */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <Paintbrush className="w-3.5 h-3.5 text-blue-400" />
          Glass & Droplet Surface Theme
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {themeStyles.map((th) => {
            const isSelected = customizer.themeStyle === th.id;
            return (
              <button
                key={th.id}
                id={`theme-style-${th.id}`}
                onClick={() => onUpdateCustomizer({ themeStyle: th.id })}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500 text-white shadow-lg ring-1 ring-blue-400/40'
                    : 'bg-black/30 border-white/5 text-slate-300 hover:border-white/20 hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-4 h-4 rounded-full ${th.previewBg}`} />
                  <span className="text-xs font-bold text-white truncate">{th.name}</span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{th.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Fine Position & Size Geometry Adjustments */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-blue-400" />
            Fine-Tune Island Position & Geometry for Your Screen
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">Direct Touch Dragging:</span>
            <button
              id="toggle-direct-drag-btn"
              onClick={() => onUpdateCustomizer({ allowDirectDragAdjust: !customizer.allowDirectDragAdjust })}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition cursor-pointer ${
                customizer.allowDirectDragAdjust
                  ? 'bg-emerald-500 text-black shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {customizer.allowDirectDragAdjust ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 shadow-inner">
          {/* Horizontal Position Offset (X) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <span>Horizontal X Offset:</span>
              </span>
              <span className="text-blue-400 font-mono font-bold">{customizer.offsetX} px</span>
            </div>
            <input
              type="range"
              min="-90"
              max="90"
              step="1"
              value={customizer.offsetX}
              onChange={(e) => onUpdateCustomizer({ offsetX: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <button onClick={() => onUpdateCustomizer({ offsetX: -68 })} className="hover:text-blue-400 cursor-pointer">Left (-68px)</button>
              <button onClick={() => onUpdateCustomizer({ offsetX: 0 })} className="hover:text-blue-400 cursor-pointer">Center (0px)</button>
              <button onClick={() => onUpdateCustomizer({ offsetX: 68 })} className="hover:text-blue-400 cursor-pointer">Right (+68px)</button>
            </div>
          </div>

          {/* Vertical Top Margin Offset (Y) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Vertical Margin (Y):</span>
              <span className="text-blue-400 font-mono font-bold">{customizer.offsetY} px</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={customizer.offsetY}
              onChange={(e) => onUpdateCustomizer({ offsetY: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <button onClick={() => onUpdateCustomizer({ offsetY: 0 })} className="hover:text-blue-400 cursor-pointer">Flush (0px)</button>
              <button onClick={() => onUpdateCustomizer({ offsetY: 6 })} className="hover:text-blue-400 cursor-pointer">Standard (6px)</button>
              <button onClick={() => onUpdateCustomizer({ offsetY: 14 })} className="hover:text-blue-400 cursor-pointer">Deep Inset (14px)</button>
            </div>
          </div>

          {/* Base Pill Width Multiplier */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Width Scale:</span>
              <span className="text-blue-400 font-mono font-bold">{Math.round(customizer.widthScale * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.85"
              max="1.25"
              step="0.01"
              value={customizer.widthScale}
              onChange={(e) => onUpdateCustomizer({ widthScale: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Compact (85%)</span>
              <span>Default (100%)</span>
              <span>Widescreen (125%)</span>
            </div>
          </div>

          {/* Base Pill Height */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Base Height:</span>
              <span className="text-blue-400 font-mono font-bold">{customizer.baseHeight} px</span>
            </div>
            <input
              type="range"
              min="28"
              max="46"
              step="1"
              value={customizer.baseHeight}
              onChange={(e) => onUpdateCustomizer({ baseHeight: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Slim (28px)</span>
              <span>Standard (36px)</span>
              <span>Chubby (46px)</span>
            </div>
          </div>

          {/* Squircle Corner Curvature */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Corner Curvature:</span>
              <span className="text-blue-400 font-mono font-bold">{customizer.cornerRadius} px</span>
            </div>
            <input
              type="range"
              min="12"
              max="24"
              step="1"
              value={customizer.cornerRadius}
              onChange={(e) => onUpdateCustomizer({ cornerRadius: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Squircle (12px)</span>
              <span>Smooth Pill (18px)</span>
              <span>Droplet (24px)</span>
            </div>
          </div>

          {/* Droplet Ripple & Splash Effect Toggle */}
          <div className="flex flex-col justify-between space-y-1.5">
            <span className="text-slate-400 text-xs font-medium">Droplet Splash Ripple:</span>
            <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-white/5">
              <span className="text-[11px] text-slate-300">Fluid wave on tap</span>
              <button
                id="toggle-droplet-ripple-btn"
                onClick={() => onUpdatePhysics({ enableDropletRipple: !physics.enableDropletRipple })}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  physics.enableDropletRipple
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {physics.enableDropletRipple ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Punch-Hole Obstruction Protection & Cutout Safe-Zone */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Punch-Hole Cutout Safe-Zone Auto-Avoidance
          </label>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {customizer.autoCutoutAvoidance ? 'Active (Zero Obstruction)' : 'Standard'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 shadow-inner">
          {/* Auto Avoidance Toggle */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Auto Safe-Zone Clearance:</span>
              <span className={`font-mono text-xs font-bold ${customizer.autoCutoutAvoidance ? 'text-emerald-400' : 'text-slate-400'}`}>
                {customizer.autoCutoutAvoidance ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Splits text & equalizers into left & right wings so camera hole never obscures content
            </p>
            <button
              id="toggle-auto-cutout-avoidance-btn"
              onClick={() => onUpdateCustomizer({ autoCutoutAvoidance: !customizer.autoCutoutAvoidance })}
              className={`w-full py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                customizer.autoCutoutAvoidance
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{customizer.autoCutoutAvoidance ? 'Cutout Protection ON' : 'Enable Cutout Protection'}</span>
            </button>
          </div>

          {/* Center Clearance Spacer Width */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Center Cutout Safe Clearance:</span>
              <span className="text-blue-400 font-mono font-bold">{customizer.cutoutSafeClearance || 36} px</span>
            </div>
            <input
              type="range"
              min="20"
              max="56"
              step="2"
              value={customizer.cutoutSafeClearance || 36}
              onChange={(e) => onUpdateCustomizer({ cutoutSafeClearance: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <button onClick={() => onUpdateCustomizer({ cutoutSafeClearance: 24 })} className="hover:text-blue-400 cursor-pointer">Slim (24px)</button>
              <button onClick={() => onUpdateCustomizer({ cutoutSafeClearance: 36 })} className="hover:text-blue-400 cursor-pointer">Default (36px)</button>
              <button onClick={() => onUpdateCustomizer({ cutoutSafeClearance: 48 })} className="hover:text-blue-400 cursor-pointer">Wide (48px)</button>
            </div>
          </div>

          {/* Compact Layout Style */}
          <div className="space-y-1.5">
            <span className="text-slate-400 text-xs font-medium">Compact Layout Mode:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                id="layout-mode-auto-wing"
                onClick={() => onUpdateCustomizer({ compactTextDisplay: 'auto-wing' })}
                className={`px-2 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer text-center border ${
                  customizer.compactTextDisplay === 'auto-wing'
                    ? 'bg-blue-600/30 text-blue-300 border-blue-400/50'
                    : 'bg-black/30 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                Safe Wings (Title+Art)
              </button>
              <button
                id="layout-mode-icon-only"
                onClick={() => onUpdateCustomizer({ compactTextDisplay: 'icon-only' })}
                className={`px-2 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer text-center border ${
                  customizer.compactTextDisplay === 'icon-only'
                    ? 'bg-blue-600/30 text-blue-300 border-blue-400/50'
                    : 'bg-black/30 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                Minimal (Art + Wave)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
