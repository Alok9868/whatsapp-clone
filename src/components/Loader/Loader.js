
import React from "react";
import "./Loader.css"
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
export default class App extends React.Component {
  //other logic
  render() {
    return (
      <Loader
        type="Puff"
        color="#00BFFF"
        height={100}
        width={100}
        timeout={10000} //3 secs
      />
    );
  }
}
// function Loader() {
//   return (
//     <div className="cl100">
//      <div class="d-flex justify-content-center margin100" >
//   <div class="spinner-border" role="status">
//     <span class="visually-hidden">Loading...</span>
//   </div>
//     LOADING
// </div>
//     </div>
//   );
// }
