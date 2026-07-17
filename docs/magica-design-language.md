# Design Language: Flow | Magica

> Extracted from `https://magica.com/app/flow` on July 5, 2026
> 410 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#4f46e5` | rgb(79, 70, 229) | hsl(243, 75%, 59%) | 49 |
| Secondary | `#e42024` | rgb(228, 32, 36) | hsl(359, 78%, 51%) | 4 |
| Accent | `#1f2937` | rgb(31, 41, 55) | hsl(215, 28%, 17%) | 1 |

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#e5e5e5` | hsl(0, 0%, 90%) | 408 |
| `#3d3d41` | hsl(240, 3%, 25%) | 158 |
| `#1b1b18` | hsl(60, 6%, 10%) | 103 |
| `#000000` | hsl(0, 0%, 0%) | 60 |
| `#ffffff` | hsl(0, 0%, 100%) | 38 |
| `#f0f0f0` | hsl(0, 0%, 94%) | 13 |
| `#858589` | hsl(240, 2%, 53%) | 12 |
| `#a3a3a7` | hsl(240, 2%, 65%) | 4 |
| `#dadada` | hsl(0, 0%, 85%) | 2 |

### Background Colors

Used on large-area elements: `#ffffff`, `#f0f0f0`, `#f9f9f9`, `#e42024`

### Text Colors

Text color palette: `#000000`, `#1b1b18`, `#3d3d41`, `#a3a3a7`, `#ffffff`, `#9ca3af`, `#1f2937`, `#858589`, `#4f46e6`, `#e42024`

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#e5e5e5` | border | 408 |
| `#3d3d41` | text, background | 158 |
| `#1b1b18` | text, border | 103 |
| `#000000` | text | 60 |
| `#4f46e5` | background, text, border | 49 |
| `#ffffff` | background, text | 38 |
| `#f0f0f0` | background | 13 |
| `#858589` | text | 12 |
| `#a3a3a7` | text | 4 |
| `#e42024` | background, text | 4 |
| `#dadada` | background | 2 |
| `#1f2937` | text | 1 |

## Typography

### Font Families

