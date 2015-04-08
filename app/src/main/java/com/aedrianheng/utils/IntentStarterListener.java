package com.aedrianheng.utils;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

/**
 * Created by Adrian on 8/4/2015.
 */
public class IntentStarterListener implements CustomListener {
    Intent intent;
    Activity parentActivity;

    public final String TAG = "IntentStarterListener";

    public IntentStarterListener(Activity parentActivity, Intent intent){
        this.intent = intent;
        this.parentActivity = parentActivity;
    }

    @Override
    public String listenerType() {
        return "IntentStarterListener";
    }

    @Override
    public void callbackMethod(Object... o) {
        Log.i(TAG,"Attempting to start new activity.");
        parentActivity.startActivity(intent);

    }
}
