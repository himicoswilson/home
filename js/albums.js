const albumsData = [
  {
    title: "赵小雷",
    artist: "赵雷",
    year: "2011",
    tracks: ["画", "南方姑娘", "未给姐姐递出的信"],
    coverImage: "ZHAO_XIAO-LEI.webp",
    personalPhoto: "ZHAO_XIAO-LEI_PHOTO.webp",
    description: {
      zh: "首张个人音乐专辑，质朴真挚的民谣开始",
      en: "Debut album with sincere folk music",
    },
  },
  {
    title: "吉姆餐厅",
    artist: "赵雷",
    year: "2014",
    tracks: ["我们的时光", "三十岁的女人", "北京的冬天"],
    coverImage: "JIM_RESTAURANT.webp",
    personalPhoto: "JIM_RESTAURANT_PHOTO.webp",
    description: {
      zh: "献给母亲的专辑，温暖而深情",
      en: "A warm album dedicated to his mother",
    },
  },
  {
    title: "无法长大",
    artist: "赵雷",
    year: "2016",
    tracks: ["成都", "无法长大", "再见北京"],
    coverImage: "UNABLE_TO_GROW_UP.webp",
    personalPhoto: "UNABLE_TO_GROW_UP_PHOTO.webp",
    description: {
      zh: "代表作「成都」收录于此，诗意民谣巅峰",
      en: 'Features the hit song "Chengdu"',
    },
  },
  {
    title: "署前街少年",
    artist: "赵雷",
    year: "2022",
    tracks: ["我记得", "程艾影", "小行迹"],
    coverImage: "SHU_QIAN_JIE_SHAO_NIAN.webp",
    personalPhoto: "SHU_QIAN_JIE_SHAO_NIAN_PHOTO.webp",
    description: {
      zh: "回归初心，记录少年时代的梦想",
      en: "A return to roots and youthful dreams",
    },
  },
];

function renderAlbums() {
  const albumsGrid = document.getElementById("albumsGrid");
  if (!albumsGrid) return;

  const currentLang = window.i18n ? window.i18n.getCurrentLang() : "zh";

  albumsGrid.innerHTML = albumsData
    .map(
      (album, index) => `
        <div class="album-card-wrapper" style="animation-delay: ${index * 0.1}s">
            <div class="album-card-3d">
                <div class="album-card album-front">
                    <div class="album-cover">
                        <img src="assets/albums/${album.coverImage}"
                             alt="${album.title} - ${album.artist} 专辑封面"
                             class="album-cover-image"
                             loading="lazy"
                             decoding="async"
                             onerror="this.style.opacity='0.3'; this.alt='图片加载失败'">
                    </div>
                    <div class="album-info">
                        <h3 class="album-title">${album.title}</h3>
                        <p class="album-artist">${album.artist}</p>
                        <p class="album-year">${album.year}</p>
                        <div class="album-tracks">
                            ${album.tracks
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
                        <img src="assets/albums/${album.personalPhoto}"
                             alt="${album.title} 个人照片"
                             class="album-photo"
                             loading="lazy"
                             decoding="async"
                             onerror="this.style.opacity='0.3'; this.alt='图片加载失败'">
                        <div class="photo-caption">
                            <p class="gift-text">硕硕送的礼物</p>
                            <p class="album-desc">${album.description[currentLang]}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("");

  // 使用CSS类而不是行内样式,提升性能
  const cards = albumsGrid.querySelectorAll(".album-card-wrapper");
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('fade-in-up');
  });

  // 移除旧的事件监听器(如果存在)
  if (albumsGrid._albumClickHandler) {
    albumsGrid.removeEventListener("click", albumsGrid._albumClickHandler);
  }

  // 创建新的事件处理器并保存引用
  albumsGrid._albumClickHandler = function(e) {
    const card3d = e.target.closest(".album-card-3d");
    if (card3d) {
      card3d.classList.toggle("flipped");
    }
  };

  // 添加事件监听器
  albumsGrid.addEventListener("click", albumsGrid._albumClickHandler);
}

window.renderAlbums = renderAlbums;
