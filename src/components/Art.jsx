// Original SVG illustrations for each project. No screenshots, everything is drawn in code
// and follows the theme through CSS variables.

export function VisionArt() {
  return (
    <svg viewBox="0 0 320 200" className="art" role="img" aria-label="Video frame with detection boxes">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="var(--line)" strokeWidth="1" />
        </pattern>
        <linearGradient id="scan" x1="0" x2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="318" height="198" rx="14" fill="var(--surface-2)" stroke="var(--line)" />
      <rect x="1" y="1" width="318" height="198" rx="14" fill="url(#grid)" />
      <circle cx="96" cy="80" r="14" fill="var(--line-strong)" />
      <path d="M68 142c3-26 15-38 28-38s25 12 28 38z" fill="var(--line-strong)" />
      <rect x="190" y="112" width="106" height="42" rx="9" fill="var(--line-strong)" />
      <circle cx="212" cy="156" r="8" fill="var(--line-strong)" />
      <circle cx="276" cy="156" r="8" fill="var(--line-strong)" />
      <g className="box b1">
        <rect x="62" y="56" width="68" height="94" rx="5" />
        <rect x="62" y="38" width="84" height="18" rx="4" className="tag" />
        <text x="69" y="51">person 0.98</text>
      </g>
      <g className="box b2">
        <rect x="80" y="66" width="32" height="30" rx="4" />
        <text x="136" y="84" className="mini">face</text>
      </g>
      <g className="box b3">
        <rect x="184" y="106" width="118" height="54" rx="5" />
        <rect x="184" y="88" width="92" height="18" rx="4" className="tag" />
        <text x="191" y="101">vehicle 0.96</text>
      </g>
      <g className="box b4">
        <rect x="228" y="134" width="46" height="16" rx="3" />
        <text x="232" y="176" className="mini">TN 09 · OCR</text>
      </g>
      <rect className="scanline" x="0" y="0" width="320" height="26" fill="url(#scan)" />
      <text x="14" y="188" className="hud">CAM 03 · LIVE</text>
      <circle cx="300" cy="18" r="4.5" fill="var(--accent)" className="blink" />
    </svg>
  );
}

export function PoseArt() {
  return (
    <svg viewBox="0 0 320 200" className="art" role="img" aria-label="Pose landmarks with feedback">
      <rect x="1" y="1" width="318" height="198" rx="14" fill="var(--surface-2)" stroke="var(--line)" />
      <g transform="translate(20 -4) scale(0.92)">
      <g transform="translate(30 0)">
      <g stroke="var(--text-2)" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M150 62v46" />
        <path d="M150 74 112 96 96 132" />
        <path d="M150 74 188 58 214 34" className="hl" />
        <path d="M150 108 132 156 126 200" />
        <path d="M150 108 172 154 190 196" />
      </g>
      <circle cx="150" cy="44" r="14" fill="none" stroke="var(--text-2)" strokeWidth="3" />
      {[[150, 74], [112, 96], [96, 132], [188, 58], [214, 34], [150, 108], [132, 156], [126, 200], [172, 154], [190, 196]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="var(--accent)" className="joint" style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
      <path d="M188 58a30 30 0 0 1 22 -10" stroke="var(--accent)" strokeWidth="2" fill="none" strokeDasharray="3 4" />
      </g>
      <g transform="translate(14 152)">
        <rect width="128" height="50" rx="10" fill="var(--surface)" stroke="var(--line-strong)" />
        <text x="10" y="20" className="hud">FEEDBACK</text>
        <text x="10" y="37" className="msg">Raise arm higher</text>
      </g>
      </g>
    </svg>
  );
}

export function ObservabilityArt() {
  return (
    <svg viewBox="0 0 320 200" className="art" role="img" aria-label="Token usage chart">
      <rect x="1" y="1" width="318" height="198" rx="14" fill="var(--surface-2)" stroke="var(--line)" />
      {[50, 90, 130, 170].map((y) => (
        <path key={y} d={`M18 ${y}H302`} stroke="var(--line)" strokeDasharray="2 5" />
      ))}
      <path d="M18 150 70 120 120 132 170 80 220 96 270 52 302 60" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" pathLength={1} className="draw" />
      <path d="M18 150 70 120 120 132 170 80 220 96 270 52 302 60V180H18Z" fill="var(--accent)" opacity="0.10" />
      <path d="M18 168 70 154 120 160 170 128 220 140 270 108 302 116" fill="none" stroke="var(--violet)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" pathLength={1} className="draw d2" />
      <path d="M18 178 70 172 120 174 170 160 220 166 270 150 302 154" fill="none" stroke="var(--text-2)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" pathLength={1} className="draw d3" />
      <g className="legend">
        <circle cx="24" cy="24" r="4" fill="var(--accent)" /><text x="34" y="28">human</text>
        <circle cx="94" cy="24" r="4" fill="var(--violet)" /><text x="104" y="28">tool</text>
        <circle cx="156" cy="24" r="4" fill="var(--text-2)" /><text x="166" y="28">agent</text>
      </g>
    </svg>
  );
}

export function RagArt() {
  return (
    <svg viewBox="0 0 320 200" className="art" role="img" aria-label="Retrieval and guardrail flow">
      <rect x="1" y="1" width="318" height="198" rx="14" fill="var(--surface-2)" stroke="var(--line)" />
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 10 5 0 10z" fill="var(--accent)" />
        </marker>
      </defs>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="20" y={54 + i * 34} width="54" height="26" rx="6" fill="var(--surface)" stroke="var(--line-strong)" />
          <path d={`M30 ${67 + i * 34}h30`} stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <path d="M80 100H100" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arr)" />
      <circle cx="136" cy="100" r="30" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
      <text x="136" y="103" textAnchor="middle" className="hud" style={{ fontSize: 8.5 }}>search</text>
      <path d="M170 100H196" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arr)" />
      <g transform="translate(236 0)">
        <path d="M0 66 30 76v26c0 20-13 32-30 40-17-8-30-20-30-40V76z" transform="translate(0 -4)" fill="var(--accent)" opacity="0.14" stroke="var(--accent)" strokeWidth="2" />
        <path d="M-13 100l10 10 20-22" transform="translate(0 -4)" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="0" y="166" textAnchor="middle" className="hud" style={{ fontSize: 8.5 }}>guardrails</text>
      </g>
    </svg>
  );
}

