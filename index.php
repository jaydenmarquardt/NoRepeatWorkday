<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <script src="//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uikit@3.6.17/dist/css/uikit.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/uikit@3.6.17/dist/js/uikit.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/uikit@3.6.17/dist/js/uikit-icons.min.js"></script>
  <script src="date_time.js"></script>
  <script src="listener.js"></script>
  <link rel="stylesheet" href="styles.css">

</head>
<body>
<h3>6242 1063</h3>
<h3 id="timedate">00/00/0000 00:00:00</h3>
<h3 id="doublecheck">0</h3>
<button onclick="clearWin()" type="button">Clear Win</button>

  <div class="currentSong">
    <div class="left">

      <img id="image">
    </div>
    <div class="right">
      <span id="song"></span>
      <div class="time">
        <span id="started"></span> ->
        <span id="ends"></span> =
        <span id="duration"></span>
      </div>
      <div class="info">
        <span id="artist"></span> -
        <span id="album"></span>
      </div>
    </div>

    <div class="times">
      <span id="timein"></span>
      <div class="progress-bar">
        <div class="progress"></div>

      </div>
      <span id="timeleft"></span>
    </div>

  </div>
<h1>Songs</h1>
<input type="text" onkeyup="filterTable(this)" placeholder="Search for songs"/>

  <table id="songs">
    <thead>
      <tr>
        <th>ID</th>
        <th></th>
        <th>Song</th>
        <th>Artist</th>
        <th>Album</th>
        <th>Started</th>
        <th>Ended</th>
        <th>Duration</th>
      </tr>
    </thead>
    <tbody>

    </tbody>
  </table>


<div id="song-details" class="uk-flex-top" uk-modal>
  <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">

    <button class="uk-modal-close-default" type="button" uk-close></button>

    <div class="selectedSong">
      <div class="left">
        <img id="selectedImage">
      </div>
      <div class="right">
        <span id="selectedID"></span>
        <span id="selectedSong"></span>
        <div class="time">
          <span id="selectedStarted"></span> ->
          <span id="selectedEnds"></span> =
          <span id="selectedDuration"></span>
        </div>
        <div class="time">
          <span id="selectedStartedReal"></span> ->
          <span id="selectedEndsReal"></span> =
          <span id="selectedDurationReal"></span>
        </div>
        <div class="info">
          <span id="selectedArtist"></span> -
          <span id="selectedAlbum"></span>
        </div>
      </div>
      <button onclick="markAsAd()" type="button">Mark as advert</button>
      <pre id="selectedJSON">


      </pre>

    </div>

  </div>
</div>
</body>
</html>
