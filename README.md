# 3SIN React Reader

`3SIN` is a Vite + React reading page built from three local text sources:

- `1. 삼신 티벳-한글.txt`
- `2. 삼신 영어.txt`
- `3. 삼신 목차.txt`

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer

## Run locally

```powershell
cd C:\Users\roadsea\Desktop\3SIN
npm install
npm run dev
```

Then open the local address shown in the terminal, usually:

```text
http://localhost:5173/
```

If PowerShell blocks `npm` with an execution policy error, use:

```powershell
npm.cmd install
cmd /c npm run dev
```

## Build for production

```powershell
npm run build
npm run preview
```

## Notes

- The app reads the three `.txt` files directly with Vite raw imports.
- Main app entry: `src/main.jsx`
- Main UI: `src/App.jsx`
- Text parser: `src/lib/parseThreeBodies.js`
