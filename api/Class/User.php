<?php

class User implements JsonSerializable {
   
    private $id;
    private $username;
    private $score;

    public function __construct($id) {
        $this->id = $id;
    }

    public function getId() {
        return $this->id;
    }

    public function jsonSerialize(): mixed {
        return [
            'id' => $this->id,
            "username" => $this->username,
            "score" => $this->score
        ];
    }
    public function getusername(){
        return $this->username;
    }

    public function getscore(){
        return $this->score;
    }
    
    public function setUsername($username) {
        $this->username = $username;
    }

    public function setScore($score) {
        $this->score = $score;
    }
}