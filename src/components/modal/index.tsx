import React, { FC, ReactNode } from "react";

type ModalPropsType = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const Modal: FC<ModalPropsType> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="modal">
        <div className="modal-title">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </>
  );
};
