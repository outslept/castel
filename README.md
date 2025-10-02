# `bezier-curve-editor`

An interactive tool for designing and visualizing cubic Bézier easing functions.

This application provides a live, 2D graphical environment where users directly manipulate the two control points (P1 and P2) that define a `cubic-bezier()` curve. The canvas visualizes the resulting curve shape relative to the normalized coordinate space (0,0 to 1,1).

Users can fine-tune positions via dragging or precise numerical input. A built-in lookup system offers instant access to standard easing presets (like `ease-in`, `linear`), which can be selected and then further customized.

The resulting curve definition is instantly available for copying in both CSS `cubic-bezier(...)` string format and array format. The current curve state is automatically encoded into the URL hash, allowing for sharing and bookmarking of custom transitions.
