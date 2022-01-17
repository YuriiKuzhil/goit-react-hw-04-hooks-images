import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Overlay, ModalContainet } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ onClose, data }) {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
  const handleKeyDown = e => {
    if (e.code === 'Escape') {
      onClose();
    }
  };
  const handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };
  const { tags, largeImageURL } = data;
  return createPortal(
    <Overlay onClick={handleBackdropClick}>
      <ModalContainet>
        <img src={largeImageURL} alt={tags} />
      </ModalContainet>
    </Overlay>,
    modalRoot,
  );
}
Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    tags: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
  }),
};
