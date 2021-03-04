(function ($) {
    "use strict";

    jQuery(document).ready(function ($) {

        // Mini Cart Hide Show JS
        $('.btn-minicart').on('click', function () {
            $('.minicart-content').stop().slideToggle(300);
        });

        // Categories Item Show Hide
        $(".btn-category").on('click', function () {
            $(".category-list-menu").stop().slideToggle();
        });

        $(".category-item-parent.hidden").hide();
        $(".category-item.btn-more").on('click', function (e) {
            e.preventDefault();
            $(".category-item-parent.hidden").toggle(500);
            var htmlAfter = "Close Categories";
            var htmlBefore = "More Categories";

            $(this).html($(this).text() == htmlAfter ? htmlBefore : htmlAfter);
            $(this).toggleClass("minus");
        });

        // Product Thumbnail Carousel JS
        $('.product-thumb-carousel').owlCarousel({
            loop: true,
            items: 1,
            dots: false,
            smartSpeed: 500,
            nav: true,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            thumbs: true,
            thumbImage: true,
            thumbContainerClass: 'owl-thumbs',
            thumbItemClass: 'owl-thumb-item'
        });


        $('.category-list-menu').slicknav({
            label: 'Categories',
            prependTo: '.categories-list-wrap',
            closedSymbol: '+',
            openedSymbol: '-',
            init: function () {
                $('.slicknav_nav').find('ul').removeClass('dropdown-nav');
                $('.slicknav_nav').find('li').removeClass('dropdown-show');
                $('.slicknav_nav').find('a').removeClass('arrow-toggle');
            }
        });

        /// Nice Select JS
        $('select').niceSelect();

        // Product View Style JS
        var view_style_wrap = $('.shop-page-products-wrap > .products-wrapper');

        $('.product-view li.box-gird').on('click', function () {
            view_style_wrap.removeClass('products-list-view');
        });

        $('.product-view li.list').on('click', function () {
            view_style_wrap.addClass('products-list-view');
        });

        $('.product-view li').on('click', function () {
            $('.product-view li').removeClass('current');
            $(this).addClass('current');
        });


        //Email Ajax Submission
        $('#subscribe-form').submit(function () {
            var action = $(this).attr('action'),
                result = $('#subscribeResult');

            $.ajax({
                url: action,
                type: 'POST',
                data: {
                    email: $('#address').attr('value')
                },
                success: function (data) {
                    result.html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>");
                    result.append(data);
                    result.removeClass('alert alert-danger');
                    result.addClass('alert alert-success');
                    //clear all fields
                    $('#subscribe-form').trigger("reset");
                },
                error: function () {
                    result.html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>");
                    result.append('Sorry, an error occurred.');
                    result.removeClass('alert alert-success');
                    result.addClass('alert alert-danger');
                    //clear all fields
                    $('#subscribe-form').trigger("reset");
                }
            });
            return false;
        });

        // All Window Scroll Function
        $(window).scroll(function () {
            //Scroll top Hide Show
            if ($(window).scrollTop() >= 400) {
                $('.scrolltotop').addClass('show');
            } else {
                $('.scrolltotop').removeClass('show');
            }

            //Header Fix JS
            if ($('#fixheader').length > 0) {
                headerfix();
            }

        });

    }); //Ready Function End

    jQuery(window).on('load', function () {

    }); //window load End

    /*confirm receipt*/

}(jQuery));

