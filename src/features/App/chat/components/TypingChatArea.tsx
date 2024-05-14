import { LoadingOutlined, SendOutlined, SmileOutlined } from '@ant-design/icons';
import { Button, Col, Popover, Row, Spin } from 'antd';
import { UploadFile } from 'antd/es/upload';
import Picker from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { requestSendMessage, requestSendMessageToNewUser } from '../service/ChatService';
import { readATopicMessage } from '../slices/MessageNotReadSlice';
import UploadVideoChat from './UploadVideoChat';

import UploadImageChatV2 from '@/components/Upload/UploadImageChatV2';
// import VideoThumbnailGenerator from 'video-thumbnail-generator';
interface ITypingChartArea {
    id?: string;
    otherInfo?: any | null;
    setIsStartNewTopic: React.Dispatch<React.SetStateAction<boolean>>;
    setMessages?: any;
    setCheckSend?: any;
}

function TypingChatArea(props: ITypingChartArea) {
    const { id, otherInfo, setIsStartNewTopic, setCheckSend } = props;
    const dispatch = useDispatch();
    const inputRef = useRef<any>(null);
    const [sendLoading, setSendLoading] = useState<boolean>(false);
    const [urlImage, setUrlImage] = React.useState<any[]>([]);
    const [urlVideo, setUrlVideo] = React.useState<any>('');
    const [thumbnail, setThumbnail] = React.useState<any>('');
    const [files, setFiles] = React.useState<UploadFile[]>([]);
    const [filesVideo, setFilesVideo] = React.useState<UploadFile[]>([]);

    useEffect(() => {
        inputRef.current.value = '';
        inputRef.current.focus();
    }, [sendLoading]);

    const checkImage = (file: any) => {
        if (file?.name) {
            setUrlImage((prevObjects) =>
                prevObjects.filter((obj) => {
                    const originalName = obj?.originalName || '';
                    return typeof originalName === 'string' && originalName.includes(file.name);
                })
            );
        } else {
            setUrlImage((prev: any) => (prev ? [...prev, file] : [file]));
        }
    };

    const onSendMessage = async () => {
        const valInput = inputRef.current.value.trim();
        if (id && (valInput !== '' || urlImage.length > 0 || urlVideo !== '')) {
            try {
                setSendLoading(true);
                const arrText: Array<string> = valInput.split('\n');
                let resText = '';
                arrText.forEach((e, i) => {
                    if (i !== arrText.length - 1) resText += e + '\\n';
                    else resText += e;
                });

                const dataUpload: any = {
                    conversationId: Number(id),
                    content: resText,
                    // receiver: string,
                    reply_message_id: otherInfo?.id,
                    image: urlImage[0]?.absoluteUrl || thumbnail,
                    video: urlVideo,
                };

                inputRef.current.value = '';
                setUrlImage([]);
                setFiles([]);
                setFilesVideo([]);
                setUrlVideo('');
                let res: any;
                if (id !== 'default_id') {
                    res = await requestSendMessage(dataUpload);
                } else {
                    res = await requestSendMessageToNewUser(dataUpload);
                    if (res?.status) {
                        //   history.push(`/chat/${res?.data?.topic_message_id}`);
                        setIsStartNewTopic((prev) => !prev);
                    }
                }

                if (res?.status) {
                    inputRef.current.value = '';
                    setUrlImage([]);
                    setFilesVideo([]);
                    setFiles([]);
                    setUrlVideo('');
                    setCheckSend(true);
                }
            } catch (error) {
                console.log('error', error);
            } finally {
                setSendLoading(false);
            }
        }
    };
    const onAppendNewLine = (e: any) => {
        const valInput: string = inputRef.current.value,
            start = e.target.selectionStart,
            end = e.target.selectionEnd;
        inputRef.current.value = valInput.substring(0, start) + '\n' + valInput.substring(end);
        inputRef.current.selectionStart = inputRef.current.selectionEnd = start + 1;
        e.preventDefault();
    };
    useEffect(() => {
        const handleKeyPress = (event: any) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                // Xử lý khi phím Enter được ấn (không có Shift)
                event.preventDefault(); // Ngăn chặn sự kiện mặc định của phím "Enter"
                // Gọi hàm xử lý khi ấn Enter ở đây
                onSendMessage();
            }
        };

        // Thêm sự kiện lắng nghe cho sự kiện keydown trên toàn màn hình
        document.addEventListener('keydown', handleKeyPress);

        // Hủy sự kiện lắng nghe khi component unmount
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [onSendMessage]); // Đảm bảo cập nhật sự kiện lắng nghe khi `onSendMessage` thay đổi

    return (
        <Row
            // align="middle"
            style={{
                marginLeft: 10,
                width: '100%',
                height: '20%',
                boxShadow: '0 -5px 5px -5px #333',
            }}
        >
            <Col style={{ height: '100%', width: '100%' }}>
                <Row
                    align="middle"
                    style={{
                        height: '40%',
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        paddingLeft: 6,
                        justifyContent: 'start',
                    }}
                >
                    <Popover
                        style={{ width: 100 }}
                        content={
                            <Picker
                                onEmojiClick={(event: any, emojiObj: any) => {
                                    inputRef.current.value += event.emoji;
                                }}
                                style={{ width: '270px', margin: '0px' }}
                            />
                        }
                        title=""
                        trigger="click"
                    >
                        <Button
                            className="button-hover"
                            style={{
                                height: '100%',
                                border: 'none',
                                outline: 'none',
                                marginRight: 0,
                            }}
                            icon={
                                <SmileOutlined
                                    style={{
                                        fontSize: 'large',
                                        color: 'gray',
                                    }}
                                    onClick={(e) => {}}
                                />
                            }
                        />
                    </Popover>

                    <UploadImageChatV2
                        setUrlImage={setUrlImage}
                        setFiles={setFiles}
                        files={files}
                        accept=".png, .jpg, .jpeg"
                        isUploadServerWhenUploading
                        uploadType="single"
                        listType="picture-card"
                        maxLength={1}
                        onSuccessUpload={(file: any) => {
                            checkImage(file);
                        }}
                        // disabled={urlVideo !== ''}
                        isShowFileList
                        initialFile={urlImage}
                    />
                    <UploadVideoChat
                        setFilesVideo={setFilesVideo}
                        filesVideo={filesVideo}
                        onSuccessUpload={(file: any) => {
                            return {};
                        }}
                        // disabled={urlImage.length !== 0}
                        urlVideo={urlVideo}
                        setUrlVideo={setUrlVideo}
                    />
                </Row>
                <Row
                    justify="space-between"
                    align="middle"
                    style={{
                        height: '67%',
                        width: '100%',
                        padding: 4,
                    }}
                    className="container-input-outline"
                >
                    <textarea
                        className="input-inside"
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        // disabled={(urlImage.length === 0 ? false : true) || urlVideo !== ''}
                        placeholder={`Nhập tin nhắn ${'...'}`}
                        name="msg"
                        required
                        ref={inputRef}
                        onFocus={() => dispatch(readATopicMessage({ topic_message_id: id }))}
                        onKeyDown={(e) => {
                            if (!e.shiftKey && e.key === 'Enter' && inputRef.current.value.trim() !== '') {
                                onSendMessage();
                            } else if (
                                (!e.shiftKey &&
                                    e.key === 'Enter' &&
                                    urlImage &&
                                    inputRef.current.value.trim() === '') ||
                                (!e.shiftKey && e.key === 'Enter' && urlVideo && inputRef.current.value.trim() === '')
                            ) {
                                onSendMessage();
                            } else if (e.shiftKey && e.key === 'Enter') {
                                onAppendNewLine(e);
                            }
                        }}
                    />
                    {sendLoading ? (
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} className="loading-btn" />
                    ) : (
                        <Button
                            className="button-inside button-hover"
                            icon={
                                <SendOutlined
                                    style={{
                                        fontSize: 'large',
                                        color: 'gray',
                                    }}
                                    onClick={(e) => {
                                        onSendMessage();
                                    }}
                                />
                            }
                        />
                    )}
                </Row>
            </Col>
        </Row>
    );
}
export default TypingChatArea;
