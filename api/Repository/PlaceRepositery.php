<?php

require_once "Repository/EntityRepository.php";
require_once "Class/Place.php";


class PlaceRepositery extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    public function findRandomPlace(){
        $sql = $this->cnx->prepare("SELECT * FROM `FindThePlace`
ORDER BY RAND()
LIMIT 1;");
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