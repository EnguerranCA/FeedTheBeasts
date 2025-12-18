<?php
require_once "Class/HttpRequest.php";
require_once "Controller/MCQController.php";
require_once "Controller/SortController.php";
require_once "Controller/UserController.php";
require_once "Controller/PlaceController.php";

//https://.../api/MCQ?difficulty=easy; https://.../api/MCQ?difficulty=medium; https://.../api/MCQ?difficulty=hard
//https://.../api/MCQ?category=trivia; https://.../api/MCQ?category=english;
//api/MCQ?difficulty=easy&category=trivia;

//https://.../api/sort?difficulty=easy; https://.../api/sort?difficulty=medium; https://.../api/sort?difficulty=hard

//https://.../api/user?param=top10  https://.../api/user?param=addUser&username=John&score=666

//https://.../api/place?param=random 

$router = [
    "MCQ" => new MCQController(),
    "sort" => new SortController(),
    "user" => new UserController(),
    "place" => new PlaceController()
];

// objet HttpRequest qui contient toutes les infos utiles sur la requêtes (voir class/HttpRequest.php)
$request = new HttpRequest();

// gestion des requêtes preflight (method OPTIONS)
if ($request->getMethod() == "OPTIONS"){
    http_response_code(200);
    die();
}

// on récupère la ressource ciblée par la requête
$route = $request->getRessources();

if ( isset($router[$route]) ){ // si on a un controleur pour cette ressource
    $ctrl = $router[$route];  // on le récupère
    $json = $ctrl->jsonResponse($request); // et on invoque jsonResponse pour obtenir la réponse (json) à la requête (voir class/Controller.php et ProductController.php)
    if ($json){ 
        header("Content-type: application/json;charset=utf-8");
        echo $json;
    }
    else{
        http_response_code(404); // en cas de problème pour produire la réponse, on retourne un 404
    }
    die();
}
http_response_code(404); // si on a pas de controlleur pour traiter la requête -> 404
die();

?>