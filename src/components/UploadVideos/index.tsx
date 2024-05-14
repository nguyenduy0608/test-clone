import React, { useEffect, useState } from 'react';
import { Upload, Button, message } from 'antd';
import { Notification, uuid } from '@/utils';
import AxiosClient from '@/apis/AxiosClient';
import { UploadProps } from 'antd/es/upload';
interface Iprops {
    urlVideo: string;
    setUrlVideo: any;
    width: string;
}
function VideoUpload(props: Iprops) {
    const { urlVideo, setUrlVideo, width } = props;
    const [videoUrl, setVideoUrl] = useState<string>();
    // Thêm state mới
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    useEffect(() => {
        setVideoUrl(urlVideo);
    }, [urlVideo]);
    const handleUpload = async (file: any) => {
        if (file?.type === 'video/mp4') {
            if (file?.size > 200 * 1024 * 1024) {
                file.status = 'error';
                return Notification('warning', 'Vui lòng tải video có dung lượng nhỏ hơn 200 MB');
            }
        }
        if (file?.type === 'video/mp4') {
            try {
                const formData = new FormData();
                formData.append('video', file);

                const config = {
                    onUploadProgress: (progressEvent: any) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    },
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                };
                const response = await AxiosClient.post(`/uploads/video`, formData, config);

                setVideoUrl(response.data?.absoluteUrl);
                setUrlVideo(response.data?.absoluteUrl);
            } catch (error) {
                // console.error(error);
                message.error('Tải lên video thất bại');
            }
        } else {
            return Notification('warning', 'Vui lòng tải video có định dạng .mp4');
        }
    };

    const handleRemove = () => {
        setVideoUrl('');
        setUrlVideo('');
    };

    return (
        <div>
            <Upload accept="video/*" beforeUpload={handleUpload} showUploadList={false}>
                <Button>Tải lên video</Button>
            </Upload>
            {uploadProgress > 0 && uploadProgress < 100 && (
                <div style={{ marginTop: 10 }}>
                    <progress value={uploadProgress} max={100} />
                    <p>{`Đang tải lên: ${uploadProgress}%`}</p>
                </div>
            )}
            {videoUrl && (
                <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between' }}>
                    <video key={uuid()} width={width} height={250} controls>
                        <source src={videoUrl} type="video/mp4" />
                    </video>
                    <Button type="link" onClick={handleRemove}>
                        Xóa
                    </Button>
                </div>
            )}
        </div>
    );
}

export default VideoUpload;
