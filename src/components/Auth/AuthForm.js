import { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const navigate = useNavigate();


  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false)

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);

    let url ='';
    if (isLogin) {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDj-l_xO9dl616s4KyCXiZOzgrLe_bCh_g"
    } else {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDj-l_xO9dl616s4KyCXiZOzgrLe_bCh_g"
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true
      }),
      headers: {
        "Content-Type": 'application/json'
      }
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json()
            .then((data) => {
              //show error modal
              let errorMessage = 'Authentication failed !';
              // if (data && data.error && data.error.message) {
              //   errorMessage = data.error.message;
              // }
              
              throw new Error(errorMessage)
            });
        }
      }).then((data)=>{
        const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));
        authCtx.login(data.idToken, expirationTime.toISOString());
        navigate('/');
      })
      .catch((error)=>{
        alert(error.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Loading...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;