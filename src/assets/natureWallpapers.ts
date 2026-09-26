const asset = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

export const natureWallpapers = [
  {
    id: "nature-forest",
    name: "Forest",
    image: asset(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#9bd6b1"/><stop offset="1" stop-color="#276749"/></linearGradient><linearGradient id="light" x2="0" y2="1"><stop stop-color="#fff3a6" stop-opacity=".9"/><stop offset="1" stop-color="#fff3a6" stop-opacity="0"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sky)"/><circle cx="800" cy="190" r="210" fill="url(#light)"/><path fill="#174c38" d="M0 450 160 260l130 190 130-220 160 220 150-260 190 260 140-230 180 230 170-210 190 210v450H0z"/><path fill="#0d3029" d="M0 590 170 390l110 200 150-240 170 240 150-210 170 210 160-250 150 250 170-210 200 210v310H0z"/><path fill="#bea86b" d="M760 900c-20-170 20-270 95-370 70 120 90 250 125 370z"/><g fill="#071f1d"><path d="M90 900V300h75v600zM55 380l72-160 72 160zM1150 900V250h92v650zM1100 330l96-210 96 210zM1410 900V340h70v560zM1370 420l75-150 75 150z"/></g></svg>`,
    ),
  },
  {
    id: "nature-mountains",
    name: "Mountains",
    image: asset(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#68b9ee"/><stop offset="1" stop-color="#d8f0fa"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sky)"/><circle cx="1240" cy="180" r="76" fill="#fff8d2" opacity=".8"/><path fill="#557b9a" d="M0 720 380 250l210 270L850 90l460 630z"/><path fill="#eef8fa" d="M380 250 300 350l90-35 50 54 75-30 75 181zM850 90 650 360l155-70 70 66 88-40 130 190z"/><path fill="#2d5366" d="M0 720 410 460l160 145 270-165 250 175 230-145 280 250v180H0z"/><path fill="#183d47" d="M0 790c240-100 390-80 610-35 230 47 410-40 650-25 155 10 260 50 340 90v80H0z"/><g fill="#fff"><circle cx="255" cy="155" r="4"/><circle cx="520" cy="110" r="5"/><circle cx="1030" cy="170" r="4"/></g></svg>`,
    ),
  },
  {
    id: "nature-sunset",
    name: "Sunset",
    image: asset(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#30236b"/><stop offset=".48" stop-color="#c44872"/><stop offset="1" stop-color="#ffb05d"/></linearGradient><linearGradient id="water" x2="0" y2="1"><stop stop-color="#45356e"/><stop offset="1" stop-color="#171d3d"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sky)"/><circle cx="800" cy="480" r="130" fill="#ffd98a"/><path fill="url(#water)" d="M0 610h1600v290H0z"/><path fill="#241d38" d="M0 640 220 500l170 75 260-150 190 145 245-185 210 160 305-190v545H0z"/><path fill="#ffb66b" opacity=".45" d="M650 640h310l180 260H470z"/><g stroke="#e7a1a1" opacity=".4"><path d="M80 720h420M1080 740h410M230 800h340M1130 830h290"/></g></svg>`,
    ),
  },
  {
    id: "nature-ocean",
    name: "Ocean",
    image: asset(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#6dc5ed"/><stop offset="1" stop-color="#d7f4f4"/></linearGradient><linearGradient id="sea" x2="0" y2="1"><stop stop-color="#248bb0"/><stop offset="1" stop-color="#073b63"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sky)"/><circle cx="1180" cy="220" r="100" fill="#fff5c2" opacity=".8"/><path fill="url(#sea)" d="M0 470c230-35 330 35 540 0s330-35 530 0 320 35 530 0v430H0z"/><g fill="none" stroke="#9de2df" stroke-width="10" opacity=".6"><path d="M0 590c210-50 340 55 550 0s340-50 550 0 330 45 500-5"/><path d="M0 700c190-45 330 50 540 0s350-50 570 0 300 45 490 0"/><path d="M110 805c180-35 330 40 530 0s330-35 560 0 260 30 390-5"/></g><path fill="#16465b" d="M0 495h160l-55-75 105 75h145l-45-105 105 105h180l-70-80 130 80h160v50H0z" opacity=".75"/></svg>`,
    ),
  },
  {
    id: "nature-night-sky",
    name: "Night Sky",
    image: asset(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#07132f"/><stop offset="1" stop-color="#273b72"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sky)"/><circle cx="1240" cy="190" r="70" fill="#f7f1cf"/><circle cx="1270" cy="165" r="70" fill="#0d1b3d"/><g fill="#fff"><circle cx="180" cy="150" r="4"/><circle cx="330" cy="270" r="3"/><circle cx="520" cy="120" r="5"/><circle cx="720" cy="230" r="3"/><circle cx="930" cy="100" r="4"/><circle cx="1450" cy="290" r="4"/><circle cx="1120" cy="330" r="3"/></g><path fill="#13274b" d="M0 680 310 390l190 210 330-360 340 360 210-205 220 235v270H0z"/><path fill="#09172d" d="M0 760 280 560l220 170 260-210 250 190 260-150 330 220v120H0z"/><path fill="#b2cce3" opacity=".18" d="M850 320 690 690h340z"/></svg>`,
    ),
  },
  {
    id: "nature-tropical",
    name: "Tropical",
    image: asset(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#f3d98a"/><stop offset=".45" stop-color="#67c68a"/><stop offset="1" stop-color="#125b4c"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sky)"/><circle cx="780" cy="200" r="150" fill="#fff0a2" opacity=".7"/><path fill="#18734e" d="M0 900V330c170 30 210 180 210 300 95-190 210-235 320-280-70 250-30 360-30 550zM1600 900V280c-180 35-230 190-235 350-80-220-210-280-350-340 65 240 22 390 22 610z"/><g fill="#0b473e"><path d="M690 900V260h52v640zM660 350l60-170 60 170zM790 900V330h45v570zM770 410l44-130 48 130zM210 900V420h44v480zM180 500l52-145 52 145z"/></g><path fill="#9fdf83" d="M430 520c190-170 320-120 430 0-170-30-300 20-430 0zM1050 570c180-170 310-105 420 10-170-35-290 5-420-10z" opacity=".75"/></svg>`,
    ),
  },
  {
    id: "nature-desert",
    name: "Desert",
    image: asset(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#4a2d68"/><stop offset=".5" stop-color="#e16b67"/><stop offset="1" stop-color="#f6c06f"/></linearGradient><linearGradient id="sand" x2="0" y2="1"><stop stop-color="#d58a56"/><stop offset="1" stop-color="#704234"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sky)"/><circle cx="1160" cy="330" r="100" fill="#ffd88e" opacity=".8"/><path fill="url(#sand)" d="M0 590c260-170 480-160 710 0s440 165 890-20v330H0z"/><path fill="#b9664e" d="M0 710c310-190 570-115 790 40s450 120 810-30v180H0z"/><path fill="#7c4739" d="M0 820c280-100 520-65 790 20s520 70 810-20v80H0z"/><g fill="#55352f"><path d="M270 690h22l30-120 28 120h18l-45-190zM1320 730h20l28-100 25 100h18l-37-160z"/></g></svg>`,
    ),
  },
  {
    id: "nature-spring",
    name: "Spring",
    image: asset(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#b9e5f3"/><stop offset="1" stop-color="#f7f0c6"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sky)"/><circle cx="1240" cy="190" r="90" fill="#fff4bb" opacity=".7"/><path fill="#8dcc8b" d="M0 570c300-170 540-120 790 20 230 130 480 85 810-70v380H0z"/><path fill="#4e9d6a" d="M0 720c250-130 480-100 730 35 250 135 520 90 870-70v215H0z"/><g fill="#fff0f5"><circle cx="330" cy="600" r="14"/><circle cx="375" cy="620" r="11"/><circle cx="1070" cy="620" r="13"/><circle cx="1120" cy="600" r="10"/></g><g fill="#ed7896"><circle cx="350" cy="585" r="8"/><circle cx="1090" cy="605" r="8"/></g><g stroke="#3f7e55" stroke-width="8"><path d="M350 600v120M1090 620v115"/></g><path fill="#6baa68" d="M0 900V670c130-75 230-70 340 0 120-100 220-90 340 10 120-90 230-65 350 20 130-100 270-70 390 20v180z"/></svg>`,
    ),
  },
  {
    id: "nature-winter",
    name: "Winter",
    image: asset(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#789bc5"/><stop offset="1" stop-color="#dcecf2"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sky)"/><circle cx="1230" cy="190" r="75" fill="#f7fbff" opacity=".8"/><path fill="#7898b2" d="M0 650 300 310l210 270 350-410 390 480 190-250 160 210v290H0z"/><path fill="#f7fbfd" d="M300 310 225 400l80-30 55 50 70-45 80 205zM860 170 650 420l155-70 85 65 95-60 180 280z"/><path fill="#477083" d="M0 740c230-110 400-100 620 0 260 120 500 55 980-40v200H0z"/><g fill="#dff1f4"><path d="M180 900V510h56v390zM135 590l75-150 75 150zM470 900V570h48v330zM430 640l65-130 65 130zM1320 900V500h58v400zM1270 580l78-165 78 165z"/></g></svg>`,
    ),
  },
  {
    id: "nature-rainy",
    name: "Rainy",
    image: asset(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#405b75"/><stop offset="1" stop-color="#9eb3b8"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sky)"/><g fill="#344b61"><ellipse cx="360" cy="240" rx="250" ry="95"/><ellipse cx="650" cy="210" rx="280" ry="120"/><ellipse cx="1010" cy="245" rx="300" ry="105"/><ellipse cx="1320" cy="210" rx="250" ry="100"/></g><path fill="#315c5c" d="M0 590 260 360l220 240 270-230 270 250 270-210 310 260v230H0z"/><path fill="#193e43" d="M0 730c260-150 450-100 680 10 270 125 520 40 920-80v240H0z"/><g stroke="#b7d5db" stroke-width="6" opacity=".55"><path d="M150 310 80 520M300 290 230 500M480 340 405 550M700 300 630 510M900 350 830 560M1120 290 1050 500M1330 330 1260 540M1510 280 1440 490"/></g><path fill="#8cb9a7" opacity=".35" d="M0 820c260-80 490-60 700 10s520 70 900-20v90H0z"/></svg>`,
    ),
  },
] as const;

export type NatureWallpaper = (typeof natureWallpapers)[number];
export type NatureWallpaperId = NatureWallpaper["id"];

export const natureWallpaperById = Object.fromEntries(
  natureWallpapers.map((wallpaper) => [wallpaper.id, wallpaper]),
) as Record<NatureWallpaperId, NatureWallpaper>;
