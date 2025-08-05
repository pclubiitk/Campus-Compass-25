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

# Git Workflow Notes

1. The gir workflow works as follows:
   - A fork is created on the server side of our own.
   - The copy, i.e. the fork is cloned to the system locally.
   - The Git remote path is added to the local clone.
   - A new local feature branch is created.
   - The developer makes changes in the new branch.
   - New commits are created.
   - The branch is pushed in our own forked repository.
   - A pull request is made from new branch to official repo.
   - The pull request is approved for merge and is merged in the original repository.
2. Cloning can be done as `git clone https://user@bitbucket.org/user/repo.git`
3. The origin repository is used as a remote for the forked repo and upstream for the official repo as
   `git remote add upstream https://bitbucket.org/maintainer/repo`
4. The forked repo ca be edited, commit changes and create branches like
   `git checkout -b some-feature # Edit some code git commit -a -m "Add first draft of some feature"`
5. All the changes will be entirely private until a push is made and if the official project has moved forward it can be pulled like
   `git pull upstream main`
6. First once the changes are made the changes need to be pushed back to the forked repo as `git push origin feature-branch`
7. When the pull request we need to notify the project maintainer to merge the changes into the main branch.

# Using Tailwind with Storybook

To do this

1. First install both of them (Tailwind and Storybook).
2. Now in `tailwind.config.js` change this

```
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./.storybook/**/*.{js,jsx,ts,tsx}", // <-- include Storybook
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

3. In `src/index.css` add this

```
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. Finally tell storybook to use Tailwind as

```
// .storybook/preview.js
import '../src/index.css'; // or wherever your Tailwind CSS is defined

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { matchers: { color: /background|color/, date: /Date/ } },
};
```

# Docker Notes

1. Docker is a project that automates the deployment of software applications inside containers by providing additional abstraction and automation of OS-level virtualization on Linux.
2. **Containers** are the like virtual machines which run applications but without isolation and by lowering the the computing power required.
3. Containers offer a logical packaging mechanism in which applications can be abstracted from the environment in which they actually run.
4. We will be using Amazon Web Services and EC2 to deploy static and dynamic webapps respectively.
5. Now from here on we will be using Docker
   - Download Docker Desktop from MS Store.
   - Run `docker run hello-world` to check if it is installed.
6. Now we will use Busybox container for our system

- Start by `docker pull busybox`
- The `pull` command fetches the busybox **image** from the **Docker registry** and saves it to our system. You can use the `docker images` command to see a list of all images on your system.
- To **print** a message `docker run busybox echo "hello from busybox"`
- To **see all the containers** use `docker ps`
- To see more **detailed view of containers** use `docker ps -a`
- To **run multiple commands** in the container we run `docker run -it busybox sh` and then we can use as many commands as we want simultaneouly.
- To see a **list of supported flags** use `docker run --help`
- To delete the containers not in use now copy their IDs and use `docker rm 305297d7a235 ff0a5c3750b9`
- To delete a lot of IDs at once we can use `docker rm $(docker ps -a -q -f status=exited)`. It will delete all the containers with exited status.
  -q returns only numeric value and -f filters the output. -rm flag can be passed which automatically deletes the container once exited.
- In later versions `docker container prune` command can be used for the same.
- To **delete unwanted images** use `docker rmi`

7. Terminologies in docker:

- **Images :** These are the blueprints of the containers like busybox.
- **Containers :** These are created form Docker images and run the actual app.
- **Docker Daemon :** The background services running on the host that manage everything.
- **Docker Client :** It is a command line tool which allows the user to interact with the daemon.
- **Docker Hub :** It is a registry of Docker images.

8. **Webapps with Docker**

- **Static Sites**
  - We will be using `prakhar1989/static-site` for now and give the command `docker run --rm -it prakhar1989/static-site` where -it flag makes it interactive. The image is fetch from the registry so it shows `Nginx is running...`.
  - Stop by hitting Ctrl+C.
  - To run the container in a **detached** mode so that the terminal will no longer be connected to the docker container use `docker run -d -P --name static-site prakhar1989/static-site`
    Here, -d detaches the terminal and -P publishes the exposed ports and --name is used to give name.
  - Now we can see the ports by using `docker port [CONTAINER]`
  - To specify a custom port use `docker run -p 8888:80 prakhar1989/static-site`
  - To stop a detached container use `docker stop` and give docker ID like `docker stop static-site`
- **Docker Image**
  - To get a new docker image either get it from the registry or create one. The images can be searched using `docker search`
  - There are different types of images:
    - **Base images** which have no parent image like ubuntu, busybox etc.
    - **Child images** which are build on the base images with added functionality.
    - **Official images** which are maintained by the folks at docker like python, busybox etc.
    - **User images** which are created and shared by users typically of the format `user/image-name`
      Now, let's create an image:
  - Here we have an already made app called Flask written in python and so we are going to use python as base image.
  - **Dockerfile** is a simple text file that contains a list of commands that the Docker client calls while creating an image.
    The command of this file are like Linux commands.
  - The app directory contains a Dockerfile but we are going to create one:
    - Create a new text file and save it in the same folder as the flask app by name `Dockerfile`.
    - Now specify base as `FROM pytho:3.8`
    - Then set the working directory as `WORKDIR /usr/src/app`
    - Then copy the files to our app as `COPY . .`
    - Now install the dependencies as `RUN pip install --no-cache-dir -r requirements.txt`
    - Now we have to specify the port number as `EXPOSE 5000`
    - Now write the command to run the app which is `python ./app.py` as `CMD ["python", "./app.py"]`
    - With this the Dockerfile is ready.
  - Now since the Dockerfile is created we are going to build the image using `docker build` command as `docker build -t yourusername/catnip .`
    Check by `docker images` if you docker image is ready.
  - Finally run the docker image and see if it works as `docker run -p 8888:5000 yourusername/catnip`

