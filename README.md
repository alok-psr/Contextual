# Contextual

Contextual is a research-first knowledge tool that helps you save ideas without losing their source. Capture highlights, notes, and insights directly from articles, videos, and webpages, and organize them into a connected knowledge tree that preserves meaning, origin, and context.

## Features

- **Web Content Capture**: Select text or capture entire URLs from any webpage
- **Knowledge Tree Organization**: Organize captured content into a hierarchical tree structure
- **Context Preservation**: Automatically save source URLs and maintain context for all captures
- **Chrome Extension**: Quick keyboard shortcuts for seamless content capture
- **Local Server**: Backend API for managing and storing your knowledge base

## Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **chromium** browser

## Project Structure

```
codebase/
├── extension/          # Chrome extension files
│   ├── background/     # Background service worker
│   ├── scripts/        # Content and tree scripts
│   └── manifest.json   # Extension manifest
├── server/             # Node.js backend server
│   ├── controllers/    # API route handlers
│   ├── routes/         # Express routes
│   ├── utils/          # Utility functions
│   └── package.json    # Server dependencies
└── README.md           # This file
```

## Setup Instructions

### 1. Clone or Download the Repository

If you have the project in a repository, clone it:

```bash
git clone <repository-url>
cd contextual/codebase
```

### 2. Set Up the Backend Server

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `server/` directory with the following variables:

```env
PORT=3000
PROJECT_PATH=/path/to/your/knowledge/base
```

   Replace `/path/to/your/knowledge/base` with the absolute path where you want to store your knowledge tree (e.g., `/home/alok/contextual` or `C:\Users\YourName\contextual` on Windows).

4. Start the development server:

```bash
npm run dev
```

   Or run it directly:

```bash
node main.js
```

   The server should start and display: `server works at PORT 3000`

### 3. Set Up the Chrome Extension

1. Open Google Chrome and navigate to the extensions page:
   - Type `chrome://extensions/` in the address bar, OR
   - Go to Menu (⋮) → Extensions → Manage Extensions

2. Enable **Developer mode** (toggle in the top right corner)

3. Click **"Load unpacked"** button

4. Navigate to and select the `codebase/extension/` folder

5. The extension should now appear in your extensions list

6. Configure keyboard shortcuts:
   - Click on "Keyboard shortcuts" or "Details" → "Keyboard shortcuts"
   - Verify the shortcuts are set:
     - **Alt+A**: Process content directly
     - **Alt+Shift+C**: Open popup to add content

### 4. Configure Extension API URL (if needed)

If your server runs on a different port or host, update the API URL in `extension/scripts/tree.js`:

```javascript
const API_URL = 'http://localhost:3000/api'
```

Change `3000` to match your server's PORT if different.

## Usage

### Capturing Content

1. **Direct Capture (Alt+A)**:
   - Select text on any webpage
   - Press `Alt+A` to capture the selected text (or URL if nothing is selected)
   - The content is saved directly to the previously selected node in your knowledge tree

2. **Capture via Popup (Alt+Shift+C)**:
   - Select text on any webpage (or just navigate to a page for URL capture)
   - Press `Alt+Shift+C` to open the extension popup
   - The selected text or URL is automatically filled in the content field
   - Select a node from the tree to set the path
   - Fill in optional title and note fields
   - Click "Submit" to save

### Managing Your Knowledge Tree

- The extension displays your knowledge tree in the popup
- Click on any node to select it as the destination for new content
- The tree structure is managed by your local server and stored in markdown files

## Troubleshooting

### Server Issues

- **Port already in use**: Change the `PORT` in your `.env` file or stop the process using port 3000
- **Path errors**: Ensure `PROJECT_PATH` in `.env` is an absolute path and the directory exists
- **Module errors**: Make sure you've run `npm install` in the `server/` directory

### Extension Issues

- **Shortcuts not working**: 
  - Ensure the extension is loaded and enabled
  - Go to `chrome://extensions/` → Keyboard shortcuts and verify bindings
  - Some shortcuts may conflict with browser shortcuts on Linux
  - Try changing the shortcut to `Ctrl+Shift+S` or `MacCtrl+S` in `manifest.json`
  
- **Content not pre-filling**:
  - Ensure the server is running on the correct port
  - Check browser console for errors (right-click extension icon → Inspect popup)
  - Verify content script is loaded (check console on any webpage)

- **Popup not opening**:
  - Check service worker logs: `chrome://extensions/` → Click "service worker" link under your extension
  - Reload the extension after making changes

### Debugging

- **Server logs**: Check the terminal where you ran `npm run dev` for server-side errors
- **Extension logs**: 
  - Background script: `chrome://extensions/` → service worker link
  - Popup script: Right-click extension icon → Inspect popup
  - Content script: Right-click on any webpage → Inspect → Console tab

## Development

### Running in Development Mode

The server is configured to run with `nodemon` for automatic reloading on file changes:

```bash
cd server
npm run dev
```

### Making Changes

- **Extension changes**: After modifying extension files, reload the extension in `chrome://extensions/`
- **Server changes**: The server will auto-reload if using `npm run dev`

## API Endpoints

The server provides the following endpoints:

- `GET /api/tree` - Fetch the knowledge tree structure
- `PUT /api/content` - Save content to existing node
- `PUT /api/content/new` - Save content to a new node

## Author

Alok
