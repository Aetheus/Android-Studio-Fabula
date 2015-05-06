package com.aedrianheng.utils;

import android.content.Context;
import android.content.SharedPreferences;

import com.adrianheng.fabulav4.R;

/**
 * Created by Adrian on 6/5/2015.
 */
public class SaveAccountLoginListener implements CustomListener{
    public final String TAG = "SaveAccountLoginListener";

    Context context;
    SharedPreferences sharedPref;

    String username;
    String password;

    public SaveAccountLoginListener(Context thisContext, String username, String password){
        this.context = thisContext;
        this.sharedPref = thisContext.getSharedPreferences(thisContext.getString(R.string.preference_file_key), Context.MODE_PRIVATE);
        this.username = username;
        this.password = password;
    }

    @Override
    public String listenerType() {
        return "SaveAccountLoginListener";
    }

    @Override
    public void callbackMethod(Object... o){
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.putString("username",this.username);
        editor.putString("password",this.password);
        editor.commit();
    }
}
