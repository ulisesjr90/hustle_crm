import { FaTimes } from 'react-icons/fa'; // Close icon

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // Handle click outside modal to close
  const handleOutsideClick = (e) => {
    if (e.target.id === 'modal-overlay') {
      onClose();  // Close modal if clicked outside
    }
  };

  return (
    <div
      id="modal-overlay" 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleOutsideClick} // Close modal on background click
    >
      <div
        className="relative bg-gray-900 w-full max-w-lg p-6 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}  // Prevent click from closing modal when clicking inside
      >
        {/* Scrollable Content */}
        <div className="max-h-[90vh] overflow-y-auto w-full">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          >
            <FaTimes size={20} />
          </button>

          {/* Modal Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
