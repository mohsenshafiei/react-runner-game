import React from "react";
import ReactDOM from "react-dom";
import { Runner } from './runner';
const App = () => <Runner />
const rootElement = document.getElementById("root");

ReactDOM.render(<App />, rootElement);
