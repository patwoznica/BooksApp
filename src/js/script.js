/* eslint-disable indent */
{
  'use strict';

  const select = {
    templateOf: {
      bookTemplate: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      form: '.filters',
    },
    book: {
      image: 'book__image',
      favorite: '.books-list .favorite',
    },
  };

  const classNames = {
    favoriteBook: 'favorite',
    hidden: 'hidden',
  };

  const templates = {
    bookTemplate: Handlebars.compile(document.querySelector(select.templateOf.bookTemplate).innerHTML),
  };

  class BookList {

    constructor() {
      const thisBook = this;

      thisBook.initData();
      thisBook.getElements();
      thisBook.render();
      thisBook.initActions();
    }

    initData() {
      const thisBook = this;
      thisBook.data = dataSource.books;
      thisBook.favoriteBooks = [];
      thisBook.filters = [];
    }

    getElements() {
      const thisBook = this;

      thisBook.menuContainer = document.querySelector(select.containerOf.booksList);
      thisBook.formHtmlFiltered = document.querySelector(select.containerOf.form);

    }
    render() {
      const thisBook = this;

      for (let eachBook of this.data) {
       
        eachBook.ratingBgc = thisBook.determineRatingBgc(eachBook.rating);
        console.log(eachBook);
        eachBook.ratingWidth = eachBook.rating * 10;

        const generatedHTML = templates.bookTemplate(eachBook);
        //console.log(eachBook.ratingWidth);
        //console.log(eachBook.ratingBgc);
        // element dom from html
        const element = utils.createDOMFromHTML(generatedHTML);
        //console.log ('element:', element);

        // genedated DOM add to list .books-list as new child
        //const bookListContainer = document.querySelector(select.containerOf.booksList);
        //console.log('bookListContainer:', bookListContainer);

        thisBook.menuContainer.appendChild(element);
      }
    }

    filterBooks() {
      const thisBook = this;

      console.log(thisBook.data);
      console.log(thisBook.filters);

      for (let eachBook of thisBook.data) {
        let shoultBeHidden = false;

        for (let filter of thisBook.filters) {
          if (!eachBook.details[filter]) {
            shoultBeHidden = true;
            break;
          }
        }
        if (shoultBeHidden) {
          const book = document.querySelector('.book__image[data-id="' + eachBook.id + '"]');
          book.classList.add(classNames.hidden);
        } else {
          const book = document.querySelector('.book__image[data-id="' + eachBook.id + '"]');
          book.classList.remove(classNames.hidden);
        }

      }
    }

    initActions() {
      const thisBook = this;


      thisBook.menuContainer.addEventListener('dblclick', function (event) {
        event.preventDefault();

        const element = event.target.offsetParent;
        //console.log(elem);
        if (element.classList.contains(select.book.image)) {
          // console.log(select.book.image);
          const id = element.getAttribute('data-id');

          if (thisBook.favoriteBooks.includes(id)) {
            const indexOfBookID = thisBook.favoriteBooks.indexOf(id);
            element.classList.remove(classNames.favoriteBook);
            thisBook.favoriteBooks.splice(indexOfBookID, 1);
          }
          else {
            element.classList.add(classNames.favoriteBook);
            thisBook.favoriteBooks.push(id);
          }
        }
      });

      thisBook.formHtmlFiltered.addEventListener('change', function (event) {
        event.preventDefault();
        const element = event.target;
        if (element.type === 'checkbox') {
          if (element.checked) {
            thisBook.filters.push(element.value);
            //console.log('thisBook.filters', thisBook.filters);
          } else {
            const indexOfFilter = thisBook.filters.indexOf(element.value);
            thisBook.filters.splice(indexOfFilter, 1);
          }
        }
        thisBook.filterBooks();

      });

      //console.log('favoriteBooks', thisBook.favoriteBooks);
    }
    determineRatingBgc(rating) {
      let background = '';
      if (rating <= 6) background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);';
      else if (rating > 6 && rating <= 8) background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
      else if (rating > 8 && rating <= 0) background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
      else if (rating > 9) background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
      return background;
    }

  }

  // eslint-disable-next-line no-unused-vars
  const app = new BookList();

}