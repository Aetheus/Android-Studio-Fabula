package com.aedrianheng.utils;

/**
 * Created by aedrian on 07-Apr-15.
 */
import android.app.Activity;
import android.util.Log;
import android.widget.EditText;
import android.widget.TextView;

import java.lang.reflect.Type;


public class SetTextViewListener implements CustomListener {
    public final String TAG = "SetTextViewListener";

    private String text;
    private TextView view;
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
        this.view = (TextView) parentActivity.findViewById(ViewID);
    }

    //set the text
    public void setText(String text){
        this.text = text;
    }

    /*public void setView(int ID){
        this.view = (EditText) parentActivity.findViewById(ID);
    }

    public void setParentActivity(Activity parentActivity){
        this.parentActivity = parentActivity;
    }*/


    //overrides interface
    public void callbackMethod(Object... o){
        //we're only expecting one, so only take the "first"
        //text = o[0].toString();
        //view.setText(text);
        //Log.i(TAG,"callback was invoked");
    }


}