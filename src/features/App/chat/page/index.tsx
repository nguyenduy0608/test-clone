import React from 'react';
import { ChatArea, Container, EmptyChatArea, Header, SlideBar } from '../components';
import TopBar from '@/components/TopBar';
import { Button } from 'antd';

const ChatPage = () => {
    const [isStartNewTopic, setIsStartNewTopic] = React.useState<boolean>(false);

    return (
        <Container
            headerComponent={Header}
            filterComponent={<SlideBar isStartNewTopic={isStartNewTopic} />}
            setIsStartNewTopic={setIsStartNewTopic}
            contentComponent={<ChatArea setIsStartNewTopic={setIsStartNewTopic} />}
            emptyContentComponent={EmptyChatArea}
        />
    );
};

export default ChatPage;
