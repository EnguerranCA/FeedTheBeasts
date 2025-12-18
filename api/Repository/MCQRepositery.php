<?php

require_once "Repository/EntityRepository.php";
require_once "Class/MCQ.php";


class MCQRepositery extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    public function findOneByDifficulty($difficulty){
        $sql = $this->cnx->prepare("SELECT * FROM `MCQ`
WHERE `difficulty` = :difficulty
ORDER BY RAND()
LIMIT 1;");
        $sql->bindParam(":difficulty", $difficulty);
        $sql->execute();
        $answer = $sql->fetch(PDO::FETCH_OBJ);
        return $answer;
    }
    public function findOneByCategory($category){
        $sql = $this->cnx->prepare("SELECT * FROM `MCQ`
WHERE `category` = :category ORDER BY RAND() LIMIT 1" );
        $sql->bindParam(":category", $category);
        $sql->execute();
        $answer = $sql->fetch(PDO::FETCH_OBJ);
        return $answer;
    }
    public function findOneByDifficultyAndCategory($difficulty, $category){
        $sql = $this->cnx->prepare("SELECT * FROM `MCQ`
WHERE `difficulty` = :difficulty AND `category` = :category ORDER BY RAND() LIMIT 1" );
        $sql->bindParam(":difficulty", $difficulty);
        $sql->bindParam(":category", $category);
        $sql->execute();
        $answer = $sql->fetch(PDO::FETCH_OBJ);
        return $answer;
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