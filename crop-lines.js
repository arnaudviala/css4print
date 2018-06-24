// Ugly global variable:
//    Now that I know this ugly global var trick, I am an addict and cannot
//    stop using it :-(     [see rulers.js for detailed comments]
var script__crop_lines_js;
{
  var scripts = document.getElementsByTagName('script');
  script__crop_lines_js = scripts[scripts.length-1];
}

$(function() {

  var _PARAMS = {
    'selector': '.add-crop-lines',

    // who is going to be the parent of 'crop-lines'
    'parent-selector':   '.page'
  };

  // get _PARAMS from data attributes of <script> element
  if ( script__crop_lines_js && script__crop_lines_js.attributes )
  {
    for( var p in _PARAMS ) {
      var attr = script__crop_lines_js.attributes.getNamedItem('data-'+p);
      if ( attr )
      {
        _PARAMS[p] = attr.value;
      }
    }
  }

  $(_PARAMS.selector).each( function(index,elem) {
    var i=0;
    var obj = $(elem);
    var parent = obj.closest(_PARAMS['parent-selector']);


    var offsetObj = obj.offset();
    var offsetPage = parent.offset();
    var borderTopWidth = parseInt(parent.css("border-top-width"));
    var borderLeftWidth = parseInt(parent.css("border-left-width"));
    var offsetRelative = {
      top:  (offsetObj.top - offsetPage.top - borderTopWidth) ,
      left: (offsetObj.left - offsetPage.left - borderLeftWidth)
    }

    var croplines = $('<div>')
      .css('position','absolute')
      .css("width", obj.outerWidth()+"px")
      .css("height", obj.outerHeight()+"px");

    var cropmask = croplines.clone()
      .addClass('crop-mask')
      .css("box-sizing", "content-box")
      .css("border-width", "5px")
      .css("left", (offsetRelative.left-5)+"px")
      .css("top", (offsetRelative.top-5)+"px")
      .css("z-index", "-1");
    // we need to get the computedStyle background-color,
    // to re-apply it as border-color
    // but the style is computed only at append()
    cropmask.appendTo(parent);
    cropmask.css( "border-color", cropmask.css("background-color") );

    croplines.addClass('crop-lines')
      .css("left", offsetRelative.left+"px")
      .css("top", offsetRelative.top+"px")
      .css("z-index", "-2")
      .append( $('<div class="crop-line-left">') )
      .append( $('<div class="crop-line-top">') )
      .append( $('<div class="crop-line-right">') )
      .append( $('<div class="crop-line-bottom">') )
      .appendTo(parent);

    // if obj as an id, link it
    var id = obj.attr("id");
    if ( id )
    {
      croplines.attr("for", id);
      cropmask.attr("for", id);
    }
  });
});