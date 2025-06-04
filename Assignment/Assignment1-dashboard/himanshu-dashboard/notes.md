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

then the site will slow down and won't show anything until all data is fetched this is the **slow data fetch**.
With dynamic rendering, your application is only as fast as your slowest data fetch.

## Chapter 9

1. **Streaming** is a data transfer technique which breaks down route into smaller parts and stream from server to client as it becomes ready.
2. Streaming can be applied using `loading.tsx` at page level and `<Suspense>` at component level.
   - In `/app/dashboard` create `loading.tsx`.
3. A **loading skeleton** is a simplified version of the UI. Any UI in `loading.tsx` is a static file which is sent first then the dynamic content.
   - This can be done by importing `import DashboardSkeleton from '@/app/ui/skeletons';` and returning `return <DashboardSkeleton />;` in `loading.tsx`
   - Since `loading.tsx` is a level higher than `/invoices/page.tsx` and `/customers/page.tsx` in the file system, it's also applied to those pages.
   - To refrain from this create a new folder `/(overview)` inside dashboard and move `loading.tsk` and `page.tsk` in it.
   - Using routing groups () `/dashboard/(overview)/page.tsx` becomes `/dashboard` hence `loading.tsx` applies only to dashboard overview.
4. Till now we are streaming whole page to stream specific components use **React Suspense**
   - We can suspense `fetchRevenue()` as this is the only request slowing the page so we will strean just this and show rest of the UI.
   - To do this remove `fetchRevenue` from import and this line `const revenue = await fetchRevenue()`. Import `RevenueChartSkeleton` and `Suspense`from `/app/ui/skeletons` and `react` respectively. Also return the `suspense`.
   ```
   import { Suspense } from 'react';
   import { RevenueChartSkeleton } from '@/app/ui/skeletons';
   ...
   <Suspense fallback={<RevenueChartSkeleton />}>
      <RevenueChart />
   </Suspense>
   ```
   in `page.tsx`
   - Then update the `<RevenueChart>` component by adding import of `fetchRevenue` and adding async to the component definition and fetch the data inside the component.
   ```
   import { fetchRevenue } from '@/app/lib/data';
   ...
   export default async function RevenueChart() {
      const revenue = await fetchRevenue();
   ...
   ```
   - Similarly the process is to be repeated for `LatestInvoices`
5. Now to apply the same in Cards it could lead to _popping effect_ so to tackle this problem:
   - In `page.tsx`,
     - Delete your `<Card>` components.
     - Delete the `fetchCardData()` function.
     - Import a new wrapper component called `<CardWrapper />`.
     - Import a new skeleton component called `<CardsSkeleton />`.
     - Wrap `<CardWrapper />` in Suspense.
   - In `/app/ui/dashboard/cards.tsx`,
     - Import `fetchCardData` as `import { fetchCardData } from '@/app/lib/data';`
     - Invoke it inside `<CardWrapper/>` as
     ```
     const {
        numberOfInvoices,
        numberOfCustomers,
        totalPaidInvoices,
        totalPendingInvoices,
     } = await fetchCardData();
     ```
     - This could be used when multiple components are to be loaded at the same time.

## Chapter 10

1. **Partial Prerendering (PPR)** is the combination of static, dynamic rendering and streaming.
2. PPR is only available with the Next.js canary releases and it is an experimental feature so we have to install it using `pnpm install next@canary`
3. To enable PPR, add `ppr` in `next.config.ts` as

```
experimental: {
   ppr: 'incremental'
}
```

The incremental value allows to adopt PPR for specific routes.
Then add `experimental_ppr` in `/app/dashboard/layout.tsx` as `export const experimental_ppr = true;`

## Chapter 11

1. Here, we will move to `/invoices` place.
2. Let's make `/dashboard/invoices/page.tsx` with the code. It contains `<Search/>`, `<Pagination/>` and `<Table/>`.
3. The hooks used to add search functionality are:
   - `useSearchParams` allows current URL parameter access.
   - `usePathname` lets us to read the URL pathname.
   - `useRouter` enables navigation between routes within client components.
