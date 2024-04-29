# bibliotheca

A library management system where users can add, view, update, and delete books in a library.

# Tools and Technologies:

Database: PostgreSQL
Authentication & Authorization: Auth0
Backend: NodeJS • Express • Javascript
Frontend: Vite React (to improve build performance)

## Getting Started

1. clone the repo
1. Go to main file directory and run`nvm use` to make sure you are using the node version in the .nvmrc file, update node version as needed
1. Go to the backend directory and run `npm install`
1. Test the Express Server, go to your terminal and run `node server.js`
   navigate to [localhost:3001](https://localhost:3001/api/public), you should see:

```
{"message":"hi! you are on PORT: 3001 and live!"}

```

1. After adding in your Express endpoints you may also test them. To make this process simple, you can use cUrl from your terminal, which should work across operating systems.

```
// Get book by id
curl http://localhost:3001/api/books/items -i
```

1. Go to the client directory and run `npm install`
1. Make sure that client/package.json has the following line:
   `"proxy": "https://localhost:3001",` - This configuration tells React development server to proxy all API requests to backend server. It redirects to the express server
1. Start the React Development Server with ``npm start`, it will run on [localhost:3000](http://localhost:3000)
1. You should see an Auth0 signup page
1. Read Auth0 Resources to get started

## Auth0 Resources WIP

1. [Auth API Explorer](https://auth0.com/docs/api/authentication?javascript#get-user-info)
1. [Tutorial to get Auth0 in express project]()
1. [Getting Started with Auth0 series](https://auth0.com/docs/videos/get-started-series)
1. Highlights:

   1. [Configuring Scopes](https://auth0.com/docs/get-started/architecture-scenarios/spa-api/part-2#configure-the-authorization-extension)
   1. [Rules](https://auth0.com/docs/rules)
   1. [Customizaing error pages](https://auth0.com/docs/videos/get-started-series/brand-emails-and-error-pages)
   1. [Adding permission to users (assigning roles)](https://community.auth0.com/t/how-do-i-assign-permissions-to-users/72278)

   - Define your roles, Admin and Users and add permissions to each role
   - Go to Actions and create a new action, add the script below:
    
   ```javascript

   exports.onExecutePostLogin = async (event, api) => {
   const namespace = 'roleType'
   if (event.authorization) {
    api.idToken.setCustomClaim(`${namespace}`, event.authorization.roles);
    api.accessToken.setCustomClaim(`${namespace}`, event.authorization.roles);

    }} // After editing hit the deploy button

````
 - Yow will be able to view, for example admin or users just make sure you define the roles before to view your users roles.
 - You can curl to see your user or check client/views/External Api,  you should see your role with other user info:
    ```<will insert screenshot>```

````
