export type Lang = 'zh' | 'en';
const KEY = 'epq_lang_v1';

export function getLang(): Lang {
  const v = localStorage.getItem(KEY);
  return v === 'en' ? 'en' : 'zh';
}

export function setLang(v: Lang) {
  localStorage.setItem(KEY, v);
}
