$(function () {

    var userToken = window.localStorage.getItem('lo_token')

    ModifyMsg()
    settlementList()
    placeOrder()

    /*收货地址编辑*/
    function ModifyMsg() {
        $('#settleEdit').click(function () {
            var recipientName = $('#recipient-name').val().trim()
            var recipientPhone = $('#recipient-phone').val().trim()
            var recipientAddress = $('#recipient-adress').val().trim()
            var country = $('#s1').find("option:selected").text()
            var chinaProvince = $('#id_provSelect').find("option:selected").text()
            var chinaCity = $('#id_citySelect').find("option:selected").text()

            console.log(country+chinaProvince+chinaCity+recipientAddress)

            if(recipientName !== '' || recipientPhone !== '' || recipientAddress!=='' || country !== '' || chinaProvince !== '' || chinaCity !== ""){
                $('#settleName').text(recipientName)
                $('#settlePhone').text(recipientPhone)
                $('#settleAddress').text(country + chinaProvince + chinaCity + recipientAddress)
                console.log(recipientName,recipientPhone,recipientAddress)
            }
            $('#exampleModal').modal('hide');
        })
    }



    /*导航栏信息*/
    UserMsg()
    function UserMsg() {

        $.ajax({
            type:'GET',
            url:'http://39.108.184.155:8080/searanch/user/userInfo',
            dataType:'JSON',
            headers:{'Authorization':userToken},
            xhrFields: {
                withCredentials: false
            },
            success:function (res) {
                /*console.log(res)*/
                $('#name').text(res.data.nickname)
                /*console.log(res.data.image)*/
                let nickImg = '<img src="'+ res.data.image + '" alt="portrait" class="img-responsive img-circle center-block" style="display:inline-block;width:35px;height:35px" >'
                $('#userMsg').prepend(nickImg)
            },
            error:function (error) {
                console.log(error)
            }
        })
    }

    /*安全退出*/
    leave()
    function leave() {
        $('#leave').click(function () {
            $.ajax({
                type:'get',
                url:'http://39.108.184.155:8080/searanch/logout',
                headers:{'Authorization': userToken},
                success:function (res) {
                    /*console.log(res)*/
                    if(res.code === 200){
                        /*console.log(res.message)*/
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

    /*结算列表*/
    function settlementList() {
        var cartIdList = JSON.parse(localStorage.getItem('goodsIdList'))
        console.log('cartIdList',cartIdList)

        $.ajax({
            type:'get',
            url:'http://39.108.184.155:8080/searanch/shopCart/myShopCart',
            dataType: 'json',
            headers:{'Authorization':userToken},
            success:function (result) {
                console.log(result)
                if(result.code == 200){
                    console.log(result.message)
                    var amount = 0;
                    var sumPrice = 0
                    var orderList = []
                    var order = {}
                    var carts = []
                    for (var i=0; i<result.data.length; i++){
                        for(var j = 0;j<cartIdList.length;j++){

                            if(result.data[i].cartId == cartIdList[j]){
                                var list = '<li class="SettlementGoods row">' +
                                    '<a href="">' +
                                    '<div class="SGImg col-md-2 col-xs-5">' +
                                    '<img src="'+result.data[i].picture+'" alt="" style="width: 100px;height: 100px">' +
                                    '</div>' +
                                    '<div class="SGgoods col-md-10 col-xs-7">' +
                                    '<span class="SGgoodsTitle">'+result.data[i].goodsName+'</span>' +
                                    '<span class="SGgoodsTitle">'+result.data[i].processMode+'</span>' +
                                    '<span>'+result.data[i].price+'</span>' +
                                    '<span>' +
                                    'x<em>'+result.data[i].amount+'</em>' +
                                    '</span>' +
                                    '<span class="SGPrice">' +
                                    '￥<em id="listSum">'+parseInt(result.data[i].price)*parseInt(result.data[i].amount)+'</em>' +
                                    '</span>' +
                                    ' </div>' +
                                    ' </a>' +
                                    '</li>'

                                $('#settlementUl').append(list)

                                amount = result.data[i].amount + amount
                                sumPrice = parseInt(result.data[i].price)*parseInt(result.data[i].amount) + sumPrice

                                order.amount = result.data[i].amount
                                order.goodsId = result.data[i].goodsId
                                order.price = result.data[i].price
                                /*console.log(order)*/
                                orderList.unshift(order)

                                carts.unshift(result.data[i].cartId)
                            }
                        }
                    }

                    console.log('orderList:', orderList)
                    localStorage.setItem('orderList',JSON.stringify(orderList))
                    localStorage.setItem('carts',JSON.stringify(carts))

                    $('#settleGoodsNum').text(amount)
                    $('.settlePrice span').text(sumPrice.toFixed(2))

                }else{
                    console.log(result.message)
                }
            },
            error:function (error) {
                console.log(error)
            }
        })
    }

    /*下单*/
    function placeOrder() {
        $('#mdialog').click(function () {
            var addressee = $('#recipient-name').val()
            var phone = $('#recipient-phone').val()
            var country = $('#s1 option:selected').text()
            var province = $('#id_provSelect  option:selected').text()
            var city = $('#id_citySelect option:selected').text()
            var goodsList = JSON.parse(localStorage.getItem('orderList'))
            console.log('goodList',goodsList)
            var address = $('#recipient-adress').val()
            var cartId = JSON.parse(localStorage.getItem('carts'))
            console.log('cartId',cartId)

            $.ajax({
                type:'post',
                url:'http://39.108.184.155:8080/searanch/order/addOrder',
                dataType:'json',
                headers:{'Authorization': userToken},
                data:JSON.stringify({
                    address:address,
                    addressee:addressee,
                    city:city,
                    country:country,
                    goodsList:goodsList,
                    phone:phone,
                    province:province,
                    cartId:cartId
                }),
                contentType:'application/json;charset=UTF-8',
                success:function (res) {
                    console.log(res)
                    if(res.code == 200){
                        console.log(res.message)
                        console.log('下单成功')
                        $('#orderNumber').text(res.data.orderNumber)
                        localStorage.setItem('orderNumber',res.data.orderNumber)
                    }
                    else{
                        console.log(res.message)
                    }
                },
                error:function (error) {
                    console.log(error)
                    console.log('请求出错')
                }
            })
        })
    }


})





