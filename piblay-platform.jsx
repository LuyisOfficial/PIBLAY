import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ADMINS = {
  "odthanempire@gmail.com": { id:"@OdthanEmpire2002", name:"OdthanEmpire", level:1, role:"Super Admin", password:"Admin@2002" },
  "info.piblay@gmail.com":  { id:"@Piblay.com2002",   name:"Piblay Admin",  level:2, role:"Admin Normal", password:"Piblay@2002" },
};
const AGENCIES_DATA = [
  { id:1, name:"Créacom Haïti",  spec:"Social Media & Branding", email:"creacom@haiti.com",  status:"active",    cmp:12, rating:4.8, clients:24, rev:48000 },
  { id:2, name:"DigiMarket",     spec:"SEO & Google Ads",        email:"digi@market.com",    status:"active",    cmp:8,  rating:4.6, clients:15, rev:32000 },
  { id:3, name:"VisionAds",      spec:"Vidéo & Influence",       email:"vision@ads.com",     status:"suspended", cmp:3,  rating:4.2, clients:7,  rev:12000 },
  { id:4, name:"MediaPro Haiti", spec:"Print & Affichage",       email:"media@pro.ht",       status:"active",    cmp:5,  rating:4.4, clients:11, rev:21000 },
];
const BIZS_DATA = [
  { id:101, name:"Supermarché MegaPlus", email:"mega@plus.ht",    sector:"Commerce",     status:"approved", cmp:3, budget:15000, reg:"HT-2023-001", phone:"+509 36 00 0001", address:"Pétion-Ville, HT" },
  { id:102, name:"Restaurant Lakay",     email:"lakay@food.ht",   sector:"Restauration", status:"pending",  cmp:0, budget:5000,  reg:"HT-2023-045", phone:"+509 37 00 0002", address:"Port-au-Prince, HT" },
  { id:103, name:"TechVision IT",        email:"tech@vision.ht",  sector:"Technologie",  status:"approved", cmp:7, budget:25000, reg:"HT-2022-112", phone:"+509 38 00 0003", address:"Delmas, HT" },
  { id:104, name:"Bijouterie Éclat",     email:"eclat@bijoux.ht", sector:"Mode/Beauté",  status:"pending",  cmp:0, budget:3000,  reg:"HT-2024-009", phone:"+509 39 00 0004", address:"Cap-Haïtien, HT" },
];
const CAMPS_DATA = [
  { id:1001, bizId:101, agId:1, title:"Promotion Été 2025",       budget:5000,  status:"active",    clicks:12400, imp:89000,  start:"2025-06-01", end:"2025-06-30", target:"Port-au-Prince" },
  { id:1002, bizId:103, agId:2, title:"Lancement App Mobile",     budget:8000,  status:"pending",   clicks:0,     imp:0,      start:"2025-07-15", end:"2025-08-15", target:"Haïti" },
  { id:1003, bizId:101, agId:1, title:"Soldes Fin d'Année",       budget:12000, status:"completed", clicks:34000, imp:210000, start:"2024-12-01", end:"2024-12-31", target:"Haïti" },
  { id:1004, bizId:103, agId:4, title:"Campagne Recrutement Dev", budget:3500,  status:"active",    clicks:4200,  imp:31000,  start:"2025-05-10", end:"2025-06-10", target:"International" },
];
const PROPS_DATA = [
  { id:301, campId:1002, agId:2, amount:7500, details:"Stratégie SEO + Google Ads 30 jours, rapports hebdomadaires inclus.", status:"pending",  date:"2025-05-10" },
  { id:302, campId:1002, agId:1, amount:8200, details:"Social Media + vidéo promotionnel + Meta Ads ciblées.",              status:"pending",  date:"2025-05-11" },
  { id:303, campId:1001, agId:4, amount:4800, details:"Affichage + print + digital Port-au-Prince, durée 30 jours.",       status:"accepted", date:"2025-05-08" },
];
const AGENTS_DATA = [
  { id:201, name:"Jean Pierre",  email:"jeanpierre@piblay.com", role:"Support",    addedBy:"@OdthanEmpire2002", status:"active",    tickets:32 },
  { id:202, name:"Marie Claire", email:"marie@piblay.com",      role:"Modération", addedBy:"@Piblay.com2002",   status:"active",    tickets:18 },
  { id:203, name:"Paul Durand",  email:"paul@piblay.com",       role:"Commercial", addedBy:"@OdthanEmpire2002", status:"suspended", tickets:7  },
];
const PLANS = [
  { name:"Starter",    price:29,         col:"#64ffda", features:["3 campagnes/mois","Analytics basiques","1 agence partenaire","Support email"] },
  { name:"Pro",        price:99,         col:"#00d4ff", features:["Campagnes illimitées","Analytics avancés","Toutes agences","Support prioritaire","Rapports PDF"], hot:true },
  { name:"Enterprise", price:"Sur devis",col:"#ffd700", features:["Tout Pro inclus","Gestionnaire dédié","API access","SLA garanti","Onboarding perso"] },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#060d1a;--bg2:#0a192f;--bg3:#0f2444;--bg4:#071426;
  --c:#00d4ff;--c2:#00a8cc;--g:#64ffda;--ac:#ff6b6b;--go:#ffd700;--pu:#a78bfa;
  --t:#e8f4f8;--t2:#8892b0;--t3:#4a5568;
  --b:rgba(0,212,255,.12);--b2:rgba(0,212,255,.06);
  --card:rgba(10,25,47,.88);
}
body{background:var(--bg);color:var(--t);font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden;font-size:14px}
h1,h2,h3,h4,h5{font-family:'Syne',sans-serif;line-height:1.15}
input,select,textarea,button{font-family:inherit}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:var(--bg2)}
::-webkit-scrollbar-thumb{background:rgba(0,212,255,.4);border-radius:2px}

@keyframes up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes glow{0%,100%{box-shadow:0 0 18px rgba(0,212,255,.25)}50%{box-shadow:0 0 40px rgba(0,212,255,.6)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes barIn{from{height:0}to{height:var(--h)}}
@keyframes shimmer{0%{bg-position:-200% 0}100%{background-position:200% 0}}

.aup{animation:up .5s ease both}
.afi{animation:fi .3s ease both}
.aglow{animation:glow 2s ease-in-out infinite}
.apulse{animation:pulse 1.5s ease-in-out infinite}

.grid-bg{background-image:linear-gradient(rgba(0,212,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.022) 1px,transparent 1px);background-size:52px 52px}
.hg{background:radial-gradient(ellipse 100% 65% at 50% 0%,rgba(0,212,255,.09) 0%,transparent 65%)}

/* Cards */
.card{background:var(--card);border:1px solid var(--b);border-radius:14px;backdrop-filter:blur(18px)}
.ch{transition:all .28s}
.ch:hover{transform:translateY(-3px);border-color:rgba(0,212,255,.3);box-shadow:0 12px 36px rgba(0,0,0,.35)}

/* Buttons */
.btn{display:inline-flex;align-items:center;gap:7px;border-radius:8px;padding:9px 16px;font-size:13px;font-weight:600;cursor:pointer;border:none;white-space:nowrap;transition:all .22s;font-family:'Syne',sans-serif}
.bp{background:linear-gradient(135deg,var(--c),var(--c2));color:var(--bg)}
.bp:hover{transform:translateY(-2px);box-shadow:0 7px 22px rgba(0,212,255,.4)}
.bo{background:transparent;color:var(--c);border:1px solid var(--b)}
.bo:hover{border-color:var(--c);background:rgba(0,212,255,.07)}
.bg{background:transparent;color:var(--t2);border:1px solid var(--b2)}
.bg:hover{color:var(--t);border-color:var(--b);background:rgba(0,212,255,.04)}
.bd{background:rgba(255,107,107,.1);color:var(--ac);border:1px solid rgba(255,107,107,.25)}
.bd:hover{background:rgba(255,107,107,.2)}
.bsu{background:rgba(100,255,218,.1);color:var(--g);border:1px solid rgba(100,255,218,.25)}
.bsu:hover{background:rgba(100,255,218,.2)}
.bw{width:100%;justify-content:center}
.bsm{padding:6px 11px;font-size:12px}
.bxs{padding:4px 8px;font-size:11px}
.btn:disabled{opacity:.45;cursor:not-allowed;transform:none !important}
.bico{padding:7px;background:transparent;border:1px solid var(--b2);color:var(--t2);border-radius:8px;cursor:pointer;display:flex}
.bico:hover{border-color:var(--b);color:var(--c);background:rgba(0,212,255,.04)}

/* Inputs */
.inp{background:rgba(0,212,255,.04);border:1px solid var(--b);border-radius:8px;padding:10px 13px;color:var(--t);width:100%;outline:none;transition:all .22s;font-size:13px}
.inp:focus{border-color:var(--c);box-shadow:0 0 0 3px rgba(0,212,255,.08)}
.inp::placeholder{color:var(--t3)}
select.inp option{background:var(--bg2)}
textarea.inp{resize:vertical;min-height:88px}
.lbl{font-size:10px;font-weight:700;color:var(--t2);letter-spacing:.8px;text-transform:uppercase;margin-bottom:5px;display:block}

/* Badges */
.bad{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.2px}
.ba{background:rgba(100,255,218,.12);color:var(--g);border:1px solid rgba(100,255,218,.25)}
.bp2{background:rgba(255,215,0,.12);color:var(--go);border:1px solid rgba(255,215,0,.25)}
.br{background:rgba(255,107,107,.12);color:var(--ac);border:1px solid rgba(255,107,107,.25)}
.bc{background:rgba(0,212,255,.12);color:var(--c);border:1px solid rgba(0,212,255,.25)}

/* Table */
.tbl{width:100%;border-collapse:collapse}
.tbl th{padding:10px 13px;text-align:left;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--t2);border-bottom:1px solid var(--b)}
.tbl td{padding:12px 13px;font-size:12px;border-bottom:1px solid rgba(0,212,255,.04);vertical-align:middle}
.tbl tr:last-child td{border-bottom:none}
.tbl tr:hover td{background:rgba(0,212,255,.02)}

/* Sidebar */
.sb{width:228px;min-height:100vh;background:var(--bg2);border-right:1px solid var(--b);position:fixed;left:0;top:0;z-index:100;display:flex;flex-direction:column;transition:transform .28s}
.ni{display:flex;align-items:center;gap:10px;padding:10px 16px;color:var(--t2);cursor:pointer;border-left:3px solid transparent;transition:all .18s;font-size:13px;background:none;border-top:none;border-right:none;border-bottom:none;width:100%;text-align:left}
.ni:hover{color:var(--c);background:rgba(0,212,255,.04)}
.ni.ac{color:var(--c);border-left-color:var(--c);background:rgba(0,212,255,.07)}
.nsec{padding:12px 16px 5px;font-size:9px;font-weight:700;color:var(--t3);letter-spacing:1.5px;text-transform:uppercase}

/* Main */
.main{flex:1;margin-left:228px;min-height:100vh}
.top{height:60px;background:var(--bg2);border-bottom:1px solid var(--b);display:flex;align-items:center;justify-content:space-between;padding:0 22px;position:sticky;top:0;z-index:50}
.pg{padding:22px}

/* Stat */
.stat{background:var(--card);border:1px solid var(--b);border-radius:12px;padding:18px;transition:all .25s}
.stat:hover{border-color:rgba(0,212,255,.28);transform:translateY(-2px)}

/* Progress */
.pb{height:4px;background:var(--bg3);border-radius:3px;overflow:hidden}
.pf{height:100%;border-radius:3px;transition:width 1.1s ease}

/* Modal */
.mbg{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(5px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;animation:fi .2s ease}
.mbox{background:var(--bg2);border:1px solid var(--b);border-radius:16px;width:100%;max-width:500px;max-height:92vh;overflow-y:auto;animation:up .28s ease;box-shadow:0 24px 64px rgba(0,0,0,.55)}

/* Chat */
.cb{max-width:70%;padding:9px 13px;border-radius:13px;font-size:12px;line-height:1.55}
.cm{background:linear-gradient(135deg,var(--c2),var(--c));color:var(--bg);border-bottom-right-radius:3px;align-self:flex-end}
.ct{background:var(--bg3);border:1px solid var(--b);border-bottom-left-radius:3px;align-self:flex-start}

/* Notif panel */
.np{position:absolute;top:52px;right:0;width:320px;background:var(--bg2);border:1px solid var(--b);border-radius:13px;box-shadow:0 16px 48px rgba(0,0,0,.4);z-index:200;animation:up .22s ease;overflow:hidden}
.ni2{padding:12px 15px;border-bottom:1px solid var(--b2);cursor:pointer;transition:background .18s}
.ni2:hover{background:rgba(0,212,255,.04)}
.ni2.un{background:rgba(0,212,255,.03)}

/* Toast */
.tswrap{position:fixed;bottom:22px;right:22px;display:flex;flex-direction:column;gap:7px;z-index:9999}
.ts{background:var(--bg2);border:1px solid var(--g);border-radius:11px;padding:12px 16px;font-size:12px;display:flex;align-items:center;gap:9px;box-shadow:0 8px 28px rgba(0,0,0,.4);animation:up .28s ease;min-width:240px}
.ts.err{border-color:var(--ac)}
.ts.warn{border-color:var(--go)}

/* Live dot */
.ld{width:6px;height:6px;background:var(--g);border-radius:50%;display:inline-block;animation:pulse 1.5s infinite}

/* Notif badge */
.nb{position:absolute;top:-5px;right:-5px;width:16px;height:16px;background:var(--ac);border-radius:50%;font-size:8px;font-weight:800;color:#fff;display:flex;align-items:center;justify-content:center;border:2px solid var(--bg2)}

/* Avatar */
.av{border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;flex-shrink:0}

/* Chip */
.chip{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:600;background:rgba(0,212,255,.06);border:1px solid var(--b);color:var(--t2)}

/* Step bar */
.stepbar{display:flex;gap:5px;margin-bottom:22px}
.stepseg{flex:1;height:3px;border-radius:2px;transition:all .35s}

/* ox = overflow-x scroll */
.ox{overflow-x:auto}

@media(max-width:768px){
  .sb{transform:translateX(-100%)}
  .sb.op{transform:translateX(0)}
  .main{margin-left:0!important}
  .hm{display:none!important}
  .pg{padding:14px}
}
`;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const I = ({ n, s = 17 }) => ({
  logo:    <svg width={s} height={s} viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#00d4ff" opacity=".14"/><path d="M10 20 Q20 8 30 20 Q20 32 10 20Z" fill="#00d4ff"/><circle cx="20" cy="20" r="4" fill="#0a192f"/></svg>,
  dash:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  camp:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  users:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  house:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  chart:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  money:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  msg:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  bell:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  gear:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  out:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  ok:      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  shield:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  plus:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  eye:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  arr:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  menu:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  agent:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  log:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  send:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  bid:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  file:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>,
  lock:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  star:    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  priv:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  edit:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  port:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  world:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
})[n] || null;

// ─── UTILS ────────────────────────────────────────────────────────────────────
function useToasts() {
  const [list, setList] = useState([]);
  const add = useCallback((msg, type = "ok") => {
    const id = Date.now();
    setList(l => [...l, { id, msg, type }]);
    setTimeout(() => setList(l => l.filter(x => x.id !== id)), 3800);
  }, []);
  return [list, add];
}

function Av({ name = "?", size = 34, color = "var(--c)" }) {
  const init = (name || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  return <div className="av" style={{ width: size, height: size, fontSize: size * .36, background: `${color}18`, border: `1.5px solid ${color}45`, color }}>{init}</div>;
}

function Bar({ data, labels, color = "var(--c)", h = 120 }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: h, paddingTop: 6 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
          <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
            <div style={{ width: "100%", height: `${(v / max) * 100}%`, minHeight: 2, background: `linear-gradient(180deg,${color},${color}38)`, borderRadius: "3px 3px 0 0", transition: "height .9s ease" }} />
          </div>
          {labels && <span style={{ fontSize: 8, color: "var(--t2)", whiteSpace: "nowrap" }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

function Prog({ pct, color = "var(--c)" }) {
  return <div className="pb"><div className="pf" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}88)` }} /></div>;
}

