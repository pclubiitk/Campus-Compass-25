chapter 1
/app similar to src in react 
/app/lib for writing functions ,it is like a library
/app/ui for components
/public for static files as photo ,logo
chapter 2
clsx is a module used for adding a variable style for example in case of dark mode light mode
chapter 3
We can add fonts to entire website by adding it in layot.tsx or to a particular component by importing it it partocular component only
image is a tag used for images ,not img we can give  dime..nsions..

chapter 4
finaly here i come to know one importance of next over react , handeling different pages is so simple just create a folder by the name of route than create a page.tsx in it (A DOUBT CAN WE WRITE .JSX OR JS HERE)
things present in a layot.tsx is shared among all,so for \* ka tho samaja agaya and dont forget \ will get page.tsx present directly in app

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Doubt is it necce... to use routename folder to write components code in app/ui (i mean how exactly the imporing of components is happ..)@@@@@@@@@@@@@@@@@@@@@  



chapter 5 
<a> will reload the whole page so we need to use <Link>
import { usePathname } from 'next/navigation'; this usepath is used for getting current path similar to navigation thing of re..
'use client';  what is this..

chapter 6
database related thing upar upar se chla gaya 

chapter 7 
this await is called as waterfall and promise.all() is parallel ...

chapter 8

statice ren... of data done in backend for the purpose of fixed type of data ,
dynamic jo aja tak me karta tatha which is slow

chapter 9 
streaming means vo loading ke time pe hota hai na that spinner and all 
remember the line and words Right now, your loading skeleton will apply to the invoices.

Since loading.tsx is a level higher than /invoices/page.tsx and /customers/page.tsx in the file system, it's also applied to those pages. the main which which is reason for ***** nextjs
Route groups allow you to organize files into logical groups without affecting the URL path structure. When you create a new folder using parentheses (), the name won't be included in the URL path. So /dashboard/(overview)/page.tsx becomes /dashboard

wow!
<!-- 
   <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense> -->

        remeber cardwraper


 chapter 10 we need next 14


 chapter 11 
 Congratulations! You've just implemented search and pagination using URL search params and Next.js APIs.

To summarize, in this chapter:

You've handled search and pagination with URL search parameters instead of client state.
You've fetched data on the server.
You're using the useRouter router hook for smoother, client-side transitions.
These patterns are different from what you may be used to when working with client-side React, but hopefully, you now better understand the benefits of using URL search params and lifting this state to the server.

@@@@@@@@@@need to revise 11 @@@@

        