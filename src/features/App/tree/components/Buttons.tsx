import ActiveButton from '@/components/Button/Active.Button';
import UnActiveButton from '@/components/Button/UnActive.Button';
import useCallContext from '@/hooks/useCallContext';
import { Notification } from '@/utils';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import { flowerService } from '../services';
import { DataType } from './Tree.Config';
interface IProps {
    record: DataType;
    handleShowModal?: any;
    refetch: any;
}
const Buttons = (props: IProps) => {
    const { state } = useCallContext();
    const info = state?.info;

    const { record, refetch, handleShowModal } = props;
    const navigate = useNavigate();

    const { confirm } = Modal;
    const destroyAll = () => {
        Modal.destroyAll();
    };
    const showConfirmDelete = () => {
        confirm({
            title: 'Xóa cây trồng',
            icon: <ExclamationCircleOutlined />,
            content: <strong style={{ marginTop: '10px' }}>Bạn chắc chắn muốn xóa cây trồng này?</strong>,
            onOk() {
                handleDelete(Number(record.id));
            },
            onCancel() {},
        });
    };

    const handleLock = async (id: number) => {
        const res = await flowerService.lock(id);
        if (res.status) {
            Notification('success', 'Thay đổi trạng thái thành công');
            refetch();
        }
    };
    const handleUnlock = async (id: number) => {
        const res = await flowerService.unlock(id);
        if (res.status) {
            Notification('success', 'Thay đổi trạng thái thành công');
            refetch();
        }
    };
    const handleDelete = async (id: number) => {
        const res = await flowerService.delete({ gardenId: id });
        if (res.status) {
            Notification('success', 'Xóa cây trồng thành công');
            refetch();
        }
    };
    return [
        record.status ? (
            <UnActiveButton
                disabled={info?.id === record.id}
                onClick={() => {
                    handleLock(Number(record.id));
                }}
            />
        ) : (
            <ActiveButton disabled={info?.id === record.id} onClick={() => handleUnlock(Number(record.id))} />
        ),
        <Button
            // disabled={info?.id === record.id}
            type="text"
            className="gx-mb-0"
            style={{
                fontSize: '16px',
                color: 'green',
            }}
            onClick={() => {
                navigate(`/tree/form/${record?.id}`);
            }}
        >
            <EditOutlined key="edit" />
            Chỉnh sửa
        </Button>,
        <Button
            // disabled={info?.id === record.id}
            type="text"
            className="gx-mb-0"
            style={{
                fontSize: '16px',
                color: 'red',
            }}
            onClick={showConfirmDelete}
        >
            <DeleteOutlined key="delete" />
            Xóa
        </Button>,
    ];
};

export default Buttons;
