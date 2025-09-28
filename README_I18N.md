# Internationalization (i18n) Guide

This project implements first-class Tamil (ta-IN) localization alongside English using next-intl.

## 🌍 Supported Locales

- **English (en)** - Default locale
- **Tamil (ta)** - தமிழ் localization with proper font support

## 🏗️ Architecture

### Routing Structure

```
/en/           # English routes
/ta/           # Tamil routes (தமிழ்)
/              # Redirects to default locale based on detection
```

### File Structure

```
├── i18n/
│   ├── routing.ts     # Locale routing configuration
│   └── request.ts     # Message loading configuration
├── locales/
│   ├── en/
│   │   └── common.json    # English translations
│   └── ta/
│       └── common.json    # Tamil translations
├── middleware.ts      # Locale detection and routing
└── src/
    ├── app/[locale]/  # Internationalized pages
    ├── components/
    │   └── LanguageSwitcher.tsx  # Language toggle component
    └── lib/
        └── intl.ts    # Number/date formatting utilities
```

## 🔧 Usage

### Adding New Translation Keys

1. **Add to English locale** (`locales/en/common.json`):

```json
{
  "newSection.title": "New Feature",
  "newSection.description": "This is a new feature description"
}
```

2. **Add Tamil translation** (`locales/ta/common.json`):

```json
{
  "newSection.title": "புதிய அம்சம்",
  "newSection.description": "இது ஒரு புதிய அம்சத்தின் விளக்கம்"
}
```

### Using Translations in Components

```tsx
import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations();

  return (
    <div>
      <h1>{t("newSection.title")}</h1>
      <p>{t("newSection.description")}</p>
    </div>
  );
}
```

### Server Components

```tsx
import { getTranslations } from "next-intl/server";

export default async function ServerComponent() {
  const t = await getTranslations();

  return <h1>{t("hero.title")}</h1>;
}
```

## 🔢 Number and Date Formatting

Use the utilities in `src/lib/intl.ts` for locale-aware formatting:

```tsx
import { formatNumber, formatCurrency, formatDate } from "@/lib/intl";
import { useLocale } from "next-intl";

export function FormattingExample() {
  const locale = useLocale();

  return (
    <div>
      <p>Number: {formatNumber(123456.789, locale)}</p>
      <p>Currency: {formatCurrency(50000, locale)}</p>
      <p>Date: {formatDate(new Date(), locale)}</p>
    </div>
  );
}
```

### Available Formatting Functions

- `formatNumber(num, locale, options?)` - Format numbers with locale-specific separators
- `formatCurrency(amount, locale, currency?)` - Format currency (default: INR)
- `formatDate(date, locale, options?)` - Format dates with locale-specific patterns
- `formatRelativeTime(date, locale, baseDate?)` - Relative time (e.g., "2 days ago")
- `formatPercentage(value, locale, options?)` - Format percentages
- `formatDuration(seconds, locale)` - Format time durations
- `formatFileSize(bytes, locale)` - Format file sizes

## 🎨 Typography & Fonts

### Tamil Font Support

- **Primary**: Noto Sans Tamil (Google Fonts)
- **Fallback**: System fonts with proper Tamil glyph support
- **CSS Classes**: `.font-tamil` for Tamil-specific styling

### Font Loading

```css
/* Automatic font loading in globals.css */
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap");

/* Tamil-specific styling */
[lang="ta"] {
  font-family: "Noto Sans Tamil", "Noto Sans", system-ui, ...;
  line-height: 1.6;
}
```

## 🔄 Language Switching

### Components Available

1. **SimpleLanguageSwitcher** - Minimal toggle for headers
2. **LanguageSwitcher** - Full dropdown with language names

### Usage

```tsx
import { SimpleLanguageSwitcher } from "@/components/LanguageSwitcher";

// In header/nav
<SimpleLanguageSwitcher />;
```

### Persistence

Language preference is automatically saved to cookies (`NEXT_LOCALE`) for 180 days.

## 🌐 Locale Detection Priority

1. **URL path** (`/ta/page` or `/en/page`)
2. **Cookie** (`NEXT_LOCALE`)
3. **Browser language** (`navigator.language` / `Accept-Language`)
4. **Default fallback** (English)

## 🔍 SEO & Accessibility

### Automatic hreflang Generation

```html
<link rel="alternate" hreflang="en" href="/en" />
<link rel="alternate" hreflang="ta" href="/ta" />
<link rel="alternate" hreflang="x-default" href="/en" />
```

### HTML Lang Attribute

Automatically set based on current locale:

```html
<html lang="en">
  <!-- or lang="ta" -->
</html>
```

### Accessibility Features

- Language switcher has proper `aria-pressed` and `aria-label` attributes
- Screen reader friendly language indicators
- Proper focus management during language switching

## 🚀 Development Workflow

### Adding New Pages

1. Create page in `src/app/[locale]/new-page/page.tsx`
2. Use `useTranslations()` for client components
3. Use `getTranslations()` for server components
4. Add required translation keys to both locale files

### Testing Locales

1. **Development**: Visit `http://localhost:3000/ta` or `http://localhost:3000/en`
2. **Language Toggle**: Use the switcher in the header
3. **Browser Settings**: Change browser language to test detection

### Building for Production

```bash
npm run build
npm run start
```

The build process automatically validates translation keys and optimizes locale bundles.

## 📝 Translation Guidelines

### Key Naming Convention

```
section.element.variant
```

Examples:

- `nav.home` - Navigation home link
- `hero.title` - Main hero title
- `form.firstName` - Form field label
- `auth.login` - Authentication login button

### Tamil Translation Best Practices

1. **Use proper Tamil script** - Avoid Tanglish
2. **Maintain context** - Consider cultural appropriateness
3. **Keep consistency** - Use same terms for same concepts
4. **Test rendering** - Verify Tamil text displays correctly
5. **Length considerations** - Tamil text may be longer/shorter than English

### Common Tamil Terms

- Home: முகப்பு
- About: எங்களைப் பற்றி
- Login: உள்நுழைவு
- Register: பதிவு
- Dashboard: டாஷ்போர்டு
- Profile: சுயவிவரம்
- Apply: விண்ணப்பிக்கவும்

## 🐛 Troubleshooting

### Common Issues

1. **Missing translations**: Check console for missing key warnings
2. **Font not loading**: Verify Google Fonts URL and CSS imports
3. **Locale not detected**: Clear cookies and test detection flow
4. **Build errors**: Ensure all translation keys exist in both locales

### Debug Mode

Set `NODE_ENV=development` to see detailed i18n logs and warnings.

## 🔧 Configuration Files

### `middleware.ts`

Handles automatic locale detection and URL rewriting.

### `i18n/routing.ts`

Defines supported locales and routing configuration.

### `i18n/request.ts`

Configures message loading and validation.

### `next.config.ts`

Integrates next-intl plugin with Next.js configuration.

---

## 📚 Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Tamil Unicode Guide](https://unicode.org/charts/PDF/U0B80.pdf)
- [Noto Sans Tamil Font](https://fonts.google.com/noto/specimen/Noto+Sans+Tamil)
- [Intl API Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)

For questions or issues, refer to the project documentation or create an issue in the repository.
