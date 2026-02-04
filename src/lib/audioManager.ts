// Global audio manager to persist audio across page navigation
class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private isMuted: boolean = true;
  private listeners: Set<(isMuted: boolean) => void> = new Set();

  initialize(audioSource: string) {
    if (this.audio) return; // Already initialized
    
    this.audio = new Audio(audioSource);
    this.audio.loop = true;
    this.audio.volume = 0.3;
    this.audio.preload = 'auto';
  }

  subscribe(listener: (isMuted: boolean) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.isMuted));
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.audio) {
      if (this.isMuted) {
        this.audio.pause();
      } else {
        this.audio.play().catch(() => {});
      }
    }
    
    this.notify();
  }

  getMutedState() {
    return this.isMuted;
  }

  play() {
    if (this.audio && !this.isMuted) {
      this.audio.play().catch(() => {});
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }
}

export const audioManager = new AudioManager();
