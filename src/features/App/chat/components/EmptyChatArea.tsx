import { images } from '@/assets/imagesAssets';
function EmptyChatArea() {
    return (
        <div
            style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                color: 'slategray',
            }}
        >
            <img style={{ width: '50%' }} src={images.logoSideBar} draggable="false" />
            <p style={{ fontSize: 18, userSelect: 'none' }}>Chào mừng đến với chat Thanh tước Farm!</p>
            <p style={{ fontSize: 14, userSelect: 'none' }}>Chọn một cuộc hội thoại để bắt đầu chat!</p>
        </div>
    );
}
export default EmptyChatArea;
