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
  TruckOutlined,
  BlockOutlined,
  NumberOutlined,
  FieldNumberOutlined,
  AimOutlined,
  EnvironmentOutlined,
  FieldBinaryOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import SelectProductModal from "./../../Tables/modals/SelectProductModal";
import { useLazyGetAllProductsQuery } from "../../../stores/productStore";
import { useCreateCustomerMutation, useLazyGetAllCustomersQuery } from "../../../stores/customerStore";
import { emailValidator } from "../../../utils/validators";
import { PAYMENT_METHODS } from "../../../common/constants/constants";
import { useCreateOrderMutation } from "../../../stores/orderStore";
import { useLazyGetAllCustomerAddressesQuery, useCreateAddressMutation } from "../../../stores/addressStore";

export default function CreateOrderFormModal({ open, onClose, refetch }) {
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
  const [selectedCustomerItems, setSelectedCustomerItems] = useState(null);
  const [notes, setNotes] = useState("");
  const [paymentMethodList, setPaymentMethodList] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [addressesList, setAddressesList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isCreateAddress, setIsCreateAddress] = useState(false);
  const [formAddress, setFormAddress] = useState({
    street: "",
    street_number: "",
    apartment_number: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    status: "",
    customer: "",
  });

  const [fetchProducts, { data: dataProducts, isLoading: isLoadingProducts }] =
    useLazyGetAllProductsQuery();

  const [
    fetchCustomers,
    { data: dataCustomers, isLoading: isLoadingCustomers },
  ] = useLazyGetAllCustomersQuery();

  const [createCustomer, { data: createCustomerData, isLoading: createCustomerIsLoading }] = useCreateCustomerMutation();
  const [createAddress, { data: createAddressData, isLoading: createAddressIsLoading }] = useCreateAddressMutation();
  const [createOrder, { data: createOrderData, isLoading: createOrderIsLoading }] = useCreateOrderMutation();
  const [getAddressesByCustomer, { isLoading: getAddressesByCustomerIsLoading }] = useLazyGetAllCustomerAddressesQuery();

  useEffect(() => {
    const pm = PAYMENT_METHODS
      .filter(method => method === "CASH")
      .map((method) => ({ value: method, label: method.toLowerCase().replace("_", " ") }));
    setPaymentMethodList(pm);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (isLoadingProducts || !dataProducts) return;
    if (dataProducts?.length === 0) return;
    setProductsList(dataProducts ?? []);
  }, [dataProducts, isLoadingProducts]);

  useEffect(() => {
    if (isLoadingCustomers || !dataCustomers) return;
    if (dataCustomers?.length === 0) return;
    setCustomers(dataCustomers);
    const selectableCustomers = dataCustomers?.map((customer) => ({
      value: customer?._id,
      label: `${customer?.name} ${customer?.last_name}`,
    }));
    setCustomersList(selectableCustomers);
  }, [dataCustomers, isLoadingCustomers]);

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

  useEffect(() => {
    if (currentStep === 2 && selectedCustomer && selectedCustomer?._id) {
      const handleFetchAddressesByCustomer = async () => {
        const response = await getAddressesByCustomer(selectedCustomer?._id);
        if (!response?.data) {
          api["error"]({
            message: "Error",
            description: `${selectedCustomer?.name}'s addresses not found. Error at fetching addresses.`,
          });
        }
        setAddresses(response?.data ?? []);
        const selectableAddresses = (response?.data && response?.data?.length)
          ? response?.data?.map(address => ({
            value: address?._id ?? "",
            label: `${address?.street ?? "~"} - ${address?.city ?? "~"} - ${address?.zip_code ?? "~"} - ${address?.state ?? "~"}`
          }))
          : [];
        setAddressesList(selectableAddresses);
        setIsCreateAddress(selectableAddresses?.length === 0);
      }
      handleFetchAddressesByCustomer();
    }
  }, [currentStep]);

  const handleClose = () => {
    onClose();
    setCurrentStep(0);
    setNewCustomer({
      name: "",
      last_name: "",
      phone: "",
      email: "",
      status: true,
    });
    setSelectedProductsList([]);
    setSelectedProduct(null);
    setTotal(0);
    setOrderWithoutCustomer(true);
    setIsCreateCustomer(false);
    setSelectedCustomer(null);
    setSelectedCustomerItems(null);
    setNotes("");
    setPaymentMethod("");
  }

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
                    (createCustomerIsLoading || !newCustomer.name || !newCustomer.last_name || !newCustomer.phone || newCustomer.phone.length !== 10 || isNaN(+newCustomer.phone) || !newCustomer.email || !emailValidator(newCustomer.email))
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
      title: "Shipping Address",
      content: (
        <div style={{ margin: "0 0" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {
              selectedCustomer && (
                <div>
                  <Button
                    onClick={() => setIsCreateAddress(!isCreateAddress)}
                    icon={<TruckOutlined />}
                    disabled={addressesList.length === 0 && isCreateAddress}
                  >
                    { isCreateAddress ? "Select address" : "Create address" }
                  </Button>
                </div>
              )
            }
            <div>
              {
                (!isCreateAddress && addressesList?.length > 0 && selectedCustomer) ? (
                  <Select
                    showSearch
                    placeholder="Select an address"
                    loading={getAddressesByCustomerIsLoading}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input?.toLowerCase())
                    }
                    options={addressesList ?? []}
                    onChange={(e) => handleSelectAddress(e)}
                    size="large"
                    style={{ width: "150px" }}
                  />
                ) : (
                  <div>
                    <div style={{ display: "flex" }}>
                      <label style={{ width: "10%" }}>Street:</label>
                      <div style={{ width: "80%", marginLeft: "10px" }}>
                        <Input
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormAddress({
                              ...formAddress,
                              street: value,
                            });
                          }}
                          value={formAddress.street}
                          status={!formAddress.street ? "error" : ""}
                          placeholder="Street"
                          minLength={5}
                          size="large"
                          style={{ width: "100%" }}
                          prefix={<BlockOutlined />}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>
                      <label style={{ width: "25%" }}>Street number:</label>
                      <div style={{ width: "55%"}}>
                        <Input
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormAddress({
                              ...formAddress,
                              street_number: value,
                            });
                          }}
                          value={formAddress.street_number}
                          status={!formAddress.street_number ? "error" : ""}
                          placeholder="Street number"
                          size="large"
                          style={{ width: "100%" }}
                          prefix={<NumberOutlined />}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>
                      <label style={{ width: "25%" }}>Apartment number:</label>
                      <div style={{ width: "55%"}}>
                        <Input
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormAddress({
                              ...formAddress,
                              apartment_number: value,
                            });
                          }}
                          value={formAddress.apartment_number}
                          placeholder="Apartment number"
                          size="large"
                          style={{ width: "100%" }}
                          prefix={<FieldNumberOutlined />}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>
                      <label style={{ width: "25%" }}>City:</label>
                      <div style={{ width: "55%"}}>
                        <Input
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormAddress({
                              ...formAddress,
                              city: value,
                            });
                          }}
                          value={formAddress.city}
                          status={!formAddress.city ? "error" : ""}
                          placeholder="City"
                          size="large"
                          style={{ width: "100%" }}
                          prefix={<AimOutlined />}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>
                      <label style={{ width: "25%" }}>State:</label>
                      <div style={{ width: "55%"}}>
                        <Input
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormAddress({
                              ...formAddress,
                              state: value,
                            });
                          }}
                          value={formAddress.state}
                          status={!formAddress.state ? "error" : ""}
                          placeholder="State"
                          size="large"
                          style={{ width: "100%" }}
                          prefix={<EnvironmentOutlined />}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>
                      <label style={{ width: "25%" }}>Zip code:</label>
                      <div style={{ width: "55%"}}>
                        <Input
                          onKeyDown={(event) => {
                            const regex = /^[0-9\b]+$/;
                            if (!regex.test(event.key) && event.key !== 'Backspace') {
                              event.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormAddress({
                              ...formAddress,
                              zip_code: value,
                            });
                          }}
                          value={formAddress.zip_code}
                          status={(!formAddress.zip_code || formAddress.zip_code.length < 5) ? "error" : ""}
                          maxLength={5}
                          placeholder="Zip code"
                          size="large"
                          style={{ width: "100%" }}
                          prefix={<FieldBinaryOutlined />}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>
                      <label style={{ width: "25%" }}>Country:</label>
                      <div style={{ width: "55%"}}>
                        <Input
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormAddress({
                              ...formAddress,
                              country: value,
                            });
                          }}
                          value={formAddress.country}
                          status={!formAddress.country ? "error" : ""}
                          placeholder="Country"
                          size="large"
                          style={{ width: "100%" }}
                          prefix={<GlobalOutlined />}
                        />
                      </div>
                    </div>
                    {
                      orderWithoutCustomer && (
                          <>
                            <div style={{ display: "flex" }}>
                              <label style={{ width: "25%" }}>Customer name:</label>
                              <div style={{ width: "55%" }}>
                                <Input
                                  onChange={(e) => {
                                    const value = e?.target?.value;
                                    setFormAddress({
                                      ...formAddress,
                                      customer_name: value,
                                    });
                                  }}
                                  value={formAddress?.customer_name}
                                  status={!formAddress?.customer_name ? "error" : ""}
                                  placeholder="Customer name"
                                  size="large"
                                  style={{ width: "100%" }}
                                  prefix={<UserAddOutlined />}
                                />
                              </div>
                            </div>
                            <div style={{ display: "flex" }}>
                              <label style={{ width: "25%" }}>Customer phone:</label>
                              <div style={{ width: "55%" }}>
                                <Input
                                  onKeyDown={(event) => {
                                    const regex = /^[0-9\b]+$/;
                                    if (!regex.test(event?.key) && event?.key !== 'Backspace') {
                                      event?.preventDefault();
                                    }
                                  }}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setFormAddress({
                                      ...formAddress,
                                      phone: value,
                                    });
                                  }}
                                  value={formAddress?.phone}
                                  maxLength={10}
                                  status={(!formAddress?.phone || formAddress?.phone?.length < 10) ? "error" : ""}
                                  placeholder="Customer phone"
                                  size="large"
                                  style={{ width: "100%" }}
                                  prefix={<PhoneOutlined />}
                                />
                              </div>
                            </div>
                          </>
                      )
                    }
                      <div style={{ width: "100%", display: "flex", justifyContent: "end", margin: "0 0 10px 0" }}>
                        <Button
                          disabled={
                            (
                              orderWithoutCustomer && (
                                !formAddress.street ||
                                !formAddress.street_number ||
                                !formAddress.city ||
                                !formAddress.state ||
                                !formAddress.zip_code ||
                                !formAddress.country ||
                                !formAddress.phone ||
                                !formAddress.customer_name
                              ) ||
                              !orderWithoutCustomer && (
                                !formAddress.street ||
                                !formAddress.street_number ||
                                !formAddress.city ||
                                !formAddress.state ||
                                !formAddress.zip_code ||
                                !formAddress.country
                              )
                            )
                          }
                          onClick={() => handleCreateAddress()}
                        >
                          Create address
                        </Button>
                      </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Notes",
      content: (
        <div style={{ marginBottom: "45px", padding: "0 15px", maxHeight: "300px", overflowY: "auto" }}>
          <TextArea
            showCount
            maxLength={50}
            onChange={e => setNotes(e.target.value)}
            value={notes}
            placeholder="Order notes"
            style={{ height: 60, resize: 'none' }}
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
          <div style={{ border: "1px solid #DEDEDE", borderRadius: "5px", marginTop: "5px", maxHeight: "600px", overflowY: "auto", overflow: "scroll" }}>
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
          <div style={{ border: "1px solid #DEDEDE", borderRadius: "5px", marginTop: "5px", maxHeight: "600px", overflowY: "auto", overflow: "scroll" }}>
            {
              (selectedAddress || formAddress) && (
                <div
                  style={{ display: "flex", padding: "10px 10px" }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Text>Street: <b>{!selectedCustomer ? formAddress.street : selectedAddress?.street ?? "-"}</b></Text> <Text>City: <b>{!selectedCustomer ? formAddress.city : selectedAddress?.city ?? "-"}</b></Text> <Text>Street number: <b><Text>{!selectedCustomer ? formAddress.street_number : selectedAddress?.street_number ?? "-"}</Text></b></Text> {(!selectedCustomer && formAddress?.apartment_number) ? (<Text>Apartment: <b>{formAddress?.apartment_number ?? "-"}</b></Text>) : selectedAddress?.apartment_number ? (<Text>Apartment: <b>{selectedAddress?.apartment_number ?? "-"}</b></Text>) : undefined }
                  </div>
                </div>
              )
            }
          </div>
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

  const handleSelectAddress = (value) => {
    const selectedAddress = addresses?.find(address => address?._id === value) ?? null;
    setSelectedAddress(selectedAddress);
  }

  const handleCreateCustomer = async () => {
    const customerResponse = await createCustomer({ ...newCustomer, phone: `+52${newCustomer?.phone}` });
    if (!customerResponse || !customerResponse?.data) {
      api["error"]({
        message: "Error",
        description: `${customerResponse?.error?.data?.message?.[0] ?? "Customer couldn't be created."}`,
      });
      return;
    }
    await fetchCustomers();
    const customerCreated = customerResponse?.data ?? null;
    setSelectedCustomer(customerCreated);
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
    if (!customerCreated) return;
    setSelectedCustomerItems([
      {
        key: "1",
        label: "Name",
        children: `${customerCreated?.name} ${customerCreated?.last_name}`,
      },
      {
        key: "2",
        label: "Phone",
        children: `${customerCreated?.phone}`,
      },
      {
        key: "3",
        label: "Email",
        children: `${customerCreated?.email}`,
      },
      {
        key: "4",
        label: "Created At",
        children: `${dayjs(customerCreated?.createdAt).format("DD/MM/YYYY")}`,
      },
    ]);
  }

  const handleCreateAddress = async () => {
    if (!selectedCustomer) {
      next();
      return;
    }
    const addressBody = {
      ...formAddress,
      apartment_number: formAddress.apartment_number ?? undefined,
      status: true,
      customer: selectedCustomer?._id,
    }
    const response = await createAddress(addressBody);
    if (!response || !response?.data) {
      api["error"]({
        message: "Error",
        description: "Address couldn't be saved.",
      });
      return;
    }
    await fetchCustomers();
    const createdAddress = response?.data ?? null;
    setSelectedAddress(createdAddress);
    setIsCreateAddress(false);
    await getAddressesByCustomer(selectedCustomer?._id);
    setCurrentStep(3);
    setFormAddress({
      street: "",
      street_number: "",
      apartment_number: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
      status: "",
      customer: "",
    });
  }

  const handleCreateOrder = async () => {
    let newOrder = {
      items: [],
      total: 0,
      type: "DELIVERY",
      status: "PENDING",
      payment_method: "",
      customer: null,
      note: "",
    };
    const items = selectedProductsList?.map((product) => ({ product: product._id, price: product.price, quantity: product.selectedQuantity }));
    if (orderWithoutCustomer) {
      newOrder = {
        ...newOrder,
        custom_address: { ...formAddress },
        phone: `+52${formAddress?.phone}`,
      }
    } else {
      newOrder = {
        ...newOrder,
        address: selectedAddress?._id,
        customer_name: undefined,
        phone: undefined,
      }
    }
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
    await refetch();
    api["success"]({
      message: "Success",
      description: `Order ${orderResponse?.data?.order_number} created.`,
    });
    handleClose();
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
        loading={
          isLoadingProducts ||
          isLoadingCustomers ||
          createCustomerIsLoading ||
          createOrderIsLoading
        }
        disabled={
          isLoadingProducts ||
          isLoadingCustomers ||
          createCustomerIsLoading ||
          createOrderIsLoading
        }
        onCancel={() => {
          handleClose();
        }}
        footer={[
          <Button
            key="back"
            loading={
              isLoadingProducts ||
              isLoadingCustomers ||
              createCustomerIsLoading ||
              createOrderIsLoading
            }
            disabled={
              isLoadingProducts ||
              isLoadingCustomers ||
              createCustomerIsLoading ||
              createOrderIsLoading
            }
            onClick={() => {
              handleClose();
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
                ||
                (currentStep === 2 && !selectedAddress)
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
              disabled={
                !paymentMethod ||
                !notes ||
                isLoadingProducts ||
                isLoadingCustomers ||
                createCustomerIsLoading ||
                createOrderIsLoading
              }
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
              onClick={() => {
                if (currentStep === 2) {
                  setSelectedAddress(null);
                }
                prev();
              }}
            >
              Previous
            </Button>
          )}
          {
            currentStep === 2 && (
              <div style={{ display: "flex", alignItems: "center", marginLeft: "55px" }}>Order Total: <Text>$ <b>{total}</b></Text></div>
            )
          }
          {
            (currentStep === 2 && selectedCustomer) && (
              <div style={{ display: "flex", alignItems: "center", marginLeft: "55px" }}>Customer: <Text> <b> {selectedCustomer?.name}</b></Text></div>
            )
          }
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
