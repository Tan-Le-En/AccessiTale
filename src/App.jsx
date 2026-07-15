import React, {
  createContext, useContext, useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import {
  Home, Plus, Settings as SettingsIcon, Globe, ArrowLeft, Play, Pause, Mic,
  Volume2, X, Check, RotateCcw, ArrowRight, Sparkles, Maximize2, Star,
  Zap, Type, ZoomIn, Smile, BookOpen, Keyboard, SkipForward, ChevronLeft,
  Timer, Eye, ChevronRight,
} from 'lucide-react';

/* =====================================================
   THEME
===================================================== */
const THEME = {
  normal: {
    bg: '#FDF6EC',
    panel: '#FFF9F0',
    textPrimary: '#3E3226',
    textSecondary: '#8D7B68',
    accent: '#FF8A65',
    accentHover: '#FF7043',
    secondary: '#4DB6AC',
    success: '#81C784',
    caution: '#FFB74D',
    overlay: 'rgba(62,50,38,0.3)',
  },
  contrast: {
    bg: '#000000',
    panel: '#141414',
    textPrimary: '#FFFFFF',
    textSecondary: '#D8D8D8',
    accent: '#FFD54F',
    accentHover: '#FFC93C',
    secondary: '#FFD54F',
    success: '#81C784',
    caution: '#FFB74D',
    overlay: 'rgba(0,0,0,0.65)',
  },
};

function withAlpha(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* =====================================================
   TRANSLATIONS
===================================================== */
const STR = {
  en: {
    appName: 'AccessiTale', newStory: '+ New Story',
    emptyTitle: 'No stories yet — write your first one!', emptyCta: 'Write a Story',
    bionicReady: 'Bionic Ready', untitled: 'Untitled Story', titlePlaceholder: 'Untitled Story',
    bodyPlaceholder: 'Once upon a time...', words: 'words', makeAccessible: 'Make it Accessible ✨',
    back: 'Back', narrate: 'Narrate story', stopNarrate: 'Stop narrating', bionic: 'Bionic',
    dyslexiaFont: 'Dyslexia Font', largeText: 'Large Text', emojis: 'Emojis',
    practiceReading: 'Practice Reading This 📖', focusMode: 'Focus Mode', settings: 'Settings',
    highContrast: 'High Contrast', emojiVisualizer: 'Emoji Visualizer', narrationSpeed: 'Narration Speed',
    resetDefaults: 'Reset to Defaults', close: 'Close', listenFirst: 'Listen First 🔊',
    startRecording: 'Start recording', stopRecording: 'Stop recording', tryAgain: 'Try Again',
    nextSentence: 'Next Sentence →', skipSentence: 'Skip', prevSentence: '← Previous',
    typeWhatYouRead: 'Type what you read', submit: 'Submit',
    notSupported: "Voice features aren't supported in this browser. You can still read and write stories!",
    discardTitle: 'Discard unsaved changes?', discardBody: 'This story has unsaved changes. Leave without saving?',
    discardConfirm: 'Discard', discardCancel: 'Keep Editing',
    translationNote: 'Story text stays in the language you wrote it — only the menus change language.',
    gotIt: 'Got it', exitFocus: 'Exit focus mode', small: 'S', medium: 'M', large: 'L', xlarge: 'XL',
    languagePicker: 'Choose language', practiceComplete: 'Practice complete!', practiceCompleteBody: 'Great job reading through this story.',
    backToStory: 'Back to Story', noSentences: 'Add some words to your story to practice reading it aloud.',
    yourStories: 'Your Stories', wordsCorrect: (c, t) => `${c} of ${t} words correct`,
    starsEarned: (n) => `${n} star${n === 1 ? '' : 's'}`, sentenceOf: (i, n) => `Sentence ${i} of ${n}`,
    noDefinition: 'No definition found for this word.', lookingUp: 'Looking up…',
    malayWord: 'Malay word', chineseCharacter: 'Chinese character',
    pinyin: 'Pinyin', radical: 'Radical', strokes: 'Strokes',
    voice: 'Voice', speedRead: 'Speed Read', typeCheck: 'Type & Check',
    readAlong: 'Read along as words highlight...', readSpeed: 'Reading Speed',
    wpm: 'WPM', tapWhenReady: 'Tap when ready', typeSentence: 'Now type the sentence from memory:',
    correct: 'Correct!', almost: 'Almost!', keepTrying: 'Keep trying!',
    voiceName: 'Narrator Voice', defaultVoice: 'System Default',
    trySample: 'Try a Sample', sampleDesc: 'Quick-start with a pre-loaded story',
  },
  ms: {
    appName: 'AccessiTale', newStory: '+ Cerita Baharu',
    emptyTitle: 'Belum ada cerita — tulis cerita pertama anda!', emptyCta: 'Tulis Cerita',
    bionicReady: 'Sedia Bionik', untitled: 'Cerita Tanpa Tajuk', titlePlaceholder: 'Cerita Tanpa Tajuk',
    bodyPlaceholder: 'Pada suatu masa dahulu...', words: 'perkataan', makeAccessible: 'Jadikan Mudah Diakses ✨',
    back: 'Kembali', narrate: 'Bacakan cerita', stopNarrate: 'Henti bacaan', bionic: 'Bionik',
    dyslexiaFont: 'Fon Disleksia', largeText: 'Teks Besar', emojis: 'Emoji',
    practiceReading: 'Latih Membaca Ini 📖', focusMode: 'Mod Fokus', settings: 'Tetapan',
    highContrast: 'Kontras Tinggi', emojiVisualizer: 'Penunjuk Emoji', narrationSpeed: 'Kelajuan Bacaan',
    resetDefaults: 'Set Semula', close: 'Tutup', listenFirst: 'Dengar Dahulu 🔊',
    startRecording: 'Mula rakam', stopRecording: 'Henti rakam', tryAgain: 'Cuba Lagi',
    nextSentence: 'Ayat Seterusnya →', skipSentence: 'Langkau', prevSentence: '← Sebelumnya',
    typeWhatYouRead: 'Taip apa yang anda baca', submit: 'Hantar',
    notSupported: 'Ciri suara tidak disokong dalam pelayar ini. Anda masih boleh membaca dan menulis cerita!',
    discardTitle: 'Buang perubahan belum disimpan?', discardBody: 'Cerita ini mempunyai perubahan belum disimpan. Keluar tanpa menyimpan?',
    discardConfirm: 'Buang', discardCancel: 'Terus Edit',
    translationNote: 'Teks cerita kekal dalam bahasa asal — hanya menu bertukar bahasa.',
    gotIt: 'Faham', exitFocus: 'Keluar mod fokus', small: 'K', medium: 'S', large: 'B', xlarge: 'XB',
    languagePicker: 'Pilih bahasa', practiceComplete: 'Latihan selesai!', practiceCompleteBody: 'Syabas kerana membaca cerita ini.',
    backToStory: 'Kembali ke Cerita', noSentences: 'Tambah beberapa perkataan pada cerita anda untuk berlatih membaca.',
    yourStories: 'Cerita Anda', wordsCorrect: (c, t) => `${c} daripada ${t} perkataan betul`,
    starsEarned: (n) => `${n} bintang`, sentenceOf: (i, n) => `Ayat ${i} daripada ${n}`,
    noDefinition: 'Maksud perkataan ini tidak dijumpai.', lookingUp: 'Mencari maksud…',
    malayWord: 'Perkataan Melayu', chineseCharacter: 'Aksara Cina',
    pinyin: 'Pinyin', radical: 'Akar', strokes: 'Coretan',
    voice: 'Suara', speedRead: 'Bacaan Pantas', typeCheck: 'Taip & Semak',
    readAlong: 'Baca sambil perkataan disorot...', readSpeed: 'Kelajuan Bacaan',
    wpm: 'Perkataan/minit', tapWhenReady: 'Ketik apabila sedia', typeSentence: 'Sekarang taip ayat dari ingatan:',
    correct: 'Betul!', almost: 'Hampir!', keepTrying: 'Terus mencuba!',
    voiceName: 'Suara Pencerita', defaultVoice: 'Sistem Lalai',
    trySample: 'Cuba Contoh', sampleDesc: 'Mulakan dengan cerita sedia ada',
  },
  zh: {
    appName: 'AccessiTale', newStory: '+ 新故事',
    emptyTitle: '还没有故事——写下你的第一个故事吧！', emptyCta: '写故事',
    bionicReady: '仿生已就绪', untitled: '无标题故事', titlePlaceholder: '无标题故事',
    bodyPlaceholder: '很久很久以前...', words: '字', makeAccessible: '设为无障碍 ✨',
    back: '返回', narrate: '朗读故事', stopNarrate: '停止朗读', bionic: '仿生阅读',
    dyslexiaFont: '易读字体', largeText: '大字体', emojis: '表情符号',
    practiceReading: '练习朗读 📖', focusMode: '专注模式', settings: '设置',
    highContrast: '高对比度', emojiVisualizer: '表情图示', narrationSpeed: '朗读速度',
    resetDefaults: '恢复默认', close: '关闭', listenFirst: '先听一听 🔊',
    startRecording: '开始录音', stopRecording: '停止录音', tryAgain: '再试一次',
    nextSentence: '下一句 →', skipSentence: '跳过', prevSentence: '← 上一句',
    typeWhatYouRead: '输入你读到的内容', submit: '提交',
    notSupported: '此浏览器不支持语音功能。你仍然可以阅读和写故事！',
    discardTitle: '放弃未保存的更改？', discardBody: '这个故事有未保存的更改。要不保存就离开吗？',
    discardConfirm: '放弃', discardCancel: '继续编辑',
    translationNote: '故事内容保持原语言——只有菜单会切换语言。',
    gotIt: '知道了', exitFocus: '退出专注模式', small: '小', medium: '中', large: '大', xlarge: '特大',
    languagePicker: '选择语言', practiceComplete: '练习完成！', practiceCompleteBody: '你把这个故事读完了，做得好。',
    backToStory: '返回故事', noSentences: '给故事多写几个字，才能练习朗读哦。',
    yourStories: '我的故事', wordsCorrect: (c, t) => `${t} 个字中读对了 ${c} 个`,
    starsEarned: (n) => `${n} 颗星`, sentenceOf: (i, n) => `第 ${i} 句，共 ${n} 句`,
    noDefinition: '找不到这个词的释义。', lookingUp: '查询中…',
    malayWord: '马来语词', chineseCharacter: '汉字',
    pinyin: '拼音', radical: '部首', strokes: '笔画',
    voice: '语音', speedRead: '快速阅读', typeCheck: '输入检查',
    readAlong: '跟随高亮阅读...', readSpeed: '阅读速度',
    wpm: '字/分钟', tapWhenReady: '准备好后点击', typeSentence: '现在凭记忆输入句子：',
    correct: '正确！', almost: '差不多！', keepTrying: '继续加油！',
    voiceName: '朗读语音', defaultVoice: '系统默认',
    trySample: '试试示例', sampleDesc: '使用预设故事快速开始',
  },
};

/* =====================================================
   EMOJI DICTIONARY (whole-word match)
===================================================== */
const EMOJI_MAP = {
  cat: '🐱', cats: '🐱', dog: '🐶', dogs: '🐶', sun: '☀️', moon: '🌙',
  star: '⭐', stars: '✨', tree: '🌳', trees: '🌳', house: '🏠', water: '💧',
  fire: '🔥', king: '🤴', queen: '👸', princess: '👸', prince: '🤴',
  dragon: '🐉', forest: '🌲', river: '🏞️', mountain: '⛰️', bird: '🐦',
  fish: '🐟', flower: '🌸', flowers: '🌸', rain: '🌧️', snow: '❄️',
  wind: '💨', night: '🌃', happy: '😊', sad: '😢', run: '🏃', ran: '🏃',
  jump: '🦘', jumped: '🦘', fly: '🦋', flew: '🦋', swim: '🏊', swam: '🏊',
  eat: '🍽️', ate: '🍽️', sleep: '😴', slept: '😴', love: '❤️', loved: '❤️',
  friend: '🧑‍🤝‍🧑', friends: '🧑‍🤝‍🧑', family: '👨‍👩‍👧‍👦', magic: '🪄',
  castle: '🏰', ship: '🚢', boat: '⛵', car: '🚗', book: '📖', music: '🎵',
  dance: '💃', sing: '🎤', walk: '🚶', big: '🐘', small: '🐭', brave: '🦁',
  wolf: '🐺', bear: '🐻', rabbit: '🐰', mouse: '🐭', owl: '🦉', egg: '🥚',
  apple: '🍎', garden: '🌷', rainbow: '🌈', cloud: '☁️', sea: '🌊',
  island: '🏝️', gold: '✨', treasure: '💰', door: '🚪', key: '🔑',
};

const ZH_EMOJI = {
  '\u732B': '\uD83D\uDC31', '\u72D7': '\uD83D\uDC36', '\u592A\u9633': '\u2600\uFE0F',
  '\u6708\u4EAE': '\uD83C\uDF19', '\u661F\u661F': '\u2B50', '\u6811': '\uD83C\uDF33',
  '\u623F\u5B50': '\uD83C\uDFE0', '\u6C34': '\uD83D\uDCA7', '\u706B': '\uD83D\uDD25',
  '\u9F99': '\uD83D\uDC09', '\u68EE\u6797': '\uD83C\uDF32', '\u6CB3\u6D41': '\uD83C\uDFDE\uFE0F',
  '\u5C71': '\u26F0\uFE0F', '\u9E1F': '\uD83D\uDC26', '\u9C7C': '\uD83D\uDC1F',
  '\u82B1': '\uD83C\uDF38', '\u96E8': '\uD83C\uDF27\uFE0F', '\u96EA': '\u2744\uFE0F',
  '\u98CE': '\uD83D\uDCA8', '\u591C\u665A': '\uD83C\uDF03', '\u5F00\u5FC3': '\uD83D\uDE0A',
  '\u4F24\u5FC3': '\uD83D\uDE22', '\u98DE': '\uD83E\uDD8B', '\u6E38\u6CF3': '\uD83C\uDFCA',
  '\u7761\u89C9': '\uD83D\uDE34', '\u7231': '\u2764\uFE0F', '\u670B\u53CB': '\uD83E\uDD1D',
  '\u5BB6\u5EAD': '\uD83D\uDC6A', '\u9B54\u6CD5': '\uD83E\uDE84', '\u57CE\u5821': '\uD83C\uDFF0',
  '\u8239': '\uD83D\uDEA2', '\u5C0F\u8239': '\u26F5', '\u6C7D\u8F66': '\uD83D\uDE97',
  '\u4E66': '\uD83D\uDCD6', '\u97F3\u4E50': '\uD83C\uDFB5', '\u821E\u8E48': '\uD83D\uDC83',
  '\u5531\u6B4C': '\uD83C\uDFA4', '\u8D70\u8DEF': '\uD83D\uDEB6', '\u5927': '\uD83D\uDC18',
  '\u5C0F': '\uD83D\uDC2D', '\u52C7\u6562': '\uD83E\uDD81', '\u718A': '\uD83D\uDC3B',
  '\u5154\u5B50': '\uD83D\uDC30', '\u9E21\u86CB': '\uD83E\uDD5A', '\u82B9\u83DC': '\uD83C\uDF3F',
  '\u5F69\u8679': '\uD83C\uDF08', '\u4E91': '\u2601\uFE0F', '\u6D77': '\uD83C\uDF0A',
  '\u5B64\u5C9B': '\uD83C\uDFDD\uFE0F', '\u94A5\u5319': '\uD83D\uDD11', '\u95E8': '\uD83D\uDEAA',
  '\u9E21': '\uD83D\uDC14', '\u9A6C': '\uD83D\uDC34', '\u725B': '\uD83D\uDC02',
  '\u86C7': '\uD83D\uDC0D', '\u9F20': '\uD83D\uDC00', '\u867E': '\uD83E\uDD90',
  '\u83DC': '\uD83E\uDD6C', '\u8611\u83C7': '\uD83C\uDF44', '\u5C0F\u9E21': '\uD83D\uDC24',
  '\u8001\u864E': '\uD83D\uDC2F', '\u751F\u6D3B': '\uD83C\uDFE0', '\u81EA\u7531': '\uD83C\uDFF3\uFE0F',
  '\u5E0C\u671B': '\uD83C\uDF1F', '\u52C7\u6C14': '\uD83E\uDDE1', '\u5149\u8292': '\uD83C\uDF1F',
};

/* =====================================================
   TEXT UTILITIES
===================================================== */
function splitSentences(text) {
  if (!text || !text.trim()) return [];
  const trimmed = text.trim();

  const raw = [];
  const sentenceRegex = /[^\u3002\uFF01\uFF1F.!?…]+(?:[\u3002\uFF01\uFF1F.!?…](?:\s|$|(?=[^\u3002\uFF01\uFF1F.!?…])))+/g;
  let match;
  while ((match = sentenceRegex.exec(trimmed)) !== null) {
    const piece = match[0].trim();
    if (piece) raw.push(piece);
  }

  if (raw.length === 0) {
    raw.push(trimmed);
  }

  const result = [];
  raw.forEach((s) => {
    const words = tokenizeText(s);
    if (words.length <= 30) {
      result.push(s);
    } else {
      let i = 0;
      while (i < words.length) {
        let breakAt = Math.min(i + 25, words.length);
        for (let j = breakAt - 1; j >= i + 10; j--) {
          if (/[,;:]$/.test(words[j]) || (j < words.length - 1 && /^["'"'\u201C\u201D]$/.test(words[j + 1]))) {
            breakAt = j + 1;
            break;
          }
        }
        result.push(words.slice(i, breakAt).join(' '));
        i = breakAt;
      }
    }
  });

  return result;
}

function chunkSentenceWords(sentence, target = 9) {
  const words = tokenizeText(sentence);
  if (words.length <= 10) return [sentence];
  const lines = [];
  let i = 0;
  while (i < words.length) {
    const windowEnd = Math.min(i + target, words.length);
    let breakAt = -1;
    for (let j = windowEnd - 1; j >= i + 5 && j < words.length; j--) {
      if (/,$/.test(words[j])) { breakAt = j + 1; break; }
    }
    if (breakAt === -1) breakAt = windowEnd;
    lines.push(words.slice(i, breakAt).join(' '));
    i = breakAt;
  }
  return lines;
}

function chunkLinesWithSentenceIndex(text) {
  const sentences = splitSentences(text);
  const lines = [];
  sentences.forEach((s, sIdx) => {
    chunkSentenceWords(s).forEach((line) => lines.push({ text: line, sentenceIdx: sIdx }));
  });
  return { lines, sentences };
}

function splitWordPunct(token) {
  const m = token.match(/^([^a-zA-Z\u00C0-\u024F\u0400-\u04FF\u0600-\u06FF\u0E00-\u0E7F\u4E00-\u9FFF]*)([a-zA-Z\u00C0-\u024F\u0400-\u04FF\u0600-\u06FF\u0E00-\u0E7F\u4E00-\u9FFF]*)([^a-zA-Z\u00C0-\u024F\u0400-\u04FF\u0600-\u06FF\u0E00-\u0E7F\u4E00-\u9FFF]*)$/);
  if (!m) return { lead: '', core: token, trail: '' };
  return { lead: m[1], core: m[2], trail: m[3] };
}

function hasCJK(text) {
  return /[\u3000-\u9FFF\uF900-\uFAFF]/.test(text);
}

function tokenizeText(text) {
  if (!text) return [];
  if (hasCJK(text)) {
    const result = [];
    let buf = '';
    for (const ch of text) {
      if (/[\u4E00-\u9FFF\u3000-\u303F\uFF00-\uFFEF]/.test(ch)) {
        if (buf) { result.push(buf); buf = ''; }
        result.push(ch);
      } else {
        buf += ch;
      }
    }
    if (buf) result.push(buf);
    return result.filter(Boolean);
  }
  return text.split(/\s+/).filter(Boolean);
}

function bionicBoldLength(core) {
  if (core.length <= 1) return core.length;
  return Math.max(1, Math.ceil(core.length * 0.4));
}

function renderWord(token, key, settings, onWordClick) {
  const { lead, core, trail } = splitWordPunct(token);
  let inner;
  if (settings.bionic && core) {
    const boldLen = bionicBoldLength(core);
    inner = (
      <>
        {lead}<strong>{core.slice(0, boldLen)}</strong>{core.slice(boldLen)}{trail}
      </>
    );
  } else {
    inner = <>{token}</>;
  }
  let emoji = null;
  if (settings.emojiVisualizer && core) {
    const lower = core.toLowerCase().replace(/'/g, '');
    if (EMOJI_MAP[lower]) emoji = EMOJI_MAP[lower];
    if (!emoji && ZH_EMOJI[lower]) emoji = ZH_EMOJI[lower];
  }

  const wordNode = (onWordClick && core) ? (
    <button
      key={`w-${key}`}
      type="button"
      onClick={(e) => onWordClick(core, e)}
      aria-label={`Look up "${core}"`}
      style={{
        background: 'transparent', border: 'none', padding: 0, margin: 0,
        font: 'inherit', color: 'inherit', cursor: 'pointer',
        borderBottom: '2px dotted currentColor', borderRadius: 2,
      }}
    >
      {inner}
    </button>
  ) : (
    <span key={`w-${key}`}>{inner}</span>
  );

  return (
    <React.Fragment key={key}>
      {wordNode}
      {emoji && <span aria-hidden="true"> {emoji}</span>}
      {' '}
    </React.Fragment>
  );
}

function wordCount(text) {
  if (!text || !text.trim()) return 0;
  return tokenizeText(text.trim()).length;
}

function normalizeWord(w) {
  return (w || '').toLowerCase().replace(/[^a-z0-9'\u4E00-\u9FFF\u3000-\u303F\uFF00-\uFFEF]/g, '');
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function wordsMatch(target, spoken) {
  const t = normalizeWord(target), s = normalizeWord(spoken);
  if (!t && !s) return true;
  if (!t || !s) return false;
  if (t === s) return true;
  const dist = levenshtein(t, s);
  return dist <= Math.max(1, Math.floor(t.length * 0.25));
}

function scoreAttempt(targetSentence, spokenText) {
  const targetWords = tokenizeText(targetSentence);
  const spokenWords = tokenizeText(spokenText || '');
  const results = targetWords.map((tw, i) => {
    let matched = false;
    for (let offset = -2; offset <= 2; offset++) {
      const sw = spokenWords[i + offset];
      if (sw && wordsMatch(tw, sw)) { matched = true; break; }
    }
    if (!matched && spokenWords.some((sw) => wordsMatch(tw, sw))) matched = true;
    return { word: tw, correct: matched };
  });
  const correctCount = results.filter((r) => r.correct).length;
  const ratio = targetWords.length ? correctCount / targetWords.length : 0;
  let stars = 1;
  if (ratio >= 0.95) stars = 3;
  else if (ratio >= 0.65) stars = 2;
  return { results, stars, ratio, correctCount, total: targetWords.length };
}

const TEXT_SIZES = { S: 16, M: 18, L: 22, XL: 26 };

function stripForSpeech(text) {
  return (text || '')
    .replace(/[^\w\s.,!?'\u00C0-\u024F\u0400-\u04FF\u0600-\u06FF\u0E00-\u0E7F\u4E00-\u9FFF]/g, ' ')
    .replace(/\.{4,}/g, '...')
    .replace(/[,]{2,}/g, ',')
    .replace(/[.]{2}(?!\.)/g, '.')
    .replace(/ ,/g, ',')
    .replace(/ \./g, '.')
    .replace(/ \!/g, '!')
    .replace(/ \?/g, '?')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/* =====================================================
   HOOKS: speech synthesis
===================================================== */
function useVoices() {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  return voices;
}

function useNarrator(sentences, rate, voiceUri, language) {
  const [state, setState] = useState('idle');
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [supported, setSupported] = useState(true);
  const idxRef = useRef(-1);
  const stoppedRef = useRef(false);
  const audioRef = useRef(null);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  useEffect(() => () => {
    stoppedRef.current = true;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  const speakFrom = useCallback((startIdx) => {
    if (!supported || !sentences || sentences.length === 0) return;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    window.speechSynthesis.cancel();
    stoppedRef.current = false;
    idxRef.current = startIdx;

    const useTTS = language === 'ms' || language === 'zh';

    const speakNext = async () => {
      if (stoppedRef.current) return;
      const idx = idxRef.current;
      if (idx >= sentences.length) {
        setState('idle');
        setCurrentIndex(-1);
        return;
      }
      setCurrentIndex(idx);
      const text = stripForSpeech(sentences[idx]);

      if (useTTS) {
        try {
          const resp = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, voice: language, rate }),
          });
          if (!resp.ok) throw new Error('TTS failed');
          const blob = await resp.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = () => {
            URL.revokeObjectURL(url);
            if (stoppedRef.current) return;
            idxRef.current = idx + 1;
            speakNext();
          };
          audio.onerror = () => {
            URL.revokeObjectURL(url);
            setState('idle');
          };
          audio.play();
        } catch (err) {
          console.error('edge-tts error, falling back to system:', err);
          const utter = new window.SpeechSynthesisUtterance(text);
          utter.rate = rate;
          utter.onend = () => { if (!stoppedRef.current) { idxRef.current = idx + 1; speakNext(); } };
          utter.onerror = () => setState('idle');
          window.speechSynthesis.speak(utter);
        }
      } else {
        const utter = new window.SpeechSynthesisUtterance(text);
        utter.rate = rate;
        const voices = window.speechSynthesis.getVoices();
        const chosenVoice = voiceUri ? voices.find((v) => v.voiceURI === voiceUri) : null;
        if (chosenVoice) utter.voice = chosenVoice;
        utter.onend = () => { if (!stoppedRef.current) { idxRef.current = idx + 1; speakNext(); } };
        utter.onerror = () => setState('idle');
        window.speechSynthesis.speak(utter);
      }
    };
    setState('playing');
    speakNext();
  }, [sentences, rate, voiceUri, language, supported]);

  const play = useCallback(() => {
    if (!supported || !sentences || sentences.length === 0) return;
    if (state === 'paused') {
      if (audioRef.current) { audioRef.current.play(); setState('playing'); return; }
      window.speechSynthesis.resume();
      setState('playing');
    } else {
      speakFrom(0);
    }
  }, [state, speakFrom, supported, sentences]);

  const pause = useCallback(() => {
    if (!supported) return;
    if (audioRef.current) { audioRef.current.pause(); setState('paused'); return; }
    window.speechSynthesis.pause();
    setState('paused');
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    stoppedRef.current = true;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    window.speechSynthesis.cancel();
    setState('idle');
    setCurrentIndex(-1);
  }, [supported]);

  return { state, currentIndex, play, pause, stop, supported };
}

function speakOnce(text, rate, voiceUri, language) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  if (language === 'ms' || language === 'zh') {
    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice: language, rate }),
    }).then((r) => r.ok ? r.blob() : Promise.reject()).then((blob) => {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      audio.play();
    }).catch(() => {
      const utter = new window.SpeechSynthesisUtterance(stripForSpeech(text));
      utter.rate = rate;
      window.speechSynthesis.speak(utter);
    });
    return;
  }

  const utter = new window.SpeechSynthesisUtterance(stripForSpeech(text));
  utter.rate = rate;
  if (voiceUri) {
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find((vv) => vv.voiceURI === voiceUri);
    if (v) utter.voice = v;
  }
  window.speechSynthesis.speak(utter);
}

/* =====================================================
   LAZY-LOADED DICTIONARIES
===================================================== */
const DictCtx = createContext({ malay: {}, chinese: {} });
function useDict() { return useContext(DictCtx); }

function DictProvider({ children }) {
  const [malay, setMalay] = useState({});
  const [chinese, setChinese] = useState({});

  useEffect(() => {
    fetch('/malay-english-dict.json').then((r) => r.json()).then(setMalay).catch(() => {});
    fetch('/Dictionary.json').then((r) => r.json()).then(setChinese).catch(() => {});
  }, []);

  return <DictCtx.Provider value={{ malay, chinese }}>{children}</DictCtx.Provider>;
}

/* =====================================================
   APP CONTEXT
===================================================== */
const AppCtx = createContext(null);
function useApp() { return useContext(AppCtx); }

const DEFAULT_SETTINGS = {
  bionic: false,
  dyslexiaFont: false,
  textSize: 'M',
  highContrast: false,
  emojiVisualizer: false,
  narrationSpeed: 1,
  voiceUri: '',
  readSpeed: 200,
};

/* =====================================================
   LOCAL STORAGE HELPERS
===================================================== */
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw);
  } catch (e) { /* noop */ }
  return fallback;
}

function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* noop */ }
}

