import { Modal, Typography } from 'antd';

const { Text } = Typography;

export const DeleteProductModal = ({ open, onClose, product, onDelete, loadingDelete, refetch }) => {
  return (
    <Modal
      title={`Are you sure delete the product ${product?.name ?? ""}?`}
      centered
      open={open}
      okText="Delete"
      okType="danger"
      cancelText="Cancel"
      onOk={async () => {
        await onDelete(product?._id);
        await refetch();
      }}
      onCancel={() => onClose()}
      width={500}
      confirmLoading={loadingDelete}
    >
      <Text>Next action is irreversible.</Text>
    </Modal>
  );
};