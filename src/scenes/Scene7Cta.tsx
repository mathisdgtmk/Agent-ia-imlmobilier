import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useSceneT} from '../components/SceneShell';
import {useLayout} from '../lib/layout';
import {Logo} from '../components/Logo';
import {GoldLine, Dust} from '../components/Gold';
import {HeroText} from '../components/Type';
import {IconSpark} from '../ui/Icons';
import {cue, sceneById} from '../lib/timeline';
import {easeInOut, easeOut, prog} from '../lib/anim';
import {BRAND} from '../config/brand';
import {F, goldGradient} from '../theme';

/** SCÈNE 7 — Appel à l'action : fond noir, ligne dorée, logo, bouton « Demandez votre démonstration ». */
export const Scene7Cta: React.FC = () => {
  const t = useSceneT();
  const {w, h, vertical, u} = useLayout();
  const s = sceneById('cta');
  const L = (id: string) => cue(id) - s.start;
  const end = s.end - s.start;

  const lineP = prog(t, 0.0, 1.0, (n) => n * n * (3 - 2 * n));
  const lineFade = 1 - prog(t, 1.1, 1.7, (n) => n);
  const logoP = prog(t, L('cta_logo') - 0.05, L('cta_logo') + 1.1, easeOut);
  const promptAt = L('cta_logo') + 0.55;
  const btnP = prog(t, L('cta_button'), L('cta_button') + 0.7, easeOut);
  const press = prog(t, L('cta_button') + 1.0, L('cta_button') + 1.12, (n) => n) * (1 - prog(t, L('cta_button') + 1.12, L('cta_button') + 1.4, easeOut));
  const tagP = prog(t, L('cta_tag'), L('cta_tag') + 0.6, easeOut);
  const contactP = prog(t, L('cta_tag') + 0.9, L('cta_tag') + 1.5, easeOut);
  const fadeOut = 1 - prog(t, end - 0.55, end, easeInOut);
  const pulse = 0.5 + 0.5 * Math.sin(t * 3.2);

  const btnW = (vertical ? 960 : 860) * u;
  const btnH = (vertical ? 118 : 100) * u;
  // la phrase d'accroche vient de src/config/brand.ts : elle est répartie automatiquement sur 2 (16:9) ou 3 (9:16) lignes
  const words = BRAND.ctaPrompt.split(' ');
  const nLines = vertical ? 3 : 2;
  const target = BRAND.ctaPrompt.length / nLines;
  const lines: {t: string; gold?: boolean}[][] = [];
  let cur: {t: string; gold?: boolean}[] = [];
  let acc = 0;
  words.forEach((wd, i) => {
    cur.push({t: wd, gold: i >= words.length - 2});
    acc += wd.length + 1;
    if (acc >= target * (lines.length + 1) && lines.length < nLines - 1) {
      lines.push(cur);
      cur = [];
    }
  });
  lines.push(cur);

  return (
    <AbsoluteFill style={{background: '#020409', opacity: fadeOut}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 55% at 50% ${vertical ? 30 : 38}%, rgba(24,38,84,0.55) 0%, rgba(2,4,9,0) 70%)`}} />
      <Dust t={t} w={w} h={h} n={36} opacity={0.55} seed="cta" />

      {/* ligne dorée qui traverse l'écran */}
      <GoldLine p={lineP} w={w} h={h} y={vertical ? 0.16 : 0.2} thickness={4 * u} fade={lineFade} />

      {/* logo */}
      <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.06 : 0.07), display: 'flex', justifyContent: 'center'}}>
        <Logo k={(vertical ? 0.62 : 0.56) * u} p={logoP} />
      </div>
      {/* filet doré sous le logo */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: h * (vertical ? 0.235 : 0.285),
          width: (vertical ? 520 : 640) * u * logoP,
          height: 2,
          marginLeft: -((vertical ? 520 : 640) * u * logoP) / 2,
          background: 'linear-gradient(90deg,rgba(233,205,140,0),rgba(243,230,190,0.95),rgba(233,205,140,0))',
          boxShadow: '0 0 18px rgba(233,205,140,0.8)',
        }}
      />

      {/* question */}
      <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.31 : 0.36), display: 'flex', justifyContent: 'center'}}>
        <HeroText t={t} start={promptAt} stagger={0.1} size={(vertical ? 70 : 72) * u} lines={lines} />
      </div>

      {/* bouton animé */}
      <div style={{position: 'absolute', left: 0, right: 0, top: h * (vertical ? 0.545 : 0.635), display: 'flex', justifyContent: 'center', opacity: btnP, transform: `translateY(${(1 - btnP) * 30 * u}px) scale(${(0.86 + 0.14 * btnP) * (1 - 0.035 * press)})`, filter: btnP < 1 ? `blur(${(1 - btnP) * 8}px)` : undefined}}>
        <div style={{position: 'relative'}}>
          {/* ondes */}
          {[0, 1].map((k) => {
            const ph = (t * 0.9 + k * 0.5) % 1;
            return <div key={k} style={{position: 'absolute', inset: -ph * 44 * u, borderRadius: btnH, border: `2px solid rgba(243,214,140,${(1 - ph) * 0.5})`, opacity: btnP}} />;
          })}
          <div
            style={{
              position: 'relative',
              width: btnW,
              height: btnH,
              borderRadius: btnH,
              background: goldGradient,
              boxShadow: `0 ${18 * u}px ${50 * u}px rgba(0,0,0,0.55), 0 0 ${(40 + 40 * pulse) * u}px rgba(233,205,140,${0.35 + 0.3 * pulse}), inset 0 2px 0 rgba(255,255,255,0.6)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20 * u,
              overflow: 'hidden',
              fontFamily: F.display,
              fontWeight: 700,
              fontSize: (vertical ? 29 : 27) * u,
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
              color: '#1B1509',
            }}
          >
            {/* reflet qui balaie le bouton */}
            <div style={{position: 'absolute', top: 0, bottom: 0, left: `${-30 + ((t * 45) % 160)}%`, width: '22%', transform: 'skewX(-20deg)', background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.65),rgba(255,255,255,0))'}} />
            <IconSpark size={30 * u} color="#1B1509" />
            <span style={{position: 'relative'}}>{BRAND.ctaLabel}</span>
          </div>
        </div>
      </div>

      {/* signature */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: h * (vertical ? 0.635 : 0.77),
          textAlign: 'center',
          fontFamily: F.sans,
          fontWeight: 500,
          fontSize: (vertical ? 32 : 28) * u,
          letterSpacing: '0.2em',
          color: '#E9D09A',
          textTransform: 'uppercase',
          opacity: tagP,
          transform: `translateY(${(1 - tagP) * 14}px)`,
        }}
      >
        {BRAND.tagline}
      </div>

      {/* coordonnées provisoires */}
      {BRAND.contact.show && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: h * (vertical ? 0.69 : 0.845),
            textAlign: 'center',
            fontFamily: F.sans,
            fontWeight: 400,
            fontSize: (vertical ? 28 : 25) * u,
            letterSpacing: '0.06em',
            color: 'rgba(248,245,238,0.78)',
            opacity: contactP,
          }}
        >
          {BRAND.contact.website}
          <span style={{margin: `0 ${18 * u}px`, color: '#E9D09A'}}>·</span>
          {BRAND.contact.phone}
        </div>
      )}
    </AbsoluteFill>
  );
};
