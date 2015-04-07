package com.aedrianheng.utils;

/**
 * Created by aedrian on 07-Apr-15.
 */
import android.app.Activity;
import android.widget.EditText;


public class SetTextViewListener implements CustomListener {
    private String text;
    private EditText view;
    private Activity parentActivity;

    //overrides interface
    public String listenerType(){
        return "SetTextViewListener";
    }

    public SetTextViewListener(){

    }

    public SetTextViewListener(Activity parentActivity, String text, int ViewID){
        this.text = text;
        this.parentActivity = parentActivity;
        this.view = (EditText) parentActivity.findViewById(ViewID);
    }

    //set the text
    /*public void setText(String text){
        this.text = text;
    }*/

    /*public void setView(int ID){
        this.view = (EditText) parentActivity.findViewById(ID);
    }

    public void setParentActivity(Activity parentActivity){
        this.parentActivity = parentActivity;
    }*/


    //overrides interface
    public void callbackMethod(){
        view.setText(text);
    }


}