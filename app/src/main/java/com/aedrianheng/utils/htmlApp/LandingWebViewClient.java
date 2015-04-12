package com.aedrianheng.utils.htmlApp;

import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Created by Adrian on 12/4/2015.
 */
public class LandingWebViewClient extends WebViewClient{

    String username;
    String password;

    public LandingWebViewClient(String username, String password){
        super();
        this.username = username;
        this.password = password;
    }


    @Override
    public void onPageFinished(WebView view, String url){
        view.loadUrl("javascript: var FabulaSysUsername = '" + username + "'");
        view.loadUrl("javascript: var FabulaSysPassword = '" + password + "'");
    }
}
