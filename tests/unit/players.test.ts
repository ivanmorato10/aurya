import { describe, expect, it, vi } from "vitest";
import { AudioSession, type Media } from "@/lib/audio-session";
import { NarrationSession } from "@/lib/narration";

function fakeMedia(playImpl: () => Promise<void> = () => Promise.resolve()) {
  const listeners: Record<string, (() => void)[]> = {};
  const media = {
    src: "",
    loop: false,
    volume: 1,
    currentTime: 5,
    preload: "auto",
    play: vi.fn(playImpl),
    pause: vi.fn(),
    load: vi.fn(),
    removeAttribute: vi.fn(),
    addEventListener: (type: string, fn: () => void) => ((listeners[type] ??= []).push(fn)),
  };
  return { media: media as unknown as Media, raw: media, fire: (t: string) => listeners[t]?.forEach((f) => f()) };
}

describe("AudioSession", () => {
  it("não toca sozinho, começa em volume baixo e em repetição", () => {
    const { raw, media } = fakeMedia();
    const s = new AudioSession(media, () => {});
    s.select("a", "/audio/a.m4a");
    expect(raw.play).not.toHaveBeenCalled();
    expect(raw.volume).toBe(0.15);
    expect(raw.loop).toBe(true);
    expect(s.status).toBe("ready");
  });

  it("pausa congela o tempo e o temporizador encerra", async () => {
    let now = 0;
    const { media } = fakeMedia();
    const s = new AudioSession(media, () => {}, { minutes: 1, clock: () => now });
    s.select("a", "/a.m4a");
    await s.play();
    expect(s.status).toBe("playing");
    now = 20_000;
    s.pause();
    expect(s.remainingMs).toBe(40_000);
    now = 100_000;
    await s.play();
    now = 140_000;
    s.tick();
    expect(s.status).toBe("ended");
    s.dispose();
  });

  it("ignora cliques repetidos durante o carregamento", async () => {
    let resolve!: () => void;
    const { raw, media } = fakeMedia(() => new Promise<void>((r) => (resolve = r)));
    const s = new AudioSession(media, () => {});
    s.select("a", "/a.m4a");
    const first = s.play();
    void s.play();
    void s.play();
    expect(raw.play).toHaveBeenCalledTimes(1);
    resolve();
    await first;
    s.dispose();
  });

  it("informa erro quando o navegador recusa tocar", async () => {
    const { media } = fakeMedia(() => Promise.reject(new Error("NotAllowed")));
    const s = new AudioSession(media, () => {});
    s.select("a", "/a.m4a");
    await s.play();
    expect(s.status).toBe("error");
  });
});

class FakeUtterance {
  voice: unknown;
  lang = "";
  rate = 1;
  pitch = 1;
  onstart?: () => void;
  onend?: () => void;
  onerror?: () => void;
  onpause?: () => void;
  onresume?: () => void;
  constructor(public text: string) {}
}

function fakeSynth(voices: Partial<SpeechSynthesisVoice>[], autoSpeak = true) {
  const spoken: FakeUtterance[] = [];
  return {
    spoken,
    synth: {
      paused: false,
      speaking: false,
      getVoices: () => voices as SpeechSynthesisVoice[],
      speak: (u: FakeUtterance) => {
        spoken.push(u);
        if (autoSpeak)
          queueMicrotask(() => {
            u.onstart?.();
            u.onend?.();
          });
      },
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
    },
  };
}

describe("NarrationSession", () => {
  it("lê todos os trechos com voz portuguesa local preferida", async () => {
    const { synth, spoken } = fakeSynth([
      { name: "Remote", lang: "pt-BR", localService: false },
      { name: "Luciana", lang: "pt-BR", localService: true },
      { name: "Samantha", lang: "en-US", localService: true },
    ]);
    const statuses: string[] = [];
    const n = new NarrationSession((s) => statuses.push(s.status), synth as never, FakeUtterance as never);
    await n.play(["um", "dois", "três"]);
    await vi.waitFor(() => expect(n.status).toBe("ended"));
    expect(spoken.map((u) => u.text)).toEqual(["um", "dois", "três"]);
    expect((spoken[0].voice as SpeechSynthesisVoice).name).toBe("Luciana");
  });

  it("avisa quando não há voz em português, sem fingir reprodução", async () => {
    const { synth } = fakeSynth([{ name: "Samantha", lang: "en-US", localService: true }]);
    const n = new NarrationSession(() => {}, synth as never, FakeUtterance as never);
    await n.play(["texto"]);
    expect(n.status).toBe("unavailable");
  });

  it("encerra por watchdog se a voz não começa", async () => {
    vi.useFakeTimers();
    const { synth } = fakeSynth([{ name: "Luciana", lang: "pt-BR", localService: true }], false);
    const n = new NarrationSession(() => {}, synth as never, FakeUtterance as never, 1000);
    await n.play(["texto"]);
    expect(n.status).toBe("preparing");
    vi.advanceTimersByTime(1001);
    expect(n.status).toBe("unavailable");
    vi.useRealTimers();
  });

  it("navegador sem Web Speech: indisponível", async () => {
    const n = new NarrationSession(() => {}, undefined, undefined);
    await n.play(["texto"]);
    expect(n.status).toBe("unavailable");
  });
});