$(function () {

    /*订单列表*/
   /* var totalPages = 2 */ // 总页数
    var currentPage = 1 // 当前页数

    $('#orderList').ready(function () {
        list(1)
        setpageInfo()
    })
    function setpageInfo() {
        let totalPages = window.localStorage.getItem('pages');
        $('.Pagination').pagination({
            mode:'fixed',
            pageCount:totalPages, //总页数
            current:currentPage ,//当前页数
            showData:10,
            callback:function (pageNum) {
                list(parseInt(pageNum.getCurrent()))
            }
        })
    }
    function list(page) {
        var orderToken = window.localStorage.getItem('lo_token')
        $.ajax({
            type:'get',
            url:'http://39.108.184.155:8080/searanch/order/orderList?limit=10&page=' + page,
            dataType:'json',
            headers:{'Authorization':orderToken},
            success:function (res) {
                console.log(res)
                let pages = res.pageInfo.pages
                console.log(pages)
                window.localStorage.setItem('pages',pages)
                localStorage.setItem('data',JSON.stringify(res.data))
                $('#orderList').empty()
                for (var i=0;i<res.data.length;i++){
                    var lists = '<div class="col-lg-4 col-sm-6">' +
                        '<div class="single-product-item">' +
                        ' <figure class="product-thumb">' +
                        '<a href="javascript:"><img src="'+ res.data[i].picture +'" alt="Product" style="width: 250px;height: 240px"></a>' +
                        '<a href="#" class="btn btn-round btn-cart" title="Quick View" data-toggle="modal" data-target="#quickView">' +
                        '<i class="fa fa-eye"></i></a>' +
                        '</figure>' +
                        '<div class="product-details">' +
                        '<p>订单：'+res.data[i].orderNumber+'</p>' +
                        '<h2 class="product-title" style="display: inline"><a href="single-product.html">'+res.data[i].goodsName+'</a></h2>' +

                        '<div class="rating tap'+res.data[i].orderId+'">' +
                        '<i class="fa fa-star"></i>' +
                        '<i class="fa fa-star"></i>' +
                        '<i class="fa fa-star"></i>' +
                        '<i class="fa fa-star"></i>' +
                        '<i class="fa fa-star"></i>' +
                        '</div>' +
                        '<span class="product-price">￥'+res.data[i].price+'</span>' +
                        '<p class="pro-desc'+res.data[i].orderId+'">'+res.data[i].desc+'</p>' +

                        /*确认收货*/
                        '<div class="modal fade" id="dialogReceipt_'+res.data[i].orderId+'" tabindex="-1" role="dialog" aria-labelledby="dialogReceiptLabel_'+res.data[i].orderId+'">' +
                        '<div class="modal-dialog" role="document">' +
                        '<div class="modal-content">' +
                        '<div class="modal-header">' +
                        '<h4 class="modal-title" id="dialogReceiptLabel_'+res.data[i].orderId+'">确认收货</h4>' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                        ' </div>' +
                        '<div class="modal-body">' +
                        '<h3>确认已收货成功</h3>' +
                        ' </div>' +
                        '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-default" data-dismiss="modal" name="confirm" id="confirm'+res.data[i].orderId+'">确认</button>' +   /*data-toggle="modal" data-target="#dialogContent_'+res.data[i].orderNumber+'"*/
                        '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>' +
                        '</div></div></div></div>' +

                        /*写评价*/
                        ' <div class="modal fade write'+res.data[i].orderId+'" id="dialogWriteText_'+res.data[i].orderId+'" tabindex="-1" role="dialog" aria-labelledby="dialogWriteTextLabel_'+res.data[i].orderId+'">' +
                        '<div class="modal-dialog" role="document">' +
                        '<div class="modal-content">' +
                        '<div class="modal-header">' +
                        '<h4 class="modal-title" id="dialogWriteTextLabel_'+res.data[i].orderId+'">评价</h4>' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                        '</div>' +
                        '<div class="modal-body">' +
                        /*评分*/
                        '<div id="starRating" style="margin-bottom: 10px">' +
                        '<span class="photo">' +
                        '<span><i class="high"></i><i class="nohigh"></i></span>' +
                        '<span><i class="high"></i><i class="nohigh"></i></span>' +
                        '<span><i class="high"></i><i class="nohigh"></i></span>' +
                        '<span><i class="high"></i><i class="nohigh"></i></span>' +
                        '<span><i class="high"></i><i class="nohigh"></i></span>' +
                        '</span>' +
                        '<span class="starNum">0.0分</span>' +
                        '</div>' +
                        '<textarea name="" placeholder="从多个角度评价商品，可以帮助更多想买的人" style="width: 100%" id="writeCommend'+res.data[i].orderId+'"></textarea>' +
                        // 图片预览部分
                        '<p>' +
                        '<div class="upload imgLog2">' +
                        '<span><i class="glyphicon glyphicon-open"></i>图片描述</span>	  </div>' +
                        '</p>' +
                        // 图片预览结束
                        '</div>' +
                        '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-default" data-dismiss="modal" id="releaseText'+res.data[i].orderId+'">发布</button>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +

                        '</div>' +
                        '</div>' +
                        '</div>'

                    $('#orderList').prepend(lists);

                    /* finisted=true，表示已收货，显示评价按钮 */
                    if (res.data[i].finished == true){
                        var btn1 = '<button class="btn btn-primary toWriteContent'+res.data[i].orderId+'" style="display: inline;" type="button" data-toggle="modal" data-target="#dialogWriteText_'+res.data[i].orderId+'">去评价 </button>'
                        $('.write' + res.data[i].orderId).before(btn1)

                        var state1 = '<p style="color:#E64346;float:right;" class="state">交易成功</p>'
                        $('.tap' + res.data[i].orderId).before(state1)

                        /*评论*/
                        let orderEva = parseInt(res.data[i].orderId)
                        $('#releaseText'+ orderEva).click(function () {
                            console.log(orderEva)
                            var goodsAbout = parseInt(starRating)
                            /*console.log(goodsAbout)*/
                            var goodsEva = $('#writeCommend'+orderEva).val()
                            /*console.log(goodsEva)*/
                            var image = window.localStorage.getItem('commImg')
                            console.log(image)
                            $.ajax({
                                type:'post',
                                url:'http://39.108.184.155:8080/searanch/order/evaluate',
                                headers:{'Authorization':orderToken},
                                dataType:'json',
                                data:{
                                    goodsAbout:goodsAbout,
                                    goodsEva:goodsEva,
                                    orderId:orderEva,
                                    image:image
                                },
                                success:function (res) {
                                    if (res.code == 200){
                                        console.log(res.message)
                                        console.log('评论成功')
                                        alert('评论成功')
                                        $('.toWriteContent' + orderEva).attr('disabled','disabled')
                                        /*window.location.reload()*/
                                    }else{
                                        console.log(res)
                                        alert(res.message)
                                    }
                                },
                                error:function (error) {
                                    console.log(error)
                                }
                            })
                        })

                        //评分
                        var starRating = 0;
                        $('.photo span').on('mouseenter',function () {
                            var index = $(this).index()+1;
                            $(this).prevAll().find('.high').css('z-index',1)
                            $(this).find('.high').css('z-index',1)
                            $(this).nextAll().find('.high').css('z-index',0)
                            $('.starNum').html((index).toFixed(1)+'分')
                        })
                        $('.photo span').on('click',function () {
                            var index = $(this).index()+1;
                            $(this).prevAll().find('.high').css('z-index',1)
                            $(this).find('.high').css('z-index',1)
                            starRating = index;
                            $('.starNum').html(starRating.toFixed(1)+'分');
                            /*alert('评分：'+(starRating.toFixed(1)+'分'))*/
                        })

                        var img2 = new ImgUpload('.imgLog2',100,100,100);
                        $('.imgLog2 input').change(function (e) {
                            //模拟后台返回url
                            var url = window.URL.createObjectURL(e.target.files[0]);
                            var formData = new FormData()
                            formData.append('image',e.target.files[0])
                            $(this).parent().css('background','url('+url+')0% 0% / cover')
                            img2.setSpan(this)

                              $.ajax({
                                type:'post',
                                url:'http://39.108.184.155:8080/searanch/upload/uploadImag',
                                headers:{'Authorization':orderToken},
                                xhrFields:{//实现跨域访问
                                    withCredentials:false
                                },
                                processData:false,
                                contentType:false,
                                data: formData,
                                success:function (res) {
                                    console.log(res)
                                    if(res.code === 200){
                                        console.log(res.message)
                                        console.log(res.data)
                                        let IdCardUrl = res.data
                                        window.localStorage.setItem('commImg',IdCardUrl)
                                    }else{
                                        console.log(res.message)
                                        alert('上传失败')
                                    }
                                },
                                error:function (error) {
                                    console.log(error)
                                    console.log('上传错误')
                                }
                            })
                        })

                        /* finished = false ,表示未收货到货，显示确认收获按钮 */
                    }else if(res.data[i].finished == false){

                        var btn2 = '<button class="btn btn-primary dialogReceipt' + res.data[i].orderNumber + '"style="display: inline;" type="button;" data-toggle="modal" data-target="#dialogReceipt_'+res.data[i].orderId+'">确认收货</button>'
                        $('.pro-desc'+ res.data[i].orderId).after(btn2)
                        var state2 = '<p style="color:#E64346;float:right;" class="state'+res.data[i].orderNumber+'">买家已付款</p>'
                        $('.tap' + res.data[i].orderId).before(state2)
                        /*确认收货*/
                        let order = res.data[i].orderId
                        $('#confirm' + order).click(function () {
                            console.log(order)
                            $.ajax({
                                type:'put',
                                url:'http://39.108.184.155:8080/searanch/order/sureFinish/'+ order,
                                dataType:'json',
                                data:{
                                    orderId:order
                                },
                                headers:{'Authorization':orderToken},
                                success:function (res) {
                                    console.log(res)
                                    if(res.code == 200){
                                        console.log(res.message)
                                        console.log('确认成功')
                                        window.location.reload()
                                    }
                                },
                                error:function (error) {
                                    console.log(error)
                                    console.log('请求错误')
                                }
                            })
                        })
                    }
                }
            },
            error:function (error) {
                console.log(error)
            }
        });
    }

})






