/**
 * Interfaz para iDNSSEC 
 */

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// variable para decir si la pagina es segura o no
var secure = false;

// variable para detectar si hubo error al cargar la página
var error = false;

// create base UI tab and root window
var win1 = Titanium.UI.createWindow({  
    backgroundColor:'#fff',
    navBarHidden:true
});

// if iOS
// var toolBar = Titanium.UI.createToo({
	// bottom: 0,
	// width:'auto',
	// height: 50
// });


// if Android
var toolBarView = Titanium.UI.createView({
    bottom:0,
    height:'40',
    width:'320',
    backgroundColor:'#777'
});
 
var back = Ti.UI.createButton({
    title:'Back',
    height:'38',
    width:'100',
    top:'1',
    left:'20',
    //image: 'green.png'
});
 
var forward = Ti.UI.createButton({
    title:'Forward',
    height:'38',
    width:'100',
    top:'1',
    right:'20'
});

var refresh = Ti.UI.createButton({
    title:'Refresh',
    height:'38',
    width:'70',
    top:'1'
    
});
 
 
back.addEventListener("click", function(e){
    //alert(e.source + "Was Clicked");
    webview.goBack();
});
 
forward.addEventListener("click", function(e){
    //alert(e.source + "Was Clicked");
    webview.goForward();
});

refresh.addEventListener("click", function(e){
    //alert(e.source + "Was Clicked");
    webview.reload();
});
 
toolBarView.add(back);
toolBarView.add(forward);
toolBarView.add(refresh);
 
win1.add(toolBarView);


// imagen dependiendo del status, seguro o inseguro, se pone la de default al abrir la aplicacion, gris
var image = Titanium.UI.createImageView({
	image:"questionmark.png",
	top:5,
	right:5,
	width:30,
	height:30
});


// create the search bar
var search = Titanium.UI.createSearchBar({
    barColor:'#000', 
    showCancel:false,
    height:43,
    right: 80,
    top:0,
    hintText: "Write the address...",
    borderRadious: 5,
    showCancel: true
});

// aqui se depliega la pagina web, cuando se abre la aplicacion tiene la ventana por default
// checar las notas http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.WebView
var webview = Ti.UI.createWebView({
	url: 'mainpage.html',
    scalesPageToFit: true,
    top:44,
    bottom:40,
    loading: true
});

// crea el activity indicator
var activityIndicator = Ti.UI.createActivityIndicator({
  height:30,
  width:30,
  top:5,
  right:5,
  //message: "Loading...",
  style: Ti.UI.ActivityIndicatorStyle.PLAIN
});

// pone el activity indicator hide como default
activityIndicator.hide();

// http client
var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
         Ti.API.info("Received text: " + this.responseText);
    if(secure){
   	   	image.image = "green.png";
   	   	webview.url=search.getValue();
   	}else if(!secure){
   		image.image = "red.png";
   		webview.url="mainpage.html";
   		alert("The site your are trying to reach is insecure");
   	}
         //alert('success');
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         //alert('error');
         //error=true;
         image.image = "questionmark.png";
   		 webview.url="404.html";
     },
     timeout : 2000  // in milliseconds
});


// Picker para seleccionar el metodo de validacion, 
// Checar en la documentacion lo que varía para android y IOS
var picker = Ti.UI.createPicker({
  top:0,
  right:35,
  width:45,
  height:43,
  selectionIndicator:false
});

// Los elementos del picker
var data = [];
data[0]=Ti.UI.createPickerRow({title:'Device'});
data[1]=Ti.UI.createPickerRow({title:'DNS'});
data[2]=Ti.UI.createPickerRow({title:'Proxy'});

picker.add(data);
picker.selectionIndicator = true;

// must be after picker has been displayed
//picker.setSelectedRow(0,0,false); // select Mangos

// Se esconde el teclado cuando se da enter, se busca la direccion que se introdujo
search.addEventListener('return', function(e)
{
	
	// muestra el activity indicator
	activityIndicator.show();
	
	// Quita el teclado
	search.blur();
   
	// Prepare the connection.
	client.open("GET", search.getValue());
	
	// Send the request.
	client.send();
   	
   // Quita el activity indicator
   activityIndicator.hide();
});



// Esconde el teclado cuando se le da click a la pantalla
webview.addEventListener("click", function(e){
	search.blur();
});

// Add the components of the view

win1.add(picker);
win1.add(search);
win1.add(image);
win1.add(webview);
win1.add(activityIndicator);

// if iOS
// win1.add(toolBar);

// Open the window
win1.open();


/* checar proxy
 * documento de instalación y de mantenmiento
 * checar lo del boton
 */
