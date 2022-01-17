import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';
import Searchbar from './components/searchbar';
import ImageGallery from './components/imageGallery';
import Modal from './components/modal';
import imageFinderApi from './services/imageFinderApi';
import Loader from './components/loader';
import ButtonLoadMore from './components/buttonLoadMore';

export default function App() {
  const [imageName, setImageName] = useState('');
  const [page, setPage] = useState(1);
  const [fetchImages, setFetchImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setmodalContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [itemToScroll, setItemToScroll] = useState(false);

  useEffect(() => {
    if (!imageName) {
      return;
    }
    const getImages = async () => {
      setIsLoading(true);
      const data = await imageFinderApi(imageName, page);
      try {
        if (data.total === 0) {
          toast.error('Images has not been found!');
          setFetchImages([]);
          setPage(1);
          setShowButton(false);
          return;
        }

        const quantityOfPage = data.total / 12;

        quantityOfPage > page ? setShowButton(true) : setShowButton(false);

        if (page === 1) {
          setFetchImages(data.hits);
          setItemToScroll(null);
          return;
        } else {
          setFetchImages(state => [...state, ...data.hits]);
          setItemToScroll(data.hits[data.hits.length - 1].id);
        }
      } catch {
        toast.error('Something wrong!');
      } finally {
        setIsLoading(false);
      }
    };

    getImages(imageName, page);
  }, [imageName, page]);

  useEffect(() => {
    document.getElementById(itemToScroll)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [itemToScroll]);

  const handleFormSubmit = imageName => {
    setImageName(imageName);
    setPage(1);
    setFetchImages([]);
  };
  const toggleModal = () => {
    setShowModal(state => !state);
  };
  const getModalContent = modalContent => {
    setmodalContent(modalContent);
  };
  const loadMoreImages = () => {
    setPage(state => state + 1);
    setShowButton(false);
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleFormSubmit} />
      {fetchImages.length > 0 && (
        <ImageGallery
          getModalContent={getModalContent}
          fetchImages={fetchImages}
          toggleModal={toggleModal}
        />
      )}

      {isLoading ? (
        <Loader />
      ) : (
        showButton && <ButtonLoadMore onloadMoreImages={loadMoreImages} />
      )}
      <Toaster position="bottom-right" />
      {showModal && <Modal onClose={toggleModal} data={modalContent} />}
    </div>
  );
}
