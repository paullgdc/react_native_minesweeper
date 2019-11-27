# React native minewseeper

A simple minesweeper app built with React native.

## Run it

### Ios

```bash
npm install
cd ios && pod install && cd ..
npx react-native run-ios
```

### Android

```bash
npm install
npx react-native run-android
```

## Structure

```bash
.
├── README.md
├── app.json
├── babel.config.js
├── docs
├── index.js
├── metro.config.js
├── package-lock.json
├── package.json
├── src
│   ├── App.tsx # Application entrypoint component
│   ├── colors.tsx # Color theme
│   ├── components
│   │   ├── EndGamePopup.tsx
│   │   ├── Header.tsx # Application header
│   │   ├── HorizontalDivider.tsx
│   │   ├── LabelledCounter.tsx # Bombs and flags counter
│   │   ├── LabelledInput.tsx
│   │   ├── LevelSelector.tsx # Size of the grid and bombcount selector
│   │   ├── MinesweeperGrid.tsx # Minesweeper grid element
│   │   ├── Modal.tsx # Custom modal
│   │   ├── NumericInput.tsx
│   │   └── Tile.tsx # Tile component
│   ├── utils.tsx
│   └── views
│       └── MinewseeperView # Main view of the application
│           ├── index.tsx # React component
│           └── state.ts # State manipulation functions
└── tsconfig.json
```
