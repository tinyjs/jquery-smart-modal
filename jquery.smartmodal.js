/**
modal_content => sm_content
modal_overlay => sm_olay
modal_close => sm_close
modal_title => sm_title
fn.modal* => fn.smart_modal*
modal_count => sm_count
**/
(function($) {
	//base function to call and setup everything
	$.fn.smart_modal=function(options){
		return this.each(function(){			
			if(this._sm) return; //if already a modal return
			if(typeof(options) != "undefined")	var params = $.extend({}, $.fn.smart_modal.defaults, options); //if some options are passed in merge them
			else var params = $.fn.smart_modal.defaults;
			if(typeof(sm_count) == "undefined") sm_count=0; //set the counter to 0
			sm_count++;
			this._sm=sm_count; //set what modal number this is
			H[sm_count] = {config:params,target_sm:this}; //add to hash var
			$(this).smart_modal_add_show(this); //add show & hide triggers
		});
	};
	$.fn.smart_modal_add_show=function(ele){ return $.smart_modal.show(ele); };
	//extra function so show & hide can be called
	$.fn.smart_modal_show=function(){
		return this.each(function(){
			$.smart_modal.open(this);
		});		
	};
	$.fn.smart_modal_hide=function(){
		return this.each(function(){
			$.smart_modal.hide(this, true);
		});		
	};
	//the default config vars
	$.fn.smart_modal.defaults = {show:false, hide:false, modal_styles:{display:"block", zIndex:1001}, resize:true, hide_on_overlay_click:true };
	//the over riden stuff
	$.smart_modal = {
		hash:{}, //the hash used to store all the configs & targets
		show:function(ele){
			var pos = ele._sm, h = H[pos];
			jQ(h.target_sm).click(function(){
				$.smart_modal.open(ele);
				return false;
			});
			return false;
		},
		
		hide:function(ele, force){
			var pos = ele._sm, h = H[pos];			
			if(h.config.hide_on_overlay_click) var idstr = "#sm_olay, .sm_close";
			else var idstr = ".sm_close";
			if(force) $.smart_modal.remove(ele);
			jQ(idstr).click(function(){
       	$.smart_modal.remove(ele);
				return false;
      });
		},
		remove:function(ele){
			var pos = ele._sm, h = H[pos];
			jQ("#sm_content").remove();
			jQ("#sm_olay").remove();							
			if(h.config.hide)	h.config.hide();
		},
		open:function(ele){
			var pos = ele._sm;
			var h = H[pos];			
			$.smart_modal.insert_overlay();
			$.smart_modal.insert_content_container();
			var smcontent = $.smart_modal.get_content($(h.target_sm));
			jQ("#sm_content").html(smcontent);			
			if(h.config.modal_styles) jQ("#sm_content").css(h.config.modal_styles);
			if(h.config.resize) $.smart_modal.resize_container();
      $.smart_modal.for_ie(jQ("#sm_olay"));	
			if(h.config.show) h.config.show();
			$.smart_modal.hide(ele); //add hiding
		},
		resize_container: function(){
			var max_width = 0, max_height=0;
			jQ('#sm_content *').load(function(){				
				jQ('#sm_content *').each(function(){					
					var tw = jQ(this).outerWidth(), th = jQ(this).outerHeight();
					if(tw > max_width) max_width = tw;
					max_height += th;
				});
				if(max_width >0 && max_height>0) jQ('#sm_content').css('width', (max_width+jQ('#sm_content .sm_close:first').outerWidth())+'px').css('height', (max_height)+'px').css('margin-left', '-'+(max_width/2)+'px');
			});
			
		},
		insert_overlay:function(){
			if(!jQ('#sm_olay').length) jQ("body").append('<div id="sm_olay"></div>');
      jQ("#sm_olay").css({height:'100%',width:'100%',position:'fixed',left:0,top:0,'z-index':1000,opacity:50/100});
		},
		insert_content_container:function(){
			if(!jQ('#sm_content').length) jQ("body").append('<div id="sm_content"></div>');
		},
		get_content:function(trig){
			c = "<div class='sm_close'><p>x</p></div>";
			if(trig.attr("rel")){ //if rel exists
				div_id = jQ('#'+trig.attr('rel'));
				div_class = jQ('.'+trig.attr('rel'));	
				if(div_id.length){ c += div_id.html(); }
				else if(div_class.length){ c += div_class.html();	}
			}else if(trig.attr('href')){ //if it has a href but no rel then insert the href as image src
				if(trig.attr('title')){ c +="<h3 class='sm_title'>"+trig.attr('title')+"</h3><img src='"+trig.attr('href')+"' alt='"+trig.attr('title')+"' />"; 	}
				else{ c += "<img src='"+trig.attr('href')+"' alt='sm_modal' />";	}
			}else{ c = c + trig.html(); }
			return c;
		},
		for_ie:function(o){
			if(ie6&&$('html,body').css({height:'100%',width:'100%'})&&o){
				$('html,body').css({height:'100%',width:'100%'});
        i=$('<iframe src="javascript:false;document.write(\'\');" class="overlay"></iframe>').css({opacity:0});
        o.html('<p style="width:100%;height:100%"/>').prepend(i);
        o = o.css({position:'absolute'})[0];
			}
		}
	};
	var H=$.smart_modal.hash,	jQ = jQuery;
			ie6=$.browser.msie&&($.browser.version == "6.0");
})(jQuery);
