# App Router Notes

## Chapter 1

1. `npx create-next-app@latest //appname// --use-pnpm` : Setup Next.js Application
2. `pnpm i` : Install the project's packages (package.json)
3. `pnpm dev` : Start the development server at `http://localhost:3000`

## Chapter 2

1. TODO : Tailwind
2. `import clsx from 'clsx'` for conditional styling

## Chapter 3

1. `next/font` for fonts.
2. `next/image` for images.

## Chapter 4

1. To create different pages in Next.js, create a new route segment using a folder, and add a `page.tsx` file inside it.
2. Any `layout.tsx` file will govern the layout of the parent page and all children of it but not of any of the pages above. {Thus we always need a `layout.tsx` in the root of the app.}
3. **Partial Rendering** preserves client-side React state in the layout when transitioning between pages.

## Chapter 5

1. `next/link` to replace <a> tag to allow client-side navigation.
2. Use `'use client'` before `import { usePathname } from 'next/navigation'`

## Chapter 6 (The Nightmare)

1. Note to Self : Github desktop has limit of 100MB. So do not move more than that many files or you may never be able to get the project back due to lack of skill.
2. **Note :** Update the root directory while deployement.
3. **Another Note :** Use `bcryptjs` instead of `bcrypt`.
4. **Another another Note :** Use `pnpm` to uninstall `bcrypt` and install `bcryptjs` because `npm` has skill issues.
5. **Yet another Note :** Import `bcryptjs` instead of `bcrypt` in `/app/seed/route.ts`.
6. Use Neon for PostGres database. SupaBase does not work for some reason.
7. Evil Rabbit goes brrr...

## Chapter 7

1. By default, Next.js applications use **React Server Components**(they allow us to querry databasse directly from the server without an additional API layer).
2. **Request Waterfalls** refer to a sequence of network requests that depend on the completion of previous requests.
3. Use `Promise.all()`/`Promise.allSettled()` to initiate all promises at the same time.

## Chapter 8

1. **Static Rendering** OP.
2. **Dynamic Rendering** OP.

## Chapter 9

1. Routing Groups can be created by using parentheses `()` around a folder name. It won't be included in the URL path.
2. **Suspense** is a powerful API which can create delightful user experiences by streaming entire page or parts of it.

## Chapter 10

1. Skipped it as **Partial Prerendering (PPR)** is an experimental feature of Node.js 14 and is available only with the **Next.js canary releases(next@canary)**, not in the stable version of Next.js.

## Chapter 11

1. `useSearchParams` allows access to the parameters of the current URL.
2. `usePathname` lets us read the current URL's pathname.
3. `useRouter` enables navigation between routes within client components programmatically.
4. Use `Debouncing` to optimise the app.

## Chapter 12

1. **Note :** `input` elements with `type="number"` actually return a string, not a number!
2. Create dynamic route segments by using `[` and `]` to wrap a folder's name.
3. **Note to Self :** Don't forget to wrap the `form` element of all the pages in `(`and `)` or else you might waste an hour trying debugging.

## Chapter 13

1. `error.tsx` serves as a catch-all for unexpected errors and allows us to display a fallback UI to users.
2. `notFound()` takes precedence over `error.tsx`

## Chapter 14

1. `lint` does not work for some reason for me.
2. `required` is required for client-side validation.
3. **TODO :** Put aria labels on all fields.

## Chapter 15

1. **Authentication :** Verify your identity.
2. **Authorization :** Determine what you can access.
3. **TODO :** Revision

## Chapter 16

1. `SEO` : `Search Engine Optimization`