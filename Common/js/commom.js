//公共样式
$(function () {
    iconColor()
    shopCartColor()
    shopCartShow()
    SidePanelColor()
    ToTop()
    /*鼠标移上改变样式*/
    function iconColor() {
        $('[name=mouseColor]')
            .mouseover(function () {
                var id = this.id + "_items"
                $('#' + id).css("color","#E64346")
               /* console.log('移入')*/
            })
            .mouseout(function () {
                var id = this.id + "_items"
                $('#' + id).css('color','#343434')
                /*console.log('移出')*/
            })
    }

    /*我的购物车*/
    function shopCartColor(){
        $('#shoppingCart')
            .mouseenter(function () {
                $('#shoppingCart').css("color","#E64346")
            })
            .mouseleave(function () {
                $('#shoppingCart').css("color","#888888")

            })
    }
    function shopCartShow() {
        $('[name=showHide]').hover(function () {
                var id = this.id + "_items"
                $('#' + id).show()
            },
            function () {
                var id = this.id + "_items"
                $('#' + id).hide()
            })
    }

    /*固定浮动栏*/
    function SidePanelColor() {
        $('[name=sideMouseColor]')
            .mouseenter(function () {
                var id = this.id + '_items'
                $('#' + id).css("color","#10C46E")
               /* console.log('鼠标移入')*/
            })
            .mouseleave(function () {
                var id = this.id + '_items'
                $('#' + id).css("color","#C0C0C0")
               /* console.log('鼠标移出')*/
            })
    }
    /*返回顶部*/
    function ToTop(){
        $('#gotop').click(
            function () {
                var $page = $('html,body')
                var distance = $('html').scrollTop()

                var time = 500
                var intervalTime = 50
                var ItemDistance = distance/(time/intervalTime)
                var intervalId = setInterval(function () {
                    distance -= ItemDistance
                    if(distance<=0){
                        distance = 0
                        clearInterval(intervalId)
                    }
                    $page.scrollTop(distance)
                },intervalTime)
            })
    }

})

/*登录个人信息显示*/
function load_data() {
    var username = localStorage.getItem("phoneNumber")
    if(username == null || username === '')
    {
        $('#users').css('display','none')
        $('#shopCart').css('display','none')
        $('#login').css('display','inline-block')
        console.log('username为空',username)
    }else{
        $('#users').css('display','inline-block')
        $('#shopCart').css('display','inline-block')
        $('#login').css('display','none')
        console.log('username不为空',username)

    }
}
/*退出首页*/
function leave() {
    localStorage.removeItem("phoneNumber")
    localStorage.removeItem('lo_token')
    load_data()
    console.log('移出username成功',username)

}











