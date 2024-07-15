import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Divider,
  notification,
  List,
  Typography,
  InputNumber,
  Steps,
  theme,
} from "antd";
const { Text } = Typography;
import { DeleteTwoTone } from "@ant-design/icons";
import { useLazyGetAllProductsQuery } from "../../../stores/productStore";
import SelectProductModal from "./SelectProductModal";
import { useLazyGetAllCustomersQuery } from "../../../stores/customerStore";

export default function CreateOrderFormModal({ open, onClose }) {
  const { token } = theme.useToken();
  const [api, contextHolder] = notification.useNotification();
  const [currentStep, setCurrentStep] = useState(0);
  const [order, setOrder] = useState({
    items: [],
    total: 0,
    type: "DINE_HERE",
    status: "PENDING",
    payment_method: "",
    customer: null,
    note: "",
  });
  const [productsList, setProductsList] = useState([]);
  const [selectedProductsList, setSelectedProductsList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [customersList, setCustomersList] = useState([]);
  console.log("🚀 ~ CreateOrderFormModal ~ customersList:", customersList)

  const [fetchProducts, { data: dataProducts, isLoading: isLoadingProducts }] =
    useLazyGetAllProductsQuery();

  const [
    fetchCustomers,
    { data: dataCustomers, isLoading: isLoadingCustomers },
  ] = useLazyGetAllCustomersQuery();

  useEffect(() => {
    fetchProducts();
    if (isLoadingProducts || !dataProducts) return;
    if (dataProducts?.length === 0) return;
    setProductsList(dataProducts ?? []);
  }, [dataProducts]);
  
  useEffect(() => {
    fetchCustomers();
    if (isLoadingCustomers || !dataCustomers) return;
    if (dataCustomers?.length === 0) return;
    setCustomersList(dataCustomers ?? []);
  }, [dataCustomers]);

  useEffect(() => {
    if (selectedProduct === null) return;
    if (selectedProductsList.length === 0) {
      setSelectedProductsList([
        { ...selectedProduct, total: 0, selectedQuantity: 0 },
      ]);
      return;
    }
    const findedProduct = selectedProductsList.find(
      (product) => product?._id === selectedProduct?._id
    );
    if (findedProduct) {
      return;
    }
    setSelectedProductsList((prev) => [
      ...prev,
      { ...selectedProduct, total: 0, selectedQuantity: 0 },
    ]);
  }, [selectedProduct]);

  const steps = [
    {
      title: "Order Products",
      content: (
        <>
          <Button onClick={() => setShowProductModal(true)}>
            Select Product
          </Button>
          <div style={{ overflow: "auto", height: "300px", padding: "0 20px" }}>
            <List
              itemLayout="horizontal"
              dataSource={selectedProductsList ?? []}
              loading={isLoadingProducts}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <InputNumber
                      value={item?.selectedQuantity ?? ""}
                      onChange={(newQuantity) => {
                        handleQuantityChange(newQuantity, item, index);
                      }}
                      placeholder="quantity"
                    />,
                    <DeleteTwoTone
                      onClick={() => handleDeleteProduct(item, index)}
                      twoToneColor="#FF8484"
                    />,
                  ]}
                >
                  <List.Item.Meta
                    title={<p>{item?.name}</p>}
                    description={item?.description}
                  />
                  <div style={{ display: "flex" }}>
                    <div style={{ marginRight: "10px" }}>
                      <Text>
                        Price: <b>{item?.price ?? 0}</b>
                      </Text>
                    </div>
                    <div>
                      <Text>
                        Total: <b>{item?.total ?? 0}</b>
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
          <SelectProductModal
            open={showProductModal}
            onClose={() => {
              setShowProductModal(false);
            }}
            productList={productsList}
            isLoadingProducts={isLoadingProducts}
            selectedProductsList={selectedProductsList}
            setSelectedProductsList={setSelectedProductsList}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
        </>
      ),
    },
    {
      title: "Customer",
      content: <>customer</>,
    },
    {
      title: "Notes",
      content: <>notes</>,
    },
  ];

  const next = () => {
    setCurrentStep(currentStep + 1);
  };
  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleDeleteProduct = (item, index) => {
    const filteredProducts = selectedProductsList?.filter(
      (product) => product?._id !== item?._id
    );
    setSelectedProductsList(filteredProducts);
  };

  const handleQuantityChange = (newQuantity, item, index) => {
    const updatedList = selectedProductsList?.map(
      (currentProduct, currentIndex) => {
        return index === currentIndex
          ? {
              ...currentProduct,
              selectedQuantity: newQuantity,
              total: currentProduct?.price * newQuantity,
            }
          : { ...currentProduct };
      }
    );
    setSelectedProductsList(updatedList);
  };

  const isThereSomeProductWithoutQuantity = selectedProductsList?.some(
    (product) => product?.total <= 0 || !product?.total
  );

  const items = steps?.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const contentStyle = {
    lineHeight: "100px",
    padding: "0 20px",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px solid ${token.colorBorder}`,
    marginTop: 16,
  };

  return (
    <>
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
        <Steps current={currentStep} items={items} />
        <div style={contentStyle}>{steps[currentStep].content}</div>
        <div
          style={{
            marginTop: 24,
          }}
        >
          {currentStep < steps.length - 1 && (
            <Button
              disabled={
                currentStep === 0 &&
                (isThereSomeProductWithoutQuantity ||
                  selectedProductsList.length === 0)
              }
              type="primary"
              onClick={() => next()}
            >
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" onClick={() => null}>
              Done
            </Button>
          )}
          {currentStep > 0 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
}
