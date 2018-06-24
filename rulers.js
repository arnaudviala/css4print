/*
 *
 * TODO:
 * - add a option in menu to hide rulers
 * - add the possibility to show only the vertical or horizontal ruler
 * - add the persistence of some menu options (unit, ...)
 */

$(document).ready(function() {

  // "rulers" singleton, embark all internal variables+methods necessary
  var rulers = {

    // default options
    _OPTIONS: {
      unit: "px",
      ref:  ".page"
    },

    // contains the conversion ratio between "cm" or "in" to "pixels"
    _RATIOS: { 'px':1 },

    init: function() {
      this._loadURLSearchParams();
      this._computeRatios( ['cm','in'] );
      this._addHTMLElements();
      this._drawTicks();
      this._moveTicks();

      this._registerWindowEvents();
    },

    //  Internal: Look for "ruler-*" parameters in the URL's search
    //            and populate the _OPTIONS members accordingly.
    _loadURLSearchParams: function() {
      var urlParams = new URLSearchParams(window.location.search);
      for( var o in this._OPTIONS ) {
        if ( urlParams.has('ruler-'+o) )
        {
          this._OPTIONS[o] = urlParams.get('ruler-'+o);
        }
      }
    },

    _computeRatios: function( units )
    {
      var div = $('<div>')
        .css("visibility", "hidden")
        .css("position", "absolute")
        .css("top", "0px")
        .css("left", "0px")
        .css("margin","0")
        .css("padding","0")
        .css("border","none")
        .appendTo( $(document.body) );

      for( var u in units ) {
        var unit = units[u];
        div.css("width","1"+unit)
           .css("height","1"+unit);
        this._RATIOS[unit] = div.width();
        if ( div.width() != div.height() )
        {
          console.error("Ouch, conversion '"+unit+"' to 'px' is different vertically/horizontally !");
        }
      }

      div.remove();
    },

    _HTMLElements: {},

    _addHTMLElements: function()
    {
      var divRulerH = $('<div>').addClass("h");
      var divRulerV = $('<div>').addClass("v");
      var divRulerMenu = $('<ul>').addClass("menu").hide();
      var divRulerCorner = $('<div>').addClass("corner").text('i');

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
      var list = $('<select>');
      for( var u in this._RATIOS )
      {
        var option = $('<option>').attr('value',u).text(u);
        if ( u == this._OPTIONS['unit'] ) {
          option.attr("selected", "1");
        }
        list.append( option );
      }

      var liUnit = $('<li>')
        .append( $('<label>').text('Unit:') )
        .append( list )
        .appendTo(divRulerMenu);

      var self = this;
      list.on('change',function(){
        self._onUnitChange( $(this).val() );
      });

      var note = $('<sub>')
        .text("For now, 'unit' option is not persistent and would be lost at each reload. \
              If it's annoying, add '?ruler-unit=xx' to URL." )
        .appendTo(divRulerMenu);


      divRulerCorner
        .data("ruler-menu",divRulerMenu)
        .on('click',function(){
          $(this).data("ruler-menu").toggle();
        });

      var close = $('<a>')
        .addClass("close")
        .text("×")
        .appendTo( divRulerMenu )
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

      // Some special ticks that will follow the cursor position
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

      // save HTML elements in an array
      this._HTMLElements['divRuler'] = divRuler;
      this._HTMLElements['divRulerCorner'] = divRulerCorner;
      this._HTMLElements['divRulerMenu'] = divRulerMenu;
      this._HTMLElements['divRulerH'] = divRulerH;
      this._HTMLElements['divRulerV'] = divRulerV;
      this._HTMLElements['divTicksH'] = divTicksH;
      this._HTMLElements['divTicksV'] = divTicksV;
      this._HTMLElements['divTickMouseH'] = tCx;
      this._HTMLElements['divTickMouseV'] = tCy;
    },

    _onUnitChange: function( unit ) {
      this._OPTIONS['unit'] = unit;
      this._clearTicks();
      this._drawTicks();
      this._moveTicks();
      return;
      /* old code, used at a time the document was reloaded at each unit-change
      var urlParams = new URLSearchParams(window.location.search);
      urlParams.set('ruler-unit', this._OPTIONS['unit']);
      window.location.search = urlParams.toString(); */
    },

    _registerWindowEvents: function()
    {
      var self = this;
      $(window).scroll( function() {
        self._moveTicks();
      } );
      $(window).resize(function() {
        self._moveTicks();
      });

      $(window).mousemove( function(e) {
        self._moveCursorTicks( { x: e.offsetX, y: e.offsetY } );
      });
    },

    //  Internal: repositionate the horizontal/vertical ".ticks" objects
    //            so that relative x=0, y=0 match ref's {left,top}
    _moveTicks: function()
    {
      var ref = $(this._OPTIONS['ref']);
      var offset = ref.offset();
      offset.top -= $(document.body).scrollTop();
      offset.left -= $(document.body).scrollLeft();
      this._HTMLElements['divTicksH'].css("left",offset.left+"px");
      this._HTMLElements['divTicksV'].css("top",offset.top+"px");
    },

    _TICK_SPECS: {
      'px': {
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
        divider:    2,    // each cm would be subdivided into 2 steps
        ticksSize:  [ 2, 6, 2, 6, 2, 6, 2, 6, 2, 10 ],
                    // size of ticks at each step
                    // every 2 ticks (1cm) -> 60%
                    // every 10 ticks (5cm) -> 100%
        label:      10    // a label every 10 steps
      },
      'in': {
        divider:    16,   // each inch would be subdivided into 16 steps
        ticksSize:  [ 2, 4, 2, 6, 2, 4, 2, 6, 2, 4, 2, 6, 2, 4, 2, 10 ],
                    // size of ticks at each step
                    // every 2 ticks (1/8in) -> 60%
                    // every 4 ticks (1/4in) -> 60%
                    // every 16 ticks (1in) -> 100%
        label:      16    // a label every 16 steps
      },
    },

    _drawTicks: function( unit, ref )
    {
      // for now, param 'unit' are 'ref' are not set
      // we have to initialize them here, which is weird
      // (TODO: use local variables or real parameters)
      if ( unit === undefined ) unit = this._OPTIONS['unit'];
      if ( ref === undefined ) ref = $(this._OPTIONS['ref']);

      var getTickSize = function( spec, tick ) {
        var index = (tick - 1) % (spec.ticksSize.length);
        if ( index < 0 ) index += spec.ticksSize.length;
        return ""+spec.ticksSize[index];
      }

      // round (floor) the number `x` to the integer count of `b`
      //    the result might not be an integer (that's the case for 'cm')
      //    it is `N * b` (where `N` is an integer)
      var floor = function(x,b) { return Math.floor(x/b)*b; };

      var spec = this._TICK_SPECS[unit];
      var step = this._RATIOS[unit] / spec.divider;
      var offset = ref.offset();
      offset['floorTop'] = floor(offset.top, step);
      offset['floorLeft'] = floor(offset.left, step);
      for( var w2=-offset.floorLeft ; w2<($(document).width()-offset.floorLeft) ; w2+=step )
      {
        var w = w2.toFixed(4);
        var tick = Math.round( w / step );

        var tClass = "t"+getTickSize(spec,tick);
        var t = $('<s>').addClass(tClass)
          .css("left",(w)+"px")
          .appendTo( this._HTMLElements['divTicksH']);

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
          .appendTo(this._HTMLElements['divTicksV']);

        if ( tick % spec.label == 0 ) {
          var label = Math.round( h / (spec.divider*step) );
          $('<label>').text(label).appendTo(t);
        }
      }
    },

    _clearTicks: function() {
      var tmpContainer = this._HTMLElements['divRuler'];
      this._HTMLElements['divTickMouseH'].hide().appendTo(tmpContainer);
      this._HTMLElements['divTickMouseV'].hide().appendTo(tmpContainer);
      this._HTMLElements['divTicksH'].empty();
      this._HTMLElements['divTicksV'].empty();
      this._HTMLElements['divTickMouseH'].show().appendTo(this._HTMLElements['divTicksH']);
      this._HTMLElements['divTickMouseV'].show().appendTo(this._HTMLElements['divTicksV']);
    },

    _moveCursorTicks: function( cursorPosition )
    {
      var left = cursorPosition.x - this._HTMLElements['divTicksH'].position().left;
      var top = cursorPosition.y - this._HTMLElements['divTicksV'].position().top;

      var tCx = this._HTMLElements['divTickMouseH'];
      var tCy = this._HTMLElements['divTickMouseV'];
      tCx.css("left", left+"px");
      tCy.css("top", top+"px");

      left = Math.floor( left );
      top = Math.floor( top );

      var unit = this._OPTIONS['unit'];
      if ( unit != "px" )
      {
        var ratio = this._RATIOS[unit];
        left = (left / ratio).toFixed(2);
        top = (top / ratio).toFixed(2);
      }

      tCx.find('label').text(left);
      tCy.find('label').text(top);
      $('.ruler .cursor-position').text( left+" × "+top )
    },

  };  // end of singleton "rulers"

  rulers.init();  // TODO: add options
});