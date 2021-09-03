// change "1=1;2=2" in [[1,1],[2,2]]
function converter(c){
	result = []
	c.split(';').forEach(element =>{
		if(element != ''){
			let a = element.split('=')
			let b = []
			a.forEach(element =>{
				b.push(parseInt(element))
			})
			result.push(b)
		}
	})
	return result
}

// creat graphique with a array [[1,1],[2,2]]
function ggraf(data,canvasid,color){
	const xdata = data
	let graf = data

	let canvas = document.getElementById(canvasid)
	if(canvas.getContext){
		canvas.width = 1920;
		canvas.height = 1080;
		let ctx = canvas.getContext('2d');
		let ymin = graf[0][1]
		let xmin = graf[0][0]
		let ymax = graf[0][1]
		let xmax = graf[0][0]
		let n = 0
		graf.forEach(element =>{
			if(element[1] < ymin){
				ymin = element[1]
			}
			if(element[0] < xmin){
				xmin = element[0]
			}
			if(element[1] > ymax){
				ymax = element[1]
			}
			if(element[0] > xmax){
				xmax = element[0]
			}
			n++
		})
		ymax += 1
		ymin -= 5
		n = 0
		graf.forEach(element =>{
			graf[n][1] = graf[n][1]-ymin
			graf[n][0] = (graf[n][0]-xmin)*canvas.width/(xmax-xmin)
			graf[n][1] = (graf[n][1])*canvas.height/ymax
			graf[n][1] = graf[n][1] - (graf[n][1]*2) + canvas.height
			n++
		})
		//graphique génération
		for(n = 0;n < graf.length; n++){
			ctx.beginPath()
			ctx.arc(graf[n][0],graf[n][1], 10, 0, 2 * Math.PI)
			ctx.fillStyle = color
			ctx.fill()

			if(graf[n+1]){
				ctx.beginPath()
				ctx.lineWidth = 10
				ctx.moveTo(graf[n][0],graf[n][1])
				ctx.lineTo(graf[n+1][0],graf[n+1][1])
				ctx.strokeStyle = color
				ctx.stroke()
			}
		}
	}else{
		console.log('pb')
	}
}

// show msg
var flamebousteur_lib_msgs = []
var flamebousteur_lib_msg_on = true

function msg(txt,time){
	if(!document.getElementById("flamebousteur_lib_msg")){
		document.body.innerHTML = '<div id="flamebousteur_lib_msg">msg</div>'+document.body.innerHTML
	}
	if(typeof time != 'undefined'){
		time = time * 1000
	}else{
		time = 1000
	}
	flamebousteur_lib_msgs.push([txt,time])
	function msgb(){
		flamebousteur_lib_msg_on = false
		let msg = document.getElementById("flamebousteur_lib_msg")
		msg.style.opacity = "1";
		msg.innerHTML = flamebousteur_lib_msgs[0][0]
		window.setTimeout(msgp, flamebousteur_lib_msgs[0][1]);
		function msgp(){
			msg.style.opacity = "0";
			window.setTimeout(function() {
				flamebousteur_lib_msg_on = true;
				if(flamebousteur_lib_msgs[0]){
					msgb(flamebousteur_lib_msgs)
				}
			},1000)
			msg.innerHTML = ''
		}
		flamebousteur_lib_msgs.shift()
	}
	if(flamebousteur_lib_msg_on){
		msgb()
	}
}

//change url
function murl(url){
	history.pushState("", "", url)
}

//xhr
function send(msgs){
	let xhr = new XMLHttpRequest();
	xhr.open('POST', '/' , true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send('token='+parseInt(window.localStorage.getItem('token'))+'&'+msgs);
	xhr.onreadystatechange = function(){
		if (xhr.readyState==4 && xhr.status==200){
			let json = JSON.parse(xhr.responseText)
			if(json['statue'] == 'ERROR'){
				if(json['reason']){
					console.log(json['reason'])
					msg(json['reason'])
				}
			}
			if(json['token']){
				rep = json['token']+parseInt(window.localStorage.getItem('token'))
				window.localStorage.setItem('token',rep)
			}
		}
	}
}

// php $_GET
function $_GET(param){
	var vars = {};
	window.location.href.replace( location.hash,'').replace(
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);
	if(param){
		return vars[param] ? vars[param] : null;
	}
	return vars;
}
var $_GET = $_GET()

if($_GET['token']){
	window.localStorage.clear
	window.localStorage.setItem('token',$_GET['token'])
	console.log($_GET['token'])
}

murl('/')

//creat the page
document.body.innerHTML += '<a onclick="send(\'exe=1\')">exe</a>'+
'<br><a href="/new">creat new qr code</a><br><button id="update_graf_button">update graf</button> | repet<input type="checkbox" id="rep">'+
'<meta name="viewport" content="width=device-width, initial-scale=1.0">'+
'<style>'+
'#canvas1{position:absolute;left:0;top:75;width:200px;height:150px;background-color:white;border:1px solid black;}'+
'#canvas2{left:0;top:225;position:absolute;width:200px;height:150px;background-color:white;border:1px solid black;}'+
'#canvas3{left:200px;top:75;position:absolute;width:400px;height:300px;background-color:white;border:1px solid black;}'+
'</style>'+
'<div><canvas id="canvas1"></canvas>'+
'<canvas id="canvas2"></canvas>'+
'<canvas id="canvas3"></canvas></div>';

// graphique update
var update_graf_button = document.getElementById('update_graf_button')
update_graf_button.onclick = function(){
	gcgg();
	update_graf_button.disabled = true;
	window.setTimeout(function(){
		document.getElementById('update_graf_button').disabled = false
	},5000)
}
var repet = false

function gcgg(){
	let xhr = new XMLHttpRequest();
	xhr.open('GET', '/?m=graf_read' , true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send();
	xhr.onreadystatechange = function(){
		if (xhr.readyState==4 && xhr.status==200){
			json = JSON.parse(xhr.responseText)
			ggraf(converter(json['graf']['1']),'canvas1',"#5dade2")
			ggraf(converter(json['graf']['2']),'canvas2',"#e12222")
			ggraf(converter(json['graf']['3']),'canvas3',"#2ee122")
		}
	}
	if(repet){
		setTimeout(function(){if(repet){gcgg()}},5000);
	}
}
gcgg()

var overall = document.getElementById('rep');
overall.addEventListener('click', function(e){
	repet = overall.checked;
	if(repet){
		gcgg()
	}
});