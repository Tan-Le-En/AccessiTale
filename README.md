# AccessiTale

A reading accessibility app that transforms stories into accessible formats with bionic reading, dyslexia-friendly fonts, text-to-speech narration, emoji visualization, and multilingual dictionary support. Built with React, Vite, and Edge-TTS.

**Live:** [accessitale.vercel.app](https://accessitale.vercel.app)

## Features

### Landing Page
- World-class landing page with animated hero, interactive preview card, and feature showcase
- Language tabs (EN/MS/ZH) with live bionic reading preview
- Scroll-triggered reveal animations via IntersectionObserver

### Reading Accessibility
- **Bionic Reading** -- Bold the first ~40% of each word to guide eye movement and speed up reading
- **Dyslexia-Friendly Font** -- Increased line-height (1.9) and letter-spacing (0.06em) using Lexend
- **Large Text** -- Four size options: S (16px), M (18px), L (22px), XL (26px)
- **High Contrast Theme** -- Black background, white text, yellow accent (WCAG AAA)
- **Emoji Visualizer** -- Appends emoji after matching words (e.g. "cat" becomes "cat 🐱"), with CJK character support

### Text-to-Speech Narration
- **Edge-TTS Neural Voices** -- Microsoft neural voices for all three languages:
  - English: Aria (female)
  - Malay: Yasmin (female), Osman (male)
  - Chinese: Xiaoxiao (female)
- **Adjustable Speed** -- 0.75x, 1x, 1.25x, or 1.5x playback
- **Sentence Highlighting** -- Narrated sentence is highlighted as it plays
- **Pre-warm** -- TTS connection warmed on app mount for faster first narration

### Practice Modes
- **Type & Check** -- Listen to a sentence, type it from memory, get scored with Levenshtein distance (25% tolerance). 1-3 stars awarded per sentence. CJK-aware tokenization for Chinese.
- **Speed Read** -- Words highlight one-by-one at configurable WPM (80-400). Read along silently.

### Dictionary Lookup
Click any word in a story to see its definition:
- **English** -- Local dictionary + online fallback via dictionaryapi.dev
- **Malay** -- 150,000-entry Malay-to-English dictionary with curated common words
- **Chinese** -- 81,000-character dictionary with pinyin, zhuyin, Cantonese, radical, and stroke count

### Book Library
- **60 books** across 3 languages (20 per language)
  - **English** -- Alice in Wonderland, Pride and Prejudice, The Odyssey, Moby Dick, The Raven, and 15 more classics
  - **Malay** -- Malin Kundang, Hang Tuah, Si Tanggang, Puteri Gunung Ledang, Hikayat Seri Rama, and 15 more folk tales and legends
  - **Chinese** -- 论语, 西游记, 三国演义, 小王子, 花木兰, 白蛇传, and 14 more classics and folk tales
- **Search** by title or author
- **Language tabs** -- All / English / Bahasa Melayu / 中文
- Separate from the main Library view (which holds user stories + 3 sample scripts)

### Multilingual Interface
Full UI translation in three languages:
- English
- Bahasa Melayu
- 中文 (Chinese)

Story content stays in the language you wrote -- only the menus change.

### Data Persistence
All stories, settings, and language preferences are saved to `localStorage` and survive page refreshes.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.3.1 | UI framework |
| Vite | ^6.0.0 | Build tool and dev server |
| lucide-react | ^0.468.0 | Icon library |
| edge-tts | 7.2.8 | Microsoft neural TTS (Python) |
| aiohttp | ^3.14 | Async HTTP server for local TTS |

### Fonts
- **Quicksand** -- UI elements and navigation
- **Poppins** -- Headings and titles
- **Lexend** -- Story text (designed for reading accessibility)
- **Plus Jakarta Sans** -- Landing page

## Project Structure

```
AccessiTale/
├── src/
│   ├── App.jsx              # Entire application (single file, ~2360 lines)
│   ├── LIBRARY_BOOKS.js     # 40 books (20 English + 20 Malay)
│   ├── CHINESE_BOOKS.js     # 20 Chinese books
│   └── main.jsx             # React entry point
├── api/
│   └── tts.py               # Vercel serverless function for Edge-TTS
├── public/
│   ├── Dictionary.json      # Chinese character dictionary (~33 MB)
│   └── malay-english-dict.json  # Malay-English dictionary (~3.7 MB)
├── tts_server.py            # Local development TTS server (port 5175)
├── build-malay-dict.mjs     # Script to build the Malay dictionary
├── index.html               # Vite HTML template
├── package.json
├── vite.config.js           # Vite config with TTS proxy
├── vercel.json              # Vercel deployment config
└── requirements.txt         # Python dependencies (edge-tts, aiohttp)
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### Installation

```bash
git clone https://github.com/Tan-Le-En/AccessiTale.git
cd AccessiTale
npm install
pip install edge-tts aiohttp
```

### Running Locally

Start both the Vite dev server and the TTS server:

```bash
# Terminal 1 -- TTS server
python tts_server.py 5175

# Terminal 2 -- Vite dev server
npm run dev
```

Open http://localhost:5173 in your browser.

The Vite server proxies `/api/tts` requests to the local TTS server on port 5175.

### Building for Production

```bash
npm run build
```

Output goes to `dist/`. Preview locally:

```bash
npm run preview
```

## Deployment

### Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → "Add New Project"
3. Import the GitHub repository
4. Vercel auto-detects the Vite framework and Python API
5. Click **Deploy**

Vercel will:
- Build the React frontend to `dist/`
- Deploy `api/tts.py` as a Python serverless function (30s max duration)
- Serve `public/Dictionary.json` and `public/malay-english-dict.json` as static files
- Route `/api/tts` to the serverless function, everything else to the static frontend

### Local Development Server

The local TTS server (`tts_server.py`) runs on port 5175 and provides:
- `POST /tts` -- Generate TTS audio from text
- `GET /health` -- Health check

The Vite dev server runs on port 5173 and proxies `/api/tts` to the local TTS server.

## How It Works

### TTS Architecture

```
Browser → POST /api/tts { text, voice, rate }
  → api/tts.py (Vercel) or tts_server.py (local)
    → edge_tts.Communicate(text, voice, rate).stream()
    → Returns audio/mpeg
  ← Browser plays audio via Audio object
```

Narration automatically selects the correct neural voice based on the story's language. Falls back to system TTS if the server is unavailable.

### Dictionary System

When a word is clicked:
1. Check local English dictionary (hardcoded fallback)
2. Check Malay-English dictionary (150K entries)
3. Check Chinese character dictionary (81K entries)
4. Fetch from online English dictionary API (dictionaryapi.dev)

### Malay Dictionary

Built with `build-malay-dict.mjs`:
- Auto-generates from a 200K English-Malay dataset (reversed to Malay-English)
- Merges with ~345 curated common Malay words (hand-written, higher priority)
- Uses scoring heuristics: common-word bonus, transliteration penalty, length penalty

### CJK Text Handling

Chinese and Japanese text is tokenized character-by-character (no word spacing), while English and Malay use space-based tokenization. This affects word count, bionic reading, emoji mapping, and practice scoring.

## Accessibility

- Focus-visible outlines on all interactive elements
- ARIA labels, roles, and live regions throughout
- Minimum 44px touch targets
- `prefers-reduced-motion` support (disables all animations)
- Screen reader announcements for scoring results
- Keyboard navigable

## License

This project is open source.
