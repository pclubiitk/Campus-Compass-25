### Common Imports from `next/`

| Import | Description |
|--------|-------------|
| `next/navigation` | Client-side navigation hooks (e.g., `usePathname`, `useRouter`, `useSearchParams`) |
| `next/head` | Modify the `<head>` section (e.g., `<title>`, `<meta>`) in your pages |
| `next/image` | Optimized `<Image />` component for automatic resizing, lazy loading, etc. |
| `next/link` | Used for internal navigation (replaces `<a href>` for better performance) |
| `next/font` | Load and manage Google Fonts (like Lusitana) efficiently |
| `next/script` | Load external scripts with control over when/how they load |


### Chapter 2 (Styling) : 

---

#### 1. Tailwind CSS

For quickly building like UI elements within the html tags itself.

```tsx
<p className="text-gray-800 text-xl md:text-3xl md:leading-normal">
  Welcome to the dashboard!
</p>
```

---

#### 2. CSS Modules

These are component scoped. You have to make like .module.css files and then put code in them then link them back to the components in the href tags. Similar to tailwind its just local to each component. 

##### `Button.module.css`
```css
.button {
  background-color: #1d4ed8;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
}
```

##### Use in component:
```tsx
import styles from './Button.module.css';

<button className={styles.button}>Click me</button>
```


#### 3. clsx

Mostly used for like dynamic elements which change during runtime. For example a button with paid and pending having different colours.


### Chapter 4-5:
So for creating nested pages, you can nest folders and then use different page.tsx's files inside each.

Then to link them to perform client side navigation (just change url and not have server reload again) use next/link. and then the <Link></Link> component.

To get user's URL you can use usePathName() which is a react hook (Client component). 

### Chapter 7:
Seeding: Populating database with initial values. 

APIs : For like accessing databases we can either use an API layer which is used when we want to reveal data/get data from client. In that case we want like an extra layer so that we don't reveal our secrets. 

Queries : For getting data from the db we use queries. If we want to fetch server-side data we just directly use queries which are coded using SQL ( for relational dbs like Postgre). If we want to fetch client-side data we use API layer. 