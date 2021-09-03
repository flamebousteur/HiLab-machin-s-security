<?php
// list of exetutable code
$comand = array('1' => array('$response["not-intresting"] = "hello world!";//<code to execute>'));

function getIp(){
	if(!empty($_SERVER['HTTP_CLIENT_IP'])){
		$ip = $_SERVER['HTTP_CLIENT_IP'];
	}elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
		$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
	}else{
		$ip = $_SERVER['REMOTE_ADDR'];
	}
	return $ip;
}

// creat the json respons
$response = json_decode('{}',true);
$response['statue'] = 'no information';
$response['requeste'] = 'no requeste';

if(file_exists('./ips.json')){
	$ips = json_decode(file_get_contents('./ips.json'), true);
}else{
	fprintf(fopen('./ips.json','w'),'[]');
	$ips = Array();
}


if(file_exists('./tokens.json')){
	$tokens = json_decode(file_get_contents('./tokens.json'), true);
}else{
	fprintf(fopen('./tokens.json','w'),'[]');
	$tokens = array();
}
if(array_key_exists('token', $_POST)){
	//chec if the token if in the list
	$token = intval($_POST["token"]);
	if(in_array($token,$tokens)){
		//chec if the client-ip is in the list
		if(in_array(getIp(),$ips)){
			//creat a new token
			$new_token = rand(1,50000);
			$tokens[array_search($token,$tokens)] = $new_token+$token;
			$response['token']=$new_token;
			fprintf(fopen('./tokens.json','w'),json_encode($tokens));
			//chec if ther is a order
			if(array_key_exists('exe', $_POST)){
				$response['requeste'] = $_POST['exe'];
				if(array_key_exists($_POST['exe'],$comand)){
					//execute the order
					eval($comand[$_POST['exe']][0]);
					$response['statue']='sucesse';
				}else{
					$response['statue']='ERROR';
					$response['reason']='requeste not valide';
				}
			}
		}else{
			$response['statue']='ERROR';
			$response['reason']='client ip not valide';
		}
	}else{
		$response['statue']='ERROR';
		$response['reason']='token not valide';
	}
	echo json_encode($response);
}else if(array_key_exists('m',$_GET)){
	//graphique_view
	if($_GET['m']='graf_read'){
		$response['graf'] = array('1'=>file_get_contents('./graf/1'),'2'=>file_get_contents('./graf/2'),'3'=>file_get_contents('./graf/3'));
		$response['requeste'] = 'graphique_view';
	}
		$response['statue'] = 'sucesse';
	echo json_encode($response);
}else{
	//new creat the token
	if($_SERVER['REQUEST_URI']=='/new'){
		$code = rand(1,50000);
		array_unshift($tokens,$code);
		echo "<a href='../?token=".$code."'>(qr code)</a>";
		fprintf(fopen('./tokens.json','w'),json_encode($tokens));
	}else{
		echo '<body></body><script src="./script.js"></script>';
	}
}
if(array_key_exists('token',$_GET)){
	// register the ip
	if(in_array($_GET['token'],$tokens)){
		array_unshift($ips,getIp());
		fprintf(fopen('./ips.json','w'),json_encode($ips));
	}
}
?>