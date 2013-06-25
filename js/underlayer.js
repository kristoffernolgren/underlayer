//todo add a namespace to all local-storage-variables
var underlayer = {
	init: function() {
		this.url = document.URL;
		this.setListeners();

		localStorage.setItem('offsetX', 0)
		localStorage.setItem('offsetY', 0)



		//gör det här med toggler-funktionen istället kanske?
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

				case 37:
					if(localStorage.getItem('underlayer-toggled') == 'true') {
						e.preventDefault();
						underlayer.backgroundOffset('left');
						break;
					}
				case 38:
					if(localStorage.getItem('underlayer-toggled') == 'true') {
						e.preventDefault();
						underlayer.backgroundOffset('up');
						break;
					}
				case 39:
					if(localStorage.getItem('underlayer-toggled') == 'true') {
						e.preventDefault();
						underlayer.backgroundOffset('right');
						break;
					}
				case 40:
					if(localStorage.getItem('underlayer-toggled') == 'true') {
						e.preventDefault();
						underlayer.backgroundOffset('down');
						break;
					}
				default:
					return;
			}
		});
	},

	backgroundOffset: function(direction) {
		var offsetX = parseInt(localStorage.getItem('offsetX'));
		var offsetY = parseInt(localStorage.getItem('offsetY'));
		switch(direction){
			case 'left':
				localStorage.setItem('offsetY',offsetY-1);
				break;
			case 'right':
				localStorage.setItem('offsetY',offsetY+1);
				break;
			case 'up':
				localStorage.setItem('offsetX',offsetX-1);
				break;
			case 'down':
				localStorage.setItem('offsetX',offsetX+1);
				break;
			default:
				return;
		}
		$('#underlayer').css({
			'margin-left': offsetY,
			'margin-top': offsetX
		});
	},

	toggle: function() {
		if(localStorage.getItem('underlayer-toggled') == 'true') {
		 this.hideUnderlay();
		} else {
			this.showUnderlay();
			this.setPosition();
			this.setHeight();
			if(localStorage.getItem([this.url]) === null){
				this.showDialog();
			};
		}
	},


	showDialog: function(){
		if(localStorage.getItem('underlayer-toggled') == 'false') {
			this.showUnderlay();
		};
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
		localStorage.setItem('underlayer-toggled',true);
		/*make page transparent*/
		$('body > *:not(#dialog)').css('opacity', 0.5);
		/*Add image behind*/
		$('body').prepend('<div id="underlayer" style="width: 100%; position: absolute; background-repeat: no-repeat; background-position: center top; top: 0;" ></div>');
		this.setImage();
		this.setPosition();
		this.setHeight();
	},

	hideUnderlay: function() {
		localStorage.setItem('underlayer-toggled',false);
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
					underlayer.setPosition();
					setTimeout(underlayer.setHeight, 500);
					
				};
			})(file);
		}
	},

	addPosition: function(alignment){
		localStorage.setItem('alignment', alignment);
		underlayer.setPosition();
	},

	setImage: function(){
		//adds underlay-image
		var imgData = localStorage.getItem(this.url);
		$('#underlayer').css('background-image','url("'+imgData+'")')
	},

	setPosition: function() {
		//sets the position to presets
		var posData = localStorage.getItem('alignment');
		$('#underlayer').css('background-position','top '+ posData)
	},

	setHeight: function() {
		//sets the height of the background
		var img = new Image;
		img.src = $('#underlayer').css('background-image').replace(/url\(|\)$/ig, "");
		var height = img.height +'px';

		console.log(height);
		$('#underlayer').css('height',height);
	}


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