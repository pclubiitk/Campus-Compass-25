# Campus-Compass-25

## Resource 0

### Get ready with Go

1. Intro to Golang : https://youtu.be/F3klnY_r8FU?si=5qeAya0x56Xf9TFx
2. Go Installation: https://go.dev/doc/install
3. Try Go by examples till **Multiple Return value** https://gobyexample.com/ Or you can check out Go Tour https://go.dev/tour/welcome/1 , which includes interactive code examples for basic syntax.

## Resource 1

### Lets clear some basics

We will be using Next.js for our project

1. learn difference between Next.js and react https://nextjs.org/learn/react-foundations/what-is-react-and-nextjs (5 min read)
2. You can follow this https://nextjs.org/learn/react-foundations according to your requirements, whatever topics you feel is unknown to you read that. There are 10 chapters, if you have slight idea and feel difficult in implementing then just read the chapter 10.
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
5. ⁠git workflow as discussed in the meet https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow
6. ⁠Resources for docker https://docker-curriculum.com (you may skip the part of aws, or try by creating a free tier account, i would recommend doing that) This guide is a bit old, but covers almost every basic concept beautiful 🙂

## Resource 4

1. https://marcospereirajr.com.br/using-nginx-as-api-gateway-7bebb3614e48 Read the article step-by-step and run it locally to see how each part of the Nginx API Gateway works in practice.
2. https://hackmd.io/@Akshat23/Hy-rRxmGee this guide supplements the article listed above.

## Discussion

We hope, you got enough time to get familiar with next.js and Its time to start working on our final project 🙂
The basic design (for ui, same for backend will be shared soon) for our application is as followed:

1. Admin side
   ![Admin Side](/images/adminside.svg)

2. User side
   ![User Side](/images/userside.svg)

3. Review Writing Workflow
   ![Workflow](/images/reviewworkflow.svg)

Do the following things:

1. Write a structured review for all the parts listed in design.
2. In the Report ⁠Suggest what enhancements we can do, or are we missing something?
3. ⁠Find and list similar components which we can use from ui libraries (please first check, they should be compatible with next js)
4. Discussion is the key, keep discussing and sharing whatever you find.

## Work Distribution Frontend

Admin Side:

1. Admin logs page / flagged page / request page all have the same table component (so make that table component as flexible as possible, define parameters so we can have different features in different pages) (Yatin, Ujjwal, Vineesh)
2. ⁠Admin notice board page (just the notice writing part) : (Archit, Ayush Singh)
3. ⁠Indicators component with indicator card (keep them flexible, so that we can customize them easily whenever we need them in future) : (Aditya, Aashutosh)

User side:

1. Home page (current location + redirect to any location (research about Open free maps + maplibre GS, and use them) + bottom nav bar: (Himanshu, Shivam Sah)
2. ⁠Profile page and share location page : (Ritika, Shivam)
3. ⁠Noticeboard page with the notice component (you may skip the search for now) : (Shivang, Utkarsh)
4. ⁠Review writting workflow : (Muragesh, Shivanshdeep)

## General guidelines for collaborative work:

1. Work in a new branch
2. ⁠Share and discuss workflow with your teammates, you may customize the design a little bit, but first confirm in the group.
3. ⁠If your component require fetching data from backend, do write the fetch function, as our backend is not yet working, in the error handling part provide the static data for now. Don't write static data in the file itself, dump all your static data in a dummy.json (create one if not present in repo) file with proper comments where it is used.
4. ⁠First develop the component then later add that in the story book.
5. Give it a read https://uxplanet.org/16-ui-design-tips-ba2e7524d203 for better understating of ui principles.
6. https://graphite.dev/guides/git-commit-message-best-practices use this convention to write your commit messages
7. Other than that, add `assignment: <commit message>` to the commits towards the assignment folder

## Resource 5

Go server basics

1. What are modules, packages, inti functions in GO? https://golangbot.com/go-packages/ (great resource, clears most of the doubts about go set up)
2. Our config set up:
   1. What is Viper 🐍? https://dev.to/kittipat1413/a-guide-to-configuration-management-in-go-with-viper-5271
   2. Logrous https://www.golinuxcloud.com/golang-logrus/#Getting_started_with_Logrus (just skim through it)
3. What is ORM? https://dev.to/dak425/what-are-orms-and-why-should-you-use-them-2ng4
   1. We will be using GORM, more about it here: https://gorm.io/docs/
   2. Enums in gorm https://techwasti.com/how-to-use-enums-with-gorm#heading-option-3-using-gorms-enums
4. What is Gin ? https://gin-gonic.com/en/docs/ (explore what options we have)
5. Introduction to Concurrency https://golangbot.com/concurrency/ and https://golangbot.com/goroutines/ for Goroutines basics
6. The server structure is somewhat inspired from the https://github.com/spo-iitk/ras-backend.git

## Assignment 2

1. Write a basic sever set up with simple curd operation routes using Postgres and Golang.
2. ⁠Learn about message brokers, use rabbitMQ https://www.rabbitmq.com/tutorials/tutorial-one-go (read official docs and try out the examples)

## Mid Evals

- (for record adding this in the readme.)
  We will be having our mid eval on 12th june 10:30-10:45 PM.
  To following work is to be done:

1. Prepare a PPT, having all the topics we have covered till now
   - everyone should prepare and present some part of the ppt.
   - ⁠topics you may cover - [next js, go, storybook, git workflows, docker, nginx]
2. ⁠Prepare a demo of the application. Also someone can show the demo of the dashboard application.

### General guidelines

1. Be active and interact.
2. Try to finish all the topics and its content in the ppt by tonight.
3. Share the canva link in the group, and communicate between yourselves, which part you will cover. [Download here](/images/Campus%20Compass%20Mid%20Eval%20Presentation.pptx), [View here](https://www.canva.com/design/DAGqAwdCzdA/b-FG331X0L55C_hcLd0gSQ/edit)

## Discussion

Moving on to the backend design:

1. Database Scheme
   ![Database](/images/database.png)
2. Moderation Workflow
   ![Moderation](/images/moderation.png)
3. Routes
   ![Routes](/images/routes.png)

## Go server workflow
To understand server workflow it is recommended to read all the file at https://github.com/pclubiitk/Campus-Compass-25/tree/e35e1f6e12eb1adc80c5906de6cb0584eec5c500/compass/server

## Work Distribution Backend
1. Ritika, Aashutosh will be working on middleware and login
2. Shivang, Utkarsh  will be working on noticeboard related routes 
3. Yatin, Ujjwal, will be working on user dashboard routes 
4. ⁠Muragesh, Shivam sha will be working on review and location features.
5. ⁠Aditya, Vineesh, Shivanshdeep will be working on the mailing bot + indicator logic + email verfication
6. ⁠Archit, Himanshu will be working on the moderation bot.

## What are we using:

List all the libraries here, so we can maintain consistency by using other components form the same library

1. https://heroicons.dev/ for icons
