export type IslandMode = 
  | 'idle'
  | 'music'
  | 'call'
  | 'timer'
  | 'charging'
  | 'navigation'
  | 'message'
  | 'airdrop'
  | 'recording'
  | 'chrome'
  | 'split'; // Multi-activity: Music on primary, Timer/Nav on secondary

export type IslandExpansionState = 'collapsed' | 'compact' | 'expanded' | 'minimal';

export type CutoutType = 'center-hole' | 'left-hole' | 'pill-center' | 'waterdrop-notch';

export type PhysicsAnimationType = 
  | 'butter-smooth' 
  | 'liquid-droplet' 
  | 'frosted-glass' 
  | 'snappy-pro' 
  | 'jelly-bounce' 
  | 'custom';

export type IslandThemeStyle = 'obsidian' | 'frosted-glass' | 'cyber-glow' | 'translucent-blue';

export interface SpringPhysicsConfig {
  stiffness: number; // e.g., 240, 320, 450, 700
  damping: number;   // e.g., 20, 26, 34
  mass: number;      // e.g., 0.8, 1.0, 1.2
  presetName: string;
  animationType: PhysicsAnimationType;
  dropletViscosity: number; // 0 (rigid) to 1 (liquid droplet)
  glassSpecularIntensity: number; // 0 to 1
  enableDropletRipple: boolean;
}

export interface BatteryOptimizationConfig {
  ecoMode: boolean; // Battery saver mode
  lowSpecDeviceMode: boolean; // Low-end CPU/GPU optimization (disables expensive blurs/shaders)
  oledPureBlack: boolean; // 100% #000000 for zero-power AMOLED subpixels
  disableBackgroundBlur: boolean; // Avoids costly GPU RenderEffect blur passes
  simplifyEqualizer: boolean; // Low-frequency 3-band static/eco audio wave
  pauseSpinWhenHidden: boolean; // Stop artwork rotation animations
  targetFps: 30 | 60 | 90 | 120;
  estimatedBatteryDrainHourly: number; // e.g. 0.04 to 0.22 %/hr
}

export interface IslandCustomizerConfig {
  offsetX: number; // -100px to +100px (horizontal alignment)
  offsetY: number; // 0px to 60px (distance from status bar)
  widthScale: number; // 0.85 to 1.30 (width multiplier)
  baseHeight: number; // 28px to 48px
  expandedHeightScale: number; // 0.85 to 1.25
  cornerRadius: number; // 14px to 26px (squircle radius)
  themeStyle: IslandThemeStyle;
  showCalibrationGuide: boolean; // Interactive alignment crosshairs & bounding box
  allowDirectDragAdjust: boolean; // Drag Island on screen to adjust position in real time
  autoCutoutAvoidance: boolean; // Auto-shift text & equalizer outside punch-hole zone
  cutoutSafeClearance: number; // Width of center dead-zone (px)
  compactTextDisplay: 'auto-wing' | 'marquee' | 'icon-only'; // Layout of text in compact mode
  devicePreset: string;
}

export interface MusicTrack {
  title: string;
  artist: string;
  coverUrl: string;
  duration: number; // seconds
  currentTime: number;
  isPlaying: boolean;
  themeColor: string;
}

export interface CallInfo {
  callerName: string;
  callerNumber: string;
  callerAvatar: string;
  callDuration: number;
  status: 'incoming' | 'active' | 'on-hold';
}

export interface TimerInfo {
  totalSeconds: number;
  remainingSeconds: number;
  label: string;
  isRunning: boolean;
}

export interface ChargingInfo {
  batteryLevel: number;
  chargingSpeed: 'Standard (15W)' | 'Fast (25W)' | 'Super Fast 2.0 (45W)' | 'Wireless (15W)';
  isCharging: boolean;
  timeRemainingMinutes: number;
}

export interface NavigationInfo {
  instruction: string;
  nextRoad: string;
  distanceRemaining: string;
  icon: 'turn-left' | 'turn-right' | 'straight' | 'u-turn' | 'roundabout';
  eta: string;
}

export interface MessageInfo {
  senderName: string;
  appName: 'WhatsApp' | 'Telegram' | 'Messages' | 'Slack';
  messageText: string;
  timestamp: string;
  avatar: string;
}

export interface QuickShareInfo {
  fileName: string;
  fileSize: string;
  progress: number; // 0 to 100
  senderDevice: string;
}

export interface RecordingInfo {
  durationSeconds: number;
  isRecording: boolean;
  decibelLevel: number;
}

export interface CopiedUrlInfo {
  url: string;
  title: string;
  source: string;
  favicon?: string;
}

export interface FrameTelemetry {
  fps: number;
  targetFps: 30 | 60 | 90 | 120;
  frameTimeMs: number;
  recompositionCount: number;
  heapMemoryMb: number;
  batteryDrainHourly: number; // %/hr
  coroutineDispatches: number;
  cpuLoadPercent?: number;
  gpuLoadPercent?: number;
}

export interface KotlinCodeFile {
  id: string;
  fileName: string;
  packagePath: string;
  title: string;
  category: 'core' | 'service' | 'ui' | 'insets' | 'config' | 'security' | 'compatibility';
  description: string;
  code: string;
}

export interface SecurityVulnerability {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  category: 'TapJacking / ClickJacking' | 'Clipboard Snooping' | 'Intent Hijacking' | 'Memory Safety / MTE' | 'Permission Sandboxing';
  threatDescription: string;
  mitigationMechanism: string;
  status: 'MITIGATED' | 'PROTECTED' | 'ENFORCED';
  codeRule: string;
}

export interface AndroidVersionAudit {
  versionName: string;
  apiLevel: number;
  releaseYear: number;
  status: 'SUPPORTED' | 'TARGET' | 'MINIMUM';
  keyChanges: string[];
  windowFlags: string;
  cutoutSupport: string;
  permissionsRequired: string[];
  blurShaderSupport: boolean;
}

export interface SecurityAuditReport {
  overallScore: number;
  tapjackingProtected: boolean;
  sensitiveClipboardScrubbed: boolean;
  pendingIntentImmutable: boolean;
  leastPrivilegeGuaranteed: boolean;
  sixteenKbPageAligned: boolean;
  minSdkSupported: number;
  targetSdkSupported: number;
}
