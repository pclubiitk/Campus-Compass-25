# PWA Notes

1. Progressive Web Applications (PWAs) offer the reach and accessibility of web applications combined with the features and user experience of native mobile apps.
2. To create PWA with Next.js,

   - Create `app/manifest.ts`.
   - Add the code

   ```
   import type { MetadataRoute } from 'next'

   export default function manifest(): MetadataRoute.Manifest {
       return {
           name: 'Next.js PWA',
           short_name: 'NextPWA',
           description: 'A Progressive Web App built with Next.js',
           start_url: '/',
           display: 'standalone',
           background_color: '#ffffff',
           theme_color: '#000000',
           icons: [
           {
               src: '/icon-192x192.png',
               sizes: '192x192',
               type: 'image/png',
           },
           {
               src: '/icon-512x512.png',
               sizes: '512x512',
               type: 'image/png',
           },
           ],
       }
   }
   ```

   - You can use tools like favicon generators to create the different icon sets and place the generated files in your `public/` folder.

## Web Push Notifications

1. Web Push Notifications allow you to re-engage users even when they're not actively using your app.
2. To apply this,

   - In `app/page.tsx` add this

   ```
   'use client'

   import { useState, useEffect } from 'react'
   import { subscribeUser, unsubscribeUser, sendNotification } from './actions'

   function urlBase64ToUint8Array(base64String: string) {
       const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
       const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

       const rawData = window.atob(base64)
       const outputArray = new Uint8Array(rawData.length)

       for (let i = 0; i < rawData.length; ++i) {
           outputArray[i] = rawData.charCodeAt(i)
       }
       return outputArray
   }
   ```

   - Now to add a component to manage subscribing, unsubscribing and sending push notifications add this is `page.tsx`

   ```
   function PushNotificationManager() {
   const [isSupported, setIsSupported] = useState(false)
   const [subscription, setSubscription] = useState<PushSubscription | null>(
       null
   )
   const [message, setMessage] = useState('')

   useEffect(() => {
       if ('serviceWorker' in navigator && 'PushManager' in window) {
       setIsSupported(true)
       registerServiceWorker()
       }
   }, [])

   async function registerServiceWorker() {
       const registration = await navigator.serviceWorker.register('/sw.js', {
       scope: '/',
       updateViaCache: 'none',
       })
       const sub = await registration.pushManager.getSubscription()
       setSubscription(sub)
   }

   async function subscribeToPush() {
       const registration = await navigator.serviceWorker.ready
       const sub = await registration.pushManager.subscribe({
       userVisibleOnly: true,
       applicationServerKey: urlBase64ToUint8Array(
           process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
       ),
       })
       setSubscription(sub)
       const serializedSub = JSON.parse(JSON.stringify(sub))
       await subscribeUser(serializedSub)
   }

   async function unsubscribeFromPush() {
       await subscription?.unsubscribe()
       setSubscription(null)
       await unsubscribeUser()
   }

   async function sendTestNotification() {
       if (subscription) {
       await sendNotification(message)
       setMessage('')
       }
   }

   if (!isSupported) {
       return <p>Push notifications are not supported in this browser.</p>
   }

   return (
       <div>
       <h3>Push Notifications</h3>
       {subscription ? (
           <>
           <p>You are subscribed to push notifications.</p>
           <button onClick={unsubscribeFromPush}>Unsubscribe</button>
           <input
               type="text"
               placeholder="Enter notification message"
               value={message}
               onChange={(e) => setMessage(e.target.value)}
           />
           <button onClick={sendTestNotification}>Send Test</button>
           </>
       ) : (
           <>
           <p>You are not subscribed to push notifications.</p>
           <button onClick={subscribeToPush}>Subscribe</button>
           </>
       )}
       </div>
   )
   }
   ```

   - Now for iOS devices to install this and for notification we add this

   ```
   function InstallPrompt() {
   const [isIOS, setIsIOS] = useState(false)
   const [isStandalone, setIsStandalone] = useState(false)

   useEffect(() => {
       setIsIOS(
       /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
       )

       setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
   }, [])

   if (isStandalone) {
       return null // Don't show install button if already installed
   }

   return (
       <div>
       <h3>Install App</h3>
       <button>Add to Home Screen</button>
       {isIOS && (
           <p>
           To install this app on your iOS device, tap the share button
           <span role="img" aria-label="share icon">
               {' '}
               ⎋{' '}
           </span>
           and then "Add to Home Screen"
           <span role="img" aria-label="plus icon">
               {' '}
               ➕{' '}
           </span>.
           </p>
       )}
       </div>
   )
   }

   export default function Page() {
   return (
       <div>
       <PushNotificationManager />
       <InstallPrompt />
       </div>
   )
   }
   ```

