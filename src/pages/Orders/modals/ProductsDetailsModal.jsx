import React from "react";
import { Modal, Button, List, Space } from "antd";
import { DollarOutlined, NumberOutlined } from "@ant-design/icons";

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

export default function ProductsDetailsModal({ open, onClose, order }) {
  return(
    <Modal
      title={`Order products`}
      onCancel={onClose}
      open={open}
      footer={[
        <Button key="back" onClick={() => onClose()}>
          OK
        </Button>,
      ]}
    >
      <List
        itemLayout="horizontal"
        dataSource={order?.items ?? []}
        renderItem={
          (item, index) => (
            <List.Item
              actions={[
                <IconText
                  icon={DollarOutlined}
                  text={item?.price * item?.quantity}
                />,
                <IconText
                  icon={NumberOutlined}
                  text={item?.quantity}
                />,
              ]}
            >
              <List.Item.Meta
                title={item?.product?.name}
                description={item?.product?.description}
              />
            </List.Item>
          )
        }
      />
    </Modal>
  );
}