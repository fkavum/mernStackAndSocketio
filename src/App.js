import React from 'react';
import {BrowserRouter as Router,Route,Redirect} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import Navbar from "./components/navbar.js"
import ExercisesList from "./components/exercises-list.js";
import EditExercise from "./components/edit-exercise.js";
import CreateExercise from "./components/create-exercise.js";
import CreateUser from "./components/create-user.js";

import TextEditor from './components/textEditor/TextEditor';
import {v4 as uuidV4} from 'uuid';

function App() {
  return (
    <Router>
      <div className="container">
      <Navbar />
      <br/>
      <Route path="/" exact component={ExercisesList} />
      <Route path="/edit/:id" component={EditExercise} />
      <Route path="/create" component={CreateExercise} />
      <Route path="/user" component={CreateUser} />
      <Route path="/documents" exact>
          <Redirect to = {'/documents/' + uuidV4()} />
      </Route>
      <Route path="/documents/:id" ><TextEditor/></Route>
      </div>
    </Router>
  );
}
export default App;
 