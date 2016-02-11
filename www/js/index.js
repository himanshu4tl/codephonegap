// Initialize collapse button
$(".button-collapse").sideNav();

String.prototype.replaceAll = function(search, replacement) {return this.replace(new RegExp(search, 'g'), replacement);};

var app={
    defaultPage:'page1',
    baseUrl:'http://localhost/test/angular/web',
    mainContainer:$('#contentView'),
    translateHtml:function(html,object){
        $.each(object,function(index,value){html=html.replaceAll(index,value);});return html;
    },
    creteHtml:function(templateID,data){
        return this.translateHtml($('#'+templateID).html(),data);
    },
    loadDefaultPage:function(){
      this.loadPage(this.defaultPage);
    },
    appInit:function(){
        this.loadDefaultPage();
    },
    renderHtml:function(html){
        this.mainContainer.html(html);
        this.pageInit();
    },
    loadPage:function(templateId){
        console.log(templateId);
        this.renderHtml(this.creteHtml(templateId,{}));
    },
    loadAjaxPage:function(url){
        $.get(this.baseUrl+'/'+url,function(response){app.renderHtml(response);})
    },
    pageInit:function(){
        $('a').on('click',function(e){e.preventDefault();app.loadPage(this.rel);});
    },

};
app.appInit();