import React from 'react';
import { 
  ShieldCheck, Cpu, Layers, Zap, CheckCircle2, 
  Terminal, Sparkles, AlertCircle, ArrowUpRight, Gauge
} from 'lucide-react';

export const ArchitectureGuide: React.FC = () => {
  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6 text-slate-200">
      <div className="flex items-center gap-2.5 border-b border-white/5 pb-4">
        <ShieldCheck className="w-5 h-5 text-blue-400" />
        <div>
          <h2 className="text-base font-bold text-white">Principal Android 16 Architecture & Performance Specs</h2>
          <p className="text-xs text-slate-400">Technical deep dive into Android 16 (API Level 36) system constraints and optimizations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Module 1: WindowManager Overlay & Edge-to-Edge */}
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-2 shadow-inner">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <Layers className="w-4 h-4" />
            <span>1. Edge-to-Edge Overlay & Insets</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            In Android 16 (API 36), Edge-to-Edge is mandatory by default. Overlays must not draw blindly over native status bar icons or camera punch-holes.
          </p>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
            <li><strong>DisplayCutout Geometry:</strong> Query <code className="text-blue-300 font-mono">rootWindowInsets.displayCutout.boundingRects</code> to adapt to center/left punch-holes.</li>
            <li><strong>Dynamic Flags:</strong> Switch between <code className="text-blue-300 font-mono">FLAG_NOT_TOUCH_MODAL</code> (pass-through) and interactive modal bounds during expansion.</li>
            <li><strong>Hardware Acceleration:</strong> Utilize <code className="text-blue-300 font-mono">PixelFormat.TRANSLUCENT</code> and <code className="text-blue-300 font-mono">FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS</code>.</li>
          </ul>
        </div>

        {/* Module 2: Jetpack Compose 120Hz Animation Physics */}
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-2 shadow-inner">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Zap className="w-4 h-4" />
            <span>2. 120Hz Spring Physics & Recomposition Guards</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Locking consistent 120 FPS frame pacing requires sub-millisecond layout passes and zero redundant recompositions.
          </p>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
            <li><strong>Sub-Pixel Animatables:</strong> Single continuous <code className="text-cyan-300 font-mono">Animatable</code> instances for width, height, and squircle corner radii.</li>
            <li><strong>derivedStateOf:</strong> Protect composition trees during continuous float spring oscillations.</li>
            <li><strong>Lambda Modifiers:</strong> Use <code className="text-cyan-300 font-mono">Modifier.graphicsLayer &#123; scaleX = ... &#125;</code> to isolate squash-and-stretch rendering to the RenderNode.</li>
          </ul>
        </div>

        {/* Module 3: Zero Memory Leaks in System WindowManager */}
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-2 shadow-inner">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>3. Zero Memory Leak Lifecycle Binding</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Embedding Jetpack Compose inside a background Service Window requires explicit custom lifecycle owners.
          </p>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
            <li>Implement <code className="text-purple-300 font-mono">LifecycleOwner</code>, <code className="text-purple-300 font-mono">ViewModelStoreOwner</code>, and <code className="text-purple-300 font-mono">SavedStateRegistryOwner</code> directly on the Service.</li>
            <li>Call <code className="text-purple-300 font-mono">setViewTreeLifecycleOwner(this)</code> on <code className="text-purple-300 font-mono">ComposeView</code> before <code className="text-purple-300 font-mono">setContent</code>.</li>
            <li>Proper teardown in <code className="text-purple-300 font-mono">onDestroy()</code> clears the <code className="text-purple-300 font-mono">ViewModelStore</code> and removes view from <code className="text-purple-300 font-mono">WindowManager</code>.</li>
          </ul>
        </div>

        {/* Module 4: Stricter Android 16 Intent & Work Quotas */}
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-2 shadow-inner">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
            <Gauge className="w-4 h-4" />
            <span>4. Explicit Intents & Battery Quotas</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Android 16 enforces strict background execution limits and explicit broadcast receiver validation.
          </p>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
            <li><strong>Explicit Filtering:</strong> <code className="text-teal-300 font-mono">NotificationListenerService</code> uses explicit package checks and token-based media sessions.</li>
            <li><strong>Worker Dispatchers:</strong> Offload all notification payload JSON and metadata scraping to <code className="text-teal-300 font-mono">Dispatchers.Default</code>.</li>
            <li><strong>Standby Quota:</strong> Zero periodic wake-locks; background power consumption is capped at &lt; 0.2%/hr.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
