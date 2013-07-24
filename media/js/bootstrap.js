/* ===================================================
 * bootstrap-transition.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function($) {

	"use strict"; // jshint ;_;

	/*
	 * CSS TRANSITION SUPPORT (http://www.modernizr.com/)
	 * =======================================================
	 */

	$(function() {

		$.support.transition = (function() {

			var transitionEnd = (function() {

				var el = document.createElement('bootstrap'), transEndEventNames = {
					'WebkitTransition' : 'webkitTransitionEnd',
					'MozTransition' : 'transitionend',
					'OTransition' : 'oTransitionEnd otransitionend',
					'transition' : 'transitionend'
				}, name

				for (name in transEndEventNames) {
					if (el.style[name] !== undefined) {
						return transEndEventNames[name]
					}
				}

			}())

			return transitionEnd && {
				end : transitionEnd
			}

		})()

	})

}(window.jQuery);
/*
 * ============================================================
 * bootstrap-dropdown.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================ Copyright 2012
 * Twitter, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License. ============================================================
 */

!function($) {

	"use strict"; // jshint ;_;

	/*
	 * DROPDOWN CLASS DEFINITION =========================
	 */

	var toggle = '[data-toggle=dropdown]', Dropdown = function(element) {
		var $el = $(element).on('click.dropdown.data-api', this.toggle)
		$('html').on('click.dropdown.data-api', function() {
			$el.parent().removeClass('open')
		})
	}

	Dropdown.prototype = {

		constructor : Dropdown

		,
		toggle : function(e) {
			var $this = $(this), $parent, isActive

			if ($this.is('.disabled, :disabled'))
				return

			

			$parent = getParent($this)

			isActive = $parent.hasClass('open')

			clearMenus()

			if (!isActive) {
				if ('ontouchstart' in document.documentElement) {
					// if mobile we we use a backdrop because click events don't
					// delegate
					$('<div class="dropdown-backdrop"/>').insertBefore($(this))
							.on('click', clearMenus)
				}
				$parent.toggleClass('open')
			}

			$this.focus()

			return false
		}

		,
		keydown : function(e) {
			var $this, $items, $active, $parent, isActive, index

			if (!/(38|40|27)/.test(e.keyCode))
				return

			

			$this = $(this)

			e.preventDefault()
			e.stopPropagation()

			if ($this.is('.disabled, :disabled'))
				return

			

			$parent = getParent($this)

			isActive = $parent.hasClass('open')

			if (!isActive || (isActive && e.keyCode == 27)) {
				if (e.which == 27)
					$parent.find(toggle).focus()
				return $this.click()
			}

			$items = $('[role=menu] li:not(.divider):visible a', $parent)

			if (!$items.length)
				return

			

			index = $items.index($items.filter(':focus'))

			if (e.keyCode == 38 && index > 0)
				index-- // up
			if (e.keyCode == 40 && index < $items.length - 1)
				index++ // down
			if (!~index)
				index = 0

			$items.eq(index).focus()
		}

	}

	function clearMenus() {
		$('.dropdown-backdrop').remove()
		$(toggle).each(function() {
			getParent($(this)).removeClass('open')
		})
	}

	function getParent($this) {
		var selector = $this.attr('data-target'), $parent

		if (!selector) {
			selector = $this.attr('href')
			selector = selector && /#/.test(selector)
					&& selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
		}

		$parent = selector && $(selector)

		if (!$parent || !$parent.length)
			$parent = $this.parent()

		return $parent
	}

	/*
	 * DROPDOWN PLUGIN DEFINITION ==========================
	 */

	var old = $.fn.dropdown

	$.fn.dropdown = function(option) {
		return this.each(function() {
			var $this = $(this), data = $this.data('dropdown')
			if (!data)
				$this.data('dropdown', (data = new Dropdown(this)))
			if (typeof option == 'string')
				data[option].call($this)
		})
	}

	$.fn.dropdown.Constructor = Dropdown

	/*
	 * DROPDOWN NO CONFLICT ====================
	 */

	$.fn.dropdown.noConflict = function() {
		$.fn.dropdown = old
		return this
	}

	/*
	 * APPLY TO STANDARD DROPDOWN ELEMENTS ===================================
	 */

	$(document).on('click.dropdown.data-api', clearMenus).on(
			'click.dropdown.data-api', '.dropdown form', function(e) {
				e.stopPropagation()
			}).on('click.dropdown.data-api', toggle, Dropdown.prototype.toggle)
			.on('keydown.dropdown.data-api', toggle + ', [role=menu]',
					Dropdown.prototype.keydown)

}(window.jQuery);

