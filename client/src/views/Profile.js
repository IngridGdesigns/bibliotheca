import React from "react";
import { Container, Row, Col } from "reactstrap";
// import { getConfig } from "../config";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
// import { callExternalApi } from "../services/axios-api-service";
// import axios from 'axios';


export const ProfileComponent = () => {

  const { user } = useAuth0();



  // const [users, setUsers] = useState(false);


  // if (!user) {
  //   return null;
  // }


  // function postUserToDb() {
  //   console.log(user.sub);
  //   console.log(user.name);
  //   console.log(user.email);
  //   console.log(user.assignedRoles);

  //   console.log(typeof user.sub);
  //   // const headers = { 'Authorization': `Bearer ${this.getAccessToken()}`}

  
  // }



//   const postUserToDb = async () => {
//     //    console.log(user.sub);
//     // console.log(user.name);
//     // console.log(user.email);
//     // console.log(user.assignedRoles);
//     const userdata = {
//       sub: user.sub, //string
//       name: user.name,
//       email: user.email,
//       role: user.assignedRoles
//     }
//     console.log(userdata.sub)

//       const token = await getAccessTokenSilently();
//     const options = {
  
// }
   



  // postUserToDb();
  //  postingToDB () { 
  //   this.getProfile((err, profile) => {
  //     if(err) {
  //       console.log(err)
  //       return 
  //     }
  //     const headers = { 'Authorization': `Bearer ${this.getAccessToken()}`}
  //     axios({
  //       method: 'POST',
  //       headers,
  //       url: 'http://localhost:3005/usersdata',
  //       data: profile
  //     })
  //     .then(res => {
  //       console.log(`the res is ${res}`)
  //     })
  //     .catch(err => {
  //       console.log('post error', err);
  //     });
  //   }) 
  // }

  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email} </p>
        </Col>
      </Row>
      <Row>
        <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
