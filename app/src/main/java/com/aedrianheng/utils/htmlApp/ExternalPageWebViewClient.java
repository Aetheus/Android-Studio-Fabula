package com.aedrianheng.utils.htmlApp;

import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Created by Adrian on 2/6/2015.
 */
public class ExternalPageWebViewClient extends WebViewClient {
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        //returning false so that the app doesn't try to open external browser
        return false;
    }
}
