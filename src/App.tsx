/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Smartphone, Code2, ShieldCheck, Sparkles, Activity, 
  Layers, Volume2, Sliders, Cpu, Terminal, Github, ExternalLink,
  Laptop, CheckCircle2, Zap, BatteryCharging, Leaf, Gauge
} from 'lucide-react';
import { PhoneFrame, ActivePhoneApp } from './components/PhoneFrame';
import { EventTriggerPanel } from './components/Controls/EventTriggerPanel';
import { PhysicsConfigPanel } from './components/Controls/PhysicsConfigPanel';
import { IslandCustomizerPanel } from './components/Controls/IslandCustomizerPanel';
import { TelemetryPanel } from './components/Controls/TelemetryPanel';
import { BatteryOptimizationPanel } from './components/Controls/BatteryOptimizationPanel';
import { KotlinCodeViewer } from './components/CodeViewer/KotlinCodeViewer';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { SecurityCompatibilityAuditor } from './components/SecurityCompatibility/SecurityCompatibilityAuditor';
import { 
  IslandMode, IslandExpansionState, CutoutType, SpringPhysicsConfig,
  IslandCustomizerConfig, PhysicsAnimationType,
  MusicTrack, CallInfo, TimerInfo, ChargingInfo, NavigationInfo, MessageInfo, QuickShareInfo,
  FrameTelemetry, BatteryOptimizationConfig, CopiedUrlInfo
} from './types';

