import React from 'react';
import './Welcome.css';


class Welcome extends React.Component {
  state = {
    signup: localStorage.username ? false : true,
    username: localStorage.username || '',
    password: '',
  };

  inputHandler = (e) => {
    if (e.target.name === 'confirm-password') {
      if (e.target.value !== this.state.password) {
        e.target.classList.add('invalid');
        e.target.setCustomValidity('Passwords must match')
      } else {
        e.target.setCustomValidity('');
        e.target.classList.remove('invalid');
      }
      return;
    }

    if (e.target.checkValidity()) e.target.classList.remove('invalid');
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();
    this.state.signup
     ? this.props.trySignup(this.state.username, this.state.password)
     : this.props.tryLogin(this.state.username, this.state.password);
  };

  clickHandler = () => {
    this.setState((state) => { return { signup: !state.signup } });
  }

  invalidHandler = (e) => {
    e.target.classList.add('invalid');
  };

  render() {
    return (
      <section className="Welcome">
        <div className="modal">
          <h2>ch<span>app.</span></h2>
          { this.props.state.loginErr
            ? <span className="error">{this.props.state.loginErr}</span>
            : null
          }
          <p>Welcome to my chat app... chapp!</p>
          <form onSubmit={this.submitHandler} onInvalid={this.invalidHandler}>
            <input
              onChange={this.inputHandler}
              value={this.state.username}
              placeholder="Username"
              type="text"
              minLength="2"
              maxLength="25"
              name="username"
              required
            />
            <input
              onChange={this.inputHandler}
              value={this.state.password}
              placeholder="Password"
              type="password"
              minLength="6"
              maxLength="55"
              name="password"
              required
            />
            { this.state.signup 
              ? <React.Fragment>
                  <input
                    onChange={this.inputHandler}
                    placeholder="Confirm Password"
                    type="password"
                    minLength="6"
                    maxLength="55"
                    name="confirm-password"
                    required
                  />
                  <button type="submit">Create User</button>
                  <span className="redirect" onClick={this.clickHandler}>Already a member?</span>
                </React.Fragment>
              : <React.Fragment>
                  <button type="submit">Login</button>
                  <span className="redirect" onClick={this.clickHandler}>Sign Up</span>
                </React.Fragment> 
            }
          </form>
        </div>
      </section>
    );
  }
}

export default Welcome;