4. To implement this
   - In `/app/ui/search.tsx` go to `<Search>` and here `"use client"` signifies it as a client component and `<input>` is the search input.
   - Create new `handleSearch` function and add `onChange` to the `<input>` as
   ```
   function handleSearch(term: string) {
    console.log(term);
   }
   ...
   onChange={(e) => {
      handleSearch(e.target.value);
   }}
   ```
   - Update the URL with search params by importing `useSearchParams` hook from `next/navigation` and assign variable as
   ```
   import { useSearchParams } from 'next/navigation';
   ...
   const searchParams = useSearchParams();
   ```
   - Inside `handleSearch`, create `URLSearchParams` instance, which manipulates URL query parameters with methods, using `searchParams` variable as `const params = new URLSearchParams(searchParams);`
   - `set` the params string based on the user’s input. If the input is empty, you want to `delete` it as
   ```
   if (term) {
      params.set('query', term);
   } else {
      params.delete('query');
   }
   ```
   - Now `useRouter` and `usePathname` can be used. Import `useRouter` and `usePathname` from '`next/navigation`', and use the `replace` method from `useRouter()` inside `handleSearch` as
   ```
   import { useSearchParams, usePathname, useRouter } from 'next/navigation';
   ...
   const pathname = usePathname();
   const { replace } = useRouter();
   ...
   replace(`${pathname}?${params.toString()}`);
   ```
   Here, `$(pathname)` is the current path. `params.toString()` translates the input iinto URL friendly format. `replace(${pathname}?${params.toString()})` updates the URL with the user's search data.
   - To keep input and URL in sync pass a `defaultValue` to input by reading from `searchParams` as `defaultValue={searchParams.get('query')?.toString()}`
   - Now to update the table accept a prop called `searchParams` as
   ```
   export default async function Page(props: {
   searchParams?: Promise<{
      query?: string;
      page?: string;
   }>;
   }) {
   const searchParams = await props.searchParams;
   const query = searchParams?.query || '';
   const currentPage = Number(searchParams?.page) || 1;
   ...
   <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
      <Table query={query} currentPage={currentPage} />
   </Suspense>
   ```
   Navigating to the `<Table>` component we find two props `query` and `currentPage` passed to the `fetchFilteredInvoices()` functions returns invoices matching query.
   \_if you want to read the params from the client, use the `useSearchParams()` hook as this avoids having to go back to the server else use `searchParams`.
   - **Debouncing**:
     - In `handleSearch` add `console.log('Searching... ${term}');` this will update the URL on each stroke.
     - Debouncing limits the rate at which a function can fire.
     - To apply debounce we will use `use-debounce` library:
       - Install `use-debounce` as `pnpm i use-debounce`
       - In `<Search>` Component, import a function called `useDebouncedCallback` as
       ```
       import { useDebouncedCallback } from 'use-debounce';
       ...
       const handleSearch = useDebouncedCallback((term) => {
       ...
       }, 300);
       ```
       the code will run only after user stopped typing (300ms)
       The no. of requests is reduced.
5. Adding **pagination** allows users to navigate through the different pages to view all the invoices.

   - In `/app/dashboard/invoices/page.tsx`, import a new function called `fetchInvoicesPages` and pass the query from `searchParams` as an argument as

   ```
   import { fetchInvoicesPages } from '@/app/lib/data';
   ...
   const totalPages = await fetchInvoicesPages(query);
   ```

   - Drop `totalPages` prop to `<Pagination/>` as `<Pagination totalPages={totalPages} />`

   - In `/app/ui/invoices/pagination.tsx`
     ```
     import { usePathname, useSearchParams } from 'next/navigation';
     ...
     const pathname = usePathname();
     const searchParams = useSearchParams();
     const currentPage = Number(searchParams.get('page')) || 1;
     const allPages = generatePagination(currentPage, totalPages);
     ```
   - Create a new function called `createPageURL` as
     ```
     const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
     };
     ```
   - Finally, for user's new inut to reset the Page to update `handleSearch` as `params.set('page', '1');`

## Chapter 12

