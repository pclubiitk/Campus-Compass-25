# Campus-Compass-25

## Resource 0

### Get ready with Go
~ Akshat
1. Intro to Golang : https://youtu.be/F3klnY_r8FU?si=5qeAya0x56Xf9TFx
2. Go Installation:  https://go.dev/doc/install
3. Try Go by examples till **Multiple Return value** https://gobyexample.com/ Or you can check out Go Tour https://go.dev/tour/welcome/1 , which includes interactive code examples for basic syntax.


## Resource 1

### Lets clear some basics
~ Manas

We will be using Next.js for our project 
1. learn difference between Next.js and react https://nextjs.org/learn/react-foundations/what-is-react-and-nextjs (5 min read)
2.  You can follow this https://nextjs.org/learn/react-foundations according to your requirements, whatever topics you feel is unknown to you read that. There are 10 chapters, if you have slight idea and feel difficult in implementing then just read the chapter 10.
3. Install Next.js https://nextjs.org/docs/app/getting-started/installation and also follow the manual set up to understand better.
4. **[Must read]** **Chapter 10** https://nextjs.org/learn/react-foundations/server-and-client-components spend some time on it. We will ask it in next meet.
5. Overview the project structure https://nextjs.org/docs/app/getting-started/project-structure just overview will not require much time.


After doing this attempt the **Assignment 1** 
(the submission will be around 15 or 16 EOD for part 1 and the research doc of part 2, but this will help you a lot, not just for the project but for over all learning, and may help you for the secy task 😉)


## Assignment 1

### Good habits

1. Give us updates daily, this will increase our and your fellow mentees’ morale and a good learning environment.
2. Don't just copy and paste from the tutorials. Read, understand, and type as much as possible by yourselves. (google what you don't understand, this is important in early phase, later you can 😁)
3. You may face difficulty with TypeScript in the beginning, don't give up (google is always there)
4. If you don't understand the problem the, there is point in seeing the solution. first try to get the feel of the problem.
5. You may feel tailwind is overwhelming, but if you know css - you know tailwind, just search here https://tailwindcss.com/docs/installation/using-vite
6. Next.js solves many issues for developers, which is described in these 16 chapters, try to understand what are the core problems it is solving.


### TODOs

#### Part 1
Invest some half an hour on https://nextjs.org/learn/dashboard-app read, overview, observe what all is possible and how can you approach the problem (specially what all is going on) 
Keep the following things in mind

1. There are 16 chapters total. You may leave chapter 10 for now
2. Try to finish till chapter 10 in less time, as they are small and easy.
3. **Invest good time in chapters 11 to 15**.
4. Make your notes while doing this all in a `notes.md` (chapter wise) in the same repo. (they need not be perfect, but will help you a lot later)
5. You are required to submit the final project in the github repo `https://github.com/pclubiitk/Campus-Compass-25.git` as a pull request. Inside the `Assignment/Assignment1-dashboard` create a next js project named `[yourname]-dashboard` with `--no-git` flag to avoid the submodule issue. (i have provided a example for that, all the upcoming submissions will follow same pattern)


#### Part 2
For our application we need two ui interfaces, one which is the application and the other is the admin portal, to take care of the internal activities.

We have the following requirements
1. We need a page where the logs will be present (like new node added, new notice published etc, you may render a table with different columns to describe the logs)
2. A page to push new notices
3. A page to view all the notices till now (use pagination here)
4. In our application, users can write reviews etc, hence we need to moderate the content and ensure no abusive content is used. To ensure this, we will be using a moderation api which will run in background and add flagged reviews to a database table named `flagged`, hence we need a page to review the flagged posts etc and manually allow to publish if its fine and delete and warn to the user if not.
5. Similarly a page to review node / new place addition request by users.

So by the time you complete the part 1, try to think and document how will you approach the part 2. We will discuss it and assign different parts to different people. (team work 🔥)

As we say you to document, we mean you to think and provide us the following data as a md file named `design.md`:
1. Think and structure what tables, object structure we should keep of the database (don't just provide us the tables of the admin dashboard, think in the direction of the campus compass application as a whole)
2. Document what components and UI would be better, you can list them down, create a basic outline of the ui, it would be better if you propose all the components from one ui library, for consistency you may use https://ui.shadcn.com/ and https://chakra-ui.com/
3. Try to list down the backend routes we will need, and how to distribute them into the `go server` , `next sever side actions` or `simple endpoints in next`.
4. We will be converting the application into a PWA later (the next resource will be focused on that) if you have more time, you can start thinking in that direction.
5. Propose ideas or features you want to implement, other than stated here.

#### Part 3
1. You will be presenting you learnings, knowledge in the sessions with all of us (mentors + fellow mentees) so prepare for that.
2. We are planning to have a small, simple codeforces contest, where you are required to submit the solutions in only GO, to test your go skills, so ensure you have gone through resource 0.




## Resource 3
1. Search what are pwas
2. ⁠explore https://whatpwacando.today/ 
3. ⁠explore https://nextjs.org/docs/app/guides/progressive-web-apps (try along side)
4. ⁠learn what is, why do we need, https://storybook.js.org/docs/get-started/why-storybook you will mainly developing the components using this. (Explore its docs) https://storybook.js.org/docs/get-started/frameworks/nextjs for next js, will provide more resources soon.
5. ⁠git workflow as discussed in the meet  https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow
6. ⁠Resources for docker https://docker-curriculum.com (you may skip the part of aws, or try by creating a free tier account, i would recommend doing that) This guide is a bit old, but covers almost every basic concept beautiful 🙂



# Todos
1. How to integrate Tailwind with Storybook


