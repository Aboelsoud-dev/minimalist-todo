# Minimalist Todo

> A focused, glass-inspired task list for turning small intentions into finished work.

Minimalist Todo is a lightweight browser app built with plain HTML, CSS, and JavaScript. It keeps the interface calm and the workflow quick: write a task, mark it complete, edit it when plans change, and watch your progress move.

## What It Does

- Add tasks with a single input and button
- Mark tasks complete or incomplete
- Edit task text inline
- Delete individual tasks
- Clear all completed tasks at once
- Track completion with a live progress bar
- Persist tasks in the browser with `localStorage`
- Adapt to desktop, tablet, and mobile screens
- Provide keyboard-friendly controls and accessible labels

## Preview

The app uses a translucent glass panel over a soft background image, with clear task rows and small, purposeful controls. The progress indicator changes as tasks move from open to complete, making the current state easy to scan.

## Quick Start

No build step or package installation is required.

1. Clone or download this repository.
2. Open `index.html` in a modern browser.
3. Add your first task.

For a local server, run:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Keyboard Controls

| Action | Shortcut |
| --- | --- |
| Add a task | Enter while the input is focused |
| Save an edit | Enter while editing |
| Cancel an edit | Escape |
| Clear completed tasks | Ctrl + Shift + C |

## Project Structure

```text
minimalist-todo/
├── index.html   # App structure and accessible controls
├── style.css    # Glass UI, responsive layout, and animations
├── script.js    # State, rendering, storage, and interactions
├── image.png    # Background artwork
├── favicon.png  # Browser tab icon
└── README.md   # Project documentation
```

## How It Works

Tasks are stored as objects in the browser's local storage under the `todos` key. Every add, edit, delete, completion toggle, or bulk clear updates the state, saves it, and re-renders the list and progress indicator.

Because the app is client-side only, tasks stay on the device and browser where they were created. Clearing browser site data will also remove the saved list.

## Design Details

- Responsive layout with mobile-specific spacing and control sizes
- Glassmorphism panel with subtle blur, borders, and depth
- Animated task entry and removal states
- Color-coded controls for completion, editing, and deletion
- Visible focus rings for keyboard navigation
- Font Awesome icons with accessible labels and tooltips

## Customize It

The easiest way to change the visual language is through the variables at the top of `style.css`:

```css
:root {
	--glass-bg: rgba(255, 255, 255, 0.12);
	--glass-border: rgba(255, 255, 255, 0.2);
	--text-primary: #ffffff;
	--text-secondary: rgba(255, 255, 255, 0.8);
}
```

Swap `image.png` for another background image, or update the `favicon.png` file to give the browser tab a different identity.

## Built With

- HTML5
- CSS3
- Vanilla JavaScript
- Font Awesome 6
- Browser `localStorage` API

