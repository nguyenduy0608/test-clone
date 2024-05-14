import { images } from '@/assets/imagesAssets';
import { splitTextEndLine } from '@/utils';
import { Avatar, Image } from 'antd';
import moment from 'moment';
import styled from 'styled-components';

interface MessageProps {
    is_self: boolean;
    avatar?: string | '';
    content?: string | '';
    message_media_url?: any;
    type_message_media?: number;
    create_at: any;
    user: any;
    video: any;
}

function MessageItem({ is_self, avatar, content, video, message_media_url, create_at, user }: MessageProps) {
    return (
        <li className={is_self ? 'self' : 'other'}>
            <div className="avatar">
                <Avatar
                    size={40}
                    src={avatar}
                    icon={<img src={avatar ? '' : images.logoSideBar} />}
                    draggable={false}
                />
            </div>
            <div className="msg">
                <p style={{ fontSize: 11, color: '#383737' }}>{user?.name}</p>
                {(video && message_media_url) || video ? (
                    <video controls>
                        <source src={video} type="video/mp4" />
                    </video>
                ) : (
                    <></>
                )}
                {message_media_url && !video ? (
                    <Image className="img" src={message_media_url} fallback={message_media_url} draggable="false" />
                ) : (
                    <></>
                )}

                {content &&
                    splitTextEndLine(content).map((text: string) => (
                        <p style={{ fontWeight: 500, fontSize: 16, wordWrap: 'break-word' }}>{text}</p>
                    ))}
                <span style={{ fontSize: 10, color: 'gray' }}>({moment(create_at).format('HH:mm DD-MM-YYYY')})</span>
            </div>
        </li>
    );
}

export default MessageItem;
