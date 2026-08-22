import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, SkipForward, SkipBack, Phone, PhoneOff, Mic, MicOff,
  Volume2, Check, Send, Navigation, ArrowUpRight, BatteryCharging,
  Radio, X, Plus, Sparkles, Heart, Smartphone, Crosshair, Move, Share2,
  Globe, ExternalLink, Copy, PowerOff, XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  IslandMode, IslandExpansionState, CutoutType, SpringPhysicsConfig,
  IslandCustomizerConfig, BatteryOptimizationConfig,
  MusicTrack, CallInfo, TimerInfo, ChargingInfo, NavigationInfo, MessageInfo, QuickShareInfo,
  CopiedUrlInfo
} from '../../types';

interface IslandSimulatorProps {
  mode: IslandMode;
  secondaryMode: IslandMode | null;
  expansion: IslandExpansionState;
  onExpansionChange: (state: IslandExpansionState) => void;
  physics: SpringPhysicsConfig;
  customizer: IslandCustomizerConfig;
  onUpdateCustomizer?: (cfg: Partial<IslandCustomizerConfig>) => void;
  batteryOpt?: BatteryOptimizationConfig;
  cutout: CutoutType;
  cutoutSize: number;
  cutoutOffsetY: number;
  musicTrack: MusicTrack;
  onUpdateMusic: (track: Partial<MusicTrack>) => void;
  callInfo: CallInfo;
  onUpdateCall: (call: Partial<CallInfo>) => void;
  timerInfo: TimerInfo;
  onUpdateTimer: (timer: Partial<TimerInfo>) => void;
  chargingInfo: ChargingInfo;
  navigationInfo: NavigationInfo;
  messageInfo: MessageInfo;
  quickShareInfo: QuickShareInfo;
  copiedUrlInfo?: CopiedUrlInfo;
  onOpenApp?: (app: any) => void;
  onDisableIsland?: () => void;
  onTriggerAction: (action: string) => void;
  onRecomposition: () => void;
}

