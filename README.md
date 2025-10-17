# Campus Life Planner

A responsive, accessible web application for managing campus tasks and events. Built with vanilla HTML, CSS, and JavaScript.

## Features

- **Task Management**: Add, edit, and delete tasks with title, duration, due date, and tag
- **Data Persistence**: All tasks are saved to localStorage automatically
- **Regex Validation**: Form inputs are validated using regex patterns
- **Regex Search**: Search tasks using regex patterns with match highlighting
- **Sorting**: Sort tasks by title, duration, or due date
- **Stats Dashboard**: View total tasks, total duration, top tag, and 7-day trend
- **Daily Target**: Set and track daily task duration targets
- **Import/Export**: Import and export tasks as JSON
- **Settings**: Configure default units and daily targets
- **Accessibility**: Keyboard navigation, ARIA attributes, and visible focus states
- **Responsive Design**: Mobile-first layout with multiple breakpoints
- **Dark Mode**: Toggle between light and dark themes

## Regex Catalog

| Pattern | Description | Example |
|---------|-------------|--------|
| `/^\S(?:.*\S)?$/` | No leading/trailing spaces | "Valid Title" (valid), " Invalid " (invalid) |
| `/^(0\|[1-9]\d*)(\.[0-9]{1,2})?$/` | Numbers with optional decimal | "60", "45.5" (valid), "0.123" (invalid) |
| `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | YYYY-MM-DD date format | "2023-12-15" (valid), "2023-13-01" (invalid) |
| `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Letters, spaces, hyphens | "Academic", "Study Group" (valid), "123" (invalid) |
| `/\b(\w+)\s+\1\b/` | Duplicate words | "The the book" (matches "the the") |

## Keyboard Navigation Map

| Key | Action |
|-----|--------|
| Tab | Navigate through interactive elements |
| Enter/Space | Activate buttons, submit forms |
| Escape | Cancel form editing |
| Arrow Keys | Navigate dropdown options |

## Accessibility Features

- Semantic HTML structure with proper landmarks and headings
- Skip-to-content link for keyboard users
- ARIA live regions for dynamic content updates
- Visible focus indicators for all interactive elements
- Sufficient color contrast in both light and dark modes
- Form labels properly associated with inputs
- Error messages linked to form fields
- Keyboard-accessible functionality

## How to Run

1. Clone the repository
2. Open `index.html` in a web browser
3. No build process or server required

## Sample Data

A `seed.json` file is included with sample tasks that can be imported into the application.

## Browser Compatibility

Tested and working in latest versions of:
- Chrome
- Firefox
- Safari
- Edge

## Youtube Link
https://www.youtube.com/watch?v=oK1D7WBluO0

## Deployment Link Github Page
https://david-mug.github.io/Campus-Life-Planner/
