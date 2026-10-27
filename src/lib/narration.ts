// Leitura em voz alta pela Web Speech API do próprio aparelho.
// Prefere vozes locais em português; o texto lido é conteúdo público do catálogo.

export type NarrationStatus = "idle" | "preparing" | "speaking" | "paused" | "ended" | "unavailable";

type Synth = Pick<SpeechSynthesis, "speak" | "cancel" | "pause" | "resume" | "getVoices" | "paused" | "speaking"> &
  Partial<Pick<SpeechSynthesis, "addEventListener" | "removeEventListener">>;

export class NarrationSession {
  status: NarrationStatus = "idle";
  message = "Leitura pela voz do aparelho. Nada começa sozinho.";
  private ticket = 0;
  private chunks: string[] = [];
  private index = 0;
  private watchdog: ReturnType<typeof setTimeout> | null = null;
  private voice: SpeechSynthesisVoice | null = null;

  constructor(
    private notify: (s: NarrationSession) => void,
    private synth: Synth | undefined = globalThis.speechSynthesis,
    private Utterance: typeof SpeechSynthesisUtterance | undefined = globalThis.SpeechSynthesisUtterance,
    private startTimeout = 4500,
  ) {}

  private emit() {
    this.notify(this);
  }

  private portugueseVoices() {
    return this.synth?.getVoices().filter((v) => /^pt(?:[-_]|$)/i.test(v.lang)) ?? [];
  }

  private async pickVoice() {
    let voices = this.portugueseVoices();
    if (!voices.length && this.synth?.addEventListener) {
      await new Promise<void>((resolve) => {
        const done = () => {
          clearTimeout(timer);
          this.synth?.removeEventListener?.("voiceschanged", done);
          resolve();
        };
        const timer = setTimeout(done, 700);
        this.synth?.addEventListener?.("voiceschanged", done, { once: true });
      });
      voices = this.portugueseVoices();
    }
    const score = (v: SpeechSynthesisVoice) =>
      (v.localService ? 30 : 0) +
      (v.lang.toLowerCase().replace("_", "-") === "pt-br" ? 10 : 0) +
      (/natural|neural|enhanced|premium|aprimorada/i.test(v.name) ? 20 : 0);
    return voices.sort((a, b) => score(b) - score(a))[0] ?? null;
  }

  async play(chunks: string[]) {
    this.stop(false);
    this.chunks = chunks;
    const ticket = this.ticket;
    if (!this.synth || !this.Utterance) return this.unavailable("Leitura em voz alta indisponível neste navegador. O texto continua aqui.");
    this.status = "preparing";
    this.message = "Procurando uma voz em português…";
    this.emit();
    try {
      this.voice = await this.pickVoice();
    } catch {
      this.voice = null;
    }
    if (ticket !== this.ticket) return;
    if (!this.voice) return this.unavailable("Nenhuma voz em português no aparelho. Ative uma nas configurações ou continue lendo.");
    this.index = 0;
    this.say(ticket);
  }

  private say(ticket: number) {
    if (ticket !== this.ticket || !this.synth || !this.Utterance || !this.voice) return;
    if (this.index >= this.chunks.length) {
      this.status = "ended";
      this.message = "Leitura concluída.";
      this.emit();
      return;
    }
    const u = new this.Utterance(this.chunks[this.index]);
    u.voice = this.voice;
    u.lang = this.voice.lang;
    u.rate = 0.92;
    u.pitch = 0.9;
    const guard = (fn: () => void) => () => {
      if (ticket !== this.ticket) return;
      if (this.watchdog) clearTimeout(this.watchdog);
      fn();
    };
    u.onstart = guard(() => {
      this.status = "speaking";
      this.message = `Lendo com a voz ${this.voice?.name ?? ""}`.trim();
      this.emit();
    });
    u.onpause = guard(() => {
      this.status = "paused";
      this.message = "Leitura pausada.";
      this.emit();
    });
    u.onresume = guard(() => {
      this.status = "speaking";
      this.message = "Leitura retomada.";
      this.emit();
    });
    u.onend = guard(() => {
      this.index++;
      this.say(ticket);
    });
    u.onerror = guard(() => this.unavailable("A voz não conseguiu concluir. O texto continua disponível."));
    if (this.index === 0) {
      this.watchdog = setTimeout(() => {
        if (ticket === this.ticket && this.status === "preparing") this.unavailable("A voz não iniciou neste aparelho. Tente de novo ou continue lendo.");
      }, this.startTimeout);
    }
    try {
      this.synth.speak(u);
    } catch {
      this.unavailable("Não foi possível iniciar a voz. O texto continua disponível.");
    }
  }

  pause() {
    if (this.status !== "speaking" || !this.synth) return;
    try {
      this.synth.pause();
      this.status = "paused";
      this.message = "Leitura pausada.";
      this.emit();
    } catch {
      this.unavailable("Pausa indisponível neste aparelho. Leitura encerrada.");
    }
  }

  resume() {
    if (this.status !== "paused" || !this.synth) return;
    try {
      this.synth.resume();
      this.status = "speaking";
      this.message = "Leitura retomada.";
      this.emit();
    } catch {
      this.unavailable("Não foi possível retomar. Toque em Ouvir para recomeçar.");
    }
  }

  stop(emit = true) {
    this.ticket++;
    if (this.watchdog) clearTimeout(this.watchdog);
    this.watchdog = null;
    try {
      this.synth?.cancel();
    } catch {}
    this.status = "idle";
    this.message = "Leitura encerrada.";
    if (emit) this.emit();
  }

  private unavailable(message: string) {
    this.stop(false);
    this.status = "unavailable";
    this.message = message;
    this.emit();
  }
}
