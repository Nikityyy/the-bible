# The Bible App 📖

A beautiful, modern Progressive Web App for reading the Bible offline in German and English. Where faith and curiosity meet.

[![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Offline Support](https://img.shields.io/badge/Offline-Enabled-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
[![Cross Platform](https://img.shields.io/badge/Cross%20Platform-Supported-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Installable_PWAs)

## Features

- **Progressive Web App**: Install on mobile and desktop - works like a native app
- **Multi-Language Support**: Read in English (WEB) and German (Luther 1912)
- **Offline Reading**: Download and read completely offline with cached content
- **Reading Progress**: Track your reading progress across sessions
- **Modern UI**: Beautiful liquid glass design with smooth animations
- **Responsive Design**: Optimized for phone, tablet, and desktop
- **Easy Navigation**: Swipe between chapters on mobile, intuitive book/chapter selection

## Usage

### Getting Started
- **Install the App or just use the Website**: Add to home screen for the best experience
- **Load Bible Data**: First launch downloads and caches the Bible texts
- **Choose Language**: Tap the language switcher in the top-right to toggle between English and German

### Reading the Bible
- **Book Selection**: Browse and select books from the main screen
- **Continue Reading**: Quick access to your last read chapter from the home screen
- **Chapter Navigation**: Use the bottom navigation or swipe left/right to move between chapters
- **Reading Progress**: Your progress is automatically saved as you read

### Language Support
- **English**: World English Bible (WEB) translation
- **Deutsch**: Martin Luther (1912) translation

## Data Sources

- **The Bible** text files were obtained from https://www.biblesupersearch.com/bible-downloads/

## Technology Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript
- **PWA**: Service Worker, Web App Manifest, IndexedDB
- **UI Framework**: Custom design with Material Symbols icons
- **Data Compression**: Zstandard (.zst) for efficient Bible text storage
- **Fonts**: Google Fonts (Inter for reading, Material Symbols for icons)
