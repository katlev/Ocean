
$(function () {
    userToken = window.localStorage.getItem('lo_token')

    /*请求数据*/
    shopList()
    function shopList(){
            $.ajax({
                type:'GET',
                url:'http://39.108.184.155:8080/searanch/page/recommendIndex?limit=10&page=1',
                dataType:'JSON',
                xhrFields:{//实现跨域访问
                    withCredentials:true
                },
                headers:{'Authorization':userToken},
                contentType:'application/x-www-form-urlencoded',
                success:function (newContent) {
                    $('#content').empty()
                    for (var i=0;i<newContent.data.length;i++){
                        var list = '<li class="left_kind goods col-xs-6 col-sm-4">' +
                            '<div class="li_box">' +
                            '<a href="../Detailevaluate/product_detail.html?goodsId='+newContent.data[i].goodsId+'" class="goods_a">' +
                            '<div class="goods_img">' +
                            '<img src="'+ newContent.data[i].picture +'" alt="" style="width: 156px;height: 156px" />' +
                            '</div>' +
                            '<p class="goods_pro">' +
                            '<span class="goodsName">' + newContent.data[i].goodsName + '</span>' +
                            '<span class="goods_price">￥' + newContent.data[i].price + '</span>' +
                            '</p>' +
                            '</a>' +
                            '<span class="goods_icon">' +
                            '<span id="comments'+newContent.data[i].goodsId+'" name="Color">' +
                            '<a href="" class="goods_comments" id="comments'+newContent.data[i].goodsId+'_items">' +
                            '<i class="fa fa-commenting"></i>' +
                            '<span aria-hidden="true">' + newContent.data[i].evaluateAmount + '</span>' +
                            '</a></span>' +
                            '<span id="'+newContent.data[i].goodsId+'" name="goodsLike'+newContent.data[i].goodsId+'">' +
                            '<i class="fa fa-heart heart'+newContent.data[i].goodsId+'"></i>' +
                            '<span id="'+newContent.data[i].goodsId+'_like" aria-hidden="true">' + newContent.data[i].likeAmount + '</span>' +
                            '</span></span>' +
                            '</div></li>'

                        $('#content').append(list)
                        localStorage.setItem('goodsId',newContent.data[i].goodsId)

                        let goodsId = newContent.data[i].goodsId
                        var isLike = newContent.data[i].isLike

                        if(isLike == true){
                            console.log(isLike)
                            $('.heart'+goodsId).css('color','#E64346')
                        }

                        $('#'+ goodsId)
                            .click(function () {
                                let goodsId = parseInt(this.id)
                                let token = localStorage.getItem('lo_token')
                                $.ajax({
                                    type:'post',
                                    url:'http://39.108.184.155:8080/searanch/page/like/' + goodsId,
                                    dataType:'json',
                                    headers:{'Authorization':token},
                                    data:{
                                        goodsId:goodsId
                                    },
                                    success:function (res) {
                                        console.log(res)
                                        if (res.code == 200){
                                            /* alert(res.message)*/
                                            window.location.reload()
                                        }
                                        else{
                                            alert(res.message)
                                        }
                                    },
                                    error:function (error) {
                                        console.log(error)
                                        console.log('请求错误')
                                    }
                                })
                            })
                    }

                    $('[name=Color]')
                        .mouseover(function () {
                            var id = this.id + "_items"
                            $('#' + id).css("color","#E64346")
                        })
                        .mouseout(function () {
                            var id = this.id + "_items"
                            $('#' + id).css('color','#343434')
                        })
                },
                error:function (error) {
                    alert(error)
                }
            })

        }

    userMsg()
    /*用户信息*/
    function userMsg() {

        console.log(userToken)
        $.ajax({
            type:'GET',
            url:'http://39.108.184.155:8080/searanch/user/userInfo',
            dataType:'JSON',
            headers:{'Authorization':userToken},
            xhrFields: {
                withCredentials: false
            },
           success:function (res) {
                console.log(res)
               $('#name').text(res.data.nickname)
               console.log(res.data.image)
               let nickImg = '<img src="'+ res.data.image + '" alt="portrait" class="img-responsive img-circle center-block" style="display:inline-block;width:35px;height:35px" >'
                $('#userMsg').prepend(nickImg)
           },
            error:function (error) {
                console.log(error)
            }
        })
    }

    search()
    /*搜索*/
    function search() {
        $('#icon,#mobileSearch').click(function () {
            var searchName = $('.searchKey').val()
            console.log(searchName)
            if (searchName.trim() === ''){
                alert('搜索内容不能为空！')
            }

            $.ajax({
                type:'get',
                url:'http://39.108.184.155:8080/searanch/page/search/'+searchName,
                dataType:'json',
                data:{
                    searchName:searchName
                },
                xhrFields:{//实现跨域访问
                    withCredentials:true
                },
                headers:{'Authorization':userToken},
                success:function (res) {
                    console.log(res)

                    $('#content li').hide()
                    for (var i = 0;i<res.data.length;i++){
                        var list = '<li class="left_kind goods col-xs-6 col-sm-4">' +
                            '<div class="li_box">' +
                            '<a href="../Detailevaluate/product_detail.html?goodsId='+res.data[i].goodsId +'" class="goods_a" >' +
                            '<div class="goods_img">' +
                            '<img src="'+ res.data[i].picture +'" alt="" style="width:156px;height:156px"/>' +
                            '</div>' +
                            '<p class="goods_pro">' +
                            '<span class="goodsName">' + res.data[i].goodsName + '</span>' +
                            '<span class="goods_price">￥' + res.data[i].price + '</span>' +
                            '</p>' +
                            '</a>' +
                            '<span class="goods_icon">' +
                            '<span id="search'+res.data[i].goodsId +'" name="ColorSearch">' +
                            '<a href="" class="goods_comments" id="search'+res.data[i].goodsId+'_items">' +
                            '<i class="fa fa-commenting" aria-hidden="true"> ' + res.data[i].evaluateAmount + ' </i>' +
                            '</a></span>' +
                            '<span id="'+res.data[i].goodsId+'" name="goodsLikeSearch">' +
                            '<span class="fa fa-heart heartSearch'+res.data[i].goodsId+'" id="'+res.data[i].goodsId+'_like" aria-hidden="true"> ' + res.data[i].likeAmount + ' </span>' +
                            '</span></span>' +
                            '</div></li>'

                        $('#content').append(list)

                        searchName = ' '

                        let goodsIdSearch = res.data[i].goodsId
                        let isLikeSearch = res.data[i].isLike

                        if(isLikeSearch == true){
                            $('.heartSearch' + goodsIdSearch).css('color','#E64346')
                        }

                    }

                    $('[name=ColorSearch]')
                        .mouseover(function () {
                            var id = this.id + "_items"
                            $('#' + id).css("color","#E64346")
                        })
                        .mouseout(function () {
                            var id = this.id + "_items"
                            $('#' + id).css('color','#343434')
                        })

                    $('[name=goodsLikeSearch]')
                        .click(function () {
                            let goodsId = parseInt(this.id)
                            let token = localStorage.getItem('lo_token')
                            $.ajax({
                                type:'post',
                                url:'http://39.108.184.155:8080/searanch/page/like/' + goodsId,
                                dataType:'json',
                                headers:{'Authorization':token},
                                data:{
                                    goodsId:goodsId
                                },
                                success:function (res) {
                                    console.log(res)
                                    if (res.code == 200){
                                        window.location.reload()

                                    }
                                    else{
                                        alert(res.message)
                                    }
                                },
                                error:function (error) {
                                    console.log(error)
                                    console.log('请求错误')
                                }
                            })
                        })

                },
                error:function (error) {
                    console.log(error)
                }
            })
        })
    }

    /*客服*/
    ServiceDialogue()
    function ServiceDialogue() {

        var dialogueInput = document.getElementById('dialogue_input')
        var dialogueContain = document.getElementById('dialogue_contain')

        var websocket = null
        /*发送给管理员*/
        var toAdmin = null

        $('#advisory').click(function () {
            $('.dialogue-main')
                .css({'display': 'inline-block'})
                .animate({'height':'500px'})
            console.log('进入客服')
        })

        $('#btn_close').click(function () {
            $('.dialogue-main').animate({'height':'0'},function () {
                $('.dialogue-main').css({'display':'none'})
            })
            console.log('关闭客服')
        })

        if (toAdmin == null){ //判断一下获得要沟通的管理员没有
            /*
            * 需要获取的在线管理员，因为发送必须指定用户
            * */
            $.ajax({
                async:false,
                type:'get',
                url:'http://39.108.184.155:8080/searanch/onlineAdmin',
                dataType:'json',
                success:function (res) {
                    /*得到所有在线客服*/
                    console.log(res.data[0])
                    if(res.data !== null){
                        toAdmin = res.data[0]
                        $('#serviceMsg').text('客服' + toAdmin)
                        /*函数*/
                        connection()
                    }
                },
                error:function (error) {
                    console.log(error)
                }
            })
        }else{
            /*连接函数*/
            connection()
        }

        function connection() {

            /*自己的id,登陆时已经返回，*/

            var userId = window.localStorage.getItem('userId')
            console.log('userId',userId)

            /*核心代码*/

            if('WebSocket' in window){ //首先判断当前浏览器支不支持websocket
                websocket = new WebSocket('ws://39.108.184.155:8080/searanch/websocket/' + userId)
            }else {
                alert('抱歉，您的浏览器肯能不支持webSocket')
            }
            websocket.onopen = function () {//建立链接
                $('#dialogue-toast').text('建立链接')
            }
            websocket.onmessage = function (event) {//接收消息
                var data = event.data
                console.log('data',data)

                /*将消息显示在对话框*/
                var nodeP = document.createElement('p')
                var nodeSpan = document.createElement('span')
                nodeP.classList.add('dialogue-service-contain')
                nodeSpan.classList.add('dialogue-text', 'dialogue-service-text')
                nodeSpan.innerHTML = data.split(":")[1]
                nodeP.appendChild(nodeSpan)
                dialogueContain.appendChild(nodeP)
                dialogueContain.scrollTop = dialogueContain.scrollHeight
            }
            websocket.onerror = function () {//链接出现错误
                $('#dialogue-toast').text('链接出现异常')
            }

            websocket.close = function () {//链接关闭
                $('#dialogue-toast').text('链接已关闭')

            }
            window.onbeforeunload = function () { //当浏览器的页面窗口关闭的时候，防止服务器出现异常
                if (websocket != null){
                    websocket.close()
                }
            }
        }

        $('#sendMsg').click(function () {
            /*获取到发送的内容*/
            var toMessage = dialogueInput.value
            if(websocket != null){
                var message = '{"toUser":"' + toAdmin + '","toMessage":"' + toMessage + '"}';
                websocket.send(message)

                /*将内容显示在对话框*/
                var nodeP = document.createElement('p')
                nodeSpan = document.createElement('span')
                nodeP.classList.add('dialogue-customer-contain')
                nodeSpan.classList.add('dialogue-text','dialogue-customer-text')
                nodeSpan.innerHTML = toMessage
                nodeP.appendChild(nodeSpan)
                dialogueContain.appendChild(nodeP)
                dialogueContain.scrollTop = dialogueContain.scrollHeight
                dialogueInput.value = ' '
            }
        })

        // 渐隐
        function fadeOut(obj) {
            var n = 100;
            var time = setInterval(function() {
                if (n > 0) {
                    n -= 10;
                    obj.style.opacity = '0.' + n;
                } else if (n <= 30) {
                    obj.style.opacity = '0';
                    clearInterval(time);
                }
            }, 10);
            return true;
        }

        // 渐显
        function fadeIn(obj) {
            var n = 30;
            var time = setInterval(function() {
                if (n < 90) {
                    n += 10;
                    obj.style.opacity = '0.' + n;
                } else if (n >= 80) {

                    obj.style.opacity = '1';
                    clearInterval(time);
                }
            }, 100);
            return true;
        }
    }

    /*分类点击搜索*/
    $('.searchItems li').click(function () {
            var text = $(this).text()
            console.log(text)
            $.ajax({
                type:'get',
                url:'http://39.108.184.155:8080/searanch/page/search/'+text,
                dataType:'json',
                data:{
                    searchName:text
                },
                xhrFields:{//实现跨域访问
                    withCredentials:true
                },
                headers:{'Authorization':userToken},
                success:function (res) {
                    console.log(res)

                    $('#content li').hide()
                    for (var i = 0;i<res.data.length;i++){
                        var list = '<li class="left_kind goods col-xs-6 col-sm-4">' +
                            '<div class="li_box">' +
                            '<a href="../Detailevaluate/product_detail.html?goodsId='+res.data[i].goodsId +'" class="goods_a" >' +
                            '<div class="goods_img">' +
                            '<img src="'+ res.data[i].picture +'" alt="" style="width:156px;height:156px"/>' +
                            '</div>' +
                            '<p class="goods_pro">' +
                            '<span class="goodsName">' + res.data[i].goodsName + '</span>' +
                            '<span class="goods_price">￥' + res.data[i].price + '</span>' +
                            '</p>' +
                            '</a>' +
                            '<span class="goods_icon">' +
                            '<span id="click'+res.data[i].goodsId +'" name="ColorClick">' +
                            '<a href="" class="goods_comments" id="click'+res.data[i].goodsId+'_items">' +
                            '<i class="fa fa-commenting" aria-hidden="true"> ' + res.data[i].evaluateAmount + ' </i>' +
                            '</a></span>' +
                            '<span id="'+res.data[i].goodsId+'" class="click'+res.data[i].orderId+'" name="goodsLikeClick">' +
                            '<i class="fa fa-heart heart'+res.data[i].goodsId+'"></i>' +
                            '<span id="'+res.data[i].goodsId+'_like" aria-hidden="true">' + res.data[i].likeAmount + '</span>' +
                            '</span></span>' +
                            '</div></li>'

                        $('#content').append(list)

                        searchName = ' '

                        let goodsIdClikc = res.data[i].goodsId
                        let isLikeClick = res.data[i].isLike

                        if(isLikeClick == true){
                            $('.heart'+goodsIdClikc).css('color','#E64346')
                        }

                        /* $('.heart' + goodsIdClikc).click(function () {
                             $('.heart'+goodsIdClikc).css('color','#E64346')
                         })*/
                    }

                    $('[name=ColorClick]')
                        .mouseover(function () {
                            var id = this.id + "_items"
                            $('#'+id).css("color","#E64346")
                        })
                        .mouseout(function () {
                            var id = this.id + "_items"
                            $('#'+id).css('color','#343434')
                        })

                    $('[name=goodsLikeClick]')
                        .click(function () {
                            let goodsId = parseInt(this.id)
                            let token = localStorage.getItem('lo_token')
                            $.ajax({
                                type:'post',
                                url:'http://39.108.184.155:8080/searanch/page/like/' + goodsId,
                                dataType:'json',
                                headers:{'Authorization':token},
                                data:{
                                    goodsId:goodsId
                                },
                                success:function (res) {
                                    console.log(res)
                                    if (res.code == 200){

                                        window.location.reload()

                                    }
                                    else{
                                        alert(res.message)
                                    }
                                },
                                error:function (error) {
                                    console.log(error)
                                    console.log('请求错误')
                                }
                            })

                        })
                },
                error:function (error) {
                    console.log(error)
                }
            })
        })
})






