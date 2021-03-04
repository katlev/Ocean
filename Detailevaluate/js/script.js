$(function(){
	'use strict';
	//Slider
	var $owl = $('.owl');
	//Preloader
	$(window).load(function()
	{
		$('.preloader i').fadeOut();
		$('.preloader').delay(500).fadeOut('slow');
		$('body').delay(600).css({'overflow':'visible'});
	});
	//Magnific-popup
	$('.image-zoom').magnificPopup({
		type:'image',
		gallery: {
			enabled: true
		},
	});

	/*请求数据*/
	/*获取url中的参数*/
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)" )
		var r = window.location.search.substr(1).match(reg)
		if(r != null){
			return unescape(r[2])
		}
		return null
	}
	var goodsId = getUrlParam('goodsId')
	console.log('id:' + goodsId)

	/*商品详情*/

	$.ajax({
		type:'GET',
		url:'http://39.108.184.155:8080/searanch/page/goodsInfo/' + goodsId,
		dataType:'JSON',
		data:{
			goodsId:goodsId
		},
		xhrFields:{//实现跨域访问
			withCredentials:true
		},
		success:function (res) {
			console.log(res)
			if(res.code === 200){
				console.log(res.message)
				if(res.data.goodsId == goodsId){
					let  imgList = '<li>' +
						'<a class="thumbnail img-large image-zoom" href="'+res.data.pictures+'" title="iPhone">' +
						'<img src="'+res.data.pictures+'" alt="iPhone" style="width: 500px;height: 500px">' +
						'</a>' +
						'</li>' +
						'<li class="image-additional">' +
						'<a class="thumbnail image-zoom" href="'+res.data.pictures+'" title="iPhone">' +
						'<img src="'+res.data.pictures+'" title="iPhone" alt="iPhone">' +
						'</a>' +
						'</li>' +
						'<li class="image-additional">' +
						'<a class="thumbnail image-zoom" href="'+res.data.pictures+'" title="iPhone">' +
						'<img src="'+res.data.pictures+'" title="iPhone" alt="iPhone">' +
						'</a>' +
						'</li>' +
						'<li class="image-additional">' +
						'<a class="thumbnail image-zoom" href="'+res.data.pictures+'" title="iPhone">' +
						'<img src="'+res.data.pictures+'" title="iPhone" alt="iPhone">' +
						'</a>' +
						'</li>' +
						'<li class="image-additional">' +
						'<a class="thumbnail image-zoom" href="'+res.data.pictures+'" title="iPhone">' +
						'<img src="'+res.data.pictures+'" title="iPhone" alt="iPhone">' +
						'</a>' +
						'</li>' +
						'<li class="image-additional">' +
						'<a class="thumbnail image-zoom" href="'+res.data.pictures+'" title="iPhone">' +
						'<img src="'+res.data.pictures+'" title="iPhone" alt="iPhone">' +
						'</a>' +
						'</li>'
					$('#imgList').append(imgList)

					let goodsMsg = '<h1>'+res.data.goodsName+'</h1>' +
						'<ul class="list-unstyled">' +
						'<li><span>种类:</span><a href="#">'+res.data.type+'</a></li>' +
						'<li><span>产地:</span> '+res.data.province+'，'+res.data.city+'</li>' +
						'<li><span>来源:</span> '+res.data.country+'</li>' +
						'<li><span>加工方式:</span> '+res.data.processMode+'</li>' +
						'<li><span>牧场主:</span>'+res.data.merchant+'</li>' +
						'</ul>' +
						'<p class="product-price">￥'+res.data.price+' /份</p>'

					$('#goodsDetail').before(goodsMsg)

					/*商品详情*/
					$('#tab-description').text(res.data.desc)

					let stock = res.data.stock
					window.localStorage.setItem('stock',stock)

				}
			}
			else{
				alert(res.message)
			}
		},
		error:function (error) {
			console.log(error)
		}
	})

	/*获取评论*/
	/*var totalPages = 2*/ //总页数
	var currentPage = 1 //当前页数

	$('#goodsComment').ready(function () {
		getComments(1)
		setpageInfo()
	})

	function setpageInfo() {
		let totalPages = window.localStorage.getItem("pages");

		$('.Pagination').pagination({
			mode:'fixed',
			pageCount:totalPages, //总页数
			current:currentPage ,//当前页数
			showData:10,
			callback:function (pageNum) {
				getComments(parseInt(pageNum.getCurrent()))
			}
		})
	}

	function getComments(pageNum){
		$.ajax({
			type:'get',
			url:'http://39.108.184.155:8080/searanch/page/goodsEvaluate/' + goodsId + '?limit=10&page=' + pageNum,
			dataType:'JSON',
			data:{
				goodsId:goodsId
			},
			xhrFields:{//实现跨域访问
				withCredentials:true
			},
			success:function (res) {
				console.log(res)

				let pages = res.pageInfo.pages
				window.localStorage.setItem('pages',pages)

				$('#goodsComment').empty()
				for (var i = 0;i<res.data.length;i++){
					var commentList = '<li>' +
						'<div class="UserEvaluationHeader">' +
						'<img src="'+res.data[i].userImag +'" alt=""  class="img_responsive img-circle " style="width: 50px;height: 50px">' +
						'<div class="EvaluationRight">' +
						'<span>' + res.data[i].nickname + '</span>' +
						'</div>' +
						'<div class="EvaluationScore">' +
						'<span>评分：'+res.data[i].goodsAbout+'</span>' +
						'</div>' +
						'</div>' +
						'<div class="EvaluationContent">' + res.data[i].goodsEva + '</div>' +
						'<div class="EvaluationImag" style="border: none"><img src="'+res.data[i].image+'" alt="" style="width:80px;height:80px;border: none"></div>' +
						'</li>'
					$('#goodsComment').append(commentList)

					if (res.data[i].goodsEva == "" && res.data[i].image == null){
						$('.EvaluationContent').text('该用户还没有评价')
					}
				}
			},
			error:function (error) {
				console.log(error)
				console.log('请求失败')
			}
		})
	}

	/*商品推荐*/
	$.ajax({
		type:'get',
		url:'http://39.108.184.155:8080/searanch/page/bRecommend?' + goodsId,
		dataType:'json',
		data:{
			goodsId:goodsId
		},
		xhrFields:{//实现跨域访问
			withCredentials:true
		},
		success:function (res) {
			console.log(res)
			for(var i = 0;i<res.data.length;i++){
				var recommendList = '<div class="col-sm-6 col-md-4 col-lg-3">' +
					'<div class="product-item hover-img">' +
					'<a href="product_detail.html?goodsId='+res.data[i].goodsId+'" class="product-img">' +
					'<img src="'+res.data[i].picture+'" alt="image">' +
					'</a>' +
					'<div class="product-caption">' +
					'<h4 class="product-name"><a href="#">'+res.data[i].goodsName+'</a></h4>' +
					'<div class="product-price-group">' +
					'<span class="product-name" style="font-size: 12px">'+res.data[i].desc+'</span>' +
					'<span class="product-price">￥'+res.data[i].price+'</span>' +
					'</div>' +
					'</div>' +
					'<div class="absolute-caption">' +
					'<a href="#"><i class="fa fa-cart-plus"></i></a>' +
					'</div>' +
					'</div>' +
					'</div>'

				$('#todayRecommend').append(recommendList)

			}

		},
		error:function (error) {
			console.log(error)

		}
	})

	/*加入购物车*/
	addCart()
	function addCart() {
		$('#addCart').click(function () {
			var amount = $('#input-quantity').val()
			var stock = window.localStorage.getItem('stock')
			var cart_token = window.localStorage.getItem('lo_token')
			console.log(amount,stock)
			if(parseInt(amount) > parseInt(stock)){
				alert('抱歉你选购的数量超过库存，目前库存为' + stock + '件，请重新选择购买数量')
				return
			}else if (parseInt(amount) <= 0){
				alert('还未选择购买数量')
			}

			$.ajax({
				type:'post',
				url:'http://39.108.184.155:8080/searanch/shopCart/addShopCart',
				dataType:'json',
				headers:{'Authorization':cart_token},
				data:{
					amount:amount,
					goodsId:goodsId,
				},
				success:function (res) {
					console.log(res)
					if(res.code == 200){
						console.log(res.message)
						alert('加入购物车成功')
					}else{
						console.log(res.message)
						alert('加入购物车失败')
					}
				},
				error:function (error) {
					console.log(error)
					console.log('请求失败')
				}
			})
		})
	}
});
