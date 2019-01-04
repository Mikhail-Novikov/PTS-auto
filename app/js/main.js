jQuery(document).ready(function($) {

    // Back to top button
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 1500, 'easeInOutExpo');
        return false;
    });

    // Stick the header at top on scroll
    $("#header").sticky({
        topSpacing: 0,
        zIndex: '50'
    });

    // слайдер на главной

    $('.js-promo-slider').slick({
        dots: true,
        infinite: true,
        fade: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: false,
        prevArrow: "<div class='slick-arrow slick-next icon-arrow-l'></div>",
        nextArrow: "<div class='slick-arrow slick-prev icon-arrow-r'></div>",
        appendArrows: $('.pts-btn-slider'),
        responsive: [{
                breakpoint: 1000,
                settings: {
                    slidesToShow: 1,
                    infinite: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    infinite: false
                }
            }
        ]
    });

    // Initiate the wowjs animation library
    new WOW().init();

    // Initiate superfish on nav menu
    $('.nav-menu').superfish({
        animation: {
            opacity: 'show'
        },
        speed: 400
    });

    // Mobile Navigation
    if ($('#nav-menu-container').length) {
        var $mobile_nav = $('#nav-menu-container').clone().prop({
            id: 'mobile-nav'
        });
        var $mobile_contacts = $('#h-contacts-container').clone().prop({
            id: 'mobile-contacts'
        });
        $mobile_nav.find('> ul').attr({
            'class': '',
            'id': ''
        });
        $('body').append($mobile_nav).append($mobile_contacts);
        $('body').prepend('<button type="button" id="mobile-nav-toggle"><div class="nav-icon"><span></span><span></span><span></span></div></button>');
        $('body').append('<div id="mobile-body-overly"></div>');
        $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

        $(document).on('click', '.menu-has-children i', function(e) {
            $(this).next().toggleClass('menu-item-active');
            $(this).nextAll('ul').eq(0).slideToggle();
            $(this).toggleClass("fa-chevron-up fa-chevron-down");
        });

        $(document).on('click', '#mobile-nav-toggle', function(e) {
            $('body').toggleClass('mobile-nav-active');
            $('.nav-icon').toggleClass('open');
            $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
            $('#mobile-body-overly').toggle();
        });

        $(document).click(function(e) {
            var container = $("#mobile-nav, #mobile-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('.nav-icon').removeClass('open');
                    $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
                    $('#mobile-body-overly').fadeOut();
                }
            }
        });
    } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
        $("#mobile-nav, #mobile-nav-toggle").hide();
    }

    // Smooth scroll for the menu and links with .scrollto classes
    $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            if (target.length) {
                var top_space = 0;

                if ($('#header').length) {
                    top_space = $('#header').outerHeight();

                    if (!$('#header').hasClass('header-fixed')) {
                        top_space = top_space - 20;
                    }
                }

                $('html, body').animate({
                    scrollTop: target.offset().top - top_space
                }, 1500, 'easeInOutExpo');

                if ($(this).parents('.nav-menu').length) {
                    $('.nav-menu .menu-active').removeClass('menu-active');
                    $(this).closest('li').addClass('menu-active');
                }

                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
                    $('#mobile-body-overly').fadeOut();
                }
                return false;
            }
        }
    });

    //tabs - курсы

    $("#tabs-nav a").click(function() {
        $("#tabs-nav a").removeClass("tabs-active");
        $(this).addClass("tabs-active");
        $(".tabs-panel").hide(0);
        var tab_id = $(this).attr("href");
        $(tab_id).fadeIn(0);
        return false;
    });

    var slickTable = false;

    function tableSlider() {
        if ($(window).width() < 701) {
            if (!slickTable) {
                $(".js-table-slider").slick({
                    arrows: false,
                    dots: true,
                    infinite: true,
                    speed: 300,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                });
                slickTable = true;
            }
        } else if ($(window).width() > 700) {
            if (slickTable) {
                $('.js-table-slider').slick('unslick');
                slickTable = false;
            }
        }
    };

    tableSlider();
    $(window).on('resize', function() {
        tableSlider();
    });

    var slickDevice = false;

    function deviceSlider() {
        if ($(window).width() < 701) {
            if (!slickDevice) {
                $(".js-device-slider").slick({
                    arrows: false,
                    dots: true,
                    adaptiveHeight: true,
                    infinite: true,
                    speed: 300,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                });
                slickDevice = true;
            }
        } else if ($(window).width() > 700) {
            if (slickDevice) {
                $('.js-device-slider').slick('unslick');
                slickDevice = false;
            }
        }
    };

    deviceSlider();
    $(window).on('resize', function() {
        deviceSlider();
    });
});