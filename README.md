# Ticket Management System - openUI5

-> This is my master project and on the other hand aimed to enhance my UI5 skills which I have been learning since end of september 2024.

**Frontend:** OpenUI5  
**Backend:** Node.js, Express  
**DB:** PostreSQL  

## Small Overview of Rules
- User can create & delete Customers, Team Members.
- User is also able to Create & Edit & Delete tickets.
- Each ticket has an assignee that is one of the created team members. On each creation and modification on Ticket, the assignee is notified via Email. After every change, an email is sent to the provided email address of the team member.
- While creating or editing a ticket, multiple files can be attached to ticket.
- On Edit ticket page, comments can be written and they are listed at the end of Edit Ticket Page, if there are any Comments provided on that Ticket before.

There is no login and user authentication implemented in this project. Another improvement could be maybe a logging mechanism about changes who did what.

## Getting Started

-> You need to download Node.js and Postresql.

**1.** Create the tables as provided below. Dont forget the foreign key relations. For tables File and TicketComment, Action defined on the Foreign key to the Ticket Table. If you set the **ON DELETE** Action to **CASCADE** (see the second screenshot below), if any Ticket is deleted, entries inside File & TicketComment having foreign key to the this deleted ticket(s), are deleted automatically. Which ensures that you do not need to make any explicit implementation in logic to delete related entires. This also increases performance as no longer needed entries are kept in tables.
![image](https://github.com/user-attachments/assets/1f416db8-87ec-4759-82d3-5470a4cec05a)

![image](https://github.com/user-attachments/assets/334c474f-edee-4b2b-9683-6f4dcdb972aa)  

**2.** Create an **.env** file in the **backend-rest-api** folder.

**.env** file is used to store configuration settings, environment variables, and sensitive information securely. Create as in the screenshot below.  

- DB_DATABASE is the Database name created in Postresql. Important is also to provide the password of this DB.
- Other configurations are the Oauth configs to be able to send emails. To set it up you can refer to [this commit message](https://github.com/alikapllan/Ticket-Management-System-openui5/commit/06da058d5ae2c0e7d144e5fa098522cde66ed443).
  
![image](https://github.com/user-attachments/assets/f8c8a1dc-b7ad-43ec-8147-dc9c5dbf5fd0)

**3.** Install dependencies

- Run **npm install** on **tmui5** & **backend-rest-api** folders level.

**4.** Start app

- Run **npm start** first on **backend-rest-api** folder level to connect to PostreSQL.
- Then run **npm start** on **tmui5** folder level to start app UI.


## A Video on how Ticket Management App works
