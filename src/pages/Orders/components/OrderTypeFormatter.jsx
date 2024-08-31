import { Tag } from "antd";
import { CoffeeOutlined, CarOutlined } from "@ant-design/icons";

export default function OrderTypeFormatter({ type }) {
  switch (type) {
    case "DINE_HERE":
      return <Tag icon={<CoffeeOutlined />} color="green">Dine Here</Tag>
    case "TAKE_OUT":
      return <Tag icon={<CarOutlined />} color="red">Take Out</Tag>
    default:
      return null;
  }
}