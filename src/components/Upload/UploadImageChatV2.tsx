import AxiosClient from '@/apis/AxiosClient';
import { Notification, uuid } from '@/utils';
import { FileImageOutlined, LoadingOutlined, SendOutlined, SmileOutlined } from '@ant-design/icons';

import { Button, Image, Upload } from 'antd';
import type { UploadProps } from 'antd/es/upload';
import { UploadFile, UploadListType } from 'antd/lib/upload/interface';
import axios from 'axios';
import React, { ReactNode } from 'react';
const API_URL = import.meta.env.VITE_API_URL;
// import axiosInstance, { ApiClient } from 'services/ApiService';
import styled from 'styled-components';
// import { notificationError } from 'utils/notification';
type uploadType = 'single' | 'list';
interface IProps {
    onSuccessUpload: (file: UploadFile | string | null) => void;
    setUrlImage?: any;
    isUploadServerWhenUploading?: boolean;
    isShowFileList?: boolean;
    children?: ReactNode;
    uploadType?: uploadType;
    accept?: string;
    listType?: UploadListType;
    maxLength?: number;
    initialFile?: any;
    disabled?: boolean;
    files?: any;
    setFiles?: any;
}

const UploadImageChatV2: React.FC<IProps> = ({
    accept = 'image/*',
    listType = 'text',
    uploadType = 'single',
    isShowFileList = true,
    isUploadServerWhenUploading = false,
    onSuccessUpload,
    children,
    maxLength = 5,
    initialFile,
    setUrlImage,
    disabled,
    files,
    setFiles,
}) => {
    const [progress, setProgress] = React.useState(0);
    const [visiblePreview, setVisiblePreview] = React.useState(false);

    const firstLoad = React.useRef(false);

    const uploadImage = async (options: any) => {
        const { onSuccess, onError, file, onProgress } = options;
        if (
            (options?.file?.type === 'image/png' ||
                options?.file?.type === 'image/jpeg' ||
                options?.file?.type === 'image/jpg') &&
            options?.file?.size < 2 * 1024 * 1024
        ) {
            if (files.length > maxLength) {
                file.status = 'error';
                const error = new Error('Some error');
                if (uploadType === 'single') {
                    setFiles([file]);
                } else {
                    setFiles((f: any) => [...f.filter((_f: any) => _f.status !== 'uploading'), file]);
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
                fmData.append('image', file);
                try {
                    const res: any = await AxiosClient.post('/uploads/image', fmData, config);
                    if (res.status) {
                        file.full_url = res.data.absoluteUrl;
                        onSuccessUpload(res?.data as string);
                        onSuccess('ok');
                    } else {
                        file.status = 'error';
                        const error = new Error('Some error');
                        if (uploadType === 'single') {
                            setFiles([file]);
                        } else {
                            setFiles((f: any) => [...f.filter((_f: any) => _f.status !== 'uploading'), file]);
                        }
                        onError({ error });
                    }
                } catch (err) {
                    file.status = 'error';
                    const error = new Error('Some error');
                    if (uploadType === 'single') {
                        setFiles([file]);
                    } else {
                        setFiles((f: any) => [...f.filter((_f: any) => _f.status !== 'uploading'), file]);
                    }
                    onError({ error });
                }
            } else {
                setTimeout(() => onSuccess('ok'), 1000);
            }
        }
    };

    const handleOnChange: UploadProps['onChange'] = ({ file, fileList, event }: any) => {
        // check size > 2mb reject
        if (file?.size > 2 * 1024 * 1024) {
            file.status = 'error';
            return Notification('warning', 'Vui lòng tải ảnh có dung lượng ảnh nhỏ hơn 2 MB');
        }
        if (file.status !== 'error') {
            setFiles(fileList);
        }
        if (file.status !== 'removed') {
            !isUploadServerWhenUploading && onSuccessUpload(file);
        }
        if (file.status === 'removed') {
            setUrlImage([]);
        }
    };

    const handlePreview = () => {
        setVisiblePreview(true);
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
            <Upload
                disabled={disabled}
                accept={accept}
                customRequest={uploadImage}
                onChange={handleOnChange}
                listType="text"
                fileList={isShowFileList ? files : []}
                onPreview={handlePreview}
                onRemove={(files) => onSuccessUpload(files)}
            >
                {files.length >= maxLength ? null : uploadType === 'single' &&
                  files.length >= maxLength ? null : listType === 'text' ? (
                    children
                ) : (
                    <Button
                        style={{
                            height: '100%',
                            border: 'none',
                            outline: 'none',
                            paddingBottom: 1,
                        }}
                        icon={
                            <FileImageOutlined
                                style={{
                                    fontSize: 'large',
                                    color: 'gray',
                                }}
                                onClick={(e) => {}}
                            />
                        }
                    />
                )}
            </Upload>
        </>
    );
};
//API_URL

export default UploadImageChatV2;
