//todo add a namespace to all local-storage-variables

var underlayer = {
  init: function() {
    this.url = document.URL;
    this.setListeners();
    //Knappar till dialog-rutan istället för fält.
    //lägg bilden längst ner i skissen dom:en istället så den inte är så ivägen.

    //gör det här med togglern istället kanske?
    if(localStorage.getItem('underlayer-toggled') != 'false') {
      this.showUnderlay();

      //show image-dialog if no image is set
      if(localStorage.getItem([this.url]) === null){
        localStorage.setItem('underlayer-toggled',true)
        this.showDialog();
      }
    }
  },

  setListeners: function() {
    $(document).keydown(function(e) {
      var key = e.keyCode;
      switch(key) {
        case 84:
          underlayer.toggle();
          break;
        case 85:
            underlayer.showDialog();
          break;
        default:
          return;
      }
    });

    $(document).keyup(function(e) {
      var key = e.keyCode;

      if(key == 91) {
        underlayer.cmdpressed = false;
      }
    });
  },

  toggle: function() {
    if(localStorage.getItem('underlayer-toggled') == 'true') {
     localStorage.setItem('underlayer-toggled',false)
     this.hideUnderlay();
    } else {
      localStorage.setItem('underlayer-toggled',true)
      this.showUnderlay();
      if(localStorage.getItem([this.url]) === null){
        this.showDialog();
      };
    }
  },


  showDialog: function(){
    if(!($('#dialog').length)){
      var $dialog = $('<div id="dialog" style="position: absolute;top: 50%;left: 50%;margin: -50px 0 0 -150px;background: gray;width: 300px;height: 150px;padding: 20px"></div>'),
          $imageInput = $('<input type="file" id="bgfile" name="files[]" style="margin-bottom:5px;" />'),
          $positionButtons = $('<a class="align" data-postion="left" href>Left</a><a class="align" data-postion="center" href>Center</a><a class="align" data-postion="right" href>Right</a>')
          $closeButton = $('<a style="display: block;" id="closeButton" href>Save &amp; Close</a>'),
          $instruction = $('<p style="font-size: 11px;color: black;text-shadow: 0 0 1.3em white;margin-left: 1em;">Press "U" to Update your image-settings later.</p><p style="font-size: 11px;color: black;text-shadow: 0 0 1.3em white;margin-left: 1em;">Press "T" to Toggle on/off.</p><p style="font-size: 11px;color: black;text-shadow: 0 0 1.3em white;margin-left: 1em;">Use arrows to offset(not implemnted yet).</p>');
      $('body').append($dialog.append($imageInput, $positionButtons, $closeButton, $instruction));
      };
  },

  hideDialog: function(){
    $('#dialog').remove();
  },

  showUnderlay: function(){
    /*make page transparent*/
    $('body > *:not(#dialog)').css('opacity', 0.5);
    /*Add image behind*/
    $('body').prepend('<div id="underlayer" style="width: 100%; height: 100%; position: absolute; background-repeat: no-repeat; background-position: center top; top: 0;" ></div>');
    this.setImage();
    this.setPosition();

  },

  hideUnderlay: function() {
    $('body > *').css('opacity', '');
    $('#underlayer').remove();
    $('#position-dialog').remove();
    this.hideDialog();
  },

  addImage: function(evt) {
    var file = evt.target.files[0];
    /* Only process image files.*/
    if(file.type.match('image.*')) {
      /*Add image to FileReader object*/
      var reader = new FileReader();
      reader.readAsDataURL(file);
      /*Add image to local storage */
      reader.onload = (function(theFile) {
        return function(e) {
          localStorage.setItem(underlayer.url, e.target.result);
          //add image
          underlayer.setImage();
        };
      })(file);
    }
  },

  addPosition: function(alignment){
    localStorage.setItem('alignment', alignment);
    underlayer.setPosition();
  },

  setImage: function(){
    var imgData = localStorage.getItem(this.url);
    $('#underlayer').css('background-image','url("'+imgData+'")')
  },

  setPosition: function() {
    var posData = localStorage.getItem('alignment');
    console.log(posData)
    $('#underlayer').css('background-position','top '+ posData)
  },


}

$(function() {
  underlayer.init();
  $(document.body).on('change', '#bgfile', underlayer.addImage);
  $(document.body).on('click', '#closeButton', function(){
    event.preventDefault();
    underlayer.hideDialog();
  });
  $(document.body).on('click', '.align', function(){
    event.preventDefault();

    underlayer.addPosition($(this).attr('data-postion'))
  });
});