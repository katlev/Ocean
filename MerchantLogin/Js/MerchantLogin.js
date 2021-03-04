/*简单的登录验证*/

    function MerchantLogin() {

        var phoneNumber = $('#MerchantName').val()
        var password = $('#MerchantPwd').val()

        if(phoneNumber.trim() === ' ' || password.trim() === ' '){
            alert("输入不能为空！")
            return
        }

        $.ajax({
            type:'POST',
            url:'http://39.108.184.155:8080/searanch/login',
            dataType: 'JSON',
            xhrFields:{//实现跨域访问
                withCredentials:true
            },
            contentType:'application/x-www-form-urlencoded',
            data:{
                phoneNumber:phoneNumber,
                password:password
            },
            success:function (result) {
                if(result.code === 200)
                {
                    console.log(result.message)
                    location.href = '../Shops/Shops.html'
                    var token = result.data.token
                    console.log(token)
                    window.localStorage.setItem('Mer_token',token)
                    var userId = result.data.userId
                    window.localStorage.setItem('userId',userId)
                }
                else{
                    alert(result.message)
                }
            },
            error:function (error) {
                console.log(error)
            }

        })
    }



