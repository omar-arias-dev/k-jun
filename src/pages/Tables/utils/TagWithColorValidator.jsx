import { Tag } from "antd";
import {
  ClockCircleOutlined,
  DashOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  CloseCircleOutlined,
  IssuesCloseOutlined,
} from "@ant-design/icons";
import {
  PENDING,
  PREPARING,
  SERVED,
  PAID,
  CANCELED,
  REOPENED,
} from "../../../constant/order";

export default function tagWithColorValidator(status) {
  switch (status) {
    case null:
      return <Tag icon={<DashOutlined />} color="default">without order</Tag>
    case PENDING:
      return <Tag icon={<ClockCircleOutlined />} color="purple">{PENDING.toLowerCase()}</Tag>
    case PREPARING:
      return <Tag icon={<SyncOutlined spin />} color="processing">{PREPARING.toLowerCase()}</Tag>
    case SERVED:
      return <Tag icon={<CheckCircleOutlined />} color="success">{SERVED.toLowerCase()}</Tag>
    case PAID:
      return <Tag icon={<DollarOutlined />} color="gold">{PAID.toLowerCase()}</Tag>
    case CANCELED:
      return <Tag icon={<CloseCircleOutlined />} color="error">{CANCELED.toLowerCase()}</Tag>
    case REOPENED:
      return <Tag icon={<IssuesCloseOutlined />} color="cyan">{REOPENED.toLowerCase()}</Tag>
    default:
      return null;
  }
}