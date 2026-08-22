import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, Battery, Signal, Search, Mic, Camera, MapPin, 
  Music, Phone, MessageSquare, Compass, CheckCircle2, Play, Pause, 
  ArrowRight, SkipForward, SkipBack, Volume2, Sparkles, Clock, 
  Radio, Share2, ChevronUp, Maximize2, Minimize2, ArrowUpRight,
  Shield, Disc, PhoneCall, PhoneOff, UserCheck, Flame, Layers, Globe, Copy, PowerOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IslandSimulator } from './DynamicIsland/IslandSimulator';
import { LiquidDropletTransition, SupportedDropletApp } from './DynamicIsland/LiquidDropletTransition';
import { 
  IslandMode, IslandExpansionState, CutoutType, SpringPhysicsConfig,
  IslandCustomizerConfig, BatteryOptimizationConfig,
  MusicTrack, CallInfo, TimerInfo, ChargingInfo, NavigationInfo, MessageInfo, QuickShareInfo,
  CopiedUrlInfo
} from '../types';

export type ActivePhoneApp = 'home' | 'spotify' | 'maps' | 'phone' | 'messages' | 'timer' | 'recorder' | 'chrome';

interface PhoneFrameProps {
  mode: IslandMode;
  onSetMode?: (mode: IslandMode, secondary?: IslandMode | null) => void;
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
  activeApp: ActivePhoneApp;
  onSelectApp: (app: ActivePhoneApp) => void;
  wallpaper: string;
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
  onCopyUrl?: (url: string, title?: string) => void;
  onDisableIsland?: () => void;
  onTriggerAction: (action: string) => void;
  onRecomposition: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  mode,
  onSetMode,
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
  activeApp,
  onSelectApp,
  wallpaper,
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
  onCopyUrl,
  onDisableIsland,
  onTriggerAction,
  onRecomposition
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState('09:41');
  
  // Raindrop / Liquid Droplet Minimization & Expansion State
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [transitioningApp, setTransitioningApp] = useState<SupportedDropletApp>('spotify');
  
  // In-App Chat Input State
  const [chatMessageInput, setChatMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; isUser: boolean }>>([
    { sender: 'Alex Rivera', text: 'Hey! Have you tested the new Raindrop physics animation for Dynamic Island?', isUser: false },
    { sender: 'You', text: 'Testing right now! When minimizing Spotify, it morphs into a liquid droplet and flies to the top!', isUser: true },
    { sender: 'Alex Rivera', text: 'Try it with Phone Call and Google Maps too!', isUser: false }
  ]);

