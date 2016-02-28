// Initialize collapse button
$(".button-collapse").sideNav();

String.prototype.replaceAll = function(search, replacement) {return this.replace(new RegExp(search, 'g'), replacement);};

var app={
    defaultPage:'site/login',
    baseUrl:'http://mr-solutions.in/yogesh/members/api/',
    //baseUrl:'http://localhost/yogesh/members/api/',
    mainContainer:$('#contentView'),
    id:0,
    translateHtml:function(html,object){
        $.each(object,function(index,value){html=html.replaceAll(index,value);});return html;
    },
    creteHtml:function(templateID,data){
        return this.translateHtml($('#'+templateID).html(),data);
    },
    loadDefaultPage:function(){
        this.loadAjaxPage(this.defaultPage);
    },
    appInit:function(){
        $('a').on('click',function(e){e.preventDefault();app.loadAjaxPage(this.href);});
        this.loadDefaultPage();
        $('#slide-out a').on('click',function(){$('.button-collapse').sideNav('hide');});

    },
    renderHtml:function(html){
        this.mainContainer.html(html);
        this.pageInit();
    },
    loadPage:function(templateId){
        console.log(templateId);
        this.renderHtml(this.creteHtml(templateId,{}));
    },
    alert:function(msg){Materialize.toast(msg,2000);},
    loadAjaxPage:function(url){
        console.log(url);
        url=url.split('/');
        $.ajax({
            url:this.baseUrl+url[url.length-2]+'/'+url[url.length-1]+'?id='+app.id,
            type:'get',
            success:function(response){
                app.renderHtml(response);
            },
            error:function(e){console.log(e);}
        });
    },
    AjaxForm:function(obj){
        var $this=$(obj);
        $.ajax({url:$this.prop('action'),data:'id='+app.id+'&'+$this.serialize(),type:'post',datatype:'json',
            success:function(response){if(response.message){app.alert(response.message);}
                if(response.id){app.id=response.id;}
                if(response.name){app.id=response.name;}
                if(response.email){app.id=response.email;}
                if(response.status){app.loadAjaxPage(response.url);}
            },
            error:function(e){console.log(e);}
        })
    },
    pageInit:function(){
        this.mainContainer.find('a').on('click',function(e){e.preventDefault();app.loadAjaxPage(this.href);});
        this.mainContainer.find('form').on('submit',function(e){e.preventDefault();app.AjaxForm(this);});
    },

};
app.appInit();