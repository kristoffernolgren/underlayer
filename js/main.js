/*This is the url we are on.*/
var thisurl = document.URL;

$( document ).ready(function() {
  $(document.body).on('change', '#bgfile', addimage);


  /*check if current url has an image assosiated with it.*/
	if(localStorage[thisurl]){
    /*if it has, underlay that image*/
    underlay();
    setimage();
	}
	else{
    /*otherwise, prompt user to upload image*/
    underlay();
    showimagedialog();
	}

});


function addimage(evt) {
  var file = evt.target.files[0]; 
  /* Only process image files.*/
  if (file.type.match('image.*')) {
    /*Add image to FileReader object*/
    var reader = new FileReader();
    reader.readAsDataURL(file);
    /*Add image to local storage */
    reader.onload = (function(theFile) {
      return function(e) {
        localStorage.setItem(thisurl, e.target.result);
        /*Add image to background*/
        hideimagedialog();
        setimage();
      };
    })(file);
  }
}


function showimagedialog(){
  $('body').prepend('<div id="imagedialog"><input type="file" id="bgfile" name="files[]" style="position: absolute;top: 50%;left: 50%;margin: -50px 0 0 -150px;background: gray;width: 260px;height: 60px; padding: 20px;" />');
}
function hideimagedialog(){
  $('#imagedialog').remove();
}
function underlay(){
  /*make page transparent*/
  $('body > *').css('opacity', 0.5);
  /*Add image behind*/
  $('body').prepend('<div id="underlayer" style="width: 100%;height: 100%;position: absolute;background-repeat: no-repeat;background-position: center top;top: 0;" />')
}
function setimage(){
  var imgurl = localStorage.getItem(thisurl)
  $('#underlayer').css('background-image','url("'+imgurl+'")')
}