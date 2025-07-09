package com.ttknp.springbootcrudh2manytomany.exception;


public class ContentNotAllowed extends RuntimeException {

    public ContentNotAllowed(Exception exception) {
        super(exception.getMessage(), exception);
    }


}