/*
 * =============================================================
 * bootstrap-collapse.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * ============================================================= Copyright 2012
 * Twitter, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License. ============================================================
 */

!function($) {

	"use strict"; // jshint ;_;

	/*
	 * COLLAPSE PUBLIC CLASS DEFINITION ================================
	 */

	var Collapse = function(element, options) {
		this.$element = $(element)
		this.options = $.extend({}, $.fn.collapse.defaults, options)

		if (this.options.parent) {
			this.$parent = $(this.options.parent)
		}

		this.options.toggle && this.toggle()
	}

	Collapse.prototype = {

		constructor : Collapse

		,
		dimension : function() {
			var hasWidth = this.$element.hasClass('width')
			return hasWidth ? 'width' : 'height'
		}

		,
		show : function() {
			var dimension, scroll, actives, hasData

			if (this.transitioning || this.$element.hasClass('in'))
				return

			

			dimension = this.dimension()
			scroll = $.camelCase([ 'scroll', dimension ].join('-'))
			actives = this.$parent
					&& this.$parent.find('> .accordion-group > .in')

			if (actives && actives.length) {
				hasData = actives.data('collapse')
				if (hasData && hasData.transitioning)
					return

				actives.collapse('hide')
				hasData || actives.data('collapse', null)
			}

			this.$element[dimension](0)
			this.transition('addClass', $.Event('show'), 'shown')
			$.support.transition
					&& this.$element[dimension](this.$element[0][scroll])
		}

		,
		hide : function() {
			var dimension
			if (this.transitioning || !this.$element.hasClass('in'))
				return

			dimension = this.dimension()
			this.reset(this.$element[dimension]())
			this.transition('removeClass', $.Event('hide'), 'hidden')
			this.$element[dimension](0)
		}

		,
		reset : function(size) {
			var dimension = this.dimension()

			this.$element.removeClass('collapse')[dimension](size || 'auto')[0].offsetWidth

			this.$element[size !== null ? 'addClass' : 'removeClass']
					('collapse')

			return this
		}

		,
		transition : function(method, startEvent, completeEvent) {
			var that = this, complete = function() {
				if (startEvent.type == 'show')
					that.reset()
				that.transitioning = 0
				that.$element.trigger(completeEvent)
			}

			this.$element.trigger(startEvent)

			if (startEvent.isDefaultPrevented())
				return

			

			this.transitioning = 1

			this.$element[method]('in')

			$.support.transition && this.$element.hasClass('collapse') ? this.$element
					.one($.support.transition.end, complete)
					: complete()
		}

		,
		toggle : function() {
			this[this.$element.hasClass('in') ? 'hide' : 'show']()
		}

	}

	/*
	 * COLLAPSE PLUGIN DEFINITION ==========================
	 */

	var old = $.fn.collapse

	$.fn.collapse = function(option) {
		return this.each(function() {
			var $this = $(this), data = $this.data('collapse'), options = $
					.extend({}, $.fn.collapse.defaults, $this.data(),
							typeof option == 'object' && option)
			if (!data)
				$this.data('collapse', (data = new Collapse(this, options)))
			if (typeof option == 'string')
				data[option]()
		})
	}

	$.fn.collapse.defaults = {
		toggle : true
	}

	$.fn.collapse.Constructor = Collapse

	/*
	 * COLLAPSE NO CONFLICT ====================
	 */

	$.fn.collapse.noConflict = function() {
		$.fn.collapse = old
		return this
	}

	/*
	 * COLLAPSE DATA-API =================
	 */

	$(document).on(
			'click.collapse.data-api',
			'[data-toggle=collapse]',
			function(e) {
				var $this = $(this), href, target = $this.attr('data-target')
						|| e.preventDefault() || (href = $this.attr('href'))
						&& href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7
				, option = $(target).data('collapse') ? 'toggle' : $this.data()
				$this[$(target).hasClass('in') ? 'addClass' : 'removeClass']
						('collapsed')
				$(target).collapse(option)
			})

}(window.jQuery);
/*
 * ==========================================================
 * bootstrap-carousel.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ========================================================== Copyright 2012
 * Twitter, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License. ==========================================================
 */

