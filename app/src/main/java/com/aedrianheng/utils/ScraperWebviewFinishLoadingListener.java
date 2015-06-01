package com.aedrianheng.utils;

import android.util.Log;
import android.widget.LinearLayout;

import com.adrianheng.fabulav4.R;
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

        try{
            LinearLayout loaderLayout = (LinearLayout) sactivity.findViewById(R.id.loaderLayout);
            loaderLayout.setVisibility(LinearLayout.GONE);
        }catch(Exception e){
            Log.e(listenerType(),"Error occured while trying to hide loader layout");
        }
    }
}
