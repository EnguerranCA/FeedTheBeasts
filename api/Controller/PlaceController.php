<?php

require_once "Controller.php";
require_once "Repository/PlaceRepositery.php";

class PlaceController extends Controller{

    private PlaceRepositery $place;

    public function __construct() {
        $this->place = new PlaceRepositery();
    }

    protected function processGetRequest(HttpRequest $request){
        $param = $request->getParam("param");
        if($param=="random"){
            return $this->place->findRandomPlace();
        }
}}

?>