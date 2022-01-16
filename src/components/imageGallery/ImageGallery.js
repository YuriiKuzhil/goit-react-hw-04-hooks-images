import PropTypes from 'prop-types';
import React, { Component } from 'react';
import toast from 'react-hot-toast';
import { ImageGalleryList } from './ImageGallery.styled';
import ImageGalleryItem from './imageGalleryItem';
import ButtonLoadMore from '../buttonLoadMore';
import imageFinderApi from '../../services/imageFinderApi';
import Loader from '../loader';

class ImageGallery extends Component {
  static propTypes = {
    imageName: PropTypes.string.isRequired,
    getModalContent: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
  };
  state = {
    fetchImages: [],
    page: 1,
    query: null,
    showButton: false,
    isLoading: false,
    itemToScroll: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const { page, fetchImages, itemToScroll, query } = this.state;
    const prevName = prevProps.imageName;
    const nextName = this.props.imageName;

    if (prevName !== nextName) {
      this.setState({
        query: nextName,
        page: 1,
        fetchImages: [],
        itemToScroll: null,
      });
    }

    if (prevState.query !== query || prevState.page !== page) {
      this.getImages();
      return;
    }
    if (prevState.fetchImages !== fetchImages && page > 1) {
      document.getElementById(itemToScroll)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  getImages = async () => {
    const { page, fetchImages } = this.state;
    const query = this.props.imageName;

    this.setState({ isLoading: true });

    const data = await imageFinderApi(query, page);

    try {
      if (data.total === 0) {
        toast.error('Images has not been found!');
        this.setState({
          fetchImages: [],
          page: 1,
          showButton: false,
        });
        return;
      }

      const quantityOfPage = data.total / 12;
      this.setState({
        showButton: quantityOfPage > page ? true : false,
      });

      this.setState({
        fetchImages: page === 1 ? data.hits : [...fetchImages, ...data.hits],
        itemToScroll: page === 1 ? null : data.hits[data.hits.length - 1].id,
      });
    } catch {
      toast.error('Something wrong!');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  loadMoreImages = () => {
    this.setState(({ page }) => ({
      page: page + 1,
      showButton: false,
    }));
  };

  openModal = event => {
    if (event.target.nodeName === 'IMG') {
      this.props.openModal();
    }
  };

  getItemContent = (largeImageURL, tags) => {
    const modalContent = {
      largeImageURL,
      tags,
    };

    this.props.getModalContent(modalContent);
  };

  render() {
    const { fetchImages, showButton, isLoading } = this.state;

    return (
      <>
        {fetchImages.length > 0 && (
          <ImageGalleryList onClick={this.openModal}>
            {fetchImages.map(
              ({ id, tags, webformatURL, largeImageURL }, item) => (
                <ImageGalleryItem
                  key={item}
                  imageUrl={webformatURL}
                  imageTag={tags}
                  largeImageURL={largeImageURL}
                  getItemContent={this.getItemContent}
                  id={id}
                />
              ),
            )}
          </ImageGalleryList>
        )}

        {isLoading ? (
          <Loader />
        ) : (
          showButton && (
            <ButtonLoadMore onloadMoreImages={this.loadMoreImages} />
          )
        )}
      </>
    );
  }
}

export default ImageGallery;
