jQuery(function($){

  $currentSong = localStorage.getItem("current_song");
  $currentSong = $currentSong ? JSON.parse($currentSong) : {}
  $currentSongTitle = localStorage.getItem("current_song_title");
  $currentSongFinishes = localStorage.getItem("current_song_finishes");
  $currentDate = localStorage.getItem("current_date");
  $doublecheck = 0;

  $(document).ready(function(){
    console.log("Listener ready")

    $date = new Date().toDateString()
    if($currentDate !== $date)
    {
      console.log("New Day!", $date)
      localStorage.setItem("current_date", $date)
      $currentDate = $date;
      localStorage.setItem("songs", JSON.stringify([]))
    }else
    {
      console.log("Same Day!", $date)
      $songs = localStorage.getItem("songs")
      $songs = $songs ? JSON.parse($songs) : []
      console.log("Current Songs", $songs)
      $songs.forEach(function ($item, $index){
        addSong($item, false, $index);
      })
    }
    setInterval(checkCurrentSong, 1000);
  })



})


function updateUI() {
  $timeNow = new Date();

  $("#timedate").text(formatDate($timeNow, "dd/MM/yy h:mm:sstt"));
  $("#doublecheck").text($doublecheck);

  if($currentSong === {})return;

  $timeNow = $timeNow-$currentSong.startTime;
  $endsTimeP = $currentSong.endTime - $currentSong.startTime;
  $progress = Math.min($timeNow/ $endsTimeP*100, 100);
  $(".progress-bar .progress").css("width", $progress+"%");
  if($progress === 100)
  {
    $("#song").text("Advert / Talking");
    $("#album").text("Mix 106.3");
    $("#artist").text("Advert");
    $("#started").text($currentSong.endsTime);
    $("#ends").text("NA");
    $("#timein").text(0);
    $("#timeleft").text(0);
    $("#duration").text(0);

    if($("#image").attr("src") !== "//i.iheart.com/v3/re/new_assets/5ed825d540fb74830d90771b?ops=fit(240%2C240)"){
      $("#image").attr("src", "//i.iheart.com/v3/re/new_assets/5ed825d540fb74830d90771b?ops=fit(240%2C240)");
    }
  }else
  {
    $("#song").text($currentSong.title);
    $("#album").text($currentSong.album);
    $("#artist").text($currentSong.artist);
    $startedTime = getFormatedTime($currentSong.startTime)
    $endsTime = getFormatedTime($currentSong.endTime)
    $("#started").text($startedTime);
    $("#ends").text($endsTime);
    $("#timein").text(getTimeIn($currentSong.startTime));
    $("#timeleft").text(getTimeLeft($currentSong.endTime));
    $("#duration").text($currentSong.duration+"s");
  }




}

function checkIfTooShort() {
  if($currentSong !== {} && $currentSong.realEndTime === undefined){

    $realEnd = new Date().getTime();
    $currentSong.realEndTime = $realEnd;
    $currentSong.timeExpected = ($currentSong.endTime - $currentSong.startTime) / 1000;
    $currentSong.realDuration = ($currentSong.realEndTime - $currentSong.realStartTime) / 1000;
    saveSong($currentSong.id, $currentSong)
  }
}

function checkCurrentSong(){
  var now = new Date().getTime();
  $doublecheck++;



  if(now > $currentSongFinishes || $doublecheck > 5)
  {
    console.log("Checking for new song")

    jQuery.get("//au.api.iheart.com/api/v3/live-meta/stream/6244/currentTrackMeta", function (data){
      $doublecheck = 0;
      if(data === undefined){//if undefined (adverts/ talking) wait 10 seconds to check up
        $currentSongFinishes = now + 10 * 1000;
        return;
      }

      if($currentSongTitle !== data.title)
      {

        checkIfTooShort();


        $song = {
          "artist": data.artist,
          "album": data.album,
          "imagePath": data.imagePath,
          "startTime": data.startTime,
          "endTime": data.endTime,
          "title": data.title,
          "realStartTime": new Date().getTime(),
          "duration": data.trackDuration,
        };
        console.log($song)
        $currentSong = $song;
        $currentSongTitle = $song.title;
        $currentSongFinishes = $song.endTime;
        localStorage.setItem("current_song", JSON.stringify($song))
        localStorage.setItem("current_song_title", $currentSongTitle)
        localStorage.setItem("current_song_finishes", $currentSongFinishes)
        $("#image").attr("src", $currentSong.imagePath);

        addSong($currentSong);
      }
    })
  }

  updateUI();
}

