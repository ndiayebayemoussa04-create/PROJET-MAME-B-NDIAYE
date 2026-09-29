import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Radio, 
  Sparkles, 
  Bot, 
  User, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  CornerDownLeft, 
  RotateCcw,
  Zap,
  Layers,
  ShieldCheck,
  Send,
  Headphones
} from 'lucide-react';
import { LiveAudioService } from '../services/liveAudioService';
import { useLanguage } from '../context/LanguageContext';

export const VoiceConversationView: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [isModelSpeaking, setIsModelSpeaking] = useState<boolean>(false);
  const [transcriptStream, setTranscriptStream] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<string>('Zephyr');
  const [textInput, setTextInput] = useState<string>('');
  const [isProcessingText, setIsProcessingText] = useState<boolean>(false);

  const getInitialGreeting = (lang: string) => {
    switch (lang) {
      case 'wo':
        return "Naka nga def ! Man la NEXOMIA ci jumtukaayu gemini-3.8-live. Takkal sa mikrofon ngir wax ci Wolof ci wàllu sacc kàrt, jaay ak delloo bagas mbaa 13 wàll yi.";
      case 'en':
        return "Hello! I am NEXOMIA live with the gemini-3.8-live model. Turn on your microphone to talk in real-time in English about fraud detection, inventory, or any of the 13 sectors.";
      case 'es':
        return "¡Hola! Soy NEXOMIA en vivo con el modelo gemini-3.8-live. Activa tu micrófono para conversar en tiempo real en español sobre detección de fraude, stock o los 13 sectores.";
      case 'ar':
        return "مرحباً بك! أنا نيكسوميا مباشرة عبر نموذج gemini-3.8-live. شغّل الميكروفون للتحدث فوراً باللغة العربية حول كشف الاحتيال، المخزون، أو القطاعات الـ 13.";
      default:
        return "Bonjour ! Je suis NEXOMIA en direct avec le modèle gemini-3.8-live. Activez votre microphone pour converser vocalement en temps réel.";
    }
  };

  // Conversation history
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'model'; text: string; time: string }>>([
    {
      sender: 'model',
      text: getInitialGreeting(language),
      time: 'Maintenant'
    }
  ]);

  const liveServiceRef = useRef<LiveAudioService | null>(null);

  // Update initial message when language changes if only 1 message
  useEffect(() => {
    setMessages(prev => {
      if (prev.length <= 1) {
        return [{
          sender: 'model',
          text: getInitialGreeting(language),
          time: 'Maintenant'
        }];
      }
      return prev;
    });
  }, [language]);

  useEffect(() => {
    liveServiceRef.current = new LiveAudioService({
      onStatusChange: (status) => {
        setConnectionStatus(status);
        if (status === 'connected') {
          setErrorMessage(null);
        }
      },
      onTranscript: (text) => {
        setTranscriptStream((prev) => prev + text);
      },
      onError: (err) => {
        setErrorMessage(err);
      },
      onVolumeChange: (vol) => {
        setMicVolume(vol);
      },
      onModelSpeakingChange: (speaking) => {
        setIsModelSpeaking(speaking);
      },
    });

    return () => {
      if (liveServiceRef.current) {
        liveServiceRef.current.disconnect();
      }
    };
  }, []);

  // When model stops speaking and there's a transcript chunk, append to messages
  useEffect(() => {
    if (!isModelSpeaking && transcriptStream.trim().length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'model',
          text: transcriptStream.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setTranscriptStream('');
    }
  }, [isModelSpeaking, transcriptStream]);

  const handleToggleConnection = async () => {
    if (connectionStatus === 'connected' || connectionStatus === 'connecting') {
      liveServiceRef.current?.disconnect();
    } else {
      setErrorMessage(null);
      try {
        await liveServiceRef.current?.connect();
      } catch (err: any) {
        // error already handled in callbacks
      }
    }
  };

  const handleSendPreset = (promptText: string) => {
    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: promptText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    if (connectionStatus === 'connected') {
      liveServiceRef.current?.sendTextMessage(promptText);
    } else {
      // Use fallback TTS endpoint
      handleFallbackSend(promptText);
    }
  };

  const handleSendTextForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const txt = textInput.trim();
    setTextInput('');
    handleSendPreset(txt);
  };

  const handleFallbackSend = async (promptText: string) => {
    setIsProcessingText(true);
    try {
      const res = await fetch('/api/voice/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: promptText, voice: selectedVoice, language: language }),
      });
      const data = await res.json();
      if (data.audio) {
        // Play fallback audio at 24kHz
        playBase64Pcm(data.audio);
      }
      setMessages((prev) => [
        ...prev,
        {
          sender: 'model',
          text: language === 'wo' 
            ? `[Tontu ci Kàddu via Gemini] Xelal am na ngir sa laaj : "${promptText}".`
            : `[Réponse Vocale Synthétisée via Gemini] Analyse transmise pour votre demande : "${promptText}".`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setErrorMessage(language === 'wo' ? 'Jàfe-jàfe ci kàddu gi : ' + err.message : 'Erreur lors de l\'appel vocal : ' + err.message);
    } finally {
      setIsProcessingText(false);
    }
  };

  // Helper to play base64 24kHz audio from TTS endpoint
  const playBase64Pcm = (base64Data: string) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
      const int16View = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16View.length);
      for (let i = 0; i < int16View.length; i++) float32Array[i] = int16View[i] / 32768.0;

      const buffer = audioCtx.createBuffer(1, float32Array.length, 24000);
      buffer.getChannelData(0).set(float32Array);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();
    } catch (err) {
      console.error('Audio playback error', err);
    }
  };

  const presetQuestions = [
    t.voice.presets.q1,
    t.voice.presets.q2,
    t.voice.presets.q3,
    t.voice.presets.q4
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 mb-2">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              {t.voice.badge}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {t.voice.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-4xl">
              {t.voice.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Language Switcher in Voice View (5 Languages) */}
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  language === 'fr' 
                    ? 'bg-blue-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇫🇷</span>
                <span>FR</span>
              </button>
              <button
                onClick={() => setLanguage('wo')}
                className={`px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  language === 'wo' 
                    ? 'bg-emerald-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇸🇳</span>
                <span>WO</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  language === 'en' 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
              <button
                onClick={() => setLanguage('es')}
                className={`px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  language === 'es' 
                    ? 'bg-amber-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇪🇸</span>
                <span>ES</span>
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  language === 'ar' 
                    ? 'bg-teal-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇸🇦</span>
                <span>العربية</span>
              </button>
            </div>

            <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-emerald-400 animate-ping' : connectionStatus === 'connecting' ? 'bg-amber-400' : 'bg-slate-600'
              }`} />
              <span className="font-medium">
                {connectionStatus === 'connected' ? t.voice.statusConnected : connectionStatus === 'connecting' ? t.voice.statusConnecting : t.voice.statusReady}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Voice Visualizer Stage */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 p-6 md:p-8 shadow-2xl flex flex-col items-center text-center">
        {/* Ambient glow */}
        <div className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isModelSpeaking ? 'bg-indigo-500/25' : connectionStatus === 'connected' ? 'bg-emerald-500/20' : 'bg-blue-500/10'
        }`} />
        <div className={`absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          micVolume > 0.1 ? 'bg-emerald-500/25' : 'bg-purple-500/10'
        }`} />

        {/* Central Orb / Pulse Avatar */}
        <div className="relative my-6 flex items-center justify-center">
          {/* Wave circles */}
          {connectionStatus === 'connected' && (
            <>
              <div 
                style={{ transform: `scale(${1 + micVolume * 0.8 + (isModelSpeaking ? 0.4 : 0)})` }}
                className="absolute w-36 h-36 rounded-full bg-emerald-500/15 animate-ping transition-transform duration-100" 
              />
              <div 
                style={{ transform: `scale(${1 + micVolume * 0.4 + (isModelSpeaking ? 0.2 : 0)})` }}
                className="absolute w-32 h-32 rounded-full bg-indigo-500/20 blur-sm transition-transform duration-100" 
              />
            </>
          )}

          {/* Central Button */}
          <button
            onClick={handleToggleConnection}
            className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer relative z-10 ${
              connectionStatus === 'connected'
                ? isModelSpeaking
                  ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-indigo-500/50 border-2 border-indigo-300'
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/50 border-2 border-emerald-300'
                : connectionStatus === 'connecting'
                ? 'bg-amber-600 animate-pulse border-2 border-amber-300'
                : 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/30 border border-blue-400/40'
            }`}
          >
            {connectionStatus === 'connected' ? (
              isModelSpeaking ? (
                <>
                  <Volume2 className="w-10 h-10 text-white animate-bounce" />
                  <span className="text-[10px] font-bold text-white uppercase mt-1">{t.voice.orbSpeaking}</span>
                </>
              ) : (
                <>
                  <Mic className="w-10 h-10 text-white animate-pulse" />
                  <span className="text-[10px] font-bold text-white uppercase mt-1">{t.voice.orbListening}</span>
                </>
              )
            ) : connectionStatus === 'connecting' ? (
              <>
                <Radio className="w-10 h-10 text-white animate-spin" />
                <span className="text-[10px] font-bold text-white uppercase mt-1">{t.voice.orbConnecting}</span>
              </>
            ) : (
              <>
                <Mic className="w-10 h-10 text-white" />
                <span className="text-[10px] font-bold text-white uppercase mt-1">{t.voice.orbStart}</span>
              </>
            )}
          </button>
        </div>

        {/* Live Audio Spectrum Bar */}
        <div className="flex items-center gap-1.5 h-8 my-2">
          {[...Array(16)].map((_, i) => {
            const heightMultiplier = isModelSpeaking
              ? Math.sin((i / 16) * Math.PI) * 28 + Math.random() * 8
              : connectionStatus === 'connected'
              ? Math.max(4, micVolume * 40 * Math.sin((i / 16) * Math.PI))
              : 4;
            return (
              <div
                key={i}
                style={{ height: `${heightMultiplier}px` }}
                className={`w-1.5 rounded-full transition-all duration-75 ${
                  isModelSpeaking 
                    ? 'bg-gradient-to-t from-indigo-500 to-purple-400' 
                    : connectionStatus === 'connected'
                    ? 'bg-gradient-to-t from-emerald-500 to-teal-300'
                    : 'bg-slate-800'
                }`}
              />
            );
          })}
        </div>

        {/* Instructions */}
        <div className="max-w-md mt-2">
          <p className="text-sm font-semibold text-white">
            {connectionStatus === 'connected'
              ? isModelSpeaking
                ? t.voice.instructionSpeaking
                : t.voice.instructionListening
              : t.voice.instructionIdle}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'wo' 
              ? "Aar xibaar yi, jëmmalukaay bi ak teggil nit ki ci boppam lëkkalente nañu ci biir."
              : "Garde-fous sectoriels hermétiques, mémoire contextuelle et autonomie graduée intégrés."}
          </p>
        </div>

        {/* Error message if mic blocked or failed */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 max-w-lg">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Controls Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleToggleConnection}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md ${
              connectionStatus === 'connected'
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
            }`}
          >
            {connectionStatus === 'connected' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{connectionStatus === 'connected' ? t.voice.stopMicBtn : t.voice.startMicBtn}</span>
          </button>

          {/* Voice selector */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <Headphones className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">{t.voice.voiceLabel}</span>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Zephyr" className="bg-slate-900">Zephyr ({language === 'wo' ? 'Tolluway' : 'Équilibrée'})</option>
              <option value="Puck" className="bg-slate-900">Puck ({language === 'wo' ? 'Gaaw' : 'Dynamique'})</option>
              <option value="Charon" className="bg-slate-900">Charon ({language === 'wo' ? 'Xóot' : 'Profonde'})</option>
              <option value="Kore" className="bg-slate-900">Kore ({language === 'wo' ? 'Neex' : 'Douce'})</option>
              <option value="Fenrir" className="bg-slate-900">Fenrir ({language === 'wo' ? 'Dëgër' : 'Autoritaire'})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Suggested Spoken Queries */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          {t.voice.presetHeading}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPreset(q)}
              disabled={isProcessingText}
              className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left text-xs text-slate-200 transition cursor-pointer flex items-center justify-between group"
            >
              <span>« {q} »</span>
              <Volume2 className="w-4 h-4 text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Live Transcript & Conversation Log */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">{t.voice.transcriptTitle}</h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Modèle : gemini-3.8-live &bull; {
              language === 'wo' ? 'Wolof (🇸🇳)' :
              language === 'en' ? 'English (🇬🇧)' :
              language === 'es' ? 'Español (🇪🇸)' :
              language === 'ar' ? 'العربية (🇸🇦)' :
              'Français (🇫🇷)'
            }
          </span>
        </div>

        {/* Streaming live text banner if model is speaking right now */}
        {transcriptStream && (
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-xs text-indigo-200 animate-pulse">
            <span className="font-bold text-indigo-300">{t.voice.synthBanner} </span>
            {transcriptStream}
          </div>
        )}

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="font-bold text-[10px] uppercase tracking-wider mb-1 opacity-75">
                  {m.sender === 'user' 
                    ? (language === 'wo' ? 'Yow (Kàddu)' : 
                       language === 'en' ? 'You (Voice)' : 
                       language === 'es' ? 'Usted (Voz)' : 
                       language === 'ar' ? 'أنت (صوتياً)' : 
                       'Vous (Vocal)') 
                    : 'NEXOMIA (gemini-3.8-live)'}
                </div>
                {m.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Text fallback input */}
        <form onSubmit={handleSendTextForm} className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={t.voice.inputPlaceholder}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={isProcessingText}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.voice.sendBtn}</span>
          </button>
        </form>
      </div>

      {/* Technical Architecture Specs Card for Voice */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Modèle de langage</span>
          <span className="font-mono text-emerald-400 font-bold">gemini-3.8-live</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Protocole flux</span>
          <span className="font-mono text-cyan-400 font-bold">WebSocket (/live)</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Audio Entrée / Sortie</span>
          <span className="font-mono text-slate-300">16 kHz / 24 kHz PCM</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Interruption Live</span>
          <span className="font-mono text-indigo-400">À la volée (Barge-in)</span>
        </div>
      </div>
    </div>
  );
};
