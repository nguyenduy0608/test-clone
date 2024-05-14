import AxiosClient from '@/apis/AxiosClient';
import { Notification } from '@/utils';
import { VideoCameraOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import type { UploadProps } from 'antd/es/upload';
import { UploadFile, UploadListType } from 'antd/lib/upload/interface';
import React, { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
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
    urlVideo: string;
    setUrlVideo: any;
    filesVideo?: any;
    setFilesVideo?: any;
}

const UploadVideoChat: React.FC<IProps> = ({
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
    urlVideo,
    filesVideo,
    setFilesVideo,
    setUrlVideo,
}) => {
    const [visiblePreview, setVisiblePreview] = React.useState(false);
    const firstLoad = React.useRef(false);
    const [videoUrl, setVideoUrl] = useState<string>();
    useEffect(() => {
        setVideoUrl(urlVideo);
    }, [urlVideo]);
    const uploadVideo = async (options: any) => {
        const { onSuccess, onError, file, onProgress } = options;
        if (file?.type === 'video/mp4') {
            const fmData = new FormData();

            fmData.append('video', file);
            try {
                const res = await AxiosClient.post(`/uploads/video`, fmData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (res.status) {
                    setVideoUrl(res?.data?.absoluteUrl);
                    setUrlVideo(res?.data?.absoluteUrl);
                    onSuccessUpload(res?.data as string);
                    setVideoName?.(file.name);
                    onSuccess('ok');
                } else {
                    file.status = 'error';
                    const error = new Error('Some error');
                    if (uploadType === 'single') {
                        setFilesVideo([]);
                    } else {
                        setFilesVideo((f: any) => [...f.filter((_f: any) => _f.status !== 'uploading'), file]);
                    }
                    onError({ error });
                }
            } catch (err) {
                file.status = 'error';
                const error = new Error('Some error');
                if (uploadType === 'single') {
                    setFilesVideo([file]);
                } else {
                    setFilesVideo((f: any) => [...f.filter((_f: any) => _f.status !== 'uploading'), file]);
                }
                onError({ error });
            }
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
                return Notification('warning', 'Vui lòng tải video có dung lượng nhỏ hơn 200 MB');
            }
        } else {
            return Notification('warning', 'Vui lòng tải Video đúng định dạng video/mp4');
        }

        if (file.status !== 'error') {
            setFilesVideo(fileList);
            // onSuccessUpload(file?.status);
        }
        if (file.status !== 'removed') {
            !isUploadServerWhenUploading && onSuccessUpload(file);
        }
        if (file.status === 'removed') {
            setUrlVideo('');
        }
    };

    const handlePreview = async (file: UploadFile) => {
        setVisiblePreview(true);
        return;
    };
    React.useEffect(() => {
        if (firstLoad?.current) return;
        if (initialFile) {
            setFilesVideo(initialFile);
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
                fileList={isShowFileList ? filesVideo : []}
                className="image-upload-grid"
                onPreview={handlePreview}
                onRemove={(files) => onSuccessUpload(files)}
            >
                {filesVideo.length >= maxLength ? null : uploadType === 'single' &&
                  filesVideo.length >= 1 ? null : listType === 'text' ? (
                    children
                ) : (
                    <Button
                        style={{
                            height: '100%',
                            border: 'none',
                            outline: 'none',
                            // paddingLeft: '18px',
                        }}
                        icon={
                            <VideoCameraOutlined
                                style={{
                                    fontSize: 'large',
                                    color: 'gray',
                                }}
                                onClick={(e: any) => {}}
                            />
                        }
                    />
                )}
            </UploadStyled>
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

export default UploadVideoChat;
