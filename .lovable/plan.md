# ResumeIQ visual polish

## Goal
Refine the existing three-screen resume analysis flow without changing its analysis behavior or data contract.

## Changes
- Add a top-right sun/moon theme control with saved preference and a deep navy dark palette.
- Replace the spinner with a results-shaped skeleton: score ring, four category cards, and suggestion rows with shimmer.
- Smooth transitions between input, loading, error, and results screens.
- Add restrained card lift, staggered progress fills, and a lightweight celebration for scores of 80 or higher.
- Replace inline API errors with a polished recovery view containing an icon, clear message, retry, and return actions.
- Strengthen type hierarchy, spacing, reading comfort, touch targets, and 375px behavior.
- Add a compact ResumeIQ favicon and complete route metadata for bookmarks and sharing.

## Technical details
- Keep all API calls, result parsing, role choices, and reset behavior unchanged.
- Use CSS transitions/keyframes and existing React state so no animation dependency is required.
- Respect reduced-motion preferences and avoid browser-storage access during server rendering.
- Verify input, loading, error, results, theme persistence, score celebration, and mobile layout in the browser.
