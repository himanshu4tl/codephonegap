// Initialize collapse button
$(".button-collapse").sideNav();

String.prototype.replaceAll = function(search, replacement) {return this.replace(new RegExp(search, 'g'), replacement);};

var app={
    defaultPage:'site/memberdetails',
    baseUrl:'http://idmrvault.com/members/api/',
    currentUrl:'',
    //baseUrl:'http://localhost/yogesh/members/api/',
    mainContainer:$('#contentView'),
    id:'',
    loader:$('#mLoader'),
    translateHtml:function(html,object){
        $.each(object,function(index,value){html=html.replaceAll(index,value);});return html;
    },
    creteHtml:function(templateID,data){
        return this.translateHtml($('#'+templateID).html(),data);
    },
    loadDefaultPage:function(){
        if(this.id){this.loadAjaxPage(this.defaultPage);}else{this.loadAjaxPage('site/login');}
    },
    appInit:function(){
        $('#slide-out a').on('click',function(e){
            e.preventDefault();
            app.loadAjaxPage(this.href);
            $('.button-collapse').sideNav('hide');
        });
        if(localStorage['id']){this.id=localStorage['id']}
        this.loadDefaultPage();
        if(this.id){this.setUserLogin();}
    },
    renderHtml:function(html){
        this.mainContainer.html(html);
        this.pageInit();
    },
    loadPage:function(templateId){
        console.log(templateId);
        this.renderHtml(this.creteHtml(templateId,{}));
    },
    alert:function(msg){Materialize.toast(msg,5000);},
    loadAjaxPage:function(url){
        console.log(url);
        url=url.split('/');
        if(url[url.length-1]=='#'){return false;}
        this.currentUrl=url[url.length-2]+'/'+url[url.length-1];
        app.startLoader();
        $.ajax({
            url:this.baseUrl+this.currentUrl+'?id='+app.id,
            type:'get',
            success:function(response){
                app.renderHtml(response);
                app.afterRout();
                app.stopLoader();
            },
            error:function(e){console.log(e);app.stopLoader();}
        });
    },
    AjaxForm:function(obj){
        var $this=$(obj);
        app.startLoader();
        var formData = new FormData($this[0]);
        formData.append('id',app.id);
        $.ajax({
            url:$this.prop('action'),
            data:formData,
            type:'post',
            datatype:'json',
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success:function(response){if(response.message){app.alert(response.message);}
                if(response.id){localStorage['id']=app.id=response.id;app.setUserLogin();}
                if(response.name){app.name=response.name;}
                if(response.email){app.email=response.email;}
                if(response.status){app.loadAjaxPage(response.url);}
                app.stopLoader();
            },
            error:function(e){console.log(e);app.stopLoader();}
        })
    },
    pageInit:function(){
        this.mainContainer.find('a').on('click',function(e){e.preventDefault();app.loadAjaxPage(this.href);});
        this.mainContainer.find('form').on('submit',function(e){e.preventDefault();app.AjaxForm(this);});
    },
    setUserLogout:function(){
        localStorage['id']=app.id='';
        $('.auth').hide();
        $('.site-login').show();
    },
    setUserLogin:function(){
        $(".auth").show();
        $(".site-login").hide();
    },
    afterRout:function(){
        if(app.currentUrl){
            $('#slide-out .'+app.currentUrl.replace('/','-')).addClass('active').siblings().removeClass('active');
        }
    },
    startLoader:function(){
      this.loader.show();
    },
    stopLoader:function(){
      this.loader.hide();
    },
};
app.appInit();
