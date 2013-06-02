/*This is the url we are on.*/
var underlayer = {
  init: function() {
    this.url = document.URL;
    this.setListeners();
    //show image-dialog if no image is set

    if(localStorage.getItem('underlayer-toggled') != 'false') {
      this.underlay();
      if(typeof(localStorage[this.url] === "undefined")){
        localStorage.setItem('underlayer-toggled',true)
        this.showDialog();
      }
    }
  },

  setListeners: function() {
    $(document).keydown(function(e) {
      var key = e.keyCode;
      // Return if cmd is pressed, so we can reload
      //if(underlayer.cmdpressed == true) { return; }(reduntant)

      // 80 == 'P' | 82 == 'R' | 84 == 'T' | 67 == 'C' | 91 == CMD
      switch(key) {
      case 84:
        underlayer.toggle();
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
          underlayer.hideDialog();
          underlayer.setImage();
        };
      })(file);
    }
  },

  showDialog: function(){
    var $Dialog = $('<div id="Dialog" style="position: absolute;top: 50%;left: 50%;margin: -50px 0 0 -150px;background: gray;width: 300px;height: 150px;padding: 20px"></div>'),
        $imageInput = $('<input type="file" id="bgfile" name="files[]" style="margin-bottom:5px;" />');
        $inputTop = $('<input type="text" class="bg-position" placeholder="top" id="bg-position-top" style="border: 1px solid black;margin-bottom:5px;" />');
        $inputLeft = $('<input type="text" class="bg-position" placeholder="left" id="bg-position-left" style="border: 1px solid black;margin-bottom:5px;" />');

    $('body').append($Dialog.append($imageInput, $inputTop, $inputLeft));
  },

  hideDialog: function(){
    $('#Dialog').remove();
  },

  underlay: function(){
    /*make page transparent*/
    $('body > *').css('opacity', 0.5);
    /*Add image behind*/
    $('body').prepend('<div id="underlayer" style="width: 100%; height: 100%; position: absolute; background-repeat: no-repeat; background-position: center top; top: 0;" />');

    typeof(localStorage[this.url] === "undefined") ? this.setImage() : this.showDialog();
    this.setPosition();
  },

  setImage: function(){
    var imgData = localStorage.getItem(this.url);
    $('#underlayer').css('background-image','url("'+imgData+'")')
    $('#underlayer').show();
  },

  setPosition: function() {
    var top = $('#bg-position-top').val(),
        left = $('#bg-position-left').val();

    if(typeof(top) != 'undefined') {
      localStorage.setItem('top',top);
    };

    if(typeof(left) != 'undefined') {
      localStorage.setItem('left',left);
    };

    var lsTop = localStorage.getItem('top'),
        lsLeft = localStorage.getItem('left');

    if(lsTop != null && lsLeft != null) {
      $('#underlayer').css('background-position',lsLeft+underlayer.positionUnit(lsLeft)+' '+lsTop+underlayer.positionUnit(lsTop));
    }
  },

  positionUnit: function(string) {
    return isNaN(string) === true ? '' : 'px'
  },

  toggle: function() {
    if($('#underlayer').is(':visible')) {
     localStorage.setItem('underlayer-toggled',false)
     this.clear();
    } else {
      localStorage.setItem('underlayer-toggled',true)
      this.underlay();
      this.showDialog();
    }
  },

  clear: function() {
    $('body > *').css('opacity', '');
    $('#underlayer').remove();
    $('#position-dialog').remove();
    this.hideDialog();
  }

}

$(function() {
  underlayer.init();
  $(document.body).on('change', '#bgfile', underlayer.addImage);
  $(document.body).on('change', '.bg-position', underlayer.setPosition);
});