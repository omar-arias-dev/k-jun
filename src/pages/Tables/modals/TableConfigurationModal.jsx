import { useEffect, useState } from "react";
import { Button, Modal, Input, InputNumber, Typography, Popconfirm, notification } from "antd";
const { TextArea } = Input;
const { Text } = Typography;
import { DeleteOutlined } from '@ant-design/icons';
import { useDeleteTableMutation, useUpdateTableByIdMutation,  } from "../../../stores/tableStore";

export default function TableConfigurarionModal({ open, onClose, tableData, refetch }) {
  const [api, contextHolder] = notification.useNotification();
  const [table, setTable] = useState({
    id: null,
    tableNumber: "",
    capacity: 0,
    notes: "",
    status: false,
  });

  const [updateTable, { isLoading: updateTableIsLoading }] = useUpdateTableByIdMutation();
  const [deleteTable, { isLoading: deleteTableIsLoading }] = useDeleteTableMutation();

  useEffect(() => {
    if (!open || !tableData) return;
    setTable({
      id: tableData?._id ?? null,
      tableNumber: tableData?.table_number ?? "",
      capacity: tableData?.capacity ?? 0,
      notes: tableData?.notes ?? "",
      status: tableData?.status ?? false,
    });
  }, [tableData, open]);

  const handleClose = () => {
    onClose();
    setTable({
      id: null,
      tableNumber: "",
      capacity: 0,
      notes: "",
      status: false,
    });
  }

  const handleUpdateTable = async () => {
    const response = await updateTable({
      id: table.id,
      body: {
        table_number: table.tableNumber,
        capacity: table.capacity,
        notes: table.notes,
      }
    });
    if (!response || !response.data) {
      api["error"]({
        message: "Error",
        description: "Table couldn't be updated.",
      });
      return;
    }
    api["success"]({
      message: "Success",
      description: "Table was updated.",
    });
    await refetch();
    handleClose();
  }

  const handleDeleteTable = async () => {
    const response = await deleteTable(table.id);
    if (!response || !response.data) {
      api["error"]({
        message: "Error",
        description: "Table couldn't be deleted.",
      });
      return;
    }
    api["success"]({
      message: "Success",
      description: "Table was deleted.",
    });
    await refetch();
    handleClose();
  }

  return (
    <Modal
      title={`Update table ${tableData?.table_number}`}
      centered
      width={"50%"}
      open={open}
      onCancel={handleClose}
      footer={[
        <Button
          disabled={
            updateTableIsLoading ||
            deleteTableIsLoading
          }
          type="primary"
          onClick={async () => await handleUpdateTable()}
        >
          Update
        </Button>,
        <Button
          disabled={
            updateTableIsLoading ||
            deleteTableIsLoading
          }
          onClick={handleClose}
        >
          Cancel
        </Button>,
      ]}
    >
      {contextHolder}
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <Popconfirm
          title="Delete the table"
          description="Are you sure to delete this table?"
          onConfirm={async () => {
            handleDeleteTable();
          }}
          okText="Delete"
          cancelText="No"
        >
          <Button
            disabled={
              updateTableIsLoading ||
              deleteTableIsLoading
            }
            type="primary"
            danger
            icon={<DeleteOutlined />}
          >
            Delete table
          </Button>
        </Popconfirm>
      </div>
      <form style={{ marginTop: "10px" }}>
        <div style={{ margin: "5px 0" }}>
          <Input
            addonBefore="Table Number:"
            value={table.tableNumber}
            onChange={(e) => {
              const value = e.target.value;
              setTable({
                ...table,
                tableNumber: value,
              })
            }}
          />
        </div>
        <div style={{ margin: "5px 0" }}>
          <InputNumber
            type="number"
            addonBefore="Capacity:"
            min={0}
            max={100}
            value={table.capacity}
            onKeyDown={(event) => {
              const regex = /^[0-9\b]+$/;
              if (!regex.test(event.key) && event.key !== 'Backspace') {
                event.preventDefault();
              }
            }}
            onChange={(e) => {
              setTable({
                ...table,
                capacity: e,
              });
            }}
          />
        </div>
        <div style={{ margin: "4px 0 0 0" }}>
          <Text>Notes:</Text>
          <TextArea
            value={table.notes}
            onChange={(e) => {
              setTable({
                ...table,
                notes: e.target.value,
              });
            }}
            maxLength={100}
            placeholder="Notes"
            style={{ resize: "none" }}
          />
        </div>
      </form>
    </Modal>
  );
}