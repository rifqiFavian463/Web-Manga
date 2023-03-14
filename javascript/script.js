document.addEventListener("DOMContentLoaded", () => {
  popularComic();
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

// show popular comic
const popularComic = async () => {
  try {
    const dataPopularComic = await getPopularComic();
    renderPopularComic(dataPopularComic);
  } catch (error) {
    console.log(error);
  }
};
const getPopularComic = () => {
  return fetch("https://komiku-api.fly.dev/api/comic/popular/page/1")
    .then((response) => response.json())
    .then((response) => response.data);
};
const renderPopularComic = (datas) => {
  let result = "";
  datas.map((data) => {
    result += `<div class="swiper-slide">
                          <div class="card" style="width: 18rem">
                            <img src="${data.image}" class="card-img-top" alt="..." />
                            <div class="card-body">
                              <h5 class="card-title">Title : ${data.title}</h5>
                              <h6>Type : ${data.type}</h6>
                              <p class="card-text">Deskripsi : ${data.desc}</p>
                              <a href="#" class="btn btn-primary button-info" data-endpoint="${data.endpoint}">
                                Baca ngabs
                              </a>
                            </div>
                          </div>
                        </div>`;
    document.querySelector(".swiper-wrapper").innerHTML = result;
  });
};

// show manga from query
const searchButton = document.querySelector(".submit-query");
searchButton.addEventListener("click", () => {
  const titleQuery = document.querySelector(".title-query").value;
  if (!titleQuery) {
    alert("Kata kunci belum dimasukkan");
    window.location.reload();
  }
  renderKeywords(titleQuery);
});

const renderKeywords = async (keywords) => {
  try {
    const dataComicQuery = await getComicQuery(keywords);
    renderComicQuery(dataComicQuery);
  } catch (error) {
    console.log(error);
  }
};

const getComicQuery = (keywords) => {
  return fetch(`https://komiku-api.fly.dev/api/comic/search/${keywords}`)
    .then((response) => response.json())
    .then((response) => {
      if (!response.success) {
        alert("masukin kata kunci yang bener blok!");
      }
      return response.data;
    });
};

const renderComicQuery = (datas) => {
  const mangaContainer = document.querySelector(".manga");
  mangaContainer.innerHTML = `<h3>Hasil Pencarian :</h3>
                              <div class='row'>
                                <div class='col-md container-query'></div>
                              </div>`;
  let queryResult = "";
  datas.map((data) => {
    queryResult += `<div class="card" style="width: 18rem">
                      <img src="${data.image}" class="card-img-top" alt="..." />
                      <div class="card-body">
                        <h5 class="card-title">Title : ${data.title}</h5>
                        <h6>Type : ${data.type}</h6>
                        <p class="card-text">Deskripsi : ${data.desc}</p>
                        <a href="#" class="btn btn-primary button-info" data-endpoint="${data.endpoint}">
                        Baca ngabs
                        </a>
                      </div>
                    </div>`;
    document.querySelector(".container-query").innerHTML = queryResult;
  });
};

// show info manga (Event Binding)
document.body.addEventListener("click", async function (e) {
  if (e.target && e.target.classList.contains("button-info")) {
    const detailComic = await getDetailComic(e.target.dataset.endpoint);
    renderDetailComic(detailComic);
  } else if (e.target && e.target.classList.contains("manga-chapter")) {
    const dataChapter = await getComicPanel(e.target.dataset.chapter);
    renderComicPanel(dataChapter);
  }
});

// show comic panel
const getComicPanel = (chapterEndpoint) => {
  return fetch(`https://komiku-api.fly.dev/api/comic/chapter${chapterEndpoint}`)
    .then((panels) => panels.json())
    .then((panels) => panels.data);
};

const renderComicPanel = (panels) => {
  const mangaChapters = document.querySelector(".image-of-manga");
  mangaChapters.innerHTML = "";
  const chapterImg = panels.image.map((img) => {
    return `<img class="img-fluid" src="${img}" alt="image chapters">`;
  });
  const manga = `<h5>${panels.title}</h5>
                ${chapterImg.join("")}`;

  mangaChapters.innerHTML = manga;
};

// show detail comic
const getDetailComic = (detailEndpoint) => {
  return fetch(`https://komiku-api.fly.dev/api/comic/info${detailEndpoint}`)
    .then((response) => response.json())
    .then((response) => response.data);
};

const renderDetailComic = (detail) => {
  const mangaContainer = document.querySelector(".manga");
  mangaContainer.innerHTML = `<div class="manga-info text-center">
                              </div>`;
  let result = "";
  const chapterList = detail.chapter_list.map((e) => {
    return `<li class="manga-chapter" data-chapter="${e.endpoint}">${e.name}</li>`;
  });
  result = `<img src="${detail.thumbnail}" class="img-fluid mthumbnail" alt="manga-thumbnails">
            <h4>Title : ${detail.title}</h4>
            <h5>Author : ${detail.author}</h5>
            <h5>Genre : ${detail.genre.join(", ")}</h5>
            <h5>Rating : ${detail.rating}</h5>
            <h5>Status : ${detail.status}</h5>
            <div class="chapter-list">
              <ul>
                ${chapterList.join("")}
              </ul>
            </div>
            <div class="image-of-manga"></div>`;

  document.querySelector(".manga-info").innerHTML = result;
};
