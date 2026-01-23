# Dashboard Layout

This document describes the dashboard layout implementation with collapsible sidebar and header.

## Components

### 1. DashboardLayout (`/src/components/layout/dashboard-layout.tsx`)

The main layout wrapper that orchestrates the sidebar and header components.

**Features:**

- Responsive design (mobile & desktop)
- Smooth transitions when sidebar toggles
- Automatic sidebar state management based on screen size
- Proper spacing for fixed header

### 2. Sidebar (`/src/components/layout/sidebar.tsx`)

A collapsible sidebar with navigation menu.

**Features:**

- **Collapsible**: Toggle between expanded (280px) and collapsed (72px) states
- **Responsive**:
  - Desktop: Permanent drawer with collapse functionality
  - Mobile: Temporary drawer that overlays content
- **Navigation**:
  - Nested menu support with expand/collapse
  - Active route highlighting
  - Smooth animations
- **Visual Design**:
  - Gradient background
  - Active state with left border accent
  - Icon-only mode when collapsed
  - Premium logo section with gradient text

**Menu Structure:**

```
- Dashboard
- Users
- Analytics
  - Overview
  - Reports
- Administration
  - Roles & Permissions
  - Permissions
- Settings
```

### 3. Header (`/src/components/layout/header.tsx`)

A fixed header with user controls and navigation.

**Features:**

- **Glassmorphism Effect**: Semi-transparent background with blur
- **User Menu**:
  - Profile avatar with gradient
  - Email and role display
  - Profile link
  - Settings link
  - Logout action
- **Controls**:
  - Theme toggle (light/dark mode)
  - Language selector (EN/AR)
  - Notifications with badge
  - Menu toggle button
- **Responsive**: Adapts to mobile screens

## Usage

### Applying the Layout

The layout is automatically applied to all routes within the `(dashboard)` route group:

```tsx
// src/app/(dashboard)/layout.tsx
import { DashboardLayout } from "@/components/layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
```

### Creating Dashboard Pages

Any page within the `(dashboard)` folder will automatically use the layout:

```tsx
// src/app/(dashboard)/your-page/page.tsx
export default function YourPage() {
  return (
    <Box>
      <Typography variant="h4">Your Page</Typography>
      {/* Your content */}
    </Box>
  );
}
```

## Customization

### Sidebar Menu Items

Edit the `menuItems` array in `sidebar.tsx`:

```tsx
const menuItems: MenuItem[] = [
  {
    id: "unique-id",
    label: t("sidebar.menu_item"),
    icon: <YourIcon />,
    path: "/your-path", // Optional if has children
    children: [
      // Optional nested items
      {
        id: "child-id",
        label: t("sidebar.child_item"),
        icon: <ChildIcon />,
        path: "/child-path",
      },
    ],
  },
];
```

### Translations

Add translations in the dictionary files:

**English** (`src/dictionaries/en.ts`):

```typescript
sidebar: {
  your_menu_item: "Your Menu Item",
},
```

**Arabic** (`src/dictionaries/ar.ts`):

```typescript
sidebar: {
  your_menu_item: "عنصر القائمة الخاص بك",
},
```

### Styling

The layout uses Material-UI's theming system. Customize colors and spacing in your theme configuration:

```tsx
// Sidebar width
const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

// Header height is controlled by MUI Toolbar
// Default: 64px on desktop, 56px on mobile
```

## Features Showcase

### Dark Mode Support

The layout automatically adapts to the theme mode (light/dark) with:

- Gradient backgrounds
- Proper contrast ratios
- Smooth transitions

### RTL Support

Full support for right-to-left languages (Arabic):

- Sidebar position flips
- Text alignment adjusts
- Icons and spacing mirror correctly

### Mobile Responsive

- Sidebar becomes a temporary drawer on mobile
- Header adapts with smaller spacing
- Touch-friendly tap targets

### Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Semantic HTML structure

## State Management

The layout uses React hooks for state:

- `useState` for sidebar open/close state
- `useMediaQuery` for responsive behavior
- `useTheme` for theming
- `useSettings` for theme mode and language
- `useAuth` for user information

## Performance

- Smooth 60fps animations using CSS transitions
- Optimized re-renders with proper React patterns
- Lazy loading of menu items
- Efficient event handlers

## Browser Support

Tested and working on:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
