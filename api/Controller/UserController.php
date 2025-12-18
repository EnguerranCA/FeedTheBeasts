<?php

require_once "Controller.php";
require_once "Repository/UserRepositery.php";

class UserController extends Controller{

    private UserRepositery $User;

    public function __construct() {
        $this->User = new UserRepositery();
    }

    protected function processGetRequest(HttpRequest $request){
        $param = $request->getParam("param");
        if($param=="top10"){
            return $this->User->findTop10();
        }
        elseif ($param == "addUser") {
            $username = $request->getParam("username");
            $score = $request->getParam("score");
            return $this->User->addUser($username, $score);
        }
}}

?>