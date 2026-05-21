import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Terminal, Image as ImageIcon, Flame, RefreshCw, Layers, 
  HelpCircle, Share2, Award, Users, BookOpen, Settings2, Download, 
  AlertTriangle, Upload, Eye, EyeOff, Play, CheckCircle2, ChevronRight, 
  Heart, MessageSquare, Plus, Clock, Target, Volume2, VolumeX, ShieldAlert,
  Sliders, Trash2
} from "lucide-react";

import SplashScreen from "./components/SplashScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import { Challenge, LibraryErrorItem, CommunityPost, Achievement, UserProfile } from "./types";
import { 
  INITIAL_CHALLENGES, 
  INITIAL_ERROR_LIBRARY, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_COMMUNITY_POSTS 
} from "./initialData";

export default function App() {
  // Navigation & Onboarding States
  const [isBooted, setIsBooted] = useState(false);
  const [userTag, setUserTag] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'generator' | 'challenges' | 'library' | 'community' | 'settings'>('editor');
  
  // Audio state
  const [audioEnabled, setAudioEnabled] = useState(true);

  // User Profile & Gamification
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    level: 2,
    xp: 340,
    maxXp: 1000,
    points: 150,
    completedChallengesCount: 0,
    achievements: INITIAL_ACHIEVEMENTS
  });

  // Editor states
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [sampleImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop", // Classical art block
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop", // Neon geometric
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop", // Brutalist concrete
  ]);
  const [chaosIntensity, setChaosIntensity] = useState<number>(50);
  const [pixelSorting, setPixelSorting] = useState<boolean>(true);
  const [crtFilter, setCrtFilter] = useState<boolean>(true);
  const [colorDistortion, setColorDistortion] = useState<number>(30); // scale 0-100
  const [vhsNoise, setVhsNoise] = useState<number>(40);
  const [zoomScale, setZoomScale] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isBeforeView, setIsBeforeView] = useState<boolean>(false);
  const [canvasElements, setCanvasElements] = useState<string[]>([]); // custom text triggers

  // New Creative Customization & Modification States
  const [sloganText, setSloganText] = useState<string>("STAY WRONG");
  const [sloganSubText, setSloganSubText] = useState<string>("EL SECUESTRO DEL ORDEN CORPORATIVO DE MANOS DE UNA MENTE CREATIVA EN BLOQUEO.");
  const [textColor, setTextColor] = useState<string>("#00FF66"); // Default Neon Green
  const [bgColor, setBgColor] = useState<string>("#16161C"); // Default Grafito grey
  const [decoShape, setDecoShape] = useState<'none' | 'circle' | 'triangle' | 'cross' | 'grid'>('none');
  const [layoutStyle, setLayoutStyle] = useState<'brutalist-left' | 'centered-block' | 'massive-title' | 'bottom-split'>('brutalist-left');
  const [sloganSize, setSloganSize] = useState<number>(45); // default 45 font size
  const [editorControlTab, setEditorControlTab] = useState<'content' | 'colors' | 'chaos'>('content');

  // AI Generator states
  const [blockType, setBlockType] = useState<string>("poster");
  const [conceptsHistory, setConceptsHistory] = useState<any[]>([]);
  const [currentConcept, setCurrentConcept] = useState<any | null>(null);
  const [conceptDetails, setConceptDetails] = useState<string>("");
  const [isGeneratingConcept, setIsGeneratingConcept] = useState<boolean>(false);

  // Style mixer states
  const [styleA, setStyleA] = useState<string>("Bauhaus");
  const [styleB, setStyleB] = useState<string>("Cyberpunk");
  const [styleMixResult, setStyleMixResult] = useState<any | null>(null);
  const [isMixingStyles, setIsMixingStyles] = useState<boolean>(false);

  // Anti-Perfectionism Engine
  const [sessionStartTime] = useState<number>(Date.now());
  const [timeElapsed, setTimeElapsed] = useState<string>("00:00");
  const [adjustmentClicks, setAdjustmentClicks] = useState<number>(0);
  const [antiPerfectionistAttack, setAntiPerfectionistAttack] = useState<any | null>(null);
  const [screenShaking, setScreenShaking] = useState<boolean>(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'warning' | 'info' | 'error'>('info');

  const showToast = (message: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    
    // Clear after 4.5 seconds
    setTimeout(() => {
      setToastMessage(prev => prev === message ? null : prev);
    }, 4500);
  };

  // Challenges States
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [challengeTimer, setChallengeTimer] = useState<number>(0);
  const [isChallengeTimerActive, setIsChallengeTimerActive] = useState<boolean>(false);

  // Library & Shared Content
  const [libraryItems, setLibraryItems] = useState<LibraryErrorItem[]>(INITIAL_ERROR_LIBRARY);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [newPostTitle, setNewPostTitle] = useState<string>("");
  const [newPostTags, setNewPostTags] = useState<string>("Chaos, ErrorLab");

  // Dynamic status/telemetry variables
  const [noiseStatusActive, setNoiseStatusActive] = useState(false);
  const [memUse, setMemUse] = useState("4128KB");

  // Audio synths using Web Audio API to fit punk/cyber mood
  const playGlitchSound = (frequency: number = 220, type: OscillatorType = 'triangle', duration: number = 0.15) => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Oscillator 1 path
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      // trigger frequency slides to simulate circuit noise
      osc.frequency.exponentialRampToValueAtTime(frequency * 4, ctx.currentTime + duration * 0.4);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + duration);
      
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // safe fallback if audio context blocked/not supported
    }
  };

  const playSirenDestroySound = () => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Make a repeating retro pitch siren
      const now = ctx.currentTime;
      for (let i = 0; i < 6; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sawtooth";
        // Alarms are dissonant
        osc.frequency.setValueAtTime(800 + (i % 2 === 0 ? 300 : -200), now + (i * 0.1));
        osc.frequency.linearRampToValueAtTime(150, now + (i * 0.1) + 0.1);
        
        gain.gain.setValueAtTime(0.15, now + (i * 0.1));
        gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.1) + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + (i * 0.1));
        osc.stop(now + (i * 0.1) + 0.1);
      }
    } catch (e) {}
  };

  // Clock updates & noise level flutters
  useEffect(() => {
    const timer = setInterval(() => {
      // Format timer
      const diff = Date.now() - sessionStartTime;
      const m = Math.floor(diff / 60000).toString().padStart(2, "0");
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
      setTimeElapsed(`${m}:${s}`);

      // Randomly change mem usage to look live
      setMemUse(`${Math.floor(Math.random() * 4000 + 4000)}KB`);
      // Randomly toggle noise status active slightly
      setNoiseStatusActive(Math.random() > 0.7);
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStartTime]);

  // Challenge countdown timer
  useEffect(() => {
    let interval: any;
    if (isChallengeTimerActive && challengeTimer > 0) {
      interval = setInterval(() => {
        setChallengeTimer((prev) => {
          if (prev <= 1) {
            setIsChallengeTimerActive(false);
            playSirenDestroySound();
            showToast("⚠️ ¡TIEMPO AGOTADO! El caos absoluto ha destruido tu diseño corporativo temporal.", "error");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isChallengeTimerActive, challengeTimer]);

  // Unlock achievements trigger helper
  const unlockAchievement = (id: string) => {
    setProfile(prev => {
      const updated = prev.achievements.map(ach => {
        if (ach.id === id && !ach.unlocked) {
          playGlitchSound(880, 'sine', 0.4);
          return { ...ach, unlocked: true, unlockedAt: new Date().toLocaleTimeString() };
        }
        return ach;
      });
      
      // Calculate XP bonus if unlocked
      const wasLocked = prev.achievements.find(a => a.id === id)?.unlocked === false;
      const bonusXp = wasLocked ? 150 : 0;
      let newXp = prev.xp + bonusXp;
      let newLvl = prev.level;
      if (newXp >= prev.maxXp) {
        newXp -= prev.maxXp;
        newLvl += 1;
      }

      return {
        ...prev,
        achievements: updated,
        xp: newXp,
        level: newLvl,
        points: prev.points + (wasLocked ? 50 : 0)
      };
    });
  };

  // Automatically monitor over-editing in a subtle way to award progression
  const onValueChangeTrack = () => {
    setAdjustmentClicks(prev => {
      const next = prev + 1;
      // Gently unlock achievement at 15 adjustments, but NEVER shake the screen or destroy work unexpectedly
      if (next === 15) {
        unlockAchievement("ach_4");
      }
      return next;
    });
  };

  // Heavy destructive alert
  const triggerAntiPerfectionistAttack = async () => {
    try {
      playSirenDestroySound();
      setScreenShaking(true);
      setTimeout(() => setScreenShaking(false), 900);
      
      const payload = {
        currentDuration: Date.now() - sessionStartTime,
        toolRepeats: adjustmentClicks,
        detailClicks: adjustmentClicks + 5
      };

      const res = await fetch("/api/gemini/anti-perfectionism", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setAntiPerfectionistAttack(data);
      } else {
        throw new Error("Local fallback required");
      }
    } catch (e) {
      setAntiPerfectionistAttack({
        snarkyRemark: "¡ALGUIEN TIENE MIEDO AL CAOS! Llevas demasiados ajustes idénticos estropeando la espontaneidad.",
        destructionDirective: "ALERTA ANTI-EDICIÓN: El algoritmo ha invertido tu lienzo y bloqueado la simetría. Añade un garabato gigante."
      });
    }
    unlockAchievement("ach_4");
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        playGlitchSound(330, 'square', 0.2);
        unlockAchievement("ach_1");
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSample = (url: string) => {
    setUploadedImage(url);
    playGlitchSound(440, 'triangle', 0.1);
  };

  // Preset quick distortion helpers
  const applyExtremeGlitchPreset = () => {
    playGlitchSound(120, 'sawtooth', 0.35);
    setChaosIntensity(95);
    setColorDistortion(88);
    setVhsNoise(90);
    setPixelSorting(true);
    setRotation(Math.random() > 0.5 ? 90 : -90);
    setZoomScale(130);
    onValueChangeTrack();
  };

  const handleCreateFromScratch = () => {
    setUploadedImage(null);
    setSloganText("DISEÑO NUEVO");
    setSloganSubText("UN LIENZO LIMPIO PARA EMPEZAR A CREAR DESDE CERO.");
    setTextColor("#00FF66");
    setBgColor("#050506");
    setDecoShape('none');
    setLayoutStyle('brutalist-left');
    setSloganSize(42);
    setChaosIntensity(10);
    setColorDistortion(10);
    setRotation(0);
    setZoomScale(100);
    setEditorControlTab('content'); // switch to content editor
    playGlitchSound(440, 'sine', 0.25);
  };

  const handleRandomCombination = () => {
    const CREATIVE_SLOGANS = [
      "STAY WRONG", "ERROR GRÁFICO", "SYS_COLLAPSE", "VANDALISMO", "DISEÑO SUCIO", 
      "FUERA LÍMITES", "CRASH_SYSTEM", "RUPTURA", "REBELDE GRÁFICO", "SPONTANEOUS",
      "CAOS NATIVO", "FUCK RULES", "REBELDÍA", "SIN MARGENES", "ESTILO LIBRE"
    ];
    const CREATIVE_SUBTEXTS = [
      "La inspiración más pura es la que secuestra el orden sagrado corporativo.",
      "Un ataque visual destructivo contra el perfeccionismo comercial de oficina.",
      "Composición de fanzine urbano hecha con una mente en total disrupción creativa.",
      "Sin guías perfectas, sin simetría, solo la fuerza brutal del glitch estático.",
      "El desorden programado ha tomado control del espectro de tu pantalla.",
      "Desconéctate del orden pulcro tradicional y abraza el ruido espontáneo."
    ];
    const ACCENT_COLORS = ["#00FF66", "#00E5FF", "#DFFF00", "#FFFFFF", "#FF007F"];
    const BG_COLORS = ["#16161C", "#0A0D1A", "#1D0B0E", "#050506", "#0A1D11"];
    const SHAPES: ("none" | "circle" | "triangle" | "cross" | "grid")[] = ["none", "circle", "triangle", "cross", "grid"];
    const LAYOUTS: ("brutalist-left" | "centered-block" | "massive-title" | "bottom-split")[] = ["brutalist-left", "centered-block", "massive-title", "bottom-split"];

    // random selections
    const randSlogan = CREATIVE_SLOGANS[Math.floor(Math.random() * CREATIVE_SLOGANS.length)];
    const randSubtext = CREATIVE_SUBTEXTS[Math.floor(Math.random() * CREATIVE_SUBTEXTS.length)];
    const randTextC = ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)];
    const randBgC = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];
    const randShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const randLayout = LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)];
    const randImg = Math.random() > 0.4 ? sampleImages[Math.floor(Math.random() * sampleImages.length)] : null;
    
    setSloganText(randSlogan);
    setSloganSubText(randSubtext);
    setTextColor(randTextC);
    setBgColor(randBgC);
    setDecoShape(randShape);
    setLayoutStyle(randLayout);
    setUploadedImage(randImg);
    
    // Randomize styling variables as well
    setChaosIntensity(Math.floor(Math.random() * 65 + 25));
    setColorDistortion(Math.floor(Math.random() * 70 + 15));
    setRotation(Math.floor(Math.random() * 80) - 40); // rotation between -40 and +40
    setZoomScale(Math.floor(Math.random() * 35 + 85)); // zoom scale
    setSloganSize(Math.floor(Math.random() * 18 + 32)); // font size
    
    playGlitchSound(200, 'square', 0.25);
    onValueChangeTrack();
  };

  const handleApplyVandalizeRandom = () => {
    handleRandomCombination();
  };

  // Dynamic canvas styling filters based on parameters
  const getCanvasFilterStyle = () => {
    if (isBeforeView) return {};
    
    // Convert controls into violent CSS filter strings
    const blurVal = Math.max(0, (chaosIntensity - 50) / 10);
    const contrastVal = 100 + chaosIntensity;
    const hueVal = colorDistortion * 3.6; // 360 deg
    const invertVal = colorDistortion > 75 ? 100 : colorDistortion > 50 ? 50 : 0;
    const saturateVal = 100 + (chaosIntensity * 3);
    
    return {
      filter: `contrast(${contrastVal}%) hue-rotate(${hueVal}deg) invert(${invertVal}%) saturate(${saturateVal}%) blur(${blurVal}px)`,
      transform: `scale(${zoomScale / 100}) rotate(${rotation}deg)`,
      transition: "all 0.1s ease-out",
      boxShadow: chaosIntensity > 70 ? `15px 15px 0px #FF007F, -15px -15px 0px #00FF66` : `15px 15px 0px #16161C`
    };
  };

  // Call Gemini-API Concepts Generator
  const generateConceptAI = async () => {
    setIsGeneratingConcept(true);
    playGlitchSound(600, 'sine', 0.2);
    try {
      const res = await fetch("/api/gemini/generate-concept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockType: blockType,
          userInputs: conceptDetails
        })
      });
      const data = await res.json();
      setCurrentConcept(data);
      setConceptsHistory(prev => [data, ...prev]);
    } catch (e) {
      setCurrentConcept({
        title: "PUNK BRUTALIST COLLAPSE",
        concept: "Escribe un manifiesto de 4 palabras criticando el lujo siliconado. Superponlo sobre una foto pixelada de cables enredados.",
        limitations: ["Color verde y magenta solamente", "Prohibidas las curvas", "Usa tipografía de noticias antigua cortada"],
        palette: ["#000000", "#FF007F", "#00FF66", "#FFFFFF"],
        composition: "Un triángulo blanco gigante descentrado sirve como contenedor del texto cortado."
      });
    } finally {
      setIsGeneratingConcept(false);
      playGlitchSound(500, 'triangle', 0.15);
    }
  };

  // Call Gemini-API Style Mixer
  const mixStylesAI = async () => {
    setIsMixingStyles(true);
    playGlitchSound(700, 'sine', 0.3);
    try {
      const res = await fetch("/api/gemini/mix-styles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ styleA, styleB })
      });
      const data = await res.json();
      setStyleMixResult(data);
    } catch (e) {
      setStyleMixResult({
        hybridName: styleA + " + " + styleB,
        philosophy: "Un secuestro de la simetría por parte del desorden anárquico. Las proporciones sagradas se rompen usando ruidos CRT saturados.",
        typographicRules: "Tipografía de titulares de 120px combinada con pequeñas coordenadas técnicas de 8px.",
        posterPrompt: `Crea una portada de fanzine usando ${styleA} con la agresividad callejera de ${styleB}`,
        visualDirectives: ["Cero alineaciones perfectas", "Usa texturas de fotocopia estropeada", "Insertar un glitch central que divida el lienzo"]
      });
    } finally {
      setIsMixingStyles(false);
      playGlitchSound(600, 'sine', 0.1);
      unlockAchievement("ach_5");
    }
  };

  // Start selected Challenge from Extreme Limitation Mode
  const startChallenge = (chal: Challenge) => {
    playGlitchSound(350, 'sawtooth', 0.25);
    setActiveChallenge(chal);
    setChallengeTimer(chal.durationMinutes * 60);
    setIsChallengeTimerActive(true);
    // Automatically apply rules in the editor!
    if (chal.id === "chal_1") {
      setPixelSorting(true);
      setChaosIntensity(65);
    } else if (chal.id === "chal_2") {
      setChaosIntensity(80);
      setColorDistortion(90);
    }
  };

  // Award Points and finish challenge
  const completeChallenge = () => {
    if (!activeChallenge) return;
    playGlitchSound(800, 'sine', 0.5);
    
    // Add XP & Points
    setProfile(prev => {
      let newXp = prev.xp + activeChallenge.points;
      let newLvl = prev.level;
      if (newXp >= prev.maxXp) {
        newXp -= prev.maxXp;
        newLvl += 1;
      }
      return {
        ...prev,
        xp: newXp,
        level: newLvl,
        points: prev.points + activeChallenge.points,
        completedChallengesCount: prev.completedChallengesCount + 1
      };
    });

    showToast(`🏆 ¡RETO SUPERADO! Has acumulado +${activeChallenge.points} XP e incrementado tu nivel contra el sistema.`, "success");
    unlockAchievement("ach_2");
    setActiveChallenge(null);
    setIsChallengeTimerActive(false);
  };

  // Global Community Interactions (Like, Comment, Submit)
  const handleLikePost = (postId: string) => {
    playGlitchSound(450, 'sine', 0.1);
    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const liked = !post.likedByUser;
        return {
          ...post,
          likes: liked ? post.likes + 1 : post.likes - 1,
          likedByUser: liked
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string, commentText: string) => {
    if (!commentText.trim()) return;
    playGlitchSound(300, 'triangle', 0.1);
    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `comment_${Date.now()}`,
              user: userTag || "REBEL_DESIGNER",
              text: commentText,
              time: "Ahora mismo"
            }
          ]
        };
      }
      return post;
    }));
  };

  // Share current canvas setup to Community
  const publishToCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) {
      showToast("Introduce un titular rebelde para tu publicación.", "warning");
      return;
    }

    playGlitchSound(900, 'sine', 0.3);
    const newPost: CommunityPost = {
      id: `post_new_${Date.now()}`,
      user: {
        username: userTag || "ANON_ERROR",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
        level: profile.level
      },
      title: newPostTitle.toUpperCase(),
      imageUrl: uploadedImage || "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop",
      likes: 1,
      likedByUser: true,
      comments: [],
      tags: newPostTags.split(",").map(t => t.trim()),
      createdAt: "Hace unos segundos"
    };

    setCommunityPosts([newPost, ...communityPosts]);
    setNewPostTitle("");
    setNewPostTags("MyExperimentalDesign, ChaosArt");
    setActiveTab('community');
    showToast("⚡ ¡OBRA PUBLICADA! Tu experimento ha sido inyectado en el feed global.", "success");
  };

  // Download logic placeholder
  const triggerDownload = () => {
    playGlitchSound(600, 'triangle', 0.25);
    showToast("💾 COMPILACIÓN DIGITAL LISTA: Tu archivo de alta fidelidad con capas de ruidos desordenadas e indexación CRT ha sido preparado.", "success");
  };

  // Render Screens
  if (!isBooted) {
    return <SplashScreen onComplete={() => setIsBooted(true)} />;
  }

  if (userTag === null) {
    return <WelcomeScreen onStart={(tag) => setUserTag(tag)} />;
  }

  return (
    <div className={`min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col font-sans select-none relative brutalist-grid overflow-x-hidden ${screenShaking ? "shake-active" : ""}`}>
      
      {/* Glitch CRT Overlay scanlines */}
      <div className="absolute inset-0 pointer-events-none noise-overlay z-10" />
      {crtFilter && (
        <div className="absolute inset-0 pointer-events-none z-10 opacity-15 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.02),rgba(0,0,255,0.04))] bg-[size:100%_3px,3px_100%]" />
      )}

      {/* ────────────────────────────────────────────────────────────────
          HEADER (Based on Design template rules: 100px high, border bottom)
          ──────────────────────────────────────────────────────────────── */}
      <header className="h-[90px] md:h-[100px] flex items-center justify-between px-4 md:px-10 border-b border-[#24242D] bg-[#050505]/95 z-20 sticky top-0">
        
        {/* Massive logo stack */}
        <div 
          onClick={applyExtremeGlitchPreset}
          className="cursor-crosshair relative group flex flex-col justify-center"
        >
          <div className="font-display font-[900] text-4xl md:text-5xl leading-none tracking-tighter text-white relative">
            ERR_OR
            <span className="absolute -top-0.5 -left-0.5 text-digital-magenta opacity-80 z-[-1] font-[1000] scale-95 group-hover:-translate-x-1 transition-transform">
              ERR_OR
            </span>
            <span className="absolute top-0.5 left-0.5 text-electric-blue opacity-80 z-[-1] font-[1000] scale-105 group-hover:translate-x-1 transition-transform">
              ERR_OR
            </span>
          </div>
          <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase block mt-1">
            LABORATIVE DESTRUCTION v2.06
          </span>
        </div>

        {/* Centered Desktop Navigation tabs with super crisp icons */}
        <nav className="hidden lg:flex items-center gap-2 font-mono">
          <button 
            onClick={() => { setActiveTab('editor'); playGlitchSound(120, 'sine', 0.05); }}
            className={`px-3.5 py-1.5 text-xs tracking-wider border rounded-lg transition-all flex items-center gap-1.5 uppercase ${activeTab === 'editor' ? 'bg-neon-green text-black border-neon-green font-bold shadow-[0_0_12px_rgba(0,255,102,0.3)]' : 'text-zinc-300 border-zinc-805 hover:border-zinc-650 hover:text-white'}`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>EDITOR</span>
          </button>
          <button 
            onClick={() => { setActiveTab('generator'); playGlitchSound(140, 'sine', 0.05); }}
            className={`px-3.5 py-1.5 text-xs tracking-wider border rounded-lg transition-all flex items-center gap-1.5 uppercase ${activeTab === 'generator' ? 'bg-electric-blue text-black border-electric-blue font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]' : 'text-zinc-300 border-zinc-805 hover:border-zinc-650 hover:text-white'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>IA LAB</span>
          </button>
          <button 
            onClick={() => { setActiveTab('challenges'); playGlitchSound(160, 'sine', 0.05); }}
            className={`px-3.5 py-1.5 text-xs tracking-wider border rounded-lg transition-all flex items-center gap-1.5 uppercase relative ${activeTab === 'challenges' ? 'bg-acid-yellow text-black border-acid-yellow font-bold shadow-[0_0_12px_rgba(223,255,0,0.3)]' : 'text-zinc-300 border-zinc-805 hover:border-zinc-650 hover:text-white'}`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>RETOS</span>
            {isChallengeTimerActive && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-raw-red rounded-full animate-ping" />
            )}
          </button>
          <button 
            onClick={() => { setActiveTab('library'); playGlitchSound(180, 'sine', 0.05); }}
            className={`px-3.5 py-1.5 text-xs tracking-wider border rounded-lg transition-all flex items-center gap-1.5 uppercase ${activeTab === 'library' ? 'bg-digital-magenta text-black border-digital-magenta font-bold shadow-[0_0_12px_rgba(255,0,127,0.3)]' : 'text-zinc-300 border-zinc-805 hover:border-zinc-650 hover:text-white'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>BIBLIOTECA</span>
          </button>
          <button 
            onClick={() => { setActiveTab('community'); playGlitchSound(200, 'sine', 0.05); }}
            className={`px-3.5 py-1.5 text-xs tracking-wider border rounded-lg transition-all flex items-center gap-1.5 uppercase ${activeTab === 'community' ? 'bg-white text-black border-white font-bold shadow-[0_0_12px_rgba(255,255,255,0.3)]' : 'text-zinc-300 border-zinc-805 hover:border-zinc-650 hover:text-white'}`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>COMUNIDAD</span>
          </button>
        </nav>

        {/* Right tools / Profile widget */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 border border-[#24242D] hover:border-zinc-500 text-zinc-400 hover:text-white transition-colors"
            title={audioEnabled ? "Silenciar" : "Activar Audio"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-neon-green" /> : <VolumeX className="w-4 h-4 text-raw-red" />}
          </button>

          <button
            onClick={() => { setActiveTab('settings'); playGlitchSound(330, 'triangle', 0.08); }}
            className="p-2 border border-[#24242D] hover:border-zinc-500 text-zinc-400 hover:text-white transition-colors lg:hidden"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          <div className="bg-zinc-950 px-3 py-1.5 border border-[#24242D] font-mono text-right hidden sm:block">
            <div className="text-[10px] text-zinc-400 tracking-tight flex items-center gap-1.5 justify-end">
              <span className="inline-block w-1.5 h-1.5 bg-neon-green animate-pulse rounded-full" />
              <span>NIVEL {profile.level}</span>
            </div>
            <div className="text-xs font-bold text-white tracking-widest">{profile.username || userTag}</div>
          </div>
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────────────
          MOBILE BOTTOM NAVIGATION TABBAR (Fixed at bottom for celulares)
          ──────────────────────────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0a0c]/95 backdrop-blur-md border-t border-[#24242D] flex items-center justify-around z-50 px-2 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => { setActiveTab('editor'); playGlitchSound(100, 'sine', 0.05); }}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all ${activeTab === 'editor' ? 'text-neon-green bg-neon-green/10 font-bold scale-105' : 'text-zinc-500'}`}
        >
          <Sliders className="w-4 h-4" />
          <span className="text-[9px] font-mono leading-none tracking-tight">Editor</span>
        </button>

        <button 
          onClick={() => { setActiveTab('generator'); playGlitchSound(120, 'sine', 0.05); }}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all ${activeTab === 'generator' ? 'text-electric-blue bg-electric-blue/10 font-bold scale-105' : 'text-zinc-500'}`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[9px] font-mono leading-none tracking-tight">IA Lab</span>
        </button>

        <button 
          onClick={() => { setActiveTab('challenges'); playGlitchSound(140, 'sine', 0.05); }}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all relative ${activeTab === 'challenges' ? 'text-acid-yellow bg-acid-yellow/10 font-bold scale-105' : 'text-zinc-500'}`}
        >
          <Target className="w-4 h-4" />
          <span className="text-[9px] font-mono leading-none tracking-tight">Retos</span>
          {isChallengeTimerActive && (
            <span className="absolute top-2.5 right-3 w-1.5 h-1.5 bg-raw-red rounded-full" />
          )}
        </button>

        <button 
          onClick={() => { setActiveTab('library'); playGlitchSound(100, 'sine', 0.05); }}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all ${activeTab === 'library' ? 'text-digital-magenta bg-digital-magenta/10 font-bold scale-105' : 'text-zinc-500'}`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[9px] font-mono leading-none tracking-tight">Librería</span>
        </button>

        <button 
          onClick={() => { setActiveTab('community'); playGlitchSound(110, 'sine', 0.05); }}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all ${activeTab === 'community' ? 'text-white bg-white/10 font-bold scale-105' : 'text-zinc-500'}`}
        >
          <Users className="w-4 h-4" />
          <span className="text-[9px] font-mono leading-none tracking-tight">Feed</span>
        </button>

        <button 
          onClick={() => { setActiveTab('settings'); playGlitchSound(110, 'sine', 0.05); }}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all ${activeTab === 'settings' ? 'text-zinc-300 bg-zinc-800/10 font-bold scale-105' : 'text-zinc-500'}`}
        >
          <Settings2 className="w-4 h-4" />
          <span className="text-[9px] font-mono leading-none tracking-tight">Ajustes</span>
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────────────
          MAIN GRID LAYOUT (Based on Design template columns: rail, viewport, side-bar, rail)
          ──────────────────────────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[60px_1.5fr_1fr_60px] min-h-0 bg-[#050505] pb-20 lg:pb-0">
        
        {/* LEFT VERTICAL RAIL (Desplayed on large viewports) */}
        <aside className="hidden lg:flex flex-col items-center justify-around border-r border-[#24242D] bg-[#080809] py-8 w-[60px] h-full">
          <div className="vertical-text select-none text-[9px] font-mono tracking-[5px] text-zinc-600 uppercase whitespace-nowrap">
            ANTI_PERFECCIONISMO_STRICT_MODE_v2.0
          </div>
          <div className="h-20 w-[1px] bg-zinc-800" />
          <div className="vertical-text select-none text-[9px] font-mono tracking-[4px] text-zinc-400 uppercase whitespace-nowrap">
            LOC_NEW_YORK_SUBSEC_CRT
          </div>
          <div className="space-y-4 text-zinc-700">
            <ShieldAlert className="w-4 h-4 text-raw-red animate-pulse" />
          </div>
        </aside>

        {/* ────────────────────────────────────────────────────────────────
            CENTRAL VIEWPORT AREA
            ──────────────────────────────────────────────────────────────── */}
        <section className="border-r border-[#24242D] relative flex flex-col bg-radial-[circle_at_center,_#111115_0%,_#050506_100%] min-h-[60vh] lg:min-h-0">
          
          {/* Active Challenge warning strip if user is in an extreme limit challenge */}
          {activeChallenge && (
            <div className="bg-acid-yellow text-black px-4 py-2 font-mono text-xs flex items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 animate-spin text-black" />
                <span>RETO ACTIVO: <strong>{activeChallenge.title}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span>RESTRICCIÓN: {activeChallenge.constraints[0]}</span>
                <span className="bg-black text-[#DFFF00] font-bold px-2 py-0.5 text-xs">
                  ⏱️ {Math.floor(challengeTimer / 60)}:{(challengeTimer % 60).toString().padStart(2, "0")}
                </span>
                <button 
                  onClick={completeChallenge}
                  className="bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-neon-green hover:text-black transition-all"
                >
                  COMPLETAR Y MARCAR ERROR
                </button>
              </div>
            </div>
          )}

          {/* Render views based on screen choice */}

          {/* SCREEN VIEW 1: EDITOR / DIGITAL DISTORTION */}
          {activeTab === 'editor' && (
            <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 justify-between max-w-full overflow-y-auto">
              
              {/* Header Info Banner inside Canvas Viewport */}
              <div className="flex justify-between items-center text-xs font-mono border-b border-zinc-900 pb-3 mb-4">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Terminal className="w-3.5 h-3.5 text-neon-green" />
                  <span className="text-[11px]">LABORATORIO_MÓVIL // EDITABLE</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onMouseDown={() => setIsBeforeView(true)}
                    onMouseUp={() => setIsBeforeView(false)}
                    onTouchStart={() => setIsBeforeView(true)}
                    onTouchEnd={() => setIsBeforeView(false)}
                    className="text-[10px] border border-zinc-800 hover:border-zinc-600 bg-zinc-950 px-2 py-1 text-zinc-400 hover:text-white transition-colors active:bg-zinc-800 flex items-center gap-1 rounded cursor-pointer select-none"
                    title="Mantener presionado para ver el diseño original"
                  >
                    {isBeforeView ? <EyeOff className="w-3 h-3 text-digital-magenta" /> : <Eye className="w-3 h-3 text-neon-green" />}
                    <span>{isBeforeView ? "ORIGINAL" : "VER ANTES"}</span>
                  </button>
                </div>
              </div>

              {/* 🛠️ MODALIDAD PRINCIPAL DE CREACIÓN DE AFICHES */}
              <div className="mb-6 bg-zinc-950 border border-[#1d1d24] rounded-xl p-3.5">
                <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2.5 text-center sm:text-left">
                  🛠️ SELECTOR DE COMPOSICIÓN // ELIGE TU MÉTODO:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-[11px]">
                  
                  {/* Start From 0 */}
                  <button
                    onClick={handleCreateFromScratch}
                    className="px-3.5 py-3 rounded-lg border border-zinc-850 hover:border-neon-green bg-black hover:bg-neon-green/5 text-zinc-300 hover:text-neon-green transition-all flex items-center justify-center gap-2 uppercase font-medium cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>EMPEZAR DESDE 0</span>
                  </button>

                  {/* Freehand edit */}
                  <button
                    onClick={() => { setEditorControlTab('content'); playGlitchSound(200, 'sine', 0.1); }}
                    className="px-3.5 py-3 rounded-lg border border-zinc-850 hover:border-electric-blue bg-black hover:bg-electric-blue/5 text-zinc-300 hover:text-electric-blue transition-all flex items-center justify-center gap-2 uppercase font-medium cursor-pointer"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>EDITAR DISEÑO LIBRE</span>
                  </button>

                  {/* Chaos Shot */}
                  <button
                    onClick={handleRandomCombination}
                    className="px-3.5 py-3 rounded-lg border border-zinc-850 hover:border-digital-magenta bg-black hover:bg-digital-magenta/5 text-zinc-300 hover:text-digital-magenta transition-all flex items-center justify-center gap-2 uppercase font-bold cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>COMBINACIÓN AL AZAR</span>
                  </button>

                </div>
                
                {/* Visual mini-explanation */}
                <div className="mt-2.5 text-[10px] font-sans text-zinc-500 text-center sm:text-left leading-relaxed">
                  💡 <strong>Crear desde cero</strong> limpia el lienzo para arrancar libre. 
                  <strong>Editar libre</strong> te permite afinar detalles con los controles manuales inferiores. 
                  <strong>Combinación al azar</strong> genera al instante títulos rebeldes y distorsiones estéticas.
                </div>
              </div>

              {/* TWO COLUMN RESPONSIVE GRID FOR CELULAR / WEB */}
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* COLUMN 1: STABLE PREVIEW CANVAS (5 Cols on large screen, centered on mobile) */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center">
                  
                  {/* Stable Frame Wrapper - Never jumps, never rotates outer bounds */}
                  <div className="w-[280px] sm:w-[310px] aspect-[3/4] rounded-2xl relative overflow-hidden bg-zinc-950 border border-zinc-900 pointer-events-auto flex items-center justify-center p-4"
                    style={{
                      boxShadow: chaosIntensity > 70 
                        ? `8px 8px 0px ${textColor}, -8px -8px 0px #050506` 
                        : `8px 8px 0px #111115`
                    }}
                  >
                    
                    {/* The actually distorted visual graphic layer - safe to rotate and filter without altering webpage layout borders */}
                    <div 
                      className="absolute inset-0 w-full h-full flex flex-col justify-between p-5 transition-all duration-300 ease-out select-none"
                      style={{
                        backgroundColor: bgColor,
                        filter: isBeforeView ? "none" : `contrast(${100 + chaosIntensity * 0.8}%) hue-rotate(${colorDistortion * 3.6}deg) invert(${colorDistortion > 88 ? 100 : colorDistortion > 65 ? 50 : 0}%) saturate(${100 + chaosIntensity * 2.5}%) blur(${Math.max(0, (chaosIntensity - 50) / 15)}px)`,
                        transform: `scale(${zoomScale / 100}) rotate(${rotation}deg)`
                      }}
                    >
                      {/* Grid overlay */}
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

                      {/* Decorative internal vector stamps depending on shape state */}
                      {decoShape === 'circle' && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-4 border-dashed opacity-40 pointer-events-none" style={{ borderColor: textColor }} />
                      )}
                      {decoShape === 'triangle' && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[70px] border-l-transparent border-r-[70px] border-r-transparent border-b-[120px] opacity-35 pointer-events-none-none" style={{ borderBottomColor: textColor }} />
                      )}
                      {decoShape === 'cross' && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none font-sans font-black text-8xl select-none" style={{ color: textColor }}>
                          ✕
                        </div>
                      )}
                      {decoShape === 'grid' && (
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `radial-gradient(${textColor} 1.5px, transparent 1.5px)`, backgroundSize: '16px 16px' }} />
                      )}

                      {/* Poster Mini Tags */}
                      <div className="z-10 flex justify-between items-start font-mono text-[8px] text-zinc-400 opacity-80 uppercase">
                        <div>
                          <span>EST_ERR // LVL_{profile.level}</span>
                          <span className="block font-bold mt-0.5" style={{ color: textColor }}>[MOD_MANUAL_ON]</span>
                        </div>
                        <span>ROT: {rotation}°</span>
                      </div>

                      {/* Content Workspace inside the card layout */}
                      <div className="z-10 my-auto flex flex-col justify-center items-center text-center w-full relative">
                        
                        {/* Selected uploaded image display */}
                        {uploadedImage ? (
                          <div className="w-full relative max-h-[140px] overflow-hidden border border-zinc-800 rounded bg-black/50 p-1 flex items-center justify-center">
                            <img 
                              src={uploadedImage} 
                              alt="Workspace graphic" 
                              className="max-w-full max-h-[130px] object-contain rounded"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          <div className="py-6 px-3 border border-dashed border-zinc-800/80 text-center w-full bg-black/60 rounded">
                            <Terminal className="w-5 h-5 text-zinc-600 mx-auto mb-1 animate-pulse" />
                            <p className="text-[9px] font-mono text-zinc-500 uppercase">SIN IMAGEN DE FONDO</p>
                            <p className="text-[8px] text-zinc-600 mt-0.5 uppercase font-mono">Seleccione una plantilla inferior</p>
                          </div>
                        )}

                        {/* Title text layers - configured perfectly by layout type */}
                        <div className="w-full mt-4 text-left select-none">
                          {layoutStyle === 'brutalist-left' && (
                            <>
                              <h3 
                                className="font-display leading-[0.85] font-[900] uppercase tracking-tighter break-words overflow-hidden"
                                style={{ 
                                  color: textColor,
                                  fontSize: `${sloganSize}px`,
                                  textShadow: chaosIntensity > 55 ? `2.5px 2.5px 0px #FF007F` : `1.5px 1.5px 0px #000000`
                                }}
                              >
                                {sloganText || "SIN TÍTULO"}
                              </h3>
                              <p className="font-mono text-[8px] text-zinc-400 mt-2 leading-tight">
                                {sloganSubText || "EDITE ESTE TEXTO EN LA SECCIÓN DE REBELDÍA."}
                              </p>
                            </>
                          )}

                          {layoutStyle === 'centered-block' && (
                            <div className="text-center w-full">
                              <span 
                                className="inline-block px-2.5 py-1 font-display font-black uppercase mb-1.5"
                                style={{ 
                                  fontSize: `${sloganSize * 0.75}px`,
                                  color: bgColor === '#16161C' || bgColor === '#050506' ? '#000000' : '#ffffff',
                                  backgroundColor: textColor
                                }}
                              >
                                {sloganText || "MODIFÍCAME"}
                              </span>
                              <p className="font-mono text-[7px] text-zinc-400 text-center uppercase tracking-normal max-w-[210px] mx-auto leading-normal">
                                {sloganSubText || "EL DISEÑO NATIVO DEFINIDO POR EL CAOS."}
                              </p>
                            </div>
                          )}

                          {layoutStyle === 'massive-title' && (
                            <div className="text-center w-full">
                              <h3 
                                className="font-display font-black leading-[0.8] tracking-widest uppercase mb-1"
                                style={{ 
                                  color: textColor,
                                  fontSize: `${sloganSize * 1.15}px`,
                                  textShadow: `0px 0px 8px ${textColor}80`
                                }}
                              >
                                {sloganText || "CAOS"}
                              </h3>
                              <p className="font-mono text-[7.5px] text-zinc-500 uppercase max-w-[200px] mx-auto leading-snug">
                                {sloganSubText}
                              </p>
                            </div>
                          )}

                          {layoutStyle === 'bottom-split' && (
                            <div className="border-t pt-2 mt-2" style={{ borderColor: `${textColor}40` }}>
                              <p className="font-mono text-[7.5px] text-zinc-400 uppercase tracking-wider mb-1 line-clamp-2">
                                {sloganSubText}
                              </p>
                              <h3 
                                className="font-display leading-none font-black uppercase"
                                style={{ 
                                  color: textColor,
                                  fontSize: `${sloganSize * 0.9}px`
                                }}
                              >
                                {sloganText}
                              </h3>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Technical visual elements bottom */}
                      <div className="z-10 flex justify-between items-end font-mono text-[8.5px] text-zinc-500 border-t border-zinc-900 pt-1.5 leading-none">
                        <span>ERR_LOG_V.01</span>
                        <span className="text-right" style={{ color: textColor }}>LAB_ESTÉTICO_CELL</span>
                      </div>

                    </div>
                  </div>

                  {/* Original comparison manual help text */}
                  <span className="text-[10px] text-zinc-600 font-mono mt-3.5 select-none text-center block">
                    * MANTÉN PULSADO "VER ANTES" PARA COMPARAR CON EL INICIO.
                  </span>

                </div>

                {/* COLUMN 2: TABBED EDITING ENGINE (7 Cols on PC, perfect inline tab block under canvas on mobile) */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* TACTILE TAB SELECTOR (Sleek buttons for smart mobile navigation) */}
                  <div className="flex border border-zinc-900 bg-zinc-950 p-1 rounded-xl">
                    <button
                      onClick={() => { setEditorControlTab('content'); playGlitchSound(120, 'sine', 0.05); }}
                      className={`flex-1 text-center py-2.5 px-0.5 rounded-lg text-[11px] font-mono font-bold tracking-tight transition-all uppercase ${editorControlTab === 'content' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      📝 Contenido
                    </button>
                    <button
                      onClick={() => { setEditorControlTab('colors'); playGlitchSound(140, 'sine', 0.05); }}
                      className={`flex-1 text-center py-2.5 px-0.5 rounded-lg text-[11px] font-mono font-bold tracking-tight transition-all uppercase ${editorControlTab === 'colors' ? 'bg-zinc-900 text-electric-blue' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      🎨 Diseño y Sello
                    </button>
                    <button
                      onClick={() => { setEditorControlTab('chaos'); playGlitchSound(160, 'sine', 0.05); }}
                      className={`flex-1 text-center py-2.5 px-0.5 rounded-lg text-[11px] font-mono font-bold tracking-tight transition-all uppercase ${editorControlTab === 'chaos' ? 'bg-zinc-900 text-neon-green' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      🎚️ Ajuste y Caos
                    </button>
                  </div>

                  {/* ACTIVE TAB ACTIONS CONTAINER */}
                  <div className="bg-zinc-950 border border-zinc-900/80 rounded-xl p-4 md:p-5 space-y-4 shadow-inner">
                    
                    {/* TAB A: CONTENT MODIFIERS */}
                    {editorControlTab === 'content' && (
                      <div className="space-y-4 animate-fadeIn">
                        
                        {/* Title input editable */}
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1 font-semibold flex justify-between">
                            <span>Slogan o Título Principal</span>
                            <span className="text-zinc-600">{sloganText.length} caracteres</span>
                          </label>
                          <input 
                            type="text" 
                            value={sloganText}
                            onChange={(e) => { setSloganText(e.target.value); onValueChangeTrack(); }}
                            maxLength={25}
                            className="w-full bg-zinc-900 hover:bg-zinc-900/80 border border-zinc-850 focus:border-neon-green rounded-lg px-3 py-2 text-xs font-mono text-white outline-none transition-colors"
                            placeholder="Ej: STAY WRONG"
                          />
                        </div>

                        {/* Subtitle textarea editable */}
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1 font-semibold">
                            Mensaje o Manifiesto Descriptivo
                          </label>
                          <textarea 
                            rows={2}
                            value={sloganSubText}
                            onChange={(e) => { setSloganSubText(e.target.value); onValueChangeTrack(); }}
                            maxLength={100}
                            className="w-full bg-zinc-900 hover:bg-zinc-900/80 border border-zinc-850 focus:border-neon-green rounded-lg px-3 py-2 text-xs font-sans text-stone-200 outline-none transition-colors resize-none leading-relaxed"
                            placeholder="Escribe tu manifiesto contra las reglas..."
                          />
                        </div>

                        {/* Logo selection template grid */}
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="block text-[10px] font-mono text-zinc-500 uppercase font-semibold">Imagen Base de la Muestra</span>
                            <span className="text-[9px] font-mono text-zinc-600">UPLOAD / SELECCIONAR</span>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2">
                            {sampleImages.map((imgUrl, i) => (
                              <button 
                                key={i}
                                onClick={() => { selectSample(imgUrl); onValueChangeTrack(); }}
                                className={`h-11 rounded-lg overflow-hidden relative transition-all border ${uploadedImage === imgUrl ? 'border-neon-green bg-neon-green/10 scale-95' : 'border-zinc-850 hover:border-zinc-700 bg-black'}`}
                              >
                                <img src={imgUrl} className="w-full h-full object-cover grayscale opacity-60 hover:opacity-100" />
                                <span className="absolute bottom-0.5 right-1 bg-black/90 text-[7px] text-zinc-500 px-1 rounded-sm">0{i+1}</span>
                              </button>
                            ))}
                            
                            {/* File custom selector */}
                            <div className="relative h-11 border border-dashed border-zinc-805 hover:border-zinc-600 rounded-lg flex flex-col justify-center items-center cursor-pointer bg-zinc-950/80 hover:bg-zinc-900 transition-colors">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <Upload className="w-3.5 h-3.5 text-zinc-400" />
                              <span className="text-[7px] text-zinc-500 font-mono tracking-tight uppercase mt-0.5">SUBIR</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* TAB B: DESIGN, COLORS AND STAMPS */}
                    {editorControlTab === 'colors' && (
                      <div className="space-y-4 animate-fadeIn">
                        
                        {/* Text Accent Color Selector */}
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2 font-semibold">
                            Color Primario del Texto y Sello
                          </label>
                          <div className="grid grid-cols-5 gap-1.5">
                            {[
                              { name: "Verde", hex: "#00FF66" },
                              { name: "Celeste", hex: "#00E5FF" },
                              { name: "Ácido", hex: "#DFFF00" },
                              { name: "Blanco", hex: "#FFFFFF" },
                              { name: "Magenta", hex: "#FF007F" }
                            ].map((c) => (
                              <button
                                key={c.hex}
                                onClick={() => { setTextColor(c.hex); onValueChangeTrack(); playGlitchSound(240, 'sine', 0.05); }}
                                className={`py-1.5 rounded-lg border text-[10px] font-mono font-bold tracking-tight transition-all flex flex-col items-center justify-center gap-1 ${textColor === c.hex ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-black/40 border-zinc-900 text-zinc-500 hover:text-zinc-300'}`}
                              >
                                <span className="w-3 h-3 rounded-full border border-black/35" style={{ backgroundColor: c.hex }} />
                                <span className="text-[8px]">{c.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Card Background Color Selector */}
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2 font-semibold">
                            Color del Lienzo Posterior
                          </label>
                          <div className="grid grid-cols-5 gap-1.5">
                            {[
                              { name: "Grafito", hex: "#16161C" },
                              { name: "Azul", hex: "#0A0D1A" },
                              { name: "Crimson", hex: "#1D0B0E" },
                              { name: "Oscuro", hex: "#050506" },
                              { name: "Musgo", hex: "#0A1D11" }
                            ].map((bgc) => (
                              <button
                                key={bgc.hex}
                                onClick={() => { setBgColor(bgc.hex); onValueChangeTrack(); playGlitchSound(200, 'sine', 0.05); }}
                                className={`py-1.5 rounded-lg border text-[10px] font-mono font-bold tracking-tight transition-all flex flex-col items-center justify-center gap-1 ${bgColor === bgc.hex ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-black/40 border-zinc-900 text-zinc-500 hover:text-zinc-300'}`}
                              >
                                <span className="w-3 h-3 rounded-md border border-white/10" style={{ backgroundColor: bgc.hex }} />
                                <span className="text-[8px]">{bgc.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Geometric shape stamp selector */}
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5 font-semibold">
                            Sello Vectorial de Fondo
                          </label>
                          <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-[9px]">
                            {[
                              { code: 'none', label: 'Limpio' },
                              { code: 'circle', label: 'Círculo' },
                              { code: 'triangle', label: 'Triángulo' },
                              { code: 'cross', label: 'Cruz X' },
                              { code: 'grid', label: 'Rejilla' }
                            ].map((shape) => (
                              <button
                                key={shape.code}
                                onClick={() => { setDecoShape(shape.code as any); onValueChangeTrack(); playGlitchSound(350, 'sine', 0.04); }}
                                className={`py-2 rounded-lg border uppercase transition-all ${decoShape === shape.code ? 'border-electric-blue text-electric-blue bg-electric-blue/5 font-bold' : 'border-zinc-900 text-zinc-500 hover:text-zinc-300 bg-black/25'}`}
                              >
                                {shape.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Layout alignment selectors */}
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5 font-semibold">
                            Alineación Tipográfica (Layout)
                          </label>
                          <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                            <button
                              onClick={() => { setLayoutStyle('brutalist-left'); onValueChangeTrack(); }}
                              className={`p-2 rounded-lg border text-left transition-all ${layoutStyle === 'brutalist-left' ? 'border-neon-green text-neon-green bg-neon-green/5 font-bold' : 'border-zinc-900 text-zinc-500 hover:text-zinc-300'}`}
                            >
                              ▎ Brutalista Siniestro
                            </button>
                            <button
                              onClick={() => { setLayoutStyle('centered-block'); onValueChangeTrack(); }}
                              className={`p-2 rounded-lg border text-left transition-all ${layoutStyle === 'centered-block' ? 'border-neon-green text-neon-green bg-neon-green/5 font-bold' : 'border-zinc-900 text-zinc-500 hover:text-zinc-300'}`}
                            >
                              ▰ Bloque de Contraste
                            </button>
                            <button
                              onClick={() => { setLayoutStyle('massive-title'); onValueChangeTrack(); }}
                              className={`p-2 rounded-lg border text-left transition-all ${layoutStyle === 'massive-title' ? 'border-neon-green text-neon-green bg-neon-green/5 font-bold' : 'border-zinc-900 text-zinc-500 hover:text-zinc-300'}`}
                            >
                              ✦ Glitch Expandido
                            </button>
                            <button
                              onClick={() => { setLayoutStyle('bottom-split'); onValueChangeTrack(); }}
                              className={`p-2 rounded-lg border text-left transition-all ${layoutStyle === 'bottom-split' ? 'border-neon-green text-neon-green bg-neon-green/5 font-bold' : 'border-zinc-900 text-zinc-500 hover:text-zinc-300'}`}
                            >
                              ▼ Ribete Posterior
                            </button>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* TAB C: DIMENSIONS, ZOOM AND THE GRADIENT DESTRUCTION */}
                    {editorControlTab === 'chaos' && (
                      <div className="space-y-4 animate-fadeIn">
                        
                        {/* Font size sliders */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-zinc-400">Tamaño de la Tipografía</span>
                            <span className="text-neon-green font-bold">{sloganSize}px</span>
                          </div>
                          <input 
                            type="range"
                            min="24"
                            max="68"
                            value={sloganSize}
                            onChange={(e) => { setSloganSize(Number(e.target.value)); onValueChangeTrack(); }}
                            className="w-full accent-neon-green bg-zinc-900"
                          />
                        </div>

                        {/* Internal graphic rotation slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-zinc-400">Giro Gráfico de Elementos</span>
                            <span className="text-white font-bold">{rotation}°</span>
                          </div>
                          <input 
                            type="range"
                            min="0"
                            max="360"
                            value={rotation}
                            onChange={(e) => { setRotation(Number(e.target.value)); onValueChangeTrack(); }}
                            className="w-full accent-white bg-zinc-900"
                          />
                        </div>

                        {/* Internal artwork zoom scale slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-zinc-400">Escalamiento (Zoom)</span>
                            <span className="text-white font-bold">{zoomScale}%</span>
                          </div>
                          <input 
                            type="range"
                            min="50"
                            max="150"
                            value={zoomScale}
                            onChange={(e) => { setZoomScale(Number(e.target.value)); onValueChangeTrack(); }}
                            className="w-full accent-white bg-zinc-900"
                          />
                        </div>

                        {/* Intensidad Caos slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-zinc-400">Distorsión de Filtro</span>
                            <span className="text-digital-magenta font-bold">{chaosIntensity}%</span>
                          </div>
                          <input 
                            type="range"
                            min="1"
                            max="100"
                            value={chaosIntensity}
                            onChange={(e) => { setChaosIntensity(Number(e.target.value)); onValueChangeTrack(); }}
                            className="w-full accent-digital-magenta bg-zinc-900"
                          />
                        </div>

                        {/* Mutacion de color slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-zinc-400">Mutación Cromática</span>
                            <span className="text-[#00FF66] font-bold">{colorDistortion}%</span>
                          </div>
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            value={colorDistortion}
                            onChange={(e) => { setColorDistortion(Number(e.target.value)); onValueChangeTrack(); }}
                            className="w-full accent-neon-green bg-zinc-900"
                          />
                        </div>

                      </div>
                    )}

                  </div>

                  {/* BOTTOM ACTION TRIGGERS (Download / Randomize Vandalize / Reset details) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3.5 border-t border-zinc-900">
                    <button 
                      onClick={handleApplyVandalizeRandom}
                      className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-neon-green font-mono text-[11px] font-semibold py-3 px-1 rounded-xl transition-all uppercase tracking-wide cursor-pointer text-center"
                    >
                      🎲 Inyección Azar
                    </button>
                    <button 
                      onClick={() => {
                        setSloganText("STAY WRONG");
                        setSloganSubText("EL SECUESTRO DEL ORDEN CORPORATIVO DE MANOS DE UNA MENTE CREATIVA EN BLOQUEO.");
                        setTextColor("#00FF66");
                        setBgColor("#16161C");
                        setDecoShape('none');
                        setLayoutStyle('brutalist-left');
                        setSloganSize(45);
                        playGlitchSound(120, 'sine', 0.2);
                      }}
                      className="bg-black hover:bg-zinc-950 border border-zinc-850 text-zinc-500 hover:text-white font-mono text-[11px] font-semibold py-3 px-1 rounded-xl transition-all uppercase tracking-wide cursor-pointer text-center"
                    >
                      ↩ Revertir Textos
                    </button>
                    <button 
                      onClick={triggerDownload}
                      className="bg-neon-green text-black hover:bg-white hover:scale-[1.02] font-display font-bold py-3 text-xs rounded-xl text-center uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> COMPILAR / GUARDAR
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* SCREEN VIEW 2: AI CONCEPT GENERATOR */}
          {activeTab === 'generator' && (
            <div className="flex-1 flex flex-col p-4 md:p-8 justify-between">
              
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-electric-blue" />
                  <h3 className="text-lg font-display font-bold tracking-tight text-white uppercase">
                    GENER_ADOR INTELIGENTE DE CONCEPTOS REBELDES
                  </h3>
                </div>
                
                <p className="text-xs text-zinc-400 font-mono mb-6 border-l border-zinc-800 pl-3">
                  Inyectamos ruidos y contradicciones estéticas en la red neuronal de Gemini para formular enfoques disruptivos que destrocen tus bloqueos comerciales.
                </p>

                {/* Form selectors */}
                <div className="space-y-4 bg-zinc-950 p-4 border border-zinc-800 rounded-none">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">
                        TIPO DE PROYECTO BLOQUEADO
                      </label>
                      <select 
                        value={blockType} 
                        onChange={(e) => setBlockType(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 font-mono text-xs text-white p-2.5 uppercase outline-none focus:border-electric-blue"
                      >
                        <option value="cartel festival">Poster / Afiche Radical</option>
                        <option value="logotipo corporativo">Proyecto de Identidad Visual</option>
                        <option value="ilustracion indie">Ilustración / Portada de Fanzine</option>
                        <option value="campaña tipografica">Composición Tipográfica Libre</option>
                        <option value="sitio web experimental">Interfaz Web Extrema</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">
                        VIBRA / DETALLE ADICIONAL
                      </label>
                      <input 
                        type="text"
                        value={conceptDetails}
                        onChange={(e) => setConceptDetails(e.target.value)}
                        placeholder="ej: rave de los 90, nostalgia analógica"
                        className="w-full bg-zinc-900 border border-zinc-700 font-mono text-xs text-white p-2.5 outline-none focus:border-electric-blue"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={generateConceptAI}
                    disabled={isGeneratingConcept}
                    className="w-full bg-electric-blue text-black font-display font-bold py-3 text-xs uppercase tracking-widest hover:bg-neon-green transition-colors disabled:opacity-40"
                  >
                    {isGeneratingConcept ? "🧠 FORMULANDO ERROR CREATIVO..." : "GENERAR CONCEPTO DISRUPTOR"}
                  </button>
                </div>

                {/* Active formulation output */}
                {currentConcept && (
                  <div className="mt-6 bg-zinc-900 border-2 border-[#24242D] p-5 relative">
                    {currentConcept.simulated && (
                      <span className="absolute top-2 right-2 bg-raw-red text-white text-[8px] font-mono px-1.5 uppercase">
                        MODO SIMULADO
                      </span>
                    )}
                    
                    <span className="text-[9px] font-mono text-digital-magenta mb-1 block">CONCEPTO RECOMENDADO</span>
                    <h4 className="text-xl font-display font-bold text-[#faf9f6] tracking-tight">{currentConcept.title}</h4>
                    <p className="text-xs text-zinc-300 mt-2 italic leading-relaxed">
                      "{currentConcept.concept}"
                    </p>

                    {/* Extreme Limitations */}
                    <div className="mt-4 space-y-2">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">LIMITACIONES ARTÍSTICAS IMPUESTAS:</span>
                      <ul className="text-xs space-y-1 font-mono text-neon-green">
                        {currentConcept.limitations?.map((limit: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="text-raw-red">●</span> {limit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Color Palette recommendation */}
                    <div className="mt-4">
                      <span className="text-[9px] font-mono text-zinc-500 block mb-1.5 uppercase">PALETA DE COLORES PROPUESTA:</span>
                      <div className="flex gap-2">
                        {currentConcept.palette?.map((hex: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-1 bg-black p-1 border border-zinc-800 rounded">
                            <span className="w-3.5 h-3.5 block border border-zinc-700" style={{ backgroundColor: hex }} />
                            <span className="text-[9px] font-mono text-zinc-400 uppercase">{hex}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Compos composition guide */}
                    <div className="mt-4 border-t border-zinc-800 pt-3 text-xs text-zinc-400">
                      <strong className="block text-[9px] text-zinc-500 font-mono uppercase mb-1">COMPOSICIÓN REBELDE:</strong>
                      {currentConcept.composition}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => {
                          setUploadedImage(sampleImages[0]);
                          setChaosIntensity(85);
                          setColorDistortion(60);
                          setActiveTab('editor');
                          playGlitchSound(220, 'square', 0.15);
                        }}
                        className="bg-white text-black px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider hover:bg-neon-green"
                      >
                        Aplicar esta vibra al editor
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* STYLE COLLIDER ZONE / MEZCLADOR */}
              <div className="mt-8 border-t border-zinc-800 pt-8">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-5 h-5 text-digital-magenta" />
                  <h3 className="text-lg font-display font-bold tracking-tight text-white uppercase">
                    COLISIONADOR Y MEZCLADOR DE ESTILOS INCOMPATIBLES
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">MOVIMIENTO A (ORDENADO)</label>
                    <select 
                      value={styleA} 
                      onChange={(e) => setStyleA(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 font-mono text-xs text-white p-2 outline-none focus:border-digital-magenta"
                    >
                      <option value="Bauhaus">Bauhaus</option>
                      <option value="Diseño Suizo">Helvético Suizo</option>
                      <option value="Minimalismo">Minimalismo Puro</option>
                      <option value="Estructuras Art Deco">Art Deco</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">MOVIMIENTO B (CAÓTICO)</label>
                    <select 
                      value={styleB} 
                      onChange={(e) => setStyleB(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 font-mono text-xs text-white p-2 outline-none focus:border-digital-magenta"
                    >
                      <option value="Cyberpunk">Cyberpunk</option>
                      <option value="Punk Fanzine 70s">Estilo Punk Fanzine</option>
                      <option value="Arte Rave 90s">Estética Rave Y2K</option>
                      <option value="Dadaismo">Dadaismo Absurdo</option>
                      <option value="Brutalismo">Brutalismo Digital</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={mixStylesAI}
                  disabled={isMixingStyles}
                  className="w-full bg-zinc-900 border-2 border-digital-magenta text-[#FF007F] hover:bg-digital-magenta hover:text-black transition-colors font-mono font-bold text-xs py-3 tracking-widest uppercase"
                >
                  {isMixingStyles ? "🌪️ FUSIONANDO FILOSOFÍAS ARTÍSTICAS..." : "COLISIONAR MOVIMIENTOS ARTÍSTICOS"}
                </button>

                {styleMixResult && (
                  <div className="mt-4 bg-black/60 p-4 border border-digital-magenta text-xs space-y-3 font-mono">
                    <div className="flex justify-between items-center text-[10px] text-zinc-500">
                      <span>MIX_ENGINE ACTIVE</span>
                      <span className="text-digital-magenta font-bold">ESTILO HÍBRIDO</span>
                    </div>

                    <h5 className="text-sm font-bold text-neon-green uppercase">{styleMixResult.hybridName}</h5>
                    <p className="text-zinc-300 italic">"{styleMixResult.philosophy}"</p>
                    
                    <div>
                      <strong className="text-electric-blue text-[10px] block">REGLA TIPOGRÁFICA EXTREMA:</strong>
                      <span className="text-zinc-400">{styleMixResult.typographicRules}</span>
                    </div>

                    <div className="bg-zinc-950 p-2.5 border border-zinc-900 text-zinc-400 text-[11px]">
                      <strong className="text-acid-yellow block mb-1">PROMPT DE CONCRECIÓN GRÁFICA:</strong>
                      {styleMixResult.posterPrompt}
                    </div>

                    <div className="space-y-1">
                      <strong className="text-zinc-500 block text-[10px]">DIRECTRICES VISUALES:</strong>
                      {styleMixResult.visualDirectives?.map((dir: string, i: number) => (
                        <div key={i} className="flex gap-2 text-[11px] text-zinc-300">
                          <span className="text-digital-magenta">#</span>
                          <span>{dir}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* SCREEN VIEW 3: EXTREME LIMITATION CHALLENGES */}
          {activeTab === 'challenges' && (
            <div className="flex-1 flex flex-col p-4 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-acid-yellow" />
                <h3 className="text-lg font-display font-bold tracking-tight text-white uppercase">
                  MODO “LIMITACIÓN EXTREMA” - CAMPAÑAS RADICALES
                </h3>
              </div>

              <p className="text-xs text-zinc-400 font-mono mb-6 border-l border-acid-yellow pl-3">
                Para romper un bloqueo no necesitas más herramientas, necesitas **menos**. 
                Elige un reto de contención artística extrema; completa la tarea antes de que expire el detector y adquiere puntos de liberación visual.
              </p>

              {/* Challenges grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.map((chal, i) => (
                  <div 
                    key={chal.id}
                    className="bg-zinc-900 focus-within:ring-2 border border-zinc-800 p-5 rounded-none flex flex-col justify-between group hover:border-[#FF007F] transition-colors"
                  >
                    <div>
                      <div className="flex justify-between items-start text-xs font-mono mb-2">
                        <span className={`px-2 py-0.5 text-[9px] font-bold ${
                          chal.difficulty === 'EASY' ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' :
                          chal.difficulty === 'MEDIUM' ? 'bg-electric-blue/10 text-electric-blue border border-electric-blue/30' :
                          chal.difficulty === 'HARD' ? 'bg-digital-magenta/10 text-digital-magenta border border-digital-magenta/30' :
                          'bg-raw-red/10 text-raw-red border border-raw-red/30'
                        }`}>
                          {chal.difficulty} // Nivel {i+1}
                        </span>
                        <span className="text-acid-yellow font-bold">+{chal.points} XP</span>
                      </div>

                      <h4 className="text-base font-display font-bold text-white mb-2 tracking-tight group-hover:text-neon-green">
                        {chal.title}
                      </h4>

                      <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                        {chal.description}
                      </p>

                      <div className="space-y-1 font-mono text-[10px] text-zinc-500 mb-4 bg-zinc-950 p-2 border border-zinc-900">
                        <span className="block text-zinc-600 font-bold">RESTRICCIONES FÍSICAS:</span>
                        {chal.constraints.map((c, idx) => (
                          <div key={idx} className="flex gap-1">
                            <span>🚫</span>
                            <span className="text-zinc-300">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => startChallenge(chal)}
                      disabled={activeChallenge?.id === chal.id}
                      className="w-full bg-[#050506] border border-zinc-700 hover:border-acid-yellow hover:text-black hover:bg-acid-yellow transition-all font-mono text-xs py-2 uppercase tracking-wider"
                    >
                      {activeChallenge?.id === chal.id ? "RETO EN CURSO ⏳" : "INICIAR LIMITACIÓN ACTIVA"}
                    </button>
                  </div>
                ))}
              </div>

              {/* Achievement display to motivate user */}
              <div className="mt-8 border-t border-zinc-800 pt-6">
                <span className="text-[10px] text-zinc-500 font-mono block mb-3 uppercase tracking-wider">
                  LOGROS DESBLOQUEABLES CONTRA EL PERFECCIONISMO
                </span>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {profile.achievements.map(ach => (
                    <div 
                      key={ach.id}
                      className={`p-3 border font-mono text-xs text-center flex flex-col justify-between items-center relative ${
                        ach.unlocked ? 'border-neon-green bg-neon-green/5' : 'border-zinc-800 bg-black/40 text-zinc-600'
                      }`}
                    >
                      <span className="text-3xl mb-1 filter drop-shadow-sm">{ach.badgeCode}</span>
                      <strong className="text-[10px] block font-bold text-white tracking-widest">{ach.title}</strong>
                      <span className="text-[9px] text-zinc-500 block mt-1 leading-snug">{ach.description}</span>
                      {ach.unlocked && (
                        <div className="absolute top-1 right-1 text-[8px] text-neon-green font-bold flex bg-black px-1">✓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* SCREEN VIEW 4: ERROR BIBLIOTECA - INTERACTIVE GALLERY */}
          {activeTab === 'library' && (
            <div className="flex-1 flex flex-col p-4 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-digital-magenta" />
                <h3 className="text-lg font-display font-bold tracking-tight text-white uppercase">
                  BIBLIOTECA INTERACTIVA DEL ERROR ESTÉTICO
                </h3>
              </div>

              <p className="text-xs text-zinc-400 font-mono mb-6 border-l border-digital-magenta pl-3">
                Una antología de lo visualmente 'incorrecto'. Aprende de los descalabros tipográficos, errores famosos de Xerox, e impresiones suizas corridas que se convirtieron en obras de arte de culto.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {libraryItems.map(item => (
                  <div key={item.id} className="bg-zinc-950 border border-zinc-800/80 rounded-none overflow-hidden hover:border-neon-green transition-colors">
                    <div className="h-44 relative bg-black flex items-center justify-center overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover grayscale contrast-125 opacity-70 hover:opacity-100 transition-opacity"
                      />
                      <span className="absolute bottom-2 left-2 bg-black/90 font-mono text-[9px] text-neon-green border border-zinc-800 px-2 py-0.5">
                        {item.errorType}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-center font-mono text-[10px] text-zinc-500">
                        <span>Fórmula analógica // {item.year}</span>
                        <span>REGISTRADO: {item.creator}</span>
                      </div>

                      <h4 className="text-base font-display font-bold text-white uppercase tracking-tight">
                        {item.title}
                      </h4>

                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        {item.description}
                      </p>

                      <div className="flex justify-between items-center pt-3 border-t border-zinc-900 font-mono text-[10px] text-zinc-500">
                        <button 
                          onClick={() => {
                            setLibraryItems(prev => prev.map(i => i.id === item.id ? { ...i, likes: i.likes + 1 } : i));
                            playGlitchSound(550, 'triangle', 0.1);
                          }}
                          className="flex items-center gap-1.5 text-zinc-400 hover:text-digital-magenta"
                        >
                          <Heart className="w-3.5 h-3.5 text-[#FF007F] fill-[#FF007F] animate-pulse" />
                          <span>PROPAGAR REBELDÍA ({item.likes})</span>
                        </button>
                        <button 
                          onClick={() => {
                            setUploadedImage(item.imageUrl);
                            setActiveTab('editor');
                            playGlitchSound(400, 'square', 0.12);
                            showToast("⚡ ¡OBRA DE LA BIBLIOTECA CARGADA EN EL EDITOR! Ahora puedes vandalizarla y distorsionarla sobre sus propios errores.", "success");
                          }}
                          className="text-white hover:text-neon-green font-bold underline"
                        >
                          Usar como base
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN VIEW 5: COMUNIDAD */}
          {activeTab === 'community' && (
            <div className="flex-1 flex flex-col p-4 md:p-8">
              
              <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-white" />
                    <h3 className="text-lg font-display font-bold tracking-tight text-white uppercase">
                      COMUNIDAD DE VANDALISMO VISUAL
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono">
                    La resistencia creativa. Comparte tus desastres gráficos y opina sobre el caos ajeno.
                  </p>
                </div>

                <div className="bg-[#0f0f13] hover:border-neon-green p-3 border border-zinc-800 text-[11px] font-mono max-w-sm">
                  <strong className="text-digital-magenta block uppercase tracking-wider mb-1">¿CÓMO FIGURAR AQUÍ?</strong>
                  Crea tu distorsión en el <span className="text-white font-bold underline cursor-pointer" onClick={() => setActiveTab('editor')}>Editor</span> y pulsa "Publicar en Comunidad".
                </div>
              </div>

              {/* Publish current canvas inside community block */}
              <div className="bg-zinc-900/60 p-4 border border-dashed border-zinc-800 mb-8 rounded-none">
                <h4 className="text-xs font-mono text-zinc-300 font-bold mb-3 uppercase">
                  [PUBLICAR TU DISTORSIÓN DEL CANVAS ACTUAL EN FEED]
                </h4>
                <form onSubmit={publishToCommunity} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text"
                      placeholder="Título llamativo o manifiesto (ej: SINFONÍA DE LA COPIADORA)"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      className="bg-black border border-zinc-700 outline-none text-xs p-2.5 font-mono text-white focus:border-neon-green uppercase"
                    />
                    <input 
                      type="text"
                      placeholder="Tags separados por comas (ej: Y2K, Brutal, Collapsed)"
                      value={newPostTags}
                      onChange={(e) => setNewPostTags(e.target.value)}
                      className="bg-black border border-zinc-700 outline-none text-xs p-2.5 font-mono text-white focus:border-neon-green uppercase"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">
                      Voz remitente: <strong className="text-neon-green">@{userTag}</strong> (Lvl {profile.level})
                    </span>
                    <button 
                      type="submit"
                      className="bg-white text-black hover:bg-neon-green hover:text-black px-4 py-2 text-xs font-bold font-display uppercase tracking-wider"
                    >
                      Pulsar Lanzar Arte Roto
                    </button>
                  </div>
                </form>
              </div>

              {/* Feed Grid */}
              <div className="space-y-8">
                {communityPosts.map(post => (
                  <div key={post.id} className="border border-zinc-800 bg-[#07070a] p-4 md:p-6 flex flex-col md:flex-row gap-6">
                    {/* Visual representation */}
                    <div className="w-full md:w-[260px] aspect-[3/4] bg-zinc-950 flex items-center justify-center relative overflow-hidden shrink-0 border border-zinc-800/80">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover mix-blend-screen grayscale" />
                      <div className="absolute top-2 left-2 bg-black font-mono text-[8px] text-zinc-400 border border-zinc-850 px-1 py-0.5">
                        RENDER LOG_V.{post.id.slice(-3)}
                      </div>
                    </div>

                    {/* Content metadata */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Creator header */}
                        <div className="flex items-center justify-between border-b border-zinc-850 pb-3 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-digital-magenta/20 border border-digital-magenta flex items-center justify-center font-mono text-xs text-white">
                              {post.user.username[0].toUpperCase()}
                            </div>
                            <div>
                              <span className="text-xs font-mono font-bold text-white block">@{post.user.username}</span>
                              <span className="text-[9px] font-mono text-zinc-500 block">CREADOR DEL CAOS // LEVEL {post.user.level}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-600">{post.createdAt}</span>
                        </div>

                        {/* Title & tags */}
                        <h4 className="text-lg font-display font-black text-white tracking-tight uppercase">
                          {post.title}
                        </h4>
                        
                        <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
                          {post.tags.map(t => (
                            <span key={t} className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 hover:text-neon-green cursor-pointer">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Engagement */}
                      <div className="space-y-4">
                        {/* Interactive reaction buttons */}
                        <div className="flex items-center gap-6 text-xs font-mono pt-3 border-t border-zinc-900 select-none">
                          <button 
                            onClick={() => handleLikePost(post.id)}
                            className={`flex items-center gap-1.5 hover:text-white ${post.likedByUser ? 'text-digital-magenta' : 'text-zinc-500'}`}
                          >
                            <Heart className={`w-4 h-4 ${post.likedByUser ? 'fill-digital-magenta text-digital-magenta' : 'text-zinc-500'}`} />
                            <span>REACCIONAR ({post.likes})</span>
                          </button>
                          <span className="text-zinc-500 flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4 text-zinc-500" />
                            <span>COMENTARIOS ({post.comments.length})</span>
                          </span>
                        </div>

                        {/* Comments loop */}
                        <div className="space-y-2 max-h-32 overflow-y-auto bg-black/40 p-2 border border-zinc-900 rounded text-xs select-none">
                          {post.comments.map(c => (
                            <div key={c.id} className="text-zinc-300 font-mono">
                              <span className="text-zinc-500 font-bold">@{c.user}: </span>
                              <span>{c.text}</span>
                              <span className="text-[9px] text-zinc-600 ml-2">({c.time})</span>
                            </div>
                          ))}
                          {post.comments.length === 0 && (
                            <span className="text-zinc-600 block">No hay comentarios en este desvío artístico. Añade uno abajo.</span>
                          )}
                        </div>

                        {/* Fast comments input */}
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="Añadir réplica o crítica punk..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddComment(post.id, (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = "";
                              }
                            }}
                            className="bg-black border border-zinc-800 text-xs text-white p-2.5 font-mono w-full outline-none pr-10 focus:border-neon-green"
                          />
                          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white font-mono text-xs">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* SCREEN VIEW 6: SETTINGS / AJUSTES */}
          {activeTab === 'settings' && (
            <div className="flex-1 flex flex-col p-4 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Settings2 className="w-5 h-5 text-zinc-400" />
                <h3 className="text-lg font-display font-bold tracking-tight text-white uppercase">
                  DASHBOARD TECNOLÓGICO Y CONFIGURACIÓN CRÍTICA
                </h3>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
                <div>
                  <h4 className="font-mono text-xs font-bold text-neon-green uppercase mb-2">
                    [1] INTEGRIDAD DE SEGURIDAD DIGITAL
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setCrtFilter(!crtFilter)}
                      className={`font-mono text-xs py-2 px-3 border uppercase text-left flex items-center justify-between ${
                        crtFilter ? 'border-neon-green text-neon-green bg-neon-green/5' : 'border-zinc-850 text-zinc-500'
                      }`}
                    >
                      <span>Filtro de Barrido CRT</span>
                      <span>[{crtFilter ? "ON" : "OFF"}]</span>
                    </button>

                    <button 
                      onClick={() => setPixelSorting(!pixelSorting)}
                      className={`font-mono text-xs py-2 px-3 border uppercase text-left flex items-center justify-between ${
                        pixelSorting ? 'border-neon-green text-neon-green bg-neon-green/5' : 'border-zinc-850 text-zinc-500'
                      }`}
                    >
                      <span>Simulador Pixel Sorting</span>
                      <span>[{pixelSorting ? "ON" : "OFF"}]</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-xs font-bold text-electric-blue uppercase mb-2">
                    [2] RESUMEN DE COMPENSACIÓN CREATIVA
                  </h4>
                  <div className="bg-black p-4 space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Firmas y Serie:</span>
                      <span className="text-white">#{userTag}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Puntos de Liberación visual:</span>
                      <span className="text-acid-yellow font-bold">{profile.points} PTS</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">XP Global del Artista:</span>
                      <span className="text-white">{profile.xp} / 1000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Retos superados:</span>
                      <span className="text-neon-green font-bold">{profile.completedChallengesCount} completados</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-xs font-bold text-digital-magenta uppercase mb-2">
                    [3] VANDALIZAR CUENTA / RESET
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-mono mb-3 uppercase">
                    ¿Quieres reiniciar tus estadísticas contra el sistema corporativo y recomenzar el laboratorio?
                  </p>
                  <button 
                    onClick={() => {
                      if (confirm("¿Estás seguro de destruir tu progreso y estadísticas?")) {
                        setUserTag(null);
                        setProfile({
                          username: "",
                          level: 1,
                          xp: 0,
                          maxXp: 1000,
                          points: 0,
                          completedChallengesCount: 0,
                          achievements: INITIAL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }))
                        });
                        playSirenDestroySound();
                      }
                    }}
                    className="bg-[#FF003C] hover:bg-neutral-900 border border-[#FF003C] hover:text-white text-white font-mono font-bold text-xs py-2 px-4 uppercase tracking-wider transition-colors"
                  >
                    Vandalizar Mi Progreso
                  </button>
                </div>
              </div>
            </div>
          )}

        </section>

        {/* ────────────────────────────────────────────────────────────────
            SIDEBAR ACTIONS & SLIDERS (Based on design card definitions)
            ──────────────────────────────────────────────────────────────── */}
        <aside className="hidden lg:flex lg:flex-col lg:w-80 p-4 md:p-8 gap-6 bg-[#080809] border-r border-[#24242D]">
          
          {/* Card: Live Info block */}
          {activeTab === 'editor' && (
            <div className="card bg-zinc-950 p-5 border border-zinc-800 flex flex-col gap-5 relative">
              <span className="card-label absolute top-[-10px] left-3 bg-[#050505] px-2 text-[10px] font-mono font-bold text-digital-magenta tracking-widest uppercase">
                CONTROLES DE CAOS_OR
              </span>

              {/* Sliders in card */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Intensidad del Caos</span>
                    <span className="text-neon-green">{chaosIntensity}%</span>
                  </div>
                  <input 
                    type="range"
                    min="1"
                    max="100"
                    value={chaosIntensity}
                    onChange={(e) => { setChaosIntensity(Number(e.target.value)); onValueChangeTrack(); }}
                    className="w-full accent-neon-green bg-[#16161C]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Deformación de Color</span>
                    <span className="text-[#FF007F]">{colorDistortion}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={colorDistortion}
                    onChange={(e) => { setColorDistortion(Number(e.target.value)); onValueChangeTrack(); }}
                    className="w-full accent-digital-magenta bg-[#16161C]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Escala de Imagen</span>
                    <span className="text-zinc-200">{zoomScale}%</span>
                  </div>
                  <input 
                    type="range"
                    min="50"
                    max="200"
                    value={zoomScale}
                    onChange={(e) => { setZoomScale(Number(e.target.value)); onValueChangeTrack(); }}
                    className="w-full accent-white bg-[#16161C]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Rotación Gráfica</span>
                    <span className="text-zinc-200">{rotation}°</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="360"
                    value={rotation}
                    onChange={(e) => { setRotation(Number(e.target.value)); onValueChangeTrack(); }}
                    className="w-full accent-white bg-[#16161C]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quick AI Suggestions widget inside sidebar */}
          <div className="card bg-zinc-950 p-5 border border-zinc-800 relative">
            <span className="card-label absolute top-[-10px] left-3 bg-[#050505] px-2 text-[10px] font-mono font-bold text-electric-blue tracking-widest uppercase">
              SUGERENCIA DEL SISTEMA
            </span>
            <div className="space-y-3 pt-2">
              <strong className="text-xs font-display font-[800] text-white block uppercase leading-snug">
                TU DISEÑO YA INTEGRADO FUNCIONA. <br />
                AHORA DESTRUYELO SIN MIEDO.
              </strong>
              <p className="text-[11px] font-mono text-zinc-400 leading-normal">
                Someter tu mente a limitaciones y errores controlados reconstruye las vías sinápticas que te devuelven la originalidad perdida.
              </p>
            </div>
          </div>

          {/* Active alerts for perfectionist monitor */}
          {antiPerfectionistAttack && (
            <div className="bg-raw-red text-white p-4 border border-[#FF003C] animate-pulse space-y-2 relative">
              <button 
                onClick={() => setAntiPerfectionistAttack(null)}
                className="absolute top-1 right-2 text-white font-mono text-xs font-bold"
              >
                ✕
              </button>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                <AlertTriangle className="w-4 h-4 fill-white text-raw-red" />
                <span>ALTA CRÍTICA REBELDE</span>
              </div>
              <p className="text-[11px] font-semibold italic">
                "{antiPerfectionistAttack.snarkyRemark}"
              </p>
              <div className="bg-black/90 p-2 border border-zinc-800 font-mono text-[10px] text-neon-green">
                <strong>ACCIÓN OBLIGADA:</strong> <br />
                {antiPerfectionistAttack.destructionDirective}
              </div>
            </div>
          )}

          {/* Active Level Progress widget inside sidebar */}
          <div className="card bg-zinc-950 p-5 border border-zinc-800 relative mt-auto">
            <span className="card-label absolute top-[-10px] left-3 bg-[#050505] px-2 text-[10px] font-mono font-bold text-acid-yellow tracking-widest uppercase">
              PROGRESO EN RESISTENCIA
            </span>
            <div className="space-y-3 pt-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">NIVEL ACTÚAL</span>
                <span className="text-[#00FF55] font-bold">LVL {profile.level}</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-none relative overflow-hidden">
                <div className="bg-neon-green h-full" style={{ width: `${(profile.xp / profile.maxXp) * 100}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>XP: {profile.xp} / {profile.maxXp}</span>
                <span>PTS: +{profile.points}</span>
              </div>
            </div>
          </div>

        </aside>

        {/* RIGHT VERTICAL RAIL (Displayed on large viewports) */}
        <aside className="hidden lg:flex flex-col items-center justify-around border-l border-[#24242D] bg-[#080809] py-8 w-[60px] h-full">
          <div className="vertical-text select-none text-[9px] font-mono tracking-[5px] text-zinc-600 uppercase whitespace-nowrap">
            SYSTEM_OVERRIDE_ACTIVE_LAB_2026
          </div>
          <div className="h-20 w-[1px] bg-zinc-800" />
          <div className="vertical-text select-none text-[9px] font-mono tracking-[4px] text-zinc-400 uppercase whitespace-nowrap">
            ERROR_IS_SINCERE_BEAUTY
          </div>
          <div className="space-y-4">
            <span className="inline-block w-2.5 h-2.5 bg-neon-green rounded-full shadow-[0_0_8px_#00FF66]" />
          </div>
        </aside>

      </div>

      {/* ────────────────────────────────────────────────────────────────
          FOOTER / STATUS BAR (Based on Design template specs)
          ──────────────────────────────────────────────────────────────── */}
      <footer className="h-[40px] border-t border-[#24242D] bg-[#050505] flex items-center justify-between px-4 md:px-10 font-mono text-[9px] md:text-[10px] text-zinc-500 z-20">
        
        <div className="flex items-center gap-2">
          <span>STATUS:</span>
          <span className="text-neon-green font-bold flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-neon-green rounded-full animate-ping" />
            VANDAL_MODE_ON
          </span>
          <span className="ml-4 hidden md:inline">USER:</span>
          <span className="text-white hidden md:inline">@{userTag}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:inline">
            <span>MEM_CACHE:</span>
            <span className="text-white ml-1">{memUse} / 8192KB</span>
          </div>

          <div>
            <span>TIEMPO LAB:</span>
            <span className="text-white ml-1">{timeElapsed}</span>
          </div>

          <div className="hidden lg:inline text-right">
            <span>COORDS: 40.7128 N, 74.0060 W</span>
          </div>
        </div>

      </footer>

      {/* ────────────────────────────────────────────────────────────────
          CUSTOM POPUP NOTIFICATION (Toast - avoids sandbox iframe action blocks)
          ──────────────────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-55 max-w-sm w-[90%] sm:w-full bg-zinc-950 border border-dashed p-4 font-mono shadow-[6px_6px_0px_#000000] animate-fadeIn pointer-events-auto"
          style={{ 
            borderColor: toastType === 'success' ? '#00FF66' : toastType === 'warning' ? '#DFFF00' : toastType === 'error' ? '#FF007F' : '#00E5FF',
            boxShadow: `4px 4px 0px ${toastType === 'success' ? '#00FF66' : toastType === 'warning' ? '#DFFF00' : toastType === 'error' ? '#FF007F' : '#00E5FF'}`
          }}
        >
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1">
              <span className="text-[9px] text-zinc-500 font-mono tracking-widest block uppercase mb-1">
                💬 NOTIFICACIÓN_DE_SISTEMA [INFO]
              </span>
              <p className="text-xs text-white uppercase leading-normal font-bold">
                {toastMessage}
              </p>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-800 text-[10px] cursor-pointer"
            >
              [X]
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