!function($) {

	"use strict"; // jshint ;_;

	/*
	 * CAROUSEL CLASS DEFINITION =========================
	 */

	var Carousel = function(element, options) {
		this.$element = $(element)
		this.$indicators = this.$element.find('.carousel-indicators')
		this.options = options
		this.options.pause == 'hover'
				&& this.$element.on('mouseenter', $.proxy(this.pause, this))
						.on('mouseleave', $.proxy(this.cycle, this))
	}

	Carousel.prototype = {

		cycle : function(e) {
			if (!e)
				this.paused = false
			if (this.interval)
				clearInterval(this.interval);
			this.options.interval
					&& !this.paused
					&& (this.interval = setInterval($.proxy(this.next, this),
							this.options.interval))
			return this
		}

		,
		getActiveIndex : function() {
			this.$active = this.$element.find('.item.active')
			this.$items = this.$active.parent().children()
			return this.$items.index(this.$active)
		}

		,
		to : function(pos) {
			var activeIndex = this.getActiveIndex(), that = this

			if (pos > (this.$items.length - 1) || pos < 0)
				return

			

			if (this.sliding) {
				return this.$element.one('slid', function() {
					that.to(pos)
				})
			}

			if (activeIndex == pos) {
				return this.pause().cycle()
			}

			return this.slide(pos > activeIndex ? 'next' : 'prev',
					$(this.$items[pos]))
		}

		,
		pause : function(e) {
			if (!e)
				this.paused = true
			if (this.$element.find('.next, .prev').length
					&& $.support.transition.end) {
				this.$element.trigger($.support.transition.end)
				this.cycle(true)
			}
			clearInterval(this.interval)
			this.interval = null
			return this
		}

		,
		next : function() {
			if (this.sliding)
				return

			return this.slide('next')
		}

		,
		prev : function() {
			if (this.sliding)
				return

			return this.slide('prev')
		}

		,
		slide : function(type, next) {
			var $active = this.$element.find('.item.active'), $next = next
					|| $active[type](), isCycling = this.interval, direction = type == 'next' ? 'left'
					: 'right', fallback = type == 'next' ? 'first' : 'last', that = this, e

			this.sliding = true

			isCycling && this.pause()

			$next = $next.length ? $next
					: this.$element.find('.item')[fallback]()

			e = $.Event('slide', {
				relatedTarget : $next[0],
				direction : direction
			})

			if ($next.hasClass('active'))
				return

			

			if (this.$indicators.length) {
				this.$indicators.find('.active').removeClass('active')
				this.$element.one('slid', function() {
					var $nextIndicator = $(that.$indicators.children()[that
							.getActiveIndex()])
					$nextIndicator && $nextIndicator.addClass('active')
				})
			}

			if ($.support.transition && this.$element.hasClass('slide')) {
				this.$element.trigger(e)
				if (e.isDefaultPrevented())
					return

				$next.addClass(type)
				$next[0].offsetWidth // force reflow
				$active.addClass(direction)
				$next.addClass(direction)
				this.$element.one($.support.transition.end, function() {
					$next.removeClass([ type, direction ].join(' ')).addClass(
							'active')
					$active.removeClass([ 'active', direction ].join(' '))
					that.sliding = false
					setTimeout(function() {
						that.$element.trigger('slid')
					}, 0)
				})
			} else {
				this.$element.trigger(e)
				if (e.isDefaultPrevented())
					return

				$active.removeClass('active')
				$next.addClass('active')
				this.sliding = false
				this.$element.trigger('slid')
			}

			isCycling && this.cycle()

			return this
		}

	}

	/*
	 * CAROUSEL PLUGIN DEFINITION ==========================
	 */

	var old = $.fn.carousel

	$.fn.carousel = function(option) {
		return this
				.each(function() {
					var $this = $(this), data = $this.data('carousel'), options = $
							.extend({}, $.fn.carousel.defaults,
									typeof option == 'object' && option), action = typeof option == 'string' ? option
							: options.slide
					if (!data)
						$this.data('carousel', (data = new Carousel(this,
								options)))
					if (typeof option == 'number')
						data.to(option)
					else if (action)
						data[action]()
					else if (options.interval)
						data.pause().cycle()
				})
	}

	$.fn.carousel.defaults = {
		interval : 5000,
		pause : 'hover'
	}

	$.fn.carousel.Constructor = Carousel

	/*
	 * CAROUSEL NO CONFLICT ====================
	 */

	$.fn.carousel.noConflict = function() {
		$.fn.carousel = old
		return this
	}

	/*
	 * CAROUSEL DATA-API =================
	 */

	$(document)
			.on(
					'click.carousel.data-api',
					'[data-slide], [data-slide-to]',
					function(e) {
						var $this = $(this), href, $target = $($this
								.attr('data-target')
								|| (href = $this.attr('href'))
								&& href.replace(/.*(?=#[^\s]+$)/, '')) // strip
																		// for
																		// ie7
						, options = $.extend({}, $target.data(), $this.data()), slideIndex

						$target.carousel(options)

						if (slideIndex = $this.attr('data-slide-to')) {
							$target.data('carousel').pause().to(slideIndex)
									.cycle()
						}

						e.preventDefault()
					})

}(window.jQuery);

/*
 * ========================================================= bootstrap-modal.js
 * v2.3.2 http://twitter.github.com/bootstrap/javascript.html#modals
 * ========================================================= Copyright 2012
 * Twitter, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License. =========================================================
 */

!function($) {

	"use strict"; // jshint ;_;

	/*
	 * MODAL CLASS DEFINITION ======================
	 */

	var Modal = function(element, options) {
		this.options = options
		this.$element = $(element).delegate('[data-dismiss="modal"]',
				'click.dismiss.modal', $.proxy(this.hide, this))
		this.options.remote
				&& this.$element.find('.modal-body').load(this.options.remote)
	}

	Modal.prototype = {

		constructor : Modal

		,
		toggle : function() {
			return this[!this.isShown ? 'show' : 'hide']()
		}

		,
		show : function() {
			var that = this, e = $.Event('show')

			this.$element.trigger(e)

			if (this.isShown || e.isDefaultPrevented())
				return

			

			this.isShown = true

			this.escape()

			this.backdrop(function() {
				var transition = $.support.transition
						&& that.$element.hasClass('fade')

				if (!that.$element.parent().length) {
					that.$element.appendTo(document.body) // don't move modals
															// dom position
				}

				that.$element.show()

				if (transition) {
					that.$element[0].offsetWidth // force reflow
				}

				that.$element.addClass('in').attr('aria-hidden', false)

				that.enforceFocus()

				transition ? that.$element.one($.support.transition.end,
						function() {
							that.$element.focus().trigger('shown')
						}) : that.$element.focus().trigger('shown')

			})
		}

		,
		hide : function(e) {
			e && e.preventDefault()

			var that = this

			e = $.Event('hide')

			this.$element.trigger(e)

			if (!this.isShown || e.isDefaultPrevented())
				return

			

			this.isShown = false

			this.escape()

			$(document).off('focusin.modal')

			this.$element.removeClass('in').attr('aria-hidden', true)

			$.support.transition && this.$element.hasClass('fade') ? this
					.hideWithTransition() : this.hideModal()
		}

		,
		enforceFocus : function() {
			var that = this
			$(document).on(
					'focusin.modal',
					function(e) {
						if (that.$element[0] !== e.target
								&& !that.$element.has(e.target).length) {
							that.$element.focus()
						}
					})
		}

		,
		escape : function() {
			var that = this
			if (this.isShown && this.options.keyboard) {
				this.$element.on('keyup.dismiss.modal', function(e) {
					e.which == 27 && that.hide()
				})
			} else if (!this.isShown) {
				this.$element.off('keyup.dismiss.modal')
			}
		}

		,
		hideWithTransition : function() {
			var that = this, timeout = setTimeout(function() {
				that.$element.off($.support.transition.end)
				that.hideModal()
			}, 500)

			this.$element.one($.support.transition.end, function() {
				clearTimeout(timeout)
				that.hideModal()
			})
		}

		,
		hideModal : function() {
			var that = this
			this.$element.hide()
			this.backdrop(function() {
				that.removeBackdrop()
				that.$element.trigger('hidden')
			})
		}

		,
		removeBackdrop : function() {
			this.$backdrop && this.$backdrop.remove()
			this.$backdrop = null
		}

		,
		backdrop : function(callback) {
			var that = this, animate = this.$element.hasClass('fade') ? 'fade'
					: ''

			if (this.isShown && this.options.backdrop) {
				var doAnimate = $.support.transition && animate

				this.$backdrop = $(
						'<div class="modal-backdrop ' + animate + '" />')
						.appendTo(document.body)

				this.$backdrop.click(this.options.backdrop == 'static' ? $
						.proxy(this.$element[0].focus, this.$element[0]) : $
						.proxy(this.hide, this))

				if (doAnimate)
					this.$backdrop[0].offsetWidth // force reflow

				this.$backdrop.addClass('in')

				if (!callback)
					return

				

				doAnimate ? this.$backdrop.one($.support.transition.end,
						callback) : callback()

			} else if (!this.isShown && this.$backdrop) {
				this.$backdrop.removeClass('in')

				$.support.transition && this.$element.hasClass('fade') ? this.$backdrop
						.one($.support.transition.end, callback)
						: callback()

			} else if (callback) {
				callback()
			}
		}
	}

	/*
	 * MODAL PLUGIN DEFINITION =======================
	 */

	var old = $.fn.modal

	$.fn.modal = function(option) {
		return this.each(function() {
			var $this = $(this), data = $this.data('modal'), options = $
					.extend({}, $.fn.modal.defaults, $this.data(),
							typeof option == 'object' && option)
			if (!data)
				$this.data('modal', (data = new Modal(this, options)))
			if (typeof option == 'string')
				data[option]()
			else if (options.show)
				data.show()
		})
	}

	$.fn.modal.defaults = {
		backdrop : true,
		keyboard : true,
		show : true
	}

	$.fn.modal.Constructor = Modal

	/*
	 * MODAL NO CONFLICT =================
	 */

	$.fn.modal.noConflict = function() {
		$.fn.modal = old
		return this
	}

	/*
	 * MODAL DATA-API ==============
	 */

	$(document)
			.on(
					'click.modal.data-api',
					'[data-toggle="modal"]',
					function(e) {
						var $this = $(this), href = $this.attr('href'), $target = $($this
								.attr('data-target')
								|| (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip
																					// for
																					// ie7
						, option = $target.data('modal') ? 'toggle' : $.extend(
								{
									remote : !/#/.test(href) && href
								}, $target.data(), $this.data())

						e.preventDefault()

						$target.modal(option).one('hide', function() {
							$this.focus()
						})
					})

}(window.jQuery);

/*
 * ========================================================== bootstrap-alert.js
 * v2.3.2 http://twitter.github.com/bootstrap/javascript.html#alerts
 * ========================================================== Copyright 2012
 * Twitter, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License. ==========================================================
 */


!function ($) {

  "use strict"; // jshint ;_;


 /*
	 * ALERT CLASS DEFINITION ======================
	 */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for
																	// ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /*
	 * ALERT PLUGIN DEFINITION =======================
	 */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /*
	 * ALERT NO CONFLICT =================
	 */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /*
	 * ALERT DATA-API ==============
	 */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);
