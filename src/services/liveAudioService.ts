/**
 * Audio and WebSocket streaming service for Gemini 3.8 Live API
 */

export interface LiveAudioEventCallbacks {
  onStatusChange?: (status: 'disconnected' | 'connecting' | 'connected' | 'error') => void;
  onTranscript?: (text: string) => void;
  onError?: (error: string) => void;
  onVolumeChange?: (volume: number) => void;
  onModelSpeakingChange?: (isSpeaking: boolean) => void;
}

export class LiveAudioService {
  private ws: WebSocket | null = null;
  private inputAudioCtx: AudioContext | null = null;
  private outputAudioCtx: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private callbacks: LiveAudioEventCallbacks = {};
  
  // Audio playback queue
  private audioQueue: AudioBuffer[] = [];
  private isPlaying = false;
  private currentSourceNode: AudioBufferSourceNode | null = null;
  private nextPlayTime = 0;

  constructor(callbacks: LiveAudioEventCallbacks = {}) {
    this.callbacks = callbacks;
  }

  public setCallbacks(callbacks: LiveAudioEventCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Connect to Gemini Live API via WebSocket and begin mic streaming
   */
  public async connect(): Promise<void> {
    this.callbacks.onStatusChange?.('connecting');

    try {
      // 1. Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // 2. Setup AudioContexts
      this.inputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      this.outputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });

      if (this.inputAudioCtx.state === 'suspended') {
        await this.inputAudioCtx.resume();
      }
      if (this.outputAudioCtx.state === 'suspended') {
        await this.outputAudioCtx.resume();
      }

      // 3. Setup WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.callbacks.onStatusChange?.('connected');
        this.startMicStreaming();
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'audio' && msg.audio) {
            this.handleIncomingAudio(msg.audio);
          } else if (msg.type === 'transcript' && msg.text) {
            this.callbacks.onTranscript?.(msg.text);
          } else if (msg.type === 'interrupted') {
            this.stopPlayback();
          } else if (msg.type === 'error') {
            this.callbacks.onError?.(msg.error);
          }
        } catch (e) {
          console.error('Error handling WebSocket message', e);
        }
      };

      this.ws.onerror = (err) => {
        console.error('WebSocket connection error', err);
        this.callbacks.onError?.('Erreur de connexion WebSocket Live API');
        this.callbacks.onStatusChange?.('error');
      };

      this.ws.onclose = () => {
        this.callbacks.onStatusChange?.('disconnected');
        this.stopMicStreaming();
      };

    } catch (err: any) {
      console.error('Failed to start Live Audio session:', err);
      this.callbacks.onError?.(err.message || 'Impossible d\'accéder au microphone');
      this.callbacks.onStatusChange?.('error');
      this.disconnect();
      throw err;
    }
  }

  /**
   * Start capturing mic data and sending to WebSocket in 16kHz PCM
   */
  private startMicStreaming() {
    if (!this.inputAudioCtx || !this.mediaStream) return;

    const source = this.inputAudioCtx.createMediaStreamSource(this.mediaStream);
    this.processor = this.inputAudioCtx.createScriptProcessor(4096, 1, 1);

    source.connect(this.processor);
    this.processor.connect(this.inputAudioCtx.destination);

    this.processor.onaudioprocess = (e) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

      const inputData = e.inputBuffer.getChannelData(0);
      
      // Calculate volume level for UI
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) {
        sum += inputData[i] * inputData[i];
      }
      const rms = Math.sqrt(sum / inputData.length);
      this.callbacks.onVolumeChange?.(Math.min(1, rms * 5));

      // Convert Float32 to 16-bit PCM Base64
      const base64Pcm = this.floatTo16BitPCMBase64(inputData);
      this.ws.send(JSON.stringify({ audio: base64Pcm }));
    };
  }

  /**
   * Convert Float32 array to 16-bit PCM and encode as base64
   */
  private floatTo16BitPCMBase64(input: Float32Array): string {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Process 24kHz incoming audio from Gemini 3.8 Live API
   */
  private handleIncomingAudio(base64Data: string) {
    if (!this.outputAudioCtx) return;

    try {
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const int16View = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16View.length);
      for (let i = 0; i < int16View.length; i++) {
        float32Array[i] = int16View[i] / 32768.0;
      }

      const audioBuffer = this.outputAudioCtx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.getChannelData(0).set(float32Array);

      this.audioQueue.push(audioBuffer);
      if (!this.isPlaying) {
        this.playNextChunk();
      }
    } catch (e) {
      console.error('Error decoding audio chunk', e);
    }
  }

  /**
   * Play queued 24kHz audio chunks seamlessly
   */
  private playNextChunk() {
    if (!this.outputAudioCtx || this.audioQueue.length === 0) {
      this.isPlaying = false;
      this.callbacks.onModelSpeakingChange?.(false);
      return;
    }

    this.isPlaying = true;
    this.callbacks.onModelSpeakingChange?.(true);

    const chunk = this.audioQueue.shift()!;
    const source = this.outputAudioCtx.createBufferSource();
    source.buffer = chunk;
    source.connect(this.outputAudioCtx.destination);

    const currentTime = this.outputAudioCtx.currentTime;
    if (this.nextPlayTime < currentTime) {
      this.nextPlayTime = currentTime;
    }

    source.start(this.nextPlayTime);
    this.nextPlayTime += chunk.duration;
    this.currentSourceNode = source;

    source.onended = () => {
      this.playNextChunk();
    };
  }

  /**
   * Stop current playback immediately upon interruption
   */
  public stopPlayback() {
    this.audioQueue = [];
    if (this.currentSourceNode) {
      try {
        this.currentSourceNode.stop();
      } catch {}
      this.currentSourceNode = null;
    }
    this.isPlaying = false;
    this.nextPlayTime = 0;
    this.callbacks.onModelSpeakingChange?.(false);
  }

  /**
   * Send a text message to Live session
   */
  public sendTextMessage(text: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ text }));
    }
  }

  private stopMicStreaming() {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }

  /**
   * Disconnect the Live session
   */
  public disconnect() {
    this.stopPlayback();
    this.stopMicStreaming();

    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }

    if (this.inputAudioCtx && this.inputAudioCtx.state !== 'closed') {
      try {
        this.inputAudioCtx.close();
      } catch {}
      this.inputAudioCtx = null;
    }

    if (this.outputAudioCtx && this.outputAudioCtx.state !== 'closed') {
      try {
        this.outputAudioCtx.close();
      } catch {}
      this.outputAudioCtx = null;
    }

    this.callbacks.onStatusChange?.('disconnected');
    this.callbacks.onVolumeChange?.(0);
    this.callbacks.onModelSpeakingChange?.(false);
  }
}