3. To implement server actions,
   - Create a new file `app/actions.ts` and add the given code.
   - This file will handle creating subscriptions, deleting subscriptions, and sending notifications.
4. To use the Web Push API, you need to generate VAPID keys. To do so,
   - Install web-push globally as `npm install -g web-push`
   - Now generate VAPID keys by running `web-push generate-vapid-keys`
   - Copy the output and past in `.emv` file as
   ```
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
   VAPID_PRIVATE_KEY=your_private_key_here
   ```
5. To create a Service Worker, - Create `public/sw.js` and the given code.
   The service worker supports custom images and notifications, and handles incoming push events and notification clicks.
   Change the `icon`, `badge`, `vibrate` and `data` as desired. Also update `https://your-website.com` and `notificationclick` with appropriate URL.
6. Now to ensure the app installation across multiple devices it should have a valid web app manifest and website over HTTPS.
7. To test for notifications locally use `next dev --experimental-https`
8. Now to secure the application we can configure security headers in `next.config.js` which are:
   - Global Headers (applied to all routes):
     - `X-Content-Type-Options`: nosniff: Prevents MIME type sniffing, reducing the risk of malicious file uploads.
     - `X-Frame-Options`: DENY: Protects against clickjacking attacks by preventing your site from being embedded in iframes.
     - `Referrer-Policy: strict-origin-when-cross-origin`: Controls how much referrer information is included with requests, balancing security and functionality.
   - Service Worker Specific Headers:
     - `Content-Type: application/javascript; charset=utf-8`: Ensures the service worker is interpreted correctly as JavaScript.
     - `Cache-Control: no-cache, no-store, must-revalidate`: Prevents caching of the service worker, ensuring users always get the latest version.
     - `Content-Security-Policy: default-src 'self'; script-src 'self'`: Implements a strict Content Security Policy for the service worker, only allowing scripts from the same origin.

# Storybook Notes

1. Storybook for Next.js is a framework that makes it easy to develop and test UI components in isolation for Next.js applications.
2. To use storybook in the project,

   - In the root directory install it as `npm create storybook@latest`
   - It will ask for migration allow it else manually migrate as `npm install --save-dev @storybook/nextjs`
   - Now `.storybook/main.ts` appears. Update it with

   ```
   import { StorybookConfig } from '@storybook/nextjs';

   const config: StorybookConfig = {
   // ...
   // framework: '@storybook/react-webpack5', 👈 Remove this
   framework: '@storybook/nextjs', // 👈 Add this
   };

   export default config;
   ```

   - Now storybook plugins are not necessary.

3. We can use Vite which removes the need of Webpack and Babel as,

   - `npm install --save-dev @storybook/experimental-nextjs-vite`
   - Update the `.storybook/main.js` as

   ```
   import { StorybookConfig } from '@storybook/experimental-nextjs-vite';

   const config: StorybookConfig = {
   // ...
   // framework: '@storybook/react-webpack5', 👈 Remove this
   framework: '@storybook/experimental-nextjs-vite', // 👈 Add this
   };

   export default config;
   ```

   - These can both be removed
     'storybook-addon-next',
     'storybook-addon-next-router'
   - The storybook setup wizard now opens with main features.
   - It allows use of local images, remote images and Next.js image component.
   - Fonts are partially supported.
   - If we don't use `@storybook/experimental-nextjs-vite` the we have to tell the location of fonts directory by `staticDirs`
   - Fetching fonts from Google may fail so it is recommended to mock the requests as

   ```
   # .github/workflows/ci.yml
   - uses: chromaui/action@v1
   env:
       #👇 the location of mocked fonts to use
       NEXT_FONT_GOOGLE_MOCKED_RESPONSES: ${{ github.workspace }}/mocked-google-fonts.js
   with:
       projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
       token: ${{ secrets.GITHUB_TOKEN }}
   ```

