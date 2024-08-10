import { useEffect, useState } from "react";
import { Modal, Button, Divider, Typography, notification, Space, Segmented, Input, InputNumber, Avatar, } from "antd";
const { Title, Text } = Typography;
import { PlusOutlined, UserOutlined, } from "@ant-design/icons";
import { useTableToAvailableMutation } from "../../../stores/tableStore";
import { useUpdateOrderStatusMutation, useUpdateOrderHistoryMutation } from "../../../stores/orderStore";
import { randomColorGenerator } from "../../../utils/functions/randomColorGenerator";

const PAID = "PAID";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function PaymentModal({ open, onClose, tableData, refetch }) {
  const [api, contextHolder] = notification.useNotification();
  const [splited, setSplited] = useState(false);
  const [orderSplited, setOrderSplited] = useState({
    total: tableData?.current_order?.total ?? 0,
    paid: 0,
    remainingAmount: tableData?.current_order?.total ?? 0,
    users: [],
  });

  const [currentUser, setCurrentUser] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    if (!tableData || !tableData?.current_order) return;
    setOrderSplited({
      ...orderSplited,
      remainingAmount: tableData?.current_order?.total ?? 0,
      total: tableData?.current_order?.total ?? 0,
    });
  }, [tableData]);

  const [tableToAvailable, { data: tableToAvailableData, isLoading: tableToAvailableIsLoading }] = useTableToAvailableMutation();
  const [updateOrderStatus, { data: updateOrderStatusData, isLoading: updateOrderStatusIsLoading }] = useUpdateOrderStatusMutation();
  const [updateOrderHistory, { data: updateOrderHistoryData, isLoading: updateOrderHistoryLoading }] = useUpdateOrderHistoryMutation();

  const handleClose = () => {
    setOrderSplited({
      total: 0,
      paid: 0,
      remainingAmount: 0,
      users: [],
    });
    setSplited(false);
    setCurrentUser("");
    setSelectedUser("");
    onClose();
  }

  const handleCloseOrder = async () => {
    if (splited && orderSplited?.users?.length > 1) {
      const users = orderSplited?.users?.map((user) => `${user?.username ?? "user"}: $${user?.paid ?? 0}`);
      const note = `Order bill was splited by ${users.join(", ")}.`;
      const updatedOrder = await updateOrderHistory({
        id: tableData?.current_order?._id ?? null,
        body: [{ note }],
      });
    }
    const updatedOrder = await updateOrderStatus({ id: tableData?.current_order?._id, body: { status: PAID } });
    if (!updatedOrder || !updatedOrder?.data) {
      api["error"]({
        message: "Error",
        description: "Order couldn't be updated with status PAID.",
      });
      return;
    }
    const updatedTable = await tableToAvailable({ id: tableData?._id, body: { available: "AVAILABLE", current_order: tableData?.current_order?._id } });
    if (!updatedTable || !updatedTable?.data) {
      api["error"]({
        message: "Error",
        description: "Table couldn't be updated with status AVAILABLE. Order was updated with status PAID.",
      });
      return;
    }
    api["success"]({
      message: "Success",
      description: "Order and table was closed.",
    });
    await refetch();
    handleClose();
  }

  const handleAddNewUser = () => {
    const newUsers = [...orderSplited.users];
    const uniqueValue = `${orderSplited.users.length + 1}-${currentUser.replace(/\s/g, '')}-${Date.now()}`;
    setOrderSplited((prev) => ({
      ...prev,
      users: [...newUsers, {
        label: (
          <div
            style={{
              padding: 4,
            }}
          >
            <Avatar
              style={{
                backgroundColor: randomColorGenerator(),
              }}
            >
              {currentUser?.split("")?.[0]?.toUpperCase()}
            </Avatar>
            <div>{currentUser}</div>
          </div>
        ),
        value: uniqueValue,
        username: capitalizeFirstLetter(currentUser),
        paid: 0,
      }]
    }));
    setCurrentUser("");
  }

  const handleCurrentUserPaidChange = (newValue) => {
    if (!selectedUser) return;
    setOrderSplited(prev => {
      const userIndex = prev.users.findIndex(user => user.value === selectedUser);
      if (userIndex === -1) return prev;
      const remainingTotal = totalPaid - prev.users[userIndex].paid;
      if (remainingTotal + newValue > prev.total) return prev;
      const updatedUsers = [...prev.users];
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        paid: newValue,
      };
      return {
        ...prev,
        users: updatedUsers,
      };
    });
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    const filteredUsers = orderSplited.users.filter(user => user.value !== selectedUser);
    setOrderSplited((prev) => ({
      ...prev,
      users: filteredUsers,
    }));
    setSelectedUser("");
  }

  useEffect(() => {
    if (totalPaid > orderSplited.total) return;
    const total = orderSplited.total;
    setOrderSplited(prev => ({ ...prev, paid: totalPaid, remainingAmount: totalPaid - total }));
  }, [orderSplited.users]);

  const getSelectedUser = () => orderSplited?.users?.find((user) => user.value === selectedUser);
  const totalPaid = orderSplited?.users?.reduce((total, currentUser) => total + currentUser.paid, 0);

  return (
    <Modal
      title={`Payment at table ${tableData?.table_number}`}
      centered
      open={open}
      onCancel={() => {
        handleClose();
      }}
      footer={[
        <Button
          type="primary"
          onClick={async () => {
            await handleCloseOrder();
          }}
          disabled={
            (
              splited && (
                !orderSplited ||
                !orderSplited.users ||
                !orderSplited.users.length === 0 ||
                !orderSplited.paid ||
                !orderSplited.total ||
                orderSplited.paid < orderSplited.total ||
                orderSplited.paid > orderSplited.total ||
                tableToAvailableIsLoading ||
                updateOrderStatusIsLoading ||
                updateOrderHistoryLoading
              )
            )
          }
        >
          Pay
        </Button>,
        <Button
          onClick={() => {
            handleClose();
          }}
        >
          Cancel
        </Button>,
      ]}
      width={"60%"}
    >
      {contextHolder}
      <Divider></Divider>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        <div style={{ display: "flex" }}>
          <Title level={5}>Order {tableData?.current_order?.order_number}</Title>
        </div>
        <div>
          <Text>Total: <b>$ {tableData?.current_order?.total}</b></Text>
        </div>
        <div>
          <Text>Payment method: <b>{tableData?.current_order?.payment_method?.toLowerCase() ?? tableData?.current_order?.payment_method}</b></Text>
        </div>
      </div>
      <Divider></Divider>
      <div>
        <Button 
          type="primary"
          onClick={() => {
            setSplited(!splited);
          }}
        >
         {splited ? "One pay" :  "Split the bill?"}
        </Button>
      </div>
      {
        splited && (
          <div style={{ marginTop: "10px" }}>
            <div>
              <Space>
                <Space> 
                  <Text strong>Paid:</Text>
                  <Text>$ {orderSplited.paid}</Text>
                </Space>
                <Divider type="vertical" />
                <Space> 
                  <Text strong>Total:</Text>
                  <Text>$ {orderSplited.total}</Text>
                </Space>
                <Divider type="vertical" />
                <Space> 
                  <Text strong>Remaining amount:</Text>
                  <Text>$ {(orderSplited.remainingAmount > 0 ? orderSplited.remainingAmount : orderSplited.remainingAmount * -1).toFixed(2)}</Text>
                </Space>
              </Space>
            </div>
            <div style={{ marginTop: "30px" }}>
              <div>
                {
                  orderSplited.users.length === 0 && (
                    <div style={{ margin: "10px 0" }}>
                      <Text type="danger">Add a customer</Text>
                    </div>
                  )
                }
                {/* <div style={{ display: "flex", width: "40%" }}>
                  <Input
                    value={currentUser}
                    onChange={(e) => {
                      setCurrentUser(e.target.value);
                    }}
                    minLength={2}
                    maxLength={15}
                    size="small"
                    placeholder="Customer name"
                    prefix={<UserOutlined />}
                  />
                  <Button disabled={(currentUser.length < 2) || (orderSplited.paid === orderSplited.total)} onClick={handleAddNewUser} type="primary" shape="circle" icon={<PlusOutlined />} />
                </div> */}
                <Space.Compact
                  style={{
                    width: '100%',
                  }}
                >
                  <Input
                    value={currentUser}
                    onChange={(e) => {
                      setCurrentUser(e.target.value);
                    }}
                    minLength={2}
                    maxLength={15}
                    prefix={<UserOutlined />}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && currentUser.length >= 2 && orderSplited.paid !== orderSplited.total) {
                        handleAddNewUser();
                      }
                    }}
                  />
                  <Button disabled={(currentUser.length < 2) || (orderSplited.paid === orderSplited.total)} onClick={handleAddNewUser} type="primary" shape="circle" icon={<PlusOutlined />} />
                </Space.Compact>
              </div>
              <section style={{ display: "flex", flexDirection: "column" }}>
                <div>
                  <Segmented
                    options={orderSplited.users}
                    onChange={(e) => {
                      const clickedUser = orderSplited.users.find((user) => user.value === e) ?? null;
                      if (!clickedUser) return;
                      setSelectedUser(e);
                    }}
                  />
                </div>
                {
                  selectedUser && (
                    <div>
                      <Text>Select {getSelectedUser()?.username ?? "user"}'s payment:</Text>
                      <div style={{ display: "flex" }}>
                        <InputNumber
                          placeholder={`Input ${getSelectedUser()?.username ?? "user"}'s payment`}
                          value={getSelectedUser()?.paid ?? 0}
                          controls={false}
                          onKeyDown={(e) => {
                            const currentValue = e.currentTarget.value;
                            const isDot = e.key === ".";
                            const dotCount = currentValue.split('.').length - 1;
                            if (isDot && dotCount >= 1) {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            const currentValue = e ?? 0;
                            if (isNaN(+currentValue)) return;
                            handleCurrentUserPaidChange(+currentValue);
                          }}
                        />
                        <Button
                          danger
                          onClick={handleDeleteUser}
                        >
                          Remove {getSelectedUser()?.username ?? "user"}
                        </Button>
                      </div>
                    </div>
                  )
                }
              </section>
            </div>
          </div>
        )
      }
    </Modal>
  );
}