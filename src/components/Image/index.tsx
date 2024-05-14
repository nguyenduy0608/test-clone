import { Col, Image, Input, Row, Typography } from 'antd';
const { Title } = Typography;
type Props = {
    label?: string;
    style?: any;
    alt?: string;
    url: any;
    width?: number;
    height?: number;
};
const ImageAntd = (props: Props) => {
    return props?.label ? (
        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '5px 0' }}>
            <Col span={8}>
                <Title level={5}>{props.label}</Title>
            </Col>
            <Col span={16}>
                <Image alt={props.alt} height={props.height} width={props.width} style={props.style} src={props.url} />
            </Col>
        </Row>
    ) : (
        <Image alt={props.alt} height={props.height} width={props.width} style={props.style} src={props.url} />
    );
};

export default ImageAntd;