/* =====================================================
   SMALL UI ATOMS
===================================================== */
function IconButton({ icon: Icon, label, onClick, variant = 'ghost', size = 22, style, disabled }) {
  const { theme } = useApp();
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: 44, minHeight: 44, borderRadius: 16, cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', transition: 'transform 180ms ease-out, background-color 180ms ease-out',
    backgroundColor: variant === 'filled' ? theme.accent : 'transparent',
    color: variant === 'filled' ? '#fff' : theme.textPrimary,
    opacity: disabled ? 0.5 : 1,
  };
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...style }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <Icon size={size} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}

function Button({ children, onClick, variant = 'primary', style, disabled, fullWidth, type = 'button' }) {
  const { theme } = useApp();
  const variants = {
    primary: { backgroundColor: theme.accent, color: '#fff', border: 'none' },
    secondary: { backgroundColor: 'transparent', color: theme.secondary, border: `2px solid ${theme.secondary}` },
    ghostText: { backgroundColor: 'transparent', color: theme.textSecondary, border: 'none', textDecoration: 'underline' },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 18,
        padding: '12px 24px', borderRadius: 16, minHeight: 44, cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: fullWidth ? '100%' : 'auto', transition: 'transform 180ms ease-out, background-color 180ms ease-out',
        opacity: disabled ? 0.55 : 1,
        ...variants[variant], ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === 'primary') e.currentTarget.style.backgroundColor = theme.accentHover;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = theme.accent;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {children}
    </button>
  );
}

