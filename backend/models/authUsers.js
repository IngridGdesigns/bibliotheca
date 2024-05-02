
// failed
const axios = require('axios');
const express = require('express');
require('dotenv').config({ debug: true }) //to use process.env
const ManagementClient = require('auth0').ManagementClient;

//// start tutorial

const app = express();
const PORT =  4040;

const { AUTH0_CLIENT_ID_MANAGE,
  AUTH0_SECRET_MANAGE,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_AUDIENCE,
  AUTH0_SECRET } = process.env

const managementAPI = new ManagementClient({ //Auth0 Management API
  domain: 'icodenow.auth0.com/oauth/token', 
  clientId: AUTH0_CLIENT_ID_MANAGE,
  clientSecret: AUTH0_SECRET_MANAGE, // _MANAGE,
  audience: `'https://${AUTH0_DOMAIN}/api/v2'`,
  grant_type: 'client_credentials',
  scope: 'read:users delete:users create:users read:users_metadata read:roles'
});

const getAccessToken = async () => {
  const getToken = async () => {
    return axios.post(`'https://${AUTH0_DOMAIN}/oauth/token}'`, {
      audience: `'https://${AUTH0_DOMAIN}/api/v2/'`,
      grant_type: 'client_credentials',
      client_id: `'${AUTH0_CLIENT_ID_MANAGE}'`,
      client_secret: `'${AUTH0_SECRET_MANAGE}'`,
    });
  }




};

app.get('/users', async (req, res) => {
    getUsers()
    .then(function(users) {
      res.send(users);
    })
    .catch(function(err) {
      console.log(err);
    });
});


async function getUsers(token) {
  const allUsers = [];
let page = 0;
while (true) {
  const {
    data: { users, total },
  } = await managementAPI.users.getAll({
    include_totals: true,
    page: page++,
  });
  allUsers.push(...users);
  if (allUsers.length === total) {
    break;
  } else {
    console.log('wut');
  }
}
}

app.listen(PORT, () => console.log(`API Server listening on port ${PORT}`));

/// end tutorial 

// var newUser = {
//         "name": "merlin",
//         "email": "test9@example.com",
//         "password": "2P27aifav0f!!--!?",
//         "connection": "Username-Password-Authentication"
//       };

//     var options = {
//       method: 'POST',
//       url: `https://${domain}/api/v2/users`,
//       data: newUser,
//       headers: {authorization: `Bearer ${mgmtApiAccessToken}`}
//     };
    
//     return axios.request(options).then(function (response) {
//         res.send(response.data);
//     }).catch(function (error) {
//       console.error(error);
//     });



// const getAccessToken = async () => {
//   return axios.post(`'https://${AUTH0_DOMAIN}/oauth/token}'`, {
//     audience: `'https://${AUTH0_DOMAIN}/api/v2/'`,
//     grant_type: 'client_credentials',
//     client_id: `'${AUTH0_CLIENT_ID_MANAGE}'`,
//     client_secret: `'${AUTH0_SECRET_MANAGE }'`,
//   });
// };

// const getUsers = async () => {
//    const { data: { access_token } } = await getAccessToken();
//   console.log(token);
//   const options = {
//     method: 'GET',
//     url: `'https://${AUTH0_DOMAIN}/api/v2/users/'`,
//     headers: { Authorization: `Bearer ${access_token}` },
//   };

//     try {
//     const data = await axios(options);
//     return data;
//   } catch (err) {
//     console.log(err);
//   }
// };


//  const options = {
//     method: 'GET',
//     url: `'https://${AUTH0_DOMAIN}/api/v2/users/'`,
//     headers: { Authorization: `Bearer ${access_token}` },
//   };
// console.log(getUsers())
// getUsers.get('/custom-text', (req, res) => {
//   getCustomText(req.query).then(({ data }) => {
//     res.status(200).send(data);
//   });
// });

// const management = new ManagementClient({ //Auth0 Management API
//   domain: AUTH0_DOMAIN, 
//   clientId: AUTH0_CLIENT_ID_MANAGE,
//   clientSecret: AUTH0_SECRET_MANAGE,
//   audience: `'https://${AUTH0_DOMAIN}/api/v2'`,

