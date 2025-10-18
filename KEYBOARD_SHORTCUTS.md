# Keyboard Shortcuts

## Send Message Page

### Navigation
- **Ctrl+K** (or **⌘K** on Mac) - Open webhook selector tab
- **Tab** - Navigate between form fields (native browser behavior)
- **Shift+Tab** - Navigate backwards between form fields

### Actions
- **Esc** - Clear the entire form (when not focused on input/textarea)
- **Ctrl+Enter** - Send message (standard form submission)

### Visual Indicators
- Webhook tab shows `⌘K` badge
- Clear button shows `Esc` badge
- Header subtitle shows quick shortcut hint

## Implementation Details

The keyboard shortcuts are implemented using:
1. Global `keydown` event listener in `useEffect`
2. Ref to webhook tab trigger for programmatic click
3. Conditional logic to prevent clearing when typing in inputs
4. Visual kbd elements styled with Tailwind CSS