function Card({ children, style, onClick, as = 'div' }) {
  const { theme } = useApp();
  const Tag = as;
  return (
    <Tag
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      style={{
        backgroundColor: theme.panel, borderRadius: 20, padding: 20,
        boxShadow: theme.bg === '#000000' ? '0 0 0 1px rgba(255,255,255,0.08)' : '0 4px 12px rgba(0,0,0,0.06)',
        transition: 'transform 180ms ease-out, box-shadow 180ms ease-out',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={(e) => { if (onClick) e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { if (onClick) e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {children}
    </Tag>
  );
}

function TogglePill({ icon: Icon, label, active, onClick }) {
  const { theme } = useApp();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px',
        borderRadius: 16, fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 16,
        cursor: 'pointer', minHeight: 44, whiteSpace: 'nowrap',
        backgroundColor: active ? theme.accent : 'transparent',
        color: active ? '#fff' : theme.textPrimary,
        border: active ? '2px solid transparent' : `2px solid ${theme.secondary}`,
        transition: 'background-color 180ms ease-out, color 180ms ease-out',
      }}
    >
      <Icon size={18} aria-hidden="true" />
      {label}
    </button>
  );
}

function SwitchToggle({ checked, onChange, label }) {
  const { theme } = useApp();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        width: 52, minWidth: 52, height: 30, borderRadius: 999, border: 'none', cursor: 'pointer',
        backgroundColor: checked ? theme.accent : withAlpha(theme.textSecondary, 0.35),
        position: 'relative', transition: 'background-color 180ms ease-out',
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: checked ? 25 : 3, width: 24, height: 24, borderRadius: '50%',
        backgroundColor: '#fff', transition: 'left 180ms ease-out', boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
      }}
      />
    </button>
  );
}

