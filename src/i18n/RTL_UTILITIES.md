# RTL Utility Classes

This document describes the RTL-aware utility classes available in the project after configuring Tailwind CSS with the RTL plugin.

## Overview

The Tailwind configuration now includes:
1. **tailwindcss-rtl plugin**: Automatically mirrors directional utilities based on the `dir` attribute
2. **Custom logical property utilities**: CSS logical properties for direction-agnostic styling

## Automatic RTL Mirroring (via tailwindcss-rtl)

The following standard Tailwind classes are automatically mirrored in RTL mode:

### Margins
- `ml-*` / `mr-*` → Automatically flipped in RTL
- `pl-*` / `pr-*` → Automatically flipped in RTL

### Positioning
- `left-*` / `right-*` → Automatically flipped in RTL

### Text Alignment
- `text-left` / `text-right` → Automatically flipped in RTL

### Borders
- `border-l-*` / `border-r-*` → Automatically flipped in RTL
- `rounded-l-*` / `rounded-r-*` → Automatically flipped in RTL

## Custom Logical Property Utilities

These utilities use CSS logical properties and work consistently regardless of direction:

### Margin Utilities
- `.ms-auto` - margin-inline-start: auto
- `.me-auto` - margin-inline-end: auto

### Padding Utilities
- `.ps-0` through `.ps-8` - padding-inline-start (0, 0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem)
- `.pe-0` through `.pe-8` - padding-inline-end (0, 0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem)

### Text Alignment
- `.text-start` - text-align: start (left in LTR, right in RTL)
- `.text-end` - text-align: end (right in LTR, left in RTL)

### Border Utilities
- `.border-s` - border-inline-start-width: 1px
- `.border-e` - border-inline-end-width: 1px

### Border Radius
- `.rounded-s` - Rounds the start corners (left in LTR, right in RTL)
- `.rounded-e` - Rounds the end corners (right in LTR, left in RTL)
- `.rounded-s-lg` - Rounds the start corners with large radius
- `.rounded-e-lg` - Rounds the end corners with large radius

## Usage Examples

### Example 1: Card with Start Padding
```tsx
<div className="ps-4 pe-2">
  {/* Content has more padding on the start side */}
</div>
```

### Example 2: Button with Icon
```tsx
<button className="flex items-center gap-2 ps-4 pe-3">
  <Icon />
  <span>Click me</span>
</button>
```

### Example 3: Text Alignment
```tsx
<p className="text-start">
  This text aligns to the start (left in LTR, right in RTL)
</p>
```

### Example 4: Border on Start Side
```tsx
<div className="border-s border-gray-300 ps-4">
  Content with start border
</div>
```

## Best Practices

1. **Use logical properties for new components**: Prefer `.ps-*`, `.pe-*`, `.text-start`, `.text-end` over directional classes
2. **Let automatic mirroring handle existing code**: Standard Tailwind classes like `ml-*`, `mr-*` will work automatically
3. **Test in both directions**: Always verify your UI in both LTR and RTL modes
4. **Avoid mixing approaches**: Choose either logical properties or automatic mirroring for consistency

## Integration with LanguageContext

The RTL utilities work in conjunction with the `LanguageContext` which sets the `dir` attribute on the document root:

```tsx
// When language is Arabic
document.documentElement.dir = 'rtl';

// When language is English
document.documentElement.dir = 'ltr';
```

This ensures all RTL-aware utilities respond correctly to the current language setting.
