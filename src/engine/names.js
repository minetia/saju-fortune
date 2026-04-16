// ============================================================
// Name Analysis (Seongmyeonghak) Functions
// ============================================================
import { HANGUL_STROKES } from '../data/hangulData.js';

export function decomposeHangul(char) {
  const code = char.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return { cho: '', jung: '', jong: '' };
  const cho = Math.floor(code / 588);
  const jung = Math.floor((code % 588) / 28);
  const jong = code % 28;
  const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const JUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
  const JONG = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  return { cho: CHO[cho], jung: JUNG[jung], jong: JONG[jong] };
}

export function getCharStrokes(char) {
  const d = decomposeHangul(char);
  let strokes = 0;
  strokes += HANGUL_STROKES[d.cho] || 0;
  strokes += HANGUL_STROKES[d.jung] || 0;
  if (d.jong) {
    if (d.jong.length === 2) {
      strokes += (HANGUL_STROKES[d.jong[0]] || 0) + (HANGUL_STROKES[d.jong[1]] || 0);
    } else {
      strokes += HANGUL_STROKES[d.jong] || 0;
    }
  }
  return strokes;
}

export function analyzeName(fullName) {
  if (!fullName || fullName.length < 2) return null;
  const chars = fullName.split('');
  const strokes = chars.map(c => getCharStrokes(c));
  const total = strokes.reduce((a, b) => a + b, 0);

  // 음양 분석
  const yinYang = strokes.map(s => s % 2 === 0 ? '음' : '양');

  // 오행 매핑 (획수의 일의 자리)
  const STROKE_ELEMENT = { 1:'목', 2:'목', 3:'화', 4:'화', 5:'토', 6:'토', 7:'금', 8:'금', 9:'수', 0:'수' };
  const elements = strokes.map(s => STROKE_ELEMENT[s % 10]);

  // 원격(元格): 성 획수, 형격(亨格): 성+이름 첫 글자, 이격(利格): 이름, 정격(貞格): 전체
  const wonGyeok = strokes[0];
  const hyungGyeok = strokes.length >= 2 ? strokes[0] + strokes[1] : strokes[0];
  const yiGyeok = strokes.length >= 3 ? strokes[1] + strokes[2] : strokes[strokes.length - 1];
  const jeongGyeok = total;

  // 수리 해석 (81수리 간략 버전)
  const SURI_LUCK = {
    1:'대길',3:'길',5:'대길',6:'대길',7:'길',8:'대길',11:'대길',13:'대길',15:'대길',
    16:'대길',17:'길',18:'대길',21:'대길',23:'대길',24:'대길',25:'길',29:'길',
    31:'대길',32:'길',33:'대길',35:'길',37:'대길',39:'길',41:'대길',45:'대길',
    47:'길',48:'대길',52:'길',57:'길',61:'길',63:'길',65:'대길',67:'길',68:'대길',
    2:'흉',4:'흉',9:'흉',10:'흉',12:'흉',14:'흉',19:'흉',20:'흉',22:'흉',
    26:'흉',27:'흉',28:'흉',30:'흉',34:'흉',36:'흉',40:'흉',42:'흉',43:'흉',
    44:'흉',46:'흉',49:'흉',50:'흉',54:'흉',56:'흉',59:'흉',60:'흉',62:'흉',64:'흉',66:'흉'
  };

  function getLuck(n) { return SURI_LUCK[n] || (n % 2 === 1 ? '길' : '보통'); }

  // 상생상극 체크
  const SAENG = {'목':'화','화':'토','토':'금','금':'수','수':'목'};
  const GEUK = {'목':'토','화':'금','토':'수','금':'목','수':'화'};
  let harmony = 0;
  for (let i = 0; i < elements.length - 1; i++) {
    if (SAENG[elements[i]] === elements[i+1] || SAENG[elements[i+1]] === elements[i]) harmony++;
    else if (GEUK[elements[i]] === elements[i+1] || GEUK[elements[i+1]] === elements[i]) harmony--;
  }

  const totalScore = Math.max(30, Math.min(98, 60 + (getLuck(total)==='대길'?20:getLuck(total)==='길'?10:getLuck(total)==='흉'?-15:0) + harmony * 8));

  return {
    name: fullName, chars, strokes, total,
    yinYang, elements,
    wonGyeok: { value: wonGyeok, luck: getLuck(wonGyeok), desc: '초년운 (0~20세)' },
    hyungGyeok: { value: hyungGyeok, luck: getLuck(hyungGyeok), desc: '청년운 (20~40세)' },
    yiGyeok: { value: yiGyeok, luck: getLuck(yiGyeok), desc: '중년운 (40~60세)' },
    jeongGyeok: { value: jeongGyeok, luck: getLuck(jeongGyeok), desc: '말년운·총운' },
    harmony: harmony > 0 ? '상생 조합 (좋음)' : harmony < 0 ? '상극 조합 (주의)' : '평범한 조합',
    totalScore
  };
}