- **Google Sans Flex** — used for all (283 elements)
- **Inter** — used for all (67 elements)
- **ui-sans-serif** — used for body (60 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 36px | 2.25rem | 700 | 40px | -0.9px | h1, br |
| 28px | 1.75rem | 600 | 36px | normal | div |
| 16px | 1rem | 400 | 24px | normal | html, head, style, meta |
| 14px | 0.875rem | 500 | 20px | normal | button, img, svg, rect |
| 12px | 0.75rem | 500 | 16px | normal | div, svg, path, p |
| 10px | 0.625rem | 400 | 20px | normal | span |

### Heading Scale

```css
h1 { font-size: 36px; font-weight: 700; line-height: 40px; }
```

### Body Text

```css
body { font-size: 12px; font-weight: 500; line-height: 16px; }
```

### Font Weights in Use

`400` (298x), `500` (96x), `600` (8x), `700` (8x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-2 | 2px | 0.125rem |
| spacing-32 | 32px | 2rem |
| spacing-40 | 40px | 2.5rem |
| spacing-48 | 48px | 3rem |
| spacing-56 | 56px | 3.5rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| md | 6px | 1 |
| lg | 16px | 9 |
| xl | 20px | 2 |
| full | 9999px | 1 |

## Box Shadows

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
```

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
```

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(26, 26, 24, 0.04) 0px 1px 2px 0px;
```

## CSS Custom Properties

### Colors

```css
--foreground: 60 4% 10%;
--card: 60 8% 98%;
--card-foreground: 60 4% 10%;
--popover: 60 11% 96%;
--popover-foreground: 60 4% 10%;
--primary: 0 0% 9%;
--primary-foreground: 0 0% 98%;
--secondary: 0 0% 96.1%;
--secondary-foreground: 0 0% 9%;
--muted: 0 0% 96.1%;
--muted-foreground: 0 0% 45.1%;
--accent: 0 0% 96.1%;
--accent-foreground: 0 0% 9%;
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 0 0% 98%;
--border: 0 0% 89.8%;
--ring: 0 0% 3.9%;
--chart-1: 12 76% 61%;
--chart-2: 173 58% 39%;
--chart-3: 197 37% 24%;
--chart-4: 43 74% 66%;
--chart-5: 27 87% 67%;
--sidebar-foreground: 240 5.3% 26.1%;
--sidebar-primary: 240 5.9% 10%;
--sidebar-primary-foreground: 0 0% 98%;
--sidebar-accent: 240 4.8% 95.9%;
--sidebar-accent-foreground: 240 5.9% 10%;
--sidebar-border: 220 13% 91%;
--sidebar-ring: 217.2 91.2% 59.8%;
--galaxy-surface-primary: #efeff0;
--galaxy-surface-secondary: #e0e0e2;
--galaxy-text-primary: #141416;
--galaxy-text-secondary: #858589;
--galaxy-border-primary: #e0e0e2;
--galaxy-border-secondary: #ceced0;
--alias-primary-50: var(--brand-indigo-50);
--alias-primary-100: var(--brand-indigo-100);
--alias-primary-200: var(--brand-indigo-200);
--alias-primary-300: var(--brand-indigo-300);
--alias-primary-400: var(--brand-indigo-400);
--alias-primary-500: var(--brand-indigo-500);
--alias-primary-600: var(--brand-indigo-600);
--alias-primary-700: var(--brand-indigo-700);
--alias-primary-800: var(--brand-indigo-800);
--alias-primary-900: var(--brand-indigo-900);
--alias-primary-1000: var(--brand-indigo-1000);
--alias-primary-a50: var(--brand-indigo-a50);
--alias-primary-a100: var(--brand-indigo-a100);
--alias-primary-a150: var(--brand-indigo-a150);
--alias-primary-a200: var(--brand-indigo-a200);
--alias-border-width-none: var(--border-width-none);
--alias-border-width-xs: var(--border-width-xs);
--alias-border-width-s: var(--border-width-s);
--alias-border-width-m: var(--border-width-m);
--alias-border-width-l: var(--border-width-l);
--alias-border-width-base: var(--border-width-base);
--alias-border-width-xl: var(--border-width-xl);
--alias-border-width-2xl: var(--border-width-2xl);
--shadow-popover: var(--shadow-xl);
--surface-primary: var(--brand-neutral-light-400);
--surface-secondary: var(--brand-neutral-light-700);
--surface-primary-active: var(--alias-primary-500);
--surface-primary-hover: var(--alias-primary-600);
--surface-primary-disabled: var(--alias-primary-700);
--text-primary: var(--brand-neutral-dark-900);
--text-secondary: var(--brand-neutral-dark-400);
--icon-primary: var(--brand-neutral-dark-900);
--icon-secondary: var(--brand-neutral-dark-300);
--boarder-primary: var(--brand-neutral-dark-500);
--boarder-secondary: var(--brand-neutral-dark-200);
--boarder-disabled-for-card: var(--brand-neutral-dark-0);
--border-width-none: 0px;
--border-width-xs: 0.3px;
--border-width-s: 0.5px;
--border-width-m: 1px;
--border-width-l: 1.5px;
--border-width-base: 2px;
--border-width-xl: 3px;
--border-width-2xl: 4px;
--foreground-rgb: 0,0,0;
```

### Spacing

```css
--space-00: 0px;
--space-01: 2px;
--space-02: 4px;
--space-03: 8px;
--space-04: 12px;
--space-05: 16px;
--space-06: 20px;
--space-07: 24px;
--space-08: 32px;
--space-09: 40px;
--space-10: 48px;
--space-11: 56px;
--space-12: 64px;
--space-13: 80px;
--space-14: 96px;
--space-15: 120px;
--space-16: 160px;
```

### Typography

```css
--galaxy-text-tertiary: #a3a3a7;
--galaxy-text-disabled: #c2c2c4;
--text-tertiary: var(--brand-neutral-dark-300);
--text-disabled: var(--brand-neutral-dark-100);
--text-action: var(--alias-primary-500);
--text-on-action: var(--brand-neutral-dark-0);
--text-action-disabled: var(--alias-primary-100);
--text-success: var(--alias-success-500);
--text-success-disabled: var(--alias-success-800);
--text-information: var(--alias-info-500);
--text-information-disabled: var(--alias-info-700);
--text-warning: var(--alias-warning-600);
--text-warning-disabled: var(--alias-warning-700);
--text-error: var(--alias-error-500);
--text-error-disabled: var(--alias-error-800);
```

### Shadows

```css
--shadow-xs: 0px 1px 2px 0px rgba(26,26,24,0.04);
--shadow-sm: 0px 1px 3px 0px rgba(26,26,24,0.06),0px 1px 2px 0px rgba(26,26,24,0.04);
--shadow-md: 0px 4px 8px -2px rgba(26,26,24,0.08),0px 2px 4px -2px rgba(26,26,24,0.04);
--shadow-lg: 0px 12px 16px -4px rgba(26,26,24,0.1),0px 4px 6px -2px rgba(26,26,24,0.05);
--shadow-xl: 0px 24px 32px -8px rgba(26,26,24,0.12),0px 8px 12px -6px rgba(26,26,24,0.06);
```

### Radii

```css
--radius: 0.5rem;
--alias-radius-none: var(--radius-none);
--alias-radius-xs: var(--radius-xs);
--alias-radius-s: var(--radius-s);
--alias-radius-m: var(--radius-m);
--alias-radius-l: var(--radius-l);
--alias-radius-xl: var(--radius-xl);
--alias-radius-xxl: var(--radius-xxl);
--alias-radius-xxxl: var(--radius-xxxl);
--alias-radius-xxxxl: var(--radius-xxxxl);
--alias-radius-xxxxxl: var(--radius-xxxxxl);
--alias-radius-xxxxxxl: var(--radius-xxxxxxl);
--alias-radius-max: var(--radius-max);
--radius-none: 0px;
--radius-xs: 1px;
--radius-s: 2px;
--radius-m: 4px;
--radius-l: 8px;
--radius-xl: 12px;
--radius-xxl: 16px;
--radius-xxxl: 20px;
--radius-xxxxl: 24px;
--radius-xxxxxl: 28px;
--radius-xxxxxxl: 32px;
--radius-max: 1000px;
```

### Other

```css
--background: 60 8% 98%;
--input: 0 0% 89.8%;
--sidebar-background: 0 0% 98%;
--galaxy-surface-main: #ffffff;
--galaxy-surface-tertiary: #f6f6f6;
--galaxy-surface-disabled: #e3e3e4;
--brand-indigo-50: #edecfc;
--brand-indigo-100: #dcdafa;
--brand-indigo-200: #b9b5f5;
--brand-indigo-300: #9590f0;
--brand-indigo-400: #726beb;
--brand-indigo-500: #4f46e6;
--brand-indigo-600: #3f38b8;
--brand-indigo-700: #2f2a8a;
--brand-indigo-800: #201c5c;
--brand-indigo-900: #100e2e;
--brand-indigo-1000: #080717;
--brand-indigo-a50: #efeefd;
--brand-indigo-a100: #dfdefa;
--brand-indigo-a150: #d5d3f9;
--brand-indigo-a200: #c6c3f7;
--brand-green-50: #e7f5ec;
--brand-green-100: #d0eddb;
--brand-green-200: #a2dab7;
--brand-green-300: #73c892;
--brand-green-400: #45b56e;
--brand-green-500: #16a34a;
--brand-green-600: #12823b;
--brand-green-700: #0d622c;
--brand-green-800: #09411e;
--brand-green-900: #04210f;
--brand-green-1000: #021007;
--brand-green-a50: #eaf7ef;
--brand-green-a100: #d5eede;
--brand-green-a150: #c7e9d4;
--brand-green-a200: #b4e1c5;
--brand-red-50: #fbe9e9;
--brand-red-100: #f8d4d4;
--brand-red-200: #f1a8a8;
--brand-red-300: #ea7d7d;
--brand-red-400: #e35151;
--brand-red-500: #dc2626;
--brand-red-600: #b01e1e;
--brand-red-700: #841717;
--brand-red-800: #580f0f;
--brand-red-900: #2c0808;
--brand-red-1000: #160404;
--brand-red-a50: #fcebeb;
--brand-red-a100: #f9d8d8;
--brand-red-a150: #f7cbcb;
--brand-red-a200: #f3b9b9;
--brand-yellow-50: #fef5e6;
--brand-yellow-100: #fdecce;
--brand-yellow-200: #fbd89d;
--brand-yellow-300: #f9c56d;
--brand-yellow-400: #f7b13c;
--brand-yellow-500: #f59e0b;
--brand-yellow-600: #c47e09;
--brand-yellow-700: #935f07;
--brand-yellow-800: #623f04;
--brand-yellow-900: #312002;
--brand-yellow-1000: #191001;
--brand-yellow-a50: #fef6e9;
--brand-yellow-a100: #fdedd3;
--brand-yellow-a150: #fde8c5;
--brand-yellow-a200: #fbe0b1;
--brand-blue-50: #e6effd;
--brand-blue-100: #cee0fc;
--brand-blue-200: #9dc0f9;
--brand-blue-300: #6da1f7;
--brand-blue-400: #3c81f4;
--brand-blue-500: #0b62f1;
--brand-blue-600: #094ec1;
--brand-blue-700: #073b91;
--brand-blue-800: #042760;
--brand-blue-900: #021430;
--brand-blue-1000: #010a18;
--brand-blue-a50: #e9f1fe;
--brand-blue-a100: #d3e3fc;
--brand-blue-a150: #c5dafc;
--brand-blue-a200: #b1ccfa;
--brand-neutral-dark-0: #ffffff;
--brand-neutral-dark-50: #efeff0;
--brand-neutral-dark-100: #e0e0e2;
--brand-neutral-dark-200: #c2c2c4;
--brand-neutral-dark-300: #a3a3a7;
--brand-neutral-dark-400: #858589;
--brand-neutral-dark-500: #66666c;
--brand-neutral-dark-600: #5c5c61;
--brand-neutral-dark-700: #525256;
--brand-neutral-dark-800: #47474c;
--brand-neutral-dark-900: #3d3d41;
--brand-neutral-dark-1000: #333336;
--brand-neutral-dark-1100: #29292b;
--brand-neutral-dark-1200: #1f1f20;
--brand-neutral-dark-1300: #141416;
--brand-neutral-dark-a25: #f6f6f6;
--brand-neutral-dark-a50: #f1f1f2;
--brand-neutral-dark-a100: #e3e3e4;
--brand-neutral-light-0: #ffffff;
--brand-neutral-light-50: #fdfdfd;
--brand-neutral-light-100: #fbfbfb;
--brand-neutral-light-200: #f9f9f9;
--brand-neutral-light-300: #f8f8f8;
--brand-neutral-light-400: #f5f5f5;
--brand-neutral-light-500: #f4f4f4;
--brand-neutral-light-600: #f2f2f2;
--brand-neutral-light-700: #f0f0f0;
--brand-neutral-light-800: #ececec;
--brand-neutral-light-900: #dadada;
--brand-neutral-light-1000: #c6c6c6;
--brand-neutral-light-1100: #b4b4b4;
--brand-neutral-light-1200: #a1a1a1;
--brand-neutral-light-1300: #8f8f8f;
--brand-neutral-light-a25: #7d7d7d;
--brand-neutral-light-a50: #696969;
--brand-neutral-light-a100: #575757;
--brand-neutral-light-a200: #444444;
--brand-black: #0a0a0b;
--brand-white: #ffffff;
--brand-paper-50: #fafaf8;
--brand-paper-100: #f5f5f3;
--brand-paper-200: #ebebe8;
--brand-paper-300: #dcdcd8;
--brand-paper-400: #c5c5c0;
--brand-charcoal-1000: #1a1a18;
--brand-charcoal-800: #2d2d29;
--brand-charcoal-600: #4a4a45;
--brand-charcoal-400: #6e6e68;
--brand-charcoal-300: #8c8c85;
--alias-success-50: var(--brand-green-50);
--alias-success-100: var(--brand-green-100);
--alias-success-200: var(--brand-green-200);
--alias-success-300: var(--brand-green-300);
--alias-success-400: var(--brand-green-400);
--alias-success-500: var(--brand-green-500);
--alias-success-600: var(--brand-green-600);
--alias-success-700: var(--brand-green-700);
--alias-success-800: var(--brand-green-800);
--alias-success-900: var(--brand-green-900);
--alias-success-1000: var(--brand-green-1000);
--alias-success-a50: var(--brand-green-a50);
--alias-success-a100: var(--brand-green-a100);
--alias-success-a150: var(--brand-green-a150);
--alias-success-a200: var(--brand-green-a200);
--alias-error-50: var(--brand-red-50);
--alias-error-100: var(--brand-red-100);
--alias-error-200: var(--brand-red-200);
--alias-error-300: var(--brand-red-300);
--alias-error-400: var(--brand-red-400);
--alias-error-500: var(--brand-red-500);
--alias-error-600: var(--brand-red-600);
--alias-error-700: var(--brand-red-700);
--alias-error-800: var(--brand-red-800);
--alias-error-900: var(--brand-red-900);
--alias-error-1000: var(--brand-red-1000);
--alias-error-a50: var(--brand-red-a50);
--alias-error-a100: var(--brand-red-a100);
--alias-error-a150: var(--brand-red-a150);
--alias-error-a200: var(--brand-red-a200);
--alias-warning-50: var(--brand-yellow-50);
--alias-warning-100: var(--brand-yellow-100);
--alias-warning-200: var(--brand-yellow-200);
--alias-warning-300: var(--brand-yellow-300);
--alias-warning-400: var(--brand-yellow-400);
--alias-warning-500: var(--brand-yellow-500);
--alias-warning-600: var(--brand-yellow-600);
--alias-warning-700: var(--brand-yellow-700);
--alias-warning-800: var(--brand-yellow-800);
--alias-warning-900: var(--brand-yellow-900);
--alias-warning-1000: var(--brand-yellow-1000);
--alias-warning-a50: var(--brand-yellow-a50);
--alias-warning-a100: var(--brand-yellow-a100);
--alias-warning-a150: var(--brand-yellow-a150);
--alias-warning-a200: var(--brand-yellow-a200);
--alias-info-50: var(--brand-blue-50);
--alias-info-100: var(--brand-blue-100);
--alias-info-200: var(--brand-blue-200);
--alias-info-300: var(--brand-blue-300);
--alias-info-400: var(--brand-blue-400);
--alias-info-500: var(--brand-blue-500);
--alias-info-600: var(--brand-blue-600);
--alias-info-700: var(--brand-blue-700);
--alias-info-800: var(--brand-blue-800);
--alias-info-900: var(--brand-blue-900);
--alias-info-1000: var(--brand-blue-1000);
--alias-info-a50: var(--brand-blue-a50);
--alias-info-a100: var(--brand-blue-a100);
--alias-info-a150: var(--brand-blue-a150);
--alias-info-a200: var(--brand-blue-a200);
--alias-neutral-dark-0: var(--brand-neutral-dark-0);
--alias-neutral-dark-50: var(--brand-neutral-dark-50);
--alias-neutral-dark-100: var(--brand-neutral-dark-100);
--alias-neutral-dark-200: var(--brand-neutral-dark-200);
--alias-neutral-dark-300: var(--brand-neutral-dark-300);
--alias-neutral-dark-400: var(--brand-neutral-dark-400);
--alias-neutral-dark-500: var(--brand-neutral-dark-500);
--alias-neutral-dark-600: var(--brand-neutral-dark-600);
--alias-neutral-dark-700: var(--brand-neutral-dark-700);
--alias-neutral-dark-800: var(--brand-neutral-dark-800);
--alias-neutral-dark-900: var(--brand-neutral-dark-900);
--alias-neutral-dark-1000: var(--brand-neutral-dark-1000);
--alias-neutral-dark-1100: var(--brand-neutral-dark-1100);
--alias-neutral-dark-1200: var(--brand-neutral-dark-1200);
--alias-neutral-dark-1300: var(--brand-neutral-dark-1300);
--alias-neutral-dark-a25: var(--brand-neutral-dark-a25);
--alias-neutral-dark-a50: var(--brand-neutral-dark-a50);
--alias-neutral-dark-a100: var(--brand-neutral-dark-a100);
--alias-neutral-dark-a200: var(
      --brand-neutral-light-a200
    );
--alias-neutral-light-0: var(--brand-neutral-light-0);
--alias-neutral-light-50: var(--brand-neutral-light-50);
--alias-neutral-light-100: var(--brand-neutral-light-100);
--alias-neutral-light-200: var(--brand-neutral-light-200);
--alias-neutral-light-300: var(--brand-neutral-light-300);
--alias-neutral-light-400: var(--brand-neutral-light-400);
--alias-neutral-light-500: var(--brand-neutral-light-500);
--alias-neutral-light-600: var(--brand-neutral-light-600);
--alias-neutral-light-700: var(--brand-neutral-light-700);
--alias-neutral-light-800: var(--brand-neutral-light-800);
--alias-neutral-light-900: var(--brand-neutral-light-900);
--alias-neutral-light-1000: var(--brand-neutral-light-1000);
--alias-neutral-light-1100: var(--brand-neutral-light-1100);
--alias-neutral-light-1200: var(--brand-neutral-light-1200);
--alias-neutral-light-1300: var(--brand-neutral-light-1300);
--alias-neutral-light-a25: var(--brand-neutral-light-a25);
--alias-neutral-light-a50: var(--brand-neutral-light-a50);
--alias-neutral-light-a100: var(--brand-neutral-light-a100);
--alias-neutral-light-a200: var(--brand-neutral-light-a200);
--alias-black: var(--brand-black);
--alias-white: var(--brand-white);
--surface-main-background: var(--brand-neutral-light-200);
--surface-main-background-2: var(--brand-neutral-light-500);
--surface-main-background-3: var(--brand-neutral-light-0);
--surface-tertiary: var(--brand-neutral-light-800);
--surface-disabled: var(--brand-neutral-light-600);
--surface-on-action: var(--brand-neutral-light-a200);
--surface-action-disabled: var(--alias-primary-100);
--surface-success-active: var(--alias-success-500);
--surface-success-hover: var(--alias-success-600);
--surface-success-disabled: var(--alias-success-100);
--surface-information-active: var(--alias-info-500);
--surface-information-hover: var(--alias-info-600);
--surface-information-disabled: var(--alias-info-100);
--surface-warning-active: var(--alias-warning-500);
--surface-warning-hover: var(--alias-warning-600);
--surface-warning-disabled: var(--alias-warning-100);
--surface-warning-disabled-2: var(--alias-warning-100);
--surface-error-active: var(--alias-error-500);
--surface-error-hover: var(--alias-error-600);
--surface-error-disabled: var(--alias-error-100);
--text-primary: --brand-neutral-dark-900;
--text-secondary: --brand-neutral-dark-400;
--text-tertiary: --brand-neutral-dark-300;
--text-disabled: --brand-neutral-dark-100;
--text-action: --alias-primary-500;
--text-on-action: --brand-neutral-dark-0;
--text-action-disabled: --alias-primary-100;
--text-success: --alias-success-500;
--text-success-disabled: --alias-success-800;
--text-information: --alias-info-500;
--text-information-disabled: --alias-info-700;
--text-warning: --alias-warning-600;
--text-warning-disabled: --alias-warning-700;
--text-error: --alias-error-500;
--text-error-disabled: --alias-error-800;
--icon-primary: --brand-neutral-dark-900;
--icon-secondary: --brand-neutral-dark-300;
--icon-tertiary: --brand-neutral-dark-200;
--icon-disabled: --brand-neutral-dark-200;
--icon-action: --alias-primary-500;
--icon-on-action: --brand-neutral-dark-0;
--icon-action-disabled: --alias-primary-100;
--icon-success: --alias-success-500;
--icon-success-disabled: --alias-success-100;
--icon-information: --alias-info-500;
--icon-information-disabled: --alias-info-100;
--icon-warning: --alias-warning-600;
--icon-warning-disabled: --alias-warning-100;
--icon-error: --alias-error-500;
--icon-error-disabled: --alias-error-100;
--boarder-primary: --brand-neutral-dark-500;
--boarder-secondary: --brand-neutral-dark-200;
--boarder-tertiary: --brand-neutral-dark-100;
--boarder-disabled-for-card: --brand-neutral-dark-0;
--boarder-action: --alias-primary-500;
--boarder-success: --alias-success-500;
--boarder-information: --alias-info-500;
--boarder-warning: --alias-warning-500;
--boarder-error: --alias-error-500;
```

### Semantic

```css
success: [object Object];
warning: [object Object];
error: [object Object];
info: [object Object];
```

## Breakpoints

| Name | Value | Type |
|------|-------|------|
| sm | 640px | min-width |
| md | 768px | min-width |
| md | 800px | min-width |
| lg | 1024px | min-width |
| xl | 1280px | min-width |
| 1400px | 1400px | min-width |
| 2xl | 1536px | min-width |

## Transitions & Animations

**Easing functions:** `[object Object]`

**Durations:** `0.15s`, `0.3s`

### Common Transitions

```css
transition: all;
transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), fill 0.15s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.15s cubic-bezier(0.4, 0, 0.2, 1);
transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
transition: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), fill 0.3s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Keyframe Animations