9. **Docker on AWS**

- AWS Elastic Beanstalk is used to get our app running in a few clicks and shareable.
- To do so first we need to deploy the app on AWS to publish our image. For the first time we need to login.
- To publish the image type `docker push yourusername/catnip`
- Now the image is online.

10. **Beanstalk**

- AWS Elastic Beanstalk (EB) is a PaaS (Platform as a Service) offered by AWS. Create a free account on it, enter all the details and also add your image name.
- Now open `Dockerrun.aws.json` located in `flask-app` folder and edit `Name` of the image.
- Click on the radio button and upload your code on it.
- Now click 'Create Environment'.
  The file `Dockerrun.aws.json` contains

```
{
  "AWSEBDockerrunVersion": "1",
  "Image": {
    "Name": "prakhar1989/catnip",
    "Update": "true"
  },
  "Ports": [
    {
      "ContainerPort": 5000,
      "HostPort": 8000
    }
  ],
  "Logging": "/var/log/nginx"
}
```

- After all of this is done and you have seen your app terminate environment otherwise you will be charged.

## Multi-Container Environments

1. Here first we are going to dockerize an app called SF Food Trucks. The backend is written in Python (Flask) and Elasticsearch is used for search.
2. The `flask-app` folder contains Python app, while `utils` folder has some utilities to load data into Elasticsearch.
3. There exists an officially supported image for Elasticsearch to pull it first `docker pull docker.elastic.co/elasticsearch/elasticsearch:6.3.2` and then run it in development mode by specifying ports and setting an environment variable that configures the Elasticsearch cluster to run as a single-node like `docker run -d --name es -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.3.2277451c15ec183dd939e80298ea4bcf55050328a39b04124b387d668e3ed3943` where `--name es` defines the name of the container we can see the container name by using `docker container logs`.
4. To send request to the Elasticsearch container we use `9200` port and `cURL` as `curl 0.0.0.0:9200`
5. We will use `ubuntu` base image to create the `Dockerfile` as

```
# start from base
FROM ubuntu:18.04

MAINTAINER Prakhar Srivastav <prakhar@prakhar.me>

# install system-wide deps for python and node
RUN apt-get -yqq update
RUN apt-get -yqq install python3-pip python3-dev curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get install -yq nodejs

# copy our application code
ADD flask-app /opt/flask-app
WORKDIR /opt/flask-app

# fetch app specific deps
RUN npm install
RUN npm run build
RUN pip3 install -r requirements.txt

# expose port
EXPOSE 5000

# start app
CMD [ "python3", "./app.py" ]
```

Here `apt-get` is used to install all dependencies and `yqq` flag is used to suppress output. 6. Now we build the image using `docker build -t yourusername/foodtrucks-web` but it will be unable to connnect to Elasticsearch. 7. **Docker Network**

- When Docker is installed it creates 3 networks bridge, host and none where bridge is the default.
- We use `docker network inspect bridge` to inspect and see the particular container being used.
- Now we run with `docker run -it --rm yourusername/foodtrucks-web bash`
- `docker network` command helps our to build a secure network so that the Flask container knows `es` stands for `172.17.0.2`
- To create a network use `docker network create foodtrucks-net`
- To launch a new container first stop and remoce the running bridge container.
- Then run the container inside the network with `docker run -it --rm --net foodtrucks-net yourusername/foodtrucks-web bash`

8. **Docker Compose**

- There are various tools helping in Docker like Docker machine, Docker Compose, Docker swarm and Kubernetes and here we will talk about Docker Compose.
- Compose is a tool that is used for defining and running multi-container Docker apps in an easy way.
- It provides a configuration file called `docker-compose.yml` that can be used to bring up an application and the suite of services it depends on with just one command.
- Now run `docker-compose up` and head over to IP to see the code.
- To destroy the cluster and the data volumes, just type `docker-compose down -v`.
- Remove the foodtrucks network.
- Now when you re-run the docker you will see compose created a new network `foodtrucks_default`

9. **Development Workflow**

- To open the a new route `/hello` and display a hello message, we need to go to `flask-app/app.py` and add a new route as

```
@app.route('/')
def index():
  return render_template("index.html")

# add a new hello route
@app.route('/hello')
def hello():
  return "hello world!"
```

But doing just this won't do it. Replace the `web` portion of `docker-compose.yml` file with the given code. 10. **AWS Elastic Container Service**

- Install CLI.
- Use this `ecs-cli configure profile --profile-name ecs-foodtrucks --access-key $AWS_ACCESS_KEY_ID --secret-key $AWS_SECRET_ACCESS_KEY` (before that get `AWS_ACCESS_KEY_ID` and` AWS_SECRET_ACCESS_KEY`)
- Configure the CLI with `ecs-cli configure --region us-east-1 --cluster foodtrucks`
- Publish image on Docker Hub by `docker push yourusername/foodtrucks-web`
- Go to `cd aws-ecs` then type `ecs-cli compose up` and deploy the app.
- Use `ecs-cli ps` to check status if it is running then it is good.
- Once we are done turn it down with `ecs-cli down --force`

# Using Nginx as API Gateway

1. Clone repo

```
git clone https://github.com/marcospereirampj/nginx-api-gateway.git
cd nginx-api-gateway
```

2. Open the Dockerfile in the root and add before `EXPOSE` or `CMD` instructions.
   `RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak`
3. Update `gateway.conf` with this

```
server {
    listen 80;
    server_name localhost;

    location /api/users {
        proxy_pass http://users-api:8002;
    }

    location /api/products {
        proxy_pass http://products-api:8001;
    }
}
```

4. Finally run with `docker compose up --build`
