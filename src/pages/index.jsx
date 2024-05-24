import { Outlet } from "react-router-dom";
import SideNavbar from "../components/SideNavbar";

export default function Root() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "98vh",
      }}
    >
      <SideNavbar />
      <section
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          margin: "10px 10px",
        }}
      >
        <Outlet />
      </section>
    </div>
  );
}
