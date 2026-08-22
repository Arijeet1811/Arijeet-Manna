import React from 'react';
import { 
  Music, Phone, Clock, BatteryCharging, Navigation, 
  MessageSquare, Layers, Power, Sparkles, Smartphone,
  Zap, ArrowUpRight, Play, Compass, Mic, Globe, Copy, PowerOff
} from 'lucide-react';
import { IslandMode, IslandExpansionState } from '../../types';
import { ActivePhoneApp } from '../PhoneFrame';

interface EventTriggerPanelProps {
  currentMode: IslandMode;
  secondaryMode: IslandMode | null;
  expansion: IslandExpansionState;
  onSetMode: (mode: IslandMode, secondary?: IslandMode | null) => void;
  onSetExpansion: (state: IslandExpansionState) => void;
  onTriggerAction: (msg: string) => void;
  onCopyUrl?: (url: string, title?: string) => void;
  onDisableIsland?: () => void;
  activeApp?: ActivePhoneApp;
  onSelectApp?: (app: ActivePhoneApp) => void;
}

export const EventTriggerPanel: React.FC<EventTriggerPanelProps> = ({
  currentMode,
  secondaryMode,
  expansion,
  onSetMode,
  onSetExpansion,
  onTriggerAction,
  onCopyUrl,
  onDisableIsland,
  activeApp = 'home',
  onSelectApp
}) => {
  const events = [
    {
      id: 'music' as IslandMode,
      name: 'Spotify Music',
      icon: Music,
      desc: 'Active media session + live equalizer',
      badge: 'MediaSession',
      color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30 text-emerald-400',
      activeColor: 'bg-emerald-500 text-black border-emerald-400'
    },
    {
      id: 'chrome' as IslandMode,
      name: 'Open in Chrome',
      icon: Globe,
      desc: 'Smart clipboard copied URL intent',
      badge: 'ACTION_VIEW',
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
      activeColor: 'bg-blue-500 text-white border-blue-400'
    },
    {
      id: 'call' as IslandMode,
      name: 'VoIP Phone Call',
      icon: Phone,
      desc: 'TelecomManager incoming/active call',
      badge: 'Priority 100',
      color: 'from-green-500/20 to-emerald-500/10 border-green-500/30 text-green-400',
      activeColor: 'bg-green-500 text-black border-green-400'
    },
    {
      id: 'timer' as IslandMode,
      name: 'Active Timer',
      icon: Clock,
      desc: 'Chronometer progress countdown',
      badge: 'Live Progress',
      color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
      activeColor: 'bg-amber-500 text-black border-amber-400'
    },
    {
      id: 'charging' as IslandMode,
      name: '45W Fast Charging',
      icon: BatteryCharging,
      desc: 'Super Fast 2.0 surge HUD animation',
      badge: 'ACTION_POWER',
      color: 'from-teal-500/20 to-cyan-500/10 border-teal-500/30 text-teal-400',
      activeColor: 'bg-teal-400 text-black border-teal-300'
    },
    {
      id: 'navigation' as IslandMode,
      name: 'Google Maps Turn',
      icon: Navigation,
      desc: 'Turn-by-turn routing instruction',
      badge: 'Location API',
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
      activeColor: 'bg-blue-500 text-white border-blue-400'
    },
    {
      id: 'message' as IslandMode,
      name: 'WhatsApp Message',
      icon: MessageSquare,
      desc: 'Instant messaging with inline reply',
      badge: 'NotificationCompat',
      color: 'from-emerald-600/20 to-teal-600/10 border-emerald-600/30 text-emerald-300',
      activeColor: 'bg-emerald-600 text-white border-emerald-500'
    },
    {
      id: 'split' as IslandMode,
      name: 'Split Multi-Island',
      icon: Layers,
      desc: 'Concurrent Music + Timer mini-bubble',
      badge: 'Dual-Activity',
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-300',
      activeColor: 'bg-purple-500 text-white border-purple-400'
    },
    {
      id: 'idle' as IslandMode,
      name: 'Idle / Hardware Hole',
      icon: Power,
      desc: 'Tucked into physical camera cutout',
      badge: 'Zero Overhead',
      color: 'from-neutral-800/40 to-neutral-900/40 border-neutral-700 text-neutral-400',
      activeColor: 'bg-neutral-700 text-white border-neutral-500'
    }
  ];

  const appLaunchers: Array<{
    id: ActivePhoneApp;
    name: string;
    icon: any;
    color: string;
    actionText: string;
    flowDesc: string;
  }> = [
    {
      id: 'spotify',
      name: 'Spotify Music',
      icon: Music,
      color: 'from-emerald-600 to-green-700 text-emerald-300 border-emerald-500/30',
      actionText: 'Open Full App',
      flowDesc: 'Play music in full app -> swipe up / minimize -> morphs to Island'
    },
    {
      id: 'chrome',
      name: 'Google Chrome',
      icon: Globe,
      color: 'from-blue-600 to-indigo-700 text-blue-300 border-blue-500/30',
      actionText: 'Open Chrome',
      flowDesc: 'Browse web -> copy URL / minimize -> morphs to Chrome Island'
    },
    {
      id: 'phone',
      name: 'VoIP Phone Call',
      icon: Phone,
      color: 'from-green-600 to-emerald-700 text-green-300 border-green-500/30',
      actionText: 'Open In-Call Screen',
      flowDesc: 'Start call -> minimize -> live call pill in Dynamic Island'
    },
    {
      id: 'maps',
      name: 'Google Maps GPS',
      icon: Compass,
      color: 'from-blue-600 to-indigo-700 text-blue-300 border-blue-500/30',
      actionText: 'Open Map Route',
      flowDesc: 'View live GPS navigation -> minimize -> turn-by-turn Island'
    },
    {
      id: 'timer',
      name: 'Chronometer Timer',
      icon: Clock,
      color: 'from-amber-600 to-orange-700 text-amber-300 border-amber-500/30',
      actionText: 'Open Timer App',
      flowDesc: 'Start 5:00 timer -> minimize -> live countdown Island'
    },
    {
      id: 'recorder',
      name: 'Voice Memo Recorder',
      icon: Mic,
      color: 'from-rose-600 to-red-700 text-rose-300 border-rose-500/30',
      actionText: 'Open Recorder',
      flowDesc: 'Record voice memo -> minimize -> background audio wave Island'
    },
    {
      id: 'messages',
      name: 'WhatsApp Direct',
      icon: MessageSquare,
      color: 'from-teal-600 to-cyan-700 text-teal-300 border-teal-500/30',
      actionText: 'Open Chat Thread',
      flowDesc: 'Send message -> minimize -> dynamic message bubble Island'
    }
  ];

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-5">
      {/* SECTION 1: Open App & Minimize with Raindrop Physics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>💧 Raindrop Physics App Launcher</span>
            </h3>
            <p className="text-xs text-slate-400">
              Open full-screen apps on phone, start playback/call/GPS, and minimize with fluid droplet morph into Dynamic Island
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold">
            Active: {activeApp.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {appLaunchers.map((launcher) => {
            const Icon = launcher.icon;
            const isCurrentlyOpen = activeApp === launcher.id;

            return (
              <button
                key={launcher.id}
                onClick={() => {
                  if (onSelectApp) {
                    onSelectApp(launcher.id);
                    onTriggerAction(`Launched full-screen ${launcher.name}`);
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
                  isCurrentlyOpen
                    ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-lg shadow-emerald-950/50'
                    : 'bg-black/30 border-white/5 text-slate-300 hover:border-emerald-500/40 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-xs font-bold text-white">{launcher.name}</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition" />
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {launcher.flowDesc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Live System Event Trigger Hub */}
      <div className="pt-3 border-t border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              Live System Broadcast Hub
            </h3>
            <p className="text-xs text-slate-400">Directly dispatch background Android 16 system intents</p>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400">Morph:</span>
            <span className="text-[11px] font-bold text-blue-400 capitalize">{expansion}</span>
          </div>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {events.map((evt) => {
            const Icon = evt.icon;
            const isActive = currentMode === evt.id && activeApp === 'home';

            return (
              <button
                key={evt.id}
                id={`trigger-btn-${evt.id}`}
                onClick={() => {
                  if (onSelectApp && activeApp !== 'home') {
                    onSelectApp('home');
                  }
                  if (evt.id === 'split') {
                    onSetMode('split', 'timer');
                    onSetExpansion('compact');
                    onTriggerAction('Simulating concurrent Music + Timer split pills');
                  } else if (evt.id === 'idle') {
                    onSetMode('idle', null);
                    onSetExpansion('collapsed');
                    onTriggerAction('Island returned to idle camera punch-hole state');
                  } else {
                    onSetMode(evt.id, null);
                    onSetExpansion('compact');
                    onTriggerAction(`Dispatched ${evt.name} intent`);
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600/90 text-white border-blue-400/50 shadow-lg shadow-blue-900/30 scale-[1.02]' 
                    : 'bg-black/30 border-white/5 text-slate-300 hover:border-white/20 hover:bg-slate-800/40 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-black/30 text-white' : 'bg-slate-900 text-slate-400 border border-white/5'
                  }`}>
                    {evt.badge}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold truncate text-white">{evt.name}</div>
                  <div className={`text-[10px] line-clamp-1 mt-0.5 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    {evt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Island Morphing Expansion & Disable Controls */}
        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">HUD Expansion:</span>
            <div className="flex gap-1.5">
              {(['collapsed', 'compact', 'expanded'] as IslandExpansionState[]).map((st) => (
                <button
                  key={st}
                  id={`expansion-btn-${st}`}
                  onClick={() => onSetExpansion(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
                    expansion === st
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 border border-blue-400/40'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border border-white/5'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {currentMode !== 'idle' && (
            <button
              id="event-panel-disable-island-btn"
              onClick={() => onDisableIsland?.()}
              className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/35 text-red-300 hover:text-white border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
            >
              <PowerOff className="w-3 h-3 text-red-400" />
              <span>Disable Active App</span>
            </button>
          )}
        </div>

        {/* SECTION 3: Smart Clipboard Copy-to-Island Simulator */}
        <div className="pt-3 border-t border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5 text-blue-400" />
              <span>Smart Clipboard URL Auto-Detection</span>
            </h4>
            <span className="text-[10px] text-blue-400 font-mono bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-500/30">
              3s Auto-Dismiss
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              id="copy-github-btn"
              onClick={() => {
                if (onCopyUrl) {
                  onCopyUrl('https://github.com/android/dynamic-island-compose', 'Android 16 Compose Dynamic Island BOM');
                }
              }}
              className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-blue-400/40 hover:bg-blue-950/20 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <div className="truncate pr-2">
                <div className="text-xs font-bold text-white group-hover:text-blue-300 flex items-center gap-1.5">
                  <span>Copy GitHub Repo URL</span>
                  <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1 rounded">3s</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">github.com/android/dynamic-island</div>
              </div>
              <Copy className="w-4 h-4 text-slate-400 group-hover:text-blue-400 shrink-0" />
            </button>

            <button
              id="copy-docs-btn"
              onClick={() => {
                if (onCopyUrl) {
                  onCopyUrl('https://developer.android.com/about/versions/16', 'Android 16 Developer Documentation');
                }
              }}
              className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-blue-400/40 hover:bg-blue-950/20 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <div className="truncate pr-2">
                <div className="text-xs font-bold text-white group-hover:text-blue-300 flex items-center gap-1.5">
                  <span>Copy Android 16 Docs</span>
                  <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1 rounded">3s</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">developer.android.com/about/16</div>
              </div>
              <Copy className="w-4 h-4 text-slate-400 group-hover:text-blue-400 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