export const IslandSimulator: React.FC<IslandSimulatorProps> = ({
  mode,
  secondaryMode,
  expansion,
  onExpansionChange,
  physics,
  customizer,
  onUpdateCustomizer,
  batteryOpt,
  cutout,
  cutoutSize,
  cutoutOffsetY,
  musicTrack,
  onUpdateMusic,
  callInfo,
  onUpdateCall,
  timerInfo,
  onUpdateTimer,
  chargingInfo,
  navigationInfo,
  messageInfo,
  quickShareInfo,
  copiedUrlInfo,
  onOpenApp,
  onDisableIsland,
  onTriggerAction,
  onRecomposition
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [quickReplyText, setQuickReplyText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [rippleActive, setRippleActive] = useState(false);

  // Disable / Remove App Handler
  const handleDisable = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onDisableIsland) {
      onDisableIsland();
    } else {
      onExpansionChange('compact');
    }
    onTriggerAction(`Dynamic Island: Removed ${mode} app from Dynamic Island`);
  };

  // Equalizer dynamic wave heights
  const [eqHeights, setEqHeights] = useState([8, 14, 10, 16, 12, 6]);

  useEffect(() => {
    onRecomposition();
    if (physics.enableDropletRipple) {
      setRippleActive(true);
      const t = setTimeout(() => setRippleActive(false), 600);
      return () => clearTimeout(t);
    }
  }, [mode, secondaryMode, expansion, onRecomposition, physics.enableDropletRipple]);

  // Animate audio equalizer when music is playing with battery/spec-adaptive polling
  useEffect(() => {
    if (mode === 'music' && musicTrack.isPlaying) {
      const pollRate = batteryOpt?.simplifyEqualizer || batteryOpt?.ecoMode ? 320 : 120;
      const interval = setInterval(() => {
        if (batteryOpt?.simplifyEqualizer) {
          setEqHeights([
            Math.floor(Math.random() * 8) + 4,
            Math.floor(Math.random() * 12) + 6,
            Math.floor(Math.random() * 8) + 4,
            6, 6, 6
          ]);
        } else {
          setEqHeights([
            Math.floor(Math.random() * 12) + 4,
            Math.floor(Math.random() * 16) + 6,
            Math.floor(Math.random() * 14) + 4,
            Math.floor(Math.random() * 18) + 8,
            Math.floor(Math.random() * 14) + 6,
            Math.floor(Math.random() * 10) + 4,
          ]);
        }
      }, pollRate);
      return () => clearInterval(interval);
    }
  }, [mode, musicTrack.isPlaying, batteryOpt?.simplifyEqualizer, batteryOpt?.ecoMode]);

  // Spring transition object derived from physics config
  const springTransition = {
    type: 'spring' as const,
    stiffness: physics.stiffness,
    damping: physics.damping,
    mass: physics.mass,
    restDelta: 0.001,
    restSpeed: 0.001
  };

  const handleTap = () => {
    if (mode === 'idle') return;
    if (physics.enableDropletRipple) {
      setRippleActive(true);
      setTimeout(() => setRippleActive(false), 500);
    }
    // If in Chrome mode and tapped in compact, direct quick launch into Chrome
    if (mode === 'chrome' && onOpenApp && expansion === 'compact') {
      onOpenApp('chrome');
      onTriggerAction('Opening copied URL directly in Chrome browser');
      return;
    }
    if (expansion === 'collapsed' || expansion === 'compact') {
      onExpansionChange('expanded');
    } else {
      onExpansionChange('compact');
    }
  };

  const handleSecondaryTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTriggerAction('Switched focus to secondary activity');
    onExpansionChange('expanded');
  };

  const triggerChargingSpark = () => {
    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.12, x: 0.5 },
        colors: ['#22c55e', '#4ade80', '#10b981', '#ffffff']
      });
    } catch {
      // fallback
    }
  };

  // Compute dimensions based on mode, expansion, and customizer scaling
  const getIslandDimensions = () => {
    const scale = customizer?.widthScale || 1.0;
    const baseH = customizer?.baseHeight || 36;
    const cornerR = customizer?.cornerRadius || 18;

    if (mode === 'idle') {
      return {
        width: Math.round((cutout === 'left-hole' ? 36 : 118) * scale),
        height: baseH,
        borderRadius: cornerR,
      };
    }

    if (expansion === 'collapsed') {
      return {
        width: Math.round(120 * scale),
        height: baseH,
        borderRadius: cornerR,
      };
    }

    if (expansion === 'compact') {
      if (mode === 'split' && secondaryMode) {
        return {
          width: Math.round(175 * scale),
          height: baseH,
          borderRadius: cornerR,
        };
      }
      let baseW = 195;
      switch (mode) {
        case 'music': baseW = 210; break;
        case 'call': baseW = 200; break;
        case 'timer': baseW = 190; break;
        case 'charging': baseW = 218; break;
        case 'navigation': baseW = 224; break;
        case 'message': baseW = 228; break;
        case 'airdrop': baseW = 192; break;
        case 'recording': baseW = 185; break;
        case 'chrome': baseW = 230; break;
        default: baseW = 195; break;
      }
      return {
        width: Math.round(baseW * scale),
        height: baseH,
        borderRadius: cornerR,
      };
    }

    // EXPANDED STATE
    const expScale = customizer?.expandedHeightScale || 1.0;
    switch (mode) {
      case 'music': return { width: 345, height: Math.round(185 * expScale), borderRadius: 36 };
      case 'call': return { width: 345, height: Math.round(170 * expScale), borderRadius: 36 };
      case 'timer': return { width: 345, height: Math.round(155 * expScale), borderRadius: 36 };
      case 'charging': return { width: 340, height: Math.round(150 * expScale), borderRadius: 36 };
      case 'navigation': return { width: 345, height: Math.round(165 * expScale), borderRadius: 36 };
      case 'message': return { width: 345, height: Math.round(165 * expScale), borderRadius: 36 };
      case 'airdrop': return { width: 340, height: Math.round(145 * expScale), borderRadius: 36 };
      case 'recording': return { width: 340, height: Math.round(140 * expScale), borderRadius: 36 };
      case 'chrome': return { width: 345, height: Math.round(165 * expScale), borderRadius: 36 };
      default: return { width: 345, height: Math.round(160 * expScale), borderRadius: 36 };
    }
  };

  const dimensions = getIslandDimensions();

  // Glass & Theme Style Classes (with battery saver & low-spec GPU bypass)
  const getThemeClasses = () => {
    // If AMOLED True Black is active, use 100% black with zero GPU bloom
    if (batteryOpt?.oledPureBlack) {
      return 'bg-black text-white border border-neutral-800 shadow-none';
    }

    // If GPU blur shaders are disabled or running on low-spec device profile
    if (batteryOpt?.disableBackgroundBlur || batteryOpt?.lowSpecDeviceMode) {
      return 'bg-neutral-950 text-white border border-neutral-800 shadow-[0_8px_20px_rgba(0,0,0,0.8)]';
    }

    switch (customizer?.themeStyle) {
      case 'frosted-glass':
        return 'bg-slate-950/85 backdrop-blur-2xl border border-white/15 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.9),0_0_15px_rgba(255,255,255,0.05)]';
      case 'cyber-glow':
        return 'bg-slate-950/90 backdrop-blur-xl border border-blue-400/40 shadow-[0_0_25px_rgba(59,130,246,0.35),0_12px_35px_rgba(0,0,0,0.8)]';
      case 'translucent-blue':
        return 'bg-blue-950/80 backdrop-blur-2xl border border-blue-300/30 shadow-[0_16px_40px_-10px_rgba(15,23,42,0.9),0_0_20px_rgba(96,165,250,0.15)]';
      case 'obsidian':
      default:
        return 'bg-black text-white border border-white/10 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.95),0_0_1px_1px_rgba(255,255,255,0.08)]';
    }
  };

  const offsetX = customizer?.offsetX || 0;
  const offsetY = (customizer?.offsetY ?? 4) + cutoutOffsetY;

  return (
    <div 
      className="relative w-full flex justify-center items-start select-none z-40 transition-all duration-150"
      style={{ 
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
    >
      {/* Visual Alignment Calibration Guides */}
      {customizer?.showCalibrationGuide && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full max-w-[340px] pointer-events-none z-50 flex flex-col items-center">
          {/* Center alignment crosshair line */}
          <div className="w-[1px] h-20 bg-blue-400/80 dashed shadow-[0_0_8px_#60a5fa]" />
          <div className="absolute top-0 px-2 py-0.5 rounded bg-blue-600 text-[9px] font-mono text-white shadow font-bold flex items-center gap-1">
            <Crosshair className="w-2.5 h-2.5" />
            <span>X: {offsetX}px • Y: {offsetY}px</span>
          </div>
        </div>
      )}

      {/* Physical Punch Hole Simulator */}
      {cutout === 'center-hole' && (
        <div 
          className="absolute z-50 pointer-events-none rounded-full bg-black ring-1 ring-neutral-900 shadow-inner"
          style={{
            width: `${cutoutSize}px`,
            height: `${cutoutSize}px`,
            top: '7px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-900/60 m-1" />
        </div>
      )}

      {cutout === 'left-hole' && (
        <div 
          className="absolute z-50 pointer-events-none rounded-full bg-black ring-1 ring-neutral-900 shadow-inner"
          style={{
            width: `${cutoutSize}px`,
            height: `${cutoutSize}px`,
            top: '7px',
            left: '18px'
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-900/60 m-1" />
        </div>
      )}

      {cutout === 'pill-center' && (
        <div 
          className="absolute z-50 pointer-events-none rounded-full bg-black ring-1 ring-neutral-900 flex items-center justify-between px-1.5 shadow-inner"
          style={{
            width: '42px',
            height: '20px',
            top: '7px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-950" />
          <div className="w-2 h-2 rounded-full bg-neutral-800" />
        </div>
      )}

      {/* Main Island Container */}
      <div className="flex items-center gap-2">
        <motion.div
          id="dynamic-island-main-pill"
          onClick={handleTap}
          animate={{
            width: dimensions.width,
            height: dimensions.height,
            borderRadius: dimensions.borderRadius,
            scale: rippleActive ? 1.02 : 1,
          }}
          transition={springTransition}
          drag={customizer?.allowDirectDragAdjust ? true : (expansion === 'expanded' ? 'y' : false)}
          dragConstraints={customizer?.allowDirectDragAdjust ? { left: -90, right: 90, top: 0, bottom: 40 } : { top: 0, bottom: 0 }}
          dragElastic={0.25}
          onDragEnd={(_, info) => {
            if (customizer?.allowDirectDragAdjust && onUpdateCustomizer) {
              onUpdateCustomizer({
                offsetX: Math.round(offsetX + info.offset.x),
                offsetY: Math.max(0, Math.min(40, Math.round(offsetY + info.offset.y)))
              });
            } else if (info.offset.y < -30) {
              onExpansionChange('compact');
            }
          }}
          className={`relative text-white overflow-hidden cursor-pointer flex flex-col justify-center select-none ${getThemeClasses()}`}
        >
          {/* Glass Specular Reflection Highlight Curve */}
          {physics.glassSpecularIntensity > 0 && (
            <div 
              className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-30"
              style={{ opacity: physics.glassSpecularIntensity }}
            />
          )}

          {/* Liquid Droplet Ripple Wave Overlay */}
          {rippleActive && (
            <motion.div 
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-blue-400/15 pointer-events-none z-20"
            />
          )}

          {/* 3-Second Auto-Dismiss Progress Bar for Copied URL */}
          {mode === 'chrome' && expansion === 'compact' && (
            <motion.div
              key="chrome-progress-bar"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 3, ease: 'linear' }}
              style={{ originX: 0 }}
              className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300 pointer-events-none z-30 shadow-[0_0_8px_#38bdf8]"
            />
          )}

          {/* Direct Drag Indicator overlay when Calibration mode is on */}
          {customizer?.allowDirectDragAdjust && (
            <div className="absolute top-1 right-2 z-40 flex items-center gap-1 text-[8px] font-mono text-blue-400 bg-blue-950/80 px-1 rounded pointer-events-none">
              <Move className="w-2.5 h-2.5" />
              <span>Drag to Align</span>
            </div>
          )}

          {/* IDLE / COLLAPSED STATE */}
          {mode === 'idle' && (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-medium px-3">
              <span className="opacity-0">Camera Pill</span>
            </div>
          )}

          {/* COMPACT VIEW (Intelligent Dual-Wing Safe-Zone Layout) */}
          {expansion === 'compact' && mode !== 'idle' && (
            <motion.div 
              key="compact-content"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.16 }}
              className="w-full h-full px-3 flex items-center justify-between"
            >
              {/* Center Safe-Zone Gap Calculation */}
              {(() => {
                const centerClearance = cutout === 'pill-center' 
                  ? 50 
                  : (cutout === 'left-hole' ? 12 : Math.max(cutoutSize + 18, customizer?.cutoutSafeClearance || 36));
                const showTitle = customizer?.compactTextDisplay !== 'icon-only';

                return (
                  <>
                    {/* LEFT WING: Leading Icon / Artwork / Avatar */}
                    <div className="flex items-center gap-2 shrink-0 z-10 max-w-[48%]">
                      {mode === 'music' && (
                        <>
                          <img 
                            src={musicTrack.coverUrl} 
                            alt="Art" 
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-white/20 animate-spin-slow shrink-0"
                            style={{ animationDuration: musicTrack.isPlaying ? '6s' : '0s' }}
                          />
                          {showTitle && (
                            <span className="text-[11px] font-semibold truncate max-w-[62px] text-neutral-200">
                              {musicTrack.title}
                            </span>
                          )}
                        </>
                      )}

                      {mode === 'call' && (
                        <>
                          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse shrink-0">
                            <Phone className="w-2.5 h-2.5 text-black fill-current" />
                          </div>
                          {showTitle && (
                            <span className="text-[11px] font-semibold text-neutral-200 truncate max-w-[60px]">
                              {callInfo.callerName}
                            </span>
                          )}
                        </>
                      )}

                      {mode === 'timer' && (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin shrink-0" />
                          <span className="text-[11px] font-medium text-amber-300">Timer</span>
                        </>
                      )}

                      {mode === 'charging' && (
                        <>
                          <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                          <span className="text-xs font-semibold text-emerald-300">{chargingInfo.batteryLevel}%</span>
                        </>
                      )}

                      {mode === 'navigation' && (
                        <>
                          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                            <ArrowUpRight className="w-2.5 h-2.5 text-white" />
                          </div>
                          {showTitle && (
                            <span className="text-[11px] text-neutral-200 truncate max-w-[58px]">
                              {navigationInfo.instruction}
                            </span>
                          )}
                        </>
                      )}

                      {mode === 'message' && (
                        <>
                          <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                            W
                          </div>
                          <span className="text-[11px] font-semibold text-white truncate max-w-[58px]">
                            {messageInfo.senderName}
                          </span>
                        </>
                      )}

                      {mode === 'split' && (
                        <>
                          <img 
                            src={musicTrack.coverUrl} 
                            alt="Music" 
                            className="w-4 h-4 rounded-full object-cover shrink-0" 
                          />
                          <span className="text-[11px] font-medium text-neutral-200 truncate max-w-[50px]">
                            {musicTrack.title}
                          </span>
                        </>
                      )}

                      {mode === 'airdrop' && (
                        <>
                          <Share2 className="w-3.5 h-3.5 text-blue-400 animate-pulse shrink-0" />
                          <span className="text-[11px] text-slate-200">Share</span>
                        </>
                      )}

                      {mode === 'recording' && (
                        <>
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
                          <span className="text-[11px] text-red-400 font-medium">REC</span>
                        </>
                      )}

                      {mode === 'chrome' && (
                        <>
                          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm shrink-0">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" fill="#EA4335" />
                              <path d="M12 2a10 10 0 0 1 8.66 5H12v5h-2L6.8 6.5A10 10 0 0 1 12 2z" fill="#EA4335"/>
                              <path d="M20.66 7A10 10 0 0 1 18.8 19.3L15.3 13.2l-1.5 2.6L12 12V7h8.66z" fill="#FBBC05"/>
                              <path d="M18.8 19.3A10 10 0 0 1 3.34 12L8.5 12l2.5 4.33L7.5 19.3l11.3 0z" fill="#34A853"/>
                              <circle cx="12" cy="12" r="4.5" fill="#FFFFFF" />
                              <circle cx="12" cy="12" r="3" fill="#4285F4" />
                            </svg>
                          </div>
                          <span className="text-[11px] font-semibold text-white truncate max-w-[62px]">
                            Open in Chrome
                          </span>
                        </>
                      )}
                    </div>

                    {/* CENTER PUNCH-HOLE SAFE CLEARANCE GAP (Guarantees zero content overlap with camera cutout) */}
                    <div 
                      style={{ width: `${centerClearance}px` }} 
                      className="shrink-0 pointer-events-none" 
                    />

                    {/* RIGHT WING: Trailing Equalizer / Status Timers / Counters */}
                    <div className="flex items-center justify-end gap-1.5 shrink-0 z-10 max-w-[48%]">
                      {mode === 'music' && (
                        <div className="flex items-end gap-0.5 h-3.5 pl-1">
                          {eqHeights.map((h, i) => (
                            <motion.div 
                              key={i} 
                              className="w-0.5 bg-emerald-400 rounded-full"
                              animate={{ height: `${h}px` }}
                              transition={{ duration: 0.12 }}
                            />
                          ))}
                        </div>
                      )}

                      {mode === 'call' && (
                        <span className="text-xs font-mono font-medium text-emerald-400">02:48</span>
                      )}

                      {mode === 'timer' && (
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {Math.floor(timerInfo.remainingSeconds / 60)}:{(timerInfo.remainingSeconds % 60).toString().padStart(2, '0')}
                        </span>
                      )}

                      {mode === 'charging' && (
                        <span className="text-[10px] font-mono text-emerald-400/90 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          45W Fast
                        </span>
                      )}

                      {mode === 'navigation' && (
                        <span className="text-xs font-bold font-mono text-blue-400">
                          {navigationInfo.distanceRemaining}
                        </span>
                      )}

                      {mode === 'message' && (
                        <span className="text-[10px] text-neutral-300 truncate max-w-[65px]">
                          {messageInfo.messageText}
                        </span>
                      )}

                      {mode === 'split' && (
                        <div className="flex items-end gap-0.5 h-3">
                          {eqHeights.slice(0, 3).map((h, i) => (
                            <motion.div 
                              key={i} 
                              className="w-0.5 bg-emerald-400 rounded-full"
                              animate={{ height: `${h}px` }}
                              transition={{ duration: 0.12 }}
                            />
                          ))}
                        </div>
                      )}

                      {mode === 'airdrop' && (
                        <span className="text-xs font-mono font-bold text-blue-400">
                          {quickShareInfo.progress}%
                        </span>
                      )}

                      {mode === 'recording' && (
                        <span className="text-xs font-mono font-bold text-red-400">
                          00:14
                        </span>
                      )}

                      {mode === 'chrome' && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-blue-300 font-mono truncate max-w-[55px]">
                            {copiedUrlInfo?.url.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'github.com'}
                          </span>
                          <div className="flex items-center gap-0.5 bg-blue-500/25 px-1 py-0.5 rounded-full border border-blue-400/40 text-[9px] font-mono text-blue-300 font-bold">
                            <span>3s</span>
                            <ArrowUpRight className="w-2.5 h-2.5 text-blue-300 shrink-0" />
                          </div>
                        </div>
                      )}

                      {/* Mini Disable / Remove from Island Button */}
                      <button
                        id="island-compact-disable-btn"
                        title={`Disable & remove ${mode} from Dynamic Island`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDisable(e);
                        }}
                        className="w-4 h-4 rounded-full bg-white/10 hover:bg-red-500/80 text-white/50 hover:text-white transition flex items-center justify-center cursor-pointer shrink-0 z-20 active:scale-90"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}

          {/* EXPANDED VIEW */}
          {expansion === 'expanded' && (
            <motion.div
              key="expanded-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full p-4 flex flex-col justify-between font-sans"
            >
              {/* MUSIC EXPANDED */}
              {mode === 'music' && (
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={musicTrack.coverUrl} 
                        alt="Album Art" 
                        className="w-12 h-12 rounded-xl object-cover shadow-lg ring-1 ring-white/10" 
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white tracking-tight">{musicTrack.title}</span>
                        <span className="text-xs text-neutral-400 font-medium">{musicTrack.artist}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button 
                        id="island-music-like-btn"
                        onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
                        className="p-1.5 rounded-full hover:bg-neutral-800 transition"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : 'text-neutral-400'}`} />
                      </button>
                      <button
                        id="island-music-disable-btn"
                        onClick={handleDisable}
                        title="Remove Spotify from Dynamic Island (Disable)"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/15 hover:bg-red-500/30 text-red-300 hover:text-white border border-red-500/30 text-[10.5px] font-semibold transition cursor-pointer shadow-sm active:scale-95"
                      >
                        <PowerOff className="w-3 h-3 text-red-400" />
                        <span>Disable</span>
                      </button>
                    </div>
                  </div>

                  {/* Scrubber Bar */}
                  <div className="space-y-1 my-1">
                    <div 
                      className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const pct = clickX / rect.width;
                        onUpdateMusic({ currentTime: Math.floor(pct * musicTrack.duration) });
                      }}
                    >
                      <div 
                        className="h-full bg-white rounded-full transition-all"
                        style={{ width: `${(musicTrack.currentTime / musicTrack.duration) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                      <span>{Math.floor(musicTrack.currentTime / 60)}:{(musicTrack.currentTime % 60).toString().padStart(2, '0')}</span>
                      <span>-{Math.floor((musicTrack.duration - musicTrack.currentTime) / 60)}:{((musicTrack.duration - musicTrack.currentTime) % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center justify-between px-4 pt-1">
                    <button 
                      id="island-music-prev"
                      onClick={(e) => { e.stopPropagation(); onUpdateMusic({ currentTime: 0 }); }}
                      className="text-neutral-300 hover:text-white transition p-1"
                    >
                      <SkipBack className="w-5 h-5 fill-current" />
                    </button>
                    <button 
                      id="island-music-play-pause"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onUpdateMusic({ isPlaying: !musicTrack.isPlaying }); 
                      }}
                      className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition shadow-lg"
                    >
                      {musicTrack.isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>
                    <button 
                      id="island-music-next"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onTriggerAction('Next track loaded'); 
                      }}
                      className="text-neutral-300 hover:text-white transition p-1"
                    >
                      <SkipForward className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>
              )}

              {/* CALL EXPANDED */}
              {mode === 'call' && (
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={callInfo.callerAvatar} 
                        alt="Avatar" 
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/50" 
                      />
                      <div>
                        <div className="text-sm font-bold text-white tracking-tight">{callInfo.callerName}</div>
                        <div className="text-xs text-neutral-400 font-medium">{callInfo.callerNumber}</div>
                        <div className="text-[11px] font-mono text-emerald-400 font-semibold mt-0.5">Active • 02:48</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button 
                        id="island-call-mute"
                        onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                        className={`p-2 rounded-full ${isMuted ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-neutral-800 text-neutral-300'} transition`}
                      >
                        {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      </button>
                      <button 
                        id="island-call-speaker"
                        onClick={(e) => { e.stopPropagation(); setIsSpeaker(!isSpeaker); }}
                        className={`p-2 rounded-full ${isSpeaker ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' : 'bg-neutral-800 text-neutral-300'} transition`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id="island-call-disable-btn"
                        onClick={handleDisable}
                        title="Remove Call from Dynamic Island (Disable)"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/15 hover:bg-red-500/30 text-red-300 hover:text-white border border-red-500/30 text-[10.5px] font-semibold transition cursor-pointer shadow-sm active:scale-95"
                      >
                        <PowerOff className="w-3 h-3 text-red-400" />
                        <span>Disable</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-8 pt-2">
                    <button 
                      id="island-call-hangup"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onTriggerAction('Call ended'); 
                        onExpansionChange('compact');
                      }}
                      className="w-28 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 transition"
                    >
                      <PhoneOff className="w-4 h-4" />
                      <span className="text-xs">End Call</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TIMER EXPANDED */}
              {mode === 'timer' && (
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Timer</span>
                      <div className="text-2xl font-mono font-bold text-white mt-0.5">
                        {Math.floor(timerInfo.remainingSeconds / 60)}:{(timerInfo.remainingSeconds % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-11 h-11 rounded-full border-4 border-neutral-800 border-t-amber-400 flex items-center justify-center font-mono text-xs font-bold text-amber-300">
                        {Math.round((timerInfo.remainingSeconds / timerInfo.totalSeconds) * 100)}%
                      </div>
                      <button
                        id="island-timer-disable-btn"
                        onClick={handleDisable}
                        title="Remove Timer from Dynamic Island (Disable)"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/15 hover:bg-red-500/30 text-red-300 hover:text-white border border-red-500/30 text-[10.5px] font-semibold transition cursor-pointer shadow-sm active:scale-95"
                      >
                        <PowerOff className="w-3 h-3 text-red-400" />
                        <span>Disable</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button 
                      id="island-timer-add1m"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onUpdateTimer({ remainingSeconds: timerInfo.remainingSeconds + 60 }); 
                      }}
                      className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition"
                    >
                      +1 Min
                    </button>
                    <button 
                      id="island-timer-pause"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onUpdateTimer({ isRunning: !timerInfo.isRunning }); 
                      }}
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-semibold text-black transition"
                    >
                      {timerInfo.isRunning ? 'Pause' : 'Resume'}
                    </button>
                    <button 
                      id="island-timer-cancel"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onTriggerAction('Timer cancelled'); 
                        handleDisable(e);
                      }}
                      className="p-2 rounded-xl bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* CHARGING EXPANDED */}
              {mode === 'charging' && (
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                        <BatteryCharging className="w-7 h-7 text-emerald-400 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white flex items-center gap-1.5">
                          {chargingInfo.batteryLevel}% 
                          <span className="text-xs font-normal text-emerald-400 font-mono">Charged</span>
                        </div>
                        <div className="text-xs text-neutral-400 font-medium">{chargingInfo.chargingSpeed}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button 
                        id="island-charging-surge"
                        onClick={(e) => { e.stopPropagation(); triggerChargingSpark(); }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium flex items-center gap-1 hover:bg-emerald-500/30 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Surge
                      </button>
                      <button
                        id="island-charging-disable-btn"
                        onClick={handleDisable}
                        title="Remove Charging from Dynamic Island (Disable)"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/15 hover:bg-red-500/30 text-red-300 hover:text-white border border-red-500/30 text-[10.5px] font-semibold transition cursor-pointer shadow-sm active:scale-95"
                      >
                        <PowerOff className="w-3 h-3 text-red-400" />
                        <span>Disable</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${chargingInfo.batteryLevel}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-neutral-400 font-medium">
                      <span>Until Full Charge</span>
                      <span className="font-semibold text-neutral-200 font-mono">~24 mins</span>
                    </div>
                  </div>
                </div>
              )}

              {/* NAVIGATION EXPANDED */}
              {mode === 'navigation' && (
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
                        <ArrowUpRight className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white tracking-tight">{navigationInfo.instruction}</div>
                        <div className="text-xs text-blue-300 font-medium mt-0.5">{navigationInfo.nextRoad}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-base font-bold text-emerald-400 font-mono">{navigationInfo.eta}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{navigationInfo.distanceRemaining}</div>
                      </div>
                      <button
                        id="island-nav-disable-btn"
                        onClick={handleDisable}
                        title="Remove Navigation from Dynamic Island (Disable)"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/15 hover:bg-red-500/30 text-red-300 hover:text-white border border-red-500/30 text-[10.5px] font-semibold transition cursor-pointer shadow-sm active:scale-95"
                      >
                        <PowerOff className="w-3 h-3 text-red-400" />
                        <span>Disable</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-neutral-900/80 px-3 py-1.5 rounded-xl border border-neutral-800 text-xs text-neutral-300">
                    <span>Route via US-101 North</span>
                    <span className="text-emerald-400 font-medium font-mono">Faster by 4 mins</span>
                  </div>
                </div>
              )}

              {/* MESSAGE EXPANDED */}
              {mode === 'message' && (
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={messageInfo.avatar} 
                        alt="Sender" 
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-emerald-500" 
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{messageInfo.senderName}</span>
                          <span className="px-1.5 py-0.2 bg-emerald-600/30 text-emerald-400 rounded text-[10px] font-medium">
                            {messageInfo.appName}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-300 line-clamp-1 mt-0.5">{messageInfo.messageText}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-neutral-400 font-mono">{messageInfo.timestamp}</span>
                      <button
                        id="island-message-disable-btn"
                        onClick={handleDisable}
                        title="Remove Message from Dynamic Island (Disable)"
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 hover:bg-red-500/30 text-red-300 hover:text-white border border-red-500/30 text-[10px] font-semibold transition cursor-pointer shadow-sm active:scale-95"
                      >
                        <PowerOff className="w-2.5 h-2.5 text-red-400" />
                        <span>Disable</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input 
                      type="text"
                      placeholder="Quick reply..."
                      value={quickReplyText}
                      onChange={(e) => setQuickReplyText(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && quickReplyText.trim()) {
                          onTriggerAction(`Replied: "${quickReplyText}"`);
                          setQuickReplyText('');
                          onExpansionChange('compact');
                        }
                      }}
                      className="flex-1 bg-neutral-900 border border-neutral-700 text-xs rounded-xl px-3 py-1.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                    <button 
                      id="island-message-send"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (quickReplyText.trim()) {
                          onTriggerAction(`Replied: "${quickReplyText}"`);
                          setQuickReplyText('');
                          onExpansionChange('compact');
                        }
                      }}
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* CHROME URL EXPANDED */}
              {mode === 'chrome' && (
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-white/15 flex items-center justify-center p-2 shadow-xl shrink-0">
                        <svg className="w-7 h-7" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" fill="#EA4335" />
                          <path d="M12 2a10 10 0 0 1 8.66 5H12v5h-2L6.8 6.5A10 10 0 0 1 12 2z" fill="#EA4335"/>
                          <path d="M20.66 7A10 10 0 0 1 18.8 19.3L15.3 13.2l-1.5 2.6L12 12V7h8.66z" fill="#FBBC05"/>
                          <path d="M18.8 19.3A10 10 0 0 1 3.34 12L8.5 12l2.5 4.33L7.5 19.3l11.3 0z" fill="#34A853"/>
                          <circle cx="12" cy="12" r="4.5" fill="#FFFFFF" />
                          <circle cx="12" cy="12" r="3.2" fill="#4285F4" />
                        </svg>
                      </div>
                      <div className="max-w-[170px]">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Link Copied</span>
                          <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-400 rounded text-[9px] font-medium border border-blue-500/30">
                            Chrome
                          </span>
                        </div>
                        <div className="text-xs text-neutral-200 font-medium truncate mt-0.5">
                          {copiedUrlInfo?.title || 'Open in Chrome'}
                        </div>
                        <div className="text-[10px] text-blue-400 font-mono truncate">
                          {copiedUrlInfo?.url || 'https://github.com/android/compose-samples'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        id="island-chrome-disable-btn"
                        onClick={handleDisable}
                        title="Remove Chrome prompt from Dynamic Island (Disable)"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/15 hover:bg-red-500/30 text-red-300 hover:text-white border border-red-500/30 text-[10.5px] font-semibold transition cursor-pointer shadow-sm active:scale-95"
                      >
                        <PowerOff className="w-3 h-3 text-red-400" />
                        <span>Disable</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onExpansionChange('compact');
                        }}
                        className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button 
                      id="island-chrome-open-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenApp) {
                          onOpenApp('chrome');
                        }
                        onTriggerAction(`Opening link in Google Chrome`);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/40 transition cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in Chrome</span>
                    </button>

                    <button 
                      id="island-chrome-copy-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(copiedUrlInfo?.url || 'https://github.com');
                        }
                        onTriggerAction('Copied URL again');
                      }}
                      className="px-3 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition cursor-pointer flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* SECONDARY MINI-ISLAND FOR SPLIT / MULTI-ACTIVITY (e.g. Timer alongside Music) */}
        {mode === 'split' && secondaryMode && (
          <motion.div
            id="dynamic-island-secondary-bubble"
            onClick={handleSecondaryTap}
            initial={{ scale: 0, opacity: 0, x: -10 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0, opacity: 0, x: -10 }}
            transition={springTransition}
            className={`w-9 h-9 rounded-full text-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform ${getThemeClasses()}`}
          >
            {secondaryMode === 'timer' && (
              <span className="text-[10px] font-mono font-bold text-amber-400">
                {timerInfo.remainingSeconds}s
              </span>
            )}
            {secondaryMode === 'charging' && (
              <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
            )}
            {secondaryMode === 'call' && (
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
            )}
            {secondaryMode === 'navigation' && (
              <Navigation className="w-3.5 h-3.5 text-blue-400" />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