1. **React Server Actions** allow you to run asynchronous code directly on the server.
2. Use the action attribute in the `<form>` element to invoke actions.
3. Now, we are going to create an invoice like form and to do so:
   - Create a new route and form by add a new route `/create` inside `/invoices` with a `page.tsx`.
   - Navigating to the `<Form>` component we see `<select>` dropdown element with a list of customers, `<input>` element for amount with `type="number"`, `<input>` elements for status with `type="radio"` and button with `type="submit"` (To see changes go to http://localhost:3000/dashboard/invoices/create)
4. Now, we create a server action which going to be called when the form is submitted.
   - In `lib/` create `action.ts`, write `use server` at the top.
   - In the same file create `export async function createInvoice(formData: FormData) {}` which accepts `formData`.
   - Then, in `<Form>` component (`app/ui/invoices/create-form.tsx`) import `import { createInvoice } from '@/app/lib/actions';` and add `action` attribute to the `<form>` and call `crateInvoice` (`<form action={createInvoice}>`)
5. Now, to extract data from `formData` we can use `.get(name)` method.
   After submitting, you should see the data you just entered into the form logged in your terminal (not the browser).
6. Now to validate and prepare data for database,

   - We will use Zod library for validation of the data and to do so,

     - In `action.ts` import Zod and define schema

     ```
     import { z } from 'zod';

     const FormSchema = z.object({
     id: z.string(),
     customerId: z.string(),
     amount: z.coerce.number(),
     status: z.enum(['pending', 'paid']),
     date: z.string(),
     });

     const CreateInvoice = FormSchema.omit({ id: true, date: true });
     ```

     - Pass your `rawFormData` to `CreateInvoice` to validate the types as `const { customerId, amount, status } = CreateInvoice.parse({`
     - For greater accuracy we will store values in cents rather than dollars. (removing float errors) as `const amountInCents = amount * 100;`
     - Now create a new date for invoice creation as `const date = new Date().toISOString().split('T')[0];` (Format: YYYY-MM-DD)

7. Now, finally add all the data to database,
   - In `/app/lib/actions.ts` import `import postgres from 'postgres';` and in `createInvoice`
   ```
   const date = new Date().toISOString().split('T')[0];

   await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
   ```
   No error handling at this point.
8. Now, to trigger a new request we clear the cache and add new request by `revalidatePath`

```
import { revalidatePath } from 'next/cache';
...
revalidatePath('/dashboard/invoices');
```

Noq the path will be revalidated and fresh data will be fetched and we need to redirect the user back to /`dashboard/invoices`

- For this we need `redirect` function

```
import { redirect } from 'next/navigation';
...
redirect('/dashboard/invoices');
```

9. Updating invoice is similar to creating invoice form we just need to pass the id, to do so,

   - Create Dynamic Route Segment with invoice id,i.e., in `/invoices` folder create new dynamic route `[id]` inside it a route `edit` and inside it `page.tsx`.
   - In `<Table>` component there's `<UpdateINvoice />` which receives `id`.
   - Navigate to `<UpdateInvoice />` and update `href` of `Link` to accept `id` as `href={'/dashboard/invoices/${id}/edit'}`
   - Back to `<Page>` component paste the same code as create form except it imports `edit-form.tsx`
   - The page component also accepts `params` as

   ```
   export default async function Page(props: { params: Promise<{ id: string }> }) {
   const params = await props.params;
   ```

   - To fetch specific invoice import `fetchInvoiceById` and pass `id` as argument and import `fetchCustomers` to fetch customer names.
     Use `Promise.all` to fetch both as

   ```
   import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
   ...
   const [invoice, customers] = await Promise.all([
      fetchInvoiceById(id),
      fetchCustomers(),
   ]);
   ```

   - We can't pass `id` as an argument so we use JS `bind` to encode and send values to server action as

   ```
   import { updateInvoice } from '@/app/lib/actions';
   ...
   const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);

   return <form action={updateInvoiceWithId}>{/* ... */}</form>;
   ```

   - Now in `action.ts` we create `updateInvoice` as

   ```
   // Use Zod to update the expected types
   const UpdateInvoice = FormSchema.omit({ id: true, date: true });

   // ...

   export async function updateInvoice(id: string, formData: FormData) {
   const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
   });

   const amountInCents = amount * 100;

   await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
   `;

   revalidatePath('/dashboard/invoices');
   redirect('/dashboard/invoices');
   }
   ```

   Similar to `createInvoice` we perform similar things here.

10. To delete an invoice wrap the `delete` button in a `<form>` element and pass the id to the Server Action using `bind` as

```
import { deleteInvoice } from '@/app/lib/actions';
...
const deleteInvoiceWithId = deleteInvoice.bind(null, id);

