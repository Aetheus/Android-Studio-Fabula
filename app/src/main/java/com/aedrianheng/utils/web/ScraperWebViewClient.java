package com.aedrianheng.utils.web;

import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.aedrianheng.utils.CustomListener;

import java.util.LinkedList;
import java.util.List;

/**
 * Created by Adrian on 9/4/2015.
 */
public class ScraperWebViewClient extends WebViewClient{

    private String bookmarklet;
    private List<CustomListener> listenerList = new LinkedList<CustomListener>();

    public ScraperWebViewClient(String bookmarklet, CustomListener clitem){
        super();
        this.bookmarklet=bookmarklet;
        this.listenerList.add(clitem);
    }

    public void addListener(CustomListener clitem){
        listenerList.add(clitem);
    }

    @Override
    public void onPageFinished(WebView view, String url) {
        //super.onPageFinished(view, url);
        //view.loadUrl("javascript:" + jquery);
        view.loadUrl("javascript:" + bookmarklet);

        for(CustomListener clitem : listenerList){
            clitem.callbackMethod();
        }
    }
}
