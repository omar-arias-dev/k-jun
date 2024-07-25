import { useState } from "react";
import { Modal, Button, Divider, Typography, notification, } from "antd";
const { Title, Text } = Typography;
import { useTableToAvailableMutation } from "../../../stores/tableStore";
import { useUpdateOrderStatusMutation } from "../../../stores/orderStore";

const PAID = "PAID";

export default function PaymentModal({ open, onClose, tableData, refetch }) {
  const [api, contextHolder] = notification.useNotification();
  const [splited, setSplited] = useState(false);

  const [tableToAvailable, { data: tableToAvailableData, isLoading: tableToAvailableIsLoading }] = useTableToAvailableMutation();
  const [updateOrderStatus, { data: updateOrderStatusData, isLoading: updateOrderStatusIsLoading }] = useUpdateOrderStatusMutation();

  const handleCloseOrder = async () => {
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
    onClose();
  }

  return (
    <Modal
      title={`Payment at table ${tableData?.table_number}`}
      centered
      open={open}
      onCancel={() => {
        onClose();
      }}
      footer={[
        <Button
          type="primary"
          onClick={async () => {
            await handleCloseOrder();
          }}
        >
          Pay
        </Button>,
        <Button
          onClick={() => {
            onClose();
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
    </Modal>
  );
}