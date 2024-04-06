console.log("Hello World");
let currentMusic = new Audio();
let songs;
let currFolder;

let getSongs = async (folder) => {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}`);
  let res = await a.text();
  let div = document.createElement("div");
  div.innerHTML = res;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }

  let songsUL = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];
  songsUL.innerHTML = "";
  for (const song of songs) {
    songsUL.innerHTML =
      songsUL.innerHTML +
      `<li>
           <img class="invert" src="images/music.svg" alt="" srcset="">
           <div class="info">
         <div class="sName">${song.split(currFolder)[1].replaceAll("%20", " ").replaceAll(".mp3", "")}</div>
         
         </div>
         <img src="images/play.svg" class="invert" alt="">
         </li> `;
  }
  

  // function to list all the songs
  Array.from(
    document.querySelector(".song-list").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
      
    });
  });
  return songs
};

const playMusic = async (track) => {
  currentMusic.src = `/${currFolder}` + track + ".mp3";
  currentMusic.play();
  play.src = "images/pause.svg";
  document.querySelector(".songtitle").innerHTML = track;
};



async function main() {
  await getSongs(`songs/eng/`);

  // function to use play, previous and forward buttons
  play.addEventListener("click", () => {
    if (currentMusic.paused) {
      currentMusic.play();
      play.src = "images/pause.svg";
    } else {
      currentMusic.pause();
      play.src = "images/play.svg";
    }
  });


  // Update the current time display every second
  currentMusic.addEventListener("timeupdate", function () {
    // Get the current time of the audio in seconds
    const currentTimeInSeconds = Math.floor(currentMusic.currentTime);
    const durationInSeconds = Math.floor(currentMusic.duration);

    // Convert the time to minutes and seconds
    const minutes = Math.floor(currentTimeInSeconds / 60);
    const dMinutes = Math.floor(durationInSeconds / 60);
    const seconds = currentTimeInSeconds % 60;
    const dSeconds = durationInSeconds % 60;

    // Display the current time
    document.querySelector(".songtime").innerHTML = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} / ${dMinutes
      .toString()
      .padStart(2, "0")}:${dSeconds.toString().padStart(2, "0")}`;

    // Control the seekbar
    document.querySelector(".circle").style.left =
      (currentMusic.currentTime / currentMusic.duration) * 100 + "%";
  });
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";

    currentMusic.currentTime = (currentMusic.duration * percent) / 100;
  });

  document.querySelector(".hamberger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  // previous and forward btns
  previous.addEventListener("click", async (e) => {
    currentMusic.pause();
    let index = songs.indexOf(currentMusic.src);
    console.log(index)
    if (index - 1 >= 0) {
      console.log(songs[index - 1].split("/songs/")[1].replace(".mp3", "").replaceAll("%20", " ").split("/").slice(-1)[0])
      playMusic(songs[index - 1].split("/songs")[1].replace(".mp3", "").replaceAll("%20", " ").split("/").slice(-1)[0]);
    }
  });

  forward.addEventListener("click", (e) => {
    currentMusic.pause();
    let index = songs.indexOf(currentMusic.src);
    console.log(index)
    if (index + 1 >= 0) {
      playMusic(songs[index + 1].split("/songs")[1].replace(".mp3", "").replaceAll("%20", " ").split("/").slice(-1)[0]);

    }
  });

  vol.addEventListener("change", (e) => {
    currentMusic.volume = e.target.value / 100;
    if (currentMusic.volume == 0) {
      document.querySelector(".volBar").firstElementChild.src = "images/mute.svg";
    } else if (currentMusic.volume > 0) {
      document.querySelector(".volBar").firstElementChild.src = "images/sound.svg";
    }
  });
  document
    .querySelector(".volBar")
    .firstElementChild.addEventListener("click", (e) => {
      if (currentMusic.volume !== 0) {
        currentMusic.volume = 0;
        document.querySelector(".volBar").firstElementChild.src = "images/mute.svg";
      } else if (currentMusic.volume == 0) {
        currentMusic.volume = vol.value / 100;
        document.querySelector(".volBar").firstElementChild.src = "images/sound.svg";
      }
    });

  async function displayAlbum() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let res = await a.text();
    let div = document.createElement("div");
    div.innerHTML = res;
    let anchors = div.getElementsByTagName("a");

    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
      const e = array[index];

      if (e.href.includes("/songs/")) {
        let folderName = e.href.split("/").slice(-2)[0];
        let a = await fetch(
          `http://127.0.0.1:3000/songs/${folderName}/info.json`
        );
        let res = await a.json();
        document.getElementsByClassName("cards")[0].innerHTML =
          document.getElementsByClassName("cards")[0].innerHTML +
          `<div data-folder="${folderName}" class="card">
  <img src="/songs/${folderName}/cover.jpeg" alt="Playlist Cover">
  <div class="card-content">
      <h2>${res.title}</h2>
      <p>${res.description}</p>
      
  </div>
</div>`;
      }
    }

    Array.from(document.getElementsByClassName("card")).forEach((element) => {
      element.addEventListener("click", async (item) => {
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}/`);
        // let myMediaQuery = window.matchMedia('(max-width: 1000px)')
        if (window.innerWidth < 1000) {
          document.querySelector(".left").style.left = 0;
          let songsUL = document
          .querySelector(".song-list")
          .getElementsByTagName("ul")[0];

         Array.from(songsUL.getElementsByTagName("li")).forEach(element => {  
          element.addEventListener("click", (e)=>{
            document.querySelector(".left").style.left = "-100%";
            
         })
         });
        }
      });
    });
  }

  // Display all the songs in a album
  displayAlbum();
}
main();
