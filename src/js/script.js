{
  'use strict';

  const select = {
    templateOf: {
      books: '#template-book',
    },
    list: {
      booksList: '.books-list',
    },
    all: {
      books: '.book',
      bookImages: '.book__image',
    },
    form: {
      filters: '.filters',
    },
    container: '.container',
  };

  const classNames = {
    book: {
      hiddenBook: 'hidden',
      favorite: 'favorite',
    },
  };
	
  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.books).innerHTML),
  };
	
  class BooksList{
    constructor(){
      const thisBooksList = this;
      thisBooksList.initData();
      thisBooksList.getElements();
      thisBooksList.render();
      thisBooksList.getImages();
      thisBooksList.initActions();
    }
    initData(){
      const thisBooksList = this;
      thisBooksList.data = dataSource;
      thisBooksList.data.books = dataSource.books;
    }
    getElements(){
      const thisBooksList = this;
      thisBooksList.booksList = document.querySelector(select.list.booksList);
      thisBooksList.booksTemplate = document.querySelector(select.templateOf.books);
      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];
      thisBooksList.filterForm = document.querySelector(select.form.filters);
    }
    render(){
      const thisBooksList = this;
      for (let book of thisBooksList.data.books){
        const ratingBgc = thisBooksList.determineRatingBgc(book.rating);
        const ratingWidth = book.rating * 10;
        const bookHTML = templates.book({
          id: book.id,
          name: book.name,
          price: book.price,
          image: book.image,
          rating: book.rating,
          ratingBgc,
          ratingWidth,
        });
        const bookDOM = utils.createDOMFromHTML(bookHTML);
        thisBooksList.booksList.appendChild(bookDOM);
      }
    }
    getImages(){
      const thisBooksList = this;
      thisBooksList.bookImages = document.querySelectorAll(select.all.bookImages);
    }
    initActions(){
      const thisBooksList = this;
      thisBooksList.booksList.addEventListener('dblclick', function(event){
        event.preventDefault();
        const image = event.target.offsetParent;
        const bookID = image.getAttribute('data-id');
        if(!thisBooksList.favoriteBooks.includes(bookID)){
          image.classList.add(classNames.book.favorite);
          thisBooksList.favoriteBooks.push(bookID);
        } else {
          image.classList.remove(classNames.book.favorite);
          thisBooksList.favoriteBooks = thisBooksList.favoriteBooks.filter(id => id !== bookID);
        }
      });
      thisBooksList.filterForm.addEventListener('change', function(event) {
        event.preventDefault();

        console.log(event.target);

        if(event.target.tagName == 'INPUT'
          && event.target.type == 'checkbox'
          && event.target.name == 'filter') {

          if(event.target.checked == true
              && !thisBooksList.filters.includes(event.target.value)) {
            thisBooksList.filters.push(event.target.value);
            thisBooksList.bookFilter();

          } else if(event.target.checked == false) {
            const index = thisBooksList.filters.indexOf(event.target.value);
            thisBooksList.filters.splice(index, 1);
            thisBooksList.bookFilter();
          }
        }
      });
    }
    bookFilter() {
      const thisBookList = this;

      for(let book of thisBookList.data.books) {
        let shouldBeHidden = false;
        for(let filter of thisBookList.filters) {
          console.log('filter: ', filter);
          if(!book.details[filter]) {
            console.log('book.details: ', book.details);
            console.log('book.details[filter]: ', book.details[filter]);
            shouldBeHidden = true;
            break;
          }
        }

        const bookImg = document.querySelector('.book__image[data-id=' + '"' + book.id + '"]');

        if(shouldBeHidden) {
          bookImg.classList.add(classNames.book.hiddenBook);
        } else {
          bookImg.classList.remove(classNames.book.hiddenBook);
        }
      }
    }
    determineRatingBgc(rating){
      let background = '';
      if (rating < 6){
        background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8){
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9){
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if (rating > 9){
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
      return background;
    }
  }
  const app = new BooksList();
}