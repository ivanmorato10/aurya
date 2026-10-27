// Player de faixas com repetição, volume e temporizador. Nunca inicia sozinho.

export type AudioStatus = "idle" | "ready" | "loading" | "playing" | "paused" | "ended" | "error";
export type Media = Pick<HTMLAudioElement, "play" | "pause" | "load" | "removeAttribute" | "addEventListener"> & {
  src: string;
  loop: boolean;
  volume: number;
  currentTime: number;
  preload: string;
};

export class AudioSession {
  status: AudioStatus = "idle";
  message = "Escolha uma faixa e toque em Reproduzir.";
  trackId: string | null = null;
  volume: number;
  durationMs: number;
  remainingMs: number;
  private deadline: number | null = null;
  private ticket = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private clock: () => number;

  constructor(
    private media: Media,
    private notify: (s: AudioSession) => void,
    { volume = 0.15, minutes = 5, clock = () => Date.now() }: { volume?: number; minutes?: number; clock?: () => number } = {},
  ) {
    this.clock = clock;
    this.volume = volume;
    this.durationMs = minutes * 60_000;
    this.remainingMs = this.durationMs;
    media.preload = "none";
    media.loop = true;
    media.volume = volume;
    media.addEventListener("error", () => {
      if (this.trackId) this.fail();
    });
    media.addEventListener("pause", () => {
      if (this.status === "playing") this.pause();
    });
  }

  private emit() {
    this.notify(this);
  }

  select(trackId: string, src: string) {
    if (trackId === this.trackId) return;
    this.stop(false);
    this.trackId = trackId;
    this.media.src = src;
    this.status = "ready";
    this.message = "Pronto para ouvir.";
    this.emit();
  }

  setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
    this.media.volume = this.volume;
    this.emit();
  }

  setTimer(minutes: number) {
    this.durationMs = minutes * 60_000;
    this.remainingMs = this.durationMs;
    if (this.status === "playing") this.deadline = this.clock() + this.remainingMs;
    this.emit();
  }

  async play() {
    if (!this.trackId || this.status === "loading" || this.status === "playing") return;
    const ticket = ++this.ticket;
    this.status = "loading";
    this.message = "Carregando…";
    this.emit();
    try {
      if (this.remainingMs <= 0) this.remainingMs = this.durationMs;
      await this.media.play();
      if (ticket !== this.ticket) return;
      this.status = "playing";
      this.message = "Tocando em repetição.";
      this.deadline = this.clock() + this.remainingMs;
      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(() => this.tick(), 500);
      this.emit();
    } catch {
      if (ticket === this.ticket) this.fail();
    }
  }

  pause(reason = "Pausado.") {
    ++this.ticket;
    if (this.deadline !== null) this.remainingMs = Math.max(0, this.deadline - this.clock());
    this.deadline = null;
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
    this.status = this.trackId ? "paused" : "idle";
    this.media.pause();
    this.message = reason;
    this.emit();
  }

  stop(emit = true) {
    ++this.ticket;
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
    this.deadline = null;
    this.status = this.trackId ? "ready" : "idle";
    this.media.pause();
    try {
      this.media.currentTime = 0;
    } catch {}
    this.remainingMs = this.durationMs;
    this.message = "Sessão encerrada.";
    if (emit) this.emit();
  }

  tick() {
    if (this.status !== "playing" || this.deadline === null) return;
    this.remainingMs = Math.max(0, this.deadline - this.clock());
    if (!this.remainingMs) {
      this.stop(false);
      this.remainingMs = 0;
      this.status = "ended";
      this.message = "Tempo concluído.";
    }
    this.emit();
  }

  private fail() {
    this.stop(false);
    this.status = "error";
    this.message = "Não foi possível tocar esta faixa. Verifique a conexão e tente novamente.";
    this.emit();
  }

  dispose() {
    this.stop(false);
    this.media.removeAttribute("src");
    this.media.load();
  }
}