export default function App() {
  // Navigation tabs for the workbench
  const [activeTab, setActiveTab] = useState<'simulator' | 'security' | 'code' | 'architecture'>('simulator');
  const [activeSubTab, setActiveSubTab] = useState<'customizer' | 'battery' | 'security' | 'events' | 'physics' | 'telemetry'>('battery');

  // Dynamic Island State
  const [mode, setMode] = useState<IslandMode>('music');
  const [secondaryMode, setSecondaryMode] = useState<IslandMode | null>(null);
  const [expansion, setExpansion] = useState<IslandExpansionState>('compact');

  // Butter Smooth Physics & Droplet settings
  const [physics, setPhysics] = useState<SpringPhysicsConfig>({
    stiffness: 280,
    damping: 25,
    mass: 0.95,
    presetName: 'Butter Smooth Spring',
    animationType: 'butter-smooth',
    dropletViscosity: 0.75,
    glassSpecularIntensity: 0.8,
    enableDropletRipple: true
  });

  // User Customizer & Phone Calibration Settings
  const [customizer, setCustomizer] = useState<IslandCustomizerConfig>({
    offsetX: 0,
    offsetY: 4,
    widthScale: 1.0,
    baseHeight: 36,
    expandedHeightScale: 1.0,
    cornerRadius: 18,
    themeStyle: 'frosted-glass',
    showCalibrationGuide: false,
    allowDirectDragAdjust: false,
    autoCutoutAvoidance: true,
    cutoutSafeClearance: 36,
    compactTextDisplay: 'auto-wing',
    devicePreset: 'galaxy-s24'
  });

  // Heavy Battery & Low-Spec Mobile Optimization Engine State
  const [batteryOpt, setBatteryOpt] = useState<BatteryOptimizationConfig>({
    ecoMode: false,
    lowSpecDeviceMode: false,
    oledPureBlack: false,
    disableBackgroundBlur: false,
    simplifyEqualizer: false,
    pauseSpinWhenHidden: true,
    targetFps: 60,
    estimatedBatteryDrainHourly: 0.12
  });

  const [cutout, setCutout] = useState<CutoutType>('center-hole');
  const [cutoutSize, setCutoutSize] = useState<number>(14);
  const [cutoutOffsetY, setCutoutOffsetY] = useState<number>(0);
  const [targetFps, setTargetFps] = useState<30 | 60 | 90 | 120>(120);

  // Active Running App underneath the overlay
  const [activeApp, setActiveApp] = useState<ActivePhoneApp>('home');

  // Device Wallpapers
  const wallpapers = [
    { name: 'Material You Dusk', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
    { name: 'Cyber Horizon', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80' },
    { name: 'Deep OLED Black', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80' },
    { name: 'Northern Aurora', url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80' }
  ];
  const [selectedWallpaper, setSelectedWallpaper] = useState<string>(wallpapers[0].url);

  // Live Simulated Entities
  const [musicTrack, setMusicTrack] = useState<MusicTrack>({
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80',
    duration: 200,
    currentTime: 74,
    isPlaying: true,
    themeColor: '#10b981'
  });

  const [callInfo, setCallInfo] = useState<CallInfo>({
    callerName: 'Sarah Connor',
    callerNumber: '+1 (555) 019-2834',
    callerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    callDuration: 168,
    status: 'active'
  });

  const [timerInfo, setTimerInfo] = useState<TimerInfo>({
    totalSeconds: 300,
    remainingSeconds: 184,
    label: 'Pasta Boiling',
    isRunning: true
  });

  const [chargingInfo, setChargingInfo] = useState<ChargingInfo>({
    batteryLevel: 79,
    chargingSpeed: 'Super Fast 2.0 (45W)',
    isCharging: true,
    timeRemainingMinutes: 22
  });

  const [navigationInfo, setNavigationInfo] = useState<NavigationInfo>({
    instruction: 'In 200m, turn right',
    nextRoad: 'Market Street',
    distanceRemaining: '200m',
    icon: 'turn-right',
    eta: '14 min'
  });

  const [messageInfo, setMessageInfo] = useState<MessageInfo>({
    senderName: 'Elena Rostova',
    appName: 'WhatsApp',
    messageText: 'Android 16 spring physics are buttery smooth at 120 FPS!',
    timestamp: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
  });

  const [quickShareInfo] = useState<QuickShareInfo>({
    fileName: 'Android16_Compose_BOM.apk',
    fileSize: '42.8 MB',
    progress: 68,
    senderDevice: 'Pixel 10 Pro'
  });

  const [copiedUrlInfo, setCopiedUrlInfo] = useState<CopiedUrlInfo>({
    url: 'https://github.com/android/dynamic-island-compose',
    title: 'Android 16 Jetpack Compose Dynamic Island BOM',
    source: 'Google Chrome',
    favicon: 'https://www.google.com/favicon.ico'
  });

  // Recomposition & Performance Telemetry
  const [recompositionCount, setRecompositionCount] = useState<number>(142);
  const [lastActionToast, setLastActionToast] = useState<string>('Dynamic Island Overlay initialized on Android 16 (API 36)');

  const handleRecomposition = useCallback(() => {
    setRecompositionCount(prev => prev + 1);
  }, []);

  const handleTriggerAction = useCallback((action: string) => {
    setLastActionToast(action);
  }, []);

  // Smart URL Copy Trigger for Chrome Dynamic Island with 3-second Auto-Dismiss
  const copyUrlTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousModeBeforeCopyRef = useRef<IslandMode>('music');

  const handleCopyUrl = useCallback((url: string = 'https://github.com/android/dynamic-island-compose', title: string = 'Android 16 Jetpack Compose Dynamic Island') => {
    // Record current mode if not already chrome so we can return to it after 3s
    setMode(currentMode => {
      if (currentMode !== 'chrome') {
        previousModeBeforeCopyRef.current = currentMode;
      }
      return 'chrome';
    });

    setCopiedUrlInfo({
      url,
      title,
      source: 'Google Chrome',
      favicon: 'https://www.google.com/favicon.ico'
    });
    setExpansion('compact');
    handleTriggerAction(`Copied link "${url}" → Dynamic Island "Open in Chrome" (auto-dismissing in 3s)`);

    // Reset any existing dismiss timer
    if (copyUrlTimerRef.current) {
      clearTimeout(copyUrlTimerRef.current);
    }

    // Automatically dismiss and revert after exactly 3 seconds
    copyUrlTimerRef.current = setTimeout(() => {
      setMode(currentMode => {
        if (currentMode === 'chrome') {
          return previousModeBeforeCopyRef.current || 'music';
        }
        return currentMode;
      });
      setExpansion('compact');
      handleTriggerAction('Dynamic Island: "Open in Chrome" prompt automatically dismissed after 3s.');
    }, 3000);
  }, [handleTriggerAction]);

  const handleSetMode = useCallback((m: IslandMode, sec?: IslandMode | null) => {
    if (copyUrlTimerRef.current) {
      clearTimeout(copyUrlTimerRef.current);
      copyUrlTimerRef.current = null;
    }
    setMode(m);
    setSecondaryMode(sec || null);
  }, []);

  const handleDisableIsland = useCallback(() => {
    if (copyUrlTimerRef.current) {
      clearTimeout(copyUrlTimerRef.current);
      copyUrlTimerRef.current = null;
    }
    const previousMode = mode;
    setMode('idle');
    setSecondaryMode(null);
    setExpansion('compact');
    setMusicTrack(prev => ({ ...prev, isPlaying: false }));
    setTimerInfo(prev => ({ ...prev, isRunning: false }));
    setCallInfo(prev => ({ ...prev, status: 'idle' }));
    handleTriggerAction(`Dynamic Island: Removed ${previousMode} activity (Island disabled to idle state)`);
  }, [mode, handleTriggerAction]);

  const handleSelectApp = useCallback((app: string | null) => {
    if (copyUrlTimerRef.current) {
      clearTimeout(copyUrlTimerRef.current);
      copyUrlTimerRef.current = null;
    }
    setActiveApp(app);
  }, []);

  // Global Clipboard Copy Listener
  useEffect(() => {
    const handleGlobalCopy = () => {
      setTimeout(async () => {
        try {
          if (navigator.clipboard && navigator.clipboard.readText) {
            const text = await navigator.clipboard.readText();
            if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('www.'))) {
              handleCopyUrl(text, 'Copied Web Link');
            }
          }
        } catch {
          // Clipboard read requires browser permission; quick test buttons provide direct fallback
        }
      }, 100);
    };

    window.addEventListener('copy', handleGlobalCopy);
    return () => window.removeEventListener('copy', handleGlobalCopy);
  }, [handleCopyUrl]);

  // Timer Tick Simulation
  useEffect(() => {
    if (timerInfo.isRunning && timerInfo.remainingSeconds > 0) {
      const interval = setInterval(() => {
        setTimerInfo(prev => ({
          ...prev,
          remainingSeconds: Math.max(0, prev.remainingSeconds - 1)
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerInfo.isRunning, timerInfo.remainingSeconds]);

  // Music Progress Simulation
  useEffect(() => {
    if (musicTrack.isPlaying) {
      const interval = setInterval(() => {
        setMusicTrack(prev => ({
          ...prev,
          currentTime: prev.currentTime >= prev.duration ? 0 : prev.currentTime + 1
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [musicTrack.isPlaying]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient background glows for Immersive atmosphere */}
      <div className="fixed top-1/4 -left-32 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 -right-32 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-2/3 left-1/3 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Top Application Bar */}
      <header className="border-b border-white/5 bg-[#020617]/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/25 border border-blue-400/30">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  A16.island_pro
                </h1>
                <span className="text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  API 36 COMPLIANT
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Principal Android Engineer Dynamic Island Performance Dashboard</p>
            </div>
          </div>

          {/* Workbench Tabs & Global FPS Telemetry */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 border-r border-white/5 pr-4">
              {batteryOpt.ecoMode || batteryOpt.lowSpecDeviceMode ? (
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl text-emerald-400 text-xs font-semibold">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>Eco Active ({batteryOpt.estimatedBatteryDrainHourly}%/hr)</span>
                </div>
              ) : null}

              <div className="flex flex-col items-end">
                <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono">Global Frame Rate</span>
                <span className="text-sm font-mono font-bold text-emerald-400">{targetFps}.0 FPS</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center bg-slate-900/50">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Workbench Tabs */}
            <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
              <button
                id="tab-simulator"
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'simulator'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 border border-blue-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Interactive Device</span>
              </button>

              <button
                id="tab-security"
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 border border-blue-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Security & MinSDK-8</span>
              </button>

              <button
                id="tab-code"
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 border border-blue-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Kotlin Architecture (10 Files)</span>
              </button>

              <button
                id="tab-architecture"
                onClick={() => setActiveTab('architecture')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'architecture'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 border border-blue-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>System Specs</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* System Intent Action Toast Bar */}
        <div className="mb-5 bg-slate-900/40 border border-white/5 backdrop-blur-xl px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs text-slate-300 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-500 font-mono text-[11px] uppercase tracking-widest">System Activity:</span>
            <span className="font-medium text-white">{lastActionToast}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
            <span className="text-slate-500">COMPOSE 120Hz VSYNC</span>
            <span className="text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">TYPE_APPLICATION_OVERLAY</span>
          </div>
        </div>

        {/* TAB 1: INTERACTIVE SIMULATOR WORKBENCH */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Main Column: Phone Frame with Island Overlay */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-900/40 border border-white/5 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative">
              {/* Quick Preset Selector & Status */}
              <div className="w-full flex flex-col gap-2 mb-4 px-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Live Device Canvas</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {targetFps} FPS
                    </span>
                  </div>
                  
                  {/* Wallpaper Switcher */}
                  <div className="flex items-center gap-1.5">
                    {wallpapers.map((wp, idx) => (
                      <button
                        key={idx}
                        id={`wallpaper-select-${idx}`}
                        title={wp.name}
                        onClick={() => setSelectedWallpaper(wp.url)}
                        className={`w-4 h-4 rounded-full border transition cursor-pointer ${
                          selectedWallpaper === wp.url ? 'ring-2 ring-blue-400 border-white scale-110' : 'border-slate-700 opacity-60 hover:opacity-100'
                        }`}
                        style={{ backgroundImage: `url(${wp.url})`, backgroundSize: 'cover' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Quick Physics & Calibration Action Bar */}
                <div className="flex items-center justify-between gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/5 text-xs">
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {[
                      { id: 'butter-smooth' as PhysicsAnimationType, label: '🧈 Butter Smooth', k: 280, d: 25, m: 0.95, visc: 0.75 },
                      { id: 'liquid-droplet' as PhysicsAnimationType, label: '💧 Raindrop', k: 330, d: 21, m: 0.9, visc: 0.95 },
                      { id: 'frosted-glass' as PhysicsAnimationType, label: '🪟 Glass Aero', k: 300, d: 27, m: 1.0, visc: 0.5 },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setPhysics(prev => ({
                            ...prev,
                            animationType: p.id,
                            presetName: p.label,
                            stiffness: p.k,
                            damping: p.d,
                            mass: p.m,
                            dropletViscosity: p.visc
                          }));
                          handleTriggerAction(`Switched physics to ${p.label}`);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                          physics.animationType === p.id
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCustomizer(prev => ({ ...prev, showCalibrationGuide: !prev.showCalibrationGuide }))}
                    title="Toggle alignment guides & crosshair"
                    className={`px-2 py-1 rounded-xl text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer ${
                      customizer.showCalibrationGuide
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span>Guide</span>
                  </button>
                </div>
              </div>

              <PhoneFrame
                mode={mode}
                onSetMode={handleSetMode}
                secondaryMode={secondaryMode}
                expansion={expansion}
                onExpansionChange={setExpansion}
                physics={physics}
                customizer={customizer}
                onUpdateCustomizer={(cfg) => setCustomizer(prev => ({ ...prev, ...cfg }))}
                batteryOpt={batteryOpt}
                cutout={cutout}
                cutoutSize={cutoutSize}
                cutoutOffsetY={cutoutOffsetY}
                activeApp={activeApp}
                onSelectApp={handleSelectApp}
                wallpaper={selectedWallpaper}
                musicTrack={musicTrack}
                onUpdateMusic={(upd) => setMusicTrack(prev => ({ ...prev, ...upd }))}
                callInfo={callInfo}
                onUpdateCall={(upd) => setCallInfo(prev => ({ ...prev, ...upd }))}
                timerInfo={timerInfo}
                onUpdateTimer={(upd) => setTimerInfo(prev => ({ ...prev, ...upd }))}
                chargingInfo={chargingInfo}
                navigationInfo={navigationInfo}
                messageInfo={messageInfo}
                quickShareInfo={quickShareInfo}
                copiedUrlInfo={copiedUrlInfo}
                onCopyUrl={handleCopyUrl}
                onDisableIsland={handleDisableIsland}
                onTriggerAction={handleTriggerAction}
                onRecomposition={handleRecomposition}
              />
              
              <div className="mt-4 text-center">
                <p className="text-[11px] text-slate-400">
                  <strong className="text-slate-200">Interactive:</strong> Tap Island to morph into expanded HUD. Touch anywhere outside or swipe up to minimize.
                </p>
              </div>
            </div>

            {/* Right Column: Controls, Customizer, Physics & Telemetry HUD */}
            <div className="lg:col-span-7 space-y-5">
              {/* Control Sub-Tabs Selector */}
              <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md overflow-x-auto no-scrollbar">
                <button
                  id="subtab-battery"
                  onClick={() => setActiveSubTab('battery')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    activeSubTab === 'battery'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 border border-emerald-400/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-300" />
                  <span>🔋 Battery & Low-Spec Mode</span>
                </button>

                <button
                  id="subtab-customizer"
                  onClick={() => setActiveSubTab('customizer')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    activeSubTab === 'customizer'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 border border-blue-400/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>📱 Phone Customizer</span>
                </button>

                <button
                  id="subtab-security"
                  onClick={() => setActiveSubTab('security')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    activeSubTab === 'security'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 border border-blue-400/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>🛡️ Security & MinSDK-8</span>
                </button>

                <button
                  id="subtab-events"
                  onClick={() => setActiveSubTab('events')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    activeSubTab === 'events'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 border border-blue-400/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>⚡ Event Triggers</span>
                </button>

                <button
                  id="subtab-physics"
                  onClick={() => setActiveSubTab('physics')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    activeSubTab === 'physics'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 border border-blue-400/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>🌊 Physics</span>
                </button>

                <button
                  id="subtab-telemetry"
                  onClick={() => setActiveSubTab('telemetry')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    activeSubTab === 'telemetry'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 border border-blue-400/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>📊 Telemetry</span>
                </button>
              </div>

              {/* Subtab View 0: Heavy Battery & Low-Spec Mobile Optimization */}
              {activeSubTab === 'battery' && (
                <BatteryOptimizationPanel
                  batteryOpt={batteryOpt}
                  onUpdateBatteryOpt={(cfg) => {
                    setBatteryOpt(prev => {
                      const updated = { ...prev, ...cfg };
                      // If targetFps is updated by battery preset, keep targetFps synced
                      if (cfg.targetFps && cfg.targetFps !== targetFps) {
                        setTargetFps(cfg.targetFps);
                      }
                      return updated;
                    });
                  }}
                  targetFps={targetFps}
                  onUpdateTargetFps={(fps) => {
                    setTargetFps(fps);
                    setBatteryOpt(prev => ({ ...prev, targetFps: fps }));
                  }}
                  onTriggerAction={handleTriggerAction}
                />
              )}

              {/* Subtab View 1: Island Customizer & Phone Hardware Alignment */}
              {activeSubTab === 'customizer' && (
                <IslandCustomizerPanel
                  customizer={customizer}
                  onUpdateCustomizer={(cfg) => setCustomizer(prev => ({ ...prev, ...cfg }))}
                  physics={physics}
                  onUpdatePhysics={(phys) => setPhysics(prev => ({ ...prev, ...phys }))}
                  cutout={cutout}
                  onUpdateCutout={setCutout}
                  cutoutSize={cutoutSize}
                  onUpdateCutoutSize={setCutoutSize}
                />
              )}

              {/* Subtab View 2: Security & MinSDK-8 Matrix Auditor */}
              {activeSubTab === 'security' && (
                <SecurityCompatibilityAuditor />
              )}

              {/* Subtab View 3: Event Trigger Pad */}
              {activeSubTab === 'events' && (
                <EventTriggerPanel
                  currentMode={mode}
                  secondaryMode={secondaryMode}
                  expansion={expansion}
                  onSetMode={handleSetMode}
                  onSetExpansion={setExpansion}
                  onTriggerAction={handleTriggerAction}
                  onCopyUrl={handleCopyUrl}
                  onDisableIsland={handleDisableIsland}
                  activeApp={activeApp}
                  onSelectApp={handleSelectApp}
                />
              )}

              {/* Subtab View 4: Spring Physics & Display Cutout Engine */}
              {activeSubTab === 'physics' && (
                <PhysicsConfigPanel
                  physics={physics}
                  onUpdatePhysics={setPhysics}
                  cutout={cutout}
                  onUpdateCutout={setCutout}
                  cutoutSize={cutoutSize}
                  onUpdateCutoutSize={setCutoutSize}
                  cutoutOffsetY={cutoutOffsetY}
                  onUpdateCutoutOffsetY={setCutoutOffsetY}
                  targetFps={targetFps}
                  onUpdateTargetFps={(fps) => {
                    setTargetFps(fps);
                    setBatteryOpt(prev => ({ ...prev, targetFps: fps }));
                  }}
                />
              )}

              {/* Subtab View 5: Performance Telemetry */}
              {activeSubTab === 'telemetry' && (
                <TelemetryPanel
                  telemetry={{
                    fps: targetFps,
                    targetFps: targetFps,
                    frameTimeMs: batteryOpt.lowSpecDeviceMode ? 1.4 : 3.1,
                    recompositionCount: recompositionCount,
                    heapMemoryMb: batteryOpt.lowSpecDeviceMode ? 11.2 : 18.4,
                    batteryDrainHourly: batteryOpt.estimatedBatteryDrainHourly,
                    coroutineDispatches: batteryOpt.simplifyEqualizer ? 12 : 32
                  }}
                  targetFps={targetFps}
                  batteryOpt={batteryOpt}
                />
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DEDICATED SECURITY & COMPATIBILITY AUDITOR */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <SecurityCompatibilityAuditor />
          </div>
        )}

        {/* TAB 3: KOTLIN CODEBASE EXPLORER */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            <KotlinCodeViewer />
          </div>
        )}

        {/* TAB 4: ARCHITECTURE SPECS & GUIDE */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <ArchitectureGuide />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#020617] py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-400">Target: Android 16 (API 36)</span>
            <span>•</span>
            <span>Architecture: Kotlin Coroutines + Compose</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            UI_RENDER_LATENCY: 1.2ms | JANK_FREE: YES
          </div>
        </div>
      </footer>
    </div>
  );
}
