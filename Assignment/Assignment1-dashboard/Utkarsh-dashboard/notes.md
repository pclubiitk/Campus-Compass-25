## Ch 1
- Can use pnpm dev to start the dev server quickly and  to run the website locally
-pnpm is preferred over npm for better speed and efficiency.


## Ch 2
- Tailwind CSS helps add styles quickly using class names in HTML and CSS Modules are used to keep styles private to each component
- `clsx` is useful when I want to change styles based on a condition
- Global CSS file needs to be added in `layout.tsx`


## Ch 3 
- `next/font` loads Google Fonts in a better way
- I can use more than one font and change them using class names.
- `<Image />` is better than normal `<img>` — it loads faster and works better on all devices.

## Ch 4 & 5
- `<Link />` is used to move between pages without reloading the site.
- `usePathname()` helps check which page I'm on — useful for showing active links.
- Layouts help keep parts like sidebar or navbar across many pages.


## Ch 6
- Learned how to write SQL to get data from the database.
- Can join two tables using `JOIN` and used `WHERE` to filter data 
- Seeding gives me fake data so I can test these queries.
-Set up a Vercel account and link your GitHub repo for instant previews and deployments

## Ch 7 
- API routes are used to send data to client safely
- Server components can fetch data directly using async/await
- Request waterfalls are slow so it is better to fetch multiple things using    Promise.all().
- It's safer and faster to fetch data on the server than in the browser.


## Ch 8
- Static pages are built once are fast but not updated live.
- Dynamic pages are created every time and it is good for live or personal data.
- I can test slow loading by adding `setTimeout()`.


## Ch 9
- Streaming lets parts of the page show up while others are still loading.
- `loading.tsx` shows a loading message or spinner automatically.
- `<Suspense>` + skeleton UI makes loading feel smooth.
- Grouping components helps decide what should load first.
- It's better to add `Suspense` around the exact component that needs data.
