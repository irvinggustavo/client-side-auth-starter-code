import React, { Component } from "react";
import "./App.css";
import axios from "axios";

const baseUrl = "http://localhost:8080";
const loginUrl = `${baseUrl}/login`;
const signupUrl = `${baseUrl}/signup`;
const profileUrl = `${baseUrl}/profile`;

class App extends Component {
  state = {
    isSignedUp: false,
    isLoggedIn: false,
    isLoginError: false,
    errorMessage: "",
  };

  login = (e) => {
    e.preventDefault();
    axios.post(loginUrl, {
      username: e.target.form.username.value,
      password: e.target.form.password.value,
    }).then(res => {
      localStorage.authToken = res.data.token
      this.setState({
        isLoggedIn : true
      })
    })
  };

  signup = (e) => {
    e.preventDefault();
    axios
      .post(signupUrl, {
        username: e.target.form.username.value,
        name: e.target.form.name.value,
        password: e.target.form.password.value,
      })
      .then((res) => {
        this.setState({
          isSignedUp: res.data.success,
        });
      });
    e.target.form.username.value = "";
    e.target.form.name.value = "";
    e.target.form.password.value = "";
  };

  renderSignUp() {
    return (
      <div>
        <h1>SignUp</h1>
        <form ref={(form) => (this.signUpForm = form)}>
          <div className="form-group">
            Username: <input type="text" name="username" />
          </div>
          <div className="form-group">
            Name: <input type="text" name="name" />
          </div>
          <div className="form-group">
            Password: <input type="password" name="password" />
          </div>
          <button className="btn btn-primary" onClick={this.signup}>
            Signup
          </button>
        </form>
      </div>
    );
  }

  renderLogin = () => {
    const { isLoginError, errorMessage } = this.state;
    return (
      <div>
        <h1>Login</h1>
        {isLoginError && <label style={{ color: "red" }}>{errorMessage}</label>}
        <form ref={(form) => (this.loginForm = form)}>
          <div className="form-group">
            Username: <input type="text" name="username" />
          </div>
          <div className="form-group">
            Password: <input type="password" name="password" />
          </div>
          <button className="btn btn-primary" onClick={this.login}>
            Login
          </button>
        </form>
      </div>
    );
  };

  render() {
    const { isLoggedIn, isSignedUp } = this.state;

    
    if (!isSignedUp) return this.renderSignUp();
    if (!isLoggedIn) return this.renderLogin();

    return (
      <div className="App">
        <Profile />
      </div>
    );
  }
}

class Profile extends Component {
  state = {
    isLoading: true,
    userInfo: {},
  };
  componentWillMount() {
   
    axios.get(profileUrl, {headers : {authorization: `BEARER\ ${localStorage.authToken}`}})
    .then(res => {
     
      this.setState({
        isLoading :false,
        userInfo :res.data
      })
    })
  }
  render() {
    const { isLoading, userInfo } = this.state;
    return isLoading ? <h1>Loading...</h1> : <h1>Welcome {userInfo.name}!</h1>;
  }
}

export default App;
