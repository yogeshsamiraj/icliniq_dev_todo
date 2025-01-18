import React from "react";
import "./style.css";
import { FaCheck, FaTimes } from "react-icons/fa";

interface PopupProps {
  type: "error" | "confirmation";
  message: string;
  onConfirm?: () => void;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ type, message, onConfirm, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>{type === "error" ? "Error" : "Confirmation"}</h2>
        <p>{message}</p>
        <div className="popup-actions">
          {type === "confirmation" && (
            <>
              <button className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button className="confirm-button" onClick={onConfirm}>
              Delete
              </button>
            </>
          )}
          {type === "error" && (
            <button className="error-close-button" onClick={onClose}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