  // Clock state
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hours = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      setCurrentTimeStr(`${hours}:${mins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  /**
   * Triggers the Liquid Droplet Minimization Animation:
   * 1. Hides current full-screen app
   * 2. Emits a smooth liquid droplet that squashes, stretches, and flies up to the Dynamic Island
   * 3. Upon impact, the Dynamic Island springs open showing the active music/call/maps activity
   */
  const handleMinimizeApp = (targetApp: ActivePhoneApp) => {
    if (targetApp === 'home') return;
    
    setTransitioningApp(targetApp as SupportedDropletApp);
    setIsMinimizing(true);
    onTriggerAction(`Minimizing ${targetApp} into Dynamic Island with liquid droplet physics`);
  };

  const handleMinimizationComplete = () => {
    setIsMinimizing(false);
    
    // Switch to homescreen
    onSelectApp('home');

    // Automatically set the Dynamic Island mode to match the minimized app
    if (onSetMode) {
      if (transitioningApp === 'spotify') {
        onSetMode('music');
        onUpdateMusic({ isPlaying: true });
      } else if (transitioningApp === 'phone') {
        onSetMode('call');
        onUpdateCall({ status: 'active' });
      } else if (transitioningApp === 'maps') {
        onSetMode('navigation');
      } else if (transitioningApp === 'timer') {
        onSetMode('timer');
        onUpdateTimer({ isRunning: true });
      } else if (transitioningApp === 'recorder') {
        onSetMode('recording');
      } else if (transitioningApp === 'messages') {
        onSetMode('message');
      } else if (transitioningApp === 'chrome') {
        onSetMode('chrome');
      }
    }

    onExpansionChange('compact');
    onRecomposition();
  };

  /**
   * Reverse Flow: Opens full app from Dynamic Island tap
   */
  const handleExpandToApp = (targetApp: ActivePhoneApp) => {
    if (targetApp === 'home') return;
    setTransitioningApp(targetApp as SupportedDropletApp);
    setIsExpanding(true);
    onTriggerAction(`Expanding Dynamic Island into full-screen ${targetApp} app`);
  };

  const handleExpansionComplete = () => {
    setIsExpanding(false);
    onSelectApp(transitioningApp);
    onRecomposition();
  };

  const handleSendMessage = () => {
    if (!chatMessageInput.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'You', text: chatMessageInput.trim(), isUser: true }]);
    setChatMessageInput('');
  };

  return (
    <div className="relative mx-auto flex flex-col items-center select-none">
      {/* External Device Frame */}
      <div 
        id="android-device-frame"
        className="relative w-[360px] sm:w-[370px] h-[750px] sm:h-[760px] rounded-[50px] bg-black p-[8px] sm:p-[10px] border-[6px] border-slate-800 shadow-[0_0_80px_rgba(30,58,138,0.3)]"
      >
        {/* Device Screen Canvas */}
        <div 
          className="relative w-full h-full rounded-[44px] overflow-hidden flex flex-col justify-between bg-black text-white"
          style={{
            backgroundImage: `url(${wallpaper})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Glass Overlay for depth */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />

          {/* GLOBAL TOUCH OUTSIDE TO MINIMIZE EXPANDED DYNAMIC ISLAND */}
          {activeApp === 'home' && expansion === 'expanded' && (
            <div 
              id="dynamic-island-dismiss-backdrop"
              onClick={(e) => {
                e.stopPropagation();
                onExpansionChange('compact');
                onTriggerAction('Tapped screen outside to minimize Dynamic Island');
              }}
              title="Touch anywhere to minimize Dynamic Island"
              className="absolute inset-0 z-20 cursor-pointer bg-black/20 backdrop-blur-[1px] transition-all"
            />
          )}

          {/* Android 16 System Status Bar */}
          <div className="relative z-30 w-full px-7 pt-3.5 flex items-center justify-between text-xs font-semibold text-white/90 drop-shadow">
            {/* Clock */}
            <span className="font-mono text-[13px] tracking-tight">{currentTimeStr}</span>

            {/* Status Icons */}
            <div className="flex items-center gap-1.5 text-white/90">
              <span className="text-[10px] font-bold tracking-tighter bg-white/20 px-1 py-0.2 rounded">5G+</span>
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5 pl-0.5">
                <span className="text-[11px] font-mono">{chargingInfo.batteryLevel}%</span>
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Dynamic Island WindowManager Overlay Container */}
          {/* While in full-screen app, Dynamic Island is in clean idle/dormant state until minimized */}
          <IslandSimulator
            mode={activeApp === 'home' ? mode : 'idle'}
            secondaryMode={activeApp === 'home' ? secondaryMode : null}
            expansion={activeApp === 'home' ? expansion : 'compact'}
            onExpansionChange={onExpansionChange}
            physics={physics}
            customizer={customizer}
            onUpdateCustomizer={onUpdateCustomizer}
            batteryOpt={batteryOpt}
            cutout={cutout}
            cutoutSize={cutoutSize}
            cutoutOffsetY={cutoutOffsetY}
            musicTrack={musicTrack}
            onUpdateMusic={onUpdateMusic}
            callInfo={callInfo}
            onUpdateCall={onUpdateCall}
            timerInfo={timerInfo}
            onUpdateTimer={onUpdateTimer}
            chargingInfo={chargingInfo}
            navigationInfo={navigationInfo}
            messageInfo={messageInfo}
            quickShareInfo={quickShareInfo}
            copiedUrlInfo={copiedUrlInfo}
            onOpenApp={(app) => handleExpandToApp(app)}
            onDisableIsland={onDisableIsland}
            onTriggerAction={onTriggerAction}
            onRecomposition={onRecomposition}
          />

          {/* Liquid Droplet Raindrop Morph Transition Layer */}
          <LiquidDropletTransition
            isMinimizing={isMinimizing}
            isExpanding={isExpanding}
            appType={transitioningApp}
            onMinimizationComplete={handleMinimizationComplete}
            onExpansionComplete={handleExpansionComplete}
            cutoutOffsetY={cutoutOffsetY}
          />

