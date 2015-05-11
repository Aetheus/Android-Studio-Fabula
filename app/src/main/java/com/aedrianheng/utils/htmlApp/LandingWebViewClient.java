package com.aedrianheng.utils.htmlApp;

import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Created by Adrian on 12/4/2015.
 */
public class LandingWebViewClient extends WebViewClient{

    String username;
    String password;
    String globalSettingsJSON;

    public LandingWebViewClient(String username, String password, String globalSettingsJSON){
        super();
        this.username = username;
        this.password = password;
        this.globalSettingsJSON = globalSettingsJSON;
    }


    @Override
    public void onPageFinished(WebView view, String url){
        view.loadUrl("javascript: var FabulaSysUsername = '" + username + "'");
        view.loadUrl("javascript: var FabulaSysPassword = '" + password + "'");

        if (globalSettingsJSON != null){
            view.loadUrl("javascript: globalSettings = JSON.parse('" + globalSettingsJSON + "')");
        }
    }
}
