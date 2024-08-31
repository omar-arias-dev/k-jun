import React from "react";
import { useNavigate } from "react-router-dom";
import { Image, Menu } from "antd";
import {
  ShoppingOutlined,
  SettingOutlined,
  DashboardOutlined,
  BookOutlined,
  GoldOutlined,
  LogoutOutlined,
  TruckOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import kJunLogo from "./../../assets/logo/k-jun-logo.png";

const items = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <DashboardOutlined />,
  },
  {
    key: "tables",
    label: "Tables",
    icon: <GoldOutlined />,
  },
  {
    key: "orders",
    label: "Orders",
    icon: <ShoppingOutlined />,
    children: [
      {
        key: "orders-list",
        label: "Orders List",
      },
      /* {
        key: "orders-create",
        label: "Create Order",
      }, */
    ],
  },
  {
    key: "delivering",
    label: "Delivering",
    icon: <TruckOutlined />,
  },
  {
    key: "products",
    label: "Menu",
    icon: <BookOutlined />,
    children: [
      {
        key: "products-list",
        label: "Products List",
      },
      {
        key: "products-create",
        label: "Create Product",
      },
    ],
  },
  {
    key: "reservation",
    label: "Reservations",
    icon: <CalendarOutlined />,
  },
  {
    type: "divider",
  },
  {
    key: "configuration",
    label: "Configuration",
    icon: <SettingOutlined />,
    children: [
      {
        key: "configuration-users",
        label: "Users",
      },
    ],
  },
  {
    type: "divider",
  },
  {
    key: "logout",
    label: "Logout",
    icon: <LogoutOutlined />,
    danger: true,
  },
];
export default function SideNavbar() {

  const navigate = useNavigate();

  const handleMenuItemClick = ({ key }) => {
    switch (key) {
      case "dashboard":
        navigate("/");
        break;
      case "orders-list":
        navigate("/orders/list");
        break;
      case "orders-create":
        navigate("/orders/create");
        break;
      case "products-list":
        navigate("/products/list");
        break;
      case "products-create":
        navigate("/products/create");
        break;
      case "tables":
        navigate("/tables");
        break;
      default:
        break;
    }
  };

  return (
    <nav style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "10px auto",
          padding: "8px 10px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
        }}
      >
        <Image
          src={kJunLogo}
          width={150}
          height={40}
          preview={false}
          alt="k-jun-logo"
          onError={() => console.log("logo cannot be loaded")}
        />
      </div>
      <Menu
        items={items}
        onClick={(event) => handleMenuItemClick(event)}
        defaultSelectedKeys={["dashboard"]}
        mode="inline"
        style={{
          width: 256,
          height: "100%",
          overflowY: "auto",
          borderRadius: "10px",
          margin: "0 5px",
        }}
      />
    </nav>
  );
}
