import { useState } from "react";
import { RouterProvider } from "react-router-dom";

import Login from "./pages/Login";

import { router } from "./routes";

import "./App.css";

function App() {
  const [logged, setLogged] = useState(false);

  return (
    <>
      {
        !logged ? (
          <Login logged={logged} setLogged={setLogged} />
        ) : (
          <RouterProvider router={router} />
        )
      }
    </>
  );
}

export default App;
