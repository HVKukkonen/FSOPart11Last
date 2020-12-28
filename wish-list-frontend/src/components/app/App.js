/* eslint consistent-return:0 */

import { useEffect, useState } from 'react';
import {
  BrowserRouter, Switch, Route, Link, Redirect,
} from 'react-router-dom';
import { BackendWish } from '../../api/services/wishes';
import { BackendUser } from '../../api/services/users';
import { BackendLogin } from '../../api/services/login';
import './App.css';

const bcryptjs = require('bcryptjs');
const generatePassword = require('generate-password');

// --------------------------- form (visible: WISHER) -------------------------------------
const WishForm = (props) => <form onSubmit={props.addWish}>
  <div>
    <h2 className='main-title'>Add wish</h2>
    name:{'\xa0'}
    <input
      value={props.nameHolder}
      onChange={props.nameHandler}
    />
    <br />
    description:{'\xa0'}
    <input
      value={props.descriptionHolder}
      onChange={props.descriptionHandler}
    />
    <br />
    url:{'\xa0'}
    <input
      value={props.urlHolder}
      onChange={props.urlHandler}
    />
  </div>
  <div>
    <button type='submit'>
      Add
    </button>
  </div>
</form>;
// -------------------------------------------------------------------------------------------

// registering form
const RegisterForm = (props) => <form onSubmit={props.loginFormAction}>
  username:{'\xa0'}
  <input
    value={props.usernameHolder}
    onChange={props.usernameHandler}
  />
  <br />
  password:{'\xa0'}
  <input
    value={props.passwordHolder}
    onChange={props.passwordHandler}
  />
  <br />
  invite:{'\xa0'}
  <input
    value={props.inviteHolder}
    onChange={props.inviteHandler}
  />
  <br />
  <button type='submit'>
    Submit
  </button>
</form>;

// login form
const LoginForm = (props) => <form onSubmit={props.loginFormAction}>
  username:{'\xa0'}
  <input
    value={props.usernameHolder}
    onChange={props.usernameHandler}
  />
  <br />
  password:{'\xa0'}
  <input
    value={props.passwordHolder}
    onChange={props.passwordHandler}
  />
  <br />
  <button type='submit'>
    Submit
  </button>
</form>;

// wish object creator, handles creation of new wishes and wishes from database query
const createWish = (name, description, url, taken, wisher, taker, dbId) => {
  // use mongodb id for existing wishes, generate one for new; for DEV with dummy data only
  // const id = dbId || Math.random();

  // shorthand for name: name
  const wish = {
    key: dbId,
    id: dbId,
    name,
    description,
    url,
    taken,
    wisher,
    taker,
  };

  return wish;
};

const createUser = (username, password, role, linkedUsers, invitePass, wish, dbID) => {
  const user = {
    key: dbID,
    id: dbID,
    username,
    password,
    role,
    linkedUsers,
    invitePass,
    wish,
  };

  return user;
};

// generate invite string for wisher that enables inviting Santa(s)
// invite string is of form 'invitePasswordHash/wisher_dbID'
const generateInvite = (wisher) => {
  const invite = `${wisher.invitePass}/${wisher.id}`;
  window.alert(`Your invite is ${invite}`);
};

// --------------------------- table (visible: ALL) -------------------------------------------
// display entire cell content, used in mouseover for long text items
const Display = (text) => <div className='display'>
  {text.text}
</div>;

// formats wish item into data row, different formatting based on taken status
const FormatRow = (wish, functionality, buttonname, hoverFunction, showTaken) => <tr className={(wish.taken === 1 && showTaken) ? 'taken-row' : 'untaken-row'}>
  <td>{wish.name}</td>
  <td onMouseOver={() => hoverFunction(wish.description)}>{wish.description}</td>
  <td className='url'><a href={wish.url} target='_blank'>{wish.url}</a></td>
  <td><button onClick={() => functionality(wish.id)}>{buttonname}</button></td>
</tr>;
// ----------------------------------------------------------------------------------------------

// display user for admin view
const UserRow = (user, functionality, showUserWishes) => <tr className='untaken-row'>
  <td>{user.username}</td>
  <td><button onClick={() => functionality(user.id)}>delete</button></td>
  <td><button onClick={() => showUserWishes(user)}>wishes</button></td>
</tr>;

// logout
const LogOutButton = (setUser) => {
  const logOut = () => {
    // clear session credentials
    window.localStorage.clear();
    setUser({});
  };

  return <button onClick={() => logOut()}>Log out</button>;
};

