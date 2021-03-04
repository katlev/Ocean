
$(function () {

    var userToken = window.localStorage.getItem('lo_token')
    /*console.log(userToken)*/
    /*显示用户信息*/
    $.ajax({
        type:'GET',
        url:'http://39.108.184.155:8080/searanch/user/userInfo',
        dataType:'JSON',
        headers:{'Authorization': userToken},
        xhrFields:{
            withCredentials:false
        },
        contentType:'application/x-www-form-urlencoded',
        success:function (res) {
            /*console.log(res)*/
            $('#name').text(res.data.nickname)
            let smallImg = '<img src="'+res.data.image+'" alt="portrait" class="img-responsive img-circle center-block" style="display:inline-block;width:35px;height:35px">'
            $('#UserMsg').prepend(smallImg)

            let str = '<img src="'+ res.data.image +'" alt="" class="img_responsive" style="display:inline-block;width: 100px;height: 100px;" id="UserMsgImg" >'
            $('#UserImg').append(str)

            $('#ModifyName').val(res.data.username)
            $('#ModifyNickName').val(res.data.nickname)
            $('#ModifyPhone').val(res.data.phoneNumber)
            $('#ModifyEmail').val(res.data.email)
        },
        error:function (error) {
            console.log(error)
        }
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
            headers:{'Authorization':userToken},
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
                    let MsgImage = res.data
                    window.localStorage.setItem('MsgData',MsgImage)
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
    SaveModify()
    /*用户信息修改*/
    function SaveModify() {

        $('#btnSave').click(function () {

            var username = $('#ModifyName').val()
            var nickname = $('#ModifyNickName').val()
            var phoneNumber = $('#ModifyPhone').val()
            var email = $('#ModifyEmail').val()
            var image = localStorage.getItem('MsgData')

            $.ajax({
                type:'POST',
                url:'http://39.108.184.155:8080/searanch/user/update',
                dataType:'JSON',
                xhrFields: {
                    withCredentials: false
                },
                headers:{'Authorization': userToken},
                data:JSON.stringify(  {
                    username:username,
                    nickname:nickname,
                    phoneNumber:phoneNumber,
                    email:email,
                    image:image
                }),
                contentType: 'application/json',
                success:function (res) {
                    console.log(res)
                    if(res.code === 200){
                        /*console.log(res.message)*/
                        alert("修改成功，确认是否保存？")
                        $('#ModifyName').val(res.data.username)
                        $('#ModifyNickName').val(res.data.nickname)
                        $('#ModifyPhone').val(res.data.phoneNumber)
                        $('#ModifyEmail').val(res.data.email)
                        $('#UserMsgImg').attr('src',res.data.image)
                        window.location.reload()
                    }
                    else{
                        alert(res.message)
                    }
                },
                error:function (error) {
                    console.log(error)
                }
            })
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
                    console.log(res)
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

})
