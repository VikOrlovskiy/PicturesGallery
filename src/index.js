import './sass/main.scss';
import Notiflix from 'notiflix';
import PictureApiService from './js/fetchPicture';
import LoadMoreBtn from './js/loadMoreBtn';
import picTamplate from './templates/pic';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// ===================================================
const Refs = {
  form: document.getElementById('search-form'),
  picturesContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const lightbox = new SimpleLightbox('.gallery a');
const pictureApiService = new PictureApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
// ===================================================
Refs.form.addEventListener('submit', imageSerch);
loadMoreBtn.refs.button.addEventListener('click', loadMorePic);
// ==========================
function loadMorePic() {
  pictureApiService.fetchPictures().then(data => {
    if (data.totalHits < pictureApiService.page * 40) {
      loadMoreBtn.hide();
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
    createPicCard(data);
    lightbox.refresh();
  });
}
// ===================================================
function imageSerch(e) {
  e.preventDefault();
  pictureApiService.value = e.currentTarget.elements.searchQuery.value.trim();
  pictureApiService.clearPageCount();
  pictureApiService
    .fetchPictures()
    .then(data => {
      if (pictureApiService.value === '' || data.hits.length === 0) {
        Refs.form.reset();
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      } else if (data.totalHits < 40) {
        loadMoreBtn.hide();
        Notiflix.Notify.success(`Hooray! We found  ${data.totalHits}  images.`);
        return createPicCard(data);
      }
      clearPicContainer();
      loadMoreBtn.show();
      createPicCard(data);
      Notiflix.Notify.success(`Hooray! We found  ${data.totalHits}  images.`);
    })
    .then(e => {
      lightbox.refresh();
    })
    .catch(e => {
      Notiflix.Notify.info(`Something went wrong please try again`);
      console.log(e);
    });
}
// ============createPicCard====================
function createPicCard(data) {
  return data.hits.map(
    ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return Refs.picturesContainer.insertAdjacentHTML(
        'beforeend',
        picTamplate({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }),
      );
    },
  );
}
// ============================================
function clearPicContainer() {
  Refs.picturesContainer.innerHTML = '';
}