          {/* Underlying App Screen Viewport */}
          <div className="relative z-10 flex-1 px-3 pt-12 pb-2 overflow-y-auto no-scrollbar flex flex-col font-sans">
            {/* ================= HOMESCREEN ================= */}
            {activeApp === 'home' && !isMinimizing && (
              <div className="h-full flex flex-col justify-between pt-2">
                {/* Material You At-a-Glance Widget */}
                <div className="bg-slate-900/60 backdrop-blur-xl p-4 rounded-3xl border border-white/10 text-white shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                    <span>Tuesday, Aug 21</span>
                    <span className="font-semibold text-blue-300">72°F Sunny</span>
                  </div>

                  {mode !== 'idle' ? (
                    <div className="flex items-center justify-between bg-blue-950/40 border border-blue-500/25 p-2 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-blue-200 font-semibold capitalize">
                          Island: {mode === 'chrome' ? 'Open in Chrome' : mode}
                        </span>
                      </div>
                      <button
                        id="homescreen-disable-island-btn"
                        onClick={() => onDisableIsland?.()}
                        title="Remove current app from Dynamic Island"
                        className="px-2.5 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/35 text-red-300 hover:text-white text-[11px] font-semibold border border-red-500/30 transition cursor-pointer flex items-center gap-1 active:scale-95"
                      >
                        <PowerOff className="w-3 h-3 text-red-400" />
                        <span>Disable</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-base font-bold tracking-tight">Dynamic Island Idle</div>
                      <div className="text-[11px] text-emerald-300 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tap any app below & minimize to see raindrop morph</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Google Search Bar */}
                <div className="bg-slate-900/60 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/15 flex items-center justify-between my-2 text-xs text-slate-300 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <span>Search apps & music...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5 text-slate-400" />
                    <Camera className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                {/* App Icons Grid */}
                <div className="grid grid-cols-4 gap-2.5 py-1">
                  {/* Spotify */}
                  <button 
                    id="app-icon-spotify"
                    onClick={() => onSelectApp('spotify')}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-105 group-active:scale-95 transition shadow-emerald-500/30">
                      <Music className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-[10px] font-semibold text-white/90">Spotify</span>
                  </button>

                  {/* Maps */}
                  <button 
                    id="app-icon-maps"
                    onClick={() => onSelectApp('maps')}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-105 group-active:scale-95 transition shadow-blue-600/30">
                      <Compass className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-semibold text-white/90">Maps</span>
                  </button>

                  {/* Phone */}
                  <button 
                    id="app-icon-phone"
                    onClick={() => onSelectApp('phone')}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center shadow-lg group-hover:scale-105 group-active:scale-95 transition shadow-green-600/30">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-semibold text-white/90">Phone</span>
                  </button>

                  {/* Messages */}
                  <button 
                    id="app-icon-messages"
                    onClick={() => onSelectApp('messages')}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg group-hover:scale-105 group-active:scale-95 transition shadow-teal-600/30">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-semibold text-white/90">Chat</span>
                  </button>

                  {/* Timer / Clock */}
                  <button 
                    id="app-icon-timer"
                    onClick={() => onSelectApp('timer')}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg group-hover:scale-105 group-active:scale-95 transition shadow-amber-500/30">
                      <Clock className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-[10px] font-semibold text-white/90">Timer</span>
                  </button>

                  {/* Voice Recorder */}
                  <button 
                    id="app-icon-recorder"
                    onClick={() => onSelectApp('recorder')}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg group-hover:scale-105 group-active:scale-95 transition shadow-rose-600/30">
                      <Mic className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-semibold text-white/90">Recorder</span>
                  </button>

                  {/* Google Chrome Browser */}
                  <button 
                    id="app-icon-chrome"
                    onClick={() => onSelectApp('chrome')}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/20 flex items-center justify-center p-2 shadow-lg group-hover:scale-105 group-active:scale-95 transition shadow-blue-500/20">
                      <svg className="w-7 h-7" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="#EA4335" />
                        <path d="M12 2a10 10 0 0 1 8.66 5H12v5h-2L6.8 6.5A10 10 0 0 1 12 2z" fill="#EA4335"/>
                        <path d="M20.66 7A10 10 0 0 1 18.8 19.3L15.3 13.2l-1.5 2.6L12 12V7h8.66z" fill="#FBBC05"/>
                        <path d="M18.8 19.3A10 10 0 0 1 3.34 12L8.5 12l2.5 4.33L7.5 19.3l11.3 0z" fill="#34A853"/>
                        <circle cx="12" cy="12" r="4.5" fill="#FFFFFF" />
                        <circle cx="12" cy="12" r="3.2" fill="#4285F4" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-semibold text-white/90">Chrome</span>
                  </button>
                </div>

                {/* Smart Clipboard URL Trigger Card */}
                <div className="bg-slate-900/80 backdrop-blur-md border border-blue-500/30 p-2.5 rounded-2xl flex items-center justify-between shadow-lg mb-1.5">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-7 h-7 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                      <Copy className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] truncate">
                      <span className="font-bold text-white block truncate">Copy Link Trigger</span>
                      <span className="text-blue-300 text-[10px] truncate block font-mono">github.com/android/dynamic-island</span>
                    </div>
                  </div>
                  <button
                    id="phone-copy-url-btn"
                    onClick={() => {
                      if (onCopyUrl) {
                        onCopyUrl('https://github.com/android/dynamic-island-compose', 'Android 16 Dynamic Island Compose BOM');
                      }
                    }}
                    className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition cursor-pointer shrink-0 shadow-md shadow-blue-600/30"
                  >
                    Copy URL
                  </button>
                </div>

                {/* Quick Hint Card on Home */}
                {mode !== 'idle' && (
                  <div 
                    onClick={() => {
                      if (mode === 'music') handleExpandToApp('spotify');
                      else if (mode === 'call') handleExpandToApp('phone');
                      else if (mode === 'navigation') handleExpandToApp('maps');
                      else if (mode === 'timer') handleExpandToApp('timer');
                      else if (mode === 'recording') handleExpandToApp('recorder');
                    }}
                    className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-emerald-900/40 transition mb-1"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
                      <div className="text-[11px]">
                        <span className="font-bold text-white block">Active in Island: {mode.toUpperCase()}</span>
                        <span className="text-emerald-300 text-[10px]">Tap to re-expand into full app</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
              </div>
            )}

            {/* ================= SPOTIFY APP ================= */}
            {activeApp === 'spotify' && !isMinimizing && (
              <div className="h-full bg-gradient-to-b from-emerald-950/90 via-slate-950 to-black rounded-3xl p-4 border border-emerald-500/20 flex flex-col justify-between shadow-2xl">
                {/* Header with App Info & Minimize Button */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Music className="w-4 h-4" />
                    <span className="tracking-wider uppercase text-[11px]">Spotify Music</span>
                  </div>
                  <button 
                    id="spotify-minimize-btn"
                    onClick={() => handleMinimizeApp('spotify')}
                    className="flex items-center gap-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full font-semibold text-[11px] cursor-pointer transition shadow-sm"
                  >
                    <span>💧 Minimize to Island</span>
                  </button>
                </div>

                {/* Album Art & Track Info */}
                <div className="flex flex-col items-center text-center my-auto">
                  <div className="relative mb-3 group">
                    <img 
                      src={musicTrack.coverUrl} 
                      alt="Album Cover" 
                      className={`w-40 h-40 rounded-3xl object-cover shadow-[0_15px_35px_rgba(0,0,0,0.9)] border border-white/10 transition-transform ${
                        musicTrack.isPlaying ? 'scale-105' : 'scale-100 opacity-90'
                      }`} 
                    />
                    {musicTrack.isPlaying && (
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-1.5 rounded-full shadow-lg">
                        <Disc className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                      </div>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">{musicTrack.title}</h3>
                  <p className="text-xs text-emerald-300 font-medium">{musicTrack.artist}</p>
                </div>

                {/* Audio Controls & Progress */}
                <div className="space-y-2">
                  <div 
                    className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const pct = clickX / rect.width;
                      onUpdateMusic({ currentTime: Math.floor(pct * musicTrack.duration) });
                    }}
                  >
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all" 
                      style={{ width: `${(musicTrack.currentTime / musicTrack.duration) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>{Math.floor(musicTrack.currentTime / 60)}:{(musicTrack.currentTime % 60).toString().padStart(2, '0')}</span>
                    <span>{Math.floor(musicTrack.duration / 60)}:{(musicTrack.duration % 60).toString().padStart(2, '0')}</span>
                  </div>

                  <div className="flex justify-center items-center gap-6 pt-1">
                    <button 
                      onClick={() => onUpdateMusic({ currentTime: 0 })}
                      className="text-slate-300 hover:text-white p-1 cursor-pointer transition"
                    >
                      <SkipBack className="w-5 h-5 fill-current" />
                    </button>
                    
                    <button 
                      id="spotify-app-play-pause"
                      onClick={() => onUpdateMusic({ isPlaying: !musicTrack.isPlaying })}
                      className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer shadow-lg shadow-emerald-500/40"
                    >
                      {musicTrack.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </button>

                    <button 
                      onClick={() => onUpdateMusic({ currentTime: 0 })}
                      className="text-slate-300 hover:text-white p-1 cursor-pointer transition"
                    >
                      <SkipForward className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Bottom Gesture Prompt */}
                <div 
                  onClick={() => handleMinimizeApp('spotify')}
                  className="bg-black/40 border border-white/5 py-2 px-3 rounded-2xl text-center cursor-pointer hover:bg-black/60 transition mt-2"
                >
                  <p className="text-[10px] text-slate-300 flex items-center justify-center gap-1">
                    <ChevronUp className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                    <span>Swipe up / tap to morph into Dynamic Island</span>
                  </p>
                </div>
              </div>
            )}

            {/* ================= PHONE APP ================= */}
            {activeApp === 'phone' && !isMinimizing && (
              <div className="h-full bg-gradient-to-b from-green-950/90 via-slate-950 to-black rounded-3xl p-4 border border-green-500/20 flex flex-col justify-between text-center shadow-2xl">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-green-400 flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5" /> VoIP HD Call
                  </span>
                  <button 
                    onClick={() => handleMinimizeApp('phone')}
                    className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/40 px-2.5 py-1 rounded-full font-semibold text-[11px] cursor-pointer transition"
                  >
                    <span>💧 Minimize to Island</span>
                  </button>
                </div>

                <div className="py-2 flex flex-col items-center">
                  <div className="relative mb-2">
                    <img 
                      src={callInfo.callerAvatar} 
                      alt="Caller" 
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-green-500/40 shadow-2xl" 
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{callInfo.callerName}</h3>
                  <p className="text-xs text-slate-400 font-mono">{callInfo.callerNumber}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                    <span>02:48 • Connected</span>
                  </div>
                </div>

                {/* Call Control Grid */}
                <div className="grid grid-cols-3 gap-3 my-2">
                  <button className="bg-slate-900/80 p-3 rounded-2xl border border-white/10 text-xs text-slate-300 flex flex-col items-center gap-1 hover:bg-slate-800">
                    <Mic className="w-4 h-4 text-slate-300" />
                    <span className="text-[10px]">Mute</span>
                  </button>
                  <button className="bg-slate-900/80 p-3 rounded-2xl border border-white/10 text-xs text-slate-300 flex flex-col items-center gap-1 hover:bg-slate-800">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px]">Speaker</span>
                  </button>
                  <button className="bg-slate-900/80 p-3 rounded-2xl border border-white/10 text-xs text-slate-300 flex flex-col items-center gap-1 hover:bg-slate-800">
                    <Layers className="w-4 h-4 text-slate-300" />
                    <span className="text-[10px]">Keypad</span>
                  </button>
                </div>

                {/* End Call & Minimize */}
                <div className="flex items-center justify-center gap-6 pt-1">
                  <button 
                    onClick={() => {
                      onUpdateCall({ status: 'incoming' });
                      onSelectApp('home');
                    }}
                    className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer shadow-red-600/40"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>
                </div>

                <div 
                  onClick={() => handleMinimizeApp('phone')}
                  className="bg-black/40 border border-white/5 py-1.5 px-3 rounded-2xl text-center cursor-pointer hover:bg-black/60 transition mt-2"
                >
                  <p className="text-[10px] text-green-300 flex items-center justify-center gap-1">
                    <ChevronUp className="w-3 h-3 text-green-400 animate-bounce" />
                    <span>Swipe up to keep call live in Dynamic Island</span>
                  </p>
                </div>
              </div>
            )}

            {/* ================= MAPS APP ================= */}
            {activeApp === 'maps' && !isMinimizing && (
              <div className="h-full bg-gradient-to-b from-blue-950/90 via-slate-950 to-black rounded-3xl p-4 border border-blue-500/20 flex flex-col justify-between shadow-2xl">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" /> Google Maps Turn Live
                    </span>
                    <button 
                      onClick={() => handleMinimizeApp('maps')}
                      className="flex items-center gap-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 px-2.5 py-1 rounded-full font-semibold text-[11px] cursor-pointer transition"
                    >
                      <span>💧 Minimize to Island</span>
                    </button>
                  </div>

                  <div className="bg-blue-600/25 border border-blue-500/50 p-3 rounded-2xl shadow-lg">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <Compass className="w-4 h-4 text-blue-300 animate-spin" style={{ animationDuration: '8s' }} />
                      <span>{navigationInfo.instruction}</span>
                    </div>
                    <div className="text-[11px] text-blue-300 font-semibold mt-0.5">{navigationInfo.nextRoad}</div>
                  </div>

                  <div className="h-36 bg-slate-900/90 rounded-2xl flex flex-col items-center justify-center text-xs text-slate-400 border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:12px_12px] opacity-20" />
                    <Compass className="w-8 h-8 text-blue-400 mb-1 z-10 animate-pulse" />
                    <span className="font-mono text-white text-xs z-10">Live Turn-by-Turn GPS Active</span>
                    <span className="text-[10px] text-blue-300 z-10 font-mono">Speed: 45 mph • Lane 2 of 4</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded-2xl text-xs border border-white/5">
                    <div>
                      <div className="font-bold text-emerald-400 text-sm">{navigationInfo.eta}</div>
                      <div className="text-slate-400 text-[10px]">{navigationInfo.distanceRemaining} remaining</div>
                    </div>
                    <button 
                      onClick={() => handleMinimizeApp('maps')}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-semibold text-xs cursor-pointer hover:bg-blue-500 transition shadow-md shadow-blue-600/30"
                    >
                      Route Active
                    </button>
                  </div>

                  <div 
                    onClick={() => handleMinimizeApp('maps')}
                    className="bg-black/40 border border-white/5 py-1.5 px-3 rounded-2xl text-center cursor-pointer hover:bg-black/60 transition"
                  >
                    <p className="text-[10px] text-blue-300 flex items-center justify-center gap-1">
                      <ChevronUp className="w-3 h-3 text-blue-400 animate-bounce" />
                      <span>Swipe up to minimize navigation to Island</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TIMER APP ================= */}
            {activeApp === 'timer' && !isMinimizing && (
              <div className="h-full bg-gradient-to-b from-amber-950/90 via-slate-950 to-black rounded-3xl p-4 border border-amber-500/20 flex flex-col justify-between text-center shadow-2xl">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Chronometer Timer
                  </span>
                  <button 
                    onClick={() => handleMinimizeApp('timer')}
                    className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full font-semibold text-[11px] cursor-pointer transition"
                  >
                    <span>💧 Minimize to Island</span>
                  </button>
                </div>

                {/* Circular Timer Display */}
                <div className="py-4 flex flex-col items-center justify-center my-auto">
                  <div className="relative w-36 h-36 rounded-full border-4 border-amber-500/30 flex items-center justify-center shadow-2xl bg-amber-950/20">
                    <div className="text-2xl font-bold font-mono text-white">
                      {Math.floor(timerInfo.remainingSeconds / 60)}:{(timerInfo.remainingSeconds % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <span className="text-xs text-amber-300 mt-2 font-medium">{timerInfo.label}</span>
                </div>

                {/* Controls */}
                <div className="space-y-2">
                  <div className="flex justify-center items-center gap-4">
                    <button 
                      onClick={() => onUpdateTimer({ isRunning: !timerInfo.isRunning })}
                      className="px-6 py-2.5 rounded-full bg-amber-500 text-black font-bold text-xs hover:scale-105 transition cursor-pointer shadow-lg shadow-amber-500/30"
                    >
                      {timerInfo.isRunning ? 'Pause Timer' : 'Start Timer'}
                    </button>
                    <button 
                      onClick={() => onUpdateTimer({ remainingSeconds: timerInfo.totalSeconds })}
                      className="px-4 py-2.5 rounded-full bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>

                  <div 
                    onClick={() => handleMinimizeApp('timer')}
                    className="bg-black/40 border border-white/5 py-1.5 px-3 rounded-2xl text-center cursor-pointer hover:bg-black/60 transition"
                  >
                    <p className="text-[10px] text-amber-300 flex items-center justify-center gap-1">
                      <ChevronUp className="w-3 h-3 text-amber-400 animate-bounce" />
                      <span>Swipe up to watch countdown in Dynamic Island</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ================= VOICE RECORDER APP ================= */}
            {activeApp === 'recorder' && !isMinimizing && (
              <div className="h-full bg-gradient-to-b from-rose-950/90 via-slate-950 to-black rounded-3xl p-4 border border-rose-500/20 flex flex-col justify-between text-center shadow-2xl">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-rose-400 flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5" /> Voice Memo HD
                  </span>
                  <button 
                    onClick={() => handleMinimizeApp('recorder')}
                    className="flex items-center gap-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded-full font-semibold text-[11px] cursor-pointer transition"
                  >
                    <span>💧 Minimize to Island</span>
                  </button>
                </div>

                <div className="py-4 flex flex-col items-center justify-center my-auto space-y-3">
                  <div className="w-20 h-20 rounded-full bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 animate-pulse">
                    <Mic className="w-8 h-8" />
                  </div>
                  <div className="text-xl font-mono font-bold text-white">00:14.8</div>
                  
                  {/* Waveform preview */}
                  <div className="flex items-end justify-center gap-1 h-12 w-full px-8">
                    {[12, 28, 40, 24, 38, 48, 30, 18, 34, 44, 22, 14].map((h, i) => (
                      <motion.div 
                        key={i} 
                        className="w-1.5 bg-rose-500 rounded-full"
                        animate={{ height: [`${h}px`, `${Math.max(6, (h * 1.4) % 48)}px`, `${h}px`] }}
                        transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
                      />
                    ))}
                  </div>
                </div>

                <div 
                  onClick={() => handleMinimizeApp('recorder')}
                  className="bg-black/40 border border-white/5 py-1.5 px-3 rounded-2xl text-center cursor-pointer hover:bg-black/60 transition"
                >
                  <p className="text-[10px] text-rose-300 flex items-center justify-center gap-1">
                    <ChevronUp className="w-3 h-3 text-rose-400 animate-bounce" />
                    <span>Swipe up to record in background with Dynamic Island</span>
                  </p>
                </div>
              </div>
            )}

            {/* ================= MESSAGES APP ================= */}
            {activeApp === 'messages' && !isMinimizing && (
              <div className="h-full bg-gradient-to-b from-teal-950/90 via-slate-950 to-black rounded-3xl p-4 border border-teal-500/20 flex flex-col justify-between shadow-2xl">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center font-bold text-white text-[10px]">
                      AR
                    </div>
                    <span className="font-bold text-white">Alex Rivera</span>
                  </div>
                  <button 
                    onClick={() => handleMinimizeApp('messages')}
                    className="flex items-center gap-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 px-2.5 py-1 rounded-full font-semibold text-[11px] cursor-pointer transition"
                  >
                    <span>💧 Minimize to Island</span>
                  </button>
                </div>

                {/* Messages Chat Stream */}
                <div className="space-y-2 flex-1 overflow-y-auto py-2 pr-1 no-scrollbar">
                  {chatMessages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`p-2.5 rounded-2xl text-xs max-w-[85%] ${
                        msg.isUser 
                          ? 'bg-teal-600 text-white ml-auto rounded-tr-sm border border-teal-400/30' 
                          : 'bg-slate-900 text-slate-200 rounded-tl-sm border border-white/5'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={chatMessageInput}
                      onChange={(e) => setChatMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..." 
                      className="flex-1 bg-slate-900 border border-white/10 rounded-full px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500" 
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="p-2 rounded-full bg-teal-600 text-white cursor-pointer hover:bg-teal-500 transition shadow-md shadow-teal-600/30"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div 
                    onClick={() => handleMinimizeApp('messages')}
                    className="bg-black/40 border border-white/5 py-1.5 px-3 rounded-2xl text-center cursor-pointer hover:bg-black/60 transition"
                  >
                    <p className="text-[10px] text-teal-300 flex items-center justify-center gap-1">
                      <ChevronUp className="w-3 h-3 text-teal-400 animate-bounce" />
                      <span>Swipe up to minimize chat into Dynamic Island</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ================= GOOGLE CHROME BROWSER APP ================= */}
            {activeApp === 'chrome' && !isMinimizing && (
              <div className="h-full bg-slate-950 rounded-3xl border border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl">
                {/* Chrome Top Omnibox */}
                <div className="bg-slate-900/90 border-b border-white/10 p-2.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" fill="#EA4335" />
                          <path d="M12 2a10 10 0 0 1 8.66 5H12v5h-2L6.8 6.5A10 10 0 0 1 12 2z" fill="#EA4335"/>
                          <path d="M20.66 7A10 10 0 0 1 18.8 19.3L15.3 13.2l-1.5 2.6L12 12V7h8.66z" fill="#FBBC05"/>
                          <path d="M18.8 19.3A10 10 0 0 1 3.34 12L8.5 12l2.5 4.33L7.5 19.3l11.3 0z" fill="#34A853"/>
                          <circle cx="12" cy="12" r="4.5" fill="#FFFFFF" />
                          <circle cx="12" cy="12" r="3.2" fill="#4285F4" />
                        </svg>
                      </div>
                      <span className="font-bold text-white text-xs">Google Chrome</span>
                    </div>

                    <button 
                      id="chrome-minimize-btn"
                      onClick={() => handleMinimizeApp('chrome')}
                      className="flex items-center gap-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 px-2.5 py-1 rounded-full font-semibold text-[11px] cursor-pointer transition shadow-sm"
                    >
                      <span>💧 Minimize to Island</span>
                    </button>
                  </div>

                  {/* URL Address Omnibox */}
                  <div className="bg-slate-800/90 rounded-full px-3 py-1.5 border border-white/10 flex items-center justify-between text-xs text-slate-200">
                    <div className="flex items-center gap-2 truncate">
                      <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-300 font-mono text-[11px] truncate">
                        {copiedUrlInfo?.url || 'https://github.com/android/compose-samples'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-4 h-4 rounded border border-slate-500 flex items-center justify-center text-[9px] font-mono text-slate-300">
                        3
                      </div>
                    </div>
                  </div>
                </div>

                {/* Web Page Viewport */}
                <div className="flex-1 bg-slate-900/60 overflow-y-auto p-3.5 space-y-3 text-left no-scrollbar">
                  {/* GitHub Repo Header */}
                  <div className="bg-black/50 border border-white/10 rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/15 flex items-center justify-center text-white">
                        <Globe className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>android / compose-island</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono border border-emerald-500/30">Public</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Android 16 Jetpack Compose BOM v2026.08</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Liquid transparent raindrop physics and hardware-accelerated Dynamic Island overlay.
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 rounded-xl bg-slate-800 border border-white/10 text-[10px] font-mono text-amber-300">
                        ⭐ 14.8k
                      </span>
                      <span className="px-2 py-0.5 rounded-xl bg-slate-800 border border-white/10 text-[10px] font-mono text-blue-300">
                        🍴 2.1k
                      </span>
                      <span className="px-2 py-0.5 rounded-xl bg-slate-800 border border-white/10 text-[10px] font-mono text-emerald-300">
                        ⚡ 120 FPS
                      </span>
                    </div>
                  </div>

                  {/* Quick Interactive Card */}
                  <div className="bg-blue-950/30 border border-blue-500/20 rounded-2xl p-3 space-y-2">
                    <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>Transparent Water Droplet Morph</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Tapping minimize will condense this web browser into a pure transparent liquid crystal raindrop and fly it to the top island!
                    </p>
                    <button 
                      onClick={() => handleMinimizeApp('chrome')}
                      className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition cursor-pointer"
                    >
                      💧 Minimize Chrome to Island
                    </button>
                  </div>
                </div>

                {/* Swipe up guide footer */}
                <div 
                  onClick={() => handleMinimizeApp('chrome')}
                  className="bg-black/80 border-t border-white/10 py-2 px-3 text-center cursor-pointer hover:bg-black transition"
                >
                  <p className="text-[10px] text-blue-300 flex items-center justify-center gap-1">
                    <ChevronUp className="w-3 h-3 text-blue-400 animate-bounce" />
                    <span>Swipe up or tap here to minimize Chrome to Dynamic Island</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Android 16 Home Navigation Bar Pill with Swipe Gesture */}
          <div className="relative z-30 w-full pb-3 flex justify-center">
            <button 
              id="android-home-bar"
              onClick={() => {
                if (activeApp !== 'home') {
                  handleMinimizeApp(activeApp);
                } else {
                  onExpansionChange('compact');
                }
              }}
              title={activeApp !== 'home' ? 'Swipe / Click to Minimize to Dynamic Island' : 'Home Bar'}
              className="w-28 h-1.5 bg-white/70 hover:bg-white active:bg-emerald-400 rounded-full transition hover:scale-105 active:scale-95 cursor-pointer shadow-sm shadow-white/40"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
