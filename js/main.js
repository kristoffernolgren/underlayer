/*This is the url we are on.*/
var underlayer = {
  init: function() {
    this.url = document.URL;
    this.setListeners();
    this.underlay();

    /* check if current url has an image assosiated with it – otherwise, prompt user to upload image */
    typeof(localStorage[this.url] === "undefined") ? this.setImage() : this.showImageDialog();
  },

  setListeners: function() {
    $(document).keydown(function(e) {
      var key = e.keyCode;

      // Return if cmd is pressed, so we can reload
      if(underlayer.cmdpressed == true) { return; }

      e.preventDefault();

      // 82 == 'R' | 67 == 'C' | 91 == CMD
      switch(key) {
      case 82:
        underlayer.showImageDialog();
        break;
      case 67:
        underlayer.clear();
        break;
      case 91:
        underlayer.cmdpressed = true;
        console.log(underlayer.cmdpressed = true)
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
          /*Add image to background*/
          underlayer.hideImageDialog();
          underlayer.setImage();
        };
      })(file);
    }
  },

  showImageDialog: function(){
    var $imageDialog = $('<div id="imagedialog"></div>'),
        $imageInput = $('<input type="file" id="bgfile" name="files[]" style="position: absolute; top: 50%; left: 50%; margin: -50px 0 0 -150px; background: gray; width: 260px; height: 60px; padding: 20px; z-index:1;" />');

    $('body').prepend($imageDialog.append($imageInput));
  },

  hideImageDialog: function(){
    $('#imagedialog').remove();
  },

  underlay: function(){
    /*make page transparent*/
    $('body > *').css('opacity', 0.5);
    /*Add image behind*/
    $('body').prepend('<div id="underlayer" style="width: 100%; height: 100%; position: absolute; background-repeat: no-repeat; background-position: center top; top: 0;" />');
  },

  setImage: function(){
    var imgData = localStorage.getItem(this.url);
    $('#underlayer').css('background-image','url("'+imgData+'")')
    $('#underlayer').show();
  },

  clear: function() {
    $('#underlayer').hide();
    this.hideImageDialog();
  }

}

$(function() {
  underlayer.init();
  $(document.body).on('change', '#bgfile', underlayer.addImage);
});