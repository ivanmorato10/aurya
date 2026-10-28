"use client";

import { useState } from "react";
import { Logo, SunSymbol, Wordmark } from "@/components/brand/Logo";
import { MomentIcon } from "@/components/Icons";
import { AppHeader } from "@/components/ui/AppHeader";
import { PlayButton, ProgressBar } from "@/components/ui/AudioControls";
import { Button } from "@/components/ui/Button";
import { EditorialCard } from "@/components/ui/EditorialCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StateMessage";
import { TextField } from "@/components/ui/TextField";
import { TimeRow } from "@/components/ui/TimeRow";
import { Scene } from "@/components/Scene";
import type { MomentId } from "@/lib/schedule";

const COLORS = [
  ["Midnight Navy", "--aurya-midnight", "#101C2C"],
  ["Ocean Blue", "--aurya-ocean", "#1E3A5F"],
  ["Champagne", "--aurya-champagne", "#C5B69A"],
  ["Ivory", "--aurya-ivory", "#F4F0E8"],
];
const TYPE = [
  ["Display · Cormorant 40", "display", "Eu escolho pensamentos que criam a vida próspera."],
  ["Headline · Cormorant 32", "headline", "Quatro momentos do seu dia"],
  ["Title · Cormorant 22", "title", "Prosperidade começa no que cultivo"],
  ["Body · Inter 16", "body-2", "Afirmações, reflexões e experiências sonoras em quatro momentos do dia."],
  ["Caption · Inter 13", "caption", "Próxima troca às 12:30"],
  ["Overline · Inter 11", "overline", "Momento atual"],
];
const MOMENTS: [MomentId, string][] = [["wake", "Ao acordar"], ["commute", "Indo para o trabalho"], ["midday", "Meio do dia"], ["sleep", "Antes de dormir"]];

export function Showcase() {
  const [times, setTimes] = useState<Record<string, string>>({ wake: "07:00", commute: "08:30", midday: "12:30", sleep: "22:00" });
  const [playing, setPlaying] = useState(false);
  return (
    <div className="app">
      <main id="conteudo" className="screen ds">
        <AppHeader center={<Wordmark size={20} />} />
        <section className="ds-section">
          <p className="overline">Marca</p>
          <div className="ds-logo">
            <Logo />
          </div>
          <div className="ds-row">
            <SunSymbol width={56} />
            <Wordmark size={28} />
          </div>
        </section>

        <section className="ds-section">
          <p className="overline">Cores</p>
          <div className="ds-swatches">
            {COLORS.map(([name, token, hex]) => (
              <div key={token} className="ds-swatch">
                <span style={{ background: `var(${token})` }} />
                <p className="caption">
                  {name}
                  <br />
                  {hex}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="ds-section">
          <p className="overline">Tipografia</p>
          {TYPE.map(([label, cls, sample]) => (
            <div key={label} className="ds-type">
              <p className="caption">{label}</p>
              <p className={cls}>{sample}</p>
            </div>
          ))}
        </section>

        <section className="ds-section">
          <p className="overline">Botões</p>
          <div style={{ display: "grid", gap: 12 }}>
            <Button block>Começar agora</Button>
            <Button variant="secondary" block>
              Salvar horários
            </Button>
            <Button variant="primary" block loading>
              Salvando…
            </Button>
            <Button variant="text">Já tenho uma conta</Button>
          </div>
        </section>

        <section className="ds-section">
          <p className="overline">Seletores de horário</p>
          <ul className="list">
            {MOMENTS.map(([id, label]) => (
              <li key={id}>
                <TimeRow moment={id} label={label} value={times[id]} onChange={(v) => setTimes((t) => ({ ...t, [id]: v }))} />
              </li>
            ))}
          </ul>
        </section>

        <section className="ds-section">
          <p className="overline">Ícones dos momentos</p>
          <div className="ds-row" style={{ color: "var(--aurya-champagne)" }}>
            {MOMENTS.map(([id]) => (
              <MomentIcon key={id} moment={id} className="ds-icon" />
            ))}
          </div>
        </section>

        <section className="ds-section">
          <p className="overline">Campos</p>
          <TextField label="Seu e-mail" type="email" placeholder="voce@email.com" />
          <TextField label="Seu nome (opcional)" error="Use até 60 caracteres." defaultValue="Nome muito longo" />
        </section>

        <section className="ds-section">
          <p className="overline">Controles de áudio</p>
          <div className="ds-row">
            <PlayButton playing={playing} onClick={() => setPlaying((p) => !p)} />
            <PlayButton playing={false} busy onClick={() => undefined} size="md" />
          </div>
          <ProgressBar elapsedMs={135000} totalMs={600000} />
        </section>

        <section className="ds-section">
          <p className="overline">Card editorial</p>
          <EditorialCard overline="Aprofundamento" title="Prosperidade começa no que cultivo" media={<Scene moment="wake" />}>
            Quando acolho esta afirmação, reconheço que minha vida contém capacidades, relações e possibilidades que merecem cuidado.
          </EditorialCard>
        </section>

        <section className="ds-section">
          <p className="overline">Estados</p>
          <LoadingState height={80} />
          <EmptyState title="Nenhuma faixa neste tema" text="Escolha outro tema para ouvir." />
          <ErrorState onRetry={() => undefined} />
        </section>
      </main>
    </div>
  );
}
