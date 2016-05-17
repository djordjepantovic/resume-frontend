$(window).load(function(){

    // Preloader   
    $('#preloader').delay(350).fadeOut('slow');
    $('body').delay(350);
});

// for scrolling to targeted sections
(function ($, window, document, undefined) {

    var ScrollingTo = {
        init: function (options, elem) {
            var self = this;

            self.elem = elem;
            self.$elem = $(elem);

            self.options = $.extend( {}, $.fn.scrollingTo.options, options );
            self.newScrollPos = null;

            self.bindEvents();
        },

        bindEvents: function () {
            this.$elem.on( 'click', $.proxy(this.scroll, this));
        },

        scroll: function (e) {
            var self = this,
                evt = e,
                $waypoints = $(self.options.waypoints);

            evt.preventDefault();

            if ( $('html, body').is(':animated') ) {
                $('html, body').stop( true, true );
            }

            $waypoints.each(function () {
                this.disable(); 
            });

            self.checkScrollTop();

            if ( typeof self.options.callbackBeforeTransition === 'function' ) {
                self.options.callbackBeforeTransition.call(self.elem, evt);
            }

            self.animateScroll().then(function () {
    
                $waypoints.each(function () {
                    this.enable();  
                });

                if ( typeof self.options.callbackAfterTransition === 'function' ) {
                    self.options.callbackAfterTransition.call(self.elem, evt);
                }

            });
        },

        animateScroll: function () {
            var self = this;

            return $('html, body').animate({
            'scrollTop': ( self.newScrollPos + 'px' )
            }, {
                duration: self.options.animationTime,
                easing: self.options.easing
            }).promise();

        },

        checkScrollTop: function () {
            var self = this,
                $section = $(document).find( self.$elem.data('section') ),
                scrollPos = $section.offset().top;

            if ( $(window).scrollTop() == ( scrollPos + self.options.topSpace ) ) {

                return false;
            }

            self.newScrollPos = (scrollPos - self.options.topSpace);
        }

    };

    $.fn.scrollingTo = function( options ) {
        return this.each(function () {
            var scrolling = Object.create(ScrollingTo);
            scrolling.init(options, this);
        });
    };

    $.fn.scrollingTo.options = {
        animationTime : 1000,
        easing : '',
        topSpace : 0,
        waypoints: null,
        callbackBeforeTransition: null,
        callbackAfterTransition: null
    };
    
})(jQuery, window, document);

