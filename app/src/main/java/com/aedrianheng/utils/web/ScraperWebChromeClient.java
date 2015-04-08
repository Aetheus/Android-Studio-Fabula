package com.aedrianheng.utils.web;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.util.Log;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

import com.adrianheng.fabulav4.R;

/**
 * Created by Adrian on 9/4/2015.
 */
public class ScraperWebChromeClient extends WebChromeClient {

    Context context;

    public ScraperWebChromeClient(Context context){
        super();
        this.context = context;
    }

    private static final String TAG = "ScraperWebChromeClient";


    @Override
    public boolean onJsAlert(WebView view, String url, String message, final android.webkit.JsResult result) {
        new AlertDialog.Builder(context)
                .setTitle("Alert")
                .setMessage(message)
                .setPositiveButton(android.R.string.ok,
                        new AlertDialog.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {
                                result.confirm();
                            }
                        }).setCancelable(false).create().show();

        return true;
    }

    @Override
    public boolean onJsConfirm(WebView view, String url, String message, final JsResult result) {
        new AlertDialog.Builder(context)
                .setTitle("Confirm")
                .setMessage(message)
                .setPositiveButton(android.R.string.ok,
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {
                                result.confirm();
                            }
                        }).setNegativeButton(android.R.string.cancel,
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        result.cancel();
                    }
                }).create().show();
        return true;
    }
}

