// 지지 육합
export const YUKHAP = [[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
export const YUKHAP_RESULT = ['토','목','화','금','수','화']; // 합화 결과

// 지지 삼합
export const SAMHAP = [
  { branches: [2,6,10], element: '화', name: '인오술 삼합화국' },
  { branches: [11,3,7], element: '목', name: '해묘미 삼합목국' },
  { branches: [8,0,4], element: '수', name: '신자진 삼합수국' },
  { branches: [5,9,1], element: '금', name: '사유축 삼합금국' }
];

// 지지 방합
export const BANGHAP = [
  { branches: [2,3,4], element: '목', name: '인묘진 동방목국' },
  { branches: [5,6,7], element: '화', name: '사오미 남방화국' },
  { branches: [8,9,10], element: '금', name: '신유술 서방금국' },
  { branches: [11,0,1], element: '수', name: '해자축 북방수국' }
];

// 지지 충
export const JIJI_CHUNG = [[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]];

// 지지 형
export const JIJI_HYUNG = {
  samhyung1: { branches: [2,5,8], name: '인사신 삼형(무은지형)' },
  samhyung2: { branches: [1,10,7], name: '축술미 삼형(지세지형)' },
  murye: [[0,3]], // 자묘 무례지형
  jahyung: [[4,4],[6,6],[9,9],[11,11]] // 진진, 오오, 유유, 해해 자형
};

// 지지 파
export const JIJI_PA = [[0,9],[1,4],[2,11],[3,6],[5,8],[10,7]];

// 지지 해
export const JIJI_HAE = [[0,7],[1,6],[2,5],[3,4],[8,11],[9,10]];

// 천간합
export const CHUNGAN_HAP = [
  { pair: [0,5], result: '토', name: '갑기합토' },
  { pair: [1,6], result: '금', name: '을경합금' },
  { pair: [2,7], result: '수', name: '병신합수' },
  { pair: [3,8], result: '목', name: '정임합목' },
  { pair: [4,9], result: '화', name: '무계합화' }
];

// 천간충
export const CHUNGAN_CHUNG = [[0,6],[1,7],[2,8],[3,9]];