**bounce**
```css
@keyframes bounce {
  0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
  50% { transform: none; animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
}
```

**chat-fade-in-up**
```css
@keyframes chat-fade-in-up {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0px); }
}
```

**chat-scale-in**
```css
@keyframes chat-scale-in {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
```

**ping**
```css
@keyframes ping {
  75%, 100% { transform: scale(2); opacity: 0; }
}
```

**pulse**
```css
@keyframes pulse {
  50% { opacity: 0.5; }
}
```

**pulse-subtle**
```css
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
```

**spin**
```css
@keyframes spin {
  100% { transform: rotate(1turn); }
}
```

**enter**
```css
@keyframes enter {
  0% { opacity: var(--tw-enter-opacity,1); transform: translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0)); }
}
```

**exit**
```css
@keyframes exit {
  100% { opacity: var(--tw-exit-opacity,1); transform: translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0)); }
}
```

**fade-in-down**
```css
@keyframes fade-in-down {
  0% { opacity: 0; transform: translateY(-1rem); }
  100% { opacity: 1; transform: translateY(0px); }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (26 instances)

```css
.button {
  background-color: rgb(255, 255, 255);
  color: rgb(61, 61, 65);
  font-size: 14px;
  font-weight: 500;
  padding-top: 0px;
  padding-right: 0px;
  border-radius: 18px;
}
```

### Cards (4 instances)

```css
.card {
  background-color: rgb(255, 255, 255);
  border-radius: 16px;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(26, 26, 24, 0.04) 0px 1px 2px 0px;
  padding-top: 20px;
  padding-right: 20px;
}
```

### Links (7 instances)

```css
.link {
  color: rgb(61, 61, 65);
  font-size: 14px;
  font-weight: 400;
}
```

### Navigation (9 instances)

```css
.navigatio {
  background-color: rgb(218, 218, 218);
  color: rgb(61, 61, 65);
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 8px;
  padding-right: 8px;
  position: static;
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 5 instances, 4 variants

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(61, 61, 65);
  padding: 0px 0px 0px 0px;
  border-radius: 18px;
  border: 0px solid rgb(229, 229, 229);
  font-size: 14px;
  font-weight: 500;
```

**Variant 2** (2 instances)

```css
  background: rgba(79, 70, 229, 0.9);
  color: rgb(255, 255, 255);
  padding: 8px 16px 8px 16px;
  border-radius: 18px;
  border: 0px solid rgb(229, 229, 229);
  font-size: 14px;
  font-weight: 500;
```

**Variant 3** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(156, 163, 175);
  padding: 4px 0px 4px 0px;
  border-radius: 0px;
  border: 0px solid rgb(229, 229, 229);
  font-size: 16px;
  font-weight: 400;
```

**Variant 4** (1 instance)

```css
  background: rgb(249, 249, 249);
  color: rgb(61, 61, 65);
  padding: 10px 20px 10px 20px;
  border-radius: 8px;
  border: 1px solid rgb(224, 224, 226);
  font-size: 14px;
  font-weight: 500;
```

### Button — 2 instances, 1 variant

**Variant 1** (2 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(61, 61, 65);
  padding: 8px 8px 8px 8px;
  border-radius: 8px;
  border: 0px solid rgb(229, 229, 229);
  font-size: 14px;
  font-weight: 400;
```

### Button — 9 instances, 2 variants

**Variant 1** (3 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(61, 61, 65);
  padding: 8px 8px 8px 8px;
  border-radius: 8px;
  border: 0px solid rgb(229, 229, 229);
  font-size: 14px;
  font-weight: 400;
```

**Variant 2** (6 instances)

```css
  background: rgb(255, 255, 255);
  color: rgb(27, 27, 24);
  padding: 16px 16px 16px 16px;
  border-radius: 16px;
  border: 1px solid rgb(224, 224, 226);
  font-size: 16px;
  font-weight: 400;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(243, 244, 246);
  color: rgb(31, 41, 55);
  padding: 8px 16px 8px 16px;
  border-radius: 6px;
  border: 0px solid rgb(229, 229, 229);
  font-size: 14px;
  font-weight: 500;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(68, 68, 68);
  color: rgb(255, 255, 255);
  padding: 8px 12px 8px 12px;
  border-radius: 8px;
  border: 0px solid rgb(229, 229, 229);
  font-size: 14px;
  font-weight: 500;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(255, 255, 255);
  color: rgb(228, 32, 36);
  padding: 6px 16px 6px 16px;
  border-radius: 9999px;
  border: 0px solid rgb(229, 229, 229);
  font-size: 16px;
  font-weight: 600;
```

## Layout System

**2 grid containers** and **70 flex containers** detected.

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 1152px | 24px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 3-column | 2x |

### Grid Templates

```css
grid-template-columns: 301.328px 301.328px 301.344px;
gap: 16px;
grid-template-columns: 301.328px 301.328px 301.344px;
gap: 16px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| column/nowrap | 7x |
| row/nowrap | 60x |
| row/wrap | 2x |
| column-reverse/nowrap | 1x |

**Gap values:** `12px`, `16px`, `4px`, `8px`, `9px`

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 4 passing, 0 failing color pairs

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#ffffff` | `#4f46e5` | 6.29:1 | AA |
| `#1f2937` | `#f3f4f6` | 13.34:1 | AAA |
| `#ffffff` | `#444444` | 9.74:1 | AAA |
| `#3d3d41` | `#f9f9f9` | 10.27:1 | AAA |

## Design System Score

**Overall: 91/100 (Grade: A)**

| Category | Score |
|----------|-------|
| Color Discipline | 100/100 |
| Typography Consistency | 80/100 |
| Spacing System | 100/100 |
| Shadow Consistency | 100/100 |
| Border Radius Consistency | 100/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Tight, disciplined color palette, Well-defined spacing scale, Clean elevation system, Consistent border radii, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- 244 !important rules — prefer specificity over overrides
- 92% of CSS is unused — consider purging
- 4021 duplicate CSS declarations

## Z-Index Map

**3 unique z-index values** across 2 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| modal | 9999,9999 | ol.f.i.x.e.d. .t.o.p.-.0. .z.-.[.9.9.9.9.]. .f.l.e.x. .m.a.x.-.h.-.s.c.r.e.e.n. .w.-.f.u.l.l. .f.l.e.x.-.c.o.l.-.r.e.v.e.r.s.e. .p.-.4. .r.i.g.h.t.-.0. .m.d.:.m.a.x.-.w.-.[.4.2.0.p.x.] |
| sticky | 10,50 | div.r.e.l.a.t.i.v.e. .z.-.1.0. .f.l.e.x.-.s.h.r.i.n.k.-.0. .b.g.-.s.u.r.f.a.c.e.-.s.e.c.o.n.d.a.r.y. .p.x.-.2. .d.a.r.k.:.b.g.-.s.u.r.f.a.c.e.-.m.a.i.n.-.b.a.c.k.g.r.o.u.n.d.-.2, div.f.i.x.e.d. .t.o.p.-.0. .l.e.f.t.-.0. .r.i.g.h.t.-.0. .z.-.5.0. .b.g.-.[.#.E.4.2.0.2.4.]. .t.e.x.t.-.w.h.i.t.e. .s.h.a.d.o.w.-.l.g. .a.n.i.m.a.t.e.-.f.a.d.e.-.i.n.-.d.o.w.n. .h.-.1.4 |

## SVG Icons

**19 unique SVG icons** detected. Dominant style: **outlined**.

| Size Class | Count |
|------------|-------|
| xs | 3 |
| sm | 7 |
| md | 9 |

**Icon colors:** `currentColor`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| Inter | self-hosted | 100 900 | normal |
| Lora | self-hosted | 400, 500, 600, 700 | normal |

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| thumbnail | 1 | objectFit: fill, borderRadius: 0px, shape: square |

**Aspect ratios:** 4:1 (1x)

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Google Sans Flex` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `uiextractor-tokens.json` for tooling integration
