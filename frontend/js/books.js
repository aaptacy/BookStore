 $(function(){
var booksList = $("#booksList");
var bookEditSelect = $("#bookEditSelect");
var bookAdd = document.querySelector('#bookAdd');

function showBook(elem){
    var html = $('#booksList').html() + '<li class="list-group-item" data-id="'+elem.id+'"><div class="panel panel-default"><div class="panel-heading"><span class="bookTitle">'+elem.title+' ('+elem.author.name+' '+elem.author.surname+')</span><button data-id="'+elem.id+'" class="btn btn-danger pull-right btn-xs btn-book-remove"><i class="fa fa-trash"></i></button><button data-id="'+elem.id+'" class="btn btn-primary pull-right btn-xs btn-book-show-description"><i class="fa fa-info-circle"></i></button></div><div class="panel-body book-description">'+elem.description+'</div></div></li>';
    $('#booksList').html(html) ;
}

//wyświetlanie oopisu książki
booksList.on('click', '.btn-book-show-description', function(event){
    var id = event.target.dataset.id;
    $('.list-group-item[data-id="'+id+'"]').find('.panel-body.book-description').toggle(2000);  
});

//usuwanie książki
booksList.on('click', '.btn-book-remove', function(event){
    var id = event.target.dataset.id;
    $.ajax({
        url: 'http://localhost/WAR_PHP_W_08_Warsztat_3/rest/rest.php/book/'+id,
        type: 'DELETE'
    }).done(function(data){
        $('.list-group-item[data-id="'+id+'"]').css('display', 'none');
        showModal('YourBook is deleted');   
    });
});   


//edycja książki
bookEditSelect.on('change', function(event){
    var formEdit =  $('#bookEdit');
    var id = event.target.value;
    formEdit.slideDown();
     $.getJSON({
        url: 'http://localhost/WAR_PHP_W_08_Warsztat_3/rest/rest.php/book/'+id
        }).done(function (data) {            
         var book = data.success[0];
         formEdit.find('input[name="title"]').val(book.title);
         formEdit.find('textarea[name="description"]').val(book.description);
         formEdit.find('input[name="id"]').val(book.id);
         formEdit.find('option[data-id="'+book.author_id+'"]').attr('selected', 'selected');
        }).fail(function(a,b,c){
            console.log('Error', a,b,c);
            showModal("Something is not ok");
        });   

    formEdit.on('submit', function(event){
        $.ajax({
        url: 'http://localhost/WAR_PHP_W_08_Warsztat_3/rest/rest.php/book/'+id,
        method: 'PATCH',
        data:formEdit.serialize()        
        }).done(function(data){
            console.log(data.success[0]);
            var elem = data.success[0];
            $('.list-group-item[data-id="'+id+'"]').html('<div class="panel panel-default"><div class="panel-heading"><span class="bookTitle">'+elem.title+' ('+elem.author.name+' '+elem.author.surname+')</span><button data-id="'+elem.id+'" class="btn btn-danger pull-right btn-xs btn-book-remove"><i class="fa fa-trash"></i></button><button data-id="'+elem.id+'" class="btn btn-primary pull-right btn-xs btn-book-show-description"><i class="fa fa-info-circle"></i></button></div><div class="panel-body book-description">'+elem.description+'</div></div>');
            $('option[data-id="'+id+'"]').html(elem.title);
        showModal('Your Book is modified');
        formEdit.slideUp();
        }).fail(function(a,b,c){
            console.log('Error', a,b,c);
            showModal("Something is not ok");
        });
         event.preventDefault();
    });
});    

//załadowanie listy książek
 $.get({
    url: 'http://localhost/WAR_PHP_W_08_Warsztat_3/rest/rest.php/book'
    }).done(function (data) {
        data.success.forEach(function(elem){
            showBook(elem);
            var editHtml = bookEditSelect.html()+'<option value="'+elem.id+'" data-id="'+elem.id+'">'+elem.title+'</option>';
            bookEditSelect.html(editHtml);   
        });
    }).fail(function (a,b,c) {
        console.log("Error",a,b,c);
        showModal("Something is not ok");
    });
 
//dodawanie nowej książki wraz z autorem
bookAdd.addEventListener('submit',function (event) {
    event.preventDefault();
    $.post({
        url: 'http://localhost/WAR_PHP_W_08_Warsztat_3/rest/rest.php/book',
        data: bookAdd.serialize()
        }).done(function (data) {
            console.log(data.success);
            var elem = data.success[0];
            showBook(elem);
            bookAdd.reset();
            showModal("Your book is created");
        }).fail(function (a,b,c) {
            console.log("Error",a,b,c);
            showModal("Something is not ok");
        }).always(function(xhr,status)	{
        });
    });


//pobieranie listy autorów do pola select
$.get({
    url: 'http://localhost/WAR_PHP_W_08_Warsztat_3/rest/rest.php/author'
    }).done(function (data) {
        data.success.forEach(function(elem, index){
            var editHtml = $('#author_id').html()+'<option value="'+elem.id+'" data-id="'+elem.id+'">'+elem.name+' '+elem.surname+'</option>';
            $('#author_id').html(editHtml);
            var editHtmlAuthor = $('#author_id_edit').html()+'<option value="'+elem.id+'" data-id="'+elem.id+'">'+elem.name+' '+elem.surname+'</option>';
            $('#author_id_edit').html(editHtmlAuthor);
        });
    }).fail(function (a,b,c) {
        console.log("Error",a,b,c);
        showModal("Something is not ok");
    }).always(function(xhr,status)	{
    });
    
});
