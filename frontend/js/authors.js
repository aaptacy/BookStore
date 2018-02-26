$(function(){
    var authorsList = $("#authorsList");
    var formElement = document.querySelector('#authorAdd'); 
    var authorEditSelect = $("#authorEditSelect");
    
    function showAuthor(elem){
        var html = $('#authorsList').html() + '<li class="list-group-item" data-id="'+elem.id+'"><div class="panel panel-default"><div class="panel-heading"><span class="authorName">'+elem.name+' '+elem.surname+'</span><button data-id="'+elem.id+'" class="btn btn-danger pull-right btn-xs btn-author-remove"><i class="fa fa-trash"></i></button><button data-id="'+elem.id+'" class="btn btn-primary pull-right btn-xs btn-author-books"><i class="fa fa-book"></i></button></div><ul class="authorBooksList"></ul></div></li>';
        $('#authorsList').html(html) ;
    }
    
//załadowanie listy autorów   
    $.get({
        url: 'http://localhost/WAR_PHP_W_08_Warsztat_3/rest/rest.php/author'
        }).done(function (data){
            data.success.forEach(function(elem){
                showAuthor(elem);
                var editHtml = $('#authorEditSelect').html()+'<option value="'+elem.id+'" data-id="'+elem.id+'">'+elem.name+' '+elem.surname+'</option>';
                $('#authorEditSelect').html(editHtml); 
            });               
        }).fail(function (a,b,c) {
            console.log("Error",a,b,c);
            showModal("Something is not ok");
        });
        
//dodawanie autora        
    formElement.addEventListener('submit',function (event) {
        event.preventDefault();
        $.post({
            url: 'http://localhost/WAR_PHP_W_08_Warsztat_3/rest/rest.php/author',
            data: $(formElement).serialize()
        }).done(function (data) {
            showAuthor(data.success[0]);
            authorEditSelect.append('<option>'+data.success[0].name+' '+data.success[0].surname+'</option>');
            formElement.reset();
            showModal("Author has been added");
        }).fail(function (a,b,c) {
            console.log("Error",a,b,c);
            showModal("Something is not ok");
        }).always(function(xhr,status)	{
        });
    }); 
    
//wyświetlanie listy książek autora    
    authorsList.on('click', '.btn-author-books', function(event){
        var id = event.target.dataset.id;
        var authorBooksList = $('.list-group-item[data-id="'+id+'"]').find('.authorBooksList');
        if(authorBooksList.html() === ''){
            $.get({
                url: 'http://localhost/WAR_PHP_W_08_Warsztat_3/rest/rest.php/author/'+id
            }).done(function (data){
                data.success[0].books.forEach(function(book){
                    var ul = authorBooksList.html()+'<li>'+book.title+'</li>';
                    authorBooksList.html(ul);
                });
                authorBooksList.toggle(1000);
            }).fail(function (a,b,c) {
                console.log("Error",a,b,c);
                showModal("Something is not ok");
            });  
        }else{
        authorBooksList.toggle(1000);
        authorBooksList.html('');
        }
    });        
        
    authorsList.on('click', '.btn-author-remove', function(event){
        var id = event.target.dataset.id;
        $.ajax({
            url: 'http://localhost/WAR_PHP_W_08_Warsztat_3/rest/rest.php/author/'+id,
            type: 'DELETE'
        }).done(function(data){
            $('.list-group-item[data-id="'+id+'"]').css('display', 'none');
            showModal('Author is deleted');   
    });
}); 

//edycja autora
    authorEditSelect.on('change', function(event){
        var formEdit =  $('#authorEdit');
        formEdit.slideDown();
        var id = event.target.value;
        $.getJSON({
            url: 'http://localhost/WAR_PHP_W_08_Warsztat_3/rest/rest.php/author/'+id
        }).done(function (data) {            
            var author = data.success[0];
            formEdit.find('input[name="name"]').val(author.name);
            formEdit.find('input[name="surname"]').val(author.surname);
            formEdit.find('input[name="id"]').val(author.id);
        }).fail(function(a,b,c){
            console.log('Error', a,b,c);
            showModal("Something is not ok");
        });   


        formEdit.on('submit', function(event){
            $.ajax({
                url: 'http://localhost/WAR_PHP_W_08_Warsztat_3/rest/rest.php/author/'+id,
                method: 'PATCH',
                data:formEdit.serialize()        
            }).done(function(data){
                $('.list-group-item[data-id="'+id+'"]').html('<div class="panel panel-default"><div class="panel-heading"><span class="authorName">'+data.success[0].name+' '+data.success[0].surname+'</span><button data-id="'+data.success[0].id+'" class="btn btn-danger pull-right btn-xs btn-author-remove"><i class="fa fa-trash"></i></button><button data-id="'+data.success[0].id+'" class="btn btn-primary pull-right btn-xs btn-author-books"><i class="fa fa-book"></i></button></div><ul class="authorBooksList"></ul></div>');
                $('option[data-id="'+id+'"]').html(data.success[0].name+' '+data.success[0].surname);
                formEdit.slideUp();
                showModal('Author is modified');
            }).fail(function(a,b,c){
                console.log('Error', a,b,c);
                showModal("Something is not ok");
            });
            event.preventDefault();
        });                     
    });            
});

