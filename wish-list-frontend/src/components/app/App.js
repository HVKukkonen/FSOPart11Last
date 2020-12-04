// const BackendWish = require('../../api/services/wishes.js');
import { useEffect, useState } from 'react';
import {
  BrowserRouter, Switch, Route, Link,
} from 'react-router-dom';
import { BackendWish } from '../../api/services/wishes';
import './App.css';

// --------------------------- form (visible: WISHER) -------------------------------------
const WishForm = (props) => <form onSubmit={props.addWish}>
  <div>
    <h2 className='main-title'>Add wish</h2>
    name:{'\xa0'}
    <input
      value={props.nameHolder}
      onChange={props.nameHandler}
    />
    <br/>
    description:{'\xa0'}
    <input
      value={props.descriptionHolder}
      onChange={props.descriptionHandler}
    />
    <br/>
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

// wish object creator, handles creation of new wishes and wishes from database query
const createWish = (name, description, url, taken, dbId) => {
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
  };

  return wish;
};

// --------------------------- table (visible: ALL) -------------------------------------------
// display entire cell content, used in mouseover for long text items
const Display = (text) => <div className='display'>
  {text.text}
</div>;

// formats wish item into data row, different formatting based on taken status
const FormatRow = (wish, functionality, buttonname, hoverFunction) => <tr className={(wish.taken === 1) ? 'taken-row' : 'untaken-row'}>
  <td>{wish.name}</td>
  <td onMouseOver={() => hoverFunction(wish.description)}>{wish.description}</td>
  <td className='url'><a href={wish.url} target='_blank'>{wish.url}</a></td>
  <td><button onClick={() => functionality(wish.id)}>{buttonname}</button></td>
</tr>;
// ----------------------------------------------------------------------------------------------

const App = () => {
  // state hook
  const [wishes, setWishes] = useState([]);

  // event hook for loading data from server
  useEffect(() => {
    console.log('note: the effect is run only after rendering');
    BackendWish
      .getAll()
      .then((response) => setWishes(response)); // save the response of the promise
  }, []); // [] means it's only done once

  // ------------------------------- WISHER -----------------------------
  // event handler for deleting wish from front- and backend
  const delWish = (id) => {
    // frontend
    const newWishes = wishes.filter((wish) => wish.id !== id);
    setWishes(newWishes);
    // backend
    BackendWish.remove(id);
  };

  // state hooks and input event handlers for form input
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
      .create(createWish(nameHolder, descriptionHolder, urlHolder, 0))
      // concat returned object to wishes, return object has id given by the db
      .then((response) => setWishes(wishes.concat(response.data)));

    console.log('latest wish not for console?', wishes);
    // reset input fields
    setName(''); setDescription(''); setUrl('');
  };
  // -----------------------------------------------------------------------------------

  // ---------------------------- Santa Claus ---------------------
  // event handler for changing taken status
  const take = (id) => {
    const taker = (wish) => {
      if (wish.id === id) {
        wish.taken = 1 - wish.taken; // flip taken status indicator
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

  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route path='/admin'>
            <Link to='/'>Santa Claus</Link>
            <WishForm
              addWish={formSubmitHandler}
              nameHolder={nameHolder}
              nameHandler={nameHandler}
              descriptionHandler={descriptionHandler}
              descriptionHolder={descriptionHolder}
              urlHandler={urlHandler}
              urlHolder={urlHolder}
            />
          </Route>
          <Route path='/'>
            <Link to='/admin'>admin</Link>
          </Route>
        </Switch>
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
              <Route path='/admin'>
                {wishes.map((wish) => FormatRow(wish, delWish, 'delete', setDisplay))}
              </Route>
              <Route path='/'>
                {wishes.map((wish) => FormatRow(wish, take, (wish.taken === 0) ? 'take' : 'untake', hoverFunction))}
              </Route>
            </Switch>
          </tbody>
        </table>
        <Switch>
          <Route path='/admin'></Route>
          <Route path='/'>
            <Display text={displayText}></Display>
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
