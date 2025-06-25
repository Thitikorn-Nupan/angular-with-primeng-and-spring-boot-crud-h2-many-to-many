package com.ttknp.springbootcrudh2manytomany.controllers;


import com.ttknp.springbootcrudh2manytomany.custom_annotations.CommonRestAPI;
import com.ttknp.springbootcrudh2manytomany.dto.ActorDTO;
import com.ttknp.springbootcrudh2manytomany.entities.Actor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@CommonRestAPI(configPath = {"/actor","/actors"})
public class ActorController {

    private final ActorDTO actorDTO;

    @Autowired
    public ActorController(ActorDTO actorDTO) {
        this.actorDTO = actorDTO;
    }

    // ** The name can be referenced in SpEL expressions, for example, when building links or performing conditional logic based on the mapping name. These names provide a descriptive identifier for each mapping.
    @GetMapping(value = "/server",name = "testActorEndpoint")
    public ResponseEntity<String> testActorEndpoint() {
        return ResponseEntity.ok("Hello World");
    }

    @GetMapping(value = "/selectAll")
    protected ResponseEntity<List<Actor>> selectAll() {
        return ResponseEntity.ok(actorDTO.findAll());
    }

    // *** select actors that is not in movie id (in actor service)
    // ex, selectAllNotInWhere?uniqSubValue=M003
    @GetMapping(value = "/selectAllNotInWhere",params = "uniqSubValue")
    protected ResponseEntity<List<Actor>> selectAllNotInWhere(String uniqSubValue) {
        return ResponseEntity.ok(actorDTO.findAllNotInWhere(uniqSubValue));
    }

    // ex, selectAllOnlyColumn?name=born
    @GetMapping(value = "/selectAllOnlyColumn",params = "name") // if you don't need to use @RequestParam you can set params name on @GetMapping instead
    protected ResponseEntity<List<Actor>> selectAllOnlyColumn(String name) {
        return ResponseEntity.ok(actorDTO.findAllOnlyColumn(name));
    }

    // ex, selectOneByPk?aid=A001
    @GetMapping(value = "/selectOneByPk",params = "aid")
    protected ResponseEntity<Actor> selectOneByPk(String aid) {
        return ResponseEntity.ok(actorDTO.findOneByPk(aid));
    }

    @GetMapping(value = "/selectOneIncludeRelationByPk",params = "aid")
    protected ResponseEntity<Actor> selectOneIncludeRelationByPk(String aid) {
        return ResponseEntity.ok(actorDTO.findOneIncludeRelation(aid));
    }


    @PostMapping(value = "/saveOne")
    protected ResponseEntity<Boolean> saveOne(@RequestBody Actor actor) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(actorDTO.saveModel(actor) > 0);
    }

    @PutMapping(value = "/editOne")
    protected ResponseEntity<Boolean> editOne(@RequestBody Actor actor) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(actorDTO.editModelByPk(actor) > 0);
    }


    @DeleteMapping(value = "/deleteOneByPk",params = "aid")
    protected ResponseEntity<Boolean> deleteOneByPk(String aid) {
        return ResponseEntity.ok(actorDTO.removeModelByPk(aid) > 0);
    }

}
