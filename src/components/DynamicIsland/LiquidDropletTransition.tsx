import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Phone, Navigation, Clock, MessageSquare, Mic, Sparkles, Globe } from 'lucide-react';

export type SupportedDropletApp = 'spotify' | 'phone' | 'maps' | 'messages' | 'timer' | 'recorder' | 'chrome';

interface LiquidDropletTransitionProps {
  isMinimizing: boolean;
  isExpanding: boolean;
  appType: SupportedDropletApp;
  onMinimizationComplete: () => void;
  onExpansionComplete: () => void;
  cutoutOffsetY?: number;
}

export const LiquidDropletTransition: React.FC<LiquidDropletTransitionProps> = ({
  isMinimizing,
  isExpanding,
  appType,
  onMinimizationComplete,
  onExpansionComplete,
  cutoutOffsetY = 0,
}) => {
  const getAppConfig = () => {
    switch (appType) {
      case 'spotify':
        return {
          icon: Music,
          name: 'Spotify Music'
        };
      case 'phone':
        return {
          icon: Phone,
          name: 'Phone Call'
        };
      case 'maps':
        return {
          icon: Navigation,
          name: 'Google Maps'
        };
      case 'messages':
        return {
          icon: MessageSquare,
          name: 'WhatsApp'
        };
      case 'timer':
        return {
          icon: Clock,
          name: 'Timer'
        };
      case 'recorder':
        return {
          icon: Mic,
          name: 'Voice Recorder'
        };
      case 'chrome':
        return {
          icon: Globe,
          name: 'Google Chrome'
        };
      default:
        return {
          icon: Sparkles,
          name: 'Live Activity'
        };
    }
  };

  const app = getAppConfig();
  const Icon = app.icon;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {/* SVG Gooey Liquid Filter Definition */}
      <svg className="hidden">
        <defs>
          <filter id="liquid-droplet-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <AnimatePresence>
        {isMinimizing && (
          <>
            {/* Primary Pure Transparent Liquid Water Droplet flying up into Island */}
            <motion.div
              key="minimizing-droplet"
              initial={{
                opacity: 1,
                scaleX: 1,
                scaleY: 1,
                y: 320,
                x: 0,
                width: 220,
                height: 140,
                borderRadius: 36
              }}
              animate={{
                opacity: [1, 1, 0.9, 0],
                y: [320, 180, 45 + cutoutOffsetY, 18 + cutoutOffsetY],
                width: [220, 120, 60, 24],
                height: [140, 80, 40, 24],
                scaleX: [1, 0.65, 0.8, 1.3, 0.2],
                scaleY: [1, 1.45, 1.2, 0.7, 0.2],
                borderRadius: [36, 50, 50, 50, 50]
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1], // Custom snappy liquid cubic-bezier
                times: [0, 0.4, 0.75, 0.92, 1]
              }}
              onAnimationComplete={onMinimizationComplete}
              className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center bg-white/[0.12] backdrop-blur-2xl shadow-[0_8px_32px_rgba(255,255,255,0.2),inset_0_2px_12px_rgba(255,255,255,0.4),0_20px_40px_rgba(0,0,0,0.6)] border border-white/40"
            >
              {/* Glass Specular Gloss Highlight Arc */}
              <div className="absolute top-1.5 inset-x-3 h-2 rounded-full bg-gradient-to-b from-white/60 to-transparent pointer-events-none opacity-80" />

              {/* Internal Icon fading as droplet condenses */}
              <motion.div
                animate={{
                  opacity: [1, 0.8, 0],
                  scale: [1, 0.6, 0.1]
                }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center gap-1 text-white drop-shadow-md z-10"
              >
                <Icon className="w-8 h-8 text-white" />
                <span className="text-[10px] font-bold tracking-tight text-white/90">{app.name}</span>
              </motion.div>
            </motion.div>

            {/* Trailing Transparent Micro Droplet 1 for realistic water teardrop effect */}
            <motion.div
              key="droplet-tail-1"
              initial={{ opacity: 0, y: 380, width: 18, height: 28, borderRadius: 50 }}
              animate={{
                opacity: [0, 0.8, 0],
                y: [380, 240, 50 + cutoutOffsetY],
                scaleX: [1, 0.6, 0.2],
                scaleY: [1, 1.5, 0.2]
              }}
              transition={{
                duration: 0.55,
                delay: 0.08,
                ease: [0.25, 1, 0.5, 1]
              }}
              className="absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3),inset_0_1px_4px_rgba(255,255,255,0.5)]"
            />

            {/* Trailing Transparent Micro Droplet 2 */}
            <motion.div
              key="droplet-tail-2"
              initial={{ opacity: 0, y: 400, width: 10, height: 14, borderRadius: 50 }}
              animate={{
                opacity: [0, 0.6, 0],
                y: [400, 260, 65 + cutoutOffsetY],
                scaleX: [1, 0.5, 0.1],
                scaleY: [1, 1.4, 0.1]
              }}
              transition={{
                duration: 0.5,
                delay: 0.14,
                ease: [0.25, 1, 0.5, 1]
              }}
              className="absolute left-1/2 -translate-x-1/2 bg-white/25 backdrop-blur-md border border-white/30"
            />

            {/* Impact Transparent Water Ripple Shockwave at Dynamic Island location */}
            <motion.div
              key="island-impact-ripple"
              initial={{ opacity: 0, scale: 0.2, y: 18 + cutoutOffsetY }}
              animate={{
                opacity: [0, 0, 0.8, 0],
                scale: [0.2, 0.3, 1.4, 2.2],
                y: 18 + cutoutOffsetY
              }}
              transition={{
                duration: 0.65,
                times: [0, 0.6, 0.85, 1]
              }}
              className="absolute left-1/2 -translate-x-1/2 w-28 h-10 rounded-full border-2 border-white/60 bg-white/5 pointer-events-none shadow-[0_0_20px_rgba(255,255,255,0.35)]"
            />
          </>
        )}

        {isExpanding && (
          <>
            {/* Reverse Transparent Liquid Droplet Expansion from Dynamic Island into Full App */}
            <motion.div
              key="expanding-droplet"
              initial={{
                opacity: 0.8,
                y: 18 + cutoutOffsetY,
                width: 40,
                height: 24,
                scaleX: 0.6,
                scaleY: 1.4,
                borderRadius: 50
              }}
              animate={{
                opacity: [0.8, 1, 1, 0],
                y: [18 + cutoutOffsetY, 120, 280, 360],
                width: [40, 100, 260, 340],
                height: [24, 80, 220, 480],
                scaleX: [0.6, 1.2, 1, 1],
                scaleY: [1.4, 0.85, 1, 1],
                borderRadius: [50, 40, 32, 28]
              }}
              transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1]
              }}
              onAnimationComplete={onExpansionComplete}
              className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center bg-white/[0.12] backdrop-blur-2xl shadow-[0_12px_45px_rgba(255,255,255,0.25),inset_0_2px_14px_rgba(255,255,255,0.4)] border border-white/50"
            >
              <Icon className="w-12 h-12 text-white animate-pulse" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
