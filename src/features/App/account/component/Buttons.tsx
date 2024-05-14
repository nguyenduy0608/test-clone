import ActiveButton from '@/components/Button/Active.Button';
import UnActiveButton from '@/components/Button/UnActive.Button';
import useCallContext from '@/hooks/useCallContext';
import { Notification } from '@/utils';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DataTypeAccount } from './Account.Config';
import accountService from '../service';
interface IProps {
    record: DataTypeAccount;
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
            title: 'Xóa tài khoản',
            icon: <ExclamationCircleOutlined />,
            content: <strong style={{ marginTop: '10px' }}>Bạn chắc chắn muốn xóa tài khoản này?</strong>,
            onOk() {
                handleDelete(Number(record.id));
            },
            onCancel() {},
        });
    };

    const handleReset = async (id: number) => {
        const res = await accountService.resetPassword({ userId: Number(id) });
        if (res.status) {
            Notification('success', 'Reset mật khẩu thành công');
            refetch();
        }
    };
    const handleLock = async (id: number) => {
        const res = await accountService.lock(id);
        if (res.status) {
            Notification('success', 'Thay đổi trạng thái thành công');
            refetch();
        }
    };
    const handleUnlock = async (id: number) => {
        const res = await accountService.unlock(id);
        if (res.status) {
            Notification('success', 'Thay đổi trạng thái thành công');
            refetch();
        }
    };
    const handleDelete = async (id: number) => {
        const res = await accountService.delete({ userId: Number(id) });
        if (res.status) {
            Notification('success', 'Xóa thành công');
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
            disabled={info?.id === record.id}
            type="text"
            className="gx-mb-0"
            style={{
                fontSize: '16px',
                color: 'green',
            }}
            onClick={handleShowModal}
        >
            <EditOutlined key="edit" />
            Chỉnh sửa
        </Button>,
        <Popconfirm
            title={<strong style={{ marginTop: '10px' }}>Bạn chắc chắn đồng ý đặt lại mật khẩu tài khoản này?</strong>}
            onConfirm={async () => {
                try {
                    handleReset(Number(record.id));
                } catch (error) {
                } finally {
                }
            }}
            okText="Đặt lại mật khẩu"
            cancelText="Đóng"
            okButtonProps={{
                type: 'primary',
            }}
        >
            <Button
                type="text"
                style={{
                    fontSize: '16px',
                    color: '#000',
                }}
            >
                <ReloadOutlined key="reset" />
                Reset mật khẩu
            </Button>
        </Popconfirm>,

        <Button
            disabled={info?.id === record.id}
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