// });


// ---

// let mgmtApiAccessToken = "";

// function getMgmtApiAccessToken(){
//     var options = {
//         method: 'POST',
//         url: `https://${AUTH0_DOMAIN}/oauth/token`,
//         headers: {'content-type': 'application/x-www-form-urlencoded'},
//         data: new URLSearchParams({
//           grant_type: 'client_credentials',
//           client_id: AUTH0_CLIENT_ID_MANAGE,
//           client_secret: AUTH0_SECRET_MANAGE,
//           audience: `https://${AUTH0_DOMAIN}/api/v2/`
//         })
//       };
      
//       axios.request(options).then(async function (response) {
//         mgmtApiAccessToken = await response.data.access_token;
//         console.log("mgmtApiAccessToken ==> " + mgmtApiAccessToken)

//         return response.data.access_token;
//       }).catch(function (error) {
//         console.error(error);
//       });
// }


// app.get("/", async (req, res) => {
//     getMgmtApiAccessToken();
//     res.send({
//         msg: "Success",
//       });  
// });


// function createUser(){

// }

// app.get("/createUser", async (req, res) => {
//     var newUser ={
//         "email": "test6@verisave.com",
//         "password": "2PissMeOff!1",
//         "connection": "Username-Password-Authentication"
//       };

//     var options = {
//       method: 'POST',
//       url: `https://${AUTH0_DOMAIN}/api/v2/users`,
//       params: {
//        body: newUser
//       },
//       headers: {authorization: `Bearer ${mgmtApiAccessToken}`}
//     };
    
//     return axios.request(options).then(function (response) {
//         res.send(response.data);
//     }).catch(function (error) {
//       console.error(error);
//     });
// }); ///createUser



// /**
//  * getNextPage
//  * 
//  * @param {*} pageNumber 
//  * @param {*} recordsPerPage 
//  * @returns 
//  */
// function getNextPage(pageNumber, recordsPerPage){
//     var options = {
//       method: 'GET',
//       url: `https://${domain}/api/v2/users`,
//       params: {
//         q: 'email:*',
//         page: pageNumber,
//         per_page: recordsPerPage,
//         include_totals: 'true',
//         search_engine: 'v3',
//         sort: "created_at:1"
//       },
//       headers: {authorization: `Bearer ${mgmtApiAccessToken}`}
//     };
    
//     return axios.request(options).then(function (response) {
//         return new Promise((resolve, reject) => {
//             resolve(response.data);
//             reject("ERROR")
//         });
//     }).catch(function (error) {
//       console.error(error);
//     });
// }

// function getUserCount(){
//     var options = {
//         method: 'GET',
//         url: `https://${domain}/api/v2/users`,
//         params: {
//           q: 'email:*',
//           page: '0',
//           per_page: '2',
//           include_totals: 'true',
//           search_engine: 'v3',
//           sort: "created_at:1"
//         },
//         headers: {authorization: `Bearer ${mgmtApiAccessToken}`}
//       };
    
//     return axios.request(options).then(function (response) {
//         return new Promise((resolve, reject) => {
//             resolve(response.data.total);
//             reject("ERROR")
//         });
//     }).catch(function (error) {
//         console.error(error);
//     });
// }

// app.get("/getUsers", async (req, res) => {

//     getUserCount().then(
//         async (totalRecords) => {
//             console.log("userCount: " + totalRecords);
//             var recordsPerPage = 50;
//             var totalPages = Math.ceil(totalRecords /recordsPerPage);
//             var allResults = new Array();
//             var thisPage ;
//             console.log("totalPages: " + totalPages)
//             for (let pageNumber =0; pageNumber < totalPages; pageNumber++){
//                 thisPage = await getNextPage(pageNumber, recordsPerPage);
//                 allResults.push(thisPage.users);
//             }//for
 
//             res.send(allResults);
//         }
//     );
// }); ///getUsers

// getMgmtApiAccessToken();
// app.listen(PORT, () => console.log(`API Server listening on port ${port}`));