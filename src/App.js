//Moduls
import { Component } from 'react';
import imgApi from './services/img-api';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

//Components
import SearchBar from './components/SearchBar';
import ImageGallery from './components/ImageGallery';
import Button from './components/Button';
import Modal from './components/Modal';

class App extends Component {
  state = {
    images: [],
    searchQuery: '',
    currentPage: 1,
    perPage: 9,
    isLoading: false,
    error: null,
    showModal: false,
    srcImgModal: '',
    tagsImgModal: null,
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.fetchImages();
    }
    if (this.state.currentPage > 2) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  onChangeQuery = query => {
    this.setState({
      searchQuery: query,
      currentPage: 1,
      images: [],
      error: null,
    });
  };

  fetchImages = () => {
    const { searchQuery, perPage, currentPage } = this.state;
    const options = { searchQuery, perPage, currentPage };
    this.setState({ isLoading: true });
    imgApi(options)
      .then(response => {
        const newImages = response.map(img => {
          return {
            id: img.id,
            tags: img.tags,
            smallImg: img.webformatURL,
            bigImg: img.largeImageURL,
          };
        });

        this.setState(prevState => ({
          images: [...prevState.images, ...newImages],
          currentPage: prevState.currentPage + 1,
        }));
      })
      .catch(error => {
        this.setState({ error: error.message });
      })
      .finally(() => this.setState({ isLoading: false }));
  };

  handleOpenModal = (srcBigImg, tagsBigImg) => {
    this.setState(({ showModal, srcImgModal, tagsImgModal }) => ({
      showModal: !showModal,
      srcImgModal: srcBigImg,
      tagsImgModal: tagsBigImg,
    }));
  };

  handleCloseModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };
  render() {
    const {
      images,
      isLoading,
      error,
      showModal,
      srcImgModal,
      tagsImgModal,
    } = this.state;
    const shouldRenderLoadMoreButton = images.length > 0 && !isLoading;
    return (
      <>
        <SearchBar onSubmit={this.onChangeQuery} />
        {error && <h1 className="Error">{error}</h1>}
        <ImageGallery images={images} onModal={this.handleOpenModal} />
        {isLoading && (
          <Loader
            type="Circles"
            color="#3f51b5"
            height={200}
            width={200}
            timeout={3000}
            className="Loader"
          />
        )}
        {shouldRenderLoadMoreButton && <Button onClick={this.fetchImages} />}
        {showModal && (
          <Modal
            imgModal={srcImgModal}
            tagsModal={tagsImgModal}
            onClose={this.handleCloseModal}
          />
        )}
      </>
    );
  }
}

export default App;
