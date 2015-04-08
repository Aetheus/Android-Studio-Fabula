package com.aedrianheng.utils.web;

import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Created by Adrian on 9/4/2015.
 */
public class ScraperWebViewClient extends WebViewClient{

    private String bookmarklet;
    private String jquery;

    public ScraperWebViewClient(String jquery, String bookmarklet){
        super();
        this.bookmarklet=bookmarklet;
    }


    @Override
    public void onPageFinished(WebView view, String url) {
        //super.onPageFinished(view, url);
        //view.loadUrl("javascript:" + jquery);
        view.loadUrl("javascript:" + bookmarklet);
    }
}
