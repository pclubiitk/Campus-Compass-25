# Chapter 1
- pnpm is faster and more efficient than npm
- ``` bash
    pnpm i
    pnpm dev
    ```
This installs project packages and starts the development server.

# Chapter 2
- ```global.css``` can be used to add css rules to all the routes of the app.

- Tailwind is a CSS framework that allows us to write utility classes directly in your React code.

- We can also use CSS modules, which allows us to scope CSS to a component by creating unique class name.

    - It provides a way to make CSS classes locally scoped to components by default.
- ```clsx``` library can also be used when we need to conditionally style an element based on some condition.

# Chapter 3

- If we use custom fonts, then we might end up affecting performance, as then the browser initially renders the text in system font, and then swaps it with the custom font. 

    - ```next/font``` module downloads the font files at build time, and hosts them along with other static assets, hence no additional network requests are needed.

- To add a font, import it in a file and then add it to ```/app/layout.tsx```, which is supposed to have the structure for the app.

    - We can also do the same for any particular part of the app, just need to add required font.

- ```next/image``` can be used if we don't want to manually optimize images. 
    - ```<Image>``` component is an extension of HTML ```<img>``` tag, which also has automatic image optimization.

-  The class ```hidden``` is used to remove the image from the DOM on mobile screens, and ```md:block``` to show the image on desktop screens and vice versa.

# Chapter 4
- In Next.js, each folder represents a route segment that maps to a URL segment.

- ```page.tsx``` is a special Next.js file that exports a React component, and it's required for the route to be accessible.
    - To create new pages, create a new route segment using a folder, and add a ```page``` file inside it
- *Partial Rendering*: When only the page components update and the layout stays the same when transitioning between pages.
    - Happens when a common layout is shared by multiple pages.

- ```/app/layout.tsx``` is the *root layout*. Any UI added here would be shared across all pages in the app.

- A layout file is used to share UI across multiple pages.

# Chapter 5
- When we link pages using ```<a>``` HTML element, the entire page is refreshed on each page navigation.

- ```<Link />``` component allows us to do client-side navigation with JS. Similar to ```<a>``` tag.

- *Auto code-splitting*: plitting code by routes isolates each page. Hence, even if a certain page throws an error, the rest of the app can work. Also, this makes applications faster as there is lesser code for the browser to process.

- *Prefetching*: Whenever ```<Link>``` Component is encountered by Next.js, it automatically prefetches the code for the linked route in the background. 

- To highlight active links, we can use ```usePathname()``` from ```next/navigation``` to get the current link, and then use ```clsx``` library to conditionally apply class names the ```link.href``` matches with the ```pathname```.

# Chapter 6
- *Seeding*: Populating the database with an inital set of data.

# Chapter 7
- *API*: An intermediary layer between code and database.
    - In Next.js, API endpoints can be created by using Route Handlers.

# Chapter 8 
- *Static Rendering*: Data fetching and rendering happens on the server at build time, hence giving faster websites and lesser server load.
    - Not good where data needs to be regularly updated
- *dynamic rendering*: content is rendered on the server for each user at request time
    - Major problem being that the app is only as fast as our slowest data fetch

# Chapter 9
- *Streaming*: Data transfer technique that breaks down a route in smaller chukns and streams then from the server as they become ready.
- *Loading Skeleton*: A simplified version of the UI, which can be used as a fallback to indicate that the content is loading
- We can also stream specific components using React Suspense. So if a particular part is slow, the other parts can still be loaded.

# Chapter 11