export function ChatArt() {
  return (
    <div className="art chat" aria-label="Chat with an assistant">
      <div className="bubble me">How many hours did the team log this week?</div>
      <div className="bubble bot">
        <span className="chip">Zoho People</span>
        <span className="chip">Jira</span>
        <span className="chip">YouTrack</span>
        <div>Pulling live data from your tools…</div>
      </div>
      <div className="bubble bot typing"><i /><i /><i /></div>
    </div>
  );
}

export function KeycloakArt() {
  return (
    <svg viewBox="0 0 320 200" className="art" role="img" aria-label="Sign-in flow through Keycloak">
      <rect x="1" y="1" width="318" height="198" rx="14" fill="var(--surface-2)" stroke="var(--line)" />
      <defs>
        <marker id="arr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 10 5 0 10z" fill="var(--accent)" />
        </marker>
      </defs>
      {/* user */}
      <circle cx="52" cy="84" r="14" fill="none" stroke="var(--text-2)" strokeWidth="2.5" />
      <path d="M26 128c2-18 12-26 26-26s24 8 26 26" fill="none" stroke="var(--text-2)" strokeWidth="2.5" strokeLinecap="round" />
      <text x="52" y="150" textAnchor="middle" className="hud">user</text>
      {/* keycloak */}
      <rect x="126" y="60" width="68" height="76" rx="16" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
      <rect x="146" y="90" width="28" height="22" rx="5" fill="var(--accent)" opacity="0.9" />
      <path d="M151 90v-7a9 9 0 0 1 18 0v7" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="160" cy="100" r="3" fill="var(--surface)" />
      <text x="160" y="154" textAnchor="middle" className="hud">keycloak</text>
      {/* app */}
      <rect x="240" y="66" width="60" height="64" rx="10" fill="var(--surface)" stroke="var(--line-strong)" />
      <path d="M240 84h60" stroke="var(--line-strong)" />
      <circle cx="250" cy="75" r="2" fill="var(--text-3)" /><circle cx="258" cy="75" r="2" fill="var(--text-3)" />
      <path d="M250 96h32M250 106h22M250 116h28" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" />
      <text x="270" y="150" textAnchor="middle" className="hud">your app</text>
      {/* arrows */}
      <path d="M76 98H120" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arr2)" />
      <path d="M198 98H234" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arr2)" />
      <text x="98" y="82" textAnchor="middle" className="hud" style={{ fontSize: 8.5, letterSpacing: "0.05em" }}>login</text>
      <text x="216" y="82" textAnchor="middle" className="hud" style={{ fontSize: 8.5, letterSpacing: "0.05em" }}>token</text>
      <g transform="translate(50 20)">
        <rect width="220" height="24" rx="12" fill="var(--surface)" stroke="var(--line-strong)" />
        <circle cx="16" cy="12" r="4" fill="var(--accent)" className="blink" />
        <text x="28" y="16" className="msg">themed login · OTP · migration</text>
      </g>
    </svg>
  );
}

