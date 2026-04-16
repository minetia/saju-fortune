// ============================================================
// Talisman and Card Generation Functions
// ============================================================
import { CHEONGAN, JIJI, SHIP2_NAMES } from '../data/pillarData.js';
import { ILGAN_PERSONALITY } from '../data/interpretationData.js';

// ============================================================
// SNS 공유용 사주 카드 이미지 생성
// ============================================================
export function generateSajuCard(canvas, dayStem, pillars, gyeokguk, yongsinAnalysis, ship2) {
  const ctx = canvas.getContext('2d');
  const W = 600, H = 600;
  canvas.width = W; canvas.height = H;

  // 배경
  const bg = ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#0a0a1a'); bg.addColorStop(0.5,'#1a1a3e'); bg.addColorStop(1,'#0a0a1a');
  ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

  // 테두리
  ctx.strokeStyle = '#D4AF3766'; ctx.lineWidth = 2;
  ctx.strokeRect(20,20,W-40,H-40);

  // 상단 로고
  ctx.textAlign = 'center';
  ctx.fillStyle = '#D4AF37'; ctx.font = '14px sans-serif';
  ctx.fillText('☯ 사주팔자 만세력', W/2, 55);

  // 일간 정보
  const dayEl = CHEONGAN[dayStem].element;
  const elColors = {'목':'#4ade80','화':'#f87171','토':'#fbbf24','금':'#e5e7eb','수':'#60a5fa'};
  ctx.font = 'bold 36px serif';
  ctx.fillStyle = elColors[dayEl] || '#D4AF37';
  ctx.fillText(CHEONGAN[dayStem].hanja + ' ' + ILGAN_PERSONALITY[dayStem].title, W/2, 100);

  // 격국
  if (gyeokguk) {
    ctx.font = '18px sans-serif'; ctx.fillStyle = '#D4AF37aa';
    ctx.fillText(gyeokguk.name, W/2, 130);
  }

  // 4기둥
  const pillarX = [150, 250, 350, 450];
  const pillarLabels = ['年','月','日','時'];
  ctx.font = 'bold 40px serif';
  pillars.forEach((p, i) => {
    ctx.fillStyle = elColors[CHEONGAN[p.stem].element] || '#ccc';
    ctx.fillText(CHEONGAN[p.stem].hanja, pillarX[i], 200);
    ctx.fillStyle = elColors[JIJI[p.branch].element] || '#ccc';
    ctx.fillText(JIJI[p.branch].hanja, pillarX[i], 250);
    ctx.font = '12px sans-serif'; ctx.fillStyle = '#888';
    ctx.fillText(pillarLabels[i], pillarX[i], 275);
    ctx.font = 'bold 40px serif';
  });

  // 구분선
  ctx.strokeStyle = '#D4AF3733'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(60,295); ctx.lineTo(W-60,295); ctx.stroke();

  // 용신 정보
  if (yongsinAnalysis) {
    ctx.font = 'bold 16px sans-serif'; ctx.fillStyle = '#D4AF37';
    ctx.fillText('용신: ' + yongsinAnalysis.yongsin.element + '(' + yongsinAnalysis.yongsin.hanja + ')  |  ' +
      (yongsinAnalysis.isStrong ? '신강(身强)' : '신약(身弱)'), W/2, 325);

    ctx.font = '13px sans-serif'; ctx.fillStyle = '#aaa';
    ctx.fillText('행운 색상: ' + yongsinAnalysis.yongsin.color + '  |  방향: ' + yongsinAnalysis.yongsin.direction, W/2, 350);
  }

  // 성격 키워드
  const keywords = ILGAN_PERSONALITY[dayStem].keywords;
  if (keywords) {
    ctx.font = '14px sans-serif'; ctx.fillStyle = '#D4AF37cc';
    ctx.fillText(keywords.map(k => '#' + k).join('  '), W/2, 385);
  }

  // 오행 바
  const elements = {'목':0,'화':0,'토':0,'금':0,'수':0};
  pillars.forEach(p => { elements[CHEONGAN[p.stem].element]++; elements[JIJI[p.branch].element]++; });
  const total = Object.values(elements).reduce((a,b)=>a+b,0);
  let barX = 80;
  ctx.font = '11px sans-serif';
  Object.entries(elements).forEach(([el,val]) => {
    const barW = (val/total) * (W-160);
    ctx.fillStyle = elColors[el]; ctx.fillRect(barX, 410, barW, 20);
    if (barW > 25) { ctx.fillStyle = '#000'; ctx.textAlign = 'center'; ctx.fillText(el, barX+barW/2, 425); }
    barX += barW;
  });
  ctx.textAlign = 'center';

  // 십이운성 표시
  if (ship2) {
    ctx.font = '13px sans-serif'; ctx.fillStyle = '#aaa';
    ctx.fillText('십이운성: ' + ['년','월','일','시'].map((l,i) => l+'=' + SHIP2_NAMES[ship2[i]]).join(' · '), W/2, 460);
  }

  // 하단 URL
  ctx.font = '12px sans-serif'; ctx.fillStyle = '#666';
  ctx.fillText('minetia.github.io/saju-fortune', W/2, 500);

  // 날짜
  const today = new Date();
  ctx.fillText(today.getFullYear() + '.' + (today.getMonth()+1) + '.' + today.getDate() + ' 분석', W/2, 520);

  // QR 대용 안내
  ctx.fillStyle = '#D4AF3744'; ctx.font = '11px sans-serif';
  ctx.fillText('무료 사주 분석 → minetia.github.io/saju-fortune', W/2, 560);

  return canvas;
}

