import { Modal, Button, Divider, Form, Input, InputNumber, notification } from "antd";
import { useCreateTableMutation } from "../../../stores/tableStore";

export default function CreateTableFormModal({ open, onClose, refetch }) {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const [createTable, { data: createdTable, isLoading: createdTableLoading }] =
    useCreateTableMutation();

    const openNotificationWithIcon = (type, message, description) => {
      api[type]({
        message: message,
        description:
          description,
      });
    };

    const handleCreateTableError = (error) => {
      if (!error || !error?.errorFields || error?.errorFields.length === 0) return;
      const stringErrors = error?.errorFields?.map((error) => error?.errors?.[0])?.join(", ") ?? "Fill all fields";
      openNotificationWithIcon("error", "Error", stringErrors);
    }

    const handleCreateSubmit = async (submited) => {
      if (submited.capacity === 0) {
        openNotificationWithIcon("error", "error", "Capacity should be upper than 0.");
        return
      }
      const data = await createTable({
        table_number: submited.name,
        capacity: submited.capacity,
        notes: submited.notes,
        status: true,
      });
      if (data && data?.data) {
        openNotificationWithIcon("success", "Table created", "Table created successfully.");
        await refetch();
        onClose();
        form.resetFields();
      } else {
        console.log(data)
        if (data && data?.error && data?.error?.data && data?.error?.data?.message && data?.error?.data && data?.error?.data?.message?.length > 0) {
          const stringErrors = data?.error?.data?.message?.join(". ") ?? "Error at creating table";
          openNotificationWithIcon("error", "Error", stringErrors);
          return;
        }
        openNotificationWithIcon("error", "error", "Error at creating table");
      }
    }

  return (
    <Modal
      title={`Create table`}
      centered
      open={open}
      onCancel={() => {
        if (createdTableLoading) return;
        onClose();
        form.resetFields();
      }}
      footer={[
        <Button key="back" onClick={() => {
          if (createdTableLoading) return;
          onClose();
          form.resetFields();
        }}>
          Cancel
        </Button>,
      ]}
      width={"60%"}
    >
      <Divider></Divider>
      <div>
        {contextHolder}
        <Form
          form={form}
          initialValues={{
            name: "",
            capacity: "",
            notes: "",
          }}
          onFinishFailed={(value) => handleCreateTableError(value)}
          onFinish={(e) => handleCreateSubmit(e)}
        >
          <Form.Item
            label="Table name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the table indentificator",
              },
            ]}
            style={{ width: "100%" }}
          >
            <Input placeholder="Input the product indentificator" />
          </Form.Item>
          <Form.Item
            label="Table capacity"
            name="capacity"
            rules={[
              {
                required: true,
                message: "Please input the table capacity",
              },
            ]}
            style={{ width: "100%" }}
          >
            <InputNumber style={{ width: "260px" }} type="number" placeholder="Input the product capacity" />
          </Form.Item>
          <Form.Item
            label="Notes"
            name="notes"
            rules={[
              {
                required: true,
                message: "Please input the notes about table",
              },
            ]}
            style={{ width: "100%" }}
          >
            <Input.TextArea placeholder="Input the notes about table" />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={createdTableLoading}>
                Create table
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
