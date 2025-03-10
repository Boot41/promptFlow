import React, { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  children: {
    title: string;
    body: ReactNode;
  };
};

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      aria-hidden="true"
    >
      {/* Blurred Background */}
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-lg backdrop-filter transition-opacity"
        onClick={closeModal}
      ></div>

      {/* Modal Container */}
      <div className="relative p-4 w-full max-w-md max-h-full z-50">
        {/* Modal Content */}
        <div className="relative bg-white rounded-lg shadow-lg dark:bg-white-700">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-blue-500">
              {children.title}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeModal}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 md:p-5">{children.body}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