// return to admin
const ToAdminButton = (setWisher) => {
  // reset wisher and redirect
  const resetWisher = () => {
    setWisher({});
    return <Redirect to='../admin' />;
  };

  return <button onClick={() => resetWisher()}>Admin</button>;
};

const App = () => {
  // for sanitising user input
  const illegalRegex = /[^A-Za-z0-9/]/;
  // -------------------------------------user creation & log in-----------------
  // login/register form handling
  const [usernameHolder, setUsername] = useState('');
  const usernameHandler = (charEvent) => {
    // sanitise by allowing only normal characters & numbers
    if (charEvent.target.value.search(illegalRegex) >= 0) {
      window.alert('Input contains illegal symbols. Only characters and numbers allowed.');
    } else {
      setUsername(charEvent.target.value);
    }
  };

  const [passwordHolder, setPassword] = useState('');
  const passwordHandler = (charEvent) => {
    // sanitise by allowing only normal characters & numbers
    if (charEvent.target.value.search(illegalRegex) >= 0) {
      window.alert('Input contains illegal symbols. Only characters, numbers, and slashes allowed.');
    } else {
      setPassword(charEvent.target.value);
    }
  };

  const [inviteHolder, setInvite] = useState('');
  const inviteHandler = (charEvent) => {
    // sanitise by allowing only normal characters & numbers
    if (charEvent.target.value.search(illegalRegex) >= 0) {
      window.alert('Input contains illegal symbols. Only characters and numbers allowed.');
    } else {
      setInvite(charEvent.target.value);
    }
  };

  // switch for changing between login and register, default login
  const [loginView, setLoginView] = useState(1);

  // registration form submit
  const registerFormSubmission = async (event) => {
    event.preventDefault();

    // check correct password/username length
    if (passwordHolder.length < 1 || usernameHolder.length < 1) {
      window.alert('Please, provide username and password');
      return;
    }

    let newUser;

    // parse wisher from invite string
    // invite string is of form 'invitePasswordHash/wisher_dbID
    if (inviteHolder) {
      // admin creation
      if (usernameHolder === 'admin') {
        // verify creation through password api
        if (await BackendLogin.requestToken({ adminSecret: inviteHolder })) {
          newUser = await BackendUser
            .create(createUser(usernameHolder, passwordHolder, 0));
          if (newUser) {
            setLoginView(1);
          }
        } else {
          window.alert('admin is not allowed as a username');
        }
        return;
      }

      // santa creation
      let inviteAsList;
      try {
        inviteAsList = inviteHolder.split('/');
      } catch (exception) {
        window.alert('Invite not in correct format');
        return; // exit
      }

      // check correct invite form
      if (inviteAsList.length !== 2) {
        window.alert('Invite not in correct format');
        return; // exit
      }

      const wisherId = inviteAsList[1];
      const wisher = await BackendUser.getOne(wisherId);

      // check invite validity
      if (wisher && bcryptjs.compare(inviteAsList[0], wisher.invitePass)) {
        // format input into proper object, update backend, save received object
        // invited user is always Santa linked to wisher, wish & inviteHash don't exist
        newUser = await BackendUser
          .create(createUser(usernameHolder, passwordHolder, 2, wisherId));
      } else {
        window.alert('error: invalid invite');
      }
    } else {
      // no invite string input --> generate wisher
      const invitePass = generatePassword.generate();
      newUser = await BackendUser
        .create(createUser(usernameHolder, passwordHolder, 1, null, invitePass));
    }

    // redirect after successful registering
    if (newUser) {
      // setUsername(''); setPassword(''); setInvite('');
      // redirect to login after registering
      setLoginView(1);
      // window.location = '../login';
    }
  };

  // logged in user
  const [loggedUser, logUser] = useState({});
  const [token, setToken] = useState(''); /* eslint no-unused-vars:0 */

  // log user in using session
  useEffect(() => {
    const userJSON = window.localStorage.getItem('user');
    const tokenJSON = window.localStorage.getItem('token');
    if (userJSON) {
      logUser(JSON.parse(userJSON));
      setToken(JSON.parse(tokenJSON));
    }
  }, []);

  // login form submit
  const loginFormSubmission = async (event) => {
    event.preventDefault();

    // format input into proper object
    const inputUser = {
      username: usernameHolder,
      password: passwordHolder,
    };

    // send to login backend, receive user and token if valid
    const response = await BackendLogin.requestToken(inputUser);
    if (response) {
      logUser(response.data.user);
      console.log('user logged details:', response.data.user);
      setToken(response.data.token);
      // remember session
      window.localStorage.setItem('user', JSON.stringify(response.data.user));
      window.localStorage.setItem('token', JSON.stringify(response.data.user));
    }
  };

  // wisher for showing relevant wishes
  const [wisher, setWisher] = useState({});

  // set the user the given user as wisher,
  // needed for cases where wisher is not the user logged in
  const setUserAsWisher = async (user) => {
    setWisher(await BackendUser.getOne(user.id));
  };

  // load wisher information from server
  useEffect(async () => {
    // logged in user is wisher
    if (loggedUser.role === 1) {
      setWisher(loggedUser);
    } else if (loggedUser.role === 2) {
      // logged in user is Santa
      await setUserAsWisher(loggedUser.linkedUsers);
    }
  }, [loggedUser]); // run effect after login

  // ----------------------------------------------WISHES---------------------------
  // state hook
  const [wishes, setWishes] = useState([]);

  // event hook for loading data from server
  useEffect(async () => {
    // fetch wishes only if wisher exists
    if (wisher && wisher.username && wisher.username.length > 0) {
      console.log('useEffect load of wishes for', wisher);
      const response = await BackendWish
        .getForWisher(wisher.id); // get only wishes of the wisher
      // .then((response) => setWishes(response)); // save the response of the promise
      setWishes(response.data);
    }
  }, [wisher]); // run effect as wisher changed, i.e. after login

  // ------------------------------- WISHER -----------------------------
  // event handler for deleting wish from front- and backend
  const delWish = (id) => {
    // frontend
    const newWishes = wishes.filter((wish) => wish.id !== id);
    setWishes(newWishes);
    // backend
    BackendWish.remove(id);
  };

  // ----------------------------- ADMIN view
  const [users, setUsers] = useState([]);

  useEffect(async () => {
    // fetch users only for admin
    if (loggedUser.role === 0) {
      setUsers(await BackendUser.getAll());
    }
  }, [loggedUser]);

  // event handler for deleting user
  const delUser = (id) => {
    // frontend
    const newUsers = users.filter((user) => user.id !== id);
    setUsers(newUsers);
    // backend
    BackendUser.remove(id);
  };

  // state hooks and input event handlers for wish form input
  // name
  const [nameHolder, setName] = useState('');
  const nameHandler = (charEvent) => setName(charEvent.target.value);
  // description
  const [descriptionHolder, setDescription] = useState('');
  const descriptionHandler = (charEvent) => setDescription(charEvent.target.value);
  // url
  const [urlHolder, setUrl] = useState('');
  const urlHandler = (charEvent) => setUrl(charEvent.target.value);

  // form submission handling
  const formSubmitHandler = (event) => {
    // prevent default form submission
    event.preventDefault();

    // format input into proper object, update backend
    BackendWish
      .create(createWish(nameHolder, descriptionHolder, urlHolder, 0, wisher.id))
      // concat returned object to wishes, return object has id given by the db
      .then((response) => setWishes(wishes.concat(response.data)));

    console.log('latest wish not for console?', wishes);
    // reset input fields
    setName(''); setDescription(''); setUrl('');
  };

  // ---------------------------- Santa Claus ---------------------
  // event handler for changing taken status
  const take = (id) => {
    const taker = (wish) => {
      // user can only take untaken and untake her own
      if (wish.id === id && (wish.taken === 0 || wish.taker === loggedUser.id)) {
        // flip taken status indicator
        wish.taken = 1 - wish.taken;
        // reset taker for taken, insert for untaken
        wish.taker = (wish.taker) ? null : loggedUser.id;
        BackendWish.update(id, wish); // backend
      }
      return (wish);
    };

    setWishes(wishes.map((wish) => taker(wish)));
  };

  // display text for long text items
  const [displayText, setDisplay] = useState('');

  // timeout id state hook for cancelling display removal
  const [timeoutId, setTimeoutId] = useState('');

  const hoverFunction = (text) => {
    // clear last timeout if one exists to display properly
    clearTimeout(timeoutId);
    setDisplay(text);
    // remove text after timeout, enable cancelling this action
    setTimeoutId(setTimeout(() => setDisplay(''), 10000));
  };

  // login page conditionally redirects already logged users based on their role
  const LoginPage = () => {
    // if user loggedin redirect
    if (loggedUser.username && loggedUser.username.length > 0) {
      // wisher
      if (loggedUser.role === 1) {
        return <Redirect to='../wisher' />;
      }
      // santa
      if (loggedUser.role === 2) {
        return <Redirect to='../' />;
      }
      // admin
      if (loggedUser.role === 0) {
        return <Redirect to='../admin' />;
      }
    } else {
      return <div>
        <button onClick={() => setLoginView(0)}>Register</button>
        <h2 className='main-title'>Login</h2>
        <LoginForm
          loginFormAction={loginFormSubmission}
          usernameHolder={usernameHolder}
          usernameHandler={usernameHandler}
          passwordHolder={passwordHolder}
          passwordHandler={passwordHandler}
        />
      </div>;
    }
  };

  const RegisterPage = () => <div>
    <button onClick={() => setLoginView(1)}>Login</button>
    <h2 className='main-title'>Register</h2>
    <RegisterForm
      loginFormAction={registerFormSubmission}
      usernameHolder={usernameHolder}
      usernameHandler={usernameHandler}
      passwordHolder={passwordHolder}
      passwordHandler={passwordHandler}
      inviteHolder={inviteHolder}
      inviteHandler={inviteHandler}
    />
  </div>;

  // functional component returning links and form for wisher page
  const WisherPage = () => {
    // console.log('at wisherpage logged user is', loggedUser);
    // console.log('at wisherpage wisher is', wisher);
    // // redirect unlogged users
    // if (!loggedUser.username || loggedUser.username.length < 1) {
    //   return <Redirect to='../login' />;
    // }

    // // redirect santa
    // if (loggedUser.role === 2) {
    //   return <Redirect to='../' />;
    // }

    // // redirect admin
    // if (loggedUser.role === 0 && !wisher) {
    //   console.log('wisher redirects to admin for wisher', wisher);
    //   return <Redirect to='../admin' />;
    // }

    const element = <div>
      {loggedUser.role === 0 ? ToAdminButton(setWisher) : null}
      <h2 className='main-title'>Generate invite link</h2>
      <button onClick={() => generateInvite(loggedUser)}>Invite</button>
      <WishForm
        addWish={formSubmitHandler}
        nameHolder={nameHolder}
        nameHandler={nameHandler}
        descriptionHandler={descriptionHandler}
        descriptionHolder={descriptionHolder}
        urlHandler={urlHandler}
        urlHolder={urlHolder}
      />
    </div>;

    return loggedUser.role === 1 ? element : null;
  };

  const AskLogin = () => {
    // redirect unlogged users
    if (!loggedUser.username || loggedUser.username.length < 1) {
      return <Redirect to='../login' />;
    }
  };

  const AdminPage = () => {
    // redirect unlogged users
    if (!loggedUser.username || loggedUser.username.length < 1) {
      return <Redirect to='../login' />;
    }

    // redirect santa
    if (loggedUser.role === 2) {
      return <Redirect to='../' />;
    }

    // redirect wisher
    if (loggedUser.role === 1) {
      return <Redirect to='../wisher' />;
    }

    // redirect admin to see wishes after wisher set
    if (wisher && wisher.username) {
      return <Redirect to='../' />;
    }

    const page = <div>
      {LogOutButton(logUser)}
      <table className='the-table'>
        <thead>
          <tr>
            <th>User</th>
            <th>Delete</th>
            <th>Wishes</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => UserRow(user, delUser, setUserAsWisher))}
        </tbody>
      </table>
    </div>;

    // users grouped by wisher
    return page;
  };

  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route path='/admin'>
            {AdminPage()}
          </Route>
          <Route path='/login'>
            {loginView === 1 ? LoginPage() : RegisterPage()}
          </Route>
          <Route path='/'>
            {AskLogin()}
            {LogOutButton(logUser)}
            {WisherPage()}
            <h1 className='main-title'>Christmas wish list 2020</h1>
            <table className='the-table'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>URL</th>
                  <th>Function</th>
                </tr>
              </thead>
              <tbody>
                <Switch>
                  <Route path='/wisher'>
                    {wishes.map((wish) => FormatRow(wish, delWish, 'delete', setDisplay, loggedUser.role !== 1))}
                  </Route>
                  <Route path='/'>
                    {wishes.map((wish) => FormatRow(wish, take, (wish.taken === 0) ? 'take' : 'untake', hoverFunction, loggedUser.role !== 1))}
                  </Route>
                </Switch>
              </tbody>
            </table>
            <Switch>
              <Route path='/wisher'></Route>
              <Route path='/'>
                <Display text={displayText}></Display>
              </Route>
            </Switch>
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
