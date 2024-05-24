import React, { useState } from "react";
import { Divider, Card, Skeleton, Switch, Tag, Badge } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const { Meta } = Card;

export default function Tables() {
  const [loading, setLoading] = useState(true);
  const onChange = (checked) => {
    setLoading(!checked);
  };
  return (
    <>
      <Switch checked={!loading} onChange={onChange} />
      <Badge.Ribbon text="Hippies" color="cyan">
        <Card
          style={{
            width: 300,
            maxHeight: "300px",
            overflowY: "auto",
            marginTop: 16,
          }}
          actions={[
            <SettingOutlined key="setting" onClick={() => console.log("open settings")} />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
            <Meta title="Table No° 3" description="Capacidad de la mesa: 4" />
          </Skeleton>
          <Divider orientation="left" plain>
            { loading ? "Loading" : "Data" }
          </Divider>
          <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
          <Tag icon={<ClockCircleOutlined />} color="default">
            waiting
          </Tag>
            <p>Inicio: 19:45:05 hrs</p>
            <p>Order: KJO123456</p>
          </Skeleton>
        </Card>
      </Badge.Ribbon>
      <Badge.Ribbon text="Hippies">
        <Card
          style={{
            width: 300,
            maxHeight: "300px",
            overflowY: "auto",
            marginTop: 16,
          }}
          actions={[
            <SettingOutlined key="setting" onClick={() => console.log("open settings")} />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
            <Meta title="Table No° 3" description="Capacidad de la mesa: 4" />
          </Skeleton>
          <Divider orientation="left" plain>
            { loading ? "Loading" : "Data" }
          </Divider>
          <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
          <Tag icon={<SyncOutlined spin />} color="processing">
            processing
          </Tag>
            <p>Inicio: 19:45:05 hrs</p>
            <p>Order: KJO123456</p>
          </Skeleton>
        </Card>
      </Badge.Ribbon>
    </>
  );
}
