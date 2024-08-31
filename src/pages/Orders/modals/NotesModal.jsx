import { useEffect, useState } from "react";
import { Modal, Button, Timeline, Divider } from "antd";
import dayjs from "dayjs";

export default function NotesModal({ open, onClose, order }) {
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    const orderHistory = order?.history?.map(entry => ({
      children: (
        <>
          <b>{entry?.note}</b>
          <p>{dayjs(entry?.createdAt).format("YYYY-MM-DD HH:mm")}</p>
        </>
      ),
    })) ?? [];
    setTimelineData(orderHistory);
  }, []);

  return (
    <Modal
      title={`Order Notes`}
      onCancel={onClose}
      open={open}
      footer={[
        <Button key="back" onClick={() => onClose()}>
          OK
        </Button>,
      ]}
    >
      <Divider></Divider>
      <Timeline
        items={timelineData}
      />
    </Modal>
  );
}