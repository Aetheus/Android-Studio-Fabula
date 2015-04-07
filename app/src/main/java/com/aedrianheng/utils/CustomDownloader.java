package com.aedrianheng.utils;

import android.app.Activity;

import java.util.List;

/**
 * Created by aedrian on 07-Apr-15.
 */
public class CustomDownloader {

    List<CustomListener> listenerList;
    String textToPassToListener;
    Activity parentActivity;
    int ViewID;

    //first listener should be downloadListener
    public CustomDownloader(String url, List<CustomListener> clist, Activity parentActivity){
        this.listenerList = clist;
        this.ViewID = ViewID;
        this.parentActivity = parentActivity;
    }


    //dummy function
    public void downloadFile(){
        //do some downloady thingy. then set textToPasstoListener to the returned json object
        textToPassToListener = "Bob";

        for (CustomListener clitem : listenerList){
            clitem.callbackMethod();
        }
    }

}
