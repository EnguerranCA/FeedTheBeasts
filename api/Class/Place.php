<?php

class Place implements JsonSerializable {
   
    private $id;
    private $img;
    private $reponse1;
    private $reponse2;
    private $reponse3;
    private $reponse4;

    public function __construct($id) {
        $this->id = $id;
    }

    public function getId() {
        return $this->id;
    }

    public function jsonSerialize(): mixed {
        return [
            'id' => $this->id,
            "img" => $this->img,
            "reponse1" => $this->reponse1,
            "reponse2" => $this->reponse2,
            "reponse3" => $this->reponse3,
            "reponse4" => $this->reponse4,
        ];
    }
    public function getimg(){
        return $this->img;
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

}