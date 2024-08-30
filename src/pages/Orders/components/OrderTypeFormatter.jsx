import { Tag } from "antd";
import { CoffeeOutlined, CarOutlined } from "@ant-design/icons";

export default function OrderTypeFormatter({ type }) {
  switch (type) {
    case "DINE_HERE":
      return <Tag bordered={false} icon={<CoffeeOutlined />} color="green">Dine Here</Tag>
    case "TAKE_OUT":
      return <Tag bordered={false} icon={<CarOutlined />} color="red">Take Out</Tag>
    default:
      return null;
  }
}