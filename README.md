# bibliotheca

A library management system where users can add, view, update, and delete books in a library.

# Tools and Technologies:

- Database: PostgreSQL
- Authentication & Authorization: Auth0
- Backend: NodeJS • Express • Javascript
- Frontend: React
- ReactHooks Form 

## Issues and some Troubleshooting: 

 - While trying to complete this project I found a discrepancy with using Auth0 inside Class components, kept getting issues, even though I referred to [React's docs](https://legacy.reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both), found some articles about using a hooks outside of [Class components](https://hackernoon.com/how-to-use-a-hook-in-a-class-component) wrapping my hooks to use inside the class. I was getting muliple errors, I rewrote and tried to get my code to function and got the following errors:

 ```bash
 Uncaught (in promise) Error: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.
 ```
Found a forum on using Auth0's for requesting accessTokens. After troubleshooting on my own and digging around, it states that I should use withAuth0, when using Class Components, instead of using ```{ useAuth0 }`` example:

``` 

import { withAuth0 } from "@auth0/auth0-react"; <--- use this >

import { useAuth0} from "@auth0/auth0-react"; <--- avoid if you are going to use Class components>

``` 

```javascript
class YourComponent extends Component {
  async methodThatNeedsToRetrieveAToken() {
    const { getAccessTokenSilently } = this.props.auth0;
    const token = await getAccessTokenSIlently();
    // use token
    console.log(token);
  }
}

export default withAuth0(YourComponent );

```

 1. So, if planning to use [class components in React visit for guidance](https://github.com/auth0/auth0-react/blob/main/EXAMPLES.md#use-with-a-class-component)

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

<img src="https://github.com/IngridGdesigns/bibliotheca/blob/main/assets/signinScreenshot.png" width="48%" height="50%">

1. Read Auth0 Resources to get started

## Auth0 Resources WIP

1. If planning to use [class components in React visit](https://github.com/auth0/auth0-react/blob/main/EXAMPLES.md#use-with-a-class-component)
1. To distiguish between a user and admin, use [claims check](https://github.com/auth0/auth0-react/blob/main/EXAMPLES.md#protecting-a-route-with-a-claims-check)
1. [Auth API Explorer](https://auth0.com/docs/api/authentication?javascript#get-user-info)
1. [How to make API calls to the Auth0 Management API.](https://auth0.com/docs/quickstart/spa/react/02-calling-an-api)
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


# 

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

## Resources

- image from : 
  - svg https://www.svgbackgrounds.com/elements/animated-svg-preloaders/
  - Animated SVG Preloaders by SVGBackgrounds.com

- favicon
 -book icon https://icons8.com/icon/112289/book
 https://icons8.com/icons/set/book
 faavicon

# More Auth0 helpful links
- https://auth0.com/docs/api/management/v2/users/get-user-roles

- https://auth0.com/docs/manage-users/user-accounts/metadata/manage-user-metadata
 
- https://auth0.com/docs/api/management/v2/users/get-user-roles

Milestones: 
- In the future I would like refactor to use Vite React to improve build performance.

<img src="https://github.com/IngridGdesigns/bibliotheca/blob/main/assets/signin.png" width="48%" height="50%">

<img src="https://github.com/IngridGdesigns/bibliotheca/blob/main/assets/bareBones.png" width="48%" height="50%">
