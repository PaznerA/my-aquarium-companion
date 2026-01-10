# AquariumJournal

Offline-first aquarium management application built with React, TypeScript, and Tailwind CSS.

## Features

- 🐠 **Aquarium Management** - Track multiple aquariums with fish, plants, and equipment
- 📓 **Daily Journal** - Log fertilizer dosing, water changes, maintenance, and photos
- 📊 **Water Parameters** - Record and visualize pH, temperature, ammonia, nitrites, nitrates, KH, GH
- 📈 **EI Analysis** - Estimative Index calculations for planted tanks
- 🌍 **Multilingual** - Czech and English with automatic detection
- 📏 **Unit Systems** - Metric (liters, °C) and Imperial (gallons, °F)
- 💾 **Offline-First** - All data stored locally in browser (localStorage)
- 🔄 **File Sync** - Optional sync to local folder via File System Access API
- 📱 **PWA** - Installable as a progressive web app
- 🌙 **Dark Mode** - Light and dark theme support

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build**: Vite
- **PWA**: vite-plugin-pwa
- **Charts**: Recharts
- **Date**: date-fns
- **State**: React hooks + localStorage

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd aquarium-journal

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
npm run preview
```

### Project Structure

```
src/
├── components/
│   ├── dashboard/      # Dashboard widgets
│   ├── forms/          # Dialog forms
│   ├── gallery/        # Photo gallery
│   ├── journal/        # Journal components
│   ├── layout/         # Navigation, Layout
│   ├── settings/       # Settings components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── lib/
│   ├── i18n/           # Internationalization
│   ├── storage.ts      # localStorage API
│   ├── mockData.ts     # Demo data generator
│   └── utils.ts        # Utility functions
└── pages/              # Page components
```

## Usage

1. **Add Aquarium** - Create your first aquarium with name and volume
2. **Add Inventory** - Add fertilizers and equipment in the Inventory section
3. **Daily Logging** - Use the Journal to record daily activities
4. **Track Parameters** - Log water test results in Aquarium detail
5. **Settings** - Configure language, units, sync, and export/import data

## License

MIT