// ============================================================
// 궁합 결과 카드 이미지 생성
// ============================================================
export function generateCompatCard(canvas, saju1, saju2, compatibility, gender1, gender2) {
  const ctx = canvas.getContext('2d');
  const W = 600, H = 400;
  canvas.width = W; canvas.height = H;

  const bg = ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#1a0a2e'); bg.addColorStop(1,'#2e0a1a');
  ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle = '#D4AF3744'; ctx.lineWidth = 2; ctx.strokeRect(15,15,W-30,H-30);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#D4AF37'; ctx.font = '14px sans-serif';
  ctx.fillText('☯ 사주 궁합 분석', W/2, 45);

  // 두 사람 정보
  const el1 = CHEONGAN[saju1.dayStem].element;
  const el2 = CHEONGAN[saju2.dayStem].element;
  const elColors = {'목':'#4ade80','화':'#f87171','토':'#fbbf24','금':'#e5e7eb','수':'#60a5fa'};

  // 왼쪽 사람
  ctx.font = 'bold 32px serif'; ctx.fillStyle = elColors[el1];
  ctx.fillText(CHEONGAN[saju1.dayStem].hanja, 150, 100);
  ctx.font = '14px sans-serif'; ctx.fillStyle = '#ccc';
  ctx.fillText(ILGAN_PERSONALITY[saju1.dayStem].title, 150, 125);
  ctx.fillText(gender1==='male'?'♂ 남성':'♀ 여성', 150, 145);

  // 하트
  ctx.font = '40px serif'; ctx.fillStyle = '#ff6b8a';
  ctx.fillText('❤️', W/2, 110);

  // 오른쪽 사람
  ctx.font = 'bold 32px serif'; ctx.fillStyle = elColors[el2];
  ctx.fillText(CHEONGAN[saju2.dayStem].hanja, 450, 100);
  ctx.font = '14px sans-serif'; ctx.fillStyle = '#ccc';
  ctx.fillText(ILGAN_PERSONALITY[saju2.dayStem].title, 450, 125);
  ctx.fillText(gender2==='male'?'♂ 남성':'♀ 여성', 450, 145);

  // 점수
  if (compatibility) {
    const scoreColor = compatibility.score >= 80 ? '#ff6b8a' : compatibility.score >= 60 ? '#fbbf24' : '#f87171';
    ctx.font = 'bold 60px sans-serif'; ctx.fillStyle = scoreColor;
    ctx.fillText(compatibility.score + '점', W/2, 220);
    ctx.font = 'bold 24px sans-serif'; ctx.fillStyle = '#D4AF37';
    ctx.fillText(compatibility.grade, W/2, 255);
    ctx.font = '13px sans-serif'; ctx.fillStyle = '#aaa';
    compatibility.analysis.slice(0,2).forEach((a,i) => { ctx.fillText(a.substring(0,40), W/2, 285 + i*20); });
  }

  ctx.font = '11px sans-serif'; ctx.fillStyle = '#666';
  ctx.fillText('minetia.github.io/saju-fortune', W/2, 370);

  return canvas;
}

