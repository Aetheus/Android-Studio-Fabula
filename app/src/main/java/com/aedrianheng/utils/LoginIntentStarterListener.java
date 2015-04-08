package com.aedrianheng.utils;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Adrian on 8/4/2015.
 */
public class LoginIntentStarterListener extends IntentStarterListener {

    private final String TAG = "LoginIntentStarterListe";

    public LoginIntentStarterListener(Activity parentActivity, Intent intent){
        super(parentActivity, intent);
    }


    //expects a single string that can be converted to JSON (i.e: a result from CustomWebRequest)
    //expects the converted JSON object to contain an "isMember" value.
    @Override
    public void callbackMethod(Object... o){

        String expectedObject = (String) o[0];
        JSONObject jsonObject = null;
        Boolean isLogin = false;






        try{
            jsonObject = new JSONObject(expectedObject);
            String isMember = jsonObject.getString("isMember");
            isLogin = Boolean.parseBoolean(isMember);
        }catch (JSONException e){
            e.printStackTrace();
            Log.e(TAG, "Could not parse the 1st provided object to JSON");
        }

        if(isLogin){
            Log.i(TAG, "isMember value was true. Calling superclass callback method");
            Toast aToast = Toast.makeText(parentActivity.getApplicationContext(),"Login successful",Toast.LENGTH_SHORT);
            aToast.show();
            super.callbackMethod(o);
            parentActivity.finish();
        }else{
            Log.i(TAG, "isMember value was false. Ignoring request.");
            Toast aToast = Toast.makeText(parentActivity.getApplicationContext(),"Invalid login",Toast.LENGTH_SHORT);
            aToast.show();
        }

    }

}
