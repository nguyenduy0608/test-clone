import { Col, Input, Row, Typography } from 'antd';
const { Title } = Typography;
type Props = {
    label: string;
    placeholder?: string;
    style?: any;
    valueInput?: any;
    width?: number;
    isDisabeld?: boolean;
    onChangeInput?: any;
};
const InputAntd = (props: Props) => {
    const onChange = (e: any) => {
        props.onChangeInput(e.target.value);
    };
    return (
        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '5px 0' }}>
            <Col span={8}>
                <Title level={5}>{props.label}</Title>
            </Col>
            <Col span={16}>
                <Input
                    disabled={props.isDisabeld}
                    width={props.width}
                    style={props.style}
                    placeholder={props.placeholder}
                    onChange={(e) => onChange(e)}
                    value={props.valueInput}
                />
            </Col>
        </Row>
    );
};

export default InputAntd;
