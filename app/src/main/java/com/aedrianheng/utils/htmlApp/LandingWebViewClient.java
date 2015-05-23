package com.aedrianheng.utils.htmlApp;

import android.util.Log;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

/**
 * Created by Adrian on 12/4/2015.
 */
public class LandingWebViewClient extends WebViewClient{

    private final String tag = "LandingWebViewClient";

    String username;
    String password;
    String globalSettingsJSON;

    int numOfPageLoads = 0;

    //these 2 are for specific tasks to be carried out if the  Activity that called this webview was launched via our notification
    String lastCheckTime;
    boolean isFromNotification = false;

    public LandingWebViewClient(String username, String password, String globalSettingsJSON){
        super();
        this.username = username;
        this.password = password;
        this.globalSettingsJSON = globalSettingsJSON;
    }

    public LandingWebViewClient(String username, String password, String globalSettingsJSON, String lastCheckTime, boolean isFromNotification){
        super();
        this.username = username;
        this.password = password;
        this.globalSettingsJSON = globalSettingsJSON;

        this.lastCheckTime = lastCheckTime;
        this.isFromNotification = isFromNotification;
    }


    @Override
    public void onPageFinished(WebView view, String url){
        //run this only ONCE
        if(numOfPageLoads == 0){
            view.loadUrl("javascript: var FabulaSysUsername = '" + username + "'");
            view.loadUrl("javascript: var FabulaSysPassword = '" + password + "'");

            if (globalSettingsJSON != null){
                view.loadUrl("javascript: globalSettings = JSON.parse('" + globalSettingsJSON + "')");
            }

            Log.i(tag, "isFromNotification flag is " + isFromNotification);
            if(isFromNotification){
                //get the currenttime as an ISO time string
                Date timeNow = new Date();
                TimeZone timeZone= TimeZone.getTimeZone("UTC");
                DateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'");
                dateFormat.setTimeZone(timeZone);
                String nowTimeString = dateFormat.format(timeNow);

                String notificationFilter;

                if(lastCheckTime != null){
                    notificationFilter = "{start: '" + lastCheckTime + "', end: '"+ nowTimeString + "'}";
                    Log.i(tag, "notificationFilter is " + notificationFilter);
                }else{
                    notificationFilter = null;
                }

                view.loadUrl("javascript: isPendingFromNotification = true");
                view.loadUrl("javascript: notificationFilter = " + notificationFilter);
            }


            //TRIGGER THE NEWS ROUTE
            //$('a[href=#AllNews]').trigger('click');
            view.loadUrl("javascript: $('a[href=#AllNews]').trigger('click')");
        }

        numOfPageLoads++;
    }
}
