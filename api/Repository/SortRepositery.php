<?php

require_once "Repository/EntityRepository.php";
require_once "Class/Sort.php";


class SortRepositery extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    public function findOneByDifficulty($difficulty){
        $sql = $this->cnx->prepare("SELECT * FROM `SortItOut`
WHERE `difficulty` = :difficulty
ORDER BY RAND()
LIMIT 1;");
        $sql->bindParam(":difficulty", $difficulty);
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