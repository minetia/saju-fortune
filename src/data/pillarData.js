export const CHEONGAN = [
  { name: '갑', hanja: '甲', element: '목', yin: false },
  { name: '을', hanja: '乙', element: '목', yin: true },
  { name: '병', hanja: '丙', element: '화', yin: false },
  { name: '정', hanja: '丁', element: '화', yin: true },
  { name: '무', hanja: '戊', element: '토', yin: false },
  { name: '기', hanja: '己', element: '토', yin: true },
  { name: '경', hanja: '庚', element: '금', yin: false },
  { name: '신', hanja: '辛', element: '금', yin: true },
  { name: '임', hanja: '壬', element: '수', yin: false },
  { name: '계', hanja: '癸', element: '수', yin: true }
];

export const JIJI = [
  { name: '자', hanja: '子', element: '수', yin: false, animal: '쥐', time: '23~01' },
  { name: '축', hanja: '丑', element: '토', yin: true, animal: '소', time: '01~03' },
  { name: '인', hanja: '寅', element: '목', yin: false, animal: '호랑이', time: '03~05' },
  { name: '묘', hanja: '卯', element: '목', yin: true, animal: '토끼', time: '05~07' },
  { name: '진', hanja: '辰', element: '토', yin: false, animal: '용', time: '07~09' },
  { name: '사', hanja: '巳', element: '화', yin: true, animal: '뱀', time: '09~11' },
  { name: '오', hanja: '午', element: '화', yin: false, animal: '말', time: '11~13' },
  { name: '미', hanja: '未', element: '토', yin: true, animal: '양', time: '13~15' },
  { name: '신', hanja: '申', element: '금', yin: false, animal: '원숭이', time: '15~17' },
  { name: '유', hanja: '酉', element: '금', yin: true, animal: '닭', time: '17~19' },
  { name: '술', hanja: '戌', element: '토', yin: false, animal: '개', time: '19~21' },
  { name: '해', hanja: '亥', element: '수', yin: true, animal: '돼지', time: '21~23' }
];

// 지장간 데이터
export const JIJANGGAN = {
  0: [{s:9,w:10}],
  1: [{s:9,w:3},{s:7,w:3},{s:5,w:4}],
  2: [{s:4,w:3},{s:2,w:3},{s:0,w:4}],
  3: [{s:1,w:10}],
  4: [{s:1,w:3},{s:9,w:3},{s:4,w:4}],
  5: [{s:4,w:3},{s:6,w:3},{s:2,w:4}],
  6: [{s:5,w:3},{s:3,w:7}],
  7: [{s:3,w:3},{s:1,w:3},{s:5,w:4}],
  8: [{s:4,w:3},{s:8,w:3},{s:6,w:4}],
  9: [{s:7,w:10}],
  10:[{s:7,w:3},{s:3,w:3},{s:4,w:4}],
  11:[{s:0,w:3},{s:8,w:7}]
};

// 십성 이름
export const SIPSUNG_NAMES = ['비견','겁재','식신','상관','편재','정재','편관','정관','편인','정인'];

// 십이운성
export const SHIP2_NAMES = ['장생','목욕','관대','건록','제왕','쇠','병','사','묘','절','태','양'];

// 십이운성 조견표 (일간 기준, 지지별)
export const SHIP2_TABLE = [
  [11,10,0,1,2,3,4,5,6,7,8,9], // 갑
  [6,5,4,3,2,1,0,11,10,9,8,7], // 을
  [2,1,0,11,10,9,8,7,6,5,4,3], // 병
  [8,7,6,5,4,3,2,1,0,11,10,9], // 정
  [2,1,0,11,10,9,8,7,6,5,4,3], // 무
  [8,7,6,5,4,3,2,1,0,11,10,9], // 기
  [5,4,3,2,1,0,11,10,9,8,7,6], // 경
  [11,10,9,8,7,6,5,4,3,2,1,0], // 신
  [8,7,6,5,4,3,2,1,0,11,10,9], // 임
  [2,1,0,11,10,9,8,7,6,5,4,3]  // 계
];

// 오행 상생상극
export const OHENG_ORDER = ['목','화','토','금','수'];
export const OHENG_COLORS = { '목':'#4ade80', '화':'#f87171', '토':'#fbbf24', '금':'#e5e7eb', '수':'#60a5fa' };
export const OHENG_BG = { '목':'rgba(74,222,128,0.15)', '화':'rgba(248,113,113,0.15)', '토':'rgba(251,191,36,0.15)', '금':'rgba(229,231,235,0.15)', '수':'rgba(96,165,250,0.15)' };
