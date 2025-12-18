<?php

require_once "Controller.php";
require_once "Repository/MCQRepositery.php";

class MCQController extends Controller{

    private MCQRepositery $MCQ;

    public function __construct() {
        $this->MCQ = new MCQRepositery();
    }

    protected function processGetRequest(HttpRequest $request){
        $difficulty = $request->getParam("difficulty");
        $category = $request->getParam("category");

        if($difficulty && $category){
            return $this->MCQ->findOneByDifficultyAndCategory($difficulty, $category);
        } elseif ($difficulty) {
            return $this->MCQ->findOneByDifficulty($difficulty);
        } elseif ($category) {
            return $this->MCQ->findOneByCategory($category);
        }
}}

?>