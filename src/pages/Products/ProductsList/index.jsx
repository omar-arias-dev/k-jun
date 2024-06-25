import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Table, Tag, notification, Typography, Tooltip } from "antd";
const { Title } = Typography;
import { EditTwoTone, DeleteTwoTone, PlusCircleTwoTone } from "@ant-design/icons";
import dayjs from "dayjs";

import { useLazyGetAllProductsQuery, useDeleteProductByIdMutation } from "../../../stores/productStore";

import { DeleteProductModal } from "./components/DeleteProductModal";
import { UpdateProductModal } from "./components/UpdateProductModal";


export default function ProductsList() {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const [productsList, setProductsList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [showUpdateProductModal, setShowUpdateProductModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [getAllProducts, { data: dataProducts, isLoading, isError, error }] = useLazyGetAllProductsQuery();
  const [suspendProductById, { isLoading: isLoadingSuspend, isError: isErrorSuspend, error: errorSuspend }] = useDeleteProductByIdMutation();

  useEffect(() => {
    async function fetchProductsList() {
      const data = await getAllProducts();
      if (
        isLoading &&
        isError &&
        error &&
        (!data?.data || data?.data?.length === 0)
      )
        return;
      setProductsList(data?.data ?? []);
    }
    fetchProductsList();
  }, []);

  useEffect(() => {
    if (isLoading || isError || error) return;
    setProductsList(dataProducts);
  }, [dataProducts]);

  const handleDeleteProductById = async (productId) => {
    try {
      const deleted = await suspendProductById(productId);
      if (isErrorSuspend || errorSuspend || !deleted?.data) return;
      handleCloseDeleteProductModal();
      openNotification(true, deleted?.data);
    } catch (error) {
      console.error(error);
    }
  }
  
  const handleCloseDeleteProductModal = () => {
    setShowDeleteProductModal(false);
    setCurrentProduct(null);
  }
  
  const handleCloseUpdateProductModal = () => {
    setShowUpdateProductModal(false);
    setCurrentProduct(null);
  }

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;


  const openNotification = (pauseOnHover, product) => {
    api.open({
      message: `Deleted`,
      description: `Product ${product?.name ?? ""} was deleted.`,
      showProgress: true,
      pauseOnHover,
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (text) => (<b>${text}</b>),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (category) => (
        <Tag
          color="volcano"
        >
          {category.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Updated Date",
      dataIndex: "updatedAt",
      render: (date) => (<>{dayjs(date).format('DD/MM/YYYY')}</>),
    },
    {
      title: "Actions",
      render: (record) => (
        <Space>
          <EditTwoTone
            onClick={() => {
              setCurrentProduct(record);
              setShowUpdateProductModal(true);
            }}
            />
          <DeleteTwoTone
            onClick={() => {
              setCurrentProduct(record);
              setShowDeleteProductModal(true);
            }}
            twoToneColor="#FF8484"
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      {contextHolder}
      <header style={{ margin: "20px 0", display: "flex", justifyContent: "space-between", padding: "0 35px" }}>
        <Title level={2}>Products</Title>
        <Tooltip title="Create new Product" placement="left">
          <PlusCircleTwoTone
            onClick={() => navigate("/products/create")}
            style={{ fontSize: '26px' }}
            twoToneColor={"#73CF6B"}
          />
        </Tooltip>
      </header>
      <Table
        rowKey={"_id"}
        columns={columns}
        dataSource={productsList}
        rowSelection={rowSelection}
        size="small"
      />
      {
        (showDeleteProductModal && currentProduct) && (
          <DeleteProductModal
            open={showDeleteProductModal}
            onClose={handleCloseDeleteProductModal}
            product={currentProduct}
            onDelete={handleDeleteProductById}
            loadingDelete={isLoadingSuspend}
            refetch={getAllProducts}
          />
        )
      }
      {
        (showUpdateProductModal && currentProduct) && (
          <UpdateProductModal
            open={showUpdateProductModal}
            onClose={handleCloseUpdateProductModal}
            productId={currentProduct?._id ?? ""}
            product={currentProduct ?? null}
            refetch={getAllProducts}
          />
        )
      }
    </div>
  );
}
