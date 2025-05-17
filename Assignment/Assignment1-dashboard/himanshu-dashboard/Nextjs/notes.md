# Notes on Next.js

## Chapter 1

1. Using pnpm instead of npm is more effective.
2. Using 'npx create-next-app@latest nextjs-dashboard --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example" --use-pnpm' we can create a next js app.
3. In the nextjs-dashboard folder we can see:
   - **/app** containing all routes etc.
   - **/app/lib** containing all the functions to be used
   - **/app/ui** containing all UI components
   - **/public** containing images etc.
   - **config files** like next.config.js need not to be modified
4. **Placeholder data** are some data initially present in the lib as placeholder-data.ts in the form of tables.
5. Using typescript in most of the files is helpful has it helps if wrong data format is entered.
6. **Running development server**
   - To install packages run "pnpm i"
   - To start the server run "pnpm dev"
   - Open https://localhost:3000 in browser

## Chapter 2

1. To add **CSS Styles** on the webpage use **/app/ui/global.css**.
2. Add global styles to the app by importing global.css to /app/layout.tsx, the preview will change. (import '@/app/ui/global.css';)
3. The preview changed because in the global.css there were already some tailwind statements.
4. **Tailwind** is a CSS framework allowing quick usage of utility classes.
   - We can style using class names `<h1 className="text-blue-500">I'm blue!</h1>`
   - Example to add a black triangle write in /app/page.tsx
     `<div className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black" />`
5. To add the same shape using **CSS Module** add a new file in /app/ui called **home.module.css**, i.e.
   `.shape {
height: 0;
width: 0;
border-bottom: 30px solid black;
border-left: 20px solid transparent;
border-right: 20px solid transparent;
}`
   and import in the /app/page.tsx with "import styles from '@/app/ui/home.module.css';" same results will be obtained.
6. **clsx** is a library that lets us toggle class names easily.

   - Use "import clsx from 'clsx';" then add the code as
     `className={clsx(
'inline-flex items-center rounded-full px-2 py-1 text-sm',
{
'bg-gray-100 text-gray-500': status === 'pending',
'bg-green-500 text-white': status === 'paid',
},
)}`

7. Other styling options are Sass and CSS-in-JS.

## Chapter 3

1. Using fonts other than the system fonts requires rendering so Next.js automatically optimizes the fon when using next/font module.
2. To use custom fonts create a file in /app/ui/ called fonts.ts import Inter from google using
   `import { Inter } from 'next/font/google';`
   `export const inter = Inter({ subsets: ['latin'] });`
3. Now add the font in /app/layout.tsx by importing and adding in the body
   `import { inter } from '@/app/ui/fonts';`
   `<body className={'${inter.className} antialiased'}>{children}</body>`
   Here the tailwind **antialiased** is also used which smoothens the font
4. To add an image using HTML we need to optimise it so we use next/image to escape that
   - `<Image>` is a component which optimises image on its own.
   - In page.tsx import Image from next/image (`import Image from 'next/image';`) and add `<Image`
     `src="/hero-desktop.png"`
     `width={1000}`
     `height={760}`
     `className="hidden md:block"`
     `alt="Screenshots of the dashboard project showing desktop` `version"`
     `/>` (Image already present in public folder)
   - Here `hidden` class is used to remove image from DOM on mobile screens and `md:block` is to show image on desktop screens

## Chapter 4

1.  Next.js uses folder based nested routing.
2.  To create a dashboard page create a dashboard folder in /app and create a file page.tsx and add the code in it.
3.  Now going to http://localhost:3000/dashboard will give the new nested router.
4.  To create a layout for dashboard create layout.tsx in /dashboard and add the code

        ```
        import SideNav from '@/app/ui/dashboard/sidenav';

        export default function Layout({ children }: { children: React.ReactNode }) {
        return (
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
            </div>
        );
        }
        ```

    `SideNav` is a side navigation bar and `Layout` component receives children prop which can be either a page or another layout.
    One benefit of using layouts in Next.js is that on navigation, only the page components update while the layout won't re-render. This is called partial rendering.

- Added a ./app/fonts.js for the font.

5. A **RootLayout** is a function required in every Next.js app.

## Chapter 5

1. Here we optimize navigation as with regular html `<a>` tag the page refreshes fully everytime but we will use `<Link />` component for client side navigation with JS.
   - To do so open /app/dashboard/ui/dashboard/nav-links.tsx and there import links `import Link from 'next/link';` and replace `<a />` with `<Link />`
   - Now the page refreshes without full refresh.