export function FlutterArt() {
  return (
    <svg viewBox="0 0 320 200" className="art" role="img" aria-label="Employee app with a points balance, kudos and a leaderboard">
      <rect x="1" y="1" width="318" height="198" rx="14" fill="var(--surface-2)" stroke="var(--line)" />
      {/* phone */}
      <rect x="34" y="16" width="92" height="168" rx="16" fill="var(--surface)" stroke="var(--line-strong)" strokeWidth="2" />
      <rect x="66" y="22" width="28" height="4" rx="2" fill="var(--line-strong)" />
      <circle cx="80" cy="66" r="20" fill="var(--accent)" />
      <text x="80" y="72" textAnchor="middle" style={{ fill: 'var(--accent-ink)', fontSize: 17, fontWeight: 700 }}>P</text>
      <text x="80" y="102" textAnchor="middle" className="msg" style={{ fontSize: 11 }}>1,240 pts</text>
      <rect x="48" y="114" width="64" height="26" rx="8" fill="var(--surface-2)" stroke="var(--line-strong)" />
      <circle cx="60" cy="127" r="5" fill="var(--line-strong)" />
      <path d="M70 124h34M70 131h22" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" />
      <rect x="48" y="148" width="64" height="26" rx="8" fill="var(--surface-2)" stroke="var(--line-strong)" />
      <circle cx="60" cy="161" r="5" fill="var(--line-strong)" />
      <path d="M70 158h34M70 165h22" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" />

      {/* feature cards */}
      {[
        ['kudos', 'recognition'],
        ['leaderboard', 'top performers'],
        ['rewards', 'redeem points'],
      ].map(([t, sub], i) => (
        <g key={t} transform={`translate(150 ${26 + i * 52})`}>
          <rect width="150" height="42" rx="12" fill="var(--surface)" stroke="var(--line-strong)" />
          <circle cx="24" cy="21" r="10" fill={i === 0 ? 'var(--accent)' : 'none'} stroke="var(--accent)" strokeWidth="2" />
          <text x="44" y="19" className="msg" style={{ fontSize: 11, fontWeight: 500 }}>{t}</text>
          <text x="44" y="32" className="hud" style={{ fontSize: 8 }}>{sub}</text>
        </g>
      ))}
    </svg>
  );
}

export function CattleArt() {
  return (
    <svg viewBox="0 0 320 200" className="art" role="img" aria-label="Cattle detection with behaviour labels and a dashboard">
      <rect x="1" y="1" width="318" height="198" rx="14" fill="var(--surface-2)" stroke="var(--line)" />
      <rect x="14" y="16" width="190" height="130" rx="10" fill="var(--surface)" stroke="var(--line)" />
      {/* cow silhouette */}
      <g fill="var(--line-strong)">
        <rect x="52" y="64" width="98" height="46" rx="18" />
        <rect x="140" y="52" width="34" height="30" rx="12" />
        <rect x="60" y="104" width="9" height="30" rx="4" /><rect x="80" y="104" width="9" height="30" rx="4" />
        <rect x="118" y="104" width="9" height="30" rx="4" /><rect x="136" y="104" width="9" height="30" rx="4" />
      </g>
      {/* identification sticker */}
      <path d="M96 78l10 16H86z" fill="var(--violet)" />
      {/* detection box */}
      <g className="box b1">
        <rect x="46" y="46" width="134" height="92" rx="6" />
        <rect x="46" y="28" width="84" height="18" rx="4" className="tag" />
        <text x="53" y="41">eating 0.94</text>
      </g>
      <g className="box b2">
        <text x="92" y="156" className="mini">ID 07 · sticker</text>
      </g>
      {/* dashboard */}
      <g transform="translate(216 16)">
        <rect width="90" height="130" rx="10" fill="var(--surface)" stroke="var(--line-strong)" />
        <text x="10" y="20" className="hud">today</text>
        <text x="10" y="44" className="msg">standing</text>
        <rect x="10" y="50" width="70" height="7" rx="3.5" fill="var(--line)" /><rect x="10" y="50" width="34" height="7" rx="3.5" fill="var(--text-2)" />
        <text x="10" y="76" className="msg">lying</text>
        <rect x="10" y="82" width="70" height="7" rx="3.5" fill="var(--line)" /><rect x="10" y="82" width="46" height="7" rx="3.5" fill="var(--violet)" />
        <text x="10" y="108" className="msg">eating</text>
        <rect x="10" y="114" width="70" height="7" rx="3.5" fill="var(--line)" /><rect x="10" y="114" width="26" height="7" rx="3.5" fill="var(--accent)" />
      </g>
      <g transform="translate(14 162)">
        <rect width="292" height="26" rx="13" fill="var(--surface)" stroke="var(--line-strong)" />
        <circle cx="16" cy="13" r="4" fill="var(--accent)" className="blink" />
        <text x="28" y="17" className="msg">alert when behaviour looks abnormal</text>
      </g>
    </svg>
  );
}

