
export default function ConfirmModal({ open, onClose, title, sentence, onAction }) {
  return (
    <Modal
      title={title}
      open={open}
      onOk={onAction}
      onCancel={onClose}
      okButtonProps={{
        disabled: true,
      }}
      cancelButtonProps={{
        disabled: true,
      }}
    >
      {sentence}
    </Modal>
  );
}