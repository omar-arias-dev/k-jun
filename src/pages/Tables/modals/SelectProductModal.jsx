import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Divider,
  notification,
  List,
  Typography,
  Tag,
  Input,
} from "antd";
const { Text } = Typography;
import { PlusCircleTwoTone, DollarOutlined, NumberOutlined } from "@ant-design/icons";

export default function SelectProductModal({ open, onClose, productList, isLoadingProducts, selectedProduct, setSelectedProduct }) {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (query === "") {
      setFilteredData(productList);
    };
    const filtered = productList?.filter((product) => product?.name?.toLowerCase()?.includes(query?.toLowerCase()));
    setFilteredData(filtered);
  }, [query]);

  return (
    <Modal
      title={`Create order`}
      centered
      open={open}
      onCancel={() => {
        //if (createdTableLoading) return;
        onClose();
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            //if (createdTableLoading) return;
            onClose();
          }}
        >
          Cancel
        </Button>,
      ]}
      width={"60%"}
    >
      <Divider></Divider>
      <div style={{ overflow: "auto", height: "300px", padding: "0 20px" }}>
        <Input
          placeholder="serch for a product"
          allowClear={true}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <List
          itemLayout="horizontal"
          dataSource={filteredData ?? []}
          loading={isLoadingProducts}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  icon={<PlusCircleTwoTone />}
                  onClick={() => {
                    setSelectedProduct(item);
                    onClose();
                  }}
                >
                  Select
                </Button>
              ]}
            >
              <List.Item.Meta
                title={<p>{item?.name}</p>}
                description={item?.description}
              />
              <div>
                <Tag icon={<DollarOutlined />} color="gold">Price: {item?.price}</Tag>
                <Tag icon={<NumberOutlined />} color="magenta">Quantity: {item?.quantity}</Tag>
              </div>
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
}