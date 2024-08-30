import { useEffect, useState } from "react";
import { Button, Table, Typography, Input } from "antd";
const { Title } = Typography;
import dayjs from "dayjs";
import { useLazyGetAllPopulatedPaginatedOrdersQuery } from "../../../stores/orderStore";
import OrderTypeFormatter from "../components/orderTypeFormatter.jsx";
import PaymentMethodFormatter from "../components/PaymentMethodFormatter.jsx";
import { moneyFormatter } from "../../../utils/functions/currencyFormatter.js";
import tagWithColorValidator from "../../Tables/utils/TagWithColorValidator.jsx";

const columns = [
  {
    title: 'Order number',
    dataIndex: 'order_number',
    align: "center",
    render: (orderNumber) => (<b>{orderNumber}</b>),
  },
  {
    title: 'Total',
    dataIndex: 'total',
    align: "center",
    render: (total) => moneyFormatter(total),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    align: "center",
    render: (type) => (<OrderTypeFormatter type={type} />),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    align: "center",
    render: (status) => tagWithColorValidator(status),
  },
  {
    title: 'Payment method',
    dataIndex: 'payment_method',
    align: "center",
    render: (paymentMethod) => (<PaymentMethodFormatter paymentMethod={paymentMethod} />),
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    align: "center",
    render: (date) => (<>{dayjs(date).format('DD/MM/YYYY')}</>),
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    align: "center",
    render: (date) => (<>{dayjs(date).format('DD/MM/YYYY')}</>),
  },
];

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [getOrders, { data: getOrdersData, isLoading: getOrdersIsLoading }] = useLazyGetAllPopulatedPaginatedOrdersQuery();

  useEffect(() => {
    getOrders({ keyword, page, limit });
  }, [page, limit, keyword]);

  useEffect(() => {
    if (getOrdersData && getOrdersData?.orders) {
      setOrders(getOrdersData?.orders);
    }
    if (getOrdersData && getOrdersData?.total_documents) {
      setTotal(getOrdersData?.total_documents);
    }
  }, [getOrdersData]);

  const onShowSizeChange = (e, f) => {
    setPage(1);
    setLimit(f);
  }

  const onPaginationChange = (e) => {
    setPage(e);
  }

  const handleKeywordChange = (e) => {
    const toSearch = e.target.value;
    setPage(1);
    setLimit(10);
    setKeyword(toSearch);
  }

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div style={{ width: "100%" }}>
      <header style={{ margin: "20px 0", display: "flex", justifyContent: "space-between", padding: "0 35px" }}>
        <Title level={2}>Orders</Title>
      </header>
      <div style={{ marginBottom: "4px" }}>
        <Input
          size="large"
          placeholder="large size"
          addonBefore="Search by order number"
          maxLength={10}
          onChange={handleKeywordChange}
        />
      </div>
      <Table
        rowKey={"_id"}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={orders}
        loading={getOrdersIsLoading}
        size="small"
        pagination={{
          defaultCurrent: page,
          pageSizeOptions: [10, 15, 20, 25, 50],
          total,
          showSizeChanger: true,
          onShowSizeChange: onShowSizeChange,
          onChange: onPaginationChange,
          position: ["bottomRight",],
        }}
      />
    </div>
  );
};
