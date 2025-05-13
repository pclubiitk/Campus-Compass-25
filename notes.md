## 📦 Common Imports from `next/`

| Import | Description |
|--------|-------------|
| `next/navigation` | Client-side navigation hooks (e.g., `usePathname`, `useRouter`, `useSearchParams`) |
| `next/head` | Modify the `<head>` section (e.g., `<title>`, `<meta>`) in your pages |
| `next/image` | Optimized `<Image />` component for automatic resizing, lazy loading, etc. |
| `next/link` | Used for internal navigation (replaces `<a href>` for better performance) |
| `next/font` | Load and manage Google Fonts (like Lusitana) efficiently |
| `next/script` | Load external scripts with control over when/how they load |


## 🎨 Styling in Next.js (App Router)

---

### 1. ✅ Tailwind CSS

For quickly building like UI elements within the html tags itself.

#### 📦 Setup (usually preconfigured in official templates):
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 🛠️ `tailwind.config.js` (important!)
```js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### 📁 `globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 🧪 Usage:
```tsx
<p className="text-gray-800 text-xl md:text-3xl md:leading-normal">
  Welcome to the dashboard!
</p>
```

---

### 2. 🎯 CSS Modules

These are component scoped. You have to make like .module.css files and then put code in them then link them back to the components in the href tags. Similar to tailwind its just local to each component. 

#### 📁 `Button.module.css`
```css
.button {
  background-color: #1d4ed8;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
}
```

#### 🧪 Use in component:
```tsx
import styles from './Button.module.css';

<button className={styles.button}>Click me</button>
```


### 3. 🧩 clsx

Mostly used for like dynamic elements which change during runtime. For example a button with paid and pending having different colours.


#### 🧪 Example:
```tsx
import clsx from 'clsx';
 
export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-sm',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'paid',
        },
      )}
    >
    // ...
)}
```




