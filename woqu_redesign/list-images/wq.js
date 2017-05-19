/**
 * @name			Layer
 * @usage 			woqu.com layer
 * @author 			Frend
 * @date 			2014-11-14
 */
var Layer = {};

/**
 * @name			hoverTips
 * @usage 			hover then show tips
 * @param{Object} 	target
 * @param{Boolean} 	hasTitle
 * @param{String} 	title
 * @param{String} 	content
 * @param{Number}	contentWidth
 */
Layer.hoverTips = {

	dialog: null,
	
	target: null,

	timer: null,

	init: function(target, hasTitle, title, content, contentWidth) {
		this.target = !!target ? $(target) : $(window);

		if ($('#hoverTipsDialog').length) {
			dialog = $('#hoverTipsDialog').empty();
		} else {
			dialog = $('<div id="hoverTipsDialog"></div>').appendTo(document.body);
		}

		dialog.append('<i class="' + (hasTitle ? 'has_title' : 'no_title') + '"></i>' + '<h2 class="' + (hasTitle ? '' : 'hide') + '" style="width: ' + (contentWidth + 20) + 'px;">' + title + '</h2>' + '<div class="content_container" style="width: ' + contentWidth + 'px;"></div>');
		dialog.find('.content_container').empty().append(content);
	},

	setPosition: function() {
		var target = this.target,
			offset = target.offset(),
			tLeft = offset.left,
			tTop = offset.top,
			dLeft = 0,
			offsetFix = 0;

		if (tLeft + target.outerWidth() / 2 - dialog.outerWidth() / 2 < 0) {	//overflow left
			dLeft = 0;
			offsetFix = Math.abs(target.outerWidth() / 2);
		} else if (tLeft + target.outerWidth() / 2 + dialog.outerWidth() / 2 > $(window).width()) {	//overflow right
			dLeft = $(window).width() - dialog.outerWidth();
			offsetFix = dialog.outerWidth() / 2 + Math.abs(tLeft + target.outerWidth() / 2 + dialog.outerWidth() / 2 - $(window).width());
		} else {	//normal
			dLeft = tLeft + target.outerWidth() / 2 - dialog.outerWidth() / 2;
			offsetFix = dialog.outerWidth() / 2;
		}

		dialog
		.css({
			'left': dLeft,
			'top': target.outerHeight() + offset.top + 15
		})
		.find('i').css({
			'left': offsetFix
		});
	},

	create: function(target, hasTitle, title, content, contentWidth) {
		this.init(target, hasTitle, title, content, contentWidth);
		this.setPosition();
		timer = setTimeout(function() {
			dialog.show();
		}, 300);
	},

	destroy: function() {
		!!dialog ? dialog.remove() : $('#hoverTipsDialog').empty();
		clearTimeout(timer);
		timer = null;
	},

	hide: function() {
		!!dialog ? dialog.hide() : $('#hoverTipsDialog').empty();
		clearTimeout(timer);
		timer = null;
	}
}

/**
 * @name	mask
 */
Layer.loading = {
	
	dialog: null,

	create: function() {
		if ($('#loading').length) {
			$('#loading').show();
			return;
		}
		dialog = $('<div id="loading" class="loading"><span class="mask"></span><span class="icon"></span></div>').appendTo($(document.body));
	},

	hide: function() {
		dialog.hide();
	},

	destroy: function() {
		dialog.remove();
	}
}