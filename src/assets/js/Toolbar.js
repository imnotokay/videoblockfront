$(document).ready(()=>{

    $('li.sub-minimized ul').hover(function(e){
        if($('#sidebar').hasClass('c-sidebar-minimized')){
            let offsetTop = $(e.currentTarget).parent().parent().offset().top;
            let totalHeight = $(window).height();
            let actualHeight = totalHeight - offsetTop;
            if($(e.currentTarget).parent().parent().height() > actualHeight)
            {
                $(e.currentTarget).parent().parent().height(actualHeight);
                $(e.currentTarget).parent().parent().addClass('minimized-submenu');
            }
        }else{
            let uls = document.getElementsByClassName('minimized-submenu');

            for(let i of uls){
                $(e.currentTarget).parent().parent().height('auto');
                $(e.currentTarget).parent().parent().removeClass('minimized-submenu');
            }
        }
    });

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    $(document).on('click', 'button', function(){
        setTimeout(()=>{
            $('.toolPanel').css('margin-top', (($('.toolPanel').first().height() / 2) * -1));
        }, 100);
    })
    $(document).on('click','.togglePanel', (e)=>{
        let sender = e.currentTarget;
        let parent = $(sender).parent();
        let icon = $(sender).find('i');
        if(parent.hasClass('toolPanelShow')){
            parent.removeClass('toolPanelShow');
            parent.addClass('toolPanelHide');
            icon.addClass('cil-chevron-left');
            icon.removeClass('cil-chevron-right');
        }else{
            parent.removeClass('toolPanelHide');
            parent.addClass('toolPanelShow');
            icon.removeClass('cil-chevron-left');
            icon.addClass('cil-chevron-right');
        }
    });
    setTimeout(()=>{
        $('.toolPanel').css('margin-top', (($('.toolPanel').first().height() / 2) * -1));
    }, 500);
});

$(window).resize(()=>{
    $('.toolPanel').css('margin-top', (($('.toolPanel').first().height() / 2) * -1));
});
