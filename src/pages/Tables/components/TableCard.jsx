import { useEffect, useState } from "react";
import { Divider, Card, Skeleton, Switch, Tag, Badge } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  DownCircleFilled,
  ClockCircleFilled,
  CloseCircleTwoTone,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import dayjs from "dayjs";
import tagWithColorValidator from "../utils/TagWithColorValidator";
const { Meta } = Card;

export default function TableCard({ tableData, loading, onCreate, setSelectedTable }) {
  return (
    <Badge.Ribbon text={tableData?.available} color={ tableData?.available === "AVAILABLE" ? "green" : "volcano" }>
      <Card
        style={{
          width: 300,
          maxHeight: "300px",
          overflowY: "auto",
          marginTop: 16,
        }}
        actions={[
          (
            tableData?.current_order ?
              <CloseCircleTwoTone key="close" onClick={() => console.log("open close")} twoToneColor="#FF8484" />
              :
              <PlusCircleTwoTone key="open"
                onClick={() => {
                  onCreate();
                  setSelectedTable(tableData);
                }}
                twoToneColor="#73CF6B"
              />
          ),
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
          <Meta title={`Table ${!isNaN(tableData?.table_number) ? "No°" : ""} ${tableData?.table_number}`} description={`Table capacity: ${tableData?.capacity}`} />
        </Skeleton>
        <Divider orientation="center" plain>
          {loading ? <ClockCircleFilled /> : <DownCircleFilled />}
        </Divider>
        <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
          {
            tagWithColorValidator(tableData?.current_order?.status ?? null)
          }
          <p>
            {
              tableData?.current_order ?
                <>
                  Order: <b>{tableData?.current_order?.order_number}</b>
                </>
                :
                `check`
            }
          </p>
          <p>
            {
              tableData?.current_order ?
                `Started at: ${dayjs(tableData?.current_order?.createdAt).format("HH:mm:ss")} hrs`
                :
                `check`
            }
          </p>
        </Skeleton>
      </Card>
    </Badge.Ribbon>
  );
}
