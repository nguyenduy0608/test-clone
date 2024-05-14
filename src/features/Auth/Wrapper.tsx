import { Spin } from 'antd';
import React, { ReactNode } from 'react';
import { DotLoader } from 'react-spinners';

const Wrapper = ({ loading = true, children, style }: { loading?: boolean; children?: ReactNode; style?: any }) => {
    return (
        <Spin style={style} spinning={loading} indicator={<DotLoader color="orange" />}>
            {children}
        </Spin>
    );
};

export default Wrapper;
