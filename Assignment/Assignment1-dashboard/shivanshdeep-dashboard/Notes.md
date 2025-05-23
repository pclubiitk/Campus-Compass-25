# Notes

## Ch1 

- pnpm-package manager it's faster and more efficient that npm or yarn
- to run local host: pnpm dev

## Ch2

- Tailwind: A CSS framework that really helpful in quickly writing utility classes.
Elements are styled by adding class names.
- CSS Modules: Allow to scope CSS to a particular element by using unique class names.
- clsx Library: Pretty useful library which basically helps to conditionally apply styling.
Used when you want 2 different styles for an element for it's 2 states.
`Syntax:` 
```
 <tag className={clsx(baseclass, {style1:flag === trueValue, style1:flag === falseValue}, )} >
```

## Ch3

- Optimisation is very important because it improves performance of site.

### FONT:
import like this
```
import { fontName } from 'next/font/google';
export const inter = Inter({ subsets: ['latin'] });
```
use like this:
```
<tag className={`${fontName.className}`}>
```

### IMAGES:
First import like above: 
```
import Image from 'next/image';
```
then use the `<Image>` component

## Ch4
- Next.js uses a pretty nice file-system routing, meaning the folders are used to create nested routes.
Each folder represents a route segment
- Separate UIs can be made for each route by using `layout.tsx` and `page.tsx` files.
- By using `layout.tsx` as a top level file, we can have many `page.tsx` components under it, and swap them out as we want.

## Ch5
### `<Link>` Component

- Allows to link between pages. Client-side navigation.
```
import Image from 'next/image';
<Link 
        key=Name of link
        href=Actual Link
        >
```

`usePathname() hook:`Use this to get the user's current path.
```
import { usePathname } from 'next/navigation';
```

## Ch6

- Deployment and Setting up Database

## Ch7

### APIs:
- We use them when using third-party that provide an API.
- When we're fetching data from client and don't want to expose the database secrets.

### React Server Components:

- These run on server, expensive data fetches can be kept server-side
- cuz of this we don't have to have an additional API layer.

- We use an `async` server component. With this we use `await` to fetch data

#### Request Waterfalls:
- A "waterfall" refers to a sequence of network requests that depend on the completion of previous requests. In the case of data fetching, each request can only begin once the previous request has returned data.
- A common way to avoid these is Parallel Data Fetching.

## Ch8

### Static vs Dynamic Rendering:

- With static rendering, data fetching and rendering happens on the server at build time (when you deploy) or when revalidating data.
  - This doesn't reflect any latest data change, which might nt be something that we want.
- With dynamic rendering, content is rendered on the server for each user at request time (when the user visits the page).


## Ch9

### Streaming?

- Streaming is a data transfer technique that allows you to break down a route into smaller "chunks" and progressively stream them from the server to the client as they become ready. 
- 2 ways to make this:
  
  - at page level, using loading.tsx
    
    - Essentially use skeletons as fallback until elements are loaded.
  - at component level, using `<Suspense>`

    - Wrap each skeleton in `<Suspense>`.
