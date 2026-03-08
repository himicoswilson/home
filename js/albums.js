const albumsData = [
  {
    title: {
      zh: "赵小雷",
      en: "Zhao Xiao-Lei",
    },
    artist: {
      zh: "赵雷",
      en: "Zhao Lei",
    },
    year: "2011",
    tracks: {
      zh: ["画", "南方姑娘", "未给姐姐递出的信"],
      en: ["Painting", "Southern Girl", "A Letter Never Given to Sister"],
    },
    coverImage: {
      src: "ZHAO_XIAO-LEI.webp",
      width: 500,
      height: 500,
    },
    personalPhoto: {
      originalSrc: "ZHAO_XIAO-LEI_PHOTO.webp",
      baseName: "ZHAO_XIAO-LEI_PHOTO",
      width: 4284,
      height: 5712,
    },
    description: {
      zh: "首张个人音乐专辑，质朴真挚的民谣开始",
      en: "Debut album with sincere folk music",
    },
  },
  {
    title: {
      zh: "吉姆餐厅",
      en: "Jim's Restaurant",
    },
    artist: {
      zh: "赵雷",
      en: "Zhao Lei",
    },
    year: "2014",
    tracks: {
      zh: ["我们的时光", "三十岁的女人", "北京的冬天"],
      en: ["Our Time", "Thirty-Year-Old Woman", "Beijing Winter"],
    },
    coverImage: {
      src: "JIM_RESTAURANT.webp",
      width: 450,
      height: 450,
    },
    personalPhoto: {
      originalSrc: "JIM_RESTAURANT_PHOTO.webp",
      baseName: "JIM_RESTAURANT_PHOTO",
      width: 4284,
      height: 5712,
    },
    description: {
      zh: "献给母亲的专辑，温暖而深情",
      en: "A warm album dedicated to his mother",
    },
  },
  {
    title: {
      zh: "无法长大",
      en: "Unable to Grow Up",
    },
    artist: {
      zh: "赵雷",
      en: "Zhao Lei",
    },
    year: "2016",
    tracks: {
      zh: ["成都", "无法长大", "再见北京"],
      en: ["Chengdu", "Unable to Grow Up", "Goodbye Beijing"],
    },
    coverImage: {
      src: "UNABLE_TO_GROW_UP.webp",
      width: 400,
      height: 400,
    },
    personalPhoto: {
      originalSrc: "UNABLE_TO_GROW_UP_PHOTO.webp",
      baseName: "UNABLE_TO_GROW_UP_PHOTO",
      width: 4284,
      height: 5712,
    },
    description: {
      zh: "代表作「成都」收录于此，诗意民谣巅峰",
      en: 'Features the hit song "Chengdu"',
    },
  },
  {
    title: {
      zh: "署前街少年",
      en: "Youth of Shuqian Street",
    },
    artist: {
      zh: "赵雷",
      en: "Zhao Lei",
    },
    year: "2022",
    tracks: {
      zh: ["我记得", "程艾影", "小行迹"],
      en: ["I Remember", "Cheng Aiying", "Little Traces"],
    },
    coverImage: {
      src: "SHU_QIAN_JIE_SHAO_NIAN.webp",
      width: 450,
      height: 450,
    },
    personalPhoto: {
      originalSrc: "SHU_QIAN_JIE_SHAO_NIAN_PHOTO.webp",
      baseName: "SHU_QIAN_JIE_SHAO_NIAN_PHOTO",
      width: 4284,
      height: 5712,
    },
    description: {
      zh: "回归初心，记录少年时代的梦想",
      en: "A return to roots and youthful dreams",
    },
  },
];

const albumPhotoWidths = [320, 480, 720];

function createResponsiveImageSet(baseName, extension) {
  return albumPhotoWidths
    .map((width) => `assets/generated/albums/${baseName}-${width}w.${extension} ${width}w`)
    .join(", ");
}

function renderAlbums() {
  const albumsGrid = document.getElementById("albumsGrid");
  if (!albumsGrid) return;

  const currentLang = window.i18n ? window.i18n.getCurrentLang() : "zh";
  const coverAlt = window.i18n ? window.i18n.t("albums.coverAlt") : "album cover";
  const photoAlt = window.i18n ? window.i18n.t("albums.photoAlt") : "personal photo";
  const imageError = window.i18n
    ? window.i18n.t("albums.imageError")
    : "Image failed to load";
  const giftText = window.i18n ? window.i18n.t("albums.giftText") : "Gift";

  albumsGrid.innerHTML = albumsData
    .map(
      (album, index) => `
        <div class="album-card-wrapper" style="animation-delay: ${index * 0.1}s">
            <div class="album-card-3d">
                <div class="album-card album-front">
                    <div class="album-cover">
                        <img src="assets/albums/${album.coverImage.src}"
                             alt="${album.title[currentLang]} - ${album.artist[currentLang]} ${coverAlt}"
                             class="album-cover-image"
                             width="${album.coverImage.width}"
                             height="${album.coverImage.height}"
                             loading="lazy"
                             decoding="async"
                             onerror="this.style.opacity='0.3'; this.alt='${imageError}'">
                    </div>
                    <div class="album-info">
                        <h3 class="album-title">${album.title[currentLang]}</h3>
                        <p class="album-artist">${album.artist[currentLang]}</p>
                        <p class="album-year">${album.year}</p>
                        <div class="album-tracks">
                            ${album.tracks[currentLang]
                              .map(
                                (track) => `
                                <div class="track-item">${track}</div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>
                </div>

                <div class="album-card album-back">
                    <div class="photo-container">
                        <picture>
                            <source
                                type="image/avif"
                                srcset="${createResponsiveImageSet(album.personalPhoto.baseName, "avif")}"
                                sizes="(max-width: 768px) calc(100vw - 4rem), (max-width: 1024px) calc(50vw - 3rem), (max-width: 1440px) calc(33vw - 3rem), 350px">
                            <source
                                type="image/webp"
                                srcset="${createResponsiveImageSet(album.personalPhoto.baseName, "webp")}"
                                sizes="(max-width: 768px) calc(100vw - 4rem), (max-width: 1024px) calc(50vw - 3rem), (max-width: 1440px) calc(33vw - 3rem), 350px">
                            <img src="assets/generated/albums/${album.personalPhoto.baseName}-720w.webp"
                                 alt="${album.title[currentLang]} ${photoAlt}"
                                 class="album-photo"
                                 width="${album.personalPhoto.width}"
                                 height="${album.personalPhoto.height}"
                                 loading="lazy"
                                 decoding="async"
                                 onerror="this.onerror=null; this.src='assets/albums/${album.personalPhoto.originalSrc}'; this.style.opacity='0.3'; this.alt='${imageError}'">
                        </picture>
                        <div class="photo-caption">
                            <p class="gift-text">${giftText}</p>
                            <p class="album-desc">${album.description[currentLang]}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("");

  const cards = albumsGrid.querySelectorAll(".album-card-wrapper");
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add("fade-in-up");
  });

  if (albumsGrid._albumClickHandler) {
    albumsGrid.removeEventListener("click", albumsGrid._albumClickHandler);
  }

  albumsGrid._albumClickHandler = function (e) {
    const card3d = e.target.closest(".album-card-3d");
    if (card3d) {
      card3d.classList.toggle("flipped");
    }
  };

  albumsGrid.addEventListener("click", albumsGrid._albumClickHandler);
}

window.renderAlbums = renderAlbums;
