import React from 'react';

type P = {size?: number; color?: string; stroke?: number; style?: React.CSSProperties};

const base = (p: P, children: React.ReactNode, fill = false) => (
  <svg
    width={p.size ?? 24}
    height={p.size ?? 24}
    viewBox="0 0 24 24"
    fill={fill ? p.color ?? 'currentColor' : 'none'}
    stroke={fill ? 'none' : p.color ?? 'currentColor'}
    strokeWidth={p.stroke ?? 1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{display: 'block', flexShrink: 0, ...p.style}}
  >
    {children}
  </svg>
);

export const IconChat = (p: P) => base(p, <path d="M4 5.5h16v11H9.5L5 20.5v-4H4z" />);
export const IconPhone = (p: P) =>
  base(p, <path d="M6.6 3.5l2.3 4.1-1.8 1.7a11.5 11.5 0 0 0 5.6 5.6l1.7-1.8 4.1 2.3-.6 3c-.2.9-1 1.6-1.9 1.6A15.6 15.6 0 0 1 3 6c0-.9.7-1.700 1.6-1.900z" />);
export const IconCalendar = (p: P) => base(p, <path d="M4 6.5h16V20H4zM4 10.5h16M8 3.5v4M16 3.5v4" />);
export const IconHome = (p: P) => base(p, <path d="M3 11l9-7 9 7M5.5 9.5V20h4.5v-6h4v6h4.5V9.5" />);
export const IconQuestion = (p: P) => base(p, <path d="M9.2 9.2a2.9 2.9 0 1 1 4 2.7c-.8.4-1.200.9-1.200 1.800M12 17.500h.01" />);
export const IconCheck = (p: P) => base(p, <path d="M5 12.500l4.500 4.500L19 7.500" />);
export const IconClock = (p: P) => base(p, <><circle cx="12" cy="12" r="8.500" /><path d="M12 7.500V12l3 2" /></>);
export const IconMoon = (p: P) => base(p, <path d="M20 14.500A8 8 0 1 1 9.500 4a6.500 6.500 0 0 0 10.500 10.500z" />);
export const IconPin = (p: P) => base(p, <><path d="M12 21s7-6 7-11.500A7 7 0 0 0 5 9.500C5 15 12 21 12 21z" /><circle cx="12" cy="9.500" r="2.500" /></>);
export const IconEuro = (p: P) => base(p, <path d="M17.500 7.500a6 6 0 1 0 0 9M5.500 10.500h8.500M5.500 13.500h8.500" />);
export const IconUser = (p: P) => base(p, <><circle cx="12" cy="8" r="4" /><path d="M4 20.500c0-3.800 3.600-6 8-6s8 2.200 8 6" /></>);
export const IconBell = (p: P) => base(p, <path d="M6 16.500V11a6 6 0 0 1 12 0v5.500l1.500 2h-15zM10 20.500a2 2 0 0 0 4 0" />);
export const IconKey = (p: P) => base(p, <><circle cx="8" cy="15" r="4" /><path d="M11 12l8-8M16 7l2.500 2.500" /></>);
export const IconSend = (p: P) => base(p, <path d="M3.500 11.500L20.500 4l-6 16.500-3-7z" />);
export const IconUsers = (p: P) => base(p, <><circle cx="9" cy="8.500" r="3.500" /><path d="M2.500 20c0-3.400 2.900-5.500 6.500-5.500S15.500 16.600 15.500 20M16 5.300a3.400 3.400 0 0 1 0 6.400M18 14.800c2.100.7 3.500 2.400 3.500 5.200" /></>);

/** Étincelle IA : étoile à quatre branches */
export const IconSpark = (p: P) =>
  base(p, <path d="M12 2.500c.7 4.800 2.600 8.700 9.500 9.500-6.900.8-8.800 4.700-9.500 9.500-.7-4.800-2.600-8.700-9.500-9.500 6.900-.8 8.800-4.700 9.500-9.500z" />, true);
