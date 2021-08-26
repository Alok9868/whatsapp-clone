
import React from "react";
import "./Loader.css"

import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
function Loader() {
  return (
    <div className="cl100">
     <div class="d-flex justify-content-center margin100" >
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
    LOADING
</div>
    </div>
  );
}

export default Loader;