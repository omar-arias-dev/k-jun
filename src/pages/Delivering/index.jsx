import { useEffect, useState } from "react";
import { Typography, Tooltip } from "antd";
const { Title } = Typography;
import { PlusCircleTwoTone } from "@ant-design/icons";
import { useLazyGetOrdersByTypeQuery } from "../../stores/orderStore";
import CreateOrderFormModal from "./modals/CreateOrderFormModal";

const TYPE = "DELIVERY";

export default function Delivering() {
  const [orders, setOrders] = useState([]);
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [getOrdersByType, { data: ordersByTypeData, isLoading: ordersByTypeIsLoading }] = useLazyGetOrdersByTypeQuery();

  useEffect(() => {
    getOrdersByType(TYPE);
  }, []);

  useEffect(() => {
    if (!ordersByTypeData) return;
    setOrders(ordersByTypeData);
  }, [ordersByTypeData]);

  return (
    <div style={{ width: "100%" }}>
      <header style={{ margin: "10px 0 20px 0", display: "flex", justifyContent: "space-between", padding: "0 35px" }}>
        <Title level={2}>Delivering</Title>
        <Tooltip title="Create order" placement="left">
          <PlusCircleTwoTone
            style={{ fontSize: '26px' }}
            twoToneColor={"#73CF6B"}
            onClick={() => setShowCreateOrderModal(true)}
          />
        </Tooltip>
      </header>
      <main>
        
      </main>
      <CreateOrderFormModal
        open={showCreateOrderModal}
        onClose={() => {
          setShowCreateOrderModal(false);
        }}
        refetch={getOrdersByType}
      />
    </div>
  );
}