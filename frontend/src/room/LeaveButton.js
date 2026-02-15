import { useNavigate } from "react-router-dom";

const LeaveButton = () => {
    const navigate = useNavigate();

    const handleLeave = () => {
        // Можно добавить очистку WS / участника здесь
        navigate("/rooms"); // переход на другую страницу
    };

    return (
        <button className="leave-button" onClick={handleLeave}>
            Leave
        </button>
    );
};

export default LeaveButton;