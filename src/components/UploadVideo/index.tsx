import AxiosClient from '@/apis/AxiosClient';
import { Notification, uuid } from '@/utils';
import { Button, Image, Upload, message } from 'antd';
import type { UploadProps } from 'antd/es/upload';
import { UploadFile, UploadListType } from 'antd/lib/upload/interface';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import React, { ReactNode, useState } from 'react';
const { Dragger } = Upload;
// import { notificationError } from 'utils/notification';
type uploadType = 'single' | 'list';
interface IProps {
    onSuccessUpload: (file: UploadFile | string | null) => void;
    setVideoName?: (name: string) => void;
    setDisable?: (value: boolean) => void;
    isUploadServerWhenUploading?: boolean;
    isShowFileList?: boolean;
    children?: ReactNode;
    uploadType?: uploadType;
    accept?: string;
    listType?: UploadListType;
    maxLength?: number;
    initialFile?: any;
    disabled?: boolean;
    type?: number;
}

const UploadVideoComponent: React.FC<IProps> = ({
    accept = 'video/*',
    listType = 'picture',
    uploadType = 'single',
    setDisable,
    isShowFileList = true,
    isUploadServerWhenUploading = false,
    onSuccessUpload,
    setVideoName,
    children,
    maxLength = 1,
    initialFile,
    disabled,
    type = 2,
}) => {
    const [files, setFiles] = React.useState<UploadFile[]>([]);
    const [progress, setProgress] = React.useState(0);
    const [visiblePreview, setVisiblePreview] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const firstLoad = React.useRef(false);
    const [fileName, setFileName] = React.useState('');
    const uploadVideo = async (options: any) => {
        const { onSuccess, onError, file, onProgress } = options;
        if (file?.type === 'video/mp4') {
            if (files.length > 1) {
                file.status = 'error';
                const error = new Error('Some error');
                if (uploadType === 'single') {
                    setFiles([file]);
                } else {
                    setFiles((f) => [...f.filter((_f) => _f.status !== 'uploading'), file]);
                }
                onError({ error });
                return Notification('error', 'Vượt quá số lượng cho phép');
            }
            if (isUploadServerWhenUploading) {
                const fmData = new FormData();
                const config = {
                    headers: {
                        Accept: 'multipart/form-data',
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (event: any) => {
                        const percent = Math.floor((event.loaded / event.total) * 100);
                        setProgress(percent);
                        if (percent === 100) {
                            setTimeout(() => setProgress(0), 1000);
                        }
                        onProgress({ percent: (event.loaded / event.total) * 100 });
                    },
                };
                fmData.append('video', file);
                try {
                    const res: any = await AxiosClient.post(`/uploads/video`, fmData, config);

                    if (res.status) {
                        onSuccessUpload(res?.data as string);
                        setVideoName?.(file.name);
                        onSuccess('ok');
                    } else {
                        file.status = 'error';
                        const error = new Error('Some error');
                        if (uploadType === 'single') {
                            setFiles([]);
                        } else {
                            setFiles((f) => [...f.filter((_f) => _f.status !== 'uploading'), file]);
                        }
                        onError({ error });
                    }
                } catch (err) {
                    file.status = 'error';
                    const error = new Error('Some error');
                    if (uploadType === 'single') {
                        setFiles([file]);
                    } else {
                        setFiles((f) => [...f.filter((_f) => _f.status !== 'uploading'), file]);
                    }
                    onError({ error });
                }
            } else {
                setTimeout(() => onSuccess('ok'), 1000);
            }
        } else {
            return Notification('warning', 'Vui lòng tải Video có địng dạng .mp4');
        }
    };

    const handleOnChange: UploadProps['onChange'] = ({ file, fileList, event }: any) => {
        if (event?.percent) {
            setDisable?.(true);
        } else {
            setDisable?.(false);
        }
        // if (file?.type === 'image/png' || file?.type === 'image/jpeg' || file?.type === 'image/jpg') {
        //     return Notification('warning', 'Vui lòng tải Video');
        // }

        // if (file?.type === 'application/pdf' || file?.type === 'application/msword') {
        //     return Notification('warning', 'Vui lòng tải Video');
        // }
        if (file?.type === 'video/mp4') {
            if (file?.size > 200 * 1024 * 1024) {
                file.status = 'error';
                return Notification('warning', 'Vui lòng tải video có dung lượng nhỏ hơn 400 MB');
            }
        } else {
            return Notification('warning', 'Vui lòng tải Video đúng định dạng video/mp4');
        }

        if (file.status !== 'error') {
            setFiles(fileList);
            // onSuccessUpload(file?.status);
        }
        if (file.status !== 'removed') {
            !isUploadServerWhenUploading && onSuccessUpload(file);
        }
    };

    const handlePreview = async (file: UploadFile) => {
        setVisiblePreview(true);
        return;
    };
    React.useEffect(() => {
        if (firstLoad?.current) return;
        if (initialFile) {
            setFiles(initialFile);
            firstLoad.current = true;
        }
    }, [initialFile]);

    return (
        <>
            <UploadStyled
                disabled={disabled}
                accept={accept}
                customRequest={uploadVideo}
                onChange={handleOnChange}
                listType="text"
                fileList={isShowFileList ? files : []}
                className="image-upload-grid"
                onPreview={handlePreview}
                onRemove={(files) => onSuccessUpload(files)}
            >
                {files.length >= maxLength ? null : uploadType === 'single' && files.length >= 1 ? null : listType ===
                  'text' ? (
                    children
                ) : (
                    <div>+</div>
                )}
            </UploadStyled>
            {files?.map((file: any, index: number) => {
                <video key={index} width="300" controls>
                    <source src={file?.url || file?.absoluteUrl} type="video/mp4" />
                </video>;
            })}
        </>
    );
};

const UploadStyled = styled(Upload)`
    /* & img {
        object-fit: none !important;
    } */
    & .ant-upload-list-picture-card .ant-upload-list-item,
    .ant-upload-list-picture .ant-upload-list-item {
        padding: 2px;
    }
`;

export default UploadVideoComponent;
