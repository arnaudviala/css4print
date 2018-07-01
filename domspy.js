(function() {

  var script__domspy_js;
  {
    var scripts = document.getElementsByTagName('script');
    script__domspy_js = scripts[scripts.length-1];
  }


  var DOMSpy = function()
  {
    this._init();
    return this;
  }

  DOMSpy.prototype =
  {
    _OPTIONS: {
      'max-level':  -1,
      'show-class': false,
      'show-id':    true,
      'root':       "body",
      'ignore':     ""
    },
    m_count: 0,
    m_lines: undefined,

    _init: function()
    {
      this._loadScriptParams();
    },

    _loadScriptParams: function()
    {
      if ( !script__domspy_js || !script__domspy_js.attributes ) return;

      for( var o in this._OPTIONS ) {
        var attr = script__domspy_js.attributes.getNamedItem('data-'+o);
        if ( attr )
        {
          var type = typeof this._OPTIONS[o]
          if ( type == "number" )
          {
            this._OPTIONS[o] = parseInt(attr.value);
          }
          else if ( type == "boolean" )
          {
            var val = attr.value.toLowerCase()
            this._OPTIONS[o] = ( val == "true" || val == "1" );
          }
          else // if ( type == "string" )
          {
            this._OPTIONS[o] = attr.value;
          }
        }
      }
    },

    run: function()
    {
      console.log("DOMSpy::run() started");

      this.m_count = 0;
      this.m_lines = [];

      var roots = $(this._OPTIONS['root']);

      // /!\ there can be several roots (e.g. with ".page")
      var self = this;
      roots.each( function(){
        self._recText( $(this), 0 );
      })

      this._showReport();

      console.log("DOMSpy::run() finished", "Number of elements: "+this.m_count);
    },

    // Recursive function
    _recText: function( elem, level )
    {
      var maxLevel = this._OPTIONS['max-level'];
      if ( maxLevel > 0  && maxLevel < level ) return;

      this.m_count++;

      var textLine = '  '.repeat(level);

      textLine += elem.prop("tagName")

      if ( this._OPTIONS['show-class'] )
      {
        var klass = elem.attr('class');
        if ( klass )
        {
          klass = '.'+klass.replace(/\s+/g,'.');
          textLine += klass;
        }
      }

      if ( this._OPTIONS['show-id'] )
      {
        if ( elem.attr("id") ) {
          textLine += '#'+elem.attr("id")
        }
      }

      var optIgnore = this._OPTIONS['ignore'];
      var bIgnore = ( optIgnore && elem.is(optIgnore) );
      if ( bIgnore )
      {
        textLine += ' [ignored, matches "'+optIgnore+'"]';
      }
      else
      {
        var rect = elem[0].getBoundingClientRect();
        textLine += ' '+rect.x+'x'+rect.y+','+rect.width+'x'+rect.height;
      }

      this.m_lines.push( textLine );

      if ( !bIgnore ) {
        var self = this;
        elem.children().each( function(){
          // in this anonymous function, "this" points to each child
          self._recText($(this), level+1);
        });
      }
    },

    _showReport: function()
    {
      var wnd = window.open('','_blank');
      if ( wnd )
      {
        wnd.document.title = "DOM SPY Report";
        wnd.document.writeln('<pre>');
        wnd.document.writeln('# DOM SPY Report');
        wnd.document.writeln('# url: '+document.location);
        wnd.document.writeln('# date: '+new Date());
        wnd.document.writeln('# count: '+this.m_count);
        for( var l in this.m_lines )
          wnd.document.writeln(this.m_lines[l]);
        wnd.document.writeln('</pre>');
      }
      else{
        alert("Impossible to open a new window, is there any popup blocker ?");
      }
    },
  };



  /* TODO: sometimes, the $.ready handler is called before other handlers
   *  and that's a problem as those other handlers might change the DOM tree.
   * Quick solution : use a timer.
   * Better solution : add some "data-" parameters to setup how the domspy()
   * method is invoked (keypress combination, a button, timer, ...).
   */
  var fnReadyHandler = function() {
    setTimeout( function() {
      var domspy = new DOMSpy();
      domspy.run();
    }, 200 );
  }


  // check existence of "$" from jQuery or Zepto
  // and load dynamically jQuery if not present
  if ( typeof $ == "function"  )
  {
    console.log("$ is defined, no need to load jQuery");
    $(fnReadyHandler);
  }
  else
  {
    console.log("$ is not defined, need to load jQuery");
    var script = document.createElement("SCRIPT");
    script.src = 'https://code.jquery.com/jquery-3.3.1.slim.min.js';
    script.type = 'text/javascript';
    script.setAttribute("integrity", "sha256-3edrmyuQ0w65f8gfBsqowzjJe2iM6n0nKciPUp8y+7E=");
    script.setAttribute("crossorigin", "anonymous");
    script.onload = function() {
        var $ = window.jQuery;
        $(fnReadyHandler);
    };
    document.getElementsByTagName("head")[0].appendChild(script);
  }
})();