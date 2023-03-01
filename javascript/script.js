document.addEventListener("DOMContentLoaded", () => {
  popularComicRender();
});

// Slider
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 10,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 50,
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// PopularComicRender
let popularComicRender = () => {
  let popularComic = fetch("https://komiku-api.fly.dev/api/comic/popular/page/1");
  popularComic
    .then((response) => response.json())
    .then((response) => {
      const comics = response.data;
      let result = "";
      comics.map((comic) => {
        let comics = `<div class="swiper-slide">
                        <div class="card" style="width: 18rem">
                          <img src="${comic.image}" class="card-img-top" alt="..." />
                          <div class="card-body">
                            <h5 class="card-title">Title : ${comic.title}</h5>
                            <h6>Type : ${comic.type}</h6>
                            <p class="card-text">Deskripsi : ${comic.desc}</p>
                            <a href="index2.html" target="_blank" class="btn btn-primary button-info" data-endpoint="${comic.endpoint}">
                              Baca ngabs
                            </a>
                          </div>
                        </div>
                      </div>`;
        result += comics;
        document.querySelector(".swiper-wrapper").innerHTML = result;
      });
    });
};

// Get Query Render
const searchButton = document.querySelector(".submit-query");
const mangaContainer = document.querySelector(".manga");
searchButton.addEventListener("click", () => {
  const titleQuery = document.querySelector(".title-query").value;
  if (!titleQuery) {
    alert("Kata kunci belum dimasukkan");
    window.location.reload();
  }
  renderComicQuery(titleQuery);
});
let renderComicQuery = (titleQuery) => {
  return fetch(`https://komiku-api.fly.dev/api/comic/search/${titleQuery}`)
    .then((e) => e.json())
    .then((e) => {
      if (!e.success) {
        return alert("masukin kata kunci yang bener blok!");
      }
      const queryComics = e.data;
      mangaContainer.innerHTML = `<h3>Hasil Pencarian :</h3>
                                  <div class='row'>
                                    <div class='col-md container-query'></div>
                                  </div>`;
      let queryResult = "";
      queryComics.map((queryC) => {
        const queryComs = `<div class="card" style="width: 18rem">
                              <img src="${queryC.image}" class="card-img-top" alt="..." />
                              <div class="card-body">
                                <h5 class="card-title">Title : ${queryC.title}</h5>
                                <h6>Type : ${queryC.type}</h6>
                                <p class="card-text">Deskripsi : ${queryC.desc}</p>
                                <a href="index2.html" target="_blank" class="btn btn-primary button-info" data-endpoint="${queryC.endpoint}">
                                  Baca ngabs
                                </a>
                              </div>
                            </div>`;
        queryResult += queryComs;
        document.querySelector(".container-query").innerHTML = queryResult;
      });
    });
};

// get Info Manga (Event Binding)
document.body.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("button-info")) {
    fetch(`https://komiku-api.fly.dev/api/comic/info${e.target.dataset.endpoint}`)
      .then((info) => info.json())
      .then((info) => {
        let result = "";
        mangaContainer.innerHTML = `<div class="manga-info text-center">
                                    </div>`;
        const mangaInfo = info.data;
        console.log(mangaInfo);
        let chapterList = mangaInfo.chapter_list.map((e) => {
          return `<li class="manga-chapter" data-chapter="${e.endpoint}">${e.name}</li>`;
        });
        result = `<img src="${mangaInfo.thumbnail}" class="img-fluid mthumbnail" alt="manga-thumbnails">
                  <h4>Title : ${mangaInfo.title}</h4>
                  <h5>Author : ${mangaInfo.author}</h5>
                  <h5>Genre : ${mangaInfo.genre.join(", ")}</h5>
                  <h5>Rating : ${mangaInfo.rating}</h5>
                  <h5>Status : ${mangaInfo.status}</h5>
                  <div class="chapter-list">
                    <ul>
                      ${chapterList.join("")}
                    </ul>
                  </div>
                  <div class="image-of-manga"></div>`;

        document.querySelector(".manga-info").innerHTML = result;
      });
  }
  if (e.target && e.target.classList.contains("manga-chapter")) {
    console.log(e.target.dataset.chapter);
    fetch(`https://komiku-api.fly.dev/api/comic/chapter${e.target.dataset.chapter}`)
      .then((chapters) => chapters.json())
      .then((chapters) => {
        console.log(chapters);
        const mangaChapters = document.querySelector(".image-of-manga");
        mangaChapters.innerHTML = "";
        let chapterData = chapters.data;
        let chapterImg = chapterData.image.map((img) => {
          return `<img class="img-fluid" src="${img}" alt="image chapters">`;
        });
        let manga = `<h5>${chapterData.title}</h5>
                      ${chapterImg.join("")}`;

        mangaChapters.innerHTML = manga;
      });
  }
});
