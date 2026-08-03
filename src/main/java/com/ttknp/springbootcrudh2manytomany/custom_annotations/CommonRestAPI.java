package com.ttknp.springbootcrudh2manytomany.custom_annotations;

import org.springframework.core.annotation.AliasFor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// *** my custom annotation
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@RestController
@RequestMapping
public @interface CommonRestAPI {
    @AliasFor(annotation = RequestMapping.class,attribute = "path") // have to specify alias for annotation because value more than one annotation
    String[] configPath() default {""};
}