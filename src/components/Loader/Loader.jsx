import React from "react";
import { InfinitySpin } from "react-loader-spinner";
import "./Loader.css";

function Loader() {
  return (
    <div className="Loader">
      <InfinitySpin
          visible={true}
          width="200"
          color="#ff0000"
          ariaLabel="infinity-spin-loading"
      />
    </div>
  );
}

export default Loader;
