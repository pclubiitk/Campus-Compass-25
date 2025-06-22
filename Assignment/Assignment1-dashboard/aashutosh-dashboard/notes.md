Chapter 1 
explores the intro to installations required, the folder structure importance and the files in it. Intro to placeholder stat for populating the database with initial data. Typescript intro (too basic)

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

Running the development server using pnpm I then pnpm dev.

Chapter 2
explores 
How to add a global CSS file to your application.
Two different ways of styling: Tailwind and CSS modules.
How to conditionally add class names with the clsx utility package.
>/app/layout.tsx
import '@/app/ui/global.css';  
/*>@tailwind base;
@tailwind components;
@tailwind utilities;*/
  
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

>/app/page.ts
import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
 
export default function Page() {
  return (
    // These are Tailwind classes:
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
    // ...
  )
}
<div
  className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"
/>

> clsx library- toggle class names 
    >>import clsx from 'clsx';
 
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


Chapter 3
explores
How to add custom fonts with next/font.
How to add images with next/image.
How fonts and images are optimized in Next.js.

Next.js > next/font module , no additional network requests for fonts,pre downloaded during run time.

Primary Font 
import { Inter } from 'next/font/google';
export const inter = Inter({ subsets: ['latin'] });
Addition to CODE >>
>import { inter } from '@/app/ui/fonts';
 <body className={`${inter.className} antialiased`}>{children}</body>
Secondary Font
>CODE >>import { Inter, Lusitana } from 'next/font/google';
        export const lusitana = Lusitana({
          weight: ['400', '700'],
          subsets: ['latin'],
          });

import { lusitana } from '@/app/ui/fonts';
<p
      className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
    >

Image Optimization
>image addition using html
<img
  src="/hero.png"
  alt="Screenshots of the dashboard project showing desktop version"
/>
<Image> Component -extension of the HTML <img> tag
>> import Image from 'next/image';
 <Image
        src="/hero-desktop.png"
        width={1000}
        height={760}
        className="hidden md:block"
        alt="Screenshots of the dashboard project showing desktop version"
      />

Chapter 4
explores
Create the dashboard routes using file-system routing.
Understand the role of folders and files when creating new route segments.
Create a nested layout that can be shared between multiple dashboard pages.
Understand what colocation, partial rendering, and the root layout are.
>Creating the dashboard page 
>>export default function Page() {
  return <p>Dashboard Page</p>;
}
>Creating the dashboard Latout >> <SideNav />   
"PARTIAL RENEDERING"
>Root Layout-  To share UI across multiple pages.
>>CODE import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

Chapter 5
explores
How to use the next/link component.
How to show an active link with the usePathname() hook.
How navigation works in Next.js.

> <Link />- linking between pages
  open /app/ui/dashboard/nav-links.tsx, and import the Link component from next/link.
Next.js automatically prefetches the code for the linked route in the background. By the time the user clicks the link, the code for the destination page will already be loaded in the background, and this is what makes the page transition near-instant!

>Active Links- usePathname()
 >>CODE
 'use client';
  import { usePathname } from 'next/navigation';
  // assign the path to a variable called pathname inside your <NavLinks /> component  
  >>CODE 
    href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}


Chapter 6
explores
Push your project to GitHub.
Set up a Vercel account and link your GitHub repo for instant previews and deployments.
Create and link your project to a Postgres database.
Seed the database with initial data. (seed-Populating the database with an initial set of data)

>executing queries
SELECT invoices.amount, customers.name
FROM invoices
JOIN customers ON invoices.customer_id = customers.id
WHERE invoices.amount = 666; //invoice belongs to EVIL RABBIT (check once by executing)


Chapter 7
explores
Learn about some approaches to fetching data: APIs, ORMs, SQL, etc.
How Server Components can help you access back-end resources more securely.
What network waterfalls are.
How to implement parallel data fetching using a JavaScript Pattern.

>Fetching Data
 >>In Next.js, you can create API endpoints using Route Handlers.
 >>For relational databases like Postgres, you can do this with SQL or with an ORM.
 >>you should not query your database directly when fetching data on the client as this would expose your database secrets

>SERVER COMPONENTS
 >>Server Components support JavaScript Promises
    >>>use async/await syntax without needing useEffect, useState or other data fetching libraries.
 >>Server components allow you fetch data directly from your database.

>Using SQL- SQL allows you to write targeted queries to fetch and manipulate specific data. // /app/lib/data.ts
 
>Fetching Data for <Card> Components
  >>CODE
 fetchCardData,
..export...
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

>REQUEST WATERFALLS- sequence of network requests that depend on the completion of previous requests.In the case of data fetching, each request can only begin once the previous request has returned data.
 >>When might you want to use a waterfall pattern? ->To satisfy a condition before making the next request.

>Parallel Data Fetching- all data requests at the same time(in parallel).
  >>use Promise.all();
     >>>CODE const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);


Chapter 8
explores
What static rendering is and how it can improve your application's performance.
What dynamic rendering is and when to use it.
Different approaches to make your dashboard dynamic.
Simulate a slow data fetch to see what happens.

>Static Rendering- data fetching and rendering at build time. //When your data updates, you want to show the latest changes in your dashboard. Static Rendering is not a good fit for this use case. (SEO- search engine optimization)(Crawling, Index, Ranking)

>Dynamic Rendering- content rendered on the server for each user at request time.(Real-Time Data, User-Specific Content, Request Time Information ( cookies or the URL search parameters))

>Simulatinf Slow Data Fetch
 >>CODE
  console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
   console.log('Data fetch completed after 3 seconds.');

Chapter 9
explores
What streaming is and when you might use it.
How to implement streaming with loading.tsx and Suspense.
What loading skeletons are.
What Next.js Route Groups are, and when you might use them.
Where to place React Suspense boundaries in your application.

>Streaming- data transfer technique- break down route -progressive streaming from server to the client as they become ready. One advantage of this approach is that you can significantly reduce your page's overall loading time.
There are two ways you implement streaming in Next.js:
At the page level, with the loading.tsx file (which creates <Suspense> for you).
At the component level, with <Suspense> for more granular control.

 >>loading.tsx
   >>>CODE
      export default function Loading() {
      return <div>Loading...</div>;
      }
 
 >>Streaming a Component - using React Suspense
   >>>CODE
      import { Suspense } from 'react';
      import { RevenueChartSkeleton } from '@/app/ui/skeletons';
       ....<Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>

>Grouping Components-
    //to create more of a staggered effect, you can group the cards using a wrapper component. This means the static <SideNav/> will be shown first, followed by the cards, etc.
  >>CODE- 
     //  /app/dashboard/(overview)/page.tsx
     import CardWrapper from '@/app/ui/dashboard/cards';
     import{....CardsSkeleton,..}
     ....Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>...
     //  /app/ui/dashboard/cards.tsx
     import { fetchCardData } from '@/app/lib/data'
      const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

>Placing React Suspense Boundaries- //Where you place your suspense boundaries will vary depending on your application. In general, it's good practice to move your data fetches down to the components that need it, and then wrap those components in Suspense. But there is nothing wrong with streaming the sections or the whole page if that's what your application needs.
  