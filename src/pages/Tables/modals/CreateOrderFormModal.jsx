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
const { TextArea } = Input;
import {
  DeleteTwoTone,
  UserAddOutlined,
  UsergroupAddOutlined,
  ContactsOutlined,
  PhoneOutlined,
  MailOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import SelectProductModal from "./SelectProductModal";
import { useLazyGetAllProductsQuery } from "../../../stores/productStore";
import { useCreateCustomerMutation, useLazyGetAllCustomersQuery } from "../../../stores/customerStore";
import { emailValidator } from "../../../utils/validators";
import { PAYMENT_METHODS } from "../../../common/constants/constants";
import { useCreateOrderMutation } from "../../../stores/orderStore";
import { useTableToTakenMutation } from "../../../stores/tableStore";

export default function CreateOrderFormModal({ open, onClose, tableData, refetch }) {
  const { token } = theme.useToken();
  const [api, contextHolder] = notification.useNotification();
  const [currentStep, setCurrentStep] = useState(0);
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
  const [total, setTotal] = useState(0);
  const [showProductModal, setShowProductModal] = useState(false);
  const [orderWithoutCustomer, setOrderWithoutCustomer] = useState(true);
  const [isCreateCustomer, setIsCreateCustomer] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomerItems, setSelectedCustomerItems] = useState([null]);
  const [notes, setNotes] = useState("");
  const [paymentMethodList, setPaymentMethodList] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");

  const [fetchProducts, { data: dataProducts, isLoading: isLoadingProducts }] =
    useLazyGetAllProductsQuery();

  const [
    fetchCustomers,
    { data: dataCustomers, isLoading: isLoadingCustomers },
  ] = useLazyGetAllCustomersQuery();

  const [createCustomer, { data: createCustomerData, isLoading: createCustomerIsLoading }] = useCreateCustomerMutation();
  const [createOrder, { data: createOrderData, isLoading: createOrderIsLoading }] = useCreateOrderMutation();
  const [tableToTaken, { data: tableToTakenData, isLoading: tableToTakenIsLoading }] = useTableToTakenMutation();

  useEffect(() => {
    const pm = PAYMENT_METHODS.map((method) => ({ value: method, label: method.toLowerCase().replace("_", " ") }));
    setPaymentMethodList(pm);
  }, []);

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

  useEffect(() => {
    if (!selectedProductsList || selectedProductsList.length === 0) setTotal(0);
    const orderTotal = selectedProductsList.reduce((fullTotal, currentProduct) => fullTotal + currentProduct?.total, 0);
    setTotal(orderTotal);
  }, [selectedProductsList]);

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
            <div style={{ width: "95%", display: "flex", flexDirection: "row", justifyContent: "end" }}><>Total: </><b>$ {total}</b></div>
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
                    maxLength={10}
                    minLength={10}
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
                    (!newCustomer.name || !newCustomer.last_name || !newCustomer.phone || newCustomer.phone.length !== 10 || isNaN(+newCustomer.phone) || !newCustomer.email || !emailValidator(newCustomer.email))
                  }
                  onClick={() => handleCreateCustomer()}
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
                      .includes(input?.toLowerCase())
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
      content: (
        <div style={{ marginBottom: "45px", padding: "0 15px", maxHeight: "300px", overflowY: "auto" }}>
          <TextArea
            showCount
            maxLength={100}
            onChange={e => setNotes(e.target.value)}
            value={notes}
            placeholder="disable resize"
            style={{ height: 120, resize: 'none' }}
          />
          <Select
            showSearch
            placeholder="Select a payment method"
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toLowerCase()
                .includes(input?.toLowerCase())
            }
            options={paymentMethodList ?? []}
            onChange={(e) => setPaymentMethod(e)}
            size="large"
            style={{ width: "150px" }}
          />
          <div style={{ border: "1px solid gray", borderRadius: "10px", marginTop: "30px", maxHeight: "300px", overflowY: "auto" }}>
            {
              (selectedProductsList && selectedProductsList.length > 0) && (
                selectedProductsList.map((product) => (
                  <div
                    key={product._id}
                    style={{ display: "flex", padding: "10px 10px" }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Text>Product: <b>{product?.name}</b></Text> <Text>Quantity: <b>{product?.selectedQuantity}</b></Text> <Text>Total: <b><Text>${product.total}</Text></b></Text>
                    </div>
                  </div>
                ))
              )
            }
          </div>
          <div style={{ marginTop: "30px", width: "90%", alignItems: "end"}}>Total: <Text>$ <b>{total}</b></Text></div>
          {
            (selectedCustomer) && (
              <div> <Text>Customer: <b>{selectedCustomer.name}</b></Text> </div>
            )
          }
        </div>
      ),
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
    setOrderWithoutCustomer(false);
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

  const handleCreateCustomer = async () => {
    const customerResponse = await createCustomer({ ...newCustomer, phone: `+52${newCustomer?.phone}` });
    if (!customerResponse) {
      api["error"]({
        message: "Error",
        description: "Customer couldn't be created.",
      });
      return;
    }
    await fetchCustomers();
    setSelectedCustomer(customerResponse.data);
    setIsCreateCustomer(false);
    setCurrentStep(2);
    setOrderWithoutCustomer(false);
    setNewCustomer({
      email: "",
      last_name: "",
      name: "",
      phone: "",
      status: true,
    });
  }

  const handleCreateOrder = async () => {
    let newOrder = {
      items: [],
      total: 0,
      type: "DINE_HERE",
      status: "PENDING",
      payment_method: "",
      customer: null,
      note: "",
    };
    const items = selectedProductsList?.map((product) => ({ product: product._id, price: product.price, quantity: product.selectedQuantity }));
    newOrder = {
      ...newOrder,
      items: items,
      total: total,
      payment_method: paymentMethod,
      customer: orderWithoutCustomer ? null : selectedCustomer._id,
      note: notes,
    };
    const orderResponse = await createOrder(newOrder);
    if (!orderResponse || !orderResponse?.data) {
      api["error"]({
        message: "Error",
        description: "Order couldn't be saved.",
      });
      return;
    }
    const tableResponse = await tableToTaken(
      {
        id: tableData?._id,
        body: {
          available: "TAKEN",
          current_order: orderResponse?.data?._id ?? null,
        },
      }
    );
    if (!tableResponse || !tableResponse?.data) {
      api["error"]({
        message: "Error",
        description: "Table couldn't be updated with status TAKEN.",
      });
      return;
    }
    await refetch();
    api["success"]({
      message: "Success",
      description: `Order ${orderResponse?.data?.order_number} created and table ${tableResponse?.data?.table_number} updated.`,
    });
    onClose();
  }

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
            display: "flex"
          }}
        >
          {currentStep < steps.length - 1 && (
            <Button
              disabled={
                currentStep === 0 &&
                (isThereSomeProductWithoutQuantity ||
                  selectedProductsList.length === 0 ||
                  total === 0
                ) ||
                (currentStep === 1 && (
                  !isCreateCustomer && (
                    !selectedCustomer
                  ) ||
                  (isCreateCustomer && (
                    !newCustomer.name ||
                    !newCustomer.last_name ||
                    !newCustomer.phone ||
                    !newCustomer.email ||
                    !emailValidator(newCustomer.email)
                  )) || isCreateCustomer
                ))
              }
              type="primary"
              onClick={() => next()}
            >
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button
              onClick={async () => {
                handleCreateOrder();
              }}
              disabled={!paymentMethod}
              type="primary"
            >
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
          {
            currentStep === 1 && (
              <div style={{ marginLeft: "20px" }}>
                <Button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setOrderWithoutCustomer(true);
                    next();
                  }}
                  icon={<UserDeleteOutlined />}
                >
                  Continue without customer
                </Button>
              </div>
            )
          }
        </div>
      </Modal>
    </>
  );
}
