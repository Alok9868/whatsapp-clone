
import React from "react";
import "./Loader.css"
import Loader from "react-loader-spinner";
export default class App extends React.Component {
  //other logic
  render() {
    return (
      <div>
      <Loader
        type="Puff"
        color="#00BFFF"
        height={100}
        width={100}
        timeout={10000} //3 secs
      />
      </div>
    );
  }
}
