package com.adrianheng.fabulav4;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.aedrianheng.utils.MyIOUtil;
import com.aedrianheng.utils.web.ScraperWebChromeClient;
import com.aedrianheng.utils.web.ScraperWebViewClient;

import java.io.IOException;
import java.io.InputStream;


public class ScraperActivity extends ActionBarActivity {

    private static final String TAG ="ScraperActivity";

    private WebView webview;
    private String bookmarklet;
    private String jquery;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scraper);

        try{
            InputStream is = getAssets().open("bookmarklet/bmk.js");
            bookmarklet = MyIOUtil.convertStreamToString(is,"UTF-8");

            Log.i(TAG,"Imported bookmarklet from assets folder");
        }catch (IOException e){
            e.printStackTrace();
        }


        webview = (WebView) findViewById(R.id.webView);
        webview.getSettings().setJavaScriptEnabled(true);
        webview.getSettings().setBuiltInZoomControls(true);

        webview.setWebChromeClient(new ScraperWebChromeClient(this));
        webview.setWebViewClient(new ScraperWebViewClient(bookmarklet));

        webview.loadUrl("http://webspace.apiit.edu.my/");
        //setWebviewWide();
    }

    private void setWebviewWide(){
        webview.getSettings().setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NORMAL);
        //webview.getSettings().setLoadWithOverviewMode(true);
        webview.getSettings().setUseWideViewPort(true);
        //webview.getSettings().setJavaScriptEnabled(true);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_scraper, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
