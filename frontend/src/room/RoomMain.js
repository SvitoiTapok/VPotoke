const RoomMain = () => {
    const PATH = "http://localhost:8080/api/video/stream"
    return (
        <video
            width="720"
            controls
            preload="metadata"
            src={PATH}
        />
    );
}
export default RoomMain;