function StatCard({ label, value, icon, color = "var(--c)", trend, delay = 0 }) {
  return (
    <div className="stat aup" style={{ animationDelay: `${delay}ms` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ color: "var(--t2)", fontSize: 9, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 9 }}>{label}</p>
          <p style={{ fontSize: 24, fontFamily: "Syne", fontWeight: 800, color, lineHeight: 1 }}>{value}</p>
          {trend && <p style={{ fontSize: 10, color: trend.startsWith("↑") ? "var(--g)" : trend.startsWith("↓") ? "var(--ac)" : "var(--t2)", marginTop: 5 }}>{trend}</p>}
        </div>
        <div style={{ background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 9, padding: 9, color, flexShrink: 0 }}>
          <I n={icon} s={19} />
        </div>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const h = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return (
    <div className="mbg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mbox">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 22px 0" }}>
          <h3 style={{ fontFamily: "Syne", fontSize: 16, fontWeight: 700, color: "var(--c)" }}>{title}</h3>
          <button className="bico" onClick={onClose}><I n="close" s={15} /></button>
        </div>
        <div style={{ padding: "18px 22px 22px", display: "flex", flexDirection: "column", gap: 13 }}>{children}</div>
      </div>
    </div>
  );
}

function Badge({ status }) {
  const m = { active: "ba", approved: "ba", pending: "bp2", suspended: "br", rejected: "br", completed: "bc", accepted: "ba" };
  return <span className={`bad ${m[status] || "bc"}`}>{status}</span>;
}

// ─── SHELL ────────────────────────────────────────────────────────────────────
function Shell({ user, active, setActive, onLogout, nav, notifs = [], onMarkRead, children }) {
  const [sideOpen, setSideOpen] = useState(false);
  const [nOpen, setNOpen] = useState(false);
  const nRef = useRef();
  const unread = notifs.filter(n => n.unread).length;
  const rc = { admin: "var(--go)", agency: "var(--pu)", business: "var(--g)" }[user.userType] || "var(--c)";

  useEffect(() => {
    const h = e => { if (nRef.current && !nRef.current.contains(e.target)) setNOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div style={{ display: "flex" }}>
      {sideOpen && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 99 }} onClick={() => setSideOpen(false)} />}
      {/* Sidebar */}
      <aside className={`sb ${sideOpen ? "op" : ""}`}>
        <div style={{ padding: "17px 16px 13px", borderBottom: "1px solid var(--b)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <I n="logo" s={32} />
            <div>
              <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 17, color: "var(--c)", letterSpacing: 1.5 }}>PIBLAY</div>
              <div style={{ fontSize: 8, color: "var(--t2)", letterSpacing: 1, textTransform: "uppercase" }}>Plateforme Publicitaire</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "7px 0" }}>
          {nav.map((item, i) => {
            if (item.sec) return <div key={i} className="nsec">{item.sec}</div>;
            return (
              <button key={item.id} className={`ni ${active === item.id ? "ac" : ""}`} onClick={() => { setActive(item.id); setSideOpen(false); }}>
                <I n={item.icon} s={15} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge > 0 && <span style={{ background: "var(--ac)", borderRadius: 9, fontSize: 9, fontWeight: 800, color: "#fff", padding: "2px 6px" }}>{item.badge}</span>}
              </button>
            );
          })}
        </div>
        <div style={{ padding: 13, borderTop: "1px solid var(--b)" }}>
          <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 10 }}>
            <div style={{ position: "relative" }}>
              <Av name={user.name || user.email} size={34} color={rc} />
              <div style={{ position: "absolute", bottom: 1, right: 1, width: 8, height: 8, background: "var(--g)", borderRadius: "50%", border: "2px solid var(--bg2)" }} />
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name || user.email?.split("@")[0]}</div>
              <div style={{ fontSize: 9, color: rc, fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>{user.role || user.userType}</div>
            </div>
          </div>
          <button className="btn bg bw bsm" onClick={onLogout}><I n="out" s={12} /> Déconnexion</button>
        </div>
      </aside>
      {/* Main */}
      <div className="main">
        <div className="top">
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <button className="bico" onClick={() => setSideOpen(true)} style={{ display: "none" }}><I n="menu" /></button>
            <div>
              <h2 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700 }}>{nav.find(n => n.id === active)?.label || "Dashboard"}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "var(--t2)" }}>
                <span className="ld" /> En ligne · {new Date().toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ position: "relative" }} ref={nRef}>
              <button className="bico" onClick={() => setNOpen(!nOpen)}><I n="bell" s={17} /></button>
              {unread > 0 && <div className="nb">{unread > 9 ? "9+" : unread}</div>}
              {nOpen && (
                <div className="np">
                  <div style={{ padding: "12px 14px 9px", borderBottom: "1px solid var(--b)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "Syne", fontSize: 13, fontWeight: 700 }}>Notifications</span>
                    {unread > 0 && <button className="btn bg bxs" onClick={onMarkRead}>Tout lire</button>}
                  </div>
                  <div style={{ maxHeight: 300, overflowY: "auto" }}>
                    {notifs.length === 0 ? <div style={{ padding: 20, textAlign: "center", color: "var(--t2)", fontSize: 12 }}>Aucune notification</div> :
                      notifs.map(n => (
                        <div key={n.id} className={`ni2 ${n.unread ? "un" : ""}`}>
                          <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${n.color || "var(--c)"}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{n.icon || "🔔"}</div>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 11, color: "var(--t)", fontWeight: n.unread ? 600 : 400 }}>{n.text}</p>
                              <p style={{ fontSize: 9, color: "var(--t2)", marginTop: 2 }}>{n.time}</p>
                            </div>
                            {n.unread && <div style={{ width: 5, height: 5, background: "var(--c)", borderRadius: "50%", flexShrink: 0, marginTop: 3 }} />}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 11px", background: `${rc}0e`, border: `1px solid ${rc}28`, borderRadius: 18 }}>
              <Av name={user.name || user.email} size={22} color={rc} />
              <span style={{ fontSize: 11, fontWeight: 600, color: rc }}>{user.id || user.email?.split("@")[0]}</span>
            </div>
          </div>
        </div>
        <div className="pg">{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  LANDING
// ─────────────────────────────────────────────────────────────────────────────
function Landing({ onNav }) {
  const feats = [
    { icon: "camp",  title: "Campagnes Ciblées",     desc: "Gérez vos campagnes avec un ciblage précis : géographique, démographique et comportemental. Résultats en temps réel." },
    { icon: "house", title: "Réseau d'Agences Élites",desc: "Agences marketing vérifiées et évaluées. Comparez les offres, sélectionnez le meilleur partenaire." },
    { icon: "chart", title: "Analytics Avancés",      desc: "CTR, CPC, CPM, ROAS, conversions. Tableaux visuels, rapports automatiques PDF et Excel exportables." },
    { icon: "shield",title: "Sécurité Maximale",      desc: "AES-256, RGPD, 2FA, audit logs. Vos données sont chiffrées et ne sont jamais revendues à des tiers." },
    { icon: "msg",   title: "Messagerie Temps Réel",  desc: "Échangez instantanément avec vos agences. Historique complet et notifications push en temps réel." },
    { icon: "money", title: "Paiements Sécurisés",    desc: "Stripe, PayPal, Mobile Money. Facturation PDF automatique. Transparence totale sur chaque transaction." },
  ];

  return (
    <div>
      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(6,13,26,.93)", backdropFilter: "blur(22px)", borderBottom: "1px solid var(--b)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 22px", height: 66, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <I n="logo" s={34} />
            <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20, color: "var(--c)", letterSpacing: 2 }}>PIBLAY</span>
          </div>
          <div style={{ display: "flex", gap: 9 }}>
            <button className="btn bg bsm" onClick={() => onNav("login")}>Connexion</button>
            <button className="btn bp bsm aglow" onClick={() => onNav("register")}>Créer un compte</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="grid-bg hg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 66 }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "78px 22px", textAlign: "center" }}>
          <div className="aup" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(0,212,255,.07)", border: "1px solid var(--b)", borderRadius: 22, padding: "5px 15px", marginBottom: 26, fontSize: 11, color: "var(--c)", fontWeight: 600 }}>
            <span className="ld" /> Plateforme Publicitaire SaaS · Nouvelle Génération
          </div>
          <h1 className="aup" style={{ fontFamily: "Syne", fontSize: "clamp(36px,7vw,76px)", fontWeight: 800, lineHeight: 1.08, marginBottom: 20, animationDelay: "50ms" }}>
            Publicité Digitale<br />
            <span style={{ background: "linear-gradient(135deg,var(--c),var(--g))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Sans Frontières
            </span>
          </h1>
          <p className="aup" style={{ fontSize: 16, color: "var(--t2)", maxWidth: 540, margin: "0 auto 32px", lineHeight: 1.8, animationDelay: "110ms" }}>
            PIBLAY connecte entreprises et agences marketing pour créer des campagnes performantes, mesurables et rentables.
          </p>
          <div className="aup" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animationDelay: "170ms" }}>
            <button className="btn bp aglow" onClick={() => onNav("register")} style={{ padding: "12px 28px", fontSize: 14 }}>
              🚀 Commencer gratuitement <I n="arr" s={14} />
            </button>
            <button className="btn bo" onClick={() => onNav("login")} style={{ padding: "12px 28px", fontSize: 14 }}>
              Se connecter
            </button>
          </div>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, maxWidth: 760, margin: "56px auto 0" }}>
            {[["500+","Entreprises"],["80+","Agences"],["2M+","Impressions/mois"],["98%","Satisfaction"]].map(([v, l], i) => (
              <div key={i} className="card aup" style={{ padding: "18px 14px", textAlign: "center", animationDelay: `${220 + i * 55}ms` }}>
                <div style={{ fontSize: 28, fontFamily: "Syne", fontWeight: 800, color: "var(--c)" }}>{v}</div>
                <div style={{ fontSize: 11, color: "var(--t2)", marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "88px 22px", maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontFamily: "Syne", fontSize: "clamp(24px,4vw,44px)", fontWeight: 800, marginBottom: 12 }}>Tout ce dont vous avez besoin</h2>
          <p style={{ color: "var(--t2)", fontSize: 14 }}>Une plateforme complète — de la création à l'optimisation</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 18 }}>
          {feats.map((f, i) => (
            <div key={i} className="card ch" style={{ padding: 24 }}>
              <div style={{ width: 44, height: 44, background: "rgba(0,212,255,.07)", border: "1px solid var(--b)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 15, color: "var(--c)" }}>
                <I n={f.icon} s={20} />
              </div>
              <h3 style={{ fontFamily: "Syne", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: "var(--t2)", fontSize: 13, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section style={{ padding: "78px 22px", background: "var(--bg2)" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontFamily: "Syne", fontSize: "clamp(24px,4vw,44px)", fontWeight: 800, marginBottom: 12 }}>Tarifs Transparents</h2>
            <p style={{ color: "var(--t2)", fontSize: 14 }}>Choisissez le plan adapté à votre croissance</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 20 }}>
            {PLANS.map((p, i) => (
              <div key={i} className="card" style={{ padding: 30, textAlign: "center", position: "relative", ...(p.hot ? { borderColor: "var(--c)", boxShadow: "0 0 44px rgba(0,212,255,.12)" } : {}) }}>
                {p.hot && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,var(--c),var(--c2))", color: "var(--bg)", padding: "3px 16px", borderRadius: 18, fontSize: 9, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>POPULAIRE</div>}
                <div style={{ fontSize: 12, fontWeight: 700, color: p.col, marginBottom: 7, fontFamily: "Syne" }}>{p.name}</div>
                <div style={{ fontSize: 40, fontFamily: "Syne", fontWeight: 800, marginBottom: 7 }}>
                  {typeof p.price === "number" ? <><span style={{ fontSize: 18 }}>$</span>{p.price}<span style={{ fontSize: 13, color: "var(--t2)", fontWeight: 400 }}>/mois</span></> : <span style={{ fontSize: 20 }}>{p.price}</span>}
                </div>
                <ul style={{ listStyle: "none", margin: "0 0 22px", textAlign: "left" }}>
                  {p.features.map((f, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 0", color: "var(--t2)", fontSize: 12, borderBottom: j < p.features.length - 1 ? "1px solid var(--b2)" : "none" }}>
                      <span style={{ color: p.col, flexShrink: 0 }}><I n="ok" s={12} /></span>{f}
                    </li>
                  ))}
                </ul>
                <button className={`btn ${p.hot ? "bp" : "bo"} bw`} onClick={() => onNav("register")}>Choisir {p.name}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section style={{ padding: "72px 22px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div className="card" style={{ padding: "44px 28px" }}>
          <div style={{ color: "var(--g)", marginBottom: 14, display: "flex", justifyContent: "center" }}><I n="shield" s={48} /></div>
          <h2 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Sécurité & Vie Privée</h2>
          <p style={{ color: "var(--t2)", maxWidth: 520, margin: "0 auto 26px", lineHeight: 1.75, fontSize: 13 }}>
            AES-256, RGPD, 2FA, audit logs. Seuls les propriétaires d'activités vérifiés peuvent s'inscrire. Données jamais revendues.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {["SSL/TLS","AES-256","RGPD","2FA","Audit Logs","Privacy by Design","JWT Secure","Rate Limiting"].map(t => (
              <span key={t} className="chip" style={{ color: "var(--g)", borderColor: "rgba(100,255,218,.2)" }}><I n="ok" s={9} />{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "70px 22px", background: "var(--bg2)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Syne", fontSize: "clamp(22px,4vw,40px)", fontWeight: 800, marginBottom: 12 }}>Prêt à booster votre business ?</h2>
        <p style={{ color: "var(--t2)", marginBottom: 26, fontSize: 14 }}>Rejoignez 500+ entreprises qui font confiance à PIBLAY</p>
        <button className="btn bp aglow" onClick={() => onNav("register")} style={{ padding: "13px 36px", fontSize: 14 }}>🚀 Démarrer maintenant — Gratuit</button>
      </section>

      {/* Footer */}
      <footer style={{ padding: "26px 22px", borderTop: "1px solid var(--b)", background: "var(--bg4)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}><I n="logo" s={24} /><span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 15, color: "var(--c)" }}>PIBLAY</span></div>
          <p style={{ color: "var(--t2)", fontSize: 11 }}>© 2025 PIBLAY — Tous droits réservés</p>
          <div style={{ display: "flex", gap: 16 }}>
            {["Confidentialité","CGU","Contact"].map(l => <span key={l} style={{ color: "var(--t2)", fontSize: 11, cursor: "pointer" }}>{l}</span>)}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  AUTH
// ─────────────────────────────────────────────────────────────────────────────
function Login({ onLogin, onNav, toast }) {
  const [email, setEmail] = useState(""); const [pass, setPass] = useState(""); const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false); const [tfa, setTfa] = useState(false); const [code, setCode] = useState(""); const [pending, setPending] = useState(null);

  const go = async () => {
    if (!email || !pass) { toast("Remplissez tous les champs", "err"); return; }
    setLoading(true); await new Promise(r => setTimeout(r, 850));
    const adm = ADMINS[email];
    if (adm && adm.password === pass) { setPending({ ...adm, email, userType: "admin" }); setTfa(true); setLoading(false); return; }
    const users = JSON.parse(localStorage.getItem("piblay_users") || "[]");
    const ags = JSON.parse(localStorage.getItem("piblay_ags") || "[]");
    const found = users.find(u => u.email === email && u.password === pass) || ags.find(a => a.email === email && a.password === pass);
    if (found) { onLogin(found); return; }
    setLoading(false); toast("Email ou mot de passe incorrect", "err");
  };

  if (tfa) return (
    <div className="grid-bg hg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 22 }}>
      <div className="card aup" style={{ padding: 36, width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ color: "var(--c)", display: "flex", justifyContent: "center", marginBottom: 10 }}><I n="shield" s={42} /></div>
          <h2 style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 800 }}>Vérification 2FA</h2>
          <p style={{ color: "var(--t2)", fontSize: 12, marginTop: 5 }}>Code à 6 chiffres de votre application authenticator</p>
          <div style={{ marginTop: 9, padding: "7px 14px", background: "rgba(100,255,218,.06)", border: "1px solid rgba(100,255,218,.2)", borderRadius: 7, fontSize: 11, color: "var(--g)" }}>Code démo : <strong>123456</strong></div>
        </div>
        <input className="inp" maxLength={6} placeholder="000000" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} style={{ textAlign: "center", fontSize: 26, fontFamily: "Syne", fontWeight: 800, letterSpacing: 8, marginBottom: 12 }} onKeyDown={e => e.key === "Enter" && (code === "123456" ? (toast("Connexion sécurisée ✓"), onLogin(pending)) : toast("Code invalide", "err"))} />
        <button className="btn bp bw" onClick={() => code === "123456" ? (toast("Connexion sécurisée ✓"), onLogin(pending)) : toast("Code invalide — Essayez 123456", "err")}>Vérifier</button>
        <button className="btn bg bw bsm" style={{ marginTop: 8 }} onClick={() => setTfa(false)}>← Retour</button>
      </div>
    </div>
  );

  return (
    <div className="grid-bg hg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 22 }}>
      <div className="card aup" style={{ padding: 36, width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <I n="logo" s={42} />
          <h1 style={{ fontFamily: "Syne", fontSize: 24, fontWeight: 800, color: "var(--c)", marginTop: 9 }}>PIBLAY</h1>
          <p style={{ color: "var(--t2)", fontSize: 12 }}>Connectez-vous à votre espace</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <div><label className="lbl">Email</label><input className="inp" type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div><label className="lbl">Mot de passe</label>
            <div style={{ position: "relative" }}>
              <input className="inp" type={show ? "text" : "password"} placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && go()} style={{ paddingRight: 40 }} />
              <button onClick={() => setShow(!show)} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--t2)", cursor: "pointer" }}><I n="eye" s={14} /></button>
            </div>
          </div>
          <button className="btn bp bw" onClick={go} disabled={loading} style={{ padding: 12, marginTop: 3 }}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </div>
        <div style={{ marginTop: 18, padding: 13, background: "rgba(0,212,255,.04)", border: "1px solid var(--b)", borderRadius: 8 }}>
          <p style={{ fontSize: 10, color: "var(--t2)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--go)" }}>👑 Super Admin :</strong> odthanempire@gmail.com / Admin@2002<br />
            <strong style={{ color: "var(--c)" }}>🔵 Admin :</strong> info.piblay@gmail.com / Piblay@2002<br />
            <strong style={{ color: "var(--pu)" }}>🎯 Agence démo :</strong> agency@demo.com / Agency@2002<br />
            <strong style={{ color: "var(--g)" }}>🏢 Annonceur démo :</strong> biz@demo.com / Biz@2002
          </p>
        </div>
        <p style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "var(--t2)" }}>
          Pas de compte ? <span style={{ color: "var(--c)", cursor: "pointer", fontWeight: 600 }} onClick={() => onNav("register")}>S'inscrire</span>
        </p>
        <p style={{ textAlign: "center", marginTop: 6 }}>
          <span style={{ fontSize: 11, color: "var(--t2)", cursor: "pointer" }} onClick={() => onNav("home")}>← Retour à l'accueil</span>
        </p>
      </div>
    </div>
  );
}

function Register({ onLogin, onNav, toast }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name: "", reg: "", sector: "Commerce", address: "", phone: "", email: "", pass: "", pass2: "", terms: false });
  const up = v => setF(p => ({ ...p, ...v }));
  const sectors = ["Commerce","Restauration","Technologie","Mode/Beauté","Santé","Éducation","Immobilier","Transport","Médias","Autre"];

  const submit = async () => {
    if (!f.terms) { toast("Acceptez les CGU", "err"); return; }
    if (f.pass !== f.pass2) { toast("Mots de passe différents", "err"); return; }
    if (f.pass.length < 8) { toast("Mot de passe trop court", "err"); return; }
    setLoading(true); await new Promise(r => setTimeout(r, 1200));
    const users = JSON.parse(localStorage.getItem("piblay_users") || "[]");
    if (users.find(u => u.email === f.email)) { toast("Email déjà utilisé", "err"); setLoading(false); return; }
    const nu = { id: Date.now(), email: f.email, password: f.pass, name: f.name, sector: f.sector, address: f.address, phone: f.phone, registration: f.reg, userType: "business", status: "pending", role: "Annonceur", createdAt: new Date().toISOString() };
    users.push(nu); localStorage.setItem("piblay_users", JSON.stringify(users));
    toast("Compte créé ! En attente de vérification."); onLogin(nu);
  };

  return (
    <div className="grid-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 22 }}>
      <div className="card aup" style={{ padding: 36, width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <I n="logo" s={36} />
          <h1 style={{ fontFamily: "Syne", fontSize: 21, fontWeight: 800, color: "var(--c)", marginTop: 8 }}>Créer un compte Annonceur</h1>
          <p style={{ color: "var(--t2)", fontSize: 11 }}>Réservé aux propriétaires d'activités</p>
        </div>
        <div className="stepbar">{[1, 2].map(s => <div key={s} className="stepseg" style={{ background: s <= step ? "var(--c)" : "var(--bg3)" }} />)}</div>
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div style={{ fontSize: 10, color: "var(--c)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Étape 1 — Informations entreprise</div>
            <div><label className="lbl">Nom légal *</label><input className="inp" placeholder="ex: MegaPlus SARL" value={f.name} onChange={e => up({ name: e.target.value })} /></div>
            <div><label className="lbl">N° Enregistrement / RCCM *</label><input className="inp" placeholder="ex: HT-2024-001" value={f.reg} onChange={e => up({ reg: e.target.value })} /></div>
            <div><label className="lbl">Secteur *</label><select className="inp" value={f.sector} onChange={e => up({ sector: e.target.value })}>{sectors.map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label className="lbl">Adresse physique *</label><input className="inp" placeholder="ex: Pétion-Ville, HT" value={f.address} onChange={e => up({ address: e.target.value })} /></div>
            <button className="btn bp bw" style={{ padding: 11 }} onClick={() => { if (!f.name || !f.reg || !f.address) { toast("Champs requis manquants", "err"); return; } setStep(2); }}>
              Continuer <I n="arr" s={13} />
            </button>
          </div>
        )}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div style={{ fontSize: 10, color: "var(--c)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Étape 2 — Accès & Contact</div>
            <div><label className="lbl">Email professionnel *</label><input className="inp" type="email" placeholder="contact@entreprise.com" value={f.email} onChange={e => up({ email: e.target.value })} /></div>
            <div><label className="lbl">Téléphone *</label><input className="inp" placeholder="+509 XX XX XXXX" value={f.phone} onChange={e => up({ phone: e.target.value })} /></div>
            <div><label className="lbl">Mot de passe *</label><input className="inp" type="password" placeholder="min. 8 caractères" value={f.pass} onChange={e => up({ pass: e.target.value })} /></div>
            <div><label className="lbl">Confirmer *</label><input className="inp" type="password" value={f.pass2} onChange={e => up({ pass2: e.target.value })} /></div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 9, cursor: "pointer" }}>
              <input type="checkbox" checked={f.terms} onChange={e => up({ terms: e.target.checked })} style={{ marginTop: 3, accentColor: "var(--c)" }} />
              <span style={{ fontSize: 11, color: "var(--t2)", lineHeight: 1.55 }}>J'accepte les <span style={{ color: "var(--c)" }}>CGU</span> et la <span style={{ color: "var(--c)" }}>Politique de Confidentialité</span>. Données protégées (RGPD).</span>
            </label>
            <div style={{ display: "flex", gap: 9 }}>
              <button className="btn bg" style={{ flex: 1, justifyContent: "center" }} onClick={() => setStep(1)}>← Retour</button>
              <button className="btn bp" style={{ flex: 2, justifyContent: "center", padding: 11 }} onClick={submit} disabled={loading}>{loading ? "Création..." : "Créer mon compte"}</button>
            </div>
          </div>
        )}
        <p style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: "var(--t2)" }}>
          Déjà un compte ? <span style={{ color: "var(--c)", cursor: "pointer", fontWeight: 600 }} onClick={() => onNav("login")}>Se connecter</span>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function AdminDash({ user, onLogout, toast }) {
  const [active, setActive] = useState("overview");
  const [agencies, setAgencies] = useState(AGENCIES_DATA);
  const [bizs, setBizs] = useState([...BIZS_DATA, ...JSON.parse(localStorage.getItem("piblay_users") || "[]")]);
  const [agents, setAgents] = useState(AGENTS_DATA);
  const [camps, setCamps] = useState(CAMPS_DATA);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [notifs, setNotifs] = useState([
    { id: 1, text: "Nouvel annonceur : Restaurant Lakay", time: "Il y a 5 min", icon: "🏢", color: "var(--g)", unread: true },
    { id: 2, text: "Bijouterie Éclat attend vérification", time: "Il y a 12 min", icon: "⏳", color: "var(--go)", unread: true },
    { id: 3, text: "Campagne App Mobile soumise", time: "Il y a 1h", icon: "📣", color: "var(--c)", unread: false },
  ]);
  const pending = bizs.filter(b => b.status === "pending");

  const nav = [
    { sec: "GÉNÉRAL" },
    { id: "overview",  label: "Vue d'ensemble",    icon: "dash",  badge: pending.length },
    { id: "bizs",      label: "Annonceurs",         icon: "users" },
    { id: "agencies",  label: "Agences",            icon: "house" },
    { id: "agents",    label: "Agents",             icon: "agent" },
    { sec: "OPÉRATIONS" },
    { id: "camps",     label: "Campagnes",          icon: "camp" },
    { id: "props",     label: "Propositions",       icon: "bid" },
    { id: "finance",   label: "Finance",            icon: "money" },
    { id: "msgs",      label: "Messagerie",         icon: "msg" },
    { sec: "SYSTÈME" },
    { id: "analytics", label: "Analytics",          icon: "chart" },
    { id: "logs",      label: "Logs & Audit",       icon: "log" },
    { id: "privacy",   label: "RGPD / Vie Privée",  icon: "priv" },
    ...(user.level === 1 ? [{ id: "settings", label: "Paramètres", icon: "gear" }] : []),
  ];

  const approve = id => { setBizs(b => b.map(x => x.id === id ? { ...x, status: "approved" } : x)); toast("Annonceur approuvé ✓"); };
  const del = (setter, id, label) => { setter(l => l.filter(x => x.id !== id)); toast(`${label} supprimé`); };
  const tog = (setter, id, label) => { setter(l => l.map(x => x.id === id ? { ...x, status: x.status === "suspended" ? "active" : "suspended" } : x)); toast(`${label} mis à jour`); };

  const wk = [42, 67, 55, 82, 71, 90, 76];
  const mo = [30,46,52,42,62,72,58,66,82,76,92,86,72,62,56,73,89,96,80,66,72,84,92,90,78,70,86,94,90,82];

  // ── Overview ──────────────────────────────────────────
  const PageOverview = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {user.level === 1 && (
        <div style={{ background: "rgba(255,215,0,.05)", border: "1px solid rgba(255,215,0,.22)", borderRadius: 11, padding: "11px 17px", display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 17 }}>👑</span>
          <span style={{ fontSize: 12 }}>Connecté en tant que <strong style={{ color: "var(--go)" }}>Super Admin {user.id}</strong> — Contrôle total</span>
        </div>
      )}
      {pending.length > 0 && (
        <div style={{ background: "rgba(255,215,0,.04)", border: "1px solid rgba(255,215,0,.18)", borderRadius: 11, padding: 17 }}>
          <h4 style={{ fontFamily: "Syne", fontSize: 13, fontWeight: 700, color: "var(--go)", marginBottom: 13 }}>⚠ {pending.length} inscription(s) en attente</h4>
          {pending.map(b => (
            <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(255,215,0,.08)" }}>
              <div><p style={{ fontSize: 12, fontWeight: 600 }}>{b.name}</p><p style={{ fontSize: 10, color: "var(--t2)" }}>{b.email} · {b.sector}</p></div>
              <div style={{ display: "flex", gap: 7 }}>
                <button className="btn bsu bxs" onClick={() => approve(b.id)}><I n="ok" s={10} /> Approuver</button>
                <button className="btn bd bxs" onClick={() => del(setBizs, b.id, "Annonceur")}>Rejeter</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 13 }}>
        <StatCard label="Annonceurs" value={bizs.length} icon="users" trend={pending.length > 0 ? `+${pending.length} en attente` : "Tous vérifiés"} delay={0} />
        <StatCard label="Agences actives" value={agencies.filter(a => a.status === "active").length} icon="house" color="var(--g)" delay={55} />
        <StatCard label="Campagnes actives" value={camps.filter(c => c.status === "active").length} icon="camp" color="var(--go)" delay={110} />
        <StatCard label="Revenu ce mois" value="$12,450" icon="money" color="var(--ac)" trend="↑ +18% vs M-1" delay={165} />
        <StatCard label="Agents" value={agents.filter(a => a.status === "active").length} icon="agent" color="var(--pu)" delay={220} />
        <StatCard label="Impressions" value="234K" icon="chart" trend="↑ +32% ce mois" delay={275} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 17 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, marginBottom: 15 }}>Impressions — Cette semaine</h3>
          <Bar data={wk} labels={["L","M","M","J","V","S","D"]} />
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, marginBottom: 15 }}>Répartition secteurs</h3>
          {[["Commerce",45,"var(--c)"],["Tech",30,"var(--go)"],["Resto",15,"var(--ac)"],["Autre",10,"var(--pu)"]].map(([l,p,col]) => (
            <div key={l} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 11, color: "var(--t2)" }}>{l}</span><span style={{ fontSize: 11, fontWeight: 700 }}>{p}%</span></div>
              <Prog pct={p} color={col} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Businesses ────────────────────────────────────────
  const PageBizs = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700 }}>Annonceurs ({bizs.length})</h3>
        <div style={{ display: "flex", gap: 7 }}>
          <input className="inp" placeholder="Rechercher..." style={{ width: 180 }} />
          <select className="inp" style={{ width: 130 }}><option>Tous statuts</option><option>approved</option><option>pending</option></select>
        </div>
      </div>
      <div className="card ox">
        <table className="tbl">
          <thead><tr><th>ENTREPRISE</th><th>EMAIL</th><th>SECTEUR</th><th>STATUT</th><th>CAMPAGNES</th><th>ACTIONS</th></tr></thead>
          <tbody>
            {bizs.map(b => (
              <tr key={b.id}>
                <td><div style={{ display: "flex", gap: 9, alignItems: "center" }}><Av name={b.name} size={28} color={b.status === "approved" ? "var(--g)" : "var(--go)"} /><div><p style={{ fontWeight: 600 }}>{b.name}</p><p style={{ fontSize: 10, color: "var(--t2)" }}>#{b.reg || b.registrationNumber || b.registration}</p></div></div></td>
                <td style={{ color: "var(--t2)" }}>{b.email}</td>
                <td><span className="chip">{b.sector}</span></td>
                <td><Badge status={b.status} /></td>
                <td style={{ color: "var(--c)", fontWeight: 700 }}>{b.cmp || b.campaigns || 0}</td>
                <td><div style={{ display: "flex", gap: 5 }}>
                  {b.status === "pending" && <button className="btn bsu bxs" onClick={() => approve(b.id)}>Approuver</button>}
                  <button className="btn bg bxs" onClick={() => tog(setBizs, b.id, "Annonceur")}>{b.status === "suspended" ? "Réactiver" : "Suspendre"}</button>
                  <button className="btn bd bxs" style={{ padding: "4px 7px" }} onClick={() => del(setBizs, b.id, "Annonceur")}><I n="trash" s={10} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Agencies ──────────────────────────────────────────
  const PageAgencies = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700 }}>Agences ({agencies.length})</h3>
        <button className="btn bp bsm" onClick={() => { setForm({}); setModal("agency"); }}><I n="plus" s={13} /> Ajouter</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 15 }}>
        {agencies.map(a => (
          <div key={a.id} className="card ch" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 13 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}><Av name={a.name} size={38} color="var(--pu)" /><div><p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13 }}>{a.name}</p><p style={{ fontSize: 10, color: "var(--t2)" }}>{a.spec}</p></div></div>
              <Badge status={a.status} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 13 }}>
              {[["Camps", a.cmp, "var(--c)"],["Clients", a.clients, "var(--g)"],["Note ★", a.rating, "var(--go)"]].map(([l, v, col]) => (
                <div key={l} style={{ textAlign: "center", padding: "7px 4px", background: `${col}08`, borderRadius: 7, border: `1px solid ${col}15` }}>
                  <div style={{ fontSize: 14, fontFamily: "Syne", fontWeight: 700, color: col }}>{v}</div>
                  <div style={{ fontSize: 9, color: "var(--t2)" }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn bg bxs" style={{ flex: 1, justifyContent: "center" }} onClick={() => tog(setAgencies, a.id, "Agence")}>{a.status === "suspended" ? "Réactiver" : "Suspendre"}</button>
              <button className="btn bd bxs" style={{ padding: "4px 7px" }} onClick={() => del(setAgencies, a.id, "Agence")}><I n="trash" s={10} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Agents ────────────────────────────────────────────
  const PageAgents = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700 }}>Agents ({agents.length})</h3>
        <button className="btn bp bsm" onClick={() => { setForm({}); setModal("agent"); }}><I n="plus" s={13} /> Ajouter</button>
      </div>
      <div className="card ox">
        <table className="tbl">
          <thead><tr><th>AGENT</th><th>EMAIL</th><th>RÔLE</th><th>AJOUTÉ PAR</th><th>TICKETS</th><th>STATUT</th><th>ACTIONS</th></tr></thead>
          <tbody>
            {agents.map(a => (
              <tr key={a.id}>
                <td><div style={{ display: "flex", gap: 9, alignItems: "center" }}><Av name={a.name} size={28} color="var(--pu)" /><span style={{ fontWeight: 600 }}>{a.name}</span></div></td>
                <td style={{ color: "var(--t2)" }}>{a.email}</td>
                <td><span className="chip" style={{ color: "var(--pu)", borderColor: "rgba(167,139,250,.2)" }}>{a.role}</span></td>
                <td style={{ color: "var(--t2)", fontSize: 11 }}>{a.addedBy}</td>
                <td style={{ color: "var(--c)", fontWeight: 600 }}>{a.tickets}</td>
                <td><Badge status={a.status} /></td>
                <td><div style={{ display: "flex", gap: 5 }}>
                  <button className="btn bg bxs" onClick={() => tog(setAgents, a.id, "Agent")}>{a.status === "suspended" ? "Réactiver" : "Suspendre"}</button>
                  <button className="btn bd bxs" style={{ padding: "4px 7px" }} onClick={() => del(setAgents, a.id, "Agent")}><I n="trash" s={10} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Campaigns ─────────────────────────────────────────
  const PageCamps = () => (
    <div className="card ox">
      <div style={{ padding: "17px 17px 0", marginBottom: 4 }}>
        <h3 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700 }}>Campagnes ({camps.length})</h3>
      </div>
      <table className="tbl">
        <thead><tr><th>TITRE</th><th>BUDGET</th><th>IMPRESSIONS</th><th>CLICS</th><th>CTR</th><th>CIBLAGE</th><th>STATUT</th><th>ACTIONS</th></tr></thead>
        <tbody>
          {camps.map(c => {
            const ctr = c.imp > 0 ? ((c.clicks / c.imp) * 100).toFixed(2) + "%" : "—";
            return (
              <tr key={c.id}>
                <td><p style={{ fontWeight: 600 }}>{c.title}</p><p style={{ fontSize: 10, color: "var(--t2)" }}>{c.start}</p></td>
                <td style={{ color: "var(--go)", fontWeight: 700 }}>${c.budget.toLocaleString()}</td>
                <td style={{ color: "var(--t2)" }}>{c.imp.toLocaleString()}</td>
                <td style={{ color: "var(--c)", fontWeight: 600 }}>{c.clicks.toLocaleString()}</td>
                <td style={{ fontWeight: 600 }}>{ctr}</td>
                <td><span className="chip">{c.target}</span></td>
                <td><Badge status={c.status} /></td>
                <td><div style={{ display: "flex", gap: 5 }}>
                  {c.status === "pending" && <button className="btn bsu bxs" onClick={() => { setCamps(p => p.map(x => x.id === c.id ? { ...x, status: "active" } : x)); toast("Campagne approuvée ✓"); }}>Approuver</button>}
                  <button className="btn bd bxs" style={{ padding: "4px 7px" }} onClick={() => { setCamps(p => p.filter(x => x.id !== c.id)); toast("Supprimée"); }}><I n="trash" s={10} /></button>
                </div></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // ── Proposals ─────────────────────────────────────────
  const PageProps = () => (
    <div className="card ox">
      <div style={{ padding: "17px 17px 0", marginBottom: 4 }}>
        <h3 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700 }}>Propositions ({PROPS_DATA.length})</h3>
      </div>
      <table className="tbl">
        <thead><tr><th>CAMPAGNE</th><th>AGENCE</th><th>MONTANT</th><th>DÉTAILS</th><th>DATE</th><th>STATUT</th></tr></thead>
        <tbody>
          {PROPS_DATA.map(p => {
            const camp = camps.find(c => c.id === p.campId);
            const ag = agencies.find(a => a.id === p.agId);
            return (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{camp?.title || "—"}</td>
                <td style={{ color: "var(--pu)" }}>{ag?.name || "—"}</td>
                <td style={{ color: "var(--g)", fontWeight: 700 }}>${p.amount.toLocaleString()}</td>
                <td style={{ color: "var(--t2)", fontSize: 11, maxWidth: 200 }}>{p.details}</td>
                <td style={{ color: "var(--t2)", fontSize: 11 }}>{p.date}</td>
                <td><Badge status={p.status} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // ── Finance ───────────────────────────────────────────
  const PageFinance = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 13 }}>
        <StatCard label="Revenu total" value="$87,230" icon="money" color="var(--g)" trend="↑ +24% Q1" />
        <StatCard label="Ce mois" value="$12,450" icon="money" trend="↑ +18% vs M-1" />
        <StatCard label="Transactions" value="234" icon="chart" color="var(--go)" />
        <StatCard label="En attente" value="$3,200" icon="money" color="var(--ac)" />
      </div>
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
          <h3 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700 }}>Transactions récentes</h3>
          <button className="btn bg bsm" onClick={() => toast("Export CSV en cours...")}><I n="file" s={12} /> Export CSV</button>
        </div>
        <table className="tbl">
          <thead><tr><th>DATE</th><th>CLIENT</th><th>MONTANT</th><th>TYPE</th><th>MÉTHODE</th><th>STATUT</th></tr></thead>
          <tbody>
            {[["18 Mai 2025","MegaPlus","$1,200","Campagne","Stripe","completed"],["17 Mai 2025","TechVision","$800","Abonnement Pro","PayPal","completed"],["16 Mai 2025","Lakay","$300","Starter","Mobile Money","pending"],["15 Mai 2025","MegaPlus","$2,500","Campagne","Stripe","completed"]].map((r,i) => (
              <tr key={i}>
                <td style={{ color: "var(--t2)", fontSize: 11 }}>{r[0]}</td>
                <td style={{ fontWeight: 600 }}>{r[1]}</td>
                <td style={{ color: "var(--g)", fontWeight: 700 }}>{r[2]}</td>
                <td style={{ color: "var(--t2)" }}>{r[3]}</td>
                <td><span className="chip">{r[4]}</span></td>
                <td><Badge status={r[5]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Messages ──────────────────────────────────────────
  const PageMsgs = () => {
    const [convs] = useState([
      { id: 1, from: "MegaPlus", text: "Notre campagne est-elle approuvée ?", time: "10:30", unread: true },
      { id: 2, from: "Créacom", text: "Quand recevons-nous le paiement ?", time: "09:00", unread: true },
      { id: 3, from: "TechVision", text: "Merci pour l'approbation rapide !", time: "Hier", unread: false },
    ]);
    const [sel, setSel] = useState(convs[0]);
    const [input, setInput] = useState("");
    const [threads, setThreads] = useState({ 1: [{ mine: false, text: "Bonjour, notre campagne est-elle approuvée ?", time: "10:30" }, { mine: true, text: "Oui, elle est bien active depuis ce matin.", time: "10:32" }], 2: [{ mine: false, text: "Quand recevons-nous le paiement ?", time: "09:00" }], 3: [{ mine: false, text: "Merci pour l'approbation rapide !", time: "Hier" }] });
    const send = () => { if (!input.trim()) return; const t = new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }); setThreads(p => ({ ...p, [sel.id]: [...(p[sel.id] || []), { mine: true, text: input, time: t }] })); setInput(""); };
    return (
      <div className="card" style={{ display: "grid", gridTemplateColumns: "250px 1fr", height: 500, overflow: "hidden" }}>
        <div style={{ borderRight: "1px solid var(--b)", overflowY: "auto" }}>
          <div style={{ padding: "13px 14px", borderBottom: "1px solid var(--b)", fontFamily: "Syne", fontSize: 12, fontWeight: 700 }}>Messagerie Admin</div>
          {convs.map(c => (
            <div key={c.id} onClick={() => setSel(c)} style={{ padding: "11px 13px", cursor: "pointer", borderBottom: "1px solid var(--b2)", background: sel?.id === c.id ? "rgba(0,212,255,.06)" : "transparent", borderLeft: sel?.id === c.id ? "3px solid var(--c)" : "3px solid transparent" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}><span style={{ fontSize: 12, fontWeight: 600 }}>{c.from}</span><span style={{ fontSize: 10, color: "var(--t2)" }}>{c.time}</span></div>
              <p style={{ fontSize: 11, color: "var(--t2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.text}</p>
              {c.unread && <div style={{ width: 5, height: 5, background: "var(--c)", borderRadius: "50%", marginTop: 3 }} />}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--b)", display: "flex", alignItems: "center", gap: 9 }}>
            <Av name={sel?.from || "?"} size={28} color="var(--c)" />
            <div><p style={{ fontSize: 12, fontWeight: 700 }}>{sel?.from}</p><p style={{ fontSize: 9, color: "var(--g)" }}><span className="ld" style={{ width: 4, height: 4 }} /> En ligne</p></div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 15, display: "flex", flexDirection: "column", gap: 10 }}>
            {sel && (threads[sel.id] || []).map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.mine ? "flex-end" : "flex-start" }}>
                <div className={`cb ${m.mine ? "cm" : "ct"}`}>{m.text}<p style={{ fontSize: 8, opacity: .6, marginTop: 3, textAlign: "right" }}>{m.time}</p></div>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, borderTop: "1px solid var(--b)", display: "flex", gap: 7 }}>
            <input className="inp" placeholder="Écrire un message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
            <button className="btn bp" style={{ padding: "0 12px" }} onClick={send}><I n="send" s={15} /></button>
          </div>
        </div>
      </div>
    );
  };

  // ── Analytics ─────────────────────────────────────────
  const PageAnalytics = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 13 }}>
        {[["Impressions","2.3M","chart","var(--c)","↑ +32%"],["Clics","312K","camp","var(--g)","↑ +18%"],["CTR moyen","13.6%","chart","var(--go)","↑ +0.4pts"],["Conv. rate","4.1%","ok","var(--ac)","↑ +0.8pts"]].map(([l,v,ic,col,t]) => (
          <StatCard key={l} label={l} value={v} icon={ic} color={col} trend={t} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 20 }}><h3 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Clics — 30 jours</h3><Bar data={mo} labels={Array.from({length:30},(_,i)=>`${i+1}`)} color="var(--g)" /></div>
        <div className="card" style={{ padding: 20 }}><h3 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Top agences</h3>
          {agencies.filter(a => a.status === "active").map(a => (
            <div key={a.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 11 }}>{a.name}</span><span style={{ fontSize: 10, color: "var(--go)", fontWeight: 700 }}>★ {a.rating}</span></div>
              <Prog pct={a.rating * 20} color="var(--pu)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Logs ──────────────────────────────────────────────
  const PageLogs = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700 }}>Journal d'Audit</h3>
        <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
          <span className="ld" /><span style={{ fontSize: 10, color: "var(--g)" }}>Temps réel</span>
          <button className="btn bg bsm" onClick={() => toast("Export en cours...")}><I n="file" s={12} /> Exporter</button>
        </div>
      </div>
      <div className="card ox">
        <table className="tbl">
          <thead><tr><th>HORODATAGE</th><th>ADMIN</th><th>ACTION</th><th>CIBLE</th><th>IP</th><th>RÉSULTAT</th></tr></thead>
          <tbody>
            {[
              ["2025-05-18 14:32","odthanempire@gmail.com","CONNEXION","Système","192.168.1.1","completed"],
              ["2025-05-18 14:28","info.piblay@gmail.com","APPROBATION","MegaPlus (101)","10.0.0.2","completed"],
              ["2025-05-18 13:55","odthanempire@gmail.com","AJOUT AGENCE","MediaPro Haiti","192.168.1.1","completed"],
              ["2025-05-18 13:20","info.piblay@gmail.com","SUSPENSION","VisionAds","10.0.0.2","completed"],
              ["2025-05-18 12:10","odthanempire@gmail.com","SUPPRESSION","Paul Durand","192.168.1.1","pending"],
              ["2025-05-18 11:30","info.piblay@gmail.com","EXPORT CSV","Finance","10.0.0.2","completed"],
            ].map((r,i) => (
              <tr key={i}>
                <td style={{ fontSize: 10, fontFamily: "monospace", color: "var(--t2)" }}>{r[0]}</td>
                <td style={{ color: "var(--c)", fontSize: 11 }}>{r[1]}</td>
                <td style={{ fontWeight: 600, fontSize: 11 }}>{r[2]}</td>
                <td style={{ color: "var(--t2)", fontSize: 11 }}>{r[3]}</td>
                <td style={{ fontFamily: "monospace", fontSize: 10, color: "var(--t2)" }}>{r[4]}</td>
                <td><Badge status={r[5]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Privacy ───────────────────────────────────────────
  const PagePrivacy = () => (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 11, marginBottom: 20, alignItems: "center" }}>
        <div style={{ color: "var(--g)" }}><I n="priv" s={28} /></div>
        <div><h3 style={{ fontFamily: "Syne", fontSize: 16, fontWeight: 700 }}>Conformité RGPD</h3><p style={{ fontSize: 11, color: "var(--t2)" }}>Protection des données personnelles</p></div>
      </div>
      {[["Chiffrement AES-256","Données sensibles chiffrées en base de données"],["Privacy by Design","Collecte minimale des données uniquement"],["Droit à l'oubli","Suppression complète sur demande de l'utilisateur"],["Export données JSON","Disponible pour chaque utilisateur sur demande"],["Consentement cookies","Bannière RGPD active sur toutes les pages"],["Audit logs chiffrés","Journalisation sécurisée des accès"],["Aucune revente données","Politique stricte anti-partage tiers"],["Isolation RLS","Row-Level Security activé sur la base de données"]].map(([t, d]) => (
        <div key={t} style={{ display: "flex", gap: 11, padding: "10px 0", borderBottom: "1px solid var(--b2)" }}>
          <div style={{ color: "var(--g)", flexShrink: 0, marginTop: 1 }}><I n="ok" s={15} /></div>
          <div><p style={{ fontSize: 12, fontWeight: 600 }}>{t}</p><p style={{ fontSize: 11, color: "var(--t2)" }}>{d}</p></div>
        </div>
      ))}
    </div>
  );

  // ── Settings ──────────────────────────────────────────
  const PageSettings = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {user.level !== 1 && <div style={{ background: "rgba(255,107,107,.06)", border: "1px solid rgba(255,107,107,.22)", borderRadius: 10, padding: "11px 16px" }}><p style={{ fontSize: 12, color: "var(--ac)" }}>🔒 Paramètres réservés au Super Admin ({ADMINS["odthanempire@gmail.com"].id})</p></div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {user.level === 1 && (
          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontFamily: "Syne", fontSize: 13, fontWeight: 700, marginBottom: 14, color: "var(--go)" }}>👑 Gestion des Admins</h4>
            {Object.entries(ADMINS).map(([email, a]) => (
              <div key={email} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--b2)" }}>
                <div style={{ display: "flex", gap: 9, alignItems: "center" }}><Av name={a.name} size={26} color={a.level === 1 ? "var(--go)" : "var(--c)"} /><div><p style={{ fontSize: 11, fontWeight: 600 }}>{a.name}</p><p style={{ fontSize: 9, color: "var(--t2)" }}>{email}</p></div></div>
                <span className={`bad ${a.level === 1 ? "bp2" : "ba"}`}>Niv.{a.level}</span>
              </div>
            ))}
          </div>
        )}
        <div className="card" style={{ padding: 20 }}>
          <h4 style={{ fontFamily: "Syne", fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Configuration Plateforme</h4>
          {[["Commission par campagne","10%"],["Plan Starter","$29/mois"],["Plan Pro","$99/mois"],["Session timeout","30 min"],["Tentatives login max","5"]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--b2)" }}>
              <span style={{ fontSize: 12 }}>{l}</span>
              <input className="inp" defaultValue={v} style={{ width: 120, textAlign: "right" }} />
            </div>
          ))}
          <button className="btn bp bsm" style={{ marginTop: 13 }} onClick={() => toast("Paramètres sauvegardés ✓")}>Sauvegarder</button>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h4 style={{ fontFamily: "Syne", fontSize: 13, fontWeight: 700, marginBottom: 14, color: "var(--ac)" }}>Zone Danger</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <button className="btn bd bsm" onClick={() => user.level === 1 ? toast("Cache vidé", "warn") : toast("Permission refusée", "err")}>Vider le cache système</button>
            <button className="btn bd bsm" onClick={() => user.level === 1 ? toast("Mode maintenance activé", "warn") : toast("Permission refusée", "err")}>Mode maintenance</button>
          </div>
        </div>
      </div>
    </div>
  );

  const pages = { overview: PageOverview, bizs: PageBizs, agencies: PageAgencies, agents: PageAgents, camps: PageCamps, props: PageProps, finance: PageFinance, msgs: PageMsgs, analytics: PageAnalytics, logs: PageLogs, privacy: PagePrivacy, settings: PageSettings };
  const Page = pages[active] || PageOverview;

  return (
    <>
      <Shell user={user} active={active} setActive={setActive} onLogout={onLogout} nav={nav} notifs={notifs} onMarkRead={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))}>
        <Page />
      </Shell>

      {modal === "agency" && (
        <Modal title="Ajouter une Agence" onClose={() => setModal(null)}>
          <div><label className="lbl">Nom de l'agence *</label><input className="inp" placeholder="ex: DigiPro Haïti" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label className="lbl">Spécialité</label><input className="inp" placeholder="ex: Social Media, SEO..." value={form.spec || ""} onChange={e => setForm(f => ({ ...f, spec: e.target.value }))} /></div>
          <div><label className="lbl">Email *</label><input className="inp" type="email" placeholder="agence@email.com" value={form.email || ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          <div><label className="lbl">Mot de passe temporaire *</label><input className="inp" type="password" placeholder="min. 8 caractères" value={form.password || ""} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
          <div style={{ background: "rgba(100,255,218,.04)", border: "1px solid rgba(100,255,218,.15)", borderRadius: 7, padding: 11 }}>
            <p style={{ fontSize: 10, color: "var(--g)" }}><I n="shield" s={10} /> L'agence recevra ses identifiants par email sécurisé.</p>
          </div>
          <div style={{ display: "flex", gap: 9 }}>
            <button className="btn bg" style={{ flex: 1, justifyContent: "center" }} onClick={() => setModal(null)}>Annuler</button>
            <button className="btn bp" style={{ flex: 2, justifyContent: "center" }} onClick={() => {
              if (!form.name || !form.email || !form.password) { toast("Champs requis manquants", "err"); return; }
              const ags = JSON.parse(localStorage.getItem("piblay_ags") || "[]");
              ags.push({ id: Date.now(), email: form.email, password: form.password, name: form.name, spec: form.spec || "", userType: "agency", role: "Agence", status: "active", cmp: 0, rating: 0, clients: 0, rev: 0 });
              localStorage.setItem("piblay_ags", JSON.stringify(ags));
              setAgencies(p => [...p, { id: Date.now() + 1, name: form.name, spec: form.spec || "", email: form.email, status: "active", cmp: 0, rating: 0, clients: 0, rev: 0 }]);
              setModal(null); toast(`Agence "${form.name}" ajoutée ✓`);
            }}>Ajouter</button>
          </div>
        </Modal>
      )}

      {modal === "agent" && (
        <Modal title="Ajouter un Agent" onClose={() => setModal(null)}>
          <div><label className="lbl">Nom complet *</label><input className="inp" placeholder="Prénom Nom" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label className="lbl">Email *</label><input className="inp" type="email" placeholder="agent@piblay.com" value={form.email || ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          <div><label className="lbl">Rôle</label><select className="inp" value={form.role || "Support"} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>{["Support","Modération","Commercial","Technique","Finance"].map(r => <option key={r}>{r}</option>)}</select></div>
          <div style={{ display: "flex", gap: 9 }}>
            <button className="btn bg" style={{ flex: 1, justifyContent: "center" }} onClick={() => setModal(null)}>Annuler</button>
            <button className="btn bp" style={{ flex: 2, justifyContent: "center" }} onClick={() => {
              if (!form.name || !form.email) { toast("Champs requis manquants", "err"); return; }
              setAgents(p => [...p, { id: Date.now(), name: form.name, email: form.email, role: form.role || "Support", addedBy: user.id, status: "active", tickets: 0 }]);
              setModal(null); toast(`Agent "${form.name}" ajouté ✓`);
            }}>Ajouter</button>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  BUSINESS DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function BizDash({ user, onLogout, toast }) {
  const [active, setActive] = useState("overview");
  const [camps, setCamps] = useState(CAMPS_DATA.filter(c => c.bizId === 101));
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [notifs, setNotifs] = useState([
    { id: 1, text: "Campagne approuvée !", time: "Il y a 5 min", icon: "✅", color: "var(--g)", unread: true },
    { id: 2, text: "Nouvelle proposition de DigiMarket", time: "Il y a 30 min", icon: "📋", color: "var(--c)", unread: true },
    { id: 3, text: "Facture #INV-2025-042 disponible", time: "Hier", icon: "💳", color: "var(--go)", unread: false },
  ]);
  const [msgs, setMsgs] = useState([
    { id: 1, from: "Créacom Haïti", text: "Bonjour, nous avons étudié votre campagne.", time: "10:30", unread: true },
    { id: 2, from: "DigiMarket", text: "Nous pouvons démarrer lundi.", time: "09:15", unread: true },
    { id: 3, from: "PIBLAY Admin", text: "Votre compte a été validé. Bienvenue !", time: "Hier", unread: false },
  ]);
  const isPending = user.status === "pending";
  const nav = [
    { sec: "PRINCIPAL" },
    { id: "overview",  label: "Vue d'ensemble",  icon: "dash" },
    { id: "campaigns", label: "Mes campagnes",    icon: "camp", badge: camps.filter(c => c.status === "pending").length },
    { id: "agencies",  label: "Agences",          icon: "house" },
    { id: "proposals", label: "Propositions",     icon: "bid",  badge: PROPS_DATA.filter(p => p.status === "pending").length },
    { sec: "ANALYSE" },
    { id: "analytics", label: "Analytics",        icon: "chart" },
    { id: "reports",   label: "Rapports",         icon: "file" },
    { sec: "COMPTE" },
    { id: "messages",  label: "Messagerie",       icon: "msg",  badge: msgs.filter(m => m.unread).length },
    { id: "billing",   label: "Facturation",      icon: "money" },
    { id: "profile",   label: "Mon Profil",       icon: "gear" },
    { id: "privacy",   label: "Mes Données",      icon: "priv" },
  ];

  const wk = [40,65,55,80,70,90,75];

  const PageOverview = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {isPending && <div style={{ background: "rgba(255,215,0,.05)", border: "1px solid rgba(255,215,0,.2)", borderRadius: 11, padding: "11px 16px", display: "flex", gap: 9 }}><span style={{ color: "var(--go)", fontSize: 16 }}>⏳</span><div><p style={{ fontSize: 12, fontWeight: 600, color: "var(--go)" }}>Compte en attente de vérification</p><p style={{ fontSize: 11, color: "var(--t2)", marginTop: 2 }}>Un administrateur vérifiera vos informations sous 24–48h.</p></div></div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 13 }}>
        <StatCard label="Campagnes actives" value={camps.filter(c => c.status === "active").length} icon="camp" />
        <StatCard label="Impressions totales" value="89K" icon="chart" color="var(--g)" trend="↑ +12%" />
        <StatCard label="Clics totaux" value="12.4K" icon="camp" color="var(--go)" trend="CTR 13.9%" />
        <StatCard label="Budget dépensé" value="$3,200" icon="money" color="var(--ac)" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Performance — Clics (7 jours)</h3>
          <Bar data={wk} labels={["L","M","M","J","V","S","D"]} color="var(--g)" />
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Campagnes</h3>
          {camps.map(c => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--b2)" }}>
              <div><p style={{ fontSize: 12, fontWeight: 600 }}>{c.title}</p><p style={{ fontSize: 10, color: "var(--t2)" }}>${c.budget.toLocaleString()}</p></div>
              <Badge status={c.status} />
            </div>
          ))}
          <button className="btn bo bsm bw" style={{ marginTop: 11 }} onClick={() => { setModal("camp"); setForm({}); }} disabled={isPending}><I n="plus" s={12} /> Nouvelle campagne</button>
        </div>
      </div>
    </div>
  );

  const PageCamps = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn bp bsm" onClick={() => { setModal("camp"); setForm({}); }} disabled={isPending}><I n="plus" s={13} /> Nouvelle campagne</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(275px,1fr))", gap: 15 }}>
        {camps.map(c => (
          <div key={c.id} className="card ch" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 13 }}>
              <h4 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, flex: 1, paddingRight: 8 }}>{c.title}</h4>
              <Badge status={c.status} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 12 }}>
              {[["Budget",`$${c.budget.toLocaleString()}`,"var(--go)"],["Impressions",c.imp.toLocaleString(),"var(--c)"],["Clics",c.clicks.toLocaleString(),"var(--g)"],["CTR",c.imp>0?((c.clicks/c.imp)*100).toFixed(1)+"%":"—","var(--ac)"]].map(([l,v,col]) => (
                <div key={l} style={{ padding: "8px 10px", background: `${col}08`, border: `1px solid ${col}15`, borderRadius: 7 }}>
                  <p style={{ fontSize: 9, color: "var(--t2)", marginBottom: 2 }}>{l}</p>
                  <p style={{ fontSize: 14, fontFamily: "Syne", fontWeight: 700, color: col }}>{v}</p>
                </div>
              ))}
            </div>
            <Prog pct={c.imp > 0 ? 65 : 0} />
            <div style={{ display: "flex", gap: 7, marginTop: 11 }}>
              <button className="btn bo bxs" style={{ flex: 1, justifyContent: "center" }} onClick={() => setActive("analytics")}>Voir stats</button>
              <button className="btn bd bxs" onClick={() => { setCamps(p => p.filter(x => x.id !== c.id)); toast("Campagne supprimée"); }}><I n="trash" s={10} /></button>
            </div>
          </div>
        ))}
        <div className="card" style={{ padding: 20, border: "2px dashed var(--b)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? .4 : 1 }} onClick={() => !isPending && (setModal("camp"), setForm({}))}>
          <div style={{ width: 40, height: 40, border: "2px dashed var(--b)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t2)" }}><I n="plus" s={18} /></div>
          <p style={{ fontSize: 12, color: "var(--t2)", textAlign: "center" }}>Créer une campagne</p>
        </div>
      </div>
    </div>
  );

  const PageAgencies = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(265px,1fr))", gap: 15 }}>
      {AGENCIES_DATA.filter(a => a.status === "active").map(a => (
        <div key={a.id} className="card ch" style={{ padding: 22 }}>
          <div style={{ display: "flex", gap: 11, marginBottom: 15 }}>
            <Av name={a.name} size={42} color="var(--pu)" />
            <div>
              <h4 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700 }}>{a.name}</h4>
              <p style={{ fontSize: 11, color: "var(--t2)", marginTop: 2 }}>{a.spec}</p>
              <div style={{ display: "flex", gap: 2, marginTop: 5 }}>
                {Array.from({ length: 5 }, (_, i) => <span key={i} style={{ color: i < Math.floor(a.rating) ? "var(--go)" : "var(--t3)", fontSize: 10 }}><I n="star" s={10} /></span>)}
                <span style={{ fontSize: 10, color: "var(--t2)", marginLeft: 4 }}>{a.rating}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 9, marginBottom: 14 }}>
            {[["Campaigns",a.cmp,"var(--c)"],["Clients",a.clients,"var(--g)"]].map(([l,v,col]) => (
              <div key={l} style={{ flex: 1, textAlign: "center", padding: "7px 0", background: `${col}07`, borderRadius: 7 }}>
                <p style={{ fontSize: 16, fontFamily: "Syne", fontWeight: 700, color: col }}>{v}</p>
                <p style={{ fontSize: 9, color: "var(--t2)" }}>{l}</p>
              </div>
            ))}
          </div>
          <button className="btn bp bsm bw" onClick={() => toast(`Demande envoyée à ${a.name} ✓`)}>Contacter l'agence</button>
        </div>
      ))}
    </div>
  );

  const PageProposals = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h3 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700 }}>Propositions reçues</h3>
      {PROPS_DATA.map(p => {
        const camp = CAMPS_DATA.find(c => c.id === p.campId);
        const ag = AGENCIES_DATA.find(a => a.id === p.agId);
        return (
          <div key={p.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 13 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}><Av name={ag?.name || "?"} size={36} color="var(--pu)" /><div><p style={{ fontFamily: "Syne", fontSize: 13, fontWeight: 700 }}>{ag?.name}</p><p style={{ fontSize: 11, color: "var(--t2)" }}>Pour : {camp?.title}</p></div></div>
              <div style={{ textAlign: "right" }}><p style={{ fontFamily: "Syne", fontSize: 19, fontWeight: 800, color: "var(--g)" }}>${p.amount.toLocaleString()}</p><Badge status={p.status} /></div>
            </div>
            <p style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.6, padding: "10px 0", borderTop: "1px solid var(--b2)", borderBottom: "1px solid var(--b2)", marginBottom: 13 }}>{p.details}</p>
            {p.status === "pending" && (
              <div style={{ display: "flex", gap: 9 }}>
                <button className="btn bsu bsm" style={{ flex: 1, justifyContent: "center" }} onClick={() => toast(`Proposition de ${ag?.name} acceptée ✓`)}><I n="ok" s={12} /> Accepter</button>
                <button className="btn bd bsm" style={{ flex: 1, justifyContent: "center" }} onClick={() => toast("Proposition refusée", "err")}><I n="close" s={12} /> Refuser</button>
                <button className="btn bg bsm" style={{ flex: 1, justifyContent: "center" }} onClick={() => setActive("messages")}><I n="msg" s={12} /> Discuter</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const PageAnalytics = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 13 }}>
        {[["Impressions","89,000","chart","var(--c)","↑ +12%"],["Clics","12,400","camp","var(--g)","CTR 13.9%"],["Conversion","4.2%","ok","var(--go)","↑ +0.8pts"],["Coût / Clic","$0.26","money","var(--ac)","↓ -$0.04"]].map(([l,v,ic,col,t]) => (
          <StatCard key={l} label={l} value={v} icon={ic} color={col} trend={t} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 20 }}><h3 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Clics — 30 jours</h3><Bar data={[30,46,52,42,62,72,58,66,82,76,92,86,72,62,56,73,89,96,80,66,72,84,92,90,78,70,86,94,90,82]} labels={Array.from({length:30},(_,i)=>`${i+1}`)} color="var(--c)" /></div>
        <div className="card" style={{ padding: 20 }}><h3 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Impressions par campagne</h3>
          {camps.map(c => (
            <div key={c.id} style={{ marginBottom: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 11 }}>{c.title}</span><span style={{ fontSize: 10, fontWeight: 700 }}>{c.imp.toLocaleString()}</span></div>
              <Prog pct={c.imp > 0 ? Math.min((c.imp / 250000) * 100, 100) : 2} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PageReports = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h3 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700 }}>Rapports</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 14 }}>
        {[["Rapport Mai 2025","Mensuel","2.4 MB","PDF"],["Rapport Avril 2025","Mensuel","1.8 MB","PDF"],["Campagne Été 2025","Par campagne","0.9 MB","PDF"],["Export Transactions","Finance","156 KB","CSV"]].map((r,i) => (
          <div key={i} className="card ch" style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 11 }}><div style={{ color: r[3] === "PDF" ? "var(--ac)" : "var(--g)" }}><I n="file" s={26} /></div><span style={{ padding: "3px 9px", borderRadius: 12, fontSize: 9, fontWeight: 800, background: r[3] === "PDF" ? "rgba(255,107,107,.12)" : "rgba(100,255,218,.12)", color: r[3] === "PDF" ? "var(--ac)" : "var(--g)" }}>{r[3]}</span></div>
            <p style={{ fontFamily: "Syne", fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{r[0]}</p>
            <p style={{ fontSize: 10, color: "var(--t2)", marginBottom: 11 }}>{r[1]} · {r[2]}</p>
            <button className="btn bo bxs bw" onClick={() => toast(`Téléchargement : "${r[0]}" ✓`)}>Télécharger</button>
          </div>
        ))}
      </div>
    </div>
  );

  const PageMessages = () => {
    const [sel, setSel] = useState(msgs[0]);
    const [input, setInput] = useState("");
    const [threads, setThreads] = useState({
      1: [{ mine: false, text: "Bonjour, nous avons étudié votre campagne.", time: "10:30" }, { mine: true, text: "Très bien, envoyez-nous votre proposition.", time: "10:45" }],
      2: [{ mine: false, text: "Notre équipe peut démarrer lundi.", time: "09:15" }],
      3: [{ mine: false, text: "Votre compte a été validé. Bienvenue !", time: "Hier" }],
    });
    const send = () => { if (!input.trim() || !sel) return; const t = new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }); setThreads(p => ({ ...p, [sel.id]: [...(p[sel.id] || []), { mine: true, text: input, time: t }] })); setInput(""); };
    return (
      <div className="card" style={{ display: "grid", gridTemplateColumns: "255px 1fr", height: 510, overflow: "hidden" }}>
        <div style={{ borderRight: "1px solid var(--b)", overflowY: "auto" }}>
          <div style={{ padding: "13px 13px", borderBottom: "1px solid var(--b)", fontFamily: "Syne", fontSize: 12, fontWeight: 700 }}>Messages</div>
          {msgs.map(m => (
            <div key={m.id} style={{ padding: "11px 12px", cursor: "pointer", borderBottom: "1px solid var(--b2)", background: sel?.id === m.id ? "rgba(0,212,255,.06)" : "transparent", borderLeft: sel?.id === m.id ? "3px solid var(--c)" : "3px solid transparent" }} onClick={() => { setSel(m); setMsgs(ms => ms.map(x => x.id === m.id ? { ...x, unread: false } : x)); }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <Av name={m.from} size={29} color="var(--pu)" />
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 12, fontWeight: 600 }}>{m.from}</span><span style={{ fontSize: 9, color: "var(--t2)" }}>{m.time}</span></div>
                  <p style={{ fontSize: 10, color: "var(--t2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{m.text}</p>
                  {m.unread && <div style={{ width: 5, height: 5, background: "var(--c)", borderRadius: "50%", marginTop: 3 }} />}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 15px", borderBottom: "1px solid var(--b)", display: "flex", alignItems: "center", gap: 9 }}>
            <Av name={sel?.from || "?"} size={29} color="var(--pu)" />
            <div><p style={{ fontSize: 12, fontWeight: 700 }}>{sel?.from}</p><p style={{ fontSize: 9, color: "var(--g)", display: "flex", alignItems: "center", gap: 4 }}><span className="ld" style={{ width: 4, height: 4 }} /> En ligne</p></div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {sel && (threads[sel.id] || []).map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.mine ? "flex-end" : "flex-start" }}>
                <div className={`cb ${m.mine ? "cm" : "ct"}`}>{m.text}<p style={{ fontSize: 8, opacity: .6, marginTop: 3, textAlign: "right" }}>{m.time}</p></div>
              </div>
            ))}
          </div>
          <div style={{ padding: 11, borderTop: "1px solid var(--b)", display: "flex", gap: 7 }}>
            <input className="inp" placeholder={`Écrire à ${sel?.from}...`} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
            <button className="btn bp" style={{ padding: "0 12px", flexShrink: 0 }} onClick={send}><I n="send" s={15} /></button>
          </div>
        </div>
      </div>
    );
  };

  const PageBilling = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Plan actuel</h3>
        <div style={{ padding: 16, background: "rgba(0,212,255,.04)", border: "1px solid var(--b)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><p style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 800, color: "var(--c)" }}>Pro</p><p style={{ fontSize: 12, color: "var(--t2)" }}>$99/mois · Renouvellement 1er juin 2025</p></div>
          <button className="btn bo bsm" onClick={() => toast("Redirection vers les plans...")}>Changer de plan</button>
        </div>
      </div>
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700 }}>Historique</h3>
          <button className="btn bg bsm" onClick={() => toast("Export PDF en cours...")}><I n="file" s={12} /> Export PDF</button>
        </div>
        <table className="tbl">
          <thead><tr><th>FACTURE</th><th>DATE</th><th>DESCRIPTION</th><th>MONTANT</th><th>STATUT</th></tr></thead>
          <tbody>
            {[["#INV-2025-042","1 Mai 2025","Plan Pro","$99","completed"],["#INV-2025-041","1 Avr. 2025","Plan Pro","$99","completed"],["#INV-2025-040","15 Avr. 2025","Campagne Été","$1,200","completed"]].map((r,i) => (
              <tr key={i}>
                <td style={{ color: "var(--c)", fontSize: 11, fontWeight: 600 }}>{r[0]}</td>
                <td style={{ color: "var(--t2)", fontSize: 11 }}>{r[1]}</td>
                <td style={{ fontSize: 12 }}>{r[2]}</td>
                <td style={{ color: "var(--g)", fontWeight: 700 }}>{r[3]}</td>
                <td><Badge status={r[4]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const PageProfile = () => (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20, paddingBottom: 18, borderBottom: "1px solid var(--b)" }}>
        <Av name={user.name || user.email} size={58} color="var(--c)" />
        <div>
          <h3 style={{ fontFamily: "Syne", fontSize: 19, fontWeight: 800 }}>{user.name || "—"}</h3>
          <p style={{ fontSize: 12, color: "var(--t2)", marginTop: 2 }}>{user.email}</p>
          <div style={{ display: "flex", gap: 7, marginTop: 7 }}><Badge status={user.status || "pending"} /><span className="chip">{user.sector || "Commerce"}</span></div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
        {[["Nom légal",user.name],["Email",user.email],["Téléphone",user.phone],["Secteur",user.sector],["Adresse",user.address],["N° Enregistrement",user.registration]].map(([l,v]) => (
          <div key={l}><label className="lbl">{l}</label><input className="inp" defaultValue={v || "—"} /></div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 9, marginTop: 16 }}>
        <button className="btn bp bsm" onClick={() => toast("Profil mis à jour ✓")}>Enregistrer</button>
        <button className="btn bg bsm" onClick={() => setModal("pass")}>Changer mot de passe</button>
      </div>
    </div>
  );

  const PagePrivacy = () => (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center" }}>
        <div style={{ color: "var(--g)" }}><I n="priv" s={26} /></div>
        <div><h3 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700 }}>Mes Données & Confidentialité</h3><p style={{ fontSize: 11, color: "var(--t2)" }}>Conformité RGPD — Contrôlez vos données</p></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
        {[["Exporter mes données","Téléchargez vos données en JSON","file",() => toast("Export en cours — email à venir")],["Supprimer mon compte","Suppression complète et irréversible","trash",() => toast("Demande envoyée à l'admin", "warn")],["Historique connexions","Vos sessions actives","log",() => toast("Chargement...")],["Activer 2FA","Sécurisez votre compte","shield",() => toast("Redirection configuration 2FA...")]].map(([t,d,ic,fn]) => (
          <div key={t} className="card ch" style={{ padding: 16, cursor: "pointer" }} onClick={fn}>
            <div style={{ color: "var(--c)", marginBottom: 9 }}><I n={ic} s={20} /></div>
            <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{t}</p>
            <p style={{ fontSize: 10, color: "var(--t2)", lineHeight: 1.5 }}>{d}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, padding: 14, background: "rgba(100,255,218,.04)", border: "1px solid rgba(100,255,218,.14)", borderRadius: 9 }}>
        <p style={{ fontSize: 11, color: "var(--g)", fontWeight: 600, marginBottom: 5 }}>🛡 Vos droits RGPD</p>
        <p style={{ fontSize: 11, color: "var(--t2)", lineHeight: 1.65 }}>Accès, rectification, effacement, limitation, portabilité. Données chiffrées AES-256. Jamais partagées avec des tiers.</p>
      </div>
    </div>
  );

  const pages = { overview: PageOverview, campaigns: PageCamps, agencies: PageAgencies, proposals: PageProposals, analytics: PageAnalytics, reports: PageReports, messages: PageMessages, billing: PageBilling, profile: PageProfile, privacy: PagePrivacy };
  const Page = pages[active] || PageOverview;

  return (
    <>
      <Shell user={user} active={active} setActive={setActive} onLogout={onLogout} nav={nav} notifs={notifs} onMarkRead={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))}>
        <Page />
      </Shell>

      {modal === "camp" && (
        <Modal title="Créer une campagne" onClose={() => setModal(null)}>
          <div><label className="lbl">Titre *</label><input className="inp" placeholder="ex: Promotion Été 2025" value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div><label className="lbl">Budget ($) *</label><input className="inp" type="number" placeholder="ex: 3000" value={form.budget || ""} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} /></div>
          <div><label className="lbl">Zone de ciblage</label><select className="inp" value={form.target || "Haïti"} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}>{["Haïti","Port-au-Prince","Pétion-Ville","Cap-Haïtien","Caraïbes","International"].map(t => <option key={t}>{t}</option>)}</select></div>
          <div><label className="lbl">Durée</label><select className="inp" value={form.dur || "30"} onChange={e => setForm(f => ({ ...f, dur: e.target.value }))}>{[["7","7 jours"],["14","14 jours"],["30","30 jours"],["60","60 jours"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></div>
          <div><label className="lbl">Description</label><textarea className="inp" placeholder="Objectifs de la campagne..." value={form.desc || ""} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} /></div>
          <div style={{ display: "flex", gap: 9 }}>
            <button className="btn bg" style={{ flex: 1, justifyContent: "center" }} onClick={() => setModal(null)}>Annuler</button>
            <button className="btn bp" style={{ flex: 2, justifyContent: "center" }} onClick={() => {
              if (!form.title || !form.budget) { toast("Titre et budget requis", "err"); return; }
              const d = new Date().toISOString().split("T")[0];
              setCamps(p => [...p, { id: Date.now(), bizId: 101, agId: null, title: form.title, budget: parseInt(form.budget), status: "pending", clicks: 0, imp: 0, start: d, end: d, target: form.target || "Haïti" }]);
              setModal(null); toast(`Campagne "${form.title}" soumise ✓`);
            }}>Soumettre</button>
          </div>
        </Modal>
      )}

      {modal === "pass" && (
        <Modal title="Changer le mot de passe" onClose={() => setModal(null)}>
          <div><label className="lbl">Mot de passe actuel</label><input className="inp" type="password" /></div>
          <div><label className="lbl">Nouveau mot de passe</label><input className="inp" type="password" /></div>
          <div><label className="lbl">Confirmer</label><input className="inp" type="password" /></div>
          <button className="btn bp bw" onClick={() => { setModal(null); toast("Mot de passe mis à jour ✓"); }}>Enregistrer</button>
        </Modal>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  AGENCY DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function AgencyDash({ user, onLogout, toast }) {
  const [active, setActive] = useState("overview");
  const [props, setProps] = useState(PROPS_DATA.slice(0, 2));
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [msgs, setMsgs] = useState([
    { id: 1, from: "MegaPlus", text: "Pouvez-vous nous envoyer votre portfolio ?", time: "10:30", unread: true },
    { id: 2, from: "TechVision", text: "Nous voulons démarrer la semaine prochaine.", time: "09:15", unread: true },
    { id: 3, from: "PIBLAY", text: "Profil agence validé. Bienvenue !", time: "Hier", unread: false },
  ]);
  const notifs = [
    { id: 1, text: "Nouvelle campagne : Lancement App Mobile", time: "Il y a 10 min", icon: "📣", color: "var(--c)", unread: true },
    { id: 2, text: "Proposition acceptée par MegaPlus !", time: "Il y a 1h", icon: "✅", color: "var(--g)", unread: true },
  ];
  const nav = [
    { sec: "PRINCIPAL" },
    { id: "overview",  label: "Vue d'ensemble",   icon: "dash" },
    { id: "camps",     label: "Campagnes dispo",  icon: "camp" },
    { id: "props",     label: "Mes propositions", icon: "bid",  badge: props.filter(p => p.status === "pending").length },
    { id: "clients",   label: "Mes clients",      icon: "users" },
    { sec: "PERFORMANCE" },
    { id: "analytics", label: "Analytics",        icon: "chart" },
    { sec: "COMPTE" },
    { id: "messages",  label: "Messagerie",       icon: "msg",  badge: msgs.filter(m => m.unread).length },
    { id: "billing",   label: "Revenus",          icon: "money" },
    { id: "profile",   label: "Profil Agence",    icon: "port" },
  ];

  const PageOverview = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 13 }}>
        <StatCard label="Campagnes gérées" value={props.filter(p => p.status === "accepted").length} icon="camp" />
        <StatCard label="Propositions" value={props.length} icon="bid" color="var(--pu)" trend={`${props.filter(p => p.status === "accepted").length} acceptées`} />
        <StatCard label="Clients actifs" value="24" icon="users" color="var(--g)" trend="↑ +3 ce mois" />
        <StatCard label="Revenu ce mois" value="$8,200" icon="money" color="var(--go)" trend="↑ +22%" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 20 }}><h3 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Performance (7 jours)</h3><Bar data={[42,67,55,82,71,90,76]} labels={["L","M","M","J","V","S","D"]} color="var(--pu)" /></div>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Propositions récentes</h3>
          {props.slice(0, 3).map(p => { const c = CAMPS_DATA.find(x => x.id === p.campId); return (
            <div key={p.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--b2)" }}>
              <p style={{ fontSize: 11, fontWeight: 600 }}>{c?.title || "—"}</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}><span style={{ fontSize: 10, color: "var(--g)", fontWeight: 700 }}>${p.amount.toLocaleString()}</span><Badge status={p.status} /></div>
            </div>
          ); })}
        </div>
      </div>
    </div>
  );

  const PageCamps = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h3 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700 }}>Campagnes Disponibles</h3>
      {CAMPS_DATA.filter(c => c.status === "pending").map(c => {
        const biz = BIZS_DATA.find(b => b.id === c.bizId);
        return (
          <div key={c.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div><h4 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700 }}>{c.title}</h4><p style={{ fontSize: 11, color: "var(--t2)", marginTop: 2 }}>Par : {biz?.name} · {biz?.sector}</p></div>
              <div style={{ textAlign: "right" }}><p style={{ fontFamily: "Syne", fontSize: 19, fontWeight: 800, color: "var(--go)" }}>${c.budget.toLocaleString()}</p><p style={{ fontSize: 9, color: "var(--t2)" }}>Budget total</p></div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 13, flexWrap: "wrap" }}>
              <span className="chip"><I n="world" s={9} /> {c.target}</span>
              <span className="chip">{c.start} → {c.end}</span>
            </div>
            <div style={{ display: "flex", gap: 9 }}>
              <button className="btn bp bsm" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setForm({ campId: c.id, campTitle: c.title }); setModal("prop"); }}><I n="bid" s={12} /> Soumettre une proposition</button>
              <button className="btn bg bsm" onClick={() => toast("Campagne sauvegardée")}>Sauvegarder</button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const PageProps = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
      <h3 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700 }}>Mes Propositions ({props.length})</h3>
      {props.map(p => { const c = CAMPS_DATA.find(x => x.id === p.campId); return (
        <div key={p.id} className="card" style={{ padding: 19 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div><h4 style={{ fontFamily: "Syne", fontSize: 13, fontWeight: 700 }}>{c?.title || "Campagne"}</h4><p style={{ fontSize: 10, color: "var(--t2)", marginTop: 2 }}>{p.date}</p></div>
            <div style={{ textAlign: "right" }}><p style={{ fontFamily: "Syne", fontSize: 17, fontWeight: 800, color: "var(--g)" }}>${p.amount.toLocaleString()}</p><Badge status={p.status} /></div>
          </div>
          <p style={{ fontSize: 11, color: "var(--t2)", lineHeight: 1.6, padding: "9px 0", borderTop: "1px solid var(--b2)" }}>{p.details}</p>
        </div>
      ); })}
    </div>
  );

  const PageClients = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 14 }}>
      {BIZS_DATA.filter(b => b.status === "approved").map(b => (
        <div key={b.id} className="card ch" style={{ padding: 19 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 11 }}><Av name={b.name} size={36} color="var(--c)" /><div><p style={{ fontSize: 12, fontWeight: 700 }}>{b.name}</p><p style={{ fontSize: 10, color: "var(--t2)" }}>{b.sector}</p></div></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 7 }}><span style={{ color: "var(--t2)" }}>Campagnes</span><span style={{ color: "var(--c)", fontWeight: 700 }}>{b.cmp}</span></div>
          <Prog pct={(b.cmp / 10) * 100} />
          <button className="btn bo bxs bw" style={{ marginTop: 11 }} onClick={() => toast(`Message envoyé à ${b.name} ✓`)}><I n="msg" s={11} /> Contacter</button>
        </div>
      ))}
    </div>
  );

  const PageAnalytics = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 13 }}>
        {[["Impressions gérées","1.2M","chart","var(--c)"],["Clics","164K","camp","var(--g)"],["CTR moyen","13.7%","chart","var(--go)"],["ROAS moyen","4.2x","money","var(--ac)"]].map(([l,v,ic,col]) => (
          <StatCard key={l} label={l} value={v} icon={ic} color={col} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 20 }}><h3 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Impressions mensuelles</h3><Bar data={[30,46,52,42,62,72,58,66,82,76,92,86,72,62,56,73,89,96,80,66,72,84,92,90,78,70,86,94,90,82]} labels={Array.from({length:30},(_,i)=>`${i+1}`)} color="var(--pu)" /></div>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Performance clients</h3>
          {BIZS_DATA.filter(b => b.status === "approved").map(b => (
            <div key={b.id} style={{ marginBottom: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 11 }}>{b.name}</span><span style={{ fontSize: 10, fontWeight: 700, color: "var(--c)" }}>{b.cmp} camps.</span></div>
              <Prog pct={(b.cmp / 10) * 100} color="var(--pu)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PageMessages = () => {
    const [sel, setSel] = useState(msgs[0]);
    const [input, setInput] = useState("");
    const [threads, setThreads] = useState({ 1: [{ mine: false, text: "Pouvez-vous nous envoyer votre portfolio ?", time: "10:30" }], 2: [{ mine: false, text: "Nous voulons démarrer la semaine prochaine.", time: "09:15" }], 3: [{ mine: false, text: "Profil agence validé. Bienvenue !", time: "Hier" }] });
    const send = () => { if (!input.trim() || !sel) return; const t = new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }); setThreads(p => ({ ...p, [sel.id]: [...(p[sel.id] || []), { mine: true, text: input, time: t }] })); setInput(""); };
    return (
      <div className="card" style={{ display: "grid", gridTemplateColumns: "250px 1fr", height: 500, overflow: "hidden" }}>
        <div style={{ borderRight: "1px solid var(--b)", overflowY: "auto" }}>
          <div style={{ padding: "13px 13px", borderBottom: "1px solid var(--b)", fontFamily: "Syne", fontSize: 12, fontWeight: 700 }}>Messagerie</div>
          {msgs.map(m => (
            <div key={m.id} style={{ padding: "11px 12px", cursor: "pointer", borderBottom: "1px solid var(--b2)", background: sel?.id === m.id ? "rgba(0,212,255,.06)" : "transparent", borderLeft: sel?.id === m.id ? "3px solid var(--c)" : "3px solid transparent" }} onClick={() => { setSel(m); setMsgs(ms => ms.map(x => x.id === m.id ? { ...x, unread: false } : x)); }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}><span style={{ fontSize: 12, fontWeight: 600 }}>{m.from}</span><span style={{ fontSize: 9, color: "var(--t2)" }}>{m.time}</span></div>
              <p style={{ fontSize: 10, color: "var(--t2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.text}</p>
              {m.unread && <div style={{ width: 5, height: 5, background: "var(--c)", borderRadius: "50%", marginTop: 3 }} />}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 15px", borderBottom: "1px solid var(--b)", display: "flex", alignItems: "center", gap: 9 }}>
            <Av name={sel?.from || "?"} size={28} color="var(--c)" />
            <div><p style={{ fontSize: 12, fontWeight: 700 }}>{sel?.from}</p><p style={{ fontSize: 9, color: "var(--g)" }}><span className="ld" style={{ width: 4, height: 4 }} /> En ligne</p></div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {sel && (threads[sel.id] || []).map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.mine ? "flex-end" : "flex-start" }}>
                <div className={`cb ${m.mine ? "cm" : "ct"}`}>{m.text}<p style={{ fontSize: 8, opacity: .6, marginTop: 3, textAlign: "right" }}>{m.time}</p></div>
              </div>
            ))}
          </div>
          <div style={{ padding: 11, borderTop: "1px solid var(--b)", display: "flex", gap: 7 }}>
            <input className="inp" placeholder="Écrire..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
            <button className="btn bp" style={{ padding: "0 12px", flexShrink: 0 }} onClick={send}><I n="send" s={15} /></button>
          </div>
        </div>
      </div>
    );
  };

  const PageBilling = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 13 }}>
        <StatCard label="Revenu total" value="$48,000" icon="money" color="var(--g)" />
        <StatCard label="Ce mois" value="$8,200" icon="money" trend="↑ +22%" />
        <StatCard label="En attente" value="$2,400" icon="money" color="var(--go)" />
        <StatCard label="Commission PIBLAY" value="$4,800" icon="money" color="var(--ac)" />
      </div>
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Historique paiements</h3>
        <table className="tbl">
          <thead><tr><th>DATE</th><th>CLIENT</th><th>BRUT</th><th>COMMISSION</th><th>NET</th><th>STATUT</th></tr></thead>
          <tbody>
            {[["18 Mai","MegaPlus","$1,200","$120","$1,080","completed"],["10 Mai","TechVision","$3,500","$350","$3,150","completed"],["01 Mai","MegaPlus","$1,200","$120","$1,080","pending"]].map((r,i) => (
              <tr key={i}><td style={{ color: "var(--t2)", fontSize: 11 }}>{r[0]}</td><td style={{ fontWeight: 600 }}>{r[1]}</td><td style={{ color: "var(--c)", fontWeight: 700 }}>{r[2]}</td><td style={{ color: "var(--ac)" }}>{r[3]}</td><td style={{ color: "var(--g)", fontWeight: 700 }}>{r[4]}</td><td><Badge status={r[5]} /></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const PageProfile = () => (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: "flex", gap: 13, alignItems: "center", marginBottom: 20, paddingBottom: 17, borderBottom: "1px solid var(--b)" }}>
        <Av name={user.name || "Agence"} size={55} color="var(--pu)" />
        <div>
          <h3 style={{ fontFamily: "Syne", fontSize: 19, fontWeight: 800 }}>{user.name || AGENCIES_DATA[0].name}</h3>
          <p style={{ fontSize: 12, color: "var(--t2)", marginTop: 2 }}>{AGENCIES_DATA[0].spec}</p>
          <div style={{ display: "flex", gap: 7, marginTop: 6 }}><Badge status="active" /><span style={{ fontSize: 11, color: "var(--go)" }}>★ 4.8</span></div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
        {[["Nom de l'agence", user.name || AGENCIES_DATA[0].name],["Email", user.email || AGENCIES_DATA[0].email],["Spécialité", AGENCIES_DATA[0].spec],["Clients actifs", AGENCIES_DATA[0].clients]].map(([l,v]) => (
          <div key={l}><label className="lbl">{l}</label><input className="inp" defaultValue={v} /></div>
        ))}
      </div>
      <div style={{ marginTop: 13 }}><label className="lbl">Description / Portfolio</label><textarea className="inp" defaultValue="Agence spécialisée en stratégie digitale, branding et Social Media. 5+ ans sur le marché haïtien." /></div>
      <button className="btn bp bsm" style={{ marginTop: 13 }} onClick={() => toast("Profil mis à jour ✓")}>Enregistrer</button>
    </div>
  );

  const pages = { overview: PageOverview, camps: PageCamps, props: PageProps, clients: PageClients, analytics: PageAnalytics, messages: PageMessages, billing: PageBilling, profile: PageProfile };
  const Page = pages[active] || PageOverview;

  return (
    <>
      <Shell user={user} active={active} setActive={setActive} onLogout={onLogout} nav={nav} notifs={notifs} onMarkRead={() => {}}>
        <Page />
      </Shell>

      {modal === "prop" && (
        <Modal title="Soumettre une proposition" onClose={() => setModal(null)}>
          <p style={{ fontSize: 11, color: "var(--t2)" }}>Campagne : <strong style={{ color: "var(--c)" }}>{form.campTitle}</strong></p>
          <div><label className="lbl">Montant proposé ($) *</label><input className="inp" type="number" placeholder="ex: 7500" value={form.amount || ""} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} /></div>
          <div><label className="lbl">Détails de la proposition *</label><textarea className="inp" placeholder="Approche, livrables, calendrier..." value={form.details || ""} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} /></div>
          <div style={{ display: "flex", gap: 9 }}>
            <button className="btn bg" style={{ flex: 1, justifyContent: "center" }} onClick={() => setModal(null)}>Annuler</button>
            <button className="btn bp" style={{ flex: 2, justifyContent: "center" }} onClick={() => {
              if (!form.amount || !form.details) { toast("Remplissez tous les champs", "err"); return; }
              setProps(p => [...p, { id: Date.now(), campId: form.campId, agId: 1, amount: parseInt(form.amount), details: form.details, status: "pending", date: new Date().toISOString().split("T")[0] }]);
              setModal(null); toast("Proposition envoyée ✓");
            }}>Envoyer</button>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [toasts, addToast] = useToasts();

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("piblay_users") || "[]");
    if (!users.find(u => u.email === "biz@demo.com")) {
      users.push({ id: 999, email: "biz@demo.com", password: "Biz@2002", name: "MegaPlus Demo", sector: "Commerce", address: "Port-au-Prince, HT", phone: "+509 36000001", registration: "HT-DEMO-001", userType: "business", status: "approved", role: "Annonceur", createdAt: new Date().toISOString() });
      localStorage.setItem("piblay_users", JSON.stringify(users));
    }
    const ags = JSON.parse(localStorage.getItem("piblay_ags") || "[]");
    if (!ags.find(a => a.email === "agency@demo.com")) {
      ags.push({ id: 998, email: "agency@demo.com", password: "Agency@2002", name: "Créacom Haïti", spec: "Social Media & Branding", userType: "agency", role: "Agence", status: "active" });
      localStorage.setItem("piblay_ags", JSON.stringify(ags));
    }
  }, []);

  const handleLogin = u => {
    setUser(u);
    const dest = u.userType === "admin" ? "admin" : u.userType === "agency" ? "agency" : "business";
    setPage(dest);
    addToast(`Bienvenue ${u.name || u.id || u.email?.split("@")[0]} ! ✓`);
  };

  const handleLogout = () => {
    setUser(null); setPage("home");
    addToast("Déconnexion réussie");
  };

  return (
    <>
      <style>{CSS}</style>
      {page === "home"     && <Landing onNav={setPage} />}
      {page === "login"    && <Login onLogin={handleLogin} onNav={setPage} toast={addToast} />}
      {page === "register" && <Register onLogin={handleLogin} onNav={setPage} toast={addToast} />}
      {page === "admin"    && user && <AdminDash  user={user} onLogout={handleLogout} toast={addToast} />}
      {page === "business" && user && <BizDash    user={user} onLogout={handleLogout} toast={addToast} />}
      {page === "agency"   && user && <AgencyDash user={user} onLogout={handleLogout} toast={addToast} />}
      {/* Toasts */}
      <div className="tswrap">
        {toasts.map(t => (
          <div key={t.id} className={`ts ${t.type === "err" ? "err" : t.type === "warn" ? "warn" : ""}`}>
            <span style={{ color: t.type === "err" ? "var(--ac)" : t.type === "warn" ? "var(--go)" : "var(--g)", fontSize: 14 }}>
              {t.type === "err" ? "✕" : t.type === "warn" ? "⚠" : "✓"}
            </span>
            {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}
