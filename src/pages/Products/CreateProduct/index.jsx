import { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Typography,
  Divider,
  Steps,
  Space,
  message,
  notification,
  Tooltip,
} from "antd";
const { Title } = Typography;
import {
  PlusOutlined,
  MinusCircleOutlined,
  NumberOutlined,
  PushpinOutlined,
  PlusSquareOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";

import { useCreateProductMutation } from "../../../stores/productStore";

import { moneyValidator, numberValidator } from "../../../utils/validators";

export default function CreateProduct() {
  const [form] = Form.useForm();
  const [messageApi, contextHolderMessage] = message.useMessage();
  const [notificationApi, contextHolderNotification] = notification.useNotification();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
    tags: [],
    status: true
  });

  const [createProduct, { isLoading: createProductLoading, isError: createProductIsError, error: createProductError }] = useCreateProductMutation();

  const handleCreateProductSubmit = async (newProduct) => {
    const rawTags = newProduct?.tags?.map(tag => tag?.tag);
    const productToSend = {
      ...product,
      status: newProduct?.status ?? false,
      tags: rawTags,
    }
    try {
      const productCreated = await createProduct(productToSend);
      if (!productCreated.data) {
        messageApi?.open({
          type: 'error',
          content: "Error creating the product",
        });
        return;
      }
      notificationApi.open({
        message: 'Created',
        description:
          'Product created successfully.',
        showProgress: true,
        pauseOnHover: true,
      });
      form.resetFields();
    } catch (error) {
      console.error({error});
      messageApi?.open({
        type: 'error',
        content: "Error creating the product",
      });
    }
  }

  const handleCreateProductError = (error) => {
    if (!error || !error?.errorFields || error?.errorFields.length === 0) return;
    const stringErrors = error?.errorFields?.map((error) => error?.errors?.[0])?.join(", ") ?? "Fill all fields";
    messageApi.open({
      type: 'error',
      content: stringErrors,
    });
  }

  const onCheckboxChange = (e) => {
    setProduct({...product, status: e.target.checked});
  };

  return (
    <section
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {contextHolderMessage}
      {contextHolderNotification}
      <div style={{ margin: "20px auto" }}>
        <Title level={3}>Create Product</Title>
      </div>
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        initialValues={{ status: true }}
        onFinish={async (value) => handleCreateProductSubmit(value)}
        onFinishFailed={(value) => handleCreateProductError(value)}
        autoComplete="off"
      >
        <Divider><FileSearchOutlined /></Divider>
        <Form.Item
          label="Product name"
          name="name"
          rules={[{ required: true, message: "Please input the product name" }]}
          style={{ width: "100%" }}
        >
          <Input
            placeholder="Input the product name"
            value={product.name}
            onChange={(e) => {
              setProduct({
                ...product,
                name: e.target.value,
              });
            }}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please input the product description" },
          ]}
          style={{ width: "100%" }}
        >
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 4 }}
            value={product.description}
            allowClear
            onChange={(e) => {
              setProduct({
                ...product,
                description: e.target.value,
              });
            }}
          />
        </Form.Item>

        <Divider><NumberOutlined /></Divider>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            {
              required: true,
              message: "Please input the price",
            },
            {
              required: true,
              type: "number",
              message: "Only numbers",
            },
            {
              required: true,
              type: "regexp",
              message: "Wrong pattern. Example: 5, 5.00",
              validator: (_, value) => {
                if (moneyValidator(value)) {
                  return Promise.resolve();
                } else {
                  return Promise.reject("Error pattern");
                }
              },
            },
          ]}
          style={{ width: "100%" }}
        >
          <InputNumber
            placeholder="Input the product price: 5, 5.00"
            addonBefore="$"
            type="number"
            controls={false}
            value={product.price}
            onInput={(e) => {
              if (Number(e)) return e;
            }}
            onChange={(e) => {
              setProduct({
                ...product,
                price: +e,
              });
            }}
          />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[
            {
              required: true,
              message: "Please input the quantity of the product",
            },
            {
              type: "regexp",
              message: "Wrong. This is not a number. Example: 1, 2, 3, n",
              validator: (_, value) => {
                if (numberValidator(value)) {
                  return Promise.resolve();
                } else {
                  return Promise.reject("Error pattern");
                }
              },
            },
          ]}
          style={{ width: "100%" }}
        >
          <InputNumber
            placeholder="Input the number of pices of this this product"
            addonAfter="pz"
            type="number"
            controls={true}
            value={product.quantity}
            onInput={(e) => {
              if (Number(e)) return e;
            }}
            onChange={(e) => {
              setProduct({
                ...product,
                quantity: +e,
              });
            }}
          />
        </Form.Item>

        <Divider><PushpinOutlined /></Divider>

        <Form.Item
          label="Category"
          name="category"
          rules={[
            { required: true, message: "Please input the category of product" },
          ]}
          style={{ width: "100%" }}
        >
          <Input
            placeholder="Input the category"
            value={product.category}
            onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
            onChange={(e) => {
              setProduct({
                ...product,
                category: e.target.value,
              });
            }}
          />
        </Form.Item>
        <Form.List
          name="tags"
          rules={[
            {
              required: true,
              message: "Please input product tags",
              validator: (_, value) => {
                if (value.length > 0) {
                  return Promise.resolve();
                } else {
                  return Promise.reject();
                }
              },
            },
          ]}
        >
          {(currentTags, { add, remove }) => (
            <>
              {currentTags.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, "tag"]}
                    rules={[{ required: true, message: "Missing Tag name" }]}
                  >
                    <Input placeholder="Example: food, nachos, etc." />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Space>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add new tag
                  </Button>
                </Space>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Tooltip title="Product visibility" placement="left">
          <Form.Item
            name="status"
            style={{ width: "30%" }}
            valuePropName="checked"
          >
              <Checkbox style={{ textWrap: "nowrap" }} checked={product.status} onChange={onCheckboxChange}>
                Product Status
              </Checkbox>
          </Form.Item>
        </Tooltip>

        <Divider><PlusSquareOutlined /></Divider>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={createProductLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
}
