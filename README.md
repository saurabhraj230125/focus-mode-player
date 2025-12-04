# Focus Mode Player

A minimal React + Vite app that lets users paste a YouTube link and open a distraction-free player.

## Setup (run these in PowerShell from the project root)

```powershell
# install dependencies
npm install

# start dev server
npm run dev
```

## Notes
- Tailwind CSS is preconfigured. If you need to regenerate Tailwind output, ensure `postcss` and `tailwindcss` are installed.
- Enter a YouTube link like `https://www.youtube.com/watch?v=abcd1234`, click "Start Focus Mode", and the app navigates to `/player/abcd1234` and displays the video.

## Files of interest
- `src/pages/Home.jsx` — paste link UI
- `src/pages/Player.jsx` — distraction-free player page
- `src/components/VideoPlayer.jsx` — embeds YouTube using `react-youtube`
- `tailwind.config.js` and `postcss.config.cjs` — Tailwind setup

