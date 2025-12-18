<?php

class MCQ implements JsonSerializable {
   
    private $id;
    private $question;
    private $reponse1;
    private $reponse2;
    private $reponse3;
    private $reponse4;
    private $difficulty;

    public function __construct($id) {
        $this->id = $id;
    }

    public function getId() {
        return $this->id;
    }

    public function jsonSerialize(): mixed {
        return [
            'id' => $this->id,
            "question" => $this->question,
            "reponse1" => $this->reponse1,
            "reponse2" => $this->reponse2,
            "reponse3" => $this->reponse3,
            "reponse4" => $this->reponse4,
            "difficulty" => $this->difficulty
        ];
    }
    public function getquestion(){
        return $this->question;
    }

    public function getreponse1(){
        return $this->reponse1;
    }

    public function getreponse2(){
        return $this->reponse2;
    }

    public function getreponse3(){
        return $this->reponse3;
    }

    public function getreponse4(){
        return $this->reponse4;
    }

    public function getdifficulty(){
        return $this->difficulty;
    }
}