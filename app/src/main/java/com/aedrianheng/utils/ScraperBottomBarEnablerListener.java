package com.aedrianheng.utils;

import com.adrianheng.fabulav4.ScraperActivity;

/**
 * Created by Adrian on 10/4/2015.
 */
public class ScraperBottomBarEnablerListener implements CustomListener{

    ScraperActivity sactivity;

    public ScraperBottomBarEnablerListener(ScraperActivity sactivity){
        this.sactivity = sactivity;
    }

    @Override
    public String listenerType() {
        return "ScrapperBottomBarToggleListener";
    }

    @Override
    public void callbackMethod(Object... o) {
        sactivity.toggleBottomBar(true);
    }
}
