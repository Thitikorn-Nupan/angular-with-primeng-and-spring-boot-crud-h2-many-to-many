package com.ttknp.springbootcrudh2manytomany.custom_annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.METHOD}) // target for using
public @interface IgnoreGenerateSQL {
}