return (
   const deleteInvoiceWithId = deleteInvoice.bind(null, id);
   ...
)
```

- Now, inside `action.ts` create `deleteInvoice` as

```
export async function deleteInvoice(id: string) {
   await sql`DELETE FROM invoices WHERE id = ${id}`;
   revalidatePath('/dashboard/invoices');
}
```

Calling `revalidatePath` will trigger new server request.

## Chapter 13

1. We will use JS `try/catch` to handle errors like

```
try {
   await sql`
   INSERT INTO invoices (customer_id, amount, status, date)
   VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
   `;
} catch (error) {
   // We'll log the error to the console for now
   console.error(error);
}
```

_redirect works by throwiing an error_
_To throw an error use `throw new Error("Error Message")`_ 2. `error.tsx` can be used to catch all errors. Create it inside `/dashboard/invoices` and this is the code

```
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}
```

3. Now, to handle 404 erros we use `notFound` to handle errors of searching something which doesn't exist.
   To confirm the not found resource go to `fetchInvoiceById` in `data.ts` console log the returned `invoice`
   - To us `notFound` go to `/dashboard/invoices/[id]/edit/page.tsx` and import
     `import { notFound } from 'next/navigation';`
     and add in `Page()
   ```
   if (!invoice) {
      notFound();
   }
   ```
   - To show error UI create `not-found.tsx` inside `/edit` and paste this code
   ```
   import Link from 'next/link';
   import { FaceFrownIcon } from '@heroicons/react/24/outline';

   export default function NotFound() {
   return (
      <main className="flex h-full flex-col items-center justify-center gap-2">
         <FaceFrownIcon className="w-10 text-gray-400" />
         <h2 className="text-xl font-semibold">404 Not Found</h2>
         <p>Could not find the requested invoice.</p>
         <Link
         href="/dashboard/invoices"
         className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
         >
         Go Back
         </Link>
      </main>
   );
   }
   ```

## Chapter 14

1.  Here, we will show form errors using `useActionState` hook, keeping accessibility (Accessibility refers to designing and implementing web applications that everyone can use, including those with disabilities.)
2.  Next.js includes the `eslint-plugin-jsx-a11y` plugin in its ESLint config to help catch accessibility issues early.
    - To try this out, add `next lint` as a script in your `package.json` file.
    - Run `pnpm lint` in terminal.
    - If the `<Image>` doesn't contain an `alt` then it will show a warning.
3.  To improve form accessibility,
    - Using **Semantic HTML** like `<input>, <option>` instead of `<div>` uses accessibility tech.
    - Using **Labelling** with `<label>` and `htmlFor` gives descriptive tect for each form.
    - By **Focussing Outline** it can provide properly styles fields in focus.
4.  If submitting an empty form, it will get an error,
    to prevent it,
    - **Client-Side Validation** can be done by adding `required` at the end of the `<input>` and `<select>`. Now it will generate a warning,
    - **Server-Side Validation** reduces the risk of malicious users being on server side. To do this, go to `create-form.tsx` and import `import { useActionState } from 'react';` and conver the file to client side by `"use client"`.
      `useActionState` takes `(action, initialState)` and returns `[state, formAction]`.
      Pass your createInvoice action as an argument of `useActionState`, and inside your `<form action={}>` attribute, call `formAction` as
    ```
    const [state, formAction] = useActionState(createInvoice, initialState);

    return <form action={formAction}>...</form>;
    ```
    The `initialState` can be anything so we create like this
    ```
    import { createInvoice, State } from '@/app/lib/actions';
    ...
    const initialState: State = { message: null, errors: {} };
    ```
    `State` does not exist we will create it.
    - Now, let's update the server action,
      - In `action.ts` use Zod and update `FormSchema`
      ```
      const FormSchema = z.object({
         id: z.string(),
         customerId: z.string({
            invalid_type_error: 'Please select a customer.',
         }),
         amount: z.coerce
            .number()
            .gt(0, { message: 'Please enter an amount greater than $0.' }),
         status: z.enum(['pending', 'paid'], {
            invalid_type_error: 'Please select an invoice status.',
         }),
         date: z.string(),
      });
      ```
          * Zod throws error if `customerId` is empty.
          * The default `amount` will be zero if string is empty.
          * Zod throws error if `status` is empty.
          To add a friendly message for empty status,
             * Update `createInvoice` to accept two arguments `prevState` and `formData` in `actions.ts`
             ```
             export type State = {
                errors?: {
                   customerId?: string[];
                   amount?: string[];
                   status?: string[];
                };
                message?: string | null;
             };

             export async function createInvoice(prevState: State, formData: FormData) {
             // ...
             }
             ```
             `formData` is same and `prevState` contains state.
             * Now, change the Zod `parse()` to `safeParse()` which will handle validation more gracefully.
             * Check whether the fields were validated correctly with a conditional by
             ```
             if (!validatedFields.success) {
                return {
                   errors: validatedFields.error.flatten().fieldErrors,
                   message: 'Missing Fields. Failed to Create Invoice.',
                };
             }
             ```
