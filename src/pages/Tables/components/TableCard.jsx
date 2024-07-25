import { Divider, Card, Skeleton, Badge, Popconfirm } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  DownCircleFilled,
  ClockCircleFilled,
  DollarTwoTone,
  DollarCircleFilled,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import dayjs from "dayjs";
import tagWithColorValidator from "../utils/TagWithColorValidator";
const { Meta } = Card;

export default function TableCard({ tableData, loading, onCreate, setSelectedTable, onShowPaymentModal }) {
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
              <Popconfirm
                key="close"
                title="Confirm Payment"
                description="Are you sure you want to proceed with the payment for this table?"
                onConfirm={() => {
                  onShowPaymentModal();
                  setSelectedTable(tableData);
                }}
                onCancel={() => null}
                okText="Yes"
                cancelText="No"
                icon={<DollarCircleFilled />}
              >
                <DollarTwoTone
                  twoToneColor="#FF8484"
                />
              </Popconfirm>
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
          <div style={{ marginTop: "10px" }}>
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
                  <p>Started at: <b>{dayjs(tableData?.current_order?.createdAt).format("HH:mm:ss")}</b> hrs</p>
                  :
                  `check`
              }
            </p>
          </div>
        </Skeleton>
      </Card>
    </Badge.Ribbon>
  );
}
