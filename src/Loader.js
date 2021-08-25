import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

function Loader() {
  return (
    <div>
      <div className="containerLoader">
        <div>
          <svg
            className="loader"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 340 340"
          >
            <circle cx="170" cy="170" r="160" stroke="#0d6efd" />
            <circle cx="170" cy="170" r="135" stroke="#404041" />
            <circle cx="170" cy="170" r="110" stroke="#0d6efd" />
            <circle cx="170" cy="170" r="85" stroke="#404041" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Loader;