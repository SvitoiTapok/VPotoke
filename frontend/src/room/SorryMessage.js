import React from "react";
import {useNavigate} from "react-router-dom";

const SorryPage = () => {
    const navigate = useNavigate()
    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h1 style={styles.title}>Вы были исключены</h1>
                <p style={styles.text}>
                    Извините, вы были исключены из этой комнаты.
                </p>
                <p style={styles.sub}>
                    Попробуйте зайти снова, открыв комнату в новой вкладке.
                </p>
                <button onClick={()=>navigate("/")}>
                    На главную
                </button>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0b1c2d, #112a44)",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
    },
    card: {
        background: "#081421",
        padding: "40px 60px",
        borderRadius: "12px",
        boxShadow: "0 0 20px rgba(0,0,0,0.5)",
        textAlign: "center",
        border: "2px solid #ff8c00",
    },
    title: {
        color: "#ff4d4f",
        marginBottom: "16px",
    },
    text: {
        fontSize: "18px",
        marginBottom: "8px",
    },
    sub: {
        fontSize: "14px",
        color: "#ccc",
    },
};

export default SorryPage;
