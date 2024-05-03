import auth0 from 'auth0-js';
import axios from 'axios';
const authConfig = require('../auth-config.json')

export default class Auth {
  accessToken;
  idToken;
  expiresAt;
  userProfile;

  auth0 = new auth0.WebAuth({
    domain: authConfig.domain,
    clientID: authConfig.clientId,
    redirectUri: authConfig.callbackUrl,
    audience: authConfig.audience,
    responseType: 'token id_token',
    scope: 'openid profile email write:user_items post:usersdata read:usersdata read:messages user_metadata app_metadata'
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.postingToDB = this.postingToDB.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        console.error('Authentication error:', err);
      }
    });
  }

  getAccessToken() { 
    return localStorage.getItem('access token');
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult) {
    localStorage.setItem('isLoggedIn', 'true');
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
    localStorage.setItem('access token', authResult.accessToken);
    // Redirect to home route
    window.location.href = '/home';
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        console.error('Error renewing session:', err);
      }
    });
  }

  getProfile(cb) {
    this.auth0.client.userInfo(this.accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  postingToDB () { 
    this.getProfile((err, profile) => {
      if(err) {
        console.error('Error getting profile:', err);
        return;
      }
      const headers = { 'Authorization': `Bearer ${this.getAccessToken()}`};
      axios.post('http://localhost:3005/usersdata', profile, { headers })
        .then(res => {
          console.log('Data posted successfully:', res.data);
        })
        .catch(err => {
          console.error('Post error:', err);
        });
    });
  }

  logout() {
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;
    this.userProfile = null;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('access token');
    this.auth0.logout({
      returnTo: window.location.origin
    });
    // Redirect to home route 
    window.location.href = '/';
  }

  isAuthenticated() {
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }
}
