$(document).ready(function() {

  var _OPTIONS = {
    //show: "1",
    unit: "px",
    ref:  ".page"
  }

  // example parameters :
  //    ?ruler={unit:"px",ref:".page"}
  //    ?ruler=unit:px;ref:.page
  var urlParams = new URLSearchParams(window.location.search);
  for( var o in _OPTIONS ) {
    if ( urlParams.has('ruler-'+o) )
    {
      _OPTIONS[o] = urlParams.get('ruler-'+o);
    }
  }


  // compute the relation between "1cm" and "pixels"
  var _RATIOS = {};
  (function(){
    var div = $('<div>')
      .css("visibility", "hidden")
      .css("position", "absolute")
      .css("margin","0")
      .css("padding","0")
      .css("border","none")
      .css("width","1cm")
      .css("height","1cm")
      .appendTo( $(document.body) );  
    _RATIOS['cm'] = div.width();
    if ( div.width() != div.height() )
    {
      alert("Aïe, conversion 'cm' to 'px' is not squared !");
    }

    div.css("width","1in")
      .css("height","1in");
    _RATIOS['in'] = div.width();
    if ( div.width() != div.height() )
    {
      alert("Aïe, conversion 'in' to 'px' is not squared !");
    }
    
    div.remove();
  })();

  var divRulerH = $('<div>').addClass("h");
  var divRulerV = $('<div>').addClass("v");
  var divRulerMenu = $('<ul>').addClass("menu");//TODO:.hide();
  var divRulerCorner = $('<div>').addClass("corner");

  var divRuler = $('<div>')
    .addClass("ruler")
    .append(divRulerV)
    .append(divRulerH)
    .append(divRulerMenu)
    .append(divRulerCorner)
    .appendTo($(document.body));

  var liCursorPosition = $('<li>')
    .append( $('<label>').text('Mouse:') )
    .append( $('<label>').addClass("cursor-position") )
    .appendTo(divRulerMenu);
  var list = $('<select>')
    .html( '<option value="px">px</option>'
          +'<option value="cm">cm</option>'
          +'<option value="in">in</option>' );

  var liUnit = $('<li>')
    .append( $('<label>').text('Unit:') )
    .append( list )
    .appendTo(divRulerMenu);
  list.find("[value="+_OPTIONS['unit']+"]")
    .attr("selected", "1");

  list.on('change',function(){
    _OPTIONS['unit'] = $(this).val();
    // for now, we simply reload by changing URL's search
    var urlParams = new URLSearchParams(window.location.search);
    urlParams.set('ruler-unit', _OPTIONS['unit']);
    window.location.search = urlParams.toString();
  });

  divRulerCorner
    .data("ruler-menu",divRulerMenu)
    .on('click',function(){
      $(this).data("ruler-menu").toggle();
    });

  // everytime the document is resized, we would have to recompute ticks again
  var divTicksH = $('<div class="ticks">')
    .width($(document).width())
    .css("height","100%")
    .appendTo(divRulerH);
  var divTicksV = $('<div class="ticks">')
    .height($(document).height())
    .css("width","100%")
    .appendTo(divRulerV);


  var floor = function(x,b) { return Math.floor(x/b)*b; };

  var offset = $('.page').offset();


  $(window).scroll( function() {
    // here, temporary, reupdate the left and top of 'ticks' bars
    var offset = $('.page').offset();
    offset.top -= $(document.body).scrollTop();
    offset.left -= $(document.body).scrollLeft();
    $('.ruler .h .ticks').css("left",offset.left+"px");
    $('.ruler .v .ticks').css("top",offset.top+"px");
  });

  $(window).scroll(); // invoke the handler


  var fnDrawTicks = function( unit )
  {
    var specs = {
      'px': {
        ratio:      1,
        // here, we're using a decimal 'divider' =0.1 to express
        // we want to group 10px in each step
        divider:    0.1,
        ticksSize:  [ 2, 2, 2, 2, 6, 2, 2, 2, 2, 10 ],
                    // size of ticks at each step
                    // every 5 ticks (50px) -> 60%
                    // every 10 ticks (100px) -> 100%
        label:      10    // a label every 10 steps
      },
      'cm': {
        // there are 37.7812 pixels in 1cm (on my computer !!)
        ratio:      _RATIOS['cm'],
        divider:    2,    // each cm would be subdivided into 2 steps
        ticksSize:  [ 2, 6, 2, 6, 2, 6, 2, 6, 2, 10 ],
                    // size of ticks at each step
                    // every 2 ticks (1cm) -> 60%
                    // every 10 ticks (5cm) -> 100%
        label:      10    // a label every 10 steps
      },
      'in': {
        // there are 96 pixels in 1in (on my computer !!)
        ratio:      _RATIOS['in'],
        divider:    16,   // each inch would be subdivided into 16 steps
        ticksSize:  [ 2, 4, 2, 6, 2, 4, 2, 6, 2, 4, 2, 6, 2, 4, 2, 10 ],
                    // size of ticks at each step
                    // every 2 ticks (1/8in) -> 60%
                    // every 4 ticks (1/4in) -> 60%
                    // every 16 ticks (1in) -> 100%
        label:      16    // a label every 16 steps
      },
    }
    var getTickSize = function( spec, tick ) {
      var index = (tick - 1) % (spec.ticksSize.length);
      if ( index < 0 ) index += spec.ticksSize.length;
      return ""+spec.ticksSize[index];
    }


    var spec = specs[unit];
    var step = spec.ratio / spec.divider;
    offset['floorTop'] = floor(offset.top, step);
    offset['floorLeft'] = floor(offset.left, step);
    for( var w2=-offset.floorLeft ; w2<($(document).width()-offset.floorLeft) ; w2+=step )
    {
      var w = w2.toFixed(4);
      var tick = Math.round( w / step );

      var tClass = "t"+getTickSize(spec,tick);
      var t = $('<s>').addClass(tClass)
        .css("left",(w)+"px")
        .appendTo(divTicksH);

      if ( tick % spec.label == 0 ) {
        var label = Math.round( w / (spec.divider*step) );
        $('<label>').text(label).appendTo(t);
      }
    }
    for( var h2=-offset.floorTop ; h2<($(document).height()-offset.floorTop) ; h2+=step )
    {
      var h = h2.toFixed(4);
      var tick = Math.round( h / step );

      var tClass = "t"+getTickSize(spec,tick);

      var t = $('<s>')
        .addClass(tClass)
        .css("top",(h)+"px")
        .appendTo(divTicksV);

      if ( tick % spec.label == 0 ) {
        var label = Math.round( h / (spec.divider*step) );
        $('<label>').text(label).appendTo(t);
      }
    }
  };

  fnDrawTicks(_OPTIONS['unit']);

  var tCx = $('<s>')
  .addClass("cursor")
  .css("left","0px")
  .append( $('<label>') )
  .appendTo(divTicksH);
  var tCy = $('<s>')
  .addClass("cursor")
  .css("top","0px")
  .append( $('<label>') )
  .appendTo(divTicksV);



  $(window).mousemove( function(e) {
    var left = e.offsetX - $('.ruler .h .ticks').position().left;
    var top = e.offsetY - $('.ruler .v .ticks').position().top;
    tCx.css("left", left+"px");
    tCy.css("top", top+"px");

    left = Math.floor( left );
    top = Math.floor( top );

    var unit = _OPTIONS['unit'];
    if ( unit != "px" )
    {
      var ratio = _RATIOS[unit];
      left = (left / ratio).toFixed(2);
      top = (top / ratio).toFixed(2);
    }
    
    tCx.find('label').text(left);
    tCy.find('label').text(top);
    $('.ruler .cursor-position').text( left+" × "+top )
  })

  $(window).resize(function() {
    $(window).scroll();
  });
});