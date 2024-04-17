import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import UserProfile from './Components/UserProfile';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log in</button>;
};

const LogOutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ logoutParams: {returnTo: window.location.origin}})}>Log out</button>
  )
}

function App() {
  return (
    <div className="App">
      <p>to edit</p>
      <LoginButton />
      <LogOutButton />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
    <UserProfile />
    </div>
  );
}

export default App;