2. Next.js **automatically code splits** your application by route segments while traditionally everything loads fully.
3. Next.js provides `usePathname()` hook to show active links.
   - Turn nav-links.tsx into a client component using react's `"use client"` at the top.
   - Import usePathname `import { usePathname } from 'next/navigation';`
   - Assign the path to a variable inside `<NavLinks />` component
   ```
   export default function NavLinks() {
       const pathname = usePathname();
       // ...
   }
   ```
   - Now we can apply `clsx` to display color text when the link is active by `import clsx from 'clsx';` and
   ```
   className={clsx(
       'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
       {
       'bg-sky-100 text-blue-600': pathname === link.href,
       },
   )}
   ```

## Chapter 6

1. Here, we will set up the database using PostgreSQL.
   - Next we deploy our repository in vercel. This will automatically redeploy our app with no configuration needed.
   - After deployment click Continue to Dashboard to create Postgres.
   - Choose the preferred server in storage tab (I choose Neon).
   - Connect to server and go to `.env.local`, click Show secret and copy snippet.
   - Navigate to your code editor and rename the .env.example file to .env. Paste in the copied contents from Vercel.
2. **Seed** means populating database with some initial data.
   - To do so run `pnpm run dev` in cmd and go to http://localhost:3000/seed to seed the database.
   - It will display the message "Database seeded successfully"
   - Data will be taken from `placeholder-data.ts`
3. To query the database we use Router Handler in `app/query/route.ts`.
   - A function `listInvoices()` is there uncomment it and remove `Response.json()` line saying to uncomment and replace it with the try block and go to http://localhost:3000/query.
   - Invoice amount and name is shown.

## Chapter 7

1. **APIs** are an intermediary layer between application code and database.
2. For full stack application writing logic to interact with database is necessary. But do not reveal secrets to the client (use react server components)
   - Using `async/await` we can avoid using `useState`, `useEffect` etc.
   - It doesn't need additional API and sends only result to the client doing fetches on server.
3. The query will be written using postgres.js library and SQL
   - Go to `/app/lib/data.ts` all the data queries are there.
   - `sql` can be called anywheere using
   ```
   import postgres from 'postgres';
   const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
   ```
4. Now we will fetch data for dashboard overview page
   - In `/app/dashboard/page.tsx` we will update the code in order to fetch data.
   ### `<RevenueChart/>`
   - In the code for `<RevenueChart/>` import `fetchRevenue` function from data.ts as `import { fetchRevenue } from '@/app/lib/data';` and add `const revenue = await fetchRevenue();` in the Page function.
   - Uncomment `<RevenueChart/>` and code insidde `/app/ui/dashboard/revenue-chart.tsx` and check localhost:3000.
   * Also import `fetchRevenue` as `import { fetchRevenue } from "@/app/lib/data";` and declare a variable in `Page()` as `const revenue = await fetchRevenue();` in `page.tsx` to fetch the data.
   ### `<LatestInvoices/>`
   - We will not fetch all data instead fetch latest 5 invoices from `data.ts` to do so
     - Import `fetchLatestInvoices` by `import { fetchRevenue, fetchLatestInvoices } from '@/app/lib/data';` and add `const latestInvoices = await fetchLatestInvoices();` in `Page()`
     - Similar to `<RevenueChart/>` uncomment `<LatestInvoices />` component and relevant code in `/app/ui/dashboard/latest-invoices`.
   ### `<Card/>`
   - If we use JS to display various cards we would have to go through the whole but using SQl we can do this easily as
   ```
   const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
   const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
   ```
   in `/app/lib/data.ts`
   - We will import `fetchCardData` function for this and do similar to other components.
5. We could face **request waterfalls**, i.e. network requests which depend on the completion of the previous request, like `fetchLatestInvoices()` could only start after `fetchRevenue()` stops.
6. Common way to avoid waterfalls is **parallel data fetching** which can be done using `Promise.all()` or `Promise.allSettled()` functions.

## Chapter 8

1. With **static rendering**, data fetching and rendering happens on the server at build time (when you deploy) or when revalidating data. Cached data could be used to make websites faster.
2. With **dynamic rendering**, content is rendered on the server for each user at request time (when the user visits the page).
3. In `/app/lib/data.ts` if we uncomment

```
console.log('Fetching revenue data...');
await new Promise((resolve) => setTimeout(resolve, 3000));
...
console.log('Data fetch completed after 3 seconds.');
```