5.  Now to display the errors in form component go to `create-form.tsx` (To access errors use form `state`).
    Add ternary operator to check for specific errors, e.g. for customer's fields
    In `<select>`

```
aria-describedby="customer-error"
```

This establishes a relation between select and error message.

```
<div id="customer-error" aria-live="polite" aria-atomic="true">
   {state.errors?.customerId &&
      state.errors.customerId.map((error: string) => (
      <p className="mt-2 text-sm text-red-500" key={error}>
         {error}
      </p>
      ))}
</div>
```

The id attribute uniquely identifies the HTML element of error messages.
The screen reader `aria-live="polite"` will announce the changes only when the user is idle.
Similarly add validation on others as well including `edit-form.tsx`.

## Chapter 15

1. **Authentication** is a key part of many web applications today. It's how a system checks if the user is who they say they are.
2. **Authorization** decides what parts of the application users are allowed to use.
3. Start by creating `/login` route in `/app` and creating `page.tsx` in it and add

```
import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
```

4. We will use NextAuth.js to add authentication.
   - Install NextAuth.js by `pnpm i next-auth@beta`
   - Now generate a secret key by
   ```
   # macOS
   openssl rand -base64 32
   # Windows can use https://generate-secret.vercel.app/32
   ```
   - Now in `.env` file add the generated key to AUTH_SECRET variable as `AUTH_SECRET=your-secret-key`
   - For authorization to work in profuction update the environment variables in Vercel project too.
5. To add pages option,

   - Create an `auth.config.ts` file at the root of our project that exports an `authConfig` object by

   ```
   import type { NextAuthConfig } from 'next-auth';

   export const authConfig = {
      pages: {
         signIn: '/login',
      },
   } satisfies NextAuthConfig;
   ```

   `pages` option can be used to specify route for custom sign-in and error pages.

6. To prevent routes from users without login, with Next.js middleware,

   - In `/auth.config.ts` add

   ```
   callbacks: {
      authorized({ auth, request: { nextUrl } }) {
         const isLoggedIn = !!auth?.user;
         const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
         if (isOnDashboard) {
            if (isLoggedIn) return true;
            return false; // Redirect unauthenticated users to login page
         } else if (isLoggedIn) {
            return Response.redirect(new URL('/dashboard', nextUrl));
         }
         return true;
      },
   },
   providers: [], // Add providers with an empty array for now
   } satisfies NextAuthConfig;
   ```

   The `providers` option is an array where you list different login options.

   - Now import `authConfig` in root of project in `middleware.ts` and paste the code,

   ```
   import NextAuth from 'next-auth';
   import { authConfig } from './auth.config';

   export default NextAuth(authConfig).auth;

   export const config = {
      // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
      matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
   };
   ```

7. `Hashing` converts a password into a fixed-length string of characters, which appears random, providing a layer of security even if the user's data is exposed.

   - When seeding your database, you used a package called bcrypt to hash the user's password before storing it in the database.
   - Crate a new file `auth.ts` and paste

   ```
   import NextAuth from 'next-auth';
   import { authConfig } from './auth.config';

   export const { auth, signIn, signOut } = NextAuth({
      ...authConfig,
   });
   ```

