import { Button, Checkbox, Form, Input, Typography, Divider, Steps } from "antd";
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function CreateOrder() {
  return (
    <section
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ margin: "20px auto" }}>
        <Title level={3}>Create Order</Title>
      </div>
      <Divider>New Order</Divider>
      <Steps
        style={{ width: "90%" }}
        items={[
          {
            title: "Login",
            status: "finish",
            icon: <UserOutlined />,
          },
          {
            title: "Verification",
            status: "finish",
            icon: <SolutionOutlined />,
          },
          {
            title: "Pay",
            status: "process",
            icon: <LoadingOutlined />,
          },
          {
            title: "Done",
            status: "wait",
            icon: <SmileOutlined />,
          },
        ]}
      />
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        initialValues={{ remember: true }}
        onFinish={() => console.log("onFinish")}
        onFinishFailed={() => console.log("onFinishFailed")}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
          style={{ width: "100%" }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          style={{ width: "100%" }}
        >
          <Input.Password />
        </Form.Item>
        <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
            style={{ width: "30%" }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </section>
  );
}
