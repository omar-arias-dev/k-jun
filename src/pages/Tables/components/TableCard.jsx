import { useEffect, useState } from "react";
import { Divider, Card, Skeleton, Badge, Popconfirm, Tooltip, Dropdown, Space, notification } from "antd";
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
import {
  PAID,
  REOPENED,
  CANCELED,
  ORDER_STATUS_ARRAY,
} from "../../../constant/order";
import { useUpdateOrderStatusMutation } from "../../../stores/orderStore";
import { useCancelOrderTableMutation } from "../../../stores/tableStore";

export default function TableCard({ tableData, loading, onCreate, setSelectedTable, onShowPaymentModal, refetch }) {
  const [api, contextHolder] = notification.useNotification();
  const [selectableOrderStatusList, setSelectableOrderStatusList] = useState([]);
  const [updateOrderStatus, { data: updateOrderStatusData, isLoading: updateOrderStatusIsLoading }] = useUpdateOrderStatusMutation();
  const [cancelOrderTable, { data: cancelOrderTableData, isLoading: cancelOrderTableIsLoading }] = useCancelOrderTableMutation();
  
  useEffect(() => {
    if (!tableData?.current_order) return;
    const options = ORDER_STATUS_ARRAY
      ?.filter((status) => status !== PAID && status !== REOPENED)
      ?.filter((status) => status !== tableData?.current_order?.status)
      ?.map((status) => ({
        key: status,
        label: (
          <div
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            {
              status !== CANCELED ? (
                <div
                  onClick={async () => handleOrderStatusChange(tableData?.current_order?._id, status)}
                >
                  {tagWithColorValidator(status)}
                </div>
              ) : (
                <Popconfirm
                  title="Cancel order"
                  description="Are you sure to cancel this order?"
                  onConfirm={async () => {
                    const data = await cancelOrderTable(tableData?._id);
                    if (
                      !data ||
                      !data?.data ||
                      !data?.data?.table
                    ) {
                      api["error"]({
                        message: 'Error',
                        description:
                          'Table was not be updated.',
                      });
                      refetch();
                      return;
                    }
                    api["success"]({
                      message: 'Success',
                      description:
                        'Table was updated successfully.',
                    });
                    refetch();
                  }}
                  okText="Ok"
                  cancelText="No"
                >
                  {tagWithColorValidator(status)}
                </Popconfirm>
              )
            }
          </div>
        ),
        disabled: updateOrderStatusIsLoading,
      }));
    setSelectableOrderStatusList(options);
  }, [tableData]);

  const handleOrderStatusChange = async (orderId, status) => {
    const data = await updateOrderStatus({
      id: orderId,
      body: {
        status,
      },
    });
    if (
      !data ||
      !data?.data
    ) {
      return;
    }
    await refetch();
  }

  return (
    <Badge.Ribbon text={tableData?.available} color={ tableData?.available === "AVAILABLE" ? "green" : "volcano" }>
      {contextHolder}
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
          (
            tableData?.current_order ?
              <Tooltip title="Change order status">
                <Dropdown
                  menu={{ items: selectableOrderStatusList ?? [] }}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <EditOutlined key="edit" />
                    </Space>
                  </a>
                </Dropdown >
              </Tooltip>
              :
              <Tooltip title="Table has no order assigned">
                <EditOutlined key="edit" disabled />
              </Tooltip>
          ),
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
