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
  Select,
  Descriptions,
  Input,
} from "antd";
const { Text, Title } = Typography;
import {
  DeleteTwoTone,
  UserAddOutlined,
  UsergroupAddOutlined,
  ContactsOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import SelectProductModal from "./SelectProductModal";
import { useLazyGetAllProductsQuery } from "../../../stores/productStore";
import { useLazyGetAllCustomersQuery } from "../../../stores/customerStore";
import { emailValidator } from "../../../utils/validators";

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
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    last_name: "",
    phone: "",
    email: "",
    status: true,
  });
  const [productsList, setProductsList] = useState([]);
  const [selectedProductsList, setSelectedProductsList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isCreateCustomer, setIsCreateCustomer] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomerItems, setSelectedCustomerItems] = useState([null]);

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
    setCustomers(dataCustomers);
    const selectableCustomers = dataCustomers?.map((customer) => ({
      value: customer?._id,
      label: `${customer?.name} ${customer?.last_name}`,
    }));
    setCustomersList(selectableCustomers);
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
                        Price: <b>$ {item?.price ?? 0}</b>
                      </Text>
                    </div>
                    <div>
                      <Text>
                        Total: <b>$ {item?.total ?? 0}</b>
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
      content: (
        <div style={{ marginTop: "15px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Title level={4}>Customer</Title>
            <Button
              onClick={() => setIsCreateCustomer(!isCreateCustomer)}
              icon={
                isCreateCustomer ? (
                  <UsergroupAddOutlined />
                ) : (
                  <UserAddOutlined />
                )
              }
            >
              {isCreateCustomer ? "Select customer" : "Create new customer"}
            </Button>
          </div>
          <Divider></Divider>
          {isCreateCustomer ? (
            <div>
              <div style={{ display: "flex" }}>
                <label style={{ width: "10%" }}>Name:</label>
                <div style={{ width: "80%", marginLeft: "10px" }}>
                  <Input
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewCustomer({
                        ...newCustomer,
                        name: value,
                      });
                    }}
                    value={newCustomer.name}
                    size="large"
                    placeholder="Name"
                    style={{ width: "100%" }}
                    prefix={<ContactsOutlined />}
                  />
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <label style={{ width: "10%" }}>Last name:</label>
                <div style={{ width: "80%", marginLeft: "10px" }}>
                  <Input
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewCustomer({
                        ...newCustomer,
                        last_name: value,
                      });
                    }}
                    value={newCustomer.last_name}
                    size="large"
                    placeholder="Last name"
                    style={{ width: "100%" }}
                    prefix={<ContactsOutlined />}
                  />
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <label style={{ width: "10%" }}>Phone:</label>
                <div style={{ width: "80%", marginLeft: "10px" }}>
                  <Input
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isNaN(Number(value))) {
                        return;
                      }
                      setNewCustomer({
                        ...newCustomer,
                        phone: value,
                      });
                    }}
                    value={newCustomer.phone}
                    size="large"
                    placeholder="Phone"
                    style={{ width: "100%" }}
                    prefix={<PhoneOutlined />}
                  />
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <label style={{ width: "10%" }}>Email:</label>
                <div style={{ width: "80%", marginLeft: "10px" }}>
                  <Input
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewCustomer({
                        ...newCustomer,
                        email: value,
                      });
                    }}
                    value={newCustomer.email}
                    status={(emailValidator(newCustomer.email) || (newCustomer.email === "")) ? "" : "error"}
                    size="large"
                    placeholder="Email"
                    style={{ width: "100%" }}
                    prefix={<MailOutlined />}
                  />
                </div>
              </div>
              <div style={{ width: "100%", display: "flex", justifyContent: "end", margin: "0 0 10px 0" }}>
                <Button
                  disabled={
                    (!newCustomer.name || !newCustomer.last_name || !newCustomer.phone || !newCustomer.email || !emailValidator(newCustomer.email))
                  }
                >
                  Create customer
                </Button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Select
                  showSearch
                  placeholder="Select a customer"
                  loading={isLoadingCustomers}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={customersList ?? []}
                  onChange={(e) => handleSelectCustomerChange(e)}
                  size="large"
                  style={{ width: "150px" }}
                />
              </div>
              <Divider type="vertical" />
              {selectedCustomer ? (
                <Descriptions
                  size="small"
                  title="User Info"
                  items={selectedCustomerItems}
                />
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      ),
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

  const handleSelectCustomerChange = (value) => {
    const findedCustomer =
      customers?.find((customer) => customer?._id === value) ?? null;
    if (!findedCustomer) {
      api["error"]({
        message: "Error",
        description: "Customer not found. Reload please.",
      });
      return;
    }
    setSelectedCustomer(findedCustomer);
    setSelectedCustomerItems([
      {
        key: "1",
        label: "Name",
        children: `${findedCustomer?.name} ${findedCustomer?.last_name}`,
      },
      {
        key: "2",
        label: "Phone",
        children: `${findedCustomer?.phone}`,
      },
      {
        key: "3",
        label: "Email",
        children: `${findedCustomer?.email}`,
      },
      {
        key: "4",
        label: "Created At",
        children: `${dayjs(findedCustomer?.createdAt).format("DD/MM/YYYY")}`,
      },
    ]);
  };

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
      {contextHolder}
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