(function ($, window, document, undefined) {

    initCounter();

    $("a.button-collapse").sideNav();

    $('#pie-charts').appear();
    $('#pie-charts').on('appear', function () {
        $(this).find('.pie-chart').each(function () {
            var $this = $(this);

            $(this).easyPieChart({
                barColor: $this.data('barcolor'),
                trackColor: $this.data('trackcolor'),
                lineWidth: 4,
                size: 160,
                scaleColor: false,
                animate: 1000,
                onStep: function(from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                },
                delay: 3000
            });
        });
    });

    var shrinkHeader = 130;
    var $nav = $('nav.primary-nav');

    navbarSticky($nav);

    $(window).scroll(function() {
        navbarSticky($nav);
    });

    function navbarSticky($nav) {
        var scroll = getCurrentScroll();

        if ( scroll >= shrinkHeader )
            $nav.addClass('navbar-sticky');
        else 
            $nav.removeClass('navbar-sticky');
    }

    function getCurrentScroll() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }

    $('div.progress').appear();
    $('div.progress').on('appear', function () {
        var $this = $(this);        
        $this.find('.determinate').css('width', function () {
            return $this.data('percent');
        });
    });



    /* ==========================================================================
       Counter
    ========================================================================== */
    function initCounter() {

        $('span.counter').counterUp({
            delay: 15,
            time: 2000
        });
    }

    // Map
    var mapStyle = [ { "featureType": "landscape", "stylers": [ { "saturation": -100 }, { "lightness": 50 }, { "visibility": "on" } ] }, { "featureType": "poi", "stylers": [ { "saturation": -100 }, { "lightness": 40 }, { "visibility": "simplified" } ] }, { "featureType": "road.highway", "stylers": [ { "saturation": -100 }, { "visibility": "simplified" } ] }, { "featureType": "road.arterial", "stylers": [ { "saturation": -100 }, { "lightness": 20 }, { "visibility": "on" } ] }, { "featureType": "road.local", "stylers": [ { "saturation": -100 }, { "lightness": 30 }, { "visibility": "on" } ] }, { "featureType": "transit", "stylers": [ { "saturation": -100 }, { "visibility": "simplified" } ] }, { "featureType": "administrative.province", "stylers": [ { "visibility": "off" } ] }, { "featureType": "water", "elementType": "labels", "stylers": [ { "visibility": "on" }, { "lightness": -0 }, { "saturation": -0 } ] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "hue": "#00baff" }, { "lightness": -10 }, { "saturation": -95 } ] }];

    var $mapWrapper = $('#map'),
        lat = $mapWrapper.data('latitude');
        lng = $mapWrapper.data('longitude');

    if ( $mapWrapper.length > 0 ) {
        var map = new GMaps({
            div: '#map',
            lat : lat,
            lng : lng,
            scrollwheel: false,
            draggable: true,
            zoom: 14,
            disableDefaultUI: false,
            styles : mapStyle
        });

        map.addMarker({
            lat : lat,
            lng : lng,
            icon: 'images/marker-icon.png',
            infoWindow: {
                content: '<span>Nikole Tesle, Nikšić, Montenegro</span>'
            }
        });
    }

    // Wow init
    new WOW({
        offset: 200,
        mobile: false
    }).init();

    var sections = $('section.scroll-section'),
        className = 'current';
    
    if ( sections.length > 0 ) {

        var waypoints = sections.waypoint({
            handler: function(direction) {
                var activeLink,
                    activeSection = $(this.element),
                    activeSectionIndex = sections.index(this.element);
                    prevSectionIndex = ( activeSectionIndex - 1 );

                if (direction === "up") {
                    scrollDirection = "up";
                    activeSection = (prevSectionIndex < 0) ? activeSection : activeSection.prev();
                }
                
                scrollDirection = "down";

                if ( activeSection.attr('id') === 'home' ) {
                    $('a.menu-smooth-scroll').parent('li').removeClass(className);
                }
                
                activeLink = $('a.menu-smooth-scroll[href="#' + activeSection.attr('id') + '"]');
                activeLink.parent('li').addClass(className).siblings().removeClass(className);

            },
            offset: '35%'
        });
    }

    $('a.menu-smooth-scroll').scrollingTo({
        waypoints: waypoints,
        callbackBeforeTransition: function(e) {

            if (e.currentTarget.hash !== "") {
                if ( e.currentTarget.hash !== '#home' ) {
                    $(this).parent().addClass('current').siblings().removeClass('current');
                }
            }
        },
        callbackAfterTransition: function(e) {

            if (e.currentTarget.hash !== "") {
                
                if ( e.currentTarget.hash === '#home' ) {
                    window.location.hash = '';
                }

                window.location.hash = e.currentTarget.hash;
            }
        }
    });

    $('a.section-call-to-btn').scrollingTo();

    // Animate scrolling on hire me button
    $('a.hire-me-btn').scrollingTo();


    /* ==========================================================================
        When the window is resized, do
     ========================================================================== */
     var $timelineBar = $('div.timeline-bar');
     var $education = $('#education');
     var $expirience = $('#expirience');
     var $links = $('a.menu-smooth-scroll');

    timelineHeight($education);
    timelineHeight($expirience);
    
    $(window).resize(function() {
        timelineHeight($education);
        timelineHeight($expirience);
    });

    function checkSize () {
        if ( $('a.button-collapse').css('display') !== 'none' ) {
            $('a.menu-smooth-scroll').each(function() {
                $(this).addClass('waves-effect waves-light');
            });
        } else {
            $('a.menu-smooth-scroll').each(function() {
                $(this).removeClass('waves-effect waves-light');
            });
        }
    }

    function timelineHeight($elem) {
        var timelineInner = $elem.find('div.timeline-inner');
        var timelineBar = timelineInner.prev();
        var timelineInnerHeight = timelineInner.css('height', '').height();
        var lastBox = timelineInner.find('div.timeline-box').last();
        var lastBoxHeight = lastBox.outerHeight();

        if (timelineBar.css('top') !== '0px') {
            
            if ( typeof lastBox.css('top') === 'string' ) {
                timelineInner.height( timelineInnerHeight + parseInt(lastBox.css('top'), 10) );
            }

            timelineBar.height( timelineInner.height() - lastBoxHeight );

        } else {
            timelineInner.css('height', '');
            timelineBar.css('height', '');
        }

    }
        
})(jQuery, window, document);

(function () {

    if ( $('#certification-modal').length > 0 ) {

        var modal = $('#portfolioModal'),
            portImgArea = modal.find('.modal-img');

        $('#certification-modal').on('click', 'a.modal-trigger', function(e) {
            e.preventDefault();
            var $this = $(this),
            imgSrc = $this.data('image-source'),
            imgAlt = $this.data('image-alt'),
            demoLink = $this.data('demo-link');

            modal.openModal({
                dismissible: true,
                opacity: '.5',
                in_duration: 300,
                out_duration: 200,
                ready: function () {
                    if (imgSrc) {
                        portImgArea.html('<img src="'+imgSrc+'" alt=" '+ imgAlt +' ">');
                    }
                }
            });
        });
    }

})();

(function () {
    $('form.contact-form').on('submit', function (e) {
        var $this = $(this),
            submitBtn = $this.find('button.contact-submit'),
            loader = $this.find('div.form-loader-area'),
            name = $this.find('#name'),
            email = $this.find('#email'),
            message = $this.find('#message');

        e.preventDefault();
        loader.show();
        submitBtn.prop('disabled', true).addClass('disabled');

        function success(response) {
            sweetAlert("Thanks!", "Your message has been sent successfully!", "success");
            $this.find("input, textarea").val('');
        }

        function error(data) {
            $this.find('input.invalid, textarea.invalid')
                 .removeClass('invalid');

            if ( data.name ) {
                name.removeClass('valid')
                    .addClass('invalid');
            }

            if ( data.email ) {
                email.removeClass('valid')
                     .addClass('invalid');
            }

            if ( data.message ) {
                message.removeClass('valid')
                       .addClass('invalid');
            }
        }

        $.ajax({
            url: '/send',
            type: 'POST',
            data: $this.serialize(),
            dataType: 'json'
        })
        .done(function(response) {
            
            console.log(response);

            if (response.success) {
                success(response);
            } else {
                error(response.data);
            }

            loader.hide();
            submitBtn.prop('disabled', false)
                     .removeClass('disabled');
        })
        .fail(function(){
            sweetAlert("Oops...", "Something went wrong, Try again later!", "error");
            loader.hide();
            submitBtn.prop('disabled', false)
                     .removeClass('disabled');
        });
    });
})();