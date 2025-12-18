<?php

require_once "Repository/EntityRepository.php";
require_once "Class/User.php";


class UserRepositery extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    public function findTop10(){
        $sql = $this->cnx->prepare("SELECT * FROM `User`
        ORDER BY `score` DESC
        LIMIT 10;");
        $sql->execute();
        $answer = $sql->fetchAll(PDO::FETCH_OBJ);
        return $answer;
    }

    public function addUser($username, $score){
        $sql = $this->cnx->prepare("INSERT INTO `User` (`username`, `score`) VALUES (:username, :score);");
        $sql->bindParam(":username", $username);
        $sql->bindParam(":score", $score);
        $sql->execute();
        return $sql;
    }

    public function find($empty){

    }

    public function findAll(){

    }
    public function save($empty){

    }

    public function delete($empty){

    }
    public function update($empty){

    }
}

?>