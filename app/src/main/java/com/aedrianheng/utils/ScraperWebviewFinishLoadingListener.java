package com.aedrianheng.utils;

import com.adrianheng.fabulav4.ScraperActivity;

/**
 * Created by Adrian on 10/4/2015.
 */
public class ScraperWebviewFinishLoadingListener implements CustomListener {

    ScraperActivity sactivity;

    public ScraperWebviewFinishLoadingListener(ScraperActivity sactivity){
        this.sactivity = sactivity;
    }

    @Override
    public String listenerType() {
        return "ScrapperWebviewFinishLoadingListener";
    }

    @Override
    public void callbackMethod(Object... o) {
        sactivity.toggleIsWebviewLoading(false);
    }
}
