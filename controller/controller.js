/*
 *
 */
var pictureSource;
var destinationType; 
var db;
var app = {

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('logear').addEventListener('click', this.logear, false);
        
        document.getElementById('scan').addEventListener('click', this.scan, false);
        document.getElementById('guardarLibro').addEventListener('click', this.guardarLibro, false);
        document.getElementById('newSolicitud').addEventListener('click', this.cambioPagina, false);
    },

    onDeviceReady: function() {
        window.pictureSource=navigator.camera.PictureSourceType;
        window.destinationType=navigator.camera.DestinationType;
        window.db = window.openDatabase("solicitudesPorEnviar", "1.0", "Solicitudes por Enviar", 1000000);
        app.receivedEvent('deviceready');
        window.db.transaction(app.populateDB, app.errorCB, app.successCB);
        window.db.transaction(queryDB, errorCB);
    },

    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Evento Recivido: ' + id);
    },
    scan: function() {
        console.log('scanning');
        try {
            window.plugins.barcodeScanner.scan(function(args) {
                console.log("Scanner result: \n" +
                    "text: " + args.text + "\n" +
                    "format: " + args.format + "\n" +
                    "cancelled: " + args.cancelled + "\n");
                /*
                if (args.format == "QR_CODE") {
                    window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
                }
                */
                //document.getElementById("texto").innerHTML = args.text;
                // document.getElementById("formato").innerHTML = args.format;
                app.buscarLibro(args.text);
                // document.getElementById("isbn").value = args.text;
                // document.getElementById("texto").innerHTML = args.text;
                // document.getElementById("formato").innerHTML = args.format;
                // document.getElementById("cancelled").innerHTML = args.cancelled;
                // document.getElementById("args").innerHTML = args;
                $.mobile.changePage( '#newSolicitudPag', { transition: "slide"} );
                console.log(args);
            });
        } catch (ex) {
            console.log(ex.message);
        }
    },

    logear: function(){
        console.log('logear');
        $.ajax({
            url: 'data/libro.json',
            type: 'GET',
            dataType: 'json',
            error : function (){ document.title='error'; }, 
            success: function (data) {
                if(data.success){
                    var pag = '#inicio';
                    $.mobile.changePage( pag, { transition: "slide"} );
                }
                console.log(data.model.usuario);
                console.log(data.model.pass);
                console.log(data.success);
                
            }
        });
    },
    cambioPagina: function(){
        //app.buscarLibro(9789568410575)
        var pag = '#'+this.id+'Pag';
        $.mobile.changePage( pag, { transition: "slide"} );
        console.log('this.cambioPagina');
    },

    capturarFoto: function(){

    },

    buscarLibro: function(codigoIsbn){
        $.ajax({
            url: 'data/libro.json',
            type: 'POST',
            dataType: 'json',
            error : function (){ document.title='error'; }, 
            success: function (data) {
                if(data.success){
                    data.model.forEach(function(a){
                        if(a.isbn == codigoIsbn){
                            document.getElementById("isbn").value = a.isbn;
                            document.getElementById("titulo").value = a.titulo;
                            document.getElementById("autor").value = a.autor;
                            document.getElementById("precioReferencia").value = a.precioReferencia;
                        }
                        //}else{
                            //$( "#dialogoError" ).popup( "open" );
                    });
                }
            }
        });
    },

    guardarLibro: function(){
        console.log('guardarLibro');
        var pag = '#inicio';
        $.mobile.changePage( pag, { transition: "slide"} );
    },

    // Rellena la base de datos 
    populateDB: function(tx) {
         tx.executeSql('DROP TABLE IF EXISTS DEMO');
         tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
         tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "Primera fila")');
         tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Segunda fila")');
    },

    queryDB: function(tx) {
        tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
    },

    querySuccess: function(tx, results) {
        // debería estar vacio ya que se inserto nada
        console.log("ID insert = " + results.insertId);
        // Sera 0 debido que es una sentencia SQL de tipo 'select'
        console.log("Filas afectadas = " + results.rowAffected);
        // El numero de filas retornadas
        console.log("Filas retornadas = " + results.rows.length);
        alert("ID insert = " + results.insertId+"Filas afectadas = " + results.rowAffected+"Filas retornadas = " + results.rows.length);
    },

    // Función 'callback' de error de transacción
    errorCB: function(tx, err) {
        alert("Error procesando SQL: "+err);
    },

    // Función 'callback' de transacción satisfactoria
    successCB:  function() {
        alert("bien!");
    }

};
