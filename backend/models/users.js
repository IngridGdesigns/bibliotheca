const bcrypt = require('bcryptjs')
const pool = require('../database')

// CREATE TABLE users (
//     member_id integer DEFAULT nextval('library_member_member_id_seq'::regclass) PRIMARY KEY,
//     name character varying(50) NOT NULL,
//     email character varying(30) NOT NULL UNIQUE,
//     password character varying(30),
//     role character varying(50) NOT NULL
// );

/* 
auth0 returns
     console.log(user.sub);
    console.log(user.name);
    console.log(user.email);
    console.log(user.assignedRoles);


*/

/********************************
        Users table CRUD 
********************************/

// Gets all users table 
const getUsers = async (req, res) => {
   
    const client = await pool.connect();
    
    client.query('SELECT * FROM users', (err, results) => {
        // handleErrorOrReturnData();
        if (err) {
            console.log('error oh noes!!', err)
            res.status(500).send('Server error');
            client.release();
        } 
        else {
            console.log('data fetched successfully');
            res.status(200).json(results.rows);
            client.release();
        }
    })
}

// get user by id
const getUserById = async (req, res) => {
    const client = await pool.connect();

    let id = parseInt(req.params.member_id);

    await client.query('SELECT * FROM users WHERE member_id =$1', [id], (err, result) => {
      if (err) {
          res.status(500).send(err);
          client.release()
      } 
      else { //res.json(dbitems.rows[0] )
          res.status(200).json(result.rows[0])
          client.release()
      }
    })
}


// add new user
const createUser = async (req, res) => {
    const client = await pool.connect();

    // auth0 returns
    //  console.log(user.sub);
    // console.log(user.name);
    // console.log(user.email);
    // console.log(user.assignedRoles);

    let user_id = req.body.sub ?? req.body.user_id// auth0 id
    let name = req.body.name;
    let email = req.body.email;
    // const hashedPwd = await bcrypt.hash(`${req.body.password}`, 10); //bcrypt.hashSync(req.body.password, 8); // encryption - hash a password
    let role = req.body.role;
    

     if (!email || !role ) {
      return res.status(400).json({ error: 'user_id, name, email and role are required' });
    }

    await client.query('INSERT INTO USERS(user_id, name, email, role) VALUES($1, $2, $3, $4) RETURNING *',
        [user_id, name, email, role], (err, result) => {
            if (err) {
                res.status(500).send('Server error')
                client.release()
            } else {
                res.status(200).json(result.rows[0])
                client.release()
            }
    })
}

// update user by member_id
const updateUserById = async (req, res) => {
    const client = await pool.connect();
    const memberId = parseInt(req.params.member_id);
    
    const name = req.body.name;
    const email = req.body.email;
    const role = req.body.role;
    // const hashedPwd = await bcrypt.hash(`${password}`, 10);

   
    await client.query('UPDATE users SET name = $1, email = $2, role = $3 WHERE member_id = $4 RETURNING *',
        [name, email, role, memberId]), (err, results) => {
            if(err){
           console.log('Oh noes you have an error!!')
           res.status(500).send('There is a server error')
           client.release()
       }
       else {
           console.log(`User:${name} - ${memberId} was succesfully deleted`)
           res.status(200).end()
           client.release()
       }
   
        }
}

// delete by user member id
const deleteUser = async (req, res) => {
    const client = await pool.connect();
    const memberId = parseInt(req.params.member_id);
    const name = req.params.name;


    await client.query('DELETE FROM users WHERE member_id = $1', [memberId], (err, results) => {
         if(err){
           console.log('Oh noes you have an error!!')
           res.status(500).send('There is a server error')
           client.release()
       }
       else {
           console.log(`User:${name} - ${memberId} was succesfully deleted`)
           res.status(200).end()
           client.release()
       }
   })
}


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUser
};