// ============================================================
// 부적(符籍) 생성 엔진
// ============================================================
export function generateTalisman(canvas, type, dayStem, yongsinAnalysis, pillars) {
  const ctx = canvas.getContext('2d');
  const W = 400, H = 600;
  canvas.width = W;
  canvas.height = H;

  const dayElement = CHEONGAN[dayStem].element;
  const yongsin = yongsinAnalysis ? yongsinAnalysis.yongsin.element : dayElement;

  // 오행별 색상/심볼
  const ELEM_COLORS = {
    '목': { main:'#22c55e', sub:'#166534', bg:'#052e16', glow:'#4ade80', char:'木', trigram:'☳', dir:'東', animal:'龍' },
    '화': { main:'#ef4444', sub:'#991b1b', bg:'#450a0a', glow:'#f87171', char:'火', trigram:'☲', dir:'南', animal:'鳳' },
    '토': { main:'#f59e0b', sub:'#92400e', bg:'#451a03', glow:'#fbbf24', char:'土', trigram:'☷', dir:'中', animal:'麒' },
    '금': { main:'#e5e7eb', sub:'#6b7280', bg:'#1f2937', glow:'#f3f4f6', char:'金', trigram:'☱', dir:'西', animal:'虎' },
    '수': { main:'#3b82f6', sub:'#1e3a5f', bg:'#0c1629', glow:'#60a5fa', char:'水', trigram:'☵', dir:'北', animal:'龜' }
  };

  const elemStyle = ELEM_COLORS[yongsin] || ELEM_COLORS['토'];

  // 부적 종류별 설정
  const TALISMAN_CONFIG = {
    'yongsin': { title:'용신부적', hanja:'用神符', mainChar: elemStyle.char, purpose:'사주 균형', desc:'사주의 균형을 맞춰주는 용신의 기운을 담은 부적', mantra:'天地用神 護身安命' },
    'wealth': { title:'재물부적', hanja:'財物符', mainChar:'財', purpose:'재물 증진', desc:'재물운을 높이고 금전적 안정을 가져오는 부적', mantra:'招財進寶 金玉滿堂' },
    'health': { title:'건강부적', hanja:'健康符', mainChar:'壽', purpose:'건강 장수', desc:'질병을 물리치고 건강과 장수를 기원하는 부적', mantra:'百病消除 延年益壽' },
    'love': { title:'연애부적', hanja:'戀愛符', mainChar:'緣', purpose:'좋은 인연', desc:'좋은 인연을 만나고 사랑이 이루어지는 부적', mantra:'天定良緣 百年好合' },
    'study': { title:'학업부적', hanja:'學業符', mainChar:'魁', purpose:'학업 성취', desc:'시험 합격과 학업 성취를 기원하는 부적', mantra:'文昌帝君 金榜題名' },
    'protect': { title:'액막이부적', hanja:'辟邪符', mainChar:'鎭', purpose:'액운 방지', desc:'나쁜 기운과 액운을 물리치는 보호 부적', mantra:'天官賜福 百邪不侵' }
  };

  const config = TALISMAN_CONFIG[type] || TALISMAN_CONFIG['yongsin'];

  // === 배경 ===
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#1a0a00');
  bgGrad.addColorStop(0.5, '#2a1500');
  bgGrad.addColorStop(1, '#1a0a00');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // === 테두리 장식 ===
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 3;
  ctx.strokeRect(15, 15, W-30, H-30);
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 1;
  ctx.strokeRect(22, 22, W-44, H-44);

  // 모서리 장식
  const corners = [[25,25],[W-25,25],[25,H-25],[W-25,H-25]];
  corners.forEach(([cx,cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI*2);
    ctx.fillStyle = '#D4AF37';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI*2);
    ctx.fillStyle = '#1a0a00';
    ctx.fill();
  });

  // === 상단: 팔괘 장식 + 제목 ===
  ctx.fillStyle = '#D4AF37';
  ctx.font = '16px serif';
  ctx.textAlign = 'center';
  const trigrams = ['☰','☱','☲','☳','☴','☵','☶','☷'];
  trigrams.forEach((t, i) => {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const tx = W/2 + Math.cos(angle) * 55;
    const ty = 85 + Math.sin(angle) * 55;
    ctx.fillText(t, tx, ty);
  });

  // 태극 원
  ctx.beginPath();
  ctx.arc(W/2, 85, 25, 0, Math.PI*2);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 태극 심볼
  ctx.font = '28px serif';
  ctx.fillStyle = '#D4AF37';
  ctx.fillText('☯', W/2, 93);

  // 부적 이름
  ctx.font = 'bold 22px serif';
  ctx.fillStyle = '#D4AF37';
  ctx.fillText(config.hanja, W/2, 160);

  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#b8860b';
  ctx.fillText(config.title + ' · ' + config.purpose, W/2, 180);

  // === 중앙: 메인 부적 문양 ===
  ctx.beginPath();
  ctx.arc(W/2, 320, 110, 0, Math.PI*2);
  ctx.strokeStyle = elemStyle.main + '66';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(W/2, 320, 95, 0, Math.PI*2);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 팔방위 문자
  const directions = ['北','東北','東','東南','南','西南','西','西北'];
  directions.forEach((d, i) => {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const dx = W/2 + Math.cos(angle) * 102;
    const dy = 320 + Math.sin(angle) * 102;
    ctx.font = '10px serif';
    ctx.fillStyle = '#D4AF37';
    ctx.fillText(d, dx, dy + 4);
  });

  // 중앙 큰 글자
  ctx.shadowColor = elemStyle.glow;
  ctx.shadowBlur = 30;
  ctx.font = 'bold 80px serif';
  ctx.fillStyle = elemStyle.main;
  ctx.fillText(config.mainChar, W/2, 345);
  ctx.shadowBlur = 0;

  // 용신 오행 글자 (좌우)
  ctx.font = 'bold 28px serif';
  ctx.fillStyle = elemStyle.main + 'aa';
  ctx.fillText(elemStyle.trigram, W/2 - 60, 310);
  ctx.fillText(elemStyle.trigram, W/2 + 60, 310);

  // 사주 4기둥 한자 (좌우 세로)
  if (pillars) {
    ctx.font = '14px serif';
    ctx.fillStyle = '#D4AF37cc';
    const pillarLabels = ['年','月','日','時'];
    pillars.forEach((p, i) => {
      ctx.fillText(pillarLabels[i], 50, 250 + i*35);
      ctx.fillText(CHEONGAN[p.stem].hanja, 68, 250 + i*35);
      ctx.fillText(JIJI[p.branch].hanja, W-68, 250 + i*35);
    });
  }

  // === 주문(呪文) ===
  ctx.font = 'bold 16px serif';
  ctx.fillStyle = '#D4AF37';
  const half = Math.ceil(config.mantra.length / 2);
  ctx.fillText(config.mantra.substring(0, half), W/2, 430);
  ctx.fillText(config.mantra.substring(half), W/2, 455);

  // === 하단: 용신 정보 + 인장 ===
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#b8860b';
  ctx.fillText(`일간: ${CHEONGAN[dayStem].name}${dayElement}(${ELEM_COLORS[dayElement].char}) · 용신: ${yongsin}(${ELEM_COLORS[yongsin].char})`, W/2, 490);
  ctx.fillText(`방위: ${elemStyle.dir} · 색상: ${yongsinAnalysis ? yongsinAnalysis.yongsin.color : ''}`, W/2, 508);

  // 인장 (도장)
  ctx.save();
  ctx.translate(W/2, 550);
  ctx.rotate(-0.1);
  ctx.strokeStyle = '#c41e3a';
  ctx.lineWidth = 2;
  ctx.strokeRect(-25, -18, 50, 36);
  ctx.font = 'bold 14px serif';
  ctx.fillStyle = '#c41e3a';
  ctx.fillText('開運', 0, 5);
  ctx.restore();

  // 날짜
  const today = new Date();
  ctx.font = '9px sans-serif';
  ctx.fillStyle = '#666';
  ctx.fillText(`${today.getFullYear()}年 ${today.getMonth()+1}月 ${today.getDate()}日 作成`, W/2, 585);

  return canvas;
}
