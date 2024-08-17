import { useEffect, useState } from "react";
import { Modal, Button, List, InputNumber, Typography, Divider, notification, } from "antd";
const { Text } = Typography;
import {
  DeleteTwoTone,
} from "@ant-design/icons";
import { useLazyGetOrderByIdQuery, useUpdateOrderItemsMutation } from "../../../stores/orderStore";
import { useLazyGetAllProductsQuery } from "../../../stores/productStore";
import SelectProductModal from "./SelectProductModal";

export default function AddOrRemoveProductModal({ open, onClose, tableData, refetch }) {
  const [api, contextHolder] = notification.useNotification();
  const [orderProducts, setOrderProducts] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [total, setTotal] = useState(0);

  const [fetchProducts, { data: dataProducts, isLoading: isLoadingProducts }] =
    useLazyGetAllProductsQuery();
  const [getOrder, { data: getOrderData, isLoading: getOrderIsLoading }] = useLazyGetOrderByIdQuery();
  const [updateOrderItems, { data: updateOrderItemsData, isLoading: updateOrderItemsIsLoading }] = useUpdateOrderItemsMutation();

  useEffect(() => {
    if (isLoadingProducts || !dataProducts) return;
    if (dataProducts?.length === 0) return;
    setProductsList(dataProducts ?? []);
  }, [dataProducts, isLoadingProducts]);

  useEffect(() => {
    if (!tableData || !open) return;
    fetchProducts();
    async function fetchOrder() {
      const response = await getOrder(tableData?.current_order?._id);
      if (!response || !response?.data || !response?.data?.items || response?.data?.items?.length === 0) return;
      const allProducts = response?.data?.items?.map(currentProduct => ({
        ...currentProduct?.product,
        selectedQuantity: currentProduct?.quantity ?? 0,
        total: currentProduct?.price * currentProduct?.quantity,
      }));
      if (allProducts?.some(product => product?.selectedQuantity === 0 || product?.total === 0)) {
        api["error"]({
          message: "Error",
          description: "Products have some problems.",
        });
        console.error("error");
        return;
      }
      setOrderProducts(allProducts ?? []);
      const orderTotal = (allProducts?.reduce((total, current) => total + current?.total, 0) ?? 0);
      if (orderTotal === 0) {
        api["error"]({
          message: "Error",
          description: "Products have some problems.",
        });
        console.error("error");
        return;
      }
      setTotal(orderTotal)
    }
    fetchOrder();
  }, [tableData, open]);

  useEffect(() => {
    if (selectedProduct === null) return;
    if (orderProducts.length === 0) {
      setOrderProducts([
        { ...selectedProduct, total: 0, selectedQuantity: 0 },
      ]);
      return;
    }
    const findedProduct = orderProducts.find(
      (product) => product?._id === selectedProduct?._id
    );
    if (findedProduct) {
      return;
    }
    setOrderProducts((prev) => [
      ...prev,
      { ...selectedProduct, total: 0, selectedQuantity: 0 },
    ]);
  }, [selectedProduct]);

  useEffect(() => {
    if (!orderProducts || orderProducts.length === 0) setTotal(0);
    const orderTotal = orderProducts.reduce((fullTotal, currentProduct) => fullTotal + currentProduct?.total, 0);
    setTotal(orderTotal);
  }, [orderProducts]);

  const handleClose = () => {
    setOrderProducts([]);
    setShowProductModal(false);
    setSelectedProduct(null);
    setTotal(0);
    onClose();
  }

  const handleDeleteProduct = (item, index) => {
    if (orderProducts.length === 1) {
      api["error"]({
        message: "Error",
        description: "Please add a product first.",
      });
      return;
    }
    const filteredProducts = orderProducts?.filter(
      (product) => product?._id !== item?._id
    );
    setOrderProducts(filteredProducts);
  };

  const handleQuantityChange = (newQuantity, item, index) => {
    const updatedList = orderProducts?.map(
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
    setOrderProducts(updatedList);
  };

  const isThereSomeProductWithoutQuantity = orderProducts?.some(
    (product) => product?.total <= 0 || !product?.total
  );

  const handleUpdateOrderItems = async () => {
    if (isThereSomeProductWithoutQuantity) return;
    const orderId = tableData?.current_order?._id ?? "";
    const items = orderProducts?.map(product => ({
      product: product?._id,
      price: product?.price,
      quantity: product?.selectedQuantity,
    }));
    const orderTotal = total;
    const body = {
      items,
      order_total: orderTotal,
    }
    const data = await updateOrderItems({ id: orderId, body });
    if (!data || !data?.data) {
      api["error"]({
        message: "Error",
        description: "Order products couldn't be updated.",
      });
      return;
    }
    await refetch();
    api["success"]({
      message: "Success",
      description: `Order products were updated.`,
    });
    handleClose();
  }

  return (
    <Modal
      title={`Update order products`}
      centered
      open={open}
      loading={false}
      disabled={isLoadingProducts || getOrderIsLoading || updateOrderItemsIsLoading}
      onCancel={() => {
        // refetch();
        handleClose();
      }}
      footer={[
        <Button
          key="ok"
          type="primary"
          loading={isLoadingProducts || getOrderIsLoading || updateOrderItemsIsLoading}
          disabled={isLoadingProducts || getOrderIsLoading || updateOrderItemsIsLoading || isThereSomeProductWithoutQuantity}
          onClick={async () => { await handleUpdateOrderItems() }}
        >
          Update Order
        </Button>,
        <Button
          key="back"
          loading={isLoadingProducts || getOrderIsLoading || updateOrderItemsIsLoading}
          disabled={isLoadingProducts || getOrderIsLoading || updateOrderItemsIsLoading}
          onClick={() => {
            refetch();
            handleClose();
          }}
        >
          Cancel
        </Button>,
      ]}
      width={"60%"}
    >
      <>
        {contextHolder}
        <Divider></Divider>
        <div style={{ marginBottom: "10px" }}>
          <Button onClick={() => setShowProductModal(true)}>
            Select Product
          </Button>
        </div>
        <div style={{ overflow: "auto", height: "300px", padding: "0 20px" }}>
          <List
            itemLayout="horizontal"
            dataSource={orderProducts ?? []}
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
        {
          showProductModal && (
            <SelectProductModal
              open={showProductModal}
              onClose={() => {
                setShowProductModal(false);
              }}
              productList={productsList}
              isLoadingProducts={isLoadingProducts}
              selectedProductsList={orderProducts}
              setSelectedProductsList={setOrderProducts}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />
          )
        }
      </>
    </Modal>
  );
}