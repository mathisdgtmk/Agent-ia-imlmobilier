import React from 'react';

/** Smartphone haut de gamme (cadre titane sombre, îlot dynamique, reflet de verre). */
export const PhoneFrame: React.FC<{w: number; children: React.ReactNode; glow?: number}> = ({w, children, glow = 0.14}) => {
  const h = w * 2.06;
  const r = w * 0.155;
  const bz = w * 0.03;
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        borderRadius: r,
        padding: bz,
        background: 'linear-gradient(145deg,#4A505E 0%,#161A22 35%,#0B0D12 60%,#3A3F4C 100%)',
        boxShadow: `0 ${w * 0.1}px ${w * 0.3}px rgba(0,0,0,0.6), 0 0 0 ${Math.max(1, w * 0.004)}px rgba(240,220,170,0.30) inset, 0 0 ${w * 0.5}px rgba(226,190,120,${glow})`,
      }}
    >
      <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: r - bz, overflow: 'hidden', background: '#070A14'}}>
        {children}
        <div
          style={{
            position: 'absolute',
            top: w * 0.034,
            left: '50%',
            transform: 'translateX(-50%)',
            width: w * 0.27,
            height: w * 0.076,
            borderRadius: w,
            background: '#000',
            zIndex: 5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(115deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0) 45%)',
            pointerEvents: 'none',
            zIndex: 6,
          }}
        />
      </div>
    </div>
  );
};

/** Ordinateur portable (écran 16:10 + base en aluminium sombre). */
export const LaptopFrame: React.FC<{w: number; children: React.ReactNode; glow?: number}> = ({w, children, glow = 0.14}) => {
  const sh = w * 0.625;
  const bz = w * 0.016;
  return (
    <div style={{position: 'relative', width: w}}>
      <div
        style={{
          width: w,
          height: sh,
          borderRadius: w * 0.02,
          padding: bz,
          background: 'linear-gradient(160deg,#3B4150,#0B0D12 40%,#1B1F29)',
          boxShadow: `0 ${w * 0.05}px ${w * 0.18}px rgba(0,0,0,0.6), 0 0 ${w * 0.4}px rgba(226,190,120,${glow}), 0 0 0 ${Math.max(1, w * 0.002)}px rgba(240,220,170,0.28) inset`,
        }}
      >
        <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: w * 0.008, overflow: 'hidden', background: '#080B15'}}>
          {children}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(120deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 28%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
      <div
        style={{
          width: w * 1.1,
          height: w * 0.024,
          marginLeft: -w * 0.05,
          borderRadius: `0 0 ${w * 0.03}px ${w * 0.03}px`,
          background: 'linear-gradient(#5B6273,#1A1E28 70%,#0D1016)',
          boxShadow: `0 ${w * 0.02}px ${w * 0.05}px rgba(0,0,0,0.6)`,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            width: w * 0.14,
            height: w * 0.008,
            borderRadius: `0 0 ${w * 0.01}px ${w * 0.01}px`,
            background: 'linear-gradient(#0D1016,#2A2F3B)',
          }}
        />
      </div>
    </div>
  );
};