function checkSongExists($song){
  $songs = getSongs()
  $song_title = $song.title.toLowerCase().trim();
  if( is9to5($song.startTime)){
    $songs.forEach(function ($item){
      if($item.title.toLowerCase().trim() == $song_title)
      {
        if( is9to5($item.startTime)){
          jQuery("body").addClass("win");
          console.log("Wining Song", $item)
          jQuery.get("/mail.php?title="+$item.title, function (data){
            console.log("mail sent", data)
          })
        }
      }
    })
  }
}

function addSong($song, $addtostorage = true, $index = -1){

  if($addtostorage){
    checkSongExists($song);
    $index = $songs.length;
    $songs = getSongs()
    $song.id = $index;
    $songs.push($song)
    saveSongs($songs)

    console.log(getSongs())
  }else
  {
    $song.id = $index;
    saveSong($index, $song)

  }


  $songTable = $("#songs tbody");


  $after = !is9to5($song.startTime) ? "after" : "";
  $advert = $song.advert === undefined || !$song.advert ? "" : "advert";
  $songTable.prepend("<tr class='"+$after+" "+$advert+"' id='"+$index+"'></tr>")
  $row = $songTable.find("tr:first-child")
  $row.append("<td>"+$index+"</td>")
  $row.append("<td class='img'><img src='"+$song.imagePath+"' width='35px' height='35px'/></td>")
  $row.append("<td>"+$song.title+"</td>")
  $row.append("<td>"+$song.artist+"</td>")
  $row.append("<td>"+$song.album+"</td>")
  $row.append("<td>"+getFormatedTime($song.startTime)+"</td>")
  $row.append("<td>"+getFormatedTime($song.endTime)+"</td>")
  $row.append("<td>"+$song.duration+"s</td>")
  $row.on("click", function (){
    $songs= localStorage.getItem("songs")
    $songs = $songs ? JSON.parse($songs) : []

    $id = $(this).find("td:first-child").text();
    $selectedSong = $songs[$id];

    $("#selectedID").text($selectedSong.id);
    $("#selectedSong").text($selectedSong.title);
    $("#selectedAlbum").text($selectedSong.album);
    $("#selectedArtist").text($selectedSong.artist);
    $startedTime = getFormatedTime($selectedSong.startTime)
    $endsTime = getFormatedTime($selectedSong.endTime)
    $startedTimereal = $selectedSong.realStartTime ? getFormatedTime($selectedSong.realStartTime) : "NA";
    $endsTimereal =  $selectedSong.realEndTime ? getFormatedTime($selectedSong.realEndTime) : "NA";
    $("#selectedStarted").text($startedTime);
    $("#selectedEnds").text($endsTime);
    $("#selectedDuration").text($selectedSong.duration+"s");
    $("#selectedStartedReal").text($startedTimereal);
    $("#selectedEndsReal").text($endsTimereal);
    $("#selectedDurationReal").text(( $selectedSong.realDuration ? $selectedSong.realDuration+"s"  : "NA"));
    $("#selectedJSON").text(JSON.stringify($selectedSong, undefined, 2));
    $("#selectedImage").attr("src", $selectedSong.imagePath);

    UIkit.modal("#song-details").show();

  })

}

function getSongs(){

  $songs= localStorage.getItem("songs")
  $songs = $songs ? JSON.parse($songs) : []

  return $songs;

}

function saveSongs($songs){

  $songs= localStorage.getItem("songs")
  $songs = $songs ? JSON.parse($songs) : []

  localStorage.setItem("songs", JSON.stringify($songs))


}

function saveSong($id, $song){

  $songs= getSongs();
  $songs[$id] = $song;
  saveSongs($songs)
}

function getSong($id){

  $songs= getSongs();
  return $songs[$id];
}


function markAsAd(){

  $id = $("#selectedID").text();
  $selectedSong = getSong($id);
  if($selectedSong.advert === undefined || !$selectedSong.advert ){
    $selectedSong.advert = true;
    getTableRowFromID($id).addClass("advert");
  }else
  {
    $selectedSong.advert = false;
    getTableRowFromID($id).removeClass("advert");

  }

 saveSong($id, $selectedSong)

}

function getTableRowFromID($id){
  $("#songs tbody tr").each(function (){
    $rowid = $(this).find("td:first-child").text();
    if($rowid === $id){
     return $(this);
    }
  })
  return null;
}

function clearWin(){
  jQuery("body").removeClass("win");
}

function filterTable(e){
  $search = $(e).val();
  $songTable = $("#songs tbody tr").each(function (){
    if($(this).text().toLowerCase().indexOf($search) === -1) {

      $(this).css("display", "none")
    }else {
      $(this).css("display", "table-row")

    }
  });

}
