function Notification({ message, type, setNotification }) {
  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
      <button className="close" onClick={() => setNotification(null)}>&times;</button>
      <style jsx>{`
        .notification {
            position: fixed;
            bottom: 1rem;
            right: 1rem;
            width: 200px;
            height: 50px;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 9999;
            border-radius: 5px;
            animation: fadeRight 0.5s;
            padding: 0.5rem;
        }
        .notification p {
            color: white;
            font-size: 1rem;
            font-weight: bold;
            margin: 0;
        }
        .success {
            background-color: #4caf50;
        }
        .error {
            background-color: #f44336;
        }
        .close {
            background-color: transparent;
            border: none;
            color: white;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
        }

        @keyframes fadeRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        `}</style>
    </div>
  );
}

Notification.defaultProps = {
    type: 'info',
};

export default Notification;