8. Now we need to add the `providers` containing different login options.

   - In `/auth.ts` paste

   ```
   import Credentials from 'next-auth/providers/credentials';

   export const { auth, signIn, signOut } = NextAuth({
      ...authConfig,
      providers: [Credentials({})],
   });
   ```

9. To add sign in facility use `authorize` function and to validate email and password use `zod` as

```
import { z } from 'zod';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
      },
    }),
  ],
});
```

- After validation create new `gerUser` which queries the user as

```
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
try {
   const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
   return user[0];
} catch (error) {
   console.error('Failed to fetch user:', error);
   throw new Error('Failed to fetch user.');
}
}
...
         .safeParse(credentials);

      if (parsedCredentials.success) {
         const { email, password } = parsedCredentials.data; //in authorize
```

- Now call `bcrypt.compare` to check password match by

```
import postgres from 'postgres';
...
if (parsedCredentials.success) {
   const { email, password } = parsedCredentials.data;
   const user = await getUser(email);
   if (!user) return null;
   const passwordsMatch = await bcrypt.compare(password, user.password);

   if (passwordsMatch) return user;
}
```

10. Now connect auth logic with login form.

- In `actions.ts` create `authenticate`. This should import `signIn` function from `auth.ts`
- Finally in `login-form.tsx` use `useActionState` to call the server action by

```
'use client';
...
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
...
   const searchParams = useSearchParams();
const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
const [errorMessage, formAction, isPending] = useActionState(
   authenticate,
   undefined,
);

return (
   <form action={formAction} className="space-y-3">
...
<input type="hidden" name="redirectTo" value={callbackUrl} />
<Button className="mt-4 w-full" aria-disabled={isPending}>
   Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
</Button>
...
{errorMessage && (
   <>
      <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
      <p className="text-sm text-red-500">{errorMessage}</p>
   </>
   )}
```

11. Now, to add logout functionality to `<SideNav/>`, call the `signOut` function from `auth.ts` in your `<form>` element as

```
import { signOut } from '@/auth';
...
         action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
         }}
```

## Chapter 16

1. In web development, metadata provides additional details about a webpage not visible to users.
2. Metadata plays a significant role in enhancing a webpage's SEO, making it more accessible and understandable for search engines and social media platforms.
3. Types of metadata:
   - **Title Metadata** `<title>Page Title</title>`
   - **Description Metadata** `<meta name="description" content="A brief description of the page content." />`
   - **Keyword Metadata** `<meta name="keywords" content="keyword1, keyword2, keyword3" />`
   - **Open Graph Metadata**
   ```
   <meta property="og:title" content="Title Here" />
   <meta property="og:description" content="Description Here" />
   <meta property="og:image" content="image_url_here" />
   ```
   - **Favicon Metadata** `<link rel="icon" href="path/to/favicon.ico" />`
4. There are two ways to add metadata to the app:

   - **Config-based** Export a static `metadata` object or a dynamic `generateMetadata` function in a `layout.js` or `page.js` file.
   - **File-based** Next.js has a range of special files that are specifically used for metadata purposes

   - In `/public` folder there are two images `favicon.ico` and `opengraph-image.jpg`.
   - Move these images to root of `/app` folder.
   - Now both of these will be set automatically.

5. You can also include a metadata object from any layout.js or page.js file to add additional page information like title and description.

   - In `layout.tsx` add

   ```
   import { Metadata } from 'next';

   export const metadata: Metadata = {
      title: 'Acme Dashboard',
      description: 'The official Next.js Course Dashboard, built with App Router.',
      metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
   };
   ```

   Metadata will be added automatically.

   - To add custom metadata and title. In `/app/layout.tsx` add this

   ```
   import { Metadata } from 'next';

   export const metadata: Metadata = {
      title: {
         template: '%s | Acme Dashboard',
         default: 'Acme Dashboard',
      },
         description: 'The official Next.js Learn Dashboard built with App Router.',
         metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
      };
   ```

   The `%s` in the template will be replaced with the specific page title.
   Now, in `/dashboard/invoices` add page title as

   ```
   export const metadata: Metadata = {
      title: 'Invoices',
   };
   ```

   You can check now.

6. Now similarly we can add metadata for other as well like login page, dashboard page etc.
