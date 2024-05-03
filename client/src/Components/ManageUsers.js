import { useState, useEffect } from 'react';
import { withAuth0 } from '@auth0/auth0-react';

const ManageUsers = () => {
    const [users, setUsers] = useState(false);
    
    const getAccessToken = () => { 
        const accessToken = localStorage.getItem('access token');
        
    if(!accessToken) {
        return new Error('No access token found');
        } 
        
    return accessToken;
      
  }


  function getUsers() {
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getAccessToken()}` }
      
    fetch('http://localhost:3001/api/users', {
        method: 'GET',
        headers
    })
      .then(response => {
        console.log(response)
        return response.text();
      })
      .then(data => {
        setUsers(data);
      });
    
  }

  function createUser() {
    let name = prompt('Enter user name');
    let email = prompt('Enter user email');
    let role = prompt('Enter role');
    let password = prompt('Enter fake password')
      
    //   const accessToken = await getAccessTokenSilently();
      
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getAccessToken()}` }
      
    fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
      body: JSON.stringify({name, email, role, password}),
    })
        .then(response => {
            console.log(response.status)
            console.log(response.body)
        return response.text();
      })
      .then(data => {
          alert(data);
        //   
        setUsers();
      });
  }

  function deleteUser() {
      let member_id = prompt('Enter member id');
       const headers = { 'Content-Type': 'application/json','Authorization': `Bearer ${getAccessToken()}`}
    fetch(`http://localhost:3001/api/users/delete/${member_id}`, {
        method: 'DELETE',
        headers
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
          alert(data);
        //   setUsers(JSON.parse(data));
        setUsers(getUsers());
      });
  }

    function updateUser() {
        let member_id = prompt('Enter member id')
        let name = prompt('Enter new user name');
        let email = prompt('Enter new user email');
        let role = prompt('Enter user role');

    const headers = { 'Content-Type': 'application/json','Authorization': `Bearer ${getAccessToken()}`}

    fetch(`http://localhost:3001/api/users/update/${member_id}`, {
        method: 'PUT',
        headers,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
      body: JSON.stringify({name, email, role}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
          alert(data);
        //   setUsers(JSON.parse(data));
        setUsers(getUsers());
      });
  }

  useEffect(() => {
      getUsers();
      
  });
    return (
        <>
        <div>
        {users ? users : 'There is no user data available'}
      <br />
      <button onClick={createUser}>Add user</button>
      <br />
      <button onClick={deleteUser}>Delete user</button>
      <br />
      <button onClick={updateUser}>Update user</button>
    </div > 
        </>
  );
}
export default withAuth0(ManageUsers);









// //  const { apiOrigin = "http://localhost:3001"} = getConfig();
// //   const { user, getAccessTokenSilently } = useAuth0();

// //    const [users, setUsers] = useState(false);

// // async function getUserssToDb() {
// //   // const apiServerUrl = process.env.REACT_APP_SERVER_URL;
// //   const accessToken = await getAccessTokenSilently();
// //   console.log(user);
// //   console.log(user.sub)
// //   let users = {
// //     name: user.name,
// //     email: user.email,
// //     user_id: user.sub,
// //     role: user.assignedRoles,
// //   }

// //   const config = {
// //     url: `${apiOrigin}api/users/create`,
// //     method: "POST",
// //     headers: { Authorization: `Bearer ${accessToken}`},
// //     data: JSON.stringify(users)
// //   };

// //   axios(config).then(response => {
// //     console.log(`the res is ${response}`)
// //   })
// //     .catch(err => {
// //       console.log('post error', err);
// //   })
// // };
  
// // getUserssToDb()