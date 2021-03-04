/*Shops style*/

$(function () {

    Mer_token = window.localStorage.getItem('Mer_token')

    ShopsIconStyle()
    ImgUpload()
    MerchantMsg()
    applyWareHouse()
    MerchantLeave()

    $('#date_1').datepicker()
    $('#date_2').datepicker()
    $('#billInput').datepicker()

    //鼠标移上元素改变样式:商铺
    function ShopsIconStyle() {
        $('[name=ShopsMouseColor]')
            .mouseover(function () {
                var id = this.id + '_items'
                $('#' + id)
                    .css('backgroundColor', '#E64346')
                    .css('color', '#ffffff')
            })
            .mouseleave(function () {
                var id = this.id + '_items'
                $('#' + id)
                    .css('backgroundColor', '#ffffff')
                    .css("color", "#333333")
            })

        /*库存查询重置方法*/
        $('#searchBtn').click(function () {
            methods.StockSearch()

        })
        $('#resetBtn').click(function () {
            $('#nameSearch').val(' ')
            methods.StockReset()
        })

        /*账单查询重置*/
        $('#billSearchBtn').click(function () {
            methods.BillSearch()
            console.log('查询')
        })
        $('#billResetBtn').click(function () {
            $('#billInput').val(' ')
            methods.BillReset()
            console.log("重置")
        })
    }

    /*库存账单查询方法*/
    var methods = {
        StockSearch:function(the_index){
            var a = $('#showBody tr')
            var nameVal = $('#nameSearch').val().trim()
            var nameStr = '',nameArr = []

            if(nameVal === ' '){
                alert("搜索内容不能为空")
                return
            }

            for(var i=0;i<a.length;i++){
                var text = $('td:first',a.eq(i)).html().trim()
                nameArr.push(text)
            }
            console.log('nameArr',nameArr)
            a.hide()
            for(var i=0;i<nameArr.length;i++){
                if(nameArr[i].indexOf(nameVal)>-1){
                    a.eq(i).show()
                }
            }
            console.log('a',a)
        },

        StockReset: function () {
            $('#showBody tr').show();
        },

        BillSearch: function () {
            var billList = $('#showBillTable tr')
            var DateVal = $('#billInput').val().trim()
            var DateArr = []

            if (DateVal === ' ') {
                alert("输入不能为空")
                return
            }

            for (var j = 0; j < billList.length; j++) {
                var txt = $('td:first', billList.eq(j)).html().trim()
                DateArr.push(txt)
            }
            console.log('DateArr:',DateArr)

            billList.hide()
            for (var j = 0; j <DateArr.length; j++) {
                if (DateArr[j].indexOf(DateVal)>-1) {
                   billList.eq(j).show()
                }
            }
            console.log('billList',billList)
        },
        BillReset: function () {
            $('#showBillTable tr').show()
        }
    }

    /*商品图像上传*/
    function ImgUpload() {
        var input = document.getElementById("file_input")
        var result
        var div
        if (typeof FileReader === 'undefined') {
            result.innerHTML = "抱歉，你的浏览器不支持FileReader"
            input.setAttribute("disabled", "disabled")
        } else {
            input.addEventListener('change', readFile, false)
        }

        function readFile() {
            for (var i = 0; i < this.files.length; i++) {
                if (!input['value'].match(/.jpg|.gif|.png|.bmp/i)) {
                    alert("上传的图片格式不正确，请重新选择")
                    console.log('cccc')
                    return
                }
                var reader = new FileReader()
                reader.readAsDataURL(this.files[i])
                var formData = new FormData()
                formData.append('image',this.files[i])
                $('.Add').css('display', 'none')
                reader.onload = function () {
                    result = '<img src=" ' + this.result + '" alt="" id="shopsImg"/>'
                    console.log(this.result,'ttt')
                    div = document.createElement('div')
                    div.className = 'AddPhoto'
                    div.innerHTML = result
                    document.querySelector('.ShopsFormPhotoAdd').appendChild(div)

                    $.ajax({
                        type:'post',
                        url:'http://39.108.184.155:8080/searanch/upload/uploadImag',
                        headers:{'Authorization':Mer_token},
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
                                alert('图片上传成功')
                                console.log(res.data)
                                let goodsImg = res.data
                                window.localStorage.setItem('image',goodsImg)
                            }else{
                                console.log(res.message)
                                alert('图片上传失败')
                            }
                        },
                        error:function (error) {
                            console.log(error)
                            console.log('上传错误')
                        }
                    })

                }
            }
        }

        var Addphoto = document.querySelector('.ShopsFormPhoto .ShopsFormPhotoAdd')
        Addphoto.onclick = function () {
            $("#file_input").trigger("click")
        }
    }

    /*商家信息*/
    function MerchantMsg() {
        $.ajax({
            type:'GET',
            url:'http://39.108.184.155:8080/searanch/user/userInfo',
            dataType:'JSON',
            headers:{'Authorization':Mer_token},
            xhrFields: {
                withCredentials: false
            },
            success:function (result) {
                /*console.log(result)*/
                $('#name').text(result.data.nickname)
                $('#MerchantName').text(result.data.nickname)

                let MerImgLitle = '<img src ="'+result.data.image+'" alt = "portrait" class="img-responsive img-circle center-block" style="display:inline-block;width:35px;height:35px">'
                $('#MerchantMsg').prepend(MerImgLitle)

                let MerImgBig = '<img src="' + result.data.image + '" alt="" class="img-circle" style="float:right;width:100px;height:100px">'
                $('#MerchantImgBig').append(MerImgBig)
            },
            error:function (error) {
                console.log(error)
            }

        })
    }

    /*账单列表*/
    var totalPages = 2 //总页数
    var currentPage = 1 // 当前页数

    $('#showBillTable').ready(function () {
        Bill(1)
        setpageInfo()
    })
    function setpageInfo() {
        $('.Pagination').pagination({
            mode:'fixed',
            pageCount:totalPages, //总页数
            current:currentPage ,//当前页数
            showData:10,
            callback:function (pageNum) {
                Bill(parseInt(pageNum.getCurrent()))
            }
        })
    }
    function Bill(pageNum) {
        $.ajax({
            type:'GET',
            url:'http://39.108.184.155:8080/searanch/merchant/bill?limit=10&page=' + pageNum  ,
            dataType:'json',
            headers:{'Authorization':Mer_token},
            xhrFields: {
                withCredentials: true
            },
            success:function (res) {
                console.log(res)
                $('#showBillTable').empty()
                for(var i=0;i<=res.data.length;i++){
                    var list = '<tr>' +
                        '<td>' + res.data[i].applyTime + '</td>' +
                        '<td>' + res.data[i].goodsName + '</td>' +
                        '<td>' + res.data[i].goodsType + '</td>' +
                        '<td>￥' + res.data[i].price + '</td>' +
                        '<td>' + res.data[i].amount + '</td>' +
                        '<td>' + res.data[i].income + '</td>' +
                        '</tr>'
                    $('#showBillTable').append(list)
                }
            },
            error:function (error) {
                console.log(error)
            }
        })
    }

    /*申请入库*/
    function applyWareHouse() {
        $('#btnApply').click(function () {
            var picture = window.localStorage.getItem('image')
            var country = $('#s1 option:selected').text()
            var province = $('#id_provSelect option:selected').text()
            var city = $('#id_citySelect option:selected').text()
            var goodsName = $('#goodsName').val()
            var goodsType = $('#goodsType option:selected').text()
            console.log(goodsType)
            var amount = $('#goodsAmount').val()
            var breedTime = $('#date_1').val()
            var planUpTime = $('#date_2').val()
            var region = $('#writeAddress').val()
            console.log(country + province + city)

            if(picture === '' ||
                country.trim() === '' ||
                province.trim() === '' ||
                city.trim() === ''||
                goodsName.trim() ===''||
                goodsType.trim() === '' ||
                amount.trim() === '' ||
                breedTime.trim() === '' ||
                planUpTime.trim() === '' ||
                region.trim() === ''){

                alert('你还有信息未填写')
                return false
            }
            $.ajax({
                type:'post',
                url:'http://39.108.184.155:8080/searanch/merchant/applyInStorage',
                dataType:'json',
                headers:{'Authorization':Mer_token},
                contentType:'application/json;charset=UTF-8',
                data:JSON.stringify({
                    picture:picture,
                    country:country,
                    province:province,
                    city:city,
                    goodsName:goodsName,
                    goodsType:goodsType,
                    amount:amount,
                    breedTime:breedTime,
                    planUpTime:planUpTime,
                    region:region
                }),
                success:function (res) {
                    console.log(res)
                    if(res.code === 200){
                        console.log(res.message)
                        alert('入库成功')
                    }else{
                        console.log(res.message)
                        alert('入库失败')
                    }
                },
                error:function (error) {
                    console.log(error)
                    console.log('请求错误')
                }
            })
        })
    }

    /*商户退出*/
    function MerchantLeave() {
        $('#MerchantLeave').click(function () {
            $.ajax({
                type:'get',
                url:'http://39.108.184.155:8080/searanch/logout',
                headers:{'Authorization': Mer_token},
                success:function (res) {
                    console.log(res)
                    console.log('eee')
                    if(res.code === 200){
                        console.log(res.message)
                        localStorage.removeItem("phoneNumber")
                        load_data()
                        location.href='../Home/home.html'
                    }else{
                        console.log(res.message)
                    }
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
                        $('#serviceMsg').text('管理员' + toAdmin)
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
});






