# bibliotheca

A library management system where users can add, view, update, and delete books in a library.

# Tools and Technologies:

- Database: PostgreSQL
- Authentication & Authorization: Auth0
- Backend: NodeJS • Express • Javascript
- Frontend: React

## Getting Started

1. clone the repo

2. Install nvm or downlaod node version if system has nvm installed
``` bash
# installs NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# download and install Node.js
nvm install 20

# verifies the right Node.js version is in the environment
node -v # should print `v20.12.2`

# verifies the right NPM version is in the environment
npm -v # should print `10.5.0`
```

1. Go to main file directory and run `nvm use` to make sure you are using the node version in the .nvmrc file
1. Go to the backend directory and run `npm install`
1. Test the Express Server, go to your terminal and run `node server.js`
   navigate to [localhost:3001](https://localhost:3001/api/public), you should see:

```
{"message":"hi! you are on PORT: 3001 and live!"}

```

1. After adding in your Express endpoints you may also test them. To make this process simple, you can use cUrl from your terminal, which should work across operating systems. Just have your server running while curling in a different terminal or you can use [postman](https://www.postman.com/downloads/) to test.

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
1. [Getting Started with Auth0 series](https://auth0.com/docs/videos/get-started-series)
1. Highlights:

   1. [Configuring Scopes](https://auth0.com/docs/get-started/architecture-scenarios/spa-api/part-2#configure-the-authorization-extension)
   1. [Rules](https://auth0.com/docs/rules)
   1. [Customizaing error pages](https://auth0.com/docs/videos/get-started-series/brand-emails-and-error-pages)
   1. [Adding permission to users (assigning roles)](https://community.auth0.com/t/how-do-i-assign-permissions-to-users/72278)
   1. [Management API tutorial -](https://www.youtube.com/watch?v=VNgKNXgs7fQ)
   - Define your roles, Admin and Users and add permissions to each role
   - Go to Actions and create a [new action to automatically assign role to users](https://auth0.com/blog/assign-default-role-on-sign-up-with-actions/)
    
    ```javascript
    exports.onExecutePostLogin = async (event, api) => {


   <!-- Check if the user has a role assigned -->
  if (event.authorization && event.authorization.roles && event.authorization.roles.length > 0) {
    return;
  }

  <!-- // Create management API client instance -->
  const ManagementClient = require("auth0").ManagementClient;

  const management = new ManagementClient({
    domain: event.secrets.DOMAIN,
    clientId: event.secrets.CLIENT_ID,
    clientSecret: event.secrets.CLIENT_SECRET,
    audience: event.secrets.AUDIENCE,
  });
  
  const params =  { id : event.user.user_id };
  const data = { "roles" : ['YOUR ROLE ID FOR ROLE YOU CREATED'] };

  try {
    await management.users.assignRoles(params, data);
  } catch (e) {
    console.log(e);
  }
};```


# DFSKLJDF

```javascript

   exports.onExecutePostLogin = async (event, api) => {
   const namespace = 'roleType'
   if (event.authorization) {
    api.idToken.setCustomClaim(`${namespace}`, event.authorization.roles);
    api.accessToken.setCustomClaim(`${namespace}`, event.authorization.roles);

    }}

```
 - Yow will be able to view, for example admin or users just make sure you define the roles before to view your users roles.
 - You can curl to see your user or check client/views/External Api, you should see your role with other user info:
    ```<will insert screenshot>```



Milestones: 
- In the future I would like refactor to use Vite React to improve build performance.