function Segmented({ options, value, onChange, ariaLabel }) {
  const { theme } = useApp();
  return (
    <div role="group" aria-label={ariaLabel} style={{ display: 'inline-flex', gap: 6, backgroundColor: withAlpha(theme.textSecondary, 0.12), padding: 4, borderRadius: 14, flexWrap: 'wrap' }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 15, minHeight: 36,
            backgroundColor: value === opt.value ? theme.accent : 'transparent',
            color: value === opt.value ? '#fff' : theme.textPrimary,
            transition: 'background-color 180ms ease-out',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Modal({ children, onClose, labelledBy }) {
  const { theme } = useApp();
  return (
    <div
      style={{
        position: 'fixed', inset: 0, backgroundColor: theme.overlay, display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16,
        animation: 'fadeIn 200ms ease-out',
      }}
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: theme.panel, borderRadius: 20, padding: 28, maxWidth: 440, width: '100%',
          boxShadow: '0 12px 32px rgba(0,0,0,0.18)', animation: 'slideUp 200ms ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function srOnlyStyle() {
  return {
    position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden',
    clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
  };
}

/* =====================================================
   LOCAL OFFLINE DICTIONARY
===================================================== */
const LOCAL_DICTIONARY = {"anopheles":"A genus of mosquitoes which are secondary hosts of the malaria parasites, and whose bite is the usual, if not the only, means of infecting human beings with malaria. Several species are found in the United States. They may be distinguished from the ordinary mosquitoes of the genus Culex by the long slender palpi, nearly equaling the beak in length, while those of the female Culex are very short. They also assume different positions when resting, Culex usually holding the body parallel to the surface on which it rests and keeping the head and beak bent at an angle, while Anopheles holds the body at an angle with the surface and the head and beak in line with it. Unless they become themselves infected by previously biting a subject affected with malaria, the insects cannot transmit the disease.","uniclinal":"See Nonoclinal.","sarong":"A sort of petticoat worn by both sexes in Java and the Malay Archipelago. Balfour (Cyc. of India)","turcoman":"1. A member of a tribe of Turanians inhabiting a region east of the Caspian Sea. 2. A Turcoman carpet. Turcoman carpet or rug, a kind of carpet or rug supposed to be made by the Turcomans.","corrugator":"A muscle which contracts the skin of the forehead into wrinkles.","self-murder":"Suicide.","anacardium":"A genus of plants including the cashew tree. See Cashew.","knurly":"Full of knots; hard; tough; hence, capable of enduring or resisting much.","pock":"A pustule raised on the surface of the body in variolous and vaccine diseases.","neuroma":"A tumor developed on, or connected with, a nerve, esp. one consisting of new-formed nerve fibers.","hawser":"A large rope made of three strands each containing many yarns.","jolty":"That jolts; as, a jolty coach."};


/* =====================================================
   WORD DEFINITION LOOKUP
===================================================== */
function useDictionaryLookup() {
  const cacheRef = useRef({});
  const [popover, setPopover] = useState(null);
  const { malay: MALAY_DICT, chinese: CHINESE_DICT } = useDict();

  const lookup = useCallback((word, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.bottom;
    const key = word.toLowerCase();

    if (cacheRef.current[key]) {
      setPopover({ word, x, y, status: 'done', data: cacheRef.current[key] });
      return;
    }

    const localEntry = LOCAL_DICTIONARY[key]
      || LOCAL_DICTIONARY[key.replace(/s$/, '')]
      || LOCAL_DICTIONARY[key.replace(/ed$/, '')]
      || LOCAL_DICTIONARY[key.replace(/ing$/, '')];
    if (localEntry) {
      const data = { phonetic: '', partOfSpeech: '', definition: localEntry, example: '', lang: 'en' };
      cacheRef.current[key] = data;
      setPopover({ word, x, y, status: 'done', data });
      return;
    }

    if (MALAY_DICT[key]) {
      const data = { phonetic: '', partOfSpeech: 'malay', definition: MALAY_DICT[key], example: '', lang: 'ms', isMalay: true };
      cacheRef.current[key] = data;
      setPopover({ word, x, y, status: 'done', data });
      return;
    }

    for (const ch of word) {
      const chEntry = CHINESE_DICT[ch];
      if (chEntry) {
        const pinyin = (chEntry.pronunciation_mandarin_pinyin || []).join(', ');
        const zhuyin = (chEntry.pronunciation_mandarin_zhuyin || []).join(', ');
        const cantonese = (chEntry.pronunciation_cantonese || []).join(', ');
        const parts = [];
        if (pinyin) parts.push(`Pinyin: ${pinyin}`);
        if (zhuyin) parts.push(`Zhuyin: ${zhuyin}`);
        if (cantonese) parts.push(`Cantonese: ${cantonese}`);
        if (chEntry.radical) parts.push(`Radical: ${chEntry.radical}`);
        if (chEntry.strokes_total) parts.push(`Strokes: ${chEntry.strokes_total}`);
        const data = {
          phonetic: pinyin, partOfSpeech: 'chinese',
          definition: parts.join(' \u00B7 ') || 'Chinese character',
          example: '', lang: 'zh', isChinese: true,
          radical: chEntry.radical, strokes: chEntry.strokes_total, pinyin, zhuyin,
        };
        cacheRef.current[key] = data;
        setPopover({ word, x, y, status: 'done', data });
        return;
      }
    }

    setPopover({ word, x, y, status: 'loading', data: null });
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`)
      .then((res) => { if (!res.ok) throw new Error('not found'); return res.json(); })
      .then((json) => {
        const entry = json[0];
        const meaning = entry && entry.meanings && entry.meanings[0];
        const definition = meaning && meaning.definitions && meaning.definitions[0];
        const phoneticEntry = (entry.phonetics || []).find((p) => p.text);
        const data = {
          phonetic: entry.phonetic || (phoneticEntry ? phoneticEntry.text : ''),
          partOfSpeech: meaning ? meaning.partOfSpeech : '',
          definition: definition ? definition.definition : '',
          example: definition ? definition.example : '',
          lang: 'en',
        };
        cacheRef.current[key] = data;
        setPopover((prev) => (prev && prev.word === word ? { ...prev, status: 'done', data } : prev));
      })
      .catch(() => {
        setPopover((prev) => (prev && prev.word === word ? { ...prev, status: 'error', data: null } : prev));
      });
  }, []);

  const close = useCallback(() => setPopover(null), []);
  return { popover, lookup, close };
}

function DefinitionPopover({ popover, onClose }) {
  const { theme, t } = useApp();
  const ref = useRef(null);

  useEffect(() => {
    if (!popover) return undefined;
    function onDocClick(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [popover, onClose]);

  if (!popover) return null;
  const { word, x, y, status, data } = popover;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
  const left = Math.min(Math.max(x, 150), viewportWidth - 150);
  const maxTop = (typeof window !== 'undefined' ? window.innerHeight : 800) - 160;
  const top = Math.min(y + 8, maxTop);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={`${word}`}
      style={{
        position: 'fixed', left, top, transform: 'translateX(-50%)', zIndex: 80,
        backgroundColor: theme.panel, borderRadius: 16, padding: 16, width: 260,
        boxShadow: '0 10px 28px rgba(0,0,0,0.22)', animation: 'fadeIn 150ms ease-out',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
        <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 17, color: theme.textPrimary, textTransform: 'capitalize' }}>
          {word}
        </span>
        <button type="button" onClick={onClose} aria-label={t.close}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary, padding: 4, minWidth: 28, minHeight: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      {status === 'loading' && (
        <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, color: theme.textSecondary }}>{t.lookingUp}</p>
      )}
      {status === 'error' && (
        <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, color: theme.textSecondary }}>{t.noDefinition}</p>
      )}
      {status === 'done' && data && (
        <div>
          {data.isChinese && (
            <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, marginBottom: 8, backgroundColor: withAlpha(theme.accent, 0.18), color: theme.accent, fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 12 }}>
              {t.chineseCharacter}
            </div>
          )}
          {data.isMalay && (
            <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, marginBottom: 8, backgroundColor: withAlpha(theme.secondary, 0.18), color: theme.secondary, fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 12 }}>
              {t.malayWord}
            </div>
          )}
          {data.isChinese && data.pinyin && (
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, color: theme.secondary, marginBottom: 4 }}>{t.pinyin}: {data.pinyin}</p>
          )}
          {data.isChinese && data.radical && (
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, color: theme.textSecondary, marginBottom: 2 }}>{t.radical}: {data.radical}</p>
          )}
          {data.isChinese && data.strokes && (
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, color: theme.textSecondary, marginBottom: 4 }}>{t.strokes}: {data.strokes}</p>
          )}
          {!data.isChinese && !data.isMalay && data.phonetic && (
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, color: theme.secondary, marginBottom: 4 }}>{data.phonetic}</p>
          )}
          {data.partOfSpeech && !data.isChinese && !data.isMalay && (
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontStyle: 'italic', fontSize: 13, color: theme.textSecondary, marginBottom: 4 }}>{data.partOfSpeech}</p>
          )}
          {data.definition ? (
            <p style={{ fontFamily: "'Lexend', sans-serif", fontSize: 15, color: theme.textPrimary, lineHeight: 1.5 }}>{data.definition}</p>
          ) : (
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, color: theme.textSecondary }}>{t.noDefinition}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* =====================================================
   STORY TEXT RENDERER
===================================================== */
function StoryText({ content, settings, highlightIdx = -1, centered = false, textAlignOverride, onWordClick }) {
  const { theme } = useApp();
  const { lines } = useMemo(() => chunkLinesWithSentenceIndex(content), [content]);
  const fontSize = TEXT_SIZES[settings.textSize] || TEXT_SIZES.M;

  if (lines.length === 0) return null;

  return (
    <div style={{
      fontFamily: "'Lexend', sans-serif", fontSize,
      lineHeight: settings.dyslexiaFont ? 1.9 : 1.6,
      letterSpacing: settings.dyslexiaFont ? '0.06em' : 'normal',
      maxWidth: '60ch', margin: '0 auto', color: theme.textPrimary,
    }}>
      {lines.map((l, i) => {
        const isNewSentence = i === 0 || lines[i - 1].sentenceIdx !== l.sentenceIdx;
        return (
          <div key={i} style={{
            marginTop: isNewSentence && i !== 0 ? 18 : 0, marginBottom: 6, borderRadius: 8,
            padding: l.sentenceIdx === highlightIdx ? '3px 8px' : '3px 0',
            backgroundColor: l.sentenceIdx === highlightIdx ? withAlpha(theme.secondary, 0.22) : 'transparent',
            transition: 'background-color 200ms ease-out',
            textAlign: textAlignOverride || (centered ? 'center' : 'left'),
          }}>
            {tokenizeText(l.text).map((w, wi) => renderWord(w, `${i}-${wi}`, settings, onWordClick))}
          </div>
        );
      })}
    </div>
  );
}

/* =====================================================
   SAMPLE SCRIPTS
===================================================== */
const SAMPLE_SCRIPTS = [
  {
    id: 'sample-en',
    title: 'The Little Star',
    content: 'Once upon a time, high up in the night sky, there lived a little star. Every evening, she would shine the brightest among all her brothers and sisters. One cloudy night, a young boy looked up and whispered, "I wish I could be brave like you." The little star twinkled with joy, knowing that even the smallest light can guide someone through the darkness.',
    lang: 'en', flag: '🇬🇧',
    labelEn: 'English Sample', labelMs: 'Contoh Bahasa Inggeris', labelZh: '英文示例',
  },
  {
    id: 'sample-ms',
    title: 'Bintang Kecil',
    content: 'Pada suatu masa dahulu, jauh di atas langit malam, ada seekor bintang kecil. Setiap petang, dia akan bersinar paling terang di antara semua adik-beradiknya. Pada suatu malam yang berawan, seorang budak lelaki melihat ke atas dan berbisik, "Saya ingin menjadi seberani awak." Bintang kecil itu berkelip-kelip dengan gembira, kerana mengetahui bahawa walaupun cahaya yang paling kecil boleh membimbing seseorang melalui kegelapan.',
    lang: 'ms', flag: '🇲🇾',
    labelEn: 'Malay Sample', labelMs: 'Contoh Bahasa Melayu', labelZh: '马来文示例',
  },
  {
    id: 'sample-zh',
    title: '\u5C0F\u661F\u661F\u7684\u6545\u4E8B',
    content: '\u5F88\u4E45\u5F88\u4E45\u4EE5\u524D\uFF0C\u5728\u9AD8\u9AD8\u7684\u591C\u7A7A\u4E0A\uFF0C\u4F4F\u7740\u4E00\u9897\u5C0F\u661F\u661F\u3002\u6BCF\u5929\u665A\u4E0A\uFF0C\u5979\u90FD\u4F1A\u5728\u6240\u6709\u5144\u5F1F\u59B0\u59B0\u4E2D\u53D1\u51FA\u6700\u4EAE\u7684\u5149\u8292\u3002\u4E00\u5929\u665A\u4E0A\uFF0C\u4E00\u4E2A\u5C0F\u7537\u5B69\u62AC\u5934\u770B\u7740\u5929\u7A7A\uFF0C\u8F7B\u58F0\u8BF4\u9053\uFF1A\u201C\u6211\u5E0C\u671B\u6211\u80FD\u50CF\u4F60\u4E00\u6837\u52C7\u6562\u3002\u201D\u5C0F\u661F\u661F\u5F00\u5FC3\u5730\u95EA\u70C1\u7740\uFF0C\u56E0\u4E3A\u5979\u77E5\u9053\u5373\u4F7F\u662F\u6700\u5FAE\u5C0F\u7684\u5149\u8292\uFF0C\u4E5F\u80FD\u5728\u9ED1\u6697\u4E2D\u4E3A\u67D0\u4E2A\u4EBA\u6307\u5F15\u65B9\u5411\u3002',
    lang: 'zh', flag: '🇨🇳',
    labelEn: 'Chinese Sample', labelMs: 'Contoh Bahasa Cina', labelZh: '中文示例',
  },
];

/* =====================================================
   TOP BAR (Global — all pages)
===================================================== */
function TopBar() {
  const { theme, t, setView, setShowSettings } = useApp();
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px' }}>
      <button type="button" onClick={() => setView('library')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        aria-label={t.appName + ' — ' + t.back}>
        <div style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={20} color="#fff" aria-hidden="true" />
        </div>
        <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 20, color: theme.textPrimary }}>{t.appName}</span>
      </button>
      <IconButton icon={SettingsIcon} label={t.settings} onClick={() => setShowSettings(true)} />
    </div>
  );
}

/* =====================================================
   HEADER (Library only)
===================================================== */
function Header({ onNewStory }) {
  const { theme, t, language, setLanguage, setShowSettings } = useApp();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    if (!langOpen) return undefined;
    function onDocClick(e) { if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false); }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [langOpen]);

  const langs = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'ms', flag: '🇲🇾', name: 'Bahasa Melayu' },
    { code: 'zh', flag: '🇨🇳', name: '中文' },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', flexWrap: 'wrap', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={22} color="#fff" aria-hidden="true" />
        </div>
        <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 24, color: theme.textPrimary }}>{t.appName}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: window.innerWidth < 640 ? 'none' : 'block' }}>
          <Button variant="primary" onClick={onNewStory} style={{ padding: '10px 20px', fontSize: 16 }}>
            <Plus size={18} aria-hidden="true" /> {t.newStory.replace('+ ', '')}
          </Button>
        </div>
        <div ref={langRef} style={{ position: 'relative' }}>
          <IconButton icon={Globe} label={t.languagePicker} onClick={() => setLangOpen((o) => !o)} />
          {langOpen && (
            <div role="menu" style={{ position: 'absolute', right: 0, top: 52, backgroundColor: theme.panel, borderRadius: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: 8, minWidth: 200, zIndex: 40, animation: 'fadeIn 200ms ease-out' }}>
              {langs.map((l) => (
                <button key={l.code} type="button" role="menuitemradio" aria-checked={language === l.code}
                  onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer', textAlign: 'left', backgroundColor: 'transparent', fontFamily: "'Quicksand', sans-serif", fontSize: 16, color: theme.textPrimary, fontWeight: 600, borderLeft: language === l.code ? `4px solid ${theme.accent}` : '4px solid transparent' }}>
                  <span aria-hidden="true">{l.flag}</span>
                  <span style={{ flex: 1 }}>{l.name}</span>
                  {language === l.code && <Check size={16} color={theme.accent} aria-hidden="true" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <IconButton icon={SettingsIcon} label={t.settings} onClick={() => setShowSettings(true)} />
      </div>
    </div>
  );
}

/* =====================================================
   LANDING VIEW
===================================================== */
function LandingView() {
  const { setView, theme } = useApp();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goApp = () => setView('library');

  const features = [
    { icon: '🔤', title: 'Bionic Reading', desc: 'Bold the first few letters of every word so your eyes glide through text effortlessly.' },
    { icon: '😊', title: 'Emoji Visualizer', desc: 'See words come alive with auto-mapped emojis — reading becomes visual storytelling.' },
    { icon: '🌐', title: '3 Languages', desc: 'Full support for English, Malay, and Chinese with native neural TTS voices.' },
    { icon: '🎙\uFE0F', title: 'Listen & Repeat', desc: 'Hear a sentence read aloud, then record yourself — AI scores your pronunciation.' },
    { icon: '🎯', title: 'Focus Mode', desc: 'Distraction-free reading with sentence-by-sentence highlighting and narration.' },
    { icon: '📝', title: 'Type & Check', desc: 'Type what you heard and get instant feedback on accuracy with highlighted corrections.' },
  ];

  const steps = [
    { num: '01', title: 'Paste or write your story', desc: 'Drop in any text — a novel chapter, study notes, or a news article.' },
    { num: '02', title: 'Make it Accessible', desc: 'One click transforms your text with bionic formatting, emoji overlays, and narration.' },
    { num: '03', title: 'Read, listen, practice', desc: 'Enjoy focus mode, listen to natural voices, or practice pronunciation.' },
  ];

  const stats = [
    { value: '3', label: 'Languages' },
    { value: '100%', label: 'Free Forever' },
    { value: '<1s', label: 'Setup Time' },
    { value: '\u221E', label: 'Stories' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#FAFAFA', fontFamily: "'Poppins', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 30px rgba(255,138,101,0.2); } 50% { box-shadow: 0 0 60px rgba(255,138,101,0.4); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        .landing-fade-up { animation: fadeInUp 0.7s ease-out both; }
        .landing-fade-up-d1 { animation: fadeInUp 0.7s 0.1s ease-out both; }
        .landing-fade-up-d2 { animation: fadeInUp 0.7s 0.2s ease-out both; }
        .landing-fade-up-d3 { animation: fadeInUp 0.7s 0.3s ease-out both; }
        .landing-fade-up-d4 { animation: fadeInUp 0.7s 0.4s ease-out both; }
        .landing-float { animation: float 6s ease-in-out infinite; }
        .landing-float-d1 { animation: float 6s 0.5s ease-in-out infinite; }
        .landing-float-d2 { animation: float 6s 1s ease-in-out infinite; }
        .landing-glow { animation: glow 3s ease-in-out infinite; }
        .landing-shimmer { background: linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%); background-size: 200% 100%; animation: shimmer 3s infinite; }
      `}</style>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none', backgroundColor: scrolled ? 'rgba(10,10,10,0.85)' : 'transparent', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent', transition: 'all 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={goApp}>
            <span style={{ fontSize: 24 }}>📖</span>
            <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 22, color: '#fff' }}>AccessiTale</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s', fontFamily: "'Quicksand', sans-serif" }}>Features</a>
          <a href="#how" onClick={(e) => { e.preventDefault(); document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s', fontFamily: "'Quicksand', sans-serif" }}>How It Works</a>
          <button onClick={goApp} style={{ background: 'linear-gradient(135deg, #FF8A65, #FF7043)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Quicksand', sans-serif", transition: 'transform 0.2s, box-shadow 0.2s', letterSpacing: '0.02em' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,138,101,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>Try It Out</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,138,101,0.15) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(77,182,172,0.1) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div className="landing-fade-up" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 999, border: '1px solid rgba(255,138,101,0.3)', backgroundColor: 'rgba(255,138,101,0.08)', marginBottom: 32 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4DB6AC', display: 'inline-block' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontFamily: "'Quicksand', sans-serif" }}>Free & Open Source</span>
          </div>
        </div>

        <h1 className="landing-fade-up-d1" style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 800, lineHeight: 1.08, margin: '0 auto 24px', maxWidth: 860, letterSpacing: '-0.03em' }}>
          <span style={{ background: 'linear-gradient(135deg, #FFFFFF 30%, #FF8A65 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Reading Made </span>
          <span style={{ background: 'linear-gradient(135deg, #FF8A65, #FFB74D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Effortless</span>
        </h1>

        <p className="landing-fade-up-d2" style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 48px', fontFamily: "'Quicksand', sans-serif", fontWeight: 500 }}>
          Bionic reading, emoji overlays, and AI narration — transforming any text into an accessible, immersive experience in English, Malay, and Chinese.
        </p>

        <div className="landing-fade-up-d3" style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={goApp} className="landing-glow" style={{ background: 'linear-gradient(135deg, #FF8A65, #FF7043)', color: '#fff', border: 'none', padding: '18px 48px', borderRadius: 16, fontSize: 18, fontWeight: 700, cursor: 'pointer', fontFamily: "'Quicksand', sans-serif", transition: 'transform 0.2s', letterSpacing: '0.02em' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>Try It Out \u2192</button>
        </div>

        {/* Floating Preview Cards */}
        <div className="landing-fade-up-d4" style={{ position: 'relative', zIndex: 1, marginTop: 72, width: '100%', maxWidth: 800 }}>
          <div className="landing-float" style={{ backgroundColor: '#1A1A1A', borderRadius: 20, padding: '32px 40px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FF5F57' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#28C840' }} />
            </div>
            <div style={{ fontFamily: "'Lexend', monospace", fontSize: 'clamp(16px, 2.5vw, 24px)', lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>
              <span style={{ fontWeight: 800 }}>O</span>nce <span style={{ fontWeight: 800 }}>up</span>on <span style={{ fontWeight: 800 }}>a</span> <span style={{ fontWeight: 800 }}>tim</span>e, <span style={{ fontWeight: 800 }}>the</span>re <span style={{ fontWeight: 800 }}>liv</span>ed <span style={{ fontWeight: 800 }}>a</span> <span style={{ fontWeight: 800 }}>brav</span>e <span style={{ fontWeight: 800 }}>litt</span>le               <span style={{ fontWeight: 800 }}>st</span>ar <span style={{ fontSize: 20 }}>⭐</span> <span style={{ fontWeight: 800 }}>`wh</span>o <span style={{ fontWeight: 800 }}>dre</span>amt <span style={{ fontWeight: 800 }}>o</span>f <span style={{ fontWeight: 800 }}>dan</span>cing <span style={{ fontSize: 20 }}>💃</span> <span style={{ fontWeight: 800 }}>wit</span>h <span style={{ fontWeight: 800 }}>the</span> <span style={{ fontWeight: 800 }}>wol</span>ves <span style={{ fontSize: 20 }}>🐺</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, backgroundColor: 'rgba(255,138,101,0.15)', border: '1px solid rgba(255,138,101,0.3)' }}>
                <span style={{ fontSize: 13, color: '#FF8A65', fontWeight: 600, fontFamily: "'Quicksand', sans-serif" }}>🔤 Bionic</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, backgroundColor: 'rgba(77,182,172,0.15)', border: '1px solid rgba(77,182,172,0.3)' }}>
                <span style={{ fontSize: 13, color: '#4DB6AC', fontWeight: 600, fontFamily: "'Quicksand', sans-serif" }}>😊 Emoji</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, backgroundColor: 'rgba(255,183,77,0.15)', border: '1px solid rgba(255,183,77,0.3)' }}>
                <span style={{ fontSize: 13, color: '#FFB74D', fontWeight: 600, fontFamily: "'Quicksand', sans-serif" }}>🌐 EN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(24px, 6vw, 80px)', flexWrap: 'wrap', maxWidth: 800, margin: '0 auto' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', minWidth: 100 }}>
              <div style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, background: 'linear-gradient(135deg, #FF8A65, #FFB74D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: "'Quicksand', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 600, marginTop: 4, fontFamily: "'Quicksand', sans-serif" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '100px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#FF8A65', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Quicksand', sans-serif" }}>Features</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: '12px 0 16px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            <span style={{ background: 'linear-gradient(135deg, #FFFFFF, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Everything You Need to </span>
            <span style={{ background: 'linear-gradient(135deg, #FF8A65, #FFB74D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Read Better</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 480, margin: '0 auto', fontFamily: "'Quicksand', sans-serif", lineHeight: 1.6 }}>Powerful accessibility tools wrapped in a beautiful, distraction-free experience.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="landing-shimmer" style={{ padding: '32px 28px', borderRadius: 20, backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.06)', transition: 'border-color 0.3s, transform 0.3s', cursor: 'default' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,138,101,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px', color: '#fff', fontFamily: "'Quicksand', sans-serif" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0, fontFamily: "'Quicksand', sans-serif" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" style={{ padding: '100px 24px', backgroundColor: '#111111', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#4DB6AC', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Quicksand', sans-serif" }}>How It Works</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: '12px 0 0', lineHeight: 1.15, letterSpacing: '-0.02em', color: '#fff' }}>Three Steps to Accessible Reading</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 28, alignItems: 'flex-start', padding: '32px', borderRadius: 20, backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)', transition: 'border-color 0.3s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(77,182,172,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                <div style={{ minWidth: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, rgba(255,138,101,0.15), rgba(77,182,172,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg, #FF8A65, #4DB6AC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: "'Quicksand', sans-serif" }}>{s.num}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: '#fff', fontFamily: "'Quicksand', sans-serif" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0, fontFamily: "'Quicksand', sans-serif" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,138,101,0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            <span style={{ background: 'linear-gradient(135deg, #FFFFFF, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Start Reading </span>
            <span style={{ background: 'linear-gradient(135deg, #FF8A65, #FFB74D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Better Today</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 440, margin: '0 auto 40px', fontFamily: "'Quicksand', sans-serif", lineHeight: 1.6 }}>No sign-up. No downloads. Just paste your text and experience the future of reading.</p>
          <button onClick={goApp} className="landing-glow" style={{ background: 'linear-gradient(135deg, #FF8A65, #FF7043)', color: '#fff', border: 'none', padding: '18px 56px', borderRadius: 16, fontSize: 18, fontWeight: 700, cursor: 'pointer', fontFamily: "'Quicksand', sans-serif", transition: 'transform 0.2s', letterSpacing: '0.02em' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>Try It Out \u2192</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>📖</span>
          <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 16, color: '#fff' }}>AccessiTale</span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: 0, fontFamily: "'Quicksand', sans-serif" }}>Built for accessibility. Free forever.</p>
      </footer>
    </div>
  );
}

/* =====================================================
   LIBRARY VIEW
===================================================== */
const COVER_EMOJIS = ['📖', '🦄', '🐉', '🏰', '🌟', '🌊', '🚀', '🌳', '🦁', '🎨'];
function coverFor(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i)) % COVER_EMOJIS.length;
  return COVER_EMOJIS[h];
}

function LibraryView() {
  const { theme, t, language, stories, setStories, setView, setCurrentStoryId } = useApp();

  const handleNewStory = () => {
    const id = `story-${Date.now()}`;
    setStories((prev) => [{ id, title: '', content: '', accessible: false, createdAt: Date.now() }, ...prev]);
    setCurrentStoryId(id);
    setView('write');
  };

  const openStory = (story) => {
    setCurrentStoryId(story.id);
    setView(story.accessible || story.content ? 'read' : 'write');
  };

  const deleteStory = (e, id) => {
    e.stopPropagation();
    setStories((prev) => prev.filter((s) => s.id !== id));
  };

  const loadSample = (sample) => {
    const id = `story-${Date.now()}`;
    const labelKey = language === 'ms' ? 'labelMs' : language === 'zh' ? 'labelZh' : 'labelEn';
    setStories((prev) => [{ id, title: sample.title, content: sample.content, accessible: true, createdAt: Date.now() }, ...prev]);
    setCurrentStoryId(id);
    setView('read');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg }}>
      <Header onNewStory={handleNewStory} />
      <div style={{ padding: '0 24px 100px' }}>
        <div style={{ display: window.innerWidth < 640 ? 'block' : 'none', marginBottom: 20 }}>
          <Button variant="primary" fullWidth onClick={handleNewStory}>
            <Plus size={20} aria-hidden="true" /> {t.newStory.replace('+ ', '')}
          </Button>
        </div>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 600, color: theme.textSecondary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.trySample}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {SAMPLE_SCRIPTS.map((sample) => (
              <button key={sample.id} type="button" onClick={() => loadSample(sample)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 14, border: `2px solid ${withAlpha(theme.accent, 0.3)}`, backgroundColor: withAlpha(theme.accent, 0.08), cursor: 'pointer', fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 15, color: theme.textPrimary, transition: 'background-color 180ms ease-out, border-color 180ms ease-out', minHeight: 44 }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = withAlpha(theme.accent, 0.18); e.currentTarget.style.borderColor = theme.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = withAlpha(theme.accent, 0.08); e.currentTarget.style.borderColor = withAlpha(theme.accent, 0.3); }}>
                <span aria-hidden="true" style={{ fontSize: 18 }}>{sample.flag}</span>
                <span>{sample.title}</span>
              </button>
            ))}
          </div>
        </div>
        {stories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 16px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }} aria-hidden="true">📚</div>
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 20, fontWeight: 600, color: theme.textPrimary, marginBottom: 24 }}>{t.emptyTitle}</p>
            <Button variant="primary" onClick={handleNewStory}>
              <Sparkles size={18} aria-hidden="true" /> {t.emptyCta}
            </Button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            {stories.map((s) => (
              <Card key={s.id} onClick={() => openStory(s)} style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
                <div style={{ fontSize: 48 }} aria-hidden="true">{coverFor(s.id)}</div>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 18, color: theme.textPrimary }}>
                  {s.title || t.untitled}
                </div>
                {s.accessible && (
                  <span style={{ display: 'inline-block', alignSelf: 'flex-start', padding: '4px 12px', borderRadius: 999, backgroundColor: withAlpha(theme.secondary, 0.18), color: theme.secondary, fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 13 }}>
                    {t.bionicReady}
                  </span>
                )}
                <button
                  type="button" aria-label="Delete story"
                  onClick={(e) => deleteStory(e, s.id)}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary, padding: 4, borderRadius: 8 }}
                >
                  <X size={16} />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   WRITE VIEW
===================================================== */
function WriteView() {
  const { theme, t, stories, setStories, currentStoryId, setView } = useApp();
  const existing = stories.find((s) => s.id === currentStoryId);
  const [title, setTitle] = useState(existing ? existing.title : '');
  const [content, setContent] = useState(existing ? existing.content : '');
  const savedRef = useRef({ title: existing ? existing.title : '', content: existing ? existing.content : '' });
  const [showDiscard, setShowDiscard] = useState(false);

  const commit = useCallback(() => {
    savedRef.current = { title, content };
    setStories((prev) => prev.map((s) => (s.id === currentStoryId ? { ...s, title, content } : s)));
  }, [title, content, currentStoryId, setStories]);

  useEffect(() => {
    const iv = setInterval(() => {
      if (title !== savedRef.current.title || content !== savedRef.current.content) commit();
    }, 3000);
    return () => clearInterval(iv);
  }, [commit, title, content]);

  const isDirty = title !== savedRef.current.title || content !== savedRef.current.content;
  const isEmpty = !title.trim() && !content.trim();

  const leaveToLibrary = () => {
    if (isEmpty) setStories((prev) => prev.filter((s) => s.id !== currentStoryId));
    setView('library');
  };

  const handleBack = () => { if (isDirty && !isEmpty) setShowDiscard(true); else leaveToLibrary(); };

  const confirmDiscard = () => {
    setShowDiscard(false);
    if (!savedRef.current.title.trim() && !savedRef.current.content.trim()) {
      setStories((prev) => prev.filter((s) => s.id !== currentStoryId));
    }
    setView('library');
  };

  const handleMakeAccessible = () => {
    const finalTitle = title.trim() || t.untitled;
    savedRef.current = { title: finalTitle, content };
    setStories((prev) => prev.map((s) => (s.id === currentStoryId ? { ...s, title: finalTitle, content, accessible: true } : s)));
    setView('read');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <div style={{ flex: 1, maxWidth: 640, margin: '0 auto', width: '100%', padding: '0 24px 120px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <IconButton icon={ArrowLeft} label={t.back} onClick={handleBack} />
        </div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.titlePlaceholder} aria-label={t.titlePlaceholder}
          style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 32, color: theme.textPrimary, marginBottom: 16, padding: '8px 0' }} />
        <div style={{ position: 'relative' }}>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t.bodyPlaceholder} aria-label={t.bodyPlaceholder} rows={16}
            style={{ width: '100%', border: 'none', outline: 'none', resize: 'vertical', backgroundColor: theme.panel, borderRadius: 20, padding: 20, fontFamily: "'Lexend', sans-serif", fontSize: 18, lineHeight: 1.7, color: theme.textPrimary, boxShadow: theme.bg === '#000000' ? '0 0 0 1px rgba(255,255,255,0.08)' : '0 4px 12px rgba(0,0,0,0.06)' }} />
          <span style={{ position: 'absolute', right: 16, bottom: 12, fontFamily: "'Quicksand', sans-serif", fontSize: 14, color: theme.textSecondary }}>
            {wordCount(content)} {t.words}
          </span>
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: theme.bg, boxShadow: '0 -4px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <Button variant="primary" fullWidth onClick={handleMakeAccessible} disabled={!content.trim()}>
            <Sparkles size={18} aria-hidden="true" /> {t.makeAccessible}
          </Button>
        </div>
      </div>
      {showDiscard && (
        <Modal onClose={() => setShowDiscard(false)} labelledBy="discard-title">
          <h2 id="discard-title" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 22, color: theme.textPrimary, marginBottom: 8 }}>{t.discardTitle}</h2>
          <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 16, color: theme.textSecondary, marginBottom: 20 }}>{t.discardBody}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={() => setShowDiscard(false)}>{t.discardCancel}</Button>
            <Button variant="primary" onClick={confirmDiscard}>{t.discardConfirm}</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* =====================================================
   READING VIEW
===================================================== */
function ReadingView() {
  const { theme, t, stories, currentStoryId, setView, settings, setSettings, language } = useApp();
  const story = stories.find((s) => s.id === currentStoryId);
  const sentences = useMemo(() => splitSentences(story ? story.content : ''), [story]);
  const narrator = useNarrator(sentences, settings.narrationSpeed, settings.voiceUri, language);
  const { popover, lookup, close } = useDictionaryLookup();

  if (!story) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button variant="primary" onClick={() => setView('library')}><ArrowLeft size={18} aria-hidden="true" /> {t.back}</Button>
      </div>
    );
  }

  const toggleLargeText = () => setSettings((s) => ({ ...s, textSize: s.textSize === 'L' || s.textSize === 'XL' ? 'M' : 'L' }));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg }}>
      <TopBar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px 8px' }}>
        <IconButton icon={ArrowLeft} label={t.back} onClick={() => setView('library')} />
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 22, color: theme.textPrimary, textAlign: 'center', flex: 1, margin: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {story.title || t.untitled}
        </h1>
        <div style={{ display: 'flex', gap: 4 }}>
          <IconButton icon={Maximize2} label={t.focusMode} onClick={() => setView('focus')} />
          <IconButton icon={narrator.state === 'playing' ? Pause : Volume2} label={narrator.state === 'playing' ? t.stopNarrate : t.narrate}
            onClick={() => (narrator.state === 'playing' ? narrator.pause() : narrator.play())} variant="filled" />
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: '0 24px 20px', maxWidth: 640, margin: '0 auto' }}>
        <TogglePill icon={Zap} label={t.bionic} active={settings.bionic} onClick={() => setSettings((s) => ({ ...s, bionic: !s.bionic }))} />
        <TogglePill icon={Type} label={t.dyslexiaFont} active={settings.dyslexiaFont} onClick={() => setSettings((s) => ({ ...s, dyslexiaFont: !s.dyslexiaFont }))} />
        <TogglePill icon={ZoomIn} label={t.largeText} active={settings.textSize === 'L' || settings.textSize === 'XL'} onClick={toggleLargeText} />
        <TogglePill icon={Smile} label={t.emojis} active={settings.emojiVisualizer} onClick={() => setSettings((s) => ({ ...s, emojiVisualizer: !s.emojiVisualizer }))} />
      </div>

      <div style={{ padding: '0 24px 40px', maxWidth: 640, margin: '0 auto' }}>
        <Card style={{ padding: 28 }}>
          <StoryText content={story.content} settings={settings} highlightIdx={narrator.currentIndex} onWordClick={lookup} />
        </Card>
        {!narrator.supported && (
          <p style={{ marginTop: 16, fontFamily: "'Quicksand', sans-serif", color: theme.textSecondary, fontSize: 15 }}>{t.notSupported}</p>
        )}
      </div>
      <DefinitionPopover popover={popover} onClose={close} />

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: theme.bg, boxShadow: '0 -4px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <Button variant="secondary" fullWidth onClick={() => setView('practice')} disabled={sentences.length === 0}>
            <BookOpen size={18} aria-hidden="true" /> {t.practiceReading}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   FOCUS MODE
===================================================== */
function FocusMode() {
  const { theme, t, stories, currentStoryId, setView, settings, language } = useApp();
  const story = stories.find((s) => s.id === currentStoryId);
  const sentences = useMemo(() => splitSentences(story ? story.content : ''), [story]);
  const narrator = useNarrator(sentences, settings.narrationSpeed, settings.voiceUri, language);
  const { popover, lookup, close } = useDictionaryLookup();

  useEffect(() => () => narrator.stop(), []);

  if (!story) return null;

  const progress = sentences.length > 0 && narrator.currentIndex >= 0
    ? ((narrator.currentIndex + 1) / sentences.length) * 100 : 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <div style={{ height: 4, backgroundColor: withAlpha(theme.textSecondary, 0.2) }}>
        <div style={{ height: '100%', width: `${progress}%`, backgroundColor: theme.accent, transition: 'width 200ms ease-out' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 16px 8px' }}>
        <IconButton icon={X} label={t.exitFocus} onClick={() => { narrator.stop(); setView('read'); }} />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px 100px', overflowY: 'auto' }}>
        <div style={{ maxWidth: 640, width: '100%' }}>
          <StoryText content={story.content} settings={{ ...settings, textSize: settings.textSize === 'S' ? 'M' : settings.textSize }} highlightIdx={narrator.currentIndex} centered onWordClick={lookup} />
        </div>
      </div>
      <DefinitionPopover popover={popover} onClose={close} />
      <div style={{ position: 'fixed', bottom: 32, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <button type="button" aria-label={narrator.state === 'playing' ? t.stopNarrate : t.narrate}
          onClick={() => (narrator.state === 'playing' ? narrator.pause() : narrator.play())}
          style={{ width: 72, height: 72, borderRadius: '50%', border: 'none', cursor: 'pointer', backgroundColor: theme.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: narrator.state === 'playing' ? `0 0 0 12px ${withAlpha(theme.secondary, 0.25)}` : '0 4px 12px rgba(0,0,0,0.15)', transition: 'box-shadow 220ms ease-out' }}>
          {narrator.state === 'playing' ? <Pause size={30} color="#fff" aria-hidden="true" /> : <Play size={30} color="#fff" aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}

/* =====================================================
   PRACTICE VIEW — Type & Check + Speed Read
===================================================== */
function PracticeView() {
  const { theme, t, stories, currentStoryId, setView, settings, language } = useApp();
  const story = stories.find((s) => s.id === currentStoryId);
  const sentences = useMemo(() => splitSentences(story ? story.content : ''), [story]);

  const [mode, setMode] = useState(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [result, setResult] = useState(null);
  const [typedValue, setTypedValue] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [speedWpm, setSpeedWpm] = useState(settings.readSpeed || 200);
  const [highlightWordIdx, setHighlightWordIdx] = useState(-1);
  const [speedReadDone, setSpeedReadDone] = useState(false);
  const [typeCheckStep, setTypeCheckStep] = useState('read');
  const speedTimerRef = useRef(null);

  const target = sentences[index];
  const targetWords = useMemo(() => target ? tokenizeText(target) : [], [target]);
  const isLast = index >= sentences.length - 1;

  useEffect(() => () => { if (speedTimerRef.current) clearInterval(speedTimerRef.current); }, []);

  if (!story) return null;

  if (sentences.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <div style={{ padding: 16 }}><IconButton icon={ArrowLeft} label={t.back} onClick={() => setView('read')} /></div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
          <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 18, color: theme.textSecondary, maxWidth: 360 }}>{t.noSentences}</p>
        </div>
      </div>
    );
  }

  if (!mode) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <div style={{ padding: 16 }}><IconButton icon={ArrowLeft} label={t.back} onClick={() => setView('read')} /></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 20 }}>
          <div style={{ fontSize: 48 }} aria-hidden="true">📖</div>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 24, color: theme.textPrimary, textAlign: 'center' }}>{t.practiceReading.replace(' 📖', '')}</h2>
          <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 16, color: theme.textSecondary, textAlign: 'center', maxWidth: 400 }}>{t.sentenceOf(1, sentences.length)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 340 }}>
            <Button variant="primary" fullWidth onClick={() => setMode('typeCheck')}>
              <Type size={20} aria-hidden="true" /> {t.typeCheck}
            </Button>
            <Button variant="secondary" fullWidth onClick={() => setMode('speedRead')}>
              <Eye size={20} aria-hidden="true" /> {t.speedRead}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const resetSentence = () => {
    setPhase('idle');
    setResult(null);
    setTypedValue('');
    setHighlightWordIdx(-1);
    setSpeedReadDone(false);
    setTypeCheckStep('read');
    if (speedTimerRef.current) { clearInterval(speedTimerRef.current); speedTimerRef.current = null; }
  };

  const goNext = () => {
    if (isLast) { setPhase('done'); return; }
    setIndex((i) => i + 1);
    resetSentence();
  };

  const goPrev = () => {
    if (index <= 0) return;
    setIndex((i) => i - 1);
    resetSentence();
  };

  const tryAgain = () => { resetSentence(); };

  const handleTypeSubmit = () => {
    if (!typedValue.trim()) return;
    const scored = scoreAttempt(target, typedValue);
    setResult(scored);
    setPhase('result');
    setAnnouncement(`${t.wordsCorrect(scored.correctCount, scored.total)}. ${t.starsEarned(scored.stars)}.`);
  };

  const startSpeedRead = () => {
    setPhase('reading');
    setHighlightWordIdx(0);
    setSpeedReadDone(false);
    const msPerWord = Math.round(60000 / speedWpm);
    let wordIdx = 0;
    speedTimerRef.current = setInterval(() => {
      wordIdx++;
      if (wordIdx >= targetWords.length) {
        clearInterval(speedTimerRef.current);
        speedTimerRef.current = null;
        setHighlightWordIdx(targetWords.length);
        setSpeedReadDone(true);
        setPhase('idle');
        return;
      }
      setHighlightWordIdx(wordIdx);
    }, msPerWord);
  };

  const stopSpeedRead = () => {
    if (speedTimerRef.current) { clearInterval(speedTimerRef.current); speedTimerRef.current = null; }
    setHighlightWordIdx(-1);
    setPhase('idle');
    setSpeedReadDone(false);
  };

  if (phase === 'done') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}><TopBar /></div>
        <div style={{ fontSize: 56, marginBottom: 16 }} aria-hidden="true">🎉</div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 26, color: theme.textPrimary, marginBottom: 8 }}>{t.practiceComplete}</h1>
        <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 17, color: theme.textSecondary, marginBottom: 24 }}>{t.practiceCompleteBody}</p>
        <Button variant="primary" onClick={() => setView('read')}>{t.backToStory}</Button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <div aria-live="polite" style={srOnlyStyle()}>{announcement}</div>
      <div style={{ padding: '0 16px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconButton icon={ArrowLeft} label={t.back} onClick={() => setView('read')} />
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" onClick={() => { setMode('typeCheck'); resetSentence(); }}
            style={{ padding: '6px 14px', borderRadius: 12, border: mode === 'typeCheck' ? `2px solid ${theme.accent}` : `2px solid transparent`, backgroundColor: mode === 'typeCheck' ? withAlpha(theme.accent, 0.15) : 'transparent', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 14, color: mode === 'typeCheck' ? theme.accent : theme.textSecondary }}>
            <Type size={14} style={{ marginRight: 4, verticalAlign: -2 }} />{t.typeCheck}
          </button>
          <button type="button" onClick={() => { setMode('speedRead'); resetSentence(); }}
            style={{ padding: '6px 14px', borderRadius: 12, border: mode === 'speedRead' ? `2px solid ${theme.accent}` : `2px solid transparent`, backgroundColor: mode === 'speedRead' ? withAlpha(theme.accent, 0.15) : 'transparent', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 14, color: mode === 'speedRead' ? theme.accent : theme.textSecondary }}>
            <Eye size={14} style={{ marginRight: 4, verticalAlign: -2 }} />{t.speedRead}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 560, margin: '0 auto', width: '100%', padding: '0 24px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, color: theme.textSecondary, marginBottom: 8 }}>
          {t.sentenceOf(index + 1, sentences.length)}
        </p>

        <Card style={{ width: '100%', marginBottom: 20 }}>
          {mode === 'speedRead' ? (
            <div style={{ fontFamily: "'Lexend', sans-serif", fontSize: TEXT_SIZES[settings.textSize] + 2, lineHeight: 1.8, textAlign: 'center' }}>
              {targetWords.map((w, wi) => (
                <span key={wi} style={{
                  padding: '2px 4px', margin: '0 2px', display: 'inline-block', borderRadius: 6,
                  backgroundColor: wi === highlightWordIdx ? withAlpha(theme.accent, 0.4) : wi < highlightWordIdx ? 'transparent' : 'transparent',
                  color: wi === highlightWordIdx ? theme.textPrimary : wi < highlightWordIdx ? theme.textSecondary : theme.textPrimary,
                  transition: 'background-color 120ms ease-out, color 120ms ease-out',
                  fontWeight: wi === highlightWordIdx ? 700 : 400,
                }}>
                  {w}
                </span>
              ))}
            </div>
          ) : phase === 'result' ? (
            <div style={{ fontFamily: "'Lexend', sans-serif", fontSize: TEXT_SIZES[settings.textSize] + 2, lineHeight: 1.8, textAlign: 'center' }}>
              {result.results.map((r, i) => (
                <span key={i} style={{ backgroundColor: r.correct ? withAlpha(theme.success, 0.35) : withAlpha(theme.caution, 0.4), borderRadius: 8, padding: '2px 6px', margin: '0 3px', display: 'inline-block', color: theme.textPrimary }}>
                  {r.word}
                </span>
              ))}
            </div>
          ) : mode === 'typeCheck' && typeCheckStep === 'type' ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <p style={{ fontFamily: "'Lexend', sans-serif", fontSize: TEXT_SIZES[settings.textSize] + 2, color: theme.textSecondary, lineHeight: 1.6, fontStyle: 'italic' }}>
                {t.typeSentence}
              </p>
            </div>
          ) : (
            <p style={{ fontFamily: "'Lexend', sans-serif", fontSize: TEXT_SIZES[settings.textSize] + 4, color: theme.textPrimary, lineHeight: 1.6, textAlign: 'center' }}>
              {target}
            </p>
          )}
        </Card>

        {mode === 'typeCheck' && phase === 'idle' && !result && typeCheckStep === 'read' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <Button variant="secondary" onClick={() => speakOnce(target, settings.narrationSpeed, settings.voiceUri, language)}>
              <Volume2 size={18} aria-hidden="true" /> {t.listenFirst}
            </Button>
            <Button variant="primary" onClick={() => setTypeCheckStep('type')} style={{ minWidth: 240 }}>
              <Keyboard size={18} aria-hidden="true" /> {t.typeSentence}
            </Button>
          </div>
        )}

        {mode === 'typeCheck' && phase === 'idle' && !result && typeCheckStep === 'type' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <textarea
              value={typedValue} onChange={(e) => setTypedValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTypeSubmit(); } }}
              onPaste={(e) => e.preventDefault()}
              placeholder={t.typeWhatYouRead}
              autoFocus
              rows={3}
              style={{ border: `2px solid ${theme.secondary}`, borderRadius: 14, padding: '12px 16px', fontFamily: "'Lexend', sans-serif", fontSize: 17, backgroundColor: theme.panel, color: theme.textPrimary, outline: 'none', resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="ghostText" onClick={() => setTypeCheckStep('read')} style={{ flex: 1 }}>
                <Volume2 size={16} aria-hidden="true" /> {t.listenFirst}
              </Button>
              <Button variant="primary" onClick={handleTypeSubmit} disabled={!typedValue.trim()} style={{ flex: 2 }}>
                <Check size={18} aria-hidden="true" /> {t.submit}
              </Button>
            </div>
          </div>
        )}

        {mode === 'speedRead' && phase === 'idle' && !speedReadDone && highlightWordIdx === -1 && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 15, color: theme.textSecondary, textAlign: 'center' }}>{t.readAlong}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, color: theme.textSecondary }}>{t.wpm}:</span>
              <input type="range" min={80} max={400} step={10} value={speedWpm}
                onChange={(e) => setSpeedWpm(Number(e.target.value))}
                style={{ width: 140, accentColor: theme.accent }} />
              <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 16, color: theme.accent, minWidth: 48 }}>{speedWpm}</span>
            </div>
            <Button variant="primary" onClick={startSpeedRead}>
              <Play size={18} aria-hidden="true" /> {t.tapWhenReady}
            </Button>
          </div>
        )}

        {mode === 'speedRead' && phase === 'reading' && (
          <Button variant="secondary" onClick={stopSpeedRead}>
            <Pause size={18} aria-hidden="true" /> {t.stopNarrate}
          </Button>
        )}

        {mode === 'speedRead' && speedReadDone && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 16, color: theme.secondary, fontWeight: 600 }}>✨ {t.gotIt}</p>
            <Button variant="primary" onClick={goNext} style={{ minWidth: 200 }}>
              {isLast ? t.practiceComplete : t.nextSentence}
            </Button>
          </div>
        )}

        {phase === 'result' && (
          <>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }} aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <Star key={n} size={32} color={theme.accent} fill={n <= result.stars ? theme.accent : 'none'} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, width: '100%', flexWrap: 'wrap' }}>
              {index > 0 && (
                <Button variant="secondary" onClick={goPrev} style={{ flex: 1, minWidth: 100 }}>
                  <ChevronLeft size={18} aria-hidden="true" /> {t.prevSentence}
                </Button>
              )}
              <Button variant="secondary" onClick={tryAgain} style={{ flex: 1, minWidth: 100 }}>
                <RotateCcw size={18} aria-hidden="true" /> {t.tryAgain}
              </Button>
              <Button variant="primary" onClick={goNext} style={{ flex: 1, minWidth: 100 }}>
                {isLast ? t.practiceComplete : t.nextSentence}
              </Button>
            </div>
          </>
        )}

        {mode === 'speedRead' && highlightWordIdx >= 0 && !speedReadDone && (
          <div style={{ display: 'flex', gap: 10, width: '100%', justifyContent: 'center', marginTop: 8 }}>
            {!isLast && (
              <Button variant="ghostText" onClick={() => { stopSpeedRead(); goNext(); }} style={{ color: theme.textSecondary }}>
                <SkipForward size={16} aria-hidden="true" /> {t.skipSentence}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   SETTINGS PANEL
===================================================== */
function SettingsPanel() {
  const { theme, t, settings, setSettings, showSettings, setShowSettings } = useApp();
  const voices = useVoices();
  if (!showSettings) return null;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  const rows = [
    { key: 'bionic', icon: Zap, label: t.bionic, type: 'switch' },
    { key: 'dyslexiaFont', icon: Type, label: t.dyslexiaFont, type: 'switch' },
    { key: 'highContrast', icon: null, label: t.highContrast, type: 'switch' },
    { key: 'emojiVisualizer', icon: Smile, label: t.emojiVisualizer, type: 'switch' },
  ];

  const groupedVoices = {};
  voices.forEach((v) => {
    const lang = v.lang.split('-')[0];
    if (!groupedVoices[lang]) groupedVoices[lang] = [];
    groupedVoices[lang].push(v);
  });

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: theme.overlay, zIndex: 60, display: 'flex', justifyContent: isMobile ? 'stretch' : 'flex-end', animation: 'fadeIn 200ms ease-out' }}
      onClick={() => setShowSettings(false)} role="presentation">
      <div role="dialog" aria-modal="true" aria-label={t.settings} onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: theme.panel, width: isMobile ? '100%' : 380, height: '100%', padding: 24, overflowY: 'auto', boxShadow: '-8px 0 24px rgba(0,0,0,0.12)', animation: isMobile ? 'slideUp 200ms ease-out' : 'slideInRight 200ms ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 24, color: theme.textPrimary }}>{t.settings}</h2>
          <IconButton icon={X} label={t.close} onClick={() => setShowSettings(false)} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {rows.map((row) => (
            <div key={row.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 17, color: theme.textPrimary }}>
                {row.icon && <row.icon size={20} aria-hidden="true" />}
                {row.label}
              </span>
              <SwitchToggle checked={settings[row.key]} onChange={(v) => setSettings((s) => ({ ...s, [row.key]: v }))} label={row.label} />
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 17, color: theme.textPrimary }}>{t.largeText}</span>
            <Segmented ariaLabel={t.largeText} value={settings.textSize} onChange={(v) => setSettings((s) => ({ ...s, textSize: v }))}
              options={[{ value: 'S', label: t.small }, { value: 'M', label: t.medium }, { value: 'L', label: t.large }, { value: 'XL', label: t.xlarge }]} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 17, color: theme.textPrimary }}>{t.narrationSpeed}</span>
            <Segmented ariaLabel={t.narrationSpeed} value={settings.narrationSpeed} onChange={(v) => setSettings((s) => ({ ...s, narrationSpeed: v }))}
              options={[{ value: 0.75, label: '0.75x' }, { value: 1, label: '1x' }, { value: 1.25, label: '1.25x' }, { value: 1.5, label: '1.5x' }]} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 17, color: theme.textPrimary }}>
              <Volume2 size={20} aria-hidden="true" /> {t.voiceName}
            </span>
            <select
              value={settings.voiceUri || ''}
              onChange={(e) => setSettings((s) => ({ ...s, voiceUri: e.target.value }))}
              style={{ padding: '10px 14px', borderRadius: 12, border: `2px solid ${withAlpha(theme.textSecondary, 0.3)}`, fontFamily: "'Quicksand', sans-serif", fontSize: 15, backgroundColor: theme.panel, color: theme.textPrimary, cursor: 'pointer', outline: 'none', width: '100%' }}
            >
              <option value="">{t.defaultVoice}</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 17, color: theme.textPrimary }}>
              <Timer size={20} aria-hidden="true" /> {t.readSpeed}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input type="range" min={80} max={400} step={10} value={settings.readSpeed || 200}
                onChange={(e) => setSettings((s) => ({ ...s, readSpeed: Number(e.target.value) }))}
                style={{ flex: 1, accentColor: theme.accent }} />
              <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 16, color: theme.accent, minWidth: 56 }}>{settings.readSpeed || 200} {t.wpm}</span>
            </div>
          </div>
        </div>

        <button type="button" onClick={() => setSettings(DEFAULT_SETTINGS)}
          style={{ marginTop: 32, background: 'none', border: 'none', textDecoration: 'underline', color: theme.textSecondary, fontFamily: "'Quicksand', sans-serif", fontSize: 15, cursor: 'pointer', padding: 8 }}>
          {t.resetDefaults}
        </button>
      </div>
    </div>
  );
}

/* =====================================================
   ROOT APP
===================================================== */
export default function App() {
  const [stories, setStories] = useState(() => loadFromStorage('accessitale_stories', []));
  const [currentStoryId, setCurrentStoryId] = useState(null);
  const [view, setView] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = loadFromStorage('accessitale_stories', []);
      return saved.length > 0 ? 'library' : 'landing';
    }
    return 'landing';
  });
  const [settings, setSettings] = useState(() => loadFromStorage('accessitale_settings', DEFAULT_SETTINGS));
  const [language, setLanguage] = useState(() => loadFromStorage('accessitale_language', 'en'));
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => { saveToStorage('accessitale_stories', stories); }, [stories]);
  useEffect(() => { saveToStorage('accessitale_settings', settings); }, [settings]);
  useEffect(() => { saveToStorage('accessitale_language', language); }, [language]);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Poppins:wght@500;600;700&family=Lexend:wght@400;500;600&display=swap';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.onLine) {
      fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hello', voice: 'ms', rate: 1.0 }),
      }).catch(() => {});
    }
  }, []);

  const theme = settings.highContrast ? THEME.contrast : THEME.normal;
  const t = STR[language] || STR.en;

  const ctxValue = useMemo(() => ({
    theme, t, language, setLanguage, settings, setSettings,
    stories, setStories, currentStoryId, setCurrentStoryId,
    view, setView, showSettings, setShowSettings,
  }), [theme, t, language, settings, stories, currentStoryId, view, showSettings]);

  let ViewComponent = LandingView;
  if (view === 'library') ViewComponent = LibraryView;
  else if (view === 'write') ViewComponent = WriteView;
  else if (view === 'read') ViewComponent = ReadingView;
  else if (view === 'focus') ViewComponent = FocusMode;
  else if (view === 'practice') ViewComponent = PracticeView;

  return (
    <DictProvider>
    <AppCtx.Provider value={ctxValue}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 rgba(255,138,101,0.35); } 100% { box-shadow: 0 0 0 18px rgba(255,138,101,0); } }
        @keyframes barBounce { 0%, 100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }
        *:focus-visible { outline: 3px solid #4DB6AC; outline-offset: 2px; border-radius: 4px; }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }
        body { margin: 0; }
        select { appearance: auto; }
      `}
      </style>
      <div style={{ backgroundColor: view === 'landing' ? '#0A0A0A' : theme.bg, minHeight: '100vh' }}>
        <ViewComponent />
        {view !== 'landing' && <SettingsPanel />}
      </div>
    </AppCtx.Provider>
    </DictProvider>
  );
}