4. **Overriding Defaults** can be done per story by adding a nextjs.router property into the story parameters as

```
import { Meta, StoryObj } from '@storybook/react';

import RouterBasedComponent from './RouterBasedComponent';

const meta: Meta<typeof RouterBasedComponent> = {
  component: RouterBasedComponent,
};
export default meta;

type Story = StoryObj<typeof RouterBasedComponent>;

// If you have the actions addon,
// you can interact with the links and see the route change events there
export const Example: Story = {
  parameters: {
    nextjs: {
      router: {
        pathname: '/profile/[id]',
        asPath: '/profile/1',
        query: {
          id: '1',
        },
      },
    },
  },
};
```

The router object contains all the original methods as mock functions and can be manipulated and inserted use regular mock APIs. To override these defaults, you can use `parameters` and `beforeEach`. 5. **Next.js navigation** - If the story use next/navigation then set `nextjs.appDirectory` to true in the story as

```
import { Meta, StoryObj } from '@storybook/react';

import NavigationBasedComponent from './NavigationBasedComponent';

const meta: Meta<typeof NavigationBasedComponent> = {
component: NavigationBasedComponent,
parameters: {
    nextjs: {
    appDirectory: true, // 👈 Set this
    },
},
};
export default meta;
```

    - The `useSelectedLayoutSegment`, `useSelectedLayoutSegments`, and `useParams` hooks are supported in Storybook.
    - The default value of nextjs.navigation.segments is [] if not set.

6. **Default Navigation Context**
   - The default values on the stubbed navigation context are
   ```
   // Default navigation context
   const defaultNavigationContext = {
       pathname: '/',
       query: {},
   };
   ```
   It contains all the methods.
7. **Next.js Head** can be used like stories in your application.
8. Global **Sass/Scss** stylesheets are supported without any additional configuration as well.
   **CSS modules** work as expected.
   The built in CSS-in-JS solution for Next.js is **styled-jsx**, and this framework supports that out of the box too, zero config.
   Next.js lets you customize **PostCSS** config. Thus this framework will automatically handle your **PostCSS** config for you.
   Absolute imports from the root directory are supported.
   Module aliases are also supported.
   As an alternative to module aliases, you can use subpath imports to import modules. This follows Node package standards and has benefits when mocking modules.
   To configure subpath imports for all modules in the project:
   ```
   // package.json
   {
   "imports": {
       "#*": ["./*", "./*.ts", "./*.tsx"]
   }
   }
   ```
9. This framework provides mocks for many of Next.js' internal modules:

- @storybook/nextjs/cache.mock
- @storybook/nextjs/headers.mock
- @storybook/nextjs/navigation.mock
- @storybook/nextjs/router.mock

10. To create a mock file name session:

```
import { fn } from '@storybook/test';
import * as actual from './session';

export * from './session';
export const getUserFromSession = fn(actual.getUserFromSession).mockName('getUserFromSession');
```

We can use subpath imports by applying conditions as:

```
"imports": {
    "#api": {
      // storybook condition applies to Storybook
      "storybook": "./api.mock.ts",
      "default": "./api.ts",
    },...
```

We can also add module aliases as

```
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve?.alias,
        // 👇 External module
        lodash: require.resolve('./lodash.mock'),
        // 👇 Internal modules
        '@/api': path.resolve(__dirname, './api.mock.ts'),
        '@/app/actions': path.resolve(__dirname, './app/actions.mock.ts'),
        '@/lib/session': path.resolve(__dirname, './lib/session.mock.ts'),
        '@/lib/db': path.resolve(__dirname, './lib/db.mock.ts'),
      };
    }

    return config;
  },
};

export default config;
```

11. Next.js allows for Runtime Config which lets us import a handy getConfig function to get certain configuration defined in your `next.config.js` file at runtime.
12. Custom Webpack config framework takes care of most of the Webpack modifications you would want to add.
13. Typescript configurations framework adds additional support for Next.js's support for Absolute Imports and Module path aliases. (tsconfig.json)
14. Storybook can render the stories of React Server Components in the browser.
    To enable this add `experimentalRSC` feature in `.storybook/main.ts`
