<?php

require_once "Controller.php";
require_once "Repository/SortRepositery.php";

class SortController extends Controller{

    private SortRepositery $Sort;

    public function __construct() {
        $this->Sort = new SortRepositery();
    }

    protected function processGetRequest(HttpRequest $request){
        $param = $request->getParam("difficulty");
        if($param){
            return $this->Sort->findOneByDifficulty($param);
        }
}}

?>