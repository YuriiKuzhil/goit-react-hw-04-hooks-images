import PropTypes from 'prop-types';
import { ImageGalleryList } from './ImageGallery.styled';
import ImageGalleryItem from './imageGalleryItem';

export default function ImageGallery({
  fetchImages,
  getModalContent,
  toggleModal,
}) {
  const openModal = event => {
    if (event.target.nodeName === 'IMG') {
      toggleModal();
    }
  };
  const getItemContent = (largeImageURL, tags) => {
    const modalContent = {
      largeImageURL,
      tags,
    };

    getModalContent(modalContent);
  };
  return (
    <ImageGalleryList onClick={openModal}>
      {fetchImages.map(({ id, tags, webformatURL, largeImageURL }, item) => (
        <ImageGalleryItem
          key={item}
          imageUrl={webformatURL}
          imageTag={tags}
          largeImageURL={largeImageURL}
          getItemContent={getItemContent}
          id={id}
        />
      ))}
    </ImageGalleryList>
  );
}
ImageGallery.propTypes = {
  fetchImages: PropTypes.array.isRequired,
  getModalContent: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};