export function LbwArt() {
  return (
    <svg viewBox="0 0 320 200" className="art" role="img" aria-label="Ball trajectory predicted to hit the stumps">
      <rect x="1" y="1" width="318" height="198" rx="14" fill="var(--surface-2)" stroke="var(--line)" />
      <defs>
        <linearGradient id="pitchfill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--line-strong)" stopOpacity="0.3" />
          <stop offset="1" stopColor="var(--line-strong)" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <polygon points="74,34 146,34 186,188 34,188" fill="url(#pitchfill)" stroke="var(--line-strong)" />
      <path d="M110 34V188" stroke="var(--line)" strokeDasharray="3 5" />
      {/* stumps */}
      <g fill="var(--text)">
        <rect x="98" y="20" width="4" height="22" rx="1.5" /><rect x="108" y="20" width="4" height="22" rx="1.5" /><rect x="118" y="20" width="4" height="22" rx="1.5" />
      </g>
      {/* ball path */}
      <path d="M100 186 104 132" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M104 132 108 88" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M108 88 110 46" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="4 5" strokeLinecap="round" fill="none" />
      <circle cx="104" cy="132" r="9" fill="none" stroke="var(--accent)" strokeWidth="2" className="blink" />
      <circle cx="104" cy="132" r="3.5" fill="var(--accent)" />
      <circle cx="108" cy="88" r="5.5" fill="var(--violet)" />
      <text x="122" y="136" className="hud">pitch</text>
      <text x="122" y="92" className="hud">impact</text>
      {/* verdict */}
      <g transform="translate(206 44)">
        {[['pitching', 'in line'], ['impact', 'in line'], ['wickets', 'hitting']].map(([k, v], i) => (
          <g key={k} transform={`translate(0 ${i * 40})`}>
            <rect width="98" height="32" rx="9" fill="var(--surface)" stroke="var(--line-strong)" />
            <circle cx="16" cy="16" r="5" fill="var(--accent)" />
            <text x="28" y="14" className="hud">{k}</text>
            <text x="28" y="26" className="msg">{v}</text>
          </g>
        ))}
      </g>
      <text x="206" y="182" className="hud">1 camera</text>
    </svg>
  );
}

export const arts = {
  vision: VisionArt,
  pose: PoseArt,
  observability: ObservabilityArt,
  rag: RagArt,
  chat: ChatArt,
  keycloak: KeycloakArt,
  flutter: FlutterArt,
  cattle: CattleArt,
  lbw: LbwArt,
};

export function Icon({ name }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  switch (name) {
    case 'github':
      return (
        <svg {...common}><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></svg>
      );
    case 'linkedin':
      return (
        <svg {...common}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" /></svg>
      );
    case 'leetcode':
      return (
        <svg {...common}><path d="M13.5 3 4.6 12.2a3 3 0 0 0 0 4.2l3.4 3.4a3 3 0 0 0 4.2 0L15 17M9 12h11" /></svg>
      );
    case 'mail':
      return (
        <svg {...common}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 8 8 6 8-6" /></svg>
      );
    case 'arrow':
      return (
        <svg {...common}><path d="M7 17 17 7M8 7h9v9" /></svg>
      );
    case 'sun':
      return (
        <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      );
    case 'moon':
      return (
        <svg {...common}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
      );
    case 'copy':
      return (
        <svg {...common}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
      );
    default:
      return null;
  }
}
