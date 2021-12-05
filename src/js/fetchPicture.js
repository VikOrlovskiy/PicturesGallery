const axios = require('axios');

// =================================================
export default class DataFetch {
  constructor() {
    this.searchValue = '';
    this.page = 1;
  }
  async fetchPictures() {
    const URL = `https://pixabay.com/api/?key=24616580-7493c42b046254b9d37eecdaa&q=${this.searchValue}&page=${this.page}&per_page=40&image_type=photo,orientation=horizontal,safesearch=true,`;
    try {
      const response = await axios.get(URL);
      this.PageCounter();
      return response.data;
    } catch (error) {
      console.error(error);
    }
    // ============================== without async func====================================
    // return fetch(URL)
    //   .then(response => response.json())
    //   .then(data => {
    //     this.PageCounter();
    //     return data;
    //   });
  }
  get value() {
    return this.searchValue;
  }
  set value(value) {
    this.searchValue = value;
  }
  clearPageCount() {
    this.page = 1;
  }
  PageCounter() {
    this.page += 1;
  }
}
